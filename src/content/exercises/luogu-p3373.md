---
id: luogu-p3373
volume: upper
source_file: upper-volume
title: 洛谷 P3373 線段樹 2：區間乘、區間加與區間求和
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 4
topics: &id001
  - 線段樹
  - 複合懶標記
  - 模運算
prerequisites:
  - segment-tree
statement: |-
  維護一個長度為 n 的序列，支援三種操作：區間每個數乘上一個值、區間每個數加上一個值、查詢區間和取模。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 所有輸出都要對給定的模數取模
  - 乘法中間值會超過 32 位元，必須用 long long
  - 完整限制條件請參閱外部題目頁面
input_format: 第一行三個整數 n、m 與模數 p；第二行 n 個初始值；接下來 m 行，`1 x y k` 為區間乘 k，`2 x y k` 為區間加 k，`3 x y` 為查詢區間和。
output_format: 對每個操作 3 輸出一行區間和對 p 取模的結果。
samples:
  - input: |
      5 5 571373
      1 5 4 2 3
      3 2 4
      1 2 3 2
      3 2 4
      2 1 5 1
      3 1 5
    output: |
      11
      20
      29
    explanation: '[2,4] 初始和 11；把 [2,3] 各乘 2 後序列為 1 10 8 2 3，該區間和 20；再全段各加 1 得 2 11 9 3 4，總和 29。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。'
hints:
  - 把懶標記視為仿射函數 x→mul*x+add。
  - 新標記接在舊標記之後時，舊 add 也要乘上新 mul。
  - 區間和套標記為 sum*mul+add*len，所有量即時取模。
solution_outline:
  每個節點維護 `sum`、`lazy_mul`、`lazy_add`，約定變換為 `x -> x * mul + add`。`apply_tag` 依複合公式 `(mul·m2, add·m2 + a2)`
  更新標記並同步 `sum`。區間乘傳入 (k, 0)、區間加傳入 (1, k)，其餘與線段樹 1 相同。
proof_or_invariant: 複合的正確性由函數合成給出：兩個仿射變換的合成仍是仿射變換，且係數為 `(mul·m2, add·m2 + a2)`。只要每次下推都嚴格依此複合，節點的 `sum` 就始終等於「已套用自身標記後」的真實區間和。
complexity:
  time: 單次操作 O(log n)
  space: O(n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static long long mod_value;
  static vector<long long> sum_tree;
  static vector<long long> lazy_mul;
  static vector<long long> lazy_add;

  // TODO 1：約定每個節點的待辦是 x -> x * mul + add。把這個變換套到節點上：
  //         sum = sum * mul + add * 區間長度；
  //         已有的 mul 要再乘上新的 mul，已有的 add 要「先乘後加」。
  //         想清楚這裡的順序，是整題唯一的難點。
  static void apply_tag(size_t node, size_t count, long long mul, long long add) {
      (void)node;
      (void)count;
      (void)mul;
      (void)add;
  }

  // TODO 2：下推。無事可做時（mul == 1 且 add == 0）直接返回，
  //         否則套到兩個子節點再重置自己。
  static void push_down(size_t node, size_t l, size_t r) {
      (void)node;
      (void)l;
      (void)r;
  }

  static void build(size_t node, size_t l, size_t r, const vector<long long>& a) {
      lazy_mul[node] = 1;
      lazy_add[node] = 0;
      if (l == r) { sum_tree[node] = a[l] % mod_value; return; }
      const size_t mid = (l + r) / 2;
      build(2 * node, l, mid, a);
      build(2 * node + 1, mid + 1, r, a);
      sum_tree[node] = (sum_tree[2 * node] + sum_tree[2 * node + 1]) % mod_value;
  }

  static void update(size_t node, size_t l, size_t r, size_t ql, size_t qr, long long mul, long long add) {
      if (qr < l || r < ql) { return; }
      if (ql <= l && r <= qr) { apply_tag(node, r - l + 1, mul, add); return; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      update(2 * node, l, mid, ql, qr, mul, add);
      update(2 * node + 1, mid + 1, r, ql, qr, mul, add);
      sum_tree[node] = (sum_tree[2 * node] + sum_tree[2 * node + 1]) % mod_value;
  }

  static long long query(size_t node, size_t l, size_t r, size_t ql, size_t qr) {
      if (qr < l || r < ql) { return 0; }
      if (ql <= l && r <= qr) { return sum_tree[node]; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      return (query(2 * node, l, mid, ql, qr) + query(2 * node + 1, mid + 1, r, ql, qr)) % mod_value;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m >> mod_value)) { return 0; }
      vector<long long> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      const size_t capacity = 4 * (static_cast<size_t>(n) + 1);
      sum_tree.assign(capacity, 0);
      lazy_mul.assign(capacity, 1);
      lazy_add.assign(capacity, 0);
      build(1, 1, static_cast<size_t>(n), a);
      for (int q = 0; q < m; ++q) {
          int op, x, y;
          cin >> op >> x >> y;
          const size_t left = static_cast<size_t>(x);
          const size_t right = static_cast<size_t>(y);
          if (op == 1) {
              long long k;
              cin >> k;
              update(1, 1, static_cast<size_t>(n), left, right, k % mod_value, 0);
          } else if (op == 2) {
              long long k;
              cin >> k;
              update(1, 1, static_cast<size_t>(n), left, right, 1, k % mod_value);
          } else {
              cout << query(1, 1, static_cast<size_t>(n), left, right) << '\n';
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 兩個 lazy tag 的線段樹：先乘後加。約定 x -> x * mul + add，
  // 因此下推時子節點的 mul、add 都要先乘上父節點的 mul。
  static long long mod_value;
  static vector<long long> sum_tree;
  static vector<long long> lazy_mul;
  static vector<long long> lazy_add;

  static void apply_tag(size_t node, size_t count, long long mul, long long add) {
      sum_tree[node] = (sum_tree[node] * mul + add * static_cast<long long>(count)) % mod_value;
      lazy_mul[node] = lazy_mul[node] * mul % mod_value;
      lazy_add[node] = (lazy_add[node] * mul + add) % mod_value;
  }

  static void push_down(size_t node, size_t l, size_t r) {
      if (lazy_mul[node] == 1 && lazy_add[node] == 0) { return; }
      const size_t mid = (l + r) / 2;
      apply_tag(2 * node, mid - l + 1, lazy_mul[node], lazy_add[node]);
      apply_tag(2 * node + 1, r - mid, lazy_mul[node], lazy_add[node]);
      lazy_mul[node] = 1;
      lazy_add[node] = 0;
  }

  static void build(size_t node, size_t l, size_t r, const vector<long long>& a) {
      lazy_mul[node] = 1;
      lazy_add[node] = 0;
      if (l == r) { sum_tree[node] = a[l] % mod_value; return; }
      const size_t mid = (l + r) / 2;
      build(2 * node, l, mid, a);
      build(2 * node + 1, mid + 1, r, a);
      sum_tree[node] = (sum_tree[2 * node] + sum_tree[2 * node + 1]) % mod_value;
  }

  static void update(size_t node, size_t l, size_t r, size_t ql, size_t qr, long long mul, long long add) {
      if (qr < l || r < ql) { return; }
      if (ql <= l && r <= qr) { apply_tag(node, r - l + 1, mul, add); return; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      update(2 * node, l, mid, ql, qr, mul, add);
      update(2 * node + 1, mid + 1, r, ql, qr, mul, add);
      sum_tree[node] = (sum_tree[2 * node] + sum_tree[2 * node + 1]) % mod_value;
  }

  static long long query(size_t node, size_t l, size_t r, size_t ql, size_t qr) {
      if (qr < l || r < ql) { return 0; }
      if (ql <= l && r <= qr) { return sum_tree[node]; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      return (query(2 * node, l, mid, ql, qr) + query(2 * node + 1, mid + 1, r, ql, qr)) % mod_value;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m >> mod_value)) { return 0; }
      vector<long long> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      const size_t capacity = 4 * (static_cast<size_t>(n) + 1);
      sum_tree.assign(capacity, 0);
      lazy_mul.assign(capacity, 1);
      lazy_add.assign(capacity, 0);
      build(1, 1, static_cast<size_t>(n), a);
      for (int q = 0; q < m; ++q) {
          int op, x, y;
          cin >> op >> x >> y;
          const size_t left = static_cast<size_t>(x);
          const size_t right = static_cast<size_t>(y);
          if (op == 1) {
              long long k;
              cin >> k;
              update(1, 1, static_cast<size_t>(n), left, right, k % mod_value, 0);
          } else if (op == 2) {
              long long k;
              cin >> k;
              update(1, 1, static_cast<size_t>(n), left, right, 1, k % mod_value);
          } else {
              cout << query(1, 1, static_cast<size_t>(n), left, right) << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3373
external_platform: 洛谷
external_problem_id: P3373
external_title: 【模板】線段樹 2
external_relation: original
source_book_pages:
  - 151
  - 314
source_pdf_pages:
  - 169
  - 332
review_status: verified
core_knowledge: *id001
judgment:
  每個節點維護 `sum`、`lazy_mul`、`lazy_add`，約定變換為 `x -> x * mul + add`。`apply_tag` 依複合公式 `(mul·m2, add·m2 + a2)` 更新標記並同步
  `sum`。區間乘傳入 (k, 0)、區間加傳入 (1, k)，其餘與線段樹 1 相同。
common_errors:
  - 端點或索引範圍處理錯誤
  - 懶標記或摘要合併順序顛倒
  - 使用不足以容納答案的整數型別
---

複合懶標記的入門題。把標記寫成仿射變換 `x -> x·mul + add`，順序問題就從「背公式」變成「函數合成」。
