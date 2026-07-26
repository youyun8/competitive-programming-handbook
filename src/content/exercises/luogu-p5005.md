---
id: luogu-p5005
volume: upper
source_file: upper-volume
title: 洛谷 P5005 中國象棋－擺上馬
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 5
topics: [state-compression-dp, profile-dp]
prerequisites: [bitmask-dp]
statement: 在 X×Y 中國象棋棋盤任意放置相同的馬；若馬腳位置有棋子則該方向被阻擋。求不存在任何一匹馬能攻擊另一匹馬的放置方案數，包含空棋盤，模 1,000,000,007。
constraints:
  - 1 <= X <= 100
  - 1 <= Y <= 6
input_format: 一行 X、Y。
output_format: 輸出合法方案數模 1,000,000,007。
samples:
  - input: '3 3'
    output: '145'
    explanation: 枚舉三列遮罩並同時檢查相距一列與兩列的馬步及馬腳後，共 145 種。
core_knowledge: [最近三列輪廓, 蹩馬腳位元判定]
judgment: 馬腳格有任意一匹馬便阻擋該方向；攻擊關係必須雙向都不存在。
hints:
  - 馬步最多跨兩列，所以狀態只需保存前一列、前兩列遮罩。
  - 相距一列的兩馬橫向差二，馬腳在其中一匹馬所在列的相鄰欄。
  - 相距兩列的兩馬橫向差一，馬腳位於兩列之間且與起點同欄；需檢查兩個方向。
solution_outline: 逐列枚舉新遮罩，使用位移運算檢查它與前兩列是否存在未被阻擋的攻擊，再滾動 DP。
proof_or_invariant: 馬只可能攻擊相距一或兩列的棋子，因此最近兩列足以決定新列合法性。相距一列時位元式逐一檢查橫差二的端點及同列馬腳；相距兩列時檢查橫差一及中列馬腳，兩方向皆覆蓋。轉移接受且只接受加入新列後仍無攻擊的配置，故逐列歸納後所有狀態總和恰為合法棋盤數。
common_errors: [照西洋棋馬忽略蹩馬腳, 只檢查由新馬發出的攻擊, 沒保存前兩列]
complexity:
  time: O(X * 2^(3Y))
  space: O(2^(2Y))
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int rows = 0, columns = 0; cin >> rows >> columns; /* TODO：三列輪廓 DP。 */ cout << 0 << '\n'; }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      constexpr int mod = 1000000007;
      int rows = 0, columns = 0; cin >> rows >> columns;
      const int states = 1 << columns;
      const int board_mask = states - 1;
      const auto adjacent_conflict = [board_mask](int current, int previous) {
          const int current_empty = (~current) & board_mask;
          const int previous_empty = (~previous) & board_mask;
          return (current & (current_empty >> 1) & (previous >> 2)) != 0 ||
                 (current & ((current_empty << 1) & board_mask) & ((previous << 2) & board_mask)) != 0 ||
                 (previous & (previous_empty >> 1) & (current >> 2)) != 0 ||
                 (previous & ((previous_empty << 1) & board_mask) & ((current << 2) & board_mask)) != 0;
      };
      const auto distance_two_conflict = [board_mask](int current, int middle, int older) {
          const int empty_middle = (~middle) & board_mask;
          return (current & empty_middle & (older >> 1)) != 0 ||
                 (current & empty_middle & ((older << 1) & board_mask)) != 0 ||
                 (older & empty_middle & (current >> 1)) != 0 ||
                 (older & empty_middle & ((current << 1) & board_mask)) != 0;
      };
      vector<vector<int>> dp(static_cast<size_t>(states), vector<int>(static_cast<size_t>(states), 0));
      dp[0][0] = 1;
      for (int row = 0; row < rows; ++row) {
          vector<vector<int>> next(static_cast<size_t>(states), vector<int>(static_cast<size_t>(states), 0));
          for (int current = 0; current < states; ++current)
              for (int previous = 0; previous < states; ++previous) {
                  if (adjacent_conflict(current, previous)) continue;
                  for (int older = 0; older < states; ++older) {
                      if (distance_two_conflict(current, previous, older)) continue;
                      int& destination = next[static_cast<size_t>(current)][static_cast<size_t>(previous)];
                      destination += dp[static_cast<size_t>(previous)][static_cast<size_t>(older)];
                      if (destination >= mod) destination -= mod;
                  }
              }
          dp.swap(next);
      }
      int answer = 0;
      for (const auto& current : dp)
          for (int ways : current) {
              answer += ways;
              if (answer >= mod) answer -= mod;
          }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P5005
external_platform: 洛谷
external_problem_id: P5005
external_title: 中国象棋 - 摆上马
external_relation: original
source_book_pages: [360]
source_pdf_pages: [378]
review_status: verified
---

中國象棋的馬腳使相容性依賴中間格，但攻擊仍只跨最近三列。
