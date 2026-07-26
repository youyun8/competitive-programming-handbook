---
id: luogu-p3224
volume: upper
source_file: upper-volume
title: '洛谷 P3224 [HNOI2012] 永無鄉'
chapter: 4
section: '4.16'
kind: external-oj
difficulty: 5
topics: ['並查集', '可合併權值線段樹', '第 k 小']
prerequisites: ['並查集', '可合併權值線段樹', '第 k 小']
statement: |-
  島嶼各有互異重要度，初始有若干橋；支援連接兩個連通塊及查某點所在塊第 k 小重要度島號。
constraints:
  - 'n,q <= 100000'
  - '重要度互異'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      3 1
      1 2 3
      1 2
      3
      Q 1 2
      B 2 3
      Q 1 3
    output: |-
      2
      3
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['並查集', '可合併權值線段樹', '第 k 小']
judgment: |-
  查詢依重要度排序但輸出島號；不足 k 個輸出 -1。
hints:
  - '先辨識核心模型：並查集、可合併權值線段樹、第 k 小；暫時不要處理所有操作細節。'
  - '查詢依重要度排序但輸出島號；不足 k 個輸出 -1。'
  - '最後依此不變量實作：每個 DSU 根保存一棵動態權值線段樹，葉節點記對應島號。連邊時按 DSU 合併並遞迴合併兩棵線段樹；查詢按左右子樹大小下降。'
solution_outline: |-
  每個 DSU 根保存一棵動態權值線段樹，葉節點記對應島號。連邊時按 DSU 合併並遞迴合併兩棵線段樹；查詢按左右子樹大小下降。
proof_or_invariant: |-
  DSU 精確表示連通塊；線段樹每個葉恰對應塊內一島，merge 是集合聯集且不重複。第 k 次下降依計數跳過較小權值，故返回正確島號。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O((n+m+q)log n)'
  space: 'O(n log n)'
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
  // P3224.cpp
  #include <bits/stdc++.h>

  using namespace std;

  const int MAX_N = 4001000;

  struct node
  {
      int lson, rson, sum;
  } nodes[MAX_N];
  map<int, int> mp;

  int ptot, n, m, q, impt[MAX_N], root[MAX_N], fa[MAX_N];
  char opt[20];

  int merge(int pa, int pb, int l, int r)
  {
      if (pa == 0)
          return pb;
      if (pb == 0)
          return pa;
      nodes[pa].sum += nodes[pb].sum;
      if (l == r)
          return pa;
      int mid = (l + r) >> 1;
      nodes[pa].lson = merge(nodes[pa].lson, nodes[pb].lson, l, mid);
      nodes[pa].rson = merge(nodes[pa].rson, nodes[pb].rson, mid + 1, r);
      return pa;
  }

  int update(int qx, int l, int r, int p, int val)
  {
      if (p == 0)
          p = ++ptot;
      if (l == r)
      {
          nodes[p].sum += val;
          return p;
      }
      int mid = (l + r) >> 1;
      if (qx <= mid)
          nodes[p].lson = update(qx, l, mid, nodes[p].lson, val);
      else
          nodes[p].rson = update(qx, mid + 1, r, nodes[p].rson, val);
      nodes[p].sum = nodes[nodes[p].lson].sum + nodes[nodes[p].rson].sum;
      return p;
  }

  int query(int k, int l, int r, int p)
  {
      if (k > nodes[p].sum)
          return -1;
      if (l == r)
          return l;
      int lval = nodes[nodes[p].lson].sum, mid = (l + r) >> 1;
      if (k > lval)
          return query(k - lval, mid + 1, r, nodes[p].rson);
      else
          return query(k, l, mid, nodes[p].lson);
  }

  int find(int x) { return x == fa[x] ? x : fa[x] = find(fa[x]); }

  int main()
  {
      mp[-1] = -1;
      scanf("%d%d", &n, &m);
      for (int i = 1; i <= n; i++)
          scanf("%d", &impt[i]), root[i] = update(impt[i], 1, n, root[i], 1), fa[i] = i, mp[impt[i]] = i;
      for (int i = 1, u, v; i <= m; i++)
      {
          scanf("%d%d", &u, &v);
          if (find(u) != find(v))
          {
              root[find(v)] = merge(root[find(v)], root[find(u)], 1, n);
              fa[find(u)] = find(v);
          }
      }
      scanf("%d", &q);
      while (q--)
      {
          int u, v;
          scanf("%s%d%d", opt + 1, &u, &v);
          if (opt[1] == 'B')
          {
              if (find(u) != find(v))
              {
                  root[find(v)] = merge(root[find(v)], root[find(u)], 1, n);
                  fa[find(u)] = find(v);
              }
          }
          else
          {
              int tmp = query(v, 1, n, root[find(u)]);
              printf("%d\n", mp[tmp]);
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3224
external_platform: '洛谷'
external_problem_id: 'P3224'
external_title: '[HNOI2012] 永無鄉'
external_relation: original
source_book_pages: [296, 299]
source_pdf_pages: [314, 317]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
