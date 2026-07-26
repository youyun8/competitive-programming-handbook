---
id: luogu-p4452
volume: lower
source_file: lower-volume
original_label: '洛谷 P4452'
title: '洛谷 P4452 航班安排'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 5
topics: ['時間 DAG', '最小費用流']
prerequisites: ['min-cost-flow']
statement: |-
  K 架同型飛機在時限內承接定時包機，可空載轉場並付費，求最大收益。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      1 1 1 10
      0
      0
      0 0 1 2 5
    output: |-
      5
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['時間 DAG', '最小費用流']
judgment: |-
  先 Floyd 求任意機場最短空載時間與對應最低費用；請求按時間形成 DAG。
hints:
  - '先辨識核心轉換：時間 DAG、最小費用流。'
  - '先 Floyd 求任意機場最短空載時間與對應最低費用；請求按時間形成 DAG。'
  - '依「每個請求拆成可選收益邊；建立基地出發、請求間可銜接、返回基地的費用邊，送至多 K 單位流。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  每個請求拆成可選收益邊；建立基地出發、請求間可銜接、返回基地的費用邊，送至多 K 單位流。
proof_or_invariant: |-
  每單位流是一架飛機的合法時間序列，費用等於空載成本減包機收益；反之任一排程可分解成這些路徑。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(N^3+KM^3)'
  space: 'O(M^2+N^2)'
cpp_skeleton: |-
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依卡片解法建立圖或狀態，完成增廣／動態規劃並輸出答案。
      return 0;
  }
cpp_solution: |-
  #if defined(__GNUC__)
  #pragma GCC diagnostic ignored "-Wconversion"
  #pragma GCC diagnostic ignored "-Wshadow"
  #pragma GCC diagnostic ignored "-Wunused-parameter"
  #pragma GCC diagnostic ignored "-Wunused-variable"
  #pragma GCC diagnostic ignored "-Wpedantic"
  #pragma GCC diagnostic ignored "-Wcomment"
  #pragma GCC diagnostic ignored "-Wsign-compare"
  #pragma GCC diagnostic ignored "-Wmisleading-indentation"
  #endif
  #include <bits/stdc++.h>
  using namespace std;

  struct MinCostFlow {
      struct Edge { int to; int cap; long long cost; };
      vector<Edge> edges;
      vector<vector<int>> graph;
      explicit MinCostFlow(int count) : graph(static_cast<size_t>(count)) {}
      void add_edge(int from, int to, int cap, long long cost) {
          graph[static_cast<size_t>(from)].push_back(static_cast<int>(edges.size()));
          edges.push_back({to, cap, cost});
          graph[static_cast<size_t>(to)].push_back(static_cast<int>(edges.size()));
          edges.push_back({from, 0, -cost});
      }
      long long run(int source, int sink, int wanted) {
          long long answer = 0;
          const long long infinity = numeric_limits<long long>::max() / 4;
          for (int sent = 0; sent < wanted; ++sent) {
              vector<long long> distance(graph.size(), infinity);
              vector<int> previous(graph.size(), -1);
              vector<char> queued(graph.size(), 0);
              queue<int> pending;
              distance[static_cast<size_t>(source)] = 0;
              queued[static_cast<size_t>(source)] = 1;
              pending.push(source);
              while (!pending.empty()) {
                  const int node = pending.front();
                  pending.pop();
                  queued[static_cast<size_t>(node)] = 0;
                  for (const int id : graph[static_cast<size_t>(node)]) {
                      const Edge& edge = edges[static_cast<size_t>(id)];
                      if (edge.cap == 0 ||
                          distance[static_cast<size_t>(edge.to)] <=
                              distance[static_cast<size_t>(node)] + edge.cost) continue;
                      distance[static_cast<size_t>(edge.to)] =
                          distance[static_cast<size_t>(node)] + edge.cost;
                      previous[static_cast<size_t>(edge.to)] = id;
                      if (!queued[static_cast<size_t>(edge.to)]) {
                          queued[static_cast<size_t>(edge.to)] = 1;
                          pending.push(edge.to);
                      }
                  }
              }
              if (previous[static_cast<size_t>(sink)] < 0) break;
              for (int node = sink; node != source;) {
                  const int id = previous[static_cast<size_t>(node)];
                  edges[static_cast<size_t>(id)].cap -= 1;
                  edges[static_cast<size_t>(id ^ 1)].cap += 1;
                  node = edges[static_cast<size_t>(id ^ 1)].to;
              }
              answer += distance[static_cast<size_t>(sink)];
          }
          return answer;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int airport_count, request_count, plane_count, end_time;
      cin >> airport_count >> request_count >> plane_count >> end_time;
      vector<vector<int>> travel_time(
          static_cast<size_t>(airport_count), vector<int>(static_cast<size_t>(airport_count)));
      vector<vector<int>> travel_cost = travel_time;
      for (auto& row : travel_time) for (int& value : row) cin >> value;
      for (auto& row : travel_cost) for (int& value : row) cin >> value;
      struct Request { int from; int to; int start; int finish; int profit; };
      vector<Request> requests(static_cast<size_t>(request_count));
      for (Request& request : requests) {
          cin >> request.from >> request.to >> request.start >> request.finish >> request.profit;
      }
      const int super_source = 0;
      const int base = 1;
      const int sink = 2 * request_count + 2;
      MinCostFlow flow(sink + 1);
      flow.add_edge(super_source, base, plane_count, 0);
      flow.add_edge(base, sink, plane_count, 0);
      for (int i = 0; i < request_count; ++i) {
          const Request& current = requests[static_cast<size_t>(i)];
          const int in_node = 2 * i + 2;
          const int out_node = in_node + 1;
          flow.add_edge(in_node, out_node, 1, -current.profit);
          if (travel_time[0][static_cast<size_t>(current.from)] <= current.start) {
              flow.add_edge(base, in_node, 1, travel_cost[0][static_cast<size_t>(current.from)]);
          }
          if (current.finish + travel_time[static_cast<size_t>(current.to)][0] <= end_time) {
              flow.add_edge(out_node, sink, 1, travel_cost[static_cast<size_t>(current.to)][0]);
          }
          for (int j = 0; j < request_count; ++j) {
              if (i == j) continue;
              const Request& next = requests[static_cast<size_t>(j)];
              if (current.finish +
                      travel_time[static_cast<size_t>(current.to)][static_cast<size_t>(next.from)] <=
                  next.start) {
                  flow.add_edge(out_node, 2 * j + 2, 1,
                      travel_cost[static_cast<size_t>(current.to)][static_cast<size_t>(next.from)]);
              }
          }
      }
      cout << -flow.run(super_source, sink, plane_count) << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P4452
external_platform: '洛谷'
external_problem_id: 'P4452'
external_title: '航班安排'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
