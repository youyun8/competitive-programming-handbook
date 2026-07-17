---
id: convex-hull-points
volume: lower
source_file: lower-volume
title: 二維凸包點集
chapter: 8
section: '8.1'
kind: practice
difficulty: 2
topics:
  - convex-hull
  - monotone-chain
  - cross-product
prerequisites:
  - sorting
  - geometry-basics
statement: 給定平面上 n 個點，求凸包上的所有頂點，以逆時針順序輸出。
constraints:
  - 1 <= n <= 100000
  - -1000000000 <= x_i, y_i <= 1000000000
input_format: 第一行為 n，接下來 n 行各為 x_i 與 y_i。
output_format: 輸出凸包頂點數量，以及每個頂點座標（逆時針）。
samples:
  - input: |
      6
      0 0
      1 1
      2 2
      0 2
      2 0
      1 0
    output: |
      4
      0 0
      2 0
      2 2
      0 2
    explanation: 共線中間點 (1,1) 與 (1,0) 不在凸包上。
hints:
  - 使用 Andrew 單調鏈：先按 x 再按 y 排序，分別構造下凸殼與上凸殼。
  - 叉積判斷三點是否逆時針轉向，非逆時針則彈出中間點。
solution_outline: 排序後用 monotone chain 構造凸包。維護兩個堆疊分別對應下凸殼與上凸殼，最後合併去除重複端點。
proof_or_invariant: 每次加入新新點時，彈出所有導致非左轉（叉積 <= 0）的點，保證堆疊中相鄰三點始終維持凸性。
complexity:
  time: O(n log n)
  space: O(n)
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>

  struct Point {
      long long x = 0, y = 0;
      bool operator<(const Point& other) const {
          return x < other.x || (x == other.x && y < other.y);
      }
  };

  long long cross(const Point& o, const Point& a, const Point& b) {
      return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  }

  std::vector<Point> convex_hull(std::vector<Point>& points) {
      if (points.size() <= 1) { return points; }
      std::sort(points.begin(), points.end());
      std::vector<Point> lower, upper;
      for (const Point& p : points) {
          while (lower.size() >= 2 && cross(lower[lower.size() - 2], lower.back(), p) <= 0) {
              lower.pop_back();
          }
          lower.push_back(p);
      }
      for (int i = static_cast<int>(points.size()) - 1; i >= 0; --i) {
          const Point& p = points[i];
          while (upper.size() >= 2 && cross(upper[upper.size() - 2], upper.back(), p) <= 0) {
              upper.pop_back();
          }
          upper.push_back(p);
      }
      lower.pop_back();
      upper.pop_back();
      lower.insert(lower.end(), upper.begin(), upper.end());
      return lower;
  }

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0;
      std::cin >> n;
      std::vector<Point> points(n);
      for (Point& p : points) { std::cin >> p.x >> p.y; }
      auto hull = convex_hull(points);
      std::cout << hull.size() << "\n";
      for (const Point& p : hull) {
          std::cout << p.x << " " << p.y << "\n";
      }
  }
source_book_pages:
  - 510
  - 548
source_pdf_pages:
  - 140
  - 178
review_status: verified
external_url: https://www.luogu.com.cn/problem/P2742
external_platform: 洛谷
external_problem_id: P2742
external_title: 【模板】二维凸包
external_relation: related
---
