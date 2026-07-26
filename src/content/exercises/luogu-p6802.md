---
id: luogu-p6802
volume: lower
source_file: lower-volume
title: 洛谷 P6802 Roads：不相交線段連通構造
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['掃描線', '平面圖', '構造']
prerequisites: ['叉積方向', '掃描線順序']
statement: 平面上有 2N 個城市，已有 N 條兩兩完全不相交的直線段道路，每座城市恰為其中一條道路的端點。請再連接 N-1 對城市，使所有城市連通，且任兩條新舊道路除共同端點外都不得相交。
constraints:
  - '2 <= N <= 100000'
  - '每個座標絕對值不超過 10^7'
  - 已有道路兩兩沒有任何交點，端點也不重合
input_format: 第一行 N；接著 N 行 x1 y1 x2 y2，表示一條既有道路的兩端點。
output_format: 輸出 N-1 行，每行為一條新道路兩端城市的 x1 y1 x2 y2；任一合法方案皆可。
samples:
  - input: |
      5
      1 3 3 6
      5 1 5 3
      3 3 6 5
      2 1 4 1
      2 3 4 2
    output: |
      2 1 1 3
      2 3 2 1
      3 3 2 3
      5 1 4 2
    explanation: 四條新增道路依序把新出現的既有線段接到掃描線下方相鄰連通塊的右側可見端點，最終五條原道路成為一個連通網路。
core_knowledge:
  - 不相交線段在掃描過程中的上下順序不會交換
  - 每條線段第一次出現時，可安全連到其正下方線段所維護的可見端點
  - 線段離開時，須把其最右端點轉交給下方鄰居
judgment: 將每條線段端點按 (x,y) 定向並排序事件，以叉積比較不相交線段的固定上下關係。活動集合另加入最低哨兵。第一條線段用來初始化哨兵的可見點；此後每次左端點插入，連到下方鄰居的 rightmost，並更新兩者；右端點刪除前把該端點交給下方鄰居。
hints:
  - 因原線段不相交，兩線段的相對上下關係可由其中一條有向線與另一條兩端的叉積符號決定。
  - 為每條活動線段保存目前掃描到的、可從其上方區域連到的最右城市；插入新線段時只接正下方鄰居。
  - 新增邊位於新線段左端點與下方可見點之間的空面內；刪除時轉交右端點可維持此可見性不變量。
solution_outline: 正規化每條既有線段，使 a 為字典序較小端點。建立 2N 個端點事件依座標排序；set 用方向測試維護活動線段上下順序。以水平最低哨兵提供初始下界，第一條線段只初始化。之後每次插入輸出「新線段 a—下鄰居 rightmost」，再更新 rightmost；刪除則令下鄰居接收該線段 b。共恰輸出 N-1 條。
proof_or_invariant: 掃描線處理完每個事件後，對每個活動線段 s，rightmost[s] 位於 s 與其上方相鄰線段之間同一個已掃區域邊界，能在該空面內連到下一個插入點。新線段 a 插入該面時，連線全在此空面閉包內，故不穿越既有或先前新增道路，並把新線段所屬連通塊接到下鄰居連通塊。線段離開時，其右端點成為合併後空面的最右可見點，維持不變量。每次除首條外的插入合併一個新連通塊，N-1 次後全連通且無非法交叉。
complexity:
  time: O(N log N)
  space: O(N)
common_errors:
  - 用當前 x 的浮點交點高度排序，造成垂直線段或精度問題
  - 刪除線段時未把右端點轉交給下方鄰居
  - 對第一條線段也輸出道路，產生 N 條而非 N-1 條
  - 叉積使用 32-bit 整數溢位
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long long x; long long y; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：按端點掃描，以活動線段下鄰居構造 N-1 條道路。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  #include <boost/multiprecision/cpp_int.hpp>
  using namespace std;
  using boost::multiprecision::int128_t;

  struct Point { long long x; long long y; };
  struct Segment { Point first; Point second; };

  static vector<Segment> segments;

  static int turn(const Point& a, const Point& b, const Point& c) {
      const int128_t cross =
          int128_t(b.x - a.x) * (c.y - a.y) -
          int128_t(b.y - a.y) * (c.x - a.x);
      return cross < 0 ? -1 : (cross > 0 ? 1 : 0);
  }

  struct SegmentOrder {
      bool operator()(int first, int second) const {
          if (first == second) { return false; }
          const Segment& a = segments[static_cast<size_t>(first)];
          const Segment& b = segments[static_cast<size_t>(second)];
          const int a_to_b1 = turn(a.first, a.second, b.first);
          const int a_to_b2 = turn(a.first, a.second, b.second);
          const int b_to_a1 = turn(b.first, b.second, a.first);
          const int b_to_a2 = turn(b.first, b.second, a.second);
          if ((a_to_b1 > 0 && a_to_b2 > 0) ||
              (b_to_a1 < 0 && b_to_a2 < 0)) {
              return true;
          }
          if (a_to_b1 == 0 && a_to_b2 == 0 &&
              b_to_a1 == 0 && b_to_a2 == 0) {
              if (a.first.y != b.first.y) {
                  return a.first.y < b.first.y;
              }
              return first < second;
          }
          return false;
      }
  };

  struct Event { int segment; bool entering; Point point; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      segments.resize(static_cast<size_t>(n + 1));
      for (int i = 0; i < n; ++i) {
          Point a;
          Point b;
          cin >> a.x >> a.y >> b.x >> b.y;
          if (tie(b.x, b.y) < tie(a.x, a.y)) { swap(a, b); }
          segments[static_cast<size_t>(i)] = {a, b};
      }
      vector<Event> events;
      events.reserve(static_cast<size_t>(2 * n));
      for (int i = 0; i < n; ++i) {
          const Segment& segment = segments[static_cast<size_t>(i)];
          events.push_back({i, true, segment.first});
          events.push_back({i, false, segment.second});
      }
      sort(events.begin(), events.end(),
           [](const Event& a, const Event& b) {
               return tie(a.point.x, a.point.y) <
                      tie(b.point.x, b.point.y);
           });

      constexpr long long boundary = 10000001LL;
      segments[static_cast<size_t>(n)] =
          {{-boundary, -boundary}, {boundary, -boundary}};
      set<int, SegmentOrder> active;
      active.insert(n);
      vector<Point> rightmost(static_cast<size_t>(n + 1));

      const int first_id = events.front().segment;
      active.insert(first_id);
      Point initial =
          segments[static_cast<size_t>(first_id)].first.x !=
                  segments[static_cast<size_t>(first_id)].second.x
              ? segments[static_cast<size_t>(first_id)].first
              : segments[static_cast<size_t>(first_id)].second;
      rightmost[static_cast<size_t>(n)] = initial;
      rightmost[static_cast<size_t>(first_id)] = initial;

      for (size_t i = 1; i < events.size(); ++i) {
          const Event& event = events[i];
          const int id = event.segment;
          if (event.entering) {
              const auto iterator = active.insert(id).first;
              const auto below = prev(iterator);
              const Point from = segments[static_cast<size_t>(id)].first;
              const Point to = rightmost[static_cast<size_t>(*below)];
              cout << from.x << ' ' << from.y << ' '
                   << to.x << ' ' << to.y << '\n';
              rightmost[static_cast<size_t>(id)] =
                  segments[static_cast<size_t>(id)].first.x !=
                          segments[static_cast<size_t>(id)].second.x
                      ? segments[static_cast<size_t>(id)].first
                      : segments[static_cast<size_t>(id)].second;
              rightmost[static_cast<size_t>(*below)] = from;
          } else {
              const auto iterator = active.find(id);
              const auto below = prev(iterator);
              rightmost[static_cast<size_t>(*below)] =
                  segments[static_cast<size_t>(id)].second;
              active.erase(iterator);
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P6802
external_platform: 洛谷
external_problem_id: P6802
external_title: '[CEOI 2020] Roads'
external_relation: original
source_book_pages: [558]
source_pdf_pages: [188]
review_status: verified
---

題面、限制與範例已依 CEOI 2020 官方封存、OJ.uz 及洛谷交叉核實；構造法另與 OJ.uz 公開滿分提交交叉驗證，本站證明與程式為獨立改寫。
