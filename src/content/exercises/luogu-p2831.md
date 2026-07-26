---
id: luogu-p2831
volume: upper
source_file: upper-volume
title: 洛谷 P2831 憤怒的小鳥
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 4
topics: [state-compression-dp, computational-geometry]
prerequisites: [bitmask-dp, quadratic-function]
statement: 從原點發射小鳥，軌跡必為 y=ax²+bx 且 a<0。軌跡經過的小豬均被消滅；給至多 18 個正座標點，求消滅全部小豬的最少發射數。
constraints:
  - 第一行為關卡數 T
  - 1 <= n <= 18，0 <= m <= 2
  - 0 < x_i,y_i < 10，座標保留兩位小數且互不相同
  - m 僅描述測資額外性質，不改變操作規則
input_format: 第一行 T；每關先輸入 n、m，接著 n 行 x_i、y_i。
output_format: 每個關卡輸出一行最少小鳥數。
samples:
  - input: |-
      2
      2 0
      1.00 3.00
      3.00 3.00
      5 2
      1.00 5.00
      2.00 8.00
      3.00 9.00
      4.00 8.00
      5.00 5.00
    output: |-
      1
      1
    explanation: 兩關的小豬分別全在 y=-x²+4x 與 y=-x²+6x 上，因此各一發即可。
core_knowledge: [兩點確定拋物線, 覆蓋集合, 子集合最短覆蓋]
judgment: 合法拋物線必經原點且開口向下；單獨一隻小豬永遠可用某條合法軌跡擊中。
hints:
  - 原點已固定，另外兩個不同 x 的點可解出唯一 a、b；只保留 a<0 的軌跡。
  - 預處理每對小豬所決定軌跡能覆蓋的所有點，表示成位元集合。
  - DP 每次鎖定尚未消滅的第一隻豬，只枚舉單獨擊中它或讓它與另一隻豬共用軌跡。
solution_outline: 預處理 O(n³) 的拋物線覆蓋遮罩，以首個未覆蓋點剪枝做子集合 DP。
proof_or_invariant: 任一含至少兩隻不同 x 小豬的合法一發，其曲線由其中兩點唯一決定，已在預處理中；只命中一隻的發射由單點遮罩涵蓋。任一未完成狀態的下一發必命中其首個未覆蓋點，故只枚舉包含該點的候選不會漏掉最優方案。每個轉移增加一發並精確加入其覆蓋集合，歸納後全集狀態即最少發射數。
common_errors: [接受a大於等於零的曲線, 直接用浮點相等判斷共線於拋物線, 每個狀態枚舉所有點對而超時]
complexity:
  time: O(n^3 + n * 2^n)
  space: O(n^2 + 2^n)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int tests = 0; cin >> tests;
      while (tests--) { int n = 0, type = 0; cin >> n >> type; /* TODO */ }
  }
cpp_solution: |
  #include <algorithm>
  #include <cmath>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      constexpr double epsilon = 1e-7;
      int tests = 0; cin >> tests;
      while (tests--) {
          int n = 0, type = 0; cin >> n >> type;
          (void)type;
          vector<double> x(static_cast<size_t>(n)), y(static_cast<size_t>(n));
          for (int i = 0; i < n; ++i) cin >> x[static_cast<size_t>(i)] >> y[static_cast<size_t>(i)];
          vector<vector<int>> cover(static_cast<size_t>(n), vector<int>(static_cast<size_t>(n), 0));
          for (int i = 0; i < n; ++i) {
              cover[static_cast<size_t>(i)][static_cast<size_t>(i)] = 1 << i;
              for (int j = i + 1; j < n; ++j) {
                  if (abs(x[static_cast<size_t>(i)] - x[static_cast<size_t>(j)]) < epsilon) continue;
                  const double a = (y[static_cast<size_t>(i)] / x[static_cast<size_t>(i)] -
                                    y[static_cast<size_t>(j)] / x[static_cast<size_t>(j)]) /
                                   (x[static_cast<size_t>(i)] - x[static_cast<size_t>(j)]);
                  if (a >= -epsilon) continue;
                  const double b = y[static_cast<size_t>(i)] / x[static_cast<size_t>(i)] -
                                   a * x[static_cast<size_t>(i)];
                  int mask = 0;
                  for (int k = 0; k < n; ++k)
                      if (abs(a * x[static_cast<size_t>(k)] * x[static_cast<size_t>(k)] +
                              b * x[static_cast<size_t>(k)] - y[static_cast<size_t>(k)]) < epsilon)
                          mask |= 1 << k;
                  cover[static_cast<size_t>(i)][static_cast<size_t>(j)] = mask;
                  cover[static_cast<size_t>(j)][static_cast<size_t>(i)] = mask;
              }
          }
          const int full = (1 << n) - 1;
          vector<int> dp(static_cast<size_t>(full + 1), n + 1);
          dp[0] = 0;
          for (int mask = 0; mask < full; ++mask) {
              if (dp[static_cast<size_t>(mask)] > n) continue;
              int first = 0;
              while ((mask & (1 << first)) != 0) ++first;
              dp[static_cast<size_t>(mask | (1 << first))] =
                  min(dp[static_cast<size_t>(mask | (1 << first))], dp[static_cast<size_t>(mask)] + 1);
              for (int other = first + 1; other < n; ++other) {
                  const int shot = cover[static_cast<size_t>(first)][static_cast<size_t>(other)];
                  if (shot != 0)
                      dp[static_cast<size_t>(mask | shot)] =
                          min(dp[static_cast<size_t>(mask | shot)], dp[static_cast<size_t>(mask)] + 1);
              }
          }
          cout << dp[static_cast<size_t>(full)] << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P2831
external_platform: 洛谷
external_problem_id: P2831
external_title: 愤怒的小鸟
external_relation: original
source_book_pages: [354]
source_pdf_pages: [372]
review_status: verified
---

幾何部分先化成「一發覆蓋哪些點」，之後就是至多十八位的集合最短路。
