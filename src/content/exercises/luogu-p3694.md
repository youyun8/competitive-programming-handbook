---
id: luogu-p3694
volume: upper
source_file: upper-volume
title: 洛谷 P3694 邦邦的大合唱站隊
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 4
topics: [state-compression-dp, prefix-sum]
prerequisites: [bitmask-dp]
statement: >-
  n 位偶像排成一列，分屬 m 個樂團。可讓若干人暫時出列，其餘人的位置不動，再把出列者任意
  填回空位；要求每個樂團成員最終各自連成一段，求最少出列人數。樂團區塊順序可任意。
constraints:
  - 1 <= n <= 100000
  - 1 <= m <= 20
  - 每個樂團至少有一人
input_format: 第一行 n、m；接著 n 行依序給每人的樂團編號 a_i（1 到 m）。
output_format: 輸出最少需暫時出列的人數。
samples:
  - input: |-
      12 4
      1
      3
      2
      4
      2
      1
      2
      3
      1
      1
      3
      4
    output: '7'
    explanation: 依樂團 3、4、2、1 排列區塊，可保留五位原地不動，因此最少七位出列。
core_knowledge: [樂團子集合 DP, 區間前綴計數]
judgment: 未出列者必須留在原位置；出列者只能填回空位，但可任意選空位。
hints:
  - 固定樂團區塊的排列後，各區塊長度就是該團人數，邊界因而唯一。
  - dp[mask] 表示隊首已依某順序放好 mask 內各團時的最少出列數。
  - 把團 j 接在末尾，只須用前綴和計算它原先有多少成員已位於其目標區間內。
solution_outline: 預處理各團前綴人數及每個集合的總長，枚舉集合最後一團做 O(m2^m) DP。
proof_or_invariant: >-
  對已安排集合 mask，其占用前綴長度只由各團人數總和決定，與內部順序無關。若 j 為最後區塊，
  它的目標區間也唯一；原本位於該區間的 j 團成員可全部不動，其餘 j 團成員必須出列，且將所有
  非 j 團佔位者出列後恰有空位可填，故轉移成本充分必要。枚舉最後一團涵蓋所有區塊排列。
common_errors: [固定樂團編號順序, 把區間內非本團人數與區間外本團人數重複計費, 狀態長度計算過慢]
complexity:
  time: O(nm + m * 2^m)
  space: O(nm + 2^m)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, m = 0; cin >> n >> m;
      // TODO：前綴計數配合集合 DP。
      cout << n - n + m - m << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, m = 0; cin >> n >> m;
      vector<vector<int>> prefix(static_cast<size_t>(m),
                                 vector<int>(static_cast<size_t>(n + 1), 0));
      for (int position = 1; position <= n; ++position) {
          int group = 0; cin >> group; --group;
          for (int j = 0; j < m; ++j)
              prefix[static_cast<size_t>(j)][static_cast<size_t>(position)] =
                  prefix[static_cast<size_t>(j)][static_cast<size_t>(position - 1)];
          ++prefix[static_cast<size_t>(group)][static_cast<size_t>(position)];
      }
      vector<int> count(static_cast<size_t>(m));
      for (int j = 0; j < m; ++j)
          count[static_cast<size_t>(j)] = prefix[static_cast<size_t>(j)][static_cast<size_t>(n)];
      const int states = 1 << m;
      vector<int> length(static_cast<size_t>(states), 0);
      for (int mask = 1; mask < states; ++mask) {
          const int bit = mask & -mask;
          const int group = __builtin_ctz(static_cast<unsigned int>(bit));
          length[static_cast<size_t>(mask)] =
              length[static_cast<size_t>(mask ^ bit)] + count[static_cast<size_t>(group)];
      }
      vector<int> dp(static_cast<size_t>(states), numeric_limits<int>::max() / 2);
      dp[0] = 0;
      for (int mask = 1; mask < states; ++mask)
          for (int group = 0; group < m; ++group) {
              const int bit = 1 << group;
              if ((mask & bit) == 0) continue;
              const int previous = mask ^ bit;
              const int left = length[static_cast<size_t>(previous)];
              const int right = length[static_cast<size_t>(mask)];
              const int kept = prefix[static_cast<size_t>(group)][static_cast<size_t>(right)] -
                               prefix[static_cast<size_t>(group)][static_cast<size_t>(left)];
              dp[static_cast<size_t>(mask)] =
                  min(dp[static_cast<size_t>(mask)],
                      dp[static_cast<size_t>(previous)] +
                      count[static_cast<size_t>(group)] - kept);
          }
      cout << dp[static_cast<size_t>(states - 1)] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P3694
external_platform: 洛谷
external_problem_id: P3694
external_title: 邦邦的大合唱站队
external_relation: original
source_book_pages: [359]
source_pdf_pages: [377]
review_status: verified
---

集合決定已使用的前綴長度，最後一個樂團則決定唯一目標區間。
