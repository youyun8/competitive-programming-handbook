---
id: openj-bailian-2411
volume: upper
source_file: upper-volume
title: OpenJudge 2411 Mondriaan's Dream
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 4
topics: [state-compression-dp, domino-tiling, profile-dp]
prerequisites: [bitmask]
statement: 給 h×w 的有向矩形棋盤，求用 1×2 骨牌完整鋪滿的不同方法數；旋轉、鏡射後相同的鋪法仍分別計數。
constraints:
  - 輸入含多組資料，以 h = w = 0 結束
  - 1 <= h,w <= 11
input_format: 每組一行 h、w。
output_format: 每組輸出一行完整鋪法數。
samples:
  - input: |-
      1 2
      1 3
      1 4
      2 2
      2 3
      2 4
      2 11
      4 11
      0 0
    output: |-
      1
      0
      1
      2
      3
      5
      144
      51205
    explanation: 奇數格棋盤無法鋪滿；其餘各列輪廓轉移累加後得到依序所列方法數。
core_knowledge: [輪廓線 DP, 位元遮罩, 列內 DFS 轉移]
judgment: 每格恰被一張骨牌覆蓋；矩形有方向，對稱鋪法不合併。
hints:
  - 逐列掃描，只需知道本列哪些格已被上一列直骨牌佔據。
  - 對固定 mask，由左至右找第一個空格：可橫放佔兩格，或直放並在 next_mask 留一位。
  - 一列填滿後把方案數加到下一列 next_mask；最後只有 mask=0 代表沒有骨牌伸出棋盤。
solution_outline: 令較短邊為遮罩寬度，逐列對每個 mask 用 DFS 枚舉填滿本列的方式並產生 next_mask。
proof_or_invariant: >-
  進入一列時，mask 精確標示由上一列伸入且已占用的格。取最左空格時，覆蓋它的骨牌只可能水平
  向右或垂直向下，兩選擇互斥且涵蓋所有鋪法；遞迴填滿本列會唯一產生下一列遮罩。因此每個完整
  鋪法與 DP 的一條轉移路徑一一對應。處理所有列後，僅遮罩零沒有越界骨牌，dp[0] 即答案。
common_errors: [終態把非零遮罩也計入, 橫放時未檢查右格是否空, 使用 32 位整數造成答案溢位]
complexity:
  time: O(max(h,w) * 2^min(h,w) * F)，F 為單列填法數
  space: O(2^min(h,w))
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int h = 0, w = 0;
      while (cin >> h >> w && (h != 0 || w != 0)) {
          // TODO：逐列以遮罩枚舉骨牌填法。
          cout << h - h + w - w << '\n';
      }
  }
cpp_solution: |
  #include <algorithm>
  #include <functional>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int h = 0, w = 0;
      while (cin >> h >> w && (h != 0 || w != 0)) {
          const int columns = min(h, w);
          const int rows = max(h, w);
          const int states = 1 << columns;
          vector<long long> dp(static_cast<size_t>(states), 0), next(static_cast<size_t>(states), 0);
          dp[0] = 1;
          for (int row = 0; row < rows; ++row) {
              fill(next.begin(), next.end(), 0);
              for (int mask = 0; mask < states; ++mask) {
                  if (dp[static_cast<size_t>(mask)] == 0) continue;
                  function<void(int, int)> fill_row = [&](int column, int next_mask) {
                      if (column == columns) {
                          next[static_cast<size_t>(next_mask)] += dp[static_cast<size_t>(mask)];
                          return;
                      }
                      if ((mask & (1 << column)) != 0) {
                          fill_row(column + 1, next_mask);
                      } else {
                          if (column + 1 < columns && (mask & (1 << (column + 1))) == 0)
                              fill_row(column + 2, next_mask);
                          fill_row(column + 1, next_mask | (1 << column));
                      }
                  };
                  fill_row(0, 0);
              }
              dp.swap(next);
          }
          cout << dp[0] << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/2411/
external_platform: OpenJudge 百練
external_problem_id: '2411'
external_title: Mondriaan's Dream
external_relation: original
source_book_pages: [344, 346]
source_pdf_pages: [362, 364]
review_status: verified
---

輪廓線之外的歷史不影響未來；遮罩正好保存跨列骨牌造成的全部邊界資訊。
