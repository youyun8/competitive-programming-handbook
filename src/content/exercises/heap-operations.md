---
id: heap-operations
volume: upper
source_file: upper-volume
title: 手寫二元堆操作
chapter: 1
section: '1.5'
kind: practice
difficulty: 1
topics: [heap, priority-queue, binary-tree]
prerequisites: [arrays]
statement: 實作一個支援插入、查詢最小值與刪除最小值的手寫最小堆。給定 N 個操作，輸出每次查詢的結果。
constraints:
  - 1 <= n <= 200000
  - 操作類型：1 x 為插入 x；2 為查詢最小值；3 為刪除最小值
input_format: 第一行為 n，接下來 n 行各一個操作。
output_format: 對每個操作 2，輸出當前最小值。若堆為空則輸出 -1。
samples:
  - input: |
      6
      1 5
      1 3
      2
      3
      2
      1 7
    output: |
      3
      5
    explanation: 插入 5 與 3 後，最小值為 3；刪除最小值後剩 5。
hints:
  - 用陣列儲存堆，索引 i 的左子為 2*i、右子為 2*i+1。
  - 插入時放到尾端後向上調整；刪除時把尾端放到根再向下調整。
solution_outline: 以 vector 模擬二元堆，每個操作對應上浮（bubble-up）或下沉（bubble-down）維護 heap property。
proof_or_invariant: 每次調整都保證當前子樹的根不大於子節點，因此整棵樹維持最小堆性質。
complexity:
  time: O(n log n)
  space: O(n)
cpp_solution: |
  #include <iostream>
  #include <vector>

  class MinHeap {
  public:
      void insert(int value) {
          data_.push_back(value);
          bubble_up(static_cast<int>(data_.size()) - 1);
      }
      int query_min() const {
          return data_.empty() ? -1 : data_[0];
      }
      void delete_min() {
          if (data_.empty()) return;
          data_[0] = data_.back();
          data_.pop_back();
          if (!data_.empty()) bubble_down(0);
      }
  private:
      std::vector<int> data_;
      void bubble_up(int index) {
          while (index > 0) {
              int parent = (index - 1) / 2;
              if (data_[parent] <= data_[index]) break;
              std::swap(data_[parent], data_[index]);
              index = parent;
          }
      }
      void bubble_down(int index) {
          int n = static_cast<int>(data_.size());
          while (true) {
              int left = 2 * index + 1;
              int right = 2 * index + 2;
              int smallest = index;
              if (left < n && data_[left] < data_[smallest]) smallest = left;
              if (right < n && data_[right] < data_[smallest]) smallest = right;
              if (smallest == index) break;
              std::swap(data_[index], data_[smallest]);
              index = smallest;
          }
      }
  };

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0;
      std::cin >> n;
      MinHeap heap;
      for (int i = 0; i < n; ++i) {
          int type = 0;
          std::cin >> type;
          if (type == 1) {
              int x = 0;
              std::cin >> x;
              heap.insert(x);
          } else if (type == 2) {
              std::cout << heap.query_min() << "\n";
          } else if (type == 3) {
              heap.delete_min();
          }
      }
  }
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
external_url: https://www.luogu.com.cn/problem/P3378
external_platform: 洛谷
external_problem_id: P3378
external_title: 【模板】堆
external_relation: related
---
