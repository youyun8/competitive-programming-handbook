---
id: luogu-p4211
volume: upper
source_file: upper-volume
title: 洛谷 P4211 LCA：離線前綴與根路徑交集
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 4
topics: [heavy-light-decomposition, offline-query, lca]
prerequisites: [heavy-light-decomposition, difference-array]
statement: 給定根為 0、節點編號 0..n-1 的有根樹，深度定義為到根邊數加一。每次詢問 l、r、z，求所有 i∈[l,r] 的 depth(LCA(i,z)) 之和，答案模 201314。
constraints: ['1 <= n, m <= 50000', '0 <= l <= r < n', '0 <= z < n']
input_format: 第一行 n、m；接著依序給節點 1..n-1 的父節點；最後 m 行 l、r、z。
output_format: 每個詢問輸出一行答案模 201314。
samples:
  - input: |
      5 2
      0
      0
      1
      1
      1 4 3
      1 4 2
    output: |
      8
      5
    explanation: 節點 1..4 與 3 的 LCA 深度依序為 2、1、3、2，總和 8；與 2 的 LCA 深度為 1、2、1、1，總和 5。
core_knowledge: [LCA 深度等於兩條根路徑交集長度, 詢問端點前綴差分, 離線掃描與樹剖]
judgment: 深度從 1 起算；輸入節點從 0 編號；每次答案都需正規化到模數範圍。
hints:
  - 把 [l,r] 拆成前綴 [0,r] 減去 [0,l-1]。
  - 若對每個已加入節點 i 的根路徑全加一，再查根到 z 的路徑和，i 的貢獻正是兩條根路徑交集長度，也就是 LCA 深度。
  - 將所有前綴事件依端點排序，依序加入節點根路徑；路徑加與路徑和都可用樹剖完成。
solution_outline: 每個詢問建立 r 的正事件與 l-1 的負事件。按端點掃描節點編號，將根到新節點路徑加一；事件答案為根到 z 的路徑和，依符號累加。
proof_or_invariant: 掃至 k 時，每個樹點的權值等於前綴節點 0..k 中有多少條根路徑包含它。沿根-z 求和時，固定 i 被計數的點恰為 root-i 與 root-z 的交集，其數量為 depth(LCA(i,z))。前綴相減即原區間。
common_errors: [忘記深度從一開始, 0/1 編號轉換錯位, l=0 時建立負端點事件, 負答案未加模數]
complexity: { time: 'O((n+m)log^2 n)', space: 'O(n+m)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：詢問拆前綴事件；樹剖維護根路徑加與根路徑和。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;
  constexpr int mod_value = 201314;
  struct RangeFenwick {
      vector<long long> first, second;
      explicit RangeFenwick(int n) : first(static_cast<size_t>(n) + 2U), second(static_cast<size_t>(n) + 2U) {}
      static void add(vector<long long>& bit, int index, long long value) { for (int n = static_cast<int>(bit.size()); index < n; index += index & -index) bit[static_cast<size_t>(index)] += value; }
      static long long sum(const vector<long long>& bit, int index) { long long result = 0; for (; index > 0; index -= index & -index) result += bit[static_cast<size_t>(index)]; return result; }
      void range_add(int left, int right) { add(first, left, 1); add(first, right + 1, -1); add(second, left, left - 1); add(second, right + 1, -right); }
      long long prefix(int index) const { return sum(first, index) * index - sum(second, index); }
      long long range_sum(int left, int right) const { return prefix(right) - prefix(left - 1); }
  };
  struct Event { int bound, query, node, sign; };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, query_count; cin >> n >> query_count;
      vector<vector<int>> children(static_cast<size_t>(n) + 1U);
      vector<int> parent(static_cast<size_t>(n) + 1U), depth(static_cast<size_t>(n) + 1U), order{1}; depth[1] = 1;
      for (int node = 2; node <= n; ++node) { int input_parent; cin >> input_parent; parent[static_cast<size_t>(node)] = input_parent + 1; depth[static_cast<size_t>(node)] = depth[static_cast<size_t>(input_parent + 1)] + 1; children[static_cast<size_t>(input_parent + 1)].push_back(node); order.push_back(node); }
      vector<int> size(static_cast<size_t>(n) + 1U, 1), heavy(static_cast<size_t>(n) + 1U);
      for (size_t i = order.size(); i-- > 0;) for (int child : children[static_cast<size_t>(order[i])]) { size[static_cast<size_t>(order[i])] += size[static_cast<size_t>(child)]; if (size[static_cast<size_t>(child)] > size[static_cast<size_t>(heavy[static_cast<size_t>(order[i])])]) heavy[static_cast<size_t>(order[i])] = child; }
      vector<int> head(static_cast<size_t>(n) + 1U), position(static_cast<size_t>(n) + 1U);
      vector<pair<int, int>> stack{{1, 1}}; int timer = 0;
      while (!stack.empty()) { auto [start, chain_head] = stack.back(); stack.pop_back(); for (int node = start; node != 0; node = heavy[static_cast<size_t>(node)]) { head[static_cast<size_t>(node)] = chain_head; position[static_cast<size_t>(node)] = ++timer; for (int child : children[static_cast<size_t>(node)]) if (child != heavy[static_cast<size_t>(node)]) stack.push_back({child, child}); } }
      vector<Event> events; events.reserve(static_cast<size_t>(2 * query_count));
      for (int index = 0; index < query_count; ++index) {
          int left, right, node; cin >> left >> right >> node; ++left; ++right; ++node;
          events.push_back({right, index, node, 1});
          if (left > 1) events.push_back({left - 1, index, node, -1});
      }
      sort(events.begin(), events.end(), [](const Event& a, const Event& b) { return a.bound < b.bound; });
      RangeFenwick fenwick(n + 1);
      auto path_add = [&](int node) { while (head[static_cast<size_t>(node)] != 1) { fenwick.range_add(position[static_cast<size_t>(head[static_cast<size_t>(node)])], position[static_cast<size_t>(node)]); node = parent[static_cast<size_t>(head[static_cast<size_t>(node)])]; } fenwick.range_add(1, position[static_cast<size_t>(node)]); };
      auto path_sum = [&](int node) { long long result = 0; while (head[static_cast<size_t>(node)] != 1) { result += fenwick.range_sum(position[static_cast<size_t>(head[static_cast<size_t>(node)])], position[static_cast<size_t>(node)]); node = parent[static_cast<size_t>(head[static_cast<size_t>(node)])]; } return result + fenwick.range_sum(1, position[static_cast<size_t>(node)]); };
      vector<long long> answer(static_cast<size_t>(query_count));
      int inserted = 0;
      for (const Event& event : events) {
          while (inserted < event.bound) path_add(++inserted);
          answer[static_cast<size_t>(event.query)] += event.sign * path_sum(event.node);
      }
      for (long long value : answer) cout << (value % mod_value + mod_value) % mod_value << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4211
external_platform: 洛谷
external_problem_id: P4211
external_title: '[LNOI2014] LCA'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

關鍵等式是「LCA 深度＝兩條根路徑的交集大小」；一旦看見它，區間詢問就能前綴離線。
