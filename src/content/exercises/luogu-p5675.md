---
id: luogu-p5675
volume: lower
source_file: lower-volume
title: 洛谷 P5675 指定首堆的 Nim 計數
chapter: 7
section: '7.9'
kind: external-oj
difficulty: 5
topics: [nim, xor-dp, prefix-suffix]
prerequisites: [combinatorial-game-theory]
statement: 從 n 堆正數石子選出非空子集，並指定其中一堆必須作為 Alice 第一次操作的堆；其後按普通 Nim 規則遊戲。求使 Alice 無論第一次從指定堆取多少都不能保證獲勝的「子集、指定堆」方案數。
constraints: [1 <= n <= 200, 1 <= a_i <= 255]
input_format: 第一行 n，第二行 n 個石子數 a_i。
output_format: 輸出方案數模 1000000007。
samples:
  - input: |-
      3
      2 4 5
    output: '5'
    explanation: 按選中集合與指定首堆區分，共五種讓 Alice 無法勝出的方案。
  - input: |-
      3
      1 2 2
    output: '6'
    explanation: 即使集合相同，指定不同編號仍算不同方案。
core_knowledge: [Nim 的零異或判準, 子集 XOR 動態規劃, 前後綴合併]
judgment: 第一次只能在指定堆取 1 到 a_i 顆；若取完則該堆成 0，亦即留下值 x 可為 0..a_i-1。
hints:
  - 固定指定堆 i，設其他選中堆的 XOR 為 k。
  - 第一次操作後總 XOR 為 k xor x；Alice 能留下零 XOR 當且僅當可令 x=k。
  - 因 x<a_i，壞方案恰是 k>=a_i；用前後綴子集 XOR DP 計數。
solution_outline: 建立 pref[i][x] 與 suff[i][x]，表示相應範圍選任意子集的 XOR 分布。固定 i 後合併左右分布，累加 XOR 至少 a_i 的方案。
proof_or_invariant: 普通 Nim 中走到零 XOR 會把必敗態交給對手。固定其他堆 XOR=k，操作指定堆後留下 x，總 XOR 為 k xor x；唯一能使其為零的是 x=k。合法 x 範圍是 [0,a_i-1]，故 Alice 無法做到恰等價於 k>=a_i。DP 枚舉每個其他堆選或不選，完整且不重複。
common_errors: [將條件誤寫為 k xor a_i 大小比較, 忘記空的其他子集也在 XOR DP 中, 合併左右時未取模]
complexity: { time: 'O(n A^2)', space: 'O(n A)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n; cin >> n; /* TODO: 前後綴 XOR 子集 DP。 */ return 0; }
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      constexpr int states = 256;
      constexpr int mod_value = 1000000007;
      int n;
      cin >> n;
      vector<int> stones(static_cast<size_t>(n));
      for (int &value : stones) cin >> value;
      using Row = array<int, states>;
      vector<Row> prefix(static_cast<size_t>(n) + 1U);
      vector<Row> suffix(static_cast<size_t>(n) + 1U);
      prefix[0][0] = 1;
      for (int i = 0; i < n; ++i) {
          for (int x = 0; x < states; ++x) {
              prefix[static_cast<size_t>(i + 1)][static_cast<size_t>(x)] =
                  (prefix[static_cast<size_t>(i)][static_cast<size_t>(x)] +
                   prefix[static_cast<size_t>(i)][static_cast<size_t>(x ^ stones[static_cast<size_t>(i)])]) %
                  mod_value;
          }
      }
      suffix[static_cast<size_t>(n)][0] = 1;
      for (int i = n - 1; i >= 0; --i) {
          for (int x = 0; x < states; ++x) {
              suffix[static_cast<size_t>(i)][static_cast<size_t>(x)] =
                  (suffix[static_cast<size_t>(i + 1)][static_cast<size_t>(x)] +
                   suffix[static_cast<size_t>(i + 1)][static_cast<size_t>(x ^ stones[static_cast<size_t>(i)])]) %
                  mod_value;
          }
      }
      long long answer = 0;
      for (int i = 0; i < n; ++i) {
          for (int left_xor = 0; left_xor < states; ++left_xor) {
              for (int right_xor = 0; right_xor < states; ++right_xor) {
                  if ((left_xor ^ right_xor) >= stones[static_cast<size_t>(i)]) {
                      answer += static_cast<long long>(
                                    prefix[static_cast<size_t>(i)][static_cast<size_t>(left_xor)]) *
                                suffix[static_cast<size_t>(i + 1)][static_cast<size_t>(right_xor)] %
                                mod_value;
                  }
              }
          }
          answer %= mod_value;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5675
external_platform: 洛谷
external_problem_id: P5675
external_title: '[GZOI2017] 取石子遊戲'
external_relation: original
source_book_pages: [511, 515]
source_pdf_pages: [141, 145]
review_status: verified
---

固定首步限制後，Nim 的策略條件會變成可由子集 XOR DP 計數的大小判斷。
