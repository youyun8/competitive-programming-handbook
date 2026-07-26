---
id: luogu-p4219
volume: upper
source_file: upper-volume
title: '洛谷 P4219 [BJOI2014] 大融合'
chapter: 4
section: '4.18'
kind: external-oj
difficulty: 5
topics: ['Link-Cut Tree', '虛子樹大小', '邊負載']
prerequisites: ['Link-Cut Tree', '虛子樹大小', '邊負載']
statement: |-
  從孤立點開始只加不成環的邊；詢問某條現有邊被目前連通樹中多少條簡單路徑經過。
constraints:
  - 'n,q <= 100000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      8 6
      A 2 3
      A 3 4
      A 3 8
      A 8 7
      A 6 5
      Q 3 8
    output: |-
      6
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['Link-Cut Tree', '虛子樹大小', '邊負載']
judgment: |-
  刪去詢問邊後兩側大小 s 與 total-s，答案為其乘積。
hints:
  - '先辨識核心模型：Link-Cut Tree、虛子樹大小、邊負載；暫時不要處理所有操作細節。'
  - '刪去詢問邊後兩側大小 s 與 total-s，答案為其乘積。'
  - '最後依此不變量實作：LCT 節點維護輔助樹大小與所有虛兒子大小。link 時更新虛貢獻；查邊 (x,y) 先 makeroot(x)、access(y)，此時 x 側大小與其補集可由暴露結構讀出並相乘。'
solution_outline: |-
  LCT 節點維護輔助樹大小與所有虛兒子大小。link 時更新虛貢獻；查邊 (x,y) 先 makeroot(x)、access(y)，此時 x 側大小與其補集可由暴露結構讀出並相乘。
proof_or_invariant: |-
  一條簡單路徑經過該邊，當且僅當兩端點分居刪邊後的兩個連通塊，因此數量是大小乘積。LCT 虛大小維護代表樹完整節點數，暴露後取得的兩側正是這兩塊。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: '均攤 O(log n) 每操作'
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
  // P4219.cpp
  #include <bits/stdc++.h>

  using namespace std;

  const int MAX_N = 1e5 + 200;

  int n, q, ch[MAX_N][2], siz[MAX_N], fa[MAX_N], tag[MAX_N], sum[MAX_N];
  char opt[10];

  #define lson ch[p][0]
  #define rson ch[p][1]

  void pushup(int p)
  {
      sum[p] = sum[lson] + sum[rson] + siz[p] + 1;
  }

  int check(int p) { return p == ch[fa[p]][1]; }

  bool isRoot(int p) { return ch[fa[p]][0] != p && ch[fa[p]][1] != p; }

  void pushdown(int p)
  {
      if (tag[p])
      {
          swap(lson, rson);
          tag[lson] ^= 1, tag[rson] ^= 1;
          tag[p] = 0;
      }
  }

  void rotate(int x)
  {
      int y = fa[x], z = fa[y], dir = check(x), w = ch[x][dir ^ 1];
      fa[x] = z;
      if (!isRoot(y))
          ch[z][ch[z][1] == y] = x;
      ch[y][dir] = w, fa[w] = y;
      ch[x][dir ^ 1] = y, fa[y] = x;
      pushup(y), pushup(x);
  }

  void update(int p)
  {
      if (!isRoot(p))
          update(fa[p]);
      pushdown(p);
  }

  void splay(int p)
  {
      update(p);
      for (int f = fa[p]; f = fa[p], !isRoot(p); rotate(p))
          if (!isRoot(f))
              rotate(check(f) == check(p) ? f : p);
  }

  void access(int p)
  {
      for (int fat = 0; p != 0; fat = p, p = fa[p])
          splay(p), siz[p] += sum[rson], siz[p] -= sum[rson = fat], pushup(p);
  }

  void makeRoot(int p)
  {
      access(p), splay(p);
      tag[p] ^= 1, pushdown(p);
  }

  int find(int p)
  {
      access(p), splay(p), pushdown(p);
      while (lson)
          pushdown(p = lson);
      splay(p);
      return p;
  }

  void split(int x, int y)
  {
      makeRoot(x);
      access(y), splay(y);
  }

  void link(int x, int y)
  {
      split(x, y);
      fa[x] = y, siz[y] += sum[x], pushup(y);
  }

  int main()
  {
      scanf("%d%d", &n, &q);
      for (int i = 1; i <= n; i++)
          sum[i] = 1;
      while (q--)
      {
          char opt[10];
          int x, y;
          scanf("%s%d%d", opt + 1, &x, &y);
          if (opt[1] == 'A')
              link(x, y);
          else
          {
              split(x, y);
              printf("%lld\n", 1LL * (siz[x] + 1) * (siz[y] + 1));
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4219
external_platform: '洛谷'
external_problem_id: 'P4219'
external_title: '[BJOI2014] 大融合'
external_relation: original
source_book_pages: [310, 317]
source_pdf_pages: [328, 335]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
