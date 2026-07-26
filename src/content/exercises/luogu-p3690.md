---
id: luogu-p3690
volume: upper
source_file: upper-volume
title: '洛谷 P3690 【模板】動態樹（LCT）'
chapter: 4
section: '4.18'
kind: external-oj
difficulty: 5
topics: ['Link-Cut Tree', 'Splay', '路徑 XOR']
prerequisites: ['Link-Cut Tree', 'Splay', '路徑 XOR']
statement: |-
  維護森林點權 XOR，支援路徑 XOR、合法連邊、合法斷邊與單點改權。
constraints:
  - 'n,m <= 100000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      3 5
      1 2 3
      1 1 2
      1 2 3
      0 1 3
      3 2 7
      0 1 3
    output: |-
      0
      5
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['Link-Cut Tree', 'Splay', '路徑 XOR']
judgment: |-
  link 只能連不同樹，cut 只有在指定邊確實存在時才能斷。
hints:
  - '先辨識核心模型：Link-Cut Tree、Splay、路徑 XOR；暫時不要處理所有操作細節。'
  - 'link 只能連不同樹，cut 只有在指定邊確實存在時才能斷。'
  - '最後依此不變量實作：LCT 以 access 把根到點改成偏好路徑，makeroot 反轉代表樹方向。split(x,y) 後 y 的輔助樹恰為路徑，聚合 XOR 即答案；link/cut 改虛父關係。'
solution_outline: |-
  LCT 以 access 把根到點改成偏好路徑，makeroot 反轉代表樹方向。split(x,y) 後 y 的輔助樹恰為路徑，聚合 XOR 即答案；link/cut 改虛父關係。
proof_or_invariant: |-
  LCT 操作保持每棵輔助樹中序為代表樹的一段路徑；makeroot、access 後指定路徑被完整暴露。XOR 可結合，因此 pull 聚合即路徑答案。
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
  // P3690.cpp
  #include <bits/stdc++.h>
  #define lson ch[p][0]
  #define rson ch[p][1]

  using namespace std;

  const int MAX_N = 3e5 + 200;

  int ch[MAX_N][2], val[MAX_N], subtree_size[MAX_N], fa[MAX_N], reverseTag[MAX_N];
  int xorsum[MAX_N], n, m;

  inline bool isRoot(int p) { return ch[fa[p]][0] != p && ch[fa[p]][1] != p; }

  inline int check(int p) { return ch[fa[p]][1] == p; }

  inline void clear(int p) { lson = rson = fa[p] = val[p] = subtree_size[p] = reverseTag[p] = xorsum[p] = 0; }

  inline void pushUp(int p)
  {
      clear(0);
      subtree_size[p] = 1 + subtree_size[lson] + subtree_size[rson];
      xorsum[p] = xorsum[lson] ^ xorsum[rson] ^ val[p];
  }

  inline void pushDown(int p)
  {
      if (reverseTag[p])
      {
          if (lson)
              reverseTag[lson] ^= 1, swap(ch[lson][0], ch[lson][1]);
          if (rson)
              reverseTag[rson] ^= 1, swap(ch[rson][0], ch[rson][1]);
          reverseTag[p] = 0;
      }
  }

  inline void update(int x)
  {
      if (!isRoot(x))
          update(fa[x]);
      pushDown(x);
  }

  inline void rotate(int x)
  {
      int y = fa[x], z = fa[y], dir = check(x), w = ch[x][dir ^ 1];
      fa[x] = z;
      if (!isRoot(y))
          ch[z][check(y)] = x;
      ch[y][dir] = w, fa[w] = y;
      ch[x][dir ^ 1] = y, fa[y] = x;
      pushUp(y), pushUp(x), pushUp(z);
  }

  inline void splay(int x)
  {
      update(x);
      for (int fat = fa[x]; fat = fa[x], !isRoot(x); rotate(x))
          if (!isRoot(fat))
              rotate(check(fat) == check(x) ? fat : x);
  }

  inline void access(int x)
  {
      for (int fat = 0; x != 0; fat = x, x = fa[x])
          splay(x), ch[x][1] = fat, pushUp(x);
  }

  inline void makeRoot(int p)
  {
      access(p), splay(p);
      swap(lson, rson), reverseTag[p] ^= 1;
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
      if (find(y) == x)
          return;
      fa[x] = y;
  }

  inline void split(int x, int y)
  {
      makeRoot(x);
      access(y), splay(y);
  }

  inline void cut(int x, int y)
  {
      makeRoot(x);
      if (find(y) != x || subtree_size[x] > 2)
          return;
      fa[y] = ch[x][1] = 0;
      pushUp(x);
  }

  int main()
  {
      scanf("%d%d", &n, &m);
      for (int i = 1; i <= n; i++)
          scanf("%d", &val[i]);
      while (m--)
      {
          int opt, x, y;
          scanf("%d%d%d", &opt, &x, &y);
          switch (opt)
          {
          case 0:
              split(x, y), printf("%d\n", xorsum[y]);
              break;
          case 1:
              link(x, y);
              break;
          case 2:
              cut(x, y);
              break;
          case 3:
              splay(x), val[x] = y, pushUp(x);
              break;
          }
      }
      return 0;
  }

  // P3690.cpp
external_url: https://www.luogu.com.cn/problem/P3690
external_platform: '洛谷'
external_problem_id: 'P3690'
external_title: '【模板】動態樹（LCT）'
external_relation: original
source_book_pages: [310, 317]
source_pdf_pages: [328, 335]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
