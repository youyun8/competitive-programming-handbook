---
id: luogu-p3159
volume: lower
source_file: lower-volume
original_label: '洛谷 P3159'
title: '洛谷 P3159 交換棋子'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 5
topics: ['最小費用流', '格點拆點']
prerequisites: ['min-cost-flow']
statement: |-
  八鄰交換 01 棋子，每格參與交換次數有限，求達成目標的最少交換數。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3 3
      110
      000
      001
      000
      110
      100
      222
      222
      222
    output: |-
      4
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最小費用流', '格點拆點']
judgment: |-
  只需搬運初末不同的 1；中途格每穿越一次消耗兩次參與額度，端點可能多一次。
hints:
  - '先辨識核心轉換：最小費用流、格點拆點。'
  - '只需搬運初末不同的 1；中途格每穿越一次消耗兩次參與額度，端點可能多一次。'
  - '依「格點拆入出，容量為上限/2，異色端且上限奇數再加一；鄰格邊費用一，從多餘 1 送流到缺少 1。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  格點拆入出，容量為上限/2，異色端且上限奇數再加一；鄰格邊費用一，從多餘 1 送流到缺少 1。
proof_or_invariant: |-
  每條流路徑描述一枚棋子的交換序列；拆點容量精確計算每格參與次數，路徑費用即交換數。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(FVE)'
  space: 'O(nm)'
cpp_skeleton: |-
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依卡片解法建立圖或狀態，完成增廣／動態規劃並輸出答案。
      return 0;
  }
cpp_solution: |-
  #if defined(__GNUC__)
  #pragma GCC diagnostic ignored "-Wconversion"
  #pragma GCC diagnostic ignored "-Wshadow"
  #pragma GCC diagnostic ignored "-Wunused-parameter"
  #pragma GCC diagnostic ignored "-Wunused-variable"
  #pragma GCC diagnostic ignored "-Wpedantic"
  #pragma GCC diagnostic ignored "-Wcomment"
  #pragma GCC diagnostic ignored "-Wsign-compare"
  #pragma GCC diagnostic ignored "-Wmisleading-indentation"
  #endif
  #include <bits/stdc++.h>
  using namespace std;
  const int N=1e3+10;
  const int M=5e4+10;
  const int inf=1e8+10;
  int p,n,m,s,t,S,T,fans,cans;
  struct edge{
      int adj,nex,fw,r;
  }e[M];
  int g[N],top=1;
  void add(int x,int y,int z,int w){
      e[++top]=(edge){y,g[x],z,w};
      g[x]=top;
  }
  void Add(int x,int y,int z,int w){
      add(x,y,z,w),add(y,x,0,-w);
  }
  int dep[N],cur[N];
  bool vis[N];
  queue<int> Q;
  bool spfa(){
      for(int i=1;i<=p;i++)
          vis[i]=0,dep[i]=inf,cur[i]=g[i];
      Q.push(s),vis[s]=1,dep[s]=0;
      while(Q.size()){
          int x=Q.front(); Q.pop();
          vis[x]=0;
          for(int i=g[x];i;i=e[i].nex){
              int to=e[i].adj,d=e[i].r;
              if(e[i].fw&&dep[to]>dep[x]+d){
                  dep[to]=dep[x]+d;
                  if(!vis[to]){
                      vis[to]=1;
                      Q.push(to);
                  }
              }
          }
      }
      return dep[t]!=inf;
  }
  int dfs(int x,int F){
      if(!F||x==t)
          return F;
      int flow=0,f;
      vis[x]=1;
      for(int i=cur[x];i;i=e[i].nex){
          int to=e[i].adj; cur[x]=i;
          if(!vis[to]&&dep[x]+e[i].r==dep[to]&&
          (f=dfs(to,min(F,e[i].fw)))>0){
              e[i].fw-=f;
              e[i^1].fw+=f;
              flow+=f,F-=f;
              if(!F){
                  vis[x]=0;
                  break;
              }
          }
      }
      return flow;
  }
  int P(int x,int y){return (x-1)*m+y;}
  int tx[]={-1,1,0,0,-1,-1,1,1};
  int ty[]={0,0,-1,1,1,-1,1,-1};
  int Ss[25][25],Ts[25][25];
  int main(){
      scanf("%d%d",&n,&m);
      p=t=2*n*m+2,s=t-1;
      char c[25];
      for(int i=1;i<=n;i++){
          scanf("%s",c);
          for(int j=1;j<=m;j++)
              if(c[j-1]=='1')
                  Ss[i][j]=1,S++;
      }
      for(int i=1;i<=n;i++){
          scanf("%s",c);
          for(int j=1;j<=m;j++)
              if(c[j-1]=='1')
                  Ts[i][j]=1,T++;
      }
      if(S!=T) return puts("-1"),0;
      for(int i=1;i<=n;i++){
          for(int j=1;j<=m;j++){
              if(Ss[i][j]&&!Ts[i][j])
                  Add(s,P(i,j),1,0),fans++;
              if(!Ss[i][j]&&Ts[i][j])
                  Add(P(i,j)+n*m,t,1,0);
          }
      }
      for(int i=1,x;i<=n;i++){
          scanf("%s",c);
          for(int j=1;j<=m;j++){
              x=c[j-1]-'0';
              Add(P(i,j),P(i,j)+n*m,x>>1,0);
              if((Ss[i][j]^Ts[i][j])&&(x&1))
                  Add(P(i,j),P(i,j)+n*m,1,0);
              for(int k=0;k<8;k++){
                  int xt=i+tx[k],yt=j+ty[k];
                  if(xt<1||xt>n||yt<1||yt>m)
                      continue;
                  Add(P(i,j)+n*m,P(xt,yt),inf,1);
              }
          }
      }
      while(spfa()){
          int d=dfs(s,inf);
          fans-=d;
          cans+=d*dep[t];
      }
      if(fans) puts("-1");
      else printf("%d\n",cans);
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3159
external_platform: '洛谷'
external_problem_id: 'P3159'
external_title: '交換棋子'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
