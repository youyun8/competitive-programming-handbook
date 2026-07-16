---
id: first-not-less
volume: upper
source_file: upper-volume
title: 第一個不小於查詢值的位置
chapter: 2
section: '2.3'
kind: practice
difficulty: 1
topics: [binary-search, lower-bound]
prerequisites: [arrays, monotonicity]
statement: 給定一個非遞減整數陣列與多個查詢。對每個查詢值，輸出陣列中第一個大於等於它的位置；若不存在，輸出 -1。位置從 0 開始。
constraints:
  - 1 <= n, q <= 200000
  - -1000000000 <= a[i], query <= 1000000000
input_format: 第一行為 n 與 q。第二行為 n 個非遞減整數。接著 q 行各有一個查詢值。
output_format: 每個查詢輸出一行答案。
samples:
  - input: |
      7 4
      1 3 4 7 7 9 12
      7
      5
      13
      1
    output: |
      3
      3
      -1
      0
    explanation: 對 7 與 5，第一個不小於查詢值的元素都位於索引 3。
hints:
  - 把答案定義成第一個滿足 a[i] >= target 的位置。
  - 使用半開區間 [left, right)，讓 right 可以等於 n。
  - 迴圈結束後若 left == n，代表不存在答案。
solution_outline: 對每個查詢執行 lower_bound 型二分；維持答案若存在必在 [left,right) 的不變量。
proof_or_invariant: 所有索引小於 left 的值都嚴格小於 target；所有索引大於等於 right 的位置不需要再搜尋。每次比較都保留分界位置。
complexity:
  time: O((n + q log n))
  space: O(n)
cpp_solution: |
  #include <iostream>
  #include <vector>

  int first_not_less(const std::vector<int>& values, int target) {
      int left = 0;
      int right = static_cast<int>(values.size());
      while (left < right) {
          int middle = left + (right - left) / 2;
          if (values[middle] < target) left = middle + 1;
          else right = middle;
      }
      return left == static_cast<int>(values.size()) ? -1 : left;
  }

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int count = 0;
      int query_count = 0;
      std::cin >> count >> query_count;
      std::vector<int> values(count);
      for (int& value : values) std::cin >> value;
      while (query_count--) {
          int target = 0;
          std::cin >> target;
          std::cout << first_not_less(values, target) << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P2249
external_platform: 洛谷
external_problem_id: P2249
external_title: 【深基13.例1】查找
external_relation: related
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

這是本站依二分搜尋學習目標自行設計的練習，不重製原書或外部 OJ 的題目敘述；洛谷連結提供相同核心技巧的延伸練習。
