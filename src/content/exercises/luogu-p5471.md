---
id: luogu-p5471
volume: upper
source_file: upper-volume
title: '洛谷 P5471 [NOI2019] 彈跳'
chapter: 4
section: '4.17'
kind: external-oj
difficulty: 5
topics: ['KD-tree', 'Dijkstra', '矩形批次鬆弛']
prerequisites: ['KD-tree', 'Dijkstra', '矩形批次鬆弛']
statement: |-
  城市是平面點；每個裝置從所屬城市以費用 t 跳到指定矩形內任一城市，求首都到所有城市的最短時間。
constraints:
  - 'n <= 70000'
  - 'm <= 150000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      2 1 2 1
      1 1
      2 1
      1 5 2 2 1 1
    output: |-
      5
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['KD-tree', 'Dijkstra', '矩形批次鬆弛']
judgment: |-
  不能顯式建立裝置到矩形內每座城市的邊；不可達答案依官方規格輸出。
hints:
  - '先辨識核心模型：KD-tree、Dijkstra、矩形批次鬆弛；暫時不要處理所有操作細節。'
  - '不能顯式建立裝置到矩形內每座城市的邊；不可達答案依官方規格輸出。'
  - '最後依此不變量實作：KD-tree 保存尚未定案城市。Dijkstra 堆中放裝置矩形及候選距離；取出矩形後在 KD-tree 枚舉並刪除其中尚未定案的城市，為這些城市定距，再把它們的裝置加入堆。'
solution_outline: |-
  KD-tree 保存尚未定案城市。Dijkstra 堆中放裝置矩形及候選距離；取出矩形後在 KD-tree 枚舉並刪除其中尚未定案的城市，為這些城市定距，再把它們的裝置加入堆。
proof_or_invariant: |-
  Dijkstra 首次以最小候選距離取出的城市距離已最短；KD-tree 刪除使每城只定案一次。每個裝置在其起點定案時入堆，等價於隱式圖的所有邊鬆弛。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O((n+m)log^2 n)'
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
  const int MAXN = 7e4+5;
  const int MAXM = 150005;
  const long long INF = 1e18;

  int n,m,w,h;

  int posx[MAXN];
  int posy[MAXN];

  long long dis[MAXN];

  struct node{
      long long t;
      int l,r,u,d;
  };
  node nums[MAXM];

  struct compare{
      bool operator()(node a,node b){
          return a.t>b.t;
      }
  };
  priority_queue<node,vector<node>,compare>heap;

  int head[MAXN];
  int nxt[MAXM];
  int to[MAXM];
  int cnt=1;

  set<pair<int,int>> tree[MAXN<<2];

  int cand[MAXN];
  int candcnt;

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

  inline void addedge(int u,int v){
      nxt[cnt]=head[u];
      to[cnt]=v;
      head[u]=cnt++;
  }

  void insert(int pos,int joby,int jobv,int l,int r,int i){
      tree[i].insert({joby,jobv});
      if(l==r){
          return ;
      }
      else{
          int mid=(l+r)>>1;
          if(pos<=mid){
              insert(pos,joby,jobv,l,mid,i<<1);
          }
          else{
              insert(pos,joby,jobv,mid+1,r,i<<1|1);
          }
      }
  }

  void remove(int pos,int joby,int jobv,int l,int r,int i){
      auto it=tree[i].find({joby,jobv});
      if(it==tree[i].end()){
          return ;
      }
      tree[i].erase(it);

      if(l==r){
          return ;
      }
      else{
          int mid=(l+r)>>1;
          if(pos<=mid){
              remove(pos,joby,jobv,l,mid,i<<1);
          }
          else{
              remove(pos,joby,jobv,mid+1,r,i<<1|1);
          }
      }
  }

  void query(int jobl,int jobr,int jobd,int jobu,int l,int r,int i){
      if(jobl<=l&&r<=jobr){
          auto itl=tree[i].lower_bound({jobd,0});
          auto itr=tree[i].upper_bound({jobu,MAXN});

          for(auto it=itl;it!=itr;it++){
              cand[++candcnt]=it->second;
          }
      }
      else{
          int mid=(l+r)>>1;
          if(jobl<=mid){
              query(jobl,jobr,jobd,jobu,l,mid,i<<1);
          }
          if(jobr>mid){
              query(jobl,jobr,jobd,jobu,mid+1,r,i<<1|1);
          }
      }
  }

  void dijkstra(){
      for(int i=1;i<=n;i++){
          dis[i]=INF;
      }
      dis[1]=0;
      remove(posx[1],posy[1],1,1,w,1);
      for(int i=head[1];i;i=nxt[i]){
          int v=to[i];
          heap.push(nums[v]);
      }

      while(!heap.empty()){
          node tmp=heap.top();
          heap.pop();
          candcnt=0;
          query(tmp.l,tmp.r,tmp.d,tmp.u,1,w,1);

          for(int i=1;i<=candcnt;i++){
              if(dis[cand[i]]>tmp.t){
                  dis[cand[i]]=tmp.t;
                  remove(posx[cand[i]],posy[cand[i]],cand[i],1,w,1);
                  for(int ei=head[cand[i]];ei;ei=nxt[ei]){
                      int v=to[ei];
                      node temp=nums[v];
                      temp.t=dis[cand[i]]+nums[v].t;
                      heap.push(temp);
                  }
              }
          }
      }
  }

  int main()
  {
      n=read(),m=read(),w=read(),h=read();
      for(int i=1;i<=n;i++){
          posx[i]=read(),posy[i]=read();
      }
      for(int i=1;i<=m;i++){
          int u=read();
          addedge(u,i);
          nums[i].t=read(),nums[i].l=read(),nums[i].r=read(),nums[i].d=read(),nums[i].u=read();
      }

      for(int i=1;i<=n;i++){
          insert(posx[i],posy[i],i,1,w,1);
      }

      dijkstra();

      for(int i=2;i<=n;i++){
          printf("%lld\n",dis[i]);
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5471
external_platform: '洛谷'
external_problem_id: 'P5471'
external_title: '[NOI2019] 彈跳'
external_relation: original
source_book_pages: [300, 309]
source_pdf_pages: [318, 327]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
