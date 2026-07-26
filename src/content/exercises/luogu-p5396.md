---
id: luogu-p5396
volume: lower
source_file: lower-volume
title: 洛谷 P5396 第二類 Stirling 數整列
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 8
topics: [stirling-number, generating-function, ntt, polynomial-inverse]
prerequisites: [catalan-stirling, ntt]
statement: 給 n、k，輸出 S(0,k),S(1,k),...,S(n,k)。S(i,k) 是把 i 個不同元素分成 k 個非空無標號集合的方案數，答案模 167772161。
constraints: [1 <= n < 131072, 1 <= k < 131072]
input_format: 一行兩個正整數 n、k。
output_format: 一行 n+1 個整數，依序輸出第二類 Stirling 數第 k 列模 167772161。
samples:
  - input: '3 2'
    output: '0 0 1 3'
    explanation: 兩元素只能各成一組；三元素分兩組有三種。
core_knowledge: [第二類 Stirling 遞推, 普通生成函數, 分治多項式乘法, 多項式求逆]
judgment: 固定集合數 k 時，應使用普通生成函數；其分母是一串一次式乘積。
hints:
  - 由 S(i,k)=S(i-1,k-1)+kS(i-1,k) 推固定列生成函數。
  - F_k(x)=x^k/Π_(j=1..k)(1-jx)。
  - 分治 NTT 求分母，再以 Newton 迭代求倒數。
solution_outline: 若 k>n 全輸出零。否則分治相乘 (1-jx) 得 D；求 D^-1 到 n-k 次，前 k 項補零，之後直接輸出倒數係數。
proof_or_invariant: 將遞推乘 x^i 求和得 F_k=xF_(k-1)/(1-kx)，由 F_0=1 歸納得到公式。D(0)=1 可逆；Newton 更新 B←B(2-DB) 每次使 DB≡1 的正確項數倍增，因此所得前綴就是唯一形式冪級數倒數。
common_errors: [把列當成指數生成函數, k>n 時仍建立巨大乘積, NTT 使用錯誤模數, 逆多項式長度少一項]
complexity: { time: 'O((n+k) log^2(n+k))', space: 'O(n+k)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n, k; cin >> n >> k; /* TODO: 乘積多項式與形式逆。 */ return 0; }
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
                  values[static_cast<size_t>(start + offset)] = even + odd;
                  if (values[static_cast<size_t>(start + offset)] >= mod_value)
                      values[static_cast<size_t>(start + offset)] -= mod_value;
                  values[static_cast<size_t>(start + offset + length / 2)] = even - odd;
                  if (values[static_cast<size_t>(start + offset + length / 2)] < 0)
                      values[static_cast<size_t>(start + offset + length / 2)] += mod_value;
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
  vector<int> multiply(vector<int> first, vector<int> second, int need) {
      if (first.empty() || second.empty() || need == 0) return {};
      const int result_size = min(need, static_cast<int>(first.size() + second.size() - 1U));
      int size = 1;
      while (size < static_cast<int>(first.size() + second.size() - 1U)) size <<= 1;
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
  vector<int> polynomial_inverse(const vector<int> &source, int need) {
      vector<int> result{power_mod(source[0], mod_value - 2)};
      while (static_cast<int>(result.size()) < need) {
          const int target = min(need, 2 * static_cast<int>(result.size()));
          vector<int> prefix(source.begin(), source.begin() +
              min(target, static_cast<int>(source.size())));
          vector<int> product = multiply(prefix, result, target);
          product.resize(static_cast<size_t>(target));
          for (int &value : product) value = value == 0 ? 0 : mod_value - value;
          product[0] += 2;
          if (product[0] >= mod_value) product[0] -= mod_value;
          result = multiply(result, product, target);
          result.resize(static_cast<size_t>(target));
      }
      return result;
  }
  vector<int> build_product(int left, int right) {
      if (left == right) return {1, left == 0 ? 0 : mod_value - left};
      const int middle = (left + right) / 2;
      return multiply(build_product(left, middle), build_product(middle + 1, right),
                      right - left + 2);
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int k;
      cin >> n >> k;
      if (k > n) {
          for (int i = 0; i <= n; ++i) cout << 0 << (i == n ? '\n' : ' ');
          return 0;
      }
      const vector<int> denominator = build_product(1, k);
      const vector<int> inverse = polynomial_inverse(denominator, n - k + 1);
      for (int i = 0; i <= n; ++i)
          cout << (i < k ? 0 : inverse[static_cast<size_t>(i - k)])
               << (i == n ? '\n' : ' ');
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5396
external_platform: 洛谷
external_problem_id: P5396
external_title: 第二類斯特林數·列
external_relation: original
source_book_pages: [484]
source_pdf_pages: [114]
review_status: verified
---

固定列的普通生成函數是一次因子乘積的倒數，分治乘法與 Newton 逆即可整列求出。
