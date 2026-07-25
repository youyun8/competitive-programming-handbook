---
id: luogu-p6242
volume: upper
source_file: upper-volume
title: 洛谷 P6242 線段樹 3：區間最值操作與歷史最值
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 5
topics: ['Segment Tree Beats', '吉司機線段樹', '歷史最值', '勢能分析']
prerequisites: ['segment-tree']
statement: |-
  維護一個序列，支援區間加、區間對 v 取 min、查詢區間和、查詢區間最大值、查詢區間歷史最大值。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '同時有區間加與區間取 min，普通懶標記無法合成'
  - '歷史最值需要額外的標記設計'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行一個整數 n；第二行 n 個整數；第三行一個整數 m；接下來 m 行為五種操作之一。'
output_format: '對操作 3、4、5 各輸出一行結果。'
samples:
  - input: |
      5
      1 2 3 4 5
      5
      1 1 3 2
      2 2 5 3
      3 1 5
      4 1 5
      5 1 5
    output: |
      15
      3
      5
    explanation: |-
      先把 [1,3] 各加 2 得 3 4 5 4 5，再把 [2,5] 對 3 取 min 得 3 3 3 3 3，總和 15、最大值 3；但歷史最大值仍記得曾出現過的 5。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    普通懶標記在「區間取 min」面前失效：min 不是對每個元素做同樣的事，無法用一個數字概括。吉司機線段樹（Segment Tree Beats）的解法是多記兩個量。
  - |-
    每個節點記 sum、**最大值**、**嚴格次大值**、最大值的個數。區間對 v 取 min 時分三種情況：v >= 最大值就什麼都不用做；次大值 < v < 最大值時只有「最大值那一群」被壓成 v，可以 O(1) 更新；只有 v <= 次大值時才被迫遞迴下去。
  - |-
    複雜度靠**勢能分析**：定義勢能為所有節點上不同值的種類數，第三種情況每發生一次就讓勢能下降，而勢能總增加量有限，所以總複雜度是 O((n + m) log² n)。
  - |-
    歷史最值需要把標記**分成兩組**：一組作用於最大值那一群、一組作用於其餘元素。每組除了「目前的累計加值」還要記「這段期間的最大累計加值」——下推時對後者取 max 而不是相加。
  - |-
    下推時最容易錯的一行：只有「最大值等於父節點最大值」的子節點才吃「最大值那一組」標記，其餘吃「其他元素」那一組。判斷寫反的話錯誤會非常隱蔽。
solution_outline: |-
  線段樹每個節點維護 sum、最大值、嚴格次大值、最大值個數與歷史最大值，以及分成「最大值群」與「其餘元素」兩組的加值標記與歷史最大加值標記。區間取 min 時依三種情況分別剪枝、O(1) 更新或遞迴；下推時依子節點的最大值是否等於父節點最大值選擇套用哪一組標記。
proof_or_invariant: |-
  核心不變量是「second_max 嚴格小於 max_value，且 max_count 為取到最大值的元素個數」。這讓「次大值 < v < 最大值」時的批次更新是精確的。歷史最值的正確性來自標記記錄的是「期間內的最大累計加值」，下推時取 max 即可還原任意時刻的峰值。
complexity:
  time: 'O((n + m) log² n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      vector<long long> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      vector<long long> history = a;
      int m;
      cin >> m;

      // TODO：吉司機線段樹（Segment Tree Beats）＋ 歷史最值。
      //   1. 每個節點記 sum、最大值、**嚴格次大值**、最大值的個數，以及歷史最大值。
      //   2. 區間取 min 為 v 時分三種情況：
      //        v >= 最大值      -> 什麼都不用做，直接返回；
      //        次大值 < v < 最大值 -> 只有「最大值那一群」被壓成 v，可以 O(1) 更新；
      //        v <= 次大值      -> 只能遞迴下去。
      //      複雜度的關鍵就在第三種情況很少發生（勢能分析為 O((n+m) log² n)）。
      //   3. 懶標記要**分兩組**：一組作用於最大值那一群、一組作用於其餘元素。
      //      歷史最值還要再記「這段期間的最大累計加值」，下推時取 max 而不是相加。
      //   4. 下推時，子節點的最大值等於父節點最大值的才吃「最大值那一組」標記，
      //      其餘吃「其他元素」那一組。寫錯這個判斷是最常見的失敗原因。
      // 下面是逐點模擬的樸素版本，正確但每次操作 O(n)。
      for (int i = 0; i < m; ++i) {
          int op, l, r;
          cin >> op >> l >> r;
          if (op == 1) {
              long long k;
              cin >> k;
              for (int j = l; j <= r; ++j) {
                  a[static_cast<size_t>(j)] += k;
                  history[static_cast<size_t>(j)] = max(history[static_cast<size_t>(j)], a[static_cast<size_t>(j)]);
              }
          } else if (op == 2) {
              long long v;
              cin >> v;
              for (int j = l; j <= r; ++j) {
                  a[static_cast<size_t>(j)] = min(a[static_cast<size_t>(j)], v);
                  history[static_cast<size_t>(j)] = max(history[static_cast<size_t>(j)], a[static_cast<size_t>(j)]);
              }
          } else if (op == 3) {
              long long total = 0;
              for (int j = l; j <= r; ++j) { total += a[static_cast<size_t>(j)]; }
              cout << total << '\n';
          } else if (op == 4) {
              long long best = LLONG_MIN;
              for (int j = l; j <= r; ++j) { best = max(best, a[static_cast<size_t>(j)]); }
              cout << best << '\n';
          } else {
              long long best = LLONG_MIN;
              for (int j = l; j <= r; ++j) { best = max(best, history[static_cast<size_t>(j)]); }
              cout << best << '\n';
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 吉司機線段樹（Segment Tree Beats）＋ 歷史最值。
  // 每個節點記最大值、嚴格次大值與最大值個數；區間取 min 時，
  // 若 v 落在 (次大值, 最大值) 之間就只需改「最大值那一群」，可 O(1) 處理；
  // 只有 v <= 次大值時才被迫遞迴下去——這正是複雜度的來源。
  struct Node {
      long long sum = 0;
      long long max_value = LLONG_MIN;
      long long second_max = LLONG_MIN;
      long long history_max = LLONG_MIN;
      int max_count = 0;
      // 對「最大值那一群」與「其餘元素」分別記錄：本次的加值、以及這段期間的最大累計加值
      long long add_max = 0, add_other = 0;
      long long add_max_history = 0, add_other_history = 0;
  };

  static vector<Node> tree;
  static vector<long long> initial_values;

  static void pull(size_t node) {
      const Node& l = tree[2 * node];
      const Node& r = tree[2 * node + 1];
      tree[node].sum = l.sum + r.sum;
      tree[node].history_max = max(l.history_max, r.history_max);
      if (l.max_value == r.max_value) {
          tree[node].max_value = l.max_value;
          tree[node].max_count = l.max_count + r.max_count;
          tree[node].second_max = max(l.second_max, r.second_max);
      } else if (l.max_value > r.max_value) {
          tree[node].max_value = l.max_value;
          tree[node].max_count = l.max_count;
          tree[node].second_max = max(l.second_max, r.max_value);
      } else {
          tree[node].max_value = r.max_value;
          tree[node].max_count = r.max_count;
          tree[node].second_max = max(r.second_max, l.max_value);
      }
  }

  // 套用標記：max_delta 作用於最大值那一群，other_delta 作用於其餘元素。
  static void apply_tags(size_t node, size_t count, long long max_delta, long long other_delta,
                         long long max_history, long long other_history) {
      tree[node].history_max = max(tree[node].history_max, tree[node].max_value + max_history);
      tree[node].add_max_history = max(tree[node].add_max_history, tree[node].add_max + max_history);
      tree[node].add_other_history = max(tree[node].add_other_history, tree[node].add_other + other_history);
      tree[node].sum += max_delta * tree[node].max_count +
                        other_delta * static_cast<long long>(count - static_cast<size_t>(tree[node].max_count));
      tree[node].max_value += max_delta;
      if (tree[node].second_max != LLONG_MIN) { tree[node].second_max += other_delta; }
      tree[node].add_max += max_delta;
      tree[node].add_other += other_delta;
  }

  static void push_down(size_t node, size_t l, size_t r) {
      const size_t mid = (l + r) / 2;
      const long long larger = max(tree[2 * node].max_value, tree[2 * node + 1].max_value);
      for (int side = 0; side < 2; ++side) {
          const size_t child = 2 * node + static_cast<size_t>(side);
          const size_t count = side == 0 ? mid - l + 1 : r - mid;
          // 子節點的最大值若等於父節點的最大值，才吃「最大值那一群」的標記。
          if (tree[child].max_value == larger) {
              apply_tags(child, count, tree[node].add_max, tree[node].add_other,
                         tree[node].add_max_history, tree[node].add_other_history);
          } else {
              apply_tags(child, count, tree[node].add_other, tree[node].add_other,
                         tree[node].add_other_history, tree[node].add_other_history);
          }
      }
      tree[node].add_max = tree[node].add_other = 0;
      tree[node].add_max_history = tree[node].add_other_history = 0;
  }

  static void build(size_t node, size_t l, size_t r) {
      if (l == r) {
          tree[node].sum = tree[node].max_value = tree[node].history_max = initial_values[l];
          tree[node].second_max = LLONG_MIN;
          tree[node].max_count = 1;
          return;
      }
      const size_t mid = (l + r) / 2;
      build(2 * node, l, mid);
      build(2 * node + 1, mid + 1, r);
      pull(node);
  }

  static void range_add(size_t node, size_t l, size_t r, size_t ql, size_t qr, long long delta) {
      if (qr < l || r < ql) { return; }
      if (ql <= l && r <= qr) { apply_tags(node, r - l + 1, delta, delta, delta, delta); return; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      range_add(2 * node, l, mid, ql, qr, delta);
      range_add(2 * node + 1, mid + 1, r, ql, qr, delta);
      pull(node);
  }

  static void range_min(size_t node, size_t l, size_t r, size_t ql, size_t qr, long long limit) {
      if (qr < l || r < ql || tree[node].max_value <= limit) { return; }
      if (ql <= l && r <= qr && tree[node].second_max < limit) {
          // 只有最大值那一群會被壓下來，其餘不動。
          apply_tags(node, r - l + 1, limit - tree[node].max_value, 0, limit - tree[node].max_value, 0);
          return;
      }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      range_min(2 * node, l, mid, ql, qr, limit);
      range_min(2 * node + 1, mid + 1, r, ql, qr, limit);
      pull(node);
  }

  static long long query_sum(size_t node, size_t l, size_t r, size_t ql, size_t qr) {
      if (qr < l || r < ql) { return 0; }
      if (ql <= l && r <= qr) { return tree[node].sum; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      return query_sum(2 * node, l, mid, ql, qr) + query_sum(2 * node + 1, mid + 1, r, ql, qr);
  }

  static long long query_max(size_t node, size_t l, size_t r, size_t ql, size_t qr) {
      if (qr < l || r < ql) { return LLONG_MIN; }
      if (ql <= l && r <= qr) { return tree[node].max_value; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      return max(query_max(2 * node, l, mid, ql, qr), query_max(2 * node + 1, mid + 1, r, ql, qr));
  }

  static long long query_history(size_t node, size_t l, size_t r, size_t ql, size_t qr) {
      if (qr < l || r < ql) { return LLONG_MIN; }
      if (ql <= l && r <= qr) { return tree[node].history_max; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      return max(query_history(2 * node, l, mid, ql, qr), query_history(2 * node + 1, mid + 1, r, ql, qr));
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      initial_values.assign(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) { cin >> initial_values[static_cast<size_t>(i)]; }
      tree.assign(4 * (static_cast<size_t>(n) + 1), Node{});
      build(1, 1, static_cast<size_t>(n));
      int m;
      cin >> m;
      for (int i = 0; i < m; ++i) {
          int op, l, r;
          cin >> op >> l >> r;
          const size_t ql = static_cast<size_t>(l);
          const size_t qr = static_cast<size_t>(r);
          if (op == 1) {
              long long k;
              cin >> k;
              range_add(1, 1, static_cast<size_t>(n), ql, qr, k);
          } else if (op == 2) {
              long long v;
              cin >> v;
              range_min(1, 1, static_cast<size_t>(n), ql, qr, v);
          } else if (op == 3) {
              cout << query_sum(1, 1, static_cast<size_t>(n), ql, qr) << '\n';
          } else if (op == 4) {
              cout << query_max(1, 1, static_cast<size_t>(n), ql, qr) << '\n';
          } else {
              cout << query_history(1, 1, static_cast<size_t>(n), ql, qr) << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P6242
external_platform: 洛谷
external_problem_id: P6242
external_title: '【模板】線段樹 3（區間最值操作、區間歷史最值）'
external_relation: original
source_book_pages: [151, 314]
source_pdf_pages: [169, 332]
review_status: verified
---

這是線段樹家族的天花板題之一。先把三種情況與兩組標記分別想透，再動手寫。
