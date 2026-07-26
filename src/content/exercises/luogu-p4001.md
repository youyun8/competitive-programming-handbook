---
id: luogu-p4001
volume: lower
source_file: lower-volume
original_label: '洛谷 P4001'
title: '洛谷 P4001 狼抓兔子'
chapter: 10
section: '10.12'
kind: external-oj
difficulty: 5
topics: ['平面圖對偶', '最短路']
prerequisites: ['max-flow']
statement: |-
  網格無向道路有封鎖代價，求分離左上與右下所需最少代價。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3 3
      1 1
      1 1
      1 1
      1 1 1
      1 1 1
      1 1
      1 1
    output: |-
      3
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['平面圖對偶', '最短路']
judgment: |-
  直接最大流過大；原圖 s-t 割對應平面對偶圖兩個外部面的路徑。
hints:
  - '先辨識核心轉換：平面圖對偶、最短路。'
  - '直接最大流過大；原圖 s-t 割對應平面對偶圖兩個外部面的路徑。'
  - '依「依水平、垂直、斜邊連接相鄰三角面，在對偶圖跑 Dijkstra。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  依水平、垂直、斜邊連接相鄰三角面，在對偶圖跑 Dijkstra。
proof_or_invariant: |-
  每個原圖割與對偶外面間路徑一一對應，且穿越邊權相同；最小割因此等於最短路。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(nm log(nm))'
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
  #include<bits/stdc++.h>
  #define int long long
  #define mod 998244353
  #define pii pair<int,int>
  #define mems(x,y) memset(x,y,sizeof x)
  using namespace std;
  const int maxn=2000010;
  const int inf=1e18;
  inline int read(){
  	int x=0,f=1;
  	char ch=getchar();
  	while(ch<'0'||ch>'9'){if(ch=='-')f=-1;ch=getchar();}
  	while(ch>='0'&&ch<='9'){x=(x<<3)+(x<<1)+(ch-48);ch=getchar();}
  	return x*f;
  }
  bool Mbe;

  int n,m,s,t;
  int head[maxn],tot;
  struct nd{
  	int nxt,fr,to,w;
  }e[maxn*3];
  void add(int u,int v,int w){
  	e[++tot]={head[u],u,v,w};head[u]=tot;
  }
  int id(int u,int v){
  	return (u-1)*(m-1)+v;
  }
  struct node{
  	int id,dis;
  	bool operator <(const node&tmp)const{return dis>tmp.dis;}
  };
  priority_queue<node> q;
  int dis[maxn];
  bool vis[maxn];
  void work(){
  	n=read();m=read();s=2*(n-1)*(m-1)+1,t=2*(n-1)*(m-1)+2;
  	for(int j=1;j<m;j++){
  		int w=read();
  		add(id(1,j),t,w);
  	}
  	for(int i=2;i<n;i++){
  		for(int j=1;j<m;j++){
  			int w=read();
  			add(id(2*i-2,j),id(2*i-1,j),w);
  			add(id(2*i-1,j),id(2*i-2,j),w);
  		}
  	}
  	for(int j=1;j<m;j++){
  		int w=read();
  		add(s,id(2*n-2,j),w);
  	}
  	for(int i=1;i<n;i++){
  		for(int j=1;j<=m;j++){
  			int w=read();
  			if(j==1)add(s,id(2*i,j),w);
  			else if(j==m)add(id(2*i-1,j-1),t,w);
  			else{
  				add(id(2*i-1,j-1),id(2*i,j),w);
  				add(id(2*i,j),id(2*i-1,j-1),w);
  			}
  		}
  	}
  	for(int i=1;i<n;i++){
  		for(int j=1;j<m;j++){
  			int w=read();
  			add(id(2*i-1,j),id(2*i,j),w);
  			add(id(2*i,j),id(2*i-1,j),w);
  		}
  	}
  //	for(int i=1;i<=tot;i++)cout<<e[i].fr<<" "<<e[i].to<<" "<<e[i].w<<"\n";
  	mems(dis,0x3f);dis[s]=0;q.push({s,0});
  	while(!q.empty()){
  		int u=q.top().id;q.pop();
  		if(vis[u])continue;vis[u]=1;
  		for(int i=head[u];i;i=e[i].nxt){
  			int v=e[i].to;
  			if(dis[v]>dis[u]+e[i].w){
  				dis[v]=dis[u]+e[i].w;
  				q.push({v,dis[v]});
  			}
  		}
  	}
  	printf("%lld\n",dis[t]);
  }

  // \
  444

  bool Med;
  int T;
  signed main(){
  //	freopen(".out","w",stdout);

  //	ios::sync_with_stdio(0);
  //	cin.tie(0);cout.tie(0);

  //	cerr<<(&Mbe-&Med)/1048576.0<<" MB\n";

  	T=1;
  	while(T--)work();
  }
external_url: https://www.luogu.com.cn/problem/P4001
external_platform: '洛谷'
external_problem_id: 'P4001'
external_title: '狼抓兔子'
external_relation: original
source_book_pages: [679]
source_pdf_pages: [309]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
