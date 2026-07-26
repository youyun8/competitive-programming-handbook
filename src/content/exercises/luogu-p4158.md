---
id: luogu-p4158
volume: upper
source_file: upper-volume
title: 洛谷 P4158 粉刷匠
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 4
topics: [dynamic-programming, grouped-knapsack, interval-partition]
prerequisites: [dynamic-programming]
statement: >-
  有 n 條各含 m 格的木板，每格目標色為 0 或 1。一次可把同一木板的一段連續格塗成一色，
  每格最多被塗一次；至多操作 t 次，求最多能塗對多少格。
constraints:
  - 1 <= n,m <= 50
  - 0 <= t <= 2500
input_format: 第一行 n、m、t；接著 n 行各為長度 m 的 01 字串。
output_format: 輸出最多正確粉刷格數。
samples:
  - input: |-
      3 6 3
      111111
      000000
      001100
    output: '16'
    explanation: 前兩條木板各用一次塗成單色得到 12 格，第三條再用一次可塗對四格，合計 16。
core_knowledge: [單列分段 DP, 多列分組背包]
judgment: 未塗或塗錯都不計分；同一格不可被不同操作重複覆蓋。
hints:
  - 先獨立求每條木板恰用 k 段時最多塗對幾格。
  - 單列前綴 DP 枚舉最後一段左端，該段塗 0 或 1，取其中正確格較多者。
  - 再把每條木板視為一組，以總操作次數做分組背包。
solution_outline: 對每列用前綴和與 O(m^3) 分段 DP 求 local[k]，再以 O(n*t*m) 合併各列操作配額。
proof_or_invariant: >-
  單列狀態 row[k][i] 是前 i 格分成 k 段可得的最大正確數；固定最後段 (p,i] 後，前綴與
  最後段互不重疊，最後段選較多的目標色最優，枚舉 p 完備。全局狀態處理前若干列時記總操作
  數與最大得分；每列只能選一個 k 配額，正是分組背包。兩層歸納後得到不超過 t 次的全局最優值。
common_errors: [把不同木板的相鄰格當成同一段, 單列分段允許重疊, 強迫一定用滿 t 次]
complexity:
  time: O(n * (m^3 + t*m))
  space: O(m^2 + t)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, m = 0, t = 0; cin >> n >> m >> t;
      // TODO：先求各列操作收益，再做分組背包。
      cout << n - n + m - m + t - t << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, m = 0, limit = 0; cin >> n >> m >> limit;
      vector<int> global(static_cast<size_t>(limit + 1), -1000000);
      global[0] = 0;
      for (int row_id = 0; row_id < n; ++row_id) {
          string row; cin >> row;
          vector<int> ones(static_cast<size_t>(m + 1), 0);
          for (int i = 1; i <= m; ++i)
              ones[static_cast<size_t>(i)] =
                  ones[static_cast<size_t>(i - 1)] + (row[static_cast<size_t>(i - 1)] == '1' ? 1 : 0);
          vector<vector<int>> best(static_cast<size_t>(m + 1),
                                   vector<int>(static_cast<size_t>(m + 1), -1000000));
          best[0][0] = 0;
          for (int used = 1; used <= m; ++used)
              for (int right = used; right <= m; ++right)
                  for (int left = used - 1; left < right; ++left) {
                      const int one_count = ones[static_cast<size_t>(right)] -
                                            ones[static_cast<size_t>(left)];
                      const int segment = max(one_count, right - left - one_count);
                      best[static_cast<size_t>(used)][static_cast<size_t>(right)] =
                          max(best[static_cast<size_t>(used)][static_cast<size_t>(right)],
                              best[static_cast<size_t>(used - 1)][static_cast<size_t>(left)] + segment);
                  }
          vector<int> next(static_cast<size_t>(limit + 1), -1000000);
          for (int total = 0; total <= limit; ++total)
              for (int used = 0; used <= m && used <= total; ++used) {
                  const int gain = used == 0 ? 0 : best[static_cast<size_t>(used)][static_cast<size_t>(m)];
                  next[static_cast<size_t>(total)] =
                      max(next[static_cast<size_t>(total)],
                          global[static_cast<size_t>(total - used)] + gain);
              }
          global.swap(next);
      }
      cout << *max_element(global.begin(), global.end()) << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P4158
external_platform: 洛谷
external_problem_id: P4158
external_title: 粉刷匠
external_relation: original
source_book_pages: [333]
source_pdf_pages: [351]
review_status: verified
---

先把每條木板壓成「使用 k 次可得多少分」，再分配全局操作額度，能清楚分離兩層決策。
