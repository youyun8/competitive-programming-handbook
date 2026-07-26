---
id: luogu-p4592
volume: upper
source_file: upper-volume
title: 洛谷 P4592 異或：子樹與路徑可持久化 Trie
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 5
topics: [persistent-trie, xor, lca, euler-tour]
prerequisites: [persistent-data-structure, lowest-common-ancestor]
statement: 給定以 1 為根的帶點權樹。詢問 1 x y：在 x 子樹選一點，使其權值與 y 的 XOR 最大；詢問 2 x y z：在 x-y 路徑選一點，使其權值與 z 的 XOR 最大。
constraints: ['1 <= n, q <= 100000', '查詢值不超過 2^30', '點權為非負整數']
input_format: 第一行 n、q；第二行 n 個點權；接著 n-1 條邊；最後 q 行兩類詢問。
output_format: 每個詢問輸出一行最大 XOR 值。
samples:
  - input: |
      3 3
      1 2 7
      1 2
      1 3
      1 1 4
      2 2 3 4
      1 2 3
    output: |
      6
      6
      1
    explanation: 根子樹中 2 xor 4=6 最大；路徑 2-1-3 中同樣選權值 2；節點 2 子樹只有權值 2，與 3 XOR 為 1。
core_knowledge: [DFS 序子樹前綴差, 根路徑可持久化 01-Trie, LCA 路徑容斥]
judgment: 題目要輸出 XOR 結果而非被選的權值；路徑與子樹都包含端點。
hints:
  - 子樹在 DFS 前序中連續，兩個「序列前綴 Trie」相減即可表示子樹多重集合。
  - 另為每個節點建立從根到該點的版本；x-y 路徑的計數是 root[x]+root[y]-root[lca]-root[parent(lca)]。
  - 從最高位往下，若與查詢位相反的分支在容斥後計數大於零，就貪心走該分支。
solution_outline: 建 DFS 序、子樹大小與倍增 LCA。同時建立 DFS 前綴 Trie 版本及每點根路徑 Trie 版本。兩類詢問都以版本計數差做逐位貪心。
proof_or_invariant: 可持久化版本的 count 是對應前綴中每個 bit 前綴的元素數。DFS 區間差精確表示子樹；四版本樹上容斥精確表示簡單路徑。逐位優先選相反 bit 是字典序最大二進位值，故得到最大 XOR。
common_errors: [路徑容斥把 LCA 扣兩次而漏回其權值, DFS 次序不是前序導致子樹不連續, 只處理到第 29 位]
complexity: { time: '預處理與每次詢問 O(log V+log n)', space: 'O(n log V+n log n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：兩組可持久化 01-Trie：DFS 前綴與根路徑版本。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  struct PersistentTrie {
      struct Node { int child[2] = {0, 0}; int count = 0; };
      vector<Node> nodes{Node{}};
      int insert(int previous, int value) {
          const int root = clone(previous); int current = root;
          for (int bit = 30; bit >= 0; --bit) {
              const int side = (value >> bit) & 1, old_child = nodes[static_cast<size_t>(previous)].child[side];
              const int new_child = clone(old_child);
              nodes[static_cast<size_t>(current)].child[side] = new_child;
              previous = old_child; current = new_child;
          }
          return root;
      }
      int clone(int source) { nodes.push_back(nodes[static_cast<size_t>(source)]); ++nodes.back().count; return static_cast<int>(nodes.size()) - 1; }
      int query_interval(int left_root, int right_root, int value) const {
          int answer = 0;
          for (int bit = 30; bit >= 0; --bit) {
              const int side = (value >> bit) & 1, wanted = side ^ 1;
              const int left_child = nodes[static_cast<size_t>(left_root)].child[wanted];
              const int right_child = nodes[static_cast<size_t>(right_root)].child[wanted];
              if (nodes[static_cast<size_t>(right_child)].count > nodes[static_cast<size_t>(left_child)].count) {
                  answer |= 1 << bit; left_root = left_child; right_root = right_child;
              } else {
                  left_root = nodes[static_cast<size_t>(left_root)].child[side];
                  right_root = nodes[static_cast<size_t>(right_root)].child[side];
              }
          }
          return answer;
      }
      int query_path(int a, int b, int c, int d, int value) const {
          int answer = 0;
          for (int bit = 30; bit >= 0; --bit) {
              const int side = (value >> bit) & 1, wanted = side ^ 1;
              auto child = [&](int node, int direction) { return nodes[static_cast<size_t>(node)].child[direction]; };
              const int count = nodes[static_cast<size_t>(child(a, wanted))].count +
                                nodes[static_cast<size_t>(child(b, wanted))].count -
                                nodes[static_cast<size_t>(child(c, wanted))].count -
                                nodes[static_cast<size_t>(child(d, wanted))].count;
              const int direction = count > 0 ? wanted : side;
              if (count > 0) answer |= 1 << bit;
              a = child(a, direction); b = child(b, direction); c = child(c, direction); d = child(d, direction);
          }
          return answer;
      }
  };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, q; cin >> n >> q;
      vector<int> value(static_cast<size_t>(n) + 1U); for (int i = 1; i <= n; ++i) cin >> value[static_cast<size_t>(i)];
      vector<vector<int>> graph(static_cast<size_t>(n) + 1U);
      for (int i = 1; i < n; ++i) { int u, v; cin >> u >> v; graph[static_cast<size_t>(u)].push_back(v); graph[static_cast<size_t>(v)].push_back(u); }
      vector<int> parent(static_cast<size_t>(n) + 1U), depth(static_cast<size_t>(n) + 1U), order;
      vector<int> stack{1}; parent[1] = 0; depth[1] = 1;
      while (!stack.empty()) { int node = stack.back(); stack.pop_back(); order.push_back(node); for (auto it = graph[static_cast<size_t>(node)].rbegin(); it != graph[static_cast<size_t>(node)].rend(); ++it) if (*it != parent[static_cast<size_t>(node)]) { parent[static_cast<size_t>(*it)] = node; depth[static_cast<size_t>(*it)] = depth[static_cast<size_t>(node)] + 1; stack.push_back(*it); } }
      vector<int> position(static_cast<size_t>(n) + 1U), subtree_size(static_cast<size_t>(n) + 1U, 1);
      for (int i = 0; i < n; ++i) position[static_cast<size_t>(order[static_cast<size_t>(i)])] = i + 1;
      for (size_t i = order.size(); i-- > 1;) subtree_size[static_cast<size_t>(parent[static_cast<size_t>(order[i])])] += subtree_size[static_cast<size_t>(order[i])];
      int levels = 1; while ((1 << levels) <= n) ++levels;
      vector<vector<int>> ancestor(static_cast<size_t>(levels), vector<int>(static_cast<size_t>(n) + 1U)); ancestor[0] = parent;
      for (int level = 1; level < levels; ++level) for (int node = 1; node <= n; ++node) ancestor[static_cast<size_t>(level)][static_cast<size_t>(node)] = ancestor[static_cast<size_t>(level - 1)][static_cast<size_t>(ancestor[static_cast<size_t>(level - 1)][static_cast<size_t>(node)])];
      auto lca = [&](int x, int y) { if (depth[static_cast<size_t>(x)] < depth[static_cast<size_t>(y)]) swap(x, y); int difference = depth[static_cast<size_t>(x)] - depth[static_cast<size_t>(y)]; for (int level = 0; level < levels; ++level) if ((difference >> level) & 1) x = ancestor[static_cast<size_t>(level)][static_cast<size_t>(x)]; if (x == y) return x; for (int level = levels - 1; level >= 0; --level) if (ancestor[static_cast<size_t>(level)][static_cast<size_t>(x)] != ancestor[static_cast<size_t>(level)][static_cast<size_t>(y)]) { x = ancestor[static_cast<size_t>(level)][static_cast<size_t>(x)]; y = ancestor[static_cast<size_t>(level)][static_cast<size_t>(y)]; } return parent[static_cast<size_t>(x)]; };
      PersistentTrie euler_trie, path_trie;
      euler_trie.nodes.reserve(static_cast<size_t>(n) * 32U + 1U); path_trie.nodes.reserve(static_cast<size_t>(n) * 32U + 1U);
      vector<int> euler_root(static_cast<size_t>(n) + 1U), path_root(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) { const int node = order[static_cast<size_t>(i - 1)]; euler_root[static_cast<size_t>(i)] = euler_trie.insert(euler_root[static_cast<size_t>(i - 1)], value[static_cast<size_t>(node)]); path_root[static_cast<size_t>(node)] = path_trie.insert(path_root[static_cast<size_t>(parent[static_cast<size_t>(node)])], value[static_cast<size_t>(node)]); }
      while (q--) {
          int type, x, y; cin >> type >> x >> y;
          if (type == 1) { int left = position[static_cast<size_t>(x)] - 1, right = position[static_cast<size_t>(x)] + subtree_size[static_cast<size_t>(x)] - 1; cout << euler_trie.query_interval(euler_root[static_cast<size_t>(left)], euler_root[static_cast<size_t>(right)], y) << '\n'; }
          else { int z; cin >> z; int common = lca(x, y); cout << path_trie.query_path(path_root[static_cast<size_t>(x)], path_root[static_cast<size_t>(y)], path_root[static_cast<size_t>(common)], path_root[static_cast<size_t>(parent[static_cast<size_t>(common)])], z) << '\n'; }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4592
external_platform: 洛谷
external_problem_id: P4592
external_title: '[TJOI2018] 異或'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

同一棵可持久化 01-Trie，只要選對版本差，就能同時描述 DFS 子樹區間與樹上簡單路徑。
