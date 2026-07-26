---
id: luogu-p2146
volume: upper
source_file: upper-volume
title: 洛谷 P2146 軟體包管理器：依賴鏈安裝與子樹卸載
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 4
topics: [heavy-light-decomposition, segment-tree, range-assignment]
prerequisites: [heavy-light-decomposition, segment-tree]
statement: 給定以套件 0 為根的依賴樹；每個其他套件恰依賴父節點。初始皆未安裝。安裝 x 時必須安裝 x 到根路徑上所有尚未安裝的套件；卸載 x 時必須卸載 x 子樹內所有已安裝套件。逐次輸出狀態改變的套件數。
constraints:
  - '1 <= n, q <= 100000'
  - '套件編號為 0..n-1，依賴關係無環'
input_format: 第一行 n；下一行給套件 1..n-1 的父節點；再輸入 q，接著 q 行為 `install x` 或 `uninstall x`。
output_format: 每次操作輸出由未安裝變已安裝或由已安裝變未安裝的套件數。
samples:
  - input: |
      7
      0 0 0 1 1 5
      5
      install 5
      install 6
      uninstall 1
      install 4
      uninstall 0
    output: |
      3
      1
      3
      2
      3
    explanation: 安裝 5 會啟用 0、1、5；安裝 6 只新增 6。卸載 1 關閉 1、5、6；其後安裝 4 新增 1、4，最後卸載根會關閉剩餘三個套件。
core_knowledge: [根路徑可拆成對數個重鏈區間, 子樹是連續 DFS 序區間, 線段樹區間覆蓋與區間和]
judgment: 安裝已安裝套件或卸載未安裝套件仍須套用依賴規則，但可能改變零個狀態。
hints:
  - 將安裝狀態視為 0/1；安裝 x 是把根到 x 的路徑全部覆蓋成 1。
  - 重鏈剖分可把根路徑拆成 O(log n) 個 DFS 序區間；卸載 x 則只需覆蓋它的子樹區間。
  - 線段樹維護已安裝數與覆蓋懶標記；用操作前後根節點的總和差即可得到答案。
solution_outline: 預處理父節點、子樹大小、重兒子、鏈頭與 DFS 序。線段樹初始全零，支援區間覆蓋 0/1。install 沿重鏈覆蓋根路徑，uninstall 覆蓋子樹；輸出全樹已安裝數的變化量絕對值。
proof_or_invariant: DFS 序使每棵子樹連續；重鏈跳躍完整且不重複地分割根路徑。每次覆蓋後，線段樹區間和恰為已安裝套件數，因此總和差恰等於本次改變狀態的套件數。
common_errors: [忘記輸入套件從 0 編號, 覆蓋懶標記以 0 當成沒有標記, 卸載時誤處理根路徑而非子樹]
complexity: { time: '每次 install O(log^2 n)，uninstall O(log n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<vector<int>> children(static_cast<size_t>(n));
      for (int node = 1; node < n; ++node) {
          int parent;
          cin >> parent;
          children[static_cast<size_t>(parent)].push_back(node);
      }
      // TODO：重鏈剖分；線段樹支援區間覆蓋與區間和。
      int q;
      cin >> q;
      while (q--) {
          string operation;
          int node;
          cin >> operation >> node;
          (void)operation;
          (void)node;
          cout << 0 << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;

  struct SegmentTree {
      int n;
      vector<int> sum, lazy;
      explicit SegmentTree(int size) : n(size), sum(static_cast<size_t>(4 * size)), lazy(static_cast<size_t>(4 * size), -1) {}
      void apply(int node, int left, int right, int value) {
          sum[static_cast<size_t>(node)] = (right - left + 1) * value;
          lazy[static_cast<size_t>(node)] = value;
      }
      void push(int node, int left, int right) {
          if (lazy[static_cast<size_t>(node)] == -1 || left == right) return;
          const int middle = (left + right) / 2;
          apply(node * 2, left, middle, lazy[static_cast<size_t>(node)]);
          apply(node * 2 + 1, middle + 1, right, lazy[static_cast<size_t>(node)]);
          lazy[static_cast<size_t>(node)] = -1;
      }
      void assign(int node, int left, int right, int query_left, int query_right, int value) {
          if (query_left <= left && right <= query_right) {
              apply(node, left, right, value);
              return;
          }
          push(node, left, right);
          const int middle = (left + right) / 2;
          if (query_left <= middle) assign(node * 2, left, middle, query_left, query_right, value);
          if (query_right > middle) assign(node * 2 + 1, middle + 1, right, query_left, query_right, value);
          sum[static_cast<size_t>(node)] = sum[static_cast<size_t>(node * 2)] + sum[static_cast<size_t>(node * 2 + 1)];
      }
      void assign(int left, int right, int value) { assign(1, 1, n, left, right, value); }
      int total() const { return sum[1]; }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<vector<int>> children(static_cast<size_t>(n));
      vector<int> parent(static_cast<size_t>(n), -1), depth(static_cast<size_t>(n));
      for (int node = 1; node < n; ++node) {
          cin >> parent[static_cast<size_t>(node)];
          children[static_cast<size_t>(parent[static_cast<size_t>(node)])].push_back(node);
          depth[static_cast<size_t>(node)] = depth[static_cast<size_t>(parent[static_cast<size_t>(node)])] + 1;
      }
      vector<int> order{0};
      for (size_t index = 0; index < order.size(); ++index) {
          for (int child : children[static_cast<size_t>(order[index])]) order.push_back(child);
      }
      vector<int> subtree_size(static_cast<size_t>(n), 1), heavy(static_cast<size_t>(n), -1);
      for (size_t index = order.size(); index-- > 0;) {
          const int node = order[index];
          for (int child : children[static_cast<size_t>(node)]) {
              subtree_size[static_cast<size_t>(node)] += subtree_size[static_cast<size_t>(child)];
              if (heavy[static_cast<size_t>(node)] == -1 ||
                  subtree_size[static_cast<size_t>(child)] > subtree_size[static_cast<size_t>(heavy[static_cast<size_t>(node)])])
                  heavy[static_cast<size_t>(node)] = child;
          }
      }
      vector<int> head(static_cast<size_t>(n)), position(static_cast<size_t>(n));
      vector<pair<int, int>> stack{{0, 0}};
      int timer = 0;
      while (!stack.empty()) {
          auto [start, chain_head] = stack.back();
          stack.pop_back();
          for (int node = start; node != -1; node = heavy[static_cast<size_t>(node)]) {
              head[static_cast<size_t>(node)] = chain_head;
              position[static_cast<size_t>(node)] = ++timer;
              for (int child : children[static_cast<size_t>(node)])
                  if (child != heavy[static_cast<size_t>(node)]) stack.push_back({child, child});
          }
      }
      SegmentTree tree(n);
      int q;
      cin >> q;
      while (q--) {
          string operation;
          int node;
          cin >> operation >> node;
          const int before = tree.total();
          if (operation[0] == 'i') {
              while (head[static_cast<size_t>(node)] != 0) {
                  tree.assign(position[static_cast<size_t>(head[static_cast<size_t>(node)])],
                              position[static_cast<size_t>(node)], 1);
                  node = parent[static_cast<size_t>(head[static_cast<size_t>(node)])];
              }
              tree.assign(1, position[static_cast<size_t>(node)], 1);
          } else {
              tree.assign(position[static_cast<size_t>(node)],
                          position[static_cast<size_t>(node)] + subtree_size[static_cast<size_t>(node)] - 1, 0);
          }
          cout << abs(tree.total() - before) << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2146
external_platform: 洛谷
external_problem_id: P2146
external_title: '[NOI2015] 軟件包管理器'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

安裝沿祖先鏈，卸載沿後代子樹；兩種看似不同的依賴操作，在 DFS 序上都成為區間覆蓋。
