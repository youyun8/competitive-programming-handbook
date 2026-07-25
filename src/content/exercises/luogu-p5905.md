---
id: luogu-p5905
volume: lower
source_file: lower-volume
title: 洛谷 P5905 全源最短路：Johnson 重賦權
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 4
topics: ['Johnson 演算法', '重賦權', '勢能', '全源最短路']
prerequisites: ['dijkstra']
statement: |-
  給定一張可能含負權邊的有向圖，求每一對點之間的最短路；若存在負環則輸出 −1。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '邊權可能為負，但若有負環要輸出 −1'
  - 'n 較大時 Floyd 的 O(n³) 太慢'
  - '不可達視為 10^9'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；接下來 m 行，每行三個整數 u v w 表示一條有向邊。'
output_format: '若有負環輸出 −1；否則輸出 n 行，第 i 行是 Σ j·dist(i, j)，不可達的 dist 視為 10^9。'
samples:
  - input: |
      5 7
      1 2 4
      1 4 10
      2 3 7
      4 5 3
      4 2 -2
      3 4 -3
      5 3 4
    output: |
      128
      1000000072
      999999978
      1000000026
      1000000014
    explanation: |-
      圖中有負權邊但沒有負環。不可達的點以 10^9 計入，所以多數行的數值都很大——這正是題目定義的計分方式。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    Floyd 是 O(n³)，n 大就不行；Dijkstra 快但不能處理負權；Bellman-Ford 能處理負權但每個起點都要 O(nm)。Johnson 的想法是把負權「消掉」，讓 Dijkstra 能用。
  - |-
    關鍵是**勢能重賦權**：先求出一組 h[v]，把每條邊的權重改成 w′ = w + h[u] − h[v]。任何一條路徑 u→…→v 的總權重會變成「原本的總權重 + h[u] − h[v]」——中間項全部消掉了。因為只差一個與路徑無關的常數，最短路是哪一條完全不變。
  - |-
    h 要取什麼？取「從一個虛擬源點（連向所有點、權重 0）出發的最短路」。此時三角不等式保證 h[v] <= h[u] + w，移項就得到 w′ = w + h[u] − h[v] >= 0——正是 Dijkstra 需要的非負條件。
  - |-
    虛擬源點不必真的建出來：直接把所有點的初始距離設成 0 並全部入隊跑 SPFA 即可，效果相同。這一步順便偵測負環（某點邊數超過 n 就輸出 −1）。
  - |-
    最後別忘了把勢能扣回來還原真實距離：dist(s, t) = dist′(s, t) − h[s] + h[t]。這一步漏掉是最常見的錯誤。
solution_outline: |-
  先用 SPFA（等價於從虛擬源點出發）求勢能 h 並偵測負環，有負環直接輸出 −1。接著把邊權重賦為 w + h[u] − h[v]（保證非負），對每個起點各跑一次 Dijkstra，最後用 dist′ − h[s] + h[t] 還原真實距離並依題目要求加權求和。
proof_or_invariant: |-
  重賦權後任一條路徑 p: s → … → t 的總權重恆為「原權重 + h[s] − h[t]」，因為中間節點的勢能兩兩相消。由於這個修正量只與端點有關、與路徑選擇無關，最短路的排序完全保持不變。而三角不等式 h[v] <= h[u] + w 恰好保證每條邊的新權重非負，Dijkstra 的貪心前提因此成立。
complexity:
  time: 'O(nm log n)'
  space: 'O(n + m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      struct Edge {
          int to;
          long long weight;
      };
      vector<vector<Edge>> adjacency(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int u, v;
          long long w;
          cin >> u >> v >> w;
          adjacency[static_cast<size_t>(u)].push_back({v, w});
      }

      // TODO 1：求勢能。加一個虛擬源點連向所有點（權重 0），跑 SPFA 得到
      //   potential[v]。過程中若某點的最短路邊數超過 n，代表有負環，輸出 −1。
      //   實作上不必真的建虛擬點：直接把所有點的初始距離設成 0、全部入隊即可。
      vector<long long> potential(static_cast<size_t>(n) + 1, 0);

      // TODO 2：重賦權。把邊權改成 w' = w + potential[u] − potential[v]。
      //   由三角不等式 potential[v] <= potential[u] + w 可知 w' >= 0，
      //   而任一條路徑的總權重只變動「起點與終點勢能之差」這個常數，
      //   所以最短路的「是哪一條」完全不變。
      // TODO 3：對每個起點各跑一次 Dijkstra（此時邊權已非負），
      //   再把勢能扣回來還原真實距離：dist = dist' − potential[s] + potential[t]。
      //   不可達的點輸出 10^9。最後每個起點輸出 Σ j·dist(i, j)。
      const long long kInfinity = 1000000000;
      (void)adjacency;
      (void)potential;
      for (int source = 1; source <= n; ++source) {
          long long total = 0;
          for (int target = 1; target <= n; ++target) {
              total += static_cast<long long>(target) * (source == target ? 0 : kInfinity);
          }
          cout << total << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // Johnson 全源最短路：先用 Bellman-Ford 從虛擬源點求出勢能 h，
  // 把邊權改成 w' = w + h[u] − h[v]（保證非負且不改變最短路的相對優劣），
  // 再從每個點各跑一次 Dijkstra，最後把勢能扣回來。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      struct Edge {
          int to;
          long long weight;
      };
      vector<vector<Edge>> adjacency(static_cast<size_t>(n) + 1);
      vector<array<long long, 3>> raw(static_cast<size_t>(m));
      for (auto& e : raw) {
          cin >> e[0] >> e[1] >> e[2];
          adjacency[static_cast<size_t>(e[0])].push_back({static_cast<int>(e[1]), e[2]});
      }

      // 虛擬源點 0 連向每個點、權重 0；用 SPFA 求勢能並偵測負環。
      vector<long long> potential(static_cast<size_t>(n) + 1, 0);
      vector<int> edge_count(static_cast<size_t>(n) + 1, 0);
      vector<char> in_queue(static_cast<size_t>(n) + 1, 0);
      deque<int> queue_nodes;
      for (int i = 1; i <= n; ++i) {
          queue_nodes.push_back(i);
          in_queue[static_cast<size_t>(i)] = 1;
      }
      while (!queue_nodes.empty()) {
          const int node = queue_nodes.front();
          queue_nodes.pop_front();
          in_queue[static_cast<size_t>(node)] = 0;
          for (const Edge& e : adjacency[static_cast<size_t>(node)]) {
              const long long candidate = potential[static_cast<size_t>(node)] + e.weight;
              if (candidate >= potential[static_cast<size_t>(e.to)]) { continue; }
              potential[static_cast<size_t>(e.to)] = candidate;
              edge_count[static_cast<size_t>(e.to)] = edge_count[static_cast<size_t>(node)] + 1;
              if (edge_count[static_cast<size_t>(e.to)] > n) { cout << -1 << '\n'; return 0; }
              if (!in_queue[static_cast<size_t>(e.to)]) {
                  queue_nodes.push_back(e.to);
                  in_queue[static_cast<size_t>(e.to)] = 1;
              }
          }
      }

      const long long kInfinity = 1000000000;
      for (int source = 1; source <= n; ++source) {
          vector<long long> distance_to(static_cast<size_t>(n) + 1, LLONG_MAX / 4);
          priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> frontier;
          distance_to[static_cast<size_t>(source)] = 0;
          frontier.push({0, source});
          while (!frontier.empty()) {
              const auto [d, node] = frontier.top();
              frontier.pop();
              if (d > distance_to[static_cast<size_t>(node)]) { continue; }
              for (const Edge& e : adjacency[static_cast<size_t>(node)]) {
                  // 重賦權後的邊權必定非負，Dijkstra 才成立。
                  const long long adjusted = e.weight + potential[static_cast<size_t>(node)] -
                                             potential[static_cast<size_t>(e.to)];
                  if (d + adjusted < distance_to[static_cast<size_t>(e.to)]) {
                      distance_to[static_cast<size_t>(e.to)] = d + adjusted;
                      frontier.push({distance_to[static_cast<size_t>(e.to)], e.to});
                  }
              }
          }
          long long total = 0;
          for (int target = 1; target <= n; ++target) {
              long long value;
              if (distance_to[static_cast<size_t>(target)] >= LLONG_MAX / 8) {
                  value = kInfinity;
              } else {
                  // 扣回勢能還原成真實最短路長度。
                  value = distance_to[static_cast<size_t>(target)] -
                          potential[static_cast<size_t>(source)] +
                          potential[static_cast<size_t>(target)];
              }
              total += static_cast<long long>(target) * value;
          }
          cout << total << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5905
external_platform: 洛谷
external_problem_id: P5905
external_title: '【模板】全源最短路（Johnson）'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

Johnson 是「先改造問題、再套用更強工具」的漂亮範例。勢能的想法在費用流裡還會再出現一次。
