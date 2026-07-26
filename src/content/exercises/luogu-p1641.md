---
id: luogu-p1641
volume: lower
source_file: lower-volume
title: 洛谷 P1641 前綴一不少於零的字串
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 3
topics: [ballot-theorem, reflection-principle, combination]
prerequisites: [catalan-stirling, modular-inverse]
statement: 使用恰好 n 個字元 1 與 m 個字元 0 組成字串，要求每個前綴中的 1 數量都不少於 0，計算方案數模 20100403。
constraints:
  - 1 <= m <= n <= 1000000
input_format: 一行兩個整數 n、m。
output_format: 輸出合法字串數模 20100403。
samples:
  - input: '2 2'
    output: '2'
    explanation: 合法字串是 1100 與 1010。
core_knowledge:
  - 全部字串數為 C(n+m,m)
  - 反射原理把首次跌破零的壞路徑雙射到 C(n+m,m-1)
judgment: 條件包含所有前綴；空前綴及完整字串也須滿足，但在 n>=m 下自然成立。
hints:
  - 把 1 看成向上、0 看成向下，要求路徑從不低於高度 0。
  - 不限制前綴時，只要選出 m 個 0 的位置，共 C(n+m,m)。
  - 將壞路徑到首次 -1 的前綴反射，壞方案數是 C(n+m,m-1)。
solution_outline: 預處理到 n+m 的階乘與逆階乘，輸出 C(n+m,m)-C(n+m,m-1) 的非負模值。
proof_or_invariant: >-
  每個壞字串都有唯一首次到達 -1 的位置。交換此前的 0、1，得到含 n+1 個 1、
  m-1 個 0 的任意字串；反向操作由其首次到達 +1 唯一還原，故為雙射。
  從全部字串扣除此集合即是所有不跌破零的字串。
common_errors:
  - 壞方案數寫成 C(n+m,m+1)
  - 模減後未加模數導致負值
  - 模數不是常見的 1000000007
complexity:
  time: O(n+m)
  space: O(n+m)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      int one_count, zero_count;
      cin >> one_count >> zero_count;
      // TODO：用反射原理的兩個組合數之差。
      return 0;
  }
cpp_solution: |
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;

  static constexpr int64_t mod_value = 20100403;
  static int64_t power_mod(int64_t base, int64_t exponent) {
      int64_t result = 1;
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
      int one_count, zero_count;
      cin >> one_count >> zero_count;
      const int total = one_count + zero_count;
      vector<int64_t> factorial(static_cast<size_t>(total) + 1U, 1);
      vector<int64_t> inverse_factorial(static_cast<size_t>(total) + 1U, 1);
      for (int i = 1; i <= total; ++i) {
          factorial[static_cast<size_t>(i)] = factorial[static_cast<size_t>(i - 1)] * i % mod_value;
      }
      inverse_factorial.back() = power_mod(factorial.back(), mod_value - 2);
      for (int i = total; i >= 1; --i) {
          inverse_factorial[static_cast<size_t>(i - 1)] =
              inverse_factorial[static_cast<size_t>(i)] * i % mod_value;
      }
      const auto combination = [&](int top, int bottom) {
          if (bottom < 0 || bottom > top) { return int64_t{0}; }
          return factorial[static_cast<size_t>(top)] * inverse_factorial[static_cast<size_t>(bottom)] %
                 mod_value * inverse_factorial[static_cast<size_t>(top - bottom)] % mod_value;
      };
      cout << (combination(total, zero_count) - combination(total, zero_count - 1) + mod_value) %
                  mod_value
           << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1641
external_platform: 洛谷
external_problem_id: P1641
external_title: '[SCOI2010] 生成字串'
external_relation: original
source_book_pages: [486, 491]
source_pdf_pages: [116, 121]
review_status: verified
---

反射原理把「某處第一次違規」整批映到一個無限制組合數，省去百萬長度的 DP。
