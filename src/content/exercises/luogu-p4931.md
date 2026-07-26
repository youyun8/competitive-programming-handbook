---
id: luogu-p4931
volume: lower
source_file: lower-volume
title: 洛谷 P4931 恰好同排的情侶計數
chapter: 7
section: '7.1'
kind: external-oj
difficulty: 4
topics: [combinatorics, derangement, recurrence]
prerequisites: [combinatorics-basics, modular-inverse]
statement: >-
  n 對彼此可區分的情侶坐滿 n 排、每排兩個有左右之分的座位。對每組 n、k，
  計算恰好 k 對情侶同排的座位安排數，答案模 998244353。
constraints:
  - 1 <= T <= 200000
  - 1 <= n <= 5000000
  - 0 <= k <= n
input_format: 第一行為 T；接下來 T 行各有 n、k。
output_format: 每組輸出一行恰有 k 對情侶同排的方案數模 998244353。
samples:
  - input: |
      1
      2 2
    output: '8'
    explanation: 兩對分配到兩排有 2! 種，每對左右交換各有 2 種，共 2!*2^2=8。
core_knowledge:
  - 先選出和睦情侶及座位排，再處理其餘完全不同排的廣義錯排
  - 無同排方案數可用類似錯排的二階遞推線性預處理
judgment: 每個人以及每個座位都可區分；交換同排兩人的左右位置會形成不同方案。
hints:
  - 指定 k 對同排：選情侶、選排、建立配對並決定左右，係數為 C(n,k)^2 k! 2^k。
  - 設 bad[i] 為 i 對情侶坐 i 排且沒有任何一對同排的方案數，bad[0]=1、bad[1]=0。
  - 固定第一排的兩位非情侶，可推出 bad[i]=4i(i-1)(bad[i-1]+2(i-1)bad[i-2])。
solution_outline: >-
  讀完詢問取得最大 n，線性預處理階乘、逆階乘與 bad。每組計算
  C(n,k)^2·k!·2^k·bad[n-k] 模質數。
proof_or_invariant: >-
  k 對和睦情侶與所占排的選擇、雙射及左右順序彼此獨立。刪除它們後，剩餘部分必須完全不同排。
  對 bad[i] 固定第一排的有序兩人，共 4i(i-1) 種；其伴侶若同排可刪去兩對並有
  2(i-1) 種安置，否則把兩位伴侶視作新限制後縮成 bad[i-1]。兩情形互斥且完整。
common_errors:
  - 只選 k 對情侶，漏掉選座位排、排間配對或左右次序
  - 將剩餘人任意排列，未排除額外同排情侶
  - 以 long long 陣列存四張大表造成不必要的記憶體壓力
complexity:
  time: O(max(n) + T log max(k))
  space: O(max(n) + T)
cpp_skeleton: |
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;

  static constexpr long long mod_value = 998244353;
  static long long power_mod(long long base, int exponent) {
      long long result = 1;
      while (exponent > 0) {
          if ((exponent & 1) != 0) { result = result * base % mod_value; }
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }

  int main() {
      int tests;
      cin >> tests;
      vector<pair<int, int>> queries(static_cast<size_t>(tests));
      // TODO：讀取後預處理階乘、逆階乘與完全不同排方案，再回答詢問。
      (void)power_mod;
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;

  static constexpr long long mod_value = 998244353;
  static long long power_mod(long long base, int exponent) {
      long long result = 1;
      while (exponent > 0) {
          if ((exponent & 1) != 0) { result = result * base % mod_value; }
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests;
      cin >> tests;
      vector<pair<int, int>> queries(static_cast<size_t>(tests));
      int limit = 0;
      for (auto& [n, k] : queries) {
          cin >> n >> k;
          limit = max(limit, n);
      }
      vector<int> factorial(static_cast<size_t>(limit) + 1U, 1);
      vector<int> inverse_factorial(static_cast<size_t>(limit) + 1U, 1);
      vector<int> no_pair(static_cast<size_t>(limit) + 1U);
      no_pair[0] = 1;
      for (int i = 1; i <= limit; ++i) {
          factorial[static_cast<size_t>(i)] =
              static_cast<int>(static_cast<long long>(factorial[static_cast<size_t>(i - 1)]) * i % mod_value);
      }
      inverse_factorial[static_cast<size_t>(limit)] =
          static_cast<int>(power_mod(factorial[static_cast<size_t>(limit)], static_cast<int>(mod_value - 2)));
      for (int i = limit; i >= 1; --i) {
          inverse_factorial[static_cast<size_t>(i - 1)] =
              static_cast<int>(static_cast<long long>(inverse_factorial[static_cast<size_t>(i)]) * i % mod_value);
      }
      for (int i = 2; i <= limit; ++i) {
          const long long inside =
              (no_pair[static_cast<size_t>(i - 1)] +
               2LL * (i - 1) * no_pair[static_cast<size_t>(i - 2)]) %
              mod_value;
          no_pair[static_cast<size_t>(i)] =
              static_cast<int>(4LL * i % mod_value * (i - 1) % mod_value * inside % mod_value);
      }
      const auto combination = [&](int n, int k) {
          return static_cast<long long>(factorial[static_cast<size_t>(n)]) *
                 inverse_factorial[static_cast<size_t>(k)] % mod_value *
                 inverse_factorial[static_cast<size_t>(n - k)] % mod_value;
      };
      for (const auto& [n, k] : queries) {
          const long long choose = combination(n, k);
          long long answer = choose * choose % mod_value;
          answer = answer * factorial[static_cast<size_t>(k)] % mod_value;
          answer = answer * power_mod(2, k) % mod_value;
          answer = answer * no_pair[static_cast<size_t>(n - k)] % mod_value;
          cout << answer << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4931
external_platform: 洛谷
external_problem_id: P4931
external_title: '[MtOI2018] 情侶？給我燒了！（加強版）'
external_relation: original
source_book_pages: [463, 467]
source_pdf_pages: [93, 97]
review_status: verified
---

「恰好 k 對」先抽出指定成功部分，剩餘部分便是可線性遞推的廣義錯排。
