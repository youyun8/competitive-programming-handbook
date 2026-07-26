---
id: luogu-p2947
volume: upper
source_file: upper-volume
original_label: 洛谷 P2947
title: 洛谷 P2947 Look Up S：右側最近的更高者
chapter: 1
section: '1.3'
kind: external-oj
difficulty: 2
topics: ['單調堆疊', '下一個更大元素', '線性掃描']
prerequisites: ['stack', 'arrays']
statement: |-
  n 頭牛依編號 1 到 n 排成一列，第 i 頭的高度為 h[i]。對每頭牛找出右側編號最小、且高度嚴格大於自己的牛；若右側沒有更高者，答案為 0。
constraints:
  - '1 <= n <= 100000'
  - '1 <= h[i] <= 1000000'
input_format: 第一行為整數 n；接著 n 行，第 i 行給出第 i 頭牛的高度 h[i]。
output_format: 輸出 n 行；第 i 行為第 i 頭牛右側最近且更高者的編號，不存在時輸出 0。
samples:
  - input: |
      6
      3
      2
      6
      1
      1
      2
    output: |
      3
      3
      0
      6
      6
      0
    explanation: 第 1、2 頭右側遇到的第一頭更高牛都是編號 3；第 4、5 頭的答案都是 6；高度 6 的第 3 頭及列尾的第 6 頭沒有答案。
core_knowledge:
  - 從右往左維護候選索引的單調堆疊
  - 高度小於或等於目前高度的候選不可能成為答案
  - 嚴格更高要求相等高度也必須彈出
judgment: 題目同時要求「右側」、「最近」與「嚴格更高」，可從右往左掃描，讓彈除無效候選後的堆疊頂端直接代表最近答案。
hints:
  - 第一階段：若由右往左處理，輪到位置 i 時，右側所有位置都已看過；哪些位置還值得保留？
  - 第二階段：高度不大於 h[i] 的右側位置不可能回答 i，也會被較近且至少同高的 i 遮蔽，可從候選頂端移除。
  - 第三階段：彈掉所有高度 `<= h[i]` 的索引後，棧頂就是最近的嚴格更高者；記錄後把 i 入棧。
solution_outline: 由 i=n 至 1 掃描。當堆疊非空且棧頂高度不大於 h[i] 時持續彈出；此後棧頂若存在就是答案，否則記 0，再將 i 推入堆疊。
proof_or_invariant: 處理 i 前，堆疊由頂到底依位置往右排列，且高度嚴格遞增。所有被彈出的索引高度皆不大於 h[i]，不能回答 i；對更左的位置而言，i 又比它們更近且不矮，因此它們永不再有用。剩餘棧頂是未被淘汰者中位置最小的一個，且高度大於 h[i]，恰為答案。
complexity:
  time: 'O(n)'
  space: 'O(n)'
common_errors:
  - 只彈出較矮者而保留等高者，違反「嚴格更高」
  - 輸出高度而非牛的編號
  - 將 n 個高度誤讀成同一行限定；實際上一般空白讀取均可
  - 從左往右掃描時沒有保存尚未找到答案的索引
cpp_skeleton: |
  #include <iostream>
  #include <vector>

  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n;
      cin >> n;
      vector<int> height(static_cast<size_t>(n) + 1);
      vector<int> answer(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) {
          cin >> height[static_cast<size_t>(i)];
      }

      vector<int> candidates;
      // TODO：由右往左維護 candidates，棧內存索引。
      (void)candidates;

      for (int i = 1; i <= n; ++i) {
          cout << answer[static_cast<size_t>(i)] << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <vector>

  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n;
      if (!(cin >> n)) {
          return 0;
      }
      vector<int> height(static_cast<size_t>(n) + 1);
      vector<int> answer(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) {
          cin >> height[static_cast<size_t>(i)];
      }

      vector<int> candidates;
      for (int i = n; i >= 1; --i) {
          while (!candidates.empty() &&
                 height[static_cast<size_t>(candidates.back())] <=
                     height[static_cast<size_t>(i)]) {
              candidates.pop_back();
          }
          if (!candidates.empty()) {
              answer[static_cast<size_t>(i)] = candidates.back();
          }
          candidates.push_back(i);
      }

      for (int i = 1; i <= n; ++i) {
          cout << answer[static_cast<size_t>(i)] << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2947
external_platform: 洛谷
external_problem_id: P2947
external_title: '[USACO09MAR] Look Up S'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

這是「下一個嚴格更大元素」的標準模型；倒序掃描能讓棧頂直接成為最近答案。
