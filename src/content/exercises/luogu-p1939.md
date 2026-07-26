---
volume: lower
source_file: lower-volume
source_book_pages: [387, 461]
source_pdf_pages: [17, 91]
chapter: 6
section: '6.3'
kind: external-oj
review_status: verified
external_relation: original
id: luogu-p1939
title: 洛谷 P1939 矩陣加速（數列）
difficulty: 2
topics:
  - 矩陣快速冪
  - 三階遞推
prerequisites:
  - 矩陣乘法
statement: 數列前三項皆為 1，且對 x>=4 有 a_x=a_{x-1}+a_{x-3}。回答多組 a_n mod 1000000007。
constraints:
  - 1 <= T <= 100
  - 1 <= n <= 2000000000
input_format: 第一行為詢問數 T；接著 T 行各有一個正整數 n。
output_format: 每組輸出一行 a_n mod 1000000007。
samples:
  - input: |
      3
      6
      8
      10
    output: |
      4
      9
      19
    explanation: 數列開頭為 1,1,1,2,3,4,6,9,13,19，故三個詢問依序得到 4、9、19。
core_knowledge:
  - 三維狀態設計
  - 矩陣快速冪
judgment: 每次轉移需要保留最近三項，且 n 達 2×10^9；3×3 矩陣快速冪可將每組降為 O(log n)。
hints:
  - 狀態至少要同時保留 a_i、a_{i-1}、a_{i-2}。
  - 下一狀態第一項是舊第一項加舊第三項，其餘兩項只是向後搬移。
  - 從 [a_3,a_2,a_1] 推進 n-3 次；n<=3 直接輸出 1。
solution_outline: 建立對應 a_{i+1}=a_i+a_{i-2} 的 3×3 轉移矩陣；對每組 n 快速計算 n-3 次方並乘全 1 初始向量。
proof_or_invariant: 矩陣一次乘法把 [a_i,a_{i-1},a_{i-2}] 精確變成 [a_i+a_{i-2},a_i,a_{i-1}]=[a_{i+1},a_i,a_{i-1}]。歸納 n-3 次後第一分量即 a_n。
complexity:
  time: 每組 O(log n)
  space: O(1)
common_errors:
  - 把遞推誤寫成 a_{x-1}+a_{x-2}
  - 初始指數少一或多一
  - 每組詢問後未重設快速冪答案矩陣
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;

  static const long long kMod = 1000000007;

  struct Matrix { long long value[3][3]{}; };

  static Matrix multiply(const Matrix& left, const Matrix& right) {
      Matrix result;
      for (int i = 0; i < 3; ++i) for (int k = 0; k < 3; ++k) for (int j = 0; j < 3; ++j)
          result.value[i][j] = (result.value[i][j] + left.value[i][k] * right.value[k][j]) % kMod;
      return result;
  }

  static Matrix power(Matrix base_matrix, long long exponent) {
      Matrix result;
      for (int i = 0; i < 3; ++i) { result.value[i][i] = 1; }
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) { result = multiply(result, base_matrix); }
          base_matrix = multiply(base_matrix, base_matrix);
          exponent >>= 1;
      }
      return result;
  }

  // TODO：依提示重建狀態轉移與快速冪；目前保留可編譯框架。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int test_count;
      cin >> test_count;
      Matrix transition;
      transition.value[0][0] = transition.value[0][2] = 1;
      transition.value[1][0] = transition.value[2][1] = 1;
      while (test_count-- > 0) {
          long long n;
          cin >> n;
          if (n <= 3) { cout << 1 << '\n'; continue; }
          const Matrix result = power(transition, n - 3);
          cout << (result.value[0][0] + result.value[0][1] + result.value[0][2]) % kMod << '\n';
      }
      return 0;
  }
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;

  static const long long kMod = 1000000007;

  struct Matrix { long long value[3][3]{}; };

  static Matrix multiply(const Matrix& left, const Matrix& right) {
      Matrix result;
      for (int i = 0; i < 3; ++i) for (int k = 0; k < 3; ++k) for (int j = 0; j < 3; ++j)
          result.value[i][j] = (result.value[i][j] + left.value[i][k] * right.value[k][j]) % kMod;
      return result;
  }

  static Matrix power(Matrix base_matrix, long long exponent) {
      Matrix result;
      for (int i = 0; i < 3; ++i) { result.value[i][i] = 1; }
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) { result = multiply(result, base_matrix); }
          base_matrix = multiply(base_matrix, base_matrix);
          exponent >>= 1;
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int test_count;
      cin >> test_count;
      Matrix transition;
      transition.value[0][0] = transition.value[0][2] = 1;
      transition.value[1][0] = transition.value[2][1] = 1;
      while (test_count-- > 0) {
          long long n;
          cin >> n;
          if (n <= 3) { cout << 1 << '\n'; continue; }
          const Matrix result = power(transition, n - 3);
          cout << (result.value[0][0] + result.value[0][1] + result.value[0][2]) % kMod << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1939
external_platform: Luogu
external_problem_id: P1939
external_title: 矩陣加速（數列）
---

三階遞推只需固定大小矩陣，詢問數不會改變單次的對數複雜度。
