---
id: luogu-p1879
volume: upper
source_file: upper-volume
title: 洛谷 P1879 Corn Fields G
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 3
topics: [state-compression-dp, bitmask]
prerequisites: [bitmask]
statement: 在 m×n 牧場中，部分格可放牛。任意兩頭牛不可水平或垂直相鄰；求所有放置方案數，包含不放牛，模 100000000。
constraints:
  - 1 <= m,n <= 12
  - 每格以 1 表示可用、0 表示不可用
input_format: 第一行 m、n；接著 m 行各 n 個 0/1。
output_format: 輸出合法放置方案數模 100000000。
samples:
  - input: |-
      2 3
      1 1 1
      0 1 0
    output: '9'
    explanation: 枚舉每列無相鄰牛的遮罩，再排除上下衝突，兩列合計有九種合法方案。
core_knowledge: [列輪廓 DP, 合法遮罩預處理]
judgment: 不放任何牛也是一種方案；不可用格永遠不能放牛。
hints:
  - 一列狀態以 n 位遮罩表示，先篩掉含相鄰 1 的遮罩。
  - 當前遮罩必須是該列可用格子集合的子集。
  - 相鄰兩列遮罩按位與必須為零；依列累加方案數。
solution_outline: 預處理所有橫向合法遮罩，逐列枚舉當前與前一遮罩，檢查地形及垂直衝突。
proof_or_invariant: >-
  每列遮罩無相鄰位保證水平合法，是地形子集保證只用可放格；與前列按位與為零恰保證垂直合法。
  DP 處理第 i 列後，狀態計數是一一對應於前 i 列且末列為該遮罩的放置方案。所有轉移條件必要
  且充分，因此歸納後加總末列狀態即全部合法方案。
common_errors: [漏算全零遮罩, 把地形 0/1 意義顛倒, 忘記每次累加取模]
complexity:
  time: O(m * S^2)，S 為橫向合法遮罩數
  space: O(S)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int m = 0, n = 0; cin >> m >> n;
      // TODO：以每列牛的位置遮罩做輪廓 DP。
      cout << m - m + n - n << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      constexpr int mod = 100000000;
      int m = 0, n = 0; cin >> m >> n;
      vector<int> available(static_cast<size_t>(m), 0);
      for (int row = 0; row < m; ++row)
          for (int column = 0; column < n; ++column) {
              int cell = 0; cin >> cell;
              if (cell == 1) available[static_cast<size_t>(row)] |= 1 << column;
          }
      vector<int> states;
      for (int mask = 0; mask < (1 << n); ++mask)
          if ((mask & (mask << 1)) == 0) states.push_back(mask);
      vector<int> dp(states.size(), 0), next(states.size(), 0);
      dp[0] = 1;
      for (int row = 0; row < m; ++row) {
          fill(next.begin(), next.end(), 0);
          for (size_t i = 0; i < states.size(); ++i) {
              if ((states[i] & ~available[static_cast<size_t>(row)]) != 0) continue;
              for (size_t j = 0; j < states.size(); ++j)
                  if ((states[i] & states[j]) == 0)
                      next[i] = (next[i] + dp[j]) % mod;
          }
          dp.swap(next);
      }
      int answer = 0;
      for (int ways : dp) answer = (answer + ways) % mod;
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1879
external_platform: 洛谷
external_problem_id: P1879
external_title: Corn Fields G
external_relation: original
source_book_pages: [344]
source_pdf_pages: [362]
review_status: verified
---

行內與行間限制分別由遮罩合法性與相鄰列按位與檢查處理。
