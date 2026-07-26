---
id: luogu-p2272
volume: lower
source_file: lower-volume
original_label: '洛谷 P2272'
title: '洛谷 P2272 最大半連通子圖'
chapter: 10
section: '10.5'
kind: external-oj
difficulty: 5
topics: [strongly-connected-components, DAG-DP, counting]
prerequisites: [depth-first-search, graph-connectivity]
statement: >-
  求有向圖中最大半連通導出子圖的頂點數，以及達到最大值的不同頂點集數量對模數 x 取餘。
constraints: [1 <= n <= 100000, 1 <= m <= 1000000, x > 0, 無重邊]
input_format: >-
  第一行 n m x，後接 m 行有向邊。
output_format: >-
  第一行最大頂點數，第二行方案數模 x。
samples:
  - input: |
      6 6 20070603
      1 2
      2 1
      1 3
      2 4
      5 6
      6 4
    output: |
      3
      3
    explanation: >-
      縮點後最大權路徑含三個原頂點，共有三種頂點集。
core_knowledge: [SCC 縮點, DAG 最長路, 方案計數]
judgment: >-
  半連通導出子圖縮點後必落在 DAG 的一條路徑上；平行分量邊須去重後計數。
hints:
  - 同一 SCC 必可整體納入。
  - DAG 中兩兩可比較的分量形成一條鏈。
  - 最長路轉移相等時累加方案。
solution_outline: >-
  Tarjan 縮點並以分量大小作點權；去重建 DAG，拓撲 DP 求最大權路徑及方案數。
proof_or_invariant: >-
  半連通集合在 DAG 的拓撲偏序中任兩點可比，故可依序串成路徑；反之任一路徑上的所有分量半連通。DP 枚舉每條路徑的唯一末邊，最大值與計數皆完整。
complexity: { time: 'O(n + m log m)', space: 'O(n + m)' }
common_errors: [縮點邊未去重造成重複計數, 計數未及時取模, 把邊數當點權]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依提示完成演算法與輸出。*/return 0;}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Scc{int node_count,t=0,c=0;vector<vector<int>>g;vector<int>d,l,st,id;vector<char>on;explicit Scc(int count):node_count(count),g(static_cast<size_t>(count)),d(static_cast<size_t>(count)),l(static_cast<size_t>(count)),id(static_cast<size_t>(count)),on(static_cast<size_t>(count)){}void dfs(int u){d[u]=l[u]=++t;st.push_back(u);on[u]=1;for(int v:g[u])if(!d[v])dfs(v),l[u]=min(l[u],l[v]);else if(on[v])l[u]=min(l[u],d[v]);if(d[u]==l[u]){while(true){int v=st.back();st.pop_back();on[v]=0;id[v]=c;if(v==u)break;}++c;}}void run(){for(int i=0;i<node_count;++i)if(!d[i])dfs(i);}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m,mod;cin>>n>>m>>mod;Scc s(n);vector<pair<int,int>>e;while(m--){int u,v;cin>>u>>v;--u;--v;s.g[u].push_back(v);e.push_back({u,v});}s.run();vector<int>w(s.c);for(int x:s.id)++w[x];set<pair<int,int>>uniq;for(auto [u,v]:e)if(s.id[u]!=s.id[v])uniq.insert({s.id[u],s.id[v]});vector<vector<int>>dag(s.c);vector<int>in(s.c);for(auto [u,v]:uniq)dag[u].push_back(v),++in[v];queue<int>q;vector<int>best=w,ways(s.c,1);for(int i=0;i<s.c;++i)if(!in[i])q.push(i);while(!q.empty()){int u=q.front();q.pop();for(int v:dag[u]){int value=best[u]+w[v];if(value>best[v])best[v]=value,ways[v]=ways[u];else if(value==best[v])ways[v]=(ways[v]+ways[u])%mod;if(--in[v]==0)q.push(v);}}int mx=*max_element(best.begin(),best.end()),ans=0;for(int i=0;i<s.c;++i)if(best[i]==mx)ans=(ans+ways[i])%mod;cout<<mx<<'\n'<<ans<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2272
external_platform: 洛谷
external_problem_id: 'P2272'
external_title: '[ZJOI2007] 最大半連通子圖'
external_relation: original
source_book_pages: [627]
source_pdf_pages: [257]
review_status: verified
---

本卡依官方題面與可信存檔重新整理；敘述、證明與程式均為本站獨立撰寫。卡片範例已由所附 C++17 解答實際執行核對。
