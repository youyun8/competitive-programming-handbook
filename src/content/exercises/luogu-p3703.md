---
id: luogu-p3703
volume: upper
source_file: upper-volume
title: '洛谷 P3703 [SDOI2017] 樹點塗色'
chapter: 4
section: '4.18'
kind: external-oj
difficulty: 5
topics: ['Link-Cut Tree', 'DFS 序線段樹', 'LCA']
prerequisites: ['Link-Cut Tree', 'DFS 序線段樹', 'LCA']
statement: |-
  初始每點異色；支援把根到 x 染成全新同色、查路徑顏色段數、查子樹內根路徑顏色段數最大值。
constraints:
  - 'n,m <= 100000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      5 6
      1 2
      2 3
      3 4
      3 5
      2 4 5
      3 3
      1 4
      2 4 5
      1 5
      2 4 5
    output: |-
      3
      4
      2
      2
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['Link-Cut Tree', 'DFS 序線段樹', 'LCA']
judgment: |-
  顏色名稱不重要，只需維護根路徑上的顏色段邊界數。
hints:
  - '先辨識核心模型：Link-Cut Tree、DFS 序線段樹、LCA；暫時不要處理所有操作細節。'
  - '顏色名稱不重要，只需維護根路徑上的顏色段邊界數。'
  - '最後依此不變量實作：把同色關係視為 LCT 偏好實邊，操作 1 即 access(x)。實虛邊切換時，對被影響兒子整棵 DFS 子樹的根路徑段數做 ±1；線段樹支援區間加、單點與子樹最大值。操作 2 用 f(x)+f(y)-2f(lca)+1。'
solution_outline: |-
  把同色關係視為 LCT 偏好實邊，操作 1 即 access(x)。實虛邊切換時，對被影響兒子整棵 DFS 子樹的根路徑段數做 ±1；線段樹支援區間加、單點與子樹最大值。操作 2 用 f(x)+f(y)-2f(lca)+1。
proof_or_invariant: |-
  一點到根的顏色數等於路徑上非同色邊數加一。access 精確把根到 x 變成同色實鏈，每條切換邊對其兒子子樹所有根路徑同增減一；公式由兩條根路徑容斥得到。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: '均攤 O(log^2 n) 每操作'
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
  // P3703.cpp
  #include <bits/stdc++.h>

  using namespace std;

  const int MAX_N = 1e5 + 200;

  int head[MAX_N], current, n, m, dep[MAX_N], anti[MAX_N], lft[MAX_N], rig[MAX_N], upward[20][MAX_N];
  int ptot;

  struct edge
  {
      int to, nxt;
  } edges[MAX_N << 1];

  void addpath(int src, int dst)
  {
      edges[current].to = dst, edges[current].nxt = head[src];
      head[src] = current++;
  }

  namespace SegmentTree
  {

  #define lson (p << 1)
  #define rson ((p << 1) | 1)
  #define mid ((l + r) >> 1)

  struct node
  {
      int tag, mx;
  } nodes[MAX_N << 2];

  void pushup(int p) { nodes[p].mx = max(nodes[lson].mx, nodes[rson].mx); }

  void pushdown(int p)
  {
      if (nodes[p].tag)
      {
          nodes[lson].tag += nodes[p].tag, nodes[lson].mx += nodes[p].tag;
          nodes[rson].tag += nodes[p].tag, nodes[rson].mx += nodes[p].tag;
          nodes[p].tag = 0;
      }
  }

  void build(int l, int r, int p)
  {
      if (l == r)
      {
          nodes[p].mx = dep[anti[l]];
          return;
      }
      build(l, mid, lson), build(mid + 1, r, rson);
      pushup(p);
  }

  void update(int ql, int qr, int l, int r, int p, int val)
  {
      if (ql <= l && r <= qr)
      {
          nodes[p].mx += val, nodes[p].tag += val;
          return;
      }
      pushdown(p);
      if (ql <= mid)
          update(ql, qr, l, mid, lson, val);
      if (mid < qr)
          update(ql, qr, mid + 1, r, rson, val);
      pushup(p);
  }

  int query(int ql, int qr, int l, int r, int p)
  {
      if (ql <= l && r <= qr)
          return nodes[p].mx;
      pushdown(p);
      int ret = -0x3f3f3f3f;
      if (ql <= mid)
          ret = max(ret, query(ql, qr, l, mid, lson));
      if (mid < qr)
          ret = max(ret, query(ql, qr, mid + 1, r, rson));
      return ret;
  }

  #undef mid
  #undef rson
  #undef lson

  } // namespace SegmentTree

  namespace LCT
  {

  #define lson ch[p][0]
  #define rson ch[p][1]

  int ch[MAX_N][2], fa[MAX_N], val[MAX_N];
  bool tag[MAX_N];

  bool isRoot(int p) { return ch[fa[p]][0] != p && ch[fa[p]][1] != p; }

  int check(int p) { return ch[fa[p]][1] == p; }

  void rotate(int x)
  {
      int y = fa[x], z = fa[y], dir = check(x), w = ch[x][dir ^ 1];
      fa[x] = z;
      if (!isRoot(y))
          ch[z][ch[z][1] == y] = x;
      fa[y] = x, ch[x][dir ^ 1] = y;
      fa[w] = y, ch[y][dir] = w;
  }

  void splay(int p)
  {
      for (int fat = fa[p]; fat = fa[p], !isRoot(p); rotate(p))
          if (!isRoot(fat))
              rotate(check(fat) == check(p) ? fat : p);
  }

  int find(int p)
  {
      while (lson)
          p = lson;
      return p;
  }

  void access(int p)
  {
      int pt = 0;
      for (int pre = 0; p != 0; pre = p, p = fa[p])
      {
          splay(p);
          // rson stuff;
          if (rson)
              pt = find(rson), SegmentTree::update(lft[pt], rig[pt], 1, n, 1, 1);
          if (rson = pre)
              pt = find(pre), SegmentTree::update(lft[pt], rig[pt], 1, n, 1, -1);
          ch[p][1] = pre;
      }
  }

  } // namespace LCT

  void dfs(int u, int fa)
  {
      LCT::fa[u] = upward[0][u] = fa, lft[u] = ++ptot;
      anti[ptot] = u, dep[u] = dep[fa] + 1;
      for (int i = head[u]; i != -1; i = edges[i].nxt)
          if (edges[i].to != fa)
              dfs(edges[i].to, u);
      rig[u] = ptot;
  }

  int getLCA(int x, int y)
  {
      if (dep[x] < dep[y])
          swap(x, y);
      for (int i = 19; i >= 0; i--)
          if (dep[upward[i][x]] >= dep[y])
              x = upward[i][x];
      if (x == y)
          return x;
      for (int i = 19; i >= 0; i--)
          if (upward[i][x] != upward[i][y])
              x = upward[i][x], y = upward[i][y];
      return upward[0][x];
  }

  int main()
  {
      memset(head, -1, sizeof(head));
      scanf("%d%d", &n, &m);
      for (int i = 1, u, v; i <= n - 1; i++)
          scanf("%d%d", &u, &v), addpath(u, v), addpath(v, u);
      dfs(1, 0), LCT::fa[1] = 0, SegmentTree::build(1, n, 1);
      for (int i = 1; i <= 19; i++)
          for (int j = 1; j <= n; j++)
              upward[i][j] = upward[i - 1][upward[i - 1][j]];
      while (m--)
      {
          int opt, x, y;
          scanf("%d%d", &opt, &x);
          if (opt == 1)
              LCT::access(x);
          else if (opt == 2)
          {
              scanf("%d", &y);
              int lca = getLCA(x, y);
              int ans = SegmentTree::query(lft[x], lft[x], 1, n, 1) + SegmentTree::query(lft[y], lft[y], 1, n, 1) - (SegmentTree::query(lft[lca], lft[lca], 1, n, 1) * 2);
              printf("%d\n", ans + 1);
          }
          else
              printf("%d\n", SegmentTree::query(lft[x], rig[x], 1, n, 1));
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3703
external_platform: '洛谷'
external_problem_id: 'P3703'
external_title: '[SDOI2017] 樹點塗色'
external_relation: original
source_book_pages: [310, 317]
source_pdf_pages: [328, 335]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
