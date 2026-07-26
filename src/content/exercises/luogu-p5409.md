---
id: luogu-p5409
volume: lower
source_file: lower-volume
title: 洛谷 P5409 第一類 Stirling 數整列
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 5
topics: [stirling-number, exponential-generating-function, formal-power-series, ntt]
prerequisites: [catalan-stirling, ntt, polynomial-log-exp]
statement: 給 n、k，輸出無號第一類 Stirling 數 c(0,k)..c(n,k)。c(i,k) 是把 i 個不同元素組成 k 個非空圓排列的方案數，答案模 167772161。
constraints: [1 <= n < 131072, 1 <= k < 131072]
input_format: 一行兩個正整數 n、k。
output_format: 一行 n+1 個整數，依序輸出第一類 Stirling 數第 k 列。
samples:
  - input: '3 2'
    output: '0 0 1 3'
    explanation: 兩元素形成兩個單環只有一種；三元素形成兩環有三種。
core_knowledge: [圓排列 EGF, 組合類 SET, 多項式 ln 與 exp, NTT]
judgment: 一個非空置換環的 EGF 是 log(1/(1-x))；取 k 個無序環要除以 k!。
hints:
  - 整列 EGF 為 (Σ_(i>=1)x^i/i)^k/k!。
  - 抽出 x，令 H(x)=Σ_(i>=0)x^i/(i+1)，其常數項為一才能做形式冪。
  - H^k=exp(k ln H)，最後把 x^k 補回並由 EGF 乘 i!。
solution_outline: 預處理階乘。建立 H 到 n-k 次，以 Newton NTT 實作多項式逆、ln、exp，求 exp(k ln H)。第 i 項為 i!/k! 乘 H^k 的 i-k 次係數；k>n 時全零。
proof_or_invariant: 每個長 r 的圓排列有 (r-1)! 種，除以 r! 的 EGF 係數為 1/r，因此單環 EGF 為所述對數。無序取 k 個標號組合元件依指數公式除 k!。抽 x 與形式冪運算僅是代數恆等；Newton 逆與 exp 每輪把正確前綴倍增，故截斷係數正確。
common_errors: [把圓排列視為線排列, 忘記除 k!, 直接對常數項零的多項式取 ln, EGF 輸出漏乘 i!]
complexity: { time: 'O(n log^2 n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n, k; cin >> n >> k; /* TODO: EGF 形式冪。 */ return 0; }
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
                  int low = u + v;
                  if (low >= mod_value) low -= mod_value;
                  int high = u - v;
                  if (high < 0) high += mod_value;
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
      ntt(a, false);
      ntt(b, false);
      for (int i = 0; i < size; ++i)
          a[static_cast<size_t>(i)] = static_cast<int>(
              static_cast<long long>(a[static_cast<size_t>(i)]) *
              b[static_cast<size_t>(i)] % mod_value);
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
  vector<int> logarithm(const vector<int> &a, int need) {
      if (need == 1) return {0};
      vector<int> derivative(static_cast<size_t>(need - 1));
      for (int i = 1; i < need && i < static_cast<int>(a.size()); ++i)
          derivative[static_cast<size_t>(i - 1)] = static_cast<int>(
              static_cast<long long>(a[static_cast<size_t>(i)]) * i % mod_value);
      vector<int> product = multiply(derivative, inverse_series(a, need), need - 1);
      vector<int> result(static_cast<size_t>(need));
      for (int i = 1; i < need; ++i)
          result[static_cast<size_t>(i)] = static_cast<int>(
              static_cast<long long>(product[static_cast<size_t>(i - 1)]) *
              power_mod(i, mod_value - 2) % mod_value);
      return result;
  }
  vector<int> exponential(const vector<int> &a, int need) {
      vector<int> result{1};
      while (static_cast<int>(result.size()) < need) {
          const int target = min(need, 2 * static_cast<int>(result.size()));
          vector<int> log_result = logarithm(result, target);
          vector<int> correction(static_cast<size_t>(target));
          for (int i = 0; i < target; ++i) {
              const int wanted = i < static_cast<int>(a.size()) ? a[static_cast<size_t>(i)] : 0;
              correction[static_cast<size_t>(i)] = wanted - log_result[static_cast<size_t>(i)];
              if (correction[static_cast<size_t>(i)] < 0)
                  correction[static_cast<size_t>(i)] += mod_value;
          }
          correction[0] = (correction[0] + 1) % mod_value;
          result = multiply(result, correction, target);
          result.resize(static_cast<size_t>(target));
      }
      return result;
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
      vector<int> factorial(static_cast<size_t>(n) + 1U, 1);
      for (int i = 1; i <= n; ++i)
          factorial[static_cast<size_t>(i)] = static_cast<int>(
              static_cast<long long>(factorial[static_cast<size_t>(i - 1)]) * i % mod_value);
      const int need = n - k + 1;
      vector<int> h(static_cast<size_t>(need));
      for (int i = 0; i < need; ++i) h[static_cast<size_t>(i)] = power_mod(i + 1, mod_value - 2);
      vector<int> log_h = logarithm(h, need);
      for (int &value : log_h)
          value = static_cast<int>(static_cast<long long>(value) * k % mod_value);
      const vector<int> power = exponential(log_h, need);
      const int inverse_k_factorial = power_mod(factorial[static_cast<size_t>(k)], mod_value - 2);
      for (int i = 0; i <= n; ++i) {
          int answer = 0;
          if (i >= k)
              answer = static_cast<int>(
                  static_cast<long long>(power[static_cast<size_t>(i - k)]) *
                  factorial[static_cast<size_t>(i)] % mod_value * inverse_k_factorial % mod_value);
          cout << answer << (i == n ? '\n' : ' ');
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5409
external_platform: 洛谷
external_problem_id: P5409
external_title: 第一類斯特林數·列
external_relation: original
source_book_pages: [484]
source_pdf_pages: [114]
review_status: verified
---

單環的 EGF 抽掉最低次 x 後常數為一，便能以 ln／exp 快速做第 k 次冪。
