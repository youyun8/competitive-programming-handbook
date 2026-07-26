---
id: luogu-p6597
volume: lower
source_file: lower-volume
title: 洛谷 P6597 烯烴同分異構體計數
chapter: 7
section: '7.7'
kind: external-oj
difficulty: 10
topics: [burnside-lemma, generating-function, formal-power-series, ntt]
prerequisites: [burnside-polya, polynomial-newton-iteration]
statement: 對每個碳數 2..n，求分子式 C_k H_(2k) 的單烯烴結構異構體數；不考慮空間與順反異構。答案模 998244353。
constraints: [1 <= n <= 100000]
input_format: 一行一個正整數 n。
output_format: 共 n-1 行，第 k-1 行輸出 k 個碳的答案，k=2..n。
samples:
  - input: '5'
    output: |-
      1
      1
      3
      5
    explanation: 依序為乙烯、丙烯，以及三種四碳、五種五碳單烯烴。
core_knowledge: [烷基無標號根樹, S3 與 S2 循環指標, 隱式形式冪級數, Newton 迭代]
judgment: 單烯烴唯一的雙鍵把結構分成兩個無序端；每端的雙鍵碳還可接至多兩個烷基。
hints:
  - 烷基生成函數 A 滿足 A=1+x(A^3+3A A(x^2)+2A(x^3))/6。
  - 一個雙鍵端的生成函數 P=x(A^2+A(x^2))/2。
  - 兩端無序，所以答案生成函數 G=(P^2+P(x^2))/2。
solution_outline: 用形式冪級數 Newton 迭代求隱式方程 A 的前 n+1 項；每輪以 NTT 做乘法與多項式逆。代入兩次 S2 循環指標得到 P、G，輸出 G 的第 2..n 項。
proof_or_invariant: 烷基根碳以下是至多三個無序烷基，S3 的五種循環型化簡成 A 方程。雙鍵每端的兩個位置無序，第一次 S2 得 P；兩端交換仍同構，第二次 S2 得 G。Newton 每輪在已知前半係數下線性化，A(x^2)、A(x^3) 的新高項不影響當輪低階導數，故正確項數倍增。
common_errors: [把雙鍵兩端視為有序, 把每端誤接三個烷基, 漏掉 A 的常數項一代表氫, 輸出包含 k=1]
complexity: { time: 'O(n log^2 n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n; cin >> n; /* TODO: 烷基 FPS 與兩次 S2 Burnside。 */ return 0; }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  constexpr int mod_value = 998244353;
  constexpr int primitive_root = 3;
  int power_mod(int base, int exponent) {
      long long result = 1, value = base;
      while (exponent > 0) {
          if ((exponent & 1) != 0) result = result * value % mod_value;
          value = value * value % mod_value;
          exponent >>= 1;
      }
      return static_cast<int>(result);
  }
  void ntt(vector<int> &a, bool inverse) {
      const int n = static_cast<int>(a.size());
      for (int i = 1, j = 0; i < n; ++i) {
          int bit = n >> 1;
          while ((j & bit) != 0) { j ^= bit; bit >>= 1; }
          j ^= bit;
          if (i < j) swap(a[static_cast<size_t>(i)], a[static_cast<size_t>(j)]);
      }
      for (int len = 2; len <= n; len <<= 1) {
          int root = power_mod(primitive_root, (mod_value - 1) / len);
          if (inverse) root = power_mod(root, mod_value - 2);
          for (int start = 0; start < n; start += len) {
              long long factor = 1;
              for (int j = 0; j < len / 2; ++j) {
                  const int u = a[static_cast<size_t>(start + j)];
                  const int v = static_cast<int>(
                      factor * a[static_cast<size_t>(start + j + len / 2)] % mod_value);
                  int low = u + v; if (low >= mod_value) low -= mod_value;
                  int high = u - v; if (high < 0) high += mod_value;
                  a[static_cast<size_t>(start + j)] = low;
                  a[static_cast<size_t>(start + j + len / 2)] = high;
                  factor = factor * root % mod_value;
              }
          }
      }
      if (inverse) {
          const int inv_n = power_mod(n, mod_value - 2);
          for (int &value : a)
              value = static_cast<int>(static_cast<long long>(value) * inv_n % mod_value);
      }
  }
  vector<int> multiply(vector<int> a, vector<int> b, int need) {
      if (need <= 0 || a.empty() || b.empty()) return {};
      const int result_size = min(need, static_cast<int>(a.size() + b.size() - 1U));
      int size = 1;
      while (size < static_cast<int>(a.size() + b.size() - 1U)) size <<= 1;
      a.resize(static_cast<size_t>(size));
      b.resize(static_cast<size_t>(size));
      ntt(a, false); ntt(b, false);
      for (int i = 0; i < size; ++i)
          a[static_cast<size_t>(i)] = static_cast<int>(
              static_cast<long long>(a[static_cast<size_t>(i)]) * b[static_cast<size_t>(i)] % mod_value);
      ntt(a, true);
      a.resize(static_cast<size_t>(result_size));
      return a;
  }
  vector<int> inverse_series(const vector<int> &a, int need) {
      vector<int> result{power_mod(a[0], mod_value - 2)};
      while (static_cast<int>(result.size()) < need) {
          const int target = min(need, 2 * static_cast<int>(result.size()));
          vector<int> prefix(a.begin(), a.begin() + min(target, static_cast<int>(a.size())));
          vector<int> correction = multiply(prefix, result, target);
          correction.resize(static_cast<size_t>(target));
          for (int &value : correction) value = value == 0 ? 0 : mod_value - value;
          correction[0] = (correction[0] + 2) % mod_value;
          result = multiply(result, correction, target);
          result.resize(static_cast<size_t>(target));
      }
      return result;
  }
  vector<int> compose(const vector<int> &a, int factor, int need) {
      vector<int> result(static_cast<size_t>(need));
      for (int i = 0; i < static_cast<int>(a.size()) && i * factor < need; ++i)
          result[static_cast<size_t>(i * factor)] = a[static_cast<size_t>(i)];
      return result;
  }
  vector<int> alkyl_series(int need) {
      const int inverse_two = power_mod(2, mod_value - 2);
      const int inverse_six = power_mod(6, mod_value - 2);
      vector<int> a{1};
      while (static_cast<int>(a.size()) < need) {
          const int target = min(need, 2 * static_cast<int>(a.size()));
          a.resize(static_cast<size_t>(target));
          const vector<int> a2 = compose(a, 2, target);
          const vector<int> a3 = compose(a, 3, target);
          const vector<int> square = multiply(a, a, target);
          const vector<int> cube = multiply(square, a, target);
          const vector<int> mixed = multiply(a, a2, target);
          vector<int> residual = a;
          residual[0] = (residual[0] + mod_value - 1) % mod_value;
          vector<int> derivative(static_cast<size_t>(target));
          derivative[0] = 1;
          for (int i = 1; i < target; ++i) {
              const int expression = static_cast<int>(
                  (cube[static_cast<size_t>(i - 1)] +
                   3LL * mixed[static_cast<size_t>(i - 1)] +
                   2LL * a3[static_cast<size_t>(i - 1)]) % mod_value);
              residual[static_cast<size_t>(i)] =
                  (residual[static_cast<size_t>(i)] -
                   static_cast<int>(static_cast<long long>(expression) * inverse_six % mod_value) +
                   mod_value) % mod_value;
              derivative[static_cast<size_t>(i)] =
                  (mod_value - static_cast<int>(
                      static_cast<long long>(
                          (square[static_cast<size_t>(i - 1)] + a2[static_cast<size_t>(i - 1)]) %
                          mod_value) * inverse_two % mod_value)) % mod_value;
          }
          const vector<int> correction =
              multiply(residual, inverse_series(derivative, target), target);
          for (int i = 0; i < target; ++i) {
              a[static_cast<size_t>(i)] -= correction[static_cast<size_t>(i)];
              if (a[static_cast<size_t>(i)] < 0) a[static_cast<size_t>(i)] += mod_value;
          }
      }
      return a;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      const int need = n + 1;
      const int inverse_two = power_mod(2, mod_value - 2);
      const vector<int> alkyl = alkyl_series(need);
      const vector<int> alkyl_square = multiply(alkyl, alkyl, need);
      const vector<int> alkyl_two = compose(alkyl, 2, need);
      vector<int> endpoint(static_cast<size_t>(need));
      for (int i = 1; i < need; ++i)
          endpoint[static_cast<size_t>(i)] = static_cast<int>(
              static_cast<long long>(
                  (alkyl_square[static_cast<size_t>(i - 1)] +
                   alkyl_two[static_cast<size_t>(i - 1)]) % mod_value) * inverse_two % mod_value);
      const vector<int> endpoint_square = multiply(endpoint, endpoint, need);
      const vector<int> endpoint_two = compose(endpoint, 2, need);
      for (int carbon = 2; carbon <= n; ++carbon) {
          const int answer = static_cast<int>(
              static_cast<long long>(
                  (endpoint_square[static_cast<size_t>(carbon)] +
                   endpoint_two[static_cast<size_t>(carbon)]) % mod_value) * inverse_two % mod_value);
          cout << answer << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P6597
external_platform: 洛谷
external_problem_id: P6597
external_title: 烯烴計數
external_relation: original
source_book_pages: [493]
source_pdf_pages: [123]
review_status: verified
---

唯一雙鍵提供天然對稱中心；烷基隱式級數求出後，只需兩次 S2 循環指標。
