---
id: luogu-p5338
volume: upper
source_file: upper-volume
title: '洛谷 P5338 [TJOI2019] 甲苯先生的滾榜'
chapter: 4
section: '4.16'
kind: external-oj
difficulty: 5
topics: ['排序樹', '動態排名', '偽亂數生成']
prerequisites: ['排序樹', '動態排名', '偽亂數生成']
statement: |-
  依題定偽亂數產生每次 AC 的選手與罰時；每次更新後輸出嚴格排在該選手前的人數。
constraints:
  - 'm <= 100000'
  - 'n <= 1000000'
  - '罰時總和 <= 1500000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      1
      1 2 1
    output: |-
      0
      0
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['排序樹', '動態排名', '偽亂數生成']
judgment: |-
  排名先比較過題數降序，再比較罰時升序；完全同成績者不算在前。
hints:
  - '先辨識核心模型：排序樹、動態排名、偽亂數生成；暫時不要處理所有操作細節。'
  - '排名先比較過題數降序，再比較罰時升序；完全同成績者不算在前。'
  - '最後依此不變量實作：把成績編成可比較鍵 (-solved, penalty)，平衡樹保存每位已出現選手的鍵。更新前刪舊鍵、加入新鍵，查詢嚴格較小鍵數；未出現者成績為零且不會優於剛 AC 者。'
solution_outline: |-
  把成績編成可比較鍵 (-solved, penalty)，平衡樹保存每位已出現選手的鍵。更新前刪舊鍵、加入新鍵，查詢嚴格較小鍵數；未出現者成績為零且不會優於剛 AC 者。
proof_or_invariant: |-
  鍵的字典序與題定排名完全一致；樹中每位已出現選手恰有一個節點，因此嚴格較小鍵的節點數正是答案。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O(總 AC 次數 log m)'
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
  #include<bits/stdc++.h>
  using namespace std;
  #define int long long
  const int MAXN = 1e5+5;
  const int MAXM = 1e6+5;
  const int base = 1500005;
  typedef unsigned int ui ;

  int last=7;
  int n,m;
  ui seed;
  int val[MAXN];

  int head = 0;
  int cnt = 0;
  int key[MAXM];
  int ls[MAXM];
  int rs[MAXM];
  int sz[MAXM];
  double priority[MAXM];

  int sta[MAXM];
  int top=0;

  int randNum( ui& seed , ui last , const ui m){
      seed = seed * 17 + last ;
      return seed % m + 1;
  }

  inline int read(){
      int x=0,f=1;
      char ch=getchar();
      while(ch<'0'||ch>'9'){
          if(ch=='-')
              f=-1;
          ch=getchar();
      }
      while(ch>='0' && ch<='9')
          x=x*10+ch-'0',ch=getchar();
      return x*f;
  }

  void up(int i) {
      sz[i] = sz[ls[i]] + sz[rs[i]] + 1;
  }

  void split(int l, int r, int i, int num) {
      if (i == 0) {
          rs[l] = ls[r] = 0;
      } else {
          if (key[i] <= num) {
              rs[l] = i;
              split(i, r, rs[i], num);
          } else {
              ls[r] = i;
              split(l, i, ls[i], num);
          }
          up(i);
      }
  }

  int merge(int l, int r) {
      if (l == 0 || r == 0) {
          return l + r;
      }
      if (priority[l] >= priority[r]) {
          rs[l] = merge(rs[l], r);
          up(l);
          return l;
      } else {
          ls[r] = merge(l, ls[r]);
          up(r);
          return r;
      }
  }

  void add(int num) {
      split(0, 0, head, num);
      int u;
      if(top){
          u=sta[top--];
      }
      else{
          cnt++;
          u=cnt;
      }
      key[u] = num;
      sz[u] = 1;
      ls[u]=rs[u]=0;
      priority[u] = (double)rand() / RAND_MAX;
      head = merge(merge(rs[0], u), ls[0]);
  }

  void remove(int num) {
      split(0, 0, head, num);
      int lm = rs[0];
      int r = ls[0];
      split(0, 0, lm, num - 1);
      int l = rs[0];
      int m = ls[0];
      sta[++top]=m;
      head = merge(merge(l, merge(ls[m], rs[m])), r);
  }

  int getRank(int num) {
      split(0, 0, head, num +1);
      int ans = sz[ls[0]];
      head = merge(rs[0], ls[0]);
      return ans;
  }

  signed main()
  {
      int T;
      cin>>T;
      while(T--){
          cnt=0;
          top=0;
          head=0;
          m=read(),n=read(),seed=read();
          fill(val + 1, val + m + 1, 0);
          for(int i=1;i<=n;i++){
              int u=randNum(seed,(ui)last,(ui)m);
              int v=randNum(seed,(ui)last,(ui)m);
              if(val[u])
                  remove(val[u]);
              val[u]+=(base-v);
              add(val[u]);
              last=getRank(val[u]);
              printf("%lld\n",last);
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5338
external_platform: '洛谷'
external_problem_id: 'P5338'
external_title: '[TJOI2019] 甲苯先生的滾榜'
external_relation: original
source_book_pages: [296, 299]
source_pdf_pages: [314, 317]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
