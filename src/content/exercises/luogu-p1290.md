---
id: luogu-p1290
volume: lower
source_file: lower-volume
title: 洛谷 P1290 歐幾里德博弈
chapter: 7
section: '7.9'
kind: external-oj
difficulty: 3
topics: [game-theory, euclidean-algorithm]
prerequisites: [combinatorial-game-theory]
statement: 給兩個正整數，每回合從較大數減去較小數的任意正整數倍，結果不得為負；做出 0 的玩家立即獲勝。判斷完美策略下的勝者。
constraints: [1 <= test_cases <= 6, M 與 N 不超過 long int 範圍]
input_format: 第一行測試組數 C，接著每行兩個正整數 M、N。
output_format: 先手勝輸出 Stan wins，否則輸出 Ollie wins。
samples:
  - input: |-
      2
      25 7
      24 15
    output: |-
      Stan wins
      Ollie wins
    explanation: 25、7 的先手可控制倍數選擇而獲勝；24、15 在雙方最優時由後手獲勝。
core_knowledge: [歐幾里德算法, 多重選擇局面的控制權]
judgment: 若大數能被小數整除，當前玩家可直接得到 0；若商至少 2，當前玩家也必勝。
hints:
  - 令 a>=b。當 a/b=1 時，唯一有效的新正數局面是 (b,a-b)。
  - 當 a/b>=2，當前玩家可在「直接取餘數」與「多留一個 b」兩種局面間選擇。
  - 因兩種局面的行棋方相反，至少一種對當前玩家有利；只需追蹤連續商為 1 的回合奇偶。
solution_outline: 排序兩數；在 b 非零且 a/b=1 時做一次歐幾里德步並翻轉行棋方。遇整除或商至少 2 時，當前行棋方必勝。
proof_or_invariant: 商為 1 且不整除時只能減一次 b，勝負必然反轉到 (b,a-b)。商至少 2 時，可選得到 (b,a mod b)，或多留一個 b 後迫使對方走到同一餘數局面；這兩個選擇相差一次行棋，故其中恰有一個讓當前玩家獲勝。整除則可立即取零。
common_errors: [只按 gcd 判勝負, 忘記整除可立即獲勝, 輸出字串大小寫錯誤]
complexity: { time: 'O(log min(M,N)) per case', space: 'O(1)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int cases; cin >> cases; /* TODO: 模擬商為 1 的歐幾里德步。 */ return 0; }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int test_cases;
      cin >> test_cases;
      while (test_cases-- > 0) {
          unsigned long long a, b;
          cin >> a >> b;
          bool stan_turn = true;
          while (true) {
              if (a < b) swap(a, b);
              if (a % b == 0U || a / b >= 2U) {
                  cout << (stan_turn ? "Stan wins\n" : "Ollie wins\n");
                  break;
              }
              const unsigned long long remainder = a - b;
              a = b;
              b = remainder;
              stan_turn = !stan_turn;
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1290
external_platform: 洛谷
external_problem_id: P1290
external_title: 歐幾里德的遊戲
external_relation: original
source_book_pages: [511, 515]
source_pdf_pages: [141, 145]
review_status: verified
---

這個博弈沿著歐幾里德算法前進，商大於一時便出現可掌控勝負的分岔。
