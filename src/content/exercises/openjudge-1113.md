---
id: openjudge-1113
volume: lower
source_file: lower-volume
title: OpenJudge 1113 Wall：凸包外擴周長
chapter: 8
section: '8.3'
kind: external-oj
difficulty: 3
topics:
  - 凸包
  - Minkowski 和
  - 周長
prerequisites:
  - Andrew 單調鏈
  - 歐幾里得距離
statement: 給定城堡簡單多邊形的整數頂點，圍牆必須包住城堡且與城堡各處至少相距 L。求可行圍牆的最小長度，四捨五入為整數英尺。
constraints:
  - 3 <= N <= 1000
  - 1 <= L <= 1000
  - -10000 <= X_i,Y_i <= 10000
  - 頂點順時針且邊除端點外不相交
input_format: 第一行為 N、L，接著 N 行為城堡頂點座標。
output_format: 輸出最小圍牆長度四捨五入後的整數。
samples:
  - input: |
      9 100
      200 400
      300 400
      300 300
      400 300
      400 400
      500 400
      500 200
      350 200
      200 200
    output: |
      1628
    explanation: 城堡凸包周長加上半徑 100 的完整圓周後，四捨五入得到 1628。
core_knowledge:
  - 凸包周長
  - 圖形等距外擴
  - 圓弧總轉角
judgment: 凹陷不影響包圍圖形的最短凸邊界，先求凸包；外移距離 L 後直線段總長不變，各頂點圓弧的總角度恰為 2π。
hints:
  - 任何包住所有頂點的圍牆也必須包住它們的凸包，凹入的城堡邊不會出現在最短外邊界。
  - 把凸包每條邊平行外移 L，直線部分長度總和仍是凸包周長。
  - 相鄰外移邊以半徑 L 的圓弧銜接；所有外角總和是 2π，所以額外長度固定為 2πL。
solution_outline: Andrew 單調鏈去重並建立凸包，累加循環相鄰點距離，再加 2πL，使用 llround 輸出。
proof_or_invariant:
  所有可行圍牆的內部是包含城堡的集合，其凸化不增加周長，故最優解可取凸且必須包含城堡凸包。距凸包至少 L 的最小凸集合是凸包與半徑 L 圓盤的 Minkowski 和；其邊界由等長平移邊及總圓心角 2π
  的圓弧構成，周長即 hull_perimeter+2πL。
complexity:
  time: O(N log N)
  space: O(N)
common_errors:
  - 直接累加原凹多邊形周長
  - 只在每個頂點加固定四分之一圓
  - 保留重複點造成零長邊
  - 用截斷而非四捨五入
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

  struct Point {
      long long x;
      long long y;
      bool operator<(const Point& other) const { return tie(x, y) < tie(other.x, other.y); }
      bool operator==(const Point& other) const { return x == other.x && y == other.y; }
  };
  static long long cross(const Point& a, const Point& b, const Point& c) {
      return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      long long clearance;
      cin >> n >> clearance;
      vector<Point> points(static_cast<size_t>(n));
      for (Point& p : points) { cin >> p.x >> p.y; }
      sort(points.begin(), points.end());
      points.erase(unique(points.begin(), points.end()), points.end());
      vector<Point> hull;
      for (const Point& p : points) {
          while (hull.size() >= 2 && cross(hull[hull.size() - 2], hull.back(), p) <= 0) {
              hull.pop_back();
          }
          hull.push_back(p);
      }
      const size_t lower_size = hull.size();
      for (size_t i = points.size() - 1; i-- > 0;) {
          const Point& p = points[i];
          while (hull.size() > lower_size && cross(hull[hull.size() - 2], hull.back(), p) <= 0) {
              hull.pop_back();
          }
          hull.push_back(p);
      }
      hull.pop_back();
      long double perimeter = 0.0L;
      for (size_t i = 0; i < hull.size(); ++i) {
          const Point& a = hull[i];
          const Point& b = hull[(i + 1) % hull.size()];
          perimeter += hypotl(static_cast<long double>(a.x - b.x),
                              static_cast<long double>(a.y - b.y));
      }
      const long double pi = acosl(-1.0L);
      cout << llround(perimeter + 2.0L * pi * static_cast<long double>(clearance)) << '\n';
  }
external_url: http://bailian.openjudge.cn/practice/1113/
external_platform: OpenJudge 百練
external_problem_id: '1113'
external_title: Wall
external_relation: original
source_book_pages:
  - 548
source_pdf_pages:
  - 178
review_status: verified
---

題面資訊以外部 OJ 頁面逐項核實；解說為本站獨立撰寫。
