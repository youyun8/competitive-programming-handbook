---
id: luogu-p1144
volume: lower
source_file: lower-volume
original_label: 洛谷 P1144
title: 洛谷 P1144 最短路計數：BFS 分層
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 2
topics: [BFS, 最短路徑, 路徑計數]
prerequisites: [dijkstra]
core_knowledge: [無權圖分層, 最短路 DAG, 同層累加]
judgment: 無權圖中 BFS 首次到達即確定距離；再次由前一層到達則增加方案數。
statement: 給定可能有自環、重邊的無向無權圖，輸出從 1 到每個點的最短路條數模 100003。
constraints: ['可能有自環與重邊', '答案模 100003']
input_format: 第一行 n、m；接著 m 行無向邊 u、v。
output_format: 共 n 行，第 i 行是 1 到 i 的最短路數。
samples:
  - input: |-
      5 7
      1 2
      1 3
      2 4
      3 4
      2 3
      4 5
      4 5
    output: |-
      1
      1
      1
      2
      4
    explanation: 4 有兩條長度 2 的最短路；兩條平行的 4–5 邊各形成方案，所以 5 有四條。
hints:
  - BFS 佇列依距離不下降處理節點。
  - 首次到達 v 時令 count[v]=count[u]；若 dist[v]=dist[u]+1 則再累加。
  - 重邊代表不同路徑，不能先去重。
solution_outline: 從 1 BFS，維護距離與計數；發現新點時設定距離與方案，沿另一條最短層邊到已發現點時累加。
proof_or_invariant: BFS 處理 u 時，所有到 u 的最短路已由上一層完整累加。每條通往下一層 v 的邊把這些路徑唯一延長；只累加 dist[v]=dist[u]+1 的邊，故不漏不重且不含非最短路。
complexity: { time: 'O(n+m)', space: 'O(n+m)' }
common_errors: [把重邊去重, 同距離而非下一層就累加, 首次發現節點後忘記入隊]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { int n, m; cin >> n >> m; /* TODO：BFS 同時計數。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, m; if (!(cin >> n >> m)) return 0;
      vector<vector<int>> graph(static_cast<size_t>(n + 1));
      for (int i = 0; i < m; ++i) {
          int u, v; cin >> u >> v;
          graph[static_cast<size_t>(u)].push_back(v);
          graph[static_cast<size_t>(v)].push_back(u);
      }
      const int mod = 100003;
      vector<int> dist(static_cast<size_t>(n + 1), -1), ways(static_cast<size_t>(n + 1), 0);
      queue<int> pending; dist[1] = 0; ways[1] = 1; pending.push(1);
      while (!pending.empty()) {
          const int node = pending.front(); pending.pop();
          for (const int next : graph[static_cast<size_t>(node)]) {
              if (dist[static_cast<size_t>(next)] == -1) {
                  dist[static_cast<size_t>(next)] = dist[static_cast<size_t>(node)] + 1;
                  pending.push(next);
              }
              if (dist[static_cast<size_t>(next)] == dist[static_cast<size_t>(node)] + 1)
                  ways[static_cast<size_t>(next)] =
                      (ways[static_cast<size_t>(next)] + ways[static_cast<size_t>(node)]) % mod;
          }
      }
      for (int i = 1; i <= n; ++i) cout << ways[static_cast<size_t>(i)] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1144
external_platform: 洛谷
external_problem_id: P1144
external_title: 最短路計數
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

計數不是另一套演算法；它只是把最短路 DAG 上所有前驅的方案加起來。
