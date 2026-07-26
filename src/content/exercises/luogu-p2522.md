---
id: luogu-p2522
volume: lower
source_file: lower-volume
title: 洛谷 P2522 Problem b
chapter: 6
section: '6.16'
kind: external-oj
difficulty: 4
topics:
  - 莫比烏斯反演
  - 整除分塊
  - 二維容斥
prerequisites:
  - mobius-inversion
  - divisor-summation
statement: >-
  每次詢問區間 a<=x<=b、c<=y<=d 中 gcd(x,y)=k 的有序數對數量。
constraints:
  - 1 <= 詢問數,k <= 50000
  - 1 <= a <= b <= 50000
  - 1 <= c <= d <= 50000
input_format: >-
  第一行詢問數；每組一行 a,b,c,d,k。
output_format: >-
  每組輸出符合數對數。
samples:
  - input: |
      2
      2 5 1 5 1
      1 5 1 5 2
    output: |
      14
      3
    explanation: >-
      第一組可直接枚舉驗得 14；第二組縮小 2 倍後是 [1,2] 方形中的互質對，共 3；官方樣例。
hints:
  - >-
    除以 k 後，gcd 恰為 k 變成 gcd=1。
  - >-
    [gcd(x,y)=1]=sum_{d|x,d|y}mu(d)。
  - >-
    先算左下角前綴 F(n,m)，再對四個矩形做容斥；F 用 mu 前綴和整除分塊。
core_knowledge:
  - 互質對計數
  - 莫比烏斯前綴和
judgment: >-
  多詢問且邊界只有五萬，預篩後每個矩形以整除分塊求值。
solution_outline: >-
  線性篩 mu 與前綴和。F(n,m)=sum mu(d) floor(n/d)floor(m/d)，依兩個商的共同右端點分塊；每次詢問用四次 F。
proof_or_invariant: >-
  莫比烏斯恆等式把互質指示函數展開，交換求和後每個 d 的倍數各有 floor(n/d)、floor(m/d) 個。二維前綴容斥精確留下指定矩形。
common_errors:
  - 縮放時錯用向上取整
  - 四矩形容斥符號錯誤
  - 分塊右端點只考慮 n 未考慮 m
complexity:
  time: O(V + Q sqrt(V))
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
  static long long coprime_pairs(int n, int m, const vector<int>& prefix_mu) {
      long long result = 0;
      const int limit = min(n, m);
      for (int left = 1; left <= limit;) {
          const int right = min(n / (n / left), m / (m / left));
          result += static_cast<long long>(prefix_mu[static_cast<size_t>(right)] -
                   prefix_mu[static_cast<size_t>(left - 1)]) * (n / left) * (m / left);
          left = right + 1;
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int tests; cin >> tests;
      struct Query { int a, b, c, d, k; };
      vector<Query> query(static_cast<size_t>(tests));
      int maximum = 1;
      for (Query& q : query) {
          cin >> q.a >> q.b >> q.c >> q.d >> q.k;
          maximum = max(maximum, max(q.b, q.d) / q.k);
      }
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
      for (int i = 1; i <= maximum; ++i) mu[static_cast<size_t>(i)] += mu[static_cast<size_t>(i - 1)];
      for (const Query& q : query) {
          auto count = [&](int x, int y) { return coprime_pairs(x / q.k, y / q.k, mu); };
          cout << count(q.b, q.d) - count(q.a - 1, q.d) - count(q.b, q.c - 1)
               + count(q.a - 1, q.c - 1) << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2522
external_platform: 洛谷
external_problem_id: 'P2522'
external_title: '[HAOI2011] Problem b'
external_relation: original
original_label: '洛谷 P2522'
source_book_pages: [450, 456]
source_pdf_pages: [80, 86]
review_status: verified
---

P3455 的區間加強版；核心前綴函式完全相同。

原始題單中本題位於第 6.16 節、習題 第 2 題；競賽來源記為「HAOI2011」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
