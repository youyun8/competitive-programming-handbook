---
id: luogu-p1613
volume: lower
source_file: lower-volume
original_label: 洛谷 P1613
title: 洛谷 P1613 跑路：倍增可達性
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: [倍增, 可達性, Floyd-Warshall]
prerequisites: [dijkstra]
core_knowledge: [長度為二次冪的路徑, 布林合併, 單位代價最短路]
judgment: 一次移動可跨越恰好 2^k 條原邊，先求所有此類可達對。
statement: 有向圖每條邊長 1；每秒可沿一條長度恰為 2^k 的路徑前進。求從 1 到 n 的最少秒數。
constraints: ['2 <= n <= 50', 'm <= 10000', '最優原路徑長不超過 2^31-1']
input_format: 第一行 n、m，接著 m 行有向邊 u、v。
output_format: 輸出從 1 到 n 的最少秒數。
samples:
  - input: |-
      4 4
      1 1
      1 2
      2 3
      3 4
    output: '1'
    explanation: 存在長度 4 的路徑 1→1→2→3→4，而 4 是 2 的冪，因此一次即可到達。
hints:
  - 令 reachable[k][u][v] 表示存在恰走 2^k 條邊的 u→v 路徑。
  - 兩段長度 2^(k-1) 的路徑在中點拼接，就得到第 k 層。
  - 只要某對點在任一層可達，就把它視為代價 1 的新邊，再求最少邊數。
solution_outline: 以原邊初始化第 0 層，倍增 31 層可達性；任一層可達的點對在新圖中連單位邊，最後 Floyd 求 1 到 n 的最少新邊數。
proof_or_invariant: 倍增歸納保證第 k 層恰表示長度 2^k 的路徑。新圖每條邊與一次合法跑路一一對應，因此新圖路徑邊數恰是秒數，最短路即答案。
complexity: { time: 'O(31n^3)', space: 'O(31n^2)' }
common_errors: [把不超過二次冪誤作恰好二次冪, 倍增時原地更新同一層, 忘記自環也可參與拼接]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      int n, m; cin >> n >> m;
      // TODO：倍增求恰好 2^k 步可達，再於壓縮圖求最短路。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) return 0;
      vector<vector<vector<char>>> reachable(
          31, vector<vector<char>>(static_cast<size_t>(n), vector<char>(static_cast<size_t>(n), 0)));
      for (int i = 0; i < m; ++i) {
          int u, v; cin >> u >> v;
          reachable[0][static_cast<size_t>(u - 1)][static_cast<size_t>(v - 1)] = 1;
      }
      const int inf = 1000000000;
      vector<vector<int>> dist(static_cast<size_t>(n), vector<int>(static_cast<size_t>(n), inf));
      for (int i = 0; i < n; ++i) dist[static_cast<size_t>(i)][static_cast<size_t>(i)] = 0;
      for (int level = 0; level < 31; ++level) {
          if (level > 0)
              for (int i = 0; i < n; ++i)
                  for (int k = 0; k < n; ++k)
                      if (reachable[static_cast<size_t>(level - 1)][static_cast<size_t>(i)][static_cast<size_t>(k)])
                          for (int j = 0; j < n; ++j)
                              if (reachable[static_cast<size_t>(level - 1)][static_cast<size_t>(k)][static_cast<size_t>(j)])
                                  reachable[static_cast<size_t>(level)][static_cast<size_t>(i)][static_cast<size_t>(j)] = 1;
          for (int i = 0; i < n; ++i)
              for (int j = 0; j < n; ++j)
                  if (reachable[static_cast<size_t>(level)][static_cast<size_t>(i)][static_cast<size_t>(j)])
                      dist[static_cast<size_t>(i)][static_cast<size_t>(j)] = 1;
      }
      for (int k = 0; k < n; ++k)
          for (int i = 0; i < n; ++i)
              for (int j = 0; j < n; ++j)
                  dist[static_cast<size_t>(i)][static_cast<size_t>(j)] =
                      min(dist[static_cast<size_t>(i)][static_cast<size_t>(j)],
                          dist[static_cast<size_t>(i)][static_cast<size_t>(k)] +
                              dist[static_cast<size_t>(k)][static_cast<size_t>(j)]);
      cout << dist[0][static_cast<size_t>(n - 1)] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1613
external_platform: 洛谷
external_problem_id: P1613
external_title: 跑路
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

先把「一次能走多遠」轉成新圖的邊，問題就回到最普通的最短路。
