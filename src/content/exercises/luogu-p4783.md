---
id: luogu-p4783
volume: lower
source_file: lower-volume
title: 洛谷 P4783 矩陣求逆：模質數下的高斯－約旦消元
chapter: 6
section: '6.3'
kind: external-oj
difficulty: 4
topics:
  - 矩陣求逆
  - 高斯消元
  - 模逆元
  - 增廣矩陣
prerequisites:
  - matrix-exponentiation
  - gaussian-elimination
statement: |-
  給定 n×n 矩陣 A，求它在模 10^9+7 意義下的反矩陣；若不可逆則輸出 No Solution。
constraints:
  - 1 <= n <= 400
  - 0 <= a_ij < 10^9+7
  - 所有答案皆在模 10^9+7 下表示
input_format: 第一行一個整數 n；接下來 n 行，每行 n 個整數表示矩陣 A。
output_format: 若 A 可逆則輸出 n 行、每行 n 個整數表示 A 的反矩陣；否則輸出 No Solution。
samples:
  - input: |
      3
      1 2 8
      2 5 6
      5 1 2
    output: |
      718750005 718750005 968750007
      171875001 671875005 296875002
      117187501 867187506 429687503
    explanation: 這是本站依官方格式設計的示例。把輸出矩陣與原矩陣在模 10^9+7 下相乘會得到單位矩陣，因而證明輸出確為反矩陣。
hints:
  - 求反矩陣的標準做法是對增廣矩陣 [A | I] 做高斯－約旦消元。當左半被消成單位矩陣時，右半就變成 A 的反矩陣。原理是：消元等價於左乘一連串初等矩陣，若它們的乘積 E 滿足 EA = I，那麼 E = A^-1，而 E·I =
    E 正是右半的結果。
  - 這題在**模質數**下運算，和浮點版有兩個差別：沒有「絕對值最大」的概念，主元只要非零即可；「除以主元」要換成乘上主元的逆元，也就是 `power_mod(pivot, p - 2)`。
  - 找不到非零主元就代表矩陣在模 p 下不可逆（行列式 ≡ 0），輸出 No Solution。
solution_outline: 建 n×2n 的增廣矩陣 [A | I]。對每一行找非零主元並交換到位，找不到就輸出 No Solution；把主元列整列乘上主元的逆元使主元變 1，再用它消掉其他所有列的該行。消完後右半即為反矩陣。
proof_or_invariant:
  高斯－約旦的每一步都是一次初等列變換，等價於左乘一個可逆的初等矩陣。設全部變換的乘積為 E，消元結束時左半為 EA = I，故 E = A^-1；而右半經歷了完全相同的變換，其值為 E·I =
  A^-1。若某行找不到非零主元，代表 A 的列在模 p 下線性相關，行列式 ≡ 0，反矩陣不存在。
complexity:
  time: O(n³)
  space: O(n²)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static const long long kMod = 1000000007;

  // 已備好：模質數下的快速冪，用來求逆元（a^(p-2) ≡ a^-1）。
  static long long power_mod(long long base, long long exponent) {
      long long result = 1;
      base %= kMod;
      while (exponent > 0) {
          if (exponent & 1) { result = result * base % kMod; }
          base = base * base % kMod;
          exponent >>= 1;
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      const size_t size = static_cast<size_t>(n);

      // TODO 1：開一個 n×2n 的增廣矩陣，左半放 A、右半放單位矩陣，
      //   也就是 [A | I]。目標是把它消成 [I | A^-1]。
      vector<vector<long long>> matrix(size, vector<long long>(2 * size, 0));
      for (size_t i = 0; i < size; ++i) {
          for (size_t j = 0; j < size; ++j) { cin >> matrix[i][j]; matrix[i][j] %= kMod; }
      }

      // TODO 2：對每一行做高斯－約旦消元。
      //   模意義下沒有「絕對值最大」的概念，主元只要不是 0 就行；
      //   找不到非零主元代表矩陣不可逆，輸出 No Solution。
      //   「除以主元」在模質數下就是乘上 power_mod(主元, kMod - 2)。
      //   別忘了減法後要 (+ kMod) % kMod 修正負數。

      // TODO 3：消完後右半就是反矩陣，輸出它。
      (void)power_mod;
      cout << "No Solution\n";
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static const long long kMod = 1000000007;

  static long long power_mod(long long base, long long exponent) {
      long long result = 1;
      base %= kMod;
      while (exponent > 0) {
          if (exponent & 1) { result = result * base % kMod; }
          base = base * base % kMod;
          exponent >>= 1;
      }
      return result;
  }

  // 高斯－約旦消元求反矩陣：把 [A | I] 消成 [I | A^-1]。
  // 模質數下「除以主元」就是乘上它的逆元。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      const size_t size = static_cast<size_t>(n);
      vector<vector<long long>> matrix(size, vector<long long>(2 * size, 0));
      for (size_t i = 0; i < size; ++i) {
          for (size_t j = 0; j < size; ++j) { cin >> matrix[i][j]; matrix[i][j] %= kMod; }
          matrix[i][size + i] = 1;
      }

      for (size_t column = 0; column < size; ++column) {
          size_t pivot = column;
          while (pivot < size && matrix[pivot][column] == 0) { ++pivot; }
          if (pivot == size) { cout << "No Solution\n"; return 0; }
          swap(matrix[column], matrix[pivot]);
          const long long inverse = power_mod(matrix[column][column], kMod - 2);
          for (size_t j = column; j < 2 * size; ++j) {
              matrix[column][j] = matrix[column][j] * inverse % kMod;
          }
          for (size_t row = 0; row < size; ++row) {
              if (row == column || matrix[row][column] == 0) { continue; }
              const long long factor = matrix[row][column];
              for (size_t j = column; j < 2 * size; ++j) {
                  matrix[row][j] = (matrix[row][j] - factor * matrix[column][j] % kMod + kMod) % kMod;
              }
          }
      }
      for (size_t i = 0; i < size; ++i) {
          for (size_t j = 0; j < size; ++j) { cout << matrix[i][size + j] << " \n"[j + 1 == size]; }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4783
external_platform: 洛谷
external_problem_id: P4783
external_title: 【模板】矩陣求逆
external_relation: original
source_book_pages:
  - 390
  - 396
source_pdf_pages:
  - 20
  - 26
review_status: verified
core_knowledge:
  - 模質數下的高斯－約旦消元
  - 模反元素
  - 矩陣可逆判定
judgment: 模數為質數，非零主元皆可用費馬小定理求逆；在增廣矩陣右側放單位矩陣並消成左側單位矩陣，即得到逆矩陣。
common_errors:
  - 只在目前列找主元，遇到零主元時未向下交換
  - 消元減法後保留負餘數
  - 不可逆時仍對零主元求模反元素
---

「消左半、右半跟著變」這個技巧不只用於求逆，解多組右端項的線性方程組也是同一招。
