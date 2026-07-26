---
id: luogu-p2604
volume: lower
source_file: lower-volume
original_label: '洛谷 P2604'
title: '洛谷 P2604 網路擴容'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 4
topics: ['最大流', '殘量網路', '費用流']
prerequisites: ['min-cost-flow']
statement: |-
  先求原網路最大流，再求把最大流增加 k 所需的最小擴容費。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      5 8 2
      1 2 5 8
      2 5 9 9
      5 1 6 2
      5 1 1 8
      1 2 8 7
      2 5 4 9
      1 2 1 1
      1 4 2 1
    output: |-
      13 19
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最大流', '殘量網路', '費用流']
judgment: |-
  先跑最大流並保留殘量；每條原邊另加無限容量、單位費用 w 的擴容邊。
hints:
  - '先辨識核心轉換：最大流、殘量網路、費用流。'
  - '先跑最大流並保留殘量；每條原邊另加無限容量、單位費用 w 的擴容邊。'
  - '依「在原殘量網路上從新源限制送 k 單位最小費流。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  在原殘量網路上從新源限制送 k 單位最小費流。
proof_or_invariant: |-
  免費殘量表示不擴容即可調整的流；付費邊每用一單位恰對應一次擴容，因此額外 k 流的最小費即答案。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(V^2E+kVE)'
  space: 'O(V+E)'
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
  #include<iostream>
  #include<cstdio>
  #include<cstring>
  #include<queue>
  #define inf 0x3f3f3f3f
  using namespace std;
  #define getc() (p1==p2&&(p2=(p1=buf)+fread(buf,1,1<<21,stdin),p1==p2)?EOF:*p1++)
  char buf[1<<21],*p1=buf,*p2=buf;
  inline int read(){
      #define num ch-'0'
      char ch;bool flag=0;int res;
      while(!isdigit(ch=getc()))
      (ch=='-')&&(flag=true);
      for(res=num;isdigit(ch=getc());res=res*10+num);
      (flag)&&(res=-res);
      #undef num
      return res;
  }
  const int N=1005,M=50005;
  struct node{
      int u,v,f,e;
      node(){}
      node(int u,int v,int f,int e):u(u),v(v),f(f),e(e){}
  }E[M];
  int ver[M],Next[M],head[N],edge[M],flow[M],tot=1;
  int dis[N],disf[N],vis[N],Pre[N],last[N];
  int n,m,k,s,t,maxflow,mincost;
  queue<int> q;
  inline void add(int u,int v,int f,int e){
      ver[++tot]=v,Next[tot]=head[u],head[u]=tot,flow[tot]=f,edge[tot]=e;
      ver[++tot]=u,Next[tot]=head[v],head[v]=tot,flow[tot]=0,edge[tot]=-e;
  }
  bool spfa(){
      memset(dis,0x3f,sizeof(dis));
      q.push(s),dis[s]=0,disf[s]=inf,Pre[t]=-1;
      while(!q.empty()){
          int u=q.front();q.pop();vis[u]=0;
          for(int i=head[u];i;i=Next[i]){
              int v=ver[i];
              if(flow[i]&&dis[v]>dis[u]+edge[i]){
                  dis[v]=dis[u]+edge[i],Pre[v]=u,last[v]=i;
                  disf[v]=min(disf[u],flow[i]);
                  if(!vis[v]) vis[v]=1,q.push(v);
              }
          }
      }
      return ~Pre[t];
  }
  void dinic(){
      while(spfa()){
          int u=t;maxflow+=disf[t],mincost+=disf[t]*dis[t];
          while(u!=s){
              flow[last[u]]-=disf[t];
              flow[last[u]^1]+=disf[t];
              u=Pre[u];
          }
      }
  }
  int main(){
      n=read(),m=read(),k=read();
      s=1,t=n;
      for(int i=1;i<=m;++i){
          int u=read(),v=read(),f=read(),e=read();
          E[i]=node(u,v,f,e);
          add(u,v,f,0);
      }
      dinic();
      printf("%d ",maxflow);
      for(int i=1;i<=m;++i){
          int u=E[i].u,v=E[i].v,e=E[i].e;
          add(u,v,inf,e);
      }
      s=0;
      add(s,1,k,0);
      dinic();
      printf("%d\n",mincost);
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2604
external_platform: '洛谷'
external_problem_id: 'P2604'
external_title: '網路擴容'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
