---
id: luogu-p2598
volume: lower
source_file: lower-volume
original_label: '洛谷 P2598'
title: '洛谷 P2598 狼和羊的故事'
chapter: 10
section: '10.12'
kind: external-oj
difficulty: 3
topics: ['網格最小割']
prerequisites: ['max-flow']
statement: |-
  在格地邊界增設最短籬笆，保持狼、羊領地並使兩者不連通。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      2 2

      2 2 

      1 1
    output: |-
      2
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['網格最小割']
judgment: |-
  狼格連源、羊格連匯無限容量；相鄰格間以容量一的雙向邊表示一段籬笆。
hints:
  - '先辨識核心轉換：網格最小割。'
  - '狼格連源、羊格連匯無限容量；相鄰格間以容量一的雙向邊表示一段籬笆。'
  - '依「對網格網路求最小割。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  對網格網路求最小割。
proof_or_invariant: |-
  有限割不會改變指定領地側別；每條跨側相鄰邊恰需一段籬笆，故割容量就是總長。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O((nm)^3)'
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
  #include<bits/stdc++.h>
  using namespace std;

  const int N = 100005;
  const int INF = 1e9;

  int n, m, s, t;
  int head[N], cnt = 1;
  int d[N];
  struct Edge {
      int to, next, v;
  } e[N << 1];

  void add(int x, int y, int w) {
      e[++cnt] = (Edge){y, head[x], w};
      head[x] = cnt;
      e[++cnt] = (Edge){x, head[y], 0};
      head[y] = cnt;
  }

  bool bfs() {
      queue<int> q;
      memset(d, 0, sizeof(d));
      d[s] = 1;
      q.push(s);
      while (!q.empty()) {
          int x = q.front();
          q.pop();
          for (int i = head[x]; i; i = e[i].next) {
              int y = e[i].to;
              if (e[i].v && !d[y]) {
                  d[y] = d[x] + 1;
                  q.push(y);
                  if (y == t) return true;
              }
          }
      }
      return false;
  }

  int dinic(int x, int flow) {
      if (x == t) return flow;
      int rest = flow;
      for (int i = head[x]; i && rest; i = e[i].next) {
          int y = e[i].to;
          if (e[i].v && d[y] == d[x] + 1) {
              int k = dinic(y, min(rest, e[i].v));
              if (!k) d[y] = 0;
              e[i].v -= k;
              e[i ^ 1].v += k;
              rest -= k;
          }
      }
      return flow - rest;
  }

  int a[105][105];
  int dx[] = {1, -1, 0, 0};
  int dy[] = {0, 0, 1, -1};

  inline int num(int i, int j) {
      return (i - 1) * m + j;
  }

  void build() {
      cin >> n >> m;
      s = n * m + 1;
      t = n * m + 2;
      for (int i = 1; i <= n; i++) {
          for (int j = 1; j <= m; j++) {
              cin >> a[i][j];
          }
      }
      for (int i = 1; i <= n; i++) {
          for (int j = 1; j <= m; j++) {
              if (a[i][j] == 1) {
                  add(s, num(i, j), INF);
              } else if (a[i][j] == 2) {
                  add(num(i, j), t, INF);
              }
          }
      }
      for (int i = 1; i <= n; i++) {
          for (int j = 1; j <= m; j++) {
              for (int k = 0; k < 4; k++) {
                  int tx = i + dx[k];
                  int ty = j + dy[k];
                  if (tx >= 1 && tx <= n && ty >= 1 && ty <= m) {
                      add(num(i, j), num(tx, ty), 1);
                  }
              }
          }
      }
  }

  int main() {
      build();
      int ans = 0, flow;
      while (bfs()) {
          while ((flow = dinic(s, INF))) {
              ans += flow;
          }
      }
      cout << ans << endl;
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2598
external_platform: '洛谷'
external_problem_id: 'P2598'
external_title: '狼和羊的故事'
external_relation: original
source_book_pages: [679]
source_pdf_pages: [309]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
