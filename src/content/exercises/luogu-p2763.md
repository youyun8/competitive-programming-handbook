---
id: luogu-p2763
volume: lower
source_file: lower-volume
original_label: '洛谷 P2763'
title: '洛谷 P2763 試題庫問題'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 3
topics: ['二分圖 b-matching', '最大流']
prerequisites: ['bipartite']
statement: |-
  每題可屬多類；各類要求固定題數，求不重複選題方案。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3 15
      3 3 4
      2 1 2
      1 3
      1 3
      1 3
      1 3
      3 1 2 3
      2 2 3
      2 1 3
      1 2
      1 2
      2 1 2
      2 1 3
      2 1 2
      1 1
      3 1 2 3
    output: |-
      1: 1 6 8
      2: 7 9 10
      3: 2 3 4 5
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['二分圖 b-matching', '最大流']
judgment: |-
  題目容量一，類別到匯的容量是該類需求。
hints:
  - '先辨識核心轉換：二分圖 b-matching、最大流。'
  - '題目容量一，類別到匯的容量是該類需求。'
  - '依「源連每題、題目連其可屬類別、類別連匯；滿流後由已用邊輸出各類題號。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  源連每題、題目連其可屬類別、類別連匯；滿流後由已用邊輸出各類題號。
proof_or_invariant: |-
  整數流把每題指派至至多一類並滿足類別數量；反之任何方案可構造同值流。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(V^2E)'
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
  #include <iostream>
  #include <vector>
  #include <queue>
  #include <cstring>
  #include <algorithm>
  using namespace std;

  const int INF = 1e9;
  const int MAXN = 1050; // n <= 1000, k <= 20, so total nodes <= n + k + 2 <= 1022

  struct Edge {
      int to, cap, rev;
  };

  vector<Edge> graph[MAXN];
  int level[MAXN];
  int iter[MAXN];

  void add_edge(int from, int to, int cap) {
      graph[from].push_back({to, cap, (int)graph[to].size()});
      graph[to].push_back({from, 0, (int)graph[from].size() - 1});
  }

  void bfs(int s) {
      memset(level, -1, sizeof(level));
      queue<int> q;
      level[s] = 0;
      q.push(s);
      while (!q.empty()) {
          int v = q.front(); q.pop();
          for (auto &e : graph[v]) {
              if (e.cap > 0 && level[e.to] < 0) {
                  level[e.to] = level[v] + 1;
                  q.push(e.to);
              }
          }
      }
  }

  int dfs(int v, int t, int f) {
      if (v == t) return f;
      for (int &i = iter[v]; i < graph[v].size(); i++) {
          Edge &e = graph[v][i];
          if (e.cap > 0 && level[v] < level[e.to]) {
              int d = dfs(e.to, t, min(f, e.cap));
              if (d > 0) {
                  e.cap -= d;
                  graph[e.to][e.rev].cap += d;
                  return d;
              }
          }
      }
      return 0;
  }

  int max_flow(int s, int t) {
      int flow = 0;
      while (true) {
          bfs(s);
          if (level[t] < 0) return flow;
          memset(iter, 0, sizeof(iter));
          int f;
          while ((f = dfs(s, t, INF)) > 0) {
              flow += f;
          }
      }
  }

  int main() {
      int k, n;
      cin >> k >> n;
      int total_need = 0;
      vector<int> need(k + 1);
      for (int i = 1; i <= k; i++) {
          cin >> need[i];
          total_need += need[i];
      }

      // Node indices: source:0, problems:1..n, types:n+1..n+k, sink:n+k+1
      int source = 0, sink = n + k + 1;

      // Add edges from source to problems
      for (int i = 1; i <= n; i++) {
          add_edge(source, i, 1);
      }

      // Add edges from types to sink
      for (int i = 1; i <= k; i++) {
          add_edge(n + i, sink, need[i]);
      }

      // Read problem types and add edges from problems to types
      for (int i = 1; i <= n; i++) {
          int p;
          cin >> p;
          for (int j = 0; j < p; j++) {
              int type;
              cin >> type;
              add_edge(i, n + type, 1);
          }
      }

      int flow = max_flow(source, sink);
      if (flow != total_need) {
          cout << "No Solution!" << endl;
          return 0;
      }

      // Collect assignments
      vector<vector<int>> assignments(k + 1);
      for (int i = 1; i <= n; i++) {
          for (auto &e : graph[i]) {
              if (e.to >= n + 1 && e.to <= n + k && e.cap == 0) {
                  int type = e.to - n;
                  assignments[type].push_back(i);
              }
          }
      }

      // Output
      for (int i = 1; i <= k; i++) {
          cout << i << ": ";
          for (int j = 0; j < assignments[i].size(); j++) {
              if (j > 0) cout << " ";
              cout << assignments[i][j];
          }
          cout << endl;
      }

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2763
external_platform: '洛谷'
external_problem_id: 'P2763'
external_title: '試題庫問題'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
