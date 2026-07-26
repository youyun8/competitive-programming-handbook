---
id: luogu-p3285
volume: upper
source_file: upper-volume
title: '洛谷 P3285 [SCOI2014] 方伯伯的 OJ'
chapter: 4
section: '4.16'
kind: external-oj
difficulty: 5
topics: ['區間壓縮伸展樹', '隱式排名', '大初始序列']
prerequisites: ['區間壓縮伸展樹', '隱式排名', '大初始序列']
statement: |-
  初始編號 1..n 依序排名，支援改編號、移至榜首、移至榜尾、查第 k 名；每次參數以先前答案加密。
constraints:
  - 'n <= 100000000'
  - 'm <= 100000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      3 4
      4 1
      2 3
      3 4
      4 3
    output: |-
      1
      2
      1
      3
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['區間壓縮伸展樹', '隱式排名', '大初始序列']
judgment: |-
  n 可達 1e8，不能為每個初始使用者建節點；輸入參數需減去上一答案解密。
hints:
  - '先辨識核心模型：區間壓縮伸展樹、隱式排名、大初始序列；暫時不要處理所有操作細節。'
  - 'n 可達 1e8，不能為每個初始使用者建節點；輸入參數需減去上一答案解密。'
  - '最後依此不變量實作：伸展樹節點可代表一段連續且尚未拆開的編號區間，size 計區間長。操作涉及某編號時把所在區間切成至多三段，使目標成為單點，再做改名或移首尾；排名與第 k 名按加權大小查。'
solution_outline: |-
  伸展樹節點可代表一段連續且尚未拆開的編號區間，size 計區間長。操作涉及某編號時把所在區間切成至多三段，使目標成為單點，再做改名或移首尾；排名與第 k 名按加權大小查。
proof_or_invariant: |-
  區間節點展開後的中序序列始終等於完整排行榜。切分只改表示不改順序；其後的單點移動／改名與題意操作一致，故壓縮不影響答案。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O(m log m)'
  space: 'O(m)'
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
  #include <bits/stdc++.h>
  using namespace std;
  const int MAX = 330000;
  map<int, int> f;
  int n, m, cnt, ans, root;

  int read(){
      int x = 0, f = 1; char ch = getchar();
      while (ch > '9' || ch  < '0') { if (ch == '-') f = -1; ch = getchar(); }
      while (ch <= '9' && ch >= '0') { x = x * 10 + ch - '0'; ch = getchar(); }
      return x * f;
  }

  struct Node{
      int fa, son[2], siz, l, r;
  } T[MAX];

  void pushup(int x){
      T[x].siz = T[T[x].son[0]].siz + T[T[x].son[1]].siz + T[x].r - T[x].l + 1;
  }

  void rotate(int x){
      int y = T[x].fa, z = T[y].fa;
      int op = T[y].son[1] == x;
      T[x].fa = z;
      if (z) T[z].son[T[z].son[1] == y] = x;
      T[y].son[op] = T[x].son[!op];
      T[T[y].son[op]].fa = y;
      T[y].fa = x;
      T[x].son[!op] = y;
      pushup(y);
  }

  void splay(int x, int to){
      while (T[x].fa != to)
      {
          int y = T[x].fa, z = T[y].fa;
          if (z != to)
          {
              if ((T[z].son[0] == y) ^ (T[y].son[0] == x)) rotate(x);
              else rotate(y);
          } rotate(x);
      }
      pushup(x);
      if (to == 0) root = x;
  }

  int query(int x){
      splay(x, 0);
      return T[x].siz - T[T[x].son[1]].siz;
  }

  int getkth(int k){
      int x = root;
      while (k){
          int sum = T[T[x].son[0]].siz + T[x].r - T[x].l + 1;
          if (T[T[x].son[0]].siz < k && k <= sum){
              k -= T[T[x].son[0]].siz;
              break;
          }
          if (sum < k){
              k -= sum;
              x = T[x].son[1];
          }
          else x = T[x].son[0];
      }
      return T[x].l + k - 1;
  }

  void erase(int x){
      int pre = T[x].son[0], nxt = T[x].son[1];
      while (T[pre].son[1]) pre = T[pre].son[1];
      while (T[nxt].son[0]) nxt = T[nxt].son[0];
      if (!pre && !nxt) root = 0;
      else if (!pre){
          splay(nxt, root);
          root = nxt; T[root].fa = 0;
          T[x].son[0] = T[x].son[1] = 0;
          T[x].siz = 1;
      }
      else if (!nxt){
          splay(pre, root);
          root = pre; T[root].fa = 0;
          T[x].son[0] = T[x].son[1] = 0;
          T[x].siz = 1;
      }
      else{
          splay(pre, 0);
          splay(nxt, pre);
          T[nxt].son[0] = T[x].fa = 0;
          T[x].siz = 1;
          pushup(nxt); pushup(pre);
      }
  }

  void push_front(int x){
      if (!root) { root = x; return ; }
      int fa_ = root;
      while (T[fa_].son[0]) T[fa_].siz ++, fa_ = T[fa_].son[0];
      T[fa_].siz ++;
      T[fa_].son[0] = x;
      T[x].fa = fa_;
      splay(x, 0);
  }

  void push_back(int x){
      if (!root) { root = x; return ; }
      int fa_ = root;
      while (T[fa_].son[1]) T[fa_].siz ++, fa_ = T[fa_].son[1];
      T[fa_].siz ++;
      T[fa_].son[1] = x;
      T[x].fa = fa_;
      splay(x, 0);
  }

  void split(int x, int id){
      int L = T[x].l, R = T[x].r, ls, rs;
      if (L == R) return ;
      if (L == id){
          rs = ++cnt;
          f[R] = rs; f[id] = x;
          T[rs].son[1] = T[x].son[1];
          T[T[rs].son[1]].fa = rs;
          T[x].son[1] = rs; T[rs].fa = x;
          T[rs].l = L + 1; T[rs].r = R;
          T[x].r = L;
          pushup(rs); pushup(x);
      }
      else if (R == id){
          ls = ++cnt;
          f[R - 1] = ls; f[id] = x;
          T[ls].son[0] = T[x].son[0];
          T[T[ls].son[0]].fa = ls;
          T[x].son[0] = ls; T[ls].fa = x;
          T[ls].l = L; T[ls].r = R - 1;
          T[x].l = R;
          pushup(ls); pushup(x);
      }
      else{
          ls = ++cnt; rs = ++cnt;
          f[id] = x; f[id - 1] = ls; f[R] = rs;
          T[ls].son[0] = T[x].son[0]; T[rs].son[1] = T[x].son[1];
          T[T[ls].son[0]].fa = ls; T[T[rs].son[1]].fa = rs;
          T[x].son[0] = ls; T[x].son[1] = rs; T[ls].fa = T[rs].fa = x;
          T[x].l = T[x].r = id;
          T[ls].l = L; T[ls].r = id - 1;
          T[rs].l = id + 1; T[rs].r = R;
          pushup(ls); pushup(rs); pushup(x);
      }
      splay(x, 0);
  }

  void init(){
      root = cnt = 1;
      T[root].l = 1, T[root].r = n;
      T[root].siz = n;
      f[n] = 1;
  }

  int main()
  {
      n = read(); m = read();
      init();
      while (m --){
          int opt = read();
          if (opt == 1){
              int oid = read() - ans, nid = read() - ans;
              int x = f.lower_bound(oid) -> second;
              split(x, oid);
              ans = query(x);
              T[x].l = T[x].r = nid; f[nid] = x;
              printf("%d\n", ans);
          }
          else if (opt == 2){
              int id = read() - ans;
              int x = f.lower_bound(id) -> second;
              split(x, id);
              ans = query(x);
              erase(x);
              push_front(x);
              printf("%d\n", ans);
          }
          else if (opt == 3){
              int id = read() - ans;
              int x = f.lower_bound(id) -> second;
              split(x, id);
              ans = query(x);
              erase(x);
              push_back(x);
              printf("%d\n", ans);
          }
          else if (opt == 4){
              int k = read() - ans;
              ans = getkth(k);
              printf("%d\n", ans);
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3285
external_platform: '洛谷'
external_problem_id: 'P3285'
external_title: '[SCOI2014] 方伯伯的 OJ'
external_relation: original
source_book_pages: [296, 299]
source_pdf_pages: [314, 317]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
