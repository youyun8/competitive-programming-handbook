---
id: luogu-p2050
volume: lower
source_file: lower-volume
original_label: '洛谷 P2050'
title: '洛谷 P2050 美食節'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 5
topics: ['動態加點費用流', '排程']
prerequisites: ['min-cost-flow']
statement: |-
  多種菜各有訂單量，多位廚師加工時間不同，安排順序使總完成時間最小。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3 2 
      3 1 1 
      5 7 
      3 6 
      8 9
    output: |-
      47
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['動態加點費用流', '排程']
judgment: |-
  某廚師倒數第 k 個位置放菜 i 對總等待時間貢獻 k×t[i][j]。
hints:
  - '先辨識核心轉換：動態加點費用流、排程。'
  - '某廚師倒數第 k 個位置放菜 i 對總等待時間貢獻 k×t[i][j]。'
  - '依「菜種供應連位置節點；每位廚師只先建立第一個位置，位置被用後再動態加入下一個，跑最小費流。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  菜種供應連位置節點；每位廚師只先建立第一個位置，位置被用後再動態加入下一個，跑最小費流。
proof_or_invariant: |-
  任一廚師序列對應唯一位置指派且費用等於各完成時間和；動態加入不會漏掉更深位置，因其前一位置必先被使用。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(PVE)'
  space: 'O(nmP)'
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
  #include<iostream>
  #include<cstdio>
  #include<cstring>
  #include<queue>
  using namespace std;

  const int INF = 0x3f3f3f3f;
  const int MAXN = 100000;
  const int MAXM = 2000000;

  int n, m, cnt = 1, sum_p;
  int p[45], t[45][105];
  int head[MAXN], dis[MAXN], vis[MAXN], nxt[MAXN];
  int top[105]; // 每个厨师当前层数
  int min_cost;

  struct Edge {
      int to, next, flow, cost;
  } edge[MAXM];

  void add_edge(int u, int v, int f, int c) {
      cnt++;
      edge[cnt].to = v;
      edge[cnt].flow = f;
      edge[cnt].cost = c;
      edge[cnt].next = head[u];
      head[u] = cnt;

      cnt++;
      edge[cnt].to = u;
      edge[cnt].flow = 0;
      edge[cnt].cost = -c;
      edge[cnt].next = head[v];
      head[v] = cnt;
  }

  // 获取层节点编号
  int get_node(int chef, int layer) {
      return n + (chef - 1) * sum_p + layer;
  }

  bool SPFA(int S, int T) {
      memset(dis, 0x3f, sizeof(dis));
      memset(vis, 0, sizeof(vis));
      queue<int> q;
      q.push(S);
      dis[S] = 0;
      vis[S] = 1;

      while (!q.empty()) {
          int u = q.front();
          q.pop();
          vis[u] = 0;

          for (int i = head[u]; i; i = edge[i].next) {
              int v = edge[i].to;
              if (edge[i].flow > 0 && dis[v] > dis[u] + edge[i].cost) {
                  dis[v] = dis[u] + edge[i].cost;
                  if (!vis[v]) {
                      vis[v] = 1;
                      q.push(v);
                  }
              }
          }
      }
      return dis[T] < INF;
  }

  int DFS(int u, int T, int flow) {
      if (u == T) return flow;
      vis[u] = 1;
      int used = 0;

      for (int i = head[u]; i && flow; i = edge[i].next) {
          int v = edge[i].to;
          if (!vis[v] && edge[i].flow > 0 && dis[v] == dis[u] + edge[i].cost) {
              int k = DFS(v, T, min(flow, edge[i].flow));
              if (k > 0) {
                  edge[i].flow -= k;
                  edge[i ^ 1].flow += k;
                  flow -= k;
                  used += k;
                  min_cost += k * edge[i].cost;
                  nxt[u] = v; // 记录增广路径
              }
          }
      }

      if (!used) dis[u] = INF;
      vis[u] = 0;
      return used;
  }

  void dinic(int S, int T) {
      while (SPFA(S, T)) {
          do {
              memset(vis, 0, sizeof(vis));
              DFS(S, T, INF);
          } while (vis[T]);

          // 检查是否需要添加新层
          for (int j = 1; j <= m; j++) {
              if (top[j] < sum_p) {
                  int node = get_node(j, top[j]);
                  if (nxt[node] != 0) { // 该层被使用
                      top[j]++;
                      int new_node = get_node(j, top[j]);

                      // 添加从每个菜品到新层的边
                      for (int i = 1; i <= n; i++) {
                          add_edge(i, new_node, 1, t[i][j] * top[j]);
                      }
                      // 添加从新层到汇点的边
                      add_edge(new_node, T, 1, 0);
                  }
              }
          }
      }
  }

  int main() {
      (void)!scanf("%d%d", &n, &m);
      sum_p = 0;
      for (int i = 1; i <= n; i++) {
          (void)!scanf("%d", &p[i]);
          sum_p += p[i];
      }

      for (int i = 1; i <= n; i++) {
          for (int j = 1; j <= m; j++) {
              (void)!scanf("%d", &t[i][j]);
          }
      }

      int S = n + m * sum_p + 1;
      int T = S + 1;

      // 源点到菜品
      for (int i = 1; i <= n; i++) {
          add_edge(S, i, p[i], 0);
      }

      // 初始化每个厨师的第一层
      for (int j = 1; j <= m; j++) {
          top[j] = 1;
          int node = get_node(j, 1);
          // 菜品到该层
          for (int i = 1; i <= n; i++) {
              add_edge(i, node, 1, t[i][j] * 1);
          }
          // 该层到汇点
          add_edge(node, T, 1, 0);
      }

      dinic(S, T);
      printf("%d\n", min_cost);

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2050
external_platform: '洛谷'
external_problem_id: 'P2050'
external_title: '美食節'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
