---
id: luogu-p1443
volume: upper
source_file: upper-volume
title: 洛谷 P1443 馬的遍歷
chapter: 3
section: '3.1'
kind: external-oj
difficulty: 1
topics: [breadth-first-search, shortest-path, grid]
prerequisites: [queue]
statement: 在 n×m 棋盤上，一匹馬從指定格出發。馬每步按西洋棋規則移動：一個座標改變 1，另一個改變 2。求它抵達每一格所需的最少步數；不可達者記為 -1。
constraints:
  - 1 <= n, m <= 400
  - 1 <= x <= n，1 <= y <= m
  - 起點與輸出座標皆依 1-based 描述
input_format: 一行四個整數 n、m、x、y，依序為棋盤列數、欄數與起點座標。
output_format: 輸出 n 行、每行 m 個整數，表示從起點到各格的最少步數；不可達輸出 -1。
samples:
  - input: '3 3 1 1'
    output: |
      0 3 2
      3 -1 1
      2 1 4
    explanation: 起點距離為 0；例如 (2,3) 與 (3,2) 可一步到達，中心格在 3×3 棋盤上不可達。
core_knowledge:
  - 無權圖單源最短路
  - 棋盤狀態與八種馬步
judgment: 每一步代價相同；馬可以跳過中間格，只需落點仍在棋盤內。
hints:
  - 把每個棋格視為節點，合法馬步視為邊；需要的是一個起點到所有節點的距離。
  - 以 -1 同時表示尚未造訪；從起點進行 BFS，鄰格第一次入隊時寫成目前距離加一。
  - 八個位移是 (±1,±2) 與 (±2,±1) 的所有組合；搜尋後仍為 -1 的格子不可達。
solution_outline: 建立 n×m 距離矩陣並填 -1，將起點距離設為 0 入隊。每次取出一格，枚舉八個馬步；合法且未造訪的落點距離設為前者加一並入隊。
proof_or_invariant: BFS 依距離非遞減取出格子。某格第一次由距離 d 的格子發現時得到長度 d+1 的路徑；若另有更短路徑，其前一格應更早被取出並先發現該格，矛盾。因此所有寫入距離均為最短值；未寫入者不與起點連通。
complexity:
  time: O(nm)
  space: O(nm)
common_errors:
  - 忘記把輸入的 1-based 起點轉成 0-based
  - 漏掉或重複八種馬步
  - 在出隊時才判重，造成同一格大量重複入隊
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, start_row, start_column;
      cin >> n >> m >> start_row >> start_column;
      --start_row;
      --start_column;
      vector<vector<int>> distance(n, vector<int>(m, -1));
      // TODO：從起點做 BFS，枚舉八種馬步並填入最短距離。
      for (const auto& row : distance) {
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
      int n, m, start_row, start_column;
      cin >> n >> m >> start_row >> start_column;
      --start_row;
      --start_column;
      vector<vector<int>> distance(n, vector<int>(m, -1));
      constexpr array<int, 8> dr{-2, -2, -1, -1, 1, 1, 2, 2};
      constexpr array<int, 8> dc{-1, 1, -2, 2, -2, 2, -1, 1};
      queue<pair<int, int>> pending;
      distance[start_row][start_column] = 0;
      pending.push({start_row, start_column});
      while (!pending.empty()) {
          const auto [row, column] = pending.front();
          pending.pop();
          for (int direction = 0; direction < 8; ++direction) {
              const int next_row = row + dr[direction];
              const int next_column = column + dc[direction];
              if (next_row >= 0 && next_row < n && next_column >= 0 && next_column < m
                  && distance[next_row][next_column] == -1) {
                  distance[next_row][next_column] = distance[row][column] + 1;
                  pending.push({next_row, next_column});
              }
          }
      }
      for (const auto& row : distance) {
          for (size_t column = 0; column < row.size(); ++column) {
              if (column > 0) cout << ' ';
              cout << row[column];
          }
          cout << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P1443
external_platform: 洛谷
external_problem_id: P1443
external_title: 馬的遍歷
external_relation: original
source_book_pages: [109]
source_pdf_pages: [127]
review_status: verified
---

所有馬步代價相同，第一次到達某格時即可確定最短距離。
