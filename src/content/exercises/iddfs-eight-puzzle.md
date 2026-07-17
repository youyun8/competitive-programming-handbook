---
id: iddfs-eight-puzzle
volume: upper
source_file: upper-volume
title: IDA* 八數字拼圖
chapter: 3
section: '3.9'
kind: practice
difficulty: 3
topics:
  - iddfs
  - ida-star
  - heuristic
  - search
prerequisites:
  - dfs
  - recursion
  - priority-queue
statement: 給定一個 3x3 的八數字拼圖（0 代表空格），求最少移動步數把拼圖恢復成目標狀態。每次只能把空格與相鄰數字交換。
constraints:
  - 輸入為 3x3 的九宮格排列
input_format: 3 行，每行 3 個整數（0 表示空格）。
output_format: 輸出最少移動步數；若無解則輸出 -1。
samples:
  - input: |
      1 2 3
      4 0 5
      7 8 6
    output: |
      2
    explanation: 先把 0 向右移動與 5 交換，再向下移動與 6 交換，即可得到目標狀態。
hints:
  - 用曼哈頓距離作為啟發函數估價值。
  - IDA* 設定深度上限為 f = g + h，每次超過上限就回傳新的最小超過值作為下次上限。
solution_outline: 計算每個數字到目標位置的曼哈頓距離總和作為 h。以 DFS 搜尋，深度上限為當前 g + h。若所有分支都超過上限，則提升上限再搜尋。
proof_or_invariant: 曼哈頓距離為實際移動步數的下界，因此 f = g + h 永不低標。IDA* 用迭代加深深度的上限，保證第一次找到解即為最優解。
complexity:
  time: O(b^d)，其中 d 為最優解深度
  space: O(d)
cpp_solution: |
  #include <algorithm>
  #include <cmath>
  #include <iostream>

  const int goal[3][3] = {{1,2,3},{4,5,6},{7,8,0}};
  int board[3][3];
  int dx[4] = {-1,1,0,0};
  int dy[4] = {0,0,-1,1};

  int manhattan() {
      int sum = 0;
      for (int i = 0; i < 3; ++i)
          for (int j = 0; j < 3; ++j)
              if (board[i][j] != 0) {
                  int v = board[i][j] - 1;
                  sum += std::abs(i - v/3) + std::abs(j - v%3);
              }
      return sum;
  }

  int ida_star(int g, int bound, int prev) {
      int h = manhattan();
      int f = g + h;
      if (f > bound) return f;
      if (h == 0) return -1;
      int min_exceed = 1000000;
      int zx = -1, zy = -1;
      for (int i = 0; i < 3; ++i)
          for (int j = 0; j < 3; ++j)
              if (board[i][j] == 0) { zx = i; zy = j; }
      for (int d = 0; d < 4; ++d) {
          if (d == prev) continue;
          int nx = zx + dx[d], ny = zy + dy[d];
          if (nx < 0 || nx >= 3 || ny < 0 || ny >= 3) continue;
          std::swap(board[zx][zy], board[nx][ny]);
          int t = ida_star(g + 1, bound, d ^ 1);
          std::swap(board[zx][zy], board[nx][ny]);
          if (t == -1) return -1;
          if (t < min_exceed) min_exceed = t;
      }
      return min_exceed;
  }

  int main() {
      for (int i = 0; i < 3; ++i)
          for (int j = 0; j < 3; ++j)
              std::cin >> board[i][j];
      int bound = manhattan();
      while (true) {
          int t = ida_star(0, bound, -1);
          if (t == -1) { std::cout << bound << "\n"; return 0; }
          if (t > 100000) { std::cout << -1 << "\n"; return 0; }
          bound = t;
      }
  }
source_book_pages:
  - 97
  - 149
source_pdf_pages:
  - 115
  - 167
review_status: verified
external_url: https://www.luogu.com.cn/problem/P1379
external_platform: 洛谷
external_problem_id: P1379
external_title: 八数码难题
external_relation: related
---
