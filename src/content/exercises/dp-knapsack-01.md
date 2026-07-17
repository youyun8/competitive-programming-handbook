---

id: dp-knapsack-01
volume: upper
source_file: upper-volume
title: 0-1 背包問題
chapter: 5
section: '5.2'
kind: practice
difficulty: 2
topics:
  - dynamic-programming
  - knapsack
  - linear-dp
prerequisites:
  - arrays
statement: 給定 n 個物品，每個物品有重量 w[i] 與價值 v[i]。背包容量為 W，每個物品只能選或不選，求最大總價值。
constraints:
  - 1 <= n <= 1000
  - 1 <= W <= 100000
  - 1 <= w[i] <= W
  - 1 <= v[i] <= 1000000000
input_format: 第一行為 n 與 W。接下來 n 行各為 w[i] 與 v[i]。
output_format: 輸出最大價值。
samples:
  - input: |
      4 8
      2 3
      3 4
      4 5
      5 6
    output: |
      10
    explanation: 選重量 3+5=8，價值 4+6=10 為最優。
hints:
  - 定義 dp[j] 為容量 j 時的最大價值。
  - 為避免重複選取，容量由大到小更新。
solution_outline: 一維滾動陣列 DP。對每個物品，容量從 W 往 w[i] 掃描，dp[j] = max(dp[j], dp[j-w[i]] + v[i])。
proof_or_invariant: dp[j] 始終代表只考慮已處理物品時，容量 j 可達的最大價值。由大到小更新保證每個物品只被選一次。
complexity:
  time: O(n * W)
  space: O(W)
cpp_solution: |
  #include <iostream>
  #include <vector>
  
  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0, W = 0;
      std::cin >> n >> W;
      std::vector<long long> dp(W + 1, 0);
      for (int i = 0; i < n; ++i) {
          int w = 0;
          long long v = 0;
          std::cin >> w >> v;
          for (int j = W; j >= w; --j) {
              dp[j] = std::max(dp[j], dp[j - w] + v);
          }
      }
      std::cout << dp[W] << "\n";
  }
source_book_pages:
  - 316
  - 385
source_pdf_pages:
  - 334
  - 403
review_status: verified
external_url: https://www.luogu.com.cn/problem/P1048
external_platform: 洛谷
external_problem_id: P1048
external_title: 采药
external_relation: related
---

