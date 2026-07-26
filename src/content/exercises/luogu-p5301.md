---
id: luogu-p5301
volume: upper
source_file: upper-volume
title: 洛谷 P5301 寶牌一大堆
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 5
topics: [dynamic-programming, mahjong, finite-state-dp]
prerequisites: [dynamic-programming, binomial-coefficient]
statement: >-
  一副麻將每種牌各四張。給定已打出的牌與不重複的寶牌，在剩餘牌中選成一副和牌；取牌方法數乘上
  每張寶牌帶來的 2 倍，再依七對子或國士無雙額外乘 7 或 13。求普通四面子一雀頭、七對子、
  國士無雙三類和牌中的最高達成分數。
constraints:
  - 1 <= T <= 2500
  - 每種牌至多打出 4 張
  - 寶牌互不重複且至多 20 張
input_format: 第一行 T；每組兩行，依序列出已打出的牌與寶牌，各行以單獨的 0 結束。
output_format: 每組輸出最高達成分數。
samples:
  - input: |-
      1
      0
      0
    output: '1308622848'
    explanation: 官方第一組資料；國士無雙取每種么九字牌各一張並將其中一種取兩張，分數最高。
  - input: |-
      1
      1m 1m 1m 1m 0
      0
    output: '100663296'
    explanation: 自建驗證資料；一萬已無剩牌，最佳普通和牌分數為 100663296。
core_knowledge: [三類和牌分治, 連續三牌有限狀態, 組合數權重]
judgment: 同一手牌若有多種拆法只取同一達成分數；槓子與刻子都只算一組面子，但會取四張或三張牌。
hints:
  - 七對子與國士無雙結構固定，可分別用選七種牌的背包與枚舉哪種牌作對子。
  - 普通牌型由牌種順序掃描；跨位置資訊只需保留前兩種牌各有多少張已被尚未結束的順子占用。
  - 某牌種最終使用 c 張時一次乘上 C(剩餘張數,c)，若它是寶牌再乘 2^c。
solution_outline: 特判七對子與國士無雙；普通牌型以面子數、雀頭是否使用、前兩格順子占用數做線性最大值 DP，三類答案取最大。
proof_or_invariant: >-
  七對子恰選七種各兩張；國士無雙恰含十三種么九字牌且其中一種多一張，直接枚舉不重不漏。
  普通牌型掃到牌 i 時，所有更早牌的使用量都已結算；未來唯一可能再影響 i 的結構，是從
  i-2、i-1、i 開始的順子。因此狀態保留前兩個順子起始數便已充分。枚舉當前新順子、
  刻子或槓子及雀頭後，當前使用量唯一確定並乘入選牌權重。歸納至 34 種牌結束，
  面子數四、雀頭一且無未完成順子的狀態恰涵蓋所有普通和牌拆法；取最大值也消除重複拆法的影響。
common_errors: [把槓子算成兩組面子, 讓順子跨越花色邊界, 寶牌只按牌種而非實際張數翻倍]
complexity:
  time: O(T * 34 * 5^4)
  space: O(5^4)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int test_count = 0; cin >> test_count; /* TODO：三類牌型分治與有限狀態 DP。 */ }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <string>
  using namespace std;
  constexpr int tile_count = 34;
  constexpr int state_count = 5 * 2 * 5 * 5;
  int state_id(int groups, int pair_used, int older, int newer) {
      return (((groups * 2 + pair_used) * 5 + older) * 5 + newer);
  }
  int tile_id(const string& token) {
      if (token.size() == 2) {
          int base = token[1] == 'm' ? 0 : (token[1] == 'p' ? 9 : 18);
          return base + token[0] - '1';
      }
      const string honor = "ESWNZBF";
      return 27 + static_cast<int>(honor.find(token[0]));
  }
  long long tile_factor(int remaining, int used, bool is_dora,
                        const array<array<long long, 5>, 5>& choose) {
      if (used > remaining) return 0;
      return choose[static_cast<size_t>(remaining)][static_cast<size_t>(used)]
             << (is_dora ? used : 0);
  }
  long long seven_pairs(const array<int, tile_count>& remaining,
                        const array<bool, tile_count>& dora,
                        const array<array<long long, 5>, 5>& choose) {
      array<long long, 8> dp{};
      dp[0] = 1;
      for (int tile = 0; tile < tile_count; ++tile) {
          const long long factor = tile_factor(remaining[static_cast<size_t>(tile)], 2,
                                               dora[static_cast<size_t>(tile)], choose);
          for (int pairs = 6; pairs >= 0; --pairs)
              if (factor != 0)
                  dp[static_cast<size_t>(pairs + 1)] =
                      max(dp[static_cast<size_t>(pairs + 1)],
                          dp[static_cast<size_t>(pairs)] * factor);
      }
      return dp[7] * 7;
  }
  long long thirteen_orphans(const array<int, tile_count>& remaining,
                             const array<bool, tile_count>& dora,
                             const array<array<long long, 5>, 5>& choose) {
      constexpr array<int, 13> orphan{0, 8, 9, 17, 18, 26, 27, 28, 29, 30, 31, 32, 33};
      long long best = 0;
      for (int pair_tile : orphan) {
          long long score = 13;
          for (int tile : orphan) {
              const int used = tile == pair_tile ? 2 : 1;
              const long long factor = tile_factor(remaining[static_cast<size_t>(tile)], used,
                                                   dora[static_cast<size_t>(tile)], choose);
              score *= factor;
          }
          best = max(best, score);
      }
      return best;
  }
  long long regular_hand(const array<int, tile_count>& remaining,
                         const array<bool, tile_count>& dora,
                         const array<array<long long, 5>, 5>& choose) {
      array<long long, state_count> dp{};
      dp[static_cast<size_t>(state_id(0, 0, 0, 0))] = 1;
      for (int tile = 0; tile < tile_count; ++tile) {
          array<long long, state_count> next{};
          const bool can_start_sequence = tile < 27 && tile % 9 <= 6;
          for (int groups = 0; groups <= 4; ++groups)
              for (int pair_used = 0; pair_used <= 1; ++pair_used)
                  for (int older = 0; older <= 4; ++older)
                      for (int newer = 0; newer <= 4; ++newer) {
                          const long long current =
                              dp[static_cast<size_t>(state_id(groups, pair_used, older, newer))];
                          if (current == 0) continue;
                          for (int starts = 0; starts + groups <= 4; ++starts) {
                              if (starts > 0 && !can_start_sequence) break;
                              for (int set_size : {0, 3, 4}) {
                                  const int next_groups = groups + starts + (set_size != 0);
                                  if (next_groups > 4) continue;
                                  for (int take_pair = 0; take_pair <= (pair_used == 0); ++take_pair) {
                                      const int used = older + newer + starts + set_size + 2 * take_pair;
                                      const long long factor =
                                          tile_factor(remaining[static_cast<size_t>(tile)], used,
                                                      dora[static_cast<size_t>(tile)], choose);
                                      if (factor == 0) continue;
                                      long long& target = next[static_cast<size_t>(
                                          state_id(next_groups, pair_used | take_pair, newer, starts))];
                                      target = max(target, current * factor);
                                  }
                              }
                          }
                      }
          dp = next;
      }
      return dp[static_cast<size_t>(state_id(4, 1, 0, 0))];
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      array<array<long long, 5>, 5> choose{};
      for (int n = 0; n <= 4; ++n) {
          choose[static_cast<size_t>(n)][0] = choose[static_cast<size_t>(n)]
                                                    [static_cast<size_t>(n)] = 1;
          for (int k = 1; k < n; ++k)
              choose[static_cast<size_t>(n)][static_cast<size_t>(k)] =
                  choose[static_cast<size_t>(n - 1)][static_cast<size_t>(k - 1)] +
                  choose[static_cast<size_t>(n - 1)][static_cast<size_t>(k)];
      }
      int test_count = 0;
      cin >> test_count;
      while (test_count-- > 0) {
          array<int, tile_count> remaining{};
          remaining.fill(4);
          array<bool, tile_count> dora{};
          string token;
          while (cin >> token && token != "0")
              --remaining[static_cast<size_t>(tile_id(token))];
          while (cin >> token && token != "0")
              dora[static_cast<size_t>(tile_id(token))] = true;
          cout << max({seven_pairs(remaining, dora, choose),
                       thirteen_orphans(remaining, dora, choose),
                       regular_hand(remaining, dora, choose)})
               << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P5301
external_platform: 洛谷
external_problem_id: P5301
external_title: 宝牌一大堆
external_relation: original
source_book_pages: [333]
source_pdf_pages: [351]
review_status: verified
---

固定牌種的取法與寶牌倍率可在該牌種離開三格視窗時一次結算，將看似龐大的和牌枚舉壓成常數狀態。
