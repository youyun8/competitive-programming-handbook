---
id: luogu-p3258
volume: upper
source_file: upper-volume
title: 洛谷 P3258 松鼠的新家：LCA 與樹上點差分
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 3
topics: [tree-difference, lca, binary-lifting]
prerequisites: [lowest-common-ancestor]
statement: 給定 n 個房間形成的樹，以及依序造訪全部 n 個房間的指南 a_1..a_n。訪客從 a_1 出發，依序沿唯一簡單路徑前往下一站；每進入一個房間便取一顆糖，但每段終點會緊接著成為下一段起點，不能重複取糖，且最後抵達 a_n 時不取糖。求每個房間至少要準備幾顆。
constraints: ['2 <= n <= 300000', 'a 是 1..n 的排列']
input_format: 第一行 n；第二行 a_1..a_n；接著 n-1 行樹邊。
output_format: 依房間編號輸出 n 行所需糖果數。
samples:
  - input: |
      5
      1 4 5 3 2
      1 2
      2 4
      2 3
      4 5
    output: |
      1
      2
      1
      2
      1
    explanation: 依序走 1→4→5→3→2；把各段完整路徑計數後，對每個 a_2..a_n 扣除一次重複的到達計數，即得各房間需求。
core_knowledge: [點路徑差分, 倍增 LCA, 子樹自底向上累積]
judgment: 每段路徑包含兩端，但除第一站外每一站的到達與下一段出發只取一次；最終站完全不取。
hints:
  - 先把每段 a_i 到 a_{i+1} 視為「路徑所有點加一」，最後再處理相鄰路徑接合處。
  - 對點路徑 u-v，令 w=LCA(u,v)，可做 `diff[u]++、diff[v]++、diff[w]--、diff[parent[w]]--`。
  - 自底向上累加差分後，每個 a_2..a_n 都被前一段終點多算一次，逐一減一即可。
solution_outline: 迭代建根樹並建立倍增祖先表。對相鄰指南節點做點路徑差分，再逆序把每個子節點差分加到父節點，最後將 a_2..a_n 的答案各減一。
proof_or_invariant: 點差分的四次修改在子樹累積後，恰使 u-v 路徑上的點增加一。所有相鄰路徑疊加得到完整行走次數；每個後繼站的到達與下一段出發重合，而最後站不取糖，統一扣除 a_2..a_n 一次後即為需求。
common_errors:
  - '把點差分寫成 diff[lca]-=2 的邊差分'
  - '忘記扣除 a_2..a_n'
  - '遞迴 DFS 在三十萬節點長鏈爆棧'
complexity: { time: 'O(n log n)', space: 'O(n log n)' }
cpp_skeleton: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<int> route(static_cast<size_t>(n));
      for (int& node : route) cin >> node;
      // TODO：倍增 LCA + 點路徑差分。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<int> route(static_cast<size_t>(n));
      for (int& node : route) cin >> node;
      vector<vector<int>> graph(static_cast<size_t>(n) + 1U);
      for (int i = 1; i < n; ++i) {
          int u, v;
          cin >> u >> v;
          graph[static_cast<size_t>(u)].push_back(v);
          graph[static_cast<size_t>(v)].push_back(u);
      }
      int levels = 1;
      while ((1 << levels) <= n) ++levels;
      vector<vector<int>> ancestor(static_cast<size_t>(levels), vector<int>(static_cast<size_t>(n) + 1U));
      vector<int> depth(static_cast<size_t>(n) + 1U), order{1};
      depth[1] = 1;
      for (size_t index = 0; index < order.size(); ++index) {
          const int node = order[index];
          for (int next : graph[static_cast<size_t>(node)]) {
              if (next == ancestor[0][static_cast<size_t>(node)]) continue;
              ancestor[0][static_cast<size_t>(next)] = node;
              depth[static_cast<size_t>(next)] = depth[static_cast<size_t>(node)] + 1;
              order.push_back(next);
          }
      }
      for (int level = 1; level < levels; ++level)
          for (int node = 1; node <= n; ++node)
              ancestor[static_cast<size_t>(level)][static_cast<size_t>(node)] =
                  ancestor[static_cast<size_t>(level - 1)]
                          [static_cast<size_t>(ancestor[static_cast<size_t>(level - 1)][static_cast<size_t>(node)])];
      auto lca = [&](int x, int y) {
          if (depth[static_cast<size_t>(x)] < depth[static_cast<size_t>(y)]) swap(x, y);
          int difference = depth[static_cast<size_t>(x)] - depth[static_cast<size_t>(y)];
          for (int level = 0; level < levels; ++level)
              if ((difference >> level) & 1) x = ancestor[static_cast<size_t>(level)][static_cast<size_t>(x)];
          if (x == y) return x;
          for (int level = levels - 1; level >= 0; --level)
              if (ancestor[static_cast<size_t>(level)][static_cast<size_t>(x)] !=
                  ancestor[static_cast<size_t>(level)][static_cast<size_t>(y)]) {
                  x = ancestor[static_cast<size_t>(level)][static_cast<size_t>(x)];
                  y = ancestor[static_cast<size_t>(level)][static_cast<size_t>(y)];
              }
          return ancestor[0][static_cast<size_t>(x)];
      };
      vector<long long> difference(static_cast<size_t>(n) + 1U);
      for (int i = 0; i + 1 < n; ++i) {
          const int u = route[static_cast<size_t>(i)];
          const int v = route[static_cast<size_t>(i + 1)];
          const int common = lca(u, v);
          ++difference[static_cast<size_t>(u)];
          ++difference[static_cast<size_t>(v)];
          --difference[static_cast<size_t>(common)];
          --difference[static_cast<size_t>(ancestor[0][static_cast<size_t>(common)])];
      }
      for (size_t index = order.size(); index-- > 1;) {
          const int node = order[index];
          difference[static_cast<size_t>(ancestor[0][static_cast<size_t>(node)])] +=
              difference[static_cast<size_t>(node)];
      }
      for (int i = 1; i < n; ++i) --difference[static_cast<size_t>(route[static_cast<size_t>(i)])];
      for (int node = 1; node <= n; ++node) cout << difference[static_cast<size_t>(node)] << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3258
external_platform: 洛谷
external_problem_id: P3258
external_title: '[JLOI2014] 松鼠的新家'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

這題的重點不是資料結構，而是辨認「點差分」以及相鄰路徑端點只取一次的語意修正。
