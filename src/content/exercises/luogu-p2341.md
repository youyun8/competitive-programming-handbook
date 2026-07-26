---
id: luogu-p2341
volume: lower
source_file: lower-volume
original_label: '洛谷 P2341'
title: '洛谷 P2341 受歡迎的牛'
chapter: 10
section: '10.5'
kind: external-oj
difficulty: 3
topics: [strongly-connected-components, condensation]
prerequisites: [depth-first-search, graph-connectivity]
statement: >-
  有向邊 A→B 表示 A 喜歡 B，喜歡關係可傳遞。求被所有牛喜歡的牛數。
constraints: [1 <= n <= 10000, 1 <= m <= 50000]
input_format: >-
  第一行 n m，接著 m 行 A B。
output_format: >-
  輸出明星牛數量。
samples:
  - input: |
      3 3
      1 2
      2 1
      2 3
    output: |
      1
    explanation: >-
      只有 3 號牛可由所有牛到達。
core_knowledge: [SCC 縮點, 唯一出度零分量]
judgment: >-
  縮點 DAG 若有且僅有一個出度為零的分量，答案是其大小，否則為零。
hints:
  - 同一 SCC 內答案一致。
  - 明星所在分量不能有出邊。
  - DAG 有兩個匯點時不可能有共同可達終點。
solution_outline: >-
  Tarjan 縮點，統計每個分量大小及跨分量出度。
proof_or_invariant: >-
  任何明星分量是縮點 DAG 的匯點；有限 DAG 每點終將到達某匯點，故唯一匯點時所有點皆可達它，反之無解。
complexity: { time: 'O(n + m)', space: 'O(n + m)' }
common_errors: [把入度零當答案, 回傳分量數而非點數, 未排除多個匯點]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依提示完成演算法與輸出。*/return 0;}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Scc{int node_count,t=0,c=0;vector<vector<int>>g;vector<int>d,l,st,id;vector<char>on;explicit Scc(int count):node_count(count),g(static_cast<size_t>(count)),d(static_cast<size_t>(count)),l(static_cast<size_t>(count)),id(static_cast<size_t>(count)),on(static_cast<size_t>(count)){}void dfs(int u){d[u]=l[u]=++t;st.push_back(u);on[u]=1;for(int v:g[u])if(!d[v])dfs(v),l[u]=min(l[u],l[v]);else if(on[v])l[u]=min(l[u],d[v]);if(d[u]==l[u]){while(true){int v=st.back();st.pop_back();on[v]=0;id[v]=c;if(v==u)break;}++c;}}void run(){for(int i=0;i<node_count;++i)if(!d[i])dfs(i);}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;Scc s(n);vector<pair<int,int>>e;while(m--){int u,v;cin>>u>>v;--u;--v;s.g[u].push_back(v);e.push_back({u,v});}s.run();vector<int>sz(s.c),out(s.c);for(int x:s.id)++sz[x];for(auto [u,v]:e)if(s.id[u]!=s.id[v])++out[s.id[u]];int ans=0,cnt=0;for(int i=0;i<s.c;++i)if(!out[i])ans=sz[i],++cnt;cout<<(cnt==1?ans:0)<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2341
external_platform: 洛谷
external_problem_id: 'P2341'
external_title: '[USACO03FALL / HAOI2006] 受歡迎的牛 G'
external_relation: original
source_book_pages: [627]
source_pdf_pages: [257]
review_status: verified
---

本卡依官方題面與可信存檔重新整理；敘述、證明與程式均為本站獨立撰寫。卡片範例已由所附 C++17 解答實際執行核對。
