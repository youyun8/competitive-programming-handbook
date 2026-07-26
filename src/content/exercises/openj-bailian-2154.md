---
id: openj-bailian-2154
volume: lower
source_file: lower-volume
title: OpenJudge 2154 十億珠子的旋轉項鍊
chapter: 7
section: '7.7'
kind: external-oj
difficulty: 5
topics: [burnside-lemma, euler-totient, divisor-enumeration]
prerequisites: [burnside-polya]
statement: 用 N 種顏色為 N 顆環形珠子任意染色，只把旋轉後相同的染色視為同一項鍊（不計反射），求本質方案數模 P。
constraints: [1 <= test_cases <= 3500, 1 <= N <= 1000000000, 1 <= P <= 30000]
input_format: 第一行 X，接著 X 行各有 N、P。
output_format: 每組輸出一行答案模 P。
samples:
  - input: |-
      5
      1 30000
      2 30000
      3 30000
      4 30000
      5 30000
    output: |-
      1
      3
      11
      70
      629
    explanation: 分別對 N 個旋轉的固定染色數取 Burnside 平均。
core_knowledge: [按 gcd 分組 Burnside 和, Euler φ 函數]
judgment: 只忽略旋轉，不忽略翻面；P 不保證為質數，不能對 N 取模逆元。
hints:
  - 旋轉 i 格固定 N^gcd(N,i) 個染色。
  - gcd(N,i)=d 的旋轉數為 φ(N/d)，所以只需枚舉 N 的因數。
  - 利用每項 N^d/N=N^(d-1)，可在整數中先消除 Burnside 的除法。
solution_outline: 枚舉每對因數 d 與 N/d，累加 φ(N/d)N^(d-1) mod P。
proof_or_invariant: 旋轉 i 的位置置換有 gcd(N,i) 個循環，固定染色必須循環同色。令 d=gcd(N,i)，恰有 φ(N/d) 個 i 產生該 d。Burnside 式除以 N；每個固定點項 N^d 都含因子 N，故可逐項整除成 N^(d-1)，無須模逆元。
common_errors: [把反射也加入群, 對合數 P 求 N 的逆元, 因數成對枚舉時平方因數重算]
complexity: { time: 'O(sqrt(N)·(sqrt(N)+log N)) per case', space: 'O(1)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int cases; cin >> cases; /* TODO: 因數分組 Burnside。 */ }
cpp_solution: |
  #include <iostream>
  using namespace std;
  int totient(int value) {
      int result = value;
      for (int divisor = 2; static_cast<long long>(divisor) * divisor <= value; ++divisor) {
          if (value % divisor != 0) continue;
          result -= result / divisor;
          while (value % divisor == 0) value /= divisor;
      }
      if (value > 1) result -= result / value;
      return result;
  }
  int power_mod(long long base, int exponent, int modulus) {
      long long result = 1 % modulus;
      base %= modulus;
      while (exponent > 0) {
          if ((exponent & 1) != 0) result = result * base % modulus;
          base = base * base % modulus;
          exponent >>= 1;
      }
      return static_cast<int>(result);
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int test_cases;
      cin >> test_cases;
      while (test_cases-- > 0) {
          int n, modulus;
          cin >> n >> modulus;
          long long answer = 0;
          for (int divisor = 1; static_cast<long long>(divisor) * divisor <= n; ++divisor) {
              if (n % divisor != 0) continue;
              const int other = n / divisor;
              answer += static_cast<long long>(totient(other) % modulus) *
                        power_mod(n, divisor - 1, modulus);
              if (divisor != other)
                  answer += static_cast<long long>(totient(divisor) % modulus) *
                            power_mod(n, other - 1, modulus);
              answer %= modulus;
          }
          cout << answer << '\n';
      }
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/2154/
external_platform: OpenJudge 百練
external_problem_id: '2154'
external_title: Color
external_relation: original
source_book_pages: [492, 499]
source_pdf_pages: [122, 129]
review_status: verified
---

逐項消去 Burnside 分母，讓任意合數模數也能直接計算。
