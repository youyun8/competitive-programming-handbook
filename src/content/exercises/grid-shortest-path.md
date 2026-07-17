---
id: grid-shortest-path
volume: upper
source_file: upper-volume
title: 網格中的最少步數
chapter: 3
section: '3.4'
kind: practice
difficulty: 2
topics: [bfs, shortest-path, grid]
prerequisites: [queue, visited]
statement: 給定由可通行格與障礙格組成的網格，從左上角走到右下角，每步可往上下左右移動。輸出最少步數；無法到達時輸出 -1。
constraints:
  - 1 <= rows, columns <= 1000
  - 起點與終點保證是可通行格
input_format: 第一行為 rows 與 columns，接著 rows 行由 . 與 # 組成。
output_format: 輸出一個整數表示最少步數，無解輸出 -1。
samples:
  - input: |
      3 4
      ....
      .##.
      ....
    output: |
      5
hints:
  - 每個格子是一個狀態，每條合法移動的代價都是 1。
  - 在格子入隊時就設定距離，避免重複入隊。
solution_outline: 從左上角做 BFS，distance 同時充當 visited；第一次到達終點時即為最短距離。
proof_or_invariant: BFS 依距離分層取出狀態，因此第一次設定某格距離時不存在更短路徑。
complexity:
  time: O(rows * columns)
  space: O(rows * columns)
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <queue>
  #include <string>
  #include <utility>
  #include <vector>

  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int rows = 0;
      int columns = 0;
      std::cin >> rows >> columns;
      std::vector<std::string> grid(rows);

      for (std::string& row : grid) {
          std::cin >> row;
      }

      std::vector<std::vector<int>> distance(rows, std::vector<int>(columns, -1));
      std::queue<std::pair<int, int>> frontier;
      distance[0][0] = 0;
      frontier.push({0, 0});
      const std::array<int, 4> delta_row{-1, 1, 0, 0};
      const std::array<int, 4> delta_column{0, 0, -1, 1};

      while (!frontier.empty()) {
          const auto [row, column] = frontier.front();
          frontier.pop();

          for (int direction = 0; direction < 4; ++direction) {
              const int next_row = row + delta_row[direction];
              const int next_column = column + delta_column[direction];
              if (next_row < 0 || next_row >= rows || next_column < 0 ||
                  next_column >= columns) {
                  continue;
              }
              if (grid[next_row][next_column] == '#' ||
                  distance[next_row][next_column] != -1) {
                  continue;
              }
              distance[next_row][next_column] = distance[row][column] + 1;
              frontier.push({next_row, next_column});
          }
      }
      std::cout << distance[rows - 1][columns - 1] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1746
external_platform: 洛谷
external_problem_id: P1746
external_title: 離開中山路
external_relation: related
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

練習重點是把「每格第一次入隊的距離已最短」落實到程式碼。
