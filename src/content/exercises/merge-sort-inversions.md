---
id: merge-sort-inversions
volume: upper
source_file: upper-volume
title: 逆序對數量
chapter: 2
section: '2.9'
kind: practice
difficulty: 3
topics: [divide-and-conquer, merge-sort, inversions]
prerequisites: [recursion, sorting]
statement: 給定一個長度 n 的陣列，求其逆序對數量（即滿足 i < j 且 a[i] > a[j] 的數對個數）。
constraints:
  - 1 <= n <= 500000
  - 0 <= a[i] <= 1000000000
input_format: 第一行為 n，第二行為 n 個整數。
output_format: 輸出逆序對數量（可用 64 位元整數儲存）。
samples:
  - input: |
      5
      3 2 1 4 5
    output: '3'
    explanation: 逆序對為 (3,2)、(3,1)、(2,1)。
hints:
  - 合併排序的過程中，當右半邊元素被選取時，左半邊剩餘的元素都比它大，直接累加數量。
  - 使用 long long 儲存答案避免溢位。
solution_outline: 遞迴分治：排序左半與右半後，合併時統計跨區間的逆序對。總數量 = 左區間 + 右區間 + 跨區間。
proof_or_invariant: 合併時兩邊皆已排序，因此當右邊元素較小時，左邊指標後的所有元素都與該右邊元素構成逆序對。
complexity:
  time: O(n log n)
  space: O(n)
cpp_solution: |
  #include <iostream>
  #include <vector>

  long long merge_sort_count(std::vector<int>& a, std::vector<int>& temp, int left, int right) {
      if (left >= right) { return 0; }
      int mid = left + (right - left) / 2;
      long long count = 0;
      count += merge_sort_count(a, temp, left, mid);
      count += merge_sort_count(a, temp, mid + 1, right);
      int i = left, j = mid + 1, k = left;
      while (i <= mid && j <= right) {
          if (a[i] <= a[j]) {
              temp[k++] = a[i++];
          } else {
              temp[k++] = a[j++];
              count += (mid - i + 1);
          }
      }
      while (i <= mid) { temp[k++] = a[i++]; }
      while (j <= right) { temp[k++] = a[j++]; }
      for (i = left; i <= right; ++i) { a[i] = temp[i]; }
      return count;
  }

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0;
      std::cin >> n;
      std::vector<int> a(n);
      for (int& v : a) { std::cin >> v; }
      std::vector<int> temp(n);
      std::cout << merge_sort_count(a, temp, 0, n - 1) << "\n";
  }
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
external_url: https://www.luogu.com.cn/problem/P1908
external_platform: 洛谷
external_problem_id: P1908
external_title: 逆序對
external_relation: related
---
