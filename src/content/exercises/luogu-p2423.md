---
id: luogu-p2423
volume: lower
source_file: lower-volume
original_label: '洛谷 P2423'
title: '洛谷 P2423 朋友圈'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 5
topics: ['最大團', '二分圖補圖', 'König 定理']
prerequisites: ['bipartite']
statement: |-
  在題定 A、B 兩國朋友規則下，求兩兩互為朋友的最大集合。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      1
      2 4 7
      1 2
      2 6 5 4
      1 1
      1 2
      1 3
      2 1
      2 2
      2 3
      2 4
    output: |-
      5
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最大團', '二分圖補圖', 'König 定理']
judgment: |-
  A 國同奇偶者不相容，故最多選兩人；固定 A 的選擇後，B 國補圖是二分圖。
hints:
  - '先辨識核心轉換：最大團、二分圖補圖、König 定理。'
  - 'A 國同奇偶者不相容，故最多選兩人；固定 A 的選擇後，B 國補圖是二分圖。'
  - '依「枚舉 A 國選 0、1 或一奇一偶兩人；保留與其皆相容的 B 點，以候選數減補圖最大匹配求最大團。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  枚舉 A 國選 0、1 或一奇一偶兩人；保留與其皆相容的 B 點，以候選數減補圖最大匹配求最大團。
proof_or_invariant: |-
  A 國枚舉完整；B 原圖最大團等於補圖最大獨立集，而二分圖最大獨立集大小為頂點數減最大匹配。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(T(A^2B+B^2)B)'
  space: 'O(A B+B^2)'
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
  #include <cmath>
  #include <cstdlib>
  using namespace std;

  const int MAXN = 3205;
  const int MAXM = 2500000;

  inline int rd() {
      int x = 0, f = 1;
      char ch = getchar();
      while (!isdigit(ch)) {
          f = ch == '-' ? 0 : 1;
          ch = getchar();
      }
      while (isdigit(ch)) {
          x = (x << 1) + (x << 3) + ch - '0';
          ch = getchar();
      }
      return f ? x : -x;
  }

  int T, A, B, M;
  int a[MAXN], b[MAXN];
  int e[MAXN][MAXN];
  int head[MAXM], to[MAXM], nxt[MAXM], cnt;
  int vis[MAXN], flag[MAXN], match[MAXN];
  int num, t, ans;

  inline void add(int bg, int ed) {
      to[++cnt] = ed;
      nxt[cnt] = head[bg];
      head[bg] = cnt;
  }

  int popcount(int x) {
      int cnt = 0;
      while (x) {
          cnt += x & 1;
          x >>= 1;
      }
      return cnt;
  }

  bool dfs(int x) {
      for (int i = head[x]; i; i = nxt[i]) {
          int u = to[i];
          if (vis[u] != num && flag[u] == t) {
              vis[u] = num;
              if (!match[u] || dfs(match[u])) {
                  match[u] = x;
                  return true;
              }
          }
      }
      return false;
  }

  int main() {
      T = rd();
      while (T--) {
          A = rd(); B = rd(); M = rd();
          for (int i = 1; i <= A; i++) a[i] = rd();
          for (int i = 1; i <= B; i++) b[i] = rd();

          memset(e, 0, sizeof(e));
          for (int i = 1; i <= M; i++) {
              int x = rd(), y = rd();
              e[x][y + A] = 1;
              e[y + A][x] = 1;
          }

          memset(head, 0, sizeof(head));
          cnt = 0;
          for (int i = 1; i <= B; i++) {
              if (b[i] & 1) {
                  for (int j = 1; j <= B; j++) {
                      if (!(b[j] & 1)) {
                          if ((popcount(b[i] | b[j]) & 1) == 0) {
                              add(i, j);
                          }
                      }
                  }
              }
          }

          ans = 0;
          memset(vis, 0, sizeof(vis));
          memset(flag, 0, sizeof(flag));
          memset(match, 0, sizeof(match));
          num = 0; t = 0;

          // Case 0: select 0 from A
          int sum0 = 0;
          for (int i = 1; i <= B; i++) {
              if (b[i] & 1) {
                  num++;
                  if (dfs(i)) sum0++;
              }
          }
          ans = max(ans, B - sum0);

          // Case 1: select 1 from A
          for (int i = 1; i <= A; i++) {
              t++;
              int now = 0;
              for (int j = 1; j <= B; j++) {
                  if (e[i][j + A]) {
                      flag[j] = t;
                      now++;
                  }
              }
              memset(match, 0, sizeof(match));
              int sum = 0;
              for (int j = 1; j <= B; j++) {
                  if ((b[j] & 1) && flag[j] == t) {
                      num++;
                      if (dfs(j)) sum++;
                  }
              }
              ans = max(ans, now - sum + 1);
          }

          // Case 2: select 2 from A (must be friends)
          for (int i = 1; i <= A; i++) {
              for (int j = i + 1; j <= A; j++) {
                  if ((a[i] ^ a[j]) & 1) {
                      t++;
                      int now = 0;
                      for (int k = 1; k <= B; k++) {
                          if (e[i][k + A] && e[j][k + A]) {
                              flag[k] = t;
                              now++;
                          }
                      }
                      memset(match, 0, sizeof(match));
                      int sum = 0;
                      for (int k = 1; k <= B; k++) {
                          if ((b[k] & 1) && flag[k] == t) {
                              num++;
                              if (dfs(k)) sum++;
                          }
                      }
                      ans = max(ans, now - sum + 2);
                  }
              }
          }

          cout << ans << endl;
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2423
external_platform: '洛谷'
external_problem_id: 'P2423'
external_title: '朋友圈'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
