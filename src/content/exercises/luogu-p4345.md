---
id: luogu-p4345
volume: lower
source_file: lower-volume
title: 洛谷 P4345 Lucas 分解組合數前綴和
chapter: 7
section: '7.4'
kind: external-oj
difficulty: 4
topics: [lucas-theorem, binomial-prefix-sum, digit-dp]
prerequisites: [lucas-theorem, binomial-theorem]
statement: 對每組 n、k，計算 Σ(i=0..k) C(n,i) 對 2333 取模的結果。
constraints:
  - 1 <= t <= 100000
  - 0 <= n,k <= 10^18
input_format: 第一行為 t；接下來 t 行各有 n、k。
output_format: 每組輸出組合數前綴和模 2333。
samples:
  - input: |
      1
      3 1
    output: '4'
    explanation: C(3,0)+C(3,1)=1+3=4。
core_knowledge:
  - Lucas 定理可依 2333 進位分解單一組合數
  - 對最低位完整求和可用二項式定理得到 2^digit
judgment: 若 k>=n，答案就是全部二項式係數和 2^n。
hints:
  - 預處理 0<=row,column<2333 的組合數前綴和。
  - 將 n=n_h p+n_l、k=k_h p+k_l；先計算最高位小於 k_h 的完整區塊。
  - 遞推式為 S(n,k)=S(n_h,k_h-1)2^n_l+C(n_h,k_h)S(n_l,k_l)。
solution_outline: 預處理質數模下的小組合數及每列前綴和；以 Lucas 計算 C，並按上述分位遞推計算 S。
proof_or_invariant: >-
  把 i 的高位分成小於 k_h 與等於 k_h 兩類。前者的低位可任取，Lucas 乘積的低位和為
  ΣC(n_l,j)=2^n_l；後者高位固定，只能取低位不超過 k_l。兩類互斥且涵蓋所有 i<=k。
common_errors:
  - k>=n 時仍遞推，造成無意義的高位範圍
  - 第一項誤用 S(n_h,k_h) 而重複計算邊界高位
  - 把模數 2333 當作合數而使用不必要的 exLucas
complexity:
  time: 預處理 O(p²)，每組 O(log_p n)
  space: O(p²)，p=2333
cpp_skeleton: |
  #include <cstdint>
  #include <iostream>
  using namespace std;
  static constexpr int mod_value = 2333;
  int main() {
      int tests;
      cin >> tests;
      // TODO：預處理小組合數前綴和，並以 2333 進位遞推。
      (void)tests;
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;

  static constexpr int mod_value = 2333;
  static vector<vector<int>> prefix_sum;
  static vector<int> factorial;
  static vector<int> inverse_factorial;

  static int power_mod(int base, int64_t exponent) {
      int64_t result = 1;
      int64_t current = base;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) { result = result * current % mod_value; }
          current = current * current % mod_value;
          exponent >>= 1;
      }
      return static_cast<int>(result);
  }
  static int small_combination(int n, int k) {
      if (k < 0 || k > n) { return 0; }
      return static_cast<int>(static_cast<int64_t>(factorial[static_cast<size_t>(n)]) *
                              inverse_factorial[static_cast<size_t>(k)] % mod_value *
                              inverse_factorial[static_cast<size_t>(n - k)] % mod_value);
  }
  static int lucas(int64_t n, int64_t k) {
      int64_t result = 1;
      while (n > 0 || k > 0) {
          result = result * small_combination(static_cast<int>(n % mod_value),
                                              static_cast<int>(k % mod_value)) %
                   mod_value;
          n /= mod_value;
          k /= mod_value;
      }
      return static_cast<int>(result);
  }
  static int prefix(int64_t n, int64_t k) {
      if (k < 0) { return 0; }
      if (k >= n) { return power_mod(2, n); }
      if (n < mod_value) {
          return prefix_sum[static_cast<size_t>(n)][static_cast<size_t>(k)];
      }
      const int n_low = static_cast<int>(n % mod_value);
      const int k_low = static_cast<int>(k % mod_value);
      const int64_t n_high = n / mod_value;
      const int64_t k_high = k / mod_value;
      const int first = static_cast<int>(static_cast<int64_t>(prefix(n_high, k_high - 1)) *
                                         power_mod(2, n_low) % mod_value);
      const int second = static_cast<int>(static_cast<int64_t>(lucas(n_high, k_high)) *
                                          prefix_sum[static_cast<size_t>(n_low)]
                                                    [static_cast<size_t>(min(n_low, k_low))] %
                                          mod_value);
      return (first + second) % mod_value;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      factorial.assign(mod_value, 1);
      inverse_factorial.assign(mod_value, 1);
      for (int i = 1; i < mod_value; ++i) {
          factorial[static_cast<size_t>(i)] =
              static_cast<int>(static_cast<int64_t>(factorial[static_cast<size_t>(i - 1)]) * i % mod_value);
      }
      inverse_factorial.back() = power_mod(factorial.back(), mod_value - 2);
      for (int i = mod_value - 1; i >= 1; --i) {
          inverse_factorial[static_cast<size_t>(i - 1)] =
              static_cast<int>(static_cast<int64_t>(inverse_factorial[static_cast<size_t>(i)]) * i % mod_value);
      }
      prefix_sum.assign(mod_value, vector<int>(mod_value));
      for (int row = 0; row < mod_value; ++row) {
          int running = 0;
          for (int column = 0; column < mod_value; ++column) {
              running = (running + small_combination(row, column)) % mod_value;
              prefix_sum[static_cast<size_t>(row)][static_cast<size_t>(column)] = running;
          }
      }
      int tests;
      cin >> tests;
      while (tests-- > 0) {
          int64_t n, k;
          cin >> n >> k;
          cout << prefix(n, k) << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4345
external_platform: 洛谷
external_problem_id: P4345
external_title: '[SHOI2015] 超能粒子炮·改'
external_relation: original
source_book_pages: [477, 480]
source_pdf_pages: [107, 110]
review_status: verified
---

Lucas 不只可拆單點；把高位小於邊界的區塊整批求和，就得到組合數前綴和的數位遞推。
