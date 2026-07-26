---
id: codeforces-704e
volume: lower
source_file: lower-volume
title: Codeforces 704E Iron Man：樹上移動首次相遇
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['重鏈剖分', '掃描線', '動態順序', '有理數']
prerequisites: ['樹上路徑分解', '線段交點', '平衡樹']
statement: 一棵無權樹上有 m 套裝甲。第 i 套在時間 t_i 於 v_i 出現，以每秒 c_i 條邊的速度沿唯一最短路徑連續移往 u_i，到達的該一刻仍存在，之後立即消失。若任意兩套在任意時刻位於完全相同的位置（頂點或邊內），就會爆炸。求最早爆炸時間；永不相遇輸出 -1。
constraints:
  - '1 <= n,m <= 100000'
  - '0 <= t_i <= 10000'
  - '1 <= c_i <= 10000'
  - 樹邊等長，通過頂點不耗時
input_format: 第一行 n、m；接著 n-1 行為樹邊；再接 m 行 t_i、c_i、v_i、u_i。
output_format: 無爆炸輸出 -1；否則輸出最早時間，絕對或相對誤差不超過 10^-6。
samples:
  - input: |
      6 4
      2 5
      6 5
      3 6
      4 6
      4 1
      27 6 1 3
      9 5 1 6
      27 4 3 4
      11 29 2 6
    output: |
      27.3
    explanation: 將每套裝甲的樹路徑按重鏈拆成若干等速時空線段；最早的兩線交點時間為 27.3。
core_knowledge:
  - 重鏈上的深度可當作一維位置，等速移動成為時間—位置平面中的線段
  - 在第一個交點以前，活動線段的垂直順序不變
  - 掃描插入或刪除線段時，只需檢查順序相鄰者
judgment: 用重鏈剖分把每條移動路徑依行進順序拆成 O(log n) 個一維片段，保留每段閉時間區間。每條重鏈各自依時間掃描，以當前位置排序活動片段；插入檢查新鄰居，刪除檢查刪除後的新鄰居。交點及端點時間使用整數分子分母比較。
hints:
  - 在同一重鏈上以 depth 作座標，片段可寫成 position=slope*time+intercept，其中 slope 為 0、c 或 -c。
  - 最早相交的兩條活動線段在相交前必曾相鄰；若始終隔著第三條，第三條會更早與其中一條相交。
  - 輕邊可歸入其子節點所在重鏈，並讓相鄰路徑片段共享邊界頂點；端點事件要先插入再刪除，才不會漏掉瞬間相遇。
solution_outline: 迭代建出 parent、depth、subtree size、heavy child 與 chain head。將每套裝甲路徑拆成按行進順序排列的 chain 片段，算出每段時間分子、斜率與整數截距。對每條 chain 建開始／結束事件並排序，利用以當前有理時間計算位置的 set 維護順序；每次局部鄰接改變時精確求兩段交點，更新全域最小時間。
proof_or_invariant: 每個樹位置被至少一個對應重鏈片段表示，且相鄰片段共享通過頂點的時刻，所以任何實際相遇都會成為某條鏈上的線段交點。掃描至全域首個交點前，活動線段不曾交換順序，因此動態 set 的順序正確。造成首交點的兩段在交點前必相鄰，否則夾在其間的線段必先碰到其中一段；插入、刪除正是相鄰關係唯一改變之處，故演算法一定檢查到最早交點。
complexity:
  time: O((n+m log n) log(m log n))
  space: O(n+m log n)
common_errors:
  - 只檢查頂點同時到達，漏掉邊內迎面或追及
  - 路徑分段漏掉 head 與 parent(head) 之間的輕邊
  - 同時刻先刪除再插入，漏掉一段到達時另一段剛出現的相遇
  - 用浮點數作 set 比較器導致近交點順序不穩定
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：重鏈剖分路徑，逐鏈掃描時空線段的第一個交點。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  #include <boost/multiprecision/cpp_int.hpp>
  using namespace std;
  using boost::multiprecision::int128_t;

  struct Fraction {
      long long numerator = 0;
      long long denominator = 1;
  };
  static bool less_fraction(const Fraction& a, const Fraction& b) {
      return int128_t(a.numerator) * b.denominator <
             int128_t(b.numerator) * a.denominator;
  }
  static bool equal_fraction(const Fraction& a, const Fraction& b) {
      return !less_fraction(a, b) && !less_fraction(b, a);
  }
  static Fraction maximum(Fraction a, const Fraction& b) {
      return less_fraction(a, b) ? b : a;
  }
  static Fraction minimum(Fraction a, const Fraction& b) {
      return less_fraction(b, a) ? b : a;
  }

  struct Segment {
      long long start_numerator;
      long long end_numerator;
      long long slope;
      long long intercept;
      int denominator;
      int suit;
      int chain;
  };
  static Fraction start_time(const Segment& segment) {
      return {segment.start_numerator, segment.denominator};
  }
  static Fraction end_time(const Segment& segment) {
      return {segment.end_numerator, segment.denominator};
  }

  struct ActiveCompare {
      const vector<Segment>* segments;
      const Fraction* current_time;
      bool operator()(int first, int second) const {
          if (first == second) { return false; }
          const Segment& a = (*segments)[static_cast<size_t>(first)];
          const Segment& b = (*segments)[static_cast<size_t>(second)];
          const int128_t value_a =
              int128_t(a.slope) * current_time->numerator +
              int128_t(a.intercept) * current_time->denominator;
          const int128_t value_b =
              int128_t(b.slope) * current_time->numerator +
              int128_t(b.intercept) * current_time->denominator;
          if (value_a != value_b) { return value_a < value_b; }
          return first < second;
      }
  };

  struct Chunk { int chain; int from_depth; int to_depth; };
  struct Event { int segment; bool starting; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int suit_count;
      cin >> n >> suit_count;
      vector<vector<int>> graph(static_cast<size_t>(n + 1));
      for (int i = 1; i < n; ++i) {
          int a;
          int b;
          cin >> a >> b;
          graph[static_cast<size_t>(a)].push_back(b);
          graph[static_cast<size_t>(b)].push_back(a);
      }

      vector<int> parent(static_cast<size_t>(n + 1), 0);
      vector<int> depth(static_cast<size_t>(n + 1), 0);
      vector<int> order{1};
      order.reserve(static_cast<size_t>(n));
      for (size_t i = 0; i < order.size(); ++i) {
          const int node = order[i];
          for (int next : graph[static_cast<size_t>(node)]) {
              if (next == parent[static_cast<size_t>(node)]) { continue; }
              parent[static_cast<size_t>(next)] = node;
              depth[static_cast<size_t>(next)] =
                  depth[static_cast<size_t>(node)] + 1;
              order.push_back(next);
          }
      }
      vector<int> subtree(static_cast<size_t>(n + 1), 1);
      vector<int> heavy(static_cast<size_t>(n + 1), 0);
      for (auto iterator = order.rbegin(); iterator != order.rend();
           ++iterator) {
          const int node = *iterator;
          int largest = 0;
          for (int next : graph[static_cast<size_t>(node)]) {
              if (parent[static_cast<size_t>(next)] != node) { continue; }
              subtree[static_cast<size_t>(node)] +=
                  subtree[static_cast<size_t>(next)];
              if (subtree[static_cast<size_t>(next)] > largest) {
                  largest = subtree[static_cast<size_t>(next)];
                  heavy[static_cast<size_t>(node)] = next;
              }
          }
      }
      vector<int> head(static_cast<size_t>(n + 1), 0);
      for (int node : order) {
          const int p = parent[static_cast<size_t>(node)];
          if (p != 0 && heavy[static_cast<size_t>(p)] == node) { continue; }
          for (int current = node; current != 0;
               current = heavy[static_cast<size_t>(current)]) {
              head[static_cast<size_t>(current)] = node;
          }
      }

      vector<Segment> segments;
      vector<vector<int>> chain_segments(static_cast<size_t>(n + 1));
      for (int suit = 0; suit < suit_count; ++suit) {
          int appearance;
          int speed;
          int from;
          int to;
          cin >> appearance >> speed >> from >> to;
          vector<Chunk> left_chunks;
          vector<Chunk> right_chunks;
          int a = from;
          int b = to;
          while (head[static_cast<size_t>(a)] !=
                 head[static_cast<size_t>(b)]) {
              const int head_a = head[static_cast<size_t>(a)];
              const int head_b = head[static_cast<size_t>(b)];
              if (depth[static_cast<size_t>(head_a)] >=
                  depth[static_cast<size_t>(head_b)]) {
                  const int above =
                      parent[static_cast<size_t>(head_a)];
                  left_chunks.push_back(
                      {head_a, depth[static_cast<size_t>(a)],
                       depth[static_cast<size_t>(above)]});
                  a = above;
              } else {
                  const int above =
                      parent[static_cast<size_t>(head_b)];
                  right_chunks.push_back(
                      {head_b, depth[static_cast<size_t>(above)],
                       depth[static_cast<size_t>(b)]});
                  b = above;
              }
          }
          left_chunks.push_back(
              {head[static_cast<size_t>(a)],
               depth[static_cast<size_t>(a)],
               depth[static_cast<size_t>(b)]});
          reverse(right_chunks.begin(), right_chunks.end());
          left_chunks.insert(left_chunks.end(), right_chunks.begin(),
                             right_chunks.end());

          long long travelled = 0;
          for (const Chunk& chunk : left_chunks) {
              const long long distance =
                  llabs(static_cast<long long>(chunk.to_depth) -
                        chunk.from_depth);
              const long long slope =
                  chunk.to_depth > chunk.from_depth
                      ? speed
                      : (chunk.to_depth < chunk.from_depth ? -speed : 0);
              const long long start_numerator =
                  static_cast<long long>(appearance) * speed + travelled;
              const long long intercept =
                  static_cast<long long>(chunk.from_depth) -
                  slope * appearance -
                  (slope == 0 ? 0 : (slope > 0 ? travelled : -travelled));
              const int id = static_cast<int>(segments.size());
              segments.push_back(
                  {start_numerator, start_numerator + distance, slope,
                   intercept, speed, suit, chunk.chain});
              chain_segments[static_cast<size_t>(chunk.chain)].push_back(id);
              travelled += distance;
          }
      }

      bool has_answer = false;
      Fraction answer;
      const auto consider = [&](int first, int second,
                                bool& found, Fraction& best) {
          const Segment& a = segments[static_cast<size_t>(first)];
          const Segment& b = segments[static_cast<size_t>(second)];
          if (a.suit == b.suit) { return; }
          const Fraction overlap_start =
              maximum(start_time(a), start_time(b));
          const Fraction overlap_end = minimum(end_time(a), end_time(b));
          if (less_fraction(overlap_end, overlap_start)) { return; }
          Fraction meeting;
          if (a.slope == b.slope) {
              if (a.intercept != b.intercept) { return; }
              meeting = overlap_start;
          } else {
              long long numerator = b.intercept - a.intercept;
              long long denominator = a.slope - b.slope;
              if (denominator < 0) {
                  numerator = -numerator;
                  denominator = -denominator;
              }
              meeting = {numerator, denominator};
              if (less_fraction(meeting, overlap_start) ||
                  less_fraction(overlap_end, meeting)) {
                  return;
              }
          }
          if (!found || less_fraction(meeting, best)) {
              found = true;
              best = meeting;
          }
      };

      for (int chain = 1; chain <= n; ++chain) {
          const vector<int>& ids =
              chain_segments[static_cast<size_t>(chain)];
          if (ids.size() < 2U) { continue; }
          vector<Event> events;
          events.reserve(ids.size() * 2U);
          for (int id : ids) {
              events.push_back({id, true});
              events.push_back({id, false});
          }
          sort(events.begin(), events.end(),
               [&](const Event& first, const Event& second) {
                   const Fraction first_time =
                       first.starting
                           ? start_time(segments[static_cast<size_t>(
                                 first.segment)])
                           : end_time(segments[static_cast<size_t>(
                                 first.segment)]);
                   const Fraction second_time =
                       second.starting
                           ? start_time(segments[static_cast<size_t>(
                                 second.segment)])
                           : end_time(segments[static_cast<size_t>(
                                 second.segment)]);
                   if (!equal_fraction(first_time, second_time)) {
                       return less_fraction(first_time, second_time);
                   }
                   if (first.starting != second.starting) {
                       return first.starting;
                   }
                   return first.segment < second.segment;
               });
          Fraction current_time;
          ActiveCompare comparator{&segments, &current_time};
          set<int, ActiveCompare> active(comparator);
          for (const Event& event : events) {
              const Segment& segment =
                  segments[static_cast<size_t>(event.segment)];
              current_time =
                  event.starting ? start_time(segment) : end_time(segment);
              if (has_answer && !less_fraction(current_time, answer)) {
                  break;
              }
              if (event.starting) {
                  const auto inserted = active.insert(event.segment).first;
                  if (inserted != active.begin()) {
                      const auto previous = prev(inserted);
                      consider(*previous, *inserted, has_answer, answer);
                  }
                  const auto next_iterator = next(inserted);
                  if (next_iterator != active.end()) {
                      consider(*inserted, *next_iterator, has_answer,
                               answer);
                  }
              } else {
                  const auto iterator = active.find(event.segment);
                  if (iterator == active.end()) { continue; }
                  const auto next_iterator = next(iterator);
                  if (iterator != active.begin() &&
                      next_iterator != active.end()) {
                      consider(*prev(iterator), *next_iterator, has_answer,
                               answer);
                  }
                  active.erase(iterator);
              }
          }
      }

      if (!has_answer) {
          cout << "-1\n";
      } else {
          const long double result =
              static_cast<long double>(answer.numerator) /
              static_cast<long double>(answer.denominator);
          cout << fixed << setprecision(10) << result << '\n';
      }
      return 0;
  }
external_url: https://codeforces.com/contest/704/problem/E
external_platform: Codeforces
external_problem_id: 704E
external_title: Iron Man
external_relation: original
source_book_pages: [560]
source_pdf_pages: [190]
review_status: verified
---

題面、限制與兩組範例均依 Codeforces 官方頁核實；繁中敘述、證明與 C++17 實作為本站獨立撰寫。
