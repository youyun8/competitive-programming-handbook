---
id: luogu-p1742
volume: lower
source_file: lower-volume
title: 洛谷 P1742 最小圓覆蓋
chapter: 8
section: '8.0'
kind: external-oj
difficulty: 4
topics: ['最小包覆圓', '隨機增量', '圓心']
prerequisites: ['向量', '外接圓', '隨機化']
statement: 給定平面上 N 個點，求半徑最小且包含所有點（允許在圓周上）的圓，並輸出其半徑與圓心座標。
constraints:
  - '1 <= N <= 100000'
  - '|x_i|, |y_i| <= 10000'
  - 座標為實數且小數點後至多兩位
  - 輸出與標準答案誤差不超過 1e-9
input_format: 第一行為點數 N；接著 N 行各有點的實數座標 x_i、y_i。
output_format: 第一行輸出最小圓半徑；第二行輸出圓心 x、y。題目使用特別評測。
samples:
  - input: |
      4
      0 0
      2 0
      2 2
      0 2
    output: |
      1.414213562373
      1.000000000000 1.000000000000
    explanation: 本站自製基本範例。正方形四頂點的最小覆蓋圓以 (1,1) 為圓心，半徑為對角線的一半 sqrt(2)。
core_knowledge:
  - 平面最小包覆圓由至多三個邊界點決定
  - 隨機增量降低固定邊界重建次數
  - 共線三點由較小子集決定
judgment: N 可達十萬，需期望線性演算法。打亂後逐點加入；若新點在圓外，它必成為新最小圓的邊界點，再逐層固定第二、第三個邊界點重建。
hints:
  - 最小覆蓋圓若可縮小就不是最優，因此圓周上至少有支撐點，且平面中最多三個支撐點便能決定圓。
  - 隨機掃描點；遇到圓外點 i 時重設為以 i 為邊界的圓，再掃前綴找第二個外點 j，必要時找第三個 k。
  - 三個固定點共線時外接圓不存在；枚舉一點、兩點、三點子集，選能包含整個固定集合的最小候選可統一處理。
solution_outline: 固定種子打亂輸入，以三層增量迴圈維護最小圓。每次邊界集合改變時，枚舉其所有非空子集建立單點圓、直徑圓或三點外接圓，驗證覆蓋後取最小者。
proof_or_invariant: 每層掃描完成後，目前圓是包含已掃前綴且通過外層固定邊界點的最小圓。若新點在圓內不影響最優；若在圓外，任何新最小圓必把它放在邊界，否則仍可朝它縮小或移動，所以固定它後遞迴重建完整。平面最小圓至多三個支撐點，三層涵蓋全部情況；退化支撐由子集枚舉補足。
complexity:
  time: 隨機期望 O(N)，最壞 O(N³)
  space: O(N)
common_errors:
  - 未打亂點序，讓對抗資料觸發三次方時間
  - 三點近共線時直接除以極小叉積
  - 圓內判定不留相對誤差，邊界點反覆被判在外
  - 輸出小數位數不足以達到 1e-9
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：隨機增量並逐層固定至多三個圓周支撐點。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };
  struct Circle { Point center; long double radius; bool valid; };

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
  static long double norm(const Point& a) { return hypotl(a.x, a.y); }

  static bool contains(const Circle& circle, const Point& point) {
      return circle.valid &&
             norm(point - circle.center) <=
                 circle.radius + 1e-12L * max(1.0L, circle.radius);
  }

  static Circle from_subset(const vector<Point>& points) {
      if (points.size() == 1) { return {points[0], 0.0L, true}; }
      if (points.size() == 2) {
          const Point center = (points[0] + points[1]) * 0.5L;
          return {center, norm(points[0] - center), true};
      }
      const Point u = points[1] - points[0];
      const Point v = points[2] - points[0];
      const long double determinant = 2.0L * cross(u, v);
      if (fabsl(determinant) < 1e-24L) {
          return {{0.0L, 0.0L}, 0.0L, false};
      }
      const long double u_length = u.x * u.x + u.y * u.y;
      const long double v_length = v.x * v.x + v.y * v.y;
      const Point offset{
          (u_length * v.y - v_length * u.y) / determinant,
          (u.x * v_length - v.x * u_length) / determinant};
      const Point center = points[0] + offset;
      return {center, norm(points[0] - center), true};
  }

  static Circle minimum_boundary_circle(const vector<Point>& boundary) {
      Circle best{{0.0L, 0.0L},
                  numeric_limits<long double>::infinity(), false};
      const unsigned int count = static_cast<unsigned int>(boundary.size());
      for (unsigned int mask = 1U; mask < (1U << count); ++mask) {
          vector<Point> subset;
          for (unsigned int i = 0; i < count; ++i) {
              if ((mask & (1U << i)) != 0U) {
                  subset.push_back(boundary[static_cast<size_t>(i)]);
              }
          }
          Circle candidate = from_subset(subset);
          if (!candidate.valid) { continue; }
          bool covers = true;
          for (const Point& point : boundary) {
              if (!contains(candidate, point)) { covers = false; }
          }
          if (covers && (!best.valid || candidate.radius < best.radius)) {
              best = candidate;
          }
      }
      return best;
  }

  static Circle minimum_enclosing_circle(vector<Point> points) {
      mt19937 generator(20240726U);
      shuffle(points.begin(), points.end(), generator);
      Circle circle = minimum_boundary_circle({points[0]});
      for (size_t i = 0; i < points.size(); ++i) {
          if (contains(circle, points[i])) { continue; }
          circle = minimum_boundary_circle({points[i]});
          for (size_t j = 0; j < i; ++j) {
              if (contains(circle, points[j])) { continue; }
              circle = minimum_boundary_circle({points[i], points[j]});
              for (size_t k = 0; k < j; ++k) {
                  if (contains(circle, points[k])) { continue; }
                  circle =
                      minimum_boundary_circle({points[i], points[j], points[k]});
              }
          }
      }
      return circle;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<Point> points(static_cast<size_t>(n));
      for (Point& point : points) { cin >> point.x >> point.y; }
      const Circle answer = minimum_enclosing_circle(points);
      cout << fixed << setprecision(12) << answer.radius << '\n'
           << answer.center.x << ' ' << answer.center.y << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1742
external_platform: 洛谷
external_problem_id: P1742
external_title: 最小圓覆蓋
external_relation: original
source_book_pages: [541]
source_pdf_pages: [171]
review_status: verified
---

題面、限制、格式與 URL 已依洛谷官方題面核實；敘述、證明與程式為本站獨立撰寫。
