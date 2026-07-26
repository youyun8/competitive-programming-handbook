---
id: luogu-p6598
volume: lower
source_file: lower-volume
title: 洛谷 P6598 烷烴同分異構體計數
chapter: 7
section: '7.7'
kind: external-oj
difficulty: 10
topics: [unlabeled-tree, dissymmetry-theorem, generating-function, ntt]
prerequisites: [burnside-polya, polynomial-newton-iteration]
statement: 求 n 個碳原子的鏈狀烷烴結構異構體數；等價於 n 點、最大度數不超過 4 的無標號無根樹數。答案模 998244353。
constraints: [1 <= n <= 100000]
input_format: 一行一個正整數 n。
output_format: 輸出答案模 998244353。
samples:
  - input: '5'
    output: '3'
    explanation: 五碳烷烴有正戊烷、異戊烷與新戊烷三種。
core_knowledge: [烷基無標號根樹, 樹的解離定理, 循環指標, 隱式 FPS Newton]
judgment: 直接數無根樹會因根的選擇重複；應用「點根樹－邊根樹＋對稱有向邊根樹」的解離公式。
hints:
  - 烷基級數 A 滿足 A=1+x(A^3+3A A(x^2)+2A(x^3))/6。
  - 點根烷烴的根可掛至多四個烷基，對 S4 寫循環指標。
  - 無根答案為 P-Q+S：點根、無向邊根與兩側相同的邊根修正。
solution_outline: Newton+NTT 求 A。由 S4 得 P=x(A^4+6A^2A2+3A2^2+8AA3+6A4)/24；令 B=A-1，則 Q=(B^2+(A2-1))/2，S=A2-1。輸出 [x^n](P-Q+S)。
proof_or_invariant: A 方程由根下至多三個無序子樹的 S3 循環指標得到。P 的 S4 循環型係數 1、6、3、8、6 完整枚舉根的四個位置。樹的解離定理保證每棵無根樹對「點軌道數－邊軌道數＋對稱邊修正」貢獻恰一，因此 P-Q+S 的係數就是所求。
common_errors: [烷基常數項漏設一, 點根只允許三個分枝, Q 未排除空烷基, 解離公式符號寫錯]
complexity: { time: 'O(n log^2 n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n; cin >> n; /* TODO: 烷基 FPS 與樹解離。 */ return 0; }
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
      a.resize(static_cast<size_t>(size)); b.resize(static_cast<size_t>(size));
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
      const int inv_two = power_mod(2, mod_value - 2);
      const int inv_six = power_mod(6, mod_value - 2);
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
                   static_cast<int>(static_cast<long long>(expression) * inv_six % mod_value) +
                   mod_value) % mod_value;
              derivative[static_cast<size_t>(i)] =
                  (mod_value - static_cast<int>(
                      static_cast<long long>(
                          (square[static_cast<size_t>(i - 1)] + a2[static_cast<size_t>(i - 1)]) %
                          mod_value) * inv_two % mod_value)) % mod_value;
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
      const int inv_two = power_mod(2, mod_value - 2);
      const int inv_twenty_four = power_mod(24, mod_value - 2);
      const vector<int> a = alkyl_series(need);
      const vector<int> a2 = compose(a, 2, need);
      const vector<int> a3 = compose(a, 3, need);
      const vector<int> a4 = compose(a, 4, need);
      const vector<int> square = multiply(a, a, need);
      const vector<int> fourth = multiply(square, square, need);
      const vector<int> square_a2 = multiply(square, a2, need);
      const vector<int> square_comp = multiply(a2, a2, need);
      const vector<int> a_a3 = multiply(a, a3, need);
      vector<int> point_rooted(static_cast<size_t>(need));
      for (int i = 1; i < need; ++i) {
          const int degree = i - 1;
          const long long sum =
              (fourth[static_cast<size_t>(degree)] +
               6LL * square_a2[static_cast<size_t>(degree)] +
               3LL * square_comp[static_cast<size_t>(degree)] +
               8LL * a_a3[static_cast<size_t>(degree)] +
               6LL * a4[static_cast<size_t>(degree)]) % mod_value;
          point_rooted[static_cast<size_t>(i)] =
              static_cast<int>(sum * inv_twenty_four % mod_value);
      }
      vector<int> nonempty = a;
      nonempty[0] = 0;
      const vector<int> edge_square = multiply(nonempty, nonempty, need);
      int answer = point_rooted[static_cast<size_t>(n)];
      const int symmetric = (a2[static_cast<size_t>(n)] -
          (n == 0 ? 1 : 0) + mod_value) % mod_value;
      const int edge_rooted = static_cast<int>(
          static_cast<long long>((edge_square[static_cast<size_t>(n)] + symmetric) % mod_value) *
          inv_two % mod_value);
      answer = (answer - edge_rooted + symmetric) % mod_value;
      if (answer < 0) answer += mod_value;
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P6598
external_platform: 洛谷
external_problem_id: P6598
external_title: 烷烴計數
external_relation: original
source_book_pages: [493]
source_pdf_pages: [123]
review_status: verified
---

樹的解離定理把無根同構問題化為三種可由循環指標直接計數的有根結構。
