---
id: luogu-p4338
volume: upper
source_file: upper-volume
title: '洛谷 P4338 [ZJOI2018] 歷史'
chapter: 4
section: '4.18'
kind: external-oj
difficulty: 5
topics: ['帶權實鏈', 'Link-Cut Tree', '動態子樹和']
prerequisites: ['帶權實鏈', 'Link-Cut Tree', '動態子樹和']
statement: |-
  樹上城市各有崛起次數；求所有崛起順序可達的最大戰爭災難度總和，並在單點增加次數後重算。
constraints:
  - 'n,m <= 400000'
  - 'a_i,w_i <= 10000000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      1 1
      1
      1 1
    output: |-
      0
      0
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['帶權實鏈', 'Link-Cut Tree', '動態子樹和']
judgment: |-
  節點貢獻取決於子樹總次數 t 與最大顏色次數 h：min(t-1,2(t-h))。
hints:
  - '先辨識核心模型：帶權實鏈、Link-Cut Tree、動態子樹和；暫時不要處理所有操作細節。'
  - '節點貢獻取決於子樹總次數 t 與最大顏色次數 h：min(t-1,2(t-h))。'
  - '最後依此不變量實作：把節點自身與各兒子子樹視為顏色。若某兒子子樹超過一半，令它成實兒子；所有實邊形成鏈。LCT 維護加權子樹和，單點增量沿根路徑只在鏈端重新判定貢獻與實邊。'
solution_outline: |-
  把節點自身與各兒子子樹視為顏色。若某兒子子樹超過一半，令它成實兒子；所有實邊形成鏈。LCT 維護加權子樹和，單點增量沿根路徑只在鏈端重新判定貢獻與實邊。
proof_or_invariant: |-
  不同顏色序列的最大相鄰變化數正是 min(t-1,2(t-h))。超半兒子唯一，故實鏈合法；一次增量後沿實鏈內部貢獻不變，演算法更新所有可能變化的鏈端，總答案保持正確。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: '均攤 O(log n) 每修改'
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
  // P4338.cpp
  #include <bits/stdc++.h>

  using namespace std;

  const int MAX_N = 4e5 + 200;

  typedef long long ll;

  int n, q, head[MAX_N], current, ch[MAX_N][2], fa[MAX_N];
  ll sum[MAX_N], val[MAX_N], vsum[MAX_N], ans;

  struct edge
  {
      int to, nxt;
  } edges[MAX_N << 1];

  #define lson (ch[p][0])
  #define rson (ch[p][1])
  #define mid ((l + r) >> 1)

  void addpath(int src, int dst)
  {
      edges[current].to = dst, edges[current].nxt = head[src];
      head[src] = current++;
  }

  int check(int p) { return ch[fa[p]][1] == p; }

  bool isRoot(int p) { return ch[fa[p]][0] != p && ch[fa[p]][1] != p; }

  void pushup(int p) { sum[p] = sum[lson] + sum[rson] + val[p] + vsum[p]; }

  void rotate(int x)
  {
      int y = fa[x], z = fa[y], dir = check(x), w = ch[x][dir ^ 1];
      fa[x] = z;
      if (!isRoot(y))
          ch[z][check(y)] = x;
      fa[y] = x, ch[x][dir ^ 1] = y;
      fa[w] = y, ch[y][dir] = w;
      pushup(y), pushup(x);
  }

  void splay(int p)
  {
      for (int fat = fa[p]; fat = fa[p], !isRoot(p); rotate(p))
          if (!isRoot(fat))
              rotate(check(p) == check(fat) ? fat : p);
      pushup(p);
  }

  ll calc(int p, ll subtree, ll succ) { return rson ? (subtree - succ) * 2 : (val[p] * 2 > subtree ? (subtree - val[p]) * 2 : subtree - 1); }

  void modify(int p, int delta)
  {
      splay(p);
      ll subtree = sum[p] - sum[lson], succ = sum[rson];
      ans -= calc(p, subtree, succ), sum[p] += delta, subtree += delta, val[p] += delta;
      if (succ * 2 < subtree + 1)
          vsum[p] += succ, rson = 0;
      ans += calc(p, subtree, succ), pushup(p);
      int pre = p;
      p = fa[p];
      for (; p; pre = p, p = fa[p])
      {
          splay(p), subtree = sum[p] - sum[lson], succ = sum[rson];
          ans -= calc(p, subtree, succ), sum[p] += delta, vsum[p] += delta, subtree += delta;
          if (succ * 2 < subtree + 1)
              vsum[p] += succ, rson = 0, succ = 0;
          if (sum[pre] * 2 > subtree)
              vsum[p] -= sum[pre], rson = pre, succ = sum[pre];
          ans += calc(p, subtree, succ), pushup(p);
      }
  }

  void dfs(int u, int up)
  {
      sum[u] = val[u];
      ll mx = val[u], p = 0;
      for (int i = head[u]; i != -1; i = edges[i].nxt)
          if (edges[i].to != up)
          {
              fa[edges[i].to] = u, dfs(edges[i].to, u), sum[u] += sum[edges[i].to];
              if (mx < sum[edges[i].to])
                  mx = sum[edges[i].to], p = edges[i].to;
          }
      ans += min(sum[u] - 1, 2LL * (sum[u] - mx));
      if (sum[p] * 2 >= sum[u] + 1)
          ch[u][1] = p;
      vsum[u] = sum[u] - val[u] - sum[ch[u][1]];
  }

  int main()
  {
      memset(head, -1, sizeof(head));
      scanf("%d%d", &n, &q);
      for (int i = 1; i <= n; i++)
          scanf("%lld", &val[i]);
      for (int i = 1, u, v; i <= n - 1; i++)
          scanf("%d%d", &u, &v), addpath(u, v), addpath(v, u);
      dfs(1, 0), printf("%lld\n", ans);
      while (q--)
      {
          int u, x;
          scanf("%d%d", &u, &x), modify(u, x), printf("%lld\n", ans);
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4338
external_platform: '洛谷'
external_problem_id: 'P4338'
external_title: '[ZJOI2018] 歷史'
external_relation: original
source_book_pages: [310, 317]
source_pdf_pages: [328, 335]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
