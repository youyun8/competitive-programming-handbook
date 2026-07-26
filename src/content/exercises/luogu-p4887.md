---
id: luogu-p4887
volume: upper
source_file: upper-volume
title: 洛谷 P4887 莫隊二次離線：區間內 popcount 為 k 的配對數
chapter: 4
section: '4.5'
kind: external-oj
difficulty: 5
topics: ['莫隊二次離線', '莫隊演算法', '前綴函數差分', '離線', '值域計數']
prerequisites: ['mo-algorithm']
core_knowledge: [莫隊二次離線, 前綴差分, XOR 與 popcount]
judgment: 單次窗口移動需枚舉多個 XOR 掩碼而過慢；把移動貢獻改寫為前綴函數差並再次離線，可集中掃描求值。
statement: |-
  給定一個序列與一個常數 k，每次詢問一個區間，求區間內有多少對 (i, j)（i < j）滿足 a_i 異或 a_j 的二進位 1 的個數恰為 k。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '1 <= n, m <= 100000'
  - '0 <= k <= 14'
  - '0 <= a_i < 2^14，且 1 <= l <= r <= n'
input_format: '第一行三個整數 n、m、k；第二行 n 個整數；接下來 m 行每行兩個整數 l 與 r。'
output_format: '對每個詢問輸出一行。'
samples:
  - input: |
      8 5 1
      3 1 5 4 6 2 7 0
      1 8
      2 5
      3 3
      1 4
      5 8
    output: |
      12
      3
      0
      3
      3
    explanation: |-
      k=1 表示兩數的異或值恰有一個 1，也就是兩數只差一個二進位位元。區間 [3,3] 只有一個元素，湊不出任何一對，故為 0。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    先看清楚障礙：莫隊要求指標每移動一步是 O(1)，但這裡加入位置 x 時要問「窗口內有幾個 j 使 popcount(a_j ⊕ a_x) = k」。用值域計數陣列回答是 O(C(14,k))，乘上 O(n√n) 次移動就爆了。
  - |-
    二次離線的核心手法：把每次移動的貢獻寫成兩個**前綴函數**相減。定義 P(x, p) = |{ j ≤ p, j ≠ x : popcount(a_j ⊕ a_x) = k }|。那麼「右端右移加入 x」的貢獻就是 P(x, right) − P(x, left−1) = pre_left[x] − P(x, left−1)，其中 pre_left[x] = P(x, x−1) 可以一次 O(n·C) 預處理。
  - |-
    四種指標移動都照這個模式拆（注意移除時符號相反）。剩下的 P(x, p) 型別的項，把它們記成 (前綴位置 p, 位置區間 [lo, hi], 正負號)**掛起來不算**——這就是「第二次離線」。
solution_outline: |-
  先預處理 pre_left[x]。接著跑一次莫隊，但**不真的移動窗口內容**：對每一段指標移動，把可以直接算的 pre_left 部分累加到該詢問的 delta，把 P(x, p) 部分記成帶符號的延遲請求掛在前綴位置 p 上。莫隊跑完後由左到右掃描 p，維護前綴值域計數陣列並統一回答所有延遲請求，把結果按符號加進對應的 delta。最後依莫隊的排序順序把 delta 累加成前綴和，即為各詢問的答案。
proof_or_invariant: |-
  正確性建立在兩個等式上。其一，窗口 [l, r] 加入位置 x 時新增的配對數等於 P(x, r) − P(x, l−1)，因為 P 對前綴可差分。其二，delta 記的是「相鄰兩個排序後詢問的答案差」，所以依序累加得到的前綴和恰為各詢問的答案。複雜度方面，延遲請求的區間總長等於莫隊的總移動距離 O(n√n)，掃描階段每個位置查一次值域計數陣列是 O(C(14,k))，故總時間 O(n√n · C)，而預處理與掃描各只需一個 2^14 的計數陣列。
complexity:
  time: 'O(n√n · C(14,k))，並把值域級的查詢從每次移動搬到一次掃描'
  space: 'O(n√n) 的延遲請求加上 O(2^14) 的計數陣列'
common_errors:
  - 把相鄰莫隊詢問的答案差直接當成完整答案
  - k 為 0 時沒有排除元素和自己的配對
  - 四種端點移動的延遲請求正負號寫反
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static const int kBits = 14;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, k;
      if (!(cin >> n >> m >> k)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      struct Query {
          int left, right;
      };
      vector<Query> queries(static_cast<size_t>(m));
      for (Query& q : queries) { cin >> q.left >> q.right; }

      // TODO：莫隊二次離線。
      //   問題在於：莫隊要求單點增刪 O(1)，但這裡加入位置 x 時要問
      //   「窗口內有幾個 j 使 popcount(a_j ^ a_x) == k」，樸素是 O(值域)。
      //
      //   關鍵是把每次移動的貢獻拆成兩個**前綴函數**相減：
      //       P(x, p) = |{ j <= p, j != x : popcount(a_j ^ a_x) == k }|
      //   四種移動分別是（其中 pre_left[x] 就是 P(x, x−1)，可預處理）：
      //       右端右移加入 x：+pre_left[x] − P(x, left−1)
      //       左端左移加入 x：−pre_left[x] + P(x, right)
      //       右端左移移除 x：−pre_left[x] + P(x, left−1)
      //       左端右移移除 x：+pre_left[x] − P(x, right)
      //   把所有 P(x, p) 記成 (前綴位置 p, 位置區間 [lo, hi], 正負號)，
      //   **第二次離線**：p 由左到右掃一遍，維護前綴計數後統一回答。
      //
      //   兩個容易錯的地方：
      //     (a) 這些貢獻是**累進**到一個 running total 的，不是各自屬於某個查詢；
      //         要先把每次移動的 delta 存起來，最後依排序順序做前綴和。
      //     (b) k == 0 時 a_x 與自己也符合條件，若 x 已落在前綴內要扣掉 1。
      // 下面是 O(n²) 的樸素版本。
      for (const Query& q : queries) {
          long long total = 0;
          for (int i = q.left; i <= q.right; ++i) {
              for (int j = i + 1; j <= q.right; ++j) {
                  if (__builtin_popcount(static_cast<unsigned>(a[static_cast<size_t>(i)] ^
                                                              a[static_cast<size_t>(j)])) == k) {
                      ++total;
                  }
              }
          }
          cout << total << '\n';
      }
      (void)kBits;
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 莫隊二次離線。
  // 莫隊要求單點增刪 O(1)，但本題加入一個位置 x 時要問「窗口內有幾個 j 使
  // popcount(a_j ^ a_x) == k」，樸素是 O(值域)。
  // 解法：把每次移動的貢獻拆成兩個前綴函數相減
  //     P(x, p) = |{ j <= p, j != x : popcount(a_j ^ a_x) == k }|
  // 其中一項可以預處理（P(x, x−1) 就是 pre_left[x]），另一項則把
  // (前綴位置 p, 位置區間 [lo, hi], 正負號) 記下來**第二次離線**，
  // 最後用一次由左到右的掃描統一回答。
  static const int kBits = 14;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, k;
      if (!(cin >> n >> m >> k)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 2, 0);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }

      vector<int> masks;
      for (int v = 0; v < (1 << kBits); ++v) {
          if (__builtin_popcount(static_cast<unsigned>(v)) == k) { masks.push_back(v); }
      }

      struct Query {
          int left, right, index;
      };
      vector<Query> queries(static_cast<size_t>(m));
      for (int i = 0; i < m; ++i) {
          cin >> queries[static_cast<size_t>(i)].left >> queries[static_cast<size_t>(i)].right;
          queries[static_cast<size_t>(i)].index = i;
      }
      const int block = max(1, static_cast<int>(sqrt(static_cast<double>(n))));
      sort(queries.begin(), queries.end(), [block](const Query& x, const Query& y) {
          const int bx = x.left / block;
          const int by = y.left / block;
          if (bx != by) { return bx < by; }
          return (bx & 1) ? x.right > y.right : x.right < y.right;
      });

      // pre_left[i] = |{ j < i : popcount(a_j ^ a_i) == k }|
      vector<long long> pre_left(static_cast<size_t>(n) + 2, 0);
      {
          vector<int> count_of(1 << kBits, 0);
          for (int i = 1; i <= n; ++i) {
              long long total = 0;
              for (const int mask : masks) {
                  total += count_of[static_cast<size_t>(a[static_cast<size_t>(i)] ^ mask)];
              }
              pre_left[static_cast<size_t>(i)] = total;
              ++count_of[static_cast<size_t>(a[static_cast<size_t>(i)])];
          }
      }

      struct Deferred {
          int lo, hi, sign, slot;
      };
      vector<vector<Deferred>> pending(static_cast<size_t>(n) + 2);
      vector<long long> delta(static_cast<size_t>(m), 0);

      int left = 1;
      int right = 0;
      for (size_t qi = 0; qi < queries.size(); ++qi) {
          const Query& q = queries[qi];
          const int slot = static_cast<int>(qi);
          // 1) 右端右移：加入 x，貢獻 = pre_left[x] − P(x, left−1)
          if (q.right > right) {
              for (int x = right + 1; x <= q.right; ++x) { delta[qi] += pre_left[static_cast<size_t>(x)]; }
              pending[static_cast<size_t>(left - 1)].push_back({right + 1, q.right, -1, slot});
              right = q.right;
          }
          // 2) 左端左移：加入 x，貢獻 = P(x, right) − pre_left[x]
          if (q.left < left) {
              for (int x = q.left; x <= left - 1; ++x) { delta[qi] -= pre_left[static_cast<size_t>(x)]; }
              pending[static_cast<size_t>(right)].push_back({q.left, left - 1, 1, slot});
              left = q.left;
          }
          // 3) 右端左移：移除 x，貢獻 = −pre_left[x] + P(x, left−1)
          if (q.right < right) {
              for (int x = q.right + 1; x <= right; ++x) { delta[qi] -= pre_left[static_cast<size_t>(x)]; }
              pending[static_cast<size_t>(left - 1)].push_back({q.right + 1, right, 1, slot});
              right = q.right;
          }
          // 4) 左端右移：移除 x，貢獻 = pre_left[x] − P(x, right)
          if (q.left > left) {
              for (int x = left; x <= q.left - 1; ++x) { delta[qi] += pre_left[static_cast<size_t>(x)]; }
              pending[static_cast<size_t>(right)].push_back({left, q.left - 1, -1, slot});
              left = q.left;
          }
      }

      // 第二次離線的掃描：p 由 0 到 n，維護前綴計數後統一回答掛在 p 上的請求。
      {
          vector<int> count_of(1 << kBits, 0);
          for (int p = 0; p <= n; ++p) {
              if (p >= 1) { ++count_of[static_cast<size_t>(a[static_cast<size_t>(p)])]; }
              for (const Deferred& d : pending[static_cast<size_t>(p)]) {
                  long long total = 0;
                  for (int x = d.lo; x <= d.hi; ++x) {
                      long long value = 0;
                      for (const int mask : masks) {
                          value += count_of[static_cast<size_t>(a[static_cast<size_t>(x)] ^ mask)];
                      }
                      // k == 0 時 a_x 與自己也會被算進去，若 x 已在前綴內要扣掉。
                      if (k == 0 && x <= p) { --value; }
                      total += value;
                  }
                  delta[static_cast<size_t>(d.slot)] += d.sign * total;
              }
          }
      }

      vector<long long> answer(static_cast<size_t>(m), 0);
      long long running = 0;
      for (size_t qi = 0; qi < queries.size(); ++qi) {
          running += delta[qi];
          answer[static_cast<size_t>(queries[qi].index)] = running;
      }
      for (const long long value : answer) { cout << value << '\n'; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4887
external_platform: 洛谷
external_problem_id: P4887
external_title: '【模板】莫隊二次離線 / 第十四分塊(前體)'
external_relation: original
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
review_status: verified
---

莫隊二次離線是「離線的離線」：第一次離線把詢問排序，第二次離線把移動的貢獻本身也排序後批次結算。想通「貢獻可以拆成前綴差」這一步，剩下的就只是記帳。
