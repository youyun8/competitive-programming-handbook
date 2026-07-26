---
id: luogu-p5400
volume: lower
source_file: lower-volume
title: 洛谷 P5400 隨機立方體的極大格機率
chapter: 7
section: '7.5'
kind: external-oj
difficulty: 5
topics: [binomial-inversion, probability, falling-factorial]
prerequisites: [inclusion-exclusion, modular-inverse]
statement: >-
  將 1..nml 隨機排列到 n×m×l 格。若某格數值大於所有與它至少共享一維座標的其他格，
  稱它為極大格。求恰有 k 個極大格的機率，按模 998244353 的分數意義輸出。
constraints:
  - 1 <= T <= 10
  - 1 <= n,m,l <= 5000000
  - 1 <= k <= 100
input_format: 第一行 T；每組一行 n、m、l、k。
output_format: 每組輸出恰有 k 個極大格的機率模 998244353。
samples:
  - input: |
      2
      1 1 1 1
      2 2 2 1
    output: |
      1
      142606337
    explanation: 單格必為極大值；第二組依公式做模分數運算得到所示結果。
core_knowledge:
  - 多個極大格的三維座標必須兩兩各維不同，位置有三個下降冪的乘積
  - 二項式反演把「指定 i 個極大格」還原成「恰好 k 個」
judgment: 所求是等概率排列下的機率，不是排列方案數。
hints:
  - 指定依數值遞增排列的 i 個極大格，其位置數為 n^(i) m^(i) l^(i)。
  - 第 j 個指定格需成為 nml-(n-j)(m-j)(l-j) 個受控格中的最大值，貢獻其倒數。
  - 設 f_i 為指定 i 個極大格的機率，答案是 Σ(i>=k)(-1)^(i-k)C(i,k)f_i。
solution_outline: 對 i=1..min(n,m,l) 逐步維護三個下降冪及所有受控集合大小的倒數乘積，再按二項式反演累加。
proof_or_invariant: >-
  極大格不能共享任一座標，故有三個下降冪的位置選法。按指定格數值遞增考慮時，
  前 j 個控制範圍聯集大小恰為 nml-(n-j)(m-j)(l-j)，第 j 個為聯集最大值的條件機率是其倒數；
  連乘得到 f_i。任一有 r 個極大格的排列在 f_i 中被計 C(r,i) 次，二項式反演後只在 r=k 時留下 1。
common_errors:
  - 將三維位置數誤寫成 C(n,i)C(m,i)C(l,i)，漏掉指定極大格之間的配對次序
  - 把各格控制範圍當獨立事件，忽略聯集逐步擴大
  - 反演係數使用 C(k,i) 而非 C(i,k)
complexity:
  time: 每組 O(min(n,m,l))
  space: O(max(n,m,l)) 預處理階乘
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      int tests;
      cin >> tests;
      // TODO：維護下降冪與控制範圍倒數，再做二項式反演。
      (void)tests;
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;

  static constexpr int64_t mod_value = 998244353;
  static int64_t power_mod(int64_t base, int64_t exponent) {
      int64_t result = 1;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) { result = result * base % mod_value; }
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      constexpr int limit = 5000000;
      vector<int64_t> factorial(static_cast<size_t>(limit) + 1U, 1);
      vector<int64_t> inverse_factorial(static_cast<size_t>(limit) + 1U, 1);
      for (int i = 1; i <= limit; ++i) {
          factorial[static_cast<size_t>(i)] = factorial[static_cast<size_t>(i - 1)] * i % mod_value;
      }
      inverse_factorial.back() = power_mod(factorial.back(), mod_value - 2);
      for (int i = limit; i >= 1; --i) {
          inverse_factorial[static_cast<size_t>(i - 1)] =
              inverse_factorial[static_cast<size_t>(i)] * i % mod_value;
      }
      const auto combination = [&](int top, int bottom) {
          if (bottom < 0 || bottom > top) { return int64_t{0}; }
          return factorial[static_cast<size_t>(top)] * inverse_factorial[static_cast<size_t>(bottom)] %
                 mod_value * inverse_factorial[static_cast<size_t>(top - bottom)] % mod_value;
      };
      int tests;
      cin >> tests;
      while (tests-- > 0) {
          array<int64_t, 3> dimension{};
          int k;
          cin >> dimension[0] >> dimension[1] >> dimension[2] >> k;
          sort(dimension.begin(), dimension.end());
          const int upper = static_cast<int>(dimension[0]);
          const int64_t volume =
              dimension[0] % mod_value * (dimension[1] % mod_value) % mod_value *
              (dimension[2] % mod_value) % mod_value;
          vector<int64_t> controlled(static_cast<size_t>(upper) + 1U, 1);
          vector<int64_t> inverse_prefix(static_cast<size_t>(upper) + 1U, 1);
          int64_t all_controlled = 1;
          for (int i = 1; i <= upper; ++i) {
              int64_t inner = 1;
              for (int axis = 0; axis < 3; ++axis) {
                  inner = inner * ((dimension[static_cast<size_t>(axis)] - i) % mod_value) % mod_value;
              }
              controlled[static_cast<size_t>(i)] = (volume - inner + mod_value) % mod_value;
              all_controlled =
                  all_controlled * controlled[static_cast<size_t>(i)] % mod_value;
          }
          inverse_prefix[static_cast<size_t>(upper)] = power_mod(all_controlled, mod_value - 2);
          for (int i = upper - 1; i >= 0; --i) {
              inverse_prefix[static_cast<size_t>(i)] =
                  inverse_prefix[static_cast<size_t>(i + 1)] *
                  controlled[static_cast<size_t>(i + 1)] % mod_value;
          }
          int64_t falling_product = 1;
          int64_t answer = 0;
          for (int i = 1; i <= upper; ++i) {
              for (int axis = 0; axis < 3; ++axis) {
                  falling_product = falling_product * ((dimension[static_cast<size_t>(axis)] - i + 1) %
                                                       mod_value) %
                                    mod_value;
              }
              if (i < k) { continue; }
              const int64_t term =
                  combination(i, k) * falling_product % mod_value *
                  inverse_prefix[static_cast<size_t>(i)] % mod_value;
              answer = ((i - k) & 1) != 0 ? (answer - term + mod_value) % mod_value
                                          : (answer + term) % mod_value;
          }
          cout << answer << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5400
external_platform: 洛谷
external_problem_id: P5400
external_title: '[CTS2019] 隨機立方體'
external_relation: original
source_book_pages: [481, 485]
source_pdf_pages: [111, 115]
review_status: verified
---

按極大值由小到大揭露後，重疊的控制範圍不再造成相依性，機率便能寫成簡潔連乘。
