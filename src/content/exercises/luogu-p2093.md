---
id: luogu-p2093
volume: upper
source_file: upper-volume
title: '洛谷 P2093 [國家集訓隊] JZPFAR'
chapter: 4
section: '4.17'
kind: external-oj
difficulty: 5
topics: ['KD-tree', 'k 遠鄰', '有界小根堆']
prerequisites: ['KD-tree', 'k 遠鄰', '有界小根堆']
statement: |-
  對每個查詢點與 k，輸出點集中距離平方第 k 大者的編號；等距時較小編號視為較大。
constraints:
  - 'n <= 100000'
  - 'm <= 10000'
  - 'k <= 20'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      3
      0 0
      3 0
      0 4
      2
      0 0 1
      0 0 2
    output: |-
      3
      2
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['KD-tree', 'k 遠鄰', '有界小根堆']
judgment: |-
  堆的比較鍵必同時含距離與反向編號，才能實作題定 tie-break。
hints:
  - '先辨識核心模型：KD-tree、k 遠鄰、有界小根堆；暫時不要處理所有操作細節。'
  - '堆的比較鍵必同時含距離與反向編號，才能實作題定 tie-break。'
  - '最後依此不變量實作：KD-tree 包圍盒提供到查詢點的最大可能距離。以大小 k 的小根堆保存目前最優候選，先搜尋上界較大的子樹，上界不優時剪枝。'
solution_outline: |-
  KD-tree 包圍盒提供到查詢點的最大可能距離。以大小 k 的小根堆保存目前最優候選，先搜尋上界較大的子樹，上界不優時剪枝。
proof_or_invariant: |-
  堆頂是目前第 k 大的最差候選；盒上界不可能被其子樹超過時安全剪枝。未剪除點都依題定二元比較加入，故最後堆頂編號正是答案。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: '期望 O(m sqrt(n)log k)'
  space: 'O(n+k)'
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
  // P2093.cpp
  #include <bits/stdc++.h>

  using namespace std;

  const int MAX_N = 1e5 + 200;

  typedef long long ll;

  int n, q, current_frame, groot;

  struct node
  {
      ll ch[2], d[2], mx[2], mn[2];
      int id;
      bool operator<(const node &rhs) const { return d[current_frame] < rhs.d[current_frame]; }
  } nodes[MAX_N];

  struct info
  {
      ll dist;
      int id;
      bool operator<(const info &rhs) const { return dist > rhs.dist || (dist == rhs.dist && id < rhs.id); }
  };

  priority_queue<info> pq;

  ll maxDist(node &rhs, ll X, ll Y)
  {
      return max((rhs.mn[0] - X) * (rhs.mn[0] - X), (rhs.mx[0] - X) * (rhs.mx[0] - X)) +
             max((rhs.mn[1] - Y) * (rhs.mn[1] - Y), (rhs.mx[1] - Y) * (rhs.mx[1] - Y));
  }

  ll getDist(node &rhs, ll X, ll Y) { return (X - rhs.d[0]) * (X - rhs.d[0]) + (Y - rhs.d[1]) * (Y - rhs.d[1]); }

  void pushup(int p)
  {
      for (int i = 0; i < 2; i++)
          nodes[p].mx[i] = nodes[p].mn[i] = nodes[p].d[i];
      for (int i = 0; i < 2; i++)
          if (nodes[p].ch[i])
              for (int d = 0; d < 2; d++)
              {
                  nodes[p].mn[d] = min(nodes[p].mn[d], nodes[nodes[p].ch[i]].mn[d]);
                  nodes[p].mx[d] = max(nodes[p].mx[d], nodes[nodes[p].ch[i]].mx[d]);
              }
  }

  int build(int l, int r)
  {
      if (l > r)
          return 0;
      int mid = (l + r) >> 1;
      nth_element(nodes + l, nodes + mid, nodes + r + 1), current_frame ^= 1;
      nodes[mid].ch[0] = build(l, mid - 1), nodes[mid].ch[1] = build(mid + 1, r);
      current_frame ^= 1, pushup(mid);
      return mid;
  }

  void query(int p, int x, int y)
  {
      if (p == 0)
          return;
      ll res = getDist(nodes[p], x, y);
      if (res > pq.top().dist || (res == pq.top().dist && nodes[p].id < pq.top().id))
          pq.pop(), pq.push(info{res, nodes[p].id});
      int ls = nodes[p].ch[0], rs = nodes[p].ch[1];
      ll lft = 0, rig = 0;
      if (ls)
          lft = maxDist(nodes[ls], x, y);
      if (rs)
          rig = maxDist(nodes[rs], x, y);
      if (lft > rig)
      {
          if (lft >= pq.top().dist)
              query(ls, x, y);
          if (rig >= pq.top().dist)
              query(rs, x, y);
      }
      else
      {
          if (rig >= pq.top().dist)
              query(rs, x, y);
          if (lft >= pq.top().dist)
              query(ls, x, y);
      }
  }

  int main()
  {
      scanf("%d", &n);
      for (int i = 1; i <= n; i++)
          scanf("%lld%lld", &nodes[i].d[0], &nodes[i].d[1]), nodes[i].id = i;
      groot = build(1, n), scanf("%d", &q);
      while (q--)
      {
          int x, y, k;
          scanf("%d%d%d", &x, &y, &k);
          while (!pq.empty())
              pq.pop();
          for (int i = 1; i <= k; i++)
              pq.push(info{-1, 0});
          query(groot, x, y), printf("%d\n", pq.top().id);
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2093
external_platform: '洛谷'
external_problem_id: 'P2093'
external_title: '[國家集訓隊] JZPFAR'
external_relation: original
source_book_pages: [300, 309]
source_pdf_pages: [318, 327]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
