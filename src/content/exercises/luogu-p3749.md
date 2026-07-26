---
id: luogu-p3749
volume: lower
source_file: lower-volume
original_label: '洛谷 P3749'
title: '洛谷 P3749 壽司餐廳'
chapter: 10
section: '10.12'
kind: external-oj
difficulty: 5
topics: ['最大權閉合子圖', '區間依賴']
prerequisites: ['max-flow']
statement: |-
  選擇若干區間所觸發的區間美味度，扣除代號計價，求最大淨收益。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3 1
      2 3 2
      5 -10 15
      -10 15
      15
    output: |-
      12
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最大權閉合子圖', '區間依賴']
judgment: |-
  選區間 [l,r] 必選其兩個長度少一子區間；選單點還會觸發該代號固定費。
hints:
  - '先辨識核心轉換：最大權閉合子圖、區間依賴。'
  - '選區間 [l,r] 必選其兩個長度少一子區間；選單點還會觸發該代號固定費。'
  - '依「區間為權值節點，依賴加無限邊；單點扣線性代價並連代號費用節點，答案為正權總和減最小割。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  區間為權值節點，依賴加無限邊；單點扣線性代價並連代號費用節點，答案為正權總和減最小割。
proof_or_invariant: |-
  閉合集精確描述所有可同時取得的美味度及必付費用；最大權閉合子圖的標準割轉換保值。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(V^2E)'
  space: 'O(n^2+A)'
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
  #include <iostream>
  using namespace std;

  typedef long long LL;
  const LL Inf = 0x7fffffffffffffff;

  namespace DinicFlow {
      const int MN = 6060, MM = 16055;

      int N, S, T;
      int h[MN], iter[MN], nxt[MM * 2], to[MM * 2], tot = 1;
      LL w[MM * 2];

      inline void ins(int u, int v, LL x) {
          nxt[++tot] = h[u];
          to[tot] = v;
          w[tot] = x;
          h[u] = tot;
      }

      inline void insw(int u, int v, LL x) {
          ins(u, v, x);
          ins(v, u, 0);
      }

      int lv[MN], que[MN], l, r;

      inline bool Lvl() {
          memset(lv, 0, sizeof(lv));
          lv[S] = 1;
          que[l = r = 1] = S;
          while (l <= r) {
              int u = que[l++];
              for (int i = h[u]; i; i = nxt[i]) {
                  if (w[i] && !lv[to[i]]) {
                      lv[to[i]] = lv[u] + 1;
                      que[++r] = to[i];
                  }
              }
          }
          return lv[T] != 0;
      }

      LL Flow(int u, LL f) {
          if (u == T) return f;
          LL d = 0, s = 0;
          for (int &i = iter[u]; i; i = nxt[i]) {
              if (w[i] && lv[to[i]] == lv[u] + 1) {
                  d = Flow(to[i], min(f, w[i]));
                  f -= d;
                  s += d;
                  w[i] -= d;
                  w[i ^ 1] += d;
                  if (!f) break;
              }
          }
          return s;
      }

      inline LL Dinic() {
          LL Ans = 0;
          while (Lvl()) {
              memcpy(iter + 1, h + 1, N * sizeof(h[0]));
              Ans += Flow(S, Inf);
          }
          return Ans;
      }
  }

  const int MN = 105;

  int main() {
      int n, m;
      scanf("%d%d", &n, &m);
      int A[MN];
      int MxA = 0;
      for (int i = 1; i <= n; ++i) {
          scanf("%d", &A[i]);
          MxA = max(MxA, A[i]);
      }

      int F[MN][MN];
      int Id[MN][MN];
      int cnt = 2; // S=1, T=2

      // Assign IDs for d[i][j]
      for (int i = 1; i <= n; ++i) {
          for (int j = i; j <= n; ++j) {
              Id[i][j] = ++cnt;
          }
      }

      // Read d[i][j]
      for (int i = 1; i <= n; ++i) {
          for (int j = i; j <= n; ++j) {
              scanf("%d", &F[i][j]);
          }
      }

      LL Ans = 0;

      // Build graph
      for (int i = 1; i <= n; ++i) {
          for (int j = i; j <= n; ++j) {
              int cost = F[i][j];

              // For single sushi, subtract cost a_i
              if (i == j) {
                  cost -= A[i];
              }

              // Connect to S or T based on cost
              if (cost > 0) {
                  DinicFlow::insw(1, Id[i][j], cost);
                  Ans += cost;
              } else if (cost < 0) {
                  DinicFlow::insw(Id[i][j], 2, -cost);
              }

              // Dependencies for segments
              if (i < j) {
                  DinicFlow::insw(Id[i][j], Id[i + 1][j], Inf);
                  DinicFlow::insw(Id[i][j], Id[i][j - 1], Inf);
              }

              // Connect to type node for single sushi
              if (i == j && m) {
                  DinicFlow::insw(Id[i][j], cnt + A[i], Inf);
              }
          }
      }

      // Create type nodes if m=1
      if (m) {
          for (int i = 1; i <= MxA; ++i) {
              DinicFlow::insw(++cnt, 2, i * i);
          }
      }

      DinicFlow::N = cnt;
      DinicFlow::S = 1;
      DinicFlow::T = 2;

      LL min_cut = DinicFlow::Dinic();
      printf("%lld\n", Ans - min_cut);

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3749
external_platform: '洛谷'
external_problem_id: 'P3749'
external_title: '壽司餐廳'
external_relation: original
source_book_pages: [679]
source_pdf_pages: [309]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
