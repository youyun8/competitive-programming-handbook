---
id: luogu-p3038
volume: upper
source_file: upper-volume
title: 洛谷 P3038 Grass Planting：樹路徑加與單邊查詢
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 3
topics: [heavy-light-decomposition, fenwick-tree, edge-weight]
prerequisites: [heavy-light-decomposition, fenwick-tree]
statement: 給定一棵樹，所有邊初始皆有 0 片草。`P u v` 會在 u 到 v 路徑的每條邊增加一片草；`Q u v` 查詢直接相連的 u、v 之間那條邊目前有幾片草。
constraints: ['2 <= n <= 100000', '1 <= m <= 100000', 'Q 操作的兩個端點保證直接相連']
input_format: 第一行 n、m；接著 n-1 條邊；再接 m 行 `P u v` 或 `Q u v`。
output_format: 每個 Q 操作輸出一行該邊的草片數。
samples:
  - input: |
      4 5
      1 2
      2 3
      2 4
      P 1 3
      Q 1 2
      P 4 3
      Q 2 3
      Q 2 4
    output: |
      1
      2
      1
    explanation: 第一次種草經過邊 1-2、2-3；第二次經過 4-2、2-3，所以三次查詢依序得到 1、2、1。
core_knowledge: [以較深端點代表父子邊, 重鏈剖分路徑區間加, Fenwick 差分支援區間加單點查]
judgment: P 操作不增加最近公共祖先對應的父邊；Q 查的是一條邊而非整段路徑。
hints:
  - 任意非根節點 x 可代表邊 `(parent[x],x)`，其位置就是 x 的 DFS 序。
  - 跳重鏈時整段 `[pos[head],pos[x]]` 都是路徑邊；最後同鏈要排除較淺端點。
  - 只需查單邊，對每個剖分區間做差分區間加，查詢較深端點的單點值即可。
solution_outline: 重鏈剖分後以子節點位置存父邊權。P 將路徑拆成區間並用 Fenwick 差分加一；Q 選深度較大的端點並查其位置。
proof_or_invariant: 每條樹邊唯一對應其較深端點。剖分過程處理的區間恰涵蓋路徑上所有較深端點，且同鏈最後排除 LCA，因此每條路徑邊恰加一次；單點前綴和即該邊累計值。
common_errors: [把 LCA 的位置也加一, Q 時查較淺端點, 忘記 Fenwick 區間右端加一處減值]
complexity: { time: 'P 為 O(log^2 n)，Q 為 O(log n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      cin >> n >> m;
      // TODO：重鏈剖分，並以較深端點代表一條邊。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;

  struct Fenwick {
      vector<int> bit;
      explicit Fenwick(int n) : bit(static_cast<size_t>(n) + 2U) {}
      void add(int index, int value) {
          for (int n = static_cast<int>(bit.size()); index < n; index += index & -index)
              bit[static_cast<size_t>(index)] += value;
      }
      void range_add(int left, int right) {
          if (left > right) return;
          add(left, 1);
          add(right + 1, -1);
      }
      int point(int index) const {
          int result = 0;
          for (; index > 0; index -= index & -index) result += bit[static_cast<size_t>(index)];
          return result;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      cin >> n >> m;
      vector<vector<int>> graph(static_cast<size_t>(n) + 1U);
      for (int i = 1; i < n; ++i) {
          int u, v;
          cin >> u >> v;
          graph[static_cast<size_t>(u)].push_back(v);
          graph[static_cast<size_t>(v)].push_back(u);
      }
      vector<int> parent(static_cast<size_t>(n) + 1U), depth(static_cast<size_t>(n) + 1U);
      vector<int> order{1};
      depth[1] = 1;
      for (size_t index = 0; index < order.size(); ++index) {
          const int node = order[index];
          for (int next : graph[static_cast<size_t>(node)]) {
              if (next == parent[static_cast<size_t>(node)]) continue;
              parent[static_cast<size_t>(next)] = node;
              depth[static_cast<size_t>(next)] = depth[static_cast<size_t>(node)] + 1;
              order.push_back(next);
          }
      }
      vector<int> size(static_cast<size_t>(n) + 1U, 1), heavy(static_cast<size_t>(n) + 1U);
      for (size_t index = order.size(); index-- > 0;) {
          const int node = order[index];
          for (int next : graph[static_cast<size_t>(node)]) {
              if (parent[static_cast<size_t>(next)] != node) continue;
              size[static_cast<size_t>(node)] += size[static_cast<size_t>(next)];
              if (size[static_cast<size_t>(next)] > size[static_cast<size_t>(heavy[static_cast<size_t>(node)])])
                  heavy[static_cast<size_t>(node)] = next;
          }
      }
      vector<int> head(static_cast<size_t>(n) + 1U), position(static_cast<size_t>(n) + 1U);
      vector<pair<int, int>> stack{{1, 1}};
      int timer = 0;
      while (!stack.empty()) {
          auto [start, chain_head] = stack.back();
          stack.pop_back();
          for (int node = start; node != 0; node = heavy[static_cast<size_t>(node)]) {
              head[static_cast<size_t>(node)] = chain_head;
              position[static_cast<size_t>(node)] = ++timer;
              for (int next : graph[static_cast<size_t>(node)])
                  if (parent[static_cast<size_t>(next)] == node && next != heavy[static_cast<size_t>(node)])
                      stack.push_back({next, next});
          }
      }
      Fenwick fenwick(n + 1);
      auto path_add = [&](int x, int y) {
          while (head[static_cast<size_t>(x)] != head[static_cast<size_t>(y)]) {
              if (depth[static_cast<size_t>(head[static_cast<size_t>(x)])] <
                  depth[static_cast<size_t>(head[static_cast<size_t>(y)])]) swap(x, y);
              fenwick.range_add(position[static_cast<size_t>(head[static_cast<size_t>(x)])],
                                position[static_cast<size_t>(x)]);
              x = parent[static_cast<size_t>(head[static_cast<size_t>(x)])];
          }
          if (depth[static_cast<size_t>(x)] > depth[static_cast<size_t>(y)]) swap(x, y);
          fenwick.range_add(position[static_cast<size_t>(x)] + 1, position[static_cast<size_t>(y)]);
      };
      while (m--) {
          char operation;
          int u, v;
          cin >> operation >> u >> v;
          if (operation == 'P') path_add(u, v);
          else {
              if (depth[static_cast<size_t>(u)] < depth[static_cast<size_t>(v)]) swap(u, v);
              cout << fenwick.point(position[static_cast<size_t>(u)]) << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3038
external_platform: 洛谷
external_problem_id: P3038
external_title: '[USACO11DEC] Grass Planting G'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

把邊權下放到子節點後，樹上邊操作就能沿用點版重鏈剖分，只需牢記排除 LCA。
