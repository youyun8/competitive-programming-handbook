---
id: luogu-p3368
volume: upper
source_file: upper-volume
title: 洛谷 P3368 樹狀陣列 2：區間修改與單點查詢
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 2
topics: ['樹狀陣列', '差分', '區間修改']
prerequisites: ['fenwick-tree', 'prefix-sum']
statement: |-
  維護一個長度為 n 的序列，支援兩種操作：把某個區間內的每個數都加上一個值；查詢某個位置的當前值。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'n 與操作數都很大，兩種操作都要 O(log n)'
  - '累積增量可能超過 32 位元，需用 long long'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；第二行 n 個初始值；接下來 m 行，`1 x y k` 表示區間 [x, y] 每個數加 k，`2 x` 表示查詢位置 x 的值。'
output_format: '對每個操作 2 輸出一行該位置的當前值。'
samples:
  - input: |
      5 5
      1 5 4 2 3
      1 2 4 2
      2 3
      2 1
      1 1 5 -1
      2 4
    output: |
      6
      1
      3
    explanation: |-
      區間 [2,4] 各加 2 後位置 3 變成 6，位置 1 未受影響仍是 1；再對 [1,5] 各加 -1 後位置 4 是 2+2-1=3。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    這題和樹狀陣列 1 是**對偶**的：那題是單點改、區間查，這題是區間改、單點查。不要想著在樹狀陣列上做懶標記——換一個維護對象就好。
  - |-
    讓樹狀陣列維護的不是原陣列 a，而是**差分陣列** d，其中 d[i] = a[i] - a[i-1]。
  - |-
    在差分上，「區間 [x, y] 全部加 k」只是兩個單點修改：d[x] += k，d[y+1] -= k。而「位置 x 的值」就是 d 的前綴和 d[1] + ... + d[x]。
  - |-
    於是這題完全複用樹狀陣列 1 的 `add` 與 `prefix`，只是語意換了：`add` 用來改差分，`prefix` 用來還原單點值。
  - |-
    兩個邊界要小心：讀入初始值時要存 a[i] - a[i-1] 而不是 a[i]；區間修改時 y+1 可能超過 n，要判斷後再減。
solution_outline: |-
  樹狀陣列維護差分陣列。讀入時以 `add(i, a[i] - a[i-1])` 建立差分。區間 [x, y] 加 k 對應 `add(x, k)` 與 `add(y+1, -k)`（y+1 <= n 時才做）。查詢位置 x 直接輸出 `prefix(x)`。
proof_or_invariant: |-
  差分與前綴和互為逆運算：對差分陣列做前綴和恰好還原原陣列。在 d[x] 加 k、d[y+1] 減 k 之後，所有 i ∈ [x, y] 的前綴和都多了 k，i > y 時兩者抵銷，i < x 不受影響——這正是區間加的定義。
complexity:
  time: '區間修改與單點查詢皆 O(log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static int n, m;
  static vector<long long> tree;

  static int lowbit(int x) { return x & -x; }

  static void add(int position, long long delta) {
      for (int i = position; i <= n; i += lowbit(i)) { tree[static_cast<size_t>(i)] += delta; }
  }

  static long long prefix(int position) {
      long long total = 0;
      for (int i = position; i > 0; i -= lowbit(i)) { total += tree[static_cast<size_t>(i)]; }
      return total;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      if (!(cin >> n >> m)) { return 0; }
      tree.assign(static_cast<size_t>(n) + 2, 0);

      // TODO 1：樹狀陣列這次維護的是「差分陣列」，不是原陣列。
      //         讀入時要存 a[i] - a[i-1]。
      for (int i = 1; i <= n; ++i) {
          long long value;
          cin >> value;
          add(i, value);
      }

      for (int q = 0; q < m; ++q) {
          int op;
          cin >> op;
          if (op == 1) {
              int x, y;
              long long k;
              cin >> x >> y >> k;
              // TODO 2：區間 [x, y] 加 k，在差分上就是兩個單點修改。
              //         注意 y + 1 可能超出 n。
              (void)x;
              (void)y;
              (void)k;
          } else {
              int x;
              cin >> x;
              // TODO 3：單點值 = 差分的前綴和。
              cout << prefix(x) << '\n';
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 差分 + 樹狀陣列：對差分陣列做單點加即為區間加，前綴和即為單點值。
  static int n, m;
  static vector<long long> tree;

  static int lowbit(int x) { return x & -x; }

  static void add(int position, long long delta) {
      for (int i = position; i <= n; i += lowbit(i)) { tree[static_cast<size_t>(i)] += delta; }
  }

  static long long prefix(int position) {
      long long total = 0;
      for (int i = position; i > 0; i -= lowbit(i)) { total += tree[static_cast<size_t>(i)]; }
      return total;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      if (!(cin >> n >> m)) { return 0; }
      tree.assign(static_cast<size_t>(n) + 2, 0);
      long long previous = 0;
      for (int i = 1; i <= n; ++i) {
          long long value;
          cin >> value;
          add(i, value - previous);  // 存差分
          previous = value;
      }
      for (int q = 0; q < m; ++q) {
          int op;
          cin >> op;
          if (op == 1) {
              int x, y;
              long long k;
              cin >> x >> y >> k;
              add(x, k);
              if (y + 1 <= n) { add(y + 1, -k); }
          } else {
              int x;
              cin >> x;
              cout << prefix(x) << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3368
external_platform: 洛谷
external_problem_id: P3368
external_title: '【模板】樹狀陣列 2'
external_relation: original
source_book_pages: [151, 170]
source_pdf_pages: [169, 188]
review_status: verified
---

把「維護什麼」換掉，就能用同一個資料結構解對偶問題。這個換位思考在區間修改區間查詢（雙樹狀陣列）中還會再用一次。
