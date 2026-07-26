---
id: luogu-p1407
volume: lower
source_file: lower-volume
original_label: '洛谷 P1407'
title: '洛谷 P1407 穩定婚姻'
chapter: 10
section: '10.5'
kind: external-oj
difficulty: 4
topics: [strongly-connected-components, alternating-cycle]
prerequisites: [depth-first-search, graph-connectivity]
statement: >-
  已知 n 對夫妻與舊情侶關係，判斷每段婚姻解除後，是否存在一連串換伴使所有人仍能配對；能則為 Unsafe。
constraints: [1 <= n <= 4000, 0 <= m <= 20000, 姓名長度 <= 8]
input_format: >-
  先給 n 對姓名（女、男），再給 m 舊情侶（女、男）。
output_format: >-
  依原夫妻順序逐行輸出 Safe 或 Unsafe。
samples:
  - input: |
      2
      Alice Bob
      Carol Dave
      2
      Alice Dave
      Carol Bob
    output: |
      Unsafe
      Unsafe
    explanation: >-
      兩段婚姻與兩段舊關係形成交替環，可整體換伴。
core_knowledge: [交替環建圖, SCC]
judgment: >-
  夫妻邊設女→男、舊情侶邊設男→女；夫妻兩端同 SCC 即 Unsafe。
hints:
  - 固定婚姻可視為匹配邊。
  - 能換伴必形成交替有向環。
  - 以姓名映射到 0..2n-1。
solution_outline: >-
  建立夫妻女→男及舊關係男→女的圖，Tarjan 後比較每對夫妻的分量編號。
proof_or_invariant: >-
  若夫妻兩端同 SCC，男端可沿交替關係回到女端，連同夫妻邊形成替代匹配環；任何完整換伴也分解成此類交替環，故條件充要。
complexity: { time: 'O(n + m)', space: 'O(n + m)' }
common_errors: [舊情侶邊方向相反, 姓名未區分大小寫, 只找直接四人環]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依提示完成演算法與輸出。*/return 0;}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Scc{int node_count,t=0,c=0;vector<vector<int>>g;vector<int>d,l,st,id;vector<char>on;explicit Scc(int count):node_count(count),g(static_cast<size_t>(count)),d(static_cast<size_t>(count)),l(static_cast<size_t>(count)),id(static_cast<size_t>(count)),on(static_cast<size_t>(count)){}void dfs(int u){d[u]=l[u]=++t;st.push_back(u);on[u]=1;for(int v:g[u])if(!d[v])dfs(v),l[u]=min(l[u],l[v]);else if(on[v])l[u]=min(l[u],d[v]);if(d[u]==l[u]){while(true){int v=st.back();st.pop_back();on[v]=0;id[v]=c;if(v==u)break;}++c;}}void run(){for(int i=0;i<node_count;++i)if(!d[i])dfs(i);}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;Scc s(2*n);unordered_map<string,int>id;vector<pair<int,int>>p(n);for(int i=0;i<n;++i){string g,b;cin>>g>>b;id[g]=2*i;id[b]=2*i+1;p[i]={2*i,2*i+1};s.g[2*i].push_back(2*i+1);}int m;cin>>m;while(m--){string g,b;cin>>g>>b;s.g[id[b]].push_back(id[g]);}s.run();for(auto [g,b]:p)cout<<(s.id[g]==s.id[b]?"Unsafe":"Safe")<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1407
external_platform: 洛谷
external_problem_id: 'P1407'
external_title: '[國家集訓隊] 穩定婚姻'
external_relation: original
source_book_pages: [627]
source_pdf_pages: [257]
review_status: verified
---

本卡依官方題面與可信存檔重新整理；敘述、證明與程式均為本站獨立撰寫。卡片範例已由所附 C++17 解答實際執行核對。
