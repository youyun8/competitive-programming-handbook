---
id: luogu-p1038
volume: lower
source_file: lower-volume
original_label: 洛谷 P1038
title: 神經網路：依拓撲層次傳遞訊號
chapter: 10
section: '10.2'
kind: external-oj
difficulty: 3
topics: [topological-sort, directed-acyclic-graph, simulation]
prerequisites: [indegree, weighted-directed-graph]
statement: >-
  一個分層神經網路是有向無環圖。神經元 i 有狀態 c_i 與閾值 u_i；輸入層狀態由輸入給定，
  非輸入層起初為零。只有狀態大於零的神經元會沿邊 i→j 傳送 c_i*w_ij；非輸入神經元的
  最終狀態還要扣除自身閾值。請輸出所有狀態為正的輸出層神經元。
constraints:
  - 1 <= n <= 100
  - 狀態、閾值與邊權的絕對值不超過 1000
  - 圖按層連接，因此沒有有向環；任意兩點間至多一條邊
input_format: >-
  第一行 n p。接著 n 行依序給 c_i u_i；再接 p 行 i j w，表示 i 到 j 的權重為 w。
output_format: >-
  依編號遞增輸出每個狀態大於零的輸出層神經元「編號 狀態」；若沒有則輸出 NULL。
samples:
  - input: |
      5 6
      1 0
      1 0
      0 1
      0 1
      0 1
      1 3 1
      1 4 1
      1 5 1
      2 3 1
      2 4 1
      2 5 1
    output: |
      3 1
      4 1
      5 1
    explanation: 兩個輸入神經元各傳送 1；三個輸出神經元收到 2 再扣除閾值 1，狀態皆為 1。
core_knowledge:
  - 拓撲序保證處理神經元時所有上游訊號均已到達
  - 非輸入神經元可把狀態初始化為負閾值，再累加所有正狀態前驅的貢獻
  - 出度為零的點才是輸出層
judgment: 狀態等於零不會傳送也不輸出；負權邊可以使下游狀態降低。
hints:
  - 以入度辨認輸入層，以出度辨認輸出層。
  - 對非輸入層先令 state[i]=-threshold[i]，即可把公式化成單純累加。
  - Kahn 取出 u 時，僅當 state[u]>0 才沿每條出邊加入 state[u]*weight。
solution_outline: >-
  讀圖並保存原始入度與出度。將所有非輸入點的狀態改為負閾值，把輸入點放入佇列；
  依 Kahn 拓撲序處理，每取出正狀態點就向後繼累加加權訊號，不論是否傳訊都刪除其出邊。
  最後掃描出度為零且狀態為正的點。
proof_or_invariant: >-
  點 u 出隊時，其每個前驅都已處理，所以 state[u] 等於負閾值加上所有「狀態為正的前驅」
  傳來的加權訊號，正是模型定義；輸入點保留給定狀態而不扣閾值。處理 u 後此不變量傳給
  後繼。DAG 的拓撲歸納涵蓋全部點，因此最後篩出的輸出層狀態正確。
common_errors:
  - 對輸入層也扣除閾值
  - 狀態非正仍向後傳送訊號
  - 用入度為零判斷輸出層，方向顛倒
  - 只有正狀態時才減後繼入度，導致拓撲排序卡住
complexity: { time: O(n + p), space: O(n + p) }
cpp_skeleton: |
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  struct Edge { int to; int weight; };
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n = 0, p = 0;
      cin >> n >> p;
      vector<long long> state(static_cast<size_t>(n + 1));
      vector<int> threshold(static_cast<size_t>(n + 1));
      for (int i = 1; i <= n; ++i) cin >> state[static_cast<size_t>(i)] >> threshold[static_cast<size_t>(i)];
      vector<vector<Edge>> graph(static_cast<size_t>(n + 1));
      vector<int> indegree(static_cast<size_t>(n + 1), 0), outdegree(static_cast<size_t>(n + 1), 0);
      for (int e = 0; e < p; ++e) { int u = 0, v = 0, w = 0; cin >> u >> v >> w; graph[static_cast<size_t>(u)].push_back({v, w}); ++indegree[static_cast<size_t>(v)]; ++outdegree[static_cast<size_t>(u)]; }
      // TODO：初始化非輸入層並依拓撲序傳遞，最後輸出正狀態輸出層。
  }
cpp_solution: |
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  struct Edge { int to; int weight; };
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n = 0, p = 0;
      cin >> n >> p;
      vector<long long> state(static_cast<size_t>(n + 1));
      vector<int> threshold(static_cast<size_t>(n + 1));
      for (int i = 1; i <= n; ++i) cin >> state[static_cast<size_t>(i)] >> threshold[static_cast<size_t>(i)];
      vector<vector<Edge>> graph(static_cast<size_t>(n + 1));
      vector<int> indegree(static_cast<size_t>(n + 1), 0), outdegree(static_cast<size_t>(n + 1), 0);
      for (int e = 0; e < p; ++e) { int u = 0, v = 0, w = 0; cin >> u >> v >> w; graph[static_cast<size_t>(u)].push_back({v, w}); ++indegree[static_cast<size_t>(v)]; ++outdegree[static_cast<size_t>(u)]; }
      queue<int> ready;
      for (int i = 1; i <= n; ++i) {
          if (indegree[static_cast<size_t>(i)] == 0) ready.push(i);
          else state[static_cast<size_t>(i)] = -threshold[static_cast<size_t>(i)];
      }
      while (!ready.empty()) {
          const int u = ready.front();
          ready.pop();
          for (const Edge edge : graph[static_cast<size_t>(u)]) {
              if (state[static_cast<size_t>(u)] > 0) state[static_cast<size_t>(edge.to)] += state[static_cast<size_t>(u)] * edge.weight;
              if (--indegree[static_cast<size_t>(edge.to)] == 0) ready.push(edge.to);
          }
      }
      bool printed = false;
      for (int i = 1; i <= n; ++i) if (outdegree[static_cast<size_t>(i)] == 0 && state[static_cast<size_t>(i)] > 0) { cout << i << ' ' << state[static_cast<size_t>(i)] << '\n'; printed = true; }
      if (!printed) cout << "NULL\n";
  }
external_url: https://www.luogu.com.cn/problem/P1038
external_platform: Luogu
external_problem_id: P1038
external_title: '[NOIP 2003 提高組] 神經網路'
external_relation: original
source_book_pages: [610]
source_pdf_pages: [240]
review_status: verified
---

將閾值預先寫成負初值後，整個網路就只是 DAG 上的一次加權訊息傳播。
