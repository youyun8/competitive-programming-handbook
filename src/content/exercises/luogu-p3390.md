---
id: luogu-p3390
volume: lower
source_file: lower-volume
title: 洛谷 P3390 矩陣快速冪：把遞推壓成 O(log k)
chapter: 6
section: '6.3'
kind: external-oj
difficulty: 3
topics:
  - 矩陣快速冪
  - 快速冪
  - 矩陣乘法
prerequisites:
  - matrix-exponentiation
  - fast-power
statement: 給定 n×n 整數矩陣 A 與非負整數 k，輸出 A^k 的每個元素對 1000000007 取模的結果。
constraints:
  - 1 <= n <= 100
  - 0 <= k <= 10^12
  - 0 <= A_ij < 1000000007
input_format: 第一行為 n、k；接著 n 行各含 n 個矩陣元素。
output_format: 輸出 n 行，每行 n 個整數，表示 A^k mod 1000000007。
samples:
  - input: |
      2 3
      1 1
      1 0
    output: |
      3 2
      2 1
    explanation: 這是費波那契的轉移矩陣，立方後左上角是 F(4)=3、右上與左下是 F(3)=2、右下是 F(2)=1。 本示例依官方輸入輸出格式設計。
hints:
  - 整數快速冪把 a^k 拆成 k 的二進位：某位為 1 就把當前的 a 乘進答案，每輪把 a 平方。矩陣快速冪一模一樣，只是「乘法」換成矩陣乘法。
  - 快速冪能成立只需要兩個性質：乘法**結合律**，以及存在**單位元**。矩陣乘法兩者皆有——單位元就是單位矩陣（對角線為 1）。所以初始答案要設成單位矩陣，而不是零矩陣；k = 0 時答案正是它。
  - 矩陣乘法的三層迴圈裡，`a[i][k] * b[k][j]` 兩個乘數都可能接近 10^9，乘積接近 10^18，必須用 long long 承接後再取模。
solution_outline: 實作矩陣乘法（中間值用 long long，逐項取模），再把整數快速冪的框架照搬：答案初始化為單位矩陣，掃 k 的二進位，該位為 1 就把當前底數乘進答案，每輪底數平方。共 O(log k) 次矩陣乘法。
proof_or_invariant:
  快速冪的正確性只依賴結合律與單位元。迴圈不變量是「result × base^(剩餘的 k) 恆等於原始的 A^k」：每次把最低位處理掉時，若該位為 1 就把 base 併入 result，然後
  base 平方、k 右移，等式兩邊仍相等。k 減到 0 時 result 即為答案。
complexity:
  time: O(n³ log k)
  space: O(n²)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static const long long kMod = 1000000007;
  using Matrix = vector<vector<long long>>;

  // 已備好：矩陣乘法。中間值用 long long 承接後再取模。
  static Matrix multiply(const Matrix& a, const Matrix& b) {
      const size_t n = a.size();
      Matrix result(n, vector<long long>(n, 0));
      for (size_t i = 0; i < n; ++i) {
          for (size_t k = 0; k < n; ++k) {
              if (a[i][k] == 0) { continue; }
              for (size_t j = 0; j < n; ++j) {
                  result[i][j] = (result[i][j] + a[i][k] * b[k][j]) % kMod;
              }
          }
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      long long n, k;
      if (!(cin >> n >> k)) { return 0; }
      const size_t size = static_cast<size_t>(n);
      Matrix base(size, vector<long long>(size));
      for (size_t i = 0; i < size; ++i) {
          for (size_t j = 0; j < size; ++j) { cin >> base[i][j]; base[i][j] %= kMod; }
      }

      // 單位矩陣是矩陣乘法的單位元，就像整數快速冪裡的 1；k = 0 時答案就是它。
      Matrix result(size, vector<long long>(size, 0));
      for (size_t i = 0; i < size; ++i) { result[i][i] = 1; }

      // TODO：把這個乘 k 次的迴圈換成快速冪。
      //   k 的二進位某位為 1 時，把當前的 base 乘進 result；
      //   每輪把 base 平方、k 右移一位，總共只需 O(log k) 次矩陣乘法。
      //   k 可以大到 10^12，乘 k 次一定超時。
      for (long long step = 0; step < k; ++step) { result = multiply(result, base); }

      for (size_t i = 0; i < size; ++i) {
          for (size_t j = 0; j < size; ++j) { cout << result[i][j] << " \n"[j + 1 == size]; }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static const long long kMod = 1000000007;

  using Matrix = vector<vector<long long>>;

  static Matrix multiply(const Matrix& a, const Matrix& b) {
      const size_t n = a.size();
      Matrix result(n, vector<long long>(n, 0));
      for (size_t i = 0; i < n; ++i) {
          for (size_t k = 0; k < n; ++k) {
              if (a[i][k] == 0) { continue; }  // 稀疏時省下一整列乘法
              for (size_t j = 0; j < n; ++j) {
                  result[i][j] = (result[i][j] + a[i][k] * b[k][j]) % kMod;
              }
          }
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      long long n, k;
      if (!(cin >> n >> k)) { return 0; }
      const size_t size = static_cast<size_t>(n);
      Matrix base(size, vector<long long>(size));
      for (size_t i = 0; i < size; ++i) {
          for (size_t j = 0; j < size; ++j) { cin >> base[i][j]; base[i][j] %= kMod; }
      }
      // 單位矩陣是矩陣乘法的單位元，等同於快速冪裡的 1。
      Matrix result(size, vector<long long>(size, 0));
      for (size_t i = 0; i < size; ++i) { result[i][i] = 1; }
      while (k > 0) {
          if (k & 1) { result = multiply(result, base); }
          base = multiply(base, base);
          k >>= 1;
      }
      for (size_t i = 0; i < size; ++i) {
          for (size_t j = 0; j < size; ++j) { cout << result[i][j] << " \n"[j + 1 == size]; }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3390
external_platform: 洛谷
external_problem_id: P3390
external_title: 【模板】矩陣快速冪
external_relation: original
source_book_pages:
  - 390
  - 396
source_pdf_pages:
  - 20
  - 26
review_status: verified
core_knowledge:
  - 矩陣乘法
  - 二進位快速冪
  - 單位矩陣
judgment: 指數高達 10^12，線性次矩陣乘法不可行；矩陣乘法具結合律，因此可用二進位快速冪降至對數次乘法。
common_errors:
  - 答案矩陣未初始化為單位矩陣，導致 k=0 時錯誤
  - 三重迴圈累加時未逐步取模，造成 long long 溢位
  - 把矩陣乘法誤寫成對應元素相乘
---

矩陣快速冪是把「線性遞推」加速到對數級的通用武器。先確認你的遞推能寫成矩陣形式，剩下的就是模板。
