---
id: luogu-p1345
volume: lower
source_file: lower-volume
original_label: '洛谷 P1345'
title: '洛谷 P1345 奶牛的電信'
chapter: 10
section: '10.12'
kind: external-oj
difficulty: 3
topics: ['點割', '拆點最大流']
prerequisites: ['max-flow']
statement: |-
  無向電腦網路中，求至少刪除多少個非端點，才能分離指定兩台電腦。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3 2 1 2
      1 3
      2 3
    output: |-
      1
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['點割', '拆點最大流']
judgment: |-
  每點拆成入、出點；一般點內邊容量一，兩端點容量無限。
hints:
  - '先辨識核心轉換：點割、拆點最大流。'
  - '每點拆成入、出點；一般點內邊容量一，兩端點容量無限。'
  - '依「原無向邊建兩個方向的無限容量邊，求指定端點間最大流。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  原無向邊建兩個方向的無限容量邊，求指定端點間最大流。
proof_or_invariant: |-
  任何有限割只能切一般點的內邊，容量等於刪點數；點割也可形成同容量割，故最大流最小割即答案。
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

  const int MAXN = 110;
  const int INF = 1e9;

  struct Edge {
      int to, cap, rev;
  };

  vector<Edge> graph[2 * MAXN];
  int level[2 * MAXN];
  bool visited[2 * MAXN];

  void add_edge(int u, int v, int cap) {
      graph[u].push_back({v, cap, (int)graph[v].size()});
      graph[v].push_back({u, 0, (int)graph[u].size() - 1});
  }

  bool bfs(int s, int t) {
      memset(level, -1, sizeof(level));
      queue<int> q;
      level[s] = 0;
      q.push(s);

      while (!q.empty()) {
          int u = q.front();
          q.pop();

          for (const Edge& e : graph[u]) {
              if (level[e.to] < 0 && e.cap > 0) {
                  level[e.to] = level[u] + 1;
                  q.push(e.to);
              }
          }
      }

      return level[t] >= 0;
  }

  int dfs(int u, int t, int f) {
      if (u == t) return f;

      for (int i = 0; i < graph[u].size(); i++) {
          Edge& e = graph[u][i];
          if (level[e.to] == level[u] + 1 && e.cap > 0) {
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
      while (bfs(s, t)) {
          memset(visited, false, sizeof(visited));
          int f;
          while ((f = dfs(s, t, INF)) > 0) {
              flow += f;
          }
      }
      return flow;
  }

  int main() {
      int N, M, c1, c2;
      cin >> N >> M >> c1 >> c2;

      // 拆点：对于每个电脑i，添加边i->i+N，容量1
      for (int i = 1; i <= N; i++) {
          add_edge(i, i + N, 1);
      }

      // 添加原图的边
      for (int i = 0; i < M; i++) {
          int u, v;
          cin >> u >> v;
          // 从u的出点到v的入点，从v的出点到u的入点
          add_edge(u + N, v, INF);
          add_edge(v + N, u, INF);
      }

      // 源点是c1的出点(c1+N)，汇点是c2的入点(c2)
      int source = c1 + N;
      int sink = c2;
      int result = max_flow(source, sink);

      cout << result << endl;

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1345
external_platform: '洛谷'
external_problem_id: 'P1345'
external_title: '奶牛的電信'
external_relation: original
source_book_pages: [679]
source_pdf_pages: [309]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
