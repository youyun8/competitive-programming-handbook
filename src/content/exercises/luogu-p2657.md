---
id: luogu-p2657
volume: upper
source_file: upper-volume
title: 洛谷 P2657 windy 數
chapter: 5
section: '5.3'
kind: external-oj
difficulty: 3
topics: [digit-dp, memoization]
prerequisites: [dynamic-programming]
statement: 若一個不含前導零的正整數中任意相鄰兩位數字之差的絕對值至少為 2，稱為 windy 數。求 [a,b] 中 windy 數個數。
constraints:
  - 1 <= a <= b <= 2000000000
input_format: 一行兩個整數 a、b。
output_format: 輸出閉區間內 windy 數的數量。
samples:
  - input: '1 10'
    output: '9'
    explanation: 一位數 1..9 全部合法；10 的相鄰位差只有 1，因此答案為 9。
core_knowledge: [數位 DP, 前導零狀態, 上界限制]
judgment: 一位正整數必為 windy 數；尚未開始的前導零不與後續第一位比較。
hints:
  - 先計算 1..x 的合法數量，再用兩個前綴相減。
  - 狀態記目前位、上一個有效數字，以及是否仍受上界限制；未開始可用特殊 prev 表示。
  - 非受限狀態可記憶化；放入有效數字時檢查與 prev 的差是否至少為 2。
solution_outline: 將上界拆成數位，DFS 枚舉每位；用 prev=10 表示尚未出現非零位，記憶化所有非 tight 狀態。
proof_or_invariant: >-
  DFS 狀態精確描述已選前綴：tight 決定本位上限，prev 保存最後有效位或未開始。每個候選數字若
  為前導零便保持未開始，否則僅在第一位或與 prev 差至少 2 時轉移。因此每個不超過 x 的正整數
  對應唯一一條路徑，且路徑被接受當且僅當所有相鄰位合法。前綴差遂給出閉區間答案。
common_errors: [把前導零拿去做相鄰差比較, 把數字零計入正整數答案, 在 tight 狀態誤用快取]
complexity:
  time: O(log b * 11 * 10)
  space: O(log b * 11)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  static long long count_to(long long x) {
      (void)x;
      // TODO：數位 DP 記錄上一個有效數字。
      return 0;
  }
  int main() {
      long long a = 0, b = 0; cin >> a >> b;
      cout << count_to(b) - count_to(a - 1) << '\n';
  }
cpp_solution: |
  #include <array>
  #include <cstdlib>
  #include <functional>
  #include <iostream>
  #include <string>
  using namespace std;
  static long long count_to(long long x) {
      if (x <= 0) return 0;
      const string digits = to_string(x);
      array<array<long long, 11>, 20> memo{};
      array<array<bool, 11>, 20> known{};
      function<long long(size_t, int, bool)> dfs = [&](size_t position, int previous, bool tight) {
          if (position == digits.size()) return previous == 10 ? 0LL : 1LL;
          if (!tight && known[position][static_cast<size_t>(previous)])
              return memo[position][static_cast<size_t>(previous)];
          const int limit = tight ? digits[position] - '0' : 9;
          long long ways = 0;
          for (int digit = 0; digit <= limit; ++digit) {
              const bool next_tight = tight && digit == limit;
              if (previous == 10 && digit == 0) ways += dfs(position + 1, 10, next_tight);
              else if (previous == 10 || abs(previous - digit) >= 2)
                  ways += dfs(position + 1, digit, next_tight);
          }
          if (!tight) {
              known[position][static_cast<size_t>(previous)] = true;
              memo[position][static_cast<size_t>(previous)] = ways;
          }
          return ways;
      };
      return dfs(0, 10, true);
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      long long a = 0, b = 0; cin >> a >> b;
      cout << count_to(b) - count_to(a - 1) << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2657
external_platform: 洛谷
external_problem_id: P2657
external_title: windy 数
external_relation: original
source_book_pages: [334]
source_pdf_pages: [352]
review_status: verified
---

前導零不是數字的一部分；用特殊上一位狀態即可讓第一個有效數字不受差值限制。
