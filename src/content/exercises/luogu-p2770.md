---
id: luogu-p2770
volume: lower
source_file: lower-volume
original_label: '洛谷 P2770'
title: '洛谷 P2770 航空路線問題'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 5
topics: ['最大費用流', '點容量', '方案還原']
prerequisites: ['min-cost-flow']
statement: |-
  由最西城向東到最東城再向西返回，除起點外城市不重訪，求經過城市最多的路線並輸出。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      2 0
      West
      East
    output: |-
      No Solution!
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最大費用流', '點容量', '方案還原']
judgment: |-
  按東西順序定向航線；中間城市拆點容量一，兩端容量二。
hints:
  - '先辨識核心轉換：最大費用流、點容量、方案還原。'
  - '按東西順序定向航線；中間城市拆點容量一，兩端容量二。'
  - '依「送兩單位由西端到東端的最大費流，城市邊收益一；由已用邊還原兩路徑並反轉其中一條。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  送兩單位由西端到東端的最大費流，城市邊收益一；由已用邊還原兩路徑並反轉其中一條。
proof_or_invariant: |-
  兩條東向點不重複路徑拼成合法往返；任一合法往返亦可拆成此種流，收益就是不同城市數。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(VE^2)'
  space: 'O(V+E)'
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
      int add_edge(int from, int to, int cap, int cost) {
          const int id = static_cast<int>(edges.size());
          graph[static_cast<size_t>(from)].push_back(id);
          edges.push_back({to, cap, cost});
          graph[static_cast<size_t>(to)].push_back(id + 1);
          edges.push_back({from, 0, -cost});
          return id;
      }
      pair<int, int> run(int source, int sink, int wanted) {
          int flow = 0, cost = 0;
          const int infinity = numeric_limits<int>::max() / 4;
          while (flow < wanted) {
              vector<int> distance(graph.size(), infinity), previous(graph.size(), -1);
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
              ++flow;
              cost += distance[static_cast<size_t>(sink)];
          }
          return {flow, cost};
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, edge_count;
      cin >> n >> edge_count;
      vector<string> city(static_cast<size_t>(n) + 1);
      map<string, int> index;
      for (int i = 1; i <= n; ++i) {
          cin >> city[static_cast<size_t>(i)];
          index[city[static_cast<size_t>(i)]] = i;
      }
      const int source = 0, sink = 2 * n + 1;
      MinCostFlow network(sink + 1);
      network.add_edge(source, n + 1, 2, 0);
      network.add_edge(n, sink, 2, 0);
      for (int i = 1; i <= n; ++i) {
          network.add_edge(n + i, i, (i == 1 || i == n) ? 2 : 1, -1);
      }
      vector<tuple<int, int, int>> flight_edges;
      bool has_direct = false;
      for (int i = 0; i < edge_count; ++i) {
          string first, second;
          cin >> first >> second;
          int from = index[first], to = index[second];
          if (from > to) swap(from, to);
          if (from == 1 && to == n) has_direct = true;
          const int id = network.add_edge(from, n + to, 1, 0);
          flight_edges.push_back({from, to, id});
      }
      const auto [sent, cost] = network.run(source, sink, 2);
      if (sent == 2) {
          vector<vector<int>> used(static_cast<size_t>(n) + 1);
          for (const auto& [from, to, id] : flight_edges) {
              if (network.edges[static_cast<size_t>(id ^ 1)].cap > 0) {
                  used[static_cast<size_t>(from)].push_back(to);
              }
          }
          auto take_path = [&]() {
              vector<int> path{1};
              int node = 1;
              while (node != n) {
                  int next = used[static_cast<size_t>(node)].back();
                  used[static_cast<size_t>(node)].pop_back();
                  path.push_back(next);
                  node = next;
              }
              return path;
          };
          vector<int> outward = take_path();
          vector<int> homeward = take_path();
          cout << -cost - 2 << '\n';
          for (const int node : outward) cout << city[static_cast<size_t>(node)] << '\n';
          for (auto it = next(homeward.rbegin()); it != homeward.rend(); ++it) {
              cout << city[static_cast<size_t>(*it)] << '\n';
          }
      } else if (sent == 1 && has_direct) {
          cout << 2 << '\n' << city[1] << '\n' << city[static_cast<size_t>(n)]
               << '\n' << city[1] << '\n';
      } else {
          cout << "No Solution!\n";
      }
  }
external_url: https://www.luogu.com.cn/problem/P2770
external_platform: '洛谷'
external_problem_id: 'P2770'
external_title: '航空路線問題'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
