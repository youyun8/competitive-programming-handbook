---
id: luogu-p3726
volume: lower
source_file: lower-volume
title: 洛谷 P3726 不等次數擲幣勝局計數
chapter: 7
section: '7.4'
kind: external-oj
difficulty: 5
topics: [vandermonde-identity, extended-lucas, chinese-remainder-theorem]
prerequisites: [lucas-theorem, chinese-remainder-theorem]
statement: >-
  A 擲 a 次公平硬幣，B 擲 b 次；每段正反序列都視為不同結果。計算 A 的正面次數嚴格多於 B
  的結果對數，輸出十進位最後 k 位，不足 k 位補前導零。
constraints:
  - 1 <= a,b <= 10^15
  - b <= a <= b+10000
  - 1 <= k <= 9
  - 資料組數不超過 10，讀到 EOF
input_format: 多組資料，每行 a、b、k，讀到 EOF。
output_format: 每組輸出恰好 k 位，表示答案模 10^k。
samples:
  - input: |
      2 1 1
      3 2 2
    output: |
      4
      16
    explanation: 兩組完整勝局數分別為 4 與 16，已符合指定輸出位數。
core_knowledge:
  - 互補序列與 Vandermonde 恆等式把雙重和縮成至多 a-b 個組合數
  - 模 10^k 需拆成 2、5 的質數冪，以擴展 Lucas 計算後 CRT 合併
judgment: 前導零是輸出格式的一部分；例如答案 7 且 k=3 必須輸出 007。
hints:
  - a=b 時勝負對稱，答案為 (2^(a+b)-C(a+b,a))/2。
  - a>b 時，多出的不對稱部分經 Vandermonde 化簡為 Σ(i=b+1..a-1)C(a+b,i)，再與總數一起除 2。
  - 為安全除以 2，先把分子算模 2·10^k；組合數分別模 2^(k+1)、5^k 計算後 CRT。
solution_outline: >-
  對每組建立去除質因數後的階乘前綴，實作質數冪模組合數；CRT 得到模 2·10^k 的組合數，
  依公式累加分子後整除 2，最後固定寬度輸出。
proof_or_invariant: >-
  對兩人的序列同時翻面會交換正面較多與較少；a=b 時僅平局不成對，平局數由
  ΣC(a,i)^2=C(2a,a) 得到。a>b 時，仍勝的額外部分經 Vandermonde 卷積化成所列短和。
  擴展 Lucas 正確保留階乘中的質因數次數與其餘可逆部分；CRT 唯一還原模 2·10^k 的分子，
  因真分子為偶數，除 2 後即唯一得到答案模 10^k。
common_errors:
  - 直接在模 10^k 下求 2 的逆元；2 與模數不互質
  - 使用普通 Lucas，忽略模數是合數
  - 輸出整數但未用 0 補滿 k 位
complexity:
  time: 每組 O(5^k + (a-b)log(a+b))
  space: O(5^k)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      long long a, b;
      int digits;
      while (cin >> a >> b >> digits) {
          // TODO：在模 2*10^digits 下以 exLucas 與 CRT 計算分子，再除以 2。
      }
      return 0;
  }
cpp_solution: |
  #include <cstdint>
  #include <iomanip>
  #include <iostream>
  #include <vector>
  using namespace std;

  static int64_t power_mod(int64_t base, int64_t exponent, int64_t modulus) {
      int64_t result = 1 % modulus;
      base %= modulus;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) { result = result * base % modulus; }
          base = base * base % modulus;
          exponent >>= 1;
      }
      return result;
  }
  static int64_t extended_gcd(int64_t a, int64_t b, int64_t& x, int64_t& y) {
      if (b == 0) {
          x = 1;
          y = 0;
          return a;
      }
      int64_t next_x, next_y;
      const int64_t divisor = extended_gcd(b, a % b, next_x, next_y);
      x = next_y;
      y = next_x - a / b * next_y;
      return divisor;
  }
  static int64_t inverse_mod(int64_t value, int64_t modulus) {
      int64_t x, y;
      extended_gcd(value, modulus, x, y);
      (void)y;
      x %= modulus;
      if (x < 0) { x += modulus; }
      return x;
  }
  static vector<int64_t> build_prefix(int64_t prime, int64_t prime_power) {
      vector<int64_t> prefix(static_cast<size_t>(prime_power) + 1U, 1);
      for (int64_t value = 1; value <= prime_power; ++value) {
          prefix[static_cast<size_t>(value)] =
              prefix[static_cast<size_t>(value - 1)] *
              (value % prime == 0 ? 1 : value) % prime_power;
      }
      return prefix;
  }
  static int64_t factorial_without_prime(int64_t n, int64_t prime, int64_t prime_power,
                                         const vector<int64_t>& prefix) {
      if (n == 0) { return 1; }
      int64_t result =
          power_mod(prefix[static_cast<size_t>(prime_power)], n / prime_power, prime_power);
      result = result * prefix[static_cast<size_t>(n % prime_power)] % prime_power;
      return result * factorial_without_prime(n / prime, prime, prime_power, prefix) % prime_power;
  }
  static int64_t prime_exponent_factorial(int64_t n, int64_t prime) {
      int64_t result = 0;
      while (n > 0) {
          n /= prime;
          result += n;
      }
      return result;
  }
  static int64_t combination_prime_power(int64_t n, int64_t r, int64_t prime,
                                         int64_t prime_power,
                                         const vector<int64_t>& prefix) {
      if (r < 0 || r > n) { return 0; }
      const int64_t exponent = prime_exponent_factorial(n, prime) -
                               prime_exponent_factorial(r, prime) -
                               prime_exponent_factorial(n - r, prime);
      int64_t vanish_at = 0;
      for (int64_t value = prime_power; value > 1; value /= prime) { ++vanish_at; }
      if (exponent >= vanish_at) { return 0; }
      int64_t result = factorial_without_prime(n, prime, prime_power, prefix);
      result = result * inverse_mod(factorial_without_prime(r, prime, prime_power, prefix),
                                    prime_power) %
               prime_power;
      result = result * inverse_mod(factorial_without_prime(n - r, prime, prime_power, prefix),
                                    prime_power) %
               prime_power;
      return result * power_mod(prime, exponent, prime_power) % prime_power;
  }
  static int64_t combine_crt(int64_t residue_two, int64_t modulus_two,
                             int64_t residue_five, int64_t modulus_five) {
      int64_t difference = (residue_five - residue_two) % modulus_five;
      if (difference < 0) { difference += modulus_five; }
      const int64_t multiplier =
          difference * inverse_mod(modulus_two % modulus_five, modulus_five) % modulus_five;
      return residue_two + modulus_two * multiplier;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int64_t a, b;
      int digits;
      while (cin >> a >> b >> digits) {
          int64_t modulus_two = 2;
          int64_t modulus_five = 1;
          int64_t output_modulus = 1;
          for (int i = 0; i < digits; ++i) {
              modulus_two *= 2;
              modulus_five *= 5;
              output_modulus *= 10;
          }
          const int64_t combined_modulus = 2 * output_modulus;
          const vector<int64_t> prefix_two = build_prefix(2, modulus_two);
          const vector<int64_t> prefix_five = build_prefix(5, modulus_five);
          const auto combination = [&](int64_t n, int64_t r) {
              const int64_t residue_two =
                  combination_prime_power(n, r, 2, modulus_two, prefix_two);
              const int64_t residue_five =
                  combination_prime_power(n, r, 5, modulus_five, prefix_five);
              return combine_crt(residue_two, modulus_two, residue_five, modulus_five) %
                     combined_modulus;
          };
          const int64_t total = a + b;
          int64_t numerator = power_mod(2, total, combined_modulus);
          if (a == b) {
              numerator = (numerator - combination(total, a) + combined_modulus) %
                          combined_modulus;
          } else {
              for (int64_t selected = b + 1; selected < a; ++selected) {
                  numerator = (numerator + combination(total, selected)) % combined_modulus;
              }
          }
          const int64_t answer = numerator / 2;
          cout << setw(digits) << setfill('0') << answer << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3726
external_platform: 洛谷
external_problem_id: P3726
external_title: '[AHOI2017/HNOI2017] 擲硬幣'
external_relation: original
source_book_pages: [477, 480]
source_pdf_pages: [107, 110]
review_status: verified
---

先把勝局雙重和縮成短組合數和，再多保留一個因數 2，才能在十進位尾數模數下安全完成除二。
