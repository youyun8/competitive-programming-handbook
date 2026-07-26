---
id: luogu-p3455
volume: lower
source_file: lower-volume
title: 洛谷 P3455 ZAP-Queries
chapter: 6
section: '6.16'
kind: external-oj
difficulty: 4
topics:
  - 莫比烏斯反演
  - 整除分塊
prerequisites:
  - mobius-inversion
statement: >-
  每組給 a,b,d，求 1<=x<=a、1<=y<=b 且 gcd(x,y)=d 的有序數對數量。
constraints:
  - 1 <= 詢問數 <= 50000
  - 1 <= d <= a,b <= 50000
input_format: >-
  第一行詢問數，接著每行 a,b,d。
output_format: >-
  每組輸出答案。
samples:
  - input: |
      2
      4 5 1
      4 5 2
    output: |
      15
      3
    explanation: >-
      第一組是 4*5 矩形內互質對，共 15；第二組除以 2 後為 2*2 矩形內互質對，共 3。樣例依官方格式設計並可直接枚舉對拍。
hints:
  - >-
    把 x,y 同除 d，問題變成兩個前綴範圍內的互質對。
  - >-
    用 sum_{t|gcd}mu(t) 表示 gcd=1。
  - >-
    floor(a/t)、floor(b/t) 相同的 t 可整段使用 mu 前綴和。
core_knowledge:
  - 互質對計數
  - 莫比烏斯反演
judgment: >-
  與 P2522 相同核心，但範圍從 1 開始，不需四矩形容斥。
solution_outline: >-
  預處理 mu 前綴和；每組先令 a/=d,b/=d，再整除分塊計算 sum mu(t)floor(a/t)floor(b/t)。
proof_or_invariant: >-
  縮放在 gcd=d 的數對與 gcd=1 的縮放數對間建立雙射。莫比烏斯指示恆等式及換序給出求和公式，分塊僅合併係數相同項。
common_errors:
  - 忘記先除以 d
  - mu 未做前綴和
  - 答案使用 32 位元
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
      struct Query { int a, b, k; int c = 1; int d = 1; };
      vector<Query> query(static_cast<size_t>(tests));
      int maximum = 1;
      for (Query& q : query) {
          cin >> q.a >> q.b >> q.k;
          q.c = 1; q.d = q.b; q.b = q.a; q.a = 1;
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
external_url: https://www.luogu.com.cn/problem/P3455
external_platform: 洛谷
external_problem_id: 'P3455'
external_title: '[POI 2007] ZAP-Queries'
external_relation: original
original_label: '洛谷 P3455'
source_book_pages: [450, 456]
source_pdf_pages: [80, 86]
review_status: verified
---

這是莫比烏斯反演計算互質對的標準模板。

原始題單中本題位於第 6.16 節、習題 第 3 題；競賽來源記為「POI 2007」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
