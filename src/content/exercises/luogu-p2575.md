---
id: luogu-p2575
volume: lower
source_file: lower-volume
title: 洛谷 P2575 二十格跳棋博弈
chapter: 7
section: '7.9'
kind: external-oj
difficulty: 5
topics: [sprague-grundy, bitmask-dp]
prerequisites: [combinatorial-game-theory]
statement: 棋盤有 n 個互不影響、各 20 格的橫列。每步選一枚棋子，移到它右方第一個空格；右方無空格則不能移。無合法步者輸，判斷先手是否必勝。
constraints: [1 <= test_cases <= 100, 1 <= n <= 1000, 每列最多 20 枚棋子]
input_format: 第一行 T；每組先 n，接著 n 行各為 m 及 m 個棋子位置 p_j（1..20）。
output_format: 每組先手勝輸出 YES，否則輸出 NO。
samples:
  - input: |-
      2
      1
      2 19 20
      2
      1 19
      1 18
    output: |-
      NO
      YES
    explanation: 第一局兩枚棋子已佔最右兩格，無法移動；第二局是兩個非零 SG 子遊戲的和。
core_knowledge: [SG 函數的 mex, 獨立遊戲和的異或, 二十位元狀態]
judgment: 若緊鄰右格已占用，棋子會越過連續棋子到「第一個」空格，不是只能走一格。
hints:
  - 每一列是獨立子遊戲，整體 SG 值是各列 SG 的 XOR。
  - 以 20 位 mask 表示一列；枚舉每個 1，尋找其右側第一個 0 形成後繼。
  - 移動後 mask 數值嚴格增加，所以可由大到小預處理所有 SG。
solution_outline: 由 2^20-1 降至 0，蒐集每個狀態所有後繼 SG 並取 mex；讀入每列 mask 後 XOR 對應 SG。
proof_or_invariant: 每個合法操作只改變一列，因此 SG 和定理適用。對單列，定義 SG(mask)=mex(後繼 SG)；棋子只向較高 bit 移動，使後繼 mask 較大，在降序迭代時已計算。終局無後繼，mex 空集合為零，歸納覆蓋所有狀態。
common_errors: [把多列棋盤合成一個 mask, 找任意右側空格而非第一個, 用加法合併 SG 值]
complexity: { time: 'O(20·2^20 + total pieces)', space: 'O(2^20)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { /* TODO: 預處理 2^20 個 SG。 */ return 0; }
cpp_solution: |
  #include <array>
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      constexpr int width = 20;
      constexpr int state_count = 1 << width;
      vector<uint8_t> grundy(static_cast<size_t>(state_count), 0);
      for (int mask = state_count - 2; mask >= 0; --mask) {
          array<bool, width + 1> seen{};
          for (int position = 0; position < width; ++position) {
              if ((mask & (1 << position)) == 0) continue;
              int destination = position + 1;
              while (destination < width && (mask & (1 << destination)) != 0) ++destination;
              if (destination < width) {
                  const int next = mask ^ (1 << position) ^ (1 << destination);
                  seen[grundy[static_cast<size_t>(next)]] = true;
              }
          }
          int value = 0;
          while (seen[static_cast<size_t>(value)]) ++value;
          grundy[static_cast<size_t>(mask)] = static_cast<uint8_t>(value);
      }
      int test_cases;
      cin >> test_cases;
      while (test_cases-- > 0) {
          int rows;
          cin >> rows;
          int xor_sum = 0;
          while (rows-- > 0) {
              int pieces;
              cin >> pieces;
              int mask = 0;
              while (pieces-- > 0) {
                  int position;
                  cin >> position;
                  mask |= 1 << (position - 1);
              }
              xor_sum ^= grundy[static_cast<size_t>(mask)];
          }
          cout << (xor_sum != 0 ? "YES\n" : "NO\n");
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2575
external_platform: 洛谷
external_problem_id: P2575
external_title: 高手過招
external_relation: original
source_book_pages: [511, 515]
source_pdf_pages: [141, 145]
review_status: verified
---

固定寬度讓完整 SG 狀態表可行，而多列組合則由 XOR 一次完成。
