---
id: luogu-p2863
volume: lower
source_file: lower-volume
original_label: '洛谷 P2863'
title: '洛谷 P2863 The Cow Prom'
chapter: 10
section: '10.5'
kind: external-oj
difficulty: 2
topics: [strongly-connected-components, Tarjan]
prerequisites: [depth-first-search, graph-connectivity]
statement: >-
  在有向拉繩關係中，統計包含至少兩頭牛的強連通分量數。
constraints: [2 <= n <= 10000, 2 <= m <= 50000]
input_format: >-
  第一行 n m，後接 m 行有向邊。
output_format: >-
  輸出大小大於一的 SCC 數量。
samples:
  - input: |
      5 4
      2 4
      3 5
      1 2
      4 1
    output: |
      1
    explanation: >-
      1、2、4 互相可達；3、5 不構成多人舞群。
core_knowledge: [Tarjan, 分量大小]
judgment: >-
  單點 SCC 即使有自環也不算多人舞群。
hints:
  - 先完整分解 SCC。
  - 彈出堆疊時累計大小。
  - 最後只數 size>1。
solution_outline: >-
  Tarjan 求所有 SCC 並統計每一分量的頂點數。
proof_or_invariant: >-
  一群牛能彼此透過拉繩作用恰等價於互相可達，極大此類群組正是 SCC。
complexity: { time: 'O(n + m)', space: 'O(n + m)' }
common_errors: [計算 SCC 總數, 把單點自環算入, 只從頂點一搜尋]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依提示完成演算法與輸出。*/return 0;}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Scc{int node_count,t=0,c=0;vector<vector<int>>g;vector<int>d,l,st,id;vector<char>on;explicit Scc(int count):node_count(count),g(static_cast<size_t>(count)),d(static_cast<size_t>(count)),l(static_cast<size_t>(count)),id(static_cast<size_t>(count)),on(static_cast<size_t>(count)){}void dfs(int u){d[u]=l[u]=++t;st.push_back(u);on[u]=1;for(int v:g[u])if(!d[v])dfs(v),l[u]=min(l[u],l[v]);else if(on[v])l[u]=min(l[u],d[v]);if(d[u]==l[u]){while(true){int v=st.back();st.pop_back();on[v]=0;id[v]=c;if(v==u)break;}++c;}}void run(){for(int i=0;i<node_count;++i)if(!d[i])dfs(i);}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;Scc s(n);while(m--){int u,v;cin>>u>>v;s.g[--u].push_back(--v);}s.run();vector<int>z(s.c);for(int x:s.id)++z[x];cout<<count_if(z.begin(),z.end(),[](int x){return x>1;})<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2863
external_platform: 洛谷
external_problem_id: 'P2863'
external_title: '[USACO06JAN] The Cow Prom S'
external_relation: original
source_book_pages: [627]
source_pdf_pages: [257]
review_status: verified
---

本卡依官方題面與可信存檔重新整理；敘述、證明與程式均為本站獨立撰寫。卡片範例已由所附 C++17 解答實際執行核對。
