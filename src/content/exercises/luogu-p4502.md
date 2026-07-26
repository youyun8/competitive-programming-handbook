---
id: luogu-p4502
volume: lower
source_file: lower-volume
title: 洛谷 P4502 保鏢：反演與三維凸包期望
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['圓反演', 'Delaunay 三角剖分', '三維凸包', '圓與多邊形交']
prerequisites: ['凸包', '歐拉公式', '期望線性性']
statement: 平面有 n 名保鏢。可憐的位置 O 在給定軸平行矩形內均勻分布；每名保鏢 P 沿射線 OP 換到 P'，滿足 |OP|·|OP'|=1（概率為零的 O=P 情況不影響期望）。安全度定義為換崗後保鏢點集凸包的頂點數，求其期望。
constraints:
  - '3 <= n <= 2000'
  - 所有保鏢與矩形座標介於 0 與 10^5
  - 保鏢座標兩兩不同
  - 評測資料矩形長、寬皆至少 10^3
input_format: 第一行 n；第二行矩形左下與右上座標 x0 y0 x1 y1；接著 n 行保鏢座標。
output_format: 輸出凸包頂點數期望，絕對或相對誤差不超過 10^-7。
samples:
  - input: |
      4
      0 0 1 1
      0 0
      2 0
      0 1
      1 1
    output: |
      3.785398163355148
    explanation: 將每個保鏢提升到 (x,y,x²+y²) 後，三維凸包上下表面分別給出空圓與支配圓；對反演中心位於圓內或圓外的面積概率加總。
core_knowledge:
  - 反演中心跨過三點外接圓時，該三角形在 Delaunay 與支配三角剖分間切換
  - 提升映射 (x,y)->(x,y,x²+y²) 把圓內外測試化成點在平面上下側
  - 三維凸包下表面對應 Delaunay 空圓，上表面對應包含全部點的支配圓
judgment: 對提升點集建三維凸包。每個下凸面貢獻「反演中心在外接圓內」的矩形面積比例，每個上凸面貢獻圓外比例；由平面三角剖分與歐拉公式，答案為 2 加上這些概率總和。圓與矩形交面積以四條邊分段成三角形或扇形計算。
hints:
  - 圓方程 x²+y²+Dx+Ey+F=0 在 z=x²+y² 提升後就是平面方程。
  - 任一三角剖分滿足「三角形數+外圍凸包點數=2n-2」；可把欲求凸包點數改寫成反演後 Delaunay 三角形數。
  - 對矩形每條有向邊，按與圓的交點切段；段中點在圓內時計三角形有向面積，否則計圓扇形有向面積。
solution_outline: 對提升後的點作隨機極小擾動，使用增量法維護三維凸包面；可見面刪除，可見與不可見面的分界有向邊連到新點。逐面求原平面三點外接圓與矩形交面積，依法向量 z 正負加圓外或圓內面積，最後除以矩形面積並加 2。
proof_or_invariant: 提升後三點平面與其外接圓一一對應，其他提升點在平面上／下恰等價於原點在圓外／內，因此上下凸面完整列舉支配圓與 Delaunay 空圓。圓反演使空圓在中心位於圓內時變成支配圓，支配圓在中心位於圓外時仍為支配圓；期望線性性可逐面累加。凸包面數為 2n-4，配合三角剖分歐拉恆等式化簡得到期望安全度 2+E。
complexity:
  time: O(n^2)
  space: O(n^2)
common_errors:
  - 把上、下凸面的圓內／圓外貢獻方向顛倒
  - 直接蒙地卡羅反演中心，無法保證 10^-7 誤差
  - 圓與矩形只檢查頂點，漏掉邊穿圓的部分
  - 四點共圓或三點共線時未作一致的符號擾動處理
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：提升至拋物面、建三維凸包，累加各面外接圓的矩形內外概率。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point2 {
      long double x;
      long double y;
  };
  static Point2 operator+(Point2 a, Point2 b) {
      return {a.x + b.x, a.y + b.y};
  }
  static Point2 operator-(Point2 a, Point2 b) {
      return {a.x - b.x, a.y - b.y};
  }
  static Point2 operator*(Point2 a, long double value) {
      return {a.x * value, a.y * value};
  }
  static long double cross(Point2 a, Point2 b) {
      return a.x * b.y - a.y * b.x;
  }
  static long double dot(Point2 a, Point2 b) {
      return a.x * b.x + a.y * b.y;
  }

  struct Point3 {
      long double x;
      long double y;
      long double z;
  };
  static Point3 operator-(Point3 a, Point3 b) {
      return {a.x - b.x, a.y - b.y, a.z - b.z};
  }
  static Point3 cross(Point3 a, Point3 b) {
      return {a.y * b.z - a.z * b.y,
              a.z * b.x - a.x * b.z,
              a.x * b.y - a.y * b.x};
  }
  static long double dot(Point3 a, Point3 b) {
      return a.x * b.x + a.y * b.y + a.z * b.z;
  }

  struct Face {
      array<int, 3> vertex;
  };

  static long double edge_circle_area(Point2 first, Point2 second,
                                      long double radius) {
      const Point2 direction = second - first;
      vector<long double> cuts{0, 1};
      const long double a = dot(direction, direction);
      const long double b = 2 * dot(first, direction);
      const long double c = dot(first, first) - radius * radius;
      const long double discriminant = b * b - 4 * a * c;
      if (discriminant > 0) {
          const long double root = sqrtl(discriminant);
          const long double first_t = (-b - root) / (2 * a);
          const long double second_t = (-b + root) / (2 * a);
          if (first_t > 0 && first_t < 1) { cuts.push_back(first_t); }
          if (second_t > 0 && second_t < 1) {
              cuts.push_back(second_t);
          }
      }
      sort(cuts.begin(), cuts.end());
      long double result = 0;
      for (size_t i = 1; i < cuts.size(); ++i) {
          const Point2 from = first + direction * cuts[i - 1U];
          const Point2 to = first + direction * cuts[i];
          const Point2 middle = (from + to) * 0.5L;
          if (dot(middle, middle) <= radius * radius) {
              result += cross(from, to) * 0.5L;
          } else {
              result += radius * radius *
                        atan2l(cross(from, to), dot(from, to)) * 0.5L;
          }
      }
      return result;
  }

  static long double circle_rectangle_area(
      Point2 center, long double radius,
      const array<Point2, 4>& rectangle) {
      long double area = 0;
      for (int i = 0; i < 4; ++i) {
          area += edge_circle_area(
              rectangle[static_cast<size_t>(i)] - center,
              rectangle[static_cast<size_t>((i + 1) % 4)] - center,
              radius);
      }
      return fabsl(area);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      long double x0;
      long double y0;
      long double x1;
      long double y1;
      cin >> x0 >> y0 >> x1 >> y1;
      array<Point2, 4> rectangle{
          Point2{x0, y0}, Point2{x1, y0},
          Point2{x1, y1}, Point2{x0, y1}};
      vector<Point3> points(static_cast<size_t>(n));
      mt19937_64 generator(19491001ULL);
      uniform_real_distribution<long double> perturbation(0, 1e-10L);
      for (Point3& point : points) {
          long double x;
          long double y;
          cin >> x >> y;
          point = {x + perturbation(generator),
                   y + perturbation(generator),
                   x * x + y * y + perturbation(generator)};
      }

      vector<Face> faces{
          Face{{0, 1, 2}}, Face{{2, 1, 0}}};
      vector<unsigned char> visible_edge(
          static_cast<size_t>(n) * static_cast<size_t>(n), 0);
      const auto normal = [&](const Face& face) {
          return cross(
              points[static_cast<size_t>(face.vertex[1])] -
                  points[static_cast<size_t>(face.vertex[0])],
              points[static_cast<size_t>(face.vertex[2])] -
                  points[static_cast<size_t>(face.vertex[0])]);
      };
      for (int point_id = 3; point_id < n; ++point_id) {
          vector<Face> next_faces;
          next_faces.reserve(faces.size() + 4U);
          for (const Face& face : faces) {
              const bool visible =
                  dot(points[static_cast<size_t>(point_id)] -
                          points[static_cast<size_t>(face.vertex[0])],
                      normal(face)) > 0;
              if (!visible) { next_faces.push_back(face); }
              for (int edge = 0; edge < 3; ++edge) {
                  const int from = face.vertex[static_cast<size_t>(edge)];
                  const int to =
                      face.vertex[static_cast<size_t>((edge + 1) % 3)];
                  visible_edge[static_cast<size_t>(from) *
                                   static_cast<size_t>(n) +
                               static_cast<size_t>(to)] =
                      static_cast<unsigned char>(visible);
              }
          }
          for (const Face& face : faces) {
              for (int edge = 0; edge < 3; ++edge) {
                  const int from = face.vertex[static_cast<size_t>(edge)];
                  const int to =
                      face.vertex[static_cast<size_t>((edge + 1) % 3)];
                  const bool this_visible =
                      visible_edge[static_cast<size_t>(from) *
                                       static_cast<size_t>(n) +
                                   static_cast<size_t>(to)] != 0;
                  const bool reverse_visible =
                      visible_edge[static_cast<size_t>(to) *
                                       static_cast<size_t>(n) +
                                   static_cast<size_t>(from)] != 0;
                  if (this_visible && !reverse_visible) {
                      next_faces.push_back(
                          Face{{from, to, point_id}});
                  }
              }
          }
          faces.swap(next_faces);
      }

      const long double rectangle_area = (x1 - x0) * (y1 - y0);
      long double contribution = 0;
      for (const Face& face : faces) {
          const Point3& p0 =
              points[static_cast<size_t>(face.vertex[0])];
          const Point3& p1 =
              points[static_cast<size_t>(face.vertex[1])];
          const Point3& p2 =
              points[static_cast<size_t>(face.vertex[2])];
          const long double denominator =
              2 * ((p0.x * (p1.y - p2.y)) +
                   (p1.x * (p2.y - p0.y)) +
                   (p2.x * (p0.y - p1.y)));
          const long double p0_square = p0.x * p0.x + p0.y * p0.y;
          const long double p1_square = p1.x * p1.x + p1.y * p1.y;
          const long double p2_square = p2.x * p2.x + p2.y * p2.y;
          const Point2 center{
              (p0_square * (p1.y - p2.y) +
               p1_square * (p2.y - p0.y) +
               p2_square * (p0.y - p1.y)) /
                  denominator,
              (p0_square * (p2.x - p1.x) +
               p1_square * (p0.x - p2.x) +
               p2_square * (p1.x - p0.x)) /
                  denominator};
          const long double radius =
              hypotl(center.x - p0.x, center.y - p0.y);
          const long double inside =
              circle_rectangle_area(center, radius, rectangle);
          if (normal(face).z > 0) {
              contribution += rectangle_area - inside;
          } else {
              contribution += inside;
          }
      }
      const long double answer = 2 + contribution / rectangle_area;
      cout << fixed << setprecision(15) << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4502
external_platform: 洛谷
external_problem_id: P4502
external_title: '[ZJOI2018] 保鏢'
external_relation: original
source_book_pages: [554]
source_pdf_pages: [184]
review_status: verified
---

題面、限制與範例已依 ZJOI 2018 官方存檔、UOJ 413 與洛谷交叉核實；推導另以多份獨立通過題解核對，本站程式以 long double 重寫並避免非標準浮點型別。
