---
id: luogu-p8164
volume: lower
source_file: lower-volume
title: 洛谷 P8164 沙堡 2：下降路徑矩形計數
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['矩形計數', '二維前綴和', '根號分治思想']
prerequisites: ['有向無環圖', '前綴和']
statement: H×W 網格每格高度互異。可任選起點，之後每步走到上下左右相鄰且更低的格子；問有多少個軸平行矩形，恰好能作為某次行走所訪問的全部格子。
constraints:
  - '1 <= H,W'
  - 'H*W <= 50000'
  - '1 <= A_i,j <= 10000000'
  - 所有格子高度互異
input_format: 第一行 H、W；接著 H 行，每行 W 個格子高度。
output_format: 輸出可行矩形數。
samples:
  - input: |
      1 5
      2 4 7 1 5
    output: |
      10
    explanation: 單列矩形就是連續區間；除單格外，恰為高度嚴格遞增或嚴格遞減的區間，共十個。
core_knowledge:
  - 在固定矩形內，每格連向其相鄰較低格中最高者
  - 此函數圖無環；可走遍全部格子當且僅當入度為零的格子恰有一個
  - 某格是否入度為零，只取決於它周圍距離至多 2 的格子與四邊界距離的 0、1、至少 2 分類
judgment: 對四個方向的邊界距離各分成 0/1/2，共 81 種局部情境，預先建立「此格是否無入邊」的直向前綴和。轉置使 H<=W，枚舉上下邊。對左右邊距九種組合批次算各欄來源數；寬度 1..4 直接合併欄貢獻，寬度至少 5 時將來源總數寫成 right_value[r]-left_value[l]，以頻率表線性計數等於 1 的區間。
hints:
  - 若每格都走向矩形內「比自己低但最高」的相鄰格，任何能走遍的下降序列都必須沿這些唯一候選邊前進。
  - 一格是否收到鄰格 x 的箭頭，只需檢查 x 的四鄰；相對目標格最遠不超過兩步，所以邊界距離截成 0、1、2 已足夠。
  - 固定上下邊且寬至少 5 時，中央欄型態皆為 (left>=2,right>=2)；來源數可拆成左邊界項、中央前綴差、右邊界項。
solution_outline: 先轉置令短邊為 H。預算 81 種邊界距離型態下每格是否無入邊，並對每欄做垂直前綴。枚舉 top,bottom，將列依距上下界 0/1/2 分成至多五組，求九種水平距離型態在每欄的來源數。寬 1..4 逐寬 O(W) 計數；寬>=5 用 core 欄前綴與左右兩欄貢獻構成 A[r]-B[l]，掃 r 並統計 B=A-1 的既有左端。
proof_or_invariant: 高度沿箭頭嚴格下降，故圖無環且每點出度至多一。每個弱連通分量至少有一個入度零點；若全矩形恰一個，圖既只有一個分量也不能分叉，因而是涵蓋所有點的單一路徑，反之可行路徑顯然只有起點入度零。局部判定完整枚舉可能給鄰格提供更佳下一步的半徑二格。固定上下界後，寬至少五的矩形只有左右各兩欄受水平邊界影響，中央來源數可加，因此代數拆分與頻率計數精確涵蓋所有左右界。
complexity:
  time: O(H*W*81 + H^2*W)，其中先轉置使 H=min(原 H,原 W)
  space: O(81*H*W)
common_errors:
  - 只檢查每格有沒有較低鄰格，未檢查高度序中下一格是否唯一相鄰
  - 以入度零數量不超過一判斷卻漏記非空圖必至少一個
  - 未轉置，讓平方落在較長維度
  - 寬至少五的中央範圍 off-by-one，正確為 l+2 到 r-2
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：預算 81 種局部邊界型態，枚舉短邊上下界並線性計數左右界。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static int pattern_id(int top, int bottom, int left, int right) {
      return ((top * 3 + bottom) * 3 + left) * 3 + right;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int height;
      int width;
      cin >> height >> width;
      vector<vector<int>> values(
          static_cast<size_t>(height),
          vector<int>(static_cast<size_t>(width)));
      for (auto& row : values) {
          for (int& value : row) { cin >> value; }
      }
      if (height > width) {
          vector<vector<int>> transposed(
              static_cast<size_t>(width),
              vector<int>(static_cast<size_t>(height)));
          for (int row = 0; row < height; ++row) {
              for (int column = 0; column < width; ++column) {
                  transposed[static_cast<size_t>(column)]
                            [static_cast<size_t>(row)] =
                      values[static_cast<size_t>(row)]
                            [static_cast<size_t>(column)];
              }
          }
          values.swap(transposed);
          swap(height, width);
      }
      const int cell_count = height * width;
      const size_t plane_size =
          static_cast<size_t>(height + 1) * static_cast<size_t>(width);
      vector<int> vertical_prefix(81U * plane_size, 0);
      constexpr array<int, 4> row_delta{-1, 1, 0, 0};
      constexpr array<int, 4> column_delta{0, 0, -1, 1};

      const auto is_inside = [&](int row, int column, int center_row,
                                 int center_column, int top_margin,
                                 int bottom_margin, int left_margin,
                                 int right_margin) {
          if (row < 0 || row >= height || column < 0 || column >= width) {
              return false;
          }
          const int row_offset = row - center_row;
          const int column_offset = column - center_column;
          return row_offset >= -top_margin &&
                 row_offset <= bottom_margin &&
                 column_offset >= -left_margin &&
                 column_offset <= right_margin;
      };

      for (int top_margin = 0; top_margin < 3; ++top_margin) {
          for (int bottom_margin = 0; bottom_margin < 3;
               ++bottom_margin) {
              for (int left_margin = 0; left_margin < 3; ++left_margin) {
                  for (int right_margin = 0; right_margin < 3;
                       ++right_margin) {
                      const int pattern =
                          pattern_id(top_margin, bottom_margin,
                                     left_margin, right_margin);
                      const size_t base =
                          static_cast<size_t>(pattern) * plane_size;
                      for (int column = 0; column < width; ++column) {
                          int accumulated = 0;
                          for (int row = 0; row < height; ++row) {
                              bool source = true;
                              const int target_value =
                                  values[static_cast<size_t>(row)]
                                        [static_cast<size_t>(column)];
                              for (int direction = 0; direction < 4 &&
                                                      source;
                                   ++direction) {
                                  const int neighbor_row =
                                      row +
                                      row_delta[static_cast<size_t>(
                                          direction)];
                                  const int neighbor_column =
                                      column +
                                      column_delta[static_cast<size_t>(
                                          direction)];
                                  if (!is_inside(
                                          neighbor_row, neighbor_column,
                                          row, column, top_margin,
                                          bottom_margin, left_margin,
                                          right_margin)) {
                                      continue;
                                  }
                                  const int neighbor_value =
                                      values[static_cast<size_t>(
                                          neighbor_row)]
                                            [static_cast<size_t>(
                                                neighbor_column)];
                                  if (neighbor_value <= target_value) {
                                      continue;
                                  }
                                  int best_row = -1;
                                  int best_column = -1;
                                  int best_value = -1;
                                  for (int next_direction = 0;
                                       next_direction < 4;
                                       ++next_direction) {
                                      const int candidate_row =
                                          neighbor_row +
                                          row_delta[static_cast<size_t>(
                                              next_direction)];
                                      const int candidate_column =
                                          neighbor_column +
                                          column_delta[static_cast<size_t>(
                                              next_direction)];
                                      if (!is_inside(
                                              candidate_row,
                                              candidate_column, row,
                                              column, top_margin,
                                              bottom_margin, left_margin,
                                              right_margin)) {
                                          continue;
                                      }
                                      const int candidate_value =
                                          values[static_cast<size_t>(
                                              candidate_row)]
                                                [static_cast<size_t>(
                                                    candidate_column)];
                                      if (candidate_value <
                                              neighbor_value &&
                                          candidate_value > best_value) {
                                          best_value = candidate_value;
                                          best_row = candidate_row;
                                          best_column = candidate_column;
                                      }
                                  }
                                  if (best_row == row &&
                                      best_column == column) {
                                      source = false;
                                  }
                              }
                              if (source) { ++accumulated; }
                              vertical_prefix[
                                  base +
                                  static_cast<size_t>(row + 1) *
                                      static_cast<size_t>(width) +
                                  static_cast<size_t>(column)] =
                                  accumulated;
                          }
                      }
                  }
              }
          }
      }

      vector<int> frequency(
          static_cast<size_t>(2 * cell_count + 5), 0);
      const int offset = cell_count + 2;
      long long answer = 0;
      for (int top = 0; top < height; ++top) {
          for (int bottom = top; bottom < height; ++bottom) {
              struct RowGroup {
                  int first;
                  int last;
                  int top_margin;
                  int bottom_margin;
              };
              vector<RowGroup> groups;
              for (int row = top; row <= bottom; ++row) {
                  const int top_margin = min(row - top, 2);
                  const int bottom_margin = min(bottom - row, 2);
                  if (!groups.empty() &&
                      groups.back().top_margin == top_margin &&
                      groups.back().bottom_margin == bottom_margin) {
                      groups.back().last = row;
                  } else {
                      groups.push_back(
                          {row, row, top_margin, bottom_margin});
                  }
              }
              vector<vector<int>> column_count(
                  9U, vector<int>(static_cast<size_t>(width), 0));
              for (int left_margin = 0; left_margin < 3; ++left_margin) {
                  for (int right_margin = 0; right_margin < 3;
                       ++right_margin) {
                      vector<int>& counts =
                          column_count[static_cast<size_t>(
                              left_margin * 3 + right_margin)];
                      for (const RowGroup& group : groups) {
                          const int pattern =
                              pattern_id(group.top_margin,
                                         group.bottom_margin,
                                         left_margin, right_margin);
                          const size_t base =
                              static_cast<size_t>(pattern) * plane_size;
                          const size_t upper_row =
                              static_cast<size_t>(group.last + 1) *
                              static_cast<size_t>(width);
                          const size_t lower_row =
                              static_cast<size_t>(group.first) *
                              static_cast<size_t>(width);
                          for (int column = 0; column < width; ++column) {
                              counts[static_cast<size_t>(column)] +=
                                  vertical_prefix[
                                      base + upper_row +
                                      static_cast<size_t>(column)] -
                                  vertical_prefix[
                                      base + lower_row +
                                      static_cast<size_t>(column)];
                          }
                      }
                  }
              }

              for (int rectangle_width = 1; rectangle_width <= 4;
                   ++rectangle_width) {
                  for (int left = 0;
                       left + rectangle_width <= width; ++left) {
                      int sources = 0;
                      for (int delta = 0; delta < rectangle_width;
                           ++delta) {
                          const int left_margin = min(delta, 2);
                          const int right_margin =
                              min(rectangle_width - 1 - delta, 2);
                          sources +=
                              column_count[static_cast<size_t>(
                                  left_margin * 3 + right_margin)]
                                          [static_cast<size_t>(left +
                                                               delta)];
                      }
                      if (sources == 1) { ++answer; }
                  }
              }
              if (width < 5) { continue; }
              const vector<int>& core = column_count[8];
              const vector<int>& left_zero = column_count[2];
              const vector<int>& left_one = column_count[5];
              const vector<int>& right_one = column_count[7];
              const vector<int>& right_zero = column_count[6];
              vector<int> prefix(static_cast<size_t>(width + 1), 0);
              vector<int> left_contribution(
                  static_cast<size_t>(width), 0);
              vector<int> right_contribution(
                  static_cast<size_t>(width), 0);
              for (int column = 0; column < width; ++column) {
                  prefix[static_cast<size_t>(column + 1)] =
                      prefix[static_cast<size_t>(column)] +
                      core[static_cast<size_t>(column)];
                  if (column + 1 < width) {
                      left_contribution[static_cast<size_t>(column)] =
                          left_zero[static_cast<size_t>(column)] +
                          left_one[static_cast<size_t>(column + 1)];
                  }
                  if (column > 0) {
                      right_contribution[static_cast<size_t>(column)] =
                          right_one[static_cast<size_t>(column - 1)] +
                          right_zero[static_cast<size_t>(column)];
                  }
              }
              vector<int> touched;
              touched.reserve(static_cast<size_t>(width));
              for (int right = 4; right < width; ++right) {
                  const int left = right - 4;
                  const int left_value =
                      prefix[static_cast<size_t>(left + 2)] -
                      left_contribution[static_cast<size_t>(left)];
                  const int insert_index = left_value + offset;
                  if (frequency[static_cast<size_t>(insert_index)] == 0) {
                      touched.push_back(insert_index);
                  }
                  ++frequency[static_cast<size_t>(insert_index)];
                  const int right_value =
                      right_contribution[static_cast<size_t>(right)] +
                      prefix[static_cast<size_t>(right - 1)];
                  const int wanted_index = right_value - 1 + offset;
                  answer += frequency[static_cast<size_t>(wanted_index)];
              }
              for (int index : touched) {
                  frequency[static_cast<size_t>(index)] = 0;
              }
          }
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P8164
external_platform: 洛谷
external_problem_id: P8164
external_title: '[JOI 2022 Final] Sandcastle 2'
external_relation: original
source_book_pages: [562]
source_pdf_pages: [192]
review_status: verified
---

題面、限制與三組範例已依 JOI 官方題面、官方解說、AtCoder 與 OJ.uz 交叉核實；繁中敘述、局部 81 型態推導與程式為本站獨立撰寫。
