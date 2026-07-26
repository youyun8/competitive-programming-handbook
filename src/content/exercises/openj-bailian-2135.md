---
id: openj-bailian-2135
volume: lower
source_file: lower-volume
original_label: 'OpenJudge 百練 2135'
title: 'OpenJudge 百練 2135 Farm Tour'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 3
topics: ['最小費用流', '兩條邊不重複路徑']
prerequisites: ['min-cost-flow']
statement: |-
  從 1 到 N 再返回 1，任何無向道路至多走一次，求最短總路程。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      4 5
      1 2 1
      2 3 1
      3 4 1
      1 3 2
      2 4 2
    output: |-
      6
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最小費用流', '兩條邊不重複路徑']
judgment: |-
  一次往返等價於兩條由 1 到 N 的邊不重複路徑。
hints:
  - '先辨識核心轉換：最小費用流、兩條邊不重複路徑。'
  - '一次往返等價於兩條由 1 到 N 的邊不重複路徑。'
  - '依「每條無向邊兩向容量一、費用為長度，送兩單位最小費流。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  每條無向邊兩向容量一、費用為長度，送兩單位最小費流。
proof_or_invariant: |-
  兩條路徑可串成往返；反之往返依方向切成兩條 1→N 路徑，邊不重複限制由容量一保證。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(FVE)'
  space: 'O(N+M)'
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
      explicit MinCostFlow(int vertex_count) : graph(static_cast<size_t>(vertex_count)) {}
      void add_edge(int from, int to, int cap, long long cost) {
          graph[static_cast<size_t>(from)].push_back(static_cast<int>(edges.size()));
          edges.push_back({to, cap, cost});
          graph[static_cast<size_t>(to)].push_back(static_cast<int>(edges.size()));
          edges.push_back({from, 0, -cost});
      }
      pair<int, long long> run(int source, int sink, int wanted) {
          int flow = 0;
          long long cost = 0;
          const long long infinity = numeric_limits<long long>::max() / 4;
          while (flow < wanted) {
              vector<long long> distance(graph.size(), infinity);
              vector<int> previous(graph.size(), -1);
              vector<char> in_queue(graph.size(), 0);
              queue<int> pending;
              distance[static_cast<size_t>(source)] = 0;
              pending.push(source);
              in_queue[static_cast<size_t>(source)] = 1;
              while (!pending.empty()) {
                  const int node = pending.front();
                  pending.pop();
                  in_queue[static_cast<size_t>(node)] = 0;
                  for (const int id : graph[static_cast<size_t>(node)]) {
                      const Edge& edge = edges[static_cast<size_t>(id)];
                      if (edge.cap == 0 ||
                          distance[static_cast<size_t>(edge.to)] <=
                              distance[static_cast<size_t>(node)] + edge.cost) continue;
                      distance[static_cast<size_t>(edge.to)] =
                          distance[static_cast<size_t>(node)] + edge.cost;
                      previous[static_cast<size_t>(edge.to)] = id;
                      if (!in_queue[static_cast<size_t>(edge.to)]) {
                          in_queue[static_cast<size_t>(edge.to)] = 1;
                          pending.push(edge.to);
                      }
                  }
              }
              if (previous[static_cast<size_t>(sink)] < 0) break;
              int add = wanted - flow;
              for (int node = sink; node != source;) {
                  const int id = previous[static_cast<size_t>(node)];
                  add = min(add, edges[static_cast<size_t>(id)].cap);
                  node = edges[static_cast<size_t>(id ^ 1)].to;
              }
              for (int node = sink; node != source;) {
                  const int id = previous[static_cast<size_t>(node)];
                  edges[static_cast<size_t>(id)].cap -= add;
                  edges[static_cast<size_t>(id ^ 1)].cap += add;
                  node = edges[static_cast<size_t>(id ^ 1)].to;
              }
              flow += add;
              cost += static_cast<long long>(add) * distance[static_cast<size_t>(sink)];
          }
          return {flow, cost};
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      cin >> n >> m;
      MinCostFlow flow(n + 1);
      for (int i = 0; i < m; ++i) {
          int from, to;
          long long length;
          cin >> from >> to >> length;
          flow.add_edge(from, to, 1, length);
          flow.add_edge(to, from, 1, length);
      }
      const auto [sent, answer] = flow.run(1, n, 2);
      if (sent == 2) cout << answer << '\n';
  }
external_url: http://bailian.openjudge.cn/practice/2135/
external_platform: 'OpenJudge 百練'
external_problem_id: '2135'
external_title: 'Farm Tour'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
