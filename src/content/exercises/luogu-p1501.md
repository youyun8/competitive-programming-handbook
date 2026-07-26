---
id: luogu-p1501
volume: upper
source_file: upper-volume
title: '洛谷 P1501 [國家集訓隊] Tree II'
chapter: 4
section: '4.18'
kind: external-oj
difficulty: 5
topics: ['Link-Cut Tree', '仿射懶標記', '動態換邊']
prerequisites: ['Link-Cut Tree', '仿射懶標記', '動態換邊']
statement: |-
  動態樹點權初始為 1，支援路徑加、路徑乘、換邊及路徑和，結果模 51061。
constraints:
  - 'n,q <= 100000'
  - '模數 51061'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      3 2
      1 2
      2 3
      * 1 3 4
      / 1 1
    output: |-
      4
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['Link-Cut Tree', '仿射懶標記', '動態換邊']
judgment: |-
  仿射標記組合有順序：新乘法同時乘舊 add；新加法只加到 add。
hints:
  - '先辨識核心模型：Link-Cut Tree、仿射懶標記、動態換邊；暫時不要處理所有操作細節。'
  - '仿射標記組合有順序：新乘法同時乘舊 add；新加法只加到 add。'
  - '最後依此不變量實作：LCT 暴露 u-v 路徑後，對整棵輔助樹套 x→mul*x+add，並維護 size 與 sum。換邊先 cut 舊邊再 link 新邊；查詢直接取暴露路徑和。'
solution_outline: |-
  LCT 暴露 u-v 路徑後，對整棵輔助樹套 x→mul*x+add，並維護 size 與 sum。換邊先 cut 舊邊再 link 新邊；查詢直接取暴露路徑和。
proof_or_invariant: |-
  每個節點懶標代表尚未下傳的仿射函數，函數組合與 sum 更新完全一致。split 後輔助樹節點集合恰為路徑，故批次仿射與聚合答案正確。
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
  // P1501.cpp
  #include <bits/stdc++.h>

  using namespace std;

  const int MAX_N = 3e5 + 200, mod = 51061;

  int n, q, ch[MAX_N][2], val[MAX_N], siz[MAX_N], fa[MAX_N], tag[MAX_N], sum[MAX_N], lazy_add[MAX_N], lazy_mul[MAX_N];

  bool isRoot(int p) { return ch[fa[p]][0] != p && ch[fa[p]][1] != p; }

  int check(int p) { return ch[fa[p]][1] == p; }

  #define lson ch[p][0]
  #define rson ch[p][1]

  void updateAdd(int p, int x)
  {
      sum[p] = (1LL * siz[p] * x % mod + 1LL * sum[p]) % mod;
      lazy_add[p] = (1LL * lazy_add[p] + x) % mod, val[p] = (1LL * val[p] + x) % mod;
  }

  void updateMultiply(int p, int x)
  {
      sum[p] = 1LL * sum[p] * x % mod, val[p] = 1LL * val[p] * x % mod;
      lazy_mul[p] = 1LL * lazy_mul[p] * x % mod, lazy_add[p] = 1LL * lazy_add[p] * x % mod;
  }

  void pushup(int p)
  {
      siz[p] = siz[lson] + siz[rson] + 1;
      sum[p] = (1LL * sum[lson] + 1LL * sum[rson] + 1LL * val[p]) % mod;
  }

  void pushdown(int p)
  {
      if (lazy_mul[p] != 1)
      {
          updateMultiply(lson, lazy_mul[p]), updateMultiply(rson, lazy_mul[p]);
          lazy_mul[p] = 1;
      }
      if (lazy_add[p] != 0)
      {
          updateAdd(lson, lazy_add[p]), updateAdd(rson, lazy_add[p]);
          lazy_add[p] = 0;
      }
      if (tag[p])
      {
          tag[lson] ^= 1, tag[rson] ^= 1;
          swap(lson, rson);
          tag[p] = 0;
      }
  }

  void rotate(int x)
  {
      int y = fa[x], z = fa[y], dir = check(x), w = ch[x][dir ^ 1];
      fa[x] = z;
      if (!isRoot(y))
          ch[z][check(y)] = x;
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
      for (int f = fa[p]; (f = fa[p]), !isRoot(p); rotate(p))
          if (!isRoot(f))
              rotate(check(p) == check(f) ? f : p);
  }

  void access(int p)
  {
      for (int fat = 0; p != 0; fat = p, p = fa[p])
          splay(p), rson = fat, pushup(p);
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

  void link(int x, int y)
  {
      makeRoot(x);
      if (find(y) == x)
          return;
      fa[x] = y;
  }

  void split(int x, int y)
  {
      makeRoot(x);
      access(y), splay(y);
  }

  void cut(int x, int y)
  {
      makeRoot(x);
      if (find(y) != x || siz[x] > 2)
          return;
      fa[y] = ch[x][1] = 0;
      pushup(x);
  }

  int main()
  {
      scanf("%d%d", &n, &q);
      for (int i = 1; i <= n; i++)
          val[i] = lazy_mul[i] = 1;
      for (int i = 1, u, v; i <= n - 1; i++)
          scanf("%d%d", &u, &v), link(u, v);
      while (q--)
      {
          char opt[5];
          int u, v, a, b;
          scanf("%s", opt + 1);
          if (opt[1] == '+')
              scanf("%d%d%d", &u, &v, &a), split(u, v), updateAdd(v, a % mod);
          else if (opt[1] == '-')
              scanf("%d%d%d%d", &u, &v, &a, &b), cut(u, v), link(a, b);
          else if (opt[1] == '*')
              scanf("%d%d%d", &u, &v, &a), split(u, v), updateMultiply(v, a % mod);
          else if (opt[1] == '/')
              scanf("%d%d", &u, &v), split(u, v), printf("%d\n", sum[v] % mod);
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1501
external_platform: '洛谷'
external_problem_id: 'P1501'
external_title: '[國家集訓隊] Tree II'
external_relation: original
source_book_pages: [310, 317]
source_pdf_pages: [328, 335]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
