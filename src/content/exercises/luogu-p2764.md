---
id: luogu-p2764
volume: lower
source_file: lower-volume
original_label: '洛谷 P2764'
title: '洛谷 P2764 最小路徑覆蓋問題'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 3
topics: ['DAG 最小路徑覆蓋', '二分圖匹配']
prerequisites: ['bipartite']
statement: |-
  給定 DAG，輸出一組頂點不相交的最小路徑覆蓋及路徑數。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      11 12
      1 2
      1 3
      1 4
      2 5
      3 6
      4 7
      5 8
      6 9
      7 10
      8 11
      9 11
      10 11
    output: |-
      1 4 7 10 11
      2 5 8
      3 6 9
      3
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['DAG 最小路徑覆蓋', '二分圖匹配']
judgment: |-
  把每點拆為左、右副本，原邊 u→v 變成左 u 到右 v 的邊。
hints:
  - '先辨識核心轉換：DAG 最小路徑覆蓋、二分圖匹配。'
  - '把每點拆為左、右副本，原邊 u→v 變成左 u 到右 v 的邊。'
  - '依「求最大匹配；未作為後繼的點是路徑起點，沿匹配後繼輸出。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  求最大匹配；未作為後繼的點是路徑起點，沿匹配後繼輸出。
proof_or_invariant: |-
  每條匹配邊合併兩條路徑且不造成分叉；DAG 無環。最大可合併數為最大匹配，所以答案 n-|M|。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(nm)'
  space: 'O(n+m)'
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
  #include <iostream>
  #include <cstring>
  #include <cstdio>
  #define MX 20001
  #define S 0
  #define T ((n<<1)+1)
  #define oo 12312312
  using namespace std;
  typedef struct edge_t
  {
      int u,v,c;
  }edge;
  edge e[MX];
  int fst[MX],nxt[MX],lnum;
  int n,m;
  void addeg(int nu,int nv,int nc)
  {
      nxt[++lnum]=fst[nu];
      fst[nu]=lnum;
      e[lnum]=(edge){nu,nv,nc};
  }
  void input()
  {
      int a,b;
      scanf("%d%d",&n,&m);
      for(int i=1;i<=m;i++)
      {
          scanf("%d%d",&a,&b);
          addeg(a,n+b,1);
          addeg(n+b,a,0);
      }
      for(int i=1;i<=n;i++)addeg(S,i,1),addeg(i,S,0);
      for(int i=n+1;i<=n<<1;i++)addeg(i,T,1),addeg(T,i,0);
  }
  void init()
  {
      memset(fst,0xff,sizeof(fst));
      lnum=-1;
  }
  int dep[MX],q[MX];
  int bfs(int frm,int to)
  {
      int x,y,h=0,t=1;
      memset(dep,0xff,sizeof(dep));
      q[++h]=frm;
      dep[frm]=0;
      while(h>=t)
      {
          x=q[t++];
          for(int i=fst[x];i!=-1;i=nxt[i])
          {
              y=e[i].v;
              if(e[i].c&&dep[y]==-1)
              {
                  dep[y]=dep[x]+1;
                  q[++h]=y;
              }
          }
      }
      return (dep[to]>=0);
  }
  int dinic(int to,int x,int mn)
  {
      if(x==to)return mn;
      int a,now=0,y;
      for(int i=fst[x];i!=-1;i=nxt[i])
      {
          y=e[i].v;
          if(e[i].c&&dep[y]==dep[x]+1)
          {
              a=dinic(to,y,min(mn-now,e[i].c));
              now+=a;
              e[i].c-=a;
              e[i^1].c+=a;
              if(now==mn)break;
          }
      }
      return now;
  }
  void output(int x, bool& first)
  {
      if(!first) putchar(' ');
      printf("%d",x);
      first=false;
      for(int i=fst[x];i!=-1;i=nxt[i])
          if(e[i].c==0&&e[i].v>n)
              output(e[i].v-n,first);
  }
  int fa[MX];
  int findfa(int x){return x==fa[x]?x:fa[x]=findfa(fa[x]);}
  void work()
  {
      int tot=0;
      while(bfs(S,T))tot+=dinic(T,S,+oo);
      for(int i=1;i<=n;i++)fa[i]=i;
      for(int i=0;i<=lnum;i++)
          if(e[i].u>=1&&e[i].u<=n&&e[i].v>n&&e[i].v<T&&e[i].c==0)
              fa[findfa(e[i].v-n)]=findfa(e[i].u);
      for(int i=1;i<=n;i++)
          if(findfa(i)==i)
          {
              bool first=true;
              output(i,first);
              putchar('\n');
          }
      printf("%d\n",n-tot);
  }
  int main()
  {
      init();
      input();
      work();
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2764
external_platform: '洛谷'
external_problem_id: 'P2764'
external_title: '最小路徑覆蓋問題'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
