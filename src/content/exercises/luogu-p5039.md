---
id: luogu-p5039
volume: lower
source_file: lower-volume
original_label: '洛谷 P5039'
title: '洛谷 P5039 最小生成樹'
chapter: 10
section: '10.12'
kind: external-oj
difficulty: 4
topics: ['Kruskal 性質', '最小割']
prerequisites: ['max-flow']
statement: |-
  可反覆選一條邊、令其餘邊權減一；求讓指定邊必在最小生成樹中的最少操作。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      4 6 1
      1 2 2
      1 3 2
      1 4 3
      2 3 2
      2 4 4
      3 4 5
    output: |-
      1
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['Kruskal 性質', '最小割']
judgment: |-
  全體同減不影響比較，一次操作等價於只把所選邊加一。
hints:
  - '先辨識核心轉換：Kruskal 性質、最小割。'
  - '全體同減不影響比較，一次操作等價於只把所選邊加一。'
  - '依「對每條權值不大於指定邊的其他邊，設刪除代價 w0-w+1；以指定邊兩端為源匯求無向最小割。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  對每條權值不大於指定邊的其他邊，設刪除代價 w0-w+1；以指定邊兩端為源匯求無向最小割。
proof_or_invariant: |-
  指定邊必選當且僅當其兩端在權值≤w0 的其他邊中不連通；提升一條邊至 >w0 的最小次數就是容量，故問題正是最小割。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(N^2M)'
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

  struct Dinic {
      struct Edge { int to; long long cap; };
      vector<Edge> edges;
      vector<vector<int>> graph;
      vector<int> level;
      vector<size_t> next_edge;

      explicit Dinic(int vertex_count)
          : graph(static_cast<size_t>(vertex_count)),
            level(static_cast<size_t>(vertex_count)),
            next_edge(static_cast<size_t>(vertex_count)) {}

      void add_edge(int from, int to, long long cap) {
          graph[static_cast<size_t>(from)].push_back(static_cast<int>(edges.size()));
          edges.push_back({to, cap});
          graph[static_cast<size_t>(to)].push_back(static_cast<int>(edges.size()));
          edges.push_back({from, cap});
      }
      bool bfs(int source, int sink) {
          fill(level.begin(), level.end(), -1);
          queue<int> pending;
          pending.push(source);
          level[static_cast<size_t>(source)] = 0;
          while (!pending.empty()) {
              const int node = pending.front();
              pending.pop();
              for (const int id : graph[static_cast<size_t>(node)]) {
                  const Edge& edge = edges[static_cast<size_t>(id)];
                  if (edge.cap > 0 && level[static_cast<size_t>(edge.to)] < 0) {
                      level[static_cast<size_t>(edge.to)] = level[static_cast<size_t>(node)] + 1;
                      pending.push(edge.to);
                  }
              }
          }
          return level[static_cast<size_t>(sink)] >= 0;
      }
      long long dfs(int node, int sink, long long limit) {
          if (node == sink) return limit;
          for (size_t& index = next_edge[static_cast<size_t>(node)];
               index < graph[static_cast<size_t>(node)].size(); ++index) {
              const int id = graph[static_cast<size_t>(node)][index];
              Edge& edge = edges[static_cast<size_t>(id)];
              if (edge.cap <= 0 ||
                  level[static_cast<size_t>(edge.to)] != level[static_cast<size_t>(node)] + 1) continue;
              const long long sent = dfs(edge.to, sink, min(limit, edge.cap));
              if (sent == 0) continue;
              edge.cap -= sent;
              edges[static_cast<size_t>(id ^ 1)].cap += sent;
              return sent;
          }
          return 0;
      }
      long long max_flow(int source, int sink) {
          long long result = 0;
          while (bfs(source, sink)) {
              fill(next_edge.begin(), next_edge.end(), 0);
              while (const long long sent = dfs(source, sink, numeric_limits<long long>::max() / 4)) {
                  result += sent;
              }
          }
          return result;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, chosen;
      cin >> n >> m >> chosen;
      struct InputEdge { int from; int to; long long weight; };
      vector<InputEdge> input(static_cast<size_t>(m));
      for (InputEdge& edge : input) cin >> edge.from >> edge.to >> edge.weight;
      const InputEdge target = input[static_cast<size_t>(chosen - 1)];
      Dinic flow(n + 1);
      for (int i = 0; i < m; ++i) {
          const InputEdge& edge = input[static_cast<size_t>(i)];
          if (i == chosen - 1 || edge.weight > target.weight) continue;
          flow.add_edge(edge.from, edge.to, target.weight - edge.weight + 1);
      }
      cout << flow.max_flow(target.from, target.to) << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P5039
external_platform: '洛谷'
external_problem_id: 'P5039'
external_title: '最小生成樹'
external_relation: original
source_book_pages: [679]
source_pdf_pages: [309]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
