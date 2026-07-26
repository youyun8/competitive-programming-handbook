---
id: luogu-p4617
volume: lower
source_file: lower-volume
original_label: '洛谷 P4617'
title: '洛谷 P4617 Planinarenje'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 4
topics: ['最大匹配', '交錯可達性', '博弈']
prerequisites: ['bipartite']
statement: |-
  在不重訪頂點的二分圖輪流行走遊戲中，判斷從每座山峰出發的勝者。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      2 3
      1 2
      2 2
      2 1
    output: |-
      Slavko
      Slavko
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最大匹配', '交錯可達性', '博弈']
judgment: |-
  起點為所有最大匹配都必須覆蓋的左點時，後手可配對回應而獲勝。
hints:
  - '先辨識核心轉換：最大匹配、交錯可達性、博弈。'
  - '起點為所有最大匹配都必須覆蓋的左點時，後手可配對回應而獲勝。'
  - '依「先求一組最大匹配；從未匹配左點沿「非匹配邊→匹配邊」標記可達左點。可達者輸出 Mirko，其餘 Slavko。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  先求一組最大匹配；從未匹配左點沿「非匹配邊→匹配邊」標記可達左點。可達者輸出 Mirko，其餘 Slavko。
proof_or_invariant: |-
  配對策略保證必匹配點的後手勝；若可由未匹配點沿交錯路到達，翻轉後存在不覆蓋該點的最大匹配，先手可採對偶策略。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(N+M+K sqrt(N+M))'
  space: 'O(N+M+K)'
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
  // Problem: P4617 [COCI2017-2018#5] Planinarenje
  // Contest: Luogu
  // URL: https://www.luogu.com.cn/problem/P4617
  // Memory Limit: 250 MB
  // Time Limit: 1000 ms
  // Written by yhm.
  // Start codeing:2024-09-09 21:10:55
  //
  // Powered by CP Editor (https://cpeditor.org)

  #include<bits/stdc++.h>
  #define int long long
  #define mod 998244353ll
  #define pii pair<int,int>
  #define fi first
  #define se second
  #define mems(x,y) memset(x,y,sizeof(x))
  #define pb push_back
  using namespace std;
  const int maxn=200010;
  const int inf=1e18;
  inline int read(){
  	int x=0,f=1;
  	char ch=getchar();
  	while(ch<'0'||ch>'9'){if(ch=='-')f=-1;ch=getchar();}
  	while(ch>='0'&&ch<='9'){x=(x<<3)+(x<<1)+(ch-48);ch=getchar();}
  	return x*f;
  }
  bool Mbe;

  int n,m;
  int s,t;
  int head[maxn],tot=1;
  struct nd{
  	int nxt,to,w;
  }e[maxn];
  void add(int u,int v,int w){
  	e[++tot]={head[u],v,w};head[u]=tot;
  	e[++tot]={head[v],u,0};head[v]=tot;
  }
  int dis[maxn],rad[maxn];
  queue<int> q;
  bool bfs(){
  	for(int i=1;i<=t;i++)dis[i]=0,rad[i]=head[i];
  	dis[s]=1,q.push(s);
  	while(!q.empty()){
  		int u=q.front();q.pop();
  		for(int i=head[u];i;i=e[i].nxt){
  			int v=e[i].to;
  			if(!dis[v]&&e[i].w)dis[v]=dis[u]+1,q.push(v);
  		}
  	}
  	return dis[t];
  }
  int dfs(int u,int res){
  	if(u==t)return res;
  	int cnt=0;
  	for(int i=rad[u];i;i=e[i].nxt){
  		int v=e[i].to;rad[u]=i;
  		if(dis[v]==dis[u]+1&&e[i].w){
  			int out=dfs(v,min(e[i].w,res));
  			e[i].w-=out,e[i^1].w+=out;
  			res-=out,cnt+=out;
  			if(!res)break;
  		}
  	}
  	return cnt;
  }
  int dfn[maxn],lw[maxn],idx;
  int st[maxn],tp;
  int scc[maxn],scct;
  void tar(int u){
  	dfn[u]=lw[u]=++idx;st[++tp]=u;
  	for(int i=head[u];i;i=e[i].nxt){
  		int v=e[i].to;
  		if(!e[i].w)continue;
  		if(!dfn[v])tar(v),lw[u]=min(lw[u],lw[v]);
  		else if(!scc[v])lw[u]=min(lw[u],dfn[v]);
  	}
  	if(dfn[u]==lw[u]){
  		scc[st[tp]]=++scct;
  		while(st[tp--]!=u)scc[st[tp]]=scct;
  	}
  }
  void work(){
  	n=read();m=read();s=2*n+1,t=2*n+2;
  	for(int i=1;i<=n;i++)add(s,i,1);
  	for(int i=1;i<=n;i++)add(i+n,t,1);
  	for(int i=1;i<=m;i++){
  		int u=read(),v=read();
  		add(u,v+n,1);
  	}
  	int flow=0;while(bfs())flow+=dfs(s,inf);
  	for(int i=1;i<=t;i++)if(!dfn[i])tar(i);
  	// for(int i=1;i<=n;i++)cout<<scc[i]<<" ";cout<<"\n";cout<<scc[s]<<"\n";
  	for(int i=1;i<=n;i++){
  		if(scc[i]!=scc[s]&&!e[i*2].w)puts("Slavko");
  		else puts("Mirko");
  	}
  }

  // \
  444

  bool Med;
  int T;
  signed main(){
  //	freopen(".in","r",stdin);
  //	freopen(".out","w",stdout);

  //	ios::sync_with_stdio(0);
  //	cin.tie(0);cout.tie(0);

  //	cerr<<(&Mbe-&Med)/1048576.0<<" MB\n";

  	T=1;
  	while(T--)work();
  }
external_url: https://www.luogu.com.cn/problem/P4617
external_platform: '洛谷'
external_problem_id: 'P4617'
external_title: 'Planinarenje'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
