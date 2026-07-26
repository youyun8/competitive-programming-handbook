---
id: luogu-p2515
volume: lower
source_file: lower-volume
original_label: '洛谷 P2515'
title: '洛谷 P2515 軟體安裝'
chapter: 10
section: '10.5'
kind: external-oj
difficulty: 5
topics: [strongly-connected-components, tree-knapsack, dependency]
prerequisites: [depth-first-search, graph-connectivity]
statement: >-
  每套軟體有空間、價值及至多一個依賴；在容量 M 內安裝可正常工作的軟體，使總價值最大。
constraints: [0 <= n <= 100, 0 <= M <= 500, 0 <= value_i <= 1000]
input_format: >-
  四行依序為 n M、n 個空間、n 個價值、n 個依賴編號（0 表無依賴）。
output_format: >-
  輸出最大價值。
samples:
  - input: |
      3 5
      2 2 3
      3 4 5
      0 1 1
    output: |
      8
    explanation: >-
      安裝 1 與 3，空間 5、價值 8。
core_knowledge: [SCC 縮點, 依賴森林, 樹上背包]
judgment: >-
  同一依賴環中的軟體必須全選或全不選，縮點後每個分量仍至多有一個父依賴。
hints:
  - 依賴 d→i 建邊並縮 SCC。
  - 將無父分量接到權重零虛根。
  - 子樹 DP 選孩子前必保留根重量。
solution_outline: >-
  縮點後加總每分量空間與價值，建立虛根森林；做容量樹形背包。
proof_or_invariant: >-
  環內任選一套會遞迴要求整環，故可合併。縮點後合法選集對祖先封閉；DP 逐子樹卷積枚舉分配容量，完整且不重複地涵蓋所有祖先封閉選集。
complexity: { time: 'O(n + m + n*M^2)', space: 'O(n*M)' }
common_errors: [依賴環只選部分, 未接虛根而漏森林, 允許選孩子卻不選父]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依提示完成演算法與輸出。*/return 0;}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Scc{int node_count,t=0,c=0;vector<vector<int>>g;vector<int>d,l,st,id;vector<char>on;explicit Scc(int count):node_count(count),g(static_cast<size_t>(count)),d(static_cast<size_t>(count)),l(static_cast<size_t>(count)),id(static_cast<size_t>(count)),on(static_cast<size_t>(count)){}void dfs(int u){d[u]=l[u]=++t;st.push_back(u);on[u]=1;for(int v:g[u])if(!d[v])dfs(v),l[u]=min(l[u],l[v]);else if(on[v])l[u]=min(l[u],d[v]);if(d[u]==l[u]){while(true){int v=st.back();st.pop_back();on[v]=0;id[v]=c;if(v==u)break;}++c;}}void run(){for(int i=0;i<node_count;++i)if(!d[i])dfs(i);}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,cap;cin>>n>>cap;vector<int>w(n),v(n),d(n);for(int&x:w)cin>>x;for(int&x:v)cin>>x;Scc s(n);for(int i=0;i<n;++i){cin>>d[i];if(d[i])s.g[d[i]-1].push_back(i);}s.run();vector<int>cw(s.c+1),cv(s.c+1),parent(s.c,-1);for(int i=0;i<n;++i)cw[s.id[i]]+=w[i],cv[s.id[i]]+=v[i];for(int i=0;i<n;++i)if(d[i]&&s.id[d[i]-1]!=s.id[i])parent[s.id[i]]=s.id[d[i]-1];int root=s.c;vector<vector<int>>tree(s.c+1);for(int i=0;i<s.c;++i)tree[parent[i]<0?root:parent[i]].push_back(i);vector<vector<int>>dp(s.c+1,vector<int>(cap+1));auto solve=[&](auto&&self,int u)->void{for(int c=cw[u];c<=cap;++c)dp[u][c]=cv[u];for(int child:tree[u]){self(self,child);for(int c=cap;c>=cw[u];--c)for(int take=0;take<=c-cw[u];++take)dp[u][c]=max(dp[u][c],dp[u][c-take]+dp[child][take]);}};solve(solve,root);cout<<dp[root][cap]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2515
external_platform: 洛谷
external_problem_id: 'P2515'
external_title: '[HAOI2010] 軟體安裝'
external_relation: original
source_book_pages: [627]
source_pdf_pages: [257]
review_status: verified
---

本卡依官方題面與可信存檔重新整理；敘述、證明與程式均為本站獨立撰寫。卡片範例已由所附 C++17 解答實際執行核對。
