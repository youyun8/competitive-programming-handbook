---
id: luogu-p1896
volume: upper
source_file: upper-volume
title: 洛谷 P1896 互不侵犯
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 4
topics: [state-compression-dp, counting]
prerequisites: [bitmask]
statement: 在 n×n 棋盤放恰好 k 個國王，使任意兩王不在相鄰八方向格子；求不同放置方案數。
constraints:
  - 1 <= n <= 9
  - 0 <= k <= n*n
input_format: 一行 n、k。
output_format: 輸出合法方案數。
samples:
  - input: '3 2'
    output: '16'
    explanation: 枚舉每列無水平相鄰的遮罩並排除跨列直向、斜向衝突，共有十六種兩王方案。
core_knowledge: [列遮罩 DP, 位元衝突, 額外計數維度]
judgment: 國王會攻擊水平、垂直與斜向相鄰格；必須恰放 k 個。
hints:
  - 一列遮罩先排除相鄰兩位同為 1，並預算其 popcount。
  - 兩列相容需同時滿足 mask&prev、(mask<<1)&prev、(mask>>1)&prev 皆為零。
  - DP 再加已放國王數維度，逐列轉移。
solution_outline: 預處理合法列遮罩及相容關係，做 row×mask×count 的計數 DP。
proof_or_invariant: >-
  列內合法性排除水平攻擊，三個按位與條件精確排除與上一列的垂直及兩種斜向攻擊；更遠列不會
  互相攻擊。DP 處理完每列後按末列遮罩與總王數分類，轉移一一對應所有合法新增列。歸納至第 n
  列後，加總王數恰為 k 的狀態就是全部方案。
common_errors: [只檢查垂直衝突而漏斜線, 忘記恰好 k 的計數維度, 使用 32 位整數存答案]
complexity:
  time: O(n * k * S^2)
  space: O(k * S)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, k = 0; cin >> n >> k;
      // TODO：以列遮罩及已放數量做計數 DP。
      cout << n - n + k - k << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <bitset>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, target = 0; cin >> n >> target;
      vector<int> states, count;
      for (int mask = 0; mask < (1 << n); ++mask)
          if ((mask & (mask << 1)) == 0) {
              states.push_back(mask);
              count.push_back(__builtin_popcount(static_cast<unsigned int>(mask)));
          }
      vector<vector<long long>> dp(states.size(), vector<long long>(static_cast<size_t>(target + 1), 0));
      dp[0][0] = 1;
      for (int row = 0; row < n; ++row) {
          vector<vector<long long>> next(states.size(),
                                         vector<long long>(static_cast<size_t>(target + 1), 0));
          for (size_t current = 0; current < states.size(); ++current)
              for (size_t previous = 0; previous < states.size(); ++previous) {
                  const int a = states[current], b = states[previous];
                  if ((a & b) != 0 || ((a << 1) & b) != 0 || ((a >> 1) & b) != 0) continue;
                  for (int used = count[current]; used <= target; ++used)
                      next[current][static_cast<size_t>(used)] +=
                          dp[previous][static_cast<size_t>(used - count[current])];
              }
          dp.swap(next);
      }
      long long answer = 0;
      for (const auto& state : dp) answer += state[static_cast<size_t>(target)];
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1896
external_platform: 洛谷
external_problem_id: P1896
external_title: 互不侵犯
external_relation: original
source_book_pages: [344]
source_pdf_pages: [362]
review_status: verified
---

國王只會跨到相鄰列，因此上一列遮罩加已放數量就是完整狀態。
