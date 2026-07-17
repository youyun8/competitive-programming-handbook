---

id: grid-connected-components
volume: upper
source_file: upper-volume
title: 網格連通塊數量
chapter: 3
section: '3.3'
kind: practice
difficulty: 1
topics:
  - flood-fill
  - bfs
  - dfs
  - grid
prerequisites:
  - arrays
statement: 給定 n x m 的網格，"." 表示空地，"#" 表示障礙。求空地構成的四連通塊數量。
constraints:
  - 1 <= n, m <= 1000
input_format: 第一行為 n 與 m，接下來 n 行各為 m 個字元。
output_format: 輸出連通塊數量。
samples:
  - input: |
      4 5
      ..#..
      ..#..
      .##..
      .....
    output: |
      2
    explanation: 障礙物把網格分成上下兩個連通塊。
hints:
  - 對每個未造訪的空地啟動 BFS/DFS，標記所有可達空地。
  - 注意邊界檢查，避免陣列越界。
solution_outline: 雙重迴圈掃描每個格子；遇到未造訪空地時 count++ 並以 BFS 標記整個連通塊。
proof_or_invariant: 每次 BFS 恰好標記一個連通塊的所有格子，且不會跨過障礙物。
complexity:
  time: O(n * m)
  space: O(n * m)
cpp_solution: |
  #include <iostream>
  #include <queue>
  #include <vector>
  
  int main() {
      std::ios::sync_with_stdio(false);
      std::cin.tie(nullptr);
      int n = 0, m = 0;
      std::cin >> n >> m;
      std::vector<std::string> grid(n);
      for (int i = 0; i < n; ++i) std::cin >> grid[i];
      std::vector<std::vector<bool>> vis(n, std::vector<bool>(m, false));
      int count = 0;
      const int dx[4] = {-1, 1, 0, 0};
      const int dy[4] = {0, 0, -1, 1};
      for (int i = 0; i < n; ++i) {
          for (int j = 0; j < m; ++j) {
              if (grid[i][j] == '#' || vis[i][j]) continue;
              ++count;
              std::queue<std::pair<int,int>> q;
              q.push({i, j});
              vis[i][j] = true;
              while (!q.empty()) {
                  auto [x, y] = q.front(); q.pop();
                  for (int d = 0; d < 4; ++d) {
                      int nx = x + dx[d], ny = y + dy[d];
                      if (nx < 0 || nx >= n || ny < 0 || ny >= m) continue;
                      if (grid[nx][ny] == '#' || vis[nx][ny]) continue;
                      vis[nx][ny] = true;
                      q.push({nx, ny});
                  }
              }
          }
      }
      std::cout << count << "\n";
  }
source_book_pages:
  - 97
  - 149
source_pdf_pages:
  - 115
  - 167
review_status: verified
external_url: https://www.luogu.com.cn/problem/P1596
external_platform: 洛谷
external_problem_id: P1596
external_title: Lake Counting
external_relation: related
---

