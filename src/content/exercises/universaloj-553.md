---
id: universaloj-553
volume: lower
source_file: lower-volume
title: UniversalOJ 553 己酸集合：直線排列分塊
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['幾何轉換', '直線排列', '分塊', '離線詢問']
prerequisites: ['圓方程', '直線交點', '整數精確比較']
statement: 平面上有 n 個點 (x_i,y_i)。每次詢問給定 z、R，求到圓心 (0,z) 的歐幾里得距離不超過 R 的點數。
constraints:
  - '1 <= n <= 12000'
  - '0 <= Q <= 10^6'
  - '|x_i|,|y_i|,|z_i| <= 10^9'
  - '1 <= R_i <= 10^9'
  - 時間限制 4 秒，空間限制 512 MB
input_format: 第一行為 n、Q；接著 n 行各給點 x_i、y_i；再接 Q 行詢問 z_i、R_i。
output_format: 對每個詢問輸出一行，表示閉圓內（含圓周）的點數。
samples:
  - input: |
      5 5
      -27 -18
      -11 10
      -29 4
      26 26
      16 -9
      -11 22
      -24 15
      -19 3
      -11 6
      -17 24
    output: |
      1
      0
      0
      0
      1
    explanation: 第一個詢問的圓心為 (0,-11)、半徑 22，五點中恰有一點距離不超過 22；其餘詢問依相同閉圓判定得到輸出。
core_knowledge:
  - 圓內判定可改寫成關於查詢 z 的直線值比較
  - 一小塊直線按某個 z 的高度排序後，只會在兩線交點處交換次序
  - 所有交點與詢問按 z 離線掃描，可在每塊二分高度門檻
judgment: 點 (x,y) 對詢問的條件是 (-2y)z+(x²+y²)<=R²-z²。把每點視為直線，將 n 條線分成約 sqrt(Q) 大小的塊；每塊枚舉線對交點，按 z 掃描並維護高度順序，對每個詢問二分符合門檻的線數後累加。
hints:
  - 展開 x²+(y-z)²<=R²，把含點的項放左側，可得到斜率 -2y、截距 x²+y² 的直線。
  - 固定一塊 B 條線，先按 z 趨近負無限時的高度排序；掃過任意兩線交點時，交換這兩線在目前順序中的位置。
  - 交點橫座標是有理數；比較兩交點及判斷是否已越過整數 z 時用 128-bit multiprecision integer 交叉相乘，不要轉成 double。
solution_outline: 將點轉成 (slope,intercept) 直線，將詢問轉成 (z,R²-z²) 並按 z 排序。每塊建立所有斜率不同線對的交點事件，以精確分數排序；從負無限開始維護線高次序，事件橫座標不大於目前詢問 z 時交換兩線排名。此時按高度二分門檻，將該塊命中數加入詢問答案。逐塊累加後依原順序輸出。
proof_or_invariant: 代數展開保證點在閉圓內恰等價於對應直線在查詢點 (z,R²-z²) 下方或其上。對固定塊，兩條非平行線的相對高度只在唯一交點改變；平行線永不改變。從負無限的正確順序開始，依交點 z 遞增逐一交換後，維護順序在每個詢問 z 都按線值非遞減排列；同 z 多線交會時其值相等，內部任意次序不影響二分計數。每塊計數正確，分塊互斥且覆蓋全部點，總和即答案。
complexity:
  time: 取塊長 B≈sqrt(Q) 時為 O((nB+nQ/B) log B)
  space: O(Q+B²+n)
common_errors:
  - 直接以 double 排交點，1e9 座標下會把極近交點次序排錯
  - 圓周應計入答案，二分誤用嚴格小於
  - 初始順序按 z=0 排，而不是交點掃描前的負無限順序
  - x²、y² 或斜率乘 z 使用 32-bit 整數溢位
cpp_skeleton: |
  #include <bits/stdc++.h>
  #include <boost/multiprecision/cpp_int.hpp>
  using namespace std;
  using boost::multiprecision::int128_t;

  struct Line { long long slope; long long intercept; };
  struct Query { long long z; long long threshold; int id; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：把點轉成直線，分塊枚舉交點並離線維護每塊高度次序。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  #include <boost/multiprecision/cpp_int.hpp>
  using namespace std;
  using boost::multiprecision::int128_t;

  struct Line {
      long long slope;
      long long intercept;
  };
  struct Query {
      long long z;
      long long threshold;
      int id;
  };
  struct Event {
      long long numerator;
      long long denominator;
      int first;
      int second;
  };

  static bool fraction_less(const Event& first, const Event& second) {
      const int128_t left =
          int128_t(first.numerator) * second.denominator;
      const int128_t right =
          int128_t(second.numerator) * first.denominator;
      if (left != right) { return left < right; }
      if (first.first != second.first) {
          return first.first < second.first;
      }
      return first.second < second.second;
  }

  static bool event_not_after(const Event& event, long long z) {
      return int128_t(event.numerator) <=
             int128_t(z) * event.denominator;
  }

  static bool same_abscissa(const Event& first, const Event& second) {
      return int128_t(first.numerator) * second.denominator ==
             int128_t(second.numerator) * first.denominator;
  }

  static long long value_at(const Line& line, long long z) {
      return line.slope * z + line.intercept;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int query_count;
      cin >> n >> query_count;
      vector<Line> lines(static_cast<size_t>(n));
      for (Line& line : lines) {
          long long x;
          long long y;
          cin >> x >> y;
          line.slope = -2LL * y;
          line.intercept = x * x + y * y;
      }
      vector<Query> queries(static_cast<size_t>(query_count));
      for (int id = 0; id < query_count; ++id) {
          long long radius;
          Query& query = queries[static_cast<size_t>(id)];
          cin >> query.z >> radius;
          query.threshold = radius * radius - query.z * query.z;
          query.id = id;
      }
      sort(queries.begin(), queries.end(),
           [](const Query& a, const Query& b) {
               return a.z != b.z ? a.z < b.z : a.id < b.id;
           });
      vector<int> answers(static_cast<size_t>(query_count), 0);
      const int block_size =
          max(1, static_cast<int>(sqrtl(
                     static_cast<long double>(max(1, query_count)))));

      for (int block_left = 0; block_left < n;
           block_left += block_size) {
          const int block_right = min(n, block_left + block_size);
          const int size = block_right - block_left;
          vector<int> order(static_cast<size_t>(size));
          iota(order.begin(), order.end(), 0);
          sort(order.begin(), order.end(),
               [&lines, block_left](int first, int second) {
                   const Line& a =
                       lines[static_cast<size_t>(block_left + first)];
                   const Line& b =
                       lines[static_cast<size_t>(block_left + second)];
                   if (a.slope != b.slope) { return a.slope > b.slope; }
                   return a.intercept < b.intercept;
               });
          vector<int> position(static_cast<size_t>(size));
          for (int rank = 0; rank < size; ++rank) {
              position[static_cast<size_t>(
                  order[static_cast<size_t>(rank)])] = rank;
          }

          vector<Event> events;
          events.reserve(
              static_cast<size_t>(size) * static_cast<size_t>(size - 1) /
              2U);
          for (int first = 0; first < size; ++first) {
              for (int second = first + 1; second < size; ++second) {
                  const Line& a =
                      lines[static_cast<size_t>(block_left + first)];
                  const Line& b =
                      lines[static_cast<size_t>(block_left + second)];
                  if (a.slope == b.slope) { continue; }
                  long long numerator = b.intercept - a.intercept;
                  long long denominator = a.slope - b.slope;
                  if (denominator < 0) {
                      denominator = -denominator;
                      numerator = -numerator;
                  }
                  events.push_back(
                      {numerator, denominator, first, second});
              }
          }
          sort(events.begin(), events.end(), fraction_less);

          size_t event_index = 0;
          for (const Query& query : queries) {
              while (event_index < events.size() &&
                     event_not_after(events[event_index], query.z)) {
                  size_t group_end = event_index + 1U;
                  while (group_end < events.size() &&
                         same_abscissa(events[event_index],
                                       events[group_end])) {
                      ++group_end;
                  }
                  if (group_end == event_index + 1U) {
                      const Event& event = events[event_index];
                      const int first_position =
                          position[static_cast<size_t>(event.first)];
                      const int second_position =
                          position[static_cast<size_t>(event.second)];
                      swap(order[static_cast<size_t>(first_position)],
                           order[static_cast<size_t>(second_position)]);
                      position[static_cast<size_t>(event.first)] =
                          second_position;
                      position[static_cast<size_t>(event.second)] =
                          first_position;
                  } else {
                      vector<int> parent(static_cast<size_t>(size), -1);
                      const auto find_root = [&parent](int start) {
                          int current = start;
                          while (parent[static_cast<size_t>(current)] !=
                                 current) {
                              current =
                                  parent[static_cast<size_t>(current)];
                          }
                          int node = start;
                          while (node != current) {
                              const int next_node =
                                  parent[static_cast<size_t>(node)];
                              parent[static_cast<size_t>(node)] = current;
                              node = next_node;
                          }
                          return current;
                      };
                      vector<int> touched;
                      for (size_t index = event_index; index < group_end;
                           ++index) {
                          const Event& event = events[index];
                          for (int id : {event.first, event.second}) {
                              if (parent[static_cast<size_t>(id)] == -1) {
                                  parent[static_cast<size_t>(id)] = id;
                                  touched.push_back(id);
                              }
                          }
                          const int first_root = find_root(event.first);
                          const int second_root = find_root(event.second);
                          if (first_root != second_root) {
                              parent[static_cast<size_t>(second_root)] =
                                  first_root;
                          }
                      }
                      vector<vector<int>> components(
                          static_cast<size_t>(size));
                      for (int id : touched) {
                          components[static_cast<size_t>(find_root(id))]
                              .push_back(id);
                      }
                      for (vector<int>& ids : components) {
                          if (ids.empty()) { continue; }
                          vector<int> positions;
                          positions.reserve(ids.size());
                          for (int id : ids) {
                              positions.push_back(
                                  position[static_cast<size_t>(id)]);
                          }
                          sort(positions.begin(), positions.end());
                          sort(ids.begin(), ids.end(),
                               [&lines, block_left](int first, int second) {
                                   const Line& a = lines[static_cast<size_t>(
                                       block_left + first)];
                                   const Line& b = lines[static_cast<size_t>(
                                       block_left + second)];
                                   if (a.slope != b.slope) {
                                       return a.slope < b.slope;
                                   }
                                   return a.intercept < b.intercept;
                               });
                          for (size_t index = 0; index < ids.size();
                               ++index) {
                              order[static_cast<size_t>(
                                  positions[index])] = ids[index];
                              position[static_cast<size_t>(ids[index])] =
                                  positions[index];
                          }
                      }
                  }
                  event_index = group_end;
              }
              int low = 0;
              int high = size;
              while (low < high) {
                  const int middle = low + (high - low) / 2;
                  const int local_id =
                      order[static_cast<size_t>(middle)];
                  const Line& line = lines[static_cast<size_t>(
                      block_left + local_id)];
                  if (value_at(line, query.z) <= query.threshold) {
                      low = middle + 1;
                  } else {
                      high = middle;
                  }
              }
              answers[static_cast<size_t>(query.id)] += low;
          }
      }
      for (int answer : answers) { cout << answer << '\n'; }
      return 0;
  }
external_url: https://uoj.ac/problem/553
external_platform: UniversalOJ
external_problem_id: '553'
external_title: 己酸集合
external_relation: original
source_book_pages: [565]
source_pdf_pages: [195]
review_status: verified
---

題面、限制、官方 URL 與範例已依 UniversalOJ 官方題面核實；繁中敘述、證明與程式為本站獨立撰寫。
