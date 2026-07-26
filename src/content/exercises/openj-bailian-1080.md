---
id: openj-bailian-1080
volume: upper
source_file: upper-volume
title: OpenJudge 1080 Human Gene Functions
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 3
topics: [dynamic-programming, sequence-alignment]
prerequisites: [dynamic-programming]
statement: >-
  給兩條只含 A、C、G、T 的基因序列。可在任一序列插入空格，使兩者等長，但不可讓兩個空格
  對齊。每對字元或字元與空格的分數由官方矩陣給定；求所有對齊方式中的最大總分。
constraints:
  - 測試組數由第一行給定
  - 1 <= 每條基因長度 <= 100
  - 序列只含 A、C、G、T
input_format: 每組有兩行，各為長度及其後的基因字串。
output_format: 每組輸出一行最大相似度分數。
samples:
  - input: |-
      2
      7 AGTGATG
      5 GTTAG
      7 AGCTATT
      9 AGCTTTAAA
    output: |-
      14
      21
    explanation: 第一組最佳對齊可為 AGTGATG 與 -GTTA-G，依矩陣加總為 14；第二組最佳值為 21。
core_knowledge: [全域序列比對, 二維前綴 DP, 空格懲罰]
judgment: 使用官方 5×5 配分矩陣；空格不可與空格對齊，且必須把兩條完整序列都納入對齊。
hints:
  - 最後一欄只有三種：兩個字元對齊、第一條字元對空格、或空格對第二條字元。
  - dp[i][j] 表示兩個前綴完整對齊的最高分，空前綴邊界要累加各字元對空格的分數。
  - 逐格取三個前驅加對應矩陣分數的最大值；不需枚舉空格位置。
solution_outline: 依前綴長度做 Needleman–Wunsch DP，初始化首列首欄，逐格取三種最後對齊方式最大值。
proof_or_invariant: >-
  任一非空前綴對齊的最後一欄必且只可能屬於三種合法形式；移除該欄後分別留下 (i-1,j-1)、
  (i-1,j) 或 (i,j-1) 的完整前綴對齊。最佳子結構因此給出轉移，反之替任一最佳子對齊附加
  對應末欄皆合法。由空前綴邊界歸納，dp[n][m] 即全局最高分。
common_errors: [把目標寫成最小分而非最大分, 首列首欄初始化為零, 誤允許空格對空格]
complexity:
  time: O(n * m) 每組
  space: O(n * m)
cpp_skeleton: |
  #include <iostream>
  #include <string>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int tests = 0; cin >> tests;
      while (tests-- > 0) {
          int n = 0; int m = 0; string a; string b;
          cin >> n >> a >> m >> b;
          // TODO：以前綴 DP 枚舉三種最後對齊方式。
          cout << n - n + m - m << '\n';
      }
  }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  static int code(char value) {
      if (value == 'A') return 0;
      if (value == 'C') return 1;
      if (value == 'G') return 2;
      return 3;
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      constexpr array<array<int, 5>, 5> score{{
          {{5, -1, -2, -1, -3}}, {{-1, 5, -3, -2, -4}},
          {{-2, -3, 5, -2, -2}}, {{-1, -2, -2, 5, -1}},
          {{-3, -4, -2, -1, 0}}
      }};
      int tests = 0; cin >> tests;
      while (tests-- > 0) {
          int n = 0; int m = 0; string a; string b;
          cin >> n >> a >> m >> b;
          vector<vector<int>> dp(static_cast<size_t>(n + 1),
                                 vector<int>(static_cast<size_t>(m + 1), 0));
          for (int i = 1; i <= n; ++i)
              dp[static_cast<size_t>(i)][0] =
                  dp[static_cast<size_t>(i - 1)][0] + score[static_cast<size_t>(code(a[static_cast<size_t>(i - 1)]))][4];
          for (int j = 1; j <= m; ++j)
              dp[0][static_cast<size_t>(j)] =
                  dp[0][static_cast<size_t>(j - 1)] + score[4][static_cast<size_t>(code(b[static_cast<size_t>(j - 1)]))];
          for (int i = 1; i <= n; ++i) for (int j = 1; j <= m; ++j) {
              const size_t x = static_cast<size_t>(code(a[static_cast<size_t>(i - 1)]));
              const size_t y = static_cast<size_t>(code(b[static_cast<size_t>(j - 1)]));
              dp[static_cast<size_t>(i)][static_cast<size_t>(j)] = max({
                  dp[static_cast<size_t>(i - 1)][static_cast<size_t>(j - 1)] + score[x][y],
                  dp[static_cast<size_t>(i - 1)][static_cast<size_t>(j)] + score[x][4],
                  dp[static_cast<size_t>(i)][static_cast<size_t>(j - 1)] + score[4][y]});
          }
          cout << dp[static_cast<size_t>(n)][static_cast<size_t>(m)] << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/1080/
external_platform: OpenJudge 百練
external_problem_id: '1080'
external_title: Human Gene Functions
external_relation: original
source_book_pages: [333]
source_pdf_pages: [351]
review_status: verified
---

空格不是特殊枚舉，而是前綴 DP 中消耗單邊一個字元的兩種轉移。
