---
id: luogu-p1868
volume: upper
source_file: upper-volume
title: 洛谷 P1868 飢餓的奶牛
chapter: 2
section: '2.3'
kind: external-oj
difficulty: 3
topics: ['加權區間排程', '動態規劃', '二分搜尋']
prerequisites: ['排序', '一維 DP']
statement: 給定 N 個整數閉區間 [x,y]，選若干兩兩沒有共同位置的區間，使所選區間長度 y-x+1 的總和最大。
constraints: ['1 ≤ N ≤ 150000', '0 ≤ x ≤ y ≤ 3000000']
input_format: 第一行 N；接著 N 行各輸入區間 x、y。
output_format: 輸出最多能取得的牧草位置數。
samples:
  - input: |
      3
      1 3
      7 8
      3 4
    output: |
      5
    explanation: 選 [1,3] 與 [7,8]，長度合計 3+2=5；[1,3] 與 [3,4] 在位置 3 重疊，不能同選。
core_knowledge: ['依右端點排序的加權區間排程', '二分前一個 right<left 的區間']
judgment: 閉區間端點相同也算重疊，因此相容條件是前區間 right<目前 left，而非 ≤。
hints:
  - '先依右端點排序，考慮最優解是否選第 i 個區間。'
  - '不選 i 得 dp[i-1]；選 i 則接在最後一個右端小於 left_i 的區間後。'
  - '用 lower_bound 找第一個 right≥left_i，前一格即相容索引。'
solution_outline: 排序後建立 rights。dp[i] 表示前 i 個區間最大總長；令 compatible 為第 i 區間前最後一個 right<left，轉移為 max(dp[i-1],dp[compatible]+length_i)。
proof_or_invariant: 任一前 i 區間最優解若不選 i，值不超過 dp[i-1]；若選 i，其餘只能取 compatible 以前的區間，最佳為 dp[compatible]。兩類互斥且涵蓋所有解，歸納得轉移正確。
common_errors: ['把閉區間 right=left 判為相容', '區間長度漏加 1', '依左端排序卻套用右端 DP', 'compatible 索引偏一']
complexity: { time: 'O(N log N)', space: 'O(N)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n; cin >> n; vector<pair<int,int>> intervals(static_cast<size_t>(n));
      for (auto& interval : intervals) cin >> interval.first >> interval.second;
      // TODO：依右端排序，二分相容區間並做加權區間 DP。
      cout << 0 << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n; cin >> n; vector<pair<int,int>> intervals(static_cast<size_t>(n));
      for (auto& interval : intervals) cin >> interval.first >> interval.second;
      sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
          return a.second != b.second ? a.second < b.second : a.first < b.first;
      });
      vector<int> rights(static_cast<size_t>(n));
      for (int i = 0; i < n; ++i) rights[static_cast<size_t>(i)] = intervals[static_cast<size_t>(i)].second;
      vector<long long> dp(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) {
          const auto [left, right] = intervals[static_cast<size_t>(i - 1)];
          const size_t compatible = static_cast<size_t>(lower_bound(rights.begin(), rights.begin() + (i - 1), left) - rights.begin());
          const long long length = static_cast<long long>(right) - left + 1;
          dp[static_cast<size_t>(i)] = max(dp[static_cast<size_t>(i - 1)], dp[compatible] + length);
      }
      cout << dp.back() << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1868
external_platform: 洛谷
external_problem_id: P1868
external_title: 饥饿的奶牛
external_relation: original
source_book_pages: [49]
source_pdf_pages: [67]
review_status: verified
---

排序後每個區間只剩「選或不選」，前一個相容位置可由二分取得。
