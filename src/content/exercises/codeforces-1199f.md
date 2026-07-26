---
id: codeforces-1199f
volume: upper
source_file: upper-volume
title: Codeforces 1199F Rectangle Painting 1
chapter: 5
section: '5.5'
kind: external-oj
difficulty: 4
topics: [dynamic-programming, rectangle-dp]
prerequisites: [interval-dp]
statement: >-
  n×n 棋盤部分格為黑色。一次可選 h×w 矩形，把其中所有格變白，成本 max(h,w)。
  求把全部黑格清成白色的最小總成本。
constraints:
  - 1 <= n <= 50
  - 棋盤只含 #（黑）與 .（白）
input_format: 第一行 n；接著 n 行長度 n 的棋盤字串。
output_format: 輸出最小總成本。
samples:
  - input: |-
      3
      ###
      #.#
      ###
    output: '3'
    explanation: 直接清除整個 3×3 矩形成本為 3，且不可能以更低總成本覆蓋八個黑格。
core_knowledge: [四維矩形 DP, 水平與垂直切分]
judgment: 操作可包含原本已白的格子；同一格可被多次操作，但沒有必要因此增加成本。
hints:
  - dp[x1][x2][y1][y2] 表示清除指定矩形內黑格的最小成本。
  - 一次清整個矩形提供上界 max(height,width)；沒有黑格時成本為零。
  - 枚舉每條水平及垂直切線，把問題拆成兩個不重疊子矩形。
solution_outline: 記憶化每個子矩形，取整體一次清除與所有水平、垂直分割成本的最小值。
proof_or_invariant: >-
  直接清除整個矩形永遠可行。若最優方案可分成某切線兩側互不跨越的操作，成本由兩個獨立子問題
  相加，枚舉切線會取得它；若存在跨越每條可能切線的關鍵操作，將其擴張為一次清整個外框的成本
  不超過矩形較長邊，已由直接方案涵蓋。故遞迴候選包含一個最優方案，且每個候選都可行。
common_errors: [空矩形仍回傳長寬成本, 只枚舉單一方向切分, 矩形端點長度少加一]
complexity:
  time: O(n^5)
  space: O(n^4)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      // TODO：記憶化所有子矩形的最小清除成本。
      cout << n - n << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <functional>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      vector<string> grid(static_cast<size_t>(n));
      for (string& row : grid) cin >> row;
      const size_t states = static_cast<size_t>(n) * static_cast<size_t>(n) *
                            static_cast<size_t>(n) * static_cast<size_t>(n);
      vector<int> memo(states, -1);
      const auto key = [n](int x1, int x2, int y1, int y2) {
          return (((static_cast<size_t>(x1) * static_cast<size_t>(n) + static_cast<size_t>(x2)) *
                   static_cast<size_t>(n) + static_cast<size_t>(y1)) *
                  static_cast<size_t>(n) + static_cast<size_t>(y2));
      };
      function<int(int, int, int, int)> solve = [&](int x1, int x2, int y1, int y2) {
          int& answer = memo[key(x1, x2, y1, y2)];
          if (answer != -1) return answer;
          bool has_black = false;
          for (int x = x1; x <= x2 && !has_black; ++x)
              for (int y = y1; y <= y2; ++y)
                  if (grid[static_cast<size_t>(x)][static_cast<size_t>(y)] == '#') {
                      has_black = true;
                      break;
                  }
          if (!has_black) return answer = 0;
          answer = max(x2 - x1 + 1, y2 - y1 + 1);
          for (int split = x1; split < x2; ++split)
              answer = min(answer, solve(x1, split, y1, y2) +
                                     solve(split + 1, x2, y1, y2));
          for (int split = y1; split < y2; ++split)
              answer = min(answer, solve(x1, x2, y1, split) +
                                     solve(x1, x2, split + 1, y2));
          return answer;
      };
      cout << solve(0, n - 1, 0, n - 1) << '\n';
  }
external_url: https://codeforces.com/problemset/problem/1199/F
external_platform: CodeForces
external_problem_id: 1199F
external_title: Rectangle Painting 1
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

直接清整個外框是自然上界，而所有可能切分讓矩形 DP 能利用黑格分布的稀疏性。
