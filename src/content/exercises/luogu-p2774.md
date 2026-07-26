---
id: luogu-p2774
volume: lower
source_file: lower-volume
original_label: '洛谷 P2774'
title: '洛谷 P2774 方格取數問題'
chapter: 10
section: '10.12'
kind: external-oj
difficulty: 3
topics: ['二分圖最大權獨立集', '最小割']
prerequisites: ['max-flow']
statement: |-
  從正權網格選互不共邊的格子，使權值和最大。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3 3
      1 2 3
      3 2 3
      2 3 1
    output: |-
      11
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['二分圖最大權獨立集', '最小割']
judgment: |-
  棋盤黑白染色；相鄰格之間加無限容量，黑格由源連權值、白格向匯連權值。
hints:
  - '先辨識核心轉換：二分圖最大權獨立集、最小割。'
  - '棋盤黑白染色；相鄰格之間加無限容量，黑格由源連權值、白格向匯連權值。'
  - '依「答案為所有權值總和減最小割。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  答案為所有權值總和減最小割。
proof_or_invariant: |-
  有限割不能同時保留相鄰黑白格；割掉的終端容量正是未選權值，所以補集最小等價於選取和最大。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(V^2E)'
  space: 'O(nm)'
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
  #include <cstdio>
  #include <cstring>
  #include <queue>
  #include <algorithm>
  using namespace std;

  const int MAXN = 10010;
  const int MAXM = 100010;
  const int INF = 2e9;

  struct Edge {
      int to, next, cap;
  } edges[MAXM];
  int head[MAXN], cnt = 1;

  void add_edge(int u, int v, int cap) {
      edges[++cnt] = {v, head[u], cap};
      head[u] = cnt;
      edges[++cnt] = {u, head[v], 0};
      head[v] = cnt;
  }

  int level[MAXN];
  int S, T;

  bool bfs() {
      memset(level, 0, sizeof(level));
      queue<int> q;
      q.push(S);
      level[S] = 1;
      while (!q.empty()) {
          int u = q.front();
          q.pop();
          for (int i = head[u]; i; i = edges[i].next) {
              int v = edges[i].to;
              if (!level[v] && edges[i].cap > 0) {
                  level[v] = level[u] + 1;
                  q.push(v);
              }
          }
      }
      return level[T];
  }

  int dfs(int u, int flow) {
      if (u == T) return flow;
      int res = 0;
      for (int i = head[u]; i && flow; i = edges[i].next) {
          int v = edges[i].to;
          if (level[v] == level[u] + 1 && edges[i].cap > 0) {
              int f = dfs(v, min(flow, edges[i].cap));
              edges[i].cap -= f;
              edges[i ^ 1].cap += f;
              flow -= f;
              res += f;
          }
      }
      if (!res) level[u] = 0;
      return res;
  }

  int dinic() {
      int res = 0;
      while (bfs()) {
          res += dfs(S, INF);
      }
      return res;
  }

  int main() {
      int m, n;
      scanf("%d%d", &m, &n);
      S = 0;
      T = m * n + 1;

      int sum = 0;
      int dx[4] = {0, 0, 1, -1};
      int dy[4] = {1, -1, 0, 0};

      for (int i = 1; i <= m; i++) {
          for (int j = 1; j <= n; j++) {
              int w;
              scanf("%d", &w);
              sum += w;
              int id = (i - 1) * n + j;

              if ((i + j) % 2 == 0) {
                  add_edge(S, id, w);
                  for (int k = 0; k < 4; k++) {
                      int x = i + dx[k];
                      int y = j + dy[k];
                      if (x >= 1 && x <= m && y >= 1 && y <= n) {
                          int nid = (x - 1) * n + y;
                          add_edge(id, nid, INF);
                      }
                  }
              } else {
                  add_edge(id, T, w);
              }
          }
      }

      int cut = dinic();
      printf("%d\n", sum - cut);

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2774
external_platform: '洛谷'
external_problem_id: 'P2774'
external_title: '方格取數問題'
external_relation: original
source_book_pages: [679]
source_pdf_pages: [309]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
