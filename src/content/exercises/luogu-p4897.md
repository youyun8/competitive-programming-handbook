---
id: luogu-p4897
volume: lower
source_file: lower-volume
original_label: '洛谷 P4897'
title: '洛谷 P4897 最小割樹'
chapter: 10
section: '10.12'
kind: external-oj
difficulty: 5
topics: ['Gomory-Hu 樹', '最大流']
prerequisites: ['max-flow']
statement: |-
  無向帶權圖中，多次詢問任意兩點間最小割。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3 5
      0 1 2
      1 2 2
      3 1 3
      3 2 1
      0 2 1
      3
      0 3
      1 3
      1 2
    output: |-
      3
      4
      4
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['Gomory-Hu 樹', '最大流']
judgment: |-
  每次最大流前必須還原容量；頂點編號為 0..n。
hints:
  - '先辨識核心轉換：Gomory-Hu 樹、最大流。'
  - '每次最大流前必須還原容量；頂點編號為 0..n。'
  - '依「以 Gomory-Hu 父陣列做 n 次最大流建割等價樹；查詢取樹路徑最小邊。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  以 Gomory-Hu 父陣列做 n 次最大流建割等價樹；查詢取樹路徑最小邊。
proof_or_invariant: |-
  Gomory-Hu 定理保證樹上任意兩點路徑最小邊權等於原圖兩點最小割。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(n×最大流+qn)'
  space: 'O(n+m)'
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
      struct Edge { int to; long long cap; long long initial; };
      vector<Edge> edges;
      vector<vector<int>> graph;
      vector<int> level;
      vector<size_t> next_edge;

      explicit Dinic(int vertex_count)
          : graph(static_cast<size_t>(vertex_count)),
            level(static_cast<size_t>(vertex_count)),
            next_edge(static_cast<size_t>(vertex_count)) {}
      void add_undirected(int from, int to, long long cap) {
          graph[static_cast<size_t>(from)].push_back(static_cast<int>(edges.size()));
          edges.push_back({to, cap, cap});
          graph[static_cast<size_t>(to)].push_back(static_cast<int>(edges.size()));
          edges.push_back({from, cap, cap});
      }
      void restore() {
          for (Edge& edge : edges) edge.cap = edge.initial;
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
          restore();
          long long result = 0;
          while (bfs(source, sink)) {
              fill(next_edge.begin(), next_edge.end(), 0);
              while (const long long sent = dfs(source, sink, numeric_limits<long long>::max() / 4)) {
                  result += sent;
              }
          }
          bfs(source, sink);
          return result;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      cin >> n >> m;
      const int vertex_count = n + 1;
      Dinic flow(vertex_count);
      for (int i = 0; i < m; ++i) {
          int from, to;
          long long cap;
          cin >> from >> to >> cap;
          flow.add_undirected(from, to, cap);
      }
      vector<int> parent(static_cast<size_t>(vertex_count), 0);
      vector<long long> cut_value(static_cast<size_t>(vertex_count), 0);
      for (int source = 1; source < vertex_count; ++source) {
          const int sink = parent[static_cast<size_t>(source)];
          const long long value = flow.max_flow(source, sink);
          for (int node = source + 1; node < vertex_count; ++node) {
              if (parent[static_cast<size_t>(node)] == sink &&
                  flow.level[static_cast<size_t>(node)] >= 0) {
                  parent[static_cast<size_t>(node)] = source;
              }
          }
          if (flow.level[static_cast<size_t>(parent[static_cast<size_t>(sink)])] >= 0) {
              parent[static_cast<size_t>(source)] = parent[static_cast<size_t>(sink)];
              parent[static_cast<size_t>(sink)] = source;
              cut_value[static_cast<size_t>(source)] = cut_value[static_cast<size_t>(sink)];
              cut_value[static_cast<size_t>(sink)] = value;
          } else {
              cut_value[static_cast<size_t>(source)] = value;
          }
      }
      vector<vector<pair<int, long long>>> tree(static_cast<size_t>(vertex_count));
      for (int node = 1; node < vertex_count; ++node) {
          const int next = parent[static_cast<size_t>(node)];
          const long long weight = cut_value[static_cast<size_t>(node)];
          tree[static_cast<size_t>(node)].push_back({next, weight});
          tree[static_cast<size_t>(next)].push_back({node, weight});
      }
      int query_count;
      cin >> query_count;
      while (query_count-- > 0) {
          int source, sink;
          cin >> source >> sink;
          vector<long long> best(static_cast<size_t>(vertex_count), -1);
          queue<int> pending;
          pending.push(source);
          best[static_cast<size_t>(source)] = numeric_limits<long long>::max();
          while (!pending.empty()) {
              const int node = pending.front();
              pending.pop();
              for (const auto& [next, weight] : tree[static_cast<size_t>(node)]) {
                  if (best[static_cast<size_t>(next)] >= 0) continue;
                  best[static_cast<size_t>(next)] =
                      min(best[static_cast<size_t>(node)], weight);
                  pending.push(next);
              }
          }
          cout << best[static_cast<size_t>(sink)] << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P4897
external_platform: '洛谷'
external_problem_id: 'P4897'
external_title: '最小割樹'
external_relation: original
source_book_pages: [679]
source_pdf_pages: [309]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
