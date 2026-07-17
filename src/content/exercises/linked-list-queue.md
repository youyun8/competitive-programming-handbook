---
id: linked-list-queue
volume: upper
source_file: upper-volume
title: 模擬佇列與鏈結串列
chapter: 1
section: '1.1'
kind: practice
difficulty: 1
topics: [linked-list, queue]
prerequisites: [arrays]
statement: 給定 n 個操作，支援在佇列尾端加入數字、刪除佇列前端、查詢佇列前端。以靜態鏈結串列或 STL list 模擬，輸出查詢結果。
constraints:
  - 1 <= n <= 200000
  - 操作類型：1 x 為 push，2 為 pop，3 為 front
input_format: 第一行為 n，接下來 n 行各一個操作。
output_format: 對每個操作 3，輸出當前佇列前端；若空則輸出 -1。
samples:
  - input: |
      5
      1 3
      1 7
      3
      2
      3
    output: |
      3
      7
    explanation: push 3 與 7 後前端為 3；pop 後前端變為 7。
hints:
  - 使用 std::queue 直接維護，或手寫靜態鏈結串列。
  - pop 前檢查佇列是否為空。
solution_outline: 以 std::queue 維護所有元素，每種操作對應 queue::push、pop、front。
proof_or_invariant: queue 的先進先出特性保證前端永遠是最早加入且尚未被刪除的元素。
complexity:
  time: O(n)
  space: O(n)
cpp_solution: |
  #include <iostream>
  #include <queue>

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0;
      std::cin >> n;
      std::queue<int> q;
      for (int i = 0; i < n; ++i) {
          int type = 0;
          std::cin >> type;
          if (type == 1) {
              int x = 0;
              std::cin >> x;
              q.push(x);
          } else if (type == 2) {
              if (!q.empty()) q.pop();
          } else if (type == 3) {
              std::cout << (q.empty() ? -1 : q.front()) << "\n";
          }
      }
  }
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
external_url: https://www.luogu.com.cn/problem/P1996
external_platform: 洛谷
external_problem_id: P1996
external_title: 约瑟夫问题
external_relation: related
---
