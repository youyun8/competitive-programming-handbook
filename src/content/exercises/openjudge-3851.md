---
id: openjudge-3851
volume: lower
source_file: lower-volume
title: OpenJudge 3851 Bridge Across Islands：兩凸多邊形最短距離
chapter: 8
section: '8.4'
kind: external-oj
difficulty: 4
topics: ['凸多邊形', 'Minkowski 差', '點到線段距離']
prerequisites: ['叉積', '凸多邊形方向', 'Minkowski 和']
statement: 兩座互相分離的島嶼邊界各為一個凸多邊形。求兩個多邊形邊界之間的最短歐幾里得距離，也就是可連接兩島的最短橋長。
constraints:
  - '3 <= N, M <= 10000'
  - '-10000 <= x, y <= 10000'
  - 輸入座標為實數
  - 0 0 結束
input_format: 多組資料。每組首行為 N、M，接著 N 行第一個凸多邊形頂點，再 M 行第二個凸多邊形頂點；0 0 結束。
output_format: 每組輸出最短距離；絕對誤差不超過 0.001。
samples:
  - input: |
      4 4
      0.00000 0.00000
      0.00000 1.00000
      1.00000 1.00000
      1.00000 0.00000
      2.00000 0.00000
      2.00000 1.00000
      3.00000 1.00000
      3.00000 0.00000
      0 0
    output: |
      1.00000
    explanation: 官方範例是兩個相距一單位的單位正方形，最近的兩條垂直邊之間距離為 1。
core_knowledge:
  - 兩集合距離等於 Minkowski 差到原點的距離
  - 凸多邊形邊向量極角合併
  - 原點到凸多邊形邊界的最短距離
judgment: N、M 可達一萬，不能枚舉所有邊對。把第二個多邊形取負後與第一個作 Minkowski 和，所得凸多邊形中的每點都是 p-q；答案就是原點到此差集的距離，可線性完成。
hints:
  - min |p-q| 可改寫為集合 P+(-Q) 中點到原點的最小距離。
  - 先把兩凸多邊形調成逆時針並旋轉到最低、再最左頂點；兩者邊向量都依極角排列，可像合併排序般建出 Minkowski 和。
  - 若原點在差集內答案為 0；否則逐邊投影並夾住參數到 [0,1]，取原點到線段的最短距離。
solution_outline: 正規化 P 與 -Q 的方向及起點，以邊向量叉積線性合併建立 Minkowski 差。判定原點是否位於差集；若不在，線性掃描所有差集邊求點到線段距離最小值。
proof_or_invariant: Minkowski 差 D=P+(-Q) 恰包含所有 p-q，因此 min_{p∈P,q∈Q}|p-q|=min_{d∈D}|d|。凸多邊形的邊方向循環有序，從最低點開始按極角合併兩組邊向量，前綴和依序產生 D 的完整邊界。若原點在 D 內集合距離為 0；否則凸集合上到原點的最小點位於邊界某線段，逐邊投影必找到它。
complexity:
  time: 每組 O(N+M)
  space: O(N+M)
common_errors:
  - 未把順時針輸入反轉成逆時針
  - 直接使用 P+Q 而非 P+(-Q)
  - 相同方向邊未同時前進，產生多餘退化邊
  - 求點到直線距離而未把投影限制在線段上
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：建立 P+(-Q) 的凸多邊形，再求原點到它的距離。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };
  static Point operator+(const Point& a, const Point& b) { return {a.x + b.x, a.y + b.y}; }
  static Point operator-(const Point& a, const Point& b) { return {a.x - b.x, a.y - b.y}; }
  static Point operator*(const Point& a, long double scale) { return {a.x * scale, a.y * scale}; }
  static long double cross(const Point& a, const Point& b) { return a.x * b.y - a.y * b.x; }
  static long double dot(const Point& a, const Point& b) { return a.x * b.x + a.y * b.y; }

  static void normalize(vector<Point>& polygon) {
      long double area_twice = 0.0L;
      for (size_t i = 0; i < polygon.size(); ++i) {
          area_twice += cross(polygon[i], polygon[(i + 1) % polygon.size()]);
      }
      if (area_twice < 0.0L) { reverse(polygon.begin(), polygon.end()); }
      const auto start = min_element(polygon.begin(), polygon.end(),
                                     [](const Point& a, const Point& b) {
                                         return a.y != b.y ? a.y < b.y : a.x < b.x;
                                     });
      rotate(polygon.begin(), start, polygon.end());
  }

  static vector<Point> minkowski_sum(vector<Point> first, vector<Point> second) {
      normalize(first);
      normalize(second);
      const size_t n = first.size();
      const size_t m = second.size();
      vector<Point> edges_first(n);
      vector<Point> edges_second(m);
      for (size_t i = 0; i < n; ++i) {
          edges_first[i] = first[(i + 1) % n] - first[i];
      }
      for (size_t i = 0; i < m; ++i) {
          edges_second[i] = second[(i + 1) % m] - second[i];
      }
      vector<Point> result;
      Point current = first[0] + second[0];
      result.push_back(current);
      size_t i = 0;
      size_t j = 0;
      while (i < n || j < m) {
          if (j == m) {
              current = current + edges_first[i++];
          } else if (i == n) {
              current = current + edges_second[j++];
          } else {
              const long double turn = cross(edges_first[i], edges_second[j]);
              if (turn > 0.0L) {
                  current = current + edges_first[i++];
              } else if (turn < 0.0L) {
                  current = current + edges_second[j++];
              } else {
                  current = current + edges_first[i++] + edges_second[j++];
              }
          }
          result.push_back(current);
      }
      result.pop_back();
      return result;
  }

  static long double distance_to_segment(const Point& a, const Point& b) {
      const Point edge = b - a;
      const long double denominator = dot(edge, edge);
      long double ratio = -dot(a, edge) / denominator;
      ratio = max(0.0L, min(1.0L, ratio));
      const Point closest = a + edge * ratio;
      return hypotl(closest.x, closest.y);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int m;
      cout << fixed << setprecision(5);
      while (cin >> n >> m && !(n == 0 && m == 0)) {
          vector<Point> first(static_cast<size_t>(n));
          vector<Point> second(static_cast<size_t>(m));
          for (Point& point : first) { cin >> point.x >> point.y; }
          for (Point& point : second) {
              cin >> point.x >> point.y;
              point.x = -point.x;
              point.y = -point.y;
          }
          const vector<Point> difference = minkowski_sum(first, second);
          bool contains_origin = true;
          long double answer = numeric_limits<long double>::infinity();
          for (size_t i = 0; i < difference.size(); ++i) {
              const Point& a = difference[i];
              const Point& b = difference[(i + 1) % difference.size()];
              if (cross(b - a, Point{-a.x, -a.y}) < -1e-12L) {
                  contains_origin = false;
              }
              answer = min(answer, distance_to_segment(a, b));
          }
          cout << (contains_origin ? 0.0L : answer) << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/3851/
external_platform: OpenJudge 百練
external_problem_id: '3851'
external_title: Bridge Across Islands
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面資訊依外部 OJ 頁面核實；敘述、證明與程式為本站獨立撰寫。
