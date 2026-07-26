---
id: luogu-p2710
volume: upper
source_file: upper-volume
title: '洛谷 P2710 數列'
chapter: 4
section: '4.16'
kind: external-oj
difficulty: 5
topics: ['隱式伸展樹', '最大子段和', '雙懶標記']
prerequisites: ['隱式伸展樹', '最大子段和', '雙懶標記']
statement: |-
  維護整數序列，支援插入、刪除、反轉、賦值、區間和、單點值與指定區間非空最大子段和。
constraints:
  - '任一時刻長度 <= 200000'
  - 'M <= 20000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      9 8
      2 -6 3 5 1 -5 -3 6 3
      GET-SUM 5 4
      MAX-SUM 1 9
      INSERT 8 3 -5 7 2
      DELETE 12 1
      MAKE-SAME 3 3 2
      REVERSE 3 6
      GET 5
      MAX-SUM 1 11
    output: |-
      -1
      10
      -5
      10
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['隱式伸展樹', '最大子段和', '雙懶標記']
judgment: |-
  MAX-SUM 有區間參數，且答案必選至少一項。
hints:
  - '先辨識核心模型：隱式伸展樹、最大子段和、雙懶標記；暫時不要處理所有操作細節。'
  - 'MAX-SUM 有區間參數，且答案必選至少一項。'
  - '最後依此不變量實作：隱式伸展樹維護中序序列；隔離任意區間後執行 lazy same/reverse，聚合 sum、prefix、suffix、best。插入平衡建樹，刪除回收整棵子樹。'
solution_outline: |-
  隱式伸展樹維護中序序列；隔離任意區間後執行 lazy same/reverse，聚合 sum、prefix、suffix、best。插入平衡建樹，刪除回收整棵子樹。
proof_or_invariant: |-
  節點聚合是最大子段和的標準結合律資訊；懶標對整段的聚合可 O(1) 更新，並在旋轉或下降前下傳，所以所有查詢看到的資訊皆正確。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O((N+插入總數)+M log L)'
  space: 'O(L)'
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
  const int MAXN = 2e5+5;
  const int INF = 1e9;

  int n,m;

  int top;
  int sta[MAXN];

  int head;
  int ls[MAXN];
  int rs[MAXN];
  int sz[MAXN];
  int sum[MAXN];
  int key[MAXN];
  double priority[MAXN];
  int all[MAXN];
  int premax[MAXN];
  int sufmax[MAXN];
  bool change[MAXN];
  int tag[MAXN];
  bool rev[MAXN];

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

  void up(int i){
      sz[i]=1+sz[ls[i]]+sz[rs[i]];
      sum[i]=sum[ls[i]]+sum[rs[i]]+key[i];
      premax[i]=max(premax[ls[i]],sum[ls[i]]+key[i]+premax[rs[i]]);
      sufmax[i]=max(sufmax[rs[i]],sum[rs[i]]+key[i]+sufmax[ls[i]]);
      all[i]=max(max(all[ls[i]],all[rs[i]]),key[i]+sufmax[ls[i]]+premax[rs[i]]);
  }

  int newnode(int val){
      int cnt=sta[top--];
      sz[cnt]=1;
      key[cnt]=val,sum[cnt]=val;
      all[cnt]=val,premax[cnt]=max(0,val),sufmax[cnt]=max(0,val);
      ls[cnt]=rs[cnt]=0;
      change[cnt]=0,rev[cnt]=0;
      priority[cnt]=(double)rand()/RAND_MAX;
      return cnt;
  }

  void lazyreverse(int i){
      if(i==0){
          return ;
      }
      rev[i]^=1;
      swap(premax[i],sufmax[i]);
      swap(ls[i],rs[i]);
  }

  void lazyreplace(int i,int v){
      if(i==0){
          return ;
      }
      key[i]=v;
      sum[i]=v*sz[i];
      rev[i]=false;
      premax[i]=max(0,sum[i]);
      sufmax[i]=max(0,sum[i]);
      all[i]=max(v,sum[i]);
      change[i]=true;
      tag[i]=v;
  }

  void down(int i){
      if(i==0){
          return ;
      }
      if(rev[i]){
          if(ls[i]){
              lazyreverse(ls[i]);
          }
          if(rs[i]){
              lazyreverse(rs[i]);
          }
          rev[i]=false;
      }
      if(change[i]){
          if(ls[i]){
              lazyreplace(ls[i],tag[i]);
          }
          if(rs[i]){
              lazyreplace(rs[i],tag[i]);
          }
          change[i]=false;
      }
  }

  void split(int l,int r,int i,int rk){
      if(i==0){
          rs[l]=ls[r]=0;
      }
      else{
          down(i);
          if(sz[ls[i]]+1<=rk){
              rs[l]=i;
              split(i,r,rs[i],rk-sz[ls[i]]-1);
          }
          else{
              ls[r]=i;
              split(l,i,ls[i],rk);
          }
          up(i);
      }
  }

  int merge(int l,int r){
      if(l==0||r==0){
          return l+r;
      }
      if (priority[l] >= priority[r]) {
          down(l);//下发懒信息
          rs[l] = merge(rs[l], r);
          up(l);
          return l;
      } else {
          down(r);
          ls[r] = merge(l, ls[r]);
          up(r);
          return r;
      }
  }

  void freenode(int u){
      if(u==0){
          return ;
      }
      sta[++top]=u;
      if(ls[u]){
          freenode(ls[u]);
      }
      if(rs[u]){
          freenode(rs[u]);
      }
  }

  void get(int rk){
      int u=head;
      while(rk){
          down(u);
          if(sz[ls[u]]+1==rk){
              cout<<key[u]<<endl;
              break;
          }
          else if(sz[ls[u]]+1<rk){
              rk-=sz[ls[u]]+1;
              u=rs[u];
          }
          else{
              u=ls[u];
          }
      }
  }

  int main()
  {
      all[0]=-INF;
      for(int i=1;i<MAXN;i++){
          sta[i]=i;
      }
      top=MAXN-1;

      n=read(),m=read();
      for(int i=1;i<=n;i++){
          int val=read();
          head=merge(head,newnode(val));
      }

      while(m--){
          string s;
          int x;
          cin>>s>>x;
          if(s[0]=='I'){
              int t=read();
              split(0,0,head,x);
              int l=rs[0];
              int r=ls[0];
              for(int i=1;i<=t;i++){
                  int val=read();
                  l=merge(l,newnode(val));
              }
              head=merge(l,r);
          }
          else if(s[0]=='D'){
              int t=read();
              split(0,0,head,x+t-1);
              int lm=rs[0];
              int r=ls[0];
              split(0,0,lm,x-1);
              freenode(ls[0]);
              head=merge(rs[0],r);
          }
          else if(s[0]=='R'){
              int t=read();
              split(0,0,head,x+t-1);
              int lm=rs[0];
              int r=ls[0];
              split(0,0,lm,x-1);
              lazyreverse(ls[0]);
              head=merge(merge(rs[0],ls[0]),r);
          }
          else if(s[0]=='M'){
              int t=read();
              split(0,0,head,x+t-1);
              int lm=rs[0];
              int r=ls[0];
              split(0,0,lm,x-1);
              if((int)s.length()==7){
                  cout<<all[ls[0]]<<endl;
              }
              else{
                  int v=read();
                  lazyreplace(ls[0],v);
              }
              head=merge(merge(rs[0],ls[0]),r);
          }
          else if(s[0]=='G'){
              if((int)s.length()==3){
                  get(x);
              }
              else{
                  int t=read();
                  split(0,0,head,x+t-1);
                  int lm=rs[0];
                  int r=ls[0];
                  split(0,0,lm,x-1);
                  cout<<sum[ls[0]]<<endl;
                  head=merge(merge(rs[0],ls[0]),r);
              }
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2710
external_platform: '洛谷'
external_problem_id: 'P2710'
external_title: '數列'
external_relation: original
source_book_pages: [296, 299]
source_pdf_pages: [314, 317]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
