---
id: luogu-p2065
volume: lower
source_file: lower-volume
original_label: '洛谷 P2065'
title: '洛谷 P2065 卡片'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 3
topics: ['二分圖最大匹配', '質因數相容']
prerequisites: ['bipartite']
statement: |-
  藍、紅卡各有整數；每組取異色兩張且 gcd>1，求最多組數。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      7
      4 3
      2 6 6 15
      2 3 5
      2 3
      4 9
      8 16 32
      4 2
      4 9 11 13
      5 7
      5 5
      2 3 5 1001 1001
      7 11 13 30 30
      10 10
      2 3 5 7 9 11 13 15 17 29
      4 6 10 14 18 22 26 30 34 38
      20 20
      195 144 903 63 137 513 44 626 75 473
      876 421 568 519 755 840 374 368 570 872
      363 650 155 265 64 26 426 391 15 421
      373 984 564 54 823 477 565 866 879 638
      100 100
      195 144 903 63 137 513 44 626 75 473
      876 421 568 519 755 840 374 368 570 872
      363 650 155 265 64 26 426 391 15 421
      373 984 564 54 823 477 565 866 879 638
      117 755 835 683 52 369 302 424 513 870
      75 874 299 228 140 361 30 342 750 819
      761 123 804 325 952 405 578 517 49 457
      932 941 988 767 624 41 912 702 241 426
      351 92 300 648 318 216 785 347 556 535
      166 318 434 746 419 386 928 996 680 975
      231 390 916 220 933 319 37 846 797 54
      272 924 145 348 350 239 563 135 362 119
      446 305 213 879 51 631 43 755 405 499
      509 412 887 203 408 821 298 443 445 96
      274 715 796 417 839 147 654 402 280 17
      298 725 98 287 382 923 694 201 679 99
      699 188 288 364 389 694 185 464 138 406
      558 188 897 354 603 737 277 35 139 556
      826 213 59 922 499 217 846 193 416 525
      69 115 489 355 256 654 49 439 118 961
    output: |-
      3
      1
      0
      4
      9
      18
      85
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['二分圖最大匹配', '質因數相容']
judgment: |-
  一張卡最多使用一次，合法組合正是跨色二分圖的邊。
hints:
  - '先辨識核心轉換：二分圖最大匹配、質因數相容。'
  - '一張卡最多使用一次，合法組合正是跨色二分圖的邊。'
  - '依「對每對異色卡計算 gcd，若大於一就連邊，求最大匹配。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  對每對異色卡計算 gcd，若大於一就連邊，求最大匹配。
proof_or_invariant: |-
  任意匹配都是合法取法；任意取法的卡互不重複，也形成匹配，所以最大值相同。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(Tmn log V+VE)'
  space: 'O(mn)'
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
  #include <algorithm>
  #include <cmath>
  #include <unordered_map>
  #include <vector>

  using namespace std;

  const int INF = 1e9;
  const int MAX_NODES = 15000;  // 最大节点数
  const int MAX_EDGES = 100000; // 最大边数

  struct Edge {
      int to, cap, next;
  } edges[MAX_EDGES];

  int head[MAX_NODES], tot;
  int d[MAX_NODES], cur[MAX_NODES];
  int q[MAX_NODES];

  void init() {
      tot = 0;
      memset(head, -1, sizeof(head));
  }

  void add_edge(int u, int v, int cap) {
      edges[tot] = {v, cap, head[u]};
      head[u] = tot++;
      edges[tot] = {u, 0, head[v]};
      head[v] = tot++;
  }

  bool bfs(int S, int T) {
      memset(d, -1, sizeof(d));
      int hh = 0, tt = 0;
      q[0] = S;
      d[S] = 0;
      cur[S] = head[S];

      while (hh <= tt) {
          int u = q[hh++];
          for (int i = head[u]; ~i; i = edges[i].next) {
              int v = edges[i].to;
              if (d[v] == -1 && edges[i].cap > 0) {
                  d[v] = d[u] + 1;
                  cur[v] = head[v];
                  if (v == T) return true;
                  q[++tt] = v;
              }
          }
      }
      return false;
  }

  int dfs(int u, int T, int limit) {
      if (u == T) return limit;
      int flow = 0;
      for (int i = cur[u]; ~i && flow < limit; i = edges[i].next) {
          cur[u] = i;
          int v = edges[i].to;
          if (d[v] == d[u] + 1 && edges[i].cap > 0) {
              int f = dfs(v, T, min(edges[i].cap, limit - flow));
              if (!f) d[v] = -1;
              edges[i].cap -= f;
              edges[i ^ 1].cap += f;
              flow += f;
          }
      }
      return flow;
  }

  int dinic(int S, int T) {
      int max_flow = 0;
      while (bfs(S, T)) {
          int flow;
          while ((flow = dfs(S, T, INF)) > 0) {
              max_flow += flow;
          }
      }
      return max_flow;
  }

  void factorize(int x, vector<int>& factors) {
      factors.clear();
      for (int i = 2; i * i <= x; i++) {
          if (x % i == 0) {
              factors.push_back(i);
              while (x % i == 0) {
                  x /= i;
              }
          }
      }
      if (x > 1) {
          factors.push_back(x);
      }
  }

  int main() {
      int T;
      cin >> T;

      while (T--) {
          init();
          int m, n;
          cin >> m >> n;

          // 节点编号规划：
          // 源点: 0
          // 蓝色卡片: 1 ~ m
          // 红色卡片: m+1 ~ m+n
          // 质因数节点: 从m+n+1开始动态分配
          // 汇点: 最后一个节点

          int S = 0;
          int T_node = m + n + 1; // 初始汇点位置，后面会根据质因数节点数调整

          unordered_map<int, int> prime_to_idx;
          int prime_count = 0;
          vector<int> factors;

          // 添加源点到蓝色卡片的边
          for (int i = 1; i <= m; i++) {
              add_edge(S, i, 1);
          }

          // 处理蓝色卡片
          for (int i = 1; i <= m; i++) {
              int num;
              cin >> num;
              factorize(num, factors);

              for (int p : factors) {
                  if (prime_to_idx.find(p) == prime_to_idx.end()) {
                      prime_to_idx[p] = ++prime_count;
                  }
                  int prime_node = m + n + prime_to_idx[p];
                  add_edge(i, prime_node, 1);
              }
          }

          // 处理红色卡片
          for (int i = 1; i <= n; i++) {
              int num;
              cin >> num;
              factorize(num, factors);

              for (int p : factors) {
                  if (prime_to_idx.find(p) != prime_to_idx.end()) {
                      int prime_node = m + n + prime_to_idx[p];
                      add_edge(prime_node, m + i, 1);
                  }
              }
              // 添加红色卡片到汇点的边
              add_edge(m + i, m + n + prime_count + 1, 1);
          }

          // 设置汇点
          int T_final = m + n + prime_count + 1;

          int result = dinic(S, T_final);
          cout << result << endl;
      }

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2065
external_platform: '洛谷'
external_problem_id: 'P2065'
external_title: '卡片'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
