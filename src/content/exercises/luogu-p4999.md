---
id: luogu-p4999
volume: upper
source_file: upper-volume
title: 洛谷 P4999 煩人的數學作業
chapter: 5
section: '5.3'
kind: external-oj
difficulty: 3
topics: [digit-dp, prefix-sum]
prerequisites: [dynamic-programming]
statement: 對每組閉區間 [L,R]，求其中所有整數的十進位數字和總和，答案模 1000000007。
constraints:
  - 1 <= T <= 20
  - 1 <= L <= R <= 1000000000000000000
input_format: 第一行為 T；接著 T 行各給 L、R。
output_format: 每組輸出一行區間內所有數字和的總和模 1000000007。
samples:
  - input: |-
      1
      1 10
    output: '46'
    explanation: 1 到 9 的數字和合計 45，10 的數字和為 1，所以答案是 46。
core_knowledge: [數位 DP, 方案數與貢獻和, 區間前綴差]
judgment: 每個整數的數字和是其十進位各位相加；最後總和才對模數取餘。
hints:
  - 先求 F(x)，表示 0..x 所有數字和的總和，再計算 F(R)-F(L-1)。
  - 掃描上界數位時，同時維護每個前綴狀態的方案數 count 與數字和總貢獻 sum。
  - 新放數字 d 時，新貢獻為舊 sum 加上 count*d；只需區分 tight 狀態。
solution_outline: 以數位 DP 回傳指定後綴的方案數與數字和總貢獻，兩個前綴答案相減並正規化模數。
proof_or_invariant: >-
  對任一前綴狀態，count 是合法補完數量，sum 是所有補完數字之數字和總和。枚舉當前位 d 後，
  每個補完的數字和都比後綴多 d，因此該分支貢獻為 child.sum+d*child.count。各 d 分支互斥且
  涵蓋所有不超過上界的數，歸納得到 F(x)；前綴差恰留下 [L,R]。
common_errors: [只統計方案數而未累加位數貢獻, L=1 時未處理 F(0), 相減後得到負餘數]
complexity:
  time: O(T * 10 * log R)
  space: O(log R)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int tests = 0; cin >> tests;
      while (tests-- > 0) { long long l = 0, r = 0; cin >> l >> r; cout << l - l + r - r << '\n'; }
  }
cpp_solution: |
  #include <array>
  #include <functional>
  #include <iostream>
  #include <string>
  using namespace std;
  static constexpr long long mod = 1000000007;
  static long long prefix(long long x) {
      if (x < 0) return 0;
      const string digits = to_string(x);
      array<array<pair<long long, long long>, 2>, 20> memo{};
      array<array<bool, 2>, 20> known{};
      function<pair<long long, long long>(size_t, bool)> dfs =
          [&](size_t position, bool tight) -> pair<long long, long long> {
          if (position == digits.size()) return {1, 0};
          if (!tight && known[position][0]) return memo[position][0];
          const int limit = tight ? digits[position] - '0' : 9;
          long long count = 0, sum = 0;
          for (int digit = 0; digit <= limit; ++digit) {
              const auto child = dfs(position + 1, tight && digit == limit);
              count = (count + child.first) % mod;
              sum = (sum + child.second + child.first * digit) % mod;
          }
          if (!tight) { known[position][0] = true; memo[position][0] = {count, sum}; }
          return {count, sum};
      };
      return dfs(0, true).second;
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int tests = 0; cin >> tests;
      while (tests-- > 0) {
          long long left = 0, right = 0; cin >> left >> right;
          cout << (prefix(right) - prefix(left - 1) + mod) % mod << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P4999
external_platform: 洛谷
external_problem_id: P4999
external_title: 烦人的数学作业
external_relation: original
source_book_pages: [340]
source_pdf_pages: [358]
review_status: verified
---

數位 DP 除了計數，也能在每個狀態同步累加所有方案的數字和貢獻。
