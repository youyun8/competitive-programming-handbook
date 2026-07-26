---
id: luogu-p5221
volume: lower
source_file: lower-volume
title: 洛谷 P5221 Product
chapter: 6
section: '6.13'
kind: external-oj
difficulty: 5
topics:
  - 歐拉函數
  - GCD 乘積
  - 模逆元
prerequisites:
  - euler-totient
  - fast-power
statement: >-
  計算 product_{i=1}^n product_{j=1}^n (lcm(i,j)/gcd(i,j))，結果模 104857601。
constraints:
  - 1 <= n <= 1000000
  - 模數固定為質數 104857601
input_format: >-
  一行一個正整數 n。
output_format: >-
  輸出乘積模 104857601。
samples:
  - input: |
      5
    output: |
      585494
    explanation: >-
      依題面 5*5 表逐項相乘後取模得到 585494；官方樣例。
hints:
  - >-
    lcm(i,j)/gcd(i,j)=ij/gcd(i,j)^2。
  - >-
    分子為 (n!)^(2n)；按 gcd=d 分組處理分母。
  - >-
    gcd(x,y)=1 且 1<=x,y<=q 的有序對數是 2*sum_{i=1}^q phi(i)-1。
core_knowledge:
  - 歐拉函數前綴和
  - GCD 分組
judgment: >-
  乘積無法逐對計算；把 lcm 改寫後，唯一困難是各 gcd 出現次數。
solution_outline: >-
  線性篩 phi 並做前綴和。分子快速冪求 (n!)^(2n)；對每個 d，gcd 恰為 d 的對數等於 2*Phi(n/d)-1，將 d 的兩倍該次方乘入分母，最後乘分母逆元。
proof_or_invariant: >-
  恆等式 lcm*gcd=ij 給出分子與 gcd 平方分母。令 i=dx,j=dy，gcd(i,j)=d 與 gcd(x,y)=1 雙射；互質有序對由對角兩側 phi 計數得 2Phi(q)-1。故每個 d 的指數精確。
common_errors:
  - 分母的 gcd 忘記平方
  - 互質有序對漏掉 -1
  - 模指數未按 MOD-1 處理
complexity:
  time: O(n log MOD)
  space: O(n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依照三個提示完成演算法；先保留可編譯的輸入輸出骨架。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  static constexpr long long kMod = 104857601;
  static long long power_mod(long long base, long long exponent) {
      long long result = 1;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) result = result * base % kMod;
          base = base * base % kMod; exponent >>= 1LL;
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n; cin >> n;
      vector<int> phi(static_cast<size_t>(n) + 1), primes;
      vector<char> composite(static_cast<size_t>(n) + 1, false);
      phi[1] = 1;
      for (int i = 2; i <= n; ++i) {
          if (!composite[static_cast<size_t>(i)]) { primes.push_back(i); phi[static_cast<size_t>(i)] = i - 1; }
          for (int p : primes) {
              if (p > n / i) break;
              const int next = i * p; composite[static_cast<size_t>(next)] = true;
              if (i % p == 0) { phi[static_cast<size_t>(next)] = phi[static_cast<size_t>(i)] * p; break; }
              phi[static_cast<size_t>(next)] = phi[static_cast<size_t>(i)] * (p - 1);
          }
      }
      vector<long long> prefix_phi(static_cast<size_t>(n) + 1, 0);
      long long factorial = 1;
      for (int i = 1; i <= n; ++i) {
          prefix_phi[static_cast<size_t>(i)] = prefix_phi[static_cast<size_t>(i - 1)] + phi[static_cast<size_t>(i)];
          factorial = factorial * i % kMod;
      }
      long long denominator = 1;
      for (int divisor = 1; divisor <= n; ++divisor) {
          const long long pair_count = 2 * prefix_phi[static_cast<size_t>(n / divisor)] - 1;
          const long long exponent = 2 * (pair_count % (kMod - 1)) % (kMod - 1);
          denominator = denominator * power_mod(divisor, exponent) % kMod;
      }
      const long long numerator = power_mod(factorial, 2LL * n);
      cout << numerator * power_mod(denominator, kMod - 2) % kMod << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5221
external_platform: 洛谷
external_problem_id: 'P5221'
external_title: 'Product'
external_relation: original
original_label: '洛谷 P5221'
source_book_pages: [437, 442]
source_pdf_pages: [67, 72]
review_status: verified
---

這題展示 phi 前綴和如何計算整張 gcd 表的乘積。

原始題單中本題位於第 6.13 節、習題 第 4 題；競賽來源記為「未標示」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
