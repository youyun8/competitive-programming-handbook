---
id: luogu-p4069
volume: upper
source_file: upper-volume
title: 洛谷 P4069 遊戲：樹路徑區間李超樹
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 5
topics: [heavy-light-decomposition, li-chao-tree, line-container]
prerequisites: [heavy-light-decomposition, li-chao-tree]
statement: 加權樹上每點初始有數字 123456789123456789。操作 1 s t a b：對 s-t 路徑每點 r 新增數字 a×dist(s,r)+b；操作 2 s t：在路徑所有點已新增的所有數字中求最小值。
constraints: ['1 <= n,m <= 100000', '|a| <= 10000', '0 <= 邊長 <= 1000000000', '|b| <= 1000000000']
input_format: 第一行 n、m；接著 n-1 行 u、v、w；最後 m 行兩類操作。
output_format: 每個操作 2 輸出一行最小可選數字。
samples:
  - input: |
      2 5
      1 2 3
      2 1 2
      1 1 2 2 5
      2 1 2
      1 2 1 -1 4
      2 1 2
    output: |
      123456789123456789
      5
      1
    explanation: 第一次新增在節點 1、2 分別為 5、11；第二次從節點 2 出發新增 4、1，故三次查詢最小值依序為初值、5、1。
core_knowledge: [路徑等差值轉一次函數, LCA 拆上下行, 區間插線段與區間最小查詢]
judgment: 每次是新增一個候選數字，不是修改或累加舊數字；距離使用邊長和而非邊數。
hints:
  - 設 d_x 為根距離。s 到 LCA 的點 r 有 `dist(s,r)=d_s-d_r`，是一條斜率 -a 的直線。
  - LCA 到 t 的點 r 有 `dist(s,r)=d_s+d_r-2d_lca`，是一條斜率 +a 的直線。
  - 樹剖把兩段拆成 DFS 序區間；在線段樹做區間插入直線，每個節點以李超規則保留較優直線並維護子樹最小值。
solution_outline: 以根距離作 x 座標。每次更新在 LCA 兩側分別建立兩條直線並沿重鏈做區間插入；區間李超線段樹支援範圍插線與範圍最小查詢。
proof_or_invariant: 兩條直線在各自半路徑上的值逐點等於題定 a×dist+b。樹剖區間完整覆蓋路徑；李超不變量保證每個座標保留所有已插入直線的最小值，區間最小聚合後即 Bob 可選的最小數字。
common_errors: [把新增數字誤當路徑加值, 下行截距漏掉 `-2*d_lca`, 以 DFS 編號而非根距離代入直線, 乘法使用 32 位元]
complexity: { time: '每次 O(log^3 n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：樹剖拆路徑，區間李超樹插入根距離的一次函數。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;
  constexpr long long infinity = 123456789123456789LL;
  struct Line {
      long long slope = 0, intercept = infinity;
      long long value(long long x) const {
          return slope * x + intercept;
      }
  };
  struct LiChaoSegmentTree {
      int n; const vector<long long>& coordinate; vector<Line> line; vector<long long> minimum;
      LiChaoSegmentTree(int size, const vector<long long>& x)
          : n(size), coordinate(x), line(static_cast<size_t>(4 * size)), minimum(static_cast<size_t>(4 * size), infinity) {}
      void pull(int node, int left, int right) {
          long long result = min(line[static_cast<size_t>(node)].value(coordinate[static_cast<size_t>(left)]),
                                 line[static_cast<size_t>(node)].value(coordinate[static_cast<size_t>(right)]));
          if (left != right) result = min(result, min(minimum[static_cast<size_t>(node * 2)], minimum[static_cast<size_t>(node * 2 + 1)]));
          minimum[static_cast<size_t>(node)] = result;
      }
      void insert_line(int node, int left, int right, Line candidate) {
          int middle = (left + right) / 2;
          if (candidate.value(coordinate[static_cast<size_t>(middle)]) <
              line[static_cast<size_t>(node)].value(coordinate[static_cast<size_t>(middle)]))
              swap(candidate, line[static_cast<size_t>(node)]);
          if (left != right) {
              if (candidate.value(coordinate[static_cast<size_t>(left)]) <
                  line[static_cast<size_t>(node)].value(coordinate[static_cast<size_t>(left)]))
                  insert_line(node * 2, left, middle, candidate);
              else if (candidate.value(coordinate[static_cast<size_t>(right)]) <
                       line[static_cast<size_t>(node)].value(coordinate[static_cast<size_t>(right)]))
                  insert_line(node * 2 + 1, middle + 1, right, candidate);
          }
          pull(node, left, right);
      }
      void insert_range(int node, int left, int right, int query_left, int query_right, Line value) {
          if (query_left <= left && right <= query_right) { insert_line(node, left, right, value); return; }
          int middle = (left + right) / 2;
          if (query_left <= middle) insert_range(node * 2, left, middle, query_left, query_right, value);
          if (query_right > middle) insert_range(node * 2 + 1, middle + 1, right, query_left, query_right, value);
          pull(node, left, right);
      }
      long long query(int node, int left, int right, int query_left, int query_right) const {
          if (query_left <= left && right <= query_right) return minimum[static_cast<size_t>(node)];
          const int overlap_left = max(left, query_left), overlap_right = min(right, query_right);
          long long result = min(line[static_cast<size_t>(node)].value(coordinate[static_cast<size_t>(overlap_left)]),
                                 line[static_cast<size_t>(node)].value(coordinate[static_cast<size_t>(overlap_right)]));
          int middle = (left + right) / 2;
          if (query_left <= middle) result = min(result, query(node * 2, left, middle, query_left, query_right));
          if (query_right > middle) result = min(result, query(node * 2 + 1, middle + 1, right, query_left, query_right));
          return result;
      }
      void insert_range(int left, int right, Line value) { insert_range(1, 1, n, left, right, value); }
      long long query(int left, int right) const { return query(1, 1, n, left, right); }
  };
  struct Edge { int to; long long weight; };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, m; cin >> n >> m;
      vector<vector<Edge>> graph(static_cast<size_t>(n) + 1U);
      for (int i = 1; i < n; ++i) { int u, v; long long w; cin >> u >> v >> w; graph[static_cast<size_t>(u)].push_back({v, w}); graph[static_cast<size_t>(v)].push_back({u, w}); }
      vector<int> parent(static_cast<size_t>(n) + 1U), depth(static_cast<size_t>(n) + 1U), order{1}; vector<long long> distance(static_cast<size_t>(n) + 1U); depth[1] = 1;
      for (size_t i = 0; i < order.size(); ++i) for (const Edge& edge : graph[static_cast<size_t>(order[i])]) if (edge.to != parent[static_cast<size_t>(order[i])]) { parent[static_cast<size_t>(edge.to)] = order[i]; depth[static_cast<size_t>(edge.to)] = depth[static_cast<size_t>(order[i])] + 1; distance[static_cast<size_t>(edge.to)] = distance[static_cast<size_t>(order[i])] + edge.weight; order.push_back(edge.to); }
      vector<int> size(static_cast<size_t>(n) + 1U, 1), heavy(static_cast<size_t>(n) + 1U);
      for (size_t i = order.size(); i-- > 0;) for (const Edge& edge : graph[static_cast<size_t>(order[i])]) if (parent[static_cast<size_t>(edge.to)] == order[i]) { size[static_cast<size_t>(order[i])] += size[static_cast<size_t>(edge.to)]; if (size[static_cast<size_t>(edge.to)] > size[static_cast<size_t>(heavy[static_cast<size_t>(order[i])])]) heavy[static_cast<size_t>(order[i])] = edge.to; }
      vector<int> head(static_cast<size_t>(n) + 1U), position(static_cast<size_t>(n) + 1U); vector<long long> coordinate(static_cast<size_t>(n) + 1U); vector<pair<int, int>> stack{{1, 1}}; int timer = 0;
      while (!stack.empty()) { auto [start, chain_head] = stack.back(); stack.pop_back(); for (int node = start; node != 0; node = heavy[static_cast<size_t>(node)]) { head[static_cast<size_t>(node)] = chain_head; position[static_cast<size_t>(node)] = ++timer; coordinate[static_cast<size_t>(timer)] = distance[static_cast<size_t>(node)]; for (const Edge& edge : graph[static_cast<size_t>(node)]) if (parent[static_cast<size_t>(edge.to)] == node && edge.to != heavy[static_cast<size_t>(node)]) stack.push_back({edge.to, edge.to}); } }
      auto lca = [&](int x, int y) { while (head[static_cast<size_t>(x)] != head[static_cast<size_t>(y)]) { if (depth[static_cast<size_t>(head[static_cast<size_t>(x)])] < depth[static_cast<size_t>(head[static_cast<size_t>(y)])]) swap(x, y); x = parent[static_cast<size_t>(head[static_cast<size_t>(x)])]; } return depth[static_cast<size_t>(x)] < depth[static_cast<size_t>(y)] ? x : y; };
      LiChaoSegmentTree tree(n, coordinate);
      auto path_insert = [&](int node, int ancestor, Line line) { while (head[static_cast<size_t>(node)] != head[static_cast<size_t>(ancestor)]) { tree.insert_range(position[static_cast<size_t>(head[static_cast<size_t>(node)])], position[static_cast<size_t>(node)], line); node = parent[static_cast<size_t>(head[static_cast<size_t>(node)])]; } tree.insert_range(position[static_cast<size_t>(ancestor)], position[static_cast<size_t>(node)], line); };
      auto path_query = [&](int x, int y) { long long result = infinity; while (head[static_cast<size_t>(x)] != head[static_cast<size_t>(y)]) { if (depth[static_cast<size_t>(head[static_cast<size_t>(x)])] < depth[static_cast<size_t>(head[static_cast<size_t>(y)])]) swap(x, y); result = min(result, tree.query(position[static_cast<size_t>(head[static_cast<size_t>(x)])], position[static_cast<size_t>(x)])); x = parent[static_cast<size_t>(head[static_cast<size_t>(x)])]; } if (position[static_cast<size_t>(x)] > position[static_cast<size_t>(y)]) swap(x, y); return min(result, tree.query(position[static_cast<size_t>(x)], position[static_cast<size_t>(y)])); };
      while (m--) {
          int type, s, t; cin >> type >> s >> t;
          if (type == 1) { long long a, b; cin >> a >> b; int common = lca(s, t); path_insert(s, common, {-a, a * distance[static_cast<size_t>(s)] + b}); path_insert(t, common, {a, a * (distance[static_cast<size_t>(s)] - 2 * distance[static_cast<size_t>(common)]) + b}); }
          else cout << path_query(s, t) << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4069
external_platform: 洛谷
external_problem_id: P4069
external_title: '[SDOI2016] 遊戲'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

路徑上的等差距離值在 LCA 兩側各是一條根距離的一次函數；樹剖負責範圍，李超樹負責函數最小值。
