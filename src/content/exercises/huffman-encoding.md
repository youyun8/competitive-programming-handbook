---
id: huffman-encoding
volume: upper
source_file: upper-volume
title: 霍夫曼編碼總長度
chapter: 1
section: '1.4'
kind: practice
difficulty: 2
topics: [huffman, greedy, priority-queue]
prerequisites: [priority-queue, trees]
statement: 給定 n 個字元及其出現次數，求霍夫曼編碼的總加權編碼長度（即霍夫曼樹的加權路徑長度）。
constraints:
  - 1 <= n <= 100000
  - 1 <= frequency[i] <= 1000000000
input_format: 第一行為 n，第二行為 n 個出現次數。
output_format: 輸出最小加權編碼總長度。
samples:
  - input: |
      4
      5 9 12 13
    output: '78'
    explanation: 合併順序影響樹高，貪心每次取最小的兩個合併。
hints:
  - 每次取最小兩個頻率合併，合併後的新頻率放回優先佇列。
  - 使用最小堆（priority_queue with greater<>）。
solution_outline: 以最小堆模擬霍夫曼合併，每次取出兩個最小值相加，並把和放回堆中。總長度為每次合併和的累積。
proof_or_invariant: 霍夫曼貪心法每次把最小頻率的兩個節點放在最深層，任何其他安排都不會比這個選擇更優。
complexity:
  time: O(n log n)
  space: O(n)
cpp_solution: |
  #include <functional>
  #include <iostream>
  #include <queue>
  #include <vector>

  long long huffman_total_length(const std::vector<long long>& freq) {
      std::priority_queue<long long, std::vector<long long>, std::greater<long long>> min_heap;
      for (long long f : freq) { min_heap.push(f); }
      long long total = 0;
      while (min_heap.size() > 1) {
          long long a = min_heap.top(); min_heap.pop();
          long long b = min_heap.top(); min_heap.pop();
          long long merged = a + b;
          total += merged;
          min_heap.push(merged);
      }
      return total;
  }

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0;
      std::cin >> n;
      std::vector<long long> freq(n);
      for (long long& f : freq) { std::cin >> f; }
      std::cout << huffman_total_length(freq) << "\n";
  }
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
external_url: http://poj.org/problem?id=1521
external_platform: POJ
external_problem_id: '1521'
external_title: Entropy
external_relation: related
---
