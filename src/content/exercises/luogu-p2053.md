---
id: luogu-p2053
volume: lower
source_file: lower-volume
original_label: '洛谷 P2053'
title: '洛谷 P2053 修車'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 4
topics: ['最小費用流', '排程位置']
prerequisites: ['min-cost-flow']
statement: |-
  把 N 輛車分派給 M 位技師並決定順序，使平均完成時間最小。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      2 2
      3 2
      1 4
    output: |-
      1.50
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最小費用流', '排程位置']
judgment: |-
  技師的倒數第 k 個維修位置分配車 i，對完成時間總和貢獻 k×t[i][j]。
hints:
  - '先辨識核心轉換：最小費用流、排程位置。'
  - '技師的倒數第 k 個維修位置分配車 i，對完成時間總和貢獻 k×t[i][j]。'
  - '依「車節點到每個「技師×位置」節點連單位容量費用邊，位置連匯，送 N 單位流。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  車節點到每個「技師×位置」節點連單位容量費用邊，位置連匯，送 N 單位流。
proof_or_invariant: |-
  每個完美指派唯一決定各技師順序；費用展開後正是完成時間總和，故最小費流最優。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(N^3M^2)'
  space: 'O(N^2M)'
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
      struct Edge { int to; int cap; int cost; };
      vector<Edge> edges;
      vector<vector<int>> graph;
      explicit MinCostFlow(int count) : graph(static_cast<size_t>(count)) {}
      void add_edge(int from, int to, int cap, int cost) {
          graph[static_cast<size_t>(from)].push_back(static_cast<int>(edges.size()));
          edges.push_back({to, cap, cost});
          graph[static_cast<size_t>(to)].push_back(static_cast<int>(edges.size()));
          edges.push_back({from, 0, -cost});
      }
      int run(int source, int sink, int wanted) {
          int total_cost = 0;
          const int infinity = numeric_limits<int>::max() / 4;
          for (int sent = 0; sent < wanted; ++sent) {
              vector<int> distance(graph.size(), infinity), previous(graph.size(), -1);
              vector<char> queued(graph.size(), 0);
              queue<int> pending;
              distance[static_cast<size_t>(source)] = 0;
              pending.push(source);
              queued[static_cast<size_t>(source)] = 1;
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
              for (int node = sink; node != source;) {
                  const int id = previous[static_cast<size_t>(node)];
                  edges[static_cast<size_t>(id)].cap -= 1;
                  edges[static_cast<size_t>(id ^ 1)].cap += 1;
                  node = edges[static_cast<size_t>(id ^ 1)].to;
              }
              total_cost += distance[static_cast<size_t>(sink)];
          }
          return total_cost;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int worker_count, car_count;
      cin >> worker_count >> car_count;
      vector<vector<int>> repair(static_cast<size_t>(car_count),
          vector<int>(static_cast<size_t>(worker_count)));
      for (auto& row : repair) for (int& value : row) cin >> value;
      const int source = car_count + worker_count * car_count;
      const int sink = source + 1;
      MinCostFlow flow(sink + 1);
      for (int car = 0; car < car_count; ++car) flow.add_edge(source, car, 1, 0);
      for (int worker = 0; worker < worker_count; ++worker) {
          for (int position = 1; position <= car_count; ++position) {
              const int node = car_count + worker * car_count + position - 1;
              flow.add_edge(node, sink, 1, 0);
              for (int car = 0; car < car_count; ++car) {
                  flow.add_edge(car, node, 1,
                      position * repair[static_cast<size_t>(car)][static_cast<size_t>(worker)]);
              }
          }
      }
      const int answer = flow.run(source, sink, car_count);
      cout << fixed << setprecision(2)
           << static_cast<double>(answer) / static_cast<double>(car_count) << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2053
external_platform: '洛谷'
external_problem_id: 'P2053'
external_title: '修車'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
