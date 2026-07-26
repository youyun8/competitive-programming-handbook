---
id: openjudge-1066
volume: lower
source_file: lower-volume
title: OpenJudge 1066 Treasure Hunt：最少破牆數
chapter: 8
section: '8.7'
kind: external-oj
difficulty: 3
topics: ['線段相交', '平面分割', '方向枚舉']
prerequisites: ['叉積', '線段嚴格相交']
statement: 一個 100×100 的方形區域內有若干連接兩條外牆的直線內牆，牆彼此至多兩條交於同一點。寶藏不在牆上。考古隊由區域外進入，每跨越一面牆就需炸一扇門；求到達寶藏最少需炸幾扇門，外圍牆也算一面。
constraints:
  - '0 <= n <= 30'
  - 內牆端點為整數
  - 每面內牆從一條外圍牆延伸到另一條外圍牆
  - 不超過兩面牆交於同一點，且任兩輸入牆不重合
  - 寶藏座標為浮點數且保證不在牆上
input_format: 僅一組資料。第一行為內牆數 n，接著 n 行各有牆的兩端點 x1、y1、x2、y2，最後一行為寶藏座標。
output_format: 以 `Number of doors = k` 格式輸出最少門數。
samples:
  - input: |
      7
      20 0 37 100
      40 0 76 100
      85 0 0 75
      100 90 0 90
      0 71 100 61
      0 14 100 38
      100 47 47 100
      54.5 55.4
    output: |
      Number of doors = 2
    explanation: 官方範例存在一條從寶藏所在房間通往外部的路徑，只需穿過一面內牆，再穿過外圍牆，共炸兩扇門。
core_knowledge:
  - 牆弦把矩形分成房間
  - 穿越牆數可由射線相交數計算
  - 相交數只在方向越過牆端點時改變
judgment: 內牆皆為跨越外框的弦。從寶藏向外選一個方向時，必經內牆數是該射線與牆的嚴格交點數；最小值可在朝向某個牆端點的臨界方向兩側取得，因此枚舉 2n 個端點即可。
hints:
  - 先忽略實際行走折線：從寶藏向外畫一條射線，每嚴格穿過一面內牆就必須多開一扇門，最後還要穿外牆。
  - 當射線方向連續轉動而未掃過任何牆端點時，與每面牆是否相交不變；所以只需檢查由寶藏指向各端點的臨界方向。
  - 用嚴格線段相交計數，讓指向端點的測試代表往端點某一側微擾的方向；所有候選最小交數再加 1 即外牆門。
solution_outline: 對每個內牆端點，以寶藏到該端點作測試線段，計算它與所有內牆的嚴格相交數並取最小；若沒有內牆最小值為 0。答案加一計入外圍牆。
proof_or_invariant: 以寶藏為中心按極角排列全部牆端點。任兩相鄰端點方向之間，射線與每條牆的相交狀態不變，故最小值出現在某個角區間；取該區間邊界方向並以嚴格相交排除端點接觸，可得到其中一側的相交數。枚舉所有端點因此涵蓋至少一個最優區間。每條被射線穿過的牆分隔相鄰房間，且跨牆一次足夠，最後另跨外牆，故計數加一即最少門數。
complexity:
  time: O(n²)
  space: O(n)
common_errors:
  - 忘記最終外圍牆也需要一扇門
  - 把端點接觸當成必穿牆，無法表示角度微擾
  - n=0 時輸出 0 而非 1
  - 用浮點斜率判相交，遇到垂直牆失效
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };
  struct Segment { Point a; Point b; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：枚舉寶藏到每個牆端點的方向，計算嚴格穿越的內牆數。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };
  struct Segment { Point a; Point b; };

  static long double cross(const Point& a, const Point& b, const Point& c) {
      return (b.x - a.x) * (c.y - a.y) -
             (b.y - a.y) * (c.x - a.x);
  }

  static bool strictly_intersects(const Point& a, const Point& b,
                                  const Segment& wall) {
      const long double first = cross(a, b, wall.a);
      const long double second = cross(a, b, wall.b);
      const long double third = cross(wall.a, wall.b, a);
      const long double fourth = cross(wall.a, wall.b, b);
      return first * second < 0.0L && third * fourth < 0.0L;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<Segment> walls(static_cast<size_t>(n));
      vector<Point> endpoints;
      endpoints.reserve(static_cast<size_t>(2 * n));
      for (Segment& wall : walls) {
          cin >> wall.a.x >> wall.a.y >> wall.b.x >> wall.b.y;
          endpoints.push_back(wall.a);
          endpoints.push_back(wall.b);
      }
      Point treasure{};
      cin >> treasure.x >> treasure.y;
      int minimum_crossings = 0;
      if (!endpoints.empty()) {
          minimum_crossings = n;
          for (const Point& endpoint : endpoints) {
              int crossings = 0;
              for (const Segment& wall : walls) {
                  if (strictly_intersects(treasure, endpoint, wall)) {
                      ++crossings;
                  }
              }
              minimum_crossings = min(minimum_crossings, crossings);
          }
      }
      cout << "Number of doors = " << minimum_crossings + 1 << '\n';
  }
external_url: http://bailian.openjudge.cn/practice/1066/
external_platform: OpenJudge 百練
external_problem_id: '1066'
external_title: Treasure Hunt
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面資訊依外部 OJ 頁面核實；敘述、證明與程式為本站獨立撰寫。
