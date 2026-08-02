---
id: openjudge-4054
volume: upper
source_file: upper-volume
title: OpenJudge 4054 Cubic Eight-Puzzle：滾動立方體的雙向廣搜
chapter: 3
section: '3.5'
kind: external-oj
difficulty: 5
topics: [bidirectional-bfs, state-encoding, cube-orientation]
prerequisites: [bfs-shortest-path, queue]
statement: >-
  3×3 棋盤上放了八顆立方體，留一格空著。八顆立方體的塗色完全相同：三組對面分別是
  白色、藍色與紅色，開局時每顆都是白面朝上。每一步可以把與空格相鄰的立方體往空格
  方向翻滾一格，該顆立方體因此換一個面朝上，空格則移到它原本的位置。給定開局空格
  的位置與一張目標頂面圖案，求達成該圖案所需的最少步數；若 30 步內無法達成，輸出 -1。
constraints:
  - 資料組數少於 16
  - 目標圖案為 3×3，字元只有 B、W、R 與恰好一個 E
  - 只接受 30 步以內的答案，超過則視為無法達成
  - 目標圖案中的 E 位置可以和開局空格位置不同
input_format: >-
  每組資料先給一行兩個整數 x 與 y，代表開局空格所在的行號與列號（x 為由左數來第幾行、
  y 為由上數來第幾列，皆為 1 到 3）；接著三行是目標頂面圖案，由上而下、由左而右，
  字元 B、W、R 分別代表藍、白、紅，E 代表該格必須是空格。以一行 `0 0` 結束輸入。
output_format: 每組資料輸出一行；30 步內可達成輸出最少步數，否則輸出 -1。
samples:
  - input: |
      2 2
      W W W
      W E W
      W W W
      1 1
      R E W
      W W W
      W W W
      2 2
      R W B
      R W R
      E B R
      2 3
      R B E
      R R R
      R W R
      0 0
    output: |
      0
      1
      30
      -1
    explanation: >-
      第一組的目標就是開局盤面，所以是 0 步。第二組把空格右邊那顆立方體往左滾一格：
      它繞東西軸翻轉，紅面轉到頂面，空格移到原本第二格，恰好符合目標，所以是 1 步。
      第三組要 30 步，剛好卡在題目允許的上限。第四組在 30 步內做不到，輸出 -1。
      這組資料是本站自製的回歸測資，不是原題官方樣例。
core_knowledge:
  - 立方體三組對面同色，方向只需記垂直軸、南北軸、東西軸的顏色，共 6 種
  - 立方體彼此不可分辨，目標只約束頂面顏色，因此終點是一整組狀態
  - 雙向廣搜把 30 層的搜尋拆成兩個 15 層，狀態數從指數級降到可枚舉
judgment: >-
  狀態空間是 9 × 6^8 ≈ 1512 萬，單向 BFS 走到 30 層必然爆炸，但起點唯一、終點是
  256 個狀態的集合，而且滾動可逆，正好是雙向廣搜的標準形狀：兩端各走一半深度。
hints:
  - >-
    先問清楚「一個狀態要記什麼」。空格位置是 9 選 1；每顆立方體因為對面同色，方向只有
    3! = 6 種，頂面顏色就是垂直軸的顏色。把這些湊起來，狀態總數是可以開陣列的規模。
  - >-
    目標只規定頂面顏色，每格頂面固定時側面還有兩種擺法，所以終點不是單一狀態，而是
    2^8 = 256 個狀態。反向 BFS 就從這 256 個狀態一起出發（多源 BFS）。

    滾動是可逆的：把立方體從 p 滾進空格 e，再滾回去就回到原狀態，所以正向與反向走的是
    同一張無向圖，兩邊都用同一組轉移函式即可。
  - >-
    實作時交替擴展「目前比較小的那一層」，並在產生新狀態時檢查對面是否已經走過；
    整層展開完才回報這層找到的最小 df + db，才不會拿到非最短的相遇點。
    兩側深度加起來超過 30 就停手輸出 -1。
solution_outline: >-
  把狀態編碼成「空格位置 × 6^8 + 其餘八格方向的六進位碼」，共 9 × 6^8 = 15116544 種，
  用兩個 int8_t 陣列存正向與反向距離。正向從開局（全部白面朝上）出發，反向從 256 個
  目標狀態一起出發，每次挑比較小的 frontier 展開一層，在產生新狀態時檢查另一側是否
  已經到過；整層展開完若有相遇就回報該層最小的 df + db。兩側深度和超過 30 仍未相遇
  就輸出 -1。
proof_or_invariant: >-
  滾動只把垂直軸的顏色與移動方向所在軸的顏色對調，做兩次就回到原狀態，因此轉移可逆、
  圖是無向的，反向 BFS 與正向 BFS 用同一組邊。BFS 逐層展開的不變量是：某側距離陣列
  中被標記為 d 的狀態，其真實距離恰為 d。若最短路長度為 L，把它切成前 df 步與後 db 步
  （df + db = L），則路徑上的中點必定同時被兩側標到，所以在兩側深度和達到 L 的那一層
  一定會相遇；因為每層展開完才回報，回報的必是最小值。目標以「一組狀態」表示不影響
  正確性：從多個源點同時出發的 BFS，其距離就是到最近源點的距離。
common_errors:
  - 只記頂面顏色而丟掉側面資訊，之後滾動會算出錯誤的頂面
  - 忘記目標的每一格有兩種擺法，只從單一狀態做反向 BFS 而漏掉更短的路徑
  - 相遇就立刻回傳而沒有把該層展開完，拿到非最短的答案
  - 跨資料組沒有重設兩個距離陣列
  - 把空格那一格的方向也編進狀態，導致同一個盤面有多種編碼
complexity:
  time: 每組資料最差 O(9 · 6^8)，實測遠小於此
  space: O(9 · 6^8) 位元組，兩個距離陣列各約 15 MB
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // 顏色：0=W 白、1=B 藍、2=R 紅。方向 = (垂直軸, 南北軸, 東西軸) 的顏色排列，共 6 種。
  static array<array<int, 3>, 6> orientation_axes;
  static array<int, 6> roll_north_south;
  static array<int, 6> roll_east_west;
  static const int power6[9] = {1, 6, 36, 216, 1296, 7776, 46656, 279936, 1679616};
  static const int state_count = 9 * 1679616;
  static const int step_limit = 30;

  static void build_tables() {
      // TODO：列出 (0,1,2) 的六種排列，並算出南北向、東西向滾動後的方向編號。
      orientation_axes.fill({0, 1, 2});
      roll_north_south.fill(0);
      roll_east_west.fill(0);
  }

  static int encode(int empty_cell, const array<int, 9>& faces) {
      // TODO：空格位置 * 6^8 加上其餘八格方向的六進位碼（跳過空格那一格）。
      (void)faces;
      return empty_cell * power6[8];
  }

  static void neighbours(int state, vector<int>& out) {
      // TODO：解碼後找出空格四周的立方體，依移動方向套用對應的滾動表。
      (void)state;
      out.clear();
  }

  static vector<int> goal_states(int empty_cell, const array<int, 9>& wanted_color) {
      // TODO：每個非空格的格子有兩種擺法可讓指定顏色朝上，共 2^8 個終點。
      (void)wanted_color;
      return vector<int>{empty_cell};
  }

  static int bidirectional(int start, const vector<int>& goals) {
      // TODO：開兩個 int8_t 距離陣列（大小 state_count），正向從 start、反向從 goals
      // 一起出發，每輪展開較小的一層；產生新狀態時查另一側，整層做完再回報最小的
      // df + db，兩側深度和超過 step_limit 就輸出 -1。
      vector<int> moves;
      neighbours(start, moves);
      (void)goals;
      return -1;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      build_tables();
      int column = 0;
      int row = 0;
      while (cin >> column >> row && (column != 0 || row != 0)) {
          int empty_cell = (row - 1) * 3 + (column - 1);
          array<int, 9> wanted{};
          wanted.fill(0);
          int goal_empty = -1;
          int filled = 0;
          while (filled < 9) {
              string token;
              if (!(cin >> token)) break;
              for (char symbol : token) {
                  if (filled >= 9) break;
                  int cell = filled++;
                  if (symbol == 'E') {
                      goal_empty = cell;
                      wanted[static_cast<size_t>(cell)] = -1;
                  } else {
                      wanted[static_cast<size_t>(cell)] = symbol == 'W' ? 0 : (symbol == 'B' ? 1 : 2);
                  }
              }
          }
          if (goal_empty < 0) break;
          array<int, 9> start_faces{};
          start_faces.fill(0);
          cout << bidirectional(encode(empty_cell, start_faces), goal_states(goal_empty, wanted)) << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 顏色：0=W 白、1=B 藍、2=R 紅。立方體三組對面同色，所以方向只需記「垂直軸、南北軸、
  // 東西軸」各是哪個顏色，共 3! = 6 種；頂面顏色即垂直軸的顏色。滾動就是把垂直軸與
  // 移動方向所在的軸對調。
  static array<array<int, 3>, 6> orientation_axes;
  static array<int, 6> roll_north_south;
  static array<int, 6> roll_east_west;
  static const int power6[9] = {1, 6, 36, 216, 1296, 7776, 46656, 279936, 1679616};
  static const int state_count = 9 * 1679616;
  static const int step_limit = 30;

  static int axes_index(int vertical, int north_south, int east_west) {
      for (int index = 0; index < 6; ++index) {
          if (orientation_axes[index][0] == vertical && orientation_axes[index][1] == north_south &&
              orientation_axes[index][2] == east_west) {
              return index;
          }
      }
      return -1;
  }

  static void build_tables() {
      array<int, 3> colors = {0, 1, 2};
      int index = 0;
      do {
          orientation_axes[index] = colors;
          ++index;
      } while (next_permutation(colors.begin(), colors.end()));
      for (int state = 0; state < 6; ++state) {
          const auto& axes = orientation_axes[state];
          roll_north_south[state] = axes_index(axes[1], axes[0], axes[2]);
          roll_east_west[state] = axes_index(axes[2], axes[1], axes[0]);
      }
  }

  // 狀態 = 空格位置 * 6^8 + 其餘八格方向的六進位編碼（依格號由小到大，跳過空格）。
  static int encode(int empty_cell, const array<int, 9>& faces) {
      int code = 0;
      int digit = 0;
      for (int cell = 0; cell < 9; ++cell) {
          if (cell == empty_cell) continue;
          code += faces[static_cast<size_t>(cell)] * power6[digit];
          ++digit;
      }
      return empty_cell * power6[8] + code;
  }

  static void decode(int state, int& empty_cell, array<int, 9>& faces) {
      empty_cell = state / power6[8];
      int code = state % power6[8];
      int digit = 0;
      faces.fill(0);
      for (int cell = 0; cell < 9; ++cell) {
          if (cell == empty_cell) continue;
          faces[static_cast<size_t>(cell)] = code / power6[digit] % 6;
          ++digit;
      }
  }

  static void neighbours(int state, vector<int>& out) {
      int empty_cell = 0;
      array<int, 9> faces{};
      decode(state, empty_cell, faces);
      int empty_row = empty_cell / 3;
      int empty_column = empty_cell % 3;
      const int row_step[4] = {-1, 1, 0, 0};
      const int column_step[4] = {0, 0, -1, 1};
      out.clear();
      for (int direction = 0; direction < 4; ++direction) {
          int row = empty_row + row_step[direction];
          int column = empty_column + column_step[direction];
          if (row < 0 || row > 2 || column < 0 || column > 2) continue;
          int from_cell = row * 3 + column;
          array<int, 9> next_faces = faces;
          int rolled = faces[static_cast<size_t>(from_cell)];
          next_faces[static_cast<size_t>(empty_cell)] =
              row_step[direction] != 0 ? roll_north_south[static_cast<size_t>(rolled)]
                                       : roll_east_west[static_cast<size_t>(rolled)];
          next_faces[static_cast<size_t>(from_cell)] = 0;
          out.push_back(encode(from_cell, next_faces));
      }
  }

  // 目標只規定頂面顏色，每格頂面固定時側面仍有兩種擺法，因此終點是 2^8 個狀態。
  static vector<int> goal_states(int empty_cell, const array<int, 9>& wanted_color) {
      vector<int> cells;
      for (int cell = 0; cell < 9; ++cell) {
          if (cell != empty_cell) cells.push_back(cell);
      }
      vector<int> result;
      array<int, 9> faces{};
      for (int mask = 0; mask < 256; ++mask) {
          faces.fill(0);
          for (int index = 0; index < 8; ++index) {
              int cell = cells[static_cast<size_t>(index)];
              int wanted = wanted_color[static_cast<size_t>(cell)];
              int chosen = 0;
              int seen = 0;
              for (int state = 0; state < 6; ++state) {
                  if (orientation_axes[static_cast<size_t>(state)][0] != wanted) continue;
                  if (seen == ((mask >> index) & 1)) {
                      chosen = state;
                      break;
                  }
                  ++seen;
              }
              faces[static_cast<size_t>(cell)] = chosen;
          }
          result.push_back(encode(empty_cell, faces));
      }
      sort(result.begin(), result.end());
      result.erase(unique(result.begin(), result.end()), result.end());
      return result;
  }

  static vector<int8_t> forward_distance;
  static vector<int8_t> backward_distance;

  static int bidirectional(int start, const vector<int>& goals) {
      fill(forward_distance.begin(), forward_distance.end(), static_cast<int8_t>(-1));
      fill(backward_distance.begin(), backward_distance.end(), static_cast<int8_t>(-1));
      forward_distance[static_cast<size_t>(start)] = 0;
      for (int goal : goals) backward_distance[static_cast<size_t>(goal)] = 0;
      if (backward_distance[static_cast<size_t>(start)] == 0) return 0;
      vector<int> forward_frontier{start};
      vector<int> backward_frontier = goals;
      int forward_depth = 0;
      int backward_depth = 0;
      vector<int> moves;
      while (forward_depth + backward_depth < step_limit && !forward_frontier.empty() &&
             !backward_frontier.empty()) {
          bool go_forward = forward_frontier.size() <= backward_frontier.size();
          vector<int>& frontier = go_forward ? forward_frontier : backward_frontier;
          vector<int8_t>& own = go_forward ? forward_distance : backward_distance;
          vector<int8_t>& other = go_forward ? backward_distance : forward_distance;
          int depth = go_forward ? ++forward_depth : ++backward_depth;
          vector<int> next_frontier;
          int best = INT_MAX;
          for (int state : frontier) {
              neighbours(state, moves);
              for (int neighbour : moves) {
                  if (own[static_cast<size_t>(neighbour)] >= 0) continue;
                  own[static_cast<size_t>(neighbour)] = static_cast<int8_t>(depth);
                  if (other[static_cast<size_t>(neighbour)] >= 0) {
                      best = min(best, depth + other[static_cast<size_t>(neighbour)]);
                  }
                  next_frontier.push_back(neighbour);
              }
          }
          frontier.swap(next_frontier);
          if (best != INT_MAX) return best <= step_limit ? best : -1;
      }
      return -1;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      build_tables();
      forward_distance.assign(static_cast<size_t>(state_count), -1);
      backward_distance.assign(static_cast<size_t>(state_count), -1);
      int column = 0;
      int row = 0;
      while (cin >> column >> row && (column != 0 || row != 0)) {
          int empty_cell = (row - 1) * 3 + (column - 1);
          array<int, 9> wanted{};
          wanted.fill(0);
          int goal_empty = -1;
          int filled = 0;
          while (filled < 9) {
              string token;
              if (!(cin >> token)) break;
              for (char symbol : token) {
                  if (filled >= 9) break;
                  int cell = filled++;
                  if (symbol == 'E') {
                      goal_empty = cell;
                      wanted[static_cast<size_t>(cell)] = -1;
                  } else {
                      wanted[static_cast<size_t>(cell)] = symbol == 'W' ? 0 : (symbol == 'B' ? 1 : 2);
                  }
              }
          }
          if (goal_empty < 0) break;
          array<int, 9> start_faces{};
          start_faces.fill(0);
          int start = encode(empty_cell, start_faces);
          cout << bidirectional(start, goal_states(goal_empty, wanted)) << '\n';
      }
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/4054/
external_platform: OpenJudge 百練
external_problem_id: '4054'
external_title: Cubic Eight-Puzzle
external_relation: original
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
statement_verification: pending-author-check
review_status: verified
---

## 待核實項目

先前的來源整理已確認題名、輸入輸出格式、30 步上限，以及官方八組資料的輸出為
`0、3、13、23、29、30、-1、-1`；唯一缺的是決定立方體各面初始配置的那張圖。本頁採用的模型與尚待核對的項目如下。

- **立方體塗色**：假設三組對面分別為白、藍、紅（對面同色），因此每顆方塊只有 6 種方向。
  這是本題狀態數能壓到 9 × 6^8 的關鍵；若原圖是六面互不相同的塗法，方向數會變成 24，
  整個編碼要重寫。
- **初始擺法**：假設開局時所有方塊白面朝上、藍色在南北軸、紅色在東西軸。白面朝上這點與
  官方樣例第一組輸出 0 相符；藍紅兩軸的分配則需看圖。若圖上是反過來的，答案等同把目標
  圖案裡的 B 與 R 對調——先用官方樣例跑一遍，若輸出對不上，優先試這個對調。
- **座標順序**：假設輸入的 `x y` 是「第 x 行（由左數）、第 y 列（由上數）」。若原題是
  先列後行，把 `empty_cell` 的算式改成 `(x - 1) * 3 + (y - 1)` 即可。
- **樣例**：本頁樣例是自製的回歸測資，用來固定上述模型的行為，不是原題官方樣例。
  拿到官方八組資料後，應以 `0、3、13、23、29、30、-1、-1` 作第一層回歸。

本頁的解法、正確性論證與複雜度分析，都是針對上述題意成立的；模型若被修正，需要改的只有
`build_tables` 的初始方向與 `main` 的座標換算，搜尋部分不受影響。
