---
id: luogu-p2167
volume: upper
source_file: upper-volume
title: 洛谷 P2167 Bill 的挑戰
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 4
topics: [inclusion-exclusion, state-compression]
prerequisites: [binomial-coefficient, bitmask]
statement: 給 n 個等長樣式串，字元為小寫字母或萬用字元 `?`。求有多少個純小寫字串恰好與其中 k 個樣式串匹配，答案模 1,000,003。
constraints:
  - 1 <= T <= 5
  - 1 <= n <= 15
  - 1 <= 字串長度 <= 50
input_format: 第一行 T；每組第一行 n、k，接著 n 行等長樣式串。
output_format: 每組輸出一行方案數模 1,000,003。
samples:
  - input: |-
      5
      3 3
      ???r???
      ???????
      ???????
      3 4
      ???????
      ?????a?
      ???????
      3 3
      ???????
      ?a??j??
      ????aa?
      3 2
      a??????
      ???????
      ???????
      3 2
      ???????
      ???a???
      ????a??
    output: |-
      914852
      0
      0
      871234
      67018
    explanation: 各組以容斥把「至少匹配指定集合」轉為「恰好匹配 k 個」；第二組 k>n，故為零。
core_knowledge: [子集合共同匹配數, 二項反演]
judgment: '`?` 可匹配任意一個小寫字母；要求恰好 k 個而非至少 k 個。'
hints:
  - 對樣式集合 S，先算同時匹配 S 全部樣式的字串數 common[S]。
  - 每一位置若固定字母衝突則 common 為零；全是 `?` 則該位有 26 種，否則只有一種。
  - 恰好 k 個的答案為 Σ_{|S|≥k}(-1)^{|S|-k}C(|S|,k)common[S]。
solution_outline: 枚舉所有非空子集合計算共同匹配方案，再用二項容斥反演取得恰好 k 個。
proof_or_invariant: 任一答案字串若總共匹配 t 個樣式，會在公式中被每個大小 s 的匹配子集合計入 C(t,s)C(s,k)(-1)^(s-k) 次；二項恆等式使總係數在 t=k 時為一、t>k 時為零。common[S] 逐位置獨立相乘，且固定字母衝突時確實無共同字串，故公式正確。
common_errors: [把至少k直接當答案, 忽略固定字母衝突, 負數取模後未正規化]
complexity:
  time: O(2^n * n * length)
  space: O(2^n + n^2)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int tests = 0; cin >> tests; while (tests--) { int n = 0, k = 0; cin >> n >> k; /* TODO */ } }
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      constexpr int mod = 1000003;
      array<array<int, 16>, 16> choose{};
      for (int i = 0; i <= 15; ++i) {
          choose[static_cast<size_t>(i)][0] = choose[static_cast<size_t>(i)][static_cast<size_t>(i)] = 1;
          for (int j = 1; j < i; ++j)
              choose[static_cast<size_t>(i)][static_cast<size_t>(j)] =
                  choose[static_cast<size_t>(i - 1)][static_cast<size_t>(j - 1)] +
                  choose[static_cast<size_t>(i - 1)][static_cast<size_t>(j)];
      }
      int tests = 0; cin >> tests;
      while (tests--) {
          int n = 0, k = 0; cin >> n >> k;
          vector<string> pattern(static_cast<size_t>(n));
          for (string& text : pattern) cin >> text;
          if (k > n) { cout << 0 << '\n'; continue; }
          const int length = static_cast<int>(pattern[0].size());
          long long answer = 0;
          for (int mask = 1; mask < (1 << n); ++mask) {
              const int selected = __builtin_popcount(static_cast<unsigned int>(mask));
              if (selected < k) continue;
              long long common = 1;
              for (int position = 0; position < length && common != 0; ++position) {
                  char fixed = '?';
                  for (int i = 0; i < n; ++i)
                      if ((mask & (1 << i)) != 0 && pattern[static_cast<size_t>(i)][static_cast<size_t>(position)] != '?') {
                          const char letter = pattern[static_cast<size_t>(i)][static_cast<size_t>(position)];
                          if (fixed != '?' && fixed != letter) { common = 0; break; }
                          fixed = letter;
                      }
                  if (common != 0 && fixed == '?') common = common * 26 % mod;
              }
              const long long term = common * choose[static_cast<size_t>(selected)][static_cast<size_t>(k)] % mod;
              if ((selected - k) % 2 == 0) answer += term;
              else answer -= term;
          }
          answer %= mod;
          if (answer < 0) answer += mod;
          cout << answer << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P2167
external_platform: 洛谷
external_problem_id: P2167
external_title: Bill的挑战
external_relation: original
source_book_pages: [359]
source_pdf_pages: [377]
review_status: verified
---

先計算共同匹配集合，再以二項反演精確篩出「恰好」匹配數。
