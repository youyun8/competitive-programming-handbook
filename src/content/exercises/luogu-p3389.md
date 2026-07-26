---
id: luogu-p3389
volume: lower
source_file: lower-volume
title: 洛谷 P3389 高斯消元：解線性方程組
chapter: 6
section: '6.4'
kind: external-oj
difficulty: 3
topics:
  - 高斯消元
  - 線性方程組
  - 列主元法
  - 浮點誤差
prerequisites:
  - gaussian-elimination
statement: |-
  給定一個 n 元一次方程組，求它的唯一解；若沒有唯一解則輸出 No Solution。
constraints:
  - 1 <= n <= 100
  - 方程係數與常數項皆為整數，絕對值不超過 10^4
  - 若有唯一解，保證每個解的絕對值不超過 10^3，且不會落在影響四捨五入的誤差邊界
input_format: 第一行為正整數 n；接下來 n 行各有 n+1 個整數，前 n 個是未知數係數，最後一個是常數項。
output_format: 若有唯一解則輸出 n 行，每行一個解並保留兩位小數；否則輸出 No Solution。
samples:
  - input: |
      3
      1 3 4 5
      1 4 7 3
      9 3 2 2
    output: |
      -0.97
      5.18
      -2.39
    explanation: 這是本站依官方格式設計的示例。係數矩陣可逆，因此解唯一；把三個輸出值代回原方程，可在兩位小數的容許誤差內成立。
hints:
  - 高斯消元就是把增廣矩陣化成上三角（或直接化成對角），再讀出解。高斯－約旦消元多做一步「往上也消乾淨」，好處是最後不必回代，最後一行直接就是答案。
  - '**列主元法**是這題的關鍵細節：處理第 column 行時，先在該行以下找出絕對值最大的那一列，交換到當前列再消。這不是為了正確性，而是為了數值穩定——除數越接近 0，相對誤差被放得越大。'
  - 浮點數不能用 `== 0` 判斷。設一個 eps（例如 1e-9），主元的絕對值小於 eps 就視為 0，代表這一行找不到主元，方程組沒有唯一解。
solution_outline:
  對每一行做高斯－約旦消元：先用列主元法選出該行絕對值最大的主元並交換到位，若主元幾乎為 0 就輸出 No Solution；否則把主元列整列除以主元使其變成 1，再用它把其他所有列的該行消成
  0。全部消完後矩陣成為對角形式，最後一行即為答案。
proof_or_invariant: 每一輪的不變量是「前 column 行已被消成單位矩陣的對應行，且矩陣所代表的解集合始終不變」。後者成立是因為三種初等列變換（交換兩列、整列乘非零常數、某列減去另一列的倍數）都不改變方程組的解集。
complexity:
  time: O(n³)
  space: O(n²)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static const double kEps = 1e-9;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      const size_t size = static_cast<size_t>(n);
      vector<vector<double>> matrix(size, vector<double>(size + 1));
      for (size_t i = 0; i < size; ++i) {
          for (size_t j = 0; j <= size; ++j) { cin >> matrix[i][j]; }
      }

      for (size_t column = 0; column < size; ++column) {
          // TODO 1：列主元法。在第 column 行以下找出該行絕對值最大的一列，
          //   與當前列交換。挑最大的是為了讓除法的除數盡量遠離 0，降低浮點誤差。
          size_t pivot = column;

          // TODO 2：主元幾乎為 0 代表這一行湊不出主元，方程組無唯一解，
          //   輸出 No Solution 後結束。浮點數不能用 == 0 判斷，要用 eps。
          if (fabs(matrix[pivot][column]) < kEps) { cout << "No Solution\n"; return 0; }
          swap(matrix[column], matrix[pivot]);

          // TODO 3：把主元列整列除以主元使主元變成 1，
          //   再用它把其他所有列的第 column 行消成 0（高斯－約旦，直接消成對角矩陣）。
      }

      // 消成對角矩陣後，最後一行就是答案。
      cout << fixed << setprecision(2);
      for (size_t i = 0; i < size; ++i) { cout << matrix[i][size] << '\n'; }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static const double kEps = 1e-9;

  // 高斯－約旦消元：每一列選絕對值最大的主元（列主元法）以降低浮點誤差，
  // 消成對角矩陣後直接讀出解。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      const size_t size = static_cast<size_t>(n);
      vector<vector<double>> matrix(size, vector<double>(size + 1));
      for (size_t i = 0; i < size; ++i) {
          for (size_t j = 0; j <= size; ++j) { cin >> matrix[i][j]; }
      }

      for (size_t column = 0; column < size; ++column) {
          size_t pivot = column;
          for (size_t row = column; row < size; ++row) {
              if (fabs(matrix[row][column]) > fabs(matrix[pivot][column])) { pivot = row; }
          }
          if (fabs(matrix[pivot][column]) < kEps) { cout << "No Solution\n"; return 0; }
          swap(matrix[column], matrix[pivot]);
          const double lead = matrix[column][column];
          for (size_t j = column; j <= size; ++j) { matrix[column][j] /= lead; }
          for (size_t row = 0; row < size; ++row) {
              if (row == column) { continue; }
              const double factor = matrix[row][column];
              if (fabs(factor) < kEps) { continue; }
              for (size_t j = column; j <= size; ++j) { matrix[row][j] -= factor * matrix[column][j]; }
          }
      }
      cout << fixed << setprecision(2);
      for (size_t i = 0; i < size; ++i) { cout << matrix[i][size] << '\n'; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3389
external_platform: 洛谷
external_problem_id: P3389
external_title: 【模板】高斯消元法
external_relation: original
source_book_pages:
  - 396
  - 402
source_pdf_pages:
  - 26
  - 32
review_status: verified
core_knowledge:
  - 高斯－約旦消元
  - 列主元法
  - 浮點誤差控制
judgment: 方程組規模允許 O(n³) 消元；以絕對值最大的候選列作主元可降低誤差，主元接近零則沒有唯一解。
common_errors:
  - 用 == 0 判斷浮點主元
  - 消元時漏掉增廣矩陣的常數欄
  - 輸出負零或未固定保留兩位小數
---

列主元法與 eps 判零是浮點高斯消元的兩個必備細節。少了前者精度會崩，少了後者會把可逆矩陣誤判成奇異。
