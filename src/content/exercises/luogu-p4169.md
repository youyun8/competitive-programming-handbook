---
id: luogu-p4169
volume: upper
source_file: upper-volume
title: '洛谷 P4169 [Violet] 天使玩偶'
chapter: 4
section: '4.17'
kind: external-oj
difficulty: 5
topics: ['CDQ 分治', '四象限', 'Fenwick tree']
prerequisites: ['CDQ 分治', '四象限', 'Fenwick tree']
statement: |-
  初始有若干平面點，動態加入新點；查詢給定位置到目前點集的最小曼哈頓距離。
constraints:
  - 'n,m <= 300000'
  - '0 <= x,y <= 1000000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      2 3
      1 1
      2 3
      2 1 2
      1 3 3
      2 4 2
    output: |-
      1
      2
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['CDQ 分治', '四象限', 'Fenwick tree']
judgment: |-
  只有時間較早的插入能回答查詢；座標可為 0。
hints:
  - '先辨識核心模型：CDQ 分治、四象限、Fenwick tree；暫時不要處理所有操作細節。'
  - '只有時間較早的插入能回答查詢；座標可為 0。'
  - '最後依此不變量實作：曼哈頓距離按四個象限拆成線性式。對時間做 CDQ：左半插入影響右半查詢；每次按 x 排序並用 Fenwick 維護 y 前綴最佳 x+y。翻轉座標共做四次。'
solution_outline: |-
  曼哈頓距離按四個象限拆成線性式。對時間做 CDQ：左半插入影響右半查詢；每次按 x 排序並用 Fenwick 維護 y 前綴最佳 x+y。翻轉座標共做四次。
proof_or_invariant: |-
  任一點相對查詢位於四象限之一；該象限距離可寫成查詢常數減插入點線性式。CDQ 恰枚舉所有較早插入對較晚查詢的影響，取四次最小即答案。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O((n+m)log^2(n+m))'
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
  #include<bits/stdc++.h>
  using namespace std;
  const int MAXN = 3e5+5;
  const int MAXM = 1e6+5;
  const int INF = 1e9;

  int n,m,v;

  int cnt;
  struct node{
      int op,x,y,id;
  };
  node nums[MAXN<<1];
  node tmp[MAXN<<1];

  int cntq;
  int ans[MAXN];

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

  bool cmp(node a,node b){
      return a.x<b.x;
  }

  inline int lowbit(int x){
      return x&-x;
  }

  void update(int x,int val){
      while(x<=v){
          tree[x]=max(tree[x],val);
          x+=lowbit(x);
      }
  }

  int query(int x){
      int ans=-INF;
      while(x){
          ans=max(ans,tree[x]);
          x-=lowbit(x);
      }
      return ans;
  }

  void clear(int x){
      while(x<=v){
          tree[x]=-INF;
          x+=lowbit(x);
      }
  }

  void merge(int l,int mid,int r){
      int p1=l-1,p2=mid+1;
      for(;p2<=r;p2++){
          while(p1+1<=mid&&tmp[p1+1].x<=tmp[p2].x){
              p1++;
              if(tmp[p1].op==1){
                  update(tmp[p1].y,tmp[p1].x+tmp[p1].y);
              }
          }
          if(tmp[p2].op==2){
              ans[tmp[p2].id]=min(ans[tmp[p2].id],tmp[p2].x+tmp[p2].y-query(tmp[p2].y));
          }
      }
      for(int i=l;i<=p1;i++){
          if(tmp[i].op==1){
              clear(tmp[i].y);
          }
      }
      sort(tmp+l,tmp+r+1,cmp);
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

  void to1(){
      for(int i=1;i<=cnt;i++){
          tmp[i]=nums[i];
      }
      cdq(1,cnt);
  }

  void to2(){
      for(int i=1;i<=cnt;i++){
          tmp[i]=nums[i];
          tmp[i].x=v-tmp[i].x;
      }
      cdq(1,cnt);
  }

  void to3(){
      for(int i=1;i<=cnt;i++){
          tmp[i]=nums[i];
          tmp[i].x=v-tmp[i].x;
          tmp[i].y=v-tmp[i].y;
      }
      cdq(1,cnt);
  }

  void to4(){
      for(int i=1;i<=cnt;i++){
          tmp[i]=nums[i];
          tmp[i].y=v-tmp[i].y;
      }
      cdq(1,cnt);
  }

  int main()
  {
      n=read(),m=read();
      for(int i=1;i<=n;i++){
          int x,y;
          x=read(),y=read();
          x++,y++;
          nums[++cnt]={1,x,y,0};
          v=max(v,max(x,y));
      }
      for(int i=1;i<=m;i++){
          ++cnt;
          nums[cnt].op=read(),nums[cnt].x=read()+1,nums[cnt].y=read()+1;
          if(nums[cnt].op==2){
              nums[cnt].id=++cntq;
          }
          v=max(v,max(nums[cnt].x,nums[cnt].y));
      }
      v++;
      for(int i=1;i<=v;i++){
          tree[i]=-INF;
      }
      for(int i=1;i<=cntq;i++){
          ans[i]=INF;
      }
      to1();
      to2();
      to3();
      to4();
      for(int i=1;i<=cntq;i++){
          printf("%d\n",ans[i]);
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4169
external_platform: '洛谷'
external_problem_id: 'P4169'
external_title: '[Violet] 天使玩偶'
external_relation: original
source_book_pages: [300, 309]
source_pdf_pages: [318, 327]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
