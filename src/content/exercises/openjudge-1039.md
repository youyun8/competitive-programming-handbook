---
id: openjudge-1039
volume: lower
source_file: lower-volume
title: OpenJudge 1039 Pipe：光線穿越彎管
chapter: 8
section: '8.1'
kind: external-oj
difficulty: 4
topics: ['直線相交', '可行直線枚舉', '計算幾何']
prerequisites: ['直線方程', '浮點誤差']
statement: 一條不反光、不透光的彎管由 x 嚴格遞增的上邊界點 (x_i,y_i) 描述，下邊界為 (x_i,y_i-1)。光從第一個上下端點之間的整段射入並沿直線前進。求光能到達的最大 x；若能通過整條管道則輸出指定訊息。
constraints:
  - '2 <= n <= 20'
  - x_i、y_i 為實數且 x_1 < x_2 < ... < x_n
  - 下邊界在對應上邊界正下方 1 單位
  - n=0 結束
input_format: 多組資料；每組先給彎折點數 n，再給 n 行上邊界座標 x_i、y_i。單獨一行 0 結束。
output_format: 若光可穿過整條管道，輸出 `Through all the pipe.`；否則輸出最大可達 x，保留兩位小數。
samples:
  - input: |
      4
      0 1
      2 2
      4 1
      6 4
      6
      0 1
      2 -0.6
      5 -4.45
      7 -5.57
      12 -10.8
      17 -16.55
      0
    output: |
      4.67
      Through all the pipe.
    explanation: 官方第一組的最佳光線在 x=4 與 x=6 之間撞到管壁，交點 x 約為 4.67；第二組存在一條在每個垂直截面都介於上下邊界間的直線。
core_knowledge:
  - 可行光線的極值會接觸至少兩個邊界約束
  - 逐截面判斷直線是否仍在管內
  - 光線與折線管壁交點
judgment: n 僅 20。把上下邊界的 2n 個折點視為限制；最佳直線可移動到至少通過兩個限制點，因此枚舉任兩個不同 x 的邊界點，再 O(n) 找首次越界即可。
hints:
  - 一條光線寫成 y=kx+b；它在每個 x_i 都必須滿足 y_i-1 <= kx_i+b <= y_i，才可到達該截面。
  - 可行直線集合在 (k,b) 平面是凸多邊形；最遠到達位置的極端候選會落在頂點，也就是同時貼住兩個邊界折點。
  - 候選首次在第 i 個截面越過上界或下界時，求它與第 i-1 到 i 段對應管壁的交點 x，並更新最大值。
solution_outline: 建立每個上、下邊界折點，枚舉不同 x 的兩點決定光線。由左至右檢查各截面；全部合法即穿透，否則依首次越界方向和上一段上壁或下壁求交，取最大 x。
proof_or_invariant: 對固定可到達範圍，光線參數 (k,b) 須滿足有限個線性不等式，形成凸可行域。若最佳光線未貼住兩個獨立邊界約束，可在參數空間小幅移動而延後首次碰壁，與最優矛盾；故枚舉兩折點涵蓋一個最優候選。逐截面檢查利用管壁在相鄰折點間線性，端點皆在內即整段在內；首次端點越界時與該段管壁的交點正是退出位置。
complexity:
  time: 每組 O(n³)
  space: O(n)
common_errors:
  - 只枚舉兩個上邊界點，漏掉上下壁混合的支撐線
  - 未檢查光線在第一個源線段內
  - 首次越界後直接回報 x_i，沒有求與前一段管壁交點
  - 穿透訊息的大小寫或句點不符
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：枚舉兩個邊界折點決定光線，找首次越界與管壁交點。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };

  static long double intersection_x(long double ray_slope, long double ray_intercept,
                                    const Point& a, const Point& b) {
      const long double wall_slope = (b.y - a.y) / (b.x - a.x);
      const long double wall_intercept = a.y - wall_slope * a.x;
      return (wall_intercept - ray_intercept) / (ray_slope - wall_slope);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      constexpr long double eps = 1e-10L;
      int n;
      cout << fixed << setprecision(2);
      while (cin >> n && n != 0) {
          vector<Point> upper(static_cast<size_t>(n));
          vector<Point> boundary;
          boundary.reserve(static_cast<size_t>(2 * n));
          for (Point& point : upper) { cin >> point.x >> point.y; }
          for (const Point& point : upper) {
              boundary.push_back(point);
              boundary.push_back({point.x, point.y - 1.0L});
          }
          bool through = false;
          long double farthest = upper[0].x;
          for (size_t first = 0; first < boundary.size() && !through; ++first) {
              for (size_t second = first + 1; second < boundary.size(); ++second) {
                  if (fabsl(boundary[first].x - boundary[second].x) <= eps) { continue; }
                  const long double slope =
                      (boundary[second].y - boundary[first].y) /
                      (boundary[second].x - boundary[first].x);
                  const long double intercept =
                      boundary[first].y - slope * boundary[first].x;
                  int failed = -1;
                  bool above = false;
                  for (int i = 0; i < n; ++i) {
                      const long double ray_y =
                          slope * upper[static_cast<size_t>(i)].x + intercept;
                      if (ray_y > upper[static_cast<size_t>(i)].y + eps) {
                          failed = i;
                          above = true;
                          break;
                      }
                      if (ray_y < upper[static_cast<size_t>(i)].y - 1.0L - eps) {
                          failed = i;
                          break;
                      }
                  }
                  if (failed == -1) {
                      through = true;
                      break;
                  }
                  if (failed == 0) { continue; }
                  Point wall_a = upper[static_cast<size_t>(failed - 1)];
                  Point wall_b = upper[static_cast<size_t>(failed)];
                  if (!above) {
                      wall_a.y -= 1.0L;
                      wall_b.y -= 1.0L;
                  }
                  farthest = max(farthest,
                                 intersection_x(slope, intercept, wall_a, wall_b));
              }
          }
          if (through) {
              cout << "Through all the pipe.\n";
          } else {
              cout << farthest << '\n';
          }
      }
  }
external_url: http://bailian.openjudge.cn/practice/1039/
external_platform: OpenJudge 百練
external_problem_id: '1039'
external_title: Pipe
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面資訊依外部 OJ 頁面核實；敘述、證明與程式為本站獨立撰寫。
