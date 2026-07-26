---
id: luogu-p2953
volume: lower
source_file: lower-volume
title: 洛谷 P2953 數字減法博弈
chapter: 7
section: '7.9'
kind: external-oj
difficulty: 2
topics: [game-theory, dynamic-programming]
prerequisites: [combinatorial-game-theory]
statement: 每局從正整數 n 開始，兩人輪流減去目前十進位數字中的最大數字或最小非零數字；數字成為 0 後無法操作的人輸。判斷先手是否必勝。
constraints: [1 <= games <= 100, 1 <= n <= 1000000]
input_format: 第一行為局數 G，接著 G 行各有起始整數 n。
output_format: 每局先手必勝輸出 YES，否則輸出 NO。
samples:
  - input: |-
      2
      9
      10
    output: |-
      YES
      NO
    explanation: 9 可一步歸零；10 只能先減 1 留下 9，對手一步取完。
core_knowledge: [無環公平博弈的勝敗態遞推, 依狀態拓撲序預處理]
judgment: 只能選「最大數字」或「最小非零數字」，不是任選任一位數。
hints:
  - 每一步都嚴格減小目前數字，因此可從 0 往上計算。
  - 狀態必勝當且僅當至少有一個合法後繼是必敗。
  - 對每個值掃描十進位各位，取得最大位與最小非零位。
solution_outline: 讀完查詢取最大值；令 win[0]=false，依序計算兩個後繼，最後回答每個查詢。
proof_or_invariant: 計算 win[x] 時所有後繼皆小於 x 且已正確。若存在必敗後繼，當前玩家走到它即可勝；若所有後繼必勝，任何一步都把必勝局面交給對手，故當前必敗。歸納得所有狀態正確。
common_errors: [把 0 當成最小數字, 只初始化 1 到 9 而未正確設定 win_0, 對每筆查詢重做整張 DP]
complexity: { time: 'O(M log M + G)', space: 'O(M)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int games; cin >> games; /* TODO: 離線預處理勝敗態。 */ return 0; }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int games;
      cin >> games;
      vector<int> query(static_cast<size_t>(games));
      int maximum = 0;
      for (int &value : query) { cin >> value; maximum = max(maximum, value); }
      vector<bool> win(static_cast<size_t>(maximum) + 1U, false);
      for (int value = 1; value <= maximum; ++value) {
          int temporary = value;
          int minimum_digit = 10;
          int maximum_digit = 0;
          while (temporary > 0) {
              const int digit = temporary % 10;
              if (digit != 0) minimum_digit = min(minimum_digit, digit);
              maximum_digit = max(maximum_digit, digit);
              temporary /= 10;
          }
          win[static_cast<size_t>(value)] =
              !win[static_cast<size_t>(value - minimum_digit)] ||
              !win[static_cast<size_t>(value - maximum_digit)];
      }
      for (int value : query) cout << (win[static_cast<size_t>(value)] ? "YES\n" : "NO\n");
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2953
external_platform: 洛谷
external_problem_id: P2953
external_title: '[USACO09OPEN] Cow Digit Game S'
external_relation: original
source_book_pages: [511, 515]
source_pdf_pages: [141, 145]
review_status: verified
---

此題直接展示勝敗態定義如何轉化為自底向上的布林動態規劃。
