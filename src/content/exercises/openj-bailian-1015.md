---
id: openj-bailian-1015
volume: upper
source_file: upper-volume
title: OpenJudge 百練 1015 Jury Compromise
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 4
topics: [dynamic-programming, knapsack, reconstruction]
prerequisites: [zero-one-knapsack]
statement: 從 n 位候選人選 m 位。候選人 i 有控方分 p_i 與辯方分 d_i；先最小化兩方總分差絕對值，再最大化兩方總分和，並輸出一組入選編號。
constraints:
  - 多組資料，以 n=m=0 結束
  - 1 <= n <= 200，1 <= m <= 20，m <= n
  - 0 <= p_i,d_i <= 20
input_format: 每組第一行 n、m，接著 n 行 p_i、d_i；最後為 0 0。
output_format: 依指定 Jury 編號、兩方總分與升序候選人編號輸出，每組後空一行。
samples:
  - input: |-
      4 2
      1 2
      2 3
      4 1
      6 2
      0 0
    output: |-
      Jury #1
      Best jury has value 6 for prosecution and value 4 for defence:
       2 3
    explanation: 選第 2、3 人時控方總分 6、辯方總分 4；差值 2 已最小，並在同差值方案中總和最大。
core_knowledge: [差值平移背包, 次要目標最大化, 路徑回溯]
judgment: 最小化絕對差是第一優先；只有絕對差相同才比較總分和。
hints:
  - 每人的差值 p_i-d_i 位於 [-20,20]，選 m 人後總差僅在 [-400,400]。
  - DP 維度為已看候選人、已選人數、總差；狀態值保存可達的最大總分和。
  - 找到最終差後，逆序比較「跳過第 i 人」狀態是否仍等於目前最佳值即可回溯。
solution_outline: 以三維 0/1 背包保存每個差值的最大總和，按目標優先序選終態，再回溯入選者。
proof_or_invariant: 每個狀態精確考慮前 i 人中選 k 人的所有集合；跳過或選入第 i 人是不重不漏的劃分，取最大值正確處理固定差值下的次要目標。終態依絕對差再依狀態值選擇，恰符合題目字典序目標；回溯保持等值狀態，故重建集合可達該最優值。
common_errors: [先最大化總分再考慮差值, 忘記為負差值加偏移, 原地背包順序錯誤導致同人重選]
complexity:
  time: O(n * m * 801)
  space: O(n * m * 801)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, m = 0;
      while (cin >> n >> m && (n != 0 || m != 0)) { /* TODO */ }
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      constexpr int offset = 400, width = 801, unreachable = -1000000;
      int n = 0, m = 0, test_case = 0;
      while (cin >> n >> m && (n != 0 || m != 0)) {
          vector<int> prosecution(static_cast<size_t>(n + 1));
          vector<int> defence(static_cast<size_t>(n + 1));
          for (int i = 1; i <= n; ++i) cin >> prosecution[static_cast<size_t>(i)] >> defence[static_cast<size_t>(i)];
          const size_t layer = static_cast<size_t>(m + 1) * width;
          vector<int> dp(static_cast<size_t>(n + 1) * layer, unreachable);
          const auto at = [layer](int i, int k, int difference) {
              return static_cast<size_t>(i) * layer + static_cast<size_t>(k) * width +
                     static_cast<size_t>(difference + offset);
          };
          dp[at(0, 0, 0)] = 0;
          for (int i = 1; i <= n; ++i)
              for (int k = 0; k <= min(i, m); ++k)
                  for (int difference = -offset; difference <= offset; ++difference) {
                      int best = dp[at(i - 1, k, difference)];
                      const int delta = prosecution[static_cast<size_t>(i)] - defence[static_cast<size_t>(i)];
                      const int previous = difference - delta;
                      if (k > 0 && previous >= -offset && previous <= offset &&
                          dp[at(i - 1, k - 1, previous)] != unreachable)
                          best = max(best, dp[at(i - 1, k - 1, previous)] +
                                           prosecution[static_cast<size_t>(i)] +
                                           defence[static_cast<size_t>(i)]);
                      dp[at(i, k, difference)] = best;
                  }
          int chosen_difference = 0;
          for (int absolute = 0; absolute <= offset; ++absolute) {
              const int left = dp[at(n, m, -absolute)];
              const int right = dp[at(n, m, absolute)];
              if (left != unreachable || right != unreachable) {
                  chosen_difference = right > left ? absolute : -absolute;
                  break;
              }
          }
          int total = dp[at(n, m, chosen_difference)];
          vector<int> selected;
          int k = m, difference = chosen_difference;
          for (int i = n; i >= 1; --i) {
              if (dp[at(i - 1, k, difference)] == dp[at(i, k, difference)]) continue;
              selected.push_back(i); --k;
              difference -= prosecution[static_cast<size_t>(i)] - defence[static_cast<size_t>(i)];
          }
          reverse(selected.begin(), selected.end());
          cout << "Jury #" << ++test_case << '\n';
          cout << "Best jury has value " << (total + chosen_difference) / 2
               << " for prosecution and value " << (total - chosen_difference) / 2 << " for defence:\n";
          for (int index : selected) cout << ' ' << index;
          cout << "\n\n";
      }
  }
external_url: http://bailian.openjudge.cn/practice/1015/
external_platform: OpenJudge 百練
external_problem_id: '1015'
external_title: Jury Compromise
external_relation: original
source_book_pages: [321]
source_pdf_pages: [339]
review_status: verified
---

把公平度差值當背包重量、雙方總分和當狀態價值，即可同時處理兩級目標。
