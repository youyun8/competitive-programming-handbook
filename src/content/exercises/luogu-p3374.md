---
id: luogu-p3374
volume: upper
source_file: upper-volume
title: 洛谷 P3374 樹狀陣列 1：單點修改與區間求和
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 2
topics: ['樹狀陣列', 'lowbit', '前綴和']
prerequisites: ['fenwick-tree']
statement: |-
  維護一個長度為 n 的序列，支援兩種操作：把某個位置加上一個值；查詢某個區間的和。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'n 與操作數都很大，兩種操作都要 O(log n)'
  - '區間和可能超過 32 位元，需用 long long'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；第二行 n 個初始值；接下來 m 行，`1 x k` 表示位置 x 加 k，`2 x y` 表示查詢區間 [x, y] 的和。'
output_format: '對每個操作 2 輸出一行區間和。'
samples:
  - input: |
      5 5
      1 5 4 2 3
      2 1 3
      1 3 5
      2 1 3
      2 2 5
      1 1 100
    output: |
      10
      15
      19
    explanation: |-
      初始 [1,3] 的和是 1+5+4=10；位置 3 加 5 後變成 15；[2,5] 的和是 5+9+2+3=19。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    lowbit(x) = x & -x 取出 x 二進位最低位的 1。樹狀陣列的核心約定是：tree[i] 負責的區間是 (i - lowbit(i), i]，長度恰好 lowbit(i)。
  - |-
    單點加：從位置 x 出發，反覆 `i += lowbit(i)` 直到超過 n，沿途每個 tree[i] 都加上增量——這些正是所有「管轄範圍包含 x」的節點。
  - |-
    前綴和：從位置 x 出發，反覆 `i -= lowbit(i)` 直到 0，沿途累加 tree[i]——這些節點的管轄區間恰好不重不漏地拼成 [1, x]。
  - |-
    區間和用兩個前綴和相減：sum(x, y) = prefix(y) - prefix(x-1)。所以樹狀陣列本身只需要實作前綴和。
  - |-
    初始化不要用 n 次單點加以外的花招（那已經是 O(n log n)，足夠快）。真正常見的錯誤是忘記把和開成 `long long`。
solution_outline: |-
  用 tree[1..n] 存樹狀陣列。`add(x, k)` 沿 `i += lowbit(i)` 向上更新，`prefix(x)` 沿 `i -= lowbit(i)` 向下累加。初始值透過 n 次 `add` 建立。查詢 [x, y] 時輸出 `prefix(y) - prefix(x-1)`。
proof_or_invariant: |-
  關鍵不變量是 tree[i] 恆等於原陣列區間 (i - lowbit(i), i] 的和。向上更新覆蓋了所有管轄範圍含 x 的節點，向下查詢走過的節點區間恰好不重不漏地拼出 [1, x]；兩條路徑長度都等於 x 的二進位有效位數，故為 O(log n)。
complexity:
  time: '單點修改與前綴查詢皆 O(log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static int n, m;
  static vector<long long> tree;

  // TODO 1：lowbit(x) = x & -x，取出 x 最低位的 1。
  //         tree[i] 管轄的區間長度就是 lowbit(i)。

  static void add(int position, long long delta) {
      // TODO 2：從 position 開始，沿 i += lowbit(i) 往上更新到 n。
      (void)position;
      (void)delta;
  }

  static long long prefix(int position) {
      // TODO 3：從 position 開始，沿 i -= lowbit(i) 往下累加到 0。
      long long total = 0;
      (void)position;
      return total;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      if (!(cin >> n >> m)) { return 0; }
      tree.assign(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) {
          long long value;
          cin >> value;
          add(i, value);
      }
      for (int q = 0; q < m; ++q) {
          int op, x, y;
          cin >> op >> x >> y;
          if (op == 1) {
              add(x, y);
          } else {
              // 區間和 = 兩個前綴和相減。
              cout << prefix(y) - prefix(x - 1) << '\n';
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 樹狀陣列：tree[i] 管轄 (i - lowbit(i), i]，單點加、前綴和各 O(log n)。
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
      tree.assign(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) {
          long long value;
          cin >> value;
          add(i, value);
      }
      for (int q = 0; q < m; ++q) {
          int op, x, y;
          cin >> op >> x >> y;
          if (op == 1) {
              add(x, y);
          } else {
              cout << prefix(y) - prefix(x - 1) << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3374
external_platform: 洛谷
external_problem_id: P3374
external_title: '【模板】樹狀陣列 1'
external_relation: original
source_book_pages: [151, 170]
source_pdf_pages: [169, 188]
review_status: verified
---

樹狀陣列的程式碼比線段樹短得多，常數也小。先把 lowbit 的兩個方向想清楚，其餘都是機械操作。
