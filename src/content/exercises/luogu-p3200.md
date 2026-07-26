---
id: luogu-p3200
volume: lower
source_file: lower-volume
title: 洛谷 P3200 合數模數下的 Catalan 數
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 5
topics: [catalan-number, linear-sieve, prime-factorization]
prerequisites: [catalan-stirling]
statement: 求 1 到 2n 的排列 a 中，同奇偶位置各自嚴格遞增，且每一組 a_(2i-1)<a_(2i) 的排列數，答案模任意正整數 p。
constraints:
  - 1 <= n <= 1000000
  - 1 <= p <= 1000000000
input_format: 一行兩個正整數 n、p。
output_format: 輸出合法排列數模 p。
samples:
  - input: '3 10'
    output: '5'
    explanation: 共有題面列出的五個合法排列，因此模 10 仍為 5。
core_knowledge: [合法排列與 Dyck 路徑一一對應, 以質因數指數表示整數分式]
judgment: p 不保證為質數，不能對 n+1 直接取模逆元。
hints:
  - 依數值 1 到 2n 決定它被放進奇數欄或偶數欄；任一前綴中前者不能較少。
  - 答案是 Cat_n=(n+2)(n+3)...(2n)/(1·2...n)。
  - 篩出每個數的最小質因數，累加分子與分母中各質數的指數。
solution_outline: 線性篩至 2n；分解 1..n 時指數減一、n+2..2n 時加一，再將各質數的非負次方模 p 相乘。
proof_or_invariant: 由兩欄遞增性，一旦選定每個值所在欄，排列唯一；配對條件等價於每個值前綴的奇數欄數量不少於偶數欄，故方案是 Catalan 數。公式本身為整數，完全質因數分解後所有總指數非負，於合數模數下也可直接重建。
common_errors: [對合數模數使用費馬逆元, Catalan 分子誤從 n+1 開始, 乘法未使用 64 位元]
complexity: { time: 'O(n log n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n, modulus; cin >> n >> modulus; /* TODO: 篩法與指數。 */ return 0; }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;
  long long power_mod(long long base, int exponent, int modulus) {
      long long result = 1 % modulus;
      base %= modulus;
      while (exponent > 0) {
          if ((exponent & 1) != 0) result = result * base % modulus;
          base = base * base % modulus;
          exponent >>= 1;
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, modulus;
      cin >> n >> modulus;
      if (modulus == 1) { cout << 0 << '\n'; return 0; }
      const int limit = 2 * n;
      vector<int> least(static_cast<size_t>(limit) + 1U);
      vector<int> primes;
      for (int value = 2; value <= limit; ++value) {
          if (least[static_cast<size_t>(value)] == 0) {
              least[static_cast<size_t>(value)] = value;
              primes.push_back(value);
          }
          for (int prime : primes) {
              if (prime > least[static_cast<size_t>(value)] ||
                  static_cast<long long>(prime) * value > limit) break;
              least[static_cast<size_t>(prime * value)] = prime;
          }
      }
      vector<int> exponent(static_cast<size_t>(limit) + 1U);
      const auto add_factors = [&](int original, int delta) {
          int value = original;
          while (value > 1) {
              const int prime = least[static_cast<size_t>(value)];
              exponent[static_cast<size_t>(prime)] += delta;
              value /= prime;
          }
      };
      for (int value = 1; value <= n; ++value) add_factors(value, -1);
      for (int value = n + 2; value <= limit; ++value) add_factors(value, 1);
      long long answer = 1;
      for (int prime : primes) {
          answer = answer * power_mod(prime, exponent[static_cast<size_t>(prime)], modulus) % modulus;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3200
external_platform: 洛谷
external_problem_id: P3200
external_title: '[HNOI2009] 有趣的數列'
external_relation: original
source_book_pages: [486, 491]
source_pdf_pages: [116, 121]
review_status: verified
---

本題的關鍵不是辨認 Catalan 數，而是避免在合數模數下做除法。
