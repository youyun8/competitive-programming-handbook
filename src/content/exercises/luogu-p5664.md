---
id: luogu-p5664
volume: lower
source_file: lower-volume
title: 洛谷 P5664 每種主食材不過半的菜單
chapter: 7
section: '7.5'
kind: external-oj
difficulty: 4
topics: [dynamic-programming, complement-counting, dominance]
prerequisites: [dynamic-programming, combinatorics-basics]
statement: >-
  有 n 種烹飪方法、m 種主食材，a_ij 表示用方法 i 與食材 j 可做的不同菜數。
  選至少一道菜，方法不可重複，且任一食材使用次數不得超過總菜數一半。求方案數模 998244353。
constraints:
  - 1 <= n <= 100
  - 1 <= m <= 2000
  - 0 <= a_ij <= 1000000000
input_format: 第一行 n、m；接著 n 行各有 m 個 a_ij。
output_format: 輸出合法菜單方案數模 998244353。
samples:
  - input: |
      2 3
      1 0 1
      0 1 1
    output: '3'
    explanation: 必須兩種方法各選一道，主食材不同；可選 (1,1)+(2,2)、(1,1)+(2,3)、(1,3)+(2,2)。
core_knowledge:
  - 忽略食材限制時，每種方法可不選或選其任一道菜
  - 不合法菜單至多有一種食材嚴格超過一半，可逐食材相加而不重複
judgment: 同一方法至多選一道菜；a_ij 種菜彼此可區分並形成乘法權重。
hints:
  - 全部非空菜單數是 Π_i(1+Σ_j a_ij)-1。
  - 固定食材 c，令差值為「選 c 的道數減去選其他食材的道數」。
  - 每種方法有不選（差 0）、選 c（差 +1）、選其他（差 -1）三種轉移；最後差值正數即不合法。
solution_outline: 先算不限食材的總數；對每個食材用偏移陣列做 n 行差值 DP，扣除最終差值大於 0 的方案。
proof_or_invariant: >-
  每行 DP 三分支逐一表示該方法的所有合法選擇，因此差值正確記錄固定食材是否超過其餘總和。
  一個菜單不可能同時有兩種食材都嚴格超過一半，所以各食材的不合法集合互斥；從全集扣除其和，
  又排除空菜單，即恰為題目要求。
common_errors:
  - 把「至多一半」誤判成差值必須小於 0；差值等於 0 是合法
  - 不合法集合再做容斥；其實兩種食材不可能同時嚴格過半
  - 忘記 a_ij 是不同菜數，轉移需要乘上權重
complexity:
  time: O(mn^2)
  space: O(nm)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      int method_count, ingredient_count;
      cin >> method_count >> ingredient_count;
      // TODO：計算全集，並逐食材做選取數差值 DP 扣除不合法方案。
      (void)method_count;
      (void)ingredient_count;
      return 0;
  }
cpp_solution: |
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;

  static constexpr int64_t mod_value = 998244353;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int method_count, ingredient_count;
      cin >> method_count >> ingredient_count;
      vector<vector<int64_t>> dish(static_cast<size_t>(method_count),
                                   vector<int64_t>(static_cast<size_t>(ingredient_count)));
      vector<int64_t> row_sum(static_cast<size_t>(method_count));
      for (int method = 0; method < method_count; ++method) {
          for (int ingredient = 0; ingredient < ingredient_count; ++ingredient) {
              cin >> dish[static_cast<size_t>(method)][static_cast<size_t>(ingredient)];
              row_sum[static_cast<size_t>(method)] =
                  (row_sum[static_cast<size_t>(method)] +
                   dish[static_cast<size_t>(method)][static_cast<size_t>(ingredient)]) %
                  mod_value;
          }
      }
      int64_t answer = 1;
      for (int64_t sum : row_sum) { answer = answer * (sum + 1) % mod_value; }
      answer = (answer - 1 + mod_value) % mod_value;
      const int offset = method_count;
      for (int ingredient = 0; ingredient < ingredient_count; ++ingredient) {
          vector<int64_t> dp(static_cast<size_t>(2 * method_count + 1));
          dp[static_cast<size_t>(offset)] = 1;
          for (int method = 0; method < method_count; ++method) {
              vector<int64_t> next = dp;
              const int64_t selected =
                  dish[static_cast<size_t>(method)][static_cast<size_t>(ingredient)] % mod_value;
              const int64_t other =
                  (row_sum[static_cast<size_t>(method)] - selected + mod_value) % mod_value;
              for (int difference = -method; difference <= method; ++difference) {
                  const int index = offset + difference;
                  next[static_cast<size_t>(index + 1)] =
                      (next[static_cast<size_t>(index + 1)] +
                       dp[static_cast<size_t>(index)] * selected) %
                      mod_value;
                  next[static_cast<size_t>(index - 1)] =
                      (next[static_cast<size_t>(index - 1)] +
                       dp[static_cast<size_t>(index)] * other) %
                      mod_value;
              }
              dp.swap(next);
          }
          int64_t invalid = 0;
          for (int difference = 1; difference <= method_count; ++difference) {
              invalid = (invalid + dp[static_cast<size_t>(offset + difference)]) % mod_value;
          }
          answer = (answer - invalid + mod_value) % mod_value;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5664
external_platform: 洛谷
external_problem_id: P5664
external_title: '[CSP-S 2019] Emiya 家今天的飯'
external_relation: original
source_book_pages: [481, 485]
source_pdf_pages: [111, 115]
review_status: verified
---

「某食材過半」事件彼此互斥，使高維限制能拆成每個食材一個一維差值 DP。
