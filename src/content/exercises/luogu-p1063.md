---
id: luogu-p1063
volume: upper
source_file: upper-volume
title: 洛谷 P1063 能量項鍊
chapter: 5
section: '5.5'
kind: external-oj
difficulty: 3
topics: [dynamic-programming, interval-dp, circular-sequence]
prerequisites: [interval-dp]
statement: >-
  n 顆珠子環形排列，第 i 顆可視為首標記 a_i、尾標記 a_(i+1)。合併相鄰兩段時，
  若邊界標記為 x、y、z，釋放能量 xyz，並形成首 x、尾 z 的新珠。求合併成一顆的最大能量。
constraints:
  - 4 <= n <= 100
  - 1 <= a_i <= 100
input_format: 第一行 n，第二行 n 個珠子標記。
output_format: 輸出最大可釋放能量。
samples:
  - input: |-
      4
      2 3 5 10
    output: '710'
    explanation: 破環後對所有切點做區間 DP，最佳合併順序累計能量為 710。
core_knowledge: [環形區間 DP, 最後合併位置]
judgment: 珠子順序不可改變；可選任意相鄰珠子合併，直到環上只剩一顆。
hints:
  - 複製標記序列，把每個環形切點變成一個長度 n 的線性區間。
  - dp[l][r] 表示合併珠子 l..r 的最大能量；枚舉最後分界 k。
  - 最後合併兩段的新增能量是 a[l]*a[k+1]*a[r+1]。
solution_outline: 在加倍序列上依區間長度遞增，枚舉切點更新最大能量，最後枚舉所有長度 n 區間。
proof_or_invariant: >-
  任一區間方案最後會合併 [l,k] 與 [k+1,r]，兩側先前能量至多為各自 DP 最佳值，最後邊界
  三標記固定為 a[l]、a[k+1]、a[r+1]。反之兩側最佳方案加最後合併必可行，故枚舉 k 得精確
  區間最優值。環上任一最終合併樹都可在某邊切開，加倍後枚舉起點即涵蓋所有方案。
common_errors:
  - 最後乘積的分界下標寫錯
  - 忘記枚舉環形起點
  - 區間長度或右端點多一
complexity:
  time: O(n^3)
  space: O(n^2)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      // TODO：加倍序列並做最大值區間 DP。
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
      vector<int> value(static_cast<size_t>(2 * n + 2), 0);
      for (int i = 1; i <= n; ++i) {
          cin >> value[static_cast<size_t>(i)];
          value[static_cast<size_t>(i + n)] = value[static_cast<size_t>(i)];
      }
      value[static_cast<size_t>(2 * n + 1)] = value[1];
      vector<vector<int>> dp(static_cast<size_t>(2 * n + 1),
                             vector<int>(static_cast<size_t>(2 * n + 1), 0));
      for (int length = 2; length <= n; ++length)
          for (int left = 1; left + length - 1 <= 2 * n; ++left) {
              const int right = left + length - 1;
              for (int split = left; split < right; ++split)
                  dp[static_cast<size_t>(left)][static_cast<size_t>(right)] =
                      max(dp[static_cast<size_t>(left)][static_cast<size_t>(right)],
                          dp[static_cast<size_t>(left)][static_cast<size_t>(split)] +
                          dp[static_cast<size_t>(split + 1)][static_cast<size_t>(right)] +
                          value[static_cast<size_t>(left)] *
                          value[static_cast<size_t>(split + 1)] *
                          value[static_cast<size_t>(right + 1)]);
          }
      int answer = 0;
      for (int left = 1; left <= n; ++left)
          answer = max(answer, dp[static_cast<size_t>(left)][static_cast<size_t>(left + n - 1)]);
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1063
external_platform: 洛谷
external_problem_id: P1063
external_title: 能量项链
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

區間的尾標記在右端下一個位置；把這個邊界寫清楚即可避免環形下標混亂。
