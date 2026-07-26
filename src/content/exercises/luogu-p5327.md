---
id: luogu-p5327
volume: upper
source_file: upper-volume
title: 洛谷 P5327 語言：樹上差分與線段樹合併
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 5
topics: ['樹上差分', '線段樹合併', 'LCA', '虛樹']
prerequisites: ['lca', 'dynamic-segment-tree']
statement: |-
  給定 n 個城市構成的樹。每次語言普及選擇一條路徑，路徑上的所有城市學會一種
  專屬通用語。若存在某種語言覆蓋城市 u 到 v 的整條路徑，兩城即可貿易。
  求可貿易的無序城市對數。
constraints:
  - 1 ≤ n,m ≤ 100000
  - 道路端點不同
  - 每次語言路徑端點均在 [1,n]
input_format: |-
  第一行 n、m；接下來 n-1 行為樹邊；再接下來 m 行為每種語言的路徑端點 s、t。
output_format: 輸出一行可貿易的無序城市對數。
samples:
  - input: |
      5 3
      1 2
      1 3
      3 4
      3 5
      3 4
      1 4
      2 5
    output: |
      8
    explanation: |-
      可貿易對為 (1,2)、(1,3)、(1,4)、(1,5)、(2,3)、(2,5)、(3,4)、(3,5)。
core_knowledge:
  - 對每個城市統計所有經過它的語言路徑聯集
  - 路徑端點集合的最小連通子樹長度
  - 樹上差分搭配動態線段樹合併
judgment: |-
  每個城市維護所有覆蓋該城市之語言的兩端點集合，求這些端點生成的連通子樹邊數；
  全部城市的邊數和除以二。
hints:
  - 固定城市 u，所有覆蓋 u 的語言路徑聯集必為一棵連通子樹。
  - 按 DFS 序排列端點後，最小連通子樹長度可由相鄰端點的 LCA 合併維護。
  - 要把一對端點加入整條 s-t 路徑上的資料結構，可對 s、t、lca 與 lca 的父親做樹上差分。
solution_outline: |-
  對每條語言路徑 (s,t)，在 s、t 各加入端點 s、t，在 lca(s,t) 與其父親各刪除
  端點 s、t。由下而上合併動態線段樹後，每個城市的樹中恰保留所有覆蓋它的路徑端點。
  線段樹依 DFS 序維護最左、最右端點與
  `Σdepth(point)-Σdepth(lca(相鄰點))`；再減首尾 LCA 深度即為生成子樹邊數。
proof_or_invariant: |-
  標準點差分 +s,+t,-lca,-parent(lca) 使一個端點標記的子樹和在且僅在 s-t
  路徑上為正。對 DFS 序端點串，合併左右兩段只新增一組跨界相鄰端點，
  因此摘要可結合；最後補上首尾一項得到環狀公式，其值等於最小連通子樹邊數。
  該子樹中除 u 外每個城市都可與 u 貿易，故累加後每對被兩端各計一次。
common_errors:
  - 只在 lca 刪一次而漏掉其父親
  - 把端點出現次數降到零後仍保留葉節點摘要
  - 忘記最終答案要除以二
complexity:
  time: O((n+m) log² n)
  space: O((n+m) log n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // TODO：以 DFS 序為值域，維護端點集合的生成子樹長度，
  // 再用樹上差分與線段樹合併取得每個城市的集合。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Change {
      int point;
      int delta;
  };

  class MergeableTree {
  public:
      struct Node {
          int left = 0;
          int right = 0;
          int frequency = 0;
          int first = 0;
          int last = 0;
          int value = 0;
      };

      MergeableTree(const vector<int>& node_at_time,
                    const vector<int>& depth,
                    const vector<vector<int>>& ancestor)
          : node_at_time_(node_at_time), depth_(depth), ancestor_(ancestor) {
          nodes_.push_back(Node{});
      }

      void reserve(size_t size) { nodes_.reserve(size); }

      int update(int root, int l, int r, int position, int delta) {
          if (root == 0) {
              root = static_cast<int>(nodes_.size());
              nodes_.push_back(Node{});
          }
          if (l == r) {
              Node& node = nodes_[static_cast<size_t>(root)];
              node.frequency += delta;
              if (node.frequency > 0) {
                  const int point = node_at_time_[static_cast<size_t>(l)];
                  node.first = point;
                  node.last = point;
                  node.value = depth_[static_cast<size_t>(point)];
              } else {
                  node.first = 0;
                  node.last = 0;
                  node.value = 0;
              }
              return root;
          }
          const int mid = (l + r) / 2;
          if (position <= mid) {
              nodes_[static_cast<size_t>(root)].left =
                  update(nodes_[static_cast<size_t>(root)].left,
                         l, mid, position, delta);
          } else {
              nodes_[static_cast<size_t>(root)].right =
                  update(nodes_[static_cast<size_t>(root)].right,
                         mid + 1, r, position, delta);
          }
          pull(root);
          return root;
      }

      int merge(int first_root, int second_root, int l, int r) {
          if (first_root == 0) { return second_root; }
          if (second_root == 0) { return first_root; }
          if (l == r) {
              nodes_[static_cast<size_t>(first_root)].frequency +=
                  nodes_[static_cast<size_t>(second_root)].frequency;
              Node& node = nodes_[static_cast<size_t>(first_root)];
              if (node.frequency > 0) {
                  const int point = node_at_time_[static_cast<size_t>(l)];
                  node.first = point;
                  node.last = point;
                  node.value = depth_[static_cast<size_t>(point)];
              } else {
                  node.first = 0;
                  node.last = 0;
                  node.value = 0;
              }
              return first_root;
          }
          const int mid = (l + r) / 2;
          Node& first = nodes_[static_cast<size_t>(first_root)];
          const Node second = nodes_[static_cast<size_t>(second_root)];
          first.left = merge(first.left, second.left, l, mid);
          first.right = merge(first.right, second.right, mid + 1, r);
          pull(first_root);
          return first_root;
      }

      int edge_count(int root) const {
          if (root == 0) { return 0; }
          const Node& node = nodes_[static_cast<size_t>(root)];
          if (node.first == 0) { return 0; }
          return node.value -
                 depth_[static_cast<size_t>(lca(node.first, node.last))];
      }

  private:
      vector<Node> nodes_;
      const vector<int>& node_at_time_;
      const vector<int>& depth_;
      const vector<vector<int>>& ancestor_;

      int lca(int u, int v) const {
          if (depth_[static_cast<size_t>(u)] <
              depth_[static_cast<size_t>(v)]) {
              swap(u, v);
          }
          int difference = depth_[static_cast<size_t>(u)] -
                           depth_[static_cast<size_t>(v)];
          for (size_t bit = 0; bit < ancestor_.size(); ++bit) {
              if ((difference & (1 << bit)) != 0) {
                  u = ancestor_[bit][static_cast<size_t>(u)];
              }
          }
          if (u == v) { return u; }
          for (size_t bit = ancestor_.size(); bit-- > 0;) {
              if (ancestor_[bit][static_cast<size_t>(u)] !=
                  ancestor_[bit][static_cast<size_t>(v)]) {
                  u = ancestor_[bit][static_cast<size_t>(u)];
                  v = ancestor_[bit][static_cast<size_t>(v)];
              }
          }
          return ancestor_[0][static_cast<size_t>(u)];
      }

      void pull(int root) {
          Node& node = nodes_[static_cast<size_t>(root)];
          const Node& left = nodes_[static_cast<size_t>(node.left)];
          const Node& right = nodes_[static_cast<size_t>(node.right)];
          node.first = left.first != 0 ? left.first : right.first;
          node.last = right.last != 0 ? right.last : left.last;
          node.value = left.value + right.value;
          if (left.last != 0 && right.first != 0) {
              node.value -= depth_[static_cast<size_t>(
                  lca(left.last, right.first))];
          }
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n, language_count;
      cin >> n >> language_count;
      vector<vector<int>> adjacency(static_cast<size_t>(n) + 1);
      for (int i = 1; i < n; ++i) {
          int u, v;
          cin >> u >> v;
          adjacency[static_cast<size_t>(u)].push_back(v);
          adjacency[static_cast<size_t>(v)].push_back(u);
      }

      vector<int> parent(static_cast<size_t>(n) + 1);
      vector<int> depth(static_cast<size_t>(n) + 1, 1);
      vector<int> tin(static_cast<size_t>(n) + 1);
      vector<int> node_at_time(static_cast<size_t>(n) + 1);
      vector<int> order;
      order.reserve(static_cast<size_t>(n));
      vector<int> stack{1};
      int timer = 0;
      while (!stack.empty()) {
          const int node = stack.back();
          stack.pop_back();
          tin[static_cast<size_t>(node)] = ++timer;
          node_at_time[static_cast<size_t>(timer)] = node;
          order.push_back(node);
          const auto& edges = adjacency[static_cast<size_t>(node)];
          for (auto it = edges.rbegin(); it != edges.rend(); ++it) {
              const int next = *it;
              if (next == parent[static_cast<size_t>(node)]) { continue; }
              parent[static_cast<size_t>(next)] = node;
              depth[static_cast<size_t>(next)] =
                  depth[static_cast<size_t>(node)] + 1;
              stack.push_back(next);
          }
      }

      int logarithm = 1;
      while ((1 << logarithm) <= n) { ++logarithm; }
      vector<vector<int>> ancestor(
          static_cast<size_t>(logarithm),
          vector<int>(static_cast<size_t>(n) + 1));
      ancestor[0] = parent;
      for (int bit = 1; bit < logarithm; ++bit) {
          for (int node = 1; node <= n; ++node) {
              ancestor[static_cast<size_t>(bit)][static_cast<size_t>(node)] =
                  ancestor[static_cast<size_t>(bit - 1)][static_cast<size_t>(
                      ancestor[static_cast<size_t>(bit - 1)]
                              [static_cast<size_t>(node)])];
          }
      }
      const auto find_lca = [&](int u, int v) {
          if (depth[static_cast<size_t>(u)] <
              depth[static_cast<size_t>(v)]) {
              swap(u, v);
          }
          int difference = depth[static_cast<size_t>(u)] -
                           depth[static_cast<size_t>(v)];
          for (int bit = 0; bit < logarithm; ++bit) {
              if ((difference & (1 << bit)) != 0) {
                  u = ancestor[static_cast<size_t>(bit)]
                              [static_cast<size_t>(u)];
              }
          }
          if (u == v) { return u; }
          for (int bit = logarithm; bit-- > 0;) {
              if (ancestor[static_cast<size_t>(bit)][static_cast<size_t>(u)] !=
                  ancestor[static_cast<size_t>(bit)][static_cast<size_t>(v)]) {
                  u = ancestor[static_cast<size_t>(bit)]
                              [static_cast<size_t>(u)];
                  v = ancestor[static_cast<size_t>(bit)]
                              [static_cast<size_t>(v)];
              }
          }
          return parent[static_cast<size_t>(u)];
      };

      vector<vector<Change>> changes(static_cast<size_t>(n) + 1);
      const auto add_pair = [&](int node, int s, int t, int delta) {
          if (node == 0) { return; }
          changes[static_cast<size_t>(node)].push_back({s, delta});
          changes[static_cast<size_t>(node)].push_back({t, delta});
      };
      for (int i = 0; i < language_count; ++i) {
          int s, t;
          cin >> s >> t;
          const int common = find_lca(s, t);
          add_pair(s, s, t, 1);
          add_pair(t, s, t, 1);
          add_pair(common, s, t, -1);
          add_pair(parent[static_cast<size_t>(common)], s, t, -1);
      }

      MergeableTree tree(node_at_time, depth, ancestor);
      tree.reserve(static_cast<size_t>(n + language_count) * 24 + 1);
      vector<int> root(static_cast<size_t>(n) + 1);
      long long ordered_pair_count = 0;
      for (size_t index = order.size(); index-- > 0;) {
          const int node = order[index];
          for (const Change change : changes[static_cast<size_t>(node)]) {
              root[static_cast<size_t>(node)] = tree.update(
                  root[static_cast<size_t>(node)], 1, n,
                  tin[static_cast<size_t>(change.point)], change.delta);
          }
          ordered_pair_count += tree.edge_count(root[static_cast<size_t>(node)]);
          const int parent_node = parent[static_cast<size_t>(node)];
          if (parent_node != 0) {
              root[static_cast<size_t>(parent_node)] = tree.merge(
                  root[static_cast<size_t>(parent_node)],
                  root[static_cast<size_t>(node)], 1, n);
          }
      }
      cout << ordered_pair_count / 2 << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5327
external_platform: Luogu
external_problem_id: P5327
external_title: '[ZJOI2019] 語言'
external_relation: original
source_book_pages: [205]
source_pdf_pages: [223]
review_status: verified
---

固定一個城市後，問題從「語言」變成「經過此點的所有路徑聯集有幾條邊」。
