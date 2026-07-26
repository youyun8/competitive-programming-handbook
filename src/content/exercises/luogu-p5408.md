---
id: luogu-p5408
volume: lower
source_file: lower-volume
title: 洛谷 P5408 第一類 Stirling 數整行
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 5
topics: [stirling-number, polynomial-shift, ntt, divide-and-conquer]
prerequisites: [catalan-stirling, ntt]
statement: 給 n，輸出無號第一類 Stirling 數 c(n,0)..c(n,n)。c(n,k) 是把 n 個不同元素組成 k 個非空圓排列的方案數，答案模 167772161。
constraints: [1 <= n < 262144]
input_format: 一行一個正整數 n。
output_format: 一行 n+1 個整數，依序輸出第一類 Stirling 數第 n 行。
samples:
  - input: '3'
    output: '0 2 3 1'
    explanation: 三元素組成一、二、三個圓排列的方案數為 2、3、1。
core_knowledge: [第一類 Stirling 生成多項式, 上升階乘, 多項式平移, NTT 倍增]
judgment: 整行係數正是 x(x+1)...(x+n-1)，可把問題化為快速建立上升階乘。
hints:
  - 記 F_n(x)=x 的 n 次上升階乘，則 F_(2r)(x)=F_r(x)F_r(x+r)。
  - 多項式平移 f(x+c) 可用階乘加權後的一次卷積完成。
  - n 為奇數時，在 F_(n-1) 後線性乘上 x+n-1。
solution_outline: 預處理階乘與逆階乘。沿 n 的奇偶遞迴：偶數先求一半，快速平移 r 後卷積；奇數先求 n-1，再 O(n) 乘一次式。平移以反轉的 a_i i! 與 c^j/j! 卷積。
proof_or_invariant: 第一類 Stirling 遞推等價於 F_n=(x+n-1)F_(n-1)，基底 F_0=1，因此 F_n 係數即答案。偶數拆式把 n 個連續一次因子分成前後各 r 個；平移卷積是二項式展開的重新索引，逐係數相等。遞迴每步保持所回傳多項式等於 F_n。
common_errors: [使用帶號第一類 Stirling 數, 平移卷積反轉索引錯誤, n=1 基底漏掉常數零, NTT 長度不足]
complexity: { time: 'O(n log n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n; cin >> n; /* TODO: 上升階乘倍增。 */ return 0; }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  constexpr int mod_value = 167772161;
  constexpr int primitive_root = 3;
  int power_mod(int base, int exponent) {
      long long result = 1;
      long long value = base;
      while (exponent > 0) {
          if ((exponent & 1) != 0) result = result * value % mod_value;
          value = value * value % mod_value;
          exponent >>= 1;
      }
      return static_cast<int>(result);
  }
  void ntt(vector<int> &values, bool inverse) {
      const int size = static_cast<int>(values.size());
      for (int i = 1, j = 0; i < size; ++i) {
          int bit = size >> 1;
          while ((j & bit) != 0) { j ^= bit; bit >>= 1; }
          j ^= bit;
          if (i < j) swap(values[static_cast<size_t>(i)], values[static_cast<size_t>(j)]);
      }
      for (int length = 2; length <= size; length <<= 1) {
          int root = power_mod(primitive_root, (mod_value - 1) / length);
          if (inverse) root = power_mod(root, mod_value - 2);
          for (int start = 0; start < size; start += length) {
              long long factor = 1;
              for (int offset = 0; offset < length / 2; ++offset) {
                  const int even = values[static_cast<size_t>(start + offset)];
                  const int odd = static_cast<int>(
                      factor * values[static_cast<size_t>(start + offset + length / 2)] % mod_value);
                  int low = even + odd;
                  if (low >= mod_value) low -= mod_value;
                  int high = even - odd;
                  if (high < 0) high += mod_value;
                  values[static_cast<size_t>(start + offset)] = low;
                  values[static_cast<size_t>(start + offset + length / 2)] = high;
                  factor = factor * root % mod_value;
              }
          }
      }
      if (inverse) {
          const int inverse_size = power_mod(size, mod_value - 2);
          for (int &value : values)
              value = static_cast<int>(static_cast<long long>(value) * inverse_size % mod_value);
      }
  }
  vector<int> multiply(vector<int> first, vector<int> second) {
      if (first.empty() || second.empty()) return {};
      const int result_size = static_cast<int>(first.size() + second.size() - 1U);
      int size = 1;
      while (size < result_size) size <<= 1;
      first.resize(static_cast<size_t>(size));
      second.resize(static_cast<size_t>(size));
      ntt(first, false);
      ntt(second, false);
      for (int i = 0; i < size; ++i)
          first[static_cast<size_t>(i)] = static_cast<int>(
              static_cast<long long>(first[static_cast<size_t>(i)]) *
              second[static_cast<size_t>(i)] % mod_value);
      ntt(first, true);
      first.resize(static_cast<size_t>(result_size));
      return first;
  }
  vector<int> factorial;
  vector<int> inverse_factorial;
  vector<int> shift_polynomial(const vector<int> &source, int shift) {
      const int degree = static_cast<int>(source.size()) - 1;
      vector<int> first(static_cast<size_t>(degree) + 1U);
      vector<int> second(static_cast<size_t>(degree) + 1U);
      long long shift_power = 1;
      for (int i = 0; i <= degree; ++i) {
          first[static_cast<size_t>(degree - i)] = static_cast<int>(
              static_cast<long long>(source[static_cast<size_t>(i)]) *
              factorial[static_cast<size_t>(i)] % mod_value);
          second[static_cast<size_t>(i)] = static_cast<int>(
              shift_power * inverse_factorial[static_cast<size_t>(i)] % mod_value);
          shift_power = shift_power * shift % mod_value;
      }
      const vector<int> product = multiply(first, second);
      vector<int> result(static_cast<size_t>(degree) + 1U);
      for (int i = 0; i <= degree; ++i)
          result[static_cast<size_t>(i)] = static_cast<int>(
              static_cast<long long>(product[static_cast<size_t>(degree - i)]) *
              inverse_factorial[static_cast<size_t>(i)] % mod_value);
      return result;
  }
  vector<int> rising_factorial(int n) {
      if (n == 0) return {1};
      if ((n & 1) != 0) {
          vector<int> result = rising_factorial(n - 1);
          result.push_back(0);
          for (int i = n; i >= 0; --i) {
              const long long same = static_cast<long long>(n - 1) *
                  result[static_cast<size_t>(i)] % mod_value;
              const int previous = i == 0 ? 0 : result[static_cast<size_t>(i - 1)];
              result[static_cast<size_t>(i)] = static_cast<int>((same + previous) % mod_value);
          }
          return result;
      }
      vector<int> left = rising_factorial(n / 2);
      vector<int> right = shift_polynomial(left, n / 2);
      return multiply(left, right);
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      factorial.assign(static_cast<size_t>(n) + 1U, 1);
      inverse_factorial.assign(static_cast<size_t>(n) + 1U, 1);
      for (int i = 1; i <= n; ++i)
          factorial[static_cast<size_t>(i)] = static_cast<int>(
              static_cast<long long>(factorial[static_cast<size_t>(i - 1)]) * i % mod_value);
      inverse_factorial[static_cast<size_t>(n)] =
          power_mod(factorial[static_cast<size_t>(n)], mod_value - 2);
      for (int i = n; i > 0; --i)
          inverse_factorial[static_cast<size_t>(i - 1)] = static_cast<int>(
              static_cast<long long>(inverse_factorial[static_cast<size_t>(i)]) * i % mod_value);
      const vector<int> answer = rising_factorial(n);
      for (int i = 0; i <= n; ++i)
          cout << answer[static_cast<size_t>(i)] << (i == n ? '\n' : ' ');
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5408
external_platform: 洛谷
external_problem_id: P5408
external_title: 第一類斯特林數·行
external_relation: original
source_book_pages: [484]
source_pdf_pages: [114]
review_status: verified
---

上升階乘可對半拆成原多項式與其平移，多項式平移也能化為一次 NTT 卷積。
