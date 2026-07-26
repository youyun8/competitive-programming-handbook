---
id: luogu-p4475
volume: upper
source_file: upper-volume
title: '洛谷 P4475 巧克力王國'
chapter: 4
section: '4.17'
kind: external-oj
difficulty: 5
topics: ['KD-tree', '半平面查詢', '包圍盒線性極值']
prerequisites: ['KD-tree', '半平面查詢', '包圍盒線性極值']
statement: |-
  每塊巧克力有 (x,y) 與美味值 h；每問 a,b,c，求所有滿足 ax+by<c 的 h 總和。
constraints:
  - 'n,m <= 50000'
  - '係數與座標絕對值 <= 1000000000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      3 3
      1 2 5
      3 1 4
      2 2 1
      2 1 6
      1 3 5
      1 3 7
    output: |-
      5
      0
      4
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['KD-tree', '半平面查詢', '包圍盒線性極值']
judgment: |-
  a、b、座標可為負，判斷盒內最大最小線性值時須依係數符號選角。
hints:
  - '先辨識核心模型：KD-tree、半平面查詢、包圍盒線性極值；暫時不要處理所有操作細節。'
  - 'a、b、座標可為負，判斷盒內最大最小線性值時須依係數符號選角。'
  - '最後依此不變量實作：KD-tree 節點維護包圍盒及子樹 h 和。對每問計算盒內 ax+by 的最小與最大：最大仍小於 c 時整棵取和，最小已不小於 c 時剪除，其餘遞迴。'
solution_outline: |-
  KD-tree 節點維護包圍盒及子樹 h 和。對每問計算盒內 ax+by 的最小與最大：最大仍小於 c 時整棵取和，最小已不小於 c 時剪除，其餘遞迴。
proof_or_invariant: |-
  線性函數在軸對齊矩形上的極值必在角落；兩個整體判定分別保證全收或全拒，部分相交時遞迴逐點判定，故總和精確。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: '期望 O(m sqrt(n))'
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
  // P4475.cpp
  #include <bits/stdc++.h>

  using namespace std;

  const int MAX_N = 5e4 + 200;

  typedef long long ll;

  int n, m, current_frame, groot;

  struct node
  {
      ll d[2], max_val[2], min_val[2], sum, val;
      int lson, rson;
      bool operator<(const node &rhs) const { return d[current_frame] < rhs.d[current_frame] || (d[current_frame] == rhs.d[current_frame] && d[!current_frame] < rhs.d[!current_frame]); }
  } nodes[MAX_N];

  void pushup(int p)
  {
      for (int i = 0; i < 2; i++)
      {
          nodes[p].max_val[i] = nodes[p].min_val[i] = nodes[p].d[i];
          if (nodes[p].lson)
              nodes[p].max_val[i] = max(nodes[nodes[p].lson].max_val[i], nodes[p].max_val[i]);
          if (nodes[p].rson)
              nodes[p].max_val[i] = max(nodes[nodes[p].rson].max_val[i], nodes[p].max_val[i]);
          if (nodes[p].lson)
              nodes[p].min_val[i] = min(nodes[nodes[p].lson].min_val[i], nodes[p].min_val[i]);
          if (nodes[p].rson)
              nodes[p].min_val[i] = min(nodes[nodes[p].rson].min_val[i], nodes[p].min_val[i]);
      }
      nodes[p].sum = nodes[p].val;
      if (nodes[p].lson)
          nodes[p].sum += nodes[nodes[p].lson].sum;
      if (nodes[p].rson)
          nodes[p].sum += nodes[nodes[p].rson].sum;
  }

  int build(int l, int r)
  {
      if (l > r)
          return 0;
      int p = (l + r) >> 1;
      nth_element(nodes + l, nodes + p, nodes + r + 1);
      current_frame ^= 1;
      nodes[p].lson = build(l, p - 1), nodes[p].rson = build(p + 1, r);
      current_frame ^= 1;
      pushup(p);
      return p;
  }

  int check(int p, ll a, ll b, ll c)
  {
      if (a >= 0 && b >= 0)
      {
          if (nodes[p].max_val[0] * a + nodes[p].max_val[1] * b < c)
              return 1;
          if (nodes[p].min_val[0] * a + nodes[p].min_val[1] * b >= c)
              return -1;
      }
      if (a >= 0 && b < 0)
      {
          if (nodes[p].max_val[0] * a + nodes[p].min_val[1] * b < c)
              return 1;
          if (nodes[p].min_val[0] * a + nodes[p].max_val[1] * b >= c)
              return -1;
      }
      if (a < 0 && b >= 0)
      {
          if (nodes[p].min_val[0] * a + nodes[p].max_val[1] * b < c)
              return 1;
          if (nodes[p].max_val[0] * a + nodes[p].min_val[1] * b >= c)
              return -1;
      }
      if (a < 0 && b < 0)
      {
          if (nodes[p].min_val[0] * a + nodes[p].min_val[1] * b < c)
              return 1;
          if (nodes[p].max_val[0] * a + nodes[p].max_val[1] * b >= c)
              return -1;
      }
      return 0;
  }

  ll query(int p, ll a, ll b, ll c)
  {
      if (p == 0)
          return 0;
      int res = check(p, a, b, c);
      if (res == 1)
          return nodes[p].sum;
      if (res == -1)
          return 0;
      ll sum = 1LL * nodes[p].val * (1LL * a * nodes[p].d[0] + 1LL * b * nodes[p].d[1] < c);
      if (nodes[p].lson)
          sum += query(nodes[p].lson, a, b, c);
      if (nodes[p].rson)
          sum += query(nodes[p].rson, a, b, c);
      return sum;
  }

  int main()
  {
      scanf("%d%d", &n, &m);
      for (int i = 1; i <= n; i++)
          scanf("%lld%lld%lld", &nodes[i].d[0], &nodes[i].d[1], &nodes[i].val);
      groot = build(1, n);
      while (m--)
      {
          int a, b, c;
          scanf("%d%d%d", &a, &b, &c);
          printf("%lld\n", query(groot, a, b, c));
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4475
external_platform: '洛谷'
external_problem_id: 'P4475'
external_title: '巧克力王國'
external_relation: original
source_book_pages: [300, 309]
source_pdf_pages: [318, 327]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
