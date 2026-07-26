---
id: luogu-p2746
volume: lower
source_file: lower-volume
original_label: '洛谷 P2746'
title: '洛谷 P2746 校園網'
chapter: 10
section: '10.5'
kind: external-oj
difficulty: 3
topics: [strongly-connected-components, condensation]
prerequisites: [depth-first-search, graph-connectivity]
statement: >-
  學校沿單向名單分發軟體。求讓所有學校收到軟體的最少初始投放數，以及最少增加多少名單關係可使任一學校出發皆能傳遍。
constraints: [2 <= n <= 100]
input_format: >-
  第一行 n；其後 n 行為各校可分發到的學校，以 0 結束。
output_format: >-
  兩行依序輸出兩問答案。
samples:
  - input: |
      5
      2 4 3 0
      4 5 0
      0
      0
      1 0
    output: |
      1
      2
    explanation: >-
      縮點後有一個源分量；使整圖強連通至少補兩條邊。
core_knowledge: [SCC 縮點, 源匯計數]
judgment: >-
  只有一個 SCC 時第二問為 0，不可套 max(1,1)。
hints:
  - 分量內投放一次即可。
  - 第一問必須覆蓋每個入度零分量。
  - 第二問配對 DAG 的匯點與源點。
solution_outline: >-
  Tarjan 縮點，統計縮點 DAG 的入度零與出度零分量數。
proof_or_invariant: >-
  源分量無法由別處取得軟體且選它們足以覆蓋 DAG；強連通化每個源需新入邊、每個匯需新出邊，循環配對可用兩者較大值完成。
complexity: { time: 'O(n + m)', space: 'O(n + m)' }
common_errors: [單一 SCC 輸出 1, 在原圖計入出度, 把第一問取 max]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依提示完成演算法與輸出。*/return 0;}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Scc{int node_count,t=0,c=0;vector<vector<int>>g;vector<int>d,l,st,id;vector<char>on;explicit Scc(int count):node_count(count),g(static_cast<size_t>(count)),d(static_cast<size_t>(count)),l(static_cast<size_t>(count)),id(static_cast<size_t>(count)),on(static_cast<size_t>(count)){}void dfs(int u){d[u]=l[u]=++t;st.push_back(u);on[u]=1;for(int v:g[u])if(!d[v])dfs(v),l[u]=min(l[u],l[v]);else if(on[v])l[u]=min(l[u],d[v]);if(d[u]==l[u]){while(true){int v=st.back();st.pop_back();on[v]=0;id[v]=c;if(v==u)break;}++c;}}void run(){for(int i=0;i<node_count;++i)if(!d[i])dfs(i);}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;Scc s(n);vector<pair<int,int>>e;for(int u=0;u<n;++u){int v;while(cin>>v&&v){--v;s.g[u].push_back(v);e.push_back({u,v});}}s.run();vector<int>in(s.c),out(s.c);for(auto [u,v]:e)if(s.id[u]!=s.id[v])in[s.id[v]]=out[s.id[u]]=1;int a=0,b=0;for(int i=0;i<s.c;++i){a+=!in[i];b+=!out[i];}cout<<a<<'\n'<<(s.c==1?0:max(a,b))<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2746
external_platform: 洛谷
external_problem_id: 'P2746'
external_title: '[IOI 1996 / USACO5.3] 校園網 Network of Schools'
external_relation: original
source_book_pages: [627]
source_pdf_pages: [257]
review_status: verified
---

本卡依官方題面與可信存檔重新整理；敘述、證明與程式均為本站獨立撰寫。卡片範例已由所附 C++17 解答實際執行核對。
