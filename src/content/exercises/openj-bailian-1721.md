---
id: openj-bailian-1721
volume: lower
source_file: lower-volume
title: OpenJudge 1721 反解雙重洗牌
chapter: 7
section: '7.7'
kind: external-oj
difficulty: 4
topics: [permutation-power, modular-inverse]
prerequisites: [burnside-polya]
statement: 初始牌序 x 是一個長度為奇數 n 的單一循環置換。一次雙重洗牌把每個位置 i 的牌 x_i 改成 x_(x_i)，即把置換平方。給做 S 次後的置換 p，還原 x。
constraints: [1 <= n <= 1000, n 為奇數, 1 <= S <= 1000]
input_format: 第一行 n、S，接著 n 行依序給 p_i。
output_format: 輸出 n 行，依序為原置換 x_i。
samples:
  - input: |-
      7 4
      6
      3
      1
      2
      4
      7
      5
    output: |-
      4
      7
      5
      6
      1
      2
      3
    explanation: 輸出置換連續平方四次後恰得到輸入置換。
core_knowledge: [置換合成冪, 奇數模數下二的逆元]
judgment: 一次操作是整個置換自我合成，不是交換相鄰牌。
hints:
  - S 次平方後有 p=x^(2^S)。
  - x 是 n-cycle；置換指數只需模 n，且奇數 n 保證 2^S 在模 n 下可逆。
  - 求 d=(2^S)^(-1) mod n，則 x=p^d。
solution_outline: 快速冪求 e=2^S mod n，以擴展歐幾里德求 d；對每個 i 沿 p 走 d 次得到 x_i。
proof_or_invariant: 初始牌序由題述環形安排形成 n-cycle，所以 x^n=id。雙重洗牌一次把 x 變 x²，歸納 S 次為 x^(2^S)。由 gcd(2^S,n)=1 存在 d 使 2^S d≡1 mod n，故 p^d=x^(2^S d)=x。
common_errors: [把 S 當置換指數而非平方次數, 對 2^S 使用一般整數而溢位, 忽略位置與牌號都是 1-based]
complexity: { time: 'O(n^2 + log S)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n, shuffles; cin >> n >> shuffles; /* TODO: 求置換根。 */ }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;
  long long extended_gcd(long long a, long long b, long long &x, long long &y) {
      if (b == 0) { x = 1; y = 0; return a; }
      long long next_x, next_y;
      const long long divisor = extended_gcd(b, a % b, next_x, next_y);
      x = next_y;
      y = next_x - a / b * next_y;
      return divisor;
  }
  int power_mod(int base, int exponent, int modulus) {
      int result = 1 % modulus;
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
      int n, shuffles;
      cin >> n >> shuffles;
      vector<int> final_permutation(static_cast<size_t>(n));
      for (int &value : final_permutation) { cin >> value; --value; }
      if (n == 1) { cout << 1 << '\n'; return 0; }
      const int exponent = power_mod(2, shuffles, n);
      long long inverse, unused;
      extended_gcd(exponent, n, inverse, unused);
      const int root_exponent = static_cast<int>((inverse % n + n) % n);
      for (int start = 0; start < n; ++start) {
          int current = start;
          for (int step = 0; step < root_exponent; ++step)
              current = final_permutation[static_cast<size_t>(current)];
          cout << current + 1 << '\n';
      }
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/1721/
external_platform: OpenJudge 百練
external_problem_id: '1721'
external_title: CARDS
external_relation: original
source_book_pages: [492, 499]
source_pdf_pages: [122, 129]
review_status: verified
---

奇數 n 的條件正是保證重複平方在 n-cycle 指數群上可逆。
