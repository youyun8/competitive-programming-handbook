---
id: openjudge-3463
volume: lower
source_file: lower-volume
title: OpenJudge 3463 How I Mathematician Wonder What You Are：星狀多邊形
chapter: 8
section: '8.5'
kind: external-oj
difficulty: 4
topics: ['多邊形核', '半平面交', '凸多邊形裁切']
prerequisites: ['叉積', '半平面', '多邊形']
statement: 給定一個逆時針、邊界不自交也不自觸的簡單多邊形。若存在多邊形內一點 C，使 C 到多邊形內任意點的線段都留在多邊形內，則稱它為星狀；判斷每個輸入多邊形是否為星狀。
constraints:
  - '4 <= n <= 50'
  - '0 <= x_i, y_i <= 10000'
  - 頂點依逆時針順序給出
  - 多邊形簡單，且任三條邊的延長線不會交於同一點
input_format: 多組資料；每組先給頂點數 n，再給 n 行整數座標。單獨一行 0 結束。
output_format: 每組若為星狀多邊形輸出 1，否則輸出 0。
samples:
  - input: |
      6
      66 13
      96 61
      76 98
      13 94
      4 0
      45 68
      8
      27 21
      55 14
      93 12
      56 95
      15 48
      38 46
      51 65
      64 31
      0
    output: |
      1
      0
    explanation: 官方範例的第一個多邊形具有至少一個能看見全域的核點；第二個多邊形所有邊內側半平面的交集為空。
core_knowledge:
  - 多邊形核等於所有邊內側半平面的交
  - Sutherland–Hodgman 凸多邊形裁切
  - 閉半平面與退化非空交集
judgment: n 僅 50，可從一個包住原圖的凸矩形開始，逐邊裁去右側；裁切後是否仍非空就是多邊形核是否存在。
hints:
  - 對逆時針邊界的每條有向邊，能看見整個相鄰內部的候選點必須在該邊的左側閉半平面。
  - 多邊形的核就是所有這些閉半平面的交；先用包圍盒建立凸候選區域，再逐條裁切。
  - 裁切一條邊時逐一看候選多邊形的邊：端點內外不同就加入與裁切直線的交點，終點在內再加入終點。
solution_outline: 由座標範圍建立凸包圍矩形，對原多邊形每條逆時針邊，以其左側閉半平面作 Sutherland–Hodgman 裁切；最後候選頂點非空即輸出 1。
proof_or_invariant: 處理前 k 條邊後，候選區域恰為初始包圍矩形與這 k 個內側閉半平面的交，且保持凸性；裁切演算法逐段保留半平面內部分並補上穿越邊界的交點，所以不變量成立。所有原圖皆在包圍矩形內，處理全部邊後候選區域正是多邊形核；核非空與星狀定義等價。
complexity:
  time: O(n²)，候選凸多邊形至多 O(n) 個頂點
  space: O(n)
common_errors:
  - 把可行側寫成逆時針邊的右側
  - 只檢查凹頂點，未真正求所有半平面交
  - 把落在邊界上的可行核點排除
  - 線段與裁切線平行時仍直接除以零
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：維護凸候選區域，依序用每條邊的左側閉半平面裁切。
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
              const long double denominator = side_start - side_finish;
              result.push_back(start + (finish - start) * (side_start / denominator));
          }
          if (finish_inside) { result.push_back(finish); }
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      while (cin >> n && n != 0) {
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
          const long double margin = max(maximum_x - minimum_x, maximum_y - minimum_y) + 1.0L;
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
          cout << (kernel.empty() ? 0 : 1) << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/3463/
external_platform: OpenJudge 百練
external_problem_id: '3463'
external_title: How I Mathematician Wonder What You Are!
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面資訊依外部 OJ 頁面核實；敘述、證明與程式為本站獨立撰寫。
