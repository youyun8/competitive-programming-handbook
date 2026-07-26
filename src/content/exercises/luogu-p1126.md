---
id: luogu-p1126
volume: upper
source_file: upper-volume
title: 洛谷 P1126 機器人搬重物
chapter: 3
section: '3.1'
kind: external-oj
difficulty: 2
topics: [breadth-first-search, state-space, grid]
prerequisites: [queue, shortest-path]
statement: 機器人的中心位於儲藏室格線交點，身體會占到交點周圍四格，因此任何相鄰格是障礙的交點都不可站立。給定起點、終點與初始朝向；一次指令可左轉、右轉，或沿目前方向前進 1 至 3 格。每道指令耗時一秒，求抵達終點的最少時間，終點朝向不限。
constraints:
  - 1 <= n, m <= 50
  - 地圖值 0 表示可通過，1 表示障礙
  - 前進指令不能穿越障礙或無效交點
input_format: 第一行為 n、m；接著 n×m 個地圖值；最後一行為起點列欄、終點列欄與初始方向 E、S、W 或 N。
output_format: 輸出最少指令數；無法到達時輸出 -1。
samples:
  - input: |
      9 10
      0 0 0 0 0 0 1 0 0 0
      0 0 0 0 0 0 0 0 1 0
      0 0 0 1 0 0 0 0 0 0
      0 0 1 0 0 0 0 0 0 0
      0 0 0 0 0 0 1 0 0 0
      0 0 0 0 0 1 0 0 0 0
      0 0 0 1 1 0 0 0 0 0
      0 0 0 0 0 0 0 0 0 0
      1 0 0 0 0 0 0 0 1 0
      7 2 2 7 S
    output: '12'
    explanation: 將位置與朝向合成狀態後做最短路，最少需十二道轉向或前進指令。
core_knowledge:
  - 位置與方向組成 BFS 狀態
  - 由方格障礙轉換為合法格點
judgment: 前進 1、2、3 格各是一道指令；若較近的落點不合法，就不能越過它抵達更遠落點。
hints:
  - 同一格面向不同方向會影響下一步，必須是四個不同狀態。
  - 先把每個內部交點周圍四格中含障礙者標成不可站立；外框交點也不可站立。
  - BFS 的兩種轉向與三種前進都是單位代價邊；前進枚舉遇到第一個非法點便停止。
solution_outline: 建立交點可用表。距離陣列以 row、column、direction 為索引；從初態 BFS，展開左右轉與向前一至三格。任何朝向抵達終點時的最小距離即答案。
proof_or_invariant: 合法機器人配置與三維狀態一一對應，每道合法指令也與程式產生的一條邊一一對應。所有邊代價皆為一秒，所以 BFS 第一次到達狀態時得到最少指令數。取終點四個方向距離的最小值，正好消去終點朝向限制。
complexity:
  time: O(nm)
  space: O(nm)
common_errors:
  - 把輸入方格座標直接當成機器人可站立位置，未檢查周圍四格
  - 前方第一格受阻後仍嘗試跳到第二或第三格
  - 將前進三格誤算成三秒
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m));
      for (auto& row : grid) for (int& value : row) cin >> value;
      int start_row, start_column, target_row, target_column;
      char facing;
      cin >> start_row >> start_column >> target_row >> target_column >> facing;
      // TODO：建立交點合法表，以位置及方向為狀態做 BFS。
      cout << -1 << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      cin >> n >> m;
      vector<vector<int>> grid(n, vector<int>(m));
      for (auto& row : grid) for (int& value : row) cin >> value;
      int start_row, start_column, target_row, target_column;
      char facing;
      cin >> start_row >> start_column >> target_row >> target_column >> facing;
      vector<vector<bool>> valid(n, vector<bool>(m, false));
      for (int row = 1; row < n; ++row) {
          for (int column = 1; column < m; ++column) {
              valid[row][column] = grid[row - 1][column - 1] == 0
                  && grid[row - 1][column] == 0
                  && grid[row][column - 1] == 0
                  && grid[row][column] == 0;
          }
      }
      const string names = "ESWN";
      const int start_direction = static_cast<int>(names.find(facing));
      constexpr array<int, 4> dr{0, 1, 0, -1};
      constexpr array<int, 4> dc{1, 0, -1, 0};
      vector<vector<array<int, 4>>> distance(
          n, vector<array<int, 4>>(m, array<int, 4>{-1, -1, -1, -1}));
      queue<tuple<int, int, int>> pending;
      if (valid[start_row][start_column]) {
          distance[start_row][start_column][start_direction] = 0;
          pending.push({start_row, start_column, start_direction});
      }
      while (!pending.empty()) {
          const auto [row, column, direction] = pending.front();
          pending.pop();
          const int next_distance = distance[row][column][direction] + 1;
          for (int turn : {-1, 1}) {
              const int next_direction = (direction + turn + 4) % 4;
              if (distance[row][column][next_direction] == -1) {
                  distance[row][column][next_direction] = next_distance;
                  pending.push({row, column, next_direction});
              }
          }
          for (int step = 1; step <= 3; ++step) {
              const int next_row = row + dr[direction] * step;
              const int next_column = column + dc[direction] * step;
              if (next_row < 0 || next_row >= n || next_column < 0 || next_column >= m
                  || !valid[next_row][next_column]) break;
              if (distance[next_row][next_column][direction] == -1) {
                  distance[next_row][next_column][direction] = next_distance;
                  pending.push({next_row, next_column, direction});
              }
          }
      }
      int answer = numeric_limits<int>::max();
      for (int direction = 0; direction < 4; ++direction) {
          const int value = distance[target_row][target_column][direction];
          if (value != -1) answer = min(answer, value);
      }
      cout << (answer == numeric_limits<int>::max() ? -1 : answer) << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1126
external_platform: 洛谷
external_problem_id: P1126
external_title: '[CERC 1996] 機器人搬重物'
external_relation: original
source_book_pages: [109]
source_pdf_pages: [127]
review_status: verified
---

幾何占用先轉成「哪些交點可站」，後續便是標準的帶方向狀態 BFS。
