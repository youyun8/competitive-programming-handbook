---
id: luogu-p5344
volume: upper
source_file: upper-volume
title: 洛谷 P5344 逛森林：倍增虛點最佳化建圖
chapter: 2
section: '2.10'
kind: external-oj
difficulty: 5
topics: ['倍增法', '最佳化建圖', '最短路', '並查集']
prerequisites: []
statement: |-
  初始有 n 個互不連通節點，依序執行 m 個操作。操作 2 u v w：若 u,v 尚未由操作 2 的邊連通，就加入權重 w 的無向邊，否則忽略。操作 1 u1 v1 u2 v2 w：若當下 u1-v1 與 u2-v2 的森林簡單路都存在，就建立單向傳送門，使第一條路上任一點可花 w 到第二條路上任一點，否則忽略。所有操作結束後求 s 到每點最短路。
constraints:
  - '1 <= n <= 50000，1 <= m <= 1000000'
  - '1 <= u,v <= n，1 <= w <= 100'
input_format: '第一行 n,m,s；接著 m 行為 1 u1 v1 u2 v2 w 或 2 u v w。'
output_format: '一行 n 個整數，依序為 s 到各點最小花費；不可達輸出 -1。'
samples:
  - input: |
      9 11 5
      2 2 1 2
      2 3 1 5
      2 4 2 10
      2 5 3 9
      2 6 5 3
      2 7 6 6
      2 8 7 2
      2 9 4 2
      1 1 1 4 9 2
      1 8 5 1 6 1
      1 3 6 9 6 1
    output: |
      1 1 1 1 0 1 7 9 1
    explanation: '操作 2 形成一棵樹；有效傳送門再提供路徑集合到路徑集合的單向邊。'
core_knowledge:
  - '操作 2 只會形成森林，可在讀取當下以 DSU 判斷操作及傳送門是否有效。'
  - '向上收集虛點讓路上任一原點到區塊點；向下展開虛點讓區塊點到路上任一原點。'
  - '長度 len 的祖先路徑可用兩個長度 2^floor(log len) 的重疊區塊覆蓋。'
judgment: '直接為兩條路的每對節點連邊不可行；需將集合到集合的邊拆成收集虛點、傳送門點、展開虛點。'
hints:
  - '先離線取得最終森林，但傳送門有效性必須在讀取當下用 DSU 判斷。'
  - '為每個「從 u 向上連續 2^j 個點」建兩種虛點：原點可匯入前者，後者可展開到原點。'
  - '一條 u-v 路分成 u-LCA 與 v-LCA；每半條路用兩個可重疊倍增塊完整覆蓋，重複連邊不影響最短路。'
solution_outline: |-
  讀操作時以 DSU 建立森林，只保留當時兩端路徑皆連通的傳送門。對最終森林求深度、祖先表，建立兩套倍增虛點 DAG：收集圖由兩個半區塊指向整區塊，展開圖方向相反。每條祖先路用兩個等長冪次區塊覆蓋；原路徑拆成 LCA 兩側。來源區塊以權 w 指向傳送門點，傳送門點以 0 指向目的區塊。加入森林邊後，以整數 radix heap 跑 Dijkstra。
proof_or_invariant: |-
  收集虛點的歸納定義保證且只保證該倍增區塊內每個原點能以 0 到達它；展開虛點則保證它能以 0 到達區塊內每點。兩個長度 2^k 的端點區塊聯集恰覆蓋任意祖先路，允許重疊不新增區間外節點。故經傳送門點的路徑，恰等價於從來源簡單路任一點花 w 到目的簡單路任一點。擴充圖與原操作圖最短距離相同，Dijkstra 因全為非負權而正確。
common_errors:
  - '用最終連通性回頭接受原本應被忽略的傳送門。'
  - '來源與目的倍增圖方向建反。'
  - 'LCA 兩側漏掉 LCA，或倍增層數不足以覆蓋最長鏈。'
complexity:
  time: '建圖 O((n+m) log n)，radix-heap 最短路 O((V+E) log C)'
  space: 'O(n log n + m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：在線讀取時用 DSU 保留有效森林邊與當時兩條路皆存在的傳送門。
      // TODO：建立向上收集、向下展開的兩套倍增虛點圖。
      // TODO：每條樹路用兩個重疊倍增塊表示，建圖後跑非負權最短路。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Dsu{vector<int>p,s;explicit Dsu(int n):p(static_cast<size_t>(n+1)),s(static_cast<size_t>(n+1),1){iota(p.begin(),p.end(),0);}int find(int x){return p[x]==x?x:p[x]=find(p[x]);}bool unite(int a,int b){a=find(a);b=find(b);if(a==b)return false;if(s[a]<s[b])swap(a,b);p[b]=a;s[a]+=s[b];return true;}};
  struct Portal{int a,b,c,d,w;};struct Arc{int to,next,w;};
  class RadixHeap{using Item=pair<unsigned long long,int>;array<vector<Item>,65>buckets;unsigned long long last=0;size_t count=0;static int index(unsigned long long x,unsigned long long last_key){unsigned long long v=x^last_key;return v==0?0:64-__builtin_clzll(v);}public:void push(unsigned long long key,int value){buckets[index(key,last)].push_back({key,value});++count;}bool empty()const{return count==0;}Item pop(){if(buckets[0].empty()){int i=1;while(buckets[i].empty())++i;last=min_element(buckets[i].begin(),buckets[i].end())->first;for(const Item&item:buckets[i])buckets[index(item.first,last)].push_back(item);buckets[i].clear();}Item item=buckets[0].back();buckets[0].pop_back();--count;return item;}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m,start;if(!(cin>>n>>m>>start))return 0;Dsu dsu(n);vector<vector<pair<int,int>>>forest(static_cast<size_t>(n+1));vector<Portal>portals;portals.reserve(static_cast<size_t>(m));for(int i=0;i<m;++i){int type;cin>>type;if(type==1){Portal p{};cin>>p.a>>p.b>>p.c>>p.d>>p.w;if(dsu.find(p.a)==dsu.find(p.b)&&dsu.find(p.c)==dsu.find(p.d))portals.push_back(p);}else{int u,v,w;cin>>u>>v>>w;if(dsu.unite(u,v)){forest[u].push_back({v,w});forest[v].push_back({u,w});}}}const int levels=16;vector<array<int,levels>>parent(static_cast<size_t>(n+1));vector<int>depth(static_cast<size_t>(n+1));for(int root=1;root<=n;++root)if(depth[root]==0){depth[root]=1;vector<int>stack{root};while(!stack.empty()){int u=stack.back();stack.pop_back();for(auto [v,w]:forest[u])if(v!=parent[u][0]){(void)w;parent[v][0]=u;depth[v]=depth[u]+1;stack.push_back(v);}}}for(int j=1;j<levels;++j)for(int i=1;i<=n;++i)parent[i][j]=parent[parent[i][j-1]][j-1];auto lift=[&](int u,int distance){for(int j=0;j<levels;++j)if((distance>>j&1)!=0)u=parent[u][j];return u;};auto lca=[&](int u,int v){if(depth[u]<depth[v])swap(u,v);u=lift(u,depth[u]-depth[v]);if(u==v)return u;for(int j=levels-1;j>=0;--j)if(parent[u][j]!=parent[v][j]){u=parent[u][j];v=parent[v][j];}return parent[u][0];};vector<int>head(static_cast<size_t>(n+1),-1);vector<Arc>arcs;arcs.reserve(portals.size()*8+static_cast<size_t>(n)*levels*4);auto new_node=[&](){head.push_back(-1);return static_cast<int>(head.size())-1;};auto add_arc=[&](int u,int v,int w){arcs.push_back({v,head[u],w});head[u]=static_cast<int>(arcs.size())-1;};for(int u=1;u<=n;++u)for(auto [v,w]:forest[u])if(u<v){add_arc(u,v,w);add_arc(v,u,w);}vector<vector<int>>into(levels,vector<int>(static_cast<size_t>(n+1))),out(levels,vector<int>(static_cast<size_t>(n+1)));for(int i=1;i<=n;++i)into[0][i]=out[0][i]=i;for(int j=1;j<levels;++j)for(int i=1;i<=n;++i)if(depth[i]>=(1<<j)){int middle=parent[i][j-1];into[j][i]=new_node();out[j][i]=new_node();add_arc(into[j-1][i],into[j][i],0);add_arc(into[j-1][middle],into[j][i],0);add_arc(out[j][i],out[j-1][i],0);add_arc(out[j][i],out[j-1][middle],0);}auto add_path=[&](int u,int ancestor,int portal,int weight,bool source){int length=depth[u]-depth[ancestor]+1;int level=31-__builtin_clz(static_cast<unsigned int>(length));int lower=lift(u,length-(1<<level));int first=source?into[level][u]:out[level][u];int second=source?into[level][lower]:out[level][lower];if(source){add_arc(first,portal,weight);if(second!=first)add_arc(second,portal,weight);}else{add_arc(portal,first,weight);if(second!=first)add_arc(portal,second,weight);}};for(const Portal&p:portals){int node=new_node();int x=lca(p.a,p.b),y=lca(p.c,p.d);add_path(p.a,x,node,p.w,true);add_path(p.b,x,node,p.w,true);add_path(p.c,y,node,0,false);add_path(p.d,y,node,0,false);}const unsigned long long infinity=numeric_limits<unsigned long long>::max()/4;vector<unsigned long long>distance(head.size(),infinity);RadixHeap queue;distance[start]=0;queue.push(0,start);while(!queue.empty()){auto [du,u]=queue.pop();if(du!=distance[u])continue;for(int edge=head[u];edge!=-1;edge=arcs[edge].next){const Arc&e=arcs[edge];unsigned long long nd=du+static_cast<unsigned long long>(e.w);if(nd<distance[e.to]){distance[e.to]=nd;queue.push(nd,e.to);}}}for(int i=1;i<=n;++i){if(distance[i]==infinity)cout<<-1;else cout<<distance[i];cout<<(i==n?'\n':' ');}return 0;}
external_url: https://www.luogu.com.cn/problem/P5344
external_platform: 洛谷
external_problem_id: P5344
external_title: '【XR-1】逛森林'
external_relation: original
source_book_pages: [92]
source_pdf_pages: [110]
review_status: verified
---

有效性在操作時判定，最短路則在所有操作後一次求出。
