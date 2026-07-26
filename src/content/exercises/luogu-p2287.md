---
id: luogu-p2287
volume: lower
source_file: lower-volume
title: 洛谷 P2287 最佳包裹：三維凸包表面積
chapter: 8
section: '8.3'
kind: external-oj
difficulty: 5
topics: ['三維凸包', '增量法', '向量叉積']
prerequisites: ['三維向量', '二維凸包']
statement: 給定三維空間中一件由直金屬條焊接而成的製品之所有頂點。材料可緊密包覆其外部，且不計裁剪損耗；求所需材料的最小面積，也就是這些點三維凸包的表面積。
constraints:
  - '4 <= n <= 100'
  - 每個頂點有三個實數座標
  - 所有頂點位置互不相同
input_format: 第一行為頂點數 n；接著 n 行各給 x_i、y_i、z_i。
output_format: 輸出三維凸包表面積，四捨五入至小數點後 6 位。
samples:
  - input: |
      4
      0 0 0
      1 0 0
      0 1 0
      0 0 1
    output: |
      2.366025
    explanation: 三個座標平面上的直角三角形面積各為 1/2，斜面面積為 sqrt(3)/2，總和為 (3+sqrt(3))/2。
core_knowledge:
  - 三維凸包表面由朝外定向的三角形面組成
  - 增量加入外點時，只需刪除可見面並用視野輪廓連接新點
  - 共面退化可投影成二維凸包處理
judgment: n 只有 100，可用 O(n²) 增量三維凸包。固定一個始終在凸包內的點校正新面的外向方向；可見面聯集的邊界恰是只出現一次的無向邊。
hints:
  - 先找四個不共面的點建立四面體，並把每個三角面轉到「固定內點位於背面」的方向。
  - 加入新點時，法向量與「新點減面上一點」的點積為正，代表該面從新點可見。
  - 統計所有可見面的無向邊；出現一次者構成洞口輪廓，逐邊與新點建面並用固定內點校正方向。
solution_outline: 重排輸入以找出不重合、非共線及不共面的前四點，建立外向四面體。依序加入其餘點，標記可見面、找只屬於一個可見面的輪廓邊，刪除可見面並補上輪廓邊至新點的三角面。最後累加有效三角形叉積長度的一半。若所有點共面，投影至法向量絕對值最大的座標平面做二維凸包，再依投影比例還原單面面積並乘二。
proof_or_invariant: 維護的不變量是有效面恰構成已加入點的凸包邊界，且法向皆朝外。若新點在所有面的非正側，它已在閉凸包內，邊界不變。否則從新點可見的面正是加入它後會消失的邊界區域；此區域的內部邊由兩個可見面共享，只有出現一次的邊位於輪廓。刪除可見面並把每條輪廓邊連至新點，恰封閉新凸包，固定內點校正後方向仍朝外。歸納可得最後所有有效面就是完整凸包。
complexity:
  time: O(n²)
  space: O(n²)
common_errors:
  - 新面方向不一致，導致後續可見面判定顛倒
  - 把可見區內部出現兩次的邊也接到新點
  - 用固定絕對 epsilon 而未考慮輸入尺度
  - 所有點共面時找不到初始四面體而越界
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Vec3 { long double x; long double y; long double z; };
  struct Face { int a; int b; int c; bool alive; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：建立初始四面體，增量刪除可見面並以輪廓邊連接新點。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Vec3 { long double x; long double y; long double z; };
  struct Vec2 { long double x; long double y; };
  struct Face { int a; int b; int c; bool alive; };

  static Vec3 operator+(const Vec3& a, const Vec3& b) {
      return {a.x + b.x, a.y + b.y, a.z + b.z};
  }
  static Vec3 operator-(const Vec3& a, const Vec3& b) {
      return {a.x - b.x, a.y - b.y, a.z - b.z};
  }
  static Vec3 operator*(const Vec3& a, long double scale) {
      return {a.x * scale, a.y * scale, a.z * scale};
  }
  static long double dot(const Vec3& a, const Vec3& b) {
      return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  static Vec3 cross(const Vec3& a, const Vec3& b) {
      return {a.y * b.z - a.z * b.y,
              a.z * b.x - a.x * b.z,
              a.x * b.y - a.y * b.x};
  }
  static long double norm(const Vec3& a) { return sqrtl(dot(a, a)); }
  static long double cross2(const Vec2& a, const Vec2& b,
                            const Vec2& c) {
      return (b.x - a.x) * (c.y - a.y) -
             (b.y - a.y) * (c.x - a.x);
  }

  static long double coplanar_surface(vector<Vec3> points,
                                      const Vec3& normal) {
      int dropped = 0;
      if (fabsl(normal.y) > fabsl(normal.x)) { dropped = 1; }
      if ((dropped == 0 ? fabsl(normal.x) : fabsl(normal.y)) <
          fabsl(normal.z)) {
          dropped = 2;
      }
      vector<Vec2> projected;
      projected.reserve(points.size());
      for (const Vec3& point : points) {
          if (dropped == 0) {
              projected.push_back({point.y, point.z});
          } else if (dropped == 1) {
              projected.push_back({point.x, point.z});
          } else {
              projected.push_back({point.x, point.y});
          }
      }
      sort(projected.begin(), projected.end(), [](const Vec2& a,
                                                   const Vec2& b) {
          return a.x != b.x ? a.x < b.x : a.y < b.y;
      });
      vector<Vec2> hull;
      for (const Vec2& point : projected) {
          while (hull.size() >= 2U &&
                 cross2(hull[hull.size() - 2U], hull.back(), point) <= 0.0L) {
              hull.pop_back();
          }
          hull.push_back(point);
      }
      const size_t lower_size = hull.size();
      for (size_t i = projected.size() - 1U; i-- > 0U;) {
          const Vec2& point = projected[i];
          while (hull.size() > lower_size &&
                 cross2(hull[hull.size() - 2U], hull.back(), point) <= 0.0L) {
              hull.pop_back();
          }
          hull.push_back(point);
      }
      hull.pop_back();
      long double projected_twice_area = 0.0L;
      for (size_t i = 0; i < hull.size(); ++i) {
          const Vec2& a = hull[i];
          const Vec2& b = hull[(i + 1U) % hull.size()];
          projected_twice_area += a.x * b.y - a.y * b.x;
      }
      const long double normal_length = norm(normal);
      const long double component =
          dropped == 0 ? fabsl(normal.x)
                       : (dropped == 1 ? fabsl(normal.y) : fabsl(normal.z));
      const long double one_side_area =
          fabsl(projected_twice_area) * 0.5L * normal_length / component;
      return 2.0L * one_side_area;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<Vec3> points(static_cast<size_t>(n));
      long double scale = 1.0L;
      for (Vec3& point : points) {
          cin >> point.x >> point.y >> point.z;
          scale = max(scale, max({fabsl(point.x), fabsl(point.y),
                                  fabsl(point.z)}));
      }
      const long double eps = 1e-12L * scale * scale * scale;

      size_t second = 1U;
      while (second < points.size() &&
             norm(points[second] - points[0]) <= 1e-18L * scale) {
          ++second;
      }
      swap(points[1], points[second]);
      size_t third = 2U;
      while (third < points.size() &&
             norm(cross(points[1] - points[0],
                        points[third] - points[0])) <=
                 1e-15L * scale * scale) {
          ++third;
      }
      if (third == points.size()) {
          cout << fixed << setprecision(6) << 0.0L << '\n';
          return 0;
      }
      swap(points[2], points[third]);
      const Vec3 initial_normal =
          cross(points[1] - points[0], points[2] - points[0]);
      size_t fourth = 3U;
      while (fourth < points.size() &&
             fabsl(dot(initial_normal, points[fourth] - points[0])) <= eps) {
          ++fourth;
      }
      if (fourth == points.size()) {
          cout << fixed << setprecision(6)
               << coplanar_surface(points, initial_normal) << '\n';
          return 0;
      }
      swap(points[3], points[fourth]);
      const Vec3 inside =
          (points[0] + points[1] + points[2] + points[3]) * 0.25L;

      vector<Face> faces;
      const array<array<int, 3>, 4> initial_faces{
          array<int, 3>{0, 1, 2}, array<int, 3>{0, 3, 1},
          array<int, 3>{0, 2, 3}, array<int, 3>{1, 3, 2}};
      for (const auto& indices : initial_faces) {
          Face face{indices[0], indices[1], indices[2], true};
          const Vec3 normal =
              cross(points[static_cast<size_t>(face.b)] -
                        points[static_cast<size_t>(face.a)],
                    points[static_cast<size_t>(face.c)] -
                        points[static_cast<size_t>(face.a)]);
          if (dot(normal, inside - points[static_cast<size_t>(face.a)]) >
              0.0L) {
              swap(face.b, face.c);
          }
          faces.push_back(face);
      }

      for (int point_index = 4; point_index < n; ++point_index) {
          map<pair<int, int>, pair<pair<int, int>, int>> edges;
          bool outside = false;
          for (Face& face : faces) {
              if (!face.alive) { continue; }
              const Vec3 normal =
                  cross(points[static_cast<size_t>(face.b)] -
                            points[static_cast<size_t>(face.a)],
                        points[static_cast<size_t>(face.c)] -
                            points[static_cast<size_t>(face.a)]);
              if (dot(normal,
                      points[static_cast<size_t>(point_index)] -
                          points[static_cast<size_t>(face.a)]) <= eps) {
                  continue;
              }
              outside = true;
              face.alive = false;
              const array<pair<int, int>, 3> directed{
                  pair<int, int>{face.a, face.b},
                  pair<int, int>{face.b, face.c},
                  pair<int, int>{face.c, face.a}};
              for (const auto& edge : directed) {
                  const pair<int, int> key{min(edge.first, edge.second),
                                           max(edge.first, edge.second)};
                  auto& record = edges[key];
                  if (record.second == 0) { record.first = edge; }
                  ++record.second;
              }
          }
          if (!outside) { continue; }
          for (const auto& entry : edges) {
              if (entry.second.second != 1) { continue; }
              const auto edge = entry.second.first;
              Face face{edge.first, edge.second, point_index, true};
              Vec3 normal =
                  cross(points[static_cast<size_t>(face.b)] -
                            points[static_cast<size_t>(face.a)],
                        points[static_cast<size_t>(face.c)] -
                            points[static_cast<size_t>(face.a)]);
              if (dot(normal,
                      inside - points[static_cast<size_t>(face.a)]) > 0.0L) {
                  swap(face.a, face.b);
              }
              faces.push_back(face);
          }
      }

      long double answer = 0.0L;
      for (const Face& face : faces) {
          if (!face.alive) { continue; }
          answer +=
              norm(cross(points[static_cast<size_t>(face.b)] -
                             points[static_cast<size_t>(face.a)],
                         points[static_cast<size_t>(face.c)] -
                             points[static_cast<size_t>(face.a)])) *
              0.5L;
      }
      cout << fixed << setprecision(6) << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2287
external_platform: 洛谷
external_problem_id: P2287
external_title: '[HNOI2004] 最佳包裹'
external_relation: original
source_book_pages: [547]
source_pdf_pages: [177]
review_status: verified
---

題面、限制、官方 URL 與範例已依洛谷題面核實；繁中敘述、證明與程式為本站獨立撰寫。
