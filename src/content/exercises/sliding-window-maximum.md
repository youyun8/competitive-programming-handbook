---
id: sliding-window-maximum
volume: upper
source_file: upper-volume
title: 滑動視窗最大值
chapter: 2
section: '2.2'
kind: practice
difficulty: 2
topics: [two-pointers, monotone-queue, sliding-window]
prerequisites: [arrays, queue]
statement: 給定一個整數陣列與大小為 k 的視窗，求每個視窗中的最大值。
constraints:
  - 1 <= n <= 200000
  - 1 <= k <= n
  - -1000000000 <= a[i] <= 1000000000
input_format: 第一行為 n 與 k，第二行為 n 個整數。
output_format: 輸出 n - k + 1 個最大值，以空白分隔。
samples:
  - input: |
      8 3
      1 3 -1 -3 5 3 6 7
    output: 3 3 5 5 6 7
    explanation: 視窗 [1,3,-1] 最大值為 3，[3,-1,-3] 最大值為 3，依此類推。
hints:
  - 使用雙端佇列維護單調遞減序列，隊首永遠是當前視窗最大值。
  - 新元素進入時，從隊尾彈出所有不大於它的元素。
solution_outline: deque 儲存索引而非值，維持值遞減。每次加入新元素前，先移除已滑出視窗的隊首；再從隊尾彈出所有不大於新值的索引。
proof_or_invariant: deque 中索引對應的值嚴格遞減，且所有索引都位於當前視窗內，因此隊首即為最大值。
complexity:
  time: O(n)
  space: O(k)
cpp_solution: |
  #include <deque>
  #include <iostream>
  #include <vector>

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0, k = 0;
      std::cin >> n >> k;
      std::vector<int> a(n);
      for (int& v : a) { std::cin >> v; }
      std::deque<int> dq;
      for (int i = 0; i < n; ++i) {
          while (!dq.empty() && dq.front() <= i - k) { dq.pop_front(); }
          while (!dq.empty() && a[dq.back()] <= a[i]) { dq.pop_back(); }
          dq.push_back(i);
          if (i >= k - 1) {
              if (i > k - 1) { std::cout << " "; }
              std::cout << a[dq.front()];
          }
      }
      std::cout << "\n";
  }
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
external_url: https://www.luogu.com.cn/problem/P1886
external_platform: 洛谷
external_problem_id: P1886
external_title: 滑動窗口 / 單调佇列
external_relation: related
---
