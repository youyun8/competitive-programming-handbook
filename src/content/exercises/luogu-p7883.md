---
id: luogu-p7883
volume: upper
source_file: upper-volume
title: '洛谷 P7883 平面最近點對（加強加強版）'
chapter: 4
section: '4.17'
kind: external-oj
difficulty: 5
topics: ['平面分治', '最近點對', '按 y 合併']
prerequisites: ['平面分治', '最近點對', '按 y 合併']
statement: |-
  給定互異整點，輸出最近兩點的歐氏距離平方。
constraints:
  - '沒有重複點'
  - '座標與 n 依官方題面'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      5
      1 1
      1 9
      9 1
      9 9
      0 10
    output: |-
      2
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['平面分治', '最近點對', '按 y 合併']
judgment: |-
  全程比較平方距離以避免浮點誤差與溢位。
hints:
  - '先辨識核心模型：平面分治、最近點對、按 y 合併；暫時不要處理所有操作細節。'
  - '全程比較平方距離以避免浮點誤差與溢位。'
  - '最後依此不變量實作：先按 x 排序，遞迴求左右答案並把各段按 y 合併；只收集與中線水平距離平方小於目前答案的點，按 y 順序檢查垂直距離仍可能改善的後繼。'
solution_outline: |-
  先按 x 排序，遞迴求左右答案並把各段按 y 合併；只收集與中線水平距離平方小於目前答案的點，按 y 順序檢查垂直距離仍可能改善的後繼。
proof_or_invariant: |-
  最優點對若同側由遞迴得到；若跨側，兩點都在中線條帶。平面裝箱性質保證每點只需比較常數個後繼，所有跨側候選不漏。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O(n log n)'
  space: 'O(n)'
cpp_skeleton: |-
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依題卡的不變量完成平衡樹、KD-tree 或 Link-Cut Tree。
      return 0;
  }
cpp_solution: |-
  #if defined(__GNUC__)
  #pragma GCC diagnostic ignored "-Wconversion"
  #pragma GCC diagnostic ignored "-Wshadow"
  #pragma GCC diagnostic ignored "-Wpedantic"
  #pragma GCC diagnostic ignored "-Wsign-compare"
  #pragma GCC diagnostic ignored "-Wunused-parameter"
  #pragma GCC diagnostic ignored "-Wunused-variable"
  #pragma GCC diagnostic ignored "-Wunused-function"
  #pragma GCC diagnostic ignored "-Wunused-result"
  #pragma GCC diagnostic ignored "-Wparentheses"
  #pragma GCC diagnostic ignored "-Wmisleading-indentation"
  #pragma GCC diagnostic ignored "-Wdangling-else"
  #pragma GCC diagnostic ignored "-Wsequence-point"
  #pragma GCC diagnostic ignored "-Wclass-memaccess"
  #pragma GCC diagnostic ignored "-Wimplicit-fallthrough"
  #endif
  #include<bits/stdc++.h>
  using namespace std;

  #define st first
  #define nd second
  #define For(i, l, r) for (int i = (l); i <= (r); ++i)
  typedef long long ll;
  typedef pair<int, int > P;
  const int N = 4e5 + 5;
  const ll INF = 1e18;

  struct IO {
      static const int BufS = 1 << 20;
      char ibuf[BufS], *S, *T, c; int f;
  #define gc() ((S==T && (T=(S=ibuf)+fread(ibuf, 1, BufS, stdin)), S==T)? EOF: *S++)
      template<class C>
      inline IO& operator >> (C &x) {
          x = 0; f = 1;
          while (!isdigit(c = gc()) && ~c) f |= -!(c ^ 45);
          while (isdigit(c)) x = (x << 3) + (x << 1) + (c ^ 48), c = gc();
          x *= f; return *this;
      }
      inline bool operator ~ () const { return ~c; }
  } io;

  int n;
  P a[N], b[N];

  inline ll dist(const P &a, const P &b) { return 1ll * (a.st - b.st) * (a.st - b.st) + 1ll * (a.nd - b.nd) * (a.nd - b.nd); }

  inline ll solve(int l, int r) {
      if (l == r) return INF;
      int m = (l + r) >> 1;
      ll d1 = solve(l, m), d2 = solve(m + 1, r), D = min(d1, d2);
      int d = static_cast<int>(sqrt(static_cast<long double>(D)));
      int t = 0;
      For (i, l, r) if (abs(a[i].st - a[m].st) <= d) b[++t] = a[i];
      sort(b + 1, b + t + 1, [](P a, P b) { return a.nd < b.nd; });
      For (i, 1, t - 1) For (j, i + 1, t)
          if (b[j].nd - b[i].nd <= d) D = min(D, dist(b[i], b[j])); else break;
      return D;
  }

  int main() {
      io >> n;
      For (i, 1, n) io >> a[i].st >> a[i].nd;
      sort(a + 1, a + n + 1);
      printf("%lld", solve(1, n));

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P7883
external_platform: '洛谷'
external_problem_id: 'P7883'
external_title: '平面最近點對（加強加強版）'
external_relation: original
source_book_pages: [300, 309]
source_pdf_pages: [318, 327]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
