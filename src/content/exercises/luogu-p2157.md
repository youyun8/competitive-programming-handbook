---
id: luogu-p2157
volume: upper
source_file: upper-volume
title: 洛谷 P2157 學校食堂
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 5
topics: [state-compression-dp, sliding-window, shortest-path-dp]
prerequisites: [bitmask-dp]
statement: >-
  n 位學生依序排隊，第 i 位的口味為 T_i，最多容許後方 B_i 人先取餐。廚房一次做一道菜，
  相鄰兩道菜的時間為前後口味的位元 XOR，第一道不耗時。求不違反任何人容忍度的最小總時間。
constraints:
  - 1 <= C <= 5
  - 1 <= n <= 1000
  - 0 <= T_i <= 1000
  - 0 <= B_i <= 7
input_format: 第一行資料組數 C；每組先給 n，再給 n 行 T_i、B_i。
output_format: 每組輸出做完全部菜的最少時間。
samples:
  - input: |-
      2
      5
      5 2
      4 1
      12 0
      3 3
      2 2
      2
      5 0
      4 0
    output: |-
      16
      1
    explanation: 官方範例；第一組可依 3、2、1、4、5 號順序完成，第二組只能照原順序。
  - input: |-
      1
      3
      1 0
      2 0
      3 0
    output: '4'
    explanation: 自建範例；順序固定，總時間為 (1 xor 2)+(2 xor 3)=3+1=4。
core_knowledge: [局部插隊視窗, 滑動位元遮罩, 記錄最後決策]
judgment: B_i 限制的是可先於 i 完成者的最遠原始位置，不是總共有多少人能任意跨過 i。
hints:
  - 因 B_i<=7，當最前方尚未處理者為 i 時，只需關心 i..i+7 是否已完成。
  - 轉移還要記最後一道菜相對 i 的位置，才能計算下一次口味 XOR。
  - 枚舉候選 i+j 時，所有更早且尚未完成者都要求 j<=k+B_{i+k}；掃描 j 時維護這些上界的最小值。
solution_outline: 令 dp[mask][last] 表示目前基準 i 的八人完成遮罩及最後完成者相對位置；同層加入可合法插隊者，最低位完成後右移遮罩並推進 i。
proof_or_invariant: >-
  基準 i 之前的人都已完成，而 i 到 i+7 的完成情況由 mask 完整記錄；更後方的人不可能越過 i，
  因 i 的容忍度至多七。枚舉下一人 i+j 時，掃描途中每個未完成的 i+k 都必須滿足
  j-k<=B_{i+k}，維護最小允許終點正好等價於全部限制。做完 i 後把基準右移只改變相對座標，
  不產生成本。每次實際做菜才加入與 last 的 XOR，故所有合法順序皆有且只有一條 DP 路徑，
  取最小值得到最優總時間。
common_errors: [只檢查隊首一人的容忍度, 右移遮罩時忘記同步平移last, 把位元運算式誤寫成一般加減]
complexity:
  time: O(C * n * 2^8 * 16 * 8)
  space: O(2^8 * 16)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int case_count = 0; cin >> case_count; /* TODO：八人滑動視窗狀壓 DP。 */ }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  constexpr int width = 8;
  constexpr int masks = 1 << width;
  constexpr int last_states = 16;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int case_count = 0;
      cin >> case_count;
      while (case_count-- > 0) {
          int n = 0;
          cin >> n;
          vector<int> taste(static_cast<size_t>(n + 1));
          vector<int> tolerance(static_cast<size_t>(n + 1));
          for (int i = 1; i <= n; ++i)
              cin >> taste[static_cast<size_t>(i)] >> tolerance[static_cast<size_t>(i)];
          const int infinity = numeric_limits<int>::max() / 4;
          vector<array<int, last_states>> dp(masks);
          vector<array<int, last_states>> next(masks);
          for (auto& state : dp) state.fill(infinity);
          dp[0][7] = 0;
          for (int first = 1; first <= n; ++first) {
              for (auto& state : next) state.fill(infinity);
              for (int mask = 0; mask < masks; ++mask)
                  for (int encoded_last = 0; encoded_last < last_states; ++encoded_last) {
                      const int current =
                          dp[static_cast<size_t>(mask)][static_cast<size_t>(encoded_last)];
                      if (current == infinity) continue;
                      const int last = encoded_last - 8;
                      if ((mask & 1) != 0) {
                          const int shifted_last = last - 1;
                          if (shifted_last >= -8)
                              next[static_cast<size_t>(mask >> 1)]
                                  [static_cast<size_t>(shifted_last + 8)] =
                                      min(next[static_cast<size_t>(mask >> 1)]
                                              [static_cast<size_t>(shifted_last + 8)],
                                          current);
                          continue;
                      }
                      int furthest = min(width - 1, n - first);
                      for (int offset = 0; offset <= furthest; ++offset) {
                          if ((mask & (1 << offset)) != 0) continue;
                          const int student = first + offset;
                          const int previous = first + last;
                          const int added =
                              previous <= 0 ? 0 :
                              taste[static_cast<size_t>(previous)] ^
                                  taste[static_cast<size_t>(student)];
                          int& target =
                              dp[static_cast<size_t>(mask | (1 << offset))]
                                [static_cast<size_t>(offset + 8)];
                          target = min(target, current + added);
                          furthest = min(furthest,
                                         offset + tolerance[static_cast<size_t>(student)]);
                      }
                  }
              dp.swap(next);
          }
          int answer = infinity;
          for (int encoded_last = 0; encoded_last < last_states; ++encoded_last)
              answer = min(answer, dp[0][static_cast<size_t>(encoded_last)]);
          cout << answer << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P2157
external_platform: 洛谷
external_problem_id: P2157
external_title: 学校食堂
external_relation: original
source_book_pages: [359]
source_pdf_pages: [377]
review_status: verified
---

容忍度上限七把全域排列限制局部化；滑動遮罩配合最後一道菜位置即可完整保留未來所需資訊。
