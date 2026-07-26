---
id: luogu-p3829
volume: lower
source_file: lower-volume
title: 洛谷 P3829 信用卡凸包
chapter: 8
section: '8.3'
kind: external-oj
difficulty: 3
topics: ['凸包', '向量旋轉', '圓角外擴']
prerequisites: ['Andrew 單調鏈', '旋轉矩陣', '周長']
statement: 平面上有 n 張規格相同但中心與旋轉角不同的圓角矩形信用卡。每個角以半徑 r 的四分之一圓平滑處理。求所有信用卡聯集之凸包邊界周長，邊界可包含直線段與圓弧。
constraints:
  - '1 <= n <= 100000'
  - '0.1 <= a, b <= 1000000.0'
  - '0.0 <= r < min(a/4,b/4)'
  - '|x_i|, |y_i| <= 1000000.0'
  - '0 <= theta_i < 2*pi'
input_format: 第一行為信用卡數 n。第二行為未圓滑矩形的垂直長 a、水平長 b、圓角半徑 r。接著 n 行為卡片中心 x、y 與逆時針旋轉弧度 theta。
output_format: 輸出所有信用卡凸包周長，四捨五入保留小數點後兩位。
samples:
  - input: |
      2
      6.0 2.0 0.0
      0.0 0.0 0.0
      2.0 -2.0 1.5707963268
    output: |
      21.66
    explanation: 官方第一組範例的 r=0；兩張旋轉矩形所有角點的凸包周長為 16+4sqrt(2)，四捨五入即 21.66。
core_knowledge:
  - 圓角矩形等於內縮矩形與半徑 r 圓盤的 Minkowski 和
  - 剛體旋轉後的四個圓角圓心
  - 凸包外擴圓盤使周長增加 2*pi*r
judgment: 每張卡先把 a、b 各內縮 2r，四個角就是圓角圓心。所有卡凸包等於這 4n 點的凸包再與半徑 r 圓盤作 Minkowski 和，因此答案是點凸包周長加完整圓周。
hints:
  - 圓角矩形可看成尺寸 (a-2r)×(b-2r) 的矩形與半徑 r 圓盤之和。
  - 基準四角偏移為 (±(b/2-r),±(a/2-r))；用 (x cosθ-y sinθ,x sinθ+y cosθ) 旋轉後加卡片中心。
  - 對全部 4n 個圓心求凸包並累加周長；外擴後各轉角圓弧的圓心角總和為 2π，只需再加 2πr。
solution_outline: 讀入每張卡的中心與角度，旋轉平移四個內縮矩形角點。用 Andrew 單調鏈求所有角點凸包，累加循環周長，最後加 2πr。
proof_or_invariant: 單張圓角卡精確等於其四個圓角圓心的凸包（內縮矩形）與半徑 r 圓盤的 Minkowski 和。凸包與 Minkowski 加法可交換，因此所有卡片的凸包等於全部圓心點凸包再外擴 r。外擴保留每條直線邊長，並以半徑 r、總外角 2π 的圓弧連接，故周長增加 2πr。
complexity:
  time: O(n log n)
  space: O(n)
common_errors:
  - 使用原矩形四角而未將兩個半邊長各減 r
  - 把題目給的 theta 當成角度而再次換算弧度
  - 對每張卡各加一個圓周，應只加一次 2πr
  - 凸包合併時重複端點或漏算末點到首點
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：旋轉平移每張卡的四個圓角圓心，求凸包周長再加 2*pi*r。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };

  static Point operator-(const Point& a, const Point& b) {
      return {a.x - b.x, a.y - b.y};
  }
  static long double cross(const Point& a, const Point& b) {
      return a.x * b.y - a.y * b.x;
  }
  static Point rotate_point(const Point& point, long double angle) {
      const long double cosine = cosl(angle);
      const long double sine = sinl(angle);
      return {point.x * cosine - point.y * sine,
              point.x * sine + point.y * cosine};
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      long double vertical_length;
      long double horizontal_length;
      long double radius;
      cin >> n >> vertical_length >> horizontal_length >> radius;
      const long double half_x = horizontal_length / 2.0L - radius;
      const long double half_y = vertical_length / 2.0L - radius;
      const array<Point, 4> offsets{
          Point{-half_x, -half_y}, Point{half_x, -half_y},
          Point{half_x, half_y}, Point{-half_x, half_y}};
      vector<Point> points;
      points.reserve(static_cast<size_t>(4 * n));
      for (int i = 0; i < n; ++i) {
          long double center_x;
          long double center_y;
          long double angle;
          cin >> center_x >> center_y >> angle;
          for (const Point& offset : offsets) {
              const Point rotated = rotate_point(offset, angle);
              points.push_back(
                  {center_x + rotated.x, center_y + rotated.y});
          }
      }
      sort(points.begin(), points.end(), [](const Point& a, const Point& b) {
          return a.x != b.x ? a.x < b.x : a.y < b.y;
      });
      points.erase(unique(points.begin(), points.end(),
                          [](const Point& a, const Point& b) {
                              return a.x == b.x && a.y == b.y;
                          }),
                   points.end());
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
      long double perimeter = 0.0L;
      for (size_t i = 0; i < hull.size(); ++i) {
          const Point edge = hull[(i + 1) % hull.size()] - hull[i];
          perimeter += hypotl(edge.x, edge.y);
      }
      perimeter += 2.0L * acosl(-1.0L) * radius;
      cout << fixed << setprecision(2) << perimeter << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P3829
external_platform: 洛谷
external_problem_id: P3829
external_title: '[SHOI2012] 信用卡凸包'
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面、格式、資料範圍與 URL 已依洛谷題面資料核實；敘述、證明與程式為本站獨立撰寫。
