---
id: luogu-p3731
volume: lower
source_file: lower-volume
original_label: '洛谷 P3731'
title: '洛谷 P3731 新型城市化'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 5
topics: ['二分圖最大匹配', '允許邊判定']
prerequisites: ['bipartite']
statement: |-
  已知「非伙伴」圖可二分，找出加入後會讓原圖最大團增加一的缺邊。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      5 3
      1 5
      2 4
      2 5
    output: |-
      2
      1 5
      2 4
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['二分圖最大匹配', '允許邊判定']
judgment: |-
  原圖可分成至多兩個團，所以補圖二分；原圖最大團對應補圖最大獨立集。
hints:
  - '先辨識核心轉換：二分圖最大匹配、允許邊判定。'
  - '原圖可分成至多兩個團，所以補圖二分；原圖最大團對應補圖最大獨立集。'
  - '依「在補圖求最大匹配與交錯結構；判定刪除哪條匹配候選邊會使最大匹配減一，再按字典序輸出。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  在補圖求最大匹配與交錯結構；判定刪除哪條匹配候選邊會使最大匹配減一，再按字典序輸出。
proof_or_invariant: |-
  加入原圖缺邊等於刪補圖邊；獨立集增加一恰等價於補圖最大匹配減一，交錯路判定精確刻畫此類邊。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(nm)'
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

  const int maxn = 1e4 + 114;
  const int maxm = 2e6 + 114;
  const int inf = 0x3f3f3f3f;

  int maxflow, vis[maxn], tot = 1, cnt;
  int s, t, n, m, Q, E;
  vector<int> edge[maxn], Road[maxn];
  int hd[maxn], road[maxn], dis[maxn];
  map<int, int> f[maxn];

  struct edge {
      int next, to, w;
  } e[maxm * 2];

  void add(int u, int v, int w) {
      e[++tot].to = v;
      f[u][v] = tot;
      e[tot].w = w;
      e[tot].next = hd[u];
      hd[u] = tot;
      e[++tot].to = u;
      e[tot].w = 0;
      e[tot].next = hd[v];
      hd[v] = tot;
  }

  bool bfs() {
      memset(dis, 0, sizeof(dis));
      dis[s] = 1;
      queue<int> Q;
      Q.push(s);
      while (!Q.empty()) {
          int u = Q.front();
          Q.pop();
          road[u] = hd[u];
          for (int i = hd[u]; i; i = e[i].next) {
              int v = e[i].to;
              if (!dis[v] && e[i].w) {
                  dis[v] = dis[u] + 1;
                  Q.push(v);
              }
          }
      }
      return dis[t] != 0;
  }

  int dinic(int now, int res) {
      if (now == t)
          return res;
      int tp = res;
      for (int i = road[now]; i; i = e[i].next) {
          int v = e[i].to;
          road[now] = i;
          if (dis[v] == dis[now] + 1 && e[i].w) {
              int k = min(e[i].w, tp);
              int del = dinic(v, k);
              e[i].w -= del;
              e[i ^ 1].w += del;
              tp -= del;
              if (!tp)
                  break;
          }
      }
      return res - tp;
  }

  int col[maxn], Use[maxn];

  void dfs(int u) {
      if (Use[u] == 1)
          return;
      Use[u] = 1;
      for (int v : edge[u]) {
          if (Use[v] == 0) {
              col[v] = col[u] ^ 1;
              dfs(v);
          }
      }
  }

  int dfsn[maxn], low[maxn], color[maxn], sum = 0, deep = 0;
  stack<int> S;
  int Vis[maxn], use[maxn];

  void paint(int u) {
      S.pop();
      color[u] = sum;
      Vis[u] = 0;
  }

  void tanjan(int u) {
      dfsn[u] = ++deep;
      low[u] = deep;
      Vis[u] = 1;
      use[u] = 1;
      S.push(u);
      for (int i = hd[u]; i; i = e[i].next) {
          if (e[i].w == 0)
              continue;
          int v = e[i].to;
          if (dfsn[v] == 0) {
              tanjan(v);
              low[u] = min(low[u], low[v]);
          } else {
              if (Vis[v] != 0) {
                  low[u] = min(low[u], low[v]);
              }
          }
      }
      if (dfsn[u] == low[u]) {
          sum++;
          while (S.top() != u) {
              paint(S.top());
          }
          paint(u);
      }
  }

  set<pair<int, int>> chifan;

  int main() {
      cin >> n >> m;
      for (int i = 1; i <= m; i++) {
          int u, v;
          cin >> u >> v;
          edge[u].push_back(v);
          edge[v].push_back(u);
      }

      for (int i = 1; i <= n; i++) {
          if (Use[i] == 0) {
              col[i] = 0;
              dfs(i);
          }
      }

      for (int i = 1; i <= n; i++) {
          if (col[i] == 0) {
              for (int nxt : edge[i]) {
                  Road[i].push_back(nxt);
                  add(i, nxt, 1);
              }
          }
      }

      s = n + 1, t = n + 2;
      for (int i = 1; i <= n; i++) {
          if (col[i] == 0)
              add(s, i, 1);
          else
              add(i, t, 1);
      }

      while (bfs()) {
          maxflow += dinic(s, inf);
      }

      for (int i = 1; i <= n + 2; i++) {
          if (use[i] == 0) {
              tanjan(i);
          }
      }

      for (int i = 1; i <= n; i++) {
          if (col[i] == 0) {
              for (int nxt : Road[i]) {
                  if (e[f[i][nxt]].w == 0 && color[i] != color[nxt]) {
                      chifan.insert(make_pair(min(i, nxt), max(i, nxt)));
                  }
              }
          }
      }

      cout << chifan.size() << '\n';
      for (auto out : chifan) {
          cout << out.first << ' ' << out.second << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3731
external_platform: '洛谷'
external_problem_id: 'P3731'
external_title: '新型城市化'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
