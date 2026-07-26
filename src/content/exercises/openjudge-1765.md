---
id: openjudge-1765
volume: lower
source_file: lower-volume
title: OpenJudge 1765 November Rain：屋頂落水量
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['掃描線', '線段垂直次序', 'DAG 流量傳遞']
prerequisites: ['線性插值', '事件掃描', '拓撲序']
statement: 屋頂的垂直剖面由 n 條互不接觸、非水平斜線段組成。雨以每秒每公尺水平寬度 1 公升垂直落下；上方線段會遮住下方線段。落到某線段的水全部沿線段流到較低端，再垂直落向地面或下一條線段；若水流恰落在線段端點，也視為被該線段接住。求每條線段低端每秒流下的水量。
constraints:
  - '1 <= n <= 40000'
  - '0 <= x_1,y_1,x_2,y_2 <= 1000000'
  - 'x_1 < x_2 且 y_1 != y_2'
  - 任兩線段沒有共同點，且沒有水平線段
  - 任一地面 x 座標上方至多有 25 條線段
input_format: 第一行為線段數 n；接著 n 行各給 x_1、y_1、x_2、y_2，其中第一端在左、第二端在右。
output_format: 依輸入順序輸出 n 行；第 i 行為第 i 條線段低端在一秒內流下的水量（公升）。
samples:
  - input: |
      6
      13 7 15 6
      3 8 7 7
      1 7 5 6
      5 5 9 3
      6 3 8 2
      9 6 12 8
    output: |
      2
      4
      2
      11
      0
      3
    explanation: 各開放 x 區間的最上層屋板直接承接該區間寬度的雨；其水再從低端流到下方屋板。例如第 4 條除了直接承雨，也接收上方線段流下的水，最後低端總流量為 11。
core_knowledge:
  - 線段互不相交，因此相鄰 x 事件間的垂直次序固定
  - 直接降雨只落在每個開放 x 區間的最上層線段
  - 每條線段低端的垂直水流至多連向一條正下方線段，形成依高度下降的 DAG
judgment: 同時跨越任意 x 的線段至多 25 條，可在每個端點事件以線性掃描活動集合找最上層與低端正下方線段。直接雨量是事件間水平寬度；完成落水邊後，再按低端高度遞減傳遞累積流量。
hints:
  - 只在線段端點的 x 座標處，活動線段集合才會改變；兩相鄰事件間任取中點比較高度即可找直接接雨者。
  - 在某低端 x 計算下一塊板時，要先加入同 x 開始的線段、且尚未刪除同 x 結束的線段，才能符合「落在端點也接住」。
  - 若 A 的水落到 B，B 的低端一定嚴格低於 A 的低端；依低端 y 由高到低把 A 的總水量加給 B 即可。
solution_outline: 將每條線段的左右端建立事件並按 x 分組。維護最多 25 條的活動集合：先把上一事件至本事件的寬度加給中點最高線段；加入本 x 起始線段；對低端位於本 x 的線段，在含左右端點的活動集合中找其正下方最高線段作為去向；再移除本 x 結束線段。掃描後依各線段低端 y 遞減，將直接雨量與已收到水量之和傳給去向。
proof_or_invariant: 在相鄰事件 x 之間沒有端點，且線段不相交，所以活動集合及其垂直次序固定；中點最高者正是整個開放區間唯一直接承雨者，加入區間寬度精確計入所有直接雨。事件 x 處先加左端、後刪右端，使所有覆蓋閉區間 x_1≤x≤x_2 的線段都參與低端正下方查找，恰符合端點也接水。水從 A 低端落至 B 後會沿 B 到更低端，故落水邊嚴格降低低端高度而無環；由高至低傳遞時，處理 A 前所有上游水皆已到達，歸納可得每條輸出為全部來源流量。
complexity:
  time: O(n log n + nK)，K<=25 為同一 x 上方線段數
  space: O(n)
common_errors:
  - 只算線段可見水平長度，沒有把上方屋板流下的水繼續傳遞
  - 在找低端下方線段前先刪除右端事件，漏掉恰落在端點的情況
  - 用端點高度比較整個事件區間，忽略斜率而選錯最上層線段
  - 按輸入順序傳水，而非依嚴格下降的低端高度
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Segment {
      long long x1;
      long long y1;
      long long x2;
      long long y2;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：按端點 x 掃描直接雨量與落水邊，再由高至低傳遞流量。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Segment {
      long long x1;
      long long y1;
      long long x2;
      long long y2;
  };
  struct EventGroup {
      vector<int> starting;
      vector<int> ending;
      vector<int> lower_ending;
  };

  static long double height_at(const Segment& segment, long double x) {
      const long double ratio =
          (x - static_cast<long double>(segment.x1)) /
          static_cast<long double>(segment.x2 - segment.x1);
      return static_cast<long double>(segment.y1) +
             ratio * static_cast<long double>(segment.y2 - segment.y1);
  }

  static int highest_at(const set<int>& active,
                        const vector<Segment>& segments, long double x) {
      int best = -1;
      long double best_height = -numeric_limits<long double>::infinity();
      for (int id : active) {
          const long double current =
              height_at(segments[static_cast<size_t>(id)], x);
          if (current > best_height) {
              best_height = current;
              best = id;
          }
      }
      return best;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<Segment> segments(static_cast<size_t>(n));
      map<long long, EventGroup> events;
      vector<long long> lower_y(static_cast<size_t>(n));
      for (int i = 0; i < n; ++i) {
          Segment& segment = segments[static_cast<size_t>(i)];
          cin >> segment.x1 >> segment.y1 >> segment.x2 >> segment.y2;
          events[segment.x1].starting.push_back(i);
          events[segment.x2].ending.push_back(i);
          const long long lower_x =
              segment.y1 < segment.y2 ? segment.x1 : segment.x2;
          lower_y[static_cast<size_t>(i)] = min(segment.y1, segment.y2);
          events[lower_x].lower_ending.push_back(i);
      }

      set<int> active;
      vector<long long> direct_water(static_cast<size_t>(n), 0);
      vector<int> destination(static_cast<size_t>(n), -1);
      bool has_previous = false;
      long long previous_x = 0;
      for (const auto& [x, group] : events) {
          if (has_previous && x > previous_x && !active.empty()) {
              const long double middle =
                  (static_cast<long double>(previous_x) +
                   static_cast<long double>(x)) *
                  0.5L;
              const int top = highest_at(active, segments, middle);
              direct_water[static_cast<size_t>(top)] += x - previous_x;
          }
          for (int id : group.starting) { active.insert(id); }
          for (int id : group.lower_ending) {
              const long double source_height =
                  static_cast<long double>(lower_y[static_cast<size_t>(id)]);
              int below = -1;
              long double below_height =
                  -numeric_limits<long double>::infinity();
              for (int candidate : active) {
                  if (candidate == id) { continue; }
                  const long double current =
                      height_at(segments[static_cast<size_t>(candidate)],
                                static_cast<long double>(x));
                  if (current < source_height && current > below_height) {
                      below_height = current;
                      below = candidate;
                  }
              }
              destination[static_cast<size_t>(id)] = below;
          }
          for (int id : group.ending) { active.erase(id); }
          previous_x = x;
          has_previous = true;
      }

      vector<int> order(static_cast<size_t>(n));
      iota(order.begin(), order.end(), 0);
      sort(order.begin(), order.end(), [&lower_y](int first, int second) {
          return lower_y[static_cast<size_t>(first)] >
                 lower_y[static_cast<size_t>(second)];
      });
      vector<long long> total = direct_water;
      for (int id : order) {
          const int below = destination[static_cast<size_t>(id)];
          if (below != -1) {
              total[static_cast<size_t>(below)] +=
                  total[static_cast<size_t>(id)];
          }
      }
      for (long long water : total) { cout << water << '\n'; }
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/1765/
external_platform: OpenJudge 百練
external_problem_id: '1765'
external_title: November Rain
external_relation: original
source_book_pages: [554]
source_pdf_pages: [184]
review_status: verified
---

題面、限制、端點接水規則、官方 URL 與範例已依 OpenJudge 百練頁面核實；繁中敘述、證明與程式為本站獨立撰寫。
