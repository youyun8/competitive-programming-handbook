---
id: luogu-p6242
volume: upper
source_file: upper-volume
title: 洛谷 P6242【模板】線段樹 3（區間最值與歷史最值）
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 5
topics: &id001
  - segment-tree-beats
  - historical-maximum
  - potential-analysis
prerequisites:
  - segment-tree
statement: 維護序列的區間加、區間 chmin、區間和、最大值與歷史最大值。
constraints:
  - n,m <= 500000
  - 值與總和需 64 位元
input_format: 依外部題面給五類操作。
output_format: 對和、最大、歷史最大查詢逐行輸出。
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
    explanation: 加值後再 chmin，現值全三；歷史曾到五。
core_knowledge: *id001
judgment: Segment Tree Beats 加兩組目前／歷史標記。
hints:
  - 先掌握 max、second_max、max_count 的 chmin 三分支。
  - 區間加與 chmin 要把標記分成「最大群」與「其他群」。
  - 每組另存期間最大累積增量，下推時取 max 才能保存歷史峰值。
solution_outline: Segment Tree Beats 加兩組目前／歷史標記。
proof_or_invariant: 嚴格次大不變量保證 chmin 快速分支；分組標記精確區分最大群，歷史增量最大值保存任一時刻峰值。
common_errors:
  - 懶標記合成順序錯誤
  - 閉區間端點或 0/1 起始索引混淆
  - 合併節點摘要時漏掉跨左右子樹的候選
complexity:
  time: O((n+m) log² n) 攤銷
  space: O(n)
cpp_skeleton: |
  // TODO：依三階段提示完成資料結構。
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
external_platform: Luogu
external_problem_id: P6242
external_title: 洛谷 P6242【模板】線段樹 3（區間最值與歷史最值）
external_relation: original
source_book_pages:
  - 182
  - 192
source_pdf_pages:
  - 200
  - 210
review_status: verified
---

本卡片依外部題面與限制獨立整理。
