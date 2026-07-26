---
id: luogu-p5044
volume: upper
source_file: upper-volume
title: 洛谷 P5044 Meetings：笛卡兒樹上的區間 DP
chapter: 4
section: '4.15'
kind: external-oj
difficulty: 5
topics: [cartesian-tree, dynamic-programming, segment-tree]
prerequisites: [cartesian-tree, lazy-propagation, range-maximum-query]
statement: n 座山排成一列。會議 [L,R] 選一座 x 舉辦；每位 y 的成本是 x-y 間最高山高度，總成本為所有參與者成本和。對每個互異區間求最小總成本。
constraints: ['1 <= n,q <= 750000', '1 <= H_i <= 1000000000', '0 <= L <= R < n', '所有詢問區間互異']
input_format: 第一行 n、q；第二行 n 個高度；接著 q 行 L、R。
output_format: 每個會議輸出一行最低成本。
samples:
  - input: |
      4 2
      2 4 3 5
      0 2
      1 3
    output: |
      10
      12
    explanation: 第一問可選山 0，成本 2+4+4=10；第二問選山 2，成本 4+3+5=12。
core_knowledge: [區間最大值分割, 大根笛卡兒樹, DP 函數單調交點與線段樹批次轉移]
judgment: 每位參與者成本是沿途最大高度，不是距離或高度差；每次會議互相獨立。
hints:
  - 設 p 為 [L,R] 的最高山。最優會場在 p 左側或右側；若在右側，L..p 每人都至少付 H_p，可拆成固定成本與右半 DP。
  - 所有區間最大值的遞迴關係正是大根笛卡兒樹；把詢問依最高點分到左右方向，兩次（原序與反序）處理。
  - 固定左界向右延伸的 DP 轉移是「舊函數加常數」與「一條等差直線」取小；兩者差單調，可在線段樹定位交點，整段加值或整段賦直線。
solution_outline: RMQ 找每問右側最高點，拆成「最高點左側固定成本 + 右半最佳成本」及對稱候選。建立右端取最大的大根笛卡兒樹，後序處理子樹；懶線段樹維護各右端 DP，支援區間加、區間賦一次函數與單點查。反轉陣列再跑一次，取兩候選最小。
proof_or_invariant: 最高點 p 將任一會場分到 p 的一側；另一側所有人路徑必經 p，固定貢獻可分離，兩個候選涵蓋全部會場。笛卡兒樹後序保證子區間 DP 已知；線段樹更新逐點實作遞推式兩項的最小值，單調交點使整段判斷正確。兩方向取最小即全域最優。
common_errors:
  [
    相同高度未固定取最右最高點,
    忘記輸入是 0 編號,
    只算會場在最高點單側的一種方向,
    一次函數懶標下傳時截距偏移錯誤,
    以 int 儲存成本
  ]
complexity: { time: 'O((n+q)log n)', space: 'O(n log n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：最高點拆詢問；原序與反序各做一次笛卡兒樹 DP。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;
  constexpr long long infinity = 4000000000000000000LL;
  struct DpSegmentTree {
      struct Node { int kind = 0; long long slope = 0, intercept = 0, left_value = infinity, right_value = infinity; };
      int n; vector<Node> tree;
      explicit DpSegmentTree(int size) : n(size), tree(static_cast<size_t>(4 * size)) {}
      void reset() { fill(tree.begin(), tree.end(), Node{}); }
      void assign_line(int node, int left, int right, long long slope, long long intercept) {
          tree[static_cast<size_t>(node)] = {1, slope, intercept, slope * left + intercept, slope * right + intercept};
      }
      void add_constant(int node, long long value) {
          Node& current = tree[static_cast<size_t>(node)];
          if (current.kind == 0) current.kind = 2;
          current.intercept += value; current.left_value += value; current.right_value += value;
      }
      void push(int node, int left, int right) {
          Node& current = tree[static_cast<size_t>(node)];
          if (current.kind == 0 || left == right) return;
          int middle = (left + right) / 2;
          if (current.kind == 1) {
              assign_line(node * 2, left, middle, current.slope, current.intercept);
              assign_line(node * 2 + 1, middle + 1, right, current.slope, current.intercept);
          } else {
              add_constant(node * 2, current.intercept);
              add_constant(node * 2 + 1, current.intercept);
          }
          current.kind = 0; current.slope = current.intercept = 0;
      }
      void pull(int node) {
          tree[static_cast<size_t>(node)].left_value = tree[static_cast<size_t>(node * 2)].left_value;
          tree[static_cast<size_t>(node)].right_value = tree[static_cast<size_t>(node * 2 + 1)].right_value;
      }
      void point_assign(int node, int left, int right, int position, long long value) {
          if (left == right) { assign_line(node, left, right, 0, value); return; }
          push(node, left, right); int middle = (left + right) / 2;
          if (position <= middle) point_assign(node * 2, left, middle, position, value);
          else point_assign(node * 2 + 1, middle + 1, right, position, value);
          pull(node);
      }
      long long point_query(int node, int left, int right, int position) {
          if (left == right) return tree[static_cast<size_t>(node)].left_value;
          push(node, left, right); int middle = (left + right) / 2;
          return position <= middle ? point_query(node * 2, left, middle, position)
                                    : point_query(node * 2 + 1, middle + 1, right, position);
      }
      void transform(int node, int left, int right, int query_left, int query_right,
                     long long slope, long long intercept, long long addition) {
          if (query_left <= left && right <= query_right) {
              Node& current = tree[static_cast<size_t>(node)];
              if (slope * left + intercept >= current.left_value + addition) {
                  add_constant(node, addition);
                  return;
              }
              if (slope * right + intercept <= current.right_value + addition) {
                  assign_line(node, left, right, slope, intercept);
                  return;
              }
          }
          push(node, left, right); int middle = (left + right) / 2;
          if (query_left <= middle) transform(node * 2, left, middle, query_left, query_right, slope, intercept, addition);
          if (query_right > middle) transform(node * 2 + 1, middle + 1, right, query_left, query_right, slope, intercept, addition);
          pull(node);
      }
      void point_assign(int position, long long value) { point_assign(1, 1, n, position, value); }
      long long point_query(int position) { return point_query(1, 1, n, position); }
      void transform(int left, int right, long long slope, long long intercept, long long addition) {
          if (left <= right) transform(1, 1, n, left, right, slope, intercept, addition);
      }
  };
  struct Range { int left = 1, right = 0; };
  vector<long long> directional_cost(const vector<long long>& height, const vector<Range>& ranges,
                                     bool prefer_rightmost_maximum) {
      int n = static_cast<int>(height.size()) - 1, q = static_cast<int>(ranges.size());
      vector<vector<pair<int, int>>> requests(static_cast<size_t>(n) + 1U);
      for (int i = 0; i < q; ++i) if (ranges[static_cast<size_t>(i)].left <= ranges[static_cast<size_t>(i)].right)
          requests[static_cast<size_t>(ranges[static_cast<size_t>(i)].left)].push_back({ranges[static_cast<size_t>(i)].right, i});
      vector<int> left_child(static_cast<size_t>(n) + 1U), right_child(static_cast<size_t>(n) + 1U), parent(static_cast<size_t>(n) + 1U), stack_nodes;
      for (int i = 1; i <= n; ++i) {
          int last = 0;
          while (!stack_nodes.empty() &&
                 (height[static_cast<size_t>(stack_nodes.back())] < height[static_cast<size_t>(i)] ||
                  (prefer_rightmost_maximum &&
                   height[static_cast<size_t>(stack_nodes.back())] == height[static_cast<size_t>(i)]))) {
              last = stack_nodes.back(); stack_nodes.pop_back();
          }
          left_child[static_cast<size_t>(i)] = last;
          if (last != 0) parent[static_cast<size_t>(last)] = i;
          if (!stack_nodes.empty()) { right_child[static_cast<size_t>(stack_nodes.back())] = i; parent[static_cast<size_t>(i)] = stack_nodes.back(); }
          stack_nodes.push_back(i);
      }
      int root = stack_nodes.front();
      vector<int> postorder;
      struct Frame { int node, state; };
      vector<Frame> traversal{{root, 0}};
      while (!traversal.empty()) {
          Frame& frame = traversal.back();
          if (frame.state == 0) { frame.state = 1; if (left_child[static_cast<size_t>(frame.node)] != 0) traversal.push_back({left_child[static_cast<size_t>(frame.node)], 0}); }
          else if (frame.state == 1) { frame.state = 2; if (right_child[static_cast<size_t>(frame.node)] != 0) traversal.push_back({right_child[static_cast<size_t>(frame.node)], 0}); }
          else { postorder.push_back(frame.node); traversal.pop_back(); }
      }
      vector<int> left_bound(static_cast<size_t>(n) + 1U), right_bound(static_cast<size_t>(n) + 1U);
      for (int node : postorder) {
          left_bound[static_cast<size_t>(node)] = left_child[static_cast<size_t>(node)] == 0
              ? node : left_bound[static_cast<size_t>(left_child[static_cast<size_t>(node)])];
          right_bound[static_cast<size_t>(node)] = right_child[static_cast<size_t>(node)] == 0
              ? node : right_bound[static_cast<size_t>(right_child[static_cast<size_t>(node)])];
      }
      DpSegmentTree tree(n);
      vector<long long> result(static_cast<size_t>(q));
      for (int node : postorder) {
          long long value = height[static_cast<size_t>(node)];
          if (left_child[static_cast<size_t>(node)] != 0) value += tree.point_query(node - 1);
          tree.point_assign(node, value);
          if (node < right_bound[static_cast<size_t>(node)])
              tree.transform(node + 1, right_bound[static_cast<size_t>(node)],
                             height[static_cast<size_t>(node)],
                             value - height[static_cast<size_t>(node)] * node,
                             height[static_cast<size_t>(node)] * (node - left_bound[static_cast<size_t>(node)] + 1LL));
          if (parent[static_cast<size_t>(node)] == 0 ||
              right_child[static_cast<size_t>(parent[static_cast<size_t>(node)])] == node)
              for (auto [right, index] : requests[static_cast<size_t>(left_bound[static_cast<size_t>(node)])])
                  result[static_cast<size_t>(index)] = tree.point_query(right);
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, q;
      cin >> n >> q;
      vector<long long> height(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) cin >> height[static_cast<size_t>(i)];
      vector<int> left(static_cast<size_t>(q)), right(static_cast<size_t>(q));
      int levels = 1; while ((1 << levels) <= n) ++levels;
      vector<vector<int>> table(static_cast<size_t>(levels), vector<int>(static_cast<size_t>(n) + 1U));
      for (int i = 1; i <= n; ++i) table[0][static_cast<size_t>(i)] = i;
      auto better = [&](int x, int y) {
          if (height[static_cast<size_t>(x)] != height[static_cast<size_t>(y)])
              return height[static_cast<size_t>(x)] > height[static_cast<size_t>(y)] ? x : y;
          return max(x, y);
      };
      for (int level = 1; level < levels; ++level)
          for (int i = 1; i + (1 << level) - 1 <= n; ++i)
              table[static_cast<size_t>(level)][static_cast<size_t>(i)] =
                  better(table[static_cast<size_t>(level - 1)][static_cast<size_t>(i)],
                         table[static_cast<size_t>(level - 1)][static_cast<size_t>(i + (1 << (level - 1)))]);
      vector<int> logarithm(static_cast<size_t>(n) + 1U);
      for (int i = 2; i <= n; ++i) logarithm[static_cast<size_t>(i)] = logarithm[static_cast<size_t>(i / 2)] + 1;
      vector<int> maximum_position(static_cast<size_t>(q));
      vector<Range> right_ranges(static_cast<size_t>(q)), reversed_left_ranges(static_cast<size_t>(q));
      vector<long long> right_base(static_cast<size_t>(q)), left_base(static_cast<size_t>(q));
      for (int i = 0; i < q; ++i) {
          cin >> left[static_cast<size_t>(i)] >> right[static_cast<size_t>(i)];
          ++left[static_cast<size_t>(i)]; ++right[static_cast<size_t>(i)];
          int length = right[static_cast<size_t>(i)] - left[static_cast<size_t>(i)] + 1;
          int level = logarithm[static_cast<size_t>(length)];
          int p = better(table[static_cast<size_t>(level)][static_cast<size_t>(left[static_cast<size_t>(i)])],
                         table[static_cast<size_t>(level)][static_cast<size_t>(right[static_cast<size_t>(i)] - (1 << level) + 1)]);
          maximum_position[static_cast<size_t>(i)] = p;
          right_ranges[static_cast<size_t>(i)] = {p + 1, right[static_cast<size_t>(i)]};
          reversed_left_ranges[static_cast<size_t>(i)] = {n - p + 2, n - left[static_cast<size_t>(i)] + 1};
          right_base[static_cast<size_t>(i)] = (p - left[static_cast<size_t>(i)] + 1LL) * height[static_cast<size_t>(p)];
          left_base[static_cast<size_t>(i)] = (right[static_cast<size_t>(i)] - p + 1LL) * height[static_cast<size_t>(p)];
      }
      vector<long long> right_cost = directional_cost(height, right_ranges, true);
      reverse(height.begin() + 1, height.end());
      vector<long long> left_cost = directional_cost(height, reversed_left_ranges, false);
      for (int i = 0; i < q; ++i)
          cout << min(right_base[static_cast<size_t>(i)] + right_cost[static_cast<size_t>(i)],
                      left_base[static_cast<size_t>(i)] + left_cost[static_cast<size_t>(i)]) << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5044
external_platform: 洛谷
external_problem_id: P5044
external_title: '[IOI 2018] meetings 會議'
external_relation: original
source_book_pages: [363, 376]
source_pdf_pages: [381, 394]
review_status: verified
---

這題的關鍵不是逐問選會場，而是把所有詢問依區間最高點掛到笛卡兒樹，批次維護單側 DP。
