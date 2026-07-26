---
id: luogu-p2486
volume: upper
source_file: upper-volume
title: 洛谷 P2486 染色：樹路徑顏色段
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 4
topics: [heavy-light-decomposition, segment-tree, path-order]
prerequisites: [heavy-light-decomposition, segment-tree]
statement: 給定帶顏色點權的無根樹。支援把 a-b 路徑所有點染成顏色 c，以及查詢該路徑依行走順序可分成多少個極長同色連續段。
constraints: ['1 <= n, m <= 100000', '1 <= 初始顏色、更新顏色 <= 1000000000']
input_format: 第一行 n、m；第二行初始顏色；接著 n-1 條邊；最後 m 行 `C a b c` 或 `Q a b`。
output_format: 每個 Q 輸出一行顏色段數。
samples:
  - input: |
      6 5
      2 2 1 2 1 1
      1 2
      1 3
      2 4
      2 5
      2 6
      Q 3 5
      C 2 1 1
      Q 3 5
      C 5 1 2
      Q 3 5
    output: |
      3
      1
      2
    explanation: 初始路徑 3-1-2-5 顏色為 1,2,2,1，共三段；第一次染色後全為 1；第二次染色後形成 1 與 2 兩段。
core_knowledge: [線段樹維護左右端顏色與段數, 路徑區間覆蓋, 有方向的路徑資訊合併]
judgment: 顏色段取決於 a 到 b 的順序；區間資訊反轉時段數不變，但左右端顏色互換。
hints:
  - 一段序列只需保存段數、最左顏色、最右顏色；合併時若接縫同色便少一段。
  - 路徑染色可直接對每個重鏈區間做覆蓋懶標記。
  - 查詢須分別累積 a 端與 b 端；a 端取得的 DFS 區間要反轉，b 端的新區間則放在既有答案之前。
solution_outline: 線段樹節點維護 count、left_color、right_color 與覆蓋標記。樹剖更新逐段覆蓋；查詢以兩個有向累積器合併兩側重鏈，最後接起來。
proof_or_invariant: 線段樹資訊足以正確合併相鄰序列。兩側累積器始終分別表示從原 a 走向當前點、以及從當前點走向原 b 的顏色序列；鏈頭跳躍保持此方向，最後合併即完整路徑，故段數正確。
common_errors: [忽略路徑方向直接相加各鏈段數, 接縫同色未減一, 覆蓋後未把段數設為一]
complexity: { time: '每次 O(log^2 n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：樹剖；線段樹節點保存段數與左右端顏色。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;
  struct Info { int count = 0, left_color = 0, right_color = 0; };
  Info combine(const Info& a, const Info& b) {
      if (a.count == 0) return b;
      if (b.count == 0) return a;
      return {a.count + b.count - (a.right_color == b.left_color ? 1 : 0), a.left_color, b.right_color};
  }
  Info reversed(Info value) { swap(value.left_color, value.right_color); return value; }
  struct SegmentTree {
      int n; vector<Info> tree; vector<int> lazy; const vector<int>& base;
      SegmentTree(int size, const vector<int>& values)
          : n(size), tree(static_cast<size_t>(4 * size)), lazy(static_cast<size_t>(4 * size), -1), base(values) { build(1, 1, n); }
      void apply(int node, int color) { tree[static_cast<size_t>(node)] = {1, color, color}; lazy[static_cast<size_t>(node)] = color; }
      void build(int node, int left, int right) {
          if (left == right) { apply(node, base[static_cast<size_t>(left)]); lazy[static_cast<size_t>(node)] = -1; return; }
          int middle = (left + right) / 2; build(node * 2, left, middle); build(node * 2 + 1, middle + 1, right);
          tree[static_cast<size_t>(node)] = combine(tree[static_cast<size_t>(node * 2)], tree[static_cast<size_t>(node * 2 + 1)]);
      }
      void push(int node) { if (lazy[static_cast<size_t>(node)] != -1) { apply(node * 2, lazy[static_cast<size_t>(node)]); apply(node * 2 + 1, lazy[static_cast<size_t>(node)]); lazy[static_cast<size_t>(node)] = -1; } }
      void assign(int node, int left, int right, int query_left, int query_right, int color) {
          if (query_left <= left && right <= query_right) { apply(node, color); return; }
          push(node); int middle = (left + right) / 2;
          if (query_left <= middle) assign(node * 2, left, middle, query_left, query_right, color);
          if (query_right > middle) assign(node * 2 + 1, middle + 1, right, query_left, query_right, color);
          tree[static_cast<size_t>(node)] = combine(tree[static_cast<size_t>(node * 2)], tree[static_cast<size_t>(node * 2 + 1)]);
      }
      Info query(int node, int left, int right, int query_left, int query_right) {
          if (query_left <= left && right <= query_right) return tree[static_cast<size_t>(node)];
          push(node); int middle = (left + right) / 2;
          if (query_right <= middle) return query(node * 2, left, middle, query_left, query_right);
          if (query_left > middle) return query(node * 2 + 1, middle + 1, right, query_left, query_right);
          return combine(query(node * 2, left, middle, query_left, query_right),
                         query(node * 2 + 1, middle + 1, right, query_left, query_right));
      }
      void assign(int left, int right, int color) { assign(1, 1, n, left, right, color); }
      Info query(int left, int right) { return query(1, 1, n, left, right); }
  };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, m; cin >> n >> m;
      vector<int> color(static_cast<size_t>(n) + 1U); for (int i = 1; i <= n; ++i) cin >> color[static_cast<size_t>(i)];
      vector<vector<int>> graph(static_cast<size_t>(n) + 1U);
      for (int i = 1; i < n; ++i) { int u, v; cin >> u >> v; graph[static_cast<size_t>(u)].push_back(v); graph[static_cast<size_t>(v)].push_back(u); }
      vector<int> parent(static_cast<size_t>(n) + 1U), depth(static_cast<size_t>(n) + 1U), order{1}; depth[1] = 1;
      for (size_t i = 0; i < order.size(); ++i) for (int next : graph[static_cast<size_t>(order[i])]) if (next != parent[static_cast<size_t>(order[i])]) { parent[static_cast<size_t>(next)] = order[i]; depth[static_cast<size_t>(next)] = depth[static_cast<size_t>(order[i])] + 1; order.push_back(next); }
      vector<int> size(static_cast<size_t>(n) + 1U, 1), heavy(static_cast<size_t>(n) + 1U);
      for (size_t i = order.size(); i-- > 0;) for (int next : graph[static_cast<size_t>(order[i])]) if (parent[static_cast<size_t>(next)] == order[i]) { size[static_cast<size_t>(order[i])] += size[static_cast<size_t>(next)]; if (size[static_cast<size_t>(next)] > size[static_cast<size_t>(heavy[static_cast<size_t>(order[i])])]) heavy[static_cast<size_t>(order[i])] = next; }
      vector<int> head(static_cast<size_t>(n) + 1U), position(static_cast<size_t>(n) + 1U), base(static_cast<size_t>(n) + 1U);
      vector<pair<int, int>> stack{{1, 1}}; int timer = 0;
      while (!stack.empty()) { auto [start, chain_head] = stack.back(); stack.pop_back(); for (int node = start; node != 0; node = heavy[static_cast<size_t>(node)]) { head[static_cast<size_t>(node)] = chain_head; position[static_cast<size_t>(node)] = ++timer; base[static_cast<size_t>(timer)] = color[static_cast<size_t>(node)]; for (int next : graph[static_cast<size_t>(node)]) if (parent[static_cast<size_t>(next)] == node && next != heavy[static_cast<size_t>(node)]) stack.push_back({next, next}); } }
      SegmentTree tree(n, base);
      while (m--) {
          char operation; int x, y; cin >> operation >> x >> y;
          if (operation == 'C') {
              int new_color; cin >> new_color;
              while (head[static_cast<size_t>(x)] != head[static_cast<size_t>(y)]) { if (depth[static_cast<size_t>(head[static_cast<size_t>(x)])] < depth[static_cast<size_t>(head[static_cast<size_t>(y)])]) swap(x, y); tree.assign(position[static_cast<size_t>(head[static_cast<size_t>(x)])], position[static_cast<size_t>(x)], new_color); x = parent[static_cast<size_t>(head[static_cast<size_t>(x)])]; }
              if (position[static_cast<size_t>(x)] > position[static_cast<size_t>(y)]) swap(x, y);
              tree.assign(position[static_cast<size_t>(x)], position[static_cast<size_t>(y)], new_color);
          } else {
              Info left_part, right_part;
              while (head[static_cast<size_t>(x)] != head[static_cast<size_t>(y)]) {
                  if (depth[static_cast<size_t>(head[static_cast<size_t>(x)])] >= depth[static_cast<size_t>(head[static_cast<size_t>(y)])]) {
                      left_part = combine(left_part, reversed(tree.query(position[static_cast<size_t>(head[static_cast<size_t>(x)])], position[static_cast<size_t>(x)])));
                      x = parent[static_cast<size_t>(head[static_cast<size_t>(x)])];
                  } else {
                      right_part = combine(tree.query(position[static_cast<size_t>(head[static_cast<size_t>(y)])], position[static_cast<size_t>(y)]), right_part);
                      y = parent[static_cast<size_t>(head[static_cast<size_t>(y)])];
                  }
              }
              if (depth[static_cast<size_t>(x)] >= depth[static_cast<size_t>(y)])
                  left_part = combine(left_part, reversed(tree.query(position[static_cast<size_t>(y)], position[static_cast<size_t>(x)])));
              else left_part = combine(left_part, tree.query(position[static_cast<size_t>(x)], position[static_cast<size_t>(y)]));
              cout << combine(left_part, right_part).count << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2486
external_platform: 洛谷
external_problem_id: P2486
external_title: '[SDOI2011] 染色'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

這題比一般樹剖多出的難點只有「方向」；把每段視為可反轉、可結合的序列資訊即可。
