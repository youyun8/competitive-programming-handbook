---
id: openj-bailian-1163
volume: upper
source_file: upper-volume
title: OpenJudge 1163 The Triangle
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 2
topics: [dynamic-programming, triangle-dp]
prerequisites: [dynamic-programming]
statement: >-
  給一個 n 列的數字三角形。從頂端出發，每一步只能走到下一列左下或右下的相鄰數字，
  最後抵達底列。求路徑經過數字的最大總和。
constraints:
  - 2 <= n <= 100
  - 0 <= value <= 99
input_format: 第一行為列數 n，接著第 i 列有 i 個整數。
output_format: 輸出從頂端到底列的最大路徑和。
samples:
  - input: |-
      5
      7
      3 8
      8 1 0
      2 7 4 4
      4 5 2 6 5
    output: '30'
    explanation: 路徑 7→3→8→7→5 的總和為 30，且 DP 沒有更大的底列狀態。
core_knowledge: [數字三角形 DP, 滾動陣列]
judgment: 必須從頂端開始並在底列結束，不能中途停止或跳列。
hints:
  - 每個位置只可能由上一列的兩個相鄰位置抵達。
  - 令 dp[j] 表示目前列第 j 格的最大路徑和，邊界只有一個前驅。
  - 從右向左原地更新，可避免左側舊狀態過早被覆寫。
solution_outline: 以負無限初始化一維狀態，逐列從右往左以兩個父狀態最大值加當前數字更新。
proof_or_invariant: >-
  處理完第 i 列後，dp[j] 是頂端到該格的最大和。任何到該格的路徑最後一步必來自左上或右上，
  取兩者最佳值再加本格即涵蓋所有路徑；每個候選也確實可行。初始頂端正確，逐列歸納後，
  底列狀態最大值就是答案。
common_errors: [原地更新由左往右而讀到本列新值, 邊界讀取不存在的父格, 只輸出底列最後一格]
complexity:
  time: O(n^2)
  space: O(n)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      // TODO：逐列維護各位置可達的最大路徑和。
      (void)n;
      cout << 0 << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      const int negative = numeric_limits<int>::min() / 4;
      vector<int> dp(static_cast<size_t>(n), negative);
      for (int row = 0; row < n; ++row) {
          vector<int> values(static_cast<size_t>(row + 1));
          for (int& value : values) cin >> value;
          for (int column = row; column >= 0; --column) {
              const int left_parent = column > 0 ? dp[static_cast<size_t>(column - 1)] : negative;
              const int right_parent = column < row ? dp[static_cast<size_t>(column)] : negative;
              dp[static_cast<size_t>(column)] =
                  row == 0 ? values[0] : max(left_parent, right_parent) +
                      values[static_cast<size_t>(column)];
          }
      }
      cout << *max_element(dp.begin(), dp.end()) << '\n';
  }
external_url: http://bailian.openjudge.cn/practice/1163/
external_platform: OpenJudge 百練
external_problem_id: '1163'
external_title: The Triangle
external_relation: original
source_book_pages: [333]
source_pdf_pages: [351]
review_status: verified
---

此題也能自底向上計算；一維原地版本的重點是保住尚未使用的上一列狀態。
