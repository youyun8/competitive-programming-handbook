---
id: luogu-p1829
volume: lower
source_file: lower-volume
title: 洛谷 P1829 Crash 的數字表格
chapter: 6
section: '6.14'
kind: external-oj
difficulty: 5
topics:
  - 莫比烏斯反演
  - 整除分塊
  - 最小公倍數
prerequisites:
  - divisor-summation
  - mobius-inversion
statement: >-
  求 sum_{i=1}^n sum_{j=1}^m lcm(i,j)，答案模 20101009。
constraints:
  - 1 <= n,m <= 10000000
input_format: >-
  一行兩個整數 n,m。
output_format: >-
  輸出二重和模 20101009。
samples:
  - input: |
      4 5
    output: |
      122
    explanation: >-
      官方樣例表格四列五欄的 lcm 總和為 122。
hints:
  - >-
    寫 i=gx,j=gy 且 gcd(x,y)=1，則 lcm(i,j)=gxy。
  - >-
    展開互質條件並換序，可把係數化為 h(t)=t*product_{p|t}(1-p)。
  - >-
    答案為 sum_t h(t) S(floor(n/t))S(floor(m/t))；h 做前綴和後整除分塊。
core_knowledge:
  - LCM 求和
  - 莫比烏斯換序
  - 積性函數篩
judgment: >-
  n,m 到千萬，須將雙重和化為單一積性函數前綴並分塊。
solution_outline: >-
  線性篩乘法函數 h：新質因子 p 時乘 p(1-p)，重複 p 時乘 p。建立 h 前綴和，按 n/t、m/t 的共同商區間累加係數區間和乘兩個等差和。
proof_or_invariant: >-
  固定 gcd=g 後對互質 x,y 求 gxy；以 [gcd=1]=sum_{k|x,k|y}mu(k) 展開，令 t=gk，t 的總係數為 sum_{k|t}(t/k)mu(k)k^2=t sum_{k|t}mu(k)k=h(t)。因此公式逐項等價。
common_errors:
  - 把洛谷單組輸入誤寫成 BZOJ 多組版本
  - h 的新質因子轉移漏乘 p
  - 負模數未正規化
complexity:
  time: O(min(n,m))
  space: O(min(n,m))
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
  static constexpr long long kMod = 20101009;
  static long long arithmetic_sum(long long n) {
      if (n % 2 == 0) return (n / 2 % kMod) * ((n + 1) % kMod) % kMod;
      return (n % kMod) * ((n + 1) / 2 % kMod) % kMod;
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, m; cin >> n >> m;
      const int limit = min(n, m);
      vector<long long> h(static_cast<size_t>(limit) + 1, 0);
      vector<int> primes;
      vector<char> composite(static_cast<size_t>(limit) + 1, false);
      h[1] = 1;
      for (int i = 2; i <= limit; ++i) {
          if (!composite[static_cast<size_t>(i)]) {
              primes.push_back(i);
              h[static_cast<size_t>(i)] = static_cast<long long>(i) * (1 - static_cast<long long>(i)) % kMod;
          }
          for (int p : primes) {
              if (p > limit / i) break;
              const int next = i * p; composite[static_cast<size_t>(next)] = true;
              if (i % p == 0) {
                  h[static_cast<size_t>(next)] = h[static_cast<size_t>(i)] * p % kMod;
                  break;
              }
              h[static_cast<size_t>(next)] = h[static_cast<size_t>(i)] *
                  (static_cast<long long>(p) * (1 - static_cast<long long>(p)) % kMod) % kMod;
          }
      }
      for (int i = 1; i <= limit; ++i)
          h[static_cast<size_t>(i)] = (h[static_cast<size_t>(i)] + h[static_cast<size_t>(i - 1)]) % kMod;
      long long answer = 0;
      for (int left = 1; left <= limit;) {
          const int right = min(n / (n / left), m / (m / left));
          const long long coefficient =
              (h[static_cast<size_t>(right)] - h[static_cast<size_t>(left - 1)] + kMod) % kMod;
          answer = (answer + coefficient * arithmetic_sum(n / left) % kMod *
                    arithmetic_sum(m / left)) % kMod;
          left = right + 1;
      }
      cout << (answer + kMod) % kMod << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1829
external_platform: 洛谷
external_problem_id: 'P1829'
external_title: '[集訓隊互測 2010] Crash 的數字表格 / JZPTAB'
external_relation: original
original_label: '洛谷 P1829'
source_book_pages: [442, 446]
source_pdf_pages: [72, 76]
review_status: verified
---

不同評測版本的輸入格式與模數不同；本卡嚴格採洛谷 P1829 現行題面。

原始題單中本題位於第 6.14 節、習題 第 1 題；競賽來源記為「集訓隊互測 2010」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
