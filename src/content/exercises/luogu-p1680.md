---
id: luogu-p1680
volume: lower
source_file: lower-volume
title: 洛谷 P1680 有下限的分組人數
chapter: 7
section: '7.4'
kind: external-oj
difficulty: 2
topics: [stars-and-bars, combination, modular-arithmetic]
prerequisites: [combinatorics-basics, modular-inverse]
statement: >-
  把 N 個人數分配到 M 個有編號的組，只區分各組人數；第 i 組人數必須嚴格大於 C_i。
  求不同人數向量的數量，答案模 1000000007。
constraints:
  - 1 <= N,M <= 1000000
  - 1 <= C_i <= 1000
  - 輸入保證至少有一種方案
input_format: 第一行為 N、M；接著 M 行依序給出 C_i。
output_format: 輸出合法分組人數向量數量模 1000000007。
samples:
  - input: |
      10 3
      1
      2
      3
    output: '3'
    explanation: 最低人數為 (2,3,4)，剩下一人可加入任一組，故有三種。
core_knowledge:
  - 先扣掉每組的嚴格下限可轉成非負整數和
  - 隔板法計算 M 個非負變數固定總和
judgment: 人本身不具區別，只比較每個有編號組的人數。
hints:
  - 令 x_i 為第 i 組人數，先寫成 x_i=C_i+1+z_i。
  - 所有 z_i 都非負，且總和 rem=N-Σ(C_i+1)。
  - M 個非負整數和為 rem 的方案數是 C(rem+M-1,M-1)。
solution_outline: 求 rem，預處理到 rem+M-1 的階乘，以質數模逆元計算組合數。
proof_or_invariant: >-
  x_i 與 z_i=x_i-C_i-1 形成合法人數向量和總和為 rem 的非負整數向量之雙射。
  排列 rem 顆相同星星與 M-1 根隔板又與這些向量一一對應，故公式正確。
common_errors:
  - 題目要求嚴格大於 C_i，卻只扣掉 C_i
  - 把人視為可區分而多乘排列數
  - 階乘未預處理到組合數上標 rem+M-1
complexity:
  time: O(N+M)
  space: O(N+M)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      int person_count, group_count;
      cin >> person_count >> group_count;
      long long remaining = person_count;
      for (int i = 0; i < group_count; ++i) {
          int lower_bound;
          cin >> lower_bound;
          remaining -= lower_bound + 1LL;
      }
      // TODO：計算 C(remaining+group_count-1, group_count-1)。
      (void)remaining;
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;

  static constexpr long long mod_value = 1000000007;
  static long long power_mod(long long base, long long exponent) {
      long long result = 1;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) { result = result * base % mod_value; }
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int person_count, group_count;
      cin >> person_count >> group_count;
      long long remaining = person_count;
      for (int i = 0; i < group_count; ++i) {
          int lower_bound;
          cin >> lower_bound;
          remaining -= lower_bound + 1LL;
      }
      const int top = static_cast<int>(remaining + group_count - 1);
      vector<long long> factorial(static_cast<size_t>(top) + 1U, 1);
      for (int i = 1; i <= top; ++i) {
          factorial[static_cast<size_t>(i)] = factorial[static_cast<size_t>(i - 1)] * i % mod_value;
      }
      const int bottom = group_count - 1;
      const long long denominator =
          factorial[static_cast<size_t>(bottom)] * factorial[static_cast<size_t>(top - bottom)] % mod_value;
      cout << factorial[static_cast<size_t>(top)] * power_mod(denominator, mod_value - 2) % mod_value << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1680
external_platform: 洛谷
external_problem_id: P1680
external_title: 奇怪的分組
external_relation: original
source_book_pages: [477, 480]
source_pdf_pages: [107, 110]
review_status: verified
---

平移掉每組下限後，題目便只剩標準隔板法。
