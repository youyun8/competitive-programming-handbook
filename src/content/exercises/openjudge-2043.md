---
id: openjudge-2043
volume: lower
source_file: lower-volume
title: OpenJudge 2043 Area of Polygons：相交單位方格數
chapter: 8
section: '8.7'
kind: external-oj
difficulty: 4
topics: ['掃描線', '多邊形填充', '格點幾何']
prerequisites: ['奇偶規則', '線性插值', '區間合併']
statement: 給定頂點皆為整數格點的簡單多邊形。若一個格線單位正方形與多邊形的交集具有正面積，就算與多邊形相交；只碰到邊或頂點不算。求相交單位方格總數。
constraints:
  - 每個多邊形 '3 <= m <= 100'
  - 最多 100 個多邊形
  - '-2000 <= x, y <= 2000'
  - 邊只在相鄰頂點相交，且沒有三條邊共用同一頂點
  - m=0 結束
input_format: 多組資料。每組先給頂點數 m，再給 m 行整數頂點座標；單獨一行 0 結束。
output_format: 每個多邊形輸出一行整數，表示與其有正面積交集的單位方格數。
samples:
  - input: |
      4
      5 -3
      1 0
      1 7
      -7 -1
      3
      5 5
      18 5
      5 10
      3
      -5 -5
      -5 -10
      -18 -10
      5
      0 0
      20 2
      11 1
      21 2
      2 0
      0
    output: |
      55
      41
      41
      23
    explanation: 官方四組範例逐一計算每個水平單位帶中，多邊形內部投影所碰到的開單位方格並去除重複，總數分別為 55、41、41、23。
core_knowledge:
  - 整數頂點使每個開水平單位帶內沒有頂點
  - 奇偶規則將水平截線交點兩兩配對
  - 線性邊界在一個帶內的投影端點只需看上下界
judgment: 座標 y 範圍至多 4000，逐水平單位帶掃描可行。每個開帶內沒有頂點，穿越邊的左右順序固定；把交點邊兩兩配成內部區間，再轉成單位格 x 區間並合併即可精確計數。
hints:
  - 對每個整數 row 考慮開帶 row<y<row+1；因所有頂點 y 為整數，帶內不會發生邊起訖或交叉次序改變。
  - 收集跨越整個開帶的非水平邊，以 y=row+0.5 的交點 x 排序，依奇偶規則把第 0、1 條，第 2、3 條配成多邊形內部。
  - 每對左右線性邊在帶內掃過的 x 聯集為一個區間；取左邊兩端較小 x、右邊兩端較大 x，轉成 [floor(left),ceil(right)) 的格子索引後合併。
solution_outline: 對 bounding box 的每個水平單位帶，找出 y 範圍涵蓋該帶的邊，計算上下邊界與中點交 x。按中點排序後兩兩配對，產生相交方格的整數 x 半開區間；排序合併並把長度加入答案。
proof_or_invariant: 開帶內沒有多邊形頂點，簡單邊也不相交，因此所有活躍邊的左右次序固定，任一水平截線依奇偶規則的配對一致。每對邊之間的內部區間隨 y 連續變化，其聯集是從左邊界最小 x 到右邊界最大 x 的區間；開單位格與此聯集重疊當且僅當格索引落在 [floor(left),ceil(right))。合併同列區間消除不同內部成分可能碰到同一方格的重複，逐列相加恰計每格一次。
complexity:
  time: O(H·m log m)，H <= 4000、m <= 100
  space: O(m)
common_errors:
  - 把只碰多邊形邊界的方格也計入
  - 水平邊重複加入掃描交點，破壞奇偶配對
  - 每個內部區間直接相加而未合併同列重疊格索引
  - 對接近整數的浮點交點直接 ceil 而多算一格
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：逐水平單位帶配對活躍邊，合併其相交方格 x 區間。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };

  struct Crossing {
      long double middle_x;
      long double lower_x;
      long double upper_x;
  };

  static long double x_at_y(const Point& a, const Point& b, long double y) {
      return a.x + (b.x - a.x) * ((y - a.y) / (b.y - a.y));
  }

  static long long stable_floor(long double value) {
      return static_cast<long long>(floorl(value + 1e-12L));
  }

  static long long stable_ceil(long double value) {
      return static_cast<long long>(ceill(value - 1e-12L));
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int vertex_count;
      while (cin >> vertex_count && vertex_count != 0) {
          vector<Point> polygon(static_cast<size_t>(vertex_count));
          int minimum_y = numeric_limits<int>::max();
          int maximum_y = numeric_limits<int>::min();
          for (Point& point : polygon) {
              int x;
              int y;
              cin >> x >> y;
              point = {static_cast<long double>(x), static_cast<long double>(y)};
              minimum_y = min(minimum_y, y);
              maximum_y = max(maximum_y, y);
          }
          long long answer = 0;
          for (int row = minimum_y; row < maximum_y; ++row) {
              vector<Crossing> crossings;
              for (int i = 0; i < vertex_count; ++i) {
                  const Point& a = polygon[static_cast<size_t>(i)];
                  const Point& b =
                      polygon[static_cast<size_t>((i + 1) % vertex_count)];
                  const long double low_y = min(a.y, b.y);
                  const long double high_y = max(a.y, b.y);
                  if (low_y <= static_cast<long double>(row) &&
                      high_y >= static_cast<long double>(row + 1) &&
                      low_y < high_y) {
                      crossings.push_back(
                          {x_at_y(a, b, static_cast<long double>(row) + 0.5L),
                           x_at_y(a, b, static_cast<long double>(row)),
                           x_at_y(a, b, static_cast<long double>(row + 1))});
                  }
              }
              sort(crossings.begin(), crossings.end(),
                   [](const Crossing& a, const Crossing& b) {
                       return a.middle_x < b.middle_x;
                   });
              vector<pair<long long, long long>> intervals;
              for (size_t i = 0; i + 1 < crossings.size(); i += 2) {
                  const long double left =
                      min(crossings[i].lower_x, crossings[i].upper_x);
                  const long double right =
                      max(crossings[i + 1].lower_x,
                          crossings[i + 1].upper_x);
                  const long long begin = stable_floor(left);
                  const long long end = stable_ceil(right);
                  if (begin < end) { intervals.emplace_back(begin, end); }
              }
              sort(intervals.begin(), intervals.end());
              long long current_begin = 0;
              long long current_end = 0;
              bool has_interval = false;
              for (const auto& [begin, end] : intervals) {
                  if (!has_interval || begin > current_end) {
                      if (has_interval) { answer += current_end - current_begin; }
                      current_begin = begin;
                      current_end = end;
                      has_interval = true;
                  } else {
                      current_end = max(current_end, end);
                  }
              }
              if (has_interval) { answer += current_end - current_begin; }
          }
          cout << answer << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/2043/
external_platform: OpenJudge 百練
external_problem_id: '2043'
external_title: Area of Polygons
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面資訊依外部 OJ 頁面核實；敘述、證明與程式為本站獨立撰寫。
