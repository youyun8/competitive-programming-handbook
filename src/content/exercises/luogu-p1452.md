---
id: luogu-p1452
volume: lower
source_file: lower-volume
title: 洛谷 P1452 Beauty Contest：凸包直徑
chapter: 8
section: '8.1'
kind: external-oj
difficulty: 3
topics: ['旋轉卡尺', '凸包', '對踵點對', '最遠點對']
prerequisites: ['convex-hull', 'rotating-calipers']
statement: >-
  平面上給定 n 個整數座標的點，求距離最遠的兩點之間的距離平方。本卡片的題意為本站依題目主題重新敘述；
  完整原文敘述、資料範圍與輸出格式請以外部題目頁面為準。
constraints:
  - 點數規模需要 O(n log n) 的作法，兩兩枚舉會超時
  - 座標為整數，全程可用整數運算避免精度問題
  - 完整限制條件請參閱外部題目頁面
input_format: 第一行一個整數 n；接下來 n 行每行兩個整數，表示一個點的座標。
output_format: 一行一個整數，最遠兩點距離的平方。
samples:
  - input: |
      4
      0 0
      0 1
      1 1
      1 0
    output: |
      2
    explanation: >-
      本站自製測資（本次工作環境無法連線原 OJ 取得官方範例）。四點構成單位正方形，最遠的兩點是對角，
      距離平方為 1² + 1² = 2。
hints:
  - 最遠的兩個點一定都在凸包上。若某點在凸包內部或邊上，把它換成該邊的端點距離不會變短，所以先把問題縮到凸包頂點。
  - 不要對每條邊重新搜尋最遠點。凸包的凸性讓「離邊最遠的頂點」隨著邊逆時針轉動而單調前進，兩個指標各繞一圈就夠了，這就是旋轉卡尺。
  - 「離直線 ab 最遠」等價於「三角形 abp 面積最大」，也就是叉積 cross(a, b, p) 最大。分母 |ab| 對固定的邊是常數，所以比大小完全不必開根號，保持整數即可。
  - 指標的起始位置不能設在索引 i：cross(a, b, a) 與 cross(a, b, b) 都是 0，嚴格遞增的爬升會當場卡死、算出高度 0。先用一次 O(n) 掃描定出起點。
  - 別忘了退化情形：所有點重合（凸包只剩一點）與全部共線（凸包退化成兩點）都要特判。
solution_outline: >-
  先用 Andrew 單調鏈建出逆時針凸包，並在彈出條件用 `<= 0` 順手去掉共線多餘點（保留共線點會讓後面的單峰性出現長平台）。
  接著用單一對踵點指標繞凸包一圈：對每條邊 (hull[i], hull[i+1])，把指標往前推到 cross 不再嚴格變大，
  再用該指標與邊的兩個端點更新答案的平方距離最大值。指標起始位置先用一次線性掃描求出，避免從 cross 為 0 的平台起步。
proof_or_invariant: >-
  固定邊時，k ↦ cross(a, b, hull[k]) 在環上是循環單峰的（凸多邊形對一個仿射函數沿邊界走先升後降）；
  固定點時，該值隨邊旋轉連續變化。兩者相配使最佳 k 隨 i 單調不減，指標只需前進，總移動量 O(n)。
  仿射函數在凸多邊形上出現平手的唯一情形是有一整條邊垂直於該方向，而那條邊本身就落在最大值上，
  因此用嚴格大於爬升時停下的位置一定已取到最大值。
complexity:
  time: O(n log n)，排序建凸包主導；卡尺本身 O(n)
  space: O(n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point {
      long long x;
      long long y;
  };

  static long long cross(const Point& o, const Point& a, const Point& b) {
      return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  }

  static long long squared_distance(const Point& a, const Point& b) {
      const long long dx = a.x - b.x;
      const long long dy = a.y - b.y;
      return dx * dx + dy * dy;
  }

  // 已備好：Andrew 單調鏈，回傳逆時針凸包，`<= 0` 順手去掉共線多餘點。
  static vector<Point> convex_hull(vector<Point> points) {
      sort(points.begin(), points.end(),
           [](const Point& a, const Point& b) { return a.x != b.x ? a.x < b.x : a.y < b.y; });
      points.erase(unique(points.begin(), points.end(),
                          [](const Point& a, const Point& b) { return a.x == b.x && a.y == b.y; }),
                   points.end());
      const size_t n = points.size();
      if (n < 3) { return points; }
      vector<Point> hull(2 * n);
      size_t k = 0;
      for (size_t i = 0; i < n; ++i) {
          while (k >= 2 && cross(hull[k - 2], hull[k - 1], points[i]) <= 0) { --k; }
          hull[k++] = points[i];
      }
      const size_t lower = k + 1;
      for (size_t i = n - 1; i-- > 0;) {
          while (k >= lower && cross(hull[k - 2], hull[k - 1], points[i]) <= 0) { --k; }
          hull[k++] = points[i];
      }
      hull.resize(k - 1);
      return hull;
  }

  int main() {
      int n;
      if (!(cin >> n)) { return 0; }
      vector<Point> points(static_cast<size_t>(n));
      for (Point& p : points) { cin >> p.x >> p.y; }

      const vector<Point> hull = convex_hull(points);
      const size_t m = hull.size();
      if (m < 2) { cout << 0 << '\n'; return 0; }
      if (m == 2) { cout << squared_distance(hull[0], hull[1]) << '\n'; return 0; }

      // TODO 1：用一次 O(n) 掃描把 opposite 定到「離邊 (hull[0], hull[1]) 最遠」的頂點。
      //         不要留在索引 0：cross(a, b, a) 與 cross(a, b, b) 都是 0，
      //         嚴格遞增的爬升會當場卡死。
      size_t opposite = 0;

      // TODO 2：對每條邊，把 opposite 往前推到 cross 不再嚴格變大（記得取模繞回），
      //         再用邊的兩個端點各與 hull[opposite] 更新答案。
      //         目前只用了未推進的 opposite，所以答案還是錯的。
      long long best = 0;
      for (size_t i = 0; i < m; ++i) {
          const Point& a = hull[i];
          const Point& b = hull[(i + 1) % m];
          best = max(best, max(squared_distance(a, hull[opposite]),
                               squared_distance(b, hull[opposite])));
      }

      cout << best << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point {
      long long x;
      long long y;
  };

  static long long cross(const Point& o, const Point& a, const Point& b) {
      return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  }

  static long long squared_distance(const Point& a, const Point& b) {
      const long long dx = a.x - b.x;
      const long long dy = a.y - b.y;
      return dx * dx + dy * dy;
  }

  // Andrew 單調鏈：回傳逆時針凸包，`<= 0` 順手去掉共線多餘點。
  static vector<Point> convex_hull(vector<Point> points) {
      sort(points.begin(), points.end(),
           [](const Point& a, const Point& b) { return a.x != b.x ? a.x < b.x : a.y < b.y; });
      points.erase(unique(points.begin(), points.end(),
                          [](const Point& a, const Point& b) { return a.x == b.x && a.y == b.y; }),
                   points.end());
      const size_t n = points.size();
      if (n < 3) { return points; }
      vector<Point> hull(2 * n);
      size_t k = 0;
      for (size_t i = 0; i < n; ++i) {
          while (k >= 2 && cross(hull[k - 2], hull[k - 1], points[i]) <= 0) { --k; }
          hull[k++] = points[i];
      }
      const size_t lower = k + 1;
      for (size_t i = n - 1; i-- > 0;) {
          while (k >= lower && cross(hull[k - 2], hull[k - 1], points[i]) <= 0) { --k; }
          hull[k++] = points[i];
      }
      hull.resize(k - 1);
      return hull;
  }

  int main() {
      int n;
      if (!(cin >> n)) { return 0; }
      vector<Point> points(static_cast<size_t>(n));
      for (Point& p : points) { cin >> p.x >> p.y; }

      const vector<Point> hull = convex_hull(points);
      const size_t m = hull.size();
      if (m < 2) { cout << 0 << '\n'; return 0; }
      if (m == 2) { cout << squared_distance(hull[0], hull[1]) << '\n'; return 0; }

      // 先掃描定出對踵點起點，避免從 cross 為 0 的平台起步。
      size_t opposite = 0;
      for (size_t k = 1; k < m; ++k) {
          if (cross(hull[0], hull[1], hull[k]) > cross(hull[0], hull[1], hull[opposite])) {
              opposite = k;
          }
      }

      long long best = 0;
      for (size_t i = 0; i < m; ++i) {
          const Point& a = hull[i];
          const Point& b = hull[(i + 1) % m];
          while (cross(a, b, hull[(opposite + 1) % m]) > cross(a, b, hull[opposite])) {
              opposite = (opposite + 1) % m;
          }
          best = max(best,
                     max(squared_distance(a, hull[opposite]), squared_distance(b, hull[opposite])));
      }
      cout << best << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1452
external_platform: 洛谷
external_problem_id: P1452
external_title: Beauty Contest G
external_relation: original
source_book_pages: [510, 525]
source_pdf_pages: [140, 151]
review_status: verified
---

凸包直徑是旋轉卡尺最標準的入口題。先把點集縮到凸包，再讓一個對踵點指標繞行一圈，整體由建凸包的排序主導。
