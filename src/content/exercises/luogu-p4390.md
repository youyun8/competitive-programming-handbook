---
id: luogu-p4390
volume: upper
source_file: upper-volume
title: '洛谷 P4390 [BalkanOI 2007] Mokia'
chapter: 4
section: '4.17'
kind: external-oj
difficulty: 5
topics: ['CDQ 分治', '三維偏序', 'Fenwick tree']
prerequisites: ['CDQ 分治', '三維偏序', 'Fenwick tree']
statement: |-
  維護大正方形中的點加值，離線回答操作當時的矩形和。
constraints:
  - 'w <= 2000000'
  - '更新 <= 160000'
  - '查詢 <= 10000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      0 4
      1 2 3 3
      2 1 1 3 3
      1 2 2 2
      2 2 2 3 4
      3
    output: |-
      3
      5
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['CDQ 分治', '三維偏序', 'Fenwick tree']
judgment: |-
  矩形查詢拆成四個二維前綴；時間維必保證只統計先前更新。
hints:
  - '先辨識核心模型：CDQ 分治、三維偏序、Fenwick tree；暫時不要處理所有操作細節。'
  - '矩形查詢拆成四個二維前綴；時間維必保證只統計先前更新。'
  - '最後依此不變量實作：把每次更新視為 (time,x,y,delta)，每次前綴查詢視為帶正負號事件。對時間 CDQ，跨區間按 x 排序，用 Fenwick 統計 y 前綴。'
solution_outline: |-
  把每次更新視為 (time,x,y,delta)，每次前綴查詢視為帶正負號事件。對時間 CDQ，跨區間按 x 排序，用 Fenwick 統計 y 前綴。
proof_or_invariant: |-
  容斥把矩形和化為四個前綴和；CDQ 在每對更新與後續詢問首次分居左右時加入一次貢獻，Fenwick 的 x、y 條件恰是前綴範圍。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O(K log^2 K)'
  space: 'O(K+w)'
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
  const int MAXM = 2e6+5;
  const int MAXQ = 1e4+5;

  int w;

  struct node{
      int x,y,v,id;
  }nums[MAXN];
  int cnte;
  int cntq;

  int ans[MAXQ];

  int tree[MAXM];

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

  inline int lowbit(int x){
      return x&-x;
  }

  void add(int x,int v){
      while(x<=w){
          tree[x]+=v;
          x+=lowbit(x);
      }
  }

  int query(int x){
      int ans=0;
      while(x){
          ans+=tree[x];
          x-=lowbit(x);
      }
      return ans;
  }

  bool cmp(node a,node b){
      return a.x<b.x;
  }

  void merge(int l,int mid,int r){
      int p1,p2;
      for(p1=l-1,p2=mid+1;p2<=r;p2++){
          while(p1+1<=mid&&nums[p1+1].x<=nums[p2].x){
              p1++;
              if(nums[p1].id==0){
                  add(nums[p1].y,nums[p1].v);
              }
          }
          ans[nums[p2].id]+=nums[p2].v*query(nums[p2].y);
      }
      for(int i=l;i<=p1;i++){
          if(nums[i].id==0){
              add(nums[i].y,-nums[i].v);
          }
      }
      sort(nums+l,nums+r+1,cmp);
  }

  void cdq(int l,int r){
      if(l==r){
          return ;
      }
      int mid=(l+r)/2;
      cdq(l,mid);
      cdq(mid+1,r);
      merge(l,mid,r);
  }

  int main()
  {
      int op;
      op=read(),w=read();
      w++;
      op=read();
      while(op!=3){
          if(op==1){
              nums[++cnte].x=read()+1;
              nums[cnte].y=read()+1;
              nums[cnte].v=read();
          }
          else{
              int a,b,c,d;
              cntq++;
              a=read(),b=read(),c=read(),d=read();
              a++,b++,c++,d++;
              nums[++cnte]={c,d,1,cntq};
              nums[++cnte]={a-1,b-1,1,cntq};
              nums[++cnte]={a-1,d,-1,cntq};
              nums[++cnte]={c,b-1,-1,cntq};
          }
          op=read();
      }
      cdq(1,cnte);
      for(int i=1;i<=cntq;i++){
          printf("%d\n",ans[i]);
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4390
external_platform: '洛谷'
external_problem_id: 'P4390'
external_title: '[BalkanOI 2007] Mokia'
external_relation: original
source_book_pages: [300, 309]
source_pdf_pages: [318, 327]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
