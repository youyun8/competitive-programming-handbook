---
id: luogu-p4148
volume: upper
source_file: upper-volume
title: '洛谷 P4148 簡單題'
chapter: 4
section: '4.17'
kind: external-oj
difficulty: 5
topics: ['動態 KD-tree', '矩形和', '替罪羊式重建']
prerequisites: ['動態 KD-tree', '矩形和', '替罪羊式重建']
statement: |-
  維護 N×N 棋盤的單點加值與矩形和；除操作碼外的參數均 XOR 上次答案。
constraints:
  - 'N <= 500000'
  - '操作數 <= 200000'
  - '答案在 int 範圍'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      4
      1 2 3 3
      2 1 1 3 3
      3
    output: |-
      3
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['動態 KD-tree', '矩形和', '替罪羊式重建']
judgment: |-
  強制在線，不能先離線做 CDQ；重複座標的加值必累加。
hints:
  - '先辨識核心模型：動態 KD-tree、矩形和、替罪羊式重建；暫時不要處理所有操作細節。'
  - '強制在線，不能先離線做 CDQ；重複座標的加值必累加。'
  - '最後依此不變量實作：動態插入 KD-tree，節點維護點值、子樹和與包圍盒；失衡時攤平重建。矩形查詢對完全包含盒直接取和，完全相離剪枝，否則檢查節點並遞迴。'
solution_outline: |-
  動態插入 KD-tree，節點維護點值、子樹和與包圍盒；失衡時攤平重建。矩形查詢對完全包含盒直接取和，完全相離剪枝，否則檢查節點並遞迴。
proof_or_invariant: |-
  包圍盒分類精確：完全包含時子樹每點都應計入，相離時皆不應計入，部分相交時遞迴逐點決定。重建不改點集合與聚合值。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: '期望 O((U+Q)sqrt(U))'
  space: 'O(U)'
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
  const int N = 2e5 + 5, inf = 1e9;
  const double alp = 0.75;
  inline bool cmax(int &x, const int &y) { return x<y? x=y, 1: 0; }
  inline bool cmin(int &x, const int &y) { return x>y? x=y, 1: 0; }

  int n, x, y, op, a, b, c, d, ans;

  namespace KDT {
      int D, rt, tot, id[N];
  #define F(i) For(i, 0, 1)
      struct P {
          int o[2], v;
          P(int x = 0, int y = 0, int v = 0): v(v) { o[0] = x; o[1] = y; }
          int operator [] (const int &i) const { return o[i]; }
          bool operator < (const P &a) const { return o[D] < a.o[D]; }
      };
      struct Node {
          int l, r, sz, s, x[2][2];
          P v;
          Node() { l = r = sz = s = 0; }
          Node(const P &p): v(p) { l = r = 0; sz = 1; s = p.v; F(i) F(j) x[i][j] = p[i]; }
          Node(const int &a, const int &b, const int &c, const int &d) { x[0][0] = a; x[0][1] = c; x[1][0] = b; x[1][1] = d; }
          bool out(const Node &a) const { F(i) if (x[i][0] > a.x[i][1] || x[i][1] < a.x[i][0]) return 1; return 0; }
          bool in(const Node &a) const { F(i) if (x[i][0] < a.x[i][0] || x[i][1] > a.x[i][1]) return 0; return 1; }
      } o[N];
  #define ls o[u].l
  #define rs o[u].r
      inline void up(int u) {
          F(i) {
              o[u].x[i][0] = o[u].x[i][1] = o[u].v[i];
              if (ls) cmin(o[u].x[i][0], o[ls].x[i][0]), cmax(o[u].x[i][1], o[ls].x[i][1]);
              if (rs) cmin(o[u].x[i][0], o[rs].x[i][0]), cmax(o[u].x[i][1], o[rs].x[i][1]);
          }
          o[u].sz = o[ls].sz + o[rs].sz + 1;
          o[u].s = o[ls].s + o[rs].s + o[u].v.v;
      }
      inline void pia(int u, int s) { if (!u) return; pia(ls, s); s += o[ls].sz + 1; id[s] = u; pia(rs, s); }
      int build(int l, int r, int d = 0) {
          if (l > r) return 0;
          int m = (l + r) >> 1;
          D = d; nth_element(id + l, id + m, id + r + 1, [&](const int &a, const int &b) { return o[a].v < o[b].v; } );
          int u = id[m];
          ls = build(l, m - 1, d ^ 1); rs = build(m + 1, r, d ^ 1); up(u);
          return u;
      }
      inline void check(int &u, int d) { if (max(o[ls].sz, o[rs].sz) > alp * o[u].sz) pia(u, 0), u = build(1, o[u].sz, d); }
      void ins(int &u, const P &p, int d = 0) {
          if (!u) return u = ++tot, o[u] = Node(p), void();
          D = d; p < o[u].v? ins(ls, p, d ^ 1): ins(rs, p, d ^ 1); up(u); check(u, d);
      }
      int query(int u, Node p) {
          if (!u || o[u].out(p)) return 0;
          if (o[u].in(p)) return o[u].s;
          return Node(o[u].v).in(p) * o[u].v.v + query(ls, p) + query(rs, p);
      }
  }
  using namespace KDT;

  int main() {
      ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);
      cin >> n;
      while (cin >> op, op ^ 3) {
          if (op == 1) {
              cin >> x >> y >> d; x ^= ans; y ^= ans; d ^= ans;
              ins(rt, P(x, y, d));
          } else {
              cin >> a >> b >> c >> d; a ^= ans; b ^= ans; c ^= ans; d ^= ans;
              cout << (ans = query(rt, Node(a, b, c, d))) << endl;
          }
      }

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4148
external_platform: '洛谷'
external_problem_id: 'P4148'
external_title: '簡單題'
external_relation: original
source_book_pages: [300, 309]
source_pdf_pages: [318, 327]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
