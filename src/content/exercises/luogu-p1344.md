---
id: luogu-p1344
volume: lower
source_file: lower-volume
original_label: '洛谷 P1344'
title: '洛谷 P1344 追查壞牛奶'
chapter: 10
section: '10.12'
kind: external-oj
difficulty: 4
topics: ['最小割', '字典序容量']
prerequisites: ['max-flow']
statement: |-
  切斷有向運輸網，使 1 與 N 不連通；先最小化損失，再最小化卡車數。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      4 5

      1 3 100

      3 2 50

      2 4 60

      1 2 40

      2 3 80
    output: |-
      60 1
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最小割', '字典序容量']
judgment: |-
  把每條容量 c 編碼為 c×(M+1)+1。
hints:
  - '先辨識核心轉換：最小割、字典序容量。'
  - '把每條容量 c 編碼為 c×(M+1)+1。'
  - '依「在編碼容量上求最大流；商與餘數分別是最小損失及其下最少邊數。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  在編碼容量上求最大流；商與餘數分別是最小損失及其下最少邊數。
proof_or_invariant: |-
  任兩方案損失差一時主項至少 M+1，大於邊數次項最大差 M，故一次最小割實現字典序目標。
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
  #include <iostream>
  #include <cstring>
  #include <queue>
  #define ll long long
  using namespace std;

  const int MAXN = 35;
  const int MAXM = 1005;
  const ll INF = 1e18;
  const ll MOD = 2018; // 足够大的常数，大于最大边数1000

  struct Edge {
      ll to, next, cap;
  } edges[2 * MAXM]; // 每条边存储两次（正向和反向）

  ll head[MAXN], dis[MAXN];
  ll cnt = 1; // 从1开始，方便异或操作获取反向边
  ll n, m, s, t;

  void add_edge(ll u, ll v, ll cap) {
      edges[++cnt].to = v;
      edges[cnt].cap = cap;
      edges[cnt].next = head[u];
      head[u] = cnt;

      edges[++cnt].to = u;
      edges[cnt].cap = 0;
      edges[cnt].next = head[v];
      head[v] = cnt;
  }

  bool bfs() {
      memset(dis, -1, sizeof(dis));
      queue<ll> q;
      q.push(s);
      dis[s] = 0;

      while (!q.empty()) {
          ll u = q.front();
          q.pop();
          for (ll i = head[u]; i; i = edges[i].next) {
              ll v = edges[i].to;
              if (dis[v] == -1 && edges[i].cap > 0) {
                  dis[v] = dis[u] + 1;
                  q.push(v);
              }
          }
      }
      return dis[t] != -1;
  }

  ll dfs(ll u, ll flow) {
      if (u == t) return flow;

      ll used = 0;
      for (ll i = head[u]; i; i = edges[i].next) {
          ll v = edges[i].to;
          if (dis[v] == dis[u] + 1 && edges[i].cap > 0) {
              ll min_flow = dfs(v, min(flow - used, edges[i].cap));
              if (min_flow > 0) {
                  edges[i].cap -= min_flow;
                  edges[i ^ 1].cap += min_flow;
                  used += min_flow;
                  if (used == flow) break;
              }
          }
      }
      if (!used) dis[u] = -1;
      return used;
  }

  ll dinic() {
      ll max_flow = 0;
      while (bfs()) {
          max_flow += dfs(s, INF);
      }
      return max_flow;
  }

  int main() {
      cin >> n >> m;
      s = 1;
      t = n;

      for (ll i = 0; i < m; i++) {
          ll u, v, w;
          cin >> u >> v >> w;
          add_edge(u, v, w * MOD + 1); // 邊權編碼為 w * MOD + 1
      }

      ll ans = dinic();
      cout << ans / MOD << " " << ans % MOD << endl;

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1344
external_platform: '洛谷'
external_problem_id: 'P1344'
external_title: '追查壞牛奶'
external_relation: original
source_book_pages: [679]
source_pdf_pages: [309]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
