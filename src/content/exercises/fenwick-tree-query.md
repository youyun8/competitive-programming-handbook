---
id: fenwick-tree-query
volume: upper
source_file: upper-volume
title: 樹狀陣列單點更新與區間查詢
chapter: 4
section: '4.2'
kind: practice
difficulty: 2
topics:
  - fenwick-tree
  - range-query
  - point-update
prerequisites:
  - arrays
statement: 給定一個長度 n 的陣列，支援單點加值與區間和查詢。輸出每次查詢結果。
constraints:
  - 1 <= n, q <= 200000
  - -1000000000 <= a[i], v <= 1000000000
input_format: 第一行為 n 與 q。接下來 q 行，1 i v 為在位置 i 加 v；2 l r 為查詢區間 [l,r] 的和。
output_format: 對每個操作 2，輸出一行區間和。
samples:
  - input: |
      5 4
      1 3 5
      2 1 5
      1 2 3
      2 1 3
    output: |
      5
      8
    explanation: 初始全 0，位置 3 加 5 後總和 5；位置 2 加 3 後前 3 項和為 8。
hints:
  - BIT 的 add 操作：從索引 i 開始，每次加上 lowbit(i)；sum 操作同理從 i 往前減 lowbit(i)。
  - 區間 [l,r] 的和 = prefix(r) - prefix(l-1)。
solution_outline: 以樹狀陣列維護前綴和，單點更新時更新所有相關節點，區間查詢時取兩個前綴和相減。
proof_or_invariant: BIT 每個節點 tree[i] 負責的區間長度恰為 lowbit(i)，因此 add 與 sum 操作都能正確涵蓋所有相關位置。
complexity:
  time: O((n + q) log n)
  space: O(n)
cpp_solution: |
  #include <iostream>
  #include <vector>

  class FenwickTree {
  public:
      explicit FenwickTree(int n) : tree_(n + 1, 0) {}
      void add(int index, long long delta) {
          while (index < static_cast<int>(tree_.size())) {
              tree_[index] += delta;
              index += index & -index;
          }
      }
      long long prefix_sum(int index) const {
          long long sum = 0;
          while (index > 0) {
              sum += tree_[index];
              index -= index & -index;
          }
          return sum;
      }
      long long range_sum(int left, int right) const {
          return prefix_sum(right) - prefix_sum(left - 1);
      }
  private:
      std::vector<long long> tree_;
  };

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0, q = 0;
      std::cin >> n >> q;
      FenwickTree bit(n);
      for (int i = 0; i < q; ++i) {
          int type = 0;
          std::cin >> type;
          if (type == 1) {
              int idx = 0;
              long long v = 0;
              std::cin >> idx >> v;
              bit.add(idx, v);
          } else {
              int l = 0, r = 0;
              std::cin >> l >> r;
              std::cout << bit.range_sum(l, r) << "\n";
          }
      }
  }
source_book_pages:
  - 151
  - 314
source_pdf_pages:
  - 169
  - 332
review_status: verified
external_url: https://www.luogu.com.cn/problem/P3374
external_platform: 洛谷
external_problem_id: P3374
external_title: 【模板】树状数组 1
external_relation: related
---
