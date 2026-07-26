---
id: luogu-p3807
volume: lower
source_file: lower-volume
title: 洛谷 P3807 盧卡斯定理：質數模下的大組合數
chapter: 7
section: '7.4'
kind: external-oj
difficulty: 3
topics: ['盧卡斯定理', '組合數', '模逆元', '進位分解']
prerequisites: ['lucas-theorem', 'combinatorics-basics']
statement: |-
  給定 n、m 與質數 p，求 C(n+m, m) 對 p 取模的值。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '1 <= T <= 10'
  - '1 <= n,m,p <= 100000'
  - '輸入保證 p 為質數'
input_format: '第一行一個整數 T 表示測資組數；接下來 T 行，每行三個整數 n、m、p。'
output_format: '每組測資輸出一行，表示 C(n+m, m) mod p。'
samples:
  - input: |
      2
      1 2 5
      2 1 5
    output: |
      3
      3
    explanation: C(3,2)=3 與 C(3,1)=3，模 5 後都是 3；這也呈現組合數的對稱性。
core_knowledge:
  - Lucas 定理把大組合數依 p 進位拆成小組合數乘積
  - 質數模下可用費馬小定理求非零階乘的逆元
judgment: 每組輸出 C(n+m,m) mod p，且 p 由輸入保證為質數。
hints:
  - 直接用階乘公式時，階乘可能含因數 p，取模成 0 後便沒有逆元；需要把數字分位處理。
  - Lucas 定理給出 C(N,M)≡C(N mod p,M mod p)·C(floor(N/p),floor(M/p)) (mod p)。
  - 每一位都小於 p，可用階乘與費馬逆元算小組合數；遞迴處理所有 p 進位位即可。
solution_outline: |-
  對每組測資先預處理 0..p−1 的階乘表。binomial(n, m) 在 n、m < p 時用 n!·(m!)^{-1}·((n−m)!)^{-1} 計算，逆元由費馬小定理的快速冪求得，m > n 時回傳 0。lucas 遞迴地把 n、m 逐位分解相乘，直到 m 為 0。
proof_or_invariant: |-
  盧卡斯定理可由 (1+x)^p ≡ 1 + x^p (mod p) 推出：把 (1+x)^n 依 n 的 p 進位展開後比較 x^m 的係數，即得逐位相乘的結論。因此遞迴每往下一層就處理掉一個 p 進位位，深度為 log_p(n)。
common_errors:
  - 直接對含因數 p 的階乘求逆元
  - 某一位 m mod p 大於 n mod p 時仍存取負索引，而非回傳 0
  - 忘記每組測資的 p 可能不同，沿用上一組的階乘表
complexity:
  time: '每組 O(p + log_p(n) · log p)'
  space: 'O(p)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // 已備好：快速冪，用來求逆元。
  static long long power_mod(long long base, long long exponent, long long mod_value) {
      long long result = 1;
      base %= mod_value;
      while (exponent > 0) {
          if (exponent & 1) { result = result * base % mod_value; }
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }

  static vector<long long> factorial;

  // TODO 1：n、m 都小於 p 時的組合數。
  //   C(n, m) = n! · (m!)^-1 · ((n-m)!)^-1，逆元用 power_mod(x, p-2, p)。
  //   m > n 時直接回傳 0。
  static long long binomial(long long n, long long m, long long p) {
      (void)n;
      (void)m;
      (void)p;
      (void)factorial;
      return 0;
  }

  // TODO 2：Lucas 定理。
  //   C(n, m) mod p ≡ C(n mod p, m mod p) · C(⌊n/p⌋, ⌊m/p⌋) mod p。
  //   也就是把 n、m 寫成 p 進位後逐位相乘，遞迴到 m == 0 時回傳 1。
  static long long lucas(long long n, long long m, long long p) {
      (void)n;
      (void)m;
      (void)p;
      return 1;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests;
      if (!(cin >> tests)) { return 0; }
      while (tests-- > 0) {
          long long n, m, p;
          cin >> n >> m >> p;
          // 每組測資的 p 不同，階乘表要重算；只需要算到 p-1。
          factorial.assign(static_cast<size_t>(p), 1);
          for (long long i = 1; i < p; ++i) {
              factorial[static_cast<size_t>(i)] = factorial[static_cast<size_t>(i - 1)] * i % p;
          }
          (void)power_mod;
          (void)binomial;
          cout << lucas(n + m, m, p) << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // Lucas 定理：C(n, m) mod p ≡ C(n mod p, m mod p) · C(n/p, m/p) mod p（p 為質數）。
  // 於是把 n、m 在 p 進位下逐位相乘，每位的組合數都能用階乘直接算。
  static long long power_mod(long long base, long long exponent, long long mod_value) {
      long long result = 1;
      base %= mod_value;
      while (exponent > 0) {
          if (exponent & 1) { result = result * base % mod_value; }
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }

  static vector<long long> factorial;

  // 單層組合數：n、m 都小於 p 時直接用階乘與逆元。
  static long long binomial(long long n, long long m, long long p) {
      if (m > n) { return 0; }
      return factorial[static_cast<size_t>(n)] *
             power_mod(factorial[static_cast<size_t>(m)] * factorial[static_cast<size_t>(n - m)] % p,
                       p - 2, p) %
             p;
  }

  static long long lucas(long long n, long long m, long long p) {
      if (m == 0) { return 1; }
      return binomial(n % p, m % p, p) * lucas(n / p, m / p, p) % p;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests;
      if (!(cin >> tests)) { return 0; }
      while (tests-- > 0) {
          long long n, m, p;
          cin >> n >> m >> p;
          factorial.assign(static_cast<size_t>(p), 1);
          for (long long i = 1; i < p; ++i) {
              factorial[static_cast<size_t>(i)] = factorial[static_cast<size_t>(i - 1)] * i % p;
          }
          cout << lucas(n + m, m, p) << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3807
external_platform: 洛谷
external_problem_id: P3807
external_title: '【模板】盧卡斯定理 / Lucas 定理'
external_relation: original
source_book_pages: [477, 480]
source_pdf_pages: [107, 110]
review_status: verified
---

盧卡斯定理把「大組合數模小質數」化成「一串小組合數相乘」。關鍵洞見是 (1+x)^p ≡ 1 + x^p，值得自己推一次。
