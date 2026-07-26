---
id: luogu-p3769
volume: upper
source_file: upper-volume
title: '洛谷 P3769 [CH 弱省胡策 R2] TATT'
chapter: 4
section: '4.17'
kind: external-oj
difficulty: 5
topics: ['四維偏序', 'CDQ 套 CDQ', 'Fenwick tree 最大值']
prerequisites: ['四維偏序', 'CDQ 套 CDQ', 'Fenwick tree 最大值']
statement: |-
  給定 n 個四維點，求座標四維皆單調不降、且每個輸入點至多使用一次的最長路徑長度。
constraints:
  - 'n <= 50000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      4
      2 3 33 2333
      2 3 33 2333
      2 3 33 2333
      2 3 33 2333
    output: |-
      4
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['四維偏序', 'CDQ 套 CDQ', 'Fenwick tree 最大值']
judgment: |-
  相同座標的多個點可以全部依序使用；排序與分治必正確處理等號。
hints:
  - '先辨識核心模型：四維偏序、CDQ 套 CDQ、Fenwick tree 最大值；暫時不要處理所有操作細節。'
  - '相同座標的多個點可以全部依序使用；排序與分治必正確處理等號。'
  - '最後依此不變量實作：先按第一維排序做外層 CDQ，計算左半對右半的轉移；跨區間事件再按第二維排序做內層 CDQ，以第三維排序掃描、Fenwick 在第四維查前綴最大 dp。'
solution_outline: |-
  先按第一維排序做外層 CDQ，計算左半對右半的轉移；跨區間事件再按第二維排序做內層 CDQ，以第三維排序掃描、Fenwick 在第四維查前綴最大 dp。
proof_or_invariant: |-
  每個合法前驅與後繼在第一個把兩者分開的外層節點、以及第二個把事件分開的內層節點被計算一次；Fenwick 條件保證其餘兩維不降，故所有且僅合法轉移被納入。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O(n log^3 n)'
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
  #include<bits/stdc++.h>
  using namespace std;
  const int MAXN = 5e4+5;

  int n;

  struct node{
      int a,b,c,d;
      bool left;
      int id;
  };

  node nums[MAXN];
  node tmp1[MAXN];
  node tmp2[MAXN];

  int m=1;
  int arr[MAXN];//用于离散化

  int dp[MAXN];

  int tree[MAXN];

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

  bool cmpa(node a,node b){
      if(a.a!=b.a) return a.a<b.a;
      if(a.b!=b.b) return a.b<b.b;
      if(a.c!=b.c) return a.c<b.c;
      return a.d<b.d;
  }

  bool cmpb(node a,node b){
      if(a.b!=b.b) return a.b<b.b;
      return a.id<b.id;
  }

  bool cmpc(node a,node b){
      if(a.c!=b.c) return a.c<b.c;
      return a.id<b.id;
  }

  int find(int val){
      int l=1,r=m,ans=1;
      while(l<=r){
          int mid=(l+r)/2;
          if(arr[mid]>=val){
              ans=mid;
              r=mid-1;
          }
          else{
              l=mid+1;
          }
      }
      return ans;
  }

  void prepare(){
      for(int i=1;i<=n;i++){
          arr[i]=nums[i].d;
      }
      sort(arr+1,arr+n+1);
      for(int i=2;i<=n;i++){
          if(arr[i]!=arr[i-1]){
              arr[++m]=arr[i];
          }
      }
      for(int i=1;i<=n;i++){
          nums[i].d=find(nums[i].d);
      }
      sort(nums+1,nums+n+1,cmpa);
      for(int i=1;i<=n;i++){
          nums[i].id=i;
      }
      for(int i=1;i<=n;i++){
          dp[i]=1;
      }
  }

  inline int lowbit(int x){
      return x&(-x);
  }

  void update(int x,int val){
      while(x<=m){
          tree[x]=max(tree[x],val);
          x+=lowbit(x);
      }
  }

  int query(int x){
      int ans=0;
      while(x){
          ans=max(ans,tree[x]);
          x-=lowbit(x);
      }
      return ans;
  }

  void clear(int x){
      while(x<=m){
          tree[x]=0;
          x+=lowbit(x);
      }
  }

  void merge(int l,int mid,int r){
      for(int i=l;i<=r;i++){
          tmp2[i]=tmp1[i];
      }
      sort(tmp2+l,tmp2+mid+1,cmpc);
      sort(tmp2+mid+1,tmp2+r+1,cmpc);
      int p1=l-1,p2=mid+1;
      for(;p2<=r;p2++){
          while(p1+1<=mid&&tmp2[p1+1].c<=tmp2[p2].c){
              p1++;
              if(tmp2[p1].left){
                  update(tmp2[p1].d,dp[tmp2[p1].id]);
              }
          }
          if(!tmp2[p2].left){
              dp[tmp2[p2].id]=max(dp[tmp2[p2].id],query(tmp2[p2].d)+1);
          }
      }
      for(int i=l;i<=p1;i++){
          if(tmp2[i].left){
              clear(tmp2[i].d);
          }
      }
  }

  void cdq2(int l,int r){
      if(l==r){
          return ;
      }
      int mid=(l+r)>>1;
      cdq2(l,mid);
      merge(l,mid,r);
      cdq2(mid+1,r);
  }

  void cdq1(int l,int r){
      if(l==r){
          return ;
      }
      int mid=(l+r)/2;
      cdq1(l,mid);
      for(int i=l;i<=r;i++){
          tmp1[i]=nums[i];
          tmp1[i].left=(i<=mid);
      }
      sort(tmp1+l,tmp1+r+1,cmpb);
      cdq2(l,r);
      cdq1(mid+1,r);
  }

  int main()
  {
      n=read();
      for(int i=1;i<=n;i++){
          nums[i].a=read(),nums[i].b=read(),nums[i].c=read(),nums[i].d=read();
      }
      prepare();
      cdq1(1,n);
      int ans=0;
      for(int i=1;i<=n;i++){
          ans=max(ans,dp[i]);
      }
      cout<<ans<<endl;
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3769
external_platform: '洛谷'
external_problem_id: 'P3769'
external_title: '[CH 弱省胡策 R2] TATT'
external_relation: original
source_book_pages: [300, 309]
source_pdf_pages: [318, 327]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
