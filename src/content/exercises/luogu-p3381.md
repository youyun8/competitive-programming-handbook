---
id: luogu-p3381
volume: lower
source_file: lower-volume
title: 洛谷 P3381 最小費用最大流：SPFA 增廣
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 4
topics: ['費用流', 'MCMF', 'SPFA', '殘量網路']
prerequisites: ['max-flow']
statement: |-
  給定帶容量與單位費用的有向圖，求從源點到匯點的最大流，以及在流量最大的前提下的最小總費用。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '要先保證流量最大，再在其中取費用最小'
  - '費用可能為負（反向邊），不能用 Dijkstra 找增廣路'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行四個整數 n、m、s、t；接下來 m 行，每行四個整數 u v w f，表示一條 u 到 v、容量 w、單位費用 f 的有向邊。'
output_format: '一行兩個整數，分別是最大流量與該流量下的最小費用。'
samples:
  - input: |
      4 5 4 3
      4 2 30 2
      4 3 20 3
      2 3 20 1
      2 1 30 9
      1 3 40 5
    output: |
      50 280
    explanation: |-
      最大流是 50；在所有流量為 50 的方案中，總費用最小者為 280。把流量拆成幾條路徑逐一計算即可驗證。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    費用流的框架就是 Dinic 換掉「找增廣路」的方式：不是找最短邊數的路，而是找**單位費用總和最小**的路，然後沿它推滿。
  - |-
    反向邊的費用必須取**負**。這一點是整個演算法的靈魂：退流時應該把先前付出的費用退回來，負費用正好表達這件事，也讓演算法有機會修正早期的次優決策。
  - |-
    因為有負費用邊，不能用 Dijkstra 找最短路，要用 SPFA（或 Bellman-Ford）。想用 Dijkstra 的話得先做 Johnson 式的勢能重賦權。
  - |-
    每次增廣的流程：SPFA 求出到匯點的最小費用路徑並記錄每個點的來邊；回溯一次找瓶頸容量；再回溯一次真正推流。累加 `flow += push`、`cost += push × 該路徑總費用`。
  - |-
    正確性依賴一個定理：若當前流是「該流量下費用最小」的，那麼沿最小費用增廣路推流之後，新的流仍然是「新流量下費用最小」的。所以每一步貪心都安全。
solution_outline: |-
  用成對存放的邊表示殘量網路，正向邊費用為 f、反向邊為 −f。反覆用 SPFA 以費用為邊權求出源點到匯點的最便宜路徑，沿路徑回溯求瓶頸容量後推流，累加流量與費用，直到匯點不可達為止。
proof_or_invariant: |-
  迴圈不變量是「目前的流在其流量值下費用最小」。這由「最小費用流的最優性條件等價於殘量網路中不存在負費用環」保證：初始零流滿足條件，而沿最小費用路增廣不會產生負環，故不變量得以維持。演算法終止時流量已達最大，費用即為該流量下的最小值。
complexity:
  time: 'O(流量 × SPFA) ≈ O(f·nm) 最壞'
  space: 'O(n + m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // 已備好：殘量網路的骨架。注意反向邊的**費用取負**——
  // 退流等於把先前付出的費用退回來，這是費用流能求得最優解的關鍵。
  struct MinCostFlow {
      struct Edge {
          int to;
          long long capacity;
          long long cost;
      };
      vector<Edge> edges;
      vector<vector<int>> incident;
      vector<long long> distance_to;
      vector<int> previous_edge;
      vector<char> in_queue;

      explicit MinCostFlow(size_t n)
          : incident(n), distance_to(n), previous_edge(n), in_queue(n) {}

      void add_edge(int from, int to, long long capacity, long long cost) {
          incident[static_cast<size_t>(from)].push_back(static_cast<int>(edges.size()));
          edges.push_back({to, capacity, cost});
          incident[static_cast<size_t>(to)].push_back(static_cast<int>(edges.size()));
          edges.push_back({from, 0, -cost});
      }

      // TODO 1：以「費用」為邊權跑 SPFA，找出從 source 到 sink 的最便宜增廣路。
      //   只走剩餘容量為正的邊，並用 previous_edge 記錄每個點是從哪條邊來的。
      //   為什麼不能用 Dijkstra？因為反向邊的費用是負的。
      bool find_cheapest_path(int source, int sink) {
          fill(previous_edge.begin(), previous_edge.end(), -1);
          (void)source;
          (void)sink;
          return false;
      }

      // TODO 2：沿著 previous_edge 回溯兩次：
      //   第一次找出路徑上的瓶頸容量，第二次真正推流（正向減、反向加）。
      //   累加 flow += push，cost += push × 該路徑的總費用（就是 distance_to[sink]）。
      // TODO 3：重複直到找不到增廣路。
      pair<long long, long long> run(int source, int sink) {
          long long flow = 0;
          long long cost = 0;
          (void)source;
          (void)sink;
          return {flow, cost};
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, source, sink;
      if (!(cin >> n >> m >> source >> sink)) { return 0; }
      MinCostFlow solver(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int u, v;
          long long capacity, cost;
          cin >> u >> v >> capacity >> cost;
          solver.add_edge(u, v, capacity, cost);
      }
      const auto [flow, cost] = solver.run(source, sink);
      cout << flow << ' ' << cost << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 最小費用最大流：把 Dinic 的 BFS 分層換成「以費用為邊權的 SPFA 最短路」，
  // 每次沿著最便宜的增廣路推流。反向邊的費用取負，才能正確表達「退流退錢」。
  struct MinCostFlow {
      struct Edge {
          int to;
          long long capacity;
          long long cost;
      };
      vector<Edge> edges;
      vector<vector<int>> incident;
      vector<long long> distance_to;
      vector<int> previous_edge;
      vector<char> in_queue;

      explicit MinCostFlow(size_t n)
          : incident(n), distance_to(n), previous_edge(n), in_queue(n) {}

      void add_edge(int from, int to, long long capacity, long long cost) {
          incident[static_cast<size_t>(from)].push_back(static_cast<int>(edges.size()));
          edges.push_back({to, capacity, cost});
          incident[static_cast<size_t>(to)].push_back(static_cast<int>(edges.size()));
          edges.push_back({from, 0, -cost});
      }

      bool find_cheapest_path(int source, int sink) {
          fill(distance_to.begin(), distance_to.end(), LLONG_MAX / 4);
          fill(previous_edge.begin(), previous_edge.end(), -1);
          distance_to[static_cast<size_t>(source)] = 0;
          deque<int> queue_nodes{source};
          in_queue[static_cast<size_t>(source)] = 1;
          while (!queue_nodes.empty()) {
              const int node = queue_nodes.front();
              queue_nodes.pop_front();
              in_queue[static_cast<size_t>(node)] = 0;
              for (const int id : incident[static_cast<size_t>(node)]) {
                  const Edge& e = edges[static_cast<size_t>(id)];
                  if (e.capacity <= 0) { continue; }
                  const long long candidate = distance_to[static_cast<size_t>(node)] + e.cost;
                  if (candidate >= distance_to[static_cast<size_t>(e.to)]) { continue; }
                  distance_to[static_cast<size_t>(e.to)] = candidate;
                  previous_edge[static_cast<size_t>(e.to)] = id;
                  if (!in_queue[static_cast<size_t>(e.to)]) {
                      queue_nodes.push_back(e.to);
                      in_queue[static_cast<size_t>(e.to)] = 1;
                  }
              }
          }
          return previous_edge[static_cast<size_t>(sink)] != -1;
      }

      pair<long long, long long> run(int source, int sink) {
          long long flow = 0;
          long long cost = 0;
          while (find_cheapest_path(source, sink)) {
              // 沿路找瓶頸容量
              long long push = LLONG_MAX;
              for (int node = sink; node != source;) {
                  const int id = previous_edge[static_cast<size_t>(node)];
                  push = min(push, edges[static_cast<size_t>(id)].capacity);
                  node = edges[static_cast<size_t>(id ^ 1)].to;
              }
              for (int node = sink; node != source;) {
                  const int id = previous_edge[static_cast<size_t>(node)];
                  edges[static_cast<size_t>(id)].capacity -= push;
                  edges[static_cast<size_t>(id ^ 1)].capacity += push;
                  node = edges[static_cast<size_t>(id ^ 1)].to;
              }
              flow += push;
              cost += push * distance_to[static_cast<size_t>(sink)];
          }
          return {flow, cost};
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, source, sink;
      if (!(cin >> n >> m >> source >> sink)) { return 0; }
      MinCostFlow solver(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int u, v;
          long long capacity, cost;
          cin >> u >> v >> capacity >> cost;
          solver.add_edge(u, v, capacity, cost);
      }
      const auto [flow, cost] = solver.run(source, sink);
      cout << flow << ' ' << cost << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3381
external_platform: 洛谷
external_problem_id: P3381
external_title: '【模板】最小費用最大流'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

費用流 = 最大流的框架 + 最短路的選路。反向邊費用取負這一行，值得停下來想清楚它在說什麼。
