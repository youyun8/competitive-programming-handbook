---
id: luogu-p4779
volume: lower
source_file: lower-volume
title: 洛谷 P4779 單源最短路徑：優先佇列版 Dijkstra
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: ['最短路徑', 'Dijkstra', '優先佇列', '貪心']
prerequisites: ['dijkstra', 'heap']
statement: |-
  給定一張帶非負權的有向圖與起點，求起點到每個點的最短距離；不可達者輸出 2^31−1。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'n 可達 10^5、m 可達 2×10^5，必須是 O((n+m) log n)'
  - '邊權非負，這是 Dijkstra 正確性的前提'
  - '不可達的點輸出 2147483647'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行三個整數 n、m 與起點 s；接下來 m 行，每行三個整數 u v w 表示一條 u 到 v、權重 w 的有向邊。'
output_format: '一行 n 個整數，第 i 個表示起點到 i 的最短距離，不可達輸出 2147483647。'
samples:
  - input: |
      4 6 1
      1 2 2
      2 3 2
      1 3 5
      3 4 3
      1 4 10
      4 2 1
    output: |
      0 2 4 7
    explanation: |-
      到 3 走 1→2→3 得 4，比直接走 1→3 的 5 短；到 4 走 1→2→3→4 得 7，比直接走 1→4 的 10 短。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    Dijkstra 的核心貪心是：在所有「尚未確定」的點中，距離最小的那個的距離已經是最終答案。因為所有邊權非負，任何繞路都只會更長。**邊權出現負數時這個論證就失效**，那時要改用 Bellman-Ford 或 SPFA。
  - |-
    樸素實作每輪掃描找最小值是 O(n²)。改用小根堆存 (距離, 節點) 就能 O(log n) 取最小，總複雜度 O((n+m) log n)。
  - |-
    C++ 的 `priority_queue` 沒有 decrease-key。標準做法是**惰性刪除**：距離變短時直接推入一個新項目，取出時若發現「取出的距離 > 已記錄的距離」就跳過。堆裡最多有 O(m) 個項目，複雜度不受影響。
  - |-
    `priority_queue<pair<long long,int>, vector<...>, greater<>>` 會依 pair 的第一維（距離）做小根堆，正是我們要的順序。
  - |-
    不可達的點要輸出 2147483647，所以直接把初始距離設成這個值最省事——它同時也是題目要求的輸出值。注意用 long long 承接加法避免溢位。
solution_outline: |-
  用鄰接表存圖，距離陣列初始化為 2147483647（同時也是題目要求的不可達輸出值）。小根堆存 (距離, 節點)，每次取出堆頂；若取出的距離大於已記錄距離就跳過，否則鬆弛所有出邊，變短就更新並推入新項目。
proof_or_invariant: |-
  不變量是「每個節點第一次從堆中被取出時，它的距離已是最短距離」。證明依賴非負邊權：若存在更短的路徑，該路徑上第一個尚未確定的節點的距離必然不超過當前取出者，與「取出的是最小值」矛盾。惰性刪除只是丟棄過期項目，不影響此性質。
complexity:
  time: 'O((n + m) log n)'
  space: 'O(n + m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, source;
      if (!(cin >> n >> m >> source)) { return 0; }
      vector<vector<pair<int, long long>>> adjacency(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int u, v;
          long long w;
          cin >> u >> v >> w;
          adjacency[static_cast<size_t>(u)].push_back({v, w});
      }

      const long long kInfinity = 2147483647;
      vector<long long> distance_to(static_cast<size_t>(n) + 1, kInfinity);
      distance_to[static_cast<size_t>(source)] = 0;

      // 目前是 Bellman-Ford：鬆弛 n 輪，O(nm)，本題會超時。
      // TODO：換成優先佇列版 Dijkstra。
      //   1. 用 priority_queue<pair<long long,int>, ..., greater<>> 當小根堆，
      //      推入 (距離, 節點)。
      //   2. 每次取出堆頂；若取出的距離大於已記錄的距離就跳過——
      //      這是「惰性刪除」，避免實作 decrease-key。
      //   3. 否則鬆弛所有出邊，變短就更新並推入新項目。
      //   正確性前提是邊權非負：第一次被取出時的距離必定已是最短。
      for (int round = 0; round < n; ++round) {
          for (int u = 1; u <= n; ++u) {
              if (distance_to[static_cast<size_t>(u)] >= kInfinity) { continue; }
              for (const auto& [v, w] : adjacency[static_cast<size_t>(u)]) {
                  const long long candidate = distance_to[static_cast<size_t>(u)] + w;
                  if (candidate < distance_to[static_cast<size_t>(v)]) {
                      distance_to[static_cast<size_t>(v)] = candidate;
                  }
              }
          }
      }

      for (int i = 1; i <= n; ++i) { cout << distance_to[static_cast<size_t>(i)] << " \n"[i == n]; }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // Dijkstra + 優先佇列。邊權非負是正確性的前提。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, source;
      if (!(cin >> n >> m >> source)) { return 0; }
      vector<vector<pair<int, long long>>> adjacency(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int u, v;
          long long w;
          cin >> u >> v >> w;
          adjacency[static_cast<size_t>(u)].push_back({v, w});
      }

      const long long kInfinity = 2147483647;
      vector<long long> distance_to(static_cast<size_t>(n) + 1, kInfinity);
      priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> frontier;
      distance_to[static_cast<size_t>(source)] = 0;
      frontier.push({0, source});
      while (!frontier.empty()) {
          const auto [d, node] = frontier.top();
          frontier.pop();
          if (d > distance_to[static_cast<size_t>(node)]) { continue; }  // 過期的舊項目
          for (const auto& [next, weight] : adjacency[static_cast<size_t>(node)]) {
              const long long candidate = d + weight;
              if (candidate < distance_to[static_cast<size_t>(next)]) {
                  distance_to[static_cast<size_t>(next)] = candidate;
                  frontier.push({candidate, next});
              }
          }
      }
      for (int i = 1; i <= n; ++i) { cout << distance_to[static_cast<size_t>(i)] << " \n"[i == n]; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4779
external_platform: 洛谷
external_problem_id: P4779
external_title: '【模板】單源最短路徑（標準版）'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

Dijkstra 的每一個實作細節都對應一個理論前提。特別記住「邊權非負」這個條件——它是整個貪心的地基。
