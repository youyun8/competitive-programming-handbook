---
id: luogu-p2387
volume: upper
source_file: upper-volume
title: '洛谷 P2387 [NOI2014] 魔法森林'
chapter: 4
section: '4.18'
kind: external-oj
difficulty: 5
topics: ['排序掃描', '動態最小生成森林', 'Link-Cut Tree']
prerequisites: ['排序掃描', '動態最小生成森林', 'Link-Cut Tree']
statement: |-
  無向邊有需求 (a,b)；求一條 1 到 n 路徑，使路徑最大 a 加最大 b 最小。
constraints:
  - 'n <= 50000'
  - 'm <= 100000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      4 5
      1 2 19 1
      2 3 1 17
      3 4 17 1
      1 3 17 17
      2 4 1 15
    output: |-
      34
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['排序掃描', '動態最小生成森林', 'Link-Cut Tree']
judgment: |-
  目標是兩種最大值之和，不是逐邊 a+b 的最短路。
hints:
  - '先辨識核心模型：排序掃描、動態最小生成森林、Link-Cut Tree；暫時不要處理所有操作細節。'
  - '目標是兩種最大值之和，不是逐邊 a+b 的最短路。'
  - '最後依此不變量實作：按 a 遞增加入邊，LCT 維護以 b 為權的最小生成森林。若新邊成環且路徑最大 b 更大就替換；每處理一個 a，若 1、n 連通，以 a+樹路徑最大 b 更新答案。'
solution_outline: |-
  按 a 遞增加入邊，LCT 維護以 b 為權的最小生成森林。若新邊成環且路徑最大 b 更大就替換；每處理一個 a，若 1、n 連通，以 a+樹路徑最大 b 更新答案。
proof_or_invariant: |-
  掃到 a 時可用邊恰為 a_i<=a。其 b 最小瓶頸由該子圖 MST 路徑給出；環交換維護此 MST。枚舉所有邊 a 值，涵蓋任一最優路徑的最大 a。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O(m log n)'
  space: 'O(n+m)'
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
  // P2387.cpp
  #include <bits/stdc++.h>
  #define lson ch[p][0]
  #define rson ch[p][1]

  using namespace std;

  const int MAX_N = 2e5 + 200;

  struct edge
  {
      int src, dst, ai, bi;
      bool operator<(const edge &edg) const { return ai < edg.ai || (ai == edg.ai && bi < edg.bi); }
  } edges[MAX_N];

  int n, m, ch[MAX_N][2], fa[MAX_N], idx[MAX_N], val[MAX_N], tag[MAX_N];

  inline bool isRoot(int p) { return ch[fa[p]][0] != p && ch[fa[p]][1] != p; }

  inline int check(int p) { return ch[fa[p]][1] == p; }

  inline void pushup(int p)
  {
      idx[p] = p;
      if (lson && val[idx[lson]] > val[idx[p]])
          idx[p] = idx[lson];
      if (rson && val[idx[rson]] > val[idx[p]])
          idx[p] = idx[rson];
  }

  inline void pushdown(int p)
  {
      if (tag[p])
      {
          tag[p] = 0;
          if (lson)
              tag[lson] ^= 1, swap(ch[lson][0], ch[lson][1]);
          if (rson)
              tag[rson] ^= 1, swap(ch[rson][0], ch[rson][1]);
      }
  }

  inline void rotate(int p)
  {
      int y = fa[p], z = fa[y], dir = check(p), w = ch[p][dir ^ 1];
      fa[p] = z;
      if (!isRoot(y))
          ch[z][check(y)] = p;
      ch[y][dir] = w, fa[w] = y;
      ch[p][dir ^ 1] = y, fa[y] = p;
      pushup(y), pushup(p), pushup(z);
  }

  inline void jump(int p)
  {
      if (!isRoot(p))
          jump(fa[p]);
      pushdown(p);
  }

  inline void splay(int p)
  {
      jump(p);
      for (int fat = fa[p]; fat = fa[p], !isRoot(p); rotate(p))
          if (!isRoot(fat))
              rotate(check(fat) == check(p) ? fat : p);
  }

  inline void access(int p)
  {
      for (int fat = 0; p != 0; fat = p, p = fa[p])
          splay(p), ch[p][1] = fat, pushup(p);
  }

  inline void makeRoot(int p)
  {
      access(p), splay(p);
      swap(lson, rson), tag[p] ^= 1;
  }

  inline int find(int p)
  {
      access(p), splay(p);
      while (lson)
          p = lson;
      splay(p);
      return p;
  }

  inline void link(int x, int y)
  {
      makeRoot(x);
      fa[x] = y;
  }

  inline void split(int x, int y)
  {
      makeRoot(x);
      access(y), splay(y);
  }

  inline bool check(int x, int y)
  {
      makeRoot(x);
      return find(y) == x;
  }

  int main()
  {
      scanf("%d%d", &n, &m);
      for (int i = 1; i <= m; i++)
          scanf("%d%d%d%d", &edges[i].src, &edges[i].dst, &edges[i].ai, &edges[i].bi);

      int ans = 2e9;
      sort(edges + 1, edges + 1 + m);

      for (int i = 1; i <= m; i++)
      {
          int id = i + n;
          val[id] = edges[i].bi;
          if (edges[i].src == edges[i].dst)
              continue;
          if (!check(edges[i].src, edges[i].dst))
              link(edges[i].src, id), link(id, edges[i].dst);
          else
          {
              split(edges[i].src, edges[i].dst);
              int now = idx[edges[i].dst], maxb = val[now];
              if (maxb <= edges[i].bi)
                  continue;
              splay(now), fa[ch[now][0]] = fa[ch[now][1]] = 0;
              link(edges[i].src, id), link(id, edges[i].dst);
          }
          if (check(1, n))
              split(1, n), ans = min(ans, edges[i].ai + val[idx[n]]);
      }
      if (ans < 2e9)
          printf("%d", ans);
      else
          puts("-1");
      return 0;
  } // P2387.cpp
external_url: https://www.luogu.com.cn/problem/P2387
external_platform: '洛谷'
external_problem_id: 'P2387'
external_title: '[NOI2014] 魔法森林'
external_relation: original
source_book_pages: [310, 317]
source_pdf_pages: [328, 335]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
