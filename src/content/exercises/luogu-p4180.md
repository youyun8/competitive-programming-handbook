---
id: luogu-p4180
volume: lower
source_file: lower-volume
title: 洛谷 P4180 嚴格次小生成樹：路徑前兩大邊
chapter: 10
section: '10.9'
kind: external-oj
difficulty: 5
topics: [嚴格次小生成樹, Kruskal, LCA, 倍增]
prerequisites: [minimum-spanning-tree, lowest-common-ancestor]
statement: 給帶權無向圖，求權重和嚴格大於最小生成樹、且在所有此類生成樹中最小的權重和。
constraints: [1 <= n <= 100000, 1 <= m <= 300000, 0 <= 邊權 <= 1000000000, 圖可能有自環, 保證存在嚴格次小生成樹]
input_format: 第一行 n、m；接著 m 行 u、v、w。
output_format: 一行輸出嚴格次小生成樹權重和。
samples:
  - input: |
      5 6
      1 2 1
      1 3 2
      2 4 3
      3 5 4
      3 4 3
      4 5 6
    output: |
      11
    explanation: 官方範例；以枚舉小圖所有 n-1 邊子集排序權重和對拍。
core_knowledge: [MST 單邊交換, 樹路徑最大與嚴格次大, binary lifting]
judgment: 加入一條非樹邊形成環；為得到最小但嚴格增加的樹，應刪環上小於新邊權的最大邊。
hints:
  - Kruskal 建 MST 並標記樹邊。
  - 倍增表為每段保存「最大、嚴格次大」兩個不同邊權。
  - 非樹邊權 w 若大於路徑最大值就刪最大值；若相等，必須刪嚴格次大值以避免得到同權 MST。
solution_outline: 建 MST 與樹鄰接表。DFS/BFS 後建祖先倍增表，每格合併兩段的前兩大不同權。枚舉每條非樹、非自環邊，查 u-v 路徑前兩大，計算最小正增量並加 MST 總和。
proof_or_invariant: 任一生成樹相對 MST 可用交換逐步取得；最小的嚴格增量必可由一次加入非樹邊並刪其基本環上一邊達成。固定新邊 w，為最小化增量且保持正值，應刪除環上嚴格小於 w 的最大權；路徑前兩大不同值足以判定。枚舉所有非樹邊故取得全域最小。
common_errors: [w 等於路徑最大值時仍刪最大而得到非嚴格答案, 前兩大允許相等, 把自環加入候選, MST 總和使用 int]
complexity: { time: 'O(m log m + (n+m) log n)', space: 'O((n+m) log n)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：MST、倍增路徑前兩大、單邊交換。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int u,v,w,id;};
  struct Dsu{vector<int>p,s;explicit Dsu(int n):p(static_cast<size_t>(n+1)),s(static_cast<size_t>(n+1),1){iota(p.begin(),p.end(),0);}int find(int x){return p[static_cast<size_t>(x)]==x?x:p[static_cast<size_t>(x)]=find(p[static_cast<size_t>(x)]);}bool unite(int x,int y){x=find(x);y=find(y);if(x==y)return false;if(s[static_cast<size_t>(x)]<s[static_cast<size_t>(y)])swap(x,y);p[static_cast<size_t>(y)]=x;s[static_cast<size_t>(x)]+=s[static_cast<size_t>(y)];return true;}};
  struct TopTwo{int first=INT_MIN,second=INT_MIN;};
  static TopTwo merge_top(TopTwo a,TopTwo b){array<int,4> value={a.first,a.second,b.first,b.second};sort(value.begin(),value.end(),greater<int>());TopTwo result;for(int x:value)if(x!=INT_MIN){if(result.first==INT_MIN)result.first=x;else if(x!=result.first){result.second=x;break;}}return result;}
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,m;cin>>n>>m;vector<Edge> edges(static_cast<size_t>(m));for(int i=0;i<m;++i){cin>>edges[static_cast<size_t>(i)].u>>edges[static_cast<size_t>(i)].v>>edges[static_cast<size_t>(i)].w;edges[static_cast<size_t>(i)].id=i;}
      vector<Edge> sorted=edges;sort(sorted.begin(),sorted.end(),[](const Edge&a,const Edge&b){return a.w<b.w;});
      Dsu dsu(n);vector<char> chosen(static_cast<size_t>(m));vector<vector<pair<int,int>>> tree(static_cast<size_t>(n+1));long long mst=0;
      for(const auto& edge:sorted)if(edge.u!=edge.v&&dsu.unite(edge.u,edge.v)){chosen[static_cast<size_t>(edge.id)]=1;mst+=edge.w;tree[static_cast<size_t>(edge.u)].push_back({edge.v,edge.w});tree[static_cast<size_t>(edge.v)].push_back({edge.u,edge.w});}
      int levels=1;while((1<<levels)<=n)++levels;
      vector<vector<int>> up(static_cast<size_t>(levels),vector<int>(static_cast<size_t>(n+1)));
      vector<vector<TopTwo>> top(static_cast<size_t>(levels),vector<TopTwo>(static_cast<size_t>(n+1)));
      vector<int> depth(static_cast<size_t>(n+1),-1);queue<int> pending;pending.push(1);depth[1]=0;
      while(!pending.empty()){int u=pending.front();pending.pop();for(auto [v,w]:tree[static_cast<size_t>(u)])if(depth[static_cast<size_t>(v)]<0){depth[static_cast<size_t>(v)]=depth[static_cast<size_t>(u)]+1;up[0][static_cast<size_t>(v)]=u;top[0][static_cast<size_t>(v)].first=w;pending.push(v);}}
      for(int bit=1;bit<levels;++bit)for(int node=1;node<=n;++node){int middle=up[static_cast<size_t>(bit-1)][static_cast<size_t>(node)];up[static_cast<size_t>(bit)][static_cast<size_t>(node)]=up[static_cast<size_t>(bit-1)][static_cast<size_t>(middle)];top[static_cast<size_t>(bit)][static_cast<size_t>(node)]=merge_top(top[static_cast<size_t>(bit-1)][static_cast<size_t>(node)],top[static_cast<size_t>(bit-1)][static_cast<size_t>(middle)]);}
      auto path_top=[&](int x,int y){TopTwo result;if(depth[static_cast<size_t>(x)]<depth[static_cast<size_t>(y)])swap(x,y);int difference=depth[static_cast<size_t>(x)]-depth[static_cast<size_t>(y)];for(int bit=0;bit<levels;++bit)if(((difference>>bit)&1)!=0){result=merge_top(result,top[static_cast<size_t>(bit)][static_cast<size_t>(x)]);x=up[static_cast<size_t>(bit)][static_cast<size_t>(x)];}if(x==y)return result;for(int bit=levels-1;bit>=0;--bit)if(up[static_cast<size_t>(bit)][static_cast<size_t>(x)]!=up[static_cast<size_t>(bit)][static_cast<size_t>(y)]){result=merge_top(result,top[static_cast<size_t>(bit)][static_cast<size_t>(x)]);result=merge_top(result,top[static_cast<size_t>(bit)][static_cast<size_t>(y)]);x=up[static_cast<size_t>(bit)][static_cast<size_t>(x)];y=up[static_cast<size_t>(bit)][static_cast<size_t>(y)];}result=merge_top(result,top[0][static_cast<size_t>(x)]);result=merge_top(result,top[0][static_cast<size_t>(y)]);return result;};
      long long increase=LLONG_MAX;
      for(const auto& edge:edges)if(!chosen[static_cast<size_t>(edge.id)]&&edge.u!=edge.v){TopTwo value=path_top(edge.u,edge.v);if(edge.w>value.first)increase=min(increase,static_cast<long long>(edge.w)-value.first);else if(edge.w==value.first&&value.second!=INT_MIN)increase=min(increase,static_cast<long long>(edge.w)-value.second);}
      cout<<mst+increase<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P4180
external_platform: 洛谷
external_problem_id: P4180
external_title: '[BJWC2010] 嚴格次小生成樹'
external_relation: original
source_book_pages: [659, 662]
source_pdf_pages: [289, 292]
review_status: verified
---

題意、官方範例與嚴格次小定義已對照洛谷題面。
