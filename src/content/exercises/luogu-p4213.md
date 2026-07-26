---
id: luogu-p4213
volume: lower
source_file: lower-volume
title: 洛谷 P4213 杜教篩：φ 與 μ 的前綴和
chapter: 6
section: '6.17'
kind: external-oj
difficulty: 5
topics:
  - 杜教篩
  - 狄利克雷卷積
  - 整除分塊
  - 線性篩
  - 記憶化
prerequisites:
  - du-jiao-sieve
  - multiplicative-function
  - euler-totient
  - mobius-inversion
statement: |-
  給定若干個 n，對每個 n 求歐拉函數 φ 的前綴和與莫比烏斯函數 μ 的前綴和。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - n 可以大到線性篩無法直接處理的量級
  - 多組詢問，需在詢問之間共用記憶化結果
  - 完整限制條件請參閱外部題目頁面
input_format: 第一行一個整數 T；接下來 T 行每行一個整數 n。
output_format: 每組輸出一行，兩個整數分別是 φ 的前綴和與 μ 的前綴和，以空白分隔。
samples:
  - input: |
      5
      1
      2
      8
      100
      1000000
    output: |
      1 1
      2 0
      22 -2
      3044 1
      303963552392 212
    explanation:
      n=8 時 φ(1..8) 為 1,1,2,2,4,2,6,4，和為 22；μ(1..8) 為 1,−1,−1,0,−1,1,−1,0，和為 −2。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ
      網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - 杜教篩的出發點是一個恆等式。設 S_f(n) = Σ_{i≤n} f(i)，對任意函數 g，把 (f\*g) 的前綴和按 d 分組可得：g(1)·S_f(n) = Σ_{i≤n} (f\*g)(i) − Σ_{d=2}^{n}
    g(d)·S_f(⌊n/d⌋)。
  - 所以整個技巧就是**挑一個好的 g**，讓「f\*g 的前綴和」有封閉公式。本題兩個函數都取 g = 1（恆一函數）：φ\*1 = id，μ\*1 = [n==1]。
  - 代進去就是 S_φ(n) = n(n+1)/2 − Σ_{d=2}^{n} S_φ(⌊n/d⌋)，S_μ(n) = 1 − Σ_{d=2}^{n} S_μ(⌊n/d⌋)。右邊用**整除分塊**：⌊n/d⌋ 只有 O(√n)
    種取值，成段處理。
solution_outline:
  先線性篩出前 2×10^6 項的 φ 與 μ 並做前綴和。sum_phi(n)／sum_mobius(n) 在 n 不超過篩界時直接查表，否則查記憶化表；未命中時以封閉式（n(n+1)/2 或
  1）為起點，用整除分塊枚舉 d 的每一段、遞迴減去 (r−l+1)·S(⌊n/d⌋)，結果存回記憶化表。
proof_or_invariant:
  恆等式的推導是把 Σ_{i≤n}(f\*g)(i) = Σ_{i≤n} Σ_{d|i} g(d) f(i/d) 換成先枚舉 d：= Σ_{d≤n} g(d) S_f(⌊n/d⌋)，把 d=1
  的一項移到左邊即得。複雜度方面，先篩前 N 項後總時間為 O(N + n/√N)，取 N = n^(2/3) 時達到 O(n^(2/3))。
complexity:
  time: 預篩 O(N) 加上每組 O(n^(2/3))（記憶化跨詢問共用）
  space: O(N) 加上記憶化表
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      // TODO：杜教篩。
      //   對積性函數 f，若能找到 g 使 f * g（狄利克雷卷積）的前綴和好算，就有
      //       g(1)·S_f(n) = Σ_{i=1}^{n} (f*g)(i) − Σ_{d=2}^{n} g(d)·S_f(⌊n/d⌋)
      //   本題取 g = 1（恆一函數）：
      //       φ * 1 = id      =>  S_φ(n) = n(n+1)/2 − Σ_{d=2}^{n} S_φ(⌊n/d⌋)
      //       μ * 1 = [n==1]  =>  S_μ(n) = 1        − Σ_{d=2}^{n} S_μ(⌊n/d⌋)
      //   實作三個要點：
      //     (a) 先用**線性篩**求出前 N 項（N 取 n^(2/3) 附近最優）並做前綴和；
      //     (b) 遞迴時用**整除分塊**：⌊n/d⌋ 相同的 d 成段處理，只有 O(√n) 段；
      //     (c) 對超過 N 的 n 做**記憶化**，否則會重複計算同樣的子問題。
      // 下面是逐個分解質因數的樸素版本，正確但只能應付很小的 n。
      int tests;
      if (!(cin >> tests)) { return 0; }
      while (tests-- > 0) {
          long long n;
          cin >> n;
          long long phi_sum = 0;
          long long mobius_sum = 0;
          for (long long i = 1; i <= n; ++i) {
              long long value = i;
              long long phi_value = i;
              int distinct = 0;
              bool square_free = true;
              for (long long p = 2; p * p <= value; ++p) {
                  if (value % p != 0) { continue; }
                  ++distinct;
                  phi_value = phi_value / p * (p - 1);
                  value /= p;
                  if (value % p == 0) { square_free = false; }
                  while (value % p == 0) { value /= p; }
              }
              if (value > 1) {
                  ++distinct;
                  phi_value = phi_value / value * (value - 1);
              }
              phi_sum += phi_value;
              if (square_free) { mobius_sum += (distinct % 2 == 0) ? 1 : -1; }
          }
          cout << phi_sum << ' ' << mobius_sum << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 杜教篩：求積性函數的前綴和。對 φ 與 μ 分別利用
  //   Σ_{d|n} φ(d) = n      =>  S_φ(n) = n(n+1)/2 − Σ_{d=2}^{n} S_φ(⌊n/d⌋)
  //   Σ_{d|n} μ(d) = [n==1] =>  S_μ(n) = 1        − Σ_{d=2}^{n} S_μ(⌊n/d⌋)
  // 先線性篩出前 N 項（N 取 n^(2/3) 附近），其餘用整除分塊遞迴並記憶化。
  static const int kSieve = 2000000;
  static vector<int> primes;
  static vector<int> mobius;
  static vector<long long> phi;
  static vector<long long> phi_prefix;
  static vector<long long> mobius_prefix;
  static unordered_map<long long, long long> phi_cache;
  static unordered_map<long long, long long> mobius_cache;

  static void sieve() {
      vector<char> composite(static_cast<size_t>(kSieve) + 1, 0);
      mobius.assign(static_cast<size_t>(kSieve) + 1, 0);
      phi.assign(static_cast<size_t>(kSieve) + 1, 0);
      mobius[1] = 1;
      phi[1] = 1;
      for (int i = 2; i <= kSieve; ++i) {
          if (!composite[static_cast<size_t>(i)]) {
              primes.push_back(i);
              mobius[static_cast<size_t>(i)] = -1;
              phi[static_cast<size_t>(i)] = i - 1;
          }
          for (const int p : primes) {
              const long long next = static_cast<long long>(i) * p;
              if (next > kSieve) { break; }
              composite[static_cast<size_t>(next)] = 1;
              if (i % p == 0) {
                  mobius[static_cast<size_t>(next)] = 0;
                  phi[static_cast<size_t>(next)] = phi[static_cast<size_t>(i)] * p;
                  break;
              }
              mobius[static_cast<size_t>(next)] = -mobius[static_cast<size_t>(i)];
              phi[static_cast<size_t>(next)] = phi[static_cast<size_t>(i)] * (p - 1);
          }
      }
      phi_prefix.assign(static_cast<size_t>(kSieve) + 1, 0);
      mobius_prefix.assign(static_cast<size_t>(kSieve) + 1, 0);
      for (int i = 1; i <= kSieve; ++i) {
          phi_prefix[static_cast<size_t>(i)] = phi_prefix[static_cast<size_t>(i - 1)] + phi[static_cast<size_t>(i)];
          mobius_prefix[static_cast<size_t>(i)] =
              mobius_prefix[static_cast<size_t>(i - 1)] + mobius[static_cast<size_t>(i)];
      }
  }

  static long long sum_phi(long long n) {
      if (n <= kSieve) { return phi_prefix[static_cast<size_t>(n)]; }
      const auto it = phi_cache.find(n);
      if (it != phi_cache.end()) { return it->second; }
      long long result = n % 2 == 0 ? (n / 2) * (n + 1) : n * ((n + 1) / 2);
      for (long long l = 2; l <= n;) {
          const long long value = n / l;
          const long long r = n / value;  // 整除分塊：⌊n/d⌋ 相同的一整段
          result -= (r - l + 1) * sum_phi(value);
          l = r + 1;
      }
      phi_cache[n] = result;
      return result;
  }

  static long long sum_mobius(long long n) {
      if (n <= kSieve) { return mobius_prefix[static_cast<size_t>(n)]; }
      const auto it = mobius_cache.find(n);
      if (it != mobius_cache.end()) { return it->second; }
      long long result = 1;
      for (long long l = 2; l <= n;) {
          const long long value = n / l;
          const long long r = n / value;
          result -= (r - l + 1) * sum_mobius(value);
          l = r + 1;
      }
      mobius_cache[n] = result;
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      sieve();
      int tests;
      if (!(cin >> tests)) { return 0; }
      while (tests-- > 0) {
          long long n;
          cin >> n;
          cout << sum_phi(n) << ' ' << sum_mobius(n) << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4213
external_platform: 洛谷
external_problem_id: P4213
external_title: 【模板】杜教篩
external_relation: original
source_book_pages:
  - 456
  - 461
source_pdf_pages:
  - 86
  - 91
review_status: verified
core_knowledge:
  - 杜教篩
  - 狄利克雷卷積
  - 整除分塊
  - 記憶化
judgment: n 大到無法線性篩至 n；利用算術函數卷積的前綴和等式，把未知前綴和遞迴成 O(sqrt n) 個商值區間並記憶化。
common_errors:
  - 整除分塊右端點寫錯而漏算或死迴圈
  - phi 前綴和使用 32 位元導致溢位
  - 多次詢問清空記憶表，失去共用子問題的效益
---

杜教篩是「不用算出每一項，也能算出前綴和」的典範。真正要練的是挑 g 的直覺：要讓 f\*g 簡單，同時 g 自己的前綴和也要好算。
