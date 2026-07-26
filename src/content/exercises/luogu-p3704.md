---
id: luogu-p3704
volume: lower
source_file: lower-volume
title: 洛谷 P3704 數字表格
chapter: 6
section: '6.16'
kind: external-oj
difficulty: 5
topics:
  - 莫比烏斯反演
  - Fibonacci
  - 整除分塊
  - 乘法卷積
prerequisites:
  - mobius-inversion
  - divisor-summation
statement: >-
  表格 (i,j) 的值為 Fibonacci(gcd(i,j))，求整張 n*m 表格的乘積模 10^9+7。
constraints:
  - 1 <= T <= 1000
  - 1 <= n,m <= 1000000
input_format: >-
  第一行 T，接著 T 行 n,m。
output_format: >-
  每組輸出表格乘積模 10^9+7。
samples:
  - input: |
      3
      2 3
      4 5
      6 7
    output: |
      1
      6
      960
    explanation: >-
      官方三組樣例；例如 2*3 表內 gcd 只為 1、2，而 F1=F2=1，乘積為 1。
hints:
  - >-
    按 gcd=d 分組後，指數是縮放矩形中的互質對數。
  - >-
    換序令 g(t)=product_{d|t} Fib(d)^{mu(t/d)}。
  - >-
    答案變成 product_t g(t)^{floor(n/t)floor(m/t)}；預處理 g 的前綴積後整除分塊。
core_knowledge:
  - 乘法形式莫比烏斯反演
  - Fibonacci GCD 表
judgment: >-
  T 多達千組，必須把與查詢無關的乘法卷積完全預處理。
solution_outline: >-
  線性篩 mu 與 Fibonacci。調和級數枚舉 d 及其倍數建立 g；做 g 前綴積與逆前綴積。每組依兩商分塊，取得 g 區間乘積並快速冪。
proof_or_invariant: >-
  互質指示函數的莫比烏斯展開把 Fib(d) 的指數重排；令 t=d*k 後，同一 t 的底數正是 g(t)，外層係數只剩 floor(n/t)floor(m/t)。區間前綴積精確合併相同指數。
common_errors:
  - 把乘法卷積誤寫成加法
  - 負 mu 對應的模逆元未處理
  - 指數乘法未對 MOD-1 取模
complexity:
  time: 預處理 O(V log V)，每組 O(sqrt(V) log MOD)
  space: O(V)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依照三個提示完成演算法；先保留可編譯的輸入輸出骨架。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  static constexpr long long kMod = 1000000007;
  static long long power_mod(long long base, long long exponent) {
      long long result = 1;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) result = result * base % kMod;
          base = base * base % kMod; exponent >>= 1LL;
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int tests; cin >> tests;
      vector<pair<int, int>> query(static_cast<size_t>(tests));
      int maximum = 1;
      for (auto& [n, m] : query) { cin >> n >> m; maximum = max(maximum, min(n, m)); }
      vector<int> mu(static_cast<size_t>(maximum) + 1), primes;
      vector<char> composite(static_cast<size_t>(maximum) + 1, false);
      mu[1] = 1;
      for (int i = 2; i <= maximum; ++i) {
          if (!composite[static_cast<size_t>(i)]) { primes.push_back(i); mu[static_cast<size_t>(i)] = -1; }
          for (int p : primes) {
              if (p > maximum / i) break;
              const int next = i * p; composite[static_cast<size_t>(next)] = true;
              if (i % p == 0) { mu[static_cast<size_t>(next)] = 0; break; }
              mu[static_cast<size_t>(next)] = -mu[static_cast<size_t>(i)];
          }
      }
      vector<long long> fibonacci(static_cast<size_t>(maximum) + 1, 1);
      if (maximum >= 2) fibonacci[2] = 1;
      for (int i = 3; i <= maximum; ++i)
          fibonacci[static_cast<size_t>(i)] =
              (fibonacci[static_cast<size_t>(i - 1)] + fibonacci[static_cast<size_t>(i - 2)]) % kMod;
      vector<long long> value(static_cast<size_t>(maximum) + 1, 1);
      for (int d = 1; d <= maximum; ++d) {
          if (mu[static_cast<size_t>(d)] == 0) continue;
          for (int multiple = d; multiple <= maximum; multiple += d) {
              const long long factor = fibonacci[static_cast<size_t>(multiple / d)];
              value[static_cast<size_t>(multiple)] = value[static_cast<size_t>(multiple)] *
                  (mu[static_cast<size_t>(d)] == 1 ? factor : power_mod(factor, kMod - 2)) % kMod;
          }
      }
      vector<long long> prefix(static_cast<size_t>(maximum) + 1, 1);
      for (int i = 1; i <= maximum; ++i)
          prefix[static_cast<size_t>(i)] = prefix[static_cast<size_t>(i - 1)] * value[static_cast<size_t>(i)] % kMod;
      vector<long long> inverse_prefix(static_cast<size_t>(maximum) + 1, 1);
      inverse_prefix[static_cast<size_t>(maximum)] = power_mod(prefix[static_cast<size_t>(maximum)], kMod - 2);
      for (int i = maximum; i >= 1; --i)
          inverse_prefix[static_cast<size_t>(i - 1)] =
              inverse_prefix[static_cast<size_t>(i)] * value[static_cast<size_t>(i)] % kMod;
      for (const auto& [n, m] : query) {
          long long answer = 1;
          const int limit = min(n, m);
          for (int left = 1; left <= limit;) {
              const int right = min(n / (n / left), m / (m / left));
              const long long range_product = prefix[static_cast<size_t>(right)] *
                  inverse_prefix[static_cast<size_t>(left - 1)] % kMod;
              const long long exponent = static_cast<long long>(n / left) * (m / left) % (kMod - 1);
              answer = answer * power_mod(range_product, exponent) % kMod;
              left = right + 1;
          }
          cout << answer << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3704
external_platform: 洛谷
external_problem_id: 'P3704'
external_title: '[SDOI2017] 數字表格'
external_relation: original
original_label: '洛谷 P3704'
source_book_pages: [450, 456]
source_pdf_pages: [80, 86]
review_status: verified
---

這是把加法型莫比烏斯反演搬到乘法群上的代表題。

原始題單中本題位於第 6.16 節、習題 第 7 題；競賽來源記為「SDOI2017」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
