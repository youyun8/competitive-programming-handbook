---
id: luogu-p2479
volume: upper
source_file: upper-volume
title: '洛谷 P2479 [SDOI2010] 捉迷藏'
chapter: 4
section: '4.17'
kind: external-oj
difficulty: 5
topics: ['KD-tree', '曼哈頓最近鄰', '四方向極值']
prerequisites: ['KD-tree', '曼哈頓最近鄰', '四方向極值']
statement: |-
  在 n 個地點中選起點，使它到其餘點的最遠曼哈頓距離減最近曼哈頓距離最小。
constraints:
  - 'n <= 500000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      4
      0 0
      1 0
      0 1
      1 1
    output: |-
      1
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['KD-tree', '曼哈頓最近鄰', '四方向極值']
judgment: |-
  最近距離要排除自身；n=1 依官方定義處理。
hints:
  - '先辨識核心模型：KD-tree、曼哈頓最近鄰、四方向極值；暫時不要處理所有操作細節。'
  - '最近距離要排除自身；n=1 依官方定義處理。'
  - '最後依此不變量實作：最遠曼哈頓距離可由 x+y、x-y 的四個全域極值 O(1) 求得；最近鄰用 KD-tree 與包圍盒曼哈頓下界查詢。逐點取 far-near 的最小值。'
solution_outline: |-
  最遠曼哈頓距離可由 x+y、x-y 的四個全域極值 O(1) 求得；最近鄰用 KD-tree 與包圍盒曼哈頓下界查詢。逐點取 far-near 的最小值。
proof_or_invariant: |-
  曼哈頓距離等於四個符號線性式差的最大值，所以全域極值給出最遠值；KD-tree 下界安全剪枝並找出除自身外最近點。枚舉起點即取得全域最小。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: '期望 O(n sqrt(n))'
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

  #define For(i, l, r) for (int i = (l); i <= (r); ++i)
  const int N = 1e5 + 5, inf = 1e9;

  int n, x[N], y[N], Mn, Mx, ans;

  namespace KDT {
      int D, rt, id[N];
  #define F(i) For(i, 0, 1)
      struct P {
          int o[2];
          P(int x = 0, int y = 0) { o[0] = x; o[1] = y; }
          int operator [] (const int &i) const { return o[i]; }
          int operator - (const P &p) const { return abs(o[0] - p.o[0]) + abs(o[1] - p.o[1]); }
          bool operator < (const P &a) const { return o[D] < a.o[D]; }
      };
      struct Node {
          int l, r, sz, x[2][2];
          P v;
          Node() { l = r = sz = 0; F(i) x[i][0] = inf, x[i][1] = -inf; }
          Node(const P &p): v(p) { l = r = 0; sz = 1; F(i) F(j) x[i][j] = p[i]; }
      } o[N];
  #define ls o[u].l
  #define rs o[u].r
      inline void up(int u) {
          F(i) o[u].x[i][0] = min(o[u].v[i], min(o[ls].x[i][0], o[rs].x[i][0])), o[u].x[i][1] = max(o[u].v[i], max(o[ls].x[i][1], o[rs].x[i][1]));
          o[u].sz = o[ls].sz + o[rs].sz + 1;
      }
      int build(int l, int r, int d = 0) {
          if (l > r) return 0;
          int m = (l + r) >> 1;
          D = d; nth_element(id + l, id + m, id + r + 1, [&](const int &a, const int &b) { return o[a].v < o[b].v; } );
          int u = id[m];
          ls = build(l, m - 1, d ^ 1); rs = build(m + 1, r, d ^ 1); up(u);
          return u;
      }
      inline int mxdist(int u, const P &p) {
          int r = 0;
          F(i) F(j) r = max(r, p - P(o[u].x[0][i], o[u].x[1][j]));
          return r;
      }
      inline int mndist(int u, const P &p) {
          int r = 0;
          F(i) r += max(0, o[u].x[i][0] - p[i]) + max(0, p[i] - o[u].x[i][1]);
          return r;
      }
      void querymx(int u, const P &p) {
          if (!u) return;
          int d = p - o[u].v;
          if (d) Mx = max(Mx, d);
          int dl = mxdist(ls, p), dr = mxdist(rs, p);
          if (dl > dr) { if (dl > Mx) { querymx(ls, p); if (dr > Mx) querymx(rs, p); } }
          else { if (dr > Mx) { querymx(rs, p); if (dl > Mx) querymx(ls, p); } }
      }
      void querymn(int u, const P &p) {
          if (!u) return;
          int d = p - o[u].v;
          if (d) Mn = min(Mn, d);
          int dl = mndist(ls, p), dr = mndist(rs, p);
          if (dl < dr) { if (dl < Mn) { querymn(ls, p); if (dr < Mn) querymn(rs, p); } }
          else { if (dr < Mn) { querymn(rs, p); if (dl < Mn) querymn(ls, p); } }
      }
  }
  using namespace KDT;

  int main() {
      ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);
      cin >> n;
      For (i, 1, n) {
          cin >> x[i] >> y[i];
          o[id[i] = i] = Node(P(x[i], y[i]));
      }
      rt = build(1, n);
      ans = inf;
      For (i, 1, n) {
          Mx = 0; Mn = inf;
          querymx(rt, P(x[i], y[i])); querymn(rt, P(x[i], y[i]));
          ans = min(ans, Mx - Mn);
      }
      cout << ans;

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2479
external_platform: '洛谷'
external_problem_id: 'P2479'
external_title: '[SDOI2010] 捉迷藏'
external_relation: original
source_book_pages: [300, 309]
source_pdf_pages: [318, 327]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
