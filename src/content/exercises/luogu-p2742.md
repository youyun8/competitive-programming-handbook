---
id: luogu-p2742
volume: lower
source_file: lower-volume
title: 洛谷 P2742 圈奶牛：二維凸包周長
chapter: 8
section: '8.0'
kind: external-oj
difficulty: 2
topics: ['凸包', 'Andrew 單調鏈', '周長']
prerequisites: ['排序', '叉積', '歐幾里得距離']
statement: 給定平面上若干放牧點，求能包圍所有點的最短封閉圍欄長度，也就是這些點的凸包周長。
constraints:
  - '1 <= n <= 100000'
  - '-1000000 <= x_i, y_i <= 1000000'
  - 座標為實數且小數點後至多兩位
input_format: 第一行為點數 n；接著 n 行各有一個點的實數座標 x、y。
output_format: 輸出最短圍欄長度，四捨五入保留小數點後兩位。
samples:
  - input: |
      4
      0 0
      0 1
      1 1
      1 0
    output: |
      4.00
    explanation: 本站自製基本範例。四點恰為單位正方形四個頂點，凸包周長是 4。
core_knowledge:
  - 凸包是包含點集的最小凸集合
  - Andrew 單調鏈
  - 共線點與退化凸包
judgment: n 可達十萬，應先排序後以單調鏈在線性階段建凸包；最短包圍曲線必為凸包邊界，最後只需累加相鄰凸包點距離。
hints:
  - 若圍欄邊界有凹入，把凹入段改成兩端直線不會變長且仍包住所有點，所以答案邊界是凸的。
  - 依 x 再 y 排序；建立下殼與上殼時，只要最後三點不是嚴格左轉，就移除中間點。
  - 合併上下殼時不要重複兩端點；一點的周長為 0，兩點的退化封閉邊界須把線段來回計算。
solution_outline: 排序並去除重複座標，以 Andrew 單調鏈建立不含共線中間點的逆時針凸包，再循環累加每個凸包點到下一點的距離。
proof_or_invariant: 單調鏈堆疊在每次加入點後維持 x 單調且相鄰三點嚴格左轉，因此分別構成所有已處理點的下凸邊界與上凸邊界；合併後得到完整凸包。任何包住點集的封閉曲線也包住凸包，凸化不增加周長，因此凸包邊界周長就是最短圍欄。
complexity:
  time: O(n log n)
  space: O(n)
common_errors:
  - 把整數範例誤認為題目只接受整數座標
  - 上下殼合併時重複端點
  - 所有點共線時只算一次最遠端點距離
  - 先四捨五入每條邊再相加
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<Point> points(static_cast<size_t>(n));
      for (Point& point : points) { cin >> point.x >> point.y; }
      // TODO：用 Andrew 單調鏈建立凸包，再累加循環周長。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point {
      long double x;
      long double y;
  };

  static long double cross(const Point& a, const Point& b, const Point& c) {
      return (b.x - a.x) * (c.y - a.y) -
             (b.y - a.y) * (c.x - a.x);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<Point> points(static_cast<size_t>(n));
      for (Point& point : points) { cin >> point.x >> point.y; }
      sort(points.begin(), points.end(), [](const Point& a, const Point& b) {
          return a.x != b.x ? a.x < b.x : a.y < b.y;
      });
      points.erase(unique(points.begin(), points.end(), [](const Point& a, const Point& b) {
                       return a.x == b.x && a.y == b.y;
                   }),
                   points.end());
      if (points.size() == 1) {
          cout << "0.00\n";
          return 0;
      }
      vector<Point> hull;
      for (const Point& point : points) {
          while (hull.size() >= 2 &&
                 cross(hull[hull.size() - 2], hull.back(), point) <= 0.0L) {
              hull.pop_back();
          }
          hull.push_back(point);
      }
      const size_t lower_size = hull.size();
      for (size_t i = points.size() - 1; i-- > 0;) {
          const Point& point = points[i];
          while (hull.size() > lower_size &&
                 cross(hull[hull.size() - 2], hull.back(), point) <= 0.0L) {
              hull.pop_back();
          }
          hull.push_back(point);
      }
      hull.pop_back();
      long double perimeter = 0.0L;
      for (size_t i = 0; i < hull.size(); ++i) {
          const Point& a = hull[i];
          const Point& b = hull[(i + 1) % hull.size()];
          perimeter += hypotl(a.x - b.x, a.y - b.y);
      }
      cout << fixed << setprecision(2) << perimeter << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2742
external_platform: 洛谷
external_problem_id: P2742
external_title: 【模板】二維凸包 / [USACO5.1] 圈奶牛 Fencing the Cows
external_relation: original
source_book_pages: [522]
source_pdf_pages: [152]
review_status: verified
---

題面、限制與格式已依官方題目頁核實；解說與程式為本站獨立撰寫。
