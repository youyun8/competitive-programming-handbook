---
id: luogu-p2678
volume: upper
source_file: upper-volume
title: 洛谷 P2678 跳石頭
chapter: 2
section: '2.3'
kind: external-oj
difficulty: 2
topics: ['答案二分', '貪心', '最大化最小值']
prerequisites: ['二分搜尋', '線性掃描']
statement: |-
  起點與終點相距 L，中間依序有 N 顆岩石。參賽者只能沿河道從目前岩石跳到下一顆保留岩石。主辦方至多能移走 M 顆中間岩石；求如何移除，才能讓整趟路程中的最短一跳盡可能長，並輸出這個最大值。
constraints:
  - '1 ≤ L ≤ 1000000000'
  - '0 ≤ N ≤ 50000'
  - '0 ≤ M ≤ N'
  - '中間岩石位置嚴格遞增，皆位於 0 與 L 之間'
input_format: 第一行為 L、N、M；接下來 N 行依離起點距離遞增輸入各岩石位置。
output_format: 輸出最短跳躍距離可達到的最大整數值。
samples:
  - input: |
      25 5 2
      2
      11
      14
      17
      21
    output: |
      4
    explanation: 例如移除位置 2、14，剩餘跳距為 11、6、4、4，最短為 4；若要求至少 5，兩次移除不足以消除所有過短間隔。
core_knowledge:
  - '對最短距離做整數答案二分'
  - '由左至右貪心刪除與前一保留點太近的岩石'
judgment: '目標值越小越容易達成，形成單調可行性；真正需要設計的是如何在固定距離下計算最少刪除數。'
hints:
  - '先不要決定答案，假設要求每一跳至少為 d，能否快速判斷？'
  - '維護上一顆確定保留的岩石；遇到距離不足的下一顆時，刪掉較靠右的這顆不會壓縮後續空間。'
  - '將終點 L 也放入位置序列。移除數≤M 表示 d 可行，使用 [low,high) 二分第一個不可行值，答案為 low。'
solution_outline: 位置序列前後補 0 與 L。檢查 d 時掃描所有後繼位置：與上一保留點相距不足 d 就計為移除，否則更新上一保留點。若移除數不超過 M 則可行。二分 d 的最大可行值。
proof_or_invariant: '檢查過程始終讓 last 是在達成距離 d 且使用最少移除的前提下，最後保留位置能取到的最小值。遇到 x-last<d 時，x 與 last 不可同留；留下較早的 last 對後續至少同樣有利，因此刪 x 存在最優解。遇到距離足夠則保留 x 無須增加刪除。歸納得貪心刪除數最少。可行性隨 d 增大只會由真變假，所以二分結果正確。'
common_errors:
  - '只檢查中間岩石，漏掉最後一跳到終點'
  - '把「至多移除 M 顆」寫成必須恰好移除 M 顆的檢查'
  - '使用 current-last<=d，錯刪距離恰為 d 的岩石'
  - '二分上界未設為不可行值'
complexity:
  time: 'O(N log L)'
  space: 'O(N)'
cpp_skeleton: |
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int river_length = 0;
      int rock_count = 0;
      int removal_limit = 0;
      cin >> river_length >> rock_count >> removal_limit;
      vector<int> positions(static_cast<size_t>(rock_count) + 2U, 0);
      for (int i = 1; i <= rock_count; ++i) {
          cin >> positions[static_cast<size_t>(i)];
      }
      positions.back() = river_length;
      // TODO：實作固定最短距離的貪心檢查，再二分最大可行距離。
      (void)removal_limit;
      cout << 0 << '\n';
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int river_length = 0;
      int rock_count = 0;
      int removal_limit = 0;
      cin >> river_length >> rock_count >> removal_limit;
      vector<int> positions(static_cast<size_t>(rock_count) + 2U, 0);
      for (int i = 1; i <= rock_count; ++i) {
          cin >> positions[static_cast<size_t>(i)];
      }
      positions.back() = river_length;

      const auto is_feasible = [&](int minimum_jump) {
          int removed = 0;
          int last_position = 0;
          for (size_t i = 1; i < positions.size(); ++i) {
              if (positions[i] - last_position < minimum_jump) {
                  ++removed;
              } else {
                  last_position = positions[i];
              }
          }
          return removed <= removal_limit;
      };

      int low = 0;
      int high = river_length + 1;
      while (low + 1 < high) {
          const int middle = low + (high - low) / 2;
          if (is_feasible(middle)) {
              low = middle;
          } else {
              high = middle;
          }
      }
      cout << low << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2678
external_platform: 洛谷
external_problem_id: P2678
external_title: '[NOIP 2015 提高组] 跳石头'
external_relation: original
source_book_pages: [43]
source_pdf_pages: [61]
review_status: verified
---

這題把「刪除哪些岩石」轉為「某個距離能否做到」，才得到可線性檢查的結構。
