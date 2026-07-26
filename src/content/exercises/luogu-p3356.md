---
id: luogu-p3356
volume: lower
source_file: lower-volume
original_label: '洛谷 P3356'
title: '洛谷 P3356 火星探險問題'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 5
topics: ['最大費用流', '路徑分解']
prerequisites: ['min-cost-flow']
statement: |-
  多部探測車只能向南或東，先最大化抵達數，再最大化只採一次的岩石數，輸出移動方案。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      1
      1
      1
      0
    output: |-

    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最大費用流', '路徑分解']
judgment: |-
  障礙格不建點；岩石格設容量一收益一及額外零收益通道。
hints:
  - '先辨識核心轉換：最大費用流、路徑分解。'
  - '障礙格不建點；岩石格設容量一收益一及額外零收益通道。'
  - '依「從登陸點向傳送器送至多 n 單位最大費流，再沿正流量移動邊逐車分解輸出。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  從登陸點向傳送器送至多 n 單位最大費流，再沿正流量移動邊逐車分解輸出。
proof_or_invariant: |-
  每單位流是可達路徑；岩石收益邊容量一保證只採一次。最大流優先確保抵達數，最大費再最佳化岩石數。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(nVE)'
  space: 'O(pq)'
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
  #include<bits/stdc++.h>
  using namespace std;
  const int maxn = 10021;
  const int maxm = 10021;
  const int inf = 2147483647;
  int n,m,cnt,str,sink_node,tot = -1,maxcost,p;
  int head[maxn],pre[maxn],last[maxn],flow[maxn],d[maxn],pos[50][50];
  bool vis[maxn],v[maxn];
  struct node
  {
      int net,va,cost,to;
  }edges[maxm<<3];

  int read()
  {
      int res=0;
      char c=getchar();
      while (c<'0'||c>'9')
          c=getchar();
      while (c>='0'&&c<='9')
      {
          res=res*10+c-'0';
          c=getchar();
      }
      return res;
  }

  void add(int a,int b,int va,int cost)
  {
      edges[++tot].cost = cost;
      edges[tot].net = head[a];
      edges[tot].to = b;
      edges[tot].va = va;
      head[a] = tot;
      edges[++tot].cost = -cost;
      edges[tot].net = head[b];
      edges[tot].to = a;
      edges[tot].va = 0;
      head[b] = tot;
  }

  bool SPFA()
  {
      memset(d,0x3f,sizeof(d));
      memset(flow,0x3f,sizeof(flow));
      memset(vis,0,sizeof(vis));
      queue<int> q;
      q.push(str);
      vis[str] = 1;
      d[str] = 0;
      pre[sink_node] = -1;
      while(!q.empty())
      {
          int from = q.front();q.pop();
          vis[from] = 0;
          for(int i=head[from];i!=-1;i=edges[i].net)
          {
              int to = edges[i].to ;
              int va = edges[i].va ;
              int cost = edges[i].cost ;
              if(va&&d[to]>d[from]+cost)
              {
                  d[to] = d[from]+cost;
                  pre[to] = from;
                  last[to] = i;
                  flow[to] = min(flow[from],va);
                  if(!vis[to])
                  {
                      vis[to] = 1;
                      q.push(to);
                  }
              }
          }
      }
      return pre[sink_node] != -1;
  }

  void MCMF()
  {
      while(SPFA())
      {
          int now = sink_node;
          maxcost += flow[sink_node]*d[sink_node];
          while(now!=str)
          {
              edges[last[now]].va -= flow[sink_node];
              edges[last[now]^1].va += flow[sink_node];
              now = pre[now];
          }
      }
  }

  void print(int id,int x)
  {
      int temp = x - 2 * n * m;
      for(int i=head[x];i!=-1;i=edges[i].net)
      {
          int to = edges[i].to ;
          int va = edges[i].va ;
          if(!va) continue;
          int tt = to - 2 * n * m;
          if(temp+1==tt)  printf("%d 1\n",id);
          else            printf("%d 0\n",id);
          edges[i].va--;
          print(id,to);
          break;
      }
  }

  int main()
  {
      memset(head,-1,sizeof(head));
      cnt = read();m = read();n = read();
      str = 3 * n * m + 1;sink_node = 3 * n * m + 2;
      for(int i=1;i<=n;i++)
          for(int j=1;j<=m;j++)
              pos[i][j] = ++p;
      add(str,1,cnt,0);
      add(2*n*m,sink_node,cnt,0);
      for(int i=1;i<=n;i++)
      {
          for(int j=1;j<=m;j++)
          {
              int x = read();
              if(x==2)    add(pos[i][j],pos[i][j]+n*m,1,-1);
              if(x!=1)    add(pos[i][j],pos[i][j]+n*m,inf,0);
              else    v[pos[i][j]] = 1;
          }
      }
      for(int i=1;i<=n;i++)
          for(int j=2;j<=m;j++)
              add(pos[i][j-1]+n*m,pos[i][j],inf,0);
      for(int i=2;i<=n;i++)
          for(int j=1;j<=m;j++)
              add(pos[i-1][j]+n*m,pos[i][j],inf,0);
      MCMF();
      for(int x=1+n*m;x<2*n*m;x++)
      {
          if(v[x-n*m])    continue;
          for(int i=head[x];i!=-1;i=edges[i].net)
          {
              int va = edges[i].va ;
              int to = edges[i].to ;
              if(to+n*m==x)   continue;
              if(va==inf) continue;
              if(to!=sink_node)
                  add(x+m*n,to+2*n*m,inf-va,0);
          }
      }
      for(int i=1;i<=cnt;i++)
          print(i,1+2*n*m);
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3356
external_platform: '洛谷'
external_problem_id: 'P3356'
external_title: '火星探險問題'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
