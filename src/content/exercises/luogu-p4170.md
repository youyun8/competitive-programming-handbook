---
id: luogu-p4170
volume: upper
source_file: upper-volume
title: 洛谷 P4170 塗色
chapter: 5
section: '5.5'
kind: external-oj
difficulty: 3
topics: [dynamic-programming, interval-dp, strange-printer]
prerequisites: [interval-dp]
statement: 一條未上色木板的目標顏色由大寫字母字串表示。每次可把任意連續區間塗成同一顏色，覆蓋原色；求最少操作數。
constraints:
  - 1 <= 字串長度 <= 50
  - 字串只含大寫英文字母
input_format: 一行目標顏色字串。
output_format: 輸出最少塗色次數。
samples:
  - input: 'RGBGR'
    output: '3'
    explanation: 先整段塗 R，再把中間三格塗 G，最後中央一格塗 B，共三次且已最少。
core_knowledge: [區間 DP, 覆蓋操作合併]
judgment: 後塗顏色會完全覆蓋先前顏色；每次所選區間可為任意長度。
hints:
  - 令 dp[l][r] 為完成目標子串的最少次數，單一位置需一次。
  - 若兩端顏色相同，可讓其中一端搭上替另一端上色的同一次操作。
  - 兩端不同時枚舉分界 k，合併 dp[l][k] 與 dp[k+1][r]。
solution_outline: 依區間長度計算；端點同色時取去掉任一端的較小值，否則枚舉切點相加。
proof_or_invariant: >-
  端點同色時，任一完成內部及一端的方案中，最後覆蓋該端為目標色的操作可延伸至另一端，
  不增加次數；反向刪除一端又給出下界。端點異色時，最終形成兩端的操作不能是同一次，
  可在兩者影響範圍間選一分界，成本至少是兩子區間最優值之和；枚舉分界的方案也都可行。
  由短區間歸納得到全串最優值。
common_errors: [忽略後塗可覆蓋前色, 端點同色仍固定加一, 區間切分漏掉某個 k]
complexity:
  time: O(n^3)
  space: O(n^2)
cpp_skeleton: |
  #include <iostream>
  #include <string>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      string target; cin >> target;
      // TODO：依區間長度計算最少塗色次數。
      cout << target.size() - target.size() << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <limits>
  #include <string>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      string target; cin >> target;
      const int n = static_cast<int>(target.size());
      vector<vector<int>> dp(static_cast<size_t>(n), vector<int>(static_cast<size_t>(n), 0));
      for (int i = 0; i < n; ++i) dp[static_cast<size_t>(i)][static_cast<size_t>(i)] = 1;
      for (int length = 2; length <= n; ++length) for (int left = 0; left + length <= n; ++left) {
          const int right = left + length - 1;
          if (target[static_cast<size_t>(left)] == target[static_cast<size_t>(right)]) {
              dp[static_cast<size_t>(left)][static_cast<size_t>(right)] =
                  min(dp[static_cast<size_t>(left + 1)][static_cast<size_t>(right)],
                      dp[static_cast<size_t>(left)][static_cast<size_t>(right - 1)]);
          } else {
              int best = numeric_limits<int>::max();
              for (int split = left; split < right; ++split)
                  best = min(best, dp[static_cast<size_t>(left)][static_cast<size_t>(split)] +
                                   dp[static_cast<size_t>(split + 1)][static_cast<size_t>(right)]);
              dp[static_cast<size_t>(left)][static_cast<size_t>(right)] = best;
          }
      }
      cout << dp[0][static_cast<size_t>(n - 1)] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P4170
external_platform: 洛谷
external_problem_id: P4170
external_title: 涂色
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

相同端點可以共用一次塗色，是此區間 DP 比單純切分更省操作的來源。
