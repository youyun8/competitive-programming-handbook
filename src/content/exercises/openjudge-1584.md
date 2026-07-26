---
id: openjudge-1584
volume: lower
source_file: lower-volume
title: OpenJudge 1584 A Round Peg in a Ground Hole：圓釘與凸孔
chapter: 8
section: '8.2'
kind: external-oj
difficulty: 3
topics:
  - 凸多邊形
  - 點到直線距離
  - 叉積
prerequisites:
  - 叉積
  - 點線距離
statement: 木板上的孔由依序給出的簡單多邊形表示。先判斷孔是否有凹入；若孔為凸多邊形，再判斷指定圓心與半徑的圓釘能否完整放入孔內，允許相切。
constraints:
  - 每組 n >= 3；n < 3 結束
  - 圓釘半徑與座標為實數
  - 頂點依邊界順序給出
  - 輸入多邊形為簡單多邊形
input_format: 每組首行為 n、圓釘半徑、圓心 x、y，接著 n 行頂點；小於 3 的 n 結束。
output_format: 依序輸出 HOLE IS ILL-FORMED、PEG WILL FIT 或 PEG WILL NOT FIT。
samples:
  - input: |
      5 1.5 1.5 2.0
      1.0 1.0
      2.0 2.0
      1.75 2.0
      1.0 3.0
      0.0 2.0
      5 1.5 1.5 2.0
      1.0 1.0
      2.0 2.0
      1.75 2.5
      1.0 3.0
      0.0 2.0
      1
    output: |
      HOLE IS ILL-FORMED
      PEG WILL NOT FIT
    explanation: 第一個五邊形轉向符號不一致而有凹入；第二個孔雖凸，但圓心到某條支撐線不足半徑 1.5。
core_knowledge:
  - 凸性判定
  - 有向邊內側
  - 圓包含於凸多邊形的充要條件
judgment: 先用相鄰三點叉積檢查所有非零轉向同號；對凸孔，圓在孔內等價於圓心到每條內側支撐線的有向距離至少為半徑。
hints:
  - 沿邊界走一圈，凸多邊形的每個非共線轉向必須同方向。
  - 確定邊界方向後，圓心必須位於每條有向邊的同一內側；叉積除以邊長就是有向距離。
  - 把條件寫成 sign*cross(edge, center-a) + eps >= radius*|edge|，可避免先除法並正確接受相切。
solution_outline: 以 long double 計算所有連續三點叉積判斷凸性及方向；若凸，逐邊比較圓心的內側叉積與半徑乘邊長。
proof_or_invariant: 簡單多邊形為凸集當且僅當邊界所有非零轉向同號。凸多邊形又等於各邊內側閉半平面的交；半徑 r 的圓完全位於某閉半平面，當且僅當圓心到其邊界線的內側距離至少 r。逐邊條件同時成立即與所有半平面的交也成立。
complexity:
  time: 每組 O(n)
  space: O(n)
common_errors:
  - 把共線頂點直接判為凹
  - 未支援順時針頂點
  - 只檢查圓心是否在孔內
  - 用點到線段距離取代凸半平面條件
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依提示實作核心演算法。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };
  static Point operator-(const Point& a, const Point& b) { return {a.x - b.x, a.y - b.y}; }
  static long double cross(const Point& a, const Point& b) { return a.x * b.y - a.y * b.x; }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      constexpr long double eps = 1e-10L;
      int n;
      long double radius;
      Point center{};
      while (cin >> n && n >= 3) {
          cin >> radius >> center.x >> center.y;
          vector<Point> polygon(static_cast<size_t>(n));
          for (Point& p : polygon) { cin >> p.x >> p.y; }
          int direction = 0;
          bool convex = true;
          for (int i = 0; i < n; ++i) {
              const long double turn =
                  cross(polygon[static_cast<size_t>((i + 1) % n)] - polygon[static_cast<size_t>(i)],
                        polygon[static_cast<size_t>((i + 2) % n)] -
                            polygon[static_cast<size_t>((i + 1) % n)]);
              if (fabsl(turn) <= eps) { continue; }
              const int current = turn > 0.0L ? 1 : -1;
              if (direction != 0 && current != direction) { convex = false; }
              direction = current;
          }
          if (!convex || direction == 0) {
              cout << "HOLE IS ILL-FORMED\n";
              continue;
          }
          bool fits = true;
          for (int i = 0; i < n; ++i) {
              const Point edge =
                  polygon[static_cast<size_t>((i + 1) % n)] - polygon[static_cast<size_t>(i)];
              const long double inside =
                  static_cast<long double>(direction) *
                  cross(edge, center - polygon[static_cast<size_t>(i)]);
              const long double needed = radius * hypotl(edge.x, edge.y);
              if (inside + eps < needed) { fits = false; }
          }
          cout << (fits ? "PEG WILL FIT\n" : "PEG WILL NOT FIT\n");
      }
  }
external_url: http://bailian.openjudge.cn/practice/1584/
external_platform: OpenJudge 百練
external_problem_id: '1584'
external_title: A Round Peg in a Ground Hole
external_relation: original
source_book_pages:
  - 548
source_pdf_pages:
  - 178
review_status: verified
---

題面資訊以外部 OJ 頁面逐項核實；解說為本站獨立撰寫。
