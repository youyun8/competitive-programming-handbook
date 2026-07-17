---
id: range-add-difference
volume: upper
source_file: upper-volume
title: 區間加值與最終陣列
chapter: 2
section: '2.6'
kind: practice
difficulty: 1
topics: [prefix-sum, difference-array]
prerequisites: [arrays]
statement: 給定一個全為 0 的長度 n 陣列，執行 q 次區間 [l,r] 加 v 操作。輸出最終每個位置的值。
constraints:
  - 1 <= n, q <= 200000
  - 1 <= l <= r <= n
  - -1000000000 <= v <= 1000000000
input_format: 第一行為 n 與 q。接下來 q 行各為 l、r、v。
output_format: 輸出 n 個整數，代表最終陣列。
samples:
  - input: |
      5 3
      1 3 2
      2 4 3
      3 5 1
    output: 2 5 6 4 1
    explanation: 差分陣列操作後前綴和得到最終陣列。
hints:
  - 使用差分陣列：對區間 [l,r] 加 v，只需 diff[l] += v 且 diff[r+1] -= v。
  - 最後對差分陣列做一次前綴和即可得到答案。
solution_outline: 維護差分陣列，所有操作都是 O(1)。最後對差分陣列求前綴和，輸出原陣列。
proof_or_invariant: diff 的前綴和中的位置 i 恰好累積了所有覆蓋 i 的操作增量，未覆蓋的操作在 r+1 處被抵消。
complexity:
  time: O(n + q)
  space: O(n)
cpp_solution: |
  #include <iostream>
  #include <vector>

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0, q = 0;
      std::cin >> n >> q;
      std::vector<long long> diff(n + 2, 0);
      for (int i = 0; i < q; ++i) {
          int l = 0, r = 0;
          long long v = 0;
          std::cin >> l >> r >> v;
          diff[l] += v;
          diff[r + 1] -= v;
      }
      for (int i = 1; i <= n; ++i) {
          diff[i] += diff[i - 1];
          std::cout << diff[i] << (i == n ? "\n" : " ");
      }
  }
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
external_url: https://www.luogu.com.cn/problem/P2367
external_platform: 洛谷
external_problem_id: P2367
external_title: 语文成绩
external_relation: related
---
