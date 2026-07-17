---

id: mst-kruskal
volume: lower
source_file: lower-volume
title: Kruskal 最小生成樹
chapter: 10
section: '10.9'
kind: practice
difficulty: 2
topics:
  - mst
  - kruskal
  - union-find
prerequisites:
  - graphs
  - sorting
statement: 給定一個帶權無向圖，求最小生成樹的總權重。若圖不連通則輸出 -1。
constraints:
  - 1 <= n <= 200000
  - 1 <= m <= 500000
  - 1 <= w <= 1000000000
input_format: 第一行為 n 與 m。接下來 m 行各為 u v w（1-based）。
output_format: 輸出最小生成樹的總權重；若不連通輸出 -1。
samples:
  - input: |
      4 5
      1 2 1
      1 3 2
      2 3 3
      2 4 4
      3 4 5
    output: |
      7
    explanation: 選邊 (1,2,1), (1,3,2), (2,4,4)，總權重 7。
hints:
  - 將所有邊按權重排序，依次嘗試加入並查集。
  - 若加入某邊兩端已連通，則跳過（會形成環）。
solution_outline: Kruskal：排序邊權，用並查集維護連通性。對每條邊，若兩端不同集合則合併並累加權重。
proof_or_invariant: 每次選擇連接兩個不同連通分量的最小權重邊，由 cut property 可知該邊必屬於某個最小生成樹。
complexity:
  time: O(m log m)
  space: O(n + m)
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  
  class UnionFind {
  public:
      explicit UnionFind(int n) : parent_(n), size_(n, 1) {
          for (int i = 0; i < n; ++i) parent_[i] = i;
      }
      int find(int x) {
          if (parent_[x] == x) return x;
          return parent_[x] = find(parent_[x]);
      }
      bool unite(int a, int b) {
          a = find(a); b = find(b);
          if (a == b) return false;
          if (size_[a] < size_[b]) std::swap(a, b);
          parent_[b] = a;
          size_[a] += size_[b];
          return true;
      }
  private:
      std::vector<int> parent_;
      std::vector<int> size_;
  };
  
  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0, m = 0;
      std::cin >> n >> m;
      std::vector<std::tuple<int,int,int>> edges(m);
      for (int i = 0; i < m; ++i) {
          int u = 0, v = 0, w = 0;
          std::cin >> u >> v >> w;
          edges[i] = {w, u - 1, v - 1};
      }
      std::sort(edges.begin(), edges.end());
      UnionFind uf(n);
      long long total = 0;
      int count = 0;
      for (const auto& [w, u, v] : edges) {
          if (uf.unite(u, v)) {
              total += w;
              ++count;
          }
      }
      if (count == n - 1) std::cout << total << "\n";
      else std::cout << -1 << "\n";
  }
source_book_pages:
  - 600
  - 683
source_pdf_pages:
  - 230
  - 313
review_status: verified
external_url: https://www.luogu.com.cn/problem/P3366
external_platform: 洛谷
external_problem_id: P3366
external_title: 【模板】最小生成树
external_relation: related
---

