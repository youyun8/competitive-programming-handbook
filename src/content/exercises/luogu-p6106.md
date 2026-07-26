---
id: luogu-p6106
volume: lower
source_file: lower-volume
title: 洛谷 P6106：不相交線段的矩形裁切總長
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['掃描線', '矩形前綴差分', '隨機平衡樹', '二維偏序']
prerequisites: ['掃描線', 'Treap', '樹狀陣列', '容斥']
statement: 平面上有 n 條兩兩沒有交點或重合部分的非水平、非垂直線段。每次詢問一個邊平行於座標軸的矩形，求所有線段落在矩形內的長度總和，除以所有線段原長總和。
constraints:
  - '1 <= n,m <= 100000'
  - '1 <= x_1,y_1,x_2,y_2 <= 1000000'
  - 每條線段皆滿足 x_1 != x_2 且 y_1 != y_2
  - 任意兩條線段沒有交點或重合部分
  - 每個詢問矩形滿足 x_1 < x_2 且 y_1 < y_2
input_format: 第一行 n；接著 n 行線段兩端點 x_1、y_1、x_2、y_2；下一行 m；接著 m 行詢問矩形的左下與右上座標。
output_format: 每個詢問輸出一行介於 0 與 1 的實數；相對或絕對誤差不超過 1e-6。
samples:
  - input: |
      2
      1 1 4 4
      2 1 4 3
      4
      1 1 6 6
      1 1 3 3
      2 1 3 3
      1 2 2 4
    output: |
      1
      0.6
      0.4
      0
    explanation: 兩線段長度分別為 3√2、2√2；第二個矩形內共留下 3√2，因此比值為 3/5。
core_knowledge:
  - 矩形內長度可由四個左下無界前綴 F(X,Y) 容斥
  - 正斜率線段對 F 的貢獻分成完整包含、被右邊界截斷、被上邊界截斷三種互斥情況
  - 線段互不相交，所以掃描線上的活動線段相對順序不會改變
judgment: 對正斜率線段，完整包含部分是終點的帶權二維偏序；右邊界部分以垂直掃描線維護活動線段的縱向次序與長度導數前綴；交換 x、y 再做一次即得上邊界部分。負斜率線段把 y 取負後成為正斜率，並用「x 前綴總長減去反射後的左下前綴」還原。最後用四前綴容斥並除以總長。
hints:
  - 先定義 F(X,Y) 為所有線段落在 x<=X 且 y<=Y 區域內的總長；一個矩形只需四次 F。
  - 正斜率線段若被 x=X 截斷，貢獻是 sqrt(dx^2+dy^2)/dx * (X-x_1)，也就是關於 X 的一次函數。
  - 掃描時以 Treap 維護活動線段由下到上的次序；因線段不相交，鍵的相對順序不變，可以安全插入、刪除及查詢 y(X)<=Y 的前綴係數和。
solution_outline: >-
  將每個矩形拆成 F(x2,y2)-F(x1,y2)-F(x2,y1)+F(x1,y1)。正斜率線段統一定向成
  x1<x2、y1<y2。若終點同時不超過 (X,Y)，整段計入，以終點排序配合 Fenwick 做帶權二維偏序。
  否則恰由右邊界或上邊界先截斷。右邊界掃描中，在 x1 事件後插入、x2 事件前刪除；
  Treap 依當前截線交點高度排序，節點維護 a=L/dx、b=-a*x1 的子樹和，查詢高度不超過 Y
  的前綴即貢獻 aX+b。交換兩軸重做可得上邊界項。負斜率線段令 y'=-y；
  原條件 y<=Y 的 x 前綴長度等於不限制 y 的 x 前綴 A(X)，減去反射後 y'<=-Y 的正斜率前綴。
proof_or_invariant: >-
  對正斜率線段，與左下前綴的交集若非空，參數區間必從原起點開始；其右端不是原終點，
  就唯一由 x=X 或 y=Y 中先遇到的邊界決定，故三種貢獻互斥且完備。活動線段若在掃描期間交換
  高低次序便必相交，與保證矛盾，因此 Treap 次序始終正確，所查前綴恰為被該邊界截斷且位於
  另一限制內的線段。負斜率部分由集合恆等式
  {x<=X,y<=Y}={x<=X}\{x<=X,-y<-Y} 得到；邊界上的單點長度為零，不影響答案。
  四項指示函數容斥最後精確得到閉矩形內長度。
complexity:
  time: O((n+m) log(n+m))
  space: O(n+m)
common_errors:
  - 把題名誤認為需要 Self-Adjusting Top Tree；本題依賴的是不相交線段的掃描次序
  - 同一座標事件先插入起點或延後刪除終點，造成完整段與邊界段重複計算
  - 漏掉負斜率線段反射後需要用 x 前綴總長相減
  - 用浮點比較活動線段高低，導致 Treap 次序在大座標下失真
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：拆四個左下前綴，分正負斜率做不相交線段掃描。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  #include <boost/multiprecision/cpp_int.hpp>
  using namespace std;
  using boost::multiprecision::int128_t;

  struct Segment {
      long long x1;
      long long y1;
      long long x2;
      long long y2;
      long double length;
  };

  struct PrefixQuery {
      long long x;
      long long y;
      int answer_id;
      int sign;
  };

  class Fenwick {
    public:
      explicit Fenwick(int size)
          : tree_(static_cast<size_t>(size + 1), 0.0L) {}
      void add(int position, long double value) {
          for (int i = position; i < static_cast<int>(tree_.size());
               i += i & -i) {
              tree_[static_cast<size_t>(i)] += value;
          }
      }
      long double prefix_sum(int position) const {
          long double result = 0.0L;
          for (int i = position; i > 0; i -= i & -i) {
              result += tree_[static_cast<size_t>(i)];
          }
          return result;
      }

    private:
      vector<long double> tree_;
  };

  class OrderTreap {
    private:
      struct Node {
          int left = -1;
          int right = -1;
          int size = 1;
          uint32_t priority = 0;
          long double coefficient = 0.0L;
          long double constant = 0.0L;
          long double sum_coefficient = 0.0L;
          long double sum_constant = 0.0L;
      };

    public:
      explicit OrderTreap(const vector<Segment>& segments)
          : segments_(segments), nodes_(segments.size()) {
          uint32_t state = 712367821U;
          for (Node& node : nodes_) {
              state ^= state << 13U;
              state ^= state >> 17U;
              state ^= state << 5U;
              node.priority = state;
          }
      }

      void insert(int id, long long coordinate) {
          Node& node = nodes_[static_cast<size_t>(id)];
          node.left = -1;
          node.right = -1;
          node.size = 1;
          const Segment& segment = segments_[static_cast<size_t>(id)];
          const long double delta =
              static_cast<long double>(segment.x2 - segment.x1);
          node.coefficient = segment.length / delta;
          node.constant =
              -node.coefficient * static_cast<long double>(segment.x1);
          node.sum_coefficient = node.coefficient;
          node.sum_constant = node.constant;
          root_ = insert_node(root_, id, coordinate);
      }

      void erase(int id, long long coordinate) {
          root_ = erase_node(root_, id, coordinate);
      }

      long double prefix_value(long long coordinate,
                               long long ordinate,
                               bool include_equal) const {
          long double sum_coefficient = 0.0L;
          long double sum_constant = 0.0L;
          int node = root_;
          while (node != -1) {
              if (not_above(node, coordinate, ordinate,
                            include_equal)) {
                  const int left =
                      nodes_[static_cast<size_t>(node)].left;
                  sum_coefficient +=
                      subtree_coefficient(left) +
                      nodes_[static_cast<size_t>(node)].coefficient;
                  sum_constant +=
                      subtree_constant(left) +
                      nodes_[static_cast<size_t>(node)].constant;
                  node = nodes_[static_cast<size_t>(node)].right;
              } else {
                  node = nodes_[static_cast<size_t>(node)].left;
              }
          }
          return sum_coefficient * static_cast<long double>(coordinate) +
                 sum_constant;
      }

    private:
      int node_size(int node) const {
          return node == -1
                     ? 0
                     : nodes_[static_cast<size_t>(node)].size;
      }
      long double subtree_coefficient(int node) const {
          return node == -1
                     ? 0.0L
                     : nodes_[static_cast<size_t>(node)].sum_coefficient;
      }
      long double subtree_constant(int node) const {
          return node == -1
                     ? 0.0L
                     : nodes_[static_cast<size_t>(node)].sum_constant;
      }
      void pull(int node) {
          Node& current = nodes_[static_cast<size_t>(node)];
          current.size =
              1 + node_size(current.left) + node_size(current.right);
          current.sum_coefficient =
              current.coefficient + subtree_coefficient(current.left) +
              subtree_coefficient(current.right);
          current.sum_constant =
              current.constant + subtree_constant(current.left) +
              subtree_constant(current.right);
      }
      bool less_at(int first, int second, long long x) const {
          const Segment& a = segments_[static_cast<size_t>(first)];
          const Segment& b = segments_[static_cast<size_t>(second)];
          const int128_t a_dx = a.x2 - a.x1;
          const int128_t b_dx = b.x2 - b.x1;
          const int128_t a_numerator =
              int128_t(a.y1) * a_dx +
              int128_t(a.y2 - a.y1) * (x - a.x1);
          const int128_t b_numerator =
              int128_t(b.y1) * b_dx +
              int128_t(b.y2 - b.y1) * (x - b.x1);
          return a_numerator * b_dx < b_numerator * a_dx;
      }
      bool not_above(int id, long long x, long long y,
                     bool include_equal) const {
          const Segment& segment = segments_[static_cast<size_t>(id)];
          const int128_t dx = segment.x2 - segment.x1;
          const int128_t numerator =
              int128_t(segment.y1) * dx +
              int128_t(segment.y2 - segment.y1) * (x - segment.x1);
          const int128_t boundary = int128_t(y) * dx;
          return include_equal ? numerator <= boundary
                               : numerator < boundary;
      }
      pair<int, int> split(int root, int id, long long coordinate) {
          if (root == -1) { return {-1, -1}; }
          if (less_at(root, id, coordinate)) {
              auto [middle, right] = split(
                  nodes_[static_cast<size_t>(root)].right, id,
                  coordinate);
              nodes_[static_cast<size_t>(root)].right = middle;
              pull(root);
              return {root, right};
          }
          auto [left, middle] = split(
              nodes_[static_cast<size_t>(root)].left, id, coordinate);
          nodes_[static_cast<size_t>(root)].left = middle;
          pull(root);
          return {left, root};
      }
      int merge(int left, int right) {
          if (left == -1) { return right; }
          if (right == -1) { return left; }
          if (nodes_[static_cast<size_t>(left)].priority <
              nodes_[static_cast<size_t>(right)].priority) {
              nodes_[static_cast<size_t>(left)].right =
                  merge(nodes_[static_cast<size_t>(left)].right, right);
              pull(left);
              return left;
          }
          nodes_[static_cast<size_t>(right)].left =
              merge(left, nodes_[static_cast<size_t>(right)].left);
          pull(right);
          return right;
      }
      int insert_node(int root, int id, long long coordinate) {
          if (root == -1) { return id; }
          if (nodes_[static_cast<size_t>(id)].priority <
              nodes_[static_cast<size_t>(root)].priority) {
              auto [left, right] = split(root, id, coordinate);
              nodes_[static_cast<size_t>(id)].left = left;
              nodes_[static_cast<size_t>(id)].right = right;
              pull(id);
              return id;
          }
          if (less_at(id, root, coordinate)) {
              nodes_[static_cast<size_t>(root)].left = insert_node(
                  nodes_[static_cast<size_t>(root)].left, id,
                  coordinate);
          } else {
              nodes_[static_cast<size_t>(root)].right = insert_node(
                  nodes_[static_cast<size_t>(root)].right, id,
                  coordinate);
          }
          pull(root);
          return root;
      }
      int erase_node(int root, int id, long long coordinate) {
          if (root == id) {
              return merge(nodes_[static_cast<size_t>(root)].left,
                           nodes_[static_cast<size_t>(root)].right);
          }
          if (less_at(id, root, coordinate)) {
              nodes_[static_cast<size_t>(root)].left = erase_node(
                  nodes_[static_cast<size_t>(root)].left, id,
                  coordinate);
          } else {
              nodes_[static_cast<size_t>(root)].right = erase_node(
                  nodes_[static_cast<size_t>(root)].right, id,
                  coordinate);
          }
          pull(root);
          return root;
      }

      const vector<Segment>& segments_;
      vector<Node> nodes_;
      int root_ = -1;
  };

  struct Event {
      long long coordinate;
      int type;
      int id;
  };

  static void add_boundary_contribution(
      const vector<Segment>& segments,
      const vector<PrefixQuery>& queries,
      vector<long double>& answers,
      bool include_equal) {
      vector<Event> events;
      events.reserve(segments.size() * 2U + queries.size());
      for (size_t i = 0; i < segments.size(); ++i) {
          events.push_back(
              {segments[i].x2, 0, static_cast<int>(i)});
          events.push_back(
              {segments[i].x1, 2, static_cast<int>(i)});
      }
      for (size_t i = 0; i < queries.size(); ++i) {
          events.push_back({queries[i].x, 1, static_cast<int>(i)});
      }
      sort(events.begin(), events.end(), [](const Event& a,
                                            const Event& b) {
          if (a.coordinate != b.coordinate) {
              return a.coordinate < b.coordinate;
          }
          return a.type < b.type;
      });
      OrderTreap treap(segments);
      for (const Event& event : events) {
          if (event.type == 0) {
              treap.erase(event.id, event.coordinate);
          } else if (event.type == 1) {
              const PrefixQuery& query =
                  queries[static_cast<size_t>(event.id)];
              answers[static_cast<size_t>(query.answer_id)] +=
                  static_cast<long double>(query.sign) *
                  treap.prefix_value(query.x, query.y,
                                     include_equal);
          } else {
              treap.insert(event.id, event.coordinate);
          }
      }
  }

  static void add_full_contribution(
      const vector<Segment>& segments,
      const vector<PrefixQuery>& queries,
      vector<long double>& answers) {
      vector<int> segment_order(segments.size());
      iota(segment_order.begin(), segment_order.end(), 0);
      sort(segment_order.begin(), segment_order.end(),
           [&](int a, int b) {
               return segments[static_cast<size_t>(a)].x2 <
                      segments[static_cast<size_t>(b)].x2;
           });
      vector<int> query_order(queries.size());
      iota(query_order.begin(), query_order.end(), 0);
      sort(query_order.begin(), query_order.end(), [&](int a, int b) {
          return queries[static_cast<size_t>(a)].x <
                 queries[static_cast<size_t>(b)].x;
      });
      vector<long long> ordinates;
      ordinates.reserve(segments.size());
      for (const Segment& segment : segments) {
          ordinates.push_back(segment.y2);
      }
      sort(ordinates.begin(), ordinates.end());
      ordinates.erase(unique(ordinates.begin(), ordinates.end()),
                       ordinates.end());
      Fenwick fenwick(static_cast<int>(ordinates.size()));
      size_t inserted = 0;
      for (int query_id : query_order) {
          const PrefixQuery& query =
              queries[static_cast<size_t>(query_id)];
          while (inserted < segment_order.size() &&
                 segments[static_cast<size_t>(
                     segment_order[inserted])]
                         .x2 <= query.x) {
              const Segment& segment =
                  segments[static_cast<size_t>(
                      segment_order[inserted++])];
              const int position = static_cast<int>(
                                       lower_bound(ordinates.begin(),
                                                   ordinates.end(),
                                                   segment.y2) -
                                       ordinates.begin()) +
                                   1;
              fenwick.add(position, segment.length);
          }
          const int position = static_cast<int>(
              upper_bound(ordinates.begin(), ordinates.end(), query.y) -
              ordinates.begin());
          answers[static_cast<size_t>(query.answer_id)] +=
              static_cast<long double>(query.sign) *
              fenwick.prefix_sum(position);
      }
  }

  static void add_positive_prefix(
      const vector<Segment>& segments,
      const vector<PrefixQuery>& queries,
      vector<long double>& answers) {
      if (segments.empty()) { return; }
      add_full_contribution(segments, queries, answers);
      add_boundary_contribution(segments, queries, answers, true);
      vector<Segment> transposed = segments;
      for (Segment& segment : transposed) {
          swap(segment.x1, segment.y1);
          swap(segment.x2, segment.y2);
      }
      vector<PrefixQuery> transposed_queries = queries;
      for (PrefixQuery& query : transposed_queries) {
          swap(query.x, query.y);
      }
      add_boundary_contribution(transposed, transposed_queries, answers,
                                false);
  }

  static void add_x_prefix(
      const vector<Segment>& segments,
      const vector<PrefixQuery>& queries,
      vector<long double>& answers) {
      vector<Event> events;
      events.reserve(segments.size() * 2U + queries.size());
      for (size_t i = 0; i < segments.size(); ++i) {
          events.push_back(
              {segments[i].x2, 0, static_cast<int>(i)});
          events.push_back(
              {segments[i].x1, 2, static_cast<int>(i)});
      }
      for (size_t i = 0; i < queries.size(); ++i) {
          events.push_back({queries[i].x, 1, static_cast<int>(i)});
      }
      sort(events.begin(), events.end(), [](const Event& a,
                                            const Event& b) {
          if (a.coordinate != b.coordinate) {
              return a.coordinate < b.coordinate;
          }
          return a.type < b.type;
      });
      long double full = 0.0L;
      long double sum_coefficient = 0.0L;
      long double sum_constant = 0.0L;
      for (const Event& event : events) {
          if (event.type == 0) {
              const Segment& segment =
                  segments[static_cast<size_t>(event.id)];
              const long double coefficient =
                  segment.length /
                  static_cast<long double>(segment.x2 - segment.x1);
              sum_coefficient -= coefficient;
              sum_constant += coefficient *
                              static_cast<long double>(segment.x1);
              full += segment.length;
          } else if (event.type == 1) {
              const PrefixQuery& query =
                  queries[static_cast<size_t>(event.id)];
              const long double value =
                  full +
                  sum_coefficient *
                      static_cast<long double>(query.x) +
                  sum_constant;
              answers[static_cast<size_t>(query.answer_id)] +=
                  static_cast<long double>(query.sign) * value;
          } else {
              const Segment& segment =
                  segments[static_cast<size_t>(event.id)];
              const long double coefficient =
                  segment.length /
                  static_cast<long double>(segment.x2 - segment.x1);
              sum_coefficient += coefficient;
              sum_constant -= coefficient *
                              static_cast<long double>(segment.x1);
          }
      }
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<Segment> positive;
      vector<Segment> negative;
      long double total_length = 0.0L;
      for (int i = 0; i < n; ++i) {
          long long x1;
          long long y1;
          long long x2;
          long long y2;
          cin >> x1 >> y1 >> x2 >> y2;
          if (x1 > x2) {
              swap(x1, x2);
              swap(y1, y2);
          }
          const long double dx =
              static_cast<long double>(x2 - x1);
          const long double dy =
              static_cast<long double>(y2 - y1);
          const long double length = hypotl(dx, dy);
          total_length += length;
          if (y1 < y2) {
              positive.push_back({x1, y1, x2, y2, length});
          } else {
              negative.push_back({x1, y1, x2, y2, length});
          }
      }
      int query_count;
      cin >> query_count;
      vector<PrefixQuery> queries;
      queries.reserve(static_cast<size_t>(query_count) * 4U);
      for (int i = 0; i < query_count; ++i) {
          long long x1;
          long long y1;
          long long x2;
          long long y2;
          cin >> x1 >> y1 >> x2 >> y2;
          queries.push_back({x2, y2, i, 1});
          queries.push_back({x1, y2, i, -1});
          queries.push_back({x2, y1, i, -1});
          queries.push_back({x1, y1, i, 1});
      }
      vector<long double> answers(
          static_cast<size_t>(query_count), 0.0L);
      add_positive_prefix(positive, queries, answers);
      if (!negative.empty()) {
          add_x_prefix(negative, queries, answers);
          vector<Segment> reflected = negative;
          for (Segment& segment : reflected) {
              segment.y1 = -segment.y1;
              segment.y2 = -segment.y2;
          }
          vector<PrefixQuery> reflected_queries = queries;
          for (PrefixQuery& query : reflected_queries) {
              query.y = -query.y;
              query.sign = -query.sign;
          }
          add_positive_prefix(reflected, reflected_queries, answers);
      }
      cout << setprecision(15);
      for (long double answer : answers) {
          const long double ratio =
              max(0.0L, min(1.0L, answer / total_length));
          cout << static_cast<double>(ratio) << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P6106
external_platform: 洛谷
external_problem_id: P6106
external_title: '[Ynoi2010] Self Adjusting Top Tree'
external_relation: original
source_book_pages: [555]
source_pdf_pages: [185]
review_status: verified
---

題面與限制由洛谷 2020-07-29 Wayback 原始快照完整還原，並與現行洛谷搜尋摘要及公開賽後題解交叉核實。解法依公開題解的前綴差分與不交掃描性質獨立推導；程式另以逐線段 Liang–Barsky 型參數裁切暴力隨機對拍。
