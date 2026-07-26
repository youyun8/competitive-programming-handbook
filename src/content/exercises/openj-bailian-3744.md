---
id: openj-bailian-3744
volume: lower
source_file: lower-volume
title: OpenJudge 3744 四色方塊的偶數限制
chapter: 7
section: '7.8'
kind: external-oj
difficulty: 3
topics: [generating-function, parity, fast-power]
prerequisites: [generating-functions]
statement: 一列 n 個有編號方塊各塗紅、藍、綠、黃之一，要求紅色與綠色方塊數皆為偶數，求方案數模 10007。
constraints: [1 <= test_cases <= 100, 1 <= n <= 1000000000]
input_format: 第一行 T，接著 T 行各一個 n。
output_format: 每筆輸出一行合法塗色數模 10007。
samples:
  - input: |-
      2
      1
      2
    output: |-
      2
      6
    explanation: n=1 只能塗藍或黃；n=2 另可兩格皆紅或皆綠，共六種。
core_knowledge: [根值篩選的奇偶計數, 模快速冪]
judgment: 方塊位置可區分；藍與黃出現次數不受限制。
hints:
  - 一個指定顏色出現偶數次可用 (1+(-1)^count)/2 作指示函數。
  - 對紅、綠各套一次奇偶篩選，四種符號組合可化簡為 (4^n+2·2^n)/4。
  - 10007 是質數，4 的模逆元可用快速冪求得。
solution_outline: 每筆以快速冪算 4^n、2^n，乘 inv(4) 後取模。
proof_or_invariant: 對每個塗色字串乘上紅色偶數與綠色偶數的兩個指示函數並求和。展開四項後，無符號項為 4^n，只有紅或只有綠翻號的兩項各為 2^n，兩者都翻號時每格權值和為 0，故 n>=1 時答案為 (4^n+2·2^n)/4。
common_errors: [漏掉除以 4, 使用整數除法而非模逆元, 把藍色也限制為偶數]
complexity: { time: 'O(T log n)', space: 'O(1)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int test_count; cin >> test_count; /* TODO: 奇偶篩選公式。 */ return 0; }
cpp_solution: |
  #include <iostream>
  using namespace std;
  int power_mod(int base, int exponent) {
      constexpr int modulus = 10007;
      int result = 1;
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
      constexpr int modulus = 10007;
      const int inverse_four = power_mod(4, modulus - 2);
      int test_count;
      cin >> test_count;
      while (test_count-- > 0) {
          int n;
          cin >> n;
          const int numerator = (power_mod(4, n) + 2 * power_mod(2, n)) % modulus;
          cout << numerator * inverse_four % modulus << '\n';
      }
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/3744/
external_platform: OpenJudge 百練
external_problem_id: '3744'
external_title: Blocks
external_relation: original
source_book_pages: [500]
source_pdf_pages: [130]
review_status: verified
---

這題與 HDU 2065 是同一奇偶篩選模型，但模數與輸入範圍不同。
