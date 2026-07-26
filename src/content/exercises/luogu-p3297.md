---
id: luogu-p3297
volume: lower
source_file: lower-volume
title: 洛谷 P3297 逃考：Voronoi 相鄰圖
chapter: 8
section: '8.5'
kind: external-oj
difficulty: 5
topics: ['Voronoi 圖', '半平面交', '最短路']
prerequisites: ['垂直平分線', '半平面交', 'BFS']
statement: 在矩形 [0,x_1]×[0,y_1] 內有 n 位親戚。矩形內每個位置由距離最近的親戚監控；若最近距離並列，會同時被那些親戚監控。小楊從給定內點出發，可沿任意實數座標路徑走到矩形邊界。求整條路徑上曾監控到他的不同親戚人數最小值；起點保證只有一位最近親戚。
constraints:
  - 測資組數 't <= 3'
  - 'n <= 600'
  - 親戚位置互異且不在矩形邊界
  - 起點只有唯一最近親戚
input_format: 第一行為測資數 t。每組先給 n，再給 x_1、y_1、x_0、y_0，接著 n 行為親戚座標。
output_format: 每組輸出一個正整數，表示逃到邊界至少會被多少位不同親戚發現。
samples:
  - input: |
      2
      4
      10 10 5 5
      5 6
      3 5
      7 5
      5 3
      17
      14 12 7 6
      7 11
      6 9
      7 7
      1 10
      2 20
      1 6
      2 6
      1 1
      2 2
      5 1
      5 2
      13 1
      12 2
      12 7
      13 7
      12 11
      13 11
    output: |
      1
      2
    explanation: 第一組起點所在監控區直接接觸矩形上邊，只會被 (5,6) 發現；第二組需從 (7,7) 的區域跨入 (7,11) 的區域後到達上邊，共兩人。
core_knowledge:
  - 每位親戚的最近點區域是矩形與 n-1 個垂直平分半平面的交
  - 兩個 Voronoi 區域共享邊時，可在只新增一位監控者的情況下跨越
  - 區域接觸矩形邊界等價於能從該區直接逃出
judgment: 對每位親戚，以半平面交求其矩形內 Voronoi cell；半平面交最後仍存在的邊界標籤就是相鄰親戚或矩形外界。建立無權圖後，從起點最近親戚 BFS 到虛擬外界，邊數就是經過的親戚區域數。
hints:
  - 點 p 歸親戚 i 的條件 |p-s_i|²<=|p-s_j|²；展開後二次項消去，得到一個包含 s_i 的線性半平面。
  - 為每條半平面保留來源標籤。求完 i 的 cell 後，仍在雙端佇列中的親戚 j 邊界表示 i、j 的區域共享一段邊。
  - 把矩形四邊標成虛擬終點 n；找出起點唯一最近親戚，BFS 到 n 的距離即為答案。
solution_outline: 對每個 i 收集四個矩形內側半平面，以及對每個 j≠i 的「到 i 不遠於到 j」半平面，依方向排序做半平面交。將結果邊界標籤與 i 連邊；矩形邊統一連到虛擬外界。以平方距離找起始 cell，BFS 求至外界的最少跨區次數。
proof_or_invariant: 展開平方距離後，每個半平面恰描述不比某 j 遠的位置，全部相交與矩形的交正是 i 的 Voronoi cell。半平面交留下的每條有效邊界都在 cell 邊界上：親戚標籤 j 表示穿越該邊後 j 成為最近者，矩形標籤則可直接到外界。因此任意逃生路徑依序穿越的 cell 給出圖上一條起點到外界的路；反之，圖上每條相鄰邊可在共享邊內部穿越，串成實際路徑。BFS 最短邊數故等於最少遇到的親戚 cell 數。
complexity:
  time: O(n² log n)
  space: O(n²)
common_errors:
  - 垂直平分線不等式方向寫反，得到「離 i 更遠」的區域
  - 半平面交只求頂點而丟掉來源標籤，無法建立相鄰圖
  - 只看兩親戚中垂線是否穿過矩形，未檢查是否真的成為 Voronoi 邊
  - BFS 輸出再加一，實際上從起始 cell 到外界的第一條邊已代表一位親戚
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };
  struct Line { Point point; Point direction; long double angle; int label; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：逐點求帶標籤 Voronoi cell，建相鄰圖後 BFS 到矩形外界。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };
  struct Line {
      Point point;
      Point direction;
      long double angle;
      int label;
  };

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
      return cross(line.direction, point - line.point) >= -1e-11L;
  }
  static Point intersection(const Line& first, const Line& second) {
      const long double ratio =
          cross(second.point - first.point, second.direction) /
          cross(first.direction, second.direction);
      return first.point + first.direction * ratio;
  }
  static Line make_line(const Point& point, const Point& direction,
                        int label) {
      long double angle = atan2l(direction.y, direction.x);
      if (angle < 0.0L) { angle += 2.0L * acosl(-1.0L); }
      return {point, direction, angle, label};
  }
  static Line inequality_line(long double coefficient_x,
                              long double coefficient_y,
                              long double constant, int label) {
      Point point{};
      if (fabsl(coefficient_x) > fabsl(coefficient_y)) {
          point = {-constant / coefficient_x, 0.0L};
      } else {
          point = {0.0L, -constant / coefficient_y};
      }
      return make_line(
          point, {coefficient_y, -coefficient_x}, label);
  }

  static deque<Line> half_plane_intersection(vector<Line> lines) {
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
      deque<Line> result;
      for (const Line& line : filtered) {
          while (result.size() >= 2U &&
                 !on_left(line,
                          intersection(result[result.size() - 2U],
                                       result.back()))) {
              result.pop_back();
          }
          while (result.size() >= 2U &&
                 !on_left(line, intersection(result[0], result[1]))) {
              result.pop_front();
          }
          result.push_back(line);
      }
      while (result.size() >= 3U &&
             !on_left(result.front(),
                      intersection(result[result.size() - 2U],
                                   result.back()))) {
          result.pop_back();
      }
      while (result.size() >= 3U &&
             !on_left(result.back(), intersection(result[0], result[1]))) {
          result.pop_front();
      }
      if (result.size() < 3U) { return {}; }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int test_count;
      cin >> test_count;
      while (test_count-- > 0) {
          int n;
          cin >> n;
          long double width;
          long double height;
          Point start{};
          cin >> width >> height >> start.x >> start.y;
          vector<Point> sites(static_cast<size_t>(n));
          for (Point& site : sites) { cin >> site.x >> site.y; }
          vector<vector<int>> graph(static_cast<size_t>(n + 1));
          for (int i = 0; i < n; ++i) {
              vector<Line> lines;
              lines.reserve(static_cast<size_t>(n + 3));
              lines.push_back(
                  make_line({0.0L, 0.0L}, {width, 0.0L}, n));
              lines.push_back(
                  make_line({width, 0.0L}, {0.0L, height}, n));
              lines.push_back(
                  make_line({width, height}, {-width, 0.0L}, n));
              lines.push_back(
                  make_line({0.0L, height}, {0.0L, -height}, n));
              const Point& current = sites[static_cast<size_t>(i)];
              for (int j = 0; j < n; ++j) {
                  if (i == j) { continue; }
                  const Point& other = sites[static_cast<size_t>(j)];
                  const long double dx = other.x - current.x;
                  const long double dy = other.y - current.y;
                  const long double coefficient_x = -2.0L * dx;
                  const long double coefficient_y = -2.0L * dy;
                  const long double constant =
                      other.x * other.x + other.y * other.y -
                      current.x * current.x - current.y * current.y;
                  lines.push_back(inequality_line(
                      coefficient_x, coefficient_y, constant, j));
              }
              const deque<Line> cell =
                  half_plane_intersection(move(lines));
              for (const Line& boundary : cell) {
                  graph[static_cast<size_t>(i)].push_back(boundary.label);
                  graph[static_cast<size_t>(boundary.label)].push_back(i);
              }
          }

          int source = 0;
          long double best_distance =
              numeric_limits<long double>::infinity();
          for (int i = 0; i < n; ++i) {
              const Point difference =
                  sites[static_cast<size_t>(i)] - start;
              const long double distance =
                  difference.x * difference.x +
                  difference.y * difference.y;
              if (distance < best_distance) {
                  best_distance = distance;
                  source = i;
              }
          }
          vector<int> distance(static_cast<size_t>(n + 1), -1);
          queue<int> pending;
          distance[static_cast<size_t>(source)] = 0;
          pending.push(source);
          while (!pending.empty()) {
              const int current = pending.front();
              pending.pop();
              for (int next : graph[static_cast<size_t>(current)]) {
                  if (distance[static_cast<size_t>(next)] != -1) {
                      continue;
                  }
                  distance[static_cast<size_t>(next)] =
                      distance[static_cast<size_t>(current)] + 1;
                  pending.push(next);
              }
          }
          cout << distance[static_cast<size_t>(n)] << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3297
external_platform: 洛谷
external_problem_id: P3297
external_title: '[SDOI2013] 逃考'
external_relation: original
source_book_pages: [551]
source_pdf_pages: [181]
review_status: verified
---

題面、限制、官方 URL 與範例已依洛谷題面核實；繁中敘述、證明與程式為本站獨立撰寫。
