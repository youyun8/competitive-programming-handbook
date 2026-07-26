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
id: luogu-p2044
title: 洛谷 P2044 隨機數生成器
difficulty: 4
topics:
  - 仿射轉移
  - 矩陣快速冪
  - 防溢位乘法
prerequisites:
  - 矩陣快速冪
  - 模運算
statement: 序列由 X_{i+1}=(aX_i+c) mod m 生成。給定 m、a、c、X_0、n、g，求 X_n mod g。
constraints:
  - 1 <= n,m <= 10^18
  - 0 <= a,c,X_0 <= 10^18
  - 1 <= g <= 100000000
input_format: 一行六個整數 m、a、c、X_0、n、g。
output_format: 輸出 X_n mod g。
samples:
  - input: |
      11 8 7 1 5 3
    output: |
      2
    explanation: 依遞推得到 X_5=8，最後 8 mod 3=2。
core_knowledge:
  - 仿射函數齊次化
  - 矩陣快速冪
  - 二進位乘法取模
judgment: n 與模數都可達 10^18；需以 2×2 矩陣跳過 n 次轉移，矩陣元素乘法另以倍增避免 64 位元溢位。
hints:
  - 在狀態後附加常數 1，就能把 ax+c 寫成線性矩陣轉移。
  - 矩陣 [[a,c],[0,1]] 的 n 次方乘 [X_0,1]，第一分量就是 X_n（模 m）。
  - 兩個小於 m 的數相乘仍可能溢位；用二進位倍增乘法，連加法也要以比較方式避免超界。
solution_outline: 建立仿射 2×2 矩陣，使用安全乘法取模完成矩陣快速冪；算出 X_n 在模 m 下的值後再對 g 取模。
proof_or_invariant: 轉移矩陣一次作用恰將 [X_i,1] 變成 [(aX_i+c) mod m,1]。歸納 n 次得到 X_n；安全乘法只以同餘的倍增與加法替代直接乘法，不改變模 m 結果。
complexity:
  time: O(log n log m)
  space: O(1)
common_errors:
  - 直接計算 a*x 而溢位
  - 先對 g 而非 m 進行遞推
  - 把 X_0 到 X_n 的轉移次數寫成 n-1
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;

  using U64 = unsigned long long;
  static U64 mod_value;

  static U64 add_mod(U64 left, U64 right) {
      return left >= mod_value - right ? left - (mod_value - right) : left + right;
  }

  static U64 multiply_mod(U64 left, U64 right) {
      U64 result = 0;
      left %= mod_value;
      while (right > 0) {
          if ((right & 1ULL) != 0ULL) { result = add_mod(result, left); }
          left = add_mod(left, left);
          right >>= 1;
      }
      return result;
  }

  struct Matrix { U64 value[2][2]{}; };

  static Matrix multiply(const Matrix& left, const Matrix& right) {
      Matrix result;
      for (int i = 0; i < 2; ++i) for (int k = 0; k < 2; ++k) for (int j = 0; j < 2; ++j)
          result.value[i][j] = add_mod(result.value[i][j], multiply_mod(left.value[i][k], right.value[k][j]));
      return result;
  }

  static Matrix power(Matrix base_matrix, U64 exponent) {
      Matrix result;
      result.value[0][0] = result.value[1][1] = 1 % mod_value;
      while (exponent > 0) {
          if ((exponent & 1ULL) != 0ULL) { result = multiply(result, base_matrix); }
          base_matrix = multiply(base_matrix, base_matrix);
          exponent >>= 1;
      }
      return result;
  }

  // TODO：依提示重建狀態轉移與快速冪；目前保留可編譯框架。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      U64 multiplier, increment, initial, n, output_mod;
      if (!(cin >> mod_value >> multiplier >> increment >> initial >> n >> output_mod)) { return 0; }
      Matrix transition;
      transition.value[0][0] = multiplier % mod_value;
      transition.value[0][1] = increment % mod_value;
      transition.value[1][1] = 1 % mod_value;
      const Matrix result = power(transition, n);
      const U64 state = add_mod(multiply_mod(result.value[0][0], initial % mod_value), result.value[0][1]);
      cout << state % output_mod << '\n';
      return 0;
  }
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;

  using U64 = unsigned long long;
  static U64 mod_value;

  static U64 add_mod(U64 left, U64 right) {
      return left >= mod_value - right ? left - (mod_value - right) : left + right;
  }

  static U64 multiply_mod(U64 left, U64 right) {
      U64 result = 0;
      left %= mod_value;
      while (right > 0) {
          if ((right & 1ULL) != 0ULL) { result = add_mod(result, left); }
          left = add_mod(left, left);
          right >>= 1;
      }
      return result;
  }

  struct Matrix { U64 value[2][2]{}; };

  static Matrix multiply(const Matrix& left, const Matrix& right) {
      Matrix result;
      for (int i = 0; i < 2; ++i) for (int k = 0; k < 2; ++k) for (int j = 0; j < 2; ++j)
          result.value[i][j] = add_mod(result.value[i][j], multiply_mod(left.value[i][k], right.value[k][j]));
      return result;
  }

  static Matrix power(Matrix base_matrix, U64 exponent) {
      Matrix result;
      result.value[0][0] = result.value[1][1] = 1 % mod_value;
      while (exponent > 0) {
          if ((exponent & 1ULL) != 0ULL) { result = multiply(result, base_matrix); }
          base_matrix = multiply(base_matrix, base_matrix);
          exponent >>= 1;
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      U64 multiplier, increment, initial, n, output_mod;
      if (!(cin >> mod_value >> multiplier >> increment >> initial >> n >> output_mod)) { return 0; }
      Matrix transition;
      transition.value[0][0] = multiplier % mod_value;
      transition.value[0][1] = increment % mod_value;
      transition.value[1][1] = 1 % mod_value;
      const Matrix result = power(transition, n);
      const U64 state = add_mod(multiply_mod(result.value[0][0], initial % mod_value), result.value[0][1]);
      cout << state % output_mod << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2044
external_platform: Luogu
external_problem_id: P2044
external_title: '[NOI2012] 隨機數生成器'
---

仿射函數加上一維常數後即可用矩陣表示；真正的難點是 10^18 模數下的安全乘法。
