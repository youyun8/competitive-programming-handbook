---
id: openjudge-3799
volume: lower
source_file: lower-volume
title: OpenJudge 3799 Rotating Scoreboard：全域可視位置
chapter: 8
section: '8.5'
kind: external-oj
difficulty: 4
topics: ['多邊形核', '半平面交', '凸多邊形裁切']
prerequisites: ['叉積', '半平面', '多邊形']
statement: 一座會場的平面範圍是簡單多邊形，觀眾坐在整條邊界上。判斷能否在會場內放置一個點狀旋轉看板，使邊界上每一點到看板的視線都不穿過牆；與邊界相切仍視為看得見。
constraints:
  - 第一個整數 T 為測試組數
  - '3 <= n <= 100'
  - 頂點為整數並依多邊形邊界順序給出
  - 每組 n 與全部座標位於同一輸入資料序列，可用一般空白讀取
input_format: 第一行為 T；每組先給 n，接著依序給 n 對頂點座標。
output_format: 每組若存在合法看板位置輸出 YES，否則輸出 NO。
samples:
  - input: |
      2
      4 0 0 0 1 1 1 1 0
      8 0 0 0 2 1 2 1 1 2 1 2 2 3 2 3 0
    output: |
      YES
      NO
    explanation: 官方範例中矩形內任一點都能看見整條邊界；第二個凹多邊形的各邊內側半平面沒有共同點。
core_knowledge:
  - 全域可視點就是簡單多邊形的核
  - 邊界方向正規化
  - 閉半平面交
judgment: 合法位置集合是每條牆內側閉半平面的交。n 僅 100，可先把頂點轉為逆時針，再從包圍矩形逐邊作凸多邊形裁切。
hints:
  - 看板能看見整個邊界，等價於它位於多邊形的核；核可寫成所有邊內側閉半平面的交。
  - 先用鞋帶和判斷頂點方向；若為順時針就反轉，使每條有向邊的可行側統一為左側。
  - 從包含原圖的矩形開始逐半平面裁切；題目允許視線相切，所以邊界上的點必須保留。
solution_outline: 以有向面積正規化為逆時針頂點；建立比座標包圍盒稍大的凸矩形，對每條多邊形邊保留左側閉半平面。裁切結果非空輸出 YES。
proof_or_invariant: 對簡單多邊形的一條邊，能從某點看見該邊內側鄰域而不越牆，該點必須位於邊的內側閉半平面；同時滿足所有邊條件的點恰能看見整個多邊形，這就是多邊形核。裁切過程在第 k 步後精確保存前 k 個閉半平面的交，因此最終非空恰等價於合法看板位置存在。
complexity:
  time: O(n²)
  space: O(n)
common_errors:
  - 未處理順時針輸入而取錯半平面
  - 因題目允許相切卻使用嚴格左側
  - 只測試多邊形頂點是否能作為看板，漏掉核內其他點
  - 候選區域已空仍對空向量取模
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：正規化頂點方向，求所有邊內側閉半平面的交。
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

  static vector<Point> clip(const vector<Point>& polygon, const Point& a, const Point& b) {
      constexpr long double eps = 1e-12L;
      vector<Point> result;
      const Point direction = b - a;
      for (size_t i = 0; i < polygon.size(); ++i) {
          const Point start = polygon[i];
          const Point finish = polygon[(i + 1) % polygon.size()];
          const long double side_start = cross(direction, start - a);
          const long double side_finish = cross(direction, finish - a);
          const bool start_inside = side_start >= -eps;
          const bool finish_inside = side_finish >= -eps;
          if (start_inside != finish_inside) {
              result.push_back(start + (finish - start) *
                  (side_start / (side_start - side_finish)));
          }
          if (finish_inside) { result.push_back(finish); }
      }
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
          vector<Point> polygon(static_cast<size_t>(n));
          long double minimum_x = numeric_limits<long double>::infinity();
          long double maximum_x = -minimum_x;
          long double minimum_y = minimum_x;
          long double maximum_y = -minimum_x;
          for (Point& point : polygon) {
              cin >> point.x >> point.y;
              minimum_x = min(minimum_x, point.x);
              maximum_x = max(maximum_x, point.x);
              minimum_y = min(minimum_y, point.y);
              maximum_y = max(maximum_y, point.y);
          }
          long double area_twice = 0.0L;
          for (int i = 0; i < n; ++i) {
              area_twice += cross(polygon[static_cast<size_t>(i)],
                                  polygon[static_cast<size_t>((i + 1) % n)]);
          }
          if (area_twice < 0.0L) { reverse(polygon.begin(), polygon.end()); }
          const long double margin =
              max(maximum_x - minimum_x, maximum_y - minimum_y) + 1.0L;
          vector<Point> kernel = {
              {minimum_x - margin, minimum_y - margin},
              {maximum_x + margin, minimum_y - margin},
              {maximum_x + margin, maximum_y + margin},
              {minimum_x - margin, maximum_y + margin}
          };
          for (int i = 0; i < n && !kernel.empty(); ++i) {
              kernel = clip(kernel, polygon[static_cast<size_t>(i)],
                            polygon[static_cast<size_t>((i + 1) % n)]);
          }
          cout << (kernel.empty() ? "NO\n" : "YES\n");
      }
  }
external_url: http://bailian.openjudge.cn/practice/3799/
external_platform: OpenJudge 百練
external_problem_id: '3799'
external_title: Rotating Scoreboard
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面資訊依外部 OJ 頁面核實；敘述、證明與程式為本站獨立撰寫。
