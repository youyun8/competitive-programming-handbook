---
id: luogu-p3225
volume: lower
source_file: lower-volume
original_label: '洛谷 P3225'
title: '洛谷 P3225 礦場搭建'
chapter: 10
section: '10.5'
kind: external-oj
difficulty: 5
topics: [vertex-biconnected-components, articulation-point, counting]
prerequisites: [depth-first-search, graph-connectivity]
statement: >-
  在連通無向礦場圖設救援出口，使任一挖煤點坍塌後，其餘點仍都能到達某出口；求最少出口數與最優放置方案數。
constraints: [每組邊數 <= 500, 最大點編號 <= 1000, 方案數 < 2^64, 輸入以 0 結束]
input_format: >-
  多組資料；每組先給邊數，再給各無向邊。
output_format: >-
  輸出 Case k: 最少出口數 方案數。
samples:
  - input: |
      3
      1 2
      2 3
      3 1
      0
    output: |
      Case 1: 2 3
    explanation: >-
      圖無割點，任選兩個出口，共 C(3,2)=3 種。
core_knowledge: [割點, 葉點雙分量, 乘法原理]
judgment: >-
  每個只鄰接一個割點的非割點區域需一個出口；無割點時需兩個。
hints:
  - 先求所有割點。
  - 刪去割點後搜尋非割點區域。
  - 統計每區鄰接的不同割點數。
solution_outline: >-
  Tarjan 標記割點；對每個非割點連通區計大小與相鄰割點數。相鄰一個時出口加一且方案乘區大小；相鄰零時加二並乘組合數。
proof_or_invariant: >-
  若區域只經一割點連外，該割點坍塌時必須在區內有出口；含至少兩個割點者任一坍塌仍可經另一割點通往葉區出口。無割點整圖需兩出口以防其中一個坍塌。
complexity: { time: 'O(V + E)', space: 'O(V + E)' }
common_errors: [出口放在葉塊割點上, 相鄰割點重複計數, 無割點時只放一個出口]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依提示完成演算法與輸出。*/return 0;}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int edge_count,cs=0;while(cin>>edge_count&&edge_count){vector<pair<int,int>>edges(edge_count);int n=0;for(auto&[u,v]:edges){cin>>u>>v;n=max(n,max(u,v));}vector<vector<int>>g(n+1);for(auto [u,v]:edges)g[u].push_back(v),g[v].push_back(u);vector<int>d(n+1),low(n+1);vector<char>cut(n+1);int timer=0;auto dfs=[&](auto&&self,int u,int parent)->void{d[u]=low[u]=++timer;int child=0;for(int v:g[u])if(v!=parent){if(!d[v]){++child;self(self,v,u);low[u]=min(low[u],low[v]);if(parent&&low[v]>=d[u])cut[u]=1;}else low[u]=min(low[u],d[v]);}if(!parent&&child>1)cut[u]=1;};dfs(dfs,edges[0].first,0);vector<char>seen(n+1);unsigned long long ways=1;int exits=0;for(int start=1;start<=n;++start)if(!g[start].empty()&&!cut[start]&&!seen[start]){int size=0;set<int>adjacent;queue<int>q;q.push(start);seen[start]=1;while(!q.empty()){int u=q.front();q.pop();++size;for(int v:g[u])if(cut[v])adjacent.insert(v);else if(!seen[v])seen[v]=1,q.push(v);}if(adjacent.empty())exits+=2,ways*=static_cast<unsigned long long>(size)*(size-1)/2;else if(adjacent.size()==1)++exits,ways*=size;}cout<<"Case "<<++cs<<": "<<exits<<' '<<ways<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P3225
external_platform: 洛谷
external_problem_id: 'P3225'
external_title: '[HNOI2012] 礦場搭建'
external_relation: original
source_book_pages: [627]
source_pdf_pages: [257]
review_status: verified
---

本卡依官方題面與可信存檔重新整理；敘述、證明與程式均為本站獨立撰寫。卡片範例已由所附 C++17 解答實際執行核對。
