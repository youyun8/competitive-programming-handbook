---
id: luogu-p4448
volume: lower
source_file: lower-volume
title: 洛谷 P4448 避免相鄰乘積為平方數
chapter: 7
section: '7.5'
kind: external-oj
difficulty: 4
topics: [inclusion-exclusion, squarefree-kernel, knapsack-dp]
prerequisites: [inclusion-exclusion, prime-factorization]
statement: >-
  n 顆有獨立編號的球各有正整數特徵 a_i。計算所有排列中，相鄰兩球特徵乘積都不是完全平方數的排列數，
  答案模 1000000007。
constraints:
  - 1 <= n <= 300
  - 特徵值為正整數
input_format: 第一行 n；第二行 n 個特徵值 a_i。
output_format: 輸出合法排列數模 1000000007。
samples:
  - input: |
      4
      2 2 3 4
    output: '12'
    explanation: 兩顆特徵為 2 的球相鄰時乘積為 4；從 24 個排列扣除它們相鄰的 12 個，剩 12 個。
core_knowledge:
  - 兩數乘積為平方數恰若它們的平方自由核相同
  - 對同組內被指定相鄰的邊做容斥，可把黏合後區塊當成排列元素
judgment: 球有不同編號，即使特徵值相同，交換兩球仍是不同排列。
hints:
  - 刪除每個質因數的偶數次冪後，以平方自由核將球分組。
  - 大小 s 的組指定 j 個相鄰關係，其選法權重為 C(s-1,j)·s!/(s-j)!。
  - 用背包合併各組的 j；總共指定 j 條相鄰邊後剩 n-j 個區塊，乘 (n-j)! 並交替加減。
solution_outline: 計算各平方自由核的組大小；預處理階乘與組合數，背包合併每組可能指定的相鄰邊數，最後容斥。
proof_or_invariant: >-
  同核關係具傳遞性，故禁邊只存在於各完全圖組內。對一組指定 j 條形成路徑森林的相鄰關係，
  隔板位置有 C(s-1,j) 種，組內有序排列帶來 s!/(s-j)! 的黏合權重。
  合併所有組後，j 條黏合使全體剩 n-j 個可排列區塊；容斥使每個實際壞相鄰對的總係數為零。
common_errors:
  - 判斷 a_i+a_j 是否為平方；題目條件是乘積
  - 把同特徵球視為不可區分
  - 只按原值分組，未將 2 與 8 這類同平方自由核數歸在一起
complexity:
  time: O(n sqrt(max(a_i)) + n^2)
  space: O(n)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      // TODO：依平方自由核分組，背包計算容斥係數。
      (void)n;
      return 0;
  }
cpp_solution: |
  #include <cstdint>
  #include <iostream>
  #include <map>
  #include <vector>
  using namespace std;

  static constexpr int64_t mod_value = 1000000007;
  static int64_t power_mod(int64_t base, int64_t exponent) {
      int64_t result = 1;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) { result = result * base % mod_value; }
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }
  static int64_t squarefree_kernel(int64_t value) {
      int64_t kernel = 1;
      for (int64_t prime = 2; prime <= value / prime; ++prime) {
          bool odd = false;
          while (value % prime == 0) {
              value /= prime;
              odd = !odd;
          }
          if (odd) { kernel *= prime; }
      }
      if (value > 1) { kernel *= value; }
      return kernel;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      map<int64_t, int> frequency;
      for (int i = 0; i < n; ++i) {
          int64_t value;
          cin >> value;
          ++frequency[squarefree_kernel(value)];
      }
      vector<int64_t> factorial(static_cast<size_t>(n) + 1U, 1);
      vector<int64_t> inverse_factorial(static_cast<size_t>(n) + 1U, 1);
      for (int i = 1; i <= n; ++i) {
          factorial[static_cast<size_t>(i)] = factorial[static_cast<size_t>(i - 1)] * i % mod_value;
      }
      inverse_factorial[static_cast<size_t>(n)] = power_mod(factorial[static_cast<size_t>(n)], mod_value - 2);
      for (int i = n; i >= 1; --i) {
          inverse_factorial[static_cast<size_t>(i - 1)] =
              inverse_factorial[static_cast<size_t>(i)] * i % mod_value;
      }
      const auto combination = [&](int top, int bottom) {
          return factorial[static_cast<size_t>(top)] * inverse_factorial[static_cast<size_t>(bottom)] %
                 mod_value * inverse_factorial[static_cast<size_t>(top - bottom)] % mod_value;
      };
      vector<int64_t> dp(static_cast<size_t>(n));
      dp[0] = 1;
      int processed = 0;
      for (const auto& [kernel, size] : frequency) {
          (void)kernel;
          vector<int64_t> next(static_cast<size_t>(n));
          for (int used = 0; used <= processed; ++used) {
              for (int added = 0; added < size; ++added) {
                  const int64_t group_ways =
                      combination(size - 1, added) * factorial[static_cast<size_t>(size)] % mod_value *
                      inverse_factorial[static_cast<size_t>(size - added)] % mod_value;
                  next[static_cast<size_t>(used + added)] =
                      (next[static_cast<size_t>(used + added)] +
                       dp[static_cast<size_t>(used)] * group_ways) %
                      mod_value;
              }
          }
          processed += size - 1;
          dp.swap(next);
      }
      int64_t answer = 0;
      for (int edges = 0; edges < n; ++edges) {
          const int64_t term = dp[static_cast<size_t>(edges)] * factorial[static_cast<size_t>(n - edges)] %
                               mod_value;
          answer = (edges & 1) != 0 ? (answer - term + mod_value) % mod_value
                                    : (answer + term) % mod_value;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4448
external_platform: 洛谷
external_problem_id: P4448
external_title: '[AHOI2018 初中組] 球球的排列'
external_relation: original
source_book_pages: [481, 485]
source_pdf_pages: [111, 115]
review_status: verified
---

平方自由核把看似任意的禁鄰接圖化成互不相交的完全圖，之後便能逐組容斥。
