---
id: luogu-p2590
volume: upper
source_file: upper-volume
title: 洛谷 P2590 樹的統計：路徑和與最大值
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 3
topics: [heavy-light-decomposition, segment-tree, path-query]
prerequisites: [heavy-light-decomposition, segment-tree]
statement: 維護一棵帶整數點權的樹，支援把單一節點權值改為指定值，以及查詢任意兩點路徑上的點權總和或最大值；路徑包含兩端。
constraints: ['1 <= n <= 30000', '0 <= q <= 200000', '任意時刻點權介於 -30000 與 30000']
input_format: 先給 n、n-1 條邊、n 個點權與 q；操作為 `CHANGE u t`、`QMAX u v`、`QSUM u v`。
output_format: 每個 QMAX 或 QSUM 輸出一行答案。
samples:
  - input: |
      4
      1 2
      2 3
      4 1
      4 2 1 3
      12
      QMAX 3 4
      QMAX 3 3
      QMAX 3 2
      QMAX 2 3
      QSUM 3 4
      QSUM 2 1
      CHANGE 1 5
      QMAX 3 4
      CHANGE 3 6
      QMAX 3 4
      QMAX 2 4
      QSUM 3 4
    output: |
      4
      1
      2
      2
      10
      6
      5
      6
      5
      16
    explanation: 前四次最大值查詢涵蓋單點與雙向路徑；修改節點 1、3 後，最後路徑 3-2-1-4 的總和為 6+2+5+3=16。
core_knowledge: [重鏈剖分路徑拆段, 線段樹單點賦值, 區間和與最大值聚合]
judgment: CHANGE 是賦值而非增量；負權情況下最大值初始值不可設為零。
hints:
  - 將每個點映到重鏈優先 DFS 序，線段樹葉節點保存點權。
  - 當兩點鏈頭不同，處理鏈頭較深的一段並跳到鏈頭父節點。
  - 每段同時查 sum 與 maximum；總和相加、最大值取 max，最後別漏同鏈區間。
solution_outline: 重鏈剖分後建立同時維護 sum/max 的線段樹。CHANGE 在 position[u] 單點賦值；兩種查詢沿鏈跳躍，合併所有區間結果。
proof_or_invariant: 每個線段樹節點正確保存區間總和與最大值。重鏈跳躍將簡單路徑分割成互不重疊的 DFS 序區間，因此分別用加法與 max 合併便得到完整路徑結果。
common_errors: [最大值答案從 0 開始導致全負路徑錯誤, CHANGE 寫成加值, 比較端點深度而非鏈頭深度]
complexity: { time: '每次 O(log^2 n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：重鏈剖分 + 維護 sum/max 的線段樹。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <climits>
  #include <iostream>
  #include <string>
  #include <utility>
  #include <vector>
  using namespace std;
  struct SegmentTree {
      int size = 1;
      vector<long long> sum;
      vector<int> maximum;
      explicit SegmentTree(int n) {
          while (size < n) size *= 2;
          sum.assign(static_cast<size_t>(2 * size), 0);
          maximum.assign(static_cast<size_t>(2 * size), INT_MIN);
      }
      void set(int position, int value) {
          int node = size + position - 1;
          sum[static_cast<size_t>(node)] = value;
          maximum[static_cast<size_t>(node)] = value;
          for (node /= 2; node > 0; node /= 2) {
              sum[static_cast<size_t>(node)] = sum[static_cast<size_t>(node * 2)] + sum[static_cast<size_t>(node * 2 + 1)];
              maximum[static_cast<size_t>(node)] =
                  max(maximum[static_cast<size_t>(node * 2)], maximum[static_cast<size_t>(node * 2 + 1)]);
          }
      }
      pair<long long, int> query(int left, int right) const {
          long long total = 0; int best = INT_MIN;
          int l = size + left - 1, r = size + right - 1;
          while (l <= r) {
              if (l % 2 == 1) { total += sum[static_cast<size_t>(l)]; best = max(best, maximum[static_cast<size_t>(l++)]); }
              if (r % 2 == 0) { total += sum[static_cast<size_t>(r)]; best = max(best, maximum[static_cast<size_t>(r--)]); }
              l /= 2; r /= 2;
          }
          return {total, best};
      }
  };
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n; cin >> n;
      vector<vector<int>> graph(static_cast<size_t>(n) + 1U);
      for (int i = 1; i < n; ++i) { int u, v; cin >> u >> v; graph[static_cast<size_t>(u)].push_back(v); graph[static_cast<size_t>(v)].push_back(u); }
      vector<int> value(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) cin >> value[static_cast<size_t>(i)];
      vector<int> parent(static_cast<size_t>(n) + 1U), depth(static_cast<size_t>(n) + 1U), order{1};
      depth[1] = 1;
      for (size_t i = 0; i < order.size(); ++i) for (int next : graph[static_cast<size_t>(order[i])])
          if (next != parent[static_cast<size_t>(order[i])]) { parent[static_cast<size_t>(next)] = order[i]; depth[static_cast<size_t>(next)] = depth[static_cast<size_t>(order[i])] + 1; order.push_back(next); }
      vector<int> subtree_size(static_cast<size_t>(n) + 1U, 1), heavy(static_cast<size_t>(n) + 1U);
      for (size_t i = order.size(); i-- > 0;) for (int next : graph[static_cast<size_t>(order[i])])
          if (parent[static_cast<size_t>(next)] == order[i]) { subtree_size[static_cast<size_t>(order[i])] += subtree_size[static_cast<size_t>(next)]; if (subtree_size[static_cast<size_t>(next)] > subtree_size[static_cast<size_t>(heavy[static_cast<size_t>(order[i])])]) heavy[static_cast<size_t>(order[i])] = next; }
      vector<int> head(static_cast<size_t>(n) + 1U), position(static_cast<size_t>(n) + 1U);
      vector<pair<int, int>> stack{{1, 1}}; int timer = 0;
      while (!stack.empty()) {
          auto [start, chain_head] = stack.back(); stack.pop_back();
          for (int node = start; node != 0; node = heavy[static_cast<size_t>(node)]) {
              head[static_cast<size_t>(node)] = chain_head; position[static_cast<size_t>(node)] = ++timer;
              for (int next : graph[static_cast<size_t>(node)]) if (parent[static_cast<size_t>(next)] == node && next != heavy[static_cast<size_t>(node)]) stack.push_back({next, next});
          }
      }
      SegmentTree tree(n);
      for (int node = 1; node <= n; ++node) tree.set(position[static_cast<size_t>(node)], value[static_cast<size_t>(node)]);
      int q; cin >> q;
      while (q--) {
          string operation; int x, y; cin >> operation >> x >> y;
          if (operation[0] == 'C') tree.set(position[static_cast<size_t>(x)], y);
          else {
              long long total = 0; int best = INT_MIN;
              while (head[static_cast<size_t>(x)] != head[static_cast<size_t>(y)]) {
                  if (depth[static_cast<size_t>(head[static_cast<size_t>(x)])] < depth[static_cast<size_t>(head[static_cast<size_t>(y)])]) swap(x, y);
                  auto result = tree.query(position[static_cast<size_t>(head[static_cast<size_t>(x)])], position[static_cast<size_t>(x)]);
                  total += result.first; best = max(best, result.second); x = parent[static_cast<size_t>(head[static_cast<size_t>(x)])];
              }
              if (depth[static_cast<size_t>(x)] > depth[static_cast<size_t>(y)]) swap(x, y);
              auto result = tree.query(position[static_cast<size_t>(x)], position[static_cast<size_t>(y)]);
              total += result.first; best = max(best, result.second);
              if (operation[1] == 'M') cout << best << '\n'; else cout << total << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2590
external_platform: 洛谷
external_problem_id: P2590
external_title: '[ZJOI2008] 樹的統計'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

同一套路徑拆分可套用任何結合律聚合；這題同時維護加法與最大值，是最直接的練習。
