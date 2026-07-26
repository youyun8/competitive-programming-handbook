---
volume: lower
source_file: lower-volume
chapter: 6
section: '6.3'
kind: external-oj
review_status: verified
external_relation: original
id: luogu-p5175
title: 洛谷 P5175 數列：二階遞推平方和
difficulty: 4
topics:
  - 矩陣快速冪
  - 平方和
  - 狀態擴充
prerequisites:
  - 線性遞推
  - 矩陣快速冪
statement: 已知 a_1、a_2，且 a_n=x·a_{n-1}+y·a_{n-2}。對每組資料求 Σ_{i=1}^n a_i^2 mod 1000000007。
constraints:
  - 1 <= T <= 30000
  - 1 <= n <= 10^18
  - 1 <= a_1,a_2,x,y <= 10^9
input_format: 第一行 T；接著每行五個整數 n、a_1、a_2、x、y。
output_format: 每組輸出平方和對 1000000007 的餘數。
samples:
  - input: |
      2
      5 1 1 1 1
      4 3 4 3 2
    output: |
      40
      4193
    explanation: 第一組為 1,1,2,3,5，平方和 40；第二組為 3,4,18,62，平方和 9+16+324+3844=4193。
core_knowledge:
  - 平方遞推展開
  - 交叉項狀態
  - 前綴和狀態
judgment: 平方後會出現 a_i·a_{i-1} 交叉項；把兩個平方、交叉積與累積和一起納入四維狀態，仍可線性轉移並快速冪。
hints:
  - 展開 (x·a_i+y·a_{i-1})²，列出除了兩個平方外還需要保存的量。
  - 狀態可選 [a_i²,a_{i-1}²,a_i·a_{i-1},sum_i]，四項都能由舊狀態線性表示。
  - 從 i=2 的狀態快速推進 n-2 次；轉移的最後一列等於「新平方的係數」再加上舊 sum。
solution_outline: 展開新平方與新交叉積，建立四維轉移矩陣；特判 n=1，否則對矩陣取 n-2 次方並讀取平方和分量。
proof_or_invariant: 依代數展開，矩陣第一列正確產生 a_{i+1}²，第二列搬移 a_i²，第三列產生 a_{i+1}a_i，第四列把新平方加入 sum_i。故每次轉移後四個分量皆維持定義，最終得到 sum_n。
complexity:
  time: 每組 O(log n)
  space: O(1)
common_errors:
  - 漏掉 2xy·a_i·a_{i-1}
  - 平方和加入舊平方而非新平方
  - n=1 時仍使用 n-2 的無號指數
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;

  static const long long kMod = 1000000007;

  struct Matrix { long long value[4][4]{}; };

  static Matrix multiply(const Matrix& left, const Matrix& right) {
      Matrix result;
      for (int i = 0; i < 4; ++i) for (int k = 0; k < 4; ++k) for (int j = 0; j < 4; ++j)
          result.value[i][j] = (result.value[i][j] + left.value[i][k] * right.value[k][j]) % kMod;
      return result;
  }

  static Matrix power(Matrix base_matrix, unsigned long long exponent) {
      Matrix result;
      for (int i = 0; i < 4; ++i) { result.value[i][i] = 1; }
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
      int test_count;
      cin >> test_count;
      while (test_count-- > 0) {
          unsigned long long n;
          long long first, second, x, y;
          cin >> n >> first >> second >> x >> y;
          first %= kMod; second %= kMod; x %= kMod; y %= kMod;
          if (n == 1) { cout << first * first % kMod << '\n'; continue; }
          Matrix transition;
          transition.value[0][0] = x * x % kMod;
          transition.value[0][1] = y * y % kMod;
          transition.value[0][2] = 2 * x % kMod * y % kMod;
          transition.value[1][0] = 1;
          transition.value[2][0] = x;
          transition.value[2][2] = y;
          transition.value[3][0] = transition.value[0][0];
          transition.value[3][1] = transition.value[0][1];
          transition.value[3][2] = transition.value[0][2];
          transition.value[3][3] = 1;
          const Matrix result = power(transition, n - 2);
          const long long state[4] = {
              second * second % kMod,
              first * first % kMod,
              first * second % kMod,
              (first * first + second * second) % kMod
          };
          long long answer = 0;
          for (int j = 0; j < 4; ++j) { answer = (answer + result.value[3][j] * state[j]) % kMod; }
          cout << answer << '\n';
      }
      return 0;
  }
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;

  static const long long kMod = 1000000007;

  struct Matrix { long long value[4][4]{}; };

  static Matrix multiply(const Matrix& left, const Matrix& right) {
      Matrix result;
      for (int i = 0; i < 4; ++i) for (int k = 0; k < 4; ++k) for (int j = 0; j < 4; ++j)
          result.value[i][j] = (result.value[i][j] + left.value[i][k] * right.value[k][j]) % kMod;
      return result;
  }

  static Matrix power(Matrix base_matrix, unsigned long long exponent) {
      Matrix result;
      for (int i = 0; i < 4; ++i) { result.value[i][i] = 1; }
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
      int test_count;
      cin >> test_count;
      while (test_count-- > 0) {
          unsigned long long n;
          long long first, second, x, y;
          cin >> n >> first >> second >> x >> y;
          first %= kMod; second %= kMod; x %= kMod; y %= kMod;
          if (n == 1) { cout << first * first % kMod << '\n'; continue; }
          Matrix transition;
          transition.value[0][0] = x * x % kMod;
          transition.value[0][1] = y * y % kMod;
          transition.value[0][2] = 2 * x % kMod * y % kMod;
          transition.value[1][0] = 1;
          transition.value[2][0] = x;
          transition.value[2][2] = y;
          transition.value[3][0] = transition.value[0][0];
          transition.value[3][1] = transition.value[0][1];
          transition.value[3][2] = transition.value[0][2];
          transition.value[3][3] = 1;
          const Matrix result = power(transition, n - 2);
          const long long state[4] = {
              second * second % kMod,
              first * first % kMod,
              first * second % kMod,
              (first * first + second * second) % kMod
          };
          long long answer = 0;
          for (int j = 0; j < 4; ++j) { answer = (answer + result.value[3][j] * state[j]) % kMod; }
          cout << answer << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5175
external_platform: Luogu
external_problem_id: P5175
external_title: 數列
---

平方遞推不是只保存平方即可；交叉積是讓轉移保持線性的關鍵。
