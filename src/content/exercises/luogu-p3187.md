---
id: luogu-p3187
volume: lower
source_file: lower-volume
title: 洛谷 P3187 最小矩形覆蓋
chapter: 8
section: '8.4'
kind: external-oj
difficulty: 5
topics: ['旋轉卡尺', '凸包', '最小外接矩形']
prerequisites: ['Andrew 單調鏈', '點積', '叉積']
statement: 給定平面上的 n 個點，求能覆蓋全部點的最小面積矩形。輸出最小面積與四個矩形頂點；頂點須從 y 最小、同 y 時 x 最小者開始，依逆時針順序輸出。
constraints:
  - '3 <= n <= 50000'
  - '|x_i|, |y_i| <= 10000'
  - 座標為實數且小數點後至多五位
  - 最小覆蓋矩形面積至少為 1e-5
input_format: 第一行為點數 n；接著 n 行各有點的實數座標 x、y。
output_format: 第一行輸出最小面積，接著四行按指定起點及逆時針順序輸出矩形頂點；皆保留五位小數。
samples:
  - input: |
      6
      1.0 3.00000
      1 4.00000
      2.0000 1
      3 0.0000
      3.00000 6
      6.0 3.0
    output: |
      18.00000
      3.00000 0.00000
      6.00000 3.00000
      3.00000 6.00000
      0.00000 3.00000
    explanation: 官方範例的最小矩形為四個頂點 (3,0)、(6,3)、(3,6)、(0,3) 的菱形，兩條相鄰邊長皆為 3sqrt(2)，面積為 18。
core_knowledge:
  - 最小外接矩形至少一邊與凸包邊共線
  - 旋轉卡尺同步維護法向最遠點與切向兩極值
  - 正交基底重建矩形四角
judgment: 先縮到凸包。枚舉凸包每條邊作矩形底邊時，所需高度是最大叉積，寬度是最大、最小點積之差；三個極值點隨邊方向旋轉只會沿凸包前進，可線性掃描。
hints:
  - 任何最小面積外接矩形都可旋轉到至少一條邊貼住凸包邊，否則仍能小幅旋轉縮小面積。
  - 對底邊向量 e，矩形高度分子是 max cross(e,p-a)，寬度分子是 max dot(e,p)-min dot(e,p)；各自除以 |e|。
  - 用三個循環指標在下一頂點嚴格改善極值時前進。記錄最佳投影後，以單位向量 u=e/|e|、v=(-u_y,u_x) 組合四個角。
solution_outline: Andrew 建逆時針凸包。逐邊用旋轉卡尺維護最大法向距離、最大及最小切向投影，計算面積並保存最佳四個投影界。用正交單位基底還原頂點，旋轉輸出序列到最低、再最左頂點。
proof_or_invariant: 最優外接矩形必有一邊與凸包支撐線重合，因此枚舉凸包邊不漏解。固定邊 e 時，所有點在其左側，四條矩形邊的最小可行位置正是法向與切向投影的極值，所得矩形對該方向面積最小。凸多邊形的線性函數極值點隨方向單調繞行，卡尺指標只前進仍能取得每邊精確極值；取所有方向最小者即全域最優。
complexity:
  time: O(n log n)，建凸包主導；旋轉卡尺 O(h)
  space: O(n)
common_errors:
  - 對原始點而非凸包做卡尺，失去單調性
  - 面積公式忘記兩個投影都要除以 |e|
  - 四角順序為順時針或未從最低、再最左點開始
  - 輸出接近零的負值成為 -0.00000
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：建凸包後以三個旋轉卡尺指標維護法向與切向投影極值。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };
  static Point operator+(const Point& a, const Point& b) {
      return {a.x + b.x, a.y + b.y};
  }
  static Point operator-(const Point& a, const Point& b) {
      return {a.x - b.x, a.y - b.y};
  }
  static Point operator*(const Point& a, long double scale) {
      return {a.x * scale, a.y * scale};
  }
  static long double cross(const Point& a, const Point& b) {
      return a.x * b.y - a.y * b.x;
  }
  static long double dot(const Point& a, const Point& b) {
      return a.x * b.x + a.y * b.y;
  }

  static vector<Point> convex_hull(vector<Point> points) {
      sort(points.begin(), points.end(), [](const Point& a, const Point& b) {
          return a.x != b.x ? a.x < b.x : a.y < b.y;
      });
      vector<Point> hull;
      for (const Point& point : points) {
          while (hull.size() >= 2 &&
                 cross(hull.back() - hull[hull.size() - 2],
                       point - hull.back()) <= 1e-12L) {
              hull.pop_back();
          }
          hull.push_back(point);
      }
      const size_t lower_size = hull.size();
      for (size_t i = points.size() - 1; i-- > 0;) {
          const Point& point = points[i];
          while (hull.size() > lower_size &&
                 cross(hull.back() - hull[hull.size() - 2],
                       point - hull.back()) <= 1e-12L) {
              hull.pop_back();
          }
          hull.push_back(point);
      }
      hull.pop_back();
      return hull;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<Point> points(static_cast<size_t>(n));
      for (Point& point : points) { cin >> point.x >> point.y; }
      const vector<Point> hull = convex_hull(points);
      const size_t size = hull.size();
      size_t top = 0;
      size_t minimum_projection = 0;
      size_t maximum_projection = 0;
      const Point first_edge = hull[1] - hull[0];
      for (size_t i = 1; i < size; ++i) {
          if (cross(first_edge, hull[i] - hull[0]) >
              cross(first_edge, hull[top] - hull[0])) {
              top = i;
          }
          if (dot(first_edge, hull[i]) <
              dot(first_edge, hull[minimum_projection])) {
              minimum_projection = i;
          }
          if (dot(first_edge, hull[i]) >
              dot(first_edge, hull[maximum_projection])) {
              maximum_projection = i;
          }
      }
      long double best_area = numeric_limits<long double>::infinity();
      array<Point, 4> best_corners{};

      for (size_t i = 0; i < size; ++i) {
          const Point edge = hull[(i + 1) % size] - hull[i];
          const auto height_value = [&hull, &edge, &i](size_t index) {
              return cross(edge, hull[index] - hull[i]);
          };
          const auto projection = [&hull, &edge](size_t index) {
              return dot(edge, hull[index]);
          };
          while (height_value((top + 1) % size) >
                 height_value(top) + 1e-12L) {
              top = (top + 1) % size;
          }
          while (projection((maximum_projection + 1) % size) >
                 projection(maximum_projection) + 1e-12L) {
              maximum_projection = (maximum_projection + 1) % size;
          }
          while (projection((minimum_projection + 1) % size) <
                 projection(minimum_projection) - 1e-12L) {
              minimum_projection = (minimum_projection + 1) % size;
          }
          const long double length = hypotl(edge.x, edge.y);
          const long double minimum_u =
              projection(minimum_projection) / length;
          const long double maximum_u =
              projection(maximum_projection) / length;
          const Point unit_u = edge * (1.0L / length);
          const Point unit_v{-unit_u.y, unit_u.x};
          const long double minimum_v = dot(unit_v, hull[i]);
          const long double maximum_v =
              minimum_v + height_value(top) / length;
          const long double area =
              (maximum_u - minimum_u) * (maximum_v - minimum_v);
          if (area < best_area - 1e-10L) {
              best_area = area;
              best_corners = {
                  unit_u * minimum_u + unit_v * minimum_v,
                  unit_u * maximum_u + unit_v * minimum_v,
                  unit_u * maximum_u + unit_v * maximum_v,
                  unit_u * minimum_u + unit_v * maximum_v};
          }
      }

      size_t start = 0;
      for (size_t i = 1; i < best_corners.size(); ++i) {
          if (best_corners[i].y < best_corners[start].y - 1e-10L ||
              (fabsl(best_corners[i].y - best_corners[start].y) <= 1e-10L &&
               best_corners[i].x < best_corners[start].x)) {
              start = i;
          }
      }
      cout << fixed << setprecision(5) << best_area << '\n';
      for (size_t offset = 0; offset < best_corners.size(); ++offset) {
          Point point =
              best_corners[(start + offset) % best_corners.size()];
          if (fabsl(point.x) < 0.0000005L) { point.x = 0.0L; }
          if (fabsl(point.y) < 0.0000005L) { point.y = 0.0L; }
          cout << point.x << ' ' << point.y << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P3187
external_platform: 洛谷
external_problem_id: P3187
external_title: '[HNOI2007] 最小矩形覆蓋'
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面、限制、範例與 URL 已依洛谷官方題面核實；敘述、證明與程式為本站獨立撰寫。
