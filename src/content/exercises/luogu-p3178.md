---
id: luogu-p3178
volume: upper
source_file: upper-volume
title: 洛谷 P3178 樹上操作：子樹加與根路徑和
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 3
topics: [heavy-light-decomposition, fenwick-tree, subtree-update]
prerequisites: [heavy-light-decomposition, fenwick-tree]
statement: 給定以 1 為根的帶點權樹，支援：單點 x 加 a、x 的整棵子樹加 a，以及查詢根到 x 路徑上所有點權和。
constraints: ['1 <= n, m <= 100000', '所有輸入整數的絕對值不超過 1000000']
input_format: 第一行 n、m；第二行 n 個初始點權；接著 n-1 條邊；最後 m 個操作：`1 x a`、`2 x a` 或 `3 x`。
output_format: 每個操作 3 輸出一行根到 x 的點權和。
samples:
  - input: |
      5 5
      1 2 3 4 5
      1 2
      1 4
      2 3
      2 5
      3 3
      1 2 1
      3 5
      2 1 2
      3 3
    output: |
      6
      9
      13
    explanation: 初始路徑 1-2-3 和為 6；節點 2 加一後路徑 1-2-5 和為 9；全樹加二後 1-2-3 和為 13。
core_knowledge: [重鏈剖分根路徑查詢, DFS 序子樹連續, Fenwick 區間加區間和]
judgment: 操作 1 只改一點；操作 2 包含 x 自己；操作 3 的路徑包含根與 x。
hints:
  - 重兒子優先編號後，x 子樹是 `[pos[x],pos[x]+size[x]-1]`。
  - 用兩棵 Fenwick 可同時支援區間加與區間和；單點加是長度一的區間加。
  - 查根到 x 時沿鏈頭向上，把每段 DFS 序區間和累加。
solution_outline: 重鏈剖分後以雙 Fenwick 維護 DFS 序的區間加、區間和。操作 1/2 直接更新一段；操作 3 將根路徑拆成重鏈區間求和。
proof_or_invariant: DFS 序子樹連續，故兩種更新都精確映為區間。根路徑被重鏈跳躍完整且不重複地分割，雙 Fenwick 回傳每段當前點權和，因此累加即查詢答案。
common_errors: [用 int 儲存路徑和, 子樹右端少一或多一, 跳鏈後未移到鏈頭父節點]
complexity: { time: '更新 O(log n)，查詢 O(log^2 n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      cin >> n >> m;
      // TODO：重鏈剖分 + 支援區間加、區間和的 Fenwick。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;

  struct RangeFenwick {
      vector<long long> first, second;
      explicit RangeFenwick(int n) : first(static_cast<size_t>(n) + 2U), second(static_cast<size_t>(n) + 2U) {}
      static void add(vector<long long>& bit, int index, long long value) {
          for (int n = static_cast<int>(bit.size()); index < n; index += index & -index)
              bit[static_cast<size_t>(index)] += value;
      }
      static long long sum(const vector<long long>& bit, int index) {
          long long result = 0;
          for (; index > 0; index -= index & -index) result += bit[static_cast<size_t>(index)];
          return result;
      }
      void range_add(int left, int right, long long value) {
          add(first, left, value); add(first, right + 1, -value);
          add(second, left, value * (left - 1)); add(second, right + 1, -value * right);
      }
      long long prefix(int index) const { return sum(first, index) * index - sum(second, index); }
      long long range_sum(int left, int right) const { return prefix(right) - prefix(left - 1); }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      cin >> n >> m;
      vector<long long> value(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) cin >> value[static_cast<size_t>(i)];
      vector<vector<int>> graph(static_cast<size_t>(n) + 1U);
      for (int i = 1; i < n; ++i) {
          int u, v; cin >> u >> v;
          graph[static_cast<size_t>(u)].push_back(v); graph[static_cast<size_t>(v)].push_back(u);
      }
      vector<int> parent(static_cast<size_t>(n) + 1U), depth(static_cast<size_t>(n) + 1U), order{1};
      depth[1] = 1;
      for (size_t i = 0; i < order.size(); ++i) for (int next : graph[static_cast<size_t>(order[i])])
          if (next != parent[static_cast<size_t>(order[i])]) {
              parent[static_cast<size_t>(next)] = order[i];
              depth[static_cast<size_t>(next)] = depth[static_cast<size_t>(order[i])] + 1;
              order.push_back(next);
          }
      vector<int> size(static_cast<size_t>(n) + 1U, 1), heavy(static_cast<size_t>(n) + 1U);
      for (size_t i = order.size(); i-- > 0;) for (int next : graph[static_cast<size_t>(order[i])])
          if (parent[static_cast<size_t>(next)] == order[i]) {
              size[static_cast<size_t>(order[i])] += size[static_cast<size_t>(next)];
              if (size[static_cast<size_t>(next)] > size[static_cast<size_t>(heavy[static_cast<size_t>(order[i])])])
                  heavy[static_cast<size_t>(order[i])] = next;
          }
      vector<int> head(static_cast<size_t>(n) + 1U), position(static_cast<size_t>(n) + 1U);
      vector<pair<int, int>> stack{{1, 1}};
      int timer = 0;
      while (!stack.empty()) {
          auto [start, chain_head] = stack.back(); stack.pop_back();
          for (int node = start; node != 0; node = heavy[static_cast<size_t>(node)]) {
              head[static_cast<size_t>(node)] = chain_head; position[static_cast<size_t>(node)] = ++timer;
              for (int next : graph[static_cast<size_t>(node)])
                  if (parent[static_cast<size_t>(next)] == node && next != heavy[static_cast<size_t>(node)])
                      stack.push_back({next, next});
          }
      }
      RangeFenwick fenwick(n + 1);
      for (int node = 1; node <= n; ++node)
          fenwick.range_add(position[static_cast<size_t>(node)], position[static_cast<size_t>(node)],
                            value[static_cast<size_t>(node)]);
      while (m--) {
          int operation, x; cin >> operation >> x;
          if (operation == 1) {
              long long delta; cin >> delta;
              fenwick.range_add(position[static_cast<size_t>(x)], position[static_cast<size_t>(x)], delta);
          } else if (operation == 2) {
              long long delta; cin >> delta;
              fenwick.range_add(position[static_cast<size_t>(x)],
                                position[static_cast<size_t>(x)] + size[static_cast<size_t>(x)] - 1, delta);
          } else {
              long long answer = 0;
              while (head[static_cast<size_t>(x)] != 1) {
                  answer += fenwick.range_sum(position[static_cast<size_t>(head[static_cast<size_t>(x)])],
                                              position[static_cast<size_t>(x)]);
                  x = parent[static_cast<size_t>(head[static_cast<size_t>(x)])];
              }
              answer += fenwick.range_sum(1, position[static_cast<size_t>(x)]);
              cout << answer << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3178
external_platform: 洛谷
external_problem_id: P3178
external_title: '[HAOI2015] 樹上操作'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

子樹更新與根路徑查詢正好展示 DFS 序的兩個核心性質：子樹連續、路徑可拆鏈。
