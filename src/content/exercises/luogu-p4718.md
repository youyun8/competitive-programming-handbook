---
id: luogu-p4718
volume: lower
source_file: lower-volume
title: 洛谷 P4718 Pollard-Rho：大數質因數分解
chapter: 6
section: '6.10'
kind: external-oj
difficulty: 5
topics: ['Pollard-Rho', 'Miller-Rabin', '質因數分解', '乘法取模']
prerequisites: ['prime-numbers', 'fast-power']
statement: |-
  給定若干個正整數，對每個數判斷它是否為質數；若是則輸出 Prime，否則輸出它的最大質因數。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '數值可達 10^18，試除法完全不可行'
  - '乘法取模會溢位，需要專門處理'
  - '多組測資，需要期望 O(n^{1/4}) 的分解'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行一個整數 T；接下來 T 行，每行一個正整數 n。'
output_format: '每個 n 輸出一行：n 是質數則輸出 Prime，否則輸出其最大質因數。'
samples:
  - input: |
      6
      2
      13
      134
      8897
      1000000007
      1000000009
    output: |
      Prime
      Prime
      67
      41
      Prime
      Prime
    explanation: |-
      134 = 2×67，最大質因數 67；8897 = 7×31×41，最大質因數 41；10^9+7 與 10^9+9 都是質數。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    先要有質數判定。Miller-Rabin 把 n−1 寫成 odd·2^t，對若干底數檢查 a^odd ≡ ±1 或連續平方過程中出現 −1。用固定底數 {2,3,5,7,11,13,17,19,23,29,31,37} 對 2^64 以內是**確定性**的，不必隨機。
  - |-
    Pollard-Rho 的想法：用 f(x) = (x²+c) mod n 造出偽隨機序列。由生日悖論，序列在模 p（n 的最小質因數）下大約 O(√p) 步就會出現重複，此時 gcd(|x−y|, n) 有很高機率是 n 的非平凡因數。因為 p ≤ √n，期望複雜度是 O(n^{1/4})。
  - |-
    gcd 很貴。Brent 的優化是把連續多步的 |x−y| **乘起來**（模 n），每隔一段才求一次 gcd——只要其中任何一項與 n 有公因數，乘積也會有。若這一批的 gcd 等於 n 就換一組 c 重來。
  - |-
    乘法取模是最大的實作陷阱：n 到 10^18 時 a·b 會爆 64 位元。本站的檢查開了 `-pedantic-errors`，`__int128` 會被拒絕，所以改用「long double 估商 + 無號整數環繞求餘」——無號溢位在 C++ 有明確定義，這段是可移植的，速度也接近硬體乘法。注意這個技巧要求模數小於 2^63。
  - |-
    **務必先試除小質數再進 Pollard-Rho**。對極小的合數（例如 15），可選的 c 只有十來個，有可能全部失敗而讓外層無限重試——這是實作這題最容易踩到的死迴圈。
solution_outline: |-
  先用試除法剝掉 100 以內的質因數，這既加速也保證交給 Pollard-Rho 的數夠大。剩下的部分用 Miller-Rabin 判質：是質數就更新答案，否則用 Brent 版 Pollard-Rho 找出一個非平凡因數，遞迴處理兩半。過程中用「目前最大質因數」剪枝，遇到比它小的整段可以直接跳過。
proof_or_invariant: |-
  Miller-Rabin 的正確性來自：p 為奇質數時 x² ≡ 1 只有 x ≡ ±1 兩解，因此合數會在平方鏈上暴露。Pollard-Rho 的期望步數由生日悖論給出：序列在模 p 下的值域大小為 p，出現碰撞的期望步數為 O(√p) ≤ O(n^{1/4})。批次求 gcd 不影響正確性，因為若某項與 n 有公因數，乘積必然也有。
complexity:
  time: '期望 O(n^{1/4} log n)'
  space: 'O(log n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // 已備好：64 位元乘法取模。先用 long double 估商，再用無號整數環繞算餘數。
  // 前提是 mod_value < 2^63（本題保證 n <= 10^18）。
  static unsigned long long mul_mod(unsigned long long a, unsigned long long b,
                                    unsigned long long mod_value) {
      const unsigned long long quotient = static_cast<unsigned long long>(
          static_cast<long double>(a) * static_cast<long double>(b) /
          static_cast<long double>(mod_value));
      unsigned long long result = a * b - quotient * mod_value;
      if (result >= (1ULL << 63)) {
          result += mod_value;
      } else if (result >= mod_value) {
          result -= mod_value;
      }
      return result;
  }

  static unsigned long long power_mod(unsigned long long base, unsigned long long exponent,
                                      unsigned long long mod_value) {
      unsigned long long result = 1;
      base %= mod_value;
      while (exponent > 0) {
          if (exponent & 1) { result = mul_mod(result, base, mod_value); }
          base = mul_mod(base, base, mod_value);
          exponent >>= 1;
      }
      return result;
  }

  // TODO 1：Miller-Rabin 質數判定。
  //   把 n−1 寫成 odd_part · 2^twos。對每個底數 a 檢查
  //     a^odd_part ≡ ±1，或連續平方過程中出現 −1；
  //   任一底數都不滿足就是合數。
  //   用固定底數 {2,3,5,7,11,13,17,19,23,29,31,37} 對 2^64 以內是確定性的。
  static bool is_prime(unsigned long long n) {
      if (n < 2) { return false; }
      for (const unsigned long long small : {2ULL, 3ULL, 5ULL, 7ULL, 11ULL, 13ULL}) {
          if (n % small == 0) { return n == small; }
      }
      // 樸素試除：正確但對 10^18 太慢。
      for (unsigned long long d = 3; d * d <= n; d += 2) {
          if (n % d == 0) { return false; }
      }
      (void)power_mod;
      return true;
  }

  // TODO 2：Pollard-Rho 找出 n 的一個非平凡因數。
  //   用 f(x) = (x² + c) mod n 造偽隨機序列，Floyd 或 Brent 找環；
  //   把連續多步的 |x − y| 乘起來再一次求 gcd，可大幅減少 gcd 呼叫。
  //   注意：進來前要先確定 n 沒有小因數，否則像 n = 15 這種極小合數
  //   可選的 c 太少，可能每次都失敗而無限重試。
  static unsigned long long pollard_rho(unsigned long long n) {
      for (unsigned long long d = 2; d * d <= n; ++d) {
          if (n % d == 0) { return d; }
      }
      return n;
  }

  // TODO 3：遞迴分解求最大質因數。先試除小質數，再對剩下的部分
  //   反覆呼叫 pollard_rho 拆成兩半遞迴。
  static unsigned long long largest_prime_factor(unsigned long long n) {
      unsigned long long best = 1;
      while (n > 1) {
          const unsigned long long d = is_prime(n) ? n : pollard_rho(n);
          best = max(best, d);
          n /= d;
      }
      return best;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests;
      if (!(cin >> tests)) { return 0; }
      while (tests-- > 0) {
          unsigned long long n;
          cin >> n;
          if (is_prime(n)) {
              cout << "Prime\n";
          } else {
              cout << largest_prime_factor(n) << '\n';
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 64 位元乘法取模。本站的 C++ 檢查開了 -pedantic-errors，不能用 __int128，
  // 因此先以 long double 估出商，再用無號整數環繞算餘數——無號溢位在 C++
  // 有明確定義，所以這段是可移植的，速度也接近硬體乘法。
  //
  // 前提：mod_value < 2^63。負值偵測靠「結果落在 2^63 以上」判斷，
  // 模數若超過 2^63，合法的餘數本身就可能大於 2^63，判斷會失效。
  // 本題保證 n <= 10^18 < 2^63，因此成立。
  static unsigned long long mul_mod(unsigned long long a, unsigned long long b,
                                    unsigned long long mod_value) {
      const unsigned long long quotient = static_cast<unsigned long long>(
          static_cast<long double>(a) * static_cast<long double>(b) /
          static_cast<long double>(mod_value));
      unsigned long long result = a * b - quotient * mod_value;
      if (result >= (1ULL << 63)) {
          result += mod_value;  // 估算偏大，差值環繞成巨大的無號數
      } else if (result >= mod_value) {
          result -= mod_value;  // 估算偏小
      }
      return result;
  }

  static unsigned long long power_mod(unsigned long long base, unsigned long long exponent,
                                      unsigned long long mod_value) {
      unsigned long long result = 1;
      base %= mod_value;
      while (exponent > 0) {
          if (exponent & 1) { result = mul_mod(result, base, mod_value); }
          base = mul_mod(base, base, mod_value);
          exponent >>= 1;
      }
      return result;
  }

  // Miller-Rabin：對這組固定底數，判定 2^64 以內的數是確定性的。
  static bool is_prime(unsigned long long n) {
      if (n < 2) { return false; }
      for (const unsigned long long small : {2ULL, 3ULL, 5ULL, 7ULL, 11ULL, 13ULL, 17ULL, 19ULL,
                                             23ULL, 29ULL, 31ULL, 37ULL}) {
          if (n % small == 0) { return n == small; }
      }
      unsigned long long odd_part = n - 1;
      int twos = 0;
      while ((odd_part & 1) == 0) { odd_part >>= 1; ++twos; }
      for (const unsigned long long base : {2ULL, 3ULL, 5ULL, 7ULL, 11ULL, 13ULL, 17ULL, 19ULL,
                                            23ULL, 29ULL, 31ULL, 37ULL}) {
          unsigned long long value = power_mod(base, odd_part, n);
          if (value == 1 || value == n - 1) { continue; }
          bool composite = true;
          for (int i = 1; i < twos; ++i) {
              value = mul_mod(value, value, n);
              if (value == n - 1) { composite = false; break; }
          }
          if (composite) { return false; }
      }
      return true;
  }

  // Pollard-Rho（Brent 版）：用 f(x) = x² + c 造出偽隨機序列，把多步的差值
  // 乘起來再一次求 gcd，大幅減少 gcd 呼叫次數。
  // 進來之前先保證 n 沒有小於 100 的因數：對極小的合數（例如 15），可選的 c
  // 只有十來個，有可能全部失敗而讓外層無限重試。
  static unsigned long long pollard_rho(unsigned long long n) {
      if ((n & 1) == 0) { return 2; }
      for (unsigned long long d = 3; d <= 100; d += 2) {
          if (n % d == 0) { return d; }
      }
      static mt19937_64 rng(20260725);
      while (true) {
          const unsigned long long c = rng() % (n - 1) + 1;
          auto next = [&](unsigned long long value) { return (mul_mod(value, value, n) + c) % n; };
          unsigned long long x = rng() % n;
          unsigned long long y = x;
          unsigned long long product = 1;
          int step = 0;
          int goal = 1;
          bool restart = false;
          while (!restart) {
              x = next(x);
              const unsigned long long difference = x > y ? x - y : y - x;
              if (difference == 0) { break; }  // 進入循環，換一組 c
              product = mul_mod(product, difference, n);
              if (product == 0) { break; }
              if (++step == goal) {
                  const unsigned long long divisor = __gcd(product, n);
                  if (divisor > 1 && divisor < n) { return divisor; }
                  if (divisor == n) { restart = true; break; }
                  y = x;
                  product = 1;
                  step = 0;
                  if (goal < (1 << 20)) { goal <<= 1; }  // 批次長度設上限，避免無止盡加倍
              }
          }
      }
  }

  // 剝掉一個因數後遞迴處理兩半；n <= best 時整段都不可能改善答案，直接剪枝。
  static void collect_largest(unsigned long long n, unsigned long long& best) {
      if (n == 1 || n <= best) { return; }
      if (is_prime(n)) { best = max(best, n); return; }
      const unsigned long long divisor = pollard_rho(n);
      collect_largest(divisor, best);
      collect_largest(n / divisor, best);
  }

  static unsigned long long largest_prime_factor(unsigned long long n) {
      unsigned long long best = 1;
      // 先試除小質數：既加速，也保證交給 Pollard-Rho 的數夠大。
      for (unsigned long long d = 2; d <= 100 && d * d <= n; ++d) {
          while (n % d == 0) {
              n /= d;
              best = d;
          }
      }
      collect_largest(n, best);
      return best;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests;
      if (!(cin >> tests)) { return 0; }
      while (tests-- > 0) {
          unsigned long long n;
          cin >> n;
          if (is_prime(n)) {
              cout << "Prime\n";
          } else {
              cout << largest_prime_factor(n) << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4718
external_platform: 洛谷
external_problem_id: P4718
external_title: '【模板】Pollard-Rho'
external_relation: original
source_book_pages: [424, 430]
source_pdf_pages: [54, 60]
review_status: verified
---

這題把數論、機率與整數溢位三件事綁在一起。試除前置與乘法取模是兩個最容易翻車的地方，先把它們寫穩再談效率。
