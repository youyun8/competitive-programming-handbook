---
id: luogu-p5518
volume: lower
source_file: lower-volume
title: 洛谷 P5518 幽靈樂團
chapter: 6
section: '6.16'
kind: external-oj
difficulty: 5
topics:
  - 莫比烏斯反演
  - 乘法型反演
  - 整除分塊
  - 模逆元
prerequisites:
  - mobius-inversion
  - euler-totient
  - divisor-summation
statement: >-
  對每組 A、B、C，分別令 f=1、i*j*k、gcd(i,j,k)，計算
  product_{i<=A,j<=B,k<=C}(lcm(i,j)/gcd(i,k))^f，答案對給定質數 p 取模。
constraints:
  - T = 70
  - 1 <= A,B,C <= 100000
  - 10^7 <= p <= 1.05 * 10^9，且 p 為質數
input_format: >-
  第一行為 T、p；接著 T 行各有 A、B、C。
output_format: >-
  每組輸出三個整數，依序為 type=0、1、2 的答案。
samples:
  - input: |
      3 998244853
      1 1 1
      2 2 2
      3 3 3
    output: |
      1 1 1
      16 4096 16
      180292630 873575259 180292630
    explanation: >-
      這是可信鏡像保存的官方樣例；A=B=C=1 時唯一因子為 1，三種指數的答案皆為 1。
hints:
  - >-
    先用 lcm(i,j)/gcd(i,k)=ij/(gcd(i,j)gcd(i,k))，把兩個純冪乘積與兩個 GCD 乘積分開。
  - >-
    type=0、1 的 GCD 乘積可預處理 g_t=product_{d|t}d^{mu(t/d)}；
    type=2 還要使用 Id*mu=phi，把 gcd(i,j,k) 的指數拆開。
  - >-
    所有最終式子都只依賴 floor(A/x)、floor(B/x)、floor(C/x)；
    預處理乘積及逆乘積後，以整除分塊合併相同商。
core_knowledge:
  - 三種指數的乘法型莫比烏斯反演
  - 歐拉函數卷積 Id*mu=phi
  - 模質數下的指數降冪
judgment: >-
  這不是把一個莫比烏斯模板套三次；三種 f 會產生不同權重，必須分別推導並共用預處理。
solution_outline: >-
  把答案寫成 numerator(A,B,C)*numerator(B,A,C) 除以
  denominator(A,B,C)*denominator(A,C,B)。預篩 mu、phi、階乘、i^i 前綴積、
  i^phi(i) 前綴積，以及兩組乘法莫比烏斯卷積 g；三種 numerator、denominator
  各以商值區間和快速冪計算，所有指數模 p-1。
proof_or_invariant: >-
  lcm*gcd=ij 先給出四因子分解。對 GCD 恰值使用
  [gcd=1]=sum mu 展開，乘法的換序把加法卷積改成底數乘積；
  type=2 中 sum_{d|n}d*mu(n/d)=phi(n)，故剩餘權重可由 phi 前綴處理。
  每個預處理陣列正是推導中一段連續底數的乘積，整除分塊只合併指數相同項。
common_errors:
  - 指數未對 p-1 取模或中間乘積溢位
  - 分母只處理 gcd(i,j)，漏掉 gcd(i,k)
  - type=2 把 phi 前綴和誤當成 phi 單點值
complexity:
  time: O(V log V + T sqrt(V) log V log p)
  space: O(V)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：先完成四因子分解，再分別推導 type 0、1、2 的乘法反演。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static constexpr int kLimit = 100000;
  static long long current_modulus;
  static vector<int> mobius;
  static vector<int> phi;
  static vector<long long> factorial;
  static vector<long long> inverse_value;
  static vector<long long> phi_prefix;
  static vector<long long> product_i_power_i;
  static vector<long long> product_i_power_phi;
  static vector<long long> inverse_product_i_power_phi;
  static array<vector<long long>, 2> convolution_product;
  static array<vector<long long>, 2> inverse_convolution_product;

  static long long power_mod(long long base, long long exponent) {
      base %= current_modulus;
      exponent %= current_modulus - 1;
      long long result = 1;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) { result = result * base % current_modulus; }
          base = base * base % current_modulus;
          exponent >>= 1LL;
      }
      return result;
  }

  static long long inverse_mod(long long value) {
      return power_mod(value, current_modulus - 2);
  }

  static long long triangular(long long value) {
      if (value % 2 == 0) {
          return (value / 2 % (current_modulus - 1)) * ((value + 1) % (current_modulus - 1)) %
              (current_modulus - 1);
      }
      return (value % (current_modulus - 1)) * ((value + 1) / 2 % (current_modulus - 1)) %
          (current_modulus - 1);
  }

  static void sieve() {
      mobius.assign(static_cast<size_t>(kLimit) + 1, 0);
      phi.assign(static_cast<size_t>(kLimit) + 1, 0);
      vector<int> primes;
      vector<char> composite(static_cast<size_t>(kLimit) + 1, false);
      mobius[1] = 1;
      phi[1] = 1;
      for (int i = 2; i <= kLimit; ++i) {
          if (!composite[static_cast<size_t>(i)]) {
              primes.push_back(i);
              mobius[static_cast<size_t>(i)] = -1;
              phi[static_cast<size_t>(i)] = i - 1;
          }
          for (int p : primes) {
              if (p > kLimit / i) { break; }
              const int next = i * p;
              composite[static_cast<size_t>(next)] = true;
              if (i % p == 0) {
                  mobius[static_cast<size_t>(next)] = 0;
                  phi[static_cast<size_t>(next)] = phi[static_cast<size_t>(i)] * p;
                  break;
              }
              mobius[static_cast<size_t>(next)] = -mobius[static_cast<size_t>(i)];
              phi[static_cast<size_t>(next)] = phi[static_cast<size_t>(i)] * (p - 1);
          }
      }
  }

  static void prepare() {
      sieve();
      factorial.assign(static_cast<size_t>(kLimit) + 1, 1);
      inverse_value.assign(static_cast<size_t>(kLimit) + 1, 1);
      phi_prefix.assign(static_cast<size_t>(kLimit) + 1, 0);
      product_i_power_i.assign(static_cast<size_t>(kLimit) + 1, 1);
      product_i_power_phi.assign(static_cast<size_t>(kLimit) + 1, 1);
      inverse_product_i_power_phi.assign(static_cast<size_t>(kLimit) + 1, 1);
      array<vector<long long>, 2> convolution;
      for (int type = 0; type < 2; ++type) {
          convolution[static_cast<size_t>(type)].assign(static_cast<size_t>(kLimit) + 1, 1);
          convolution_product[static_cast<size_t>(type)].assign(
              static_cast<size_t>(kLimit) + 1, 1);
          inverse_convolution_product[static_cast<size_t>(type)].assign(
              static_cast<size_t>(kLimit) + 1, 1);
      }

      for (int i = 1; i <= kLimit; ++i) {
          factorial[static_cast<size_t>(i)] =
              factorial[static_cast<size_t>(i - 1)] * i % current_modulus;
          phi_prefix[static_cast<size_t>(i)] =
              (phi_prefix[static_cast<size_t>(i - 1)] + phi[static_cast<size_t>(i)]) %
              (current_modulus - 1);
          product_i_power_i[static_cast<size_t>(i)] =
              product_i_power_i[static_cast<size_t>(i - 1)] * power_mod(i, i) % current_modulus;
          if (i > 1) {
              const int remainder = static_cast<int>(current_modulus % i);
              inverse_value[static_cast<size_t>(i)] =
                  (current_modulus - current_modulus / i) * inverse_value[static_cast<size_t>(remainder)] %
                  current_modulus;
          }
          product_i_power_phi[static_cast<size_t>(i)] =
              product_i_power_phi[static_cast<size_t>(i - 1)] *
              power_mod(i, phi[static_cast<size_t>(i)]) % current_modulus;
          inverse_product_i_power_phi[static_cast<size_t>(i)] =
              inverse_mod(product_i_power_phi[static_cast<size_t>(i)]);
      }

      for (int divisor = 1; divisor <= kLimit; ++divisor) {
          for (int quotient = 1; divisor <= kLimit / quotient; ++quotient) {
              const int value = divisor * quotient;
              const int sign = mobius[static_cast<size_t>(quotient)];
              if (sign == 0) { continue; }
              const long long plain = sign == 1
                  ? divisor
                  : inverse_value[static_cast<size_t>(divisor)];
              const long long weighted_base =
                  power_mod(divisor, static_cast<long long>(value) * value);
              const long long weighted = sign == 1
                  ? weighted_base
                  : inverse_mod(weighted_base);
              convolution[0][static_cast<size_t>(value)] =
                  convolution[0][static_cast<size_t>(value)] * plain % current_modulus;
              convolution[1][static_cast<size_t>(value)] =
                  convolution[1][static_cast<size_t>(value)] * weighted % current_modulus;
          }
      }
      for (int type = 0; type < 2; ++type) {
          for (int i = 1; i <= kLimit; ++i) {
              convolution_product[static_cast<size_t>(type)][static_cast<size_t>(i)] =
                  convolution_product[static_cast<size_t>(type)][static_cast<size_t>(i - 1)] *
                  convolution[static_cast<size_t>(type)][static_cast<size_t>(i)] % current_modulus;
              inverse_convolution_product[static_cast<size_t>(type)][static_cast<size_t>(i)] =
                  inverse_mod(
                      convolution_product[static_cast<size_t>(type)][static_cast<size_t>(i)]);
          }
      }
  }

  static long long numerator(int a, int b, int c, int type) {
      if (type == 0) {
          return power_mod(factorial[static_cast<size_t>(a)],
                           static_cast<long long>(b) * c);
      }
      if (type == 1) {
          return power_mod(product_i_power_i[static_cast<size_t>(a)],
                           triangular(b) * triangular(c));
      }
      long long result = 1;
      const int limit = min({a, b, c});
      for (int left = 1; left <= limit;) {
          const int right = min({a / (a / left), b / (b / left), c / (c / left)});
          const long long range_phi_product =
              product_i_power_phi[static_cast<size_t>(right)] *
              inverse_product_i_power_phi[static_cast<size_t>(left - 1)] % current_modulus;
          const long long three_quotients = static_cast<long long>(a / left) *
              (b / left) % (current_modulus - 1) * (c / left) % (current_modulus - 1);
          result = result * power_mod(range_phi_product, three_quotients) % current_modulus;
          const long long phi_sum =
              (phi_prefix[static_cast<size_t>(right)] -
               phi_prefix[static_cast<size_t>(left - 1)] + current_modulus - 1) % (current_modulus - 1);
          const long long factorial_exponent = phi_sum * (b / left) % (current_modulus - 1) *
              (c / left) % (current_modulus - 1);
          result = result *
              power_mod(factorial[static_cast<size_t>(a / left)], factorial_exponent) %
              current_modulus;
          left = right + 1;
      }
      return result;
  }

  static long long coprime_product(int a, int b) {
      long long result = 1;
      const int limit = min(a, b);
      for (int left = 1; left <= limit;) {
          const int right = min(a / (a / left), b / (b / left));
          const long long range_product =
              convolution_product[0][static_cast<size_t>(right)] *
              inverse_convolution_product[0][static_cast<size_t>(left - 1)] % current_modulus;
          result = result *
              power_mod(range_product, static_cast<long long>(a / left) * (b / left)) %
              current_modulus;
          left = right + 1;
      }
      return result;
  }

  static long long denominator(int a, int b, int c, int type) {
      long long result = 1;
      if (type < 2) {
          const int limit = min(a, b);
          for (int left = 1; left <= limit;) {
              const int right = min(a / (a / left), b / (b / left));
              const long long range_product =
                  convolution_product[static_cast<size_t>(type)][static_cast<size_t>(right)] *
                  inverse_convolution_product[static_cast<size_t>(type)]
                      [static_cast<size_t>(left - 1)] % current_modulus;
              const long long pair_weight = type == 0
                  ? static_cast<long long>(a / left) * (b / left)
                  : triangular(a / left) * triangular(b / left);
              const long long block = power_mod(range_product, pair_weight);
              result = result * power_mod(block, type == 0 ? c : triangular(c)) % current_modulus;
              left = right + 1;
          }
          return result;
      }
      const int limit = min({a, b, c});
      for (int left = 1; left <= limit;) {
          const int right = min({a / (a / left), b / (b / left), c / (c / left)});
          const long long phi_sum =
              (phi_prefix[static_cast<size_t>(right)] -
               phi_prefix[static_cast<size_t>(left - 1)] + current_modulus - 1) % (current_modulus - 1);
          result = result * power_mod(coprime_product(a / left, b / left),
              phi_sum * (c / left)) % current_modulus;
          const long long range_phi_product =
              product_i_power_phi[static_cast<size_t>(right)] *
              inverse_product_i_power_phi[static_cast<size_t>(left - 1)] % current_modulus;
          const long long exponent = static_cast<long long>(a / left) * (b / left) %
              (current_modulus - 1) * (c / left) % (current_modulus - 1);
          result = result * power_mod(range_phi_product, exponent) % current_modulus;
          left = right + 1;
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests;
      cin >> tests >> current_modulus;
      prepare();
      while (tests-- > 0) {
          int a, b, c;
          cin >> a >> b >> c;
          for (int type = 0; type < 3; ++type) {
              long long answer = numerator(a, b, c, type) * numerator(b, a, c, type) %
                  current_modulus;
              answer = answer * inverse_mod(denominator(a, b, c, type)) % current_modulus;
              answer = answer * inverse_mod(denominator(a, c, b, type)) % current_modulus;
              cout << answer << (type == 2 ? '\n' : ' ');
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5518
external_platform: 洛谷
external_problem_id: 'P5518'
external_title: '[MtOI2019] 幽靈樂團 / 莫比烏斯反演基礎練習題'
external_relation: original
original_label: '洛谷 P5518'
source_book_pages: [450, 456]
source_pdf_pages: [80, 86]
review_status: verified
---

這題實際上是六個乘積子問題的組合；每一個陣列都應能回指到推導中的一個卷積或前綴積。

原始題單中本題位於第 6.16 節、習題第 8 題；競賽來源記為「MtOI2019」。小範圍可直接三重枚舉並以 gcd、lcm、快速冪計算三欄，逐欄對拍。
