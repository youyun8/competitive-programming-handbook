---
id: luogu-p3327
volume: lower
source_file: lower-volume
title: 洛谷 P3327 約數個數和
chapter: 6
section: '6.16'
kind: external-oj
difficulty: 5
topics:
  - 莫比烏斯反演
  - 約數函數
  - 整除分塊
prerequisites:
  - mobius-inversion
  - divisor-summation
statement: >-
  設 d(x) 為 x 的約數個數；每組給 n,m，求 sum_{i=1}^n sum_{j=1}^m d(i*j)。
constraints:
  - 1 <= T,n,m <= 50000
input_format: >-
  第一行 T，接著 T 行 n,m。
output_format: >-
  每組輸出二重和。
samples:
  - input: |
      1
      2 3
    output: |
      14
    explanation: >-
      六項 d(1),d(2),d(3),d(2),d(4),d(6)=1+2+2+2+3+4=14；依官方格式設計，可直接枚舉對拍。
hints:
  - >-
    恆等式 d(ij)=sum_{x|i}sum_{y|j}[gcd(x,y)=1]。
  - >-
    展開互質指示後可得 sum_k mu(k) D(floor(n/k))D(floor(m/k))，D 是 d 的前綴和。
  - >-
    線性篩同時計算 mu 與 d，再對 k 整除分塊。
core_knowledge:
  - 約數函數
  - 莫比烏斯換序
judgment: >-
  直接枚舉 ij 或分解每個乘積都太慢；關鍵恆等式把雙重和拆成兩個前綴。
solution_outline: >-
  預處理到最大邊界的 mu 前綴及 divisor_count 前綴。每組依 n/k、m/k 的共同商區間，累加 mu 區間和乘兩個 D。
proof_or_invariant: >-
  約數指數逐質因數檢查可證 d(ij) 恆等式；再以互質的莫比烏斯展開交換枚舉，固定 k 後兩側獨立成 D(n/k)D(m/k)。分塊不改變每項權重。
common_errors:
  - 線性篩 d(p^a) 的指數轉移寫錯
  - 把 D 當成單點 d
  - 乘積中間值使用 32 位元
complexity:
  time: O(V + T sqrt(V))
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
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int tests; cin >> tests;
      vector<pair<int, int>> query(static_cast<size_t>(tests));
      int maximum = 1;
      for (auto& [n, m] : query) { cin >> n >> m; maximum = max(maximum, max(n, m)); }
      vector<int> mu(static_cast<size_t>(maximum) + 1), divisors(static_cast<size_t>(maximum) + 1);
      vector<int> exponent(static_cast<size_t>(maximum) + 1), primes;
      vector<char> composite(static_cast<size_t>(maximum) + 1, false);
      mu[1] = 1; divisors[1] = 1;
      for (int i = 2; i <= maximum; ++i) {
          if (!composite[static_cast<size_t>(i)]) {
              primes.push_back(i); mu[static_cast<size_t>(i)] = -1;
              divisors[static_cast<size_t>(i)] = 2; exponent[static_cast<size_t>(i)] = 1;
          }
          for (int p : primes) {
              if (p > maximum / i) break;
              const int next = i * p; composite[static_cast<size_t>(next)] = true;
              if (i % p == 0) {
                  mu[static_cast<size_t>(next)] = 0;
                  exponent[static_cast<size_t>(next)] = exponent[static_cast<size_t>(i)] + 1;
                  divisors[static_cast<size_t>(next)] = divisors[static_cast<size_t>(i)] /
                      (exponent[static_cast<size_t>(i)] + 1) * (exponent[static_cast<size_t>(next)] + 1);
                  break;
              }
              mu[static_cast<size_t>(next)] = -mu[static_cast<size_t>(i)];
              exponent[static_cast<size_t>(next)] = 1;
              divisors[static_cast<size_t>(next)] = divisors[static_cast<size_t>(i)] * 2;
          }
      }
      vector<long long> prefix_divisors(static_cast<size_t>(maximum) + 1, 0);
      for (int i = 1; i <= maximum; ++i) {
          mu[static_cast<size_t>(i)] += mu[static_cast<size_t>(i - 1)];
          prefix_divisors[static_cast<size_t>(i)] =
              prefix_divisors[static_cast<size_t>(i - 1)] + divisors[static_cast<size_t>(i)];
      }
      for (const auto& [n, m] : query) {
          long long answer = 0;
          for (int left = 1, limit = min(n, m); left <= limit;) {
              const int right = min(n / (n / left), m / (m / left));
              answer += static_cast<long long>(mu[static_cast<size_t>(right)] -
                        mu[static_cast<size_t>(left - 1)]) *
                        prefix_divisors[static_cast<size_t>(n / left)] *
                        prefix_divisors[static_cast<size_t>(m / left)];
              left = right + 1;
          }
          cout << answer << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3327
external_platform: 洛谷
external_problem_id: 'P3327'
external_title: '[SDOI2015] 約數個數和'
external_relation: original
original_label: '洛谷 P3327'
source_book_pages: [450, 456]
source_pdf_pages: [80, 86]
review_status: verified
---

推導比程式更重要：先把 d(ij) 改寫成互質約數對。

原始題單中本題位於第 6.16 節、習題 第 4 題；競賽來源記為「SDOI2015」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
