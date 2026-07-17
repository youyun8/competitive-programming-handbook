---
id: monotone-stack-histogram
volume: upper
source_file: upper-volume
title: 直方圖最大矩形
chapter: 1
section: '1.3'
kind: practice
difficulty: 2
topics: [monotone-stack, histogram]
prerequisites: [stack, arrays]
statement: 給定 n 個相鄰置放的矩形，第 i 個高度為 h[i]、寬度為 1。求這些矩形能圍出的最大矩形面積。
constraints:
  - 1 <= n <= 200000
  - 0 <= h[i] <= 1000000000
input_format: 第一行為 n，第二行為 n 個整數 h[i]。
output_format: 輸出最大矩形面積。
samples:
  - input: |
      6
      2 1 5 6 2 3
    output: '10'
    explanation: 以高度 5 為底，合併寬度 2，面積為 10。
hints:
  - 對每個高度，找出左邊第一個比它小、右邊第一個比它小的柱子。
  - 以單調遞增堆疊掃描兩次，分別求左右邊界。
solution_outline: 維護單調遞增堆疊，遇到更小值時彈出並計算以被彈出高度為最小值的矩形寬度。
proof_or_invariant: 彈出時，被彈出高度的左右邊界恰為當前掃描位置與堆疊前一項，因此寬度計算正確。
complexity:
  time: O(n)
  space: O(n)
cpp_solution: |
  #include <iostream>
  #include <stack>
  #include <vector>

  long long max_histogram_area(const std::vector<long long>& heights) {
      std::stack<int> monotone;
      long long max_area = 0;
      int n = static_cast<int>(heights.size());
      for (int i = 0; i <= n; ++i) {
          long long current = (i == n ? 0 : heights[i]);
          while (!monotone.empty() && current < heights[monotone.top()]) {
              int idx = monotone.top(); monotone.pop();
              int width = monotone.empty() ? i : i - monotone.top() - 1;
              max_area = std::max(max_area, heights[idx] * static_cast<long long>(width));
          }
          monotone.push(i);
      }
      return max_area;
  }

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0;
      std::cin >> n;
      std::vector<long long> h(n);
      for (long long& v : h) std::cin >> v;
      std::cout << max_histogram_area(h) << "\n";
  }
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
external_url: http://poj.org/problem?id=2559
external_platform: POJ
external_problem_id: '2559'
external_title: Largest Rectangle in a Histogram
external_relation: related
---
