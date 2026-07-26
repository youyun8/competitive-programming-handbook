---
id: luogu-p4980
volume: lower
source_file: lower-volume
title: 洛谷 P4980 Pólya 定理：旋轉同構的項鍊染色
chapter: 7
section: '7.7'
kind: external-oj
difficulty: 4
topics: ['Pólya 定理', 'Burnside 引理', '歐拉函數', '快速冪', '群論計數']
prerequisites: ['burnside-polya', 'euler-totient', 'fast-power']
statement: |-
  一個環上有 n 顆珠子，可以用 n 種顏色染色。若兩種染色方案可以透過旋轉互相得到，就視為同一種。求本質不同的方案數對 10^9+7 取模。
constraints:
  - '1 <= n <= 10^9'
  - '只考慮旋轉，不考慮翻轉'
  - '多組詢問'
input_format: '第一行一個整數 T；接下來 T 行每行一個整數 n。'
output_format: '每組輸出一行，表示答案對 10^9+7 取模的結果。'
samples:
  - input: |
      5
      1
      2
      3
      4
      10
    output: |
      1
      3
      11
      70
      10037
    explanation: n=3 時共有 27 個有標號染色；依三種旋轉的不動點數取平均後得到 (27+3+3)/3=11。
core_knowledge:
  - Burnside 引理以所有旋轉的不動點平均數計算軌道數
  - 依 gcd 分組後可用歐拉函數計算同類旋轉數量
judgment: 旋轉後一致視為同一方案，但鏡射後一致不會合併。
hints:
  - Burnside 引理要求把 n 個旋轉各自固定的染色數相加，再除以群大小 n。
  - 旋轉 i 格會產生 gcd(i,n) 個循環，每個循環只能選一種顏色，因此固定 n^gcd(i,n) 種染色。
  - 依 d=gcd(i,n) 合併：共有 φ(n/d) 個這類旋轉，故只需枚舉因數並計算 Σ φ(n/d)n^d。
solution_outline: |-
  對每個 n 枚舉其所有因數 d（只跑到 √n，成對取 d 與 n/d），累加 φ(n/d)·n^d，其中 φ 用試除法單獨計算、n^d 用快速冪。最後乘上 n 的模逆元（費馬小定理）即為答案。
proof_or_invariant: |-
  Burnside 引理保證等價類數等於不動點數的平均。旋轉 i 的置換分解為 gcd(i,n) 個等長循環，故不動點數為 c^gcd(i,n)（c 為顏色數，本題 c = n）。再由「gcd(i,n) = d 的 i 恰有 φ(n/d) 個」把 O(n) 的求和壓成對因數求和，得到 (1/n) Σ_{d|n} φ(n/d)·n^d。
common_errors:
  - 把翻轉也放進作用群，誤算成手鍊而非項鍊
  - 直接枚舉全部 n 個旋轉而超時
  - 用整數除法除以 n；模運算下必須乘 n 的模逆元
complexity:
  time: '每組 O(τ(n)√n + τ(n)log n)，其中 τ(n) 為因數個數'
  space: 'O(1)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static const long long k_mod = 1000000007;

  static long long power_mod(long long base, long long exponent) {
      long long result = 1;
      base %= k_mod;
      while (exponent > 0) {
          if (exponent & 1) { result = result * base % k_mod; }
          base = base * base % k_mod;
          exponent >>= 1;
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests;
      if (!(cin >> tests)) { return 0; }
      while (tests-- > 0) {
          long long n;
          cin >> n;
          // TODO：Burnside / Pólya。
          //   旋轉 i 格這個置換把 n 顆珠子分成 gcd(i, n) 個循環，
          //   每個循環內顏色必須相同，故不動點數是 n^gcd(i,n)。
          //   由 Burnside 引理，答案 = (1/n) Σ_{i=1}^{n} n^gcd(i,n)。
          //   直接枚舉 i 是 O(n)，n 到 10^9 太慢；
          //   把相同的 gcd 合併：令 d = gcd(i, n)，這樣的 i 共有 φ(n/d) 個，
          //   於是 答案 = (1/n) Σ_{d | n} φ(n/d)·n^d，只需枚舉 n 的因數。
          //   「除以 n」在模意義下是乘上 n 的逆元。
          // TODO：枚舉 n 的因數，依 gcd 分組累加不動點數。
          (void)n;
          (void)power_mod(n, 0);
          cout << 0 << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static const long long k_mod = 1000000007;

  static long long power_mod(long long base, long long exponent) {
      long long result = 1;
      base %= k_mod;
      while (exponent > 0) {
          if (exponent & 1) { result = result * base % k_mod; }
          base = base * base % k_mod;
          exponent >>= 1;
      }
      return result;
  }

  // 單個數的歐拉函數，用試除法求，因為只需要對 n 的因數各算一次。
  static long long euler_phi(long long value) {
      long long result = value;
      for (long long p = 2; p * p <= value; ++p) {
          if (value % p != 0) { continue; }
          result = result / p * (p - 1);
          while (value % p == 0) { value /= p; }
      }
      if (value > 1) { result = result / value * (value - 1); }
      return result;
  }

  // Pólya 定理：n 顆珠子、n 種顏色、只考慮旋轉，
  // 方案數 = (1/n) Σ_{i=1}^{n} n^gcd(i, n) = (1/n) Σ_{d|n} φ(n/d)·n^d。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests;
      if (!(cin >> tests)) { return 0; }
      while (tests-- > 0) {
          long long n;
          cin >> n;
          long long total = 0;
          for (long long d = 1; d * d <= n; ++d) {
              if (n % d != 0) { continue; }
              total = (total + euler_phi(n / d) % k_mod * power_mod(n, d)) % k_mod;
              if (d != n / d) {
                  total = (total + euler_phi(d) % k_mod * power_mod(n, n / d)) % k_mod;
              }
          }
          cout << total % k_mod * power_mod(n % k_mod, k_mod - 2) % k_mod << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4980
external_platform: 洛谷
external_problem_id: P4980
external_title: '【模板】Pólya 定理'
external_relation: original
source_book_pages: [492, 498]
source_pdf_pages: [122, 128]
review_status: verified
---

這題把 Burnside 從「定義」推到「可計算的式子」的每一步都用上了：置換的循環分解、gcd 分組、φ 計數。三步都懂了，Pólya 就不再是背公式。
