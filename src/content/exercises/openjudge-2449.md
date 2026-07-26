---
id: openjudge-2449
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2449 Remmarguts' Date
chapter: 3
section: '3.8'
kind: external-oj
difficulty: 4
topics: [k-th-shortest-path, a-star, dijkstra]
prerequisites: [priority-queue, shortest-path]
statement: >-
  給定帶正權的有向圖、起點 S、終點 T 與整數 K，求從 S 到 T 的第 K 短路徑長度。
  路徑可以重複經過頂點與邊；即使長度相同，只要行走序列不同仍視為不同路徑。
constraints:
  - 1 <= N <= 1000
  - 0 <= M <= 100000
  - 1 <= 邊權 <= 100
  - 1 <= K <= 1000
input_format: 第一行 N、M；接著 M 行為有向邊 A、B、T；最後一行為 S、T、K。
output_format: 輸出第 K 短路徑長度；不存在時輸出 -1。
samples:
  - input: |
      2 2
      1 2 5
      2 1 4
      1 2 2
    output: '14'
    explanation: 第一短路是直接走 1→2，長度 5；第二短路是 1→2→1→2，長度 5+4+5=14。
core_knowledge:
  - 在反向圖以 Dijkstra 計算每點到終點的精確最短距離
  - 以 g+h 為鍵的 A* 可依完整路徑長度順序取出終點狀態
  - 每個頂點最多展開 K 次即可處理可重複頂點的路徑
judgment: 起點等於終點時，長度為零、沒有使用邊的空路徑不算題目要求的路徑，因此需尋找下一個實際回到終點的路徑。
hints:
  - 先把所有邊反向，從 T 求到各點的最短距離 h；h 為無限的點不可能走到 T。
  - 搜尋狀態保存目前點與已走長度 g，優先佇列以 g+h 排序；h 不會高估剩餘成本。
  - 某點第 r 次出隊代表抵達它的第 r 個候選前綴；當 T 第 K 次出隊時，該 g 即答案。
solution_outline: >-
  在反向圖由 T 跑 Dijkstra 得到 h。接著由 S 做 A*，佇列元素為 (g+h,g,node)。
  每次取出後增加該點出隊次數；超過 K 次不展開。當 T 第 K 次出隊時回傳 g。
  若 S=T，先把 K 加一以略過空路徑。
proof_or_invariant: >-
  h(v) 是 v 到 T 的真實最短距離，因此一致且不高估：對任一邊 v→u，h(v)<=w(v,u)+h(u)。
  所以 A* 取出完整抵達 T 的狀態時，其 g 按非遞減順序排列。每條可行路徑都對應搜尋樹中唯一的邊序列；
  同長度的不同序列仍是不同狀態，故第 K 次取出 T 恰為第 K 短路。若某點已取出 K 次，
  任何更晚抵達該點的前綴都不可能參與前 K 條到 T 的路徑，停止展開是安全的。
complexity:
  time: O((M+N) log N + KM log(KN))
  space: O(M + KN)
common_errors:
  - 直接使用從 S 出發的最短距離當啟發函數
  - 以 visited 布林值禁止重複頂點，因而漏掉可重複經過的路徑
  - S=T 時把空路徑錯算成第一短路
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Edge {
      int to;
      int weight;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      cin >> n >> m;
      vector<vector<Edge>> graph(n), reverse_graph(n);
      for (int i = 0; i < m; ++i) {
          int from, to, weight;
          cin >> from >> to >> weight;
          --from;
          --to;
          graph[from].push_back({to, weight});
          reverse_graph[to].push_back({from, weight});
      }
      int start, target, k;
      cin >> start >> target >> k;
      --start;
      --target;
      // TODO：反向 Dijkstra 求 h，再以 g+h 做可重複狀態的 A*。
      (void)graph;
      (void)reverse_graph;
      (void)start;
      (void)target;
      (void)k;
      cout << -1 << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Edge {
      int to;
      int weight;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      cin >> n >> m;
      vector<vector<Edge>> graph(n), reverse_graph(n);
      for (int i = 0; i < m; ++i) {
          int from, to, weight;
          cin >> from >> to >> weight;
          --from;
          --to;
          graph[from].push_back({to, weight});
          reverse_graph[to].push_back({from, weight});
      }
      int start, target, k;
      cin >> start >> target >> k;
      --start;
      --target;

      const long long inf = numeric_limits<long long>::max() / 4;
      vector<long long> heuristic(n, inf);
      using DijkstraState = pair<long long, int>;
      priority_queue<DijkstraState, vector<DijkstraState>, greater<DijkstraState>> dijkstra;
      heuristic[target] = 0;
      dijkstra.push({0, target});
      while (!dijkstra.empty()) {
          const auto [distance, node] = dijkstra.top();
          dijkstra.pop();
          if (distance != heuristic[node]) continue;
          for (const Edge& edge : reverse_graph[node]) {
              const long long next_distance = distance + edge.weight;
              if (next_distance < heuristic[edge.to]) {
                  heuristic[edge.to] = next_distance;
                  dijkstra.push({next_distance, edge.to});
              }
          }
      }
      if (heuristic[start] == inf) {
          cout << -1 << '\n';
          return 0;
      }
      if (start == target) ++k;

      using SearchState = tuple<long long, long long, int>;
      priority_queue<SearchState, vector<SearchState>, greater<SearchState>> pending;
      vector<int> pop_count(n, 0);
      pending.push({heuristic[start], 0, start});
      while (!pending.empty()) {
          const auto [estimate, distance, node] = pending.top();
          pending.pop();
          (void)estimate;
          ++pop_count[node];
          if (node == target && pop_count[node] == k) {
              cout << distance << '\n';
              return 0;
          }
          if (pop_count[node] > k) continue;
          for (const Edge& edge : graph[node]) {
              if (heuristic[edge.to] == inf) continue;
              const long long next_distance = distance + edge.weight;
              pending.push({next_distance + heuristic[edge.to], next_distance, edge.to});
          }
      }
      cout << -1 << '\n';
  }
external_url: http://bailian.openjudge.cn/practice/2449/
external_platform: OpenJudge 百練
external_problem_id: '2449'
external_title: Remmarguts' Date
external_relation: original
source_book_pages: [142, 143, 257]
source_pdf_pages: [160, 161, 275]
review_status: verified
---

A\* 在這裡不是「找到一條路就停止」，而是利用精確下界把所有抵達終點的路徑依長度逐一取出。
