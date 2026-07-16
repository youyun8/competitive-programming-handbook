---
id: modular-power
volume: lower
source_file: lower-volume
title: 大指數模冪
chapter: 6
section: '6.2'
kind: practice
difficulty: 2
topics: [fast-power, modulo]
prerequisites: [binary-representation]
statement: 給定整數 base、非負整數 exponent 與正整數 modulus，計算 base^exponent mod modulus。base 可能為負數。
constraints:
  - -1000000000000000000 <= base <= 1000000000000000000
  - 0 <= exponent <= 1000000000000000000
  - 1 <= modulus <= 1000000000000000000
input_format: 一行包含 base、exponent、modulus。
output_format: 輸出位於 [0, modulus) 的答案。
samples:
  - input: |
      3 13 17
    output: |
      12
hints:
  - 將 exponent 看成二進位，每輪處理最低位。
  - 負數取模後再加 modulus 以正規化。
  - 兩個 long long 相乘可能溢位，可用 __int128 承接中間值。
solution_outline: 維持 result * base^exponent 與原目標同餘；奇數位乘入 result，之後 base 平方且 exponent 右移。
proof_or_invariant: 每輪把指數最低位拆出，或以 base^e = (base^2)^(e/2) 改寫，因此不變量保持。
complexity:
  time: O(log exponent)
  space: O(1)
cpp_solution: |
  #include <iostream>

  long long multiply_mod(long long left, long long right, long long modulus) {
      return static_cast<long long>((__int128)left * right % modulus);
  }

  long long modular_power(long long base, long long exponent, long long modulus) {
      base %= modulus;
      if (base < 0) base += modulus;
      long long result = 1 % modulus;
      while (exponent > 0) {
          if (exponent & 1LL) result = multiply_mod(result, base, modulus);
          base = multiply_mod(base, base, modulus);
          exponent >>= 1;
      }
      return result;
  }

  int main() {
      long long base = 0;
      long long exponent = 0;
      long long modulus = 0;
      std::cin >> base >> exponent >> modulus;
      std::cout << modular_power(base, exponent, modulus) << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1226
external_platform: 洛谷
external_problem_id: P1226
external_title: 【模板】快速冪
external_relation: related
source_book_pages: [387, 461]
source_pdf_pages: [17, 91]
review_status: verified
---

此題特別檢查負底數與乘法中間值溢位。
