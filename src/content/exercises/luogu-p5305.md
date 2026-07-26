---
id: luogu-p5305
volume: upper
source_file: upper-volume
title: 洛谷 P5305 舊詞：LCA 深度冪的離線總和
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 5
topics: [heavy-light-decomposition, offline-query, weighted-segment-tree]
prerequisites: [heavy-light-decomposition, modular-arithmetic]
statement: 給定以 1 為根的有根樹與常數 k。每次詢問 x、y，求 i=1..x 的 depth(LCA(i,y))^k 之和，模 998244353；根深度為 1。
constraints: ['1 <= n, Q <= 50000', '1 <= k <= 1000000000', '1 <= x,y <= n']
input_format: 第一行 n、Q、k；接著依序給節點 2..n 的父節點；再給 Q 行 x、y。
output_format: 每個詢問輸出一行答案模 998244353。
samples:
  - input: |
      5 5 2
      1
      4
      1
      2
      4 3
      5 4
      2 5
      1 2
      3 2
    output: |
      15
      11
      5
      1
      6
    explanation: 深度依序為 1、2、3、2、3；第一問的四個 LCA 深度平方為 1、1、9、4，總和 15。
core_knowledge: [深度冪望遠鏡差分, LCA 根路徑交集, 離線編號前綴]
judgment: k 是固定指數而非模數；快速冪指數需用完整整數範圍；根深度為 1。
hints:
  - 定義 w_d=d^k-(d-1)^k，則從根到深度 D 的 w 總和恰為 D^k。
  - 掃描 i=1..n；加入 i 時，把根到 i 路徑每點的「被覆蓋次數」加一。
  - 查根到 y 時，不是普通計數和，而是各點覆蓋次數乘上其 w_depth 的加權和。
solution_outline: 先算每點固定權 w。詢問依 x 排序；依序把根-i 路徑覆蓋次數加一。線段樹節點保存固定權和、目前加權和與次數懶標記；查根-y 的加權和。
proof_or_invariant: 固定 i 與 y 的兩條根路徑交於 root..LCA。i 的路徑加一後，查 y 路徑時貢獻該交集的 w 總和；望遠鏡相消後等於 depth(LCA)^k。掃至 x 累加 i<=x，故答案正確。
common_errors: [直接把 depth^k 當每點權而重複累加, 快速冪用 int 指數溢位, 線段樹全覆蓋時忘記乘固定權和]
complexity: { time: 'O((n+Q)log^2 n+n log k)', space: 'O(n+Q)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：深度冪差分權 + 離線樹剖加權區間更新。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;
  constexpr long long mod_value = 998244353;
  long long power(long long base, long long exponent) {
      long long result = 1;
      while (exponent > 0) { if (exponent & 1LL) result = result * base % mod_value; base = base * base % mod_value; exponent >>= 1LL; }
      return result;
  }
  struct SegmentTree {
      int n; vector<long long> weight, sum, lazy; const vector<long long>& base;
      SegmentTree(int size, const vector<long long>& values)
          : n(size), weight(static_cast<size_t>(4 * size)), sum(static_cast<size_t>(4 * size)),
            lazy(static_cast<size_t>(4 * size)), base(values) { build(1, 1, n); }
      void build(int node, int left, int right) { if (left == right) { weight[static_cast<size_t>(node)] = base[static_cast<size_t>(left)]; return; } int middle = (left + right) / 2; build(node * 2, left, middle); build(node * 2 + 1, middle + 1, right); weight[static_cast<size_t>(node)] = (weight[static_cast<size_t>(node * 2)] + weight[static_cast<size_t>(node * 2 + 1)]) % mod_value; }
      void apply(int node, long long value) { sum[static_cast<size_t>(node)] = (sum[static_cast<size_t>(node)] + value * weight[static_cast<size_t>(node)]) % mod_value; lazy[static_cast<size_t>(node)] = (lazy[static_cast<size_t>(node)] + value) % mod_value; }
      void push(int node) { if (lazy[static_cast<size_t>(node)] != 0) { apply(node * 2, lazy[static_cast<size_t>(node)]); apply(node * 2 + 1, lazy[static_cast<size_t>(node)]); lazy[static_cast<size_t>(node)] = 0; } }
      void add(int node, int left, int right, int query_left, int query_right) { if (query_left <= left && right <= query_right) { apply(node, 1); return; } push(node); int middle = (left + right) / 2; if (query_left <= middle) add(node * 2, left, middle, query_left, query_right); if (query_right > middle) add(node * 2 + 1, middle + 1, right, query_left, query_right); sum[static_cast<size_t>(node)] = (sum[static_cast<size_t>(node * 2)] + sum[static_cast<size_t>(node * 2 + 1)]) % mod_value; }
      long long query(int node, int left, int right, int query_left, int query_right) { if (query_left <= left && right <= query_right) return sum[static_cast<size_t>(node)]; push(node); int middle = (left + right) / 2; long long result = 0; if (query_left <= middle) result += query(node * 2, left, middle, query_left, query_right); if (query_right > middle) result += query(node * 2 + 1, middle + 1, right, query_left, query_right); return result % mod_value; }
      void add(int left, int right) { add(1, 1, n, left, right); }
      long long query(int left, int right) { return query(1, 1, n, left, right); }
  };
  struct Query { int x, y, index; };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, query_count; long long exponent; cin >> n >> query_count >> exponent;
      vector<vector<int>> children(static_cast<size_t>(n) + 1U); vector<int> parent(static_cast<size_t>(n) + 1U), depth(static_cast<size_t>(n) + 1U), order;
      for (int node = 2; node <= n; ++node) { cin >> parent[static_cast<size_t>(node)]; children[static_cast<size_t>(parent[static_cast<size_t>(node)])].push_back(node); }
      vector<int> traversal{1}; depth[1] = 1;
      while (!traversal.empty()) { int node = traversal.back(); traversal.pop_back(); order.push_back(node); for (int child : children[static_cast<size_t>(node)]) { depth[static_cast<size_t>(child)] = depth[static_cast<size_t>(node)] + 1; traversal.push_back(child); } }
      vector<int> size(static_cast<size_t>(n) + 1U, 1), heavy(static_cast<size_t>(n) + 1U);
      for (size_t i = order.size(); i-- > 0;) for (int child : children[static_cast<size_t>(order[i])]) { size[static_cast<size_t>(order[i])] += size[static_cast<size_t>(child)]; if (size[static_cast<size_t>(child)] > size[static_cast<size_t>(heavy[static_cast<size_t>(order[i])])]) heavy[static_cast<size_t>(order[i])] = child; }
      vector<int> head(static_cast<size_t>(n) + 1U), position(static_cast<size_t>(n) + 1U); vector<long long> base(static_cast<size_t>(n) + 1U);
      vector<pair<int, int>> stack{{1, 1}}; int timer = 0;
      while (!stack.empty()) { auto [start, chain_head] = stack.back(); stack.pop_back(); for (int node = start; node != 0; node = heavy[static_cast<size_t>(node)]) { head[static_cast<size_t>(node)] = chain_head; position[static_cast<size_t>(node)] = ++timer; const long long d = depth[static_cast<size_t>(node)]; base[static_cast<size_t>(timer)] = (power(d, exponent) - power(d - 1, exponent) + mod_value) % mod_value; for (int child : children[static_cast<size_t>(node)]) if (child != heavy[static_cast<size_t>(node)]) stack.push_back({child, child}); } }
      vector<Query> queries(static_cast<size_t>(query_count)); for (int i = 0; i < query_count; ++i) { cin >> queries[static_cast<size_t>(i)].x >> queries[static_cast<size_t>(i)].y; queries[static_cast<size_t>(i)].index = i; }
      sort(queries.begin(), queries.end(), [](const Query& a, const Query& b) { return a.x < b.x; });
      SegmentTree tree(n, base);
      auto path_add = [&](int node) { while (head[static_cast<size_t>(node)] != 1) { tree.add(position[static_cast<size_t>(head[static_cast<size_t>(node)])], position[static_cast<size_t>(node)]); node = parent[static_cast<size_t>(head[static_cast<size_t>(node)])]; } tree.add(1, position[static_cast<size_t>(node)]); };
      auto path_query = [&](int node) { long long result = 0; while (head[static_cast<size_t>(node)] != 1) { result += tree.query(position[static_cast<size_t>(head[static_cast<size_t>(node)])], position[static_cast<size_t>(node)]); node = parent[static_cast<size_t>(head[static_cast<size_t>(node)])]; } return (result + tree.query(1, position[static_cast<size_t>(node)])) % mod_value; };
      vector<long long> answer(static_cast<size_t>(query_count)); int inserted = 0;
      for (const Query& query : queries) { while (inserted < query.x) path_add(++inserted); answer[static_cast<size_t>(query.index)] = path_query(query.y); }
      for (long long value : answer) cout << value << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5305
external_platform: 洛谷
external_problem_id: P5305
external_title: '[GXOI/GZOI2019] 舊詞'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

P4211 的交集計數推廣到深度冪後，只需把每一層的單位貢獻換成相鄰冪差。
