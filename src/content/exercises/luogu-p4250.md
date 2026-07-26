---
id: luogu-p4250
volume: lower
source_file: lower-volume
title: 洛谷 P4250 小凸想跑步：面積不等式半平面交
chapter: 8
section: '8.5'
kind: external-oj
difficulty: 5
topics: ['半平面交', '叉積', '幾何機率']
prerequisites: ['凸多邊形面積', '線性不等式', '半平面交']
statement: 一個凸 n 邊形的頂點依逆時針編號 0..n-1。從多邊形內均勻隨機選一點 p，連接 p 與所有頂點，形成以每條多邊形邊為底的 n 個三角形。求以邊 (0,1) 為底的三角形面積不大於其餘每個三角形面積的機率。
constraints:
  - '3 <= n <= 100000'
  - '-10^9 <= x_i,y_i <= 10^9'
  - 頂點依逆時針輸入並構成凸多邊形
  - 任意三個頂點不共線
input_format: 第一行為頂點數 n；接著 n 行各給整數座標 x_i、y_i。
output_format: 輸出正確站位的機率，固定小數點後 4 位。
samples:
  - input: |
      5
      1 8
      0 7
      0 0
      8 0
      8 8
    output: |
      0.6316
    explanation: 把「第 0 條邊所對三角形面積最小」寫成一組關於 p 座標的線性不等式；其可行區域面積除以原五邊形面積即為 0.6316。
core_knowledge:
  - 凸多邊形內點到有向邊的帶符號三角形面積皆非負
  - 兩個此類面積的大小關係可化成二元一次不等式
  - 均勻隨機點落入凸可行域的機率是面積比
judgment: 每個條件 area(p,v_0,v_1)<=area(p,v_i,v_{i+1}) 都是半平面；再加入原多邊形各邊的內側半平面，求全部交集面積並除以操場面積。總直線數 O(n)，以極角排序與雙端佇列在 O(n log n) 完成。
hints:
  - 逆時針凸多邊形內的 p 滿足 cross(v_{i+1}-v_i,p-v_i)>=0，這正是對應三角形的兩倍面積。
  - 將第 i 條邊的叉積式減去第 0 條邊的叉積式，可整理成 A x_p+B y_p+C>=0，也就是一個左側半平面。
  - 把原多邊形邊與所有面積比較半平面一起做半平面交；相同方向只保留更嚴格者，最後以鞋帶公式求交集面積。
solution_outline: 對每條原邊加入其左半平面。對 i=1..n-1 展開 area_i-area_0>=0 的係數，建立方向 (B,-A) 的有向直線，使左側值為 Ax+By+C>=0。全部直線依方向角排序、去除同向冗餘後，以雙端佇列做半平面交。計算所得凸多邊形與原多邊形面積比。
proof_or_invariant: 對凸多邊形內點，cross(edge_i,p-v_i)/2 就是第 i 個三角形面積，因此每個面積比較與推導出的半平面完全等價；原邊半平面則保證 p 位於操場內。故所有半平面的交集恰是且只是真確站位集合。半平面交佇列維持方向遞增及相鄰交點可行，彈出的邊界不可能再貢獻交集；最終多邊形即此集合。均勻取點的機率等於可行面積除以操場面積。
complexity:
  time: O(n log n)
  space: O(n)
common_errors:
  - 忘記頂點逆時針時多邊形內部位於每條邊左側
  - 面積比較展開時常數項或不等號方向寫反
  - 同向平行半平面全部保留，之後求交時除以零
  - 只求比較條件交集而忘記再限制 p 位於原多邊形
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };
  struct Line { Point point; Point direction; long double angle; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：把面積比較展開成左半平面，求交集面積與原面積之比。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };
  struct Line { Point point; Point direction; long double angle; };

  static Point operator+(const Point& a, const Point& b) {
      return {a.x + b.x, a.y + b.y};
  }
  static Point operator-(const Point& a, const Point& b) {
      return {a.x - b.x, a.y - b.y};
  }
  static Point operator*(const Point& point, long double scale) {
      return {point.x * scale, point.y * scale};
  }
  static long double cross(const Point& a, const Point& b) {
      return a.x * b.y - a.y * b.x;
  }
  static bool on_left(const Line& line, const Point& point) {
      return cross(line.direction, point - line.point) >= -1e-12L;
  }
  static Point intersection(const Line& first, const Line& second) {
      const long double ratio =
          cross(second.point - first.point, second.direction) /
          cross(first.direction, second.direction);
      return first.point + first.direction * ratio;
  }
  static Line make_line(const Point& point, const Point& direction) {
      long double angle = atan2l(direction.y, direction.x);
      if (angle < 0.0L) { angle += 2.0L * acosl(-1.0L); }
      return {point, direction, angle};
  }

  static vector<Point> half_plane_intersection(vector<Line> lines) {
      sort(lines.begin(), lines.end(), [](const Line& a, const Line& b) {
          if (fabsl(a.angle - b.angle) > 1e-18L) {
              return a.angle < b.angle;
          }
          return cross(a.direction, b.point - a.point) < 0.0L;
      });
      vector<Line> filtered;
      for (const Line& line : lines) {
          if (!filtered.empty() &&
              fabsl(cross(filtered.back().direction, line.direction)) <=
                  1e-18L &&
              filtered.back().direction.x * line.direction.x +
                      filtered.back().direction.y * line.direction.y >
                  0.0L) {
              if (cross(filtered.back().direction,
                        line.point - filtered.back().point) > 0.0L) {
                  filtered.back() = line;
              }
          } else {
              filtered.push_back(line);
          }
      }

      deque<Line> deque_lines;
      for (const Line& line : filtered) {
          while (deque_lines.size() >= 2U &&
                 !on_left(line,
                          intersection(deque_lines[deque_lines.size() - 2U],
                                       deque_lines.back()))) {
              deque_lines.pop_back();
          }
          while (deque_lines.size() >= 2U &&
                 !on_left(line,
                          intersection(deque_lines[0], deque_lines[1]))) {
              deque_lines.pop_front();
          }
          deque_lines.push_back(line);
      }
      while (deque_lines.size() >= 3U &&
             !on_left(deque_lines.front(),
                      intersection(deque_lines[deque_lines.size() - 2U],
                                   deque_lines.back()))) {
          deque_lines.pop_back();
      }
      while (deque_lines.size() >= 3U &&
             !on_left(deque_lines.back(),
                      intersection(deque_lines[0], deque_lines[1]))) {
          deque_lines.pop_front();
      }
      if (deque_lines.size() < 3U) { return {}; }
      vector<Point> polygon;
      for (size_t i = 0; i < deque_lines.size(); ++i) {
          polygon.push_back(intersection(
              deque_lines[i], deque_lines[(i + 1U) % deque_lines.size()]));
      }
      return polygon;
  }

  static long double area(const vector<Point>& polygon) {
      long double twice_area = 0.0L;
      for (size_t i = 0; i < polygon.size(); ++i) {
          twice_area +=
              cross(polygon[i], polygon[(i + 1U) % polygon.size()]);
      }
      return fabsl(twice_area) * 0.5L;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<Point> polygon(static_cast<size_t>(n));
      for (Point& point : polygon) { cin >> point.x >> point.y; }
      vector<Line> lines;
      lines.reserve(static_cast<size_t>(n) * 2U);
      for (int i = 0; i < n; ++i) {
          const Point& first = polygon[static_cast<size_t>(i)];
          const Point& second =
              polygon[static_cast<size_t>((i + 1) % n)];
          lines.push_back(make_line(first, second - first));
      }

      const Point base_edge = polygon[1] - polygon[0];
      const long double base_constant =
          base_edge.y * polygon[0].x - base_edge.x * polygon[0].y;
      for (int i = 1; i < n; ++i) {
          const Point& vertex = polygon[static_cast<size_t>(i)];
          const Point edge =
              polygon[static_cast<size_t>((i + 1) % n)] - vertex;
          const long double coefficient_x = -edge.y + base_edge.y;
          const long double coefficient_y = edge.x - base_edge.x;
          const long double constant =
              edge.y * vertex.x - edge.x * vertex.y - base_constant;
          Point point{};
          if (fabsl(coefficient_x) > fabsl(coefficient_y)) {
              point = {-constant / coefficient_x, 0.0L};
          } else {
              point = {0.0L, -constant / coefficient_y};
          }
          lines.push_back(make_line(
              point, {coefficient_y, -coefficient_x}));
      }
      const vector<Point> feasible = half_plane_intersection(lines);
      const long double probability =
          feasible.empty() ? 0.0L : area(feasible) / area(polygon);
      cout << fixed << setprecision(4) << probability << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4250
external_platform: 洛谷
external_problem_id: P4250
external_title: '[SCOI2015] 小凸想跑步'
external_relation: original
source_book_pages: [552]
source_pdf_pages: [182]
review_status: verified
---

題面、限制、官方 URL 與範例已依洛谷題面核實；繁中敘述、證明與程式為本站獨立撰寫。
