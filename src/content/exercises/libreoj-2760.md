---
id: libreoj-2760
volume: lower
source_file: lower-volume
title: LibreOJ 2760 裁剪線：動態平面區域
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['掃描線', 'FHQ Treap', '並查集', '平面區域']
prerequisites: ['區間分裂合併', '連通塊']
statement: 一張寬 W、高 H 的矩形紙上印有 N 條水平或垂直裁剪線。平行的兩條裁剪線不會共享任何點，裁剪線也不會與平行的紙邊重合。沿全部線裁開後，求紙被分成多少個部分。
constraints:
  - '1 <= W,H <= 10^9'
  - '1 <= N <= 100000'
  - 每條線段均平行於座標軸且長度為正
  - 平行裁剪線彼此不相交
input_format: 第一行 W、H、N。其後 N 行 A B C D，表示連接 (A,B) 與 (C,D) 的水平或垂直裁剪線。
output_format: 輸出一個整數，表示所有裁剪完成後的紙片數。
samples:
  - input: |
      10 10 5
      6 0 6 7
      0 6 7 6
      2 3 9 3
      2 3 2 10
      1 9 8 9
    output: |
      4
    explanation: 將紙邊也視為裁剪線，由左向右掃描並維護掃描線上各開放區間所屬紙片，最後共有四個區域。
core_knowledge:
  - 水平線端點使掃描截面新增或刪除一個分隔點
  - 垂直裁剪線會截斷其涵蓋的每個目前區間，各自形成新的右側區域
  - 水平線右端消失時，相鄰區間重新接通，若原屬不同區域就合併
judgment: 把上下左右紙邊加入事件。依 x 掃描；Treap 依 y 維護相鄰分隔點之間的區間，支援在水平線左端分裂、右端合併，以及對垂直線涵蓋的連續區間整段重新標記。區域標記用並查集，Treap 懶標記讓整段的各葉在真正下推時取得互異新編號。
hints:
  - 水平線開始時只把一個截面區間切成上下兩段，兩段此刻仍屬同一個左側區域。
  - 垂直線涵蓋 k 個截面區間時，答案先增加 k，且這 k 個區間右側應視為彼此獨立的新區域。
  - 水平線結束時合併相鄰 Treap 節點；若其區域代表不同，答案減一並在並查集中合併。
solution_outline: 以 (x,事件) 排序所有端點與垂直線，令同 x 時先水平線開始、再垂直線、最後水平線結束。FHQ Treap 節點表示相鄰活動水平線間的 y 區間。分裂區間沿用區域編號；垂直切割隔離 [bottom,top] 節點，答案加節點數並對子樹設「各節點重編號」懶標記；刪除分隔點時合併相鄰節點與區域。
proof_or_invariant: 每個掃描事件後，Treap 節點與掃描線未被水平裁剪線穿過的極大 y 區間一一對應，並查集編號相同當且僅當其左側屬同一紙片。水平起點只細分截面而不切斷左側連通性；垂直線把每個涵蓋區間與左側隔開，故各新增一片並取得獨立右側編號；水平終點讓上下區間在右側相通，恰在原編號不同時合併兩片。三種轉移都維持不變量，掃過右紙邊後答案即全部紙片數。
complexity:
  time: 期望 O(N log N)
  space: O(N log N) 個延遲產生的連通塊編號，Treap 節點 O(N)
common_errors:
  - 忘記加入矩形紙張四邊
  - 同 x 事件順序錯誤，漏算線段端點相交
  - 垂直線把整段設成同一連通塊；其涵蓋的每個截面區間應互異
  - 水平線結束合併區間時未同步合併區域編號
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：按 x 掃描，以可分裂 Treap 維護截面區間與區域連通性。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Node {
      int left = 0;
      int right = 0;
      int lower = 0;
      int upper = 0;
      int component = 0;
      int size = 1;
      uint32_t priority = 0;
      bool reset_lazy = false;
  };

  class SweepTreap {
    public:
      SweepTreap() : generator_(712367821U) {
          nodes_.push_back(Node{});
          dsu_.push_back(0);
          root_ = new_node(numeric_limits<int>::min(),
                           numeric_limits<int>::max(), new_component());
      }
      long long regions() const { return regions_; }

      void insert_point(int position) {
          int left = 0;
          int containing = 0;
          split_lower(root_, left, root_, position);
          split_upper(left, left, containing, position);
          const int right_interval =
              new_node(position, nodes_[static_cast<size_t>(containing)].upper,
                       nodes_[static_cast<size_t>(containing)].component);
          nodes_[static_cast<size_t>(containing)].upper = position;
          pull(containing);
          containing = merge(containing, right_interval);
          left = merge(left, containing);
          root_ = merge(left, root_);
      }

      void erase_point(int position) {
          int left = 0;
          int lower_interval = 0;
          int upper_interval = 0;
          split_lower(root_, left, root_, position);
          split_upper(left, left, lower_interval, position - 1);
          split_lower(root_, upper_interval, root_, position + 1);
          push(lower_interval);
          push(upper_interval);
          if (find(nodes_[static_cast<size_t>(lower_interval)].component) !=
              find(nodes_[static_cast<size_t>(upper_interval)].component)) {
              --regions_;
              unite(nodes_[static_cast<size_t>(lower_interval)].component,
                    nodes_[static_cast<size_t>(upper_interval)].component);
          }
          nodes_[static_cast<size_t>(lower_interval)].upper =
              nodes_[static_cast<size_t>(upper_interval)].upper;
          nodes_[static_cast<size_t>(lower_interval)].right = 0;
          pull(lower_interval);
          left = merge(left, lower_interval);
          root_ = merge(left, root_);
      }

      void insert_vertical(int lower, int upper) {
          int left = 0;
          int middle = 0;
          split_lower(root_, left, root_, lower);
          split_upper(root_, middle, root_, upper);
          if (middle != 0) {
              reset(middle);
              regions_ += nodes_[static_cast<size_t>(middle)].size;
          }
          middle = merge(middle, root_);
          root_ = merge(left, middle);
      }

    private:
      vector<Node> nodes_;
      vector<int> dsu_;
      mt19937 generator_;
      int root_ = 0;
      long long regions_ = 0;

      int new_component() {
          const int id = static_cast<int>(dsu_.size());
          dsu_.push_back(id);
          return id;
      }
      int find(int value) {
          int root = value;
          while (dsu_[static_cast<size_t>(root)] != root) {
              root = dsu_[static_cast<size_t>(root)];
          }
          while (value != root) {
              const int next = dsu_[static_cast<size_t>(value)];
              dsu_[static_cast<size_t>(value)] = root;
              value = next;
          }
          return root;
      }
      void unite(int first, int second) {
          first = find(first);
          second = find(second);
          if (first != second) {
              dsu_[static_cast<size_t>(second)] = first;
          }
      }
      int new_node(int lower, int upper, int component) {
          Node node;
          node.lower = lower;
          node.upper = upper;
          node.component = component;
          node.priority = static_cast<uint32_t>(generator_());
          nodes_.push_back(node);
          return static_cast<int>(nodes_.size()) - 1;
      }
      int size(int node) const {
          return node == 0 ? 0 : nodes_[static_cast<size_t>(node)].size;
      }
      void pull(int node) {
          if (node == 0) { return; }
          Node& current = nodes_[static_cast<size_t>(node)];
          current.size = 1 + size(current.left) + size(current.right);
      }
      void reset(int node) {
          if (node == 0) { return; }
          Node& current = nodes_[static_cast<size_t>(node)];
          current.component = new_component();
          current.reset_lazy = true;
      }
      void push(int node) {
          if (node == 0) { return; }
          Node& current = nodes_[static_cast<size_t>(node)];
          if (!current.reset_lazy) { return; }
          reset(current.left);
          reset(current.right);
          current.reset_lazy = false;
      }
      void split_lower(int node, int& left, int& right, int position) {
          if (node == 0) {
              left = right = 0;
              return;
          }
          push(node);
          Node& current = nodes_[static_cast<size_t>(node)];
          if (current.lower < position) {
              left = node;
              split_lower(current.right, current.right, right, position);
              pull(left);
          } else {
              right = node;
              split_lower(current.left, left, current.left, position);
              pull(right);
          }
      }
      void split_upper(int node, int& left, int& right, int position) {
          if (node == 0) {
              left = right = 0;
              return;
          }
          push(node);
          Node& current = nodes_[static_cast<size_t>(node)];
          if (current.upper <= position) {
              left = node;
              split_upper(current.right, current.right, right, position);
              pull(left);
          } else {
              right = node;
              split_upper(current.left, left, current.left, position);
              pull(right);
          }
      }
      int merge(int left, int right) {
          if (left == 0) { return right; }
          if (right == 0) { return left; }
          if (nodes_[static_cast<size_t>(left)].priority <
              nodes_[static_cast<size_t>(right)].priority) {
              push(left);
              nodes_[static_cast<size_t>(left)].right =
                  merge(nodes_[static_cast<size_t>(left)].right, right);
              pull(left);
              return left;
          }
          push(right);
          nodes_[static_cast<size_t>(right)].left =
              merge(left, nodes_[static_cast<size_t>(right)].left);
          pull(right);
          return right;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int width;
      int height;
      int line_count;
      cin >> width >> height >> line_count;
      constexpr int start_marker = numeric_limits<int>::min();
      constexpr int end_marker = numeric_limits<int>::max();
      map<int, vector<pair<int, int>>> events;
      const auto add_horizontal = [&](int y, int left, int right) {
          events[left].push_back({start_marker, y});
          events[right].push_back({end_marker, y});
      };
      const auto add_vertical = [&](int x, int lower, int upper) {
          events[x].push_back({lower, upper});
      };
      add_horizontal(0, 0, width);
      add_horizontal(height, 0, width);
      add_vertical(0, 0, height);
      add_vertical(width, 0, height);
      for (int i = 0; i < line_count; ++i) {
          int x1;
          int y1;
          int x2;
          int y2;
          cin >> x1 >> y1 >> x2 >> y2;
          if (x1 == x2) {
              add_vertical(x1, y1, y2);
          } else {
              add_horizontal(y1, x1, x2);
          }
      }
      SweepTreap sweep;
      for (auto& [x, list] : events) {
          (void)x;
          sort(list.begin(), list.end());
          for (const auto& [first, second] : list) {
              if (first == start_marker) {
                  sweep.insert_point(second);
              } else if (first == end_marker) {
                  sweep.erase_point(second);
              } else {
                  sweep.insert_vertical(first, second);
              }
          }
      }
      cout << sweep.regions() << '\n';
      return 0;
  }
external_url: https://loj.ac/p/2760
external_platform: LibreOJ
external_problem_id: '2760'
external_title: '「JOI 2014 Final」裁剪線'
external_relation: original
source_book_pages: [566]
source_pdf_pages: [196]
review_status: verified
---

LibreOJ 舊站目前對 `/p/2760` 回傳站內 Error；題號與標題已由 LibreOJ 歷史索引及公開提交確認，題面、限制與範例另依 JOI 官方 PDF、AtCoder JOI 2014 Final 與 OJ.uz 交叉核實。
