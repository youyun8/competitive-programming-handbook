---
id: luogu-p5499
volume: upper
source_file: upper-volume
title: 洛谷 P5499 Abbi 並不想研學：鏈聚合向上傳播
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 5
topics: [heavy-light-decomposition, segment-tree, modular-product]
prerequisites: [heavy-light-decomposition, modular-inverse]
statement: 固定規則重鏈剖分一棵有根樹（子樹同大時選編號小者為重兒子）。葉節點有數值；非葉節點為加或乘，其權值由所有輕兒子所屬整條重鏈的節點權值聚合而成。支援改葉值、切換非葉運算，以及查某點所在整條重鏈所有有效節點權值的和與積，模 99991。
constraints: ['所有計算模 99991', '重兒子同大時必選編號較小者', '非葉節點沒有輕兒子時忽略，不參與鏈和與鏈積']
input_format: 第一行 n、m；第二行給節點 2..n 的父節點；第三行 n 個資訊（葉為值，非葉 0 表加、1 表乘）；接著 m 行：`1 k v` 改葉值、`2 k` 切換符號、`3 k` 查詢。
output_format: 每個操作 3 輸出該完整重鏈的權值和與權值積（模 99991）。
samples:
  - input: |
      3 3
      1 1
      0 2 3
      3 1
      1 3 4
      3 1
    output: |
      5 6
      6 8
    explanation: 節點 2 是重兒子，節點 3 為輕兒子。根的加法權值等於節點 3 所在鏈的和 3，所以根鏈為 3、2；把葉 3 改為 4 後根權值同步變 4。
core_knowledge: [每條重鏈維護和與積, 輕邊變化沿鏈頭父節點傳播, 模乘積的零值計數]
judgment: 查詢是節點所在的完整重鏈，不是根路徑；被忽略的內部節點對和貢獻 0、對積貢獻 1。
hints:
  - 一個點的權值只依賴各輕兒子「整條鏈」的聚合；重兒子完全不直接參與該點計算。
  - 單點改變先修改其鏈聚合；只有鏈頭作為輕兒子的那個父節點會受影響，然後影響可能沿父節點所在鏈繼續向上。
  - 每跨一次是輕邊，最多 O(log n) 次。乘積移除舊因子時，對零另計個數，非零因子用模逆元移除。
solution_outline: 預處理固定樹剖。每點保存所有輕兒子鏈聚合的和、非零積與零數；全域線段樹維護各重鏈上的有效節點 scalar 之和與積。修改後逐鏈重新查聚合，更新鏈頭父節點的輕兒子資料並向上傳播。
proof_or_invariant: 對每個點，保存的輕兒子集合恰是定義中的 Charge 各鏈，故其 scalar 正確。線段樹則精確聚合每條鏈所有有效 scalar。一次鏈聚合變化只可能影響該鏈頭的父節點；沿輕邊反覆更新直到根，涵蓋全部且僅涵蓋受影響節點。
common_errors:
  [同大小重兒子未按編號選小者, 無輕兒子的非葉仍當成 0 或 1 實際節點, 移除零乘積時求逆元, 只更新葉所在鏈而未向上傳播]
complexity: { time: '每次 O(log^2 n log MOD)，查詢 O(log n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：維護鏈 sum/product，鏈頭變化沿輕邊向上傳播。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;
  constexpr long long mod_value = 99991;
  long long power(long long base, long long exponent) { long long result = 1; while (exponent > 0) { if (exponent & 1LL) result = result * base % mod_value; base = base * base % mod_value; exponent >>= 1LL; } return result; }
  struct Aggregate { long long sum = 0, product = 1; };
  struct SegmentTree {
      int size = 1; vector<Aggregate> tree;
      explicit SegmentTree(int n) { while (size < n) size *= 2; tree.assign(static_cast<size_t>(2 * size), {}); }
      void set(int position, long long value, bool active) {
          int node = size + position - 1;
          tree[static_cast<size_t>(node)] = active ? Aggregate{value, value} : Aggregate{};
          for (node /= 2; node > 0; node /= 2) { const Aggregate& a = tree[static_cast<size_t>(node * 2)]; const Aggregate& b = tree[static_cast<size_t>(node * 2 + 1)]; tree[static_cast<size_t>(node)] = {(a.sum + b.sum) % mod_value, a.product * b.product % mod_value}; }
      }
      Aggregate query(int left, int right) const {
          Aggregate a, b; int l = size + left - 1, r = size + right - 1;
          while (l <= r) { if (l % 2 == 1) { a.sum = (a.sum + tree[static_cast<size_t>(l)].sum) % mod_value; a.product = a.product * tree[static_cast<size_t>(l++)].product % mod_value; } if (r % 2 == 0) { b.sum = (tree[static_cast<size_t>(r)].sum + b.sum) % mod_value; b.product = tree[static_cast<size_t>(r--)].product * b.product % mod_value; } l /= 2; r /= 2; }
          return {(a.sum + b.sum) % mod_value, a.product * b.product % mod_value};
      }
  };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, operation_count; cin >> n >> operation_count;
      vector<vector<int>> children(static_cast<size_t>(n) + 1U); vector<int> parent(static_cast<size_t>(n) + 1U), order;
      for (int node = 2; node <= n; ++node) { cin >> parent[static_cast<size_t>(node)]; children[static_cast<size_t>(parent[static_cast<size_t>(node)])].push_back(node); }
      vector<int> traversal{1};
      while (!traversal.empty()) { int node = traversal.back(); traversal.pop_back(); order.push_back(node); for (int child : children[static_cast<size_t>(node)]) traversal.push_back(child); }
      vector<long long> input(static_cast<size_t>(n) + 1U); for (int node = 1; node <= n; ++node) cin >> input[static_cast<size_t>(node)];
      vector<int> subtree_size(static_cast<size_t>(n) + 1U, 1), heavy(static_cast<size_t>(n) + 1U);
      for (size_t i = order.size(); i-- > 0;) {
          int node = order[i];
          for (int child : children[static_cast<size_t>(node)]) {
              subtree_size[static_cast<size_t>(node)] += subtree_size[static_cast<size_t>(child)];
              int current = heavy[static_cast<size_t>(node)];
              if (current == 0 || subtree_size[static_cast<size_t>(child)] > subtree_size[static_cast<size_t>(current)] ||
                  (subtree_size[static_cast<size_t>(child)] == subtree_size[static_cast<size_t>(current)] && child < current))
                  heavy[static_cast<size_t>(node)] = child;
          }
      }
      vector<int> head(static_cast<size_t>(n) + 1U), position(static_cast<size_t>(n) + 1U), chain_end(static_cast<size_t>(n) + 1U);
      vector<pair<int, int>> stack{{1, 1}}; int timer = 0;
      while (!stack.empty()) { auto [start, chain_head] = stack.back(); stack.pop_back(); for (int node = start; node != 0; node = heavy[static_cast<size_t>(node)]) { head[static_cast<size_t>(node)] = chain_head; position[static_cast<size_t>(node)] = ++timer; chain_end[static_cast<size_t>(chain_head)] = timer; for (int child : children[static_cast<size_t>(node)]) if (child != heavy[static_cast<size_t>(node)]) stack.push_back({child, child}); } }
      vector<long long> light_sum(static_cast<size_t>(n) + 1U), light_product(static_cast<size_t>(n) + 1U, 1);
      vector<int> zero_count(static_cast<size_t>(n) + 1U), light_count(static_cast<size_t>(n) + 1U);
      vector<long long> chain_sum(static_cast<size_t>(n) + 1U), chain_product(static_cast<size_t>(n) + 1U, 1), scalar(static_cast<size_t>(n) + 1U);
      vector<bool> active(static_cast<size_t>(n) + 1U);
      for (size_t i = order.size(); i-- > 0;) {
          int node = order[i];
          for (int child : children[static_cast<size_t>(node)]) if (child != heavy[static_cast<size_t>(node)]) {
              int child_head = head[static_cast<size_t>(child)]; ++light_count[static_cast<size_t>(node)];
              light_sum[static_cast<size_t>(node)] = (light_sum[static_cast<size_t>(node)] + chain_sum[static_cast<size_t>(child_head)]) % mod_value;
              if (chain_product[static_cast<size_t>(child_head)] == 0) ++zero_count[static_cast<size_t>(node)];
              else light_product[static_cast<size_t>(node)] = light_product[static_cast<size_t>(node)] * chain_product[static_cast<size_t>(child_head)] % mod_value;
          }
          if (children[static_cast<size_t>(node)].empty()) { active[static_cast<size_t>(node)] = true; scalar[static_cast<size_t>(node)] = input[static_cast<size_t>(node)] % mod_value; }
          else if (light_count[static_cast<size_t>(node)] > 0) { active[static_cast<size_t>(node)] = true; scalar[static_cast<size_t>(node)] = input[static_cast<size_t>(node)] == 0 ? light_sum[static_cast<size_t>(node)] : (zero_count[static_cast<size_t>(node)] > 0 ? 0 : light_product[static_cast<size_t>(node)]); }
          int chain_head = head[static_cast<size_t>(node)];
          if (active[static_cast<size_t>(node)]) { chain_sum[static_cast<size_t>(chain_head)] = (chain_sum[static_cast<size_t>(chain_head)] + scalar[static_cast<size_t>(node)]) % mod_value; chain_product[static_cast<size_t>(chain_head)] = chain_product[static_cast<size_t>(chain_head)] * scalar[static_cast<size_t>(node)] % mod_value; }
      }
      SegmentTree tree(n); for (int node = 1; node <= n; ++node) tree.set(position[static_cast<size_t>(node)], scalar[static_cast<size_t>(node)], active[static_cast<size_t>(node)]);
      auto recompute = [&](int node) { if (children[static_cast<size_t>(node)].empty()) return; if (light_count[static_cast<size_t>(node)] == 0) return; scalar[static_cast<size_t>(node)] = input[static_cast<size_t>(node)] == 0 ? light_sum[static_cast<size_t>(node)] : (zero_count[static_cast<size_t>(node)] > 0 ? 0 : light_product[static_cast<size_t>(node)]); tree.set(position[static_cast<size_t>(node)], scalar[static_cast<size_t>(node)], true); };
      auto propagate = [&](int changed_node) {
          int chain_head = head[static_cast<size_t>(changed_node)];
          while (true) {
              Aggregate next = tree.query(position[static_cast<size_t>(chain_head)], chain_end[static_cast<size_t>(chain_head)]);
              long long old_sum = chain_sum[static_cast<size_t>(chain_head)], old_product = chain_product[static_cast<size_t>(chain_head)];
              chain_sum[static_cast<size_t>(chain_head)] = next.sum; chain_product[static_cast<size_t>(chain_head)] = next.product;
              int p = parent[static_cast<size_t>(chain_head)];
              if (p == 0 || (old_sum == next.sum && old_product == next.product)) break;
              light_sum[static_cast<size_t>(p)] = (light_sum[static_cast<size_t>(p)] - old_sum + next.sum + mod_value) % mod_value;
              if (old_product == 0) --zero_count[static_cast<size_t>(p)];
              else light_product[static_cast<size_t>(p)] = light_product[static_cast<size_t>(p)] * power(old_product, mod_value - 2) % mod_value;
              if (next.product == 0) ++zero_count[static_cast<size_t>(p)];
              else light_product[static_cast<size_t>(p)] = light_product[static_cast<size_t>(p)] * next.product % mod_value;
              recompute(p); chain_head = head[static_cast<size_t>(p)];
          }
      };
      while (operation_count--) {
          int type, node; cin >> type >> node;
          if (type == 1) { long long value; cin >> value; input[static_cast<size_t>(node)] = scalar[static_cast<size_t>(node)] = value % mod_value; tree.set(position[static_cast<size_t>(node)], scalar[static_cast<size_t>(node)], true); propagate(node); }
          else if (type == 2) { input[static_cast<size_t>(node)] ^= 1; recompute(node); propagate(node); }
          else { Aggregate answer = tree.query(position[static_cast<size_t>(head[static_cast<size_t>(node)])], chain_end[static_cast<size_t>(head[static_cast<size_t>(node)])]); cout << answer.sum << ' ' << answer.product << '\n'; }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5499
external_platform: 洛谷
external_problem_id: P5499
external_title: '[LnOI2019] Abbi 並不想研學'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

修改只會沿「所在鏈聚合 → 鏈頭父節點」傳播；每次跨越輕邊，因而受重鏈剖分的對數界保護。
