---
id: luogu-p1967
volume: upper
source_file: upper-volume
source_book_pages: [244]
source_pdf_pages: [262]
chapter: 4
section: '4.8'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P1967 貨車運輸：最大生成森林與瓶頸路徑
difficulty: 5
topics: [Kruskal, 最大生成樹, LCA, 路徑最小值]
prerequisites: [minimum-spanning-tree, lowest-common-ancestor]
statement: 無向圖每條道路有限重。對每組起終點，求一輛貨車可選路線的最大載重，即最大化路線上最小邊限重；若不連通輸出 -1。
constraints:
  - '1 <= n <= 10000'
  - '1 <= m <= 50000'
  - '1 <= q <= 30000'
  - 邊限重為正整數
input_format: 第一行 n、m；接著 m 行 u、v、limit；再給 q 與 q 行詢問。
output_format: 每個詢問輸出最大可載重，不連通輸出 -1。
samples:
  - input: |
      4 4
      1 2 5
      2 3 3
      1 3 4
      3 4 2
      3
      1 3
      2 4
      1 4
    output: |
      4
      2
      2
    explanation: 1 到 3 可走直接限重 4；到 4 的任何路線都受 3—4 的限重 2 約束。
core_knowledge: [maximum_spanning_forest, bottleneck_property, binary_lifting_min]
judgment: 任意兩點的最大瓶頸值等於最大生成森林中唯一樹路徑的最小邊權。
hints:
  - 將邊按限重由大到小做 Kruskal，得到最大生成森林。
  - 森林上預處理每個 2^k 祖先，以及跳到該祖先途中最小邊權。
  - 查詢先用並查集判連通，再同步提升兩點並合併沿途最小值。
solution_outline: Kruskal 建最大生成森林；逐分量 BFS 建 LCA/min-edge 倍增表；每次詢問求路徑最小邊。
proof_or_invariant: Kruskal 在兩分量首次連接時使用當前最大可用權，割性質保證最大生成樹路徑的最小邊等於原圖最大瓶頸；倍增完整分解唯一樹路徑。
complexity:
  time: O(m log m+(n+q)log n)
  space: O(n log n+m)
common_errors:
  - 建成最小生成樹而非最大生成樹
  - 提升深節點時未把該段最小值納入答案
  - 不連通詢問輸出 0 而非 -1
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;/* TODO：最大生成森林與路徑最小值倍增。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int first,second,weight;};
  struct Dsu{vector<int>parent,size;explicit Dsu(int n):parent(static_cast<size_t>(n+1)),size(static_cast<size_t>(n+1),1){iota(parent.begin(),parent.end(),0);}int find(int x){while(parent[static_cast<size_t>(x)]!=x){parent[static_cast<size_t>(x)]=parent[static_cast<size_t>(parent[static_cast<size_t>(x)])];x=parent[static_cast<size_t>(x)];}return x;}bool unite(int x,int y){x=find(x);y=find(y);if(x==y)return false;if(size[static_cast<size_t>(x)]<size[static_cast<size_t>(y)])swap(x,y);parent[static_cast<size_t>(y)]=x;size[static_cast<size_t>(x)]+=size[static_cast<size_t>(y)];return true;}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<Edge>edges(static_cast<size_t>(m));for(Edge&edge:edges)cin>>edge.first>>edge.second>>edge.weight;sort(edges.begin(),edges.end(),[](const Edge&a,const Edge&b){return a.weight>b.weight;});Dsu dsu(n);vector<vector<pair<int,int>>>forest(static_cast<size_t>(n+1));for(const Edge&edge:edges)if(dsu.unite(edge.first,edge.second)){forest[static_cast<size_t>(edge.first)].push_back({edge.second,edge.weight});forest[static_cast<size_t>(edge.second)].push_back({edge.first,edge.weight});}int levels=1;while((1<<levels)<=n)++levels;vector<vector<int>>up(static_cast<size_t>(levels),vector<int>(static_cast<size_t>(n+1))),minimum(static_cast<size_t>(levels),vector<int>(static_cast<size_t>(n+1),numeric_limits<int>::max()));vector<int>depth(static_cast<size_t>(n+1),-1);for(int root=1;root<=n;++root)if(depth[static_cast<size_t>(root)]<0){queue<int>pending;pending.push(root);depth[static_cast<size_t>(root)]=0;while(!pending.empty()){int node=pending.front();pending.pop();for(auto [next,weight]:forest[static_cast<size_t>(node)])if(depth[static_cast<size_t>(next)]<0){depth[static_cast<size_t>(next)]=depth[static_cast<size_t>(node)]+1;up[0][static_cast<size_t>(next)]=node;minimum[0][static_cast<size_t>(next)]=weight;pending.push(next);}}}for(int bit=1;bit<levels;++bit)for(int node=1;node<=n;++node){int middle=up[static_cast<size_t>(bit-1)][static_cast<size_t>(node)];up[static_cast<size_t>(bit)][static_cast<size_t>(node)]=up[static_cast<size_t>(bit-1)][static_cast<size_t>(middle)];minimum[static_cast<size_t>(bit)][static_cast<size_t>(node)]=min(minimum[static_cast<size_t>(bit-1)][static_cast<size_t>(node)],minimum[static_cast<size_t>(bit-1)][static_cast<size_t>(middle)]);}int query_count;cin>>query_count;while(query_count--){int x,y;cin>>x>>y;if(dsu.find(x)!=dsu.find(y)){cout<<-1<<'\n';continue;}int answer=numeric_limits<int>::max();if(depth[static_cast<size_t>(x)]<depth[static_cast<size_t>(y)])swap(x,y);int difference=depth[static_cast<size_t>(x)]-depth[static_cast<size_t>(y)];for(int bit=0;bit<levels;++bit)if(((difference>>bit)&1)!=0){answer=min(answer,minimum[static_cast<size_t>(bit)][static_cast<size_t>(x)]);x=up[static_cast<size_t>(bit)][static_cast<size_t>(x)];}if(x!=y){for(int bit=levels-1;bit>=0;--bit)if(up[static_cast<size_t>(bit)][static_cast<size_t>(x)]!=up[static_cast<size_t>(bit)][static_cast<size_t>(y)]){answer=min(answer,min(minimum[static_cast<size_t>(bit)][static_cast<size_t>(x)],minimum[static_cast<size_t>(bit)][static_cast<size_t>(y)]));x=up[static_cast<size_t>(bit)][static_cast<size_t>(x)];y=up[static_cast<size_t>(bit)][static_cast<size_t>(y)];}answer=min(answer,min(minimum[0][static_cast<size_t>(x)],minimum[0][static_cast<size_t>(y)]));}cout<<answer<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P1967
external_platform: 洛谷
external_problem_id: P1967
external_title: '[NOIP2013 提高组] 货车运输'
---

最大生成樹保留了圖上所有點對的最大瓶頸資訊；查詢因此從一般圖問題化成樹路徑最小值。
