---
id: luogu-p1119
volume: lower
source_file: lower-volume
original_label: 洛谷 P1119
title: 洛谷 P1119 災後重建：增量 Floyd
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: [最短路徑, Floyd-Warshall, 離線查詢]
prerequisites: [dijkstra]
core_knowledge: [允許中繼點集合, 單調時間, 增量全源最短路]
judgment: 村莊與詢問時間皆不下降，可依時間逐批開放中繼點。
statement: 給定各村莊完工時間與帶權無向道路；對每個時間不下降的詢問，求當天兩村間只經過已完工村莊的最短路，不可行輸出 -1。
constraints: ['n <= 200', '道路權重 <= 10000', '完工時間與詢問時間皆不下降']
input_format: 依序輸入 n、m，n 個完工時間，m 條道路，再輸入 q 與 q 組 x、y、t。
output_format: 每個詢問輸出最短距離或 -1。
samples:
  - input: |-
      4 5
      1 2 3 4
      0 2 1
      2 3 1
      3 1 2
      2 1 4
      0 3 5
      4
      2 0 2
      0 1 2
      0 1 3
      0 1 4
    output: |-
      -1
      -1
      5
      4
    explanation: 前兩問端點尚未全完工；第三問開放 0、1、2 後距離為 5；第四問再開放 3，路徑縮短為 4。
hints:
  - Floyd 第 k 輪的語意是只允許前 k 個點作中繼點。
  - 詢問時間不下降，因此每個村莊只需在首次完工時加入一次。
  - 回答前仍要檢查兩個端點是否已完工，不能只看距離矩陣。
solution_outline: 先用道路初始化距離矩陣。維護下一個尚未開放的村莊 k；每個詢問前，對所有完工時間不晚於 t 的 k 執行一輪 Floyd，再檢查端點與可達性。
proof_or_invariant: 處理完 k 個開放點後，dist[i][j] 恰為只用這些點作中繼的最短距離，這是 Floyd 歸納不變量。時間單調使允許集合只增不減，故每問所得矩陣正好對應當日道路網。
complexity: { time: 'O(n^3 + qn)', space: 'O(n^2)' }
common_errors: [未檢查詢問端點完工時間, 重邊沒有取最小值, 把村莊編號誤當成從 1 開始]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, m; cin >> n >> m;
      vector<int> ready(n);
      for (int& value : ready) cin >> value;
      // TODO：初始化 dist；依每個詢問時間增量執行 Floyd。
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
      vector<int> ready(static_cast<size_t>(n));
      for (int& value : ready) cin >> value;
      const long long inf = LLONG_MAX / 4;
      vector<vector<long long>> dist(static_cast<size_t>(n), vector<long long>(static_cast<size_t>(n), inf));
      for (int i = 0; i < n; ++i) dist[static_cast<size_t>(i)][static_cast<size_t>(i)] = 0;
      for (int i = 0; i < m; ++i) {
          int u, v; long long w; cin >> u >> v >> w;
          dist[static_cast<size_t>(u)][static_cast<size_t>(v)] =
              dist[static_cast<size_t>(v)][static_cast<size_t>(u)] =
                  min(dist[static_cast<size_t>(u)][static_cast<size_t>(v)], w);
      }
      int q, opened = 0; cin >> q;
      while (q-- > 0) {
          int x, y, time; cin >> x >> y >> time;
          while (opened < n && ready[static_cast<size_t>(opened)] <= time) {
              const int k = opened++;
              for (int i = 0; i < n; ++i)
                  for (int j = 0; j < n; ++j)
                      if (dist[static_cast<size_t>(i)][static_cast<size_t>(k)] < inf &&
                          dist[static_cast<size_t>(k)][static_cast<size_t>(j)] < inf)
                          dist[static_cast<size_t>(i)][static_cast<size_t>(j)] =
                              min(dist[static_cast<size_t>(i)][static_cast<size_t>(j)],
                                  dist[static_cast<size_t>(i)][static_cast<size_t>(k)] +
                                      dist[static_cast<size_t>(k)][static_cast<size_t>(j)]);
          }
          if (ready[static_cast<size_t>(x)] > time || ready[static_cast<size_t>(y)] > time ||
              dist[static_cast<size_t>(x)][static_cast<size_t>(y)] == inf)
              cout << -1 << '\n';
          else cout << dist[static_cast<size_t>(x)][static_cast<size_t>(y)] << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P1119
external_platform: 洛谷
external_problem_id: P1119
external_title: 災後重建
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

增量 Floyd 的關鍵不是少做更新，而是依詢問時間維護正確的中繼點集合。
