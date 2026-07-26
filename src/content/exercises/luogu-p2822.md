---
id: luogu-p2822
volume: lower
source_file: lower-volume
title: 洛谷 P2822 可被 k 整除的組合數統計
chapter: 7
section: '7.1'
kind: external-oj
difficulty: 3
topics: [pascal-triangle, prefix-sum, modular-arithmetic]
prerequisites: [binomial-theorem, two-dimensional-prefix-sum]
statement: >-
  給定固定整數 k 與多組 n、m。對每組詢問，統計所有 0<=i<=n、
  0<=j<=min(i,m) 中，組合數 C(i,j) 可被 k 整除的有序對 (i,j) 數量。
constraints:
  - 1 <= t <= 10000
  - 0 <= n,m <= 2000
  - 1 <= k <= 21
input_format: 第一行為 t、k；接下來 t 行各有一組 n、m。
output_format: 每組詢問輸出一行符合條件的 (i,j) 數量。
samples:
  - input: |
      1 2
      3 3
    output: '1'
    explanation: i<=3 的合法組合數中只有 C(2,1)=2 可被 2 整除。
core_knowledge:
  - Pascal 恆等式可直接計算組合數模 k
  - 把可整除位置轉為 0/1 後可建二維前綴和回答大量詢問
judgment: j>i 的格子不是組合數查詢範圍，不可計入答案。
hints:
  - 不需要保存完整組合數，只保存除以 k 的餘數即可。
  - 先用 C(i,j)=C(i-1,j-1)+C(i-1,j) 建出 0..2000 的楊輝三角。
  - 對「餘數為 0 且 j<=i」的格子建矩形前綴和；每次查詢讀 prefix[n][min(n,m)]。
solution_outline: >-
  建立 remainder[i][j]=C(i,j) mod k，其中邊界 j=0、j=i 為 1 mod k。
  同步建立 count_prefix，使其代表矩形 [0..i]×[0..j] 內可整除且位於楊輝三角中的格子數。
  每組答案為 count_prefix[n][min(n,m)]。
proof_or_invariant: >-
  Pascal 恆等式在取模後仍成立，所以 remainder 表與真正組合數同餘。
  prefix 的標準容斥遞推保證每格恰計一次，且只有 j<=i、remainder=0 的格子貢獻 1。
  查詢矩形涵蓋恰好所有 i<=n、j<=m 的三角形合法格，因此回傳值正確。
common_errors:
  - 把 j>i 的預設零餘數也視為可整除而計入
  - m>n 時未截成 n
  - 每組詢問重新建表，無法承受一萬組資料
complexity:
  time: 預處理 O(N^2)，每組詢問 O(1)，N=2000
  space: O(N^2)
cpp_skeleton: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests, divisor;
      cin >> tests >> divisor;
      constexpr int limit = 2000;
      vector<vector<int>> remainder(static_cast<size_t>(limit) + 1U,
                                    vector<int>(static_cast<size_t>(limit) + 1U));
      vector<vector<int>> prefix = remainder;
      // TODO：建立楊輝三角餘數與二維前綴和，再回答詢問。
      (void)tests;
      (void)divisor;
      (void)prefix;
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests, divisor;
      cin >> tests >> divisor;
      constexpr int limit = 2000;
      vector<vector<int>> remainder(static_cast<size_t>(limit) + 1U,
                                    vector<int>(static_cast<size_t>(limit) + 1U));
      vector<vector<int>> prefix(static_cast<size_t>(limit) + 1U,
                                 vector<int>(static_cast<size_t>(limit) + 1U));
      for (int row = 0; row <= limit; ++row) {
          remainder[static_cast<size_t>(row)][0] = 1 % divisor;
          remainder[static_cast<size_t>(row)][static_cast<size_t>(row)] = 1 % divisor;
          for (int column = 1; column < row; ++column) {
              remainder[static_cast<size_t>(row)][static_cast<size_t>(column)] =
                  (remainder[static_cast<size_t>(row - 1)][static_cast<size_t>(column - 1)] +
                   remainder[static_cast<size_t>(row - 1)][static_cast<size_t>(column)]) %
                  divisor;
          }
          for (int column = 0; column <= limit; ++column) {
              const int hit = column <= row &&
                                      remainder[static_cast<size_t>(row)][static_cast<size_t>(column)] == 0
                                  ? 1
                                  : 0;
              int value = hit;
              if (row > 0) { value += prefix[static_cast<size_t>(row - 1)][static_cast<size_t>(column)]; }
              if (column > 0) { value += prefix[static_cast<size_t>(row)][static_cast<size_t>(column - 1)]; }
              if (row > 0 && column > 0) {
                  value -= prefix[static_cast<size_t>(row - 1)][static_cast<size_t>(column - 1)];
              }
              prefix[static_cast<size_t>(row)][static_cast<size_t>(column)] = value;
          }
      }
      while (tests-- > 0) {
          int n, m;
          cin >> n >> m;
          cout << prefix[static_cast<size_t>(n)][static_cast<size_t>(min(n, m))] << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2822
external_platform: 洛谷
external_problem_id: P2822
external_title: '[NOIP 2016 提高組] 組合數問題'
external_relation: original
source_book_pages: [463, 467]
source_pdf_pages: [93, 97]
review_status: verified
---

大量矩形查詢的關鍵是把楊輝三角先轉成「是否整除」的點陣，再做一次二維前綴和。
