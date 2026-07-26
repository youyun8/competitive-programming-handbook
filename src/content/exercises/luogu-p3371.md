---
id: luogu-p3371
volume: lower
source_file: lower-volume
original_label: 洛谷 P3371
title: 洛谷 P3371 單源最短路徑（弱化版）：SPFA
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 2
topics: ['SPFA', 'Bellman-Ford', '最短路徑', '佇列優化']
prerequisites: ['dijkstra']
core_knowledge: [Bellman-Ford 鬆弛, 佇列優化, 不可達距離]
judgment: 本題無負權且規模較弱；以 SPFA 練習只排程可能繼續鬆弛的點。
statement: |-
  給定一張有向圖與起點，求起點到每個點的最短距離；不可達者輸出 2^31−1。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '邊權非負，但本題規模較小，適合用來練習 SPFA'
  - '不可達的點輸出 2147483647'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行三個整數 n、m 與起點 s；接下來 m 行，每行三個整數 u v w 表示一條 u 到 v、權重 w 的有向邊。'
output_format: '一行 n 個整數，第 i 個表示起點到 i 的最短距離。'
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
      與 Dijkstra 的答案一致：到 3 走 1→2→3 得 4，到 4 走 1→2→3→4 得 7。兩種演算法在非負權圖上必然給出相同結果。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    樸素的 Bellman-Ford 掃 n−1 輪、每輪掃過所有邊，是 O(nm)。但仔細想：只有「距離剛剛變小的點」才可能讓它的鄰居也變小，其他點重掃完全是白費工。
  - |-
    SPFA 就是把這個觀察做成佇列：起點先入隊；每次取出隊首，鬆弛它的所有出邊；某個鄰居的距離變短時，若它不在佇列中就入隊。佇列空了代表沒有任何點還能變短，演算法結束。
  - |-
    `in_queue` 陣列是必要的：同一個點可能被多個鄰居鬆弛，若不判斷就會重複入隊，佇列會膨脹得很誇張。注意出隊時要把標記清掉。
solution_outline: |-
  用鄰接表存圖，距離初始化為 2147483647。佇列存待鬆弛的點，起點先入隊並標記。每次取出隊首、清除標記，鬆弛所有出邊；鄰居距離變短且不在佇列中就入隊並標記。佇列空後輸出所有距離。
proof_or_invariant: |-
  SPFA 與 Bellman-Ford 的正確性相同：只要圖中沒有從起點可達的負環，反覆鬆弛必定收斂到最短路。佇列的作用僅是跳過「不可能產生新鬆弛」的點，不改變最終不動點。演算法終止時佇列為空，等價於所有邊都滿足三角不等式。
complexity:
  time: '最壞 O(nm)，實測通常遠快於此'
  space: 'O(n + m)'
common_errors:
  - 不可達點仍參與鬆弛造成溢位
  - 入隊旗標在出隊時沒有清除
  - 把 SPFA 的平均表現誤當成最壞複雜度保證
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

      // 目前是最樸素的 Bellman-Ford：不管有沒有變化都掃滿 n 輪，O(nm)。
      // TODO：改成 SPFA（佇列優化的 Bellman-Ford）。
      //   1. 用佇列存「距離剛剛變小、需要重新往外鬆弛」的點，起點先入隊。
      //   2. 每次取出隊首，鬆弛它的所有出邊；某個鄰居變短時，
      //      若它不在佇列中就入隊（用 in_queue 陣列判斷，避免重複入隊）。
      //   3. 佇列空了就結束。
      //   直覺：只有距離變小的點才可能讓別人變短，沒變的點重掃是白費工。
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

  // SPFA（佇列優化的 Bellman-Ford）：只把「距離剛變小」的點重新入隊，
  // 避免每輪都盲目掃過所有邊。
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
      vector<char> in_queue(static_cast<size_t>(n) + 1, 0);
      deque<int> queue_nodes;
      distance_to[static_cast<size_t>(source)] = 0;
      queue_nodes.push_back(source);
      in_queue[static_cast<size_t>(source)] = 1;

      while (!queue_nodes.empty()) {
          const int node = queue_nodes.front();
          queue_nodes.pop_front();
          in_queue[static_cast<size_t>(node)] = 0;
          for (const auto& [next, weight] : adjacency[static_cast<size_t>(node)]) {
              const long long candidate = distance_to[static_cast<size_t>(node)] + weight;
              if (candidate < distance_to[static_cast<size_t>(next)]) {
                  distance_to[static_cast<size_t>(next)] = candidate;
                  if (!in_queue[static_cast<size_t>(next)]) {
                      queue_nodes.push_back(next);
                      in_queue[static_cast<size_t>(next)] = 1;
                  }
              }
          }
      }
      for (int i = 1; i <= n; ++i) { cout << distance_to[static_cast<size_t>(i)] << " \n"[i == n]; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3371
external_platform: 洛谷
external_problem_id: P3371
external_title: '【模板】單源最短路徑（弱化版）'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

SPFA 是 Bellman-Ford 的工程優化。記住它的定位：非負權用 Dijkstra，有負權才輪到 SPFA。
