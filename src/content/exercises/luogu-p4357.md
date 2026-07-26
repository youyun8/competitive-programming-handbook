---
id: luogu-p4357
volume: upper
source_file: upper-volume
title: '洛谷 P4357 [CQOI2016] K 遠點對'
chapter: 4
section: '4.17'
kind: external-oj
difficulty: 5
topics: ['KD-tree', '最遠鄰', '小根堆']
prerequisites: ['KD-tree', '最遠鄰', '小根堆']
statement: |-
  給定平面點，輸出歐氏距離平方第 K 大的無序點對距離。
constraints:
  - 'n <= 100000'
  - 'K <= 100'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      10 5
      0 0
      0 1
      1 0
      1 1
      2 0
      2 1
      1 2
      0 2
      3 0
      3 1
    output: |-
      9
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['KD-tree', '最遠鄰', '小根堆']
judgment: |-
  逐點查詢會把每個無序點對算兩次，因此堆容量取 2K。
hints:
  - '先辨識核心模型：KD-tree、最遠鄰、小根堆；暫時不要處理所有操作細節。'
  - '逐點查詢會把每個無序點對算兩次，因此堆容量取 2K。'
  - '最後依此不變量實作：KD-tree 維護包圍盒。對每個點搜尋可能產生大距離的子樹，以盒中最遠角距離作上界；全域小根堆保留最大的 2K 個有序距離。'
solution_outline: |-
  KD-tree 維護包圍盒。對每個點搜尋可能產生大距離的子樹，以盒中最遠角距離作上界；全域小根堆保留最大的 2K 個有序距離。
proof_or_invariant: |-
  包圍盒上界不小於子樹內任意距離，故上界不超堆頂時可安全剪枝。所有可能進入前 2K 的有序對都被考慮，而每個無序對恰出現兩次，堆頂即第 K 大。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: '期望 O(n sqrt(n) log K)'
  space: 'O(n+K)'
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
  // P4357.cpp
  #include <bits/stdc++.h>
  #define ll long long

  using namespace std;

  const int MAX_N = 101000, INF = 0x3f3f3f3f;

  int n, k, opt, max_val[MAX_N << 1][2], min_val[MAX_N << 1][2], lson[MAX_N << 1], rson[MAX_N << 1], ptot;

  struct point
  {
      ll x[2];
  } pts[MAX_N], tree[MAX_N << 1];

  priority_queue<ll> q;

  bool compare(const point &a, const point &b) { return a.x[opt] < b.x[opt]; }

  void pushup(int p)
  {
      for (int i = 0; i < 2; i++)
          max_val[p][i] = min_val[p][i] = tree[p].x[i];
      if (lson[p])
          for (int i = 0; i < 2; i++)
              max_val[p][i] = max(max_val[p][i], max_val[lson[p]][i]), min_val[p][i] = min(min_val[p][i], min_val[lson[p]][i]);
      if (rson[p])
          for (int i = 0; i < 2; i++)
              max_val[p][i] = max(max_val[p][i], max_val[rson[p]][i]), min_val[p][i] = min(min_val[p][i], min_val[rson[p]][i]);
  }

  int build(int l, int r)
  {
      if (l > r)
          return 0;
      int p = ++ptot, mid = (l + r) >> 1;
      opt ^= 1;
      nth_element(pts + l, pts + mid, pts + 1 + r, compare), tree[p] = pts[mid];
      lson[p] = build(l, mid - 1), rson[p] = build(mid + 1, r);
      pushup(p);
      return p;
  }

  ll pow2(ll bas) { return bas * bas; }

  ll getDist(point a, point b) { return pow2(a.x[0] - b.x[0]) + pow2(a.x[1] - b.x[1]); }

  ll getMax(point a, int pt)
  {
      return max(pow2(a.x[0] - max_val[pt][0]), pow2(a.x[0] - min_val[pt][0])) + max(pow2(a.x[1] - max_val[pt][1]), pow2(a.x[1] - min_val[pt][1]));
  }

  void query(int p, point pt)
  {
      ll lb = -INF, rb = -INF;
      if (lson[p])
          lb = getMax(pt, lson[p]);
      if (rson[p])
          rb = getMax(pt, rson[p]);
      ll b = getDist(pt, tree[p]);
      if (-q.top() < b)
          q.pop(), q.push(-b);
      if (lb > rb)
      {
          if (-q.top() < lb)
              query(lson[p], pt);
          if (-q.top() < rb)
              query(rson[p], pt);
      }
      else
      {
          if (-q.top() < rb)
              query(rson[p], pt);
          if (-q.top() < lb)
              query(lson[p], pt);
      }
  }

  int main()
  {
      srand(time(NULL));
      scanf("%d%d", &n, &k);
      for (int i = 1; i <= n; i++)
          scanf("%lld%lld", &pts[i].x[0], &pts[i].x[1]);
      for (int i = 1; i <= 2 * k; i++)
          q.push(0);
      build(1, n);
      for (int i = 1; i <= n; i++)
          query(1, pts[i]);
      printf("%lld\n", -q.top());
      return 0;
  } // P4357.cpp
external_url: https://www.luogu.com.cn/problem/P4357
external_platform: '洛谷'
external_problem_id: 'P4357'
external_title: '[CQOI2016] K 遠點對'
external_relation: original
source_book_pages: [300, 309]
source_pdf_pages: [318, 327]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
