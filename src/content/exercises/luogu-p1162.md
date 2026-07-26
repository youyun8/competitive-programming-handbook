---
id: luogu-p1162
volume: upper
source_file: upper-volume
title: 洛谷 P1162 填塗顏色
chapter: 3
section: '3.1'
kind: external-oj
difficulty: 1
topics: [flood-fill, breadth-first-search, grid]
prerequisites: [queue, grid-traversal]
statement: 一個只含 0 與 1 的方陣中，1 圍成唯一閉合區域。若某個 0 無法只經過 0、沿上下左右走到方陣邊界，它就在圈內。把所有圈內的 0 改成 2，其他數字不變。
constraints:
  - 1 <= n <= 30
  - 方陣只有 0 與 1，且恰有一個閉合圈
  - 圈內至少有一個 0，且圈內的 0 四向連通
input_format: 第一行為 n；接著 n 行各有 n 個以空白分隔的 0 或 1。
output_format: 輸出填色後的 n×n 方陣，各數字以空白分隔。
samples:
  - input: |
      6
      0 0 0 0 0 0
      0 0 1 1 1 1
      0 1 1 0 0 1
      1 1 0 0 0 1
      1 0 0 0 0 1
      1 1 1 1 1 1
    output: |
      0 0 0 0 0 0
      0 0 1 1 1 1
      0 1 1 2 2 1
      1 1 2 2 2 1
      1 2 2 2 2 1
      1 1 1 1 1 1
    explanation: 與外框連通的 0 保持不變；被 1 隔絕、無法到邊界的 0 全部改為 2。
core_knowledge:
  - 從外部反向辨識封閉區域
  - 多源網格 flood fill
judgment: 連通性只計上下左右，不計斜角；原有的 1 永遠不改動。
hints:
  - 直接從每個 0 判斷能否逃到邊界會重複走訪；先找出所有「外部」0。
  - 將四條邊上的 0 全部放入同一個佇列，向四方標記所有可達的 0。
  - 掃描全圖：仍未被標記的 0 必在圈內，改成 2；已標記者保持 0。
solution_outline: 以邊界所有零格為多源起點做 BFS，只穿越零格。搜尋結束後，所有未被 BFS 到達的零格都無法走到邊界，依定義改成 2。
proof_or_invariant: BFS 標記的每個格子都由某個邊界零格沿零格路徑到達，所以一定在圈外。反之，任何能到達邊界的零格，將其路徑反向便能由某個 BFS 起點到達，因此一定被標記。故未標記零格恰好是題目定義的圈內空間。
complexity:
  time: O(n^2)
  space: O(n^2)
common_errors:
  - 從任意角落開始，但該角落可能是 1
  - 把八方向也視為連通
  - BFS 時穿過 1，錯把圈內標成圈外
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<vector<int>> grid(n, vector<int>(n));
      for (auto& row : grid) for (int& value : row) cin >> value;
      vector<vector<bool>> outside(n, vector<bool>(n, false));
      queue<pair<int, int>> pending;
      // TODO：從所有邊界零格做多源 BFS，再把未到達的零格改成 2。
      (void)outside;
      (void)pending;
      for (const auto& row : grid) {
          for (int value : row) cout << value << ' ';
          cout << '\n';
      }
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<vector<int>> grid(n, vector<int>(n));
      for (auto& row : grid) for (int& value : row) cin >> value;
      vector<vector<bool>> outside(n, vector<bool>(n, false));
      queue<pair<int, int>> pending;
      const auto add = [&](int row, int column) {
          if (grid[row][column] == 0 && !outside[row][column]) {
              outside[row][column] = true;
              pending.push({row, column});
          }
      };
      for (int i = 0; i < n; ++i) {
          add(0, i);
          add(n - 1, i);
          add(i, 0);
          add(i, n - 1);
      }
      constexpr array<int, 4> dr{-1, 1, 0, 0};
      constexpr array<int, 4> dc{0, 0, -1, 1};
      while (!pending.empty()) {
          const auto [row, column] = pending.front();
          pending.pop();
          for (int direction = 0; direction < 4; ++direction) {
              const int next_row = row + dr[direction];
              const int next_column = column + dc[direction];
              if (next_row >= 0 && next_row < n && next_column >= 0 && next_column < n
                  && grid[next_row][next_column] == 0 && !outside[next_row][next_column]) {
                  outside[next_row][next_column] = true;
                  pending.push({next_row, next_column});
              }
          }
      }
      for (int row = 0; row < n; ++row) {
          for (int column = 0; column < n; ++column) {
              if (grid[row][column] == 0 && !outside[row][column]) grid[row][column] = 2;
              cout << grid[row][column] << ' ';
          }
          cout << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P1162
external_platform: 洛谷
external_problem_id: P1162
external_title: 填塗顏色
external_relation: original
source_book_pages: [109]
source_pdf_pages: [127]
review_status: verified
---

由邊界反向淹水，比逐格嘗試逃出更直接，也使「圈內」與「未被外部觸及」成為同一件事。
