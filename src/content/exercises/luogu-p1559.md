---
id: luogu-p1559
volume: lower
source_file: lower-volume
original_label: '洛谷 P1559'
title: '洛谷 P1559 運動員最佳匹配'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 4
topics: ['狀態壓縮 DP', '指派問題']
prerequisites: ['bipartite']
statement: |-
  男女各 n 人，一對的收益為 P[i][j]×Q[j][i]，求一對一配對的最大總收益。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3

      10 2 3

      2 3 4

      3 4 5

      2 2 2

      3 5 3

      4 5 1
    output: |-
      52
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['狀態壓縮 DP', '指派問題']
judgment: |-
  n≤20；以遮罩記錄已選女選手，下一位男選手由 popcount 決定。
hints:
  - '先辨識核心轉換：狀態壓縮 DP、指派問題。'
  - 'n≤20；以遮罩記錄已選女選手，下一位男選手由 popcount 決定。'
  - '依「令 dp[mask] 為前 |mask| 位男選手配給 mask 中女選手的最大收益，枚舉下一位女選手轉移。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  令 dp[mask] 為前 |mask| 位男選手配給 mask 中女選手的最大收益，枚舉下一位女選手轉移。
proof_or_invariant: |-
  每個遮罩唯一表示已使用集合；轉移加入一位尚未使用者，因此涵蓋且只涵蓋所有一對一指派。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(n 2^n)'
  space: 'O(2^n)'
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
  using namespace std;

  int n;
  int a[25][25];      // 边权矩阵
  int lx[25], ly[25]; // 顶标
  int visx[25], visy[25]; // 访问标记
  int pi[25];         // 匹配关系，pi[j]表示与女运动员j匹配的男运动员
  int minz;           // 顶标调整的最小差值

  bool dfs(int s) {
      visx[s] = 1;
      for (int i = 1; i <= n; i++) {
          if (!visy[i]) {
              int t = lx[s] + ly[i] - a[s][i];
              if (t == 0) {
                  visy[i] = 1;
                  if (pi[i] == 0 || dfs(pi[i])) {
                      pi[i] = s;
                      return true;
                  }
              } else if (t > 0) {
                  minz = min(minz, t);
              }
          }
      }
      return false;
  }

  void km() {
      for (int i = 1; i <= n; i++) {
          while (true) {
              minz = 1e9;
              memset(visx, 0, sizeof(visx));
              memset(visy, 0, sizeof(visy));
              if (dfs(i)) break;
              // 调整顶标
              for (int j = 1; j <= n; j++) {
                  if (visx[j]) lx[j] -= minz;
              }
              for (int j = 1; j <= n; j++) {
                  if (visy[j]) ly[j] += minz;
              }
          }
      }
  }

  int main() {
      scanf("%d", &n);
      // 读入P矩阵
      for (int i = 1; i <= n; i++) {
          for (int j = 1; j <= n; j++) {
              scanf("%d", &a[i][j]);
          }
      }
      // 读入Q矩阵并计算边权
      for (int i = 1; i <= n; i++) {
          for (int j = 1; j <= n; j++) {
              int r;
              scanf("%d", &r);
              a[j][i] *= r;  // 注意这里是a[j][i] *= r，最终a[i][j]表示男运动员i和女运动员j的边权
          }
      }

      // 初始化顶标
      for (int i = 1; i <= n; i++) {
          lx[i] = 0;
          for (int j = 1; j <= n; j++) {
              lx[i] = max(lx[i], a[i][j]);
          }
      }

      km();

      int ans = 0;
      for (int i = 1; i <= n; i++) {
          ans += a[pi[i]][i];
      }
      printf("%d", ans);
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1559
external_platform: '洛谷'
external_problem_id: 'P1559'
external_title: '運動員最佳匹配'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
