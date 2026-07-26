---
id: luogu-p3313
volume: upper
source_file: upper-volume
title: 洛谷 P3313 旅行：依信仰分組的樹路徑查詢
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 5
topics: [heavy-light-decomposition, dynamic-segment-tree, color]
prerequisites: [heavy-light-decomposition, dynamic-segment-tree]
statement: 每座城市有評級與信仰。支援城市改信仰、修改評級；旅行查詢 x-y 路徑上與起點 x 信仰相同城市的評級總和或最大值。查詢保證兩端信仰相同。
constraints: ['1 <= n,q,C <= 100000', '評級始終是 <=10000 的正整數', 'QS/QM 的兩端信仰相同']
input_format: 第一行 n、q；接著 n 行評級 W_i、信仰 C_i；再給 n-1 條邊與 q 行 `CC x c`、`CW x w`、`QS x y`、`QM x y`。
output_format: 每個 QS/QM 分別輸出符合信仰的評級和/最大值。
samples:
  - input: |
      5 6
      3 1
      2 3
      1 2
      3 3
      5 1
      1 2
      1 3
      3 4
      3 5
      QS 1 5
      CC 3 1
      QS 1 5
      CW 3 3
      QS 1 5
      QM 2 4
    output: |
      8
      9
      11
      3
    explanation: 路徑 1-3-5 初始只有信仰 1 的城市 1、5，和為 8；城市 3 改信後依序使總和變 9，再調評級後變 11。
core_knowledge: [樹剖路徑拆段, 每種信仰一棵動態線段樹, 單點刪除與插入]
judgment: 查詢篩選的是起點當下的信仰；CC 必須先從舊信仰資料結構刪除，CW 只改目前信仰中的值。
hints:
  - 樹剖後，路徑查詢變成若干 DFS 序區間，但每段只應統計指定信仰。
  - 為每種信仰維護一棵以 DFS 序為座標的線段樹；節點只在需要時建立，總空間與實際單點更新次數成對數倍。
  - 葉節點存該位置評級（不存在為 0），父節點同時維護 sum 與 maximum。
solution_outline: 重鏈剖分全樹。每個信仰有一個動態開點線段樹根；初始化插入所有城市。修改做單點更新，查詢沿樹鏈在指定信仰根上累加 sum 或 max。
proof_or_invariant: 每個信仰線段樹在位置 pos[u] 非零當且僅當 u 目前屬於該信仰，且值為評級。重鏈區間聯集恰為查詢路徑，因此在指定根查詢並合併，精確得到符合信仰城市的總和或最大值。
common_errors: [CC 未清除舊信仰位置, 把查詢終點信仰當篩選條件, 動態空節點查詢時繼續遞迴, 節點池估得太小]
complexity: { time: '修改 O(log n)，查詢 O(log^2 n)', space: 'O((n+q)log n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：樹剖；每種信仰建立動態開點 sum/max 線段樹。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <utility>
  #include <vector>
  using namespace std;
  struct DynamicTrees {
      struct Node { int left = 0, right = 0, sum = 0, maximum = 0; };
      int n; vector<Node> nodes{Node{}};
      explicit DynamicTrees(int size) : n(size) { nodes.reserve(static_cast<size_t>(size) * 35U); }
      void update(int& node, int left, int right, int position, int value) {
          if (node == 0) { node = static_cast<int>(nodes.size()); nodes.push_back(Node{}); }
          if (left == right) { nodes[static_cast<size_t>(node)].sum = nodes[static_cast<size_t>(node)].maximum = value; return; }
          int middle = (left + right) / 2;
          if (position <= middle) { int child = nodes[static_cast<size_t>(node)].left; update(child, left, middle, position, value); nodes[static_cast<size_t>(node)].left = child; }
          else { int child = nodes[static_cast<size_t>(node)].right; update(child, middle + 1, right, position, value); nodes[static_cast<size_t>(node)].right = child; }
          const Node& a = nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].left)];
          const Node& b = nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].right)];
          nodes[static_cast<size_t>(node)].sum = a.sum + b.sum; nodes[static_cast<size_t>(node)].maximum = max(a.maximum, b.maximum);
      }
      pair<int, int> query(int node, int left, int right, int query_left, int query_right) const {
          if (node == 0 || query_right < left || right < query_left) return {0, 0};
          if (query_left <= left && right <= query_right) return {nodes[static_cast<size_t>(node)].sum, nodes[static_cast<size_t>(node)].maximum};
          int middle = (left + right) / 2;
          auto a = query(nodes[static_cast<size_t>(node)].left, left, middle, query_left, query_right);
          auto b = query(nodes[static_cast<size_t>(node)].right, middle + 1, right, query_left, query_right);
          return {a.first + b.first, max(a.second, b.second)};
      }
  };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, q; cin >> n >> q;
      vector<int> rating(static_cast<size_t>(n) + 1U), religion(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) cin >> rating[static_cast<size_t>(i)] >> religion[static_cast<size_t>(i)];
      vector<vector<int>> graph(static_cast<size_t>(n) + 1U);
      for (int i = 1; i < n; ++i) { int u, v; cin >> u >> v; graph[static_cast<size_t>(u)].push_back(v); graph[static_cast<size_t>(v)].push_back(u); }
      vector<int> parent(static_cast<size_t>(n) + 1U), depth(static_cast<size_t>(n) + 1U), order{1}; depth[1] = 1;
      for (size_t i = 0; i < order.size(); ++i) for (int next : graph[static_cast<size_t>(order[i])]) if (next != parent[static_cast<size_t>(order[i])]) { parent[static_cast<size_t>(next)] = order[i]; depth[static_cast<size_t>(next)] = depth[static_cast<size_t>(order[i])] + 1; order.push_back(next); }
      vector<int> size(static_cast<size_t>(n) + 1U, 1), heavy(static_cast<size_t>(n) + 1U);
      for (size_t i = order.size(); i-- > 0;) for (int next : graph[static_cast<size_t>(order[i])]) if (parent[static_cast<size_t>(next)] == order[i]) { size[static_cast<size_t>(order[i])] += size[static_cast<size_t>(next)]; if (size[static_cast<size_t>(next)] > size[static_cast<size_t>(heavy[static_cast<size_t>(order[i])])]) heavy[static_cast<size_t>(order[i])] = next; }
      vector<int> head(static_cast<size_t>(n) + 1U), position(static_cast<size_t>(n) + 1U); vector<pair<int, int>> stack{{1, 1}}; int timer = 0;
      while (!stack.empty()) { auto [start, chain_head] = stack.back(); stack.pop_back(); for (int node = start; node != 0; node = heavy[static_cast<size_t>(node)]) { head[static_cast<size_t>(node)] = chain_head; position[static_cast<size_t>(node)] = ++timer; for (int next : graph[static_cast<size_t>(node)]) if (parent[static_cast<size_t>(next)] == node && next != heavy[static_cast<size_t>(node)]) stack.push_back({next, next}); } }
      DynamicTrees trees(n); vector<int> roots(100001);
      for (int node = 1; node <= n; ++node) trees.update(roots[static_cast<size_t>(religion[static_cast<size_t>(node)])], 1, n, position[static_cast<size_t>(node)], rating[static_cast<size_t>(node)]);
      while (q--) {
          string operation; int x, y; cin >> operation >> x >> y;
          if (operation == "CC") {
              trees.update(roots[static_cast<size_t>(religion[static_cast<size_t>(x)])], 1, n, position[static_cast<size_t>(x)], 0);
              religion[static_cast<size_t>(x)] = y;
              trees.update(roots[static_cast<size_t>(y)], 1, n, position[static_cast<size_t>(x)], rating[static_cast<size_t>(x)]);
          } else if (operation == "CW") {
              rating[static_cast<size_t>(x)] = y;
              trees.update(roots[static_cast<size_t>(religion[static_cast<size_t>(x)])], 1, n, position[static_cast<size_t>(x)], y);
          } else {
              int total = 0, best = 0, root = roots[static_cast<size_t>(religion[static_cast<size_t>(x)])];
              while (head[static_cast<size_t>(x)] != head[static_cast<size_t>(y)]) {
                  if (depth[static_cast<size_t>(head[static_cast<size_t>(x)])] < depth[static_cast<size_t>(head[static_cast<size_t>(y)])]) swap(x, y);
                  auto result = trees.query(root, 1, n, position[static_cast<size_t>(head[static_cast<size_t>(x)])], position[static_cast<size_t>(x)]);
                  total += result.first; best = max(best, result.second); x = parent[static_cast<size_t>(head[static_cast<size_t>(x)])];
              }
              if (position[static_cast<size_t>(x)] > position[static_cast<size_t>(y)]) swap(x, y);
              auto result = trees.query(root, 1, n, position[static_cast<size_t>(x)], position[static_cast<size_t>(y)]);
              total += result.first; best = max(best, result.second);
              cout << (operation == "QS" ? total : best) << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3313
external_platform: 洛谷
external_problem_id: P3313
external_title: '[SDOI2014] 旅行'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

「路徑 + 顏色篩選」可視為每個顏色各有一條稀疏序列；動態開點讓十萬棵線段樹只為實際資料付空間。
