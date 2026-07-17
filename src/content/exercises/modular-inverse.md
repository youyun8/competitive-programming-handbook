---

id: modular-inverse
volume: lower
source_file: lower-volume
title: 模反元素
chapter: 6
section: '6.9'
kind: practice
difficulty: 2
topics:
  - modular-inverse
  - extended-gcd
  - fast-power
prerequisites:
  - gcd
  - modular-arithmetic
statement: 給定 a 與質數 mod，求 a 在模 mod 下的乘法反元素。即找到 x 使得 a * x ≡ 1 (mod mod)。若不存在則輸出 -1。
constraints:
  - 1 <= a, mod <= 1000000000
  - mod 為質數
input_format: 一行包含 a 與 mod。
output_format: 輸出最小非負整數 x；若不存在輸出 -1。
samples:
  - input: |
      3 11
    output: |
      4
    explanation: 3 * 4 = 12 ≡ 1 (mod 11)。
hints:
  - 使用擴展歐幾里得求 ax + by = gcd(a,mod) 的解。
  - 若 mod 為質數，也可用快速冪計算 a^(mod-2) mod mod。
solution_outline: 擴展歐幾里得求出 x 使得 ax + mod*y = 1，則 x mod mod 即為反元素。
proof_or_invariant: 根據裴蜀定理，反元素存在當且僅當 gcd(a, mod) = 1。擴展歐幾里得給出 Bézout 係數。
complexity:
  time: O(log mod)
  space: O(log mod)
cpp_solution: |
  #include <cstdint>
  #include <iostream>
  
  long long extended_gcd(long long a, long long b, long long& x, long long& y) {
      if (b == 0) { x = 1; y = 0; return a; }
      long long x1 = 0, y1 = 0;
      long long g = extended_gcd(b, a % b, x1, y1);
      x = y1;
      y = x1 - (a / b) * y1;
      return g;
  }
  
  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      long long a = 0, mod = 0;
      std::cin >> a >> mod;
      long long x = 0, y = 0;
      long long g = extended_gcd(a, mod, x, y);
      if (g != 1) {
          std::cout << -1 << "\n";
      } else {
          long long result = (x % mod + mod) % mod;
          std::cout << result << "\n";
      }
  }
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
review_status: verified
external_url: https://www.luogu.com.cn/problem/P3811
external_platform: 洛谷
external_problem_id: P3811
external_title: 【模板】乘法逆元
external_relation: related
---

