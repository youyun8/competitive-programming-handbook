---
id: luogu-p4491
volume: lower
source_file: lower-volume
title: 洛谷 P4491 恰出現 S 次的顏色加權
chapter: 7
section: '7.5'
kind: external-oj
difficulty: 5
topics: [binomial-inversion, ntt, exponential-generating-function]
prerequisites: [inclusion-exclusion, polynomial-convolution]
statement: >-
  長度 N 的序列每格可染 M 種顏色。若恰有 K 種顏色各出現正好 S 次，此方案貢獻 W_K。
  求全部 M^N 個染色方案的貢獻總和模 1004535809。
constraints:
  - 1 <= N <= 10000000
  - 1 <= M <= 100000
  - 1 <= S <= 150
  - 0 <= W_i < 1004535809
input_format: 第一行 N、M、S；第二行 W_0..W_M。
output_format: 輸出所有染色方案愉悅度總和模 1004535809。
samples:
  - input: |
      1 2 1
      0 1 2
    output: '2'
    explanation: 單一位置有兩種染法，每種都恰有一種顏色出現一次，總貢獻為 1+1=2。
core_knowledge:
  - 先欽定至少 j 種顏色各出現 S 次，可直接排列組合
  - 二項式反演化成卷積後用 NTT 同時計算所有恰好 K
judgment: 顏色有編號、位置有順序；未使用顏色不算「出現零次等於 S」，因 S>=1。
hints:
  - 欽定 j 色的方案 f_j=C(M,j)N!/(S!^j(N-jS)!)(M-j)^(N-jS)。
  - 恰好 k 色的 g_k=Σ(j>=k)(-1)^(j-k)C(j,k)f_j。
  - 乘上 k! 後，g_k k!=Σ(f_j j!)·((-1)^(j-k)/(j-k)!)，反轉第一序列即可卷積。
solution_outline: 預處理階乘；建立反轉的 f_j j! 與帶符號逆階乘兩多項式，NTT 相乘，還原各 g_k 後與 W_k 內積。
proof_or_invariant: >-
  若實際有 r 種顏色恰出現 S 次，它在 f_j 中被 C(r,j) 次欽定。二項式反演使其只對 g_r
  貢獻一次。拆開 C(j,k) 後的和只依 j 與 j-k 分離，反轉索引所得卷積逐係數恰為 g_k k!。
common_errors:
  - 剩餘位置仍允許使用已欽定顏色，導致它們超過 S 次
  - j 枚舉超過 min(M,floor(N/S))
  - NTT 使用 998244353 的根或模數；本題模數是 1004535809
complexity:
  time: O(N + M log M)
  space: O(N + M)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      int n, m, s;
      cin >> n >> m >> s;
      // TODO：二項式反演後以 NTT 計算所有恰好次數。
      (void)n;
      (void)m;
      (void)s;
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;

  static constexpr int64_t mod_value = 1004535809;
  static constexpr int64_t primitive_root = 3;
  static int64_t power_mod(int64_t base, int64_t exponent) {
      int64_t result = 1;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) { result = result * base % mod_value; }
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }
  static void ntt(vector<int64_t>& values, bool invert) {
      const int size = static_cast<int>(values.size());
      for (int i = 1, j = 0; i < size; ++i) {
          int bit = size >> 1;
          while ((j & bit) != 0) {
              j ^= bit;
              bit >>= 1;
          }
          j ^= bit;
          if (i < j) { swap(values[static_cast<size_t>(i)], values[static_cast<size_t>(j)]); }
      }
      for (int length = 2; length <= size; length <<= 1) {
          int64_t root = power_mod(primitive_root, (mod_value - 1) / length);
          if (invert) { root = power_mod(root, mod_value - 2); }
          for (int start = 0; start < size; start += length) {
              int64_t weight = 1;
              for (int offset = 0; offset < length / 2; ++offset) {
                  const int64_t left = values[static_cast<size_t>(start + offset)];
                  const int64_t right =
                      values[static_cast<size_t>(start + offset + length / 2)] * weight % mod_value;
                  values[static_cast<size_t>(start + offset)] = (left + right) % mod_value;
                  values[static_cast<size_t>(start + offset + length / 2)] =
                      (left - right + mod_value) % mod_value;
                  weight = weight * root % mod_value;
              }
          }
      }
      if (invert) {
          const int64_t inverse_size = power_mod(size, mod_value - 2);
          for (int64_t& value : values) { value = value * inverse_size % mod_value; }
      }
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, s;
      cin >> n >> m >> s;
      vector<int64_t> weight(static_cast<size_t>(m) + 1U);
      for (int64_t& value : weight) { cin >> value; }
      const int factorial_limit = max(n, m);
      vector<int64_t> factorial(static_cast<size_t>(factorial_limit) + 1U, 1);
      vector<int64_t> inverse_factorial(static_cast<size_t>(factorial_limit) + 1U, 1);
      for (int i = 1; i <= factorial_limit; ++i) {
          factorial[static_cast<size_t>(i)] = factorial[static_cast<size_t>(i - 1)] * i % mod_value;
      }
      inverse_factorial.back() = power_mod(factorial.back(), mod_value - 2);
      for (int i = factorial_limit; i >= 1; --i) {
          inverse_factorial[static_cast<size_t>(i - 1)] =
              inverse_factorial[static_cast<size_t>(i)] * i % mod_value;
      }
      const int upper = min(m, n / s);
      int transform_size = 1;
      while (transform_size <= 2 * upper) { transform_size <<= 1; }
      vector<int64_t> first(static_cast<size_t>(transform_size));
      vector<int64_t> second(static_cast<size_t>(transform_size));
      int64_t inverse_s_factorial_power = 1;
      const int64_t inverse_s_factorial = inverse_factorial[static_cast<size_t>(s)];
      for (int selected = 0; selected <= upper; ++selected) {
          const int remaining = n - selected * s;
          int64_t fixed = factorial[static_cast<size_t>(m)] *
                          inverse_factorial[static_cast<size_t>(selected)] % mod_value *
                          inverse_factorial[static_cast<size_t>(m - selected)] % mod_value;
          fixed = fixed * factorial[static_cast<size_t>(n)] % mod_value *
                  inverse_factorial[static_cast<size_t>(remaining)] % mod_value;
          fixed = fixed * inverse_s_factorial_power % mod_value *
                  power_mod(m - selected, remaining) % mod_value;
          first[static_cast<size_t>(upper - selected)] =
              fixed * factorial[static_cast<size_t>(selected)] % mod_value;
          second[static_cast<size_t>(selected)] =
              (selected & 1) != 0 ? mod_value - inverse_factorial[static_cast<size_t>(selected)]
                                  : inverse_factorial[static_cast<size_t>(selected)];
          inverse_s_factorial_power = inverse_s_factorial_power * inverse_s_factorial % mod_value;
      }
      ntt(first, false);
      ntt(second, false);
      for (int i = 0; i < transform_size; ++i) {
          first[static_cast<size_t>(i)] =
              first[static_cast<size_t>(i)] * second[static_cast<size_t>(i)] % mod_value;
      }
      ntt(first, true);
      int64_t answer = 0;
      for (int exact = 0; exact <= upper; ++exact) {
          const int64_t exact_count =
              first[static_cast<size_t>(upper - exact)] *
              inverse_factorial[static_cast<size_t>(exact)] % mod_value;
          answer = (answer + weight[static_cast<size_t>(exact)] * exact_count) % mod_value;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4491
external_platform: 洛谷
external_problem_id: P4491
external_title: '[HAOI2018] 染色'
external_relation: original
source_book_pages: [481, 485]
source_pdf_pages: [111, 115]
review_status: verified
---

廣義容斥的二項式核拆成兩個單變數序列後，所有 K 的答案便能由一次 NTT 同時取得。
