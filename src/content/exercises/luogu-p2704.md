---
id: luogu-p2704
volume: upper
source_file: upper-volume
title: 洛谷 P2704 炮兵陣地
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 4
topics: [state-compression-dp, profile-dp]
prerequisites: [bitmask]
statement: >-
  在 n×m 地圖的平原 P 上放炮兵，山地 H 不可放。每支炮兵會攻擊同列上下兩格及同行左右兩格，
  地形不阻擋攻擊。求互不攻擊時最多可放幾支。
constraints:
  - 1 <= n <= 100
  - 1 <= m <= 10
  - 地圖只含 P、H
input_format: 第一行 n、m；接著 n 行地圖。
output_format: 輸出最多炮兵數。
samples:
  - input: |-
      5 4
      PHPP
      PPHH
      PPPP
      PHPP
      PHHP
    output: '6'
    explanation: 列遮罩同時排除橫向距離一、二，並與前兩列保持無共同欄，最佳可放六支。
core_knowledge: [列遮罩, 三列輪廓 DP, 地形遮罩]
judgment: 攻擊只沿水平與垂直方向距離一或二，不含斜向；山地不阻擋射程。
hints:
  - 合法單列遮罩不能有距離 1 或 2 的兩個位元同時為 1。
  - 當前遮罩必為平原子集，且分別與前一列、前兩列按位與為零。
  - DP 狀態保存最近兩列遮罩，滾動加入當前列的炮兵數。
solution_outline: 預處理合法遮罩與 popcount，逐列枚舉當前、前一、前二遮罩做最大值 DP。
proof_or_invariant: >-
  單列條件精確排除水平射程，與前兩列無同欄精確排除垂直射程；更早列距離超過二，不影響當前。
  因此處理完一列後，保存最近兩列已包含未來所需全部資訊。每個合法部署唯一對應逐列遮罩序列，
  轉移又只接受充分必要的相容條件，歸納後最大狀態值就是答案。
common_errors: [只保存前一列而漏掉距離二攻擊, 誤排除斜向位置, 山地遮罩的 P/H 意義顛倒]
complexity:
  time: O(n * S^3)，S 為合法單列遮罩數
  space: O(S^2)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, m = 0; cin >> n >> m;
      // TODO：保存最近兩列遮罩做最大值 DP。
      cout << n - n + m - m << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, m = 0; cin >> n >> m;
      vector<int> terrain(static_cast<size_t>(n), 0);
      for (int row = 0; row < n; ++row) {
          string line; cin >> line;
          for (int column = 0; column < m; ++column)
              if (line[static_cast<size_t>(column)] == 'P')
                  terrain[static_cast<size_t>(row)] |= 1 << column;
      }
      vector<int> state, soldiers;
      for (int mask = 0; mask < (1 << m); ++mask)
          if ((mask & (mask << 1)) == 0 && (mask & (mask << 2)) == 0) {
              state.push_back(mask);
              soldiers.push_back(__builtin_popcount(static_cast<unsigned int>(mask)));
          }
      const size_t count = state.size();
      vector<vector<int>> dp(count, vector<int>(count, -1000000));
      dp[0][0] = 0;
      for (int row = 0; row < n; ++row) {
          vector<vector<int>> next(count, vector<int>(count, -1000000));
          for (size_t current = 0; current < count; ++current) {
              if ((state[current] & ~terrain[static_cast<size_t>(row)]) != 0) continue;
              for (size_t previous = 0; previous < count; ++previous) {
                  if ((state[current] & state[previous]) != 0) continue;
                  for (size_t older = 0; older < count; ++older) {
                      if ((state[current] & state[older]) != 0) continue;
                      next[current][previous] =
                          max(next[current][previous], dp[previous][older] + soldiers[current]);
                  }
              }
          }
          dp.swap(next);
      }
      int answer = 0;
      for (const auto& row : dp)
          for (int value : row) answer = max(answer, value);
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2704
external_platform: 洛谷
external_problem_id: P2704
external_title: 炮兵阵地
external_relation: original
source_book_pages: [344]
source_pdf_pages: [362]
review_status: verified
---

射程跨兩列，所以輪廓狀態恰需保留最近兩列，不能再少。
