---
id: luogu-p1816
volume: upper
source_file: upper-volume
title: 洛谷 P1816 忠誠：靜態區間最小值
chapter: 2
section: '2.5'
kind: external-oj
difficulty: 2
topics: ['ST 表', 'RMQ', '倍增法']
prerequisites: ['sparse-table']
statement: |-
  有 m 筆依時間編號的帳目及 n 次查詢。每次給定兩個編號 a、b，請回答閉區間 [a,b] 中金額最小的一筆。
constraints:
  - '1 <= m, n <= 100000'
  - '查詢端點皆為合法的一基索引'
input_format: '第一行輸入 m、n；第二行輸入 m 筆帳目；接著 n 行各輸入查詢端點 a、b。'
output_format: '在同一行依序輸出各查詢答案，以空格分隔。'
samples:
  - input: |
      10 3
      1 2 3 4 5 6 7 8 9 10
      2 7
      3 9
      1 10
    output: |
      2 3 1
    explanation: '三個區間的最小值分別是 2、3、1。'
core_knowledge:
  - 'ST 表預存每個起點、每種 2 的冪長度的最小值。'
  - 'min 具有冪等性，因此查詢可由兩段可能重疊的區間合併。'
judgment: '資料沒有修改且有大量區間最小值查詢，可用 ST 表做到 O(1) 單次查詢。'
hints:
  - '令 st[k][i] 表示從 i 開始、長度 2^k 的區間最小值。'
  - '遞推時把長度 2^k 的區間分成兩個長度 2^(k-1) 的相鄰半段。'
  - '查詢 [l,r] 時令 k=floor(log2(r-l+1))，取貼齊左右端的兩段之最小值。'
solution_outline: '先建整數對數表與 ST 表。每次查詢取兩個長度為不超過區間長度之最大二次冪的片段，輸出兩者最小值。'
proof_or_invariant: |-
  依歸納，st[k][i] 正確保存其代表區間的最小值。查詢選出的左右片段聯集覆蓋 [l,r]，又 min 對重複元素無影響，所以兩片段最小值的較小者恰為全區間最小值。
common_errors:
  - '混用一基查詢與零基陣列。'
  - '輸出格式要求答案在同一行。'
  - '右片段起點少寫加一。'
complexity:
  time: '預處理 O(m log m)，每次查詢 O(1)'
  space: 'O(m log m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int m, n;
      cin >> m >> n;
      // TODO：讀入帳目並建立最小值 ST 表與整數對數表。
      // TODO：O(1) 回答 n 次查詢。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int m, n;
      if (!(cin >> m >> n)) { return 0; }
      int levels = 1;
      while ((1 << levels) <= m) { ++levels; }
      vector<vector<int>> st(static_cast<size_t>(levels),
                             vector<int>(static_cast<size_t>(m)));
      for (int& value : st[0]) { cin >> value; }
      for (int k = 1; k < levels; ++k) {
          const int span = 1 << k;
          const int half = span >> 1;
          for (int i = 0; i + span <= m; ++i) {
              st[static_cast<size_t>(k)][static_cast<size_t>(i)] =
                  min(st[static_cast<size_t>(k - 1)][static_cast<size_t>(i)],
                      st[static_cast<size_t>(k - 1)][static_cast<size_t>(i + half)]);
          }
      }
      vector<int> logs(static_cast<size_t>(m + 1), 0);
      for (int i = 2; i <= m; ++i) {
          logs[static_cast<size_t>(i)] = logs[static_cast<size_t>(i / 2)] + 1;
      }
      for (int query = 0; query < n; ++query) {
          int l, r;
          cin >> l >> r;
          --l;
          --r;
          const int k = logs[static_cast<size_t>(r - l + 1)];
          const int span = 1 << k;
          const int answer = min(st[static_cast<size_t>(k)][static_cast<size_t>(l)],
                                 st[static_cast<size_t>(k)]
                                   [static_cast<size_t>(r - span + 1)]);
          if (query > 0) { cout << ' '; }
          cout << answer;
      }
      cout << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1816
external_platform: 洛谷
external_problem_id: P1816
external_title: 忠誠
external_relation: original
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

本題與一般 ST 表最大值模板相同，只把合併運算換成最小值。
