---
id: luogu-p2042
volume: upper
source_file: upper-volume
title: '洛谷 P2042 [NOI2005] 維護數列'
chapter: 4
section: '4.16'
kind: external-oj
difficulty: 5
topics: ['隱式伸展樹', '區間懶標記', '最大子段資訊']
prerequisites: ['隱式伸展樹', '區間懶標記', '最大子段資訊']
statement: |-
  維護一個至少含一項的整數序列，支援插入、刪除、區間賦值、區間反轉、區間和與全域非空最大子段和。
constraints:
  - '1 <= M <= 20000'
  - '任一時刻序列長度 <= 500000'
  - '插入總數 <= 4000000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      9 8
      2 -6 3 5 1 -5 -3 6 3
      GET-SUM 5 4
      MAX-SUM
      INSERT 8 3 -5 7 2
      DELETE 12 1
      MAKE-SAME 3 3 2
      REVERSE 3 6
      GET-SUM 5 4
      MAX-SUM
    output: |-
      -1
      10
      1
      10
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['隱式伸展樹', '區間懶標記', '最大子段資訊']
judgment: |-
  MAX-SUM 要求非空子段；賦值與反轉標記下傳順序不可互換。
hints:
  - '先辨識核心模型：隱式伸展樹、區間懶標記、最大子段資訊；暫時不要處理所有操作細節。'
  - 'MAX-SUM 要求非空子段；賦值與反轉標記下傳順序不可互換。'
  - '最後依此不變量實作：以兩個哨兵包住序列；把操作區間隔離成根的右兒子的左子樹。節點維護大小、總和、最大前綴／後綴／子段和，並支援賦值與反轉懶標記。'
solution_outline: |-
  以兩個哨兵包住序列；把操作區間隔離成根的右兒子的左子樹。節點維護大小、總和、最大前綴／後綴／子段和，並支援賦值與反轉懶標記。
proof_or_invariant: |-
  中序順序始終等於序列。pull 使用左右子樹與節點值的所有跨界組合，故三種最大值正確；區間隔離後的懶操作恰作用於指定連續段。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O((N+插入總數)+M log L)'
  space: 'O(L)'
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

  #define For(i, l, r) for (int i = (l); i <= (r); ++i)
  const int N = 5e5 + 5, inf = 1e9;

  struct IO {
      char c; int f;
  #define gc() getchar()
      template<class C>
      inline IO& operator >> (C &x) {
          x = 0; f = 1;
          while (!isdigit(c = gc()) && ~c) f |= -!(c ^ 45);
          while (isdigit(c)) x = (x << 3) + (x << 1) + (c ^ 48), c = gc();
          x *= f; return *this;
      }
      inline bool operator ~ () const { return ~c; }
  } io;

  namespace Treap {
      int rt, tot, rub[N], top;
      struct Node {
          int l, r, v, sz, s, t, rev; int heap;
          int mx, lm, rm;
          Node() { l = r = sz = s = t = rev = lm = rm = 0; mx = -inf; }
          Node(int v): v(v), heap(rand()) { l = r = t = rev = 0; sz = 1; s = mx = v; lm = rm = max(v, 0); }
      } o[N];
  #define ls o[p].l
  #define rs o[p].r
  #define goL ls, u, ls
  #define goR rs, rs, v
      inline int newnode(const int &v) { int p = top? rub[top--]: ++tot; o[p] = Node(v); return p; }
      inline void del(int p) { if (!p) return; del(ls); del(rs); rub[++top] = p; }
      inline int up(int p) {
          o[p].s = o[ls].s + o[rs].s + o[p].v;
          o[p].sz = o[ls].sz + o[rs].sz + 1;
          o[p].mx = max(o[ls].rm + o[p].v + o[rs].lm, max(o[ls].mx, o[rs].mx));
          o[p].lm = max(o[ls].lm, o[ls].s + o[p].v + o[rs].lm);
          o[p].rm = max(o[rs].rm, o[rs].s + o[p].v + o[ls].rm);
          return p;
      }
      inline void rev(int p) { if (p) swap(ls, rs), swap(o[p].lm, o[p].rm), o[p].rev ^= 1; }
      inline void mark(int p, const int &x) { if (p) o[p].v = x, o[p].s = o[p].sz * x, o[p].mx = max(o[p].s, x), o[p].lm = o[p].rm = max(o[p].s, 0), o[p].t = 1; }
      inline void down(int p) { if (o[p].rev) rev(ls), rev(rs), o[p].rev = 0; if (o[p].t) mark(ls, o[p].v), mark(rs, o[p].v), o[p].t = 0; }
      inline void split_r(int p, int &u, int &v, const int &k) {
          if (!p) return void(u = v = 0);
          down(p);
          if (o[ls].sz + 1 <= k) u = p, split_r(goR, k - o[ls].sz - 1);
          else v = p, split_r(goL, k);
          up(p);
      }
      inline int merge(int u, int v) {
          if (!u || !v) return u | v;
          if (o[u].heap < o[v].heap) { down(u); o[u].r = merge(o[u].r, v); return up(u); }
          else { down(v); o[v].l = merge(u, o[v].l); return up(v); }
      }
  }
  using namespace Treap;

  int n, m, k, x, u, v;
  char op[20];

  int main() {
      srand(time(0));
      io >> n >> m;
      For (i, 1, n) io >> x, rt = merge(rt, newnode(x));
      while (m--) {
          scanf("%s", op);
          if (op[2] == 'S') {
              io >> k >> n;
              split_r(rt, u, rt, k);
              For (i, 1, n) io >> x, u = merge(u, newnode(x));
              rt = merge(u, rt);
          } else if (op[2] == 'L') {
              io >> k >> n;
              split_r(rt, rt, u, k - 1); split_r(u, u, v, n);
              del(u);
              rt = merge(rt, v);
          } else if (op[2] == 'K') {
              io >> k >> n >> x;
              split_r(rt, rt, u, k - 1); split_r(u, u, v, n);
              mark(u, x);
              rt = merge(rt, merge(u, v));
          } else if (op[2] == 'V') {
              io >> k >> n;
              split_r(rt, rt, u, k - 1); split_r(u, u, v, n);
              rev(u);
              rt = merge(rt, merge(u, v));
          } else if (op[2] == 'T') {
              io >> k >> n;
              split_r(rt, rt, u, k - 1); split_r(u, u, v, n);
              printf("%d\n", o[u].s);
              rt = merge(rt, merge(u, v));
          } else if (op[2] == 'X') {
              printf("%d\n", o[rt].mx);
          }
      }

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2042
external_platform: '洛谷'
external_problem_id: 'P2042'
external_title: '[NOI2005] 維護數列'
external_relation: original
source_book_pages: [296, 299]
source_pdf_pages: [314, 317]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
