---
id: luogu-p2675
volume: lower
source_file: lower-volume
title: 洛谷 P2675 最大化倒三角底值
chapter: 7
section: '7.4'
kind: external-oj
difficulty: 3
topics: [rearrangement-inequality, binomial-coefficient, lucas-theorem]
prerequisites: [binomial-theorem, lucas-theorem]
statement: >-
  將 1 到 n 的排列放在倒三角頂列，之後每格等於左上與右上之和。求最底端單一數字可達到的最大值，
  並輸出其模 10007 的結果。
constraints:
  - 1 <= n <= 1000000
input_format: 一個整數 n。
output_format: 最大底值模 10007。
samples:
  - input: '4'
    output: '24'
    explanation: 頂列排成 1,3,4,2 時，底值為 1+3*3+3*4+2=24，且已達最大。
core_knowledge:
  - 頂列第 i 格對底值的權重是 C(n-1,i-1)
  - 重排不等式要求較大的數配較大的權重
judgment: 必須先最大化真正的整數底值，再對 10007 取模，不能依模後權重排序。
hints:
  - 展開逐層相加，頂列權重形成 Pascal 三角形第 n-1 列。
  - 二項式係數由兩端向中央不減，因此依 1,n,2,n-1,... 的位置次序放入 1,2,3,4,...。
  - 權重模 10007 可用 Lucas 定理求出，再累加各位置所放數字乘權重。
solution_outline: 預處理 0..10006 的階乘與逆階乘；逐位置用 Lucas 求 C(n-1,i)，並依離中心由遠到近分配遞增數字。
proof_or_invariant: >-
  線性展開給出底值 Σa_i C(n-1,i-1)。第 n-1 列權重對稱且往中央遞增。
  若較大數配到較小權重，交換兩數使總值增加 (large-small)(large_weight-small_weight)>=0，
  故重排後的配置最優。Lucas 只在最後計算此最優值的模數，不影響排序。
common_errors:
  - 使用模 10007 後的權重決定排列
  - n 為奇偶時重複或漏掉中央位置
  - 把權重寫成 C(n,i) 而非 C(n-1,i)
complexity:
  time: O(10007 + n log_10007 n)
  space: O(10007)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      // TODO：以真實二項式權重的大小順序配對 1..n，再用 Lucas 計算模值。
      (void)n;
      return 0;
  }
cpp_solution: |
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;

  static constexpr int mod_value = 10007;
  static vector<int> factorial;
  static vector<int> inverse_factorial;
  static int power_mod(int base, int exponent) {
      int64_t result = 1;
      int64_t current = base;
      while (exponent > 0) {
          if ((exponent & 1) != 0) { result = result * current % mod_value; }
          current = current * current % mod_value;
          exponent >>= 1;
      }
      return static_cast<int>(result);
  }
  static int small_combination(int n, int k) {
      if (k > n) { return 0; }
      return static_cast<int>(static_cast<int64_t>(factorial[static_cast<size_t>(n)]) *
                              inverse_factorial[static_cast<size_t>(k)] % mod_value *
                              inverse_factorial[static_cast<size_t>(n - k)] % mod_value);
  }
  static int lucas(int n, int k) {
      int64_t result = 1;
      while (n > 0 || k > 0) {
          result = result * small_combination(n % mod_value, k % mod_value) % mod_value;
          n /= mod_value;
          k /= mod_value;
      }
      return static_cast<int>(result);
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      factorial.assign(mod_value, 1);
      inverse_factorial.assign(mod_value, 1);
      for (int i = 1; i < mod_value; ++i) {
          factorial[static_cast<size_t>(i)] =
              static_cast<int>(static_cast<int64_t>(factorial[static_cast<size_t>(i - 1)]) * i % mod_value);
      }
      inverse_factorial.back() = power_mod(factorial.back(), mod_value - 2);
      for (int i = mod_value - 1; i >= 1; --i) {
          inverse_factorial[static_cast<size_t>(i - 1)] =
              static_cast<int>(static_cast<int64_t>(inverse_factorial[static_cast<size_t>(i)]) * i % mod_value);
      }
      int64_t answer = 0;
      int value = 1;
      for (int offset = 0; offset < n / 2; ++offset) {
          answer = (answer + static_cast<int64_t>(value++) * lucas(n - 1, offset)) % mod_value;
          answer = (answer + static_cast<int64_t>(value++) * lucas(n - 1, n - 1 - offset)) % mod_value;
      }
      if ((n & 1) != 0) {
          answer = (answer + static_cast<int64_t>(value) * lucas(n - 1, n / 2)) % mod_value;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2675
external_platform: 洛谷
external_problem_id: P2675
external_title: '《瞿葩的數字遊戲》T3-三角聖地'
external_relation: original
source_book_pages: [477, 480]
source_pdf_pages: [107, 110]
review_status: verified
---

最大值由重排不等式決定，Lucas 只負責在不改變最佳排列的前提下快速取模。
