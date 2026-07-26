---
id: luogu-p1505
volume: upper
source_file: upper-volume
title: 洛谷 P1505 旅遊：邊權取反與路徑統計
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 4
topics: [heavy-light-decomposition, segment-tree, edge-weight]
prerequisites: [heavy-light-decomposition, lazy-propagation]
statement: 給定 0..n-1 編號的帶權樹，邊依輸入順序編號。支援修改單邊權、將 u-v 路徑所有邊權取相反數，以及查詢路徑邊權和、最大值、最小值。
constraints: ['1 <= n,m <= 200000', '任意時刻邊權介於 -1000 與 1000']
input_format: 第一行 n；接著 n-1 行 u、v、w；再給 m 與 m 行 `C i w`、`N u v`、`SUM u v`、`MAX u v`、`MIN u v`。
output_format: 每個 SUM/MAX/MIN 查詢輸出一行答案。
samples:
  - input: |
      3
      0 1 1
      1 2 2
      8
      SUM 0 2
      MAX 0 2
      N 0 1
      SUM 0 2
      MIN 0 2
      C 1 3
      SUM 0 2
      MAX 0 2
    output: |
      3
      2
      1
      -1
      5
      3
    explanation: 初始兩邊為 1、2；第一邊取反後為 -1、2；再把編號 1 的第一條輸入邊改為 3，路徑權成 3、2。
core_knowledge: [邊權下放至較深端點, 取反時最大最小互換並變號, 路徑排除 LCA]
judgment: C 的 i 是 1 起算輸入邊編號；路徑資料只含邊，u=v 時沒有邊。
hints:
  - 根樹後，將每條邊的權值存到較深端點的 DFS 位置，並記住每個輸入邊對應哪個端點。
  - 區間取反後 `sum=-sum`，新的 maximum 是 `-舊 minimum`，新的 minimum 是 `-舊 maximum`。
  - 樹剖跳鏈時可含鏈頭位置；最後同鏈區間必須從較淺點位置加一，以排除 LCA 的父邊。
solution_outline: 根樹並建立邊編號到子節點映射，重鏈剖分後建線段樹。線段樹維護 sum/max/min 與取反懶標；各操作映為單點賦值或若干路徑邊區間。
proof_or_invariant: 每條邊唯一存於子端點位置。路徑拆分涵蓋且僅涵蓋 u-v 邊集合；線段樹取反轉換與逐元素取反的三項統計完全一致，因此所有修改與查詢正確。
common_errors: [最後同鏈未排除 LCA, 取反只改 sum 而未交換 max/min, C 把邊編號當節點編號, 全負路徑最大值以零初始化]
complexity: { time: '每次 O(log^2 n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：邊權下放；線段樹維護 sum/max/min 與取反標記。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <climits>
  #include <iostream>
  #include <string>
  #include <utility>
  #include <vector>
  using namespace std;
  struct Info { long long sum = 0; int maximum = INT_MIN, minimum = INT_MAX; };
  Info merge_info(const Info& a, const Info& b) { return {a.sum + b.sum, max(a.maximum, b.maximum), min(a.minimum, b.minimum)}; }
  struct SegmentTree {
      int n; vector<Info> tree; vector<bool> lazy; const vector<int>& base;
      SegmentTree(int size, const vector<int>& values) : n(size), tree(static_cast<size_t>(4 * size)), lazy(static_cast<size_t>(4 * size)), base(values) { build(1, 1, n); }
      void apply_negate(int node) { Info& info = tree[static_cast<size_t>(node)]; info.sum = -info.sum; int old_max = info.maximum; info.maximum = -info.minimum; info.minimum = -old_max; lazy[static_cast<size_t>(node)] = !lazy[static_cast<size_t>(node)]; }
      void pull(int node) { tree[static_cast<size_t>(node)] = merge_info(tree[static_cast<size_t>(node * 2)], tree[static_cast<size_t>(node * 2 + 1)]); }
      void push(int node) { if (lazy[static_cast<size_t>(node)]) { apply_negate(node * 2); apply_negate(node * 2 + 1); lazy[static_cast<size_t>(node)] = false; } }
      void build(int node, int left, int right) { if (left == right) { int value = base[static_cast<size_t>(left)]; tree[static_cast<size_t>(node)] = {value, value, value}; return; } int middle = (left + right) / 2; build(node * 2, left, middle); build(node * 2 + 1, middle + 1, right); pull(node); }
      void set(int node, int left, int right, int position, int value) { if (left == right) { tree[static_cast<size_t>(node)] = {value, value, value}; return; } push(node); int middle = (left + right) / 2; if (position <= middle) set(node * 2, left, middle, position, value); else set(node * 2 + 1, middle + 1, right, position, value); pull(node); }
      void negate(int node, int left, int right, int query_left, int query_right) { if (query_right < left || right < query_left) return; if (query_left <= left && right <= query_right) { apply_negate(node); return; } push(node); int middle = (left + right) / 2; negate(node * 2, left, middle, query_left, query_right); negate(node * 2 + 1, middle + 1, right, query_left, query_right); pull(node); }
      Info query(int node, int left, int right, int query_left, int query_right) { if (query_right < left || right < query_left) return {}; if (query_left <= left && right <= query_right) return tree[static_cast<size_t>(node)]; push(node); int middle = (left + right) / 2; return merge_info(query(node * 2, left, middle, query_left, query_right), query(node * 2 + 1, middle + 1, right, query_left, query_right)); }
      void set(int position, int value) { set(1, 1, n, position, value); }
      void negate(int left, int right) { if (left <= right) negate(1, 1, n, left, right); }
      Info query(int left, int right) { return left <= right ? query(1, 1, n, left, right) : Info{}; }
  };
  struct Edge { int to, id, weight; };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n; cin >> n;
      vector<vector<Edge>> graph(static_cast<size_t>(n));
      for (int id = 1; id < n; ++id) { int u, v, w; cin >> u >> v >> w; graph[static_cast<size_t>(u)].push_back({v, id, w}); graph[static_cast<size_t>(v)].push_back({u, id, w}); }
      vector<int> parent(static_cast<size_t>(n), -1), depth(static_cast<size_t>(n)), edge_value(static_cast<size_t>(n)), edge_child(static_cast<size_t>(n)), order{0}; depth[0] = 1;
      for (size_t i = 0; i < order.size(); ++i) for (const Edge& edge : graph[static_cast<size_t>(order[i])]) if (edge.to != parent[static_cast<size_t>(order[i])]) { parent[static_cast<size_t>(edge.to)] = order[i]; depth[static_cast<size_t>(edge.to)] = depth[static_cast<size_t>(order[i])] + 1; edge_value[static_cast<size_t>(edge.to)] = edge.weight; edge_child[static_cast<size_t>(edge.id)] = edge.to; order.push_back(edge.to); }
      vector<int> size(static_cast<size_t>(n), 1), heavy(static_cast<size_t>(n), -1);
      for (size_t i = order.size(); i-- > 0;) for (const Edge& edge : graph[static_cast<size_t>(order[i])]) if (parent[static_cast<size_t>(edge.to)] == order[i]) { size[static_cast<size_t>(order[i])] += size[static_cast<size_t>(edge.to)]; if (heavy[static_cast<size_t>(order[i])] == -1 || size[static_cast<size_t>(edge.to)] > size[static_cast<size_t>(heavy[static_cast<size_t>(order[i])])]) heavy[static_cast<size_t>(order[i])] = edge.to; }
      vector<int> head(static_cast<size_t>(n)), position(static_cast<size_t>(n)), base(static_cast<size_t>(n) + 1U); vector<pair<int, int>> stack{{0, 0}}; int timer = 0;
      while (!stack.empty()) { auto [start, chain_head] = stack.back(); stack.pop_back(); for (int node = start; node != -1; node = heavy[static_cast<size_t>(node)]) { head[static_cast<size_t>(node)] = chain_head; position[static_cast<size_t>(node)] = ++timer; base[static_cast<size_t>(timer)] = edge_value[static_cast<size_t>(node)]; for (const Edge& edge : graph[static_cast<size_t>(node)]) if (parent[static_cast<size_t>(edge.to)] == node && edge.to != heavy[static_cast<size_t>(node)]) stack.push_back({edge.to, edge.to}); } }
      SegmentTree tree(n, base);
      int operation_count; cin >> operation_count;
      while (operation_count--) {
          string operation; int x, y; cin >> operation >> x >> y;
          if (operation == "C") { int child = edge_child[static_cast<size_t>(x)]; tree.set(position[static_cast<size_t>(child)], y); continue; }
          Info result;
          while (head[static_cast<size_t>(x)] != head[static_cast<size_t>(y)]) {
              if (depth[static_cast<size_t>(head[static_cast<size_t>(x)])] < depth[static_cast<size_t>(head[static_cast<size_t>(y)])]) swap(x, y);
              int left = position[static_cast<size_t>(head[static_cast<size_t>(x)])], right = position[static_cast<size_t>(x)];
              if (operation == "N") tree.negate(left, right); else result = merge_info(result, tree.query(left, right));
              x = parent[static_cast<size_t>(head[static_cast<size_t>(x)])];
          }
          if (depth[static_cast<size_t>(x)] > depth[static_cast<size_t>(y)]) swap(x, y);
          int left = position[static_cast<size_t>(x)] + 1, right = position[static_cast<size_t>(y)];
          if (operation == "N") tree.negate(left, right);
          else {
              result = merge_info(result, tree.query(left, right));
              if (operation == "SUM") cout << result.sum << '\n';
              else if (operation == "MAX") cout << result.maximum << '\n';
              else cout << result.minimum << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1505
external_platform: 洛谷
external_problem_id: P1505
external_title: '[國家集訓隊] 旅遊'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

取反會顛倒最大與最小的角色；把邊權映射到子節點後，其餘就是標準有懶標的樹路徑操作。
