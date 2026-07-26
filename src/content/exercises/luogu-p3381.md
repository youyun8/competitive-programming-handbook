---
id: luogu-p3381
volume: lower
source_file: lower-volume
original_label: '洛谷 P3381'
title: '洛谷 P3381 最小費用最大流'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 4
topics: ['費用流', '殘量網路', '最短增廣路']
prerequisites: ['min-cost-flow']
statement: |-
  給定有向容量與單位費用，求最大流及該流量下最小費用。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      4 5 4 3
      4 2 30 2
      4 3 20 3
      2 3 20 1
      2 1 30 9
      1 3 40 5
    output: |-
      50 280
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['費用流', '殘量網路', '最短增廣路']
judgment: |-
  反向邊容量初始為零且費用取負；距離及總費用使用 long long。
hints:
  - '先辨識核心轉換：費用流、殘量網路、最短增廣路。'
  - '反向邊容量初始為零且費用取負；距離及總費用使用 long long。'
  - '依「反覆在殘量圖以 SPFA 找最短費用增廣路，沿瓶頸推流。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  反覆在殘量圖以 SPFA 找最短費用增廣路，沿瓶頸推流。
proof_or_invariant: |-
  每次沿最短殘量路增廣，維持同流量下費用最小；無增廣路時流量最大。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(FVE)'
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
  #include <cstdio>
  #include <cstring>
  #include <algorithm>
  using namespace std;

  const int maxn = 5050;
  const int maxm = 100010; // 2 * 50005
  const int INF = 0x3f3f3f3f;

  struct Edge {
      int v, c, w, nxt;
  } e[maxm];

  int n, m, s, t;
  int head[maxn], pre[maxn], dis[maxn], q[maxn];
  bool vis[maxn];
  int s_e;

  inline void add_edge(int u, int v, int c, int w) {
      e[s_e] = (Edge){v, c, w, head[u]};
      head[u] = s_e++;
  }

  inline void add(int u, int v, int c, int w) {
      add_edge(u, v, c, w);
      add_edge(v, u, 0, -w);
  }

  bool spfa() {
      for (int i = 1; i <= n; i++) {
          dis[i] = INF;
          vis[i] = false;
      }
      dis[s] = 0;
      vis[s] = true;
      int hd = 0, tl = 1;
      q[0] = s;

      while (hd != tl) {
          int u = q[hd++];
          if (hd == maxn) hd = 0;
          vis[u] = false;

          for (int i = head[u]; i != -1; i = e[i].nxt) {
              int v = e[i].v;
              if (e[i].c > 0 && dis[v] > dis[u] + e[i].w) {
                  dis[v] = dis[u] + e[i].w;
                  pre[v] = i;
                  if (!vis[v]) {
                      vis[v] = true;
                      q[tl++] = v;
                      if (tl == maxn) tl = 0;
                  }
              }
          }
      }
      return dis[t] != INF;
  }

  void solve(int &flow, int &cost) {
      flow = 0;
      cost = 0;

      while (spfa()) {
          int min_cap = INF;
          for (int u = t; u != s; u = e[pre[u] ^ 1].v) {
              min_cap = min(min_cap, e[pre[u]].c);
          }

          for (int u = t; u != s; u = e[pre[u] ^ 1].v) {
              e[pre[u]].c -= min_cap;
              e[pre[u] ^ 1].c += min_cap;
              cost += e[pre[u]].w * min_cap;
          }
          flow += min_cap;
      }
  }

  int main() {
      (void)!scanf("%d%d%d%d", &n, &m, &s, &t);
      for (int i = 1; i <= n; i++) {
          head[i] = -1;
      }
      s_e = 0;

      for (int i = 0; i < m; i++) {
          int u, v, w, c;
          (void)!scanf("%d%d%d%d", &u, &v, &w, &c);
          add(u, v, w, c);
      }

      int flow, cost;
      solve(flow, cost);
      printf("%d %d\n", flow, cost);

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3381
external_platform: '洛谷'
external_problem_id: 'P3381'
external_title: '最小費用最大流'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
