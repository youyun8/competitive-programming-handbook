---
id: luogu-p5596
volume: lower
source_file: lower-volume
title: 洛谷 P5596 二次方程的自然數解計數
chapter: 7
section: '7.1'
kind: external-oj
difficulty: 3
topics: [factorization, diophantine-equation, divisor-enumeration]
prerequisites: [integer-factorization]
statement: 給定非負整數 a、b，計算滿足 y²-x²=ax+b 的非負整數對 (x,y) 數量；若有無限多組則輸出 inf。
constraints:
  - 0 <= a <= 100000000
  - 0 <= b <= 1000000000000000
  - 0 也屬於自然數
input_format: 一行兩個整數 a、b。
output_format: 有限時輸出解的組數；無限多組時輸出 inf。
samples:
  - input: '5 15'
    output: '1'
    explanation: 唯一解為 (x,y)=(6,9)，因為 9²-6²=45=5*6+15。
  - input: '4 4'
    output: inf
    explanation: x²+4x+4=(x+2)²，故每個 x>=0 都給出 y=x+2。
core_knowledge:
  - 配方後可把平方差分解成兩個同奇偶因數
  - 判別式為零時右側本身是完全平方，產生無限解
judgment: x、y 都可為 0；每個不同的有序對計一次。
hints:
  - 將等式乘 4 並配方，得到 (2x+a)²-(2y)²=a²-4b。
  - 若 a²=4b，則 y=x+a/2 對所有 x 成立；此時 a 必為偶數。
  - 否則枚舉 |a²-4b| 的因數對，依正負情況還原 x、y，檢查整除 4 與非負性。
solution_outline: >-
  設 delta=a²-4b。delta=0 輸出 inf。對 abs(delta) 的每個正因數 q<=sqrt，
  令 p=abs(delta)/q；delta>0 時由 x=(p+q-2a)/4、y=(p-q)/4 還原，
  delta<0 時由 x=(p-q-2a)/4、y=(p+q)/4 還原，檢查分子可整除 4 且 x,y 非負。
proof_or_invariant: >-
  配方恆等式把每組解映成 delta 的一組正因數對；delta 正時兩因子為
  2x+a+2y、2x+a-2y，delta 負時改取 2y+2x+a、2y-2x-a。
  反解公式唯一，整除與非負檢查又保證回代成立，因此枚舉既無遺漏也不重複。
common_errors:
  - 忘記 a²=4b 的無限解情形
  - 使用 32 位元整數計算 a² 或 4b
  - 只檢查因數整除，未檢查還原分子能否被 4 整除
complexity:
  time: O(sqrt(|a²-4b|))
  space: O(1)
cpp_skeleton: |
  #include <cstdint>
  #include <iostream>
  using namespace std;

  int main() {
      int64_t a, b;
      cin >> a >> b;
      const int64_t delta = a * a - 4 * b;
      // TODO：特判 delta=0，否則枚舉因數對並還原自然數解。
      (void)delta;
      return 0;
  }
cpp_solution: |
  #include <cstdint>
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int64_t a, b;
      cin >> a >> b;
      const int64_t delta = a * a - 4 * b;
      if (delta == 0) {
          cout << "inf\n";
          return 0;
      }
      const int64_t absolute = delta > 0 ? delta : -delta;
      int64_t answer = 0;
      for (int64_t q = 1; q <= absolute / q; ++q) {
          if (absolute % q != 0) { continue; }
          const int64_t p = absolute / q;
          int64_t x_numerator;
          int64_t y_numerator;
          if (delta > 0) {
              x_numerator = p + q - 2 * a;
              y_numerator = p - q;
          } else {
              x_numerator = p - q - 2 * a;
              y_numerator = p + q;
          }
          if (x_numerator % 4 != 0 || y_numerator % 4 != 0) { continue; }
          const int64_t x = x_numerator / 4;
          const int64_t y = y_numerator / 4;
          if (x >= 0 && y >= 0) { ++answer; }
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5596
external_platform: 洛谷
external_problem_id: P5596
external_title: '【XR-4】題'
external_relation: original
source_book_pages: [463, 467]
source_pdf_pages: [93, 97]
review_status: verified
---

配方不是只為判別完全平方；它還把雙變數方程轉成有限的因數對枚舉。
