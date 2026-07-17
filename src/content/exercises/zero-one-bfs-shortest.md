---
id: zero-one-bfs-shortest
volume: upper
source_file: upper-volume
title: 0-1 BFS 最短路
chapter: 3
section: '3.7'
kind: practice
difficulty: 2
topics:
  - deque
  - bfs
  - shortest-path
  - 0-1-bfs
prerequisites:
  - deque
  - graphs
  - bfs
statement: 給定 n 個點 m 條邊的無向圖，每條邊權為 0 或 1。求從起點 s 到終點 t 的最短距離。
constraints:
  - 1 <= n <= 200000
  - 1 <= m <= 500000
input_format: 第一行為 n m s t。接下來 m 行各為 u v w（w 為 0 或 1）。
output_format: 輸出最短距離；若不可達輸出 -1。
samples:
  - input: |
      4 4 1 4
      1 2 0
      1 3 1
      2 3 0
      3 4 1
    output: |
      1
    explanation: 1->2 (0) ->3 (0) ->4 (1)，總距離 1。
hints:
  - 邊權為 0 時由佇列前端加入；為 1 時由佇列尾端加入。
  - 這樣保證 deque 中的距離值單調遞增。
solution_outline: 以 deque 維護 BFS frontier，邊權 0 放隊首、邊權 1 放隊尾。第一次到達每個節點時即為最短距離。
proof_or_invariant: deque 中節點的距離不嚴格嚴格遞增。邊權為 0 時距離不變，放前面；邊權為 1 時距離增加 1，放後面。
complexity:
  time: O(n + m)
  space: O(n + m)
cpp_solution: |
  #include <deque>
  #include <iostream>
  #include <limits>
  #include <vector>

  struct Edge {
      int to = 0;
      int weight = 0;
  };

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0, m = 0, s = 0, t = 0;
      std::cin >> n >> m >> s >> t;
      std::vector<std::vector<Edge>> g(n + 1);
      for (int i = 0; i < m; ++i) {
          int u = 0, v = 0, w = 0;
          std::cin >> u >> v >> w;
          g[u].push_back({v, w});
          g[v].push_back({u, w});
      }
      const int infinity = std::numeric_limits<int>::max();
      std::vector<int> dist(n + 1, infinity);
      std::deque<int> dq;
      dist[s] = 0;
      dq.push_front(s);
      while (!dq.empty()) {
          int u = dq.front(); dq.pop_front();
          for (const Edge& e : g[u]) {
              const int next_distance = dist[u] + e.weight;
              if (next_distance >= dist[e.to]) { continue; }
              dist[e.to] = next_distance;
              if (e.weight == 0) { dq.push_front(e.to); }
              else { dq.push_back(e.to); }
          }
      }
      std::cout << (dist[t] == infinity ? -1 : dist[t]) << "\n";
  }
source_book_pages:
  - 97
  - 149
source_pdf_pages:
  - 115
  - 167
review_status: verified
external_url: https://www.spoj.com/problems/KATHTHI/
external_platform: SPOJ
external_problem_id: KATHTHI
external_title: KATHTHI
external_relation: related
---
