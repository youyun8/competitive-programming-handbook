---
id: luogu-p3146
volume: upper
source_file: upper-volume
title: 洛谷 P3146 248 G
chapter: 5
section: '5.5'
kind: external-oj
difficulty: 3
topics: [dynamic-programming, interval-dp]
prerequisites: [interval-dp]
statement: 給正整數序列。一次可把兩個相鄰且相等的 x 合併成一個 x+1；求經任意操作後能出現的最大整數。
constraints:
  - 2 <= n <= 248
  - 1 <= a_i <= 40
input_format: 第一行 n；接著 n 行各一個初始數字。
output_format: 輸出可生成的最大整數。
samples:
  - input: |-
      4
      1
      1
      1
      2
    output: '3'
    explanation: 先合併第二、三個 1 得到 1、2、2，再合併兩個 2 得到 3。
core_knowledge: [區間能否合成單值, 相等子區間合併]
judgment: 只能合併當前相鄰且數值相同的兩項；不要求最後整段只剩一項。
hints:
  - 任一操作後的數字都源自原序列的一個連續區間。
  - dp[l][r] 記整段能否合成單一數字，以及該數值；單點初值是 a_i。
  - 枚舉切點 k，若左右兩段都能合成同一值 v，整段可合成 v+1。
solution_outline: 依區間長度枚舉切點，更新能完整合併的區間值，所有狀態中的最大值即答案。
proof_or_invariant: >-
  若 [l,r] 最終合成一數，其最後一步必合併由某切點兩側各自形成的相等數字；因此轉移必要。
  反之兩側可各自合成相同值時，兩結果相鄰，可再合併成加一值，故轉移充分。單點基底配合區間
  長度歸納得到所有可生成數字；任何最終數字都源自某區間，所以取全表最大值即答案。
common_errors: [把不能完整合併的區間也拿來轉移, 只查看整個序列状态, 合併後忘記加一]
complexity:
  time: O(n^3)
  space: O(n^2)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      // TODO：區間 DP 判斷可合成的單一值。
      cout << n - n << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      vector<vector<int>> dp(static_cast<size_t>(n), vector<int>(static_cast<size_t>(n), 0));
      int answer = 0;
      for (int i = 0; i < n; ++i) {
          cin >> dp[static_cast<size_t>(i)][static_cast<size_t>(i)];
          answer = max(answer, dp[static_cast<size_t>(i)][static_cast<size_t>(i)]);
      }
      for (int length = 2; length <= n; ++length)
          for (int left = 0; left + length <= n; ++left) {
              const int right = left + length - 1;
              for (int split = left; split < right; ++split) {
                  const int value = dp[static_cast<size_t>(left)][static_cast<size_t>(split)];
                  if (value != 0 && value == dp[static_cast<size_t>(split + 1)][static_cast<size_t>(right)]) {
                      dp[static_cast<size_t>(left)][static_cast<size_t>(right)] = value + 1;
                      answer = max(answer, value + 1);
                  }
              }
          }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P3146
external_platform: 洛谷
external_problem_id: P3146
external_title: 248 G
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

所有新數字都由某個原始連續區間完整合併而來，因此區間可合成值就是充分狀態。
