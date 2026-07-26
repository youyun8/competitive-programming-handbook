---
id: spoj-subwaypl
volume: lower
source_file: lower-volume
title: SPOJ SUBWAYPL Subway planning：圓周區間刺點
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 4
topics: ['圓周區間', '貪心', '極角']
prerequisites: ['點到射線距離', '區間刺點']
statement: 所有地鐵線都從原點中央車站出發，沿某個方向直線延伸，且可在線上任意位置設站。給定 n 個重要地點與容許的最大步行距離 d，求至少需要幾條地鐵線，才能讓每個地點到中央車站或某條線上的車站距離不超過 d。
constraints:
  - 測資組數在第一行
  - '1 <= n <= 500'
  - '0 <= d < 150'
  - '-100 <= x,y <= 100'
  - 各地點座標互異且都不是 (0,0)
input_format: 第一行為測資組數。每組先給 n、d，接著 n 行各給重要地點座標 x、y。
output_format: 每組輸出一行，表示所需地鐵線的最小數量。
samples:
  - input: |
      2
      7 1
      -1 -4
      -3 1
      -3 -1
      2 3
      2 4
      2 -2
      6 -2
      4 0
      0 4
      -12 18
      0 27
      -34 51
    output: |
      4
      2
    explanation: 每個距原點超過 d 的地點，都允許地鐵線方向落在一段角區間內；第一組至少要選四個方向刺中全部區間，第二組只需兩個方向。
core_knowledge:
  - 距原點不超過 d 的地點已由中央車站服務
  - 其餘地點對可行射線方向形成中心在其極角、半寬 asin(d/r) 的圓周區間
  - 固定一個被選端點切開圓周後，剩餘普通區間可按右端點貪心刺點
judgment: 把每個未被中央站覆蓋的地點轉成方向圓上的短弧。圓周區間的最優刺點集合可移動到某個區間右端點；枚舉第一個端點，刪去包含它的弧，將其餘弧展開到後方一圈，再用普通區間右端點貪心。
hints:
  - 若地點到原點距離 r<=d，不建新線也可由中央站服務；否則方向與地點極角差至多 asin(d/r)。
  - 圓周沒有天然起點；枚舉某條弧的右端點作已選第一條線，即可從該角度切開圓周。
  - 未包含第一點的弧都能唯一展開到 (start,start+2pi)；按右端遞增，遇到左端在上一刺點之後才選新右端。
solution_outline: 建立每個必要地點的圓周弧中心角與半寬。若沒有弧，答案為 0。枚舉每條弧的右端點作第一個方向；標記所有包含它的弧，對其餘弧將中心提升到該方向後一圈，得到不跨界線性區間。排序右端並用經典刺點貪心，取所有枚舉結果最小值。
proof_or_invariant: 點到方向射線的最短距離在投影為正時是 r sin(delta)；因半寬小於 pi/2，可行方向恰為以地點極角為中心、半寬 asin(d/r) 的弧。任一最優刺點可順時針移到第一個將要離開的弧右端而不失去已刺中的弧，因此存在以某個右端點為首點的最優解。固定首點後，未覆蓋弧不跨切口；線性區間按最早右端選點是標準交換論證最優，枚舉取最小即得圓周最優解。
complexity:
  time: O(n² log n)
  space: O(n)
common_errors:
  - 把每條地鐵線當成通過原點的雙向直線，錯把相反方向合併
  - 沒先移除 r<=d 的地點，對 d/r 呼叫 asin 超出定義域
  - 直接把跨越 0 的角區間當普通區間排序
  - 圓周貪心只嘗試一個任意切點，可能切開最優解使用的弧
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Arc { long double center; long double half_width; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：把地點轉成方向圓弧，枚舉首個右端點後做線性區間貪心。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Arc { long double center; long double half_width; };
  struct Interval { long double left; long double right; };

  static long double normalize(long double angle, long double full_turn) {
      angle = fmodl(angle, full_turn);
      if (angle < 0.0L) { angle += full_turn; }
      return angle;
  }

  static long double circular_distance(long double first,
                                       long double second,
                                       long double full_turn) {
      long double difference =
          fabsl(normalize(first - second, full_turn));
      return min(difference, full_turn - difference);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int test_count;
      cin >> test_count;
      const long double pi = acosl(-1.0L);
      const long double full_turn = 2.0L * pi;
      while (test_count-- > 0) {
          int n;
          long double maximum_distance;
          cin >> n >> maximum_distance;
          vector<Arc> arcs;
          for (int i = 0; i < n; ++i) {
              long double x;
              long double y;
              cin >> x >> y;
              const long double radius = hypotl(x, y);
              if (radius <= maximum_distance) { continue; }
              arcs.push_back(
                  {normalize(atan2l(y, x), full_turn),
                   asinl(maximum_distance / radius)});
          }
          if (arcs.empty()) {
              cout << 0 << '\n';
              continue;
          }
          int answer = static_cast<int>(arcs.size());
          for (const Arc& first_arc : arcs) {
              const long double first_direction =
                  normalize(first_arc.center + first_arc.half_width,
                            full_turn);
              vector<Interval> intervals;
              for (const Arc& arc : arcs) {
                  if (circular_distance(
                          first_direction, arc.center, full_turn) <=
                      arc.half_width + 1e-18L) {
                      continue;
                  }
                  long double center = arc.center;
                  while (center <= first_direction) { center += full_turn; }
                  intervals.push_back(
                      {center - arc.half_width, center + arc.half_width});
              }
              sort(intervals.begin(), intervals.end(),
                   [](const Interval& a, const Interval& b) {
                       return a.right < b.right;
                   });
              int used = 1;
              long double last = first_direction;
              for (const Interval& interval : intervals) {
                  if (interval.left > last + 1e-18L) {
                      last = interval.right;
                      ++used;
                  }
              }
              answer = min(answer, used);
          }
          cout << answer << '\n';
      }
      return 0;
  }
external_url: https://www.spoj.com/problems/SUBWAYPL/
external_platform: SPOJ
external_problem_id: SUBWAYPL
external_title: Subway planning
external_relation: original
source_book_pages: [556]
source_pdf_pages: [186]
review_status: verified
---

官方 SPOJ URL 已確認；題面、限制與範例另與同題官方 POJ 3004 頁逐項交叉核實。繁中敘述、證明與程式為本站獨立撰寫。
