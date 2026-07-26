---
id: luogu-p4557
volume: lower
source_file: lower-volume
title: 洛谷 P4557 戰爭：Minkowski 差與凸包相交
chapter: 8
section: '8.3'
kind: external-oj
difficulty: 5
topics: ['Minkowski 和', '凸包', '點在凸多邊形內']
prerequisites: ['Andrew 單調鏈', '叉積', '二分搜尋']
statement: 兩個部落各由一組平面點表示，其領地是各自點集的凸包，邊界也屬於領地。第二部落將所有點平移一個查詢向量。對每個方案判斷兩領地是否有公共點；有公共點就會發生戰爭。
constraints:
  - '3 <= n, m <= 100000'
  - '1 <= q <= 100000'
  - '-100000000 <= x_i, y_i, dx_i, dy_i <= 100000000'
  - 所有人的座標兩兩不同
  - 每個部落的點不全共線
input_format: 第一行為 n、m、q。接著 n 行第一部落座標，m 行第二部落座標，最後 q 行各為第二部落的平移向量 dx、dy。
output_format: 每個方案輸出一行；會發生戰爭輸出 1，否則輸出 0。
samples:
  - input: |
      4 4 3
      0 0
      1 0
      0 1
      1 1
      -1 0
      0 3
      0 2
      0 -1
      0 0
      2 3
      0 -1
    output: |
      1
      0
      1
    explanation: 官方範例中平移 (0,0) 與 (0,-1) 後兩凸領地有公共點，分別輸出 1；平移 (2,3) 後領地分離，輸出 0。
core_knowledge:
  - 部落領地就是點集凸包
  - A 與 B+d 相交等價於 d 屬於 A+(-B)
  - 多次查詢可化為點在固定凸多邊形內
judgment: 先求兩部落凸包，再建立 Minkowski 差 D=A+(-B)。每個平移向量只需判斷是否在 D 內；D 固定且凸，可用扇形二分在 O(log(n+m)) 回答。
hints:
  - 兩領地相交表示存在 a∈A、b∈B 使 a=b+d，移項得到 d=a-b。
  - 所有可能的 a-b 恰為凸集合 A 與 -B 的 Minkowski 和；兩凸多邊形的有序邊向量可依極角合併。
  - 將差集凸包固定一個頂點作扇形中心，先以首末射線排除外部，再二分查詢點落在哪個三角扇區並做一次叉積判定。
solution_outline: 對兩點集建 Andrew 凸包，第二個取負；合併兩凸包的邊向量建立 Minkowski 和並再去除共線點。每個查詢以 O(log h) 的凸多邊形含點判定輸出結果。
proof_or_invariant: 凸包定義使兩領地分別為凸集合 A、B。平移後相交的充要條件是存在 a=b+d，即 d∈A+(-B)，且邊界包含所以使用閉集合。Minkowski 邊向量按極角合併精確走過和集邊界。對固定逆時針凸多邊形，從首頂點連向其餘頂點形成互不重疊且覆蓋全圖的三角扇，二分定位後的左側判定因此與含點條件等價。
complexity:
  time: O((n+m)log(n+m) + q log(n+m))
  space: O(n+m)
common_errors:
  - 忘記把第二部落座標取負
  - 把輸出 1、0 的戰爭含義顛倒
  - 點在差集邊界時錯判為不相交
  - 叉積使用 32 位元整數溢位
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long long x; long long y; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：建立兩領地的 Minkowski 差，對每個平移向量做凸多邊形含點查詢。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point {
      long long x;
      long long y;
      bool operator<(const Point& other) const {
          return tie(x, y) < tie(other.x, other.y);
      }
      bool operator==(const Point& other) const {
          return x == other.x && y == other.y;
      }
  };

  static Point operator+(const Point& a, const Point& b) {
      return {a.x + b.x, a.y + b.y};
  }
  static Point operator-(const Point& a, const Point& b) {
      return {a.x - b.x, a.y - b.y};
  }
  static long long cross(const Point& a, const Point& b) {
      return a.x * b.y - a.y * b.x;
  }
  static long long dot(const Point& a, const Point& b) {
      return a.x * b.x + a.y * b.y;
  }

  static vector<Point> convex_hull(vector<Point> points) {
      sort(points.begin(), points.end());
      points.erase(unique(points.begin(), points.end()), points.end());
      vector<Point> hull;
      for (const Point& point : points) {
          while (hull.size() >= 2 &&
                 cross(hull.back() - hull[hull.size() - 2],
                       point - hull.back()) <= 0) {
              hull.pop_back();
          }
          hull.push_back(point);
      }
      const size_t lower_size = hull.size();
      for (size_t i = points.size() - 1; i-- > 0;) {
          const Point& point = points[i];
          while (hull.size() > lower_size &&
                 cross(hull.back() - hull[hull.size() - 2],
                       point - hull.back()) <= 0) {
              hull.pop_back();
          }
          hull.push_back(point);
      }
      hull.pop_back();
      return hull;
  }

  static void rotate_to_lowest(vector<Point>& polygon) {
      const auto start = min_element(
          polygon.begin(), polygon.end(), [](const Point& a, const Point& b) {
              return a.y != b.y ? a.y < b.y : a.x < b.x;
          });
      rotate(polygon.begin(), start, polygon.end());
  }

  static int half_plane(const Point& vector) {
      return vector.y > 0 || (vector.y == 0 && vector.x >= 0) ? 0 : 1;
  }

  static vector<Point> minkowski_sum(vector<Point> first,
                                     vector<Point> second) {
      rotate_to_lowest(first);
      rotate_to_lowest(second);
      vector<Point> edges;
      edges.reserve(first.size() + second.size());
      for (size_t i = 0; i < first.size(); ++i) {
          edges.push_back(first[(i + 1) % first.size()] - first[i]);
      }
      for (size_t i = 0; i < second.size(); ++i) {
          edges.push_back(second[(i + 1) % second.size()] - second[i]);
      }
      sort(edges.begin(), edges.end(), [](const Point& a, const Point& b) {
          if (half_plane(a) != half_plane(b)) {
              return half_plane(a) < half_plane(b);
          }
          const long long turn = cross(a, b);
          if (turn != 0) { return turn > 0; }
          return dot(a, a) < dot(b, b);
      });
      vector<Point> result;
      Point current = first[0] + second[0];
      result.push_back(current);
      for (size_t i = 0; i < edges.size();) {
          Point combined{0, 0};
          size_t j = i;
          while (j < edges.size() && cross(edges[i], edges[j]) == 0 &&
                 dot(edges[i], edges[j]) > 0) {
              combined = combined + edges[j];
              ++j;
          }
          current = current + combined;
          result.push_back(current);
          i = j;
      }
      result.pop_back();
      return convex_hull(result);
  }

  static bool contains(const vector<Point>& polygon, const Point& point) {
      const Point relative = point - polygon[0];
      if (cross(polygon[1] - polygon[0], relative) < 0 ||
          cross(polygon.back() - polygon[0], relative) > 0) {
          return false;
      }
      size_t left = 1;
      size_t right = polygon.size() - 1;
      while (right - left > 1) {
          const size_t middle = (left + right) / 2;
          if (cross(polygon[middle] - polygon[0], relative) >= 0) {
              left = middle;
          } else {
              right = middle;
          }
      }
      return cross(polygon[(left + 1) % polygon.size()] - polygon[left],
                   point - polygon[left]) >= 0;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int m;
      int query_count;
      cin >> n >> m >> query_count;
      vector<Point> first(static_cast<size_t>(n));
      vector<Point> second(static_cast<size_t>(m));
      for (Point& point : first) { cin >> point.x >> point.y; }
      for (Point& point : second) {
          cin >> point.x >> point.y;
          point.x = -point.x;
          point.y = -point.y;
      }
      first = convex_hull(first);
      second = convex_hull(second);
      const vector<Point> difference = minkowski_sum(first, second);
      while (query_count-- > 0) {
          Point movement{};
          cin >> movement.x >> movement.y;
          cout << (contains(difference, movement) ? 1 : 0) << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P4557
external_platform: 洛谷
external_problem_id: P4557
external_title: '[JSOI2018] 戰爭'
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面、限制、範例與 URL 已依洛谷官方題面核實；敘述、證明與程式為本站獨立撰寫。
