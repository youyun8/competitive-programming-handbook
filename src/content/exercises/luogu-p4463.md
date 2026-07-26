---
id: luogu-p4463
volume: lower
source_file: lower-volume
title: 洛谷 P4463 相異序列乘積和
chapter: 7
section: '7.8'
kind: external-oj
difficulty: 7
topics: [dynamic-programming, polynomial, lagrange-interpolation]
prerequisites: [generating-functions, modular-combination]
statement: 長 n 序列的每項都在 1..k 且互不相同，序列價值為所有項乘積。求所有合法有序序列的價值總和模質數 p。
constraints: [k <= 1000000000, n <= 500, p <= 1000000000, p 為質數, n+1 < k < p]
input_format: 一行三個正整數 k、n、p。
output_format: 輸出價值總和模 p。
samples:
  - input: '9 7 10007'
    output: '3611'
    explanation: 先計算七個相異數組成的集合之乘積和，再乘 7! 計入所有排列。
core_knowledge: [初等對稱多項式, DP 差分, 多項式次數, 連續點拉格朗日插值]
judgment: 有序序列可先按值遞增唯一表示一個集合；每個集合再有 n! 種排列。
hints:
  - 設 f(i,j) 為從 1..j 選 i 個數的乘積和，考慮是否選 j。
  - f(i,j)-f(i,j-1)=j f(i-1,j-1)，可歸納 f(i,j) 對 j 的次數為 2i。
  - 只需 DP 出 0..2n+1 的值，再在 j=k 插值。
solution_outline: 用 O(n²) DP 算 f(n,j)，j=0..2n+1。連續整數節點的拉格朗日分子用 k-j 的前後綴積，分母是 (-1)^(d-j)j!(d-j)!，因此 O(n) 求 f(n,k)。最後乘 n!。
proof_or_invariant: DP 依最大候選 j 分成不選 j 與選 j，後者乘 j，故精確計算遞增集合乘積和。差分使多項式次數每層增加二，基底 f(0,j)=1，因此 f(n,j) 次數至多 2n；2n+1 個點唯一決定它。每個相異集合的 n! 個排列乘積相同，乘階乘即得原問題。
common_errors: [忘記最後乘 n!, 插值點數不足 2n+1, 負號未模正規化, 在 k 恰落於已知節點時除以零]
complexity: { time: 'O(n^2+n log p)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { long long k, p; int n; cin >> k >> n >> p; /* TODO: DP 後插值。 */ return 0; }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;
  long long power_mod(long long base, long long exponent, long long mod_value) {
      long long result = 1;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) result = result * base % mod_value;
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      long long k;
      int n;
      long long mod_value;
      cin >> k >> n >> mod_value;
      const int degree = 2 * n;
      vector<long long> dp(static_cast<size_t>(degree) + 2U, 1);
      vector<long long> next(static_cast<size_t>(degree) + 2U);
      for (int chosen = 1; chosen <= n; ++chosen) {
          next[0] = 0;
          for (int bound = 1; bound <= degree + 1; ++bound)
              next[static_cast<size_t>(bound)] =
                  (next[static_cast<size_t>(bound - 1)] +
                   bound * dp[static_cast<size_t>(bound - 1)]) % mod_value;
          dp.swap(next);
      }
      long long value = 0;
      if (k <= degree) {
          value = dp[static_cast<size_t>(k)];
      } else {
          vector<long long> factorial(static_cast<size_t>(degree) + 1U, 1);
          for (int i = 1; i <= degree; ++i)
              factorial[static_cast<size_t>(i)] =
                  factorial[static_cast<size_t>(i - 1)] * i % mod_value;
          vector<long long> prefix(static_cast<size_t>(degree) + 2U, 1);
          vector<long long> suffix(static_cast<size_t>(degree) + 2U, 1);
          for (int i = 0; i <= degree; ++i)
              prefix[static_cast<size_t>(i + 1)] =
                  prefix[static_cast<size_t>(i)] * ((k - i) % mod_value) % mod_value;
          for (int i = degree; i >= 0; --i)
              suffix[static_cast<size_t>(i)] =
                  suffix[static_cast<size_t>(i + 1)] * ((k - i) % mod_value) % mod_value;
          for (int i = 0; i <= degree; ++i) {
              long long numerator = prefix[static_cast<size_t>(i)] *
                  suffix[static_cast<size_t>(i + 1)] % mod_value;
              long long denominator = factorial[static_cast<size_t>(i)] *
                  factorial[static_cast<size_t>(degree - i)] % mod_value;
              long long term = dp[static_cast<size_t>(i)] * numerator % mod_value *
                  power_mod(denominator, mod_value - 2, mod_value) % mod_value;
              if (((degree - i) & 1) != 0) term = (mod_value - term) % mod_value;
              value += term;
              value %= mod_value;
          }
      }
      for (int i = 1; i <= n; ++i) value = value * i % mod_value;
      cout << value << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4463
external_platform: 洛谷
external_problem_id: P4463
external_title: '[集訓隊互測 2012] calc'
external_relation: original
source_book_pages: [500]
source_pdf_pages: [130]
review_status: verified
---

DP 的值域上限雖巨大，但其答案是低次多項式；只算少量點再插值即可。
