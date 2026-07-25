---
id: luogu-p3372
volume: upper
source_file: upper-volume
title: 洛谷 P3372 線段樹 1：區間加與區間求和
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 3
topics: ['線段樹', '懶標記', '區間修改']
prerequisites: ['segment-tree']
statement: |-
  維護一個長度為 n 的序列，支援兩種操作：把某個區間內每個數都加上一個值；查詢某個區間的和。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'n 與操作數都很大，兩種操作都要 O(log n)'
  - '區間和會超過 32 位元，必須用 long long'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；第二行 n 個初始值；接下來 m 行，`1 x y k` 表示區間 [x, y] 每個數加 k，`2 x y` 表示查詢區間 [x, y] 的和。'
output_format: '對每個操作 2 輸出一行區間和。'
samples:
  - input: |
      5 5
      1 5 4 2 3
      2 2 4
      1 2 3 2
      2 2 4
      1 1 5 1
      2 1 5
    output: |
      11
      15
      24
    explanation: |-
      [2,4] 初始和是 5+4+2=11；把 [2,3] 各加 2 後變成 7+6+2=15；再把整段各加 1，序列成為 2 8 7 3 4，總和 24。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    區間修改如果真的下推到每個葉子就是 O(n)。懶標記的想法是：當一次修改**完整覆蓋**某個節點的區間時，就在那個節點記下「我這棵子樹欠一個增量」，先不往下走。
  - |-
    節點要存兩個量：`sum`（這段區間的和）與 `add`（子樹尚未下推的增量）。注意 `add` 的語意是「子樹欠的」，而 `sum` 已經把自己的增量算進去了——想清楚這個分工，後面才不會重複累加。
  - |-
    把「整段加 delta」抽成一個 `apply` 函式：`sum += delta * 區間長度`，`add += delta`。下推時就是對兩個子節點各呼叫一次 `apply`，然後把自己的 `add` 清零。
  - |-
    下推時左右子區間長度不同（`mid - l + 1` 與 `r - mid`），套用時要各自帶入正確的長度，這是最常見的錯誤來源。
  - |-
    查詢與修改在往下遞迴之前都必須先 `push_down`，否則會讀到過期的資料。而回溯時都要重新 `sum = 左 + 右`。
solution_outline: |-
  線段樹每個節點存區間和 `sum` 與懶標記 `add`。修改時若當前節點區間被完整覆蓋就直接套用標記並返回；否則先下推，再遞迴左右子樹，最後由子節點重算 `sum`。查詢同樣先下推再遞迴累加。把「套用標記」抽成獨立函式可避免長度算錯。
proof_or_invariant: |-
  不變量是「`sum[u]` 永遠是 u 這段區間的正確總和，而 `add[u]` 是尚未套用到 u 的子節點的增量」。因為每次修改最多讓 O(log n) 個節點被完整覆蓋，遞迴路徑上其他節點各為 O(1) 工作，單次操作即 O(log n)。
complexity:
  time: '單次區間修改與區間查詢皆 O(log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static vector<long long> sum_tree;
  static vector<long long> lazy_add;

  // TODO 1：把「整個區間加 delta」的效果套到節點上：
  //         sum 增加 delta * 區間長度，並把 delta 累進 lazy。
  static void apply_add(size_t node, size_t count, long long delta) {
      (void)node;
      (void)count;
      (void)delta;
  }

  // TODO 2：下推。把 lazy 套到兩個子節點後清空，注意左右子區間長度不同。
  static void push_down(size_t node, size_t l, size_t r) {
      (void)node;
      (void)l;
      (void)r;
  }

  static void build(size_t node, size_t l, size_t r, const vector<long long>& a) {
      if (l == r) { sum_tree[node] = a[l]; return; }
      const size_t mid = (l + r) / 2;
      build(2 * node, l, mid, a);
      build(2 * node + 1, mid + 1, r, a);
      sum_tree[node] = sum_tree[2 * node] + sum_tree[2 * node + 1];
  }

  static void update(size_t node, size_t l, size_t r, size_t ql, size_t qr, long long delta) {
      if (qr < l || r < ql) { return; }
      if (ql <= l && r <= qr) { apply_add(node, r - l + 1, delta); return; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      update(2 * node, l, mid, ql, qr, delta);
      update(2 * node + 1, mid + 1, r, ql, qr, delta);
      sum_tree[node] = sum_tree[2 * node] + sum_tree[2 * node + 1];
  }

  static long long query(size_t node, size_t l, size_t r, size_t ql, size_t qr) {
      if (qr < l || r < ql) { return 0; }
      if (ql <= l && r <= qr) { return sum_tree[node]; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      return query(2 * node, l, mid, ql, qr) + query(2 * node + 1, mid + 1, r, ql, qr);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<long long> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      sum_tree.assign(4 * (static_cast<size_t>(n) + 1), 0);
      lazy_add.assign(4 * (static_cast<size_t>(n) + 1), 0);
      build(1, 1, static_cast<size_t>(n), a);
      for (int q = 0; q < m; ++q) {
          int op;
          cin >> op;
          if (op == 1) {
              int x, y;
              long long k;
              cin >> x >> y >> k;
              update(1, 1, static_cast<size_t>(n), static_cast<size_t>(x), static_cast<size_t>(y), k);
          } else {
              int x, y;
              cin >> x >> y;
              cout << query(1, 1, static_cast<size_t>(n), static_cast<size_t>(x), static_cast<size_t>(y)) << '\n';
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 線段樹 + 區間加 lazy tag：sum 存區間和，add 存「子樹尚未下推的增量」。
  static vector<long long> sum_tree;
  static vector<long long> lazy_add;

  static void apply_add(size_t node, size_t count, long long delta) {
      sum_tree[node] += delta * static_cast<long long>(count);
      lazy_add[node] += delta;
  }

  static void push_down(size_t node, size_t l, size_t r) {
      if (lazy_add[node] == 0) { return; }
      const size_t mid = (l + r) / 2;
      apply_add(2 * node, mid - l + 1, lazy_add[node]);
      apply_add(2 * node + 1, r - mid, lazy_add[node]);
      lazy_add[node] = 0;
  }

  static void build(size_t node, size_t l, size_t r, const vector<long long>& a) {
      if (l == r) { sum_tree[node] = a[l]; return; }
      const size_t mid = (l + r) / 2;
      build(2 * node, l, mid, a);
      build(2 * node + 1, mid + 1, r, a);
      sum_tree[node] = sum_tree[2 * node] + sum_tree[2 * node + 1];
  }

  static void update(size_t node, size_t l, size_t r, size_t ql, size_t qr, long long delta) {
      if (qr < l || r < ql) { return; }
      if (ql <= l && r <= qr) { apply_add(node, r - l + 1, delta); return; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      update(2 * node, l, mid, ql, qr, delta);
      update(2 * node + 1, mid + 1, r, ql, qr, delta);
      sum_tree[node] = sum_tree[2 * node] + sum_tree[2 * node + 1];
  }

  static long long query(size_t node, size_t l, size_t r, size_t ql, size_t qr) {
      if (qr < l || r < ql) { return 0; }
      if (ql <= l && r <= qr) { return sum_tree[node]; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      return query(2 * node, l, mid, ql, qr) + query(2 * node + 1, mid + 1, r, ql, qr);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<long long> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      sum_tree.assign(4 * (static_cast<size_t>(n) + 1), 0);
      lazy_add.assign(4 * (static_cast<size_t>(n) + 1), 0);
      build(1, 1, static_cast<size_t>(n), a);
      for (int q = 0; q < m; ++q) {
          int op;
          cin >> op;
          if (op == 1) {
              int x, y;
              long long k;
              cin >> x >> y >> k;
              update(1, 1, static_cast<size_t>(n), static_cast<size_t>(x), static_cast<size_t>(y), k);
          } else {
              int x, y;
              cin >> x >> y;
              cout << query(1, 1, static_cast<size_t>(n), static_cast<size_t>(x), static_cast<size_t>(y)) << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3372
external_platform: 洛谷
external_problem_id: P3372
external_title: '【模板】線段樹 1'
external_relation: original
source_book_pages: [151, 314]
source_pdf_pages: [169, 332]
review_status: verified
---

線段樹最重要的一題。把懶標記的語意寫在註解裡，日後擴充成區間乘、區間最值都靠這個框架。
