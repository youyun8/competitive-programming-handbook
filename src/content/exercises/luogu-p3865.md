---
id: luogu-p3865
volume: upper
source_file: upper-volume
title: 洛谷 P3865 ST 表：O(1) 區間最大值查詢
chapter: 2
section: '2.5'
kind: external-oj
difficulty: 2
topics: ['ST 表', '倍增法', 'RMQ', '稀疏表']
prerequisites: ['sparse-table']
statement: |-
  給定長度為 n 的靜態序列與 m 次查詢，每次查詢閉區間 [l, r] 的最大值。序列不會被修改。
constraints:
  - '1 <= n, m <= 100000'
  - '所有序列元素皆不超過 10^9'
  - '1 <= l <= r <= n'
input_format: '第一行兩個整數 n 與 m；第二行 n 個整數；接下來 m 行，每行兩個整數 l 與 r。'
output_format: '每次查詢輸出一行，表示區間最大值。'
samples:
  - input: |
      8 8
      9 3 1 7 5 6 0 8
      1 6
      1 5
      2 7
      2 6
      1 8
      4 8
      3 7
      1 8
    output: |
      9
      9
      7
      7
      9
      8
      7
      9
    explanation: '例如 [2, 7] 的元素為 3, 1, 7, 5, 6, 0，最大值是 7。'
core_knowledge:
  - 'ST 表以倍增方式預處理所有長度為 2 的冪的區間。'
  - '最大值具有冪等性，兩個查詢片段重疊不影響答案。'
judgment: '序列完全靜態、詢問很多且要求區間最值，是 ST 表的標準辨識訊號。'
hints:
  - |-
    定義 st[j][i] 為從 i 開始、長度剛好 2^j 的區間最大值。那麼 st[j][i] = max(st[j-1][i], st[j-1][i + 2^(j-1)])——把長度 2^j 的區間對半拆成兩段長度 2^(j-1)。建表是 O(n log n)。
  - |-
    查詢 [l, r] 時取 level = floor(log2(r - l + 1))，答案是 max(st[level][l], st[level][r - 2^level + 1])：兩段長度都是 2^level，一段貼左端、一段貼右端，中間允許重疊。
  - |-
    重疊不會遺漏元素，而 max(x, x) = x，因此重複涵蓋也不改變最大值。預處理 log_table[i] = log_table[i/2] + 1，便可避免浮點 log2。
solution_outline: |-
  建立倍增表 st[j][i]（從 i 起長度 2^j 的最大值），第 0 層就是原序列，逐層用兩個半段取 max 合併。同時預處理整數對數表。查詢時用兩段長度 2^level 的區間覆蓋 [l, r]，允許重疊，取兩者最大值。
proof_or_invariant: |-
  正確性建立在兩點：一是 st[j][i] 的遞推按定義展開即成立；二是對任意 l <= r，取 level = floor(log2(r-l+1)) 時有 2·2^level >= r-l+1，所以兩段一定能覆蓋整個區間，而 max 的冪等性保證重疊部分不會造成重複計算。
common_errors:
  - '把右端片段起點寫成 r - 2^level，正確的一基索引是 r - 2^level + 1。'
  - '在可修改序列上沿用 ST 表；任一修改都會使大量表格失效。'
  - '以浮點 log2 決定層數，可能有邊界精度問題。'
complexity:
  time: '建表 O(n log n)，單次查詢 O(1)'
  space: 'O(n log n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<int> a(static_cast<size_t>(n));
      for (int& value : a) { cin >> value; }

      // TODO 1：建 ST 表。st[0] 就是 a；st[j][i] = max(st[j-1][i], st[j-1][i + 2^(j-1)])。
      //         層數取到 2^levels > n 即可，建表 O(n log n)。

      // TODO 2：預先算好 log_table[len]，查詢時才不用每次呼叫 log2。

      for (int q = 0; q < m; ++q) {
          int l, r;
          cin >> l >> r;
          // TODO 3：用兩段長度 2^level 的區間覆蓋 [l, r]，允許重疊，取兩者最大值。
          //         因為 max 是冪等運算，重疊不影響答案，所以查詢是 O(1)。
          int best = a[static_cast<size_t>(l - 1)];
          for (int i = l; i <= r; ++i) { best = max(best, a[static_cast<size_t>(i - 1)]); }
          cout << best << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // ST 表：st[j][i] = 從 i 開始長度 2^j 的區間最大值。查詢用兩段可重疊的區間覆蓋。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      const size_t size = static_cast<size_t>(n);
      int levels = 1;
      while ((1 << levels) <= n) { ++levels; }
      vector<vector<int>> st(static_cast<size_t>(levels), vector<int>(size));
      for (size_t i = 0; i < size; ++i) { cin >> st[0][i]; }
      for (size_t j = 1; j < static_cast<size_t>(levels); ++j) {
          const size_t span = static_cast<size_t>(1) << j;
          const size_t half = span >> 1;
          for (size_t i = 0; i + span <= size; ++i) {
              st[j][i] = max(st[j - 1][i], st[j - 1][i + half]);
          }
      }
      vector<int> log_table(size + 1, 0);
      for (size_t i = 2; i <= size; ++i) { log_table[i] = log_table[i / 2] + 1; }
      for (int q = 0; q < m; ++q) {
          int l, r;
          cin >> l >> r;
          const size_t left = static_cast<size_t>(l - 1);
          const size_t right = static_cast<size_t>(r - 1);
          const int level = log_table[right - left + 1];
          const size_t span = static_cast<size_t>(1) << level;
          cout << max(st[static_cast<size_t>(level)][left],
                      st[static_cast<size_t>(level)][right + 1 - span])
               << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3865
external_platform: 洛谷
external_problem_id: P3865
external_title: '【模板】ST 表 & RMQ 問題'
external_relation: original
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

ST 表用空間換查詢時間，是靜態 RMQ 的首選。記住冪等性這個前提，就知道它什麼時候能用、什麼時候不能。
