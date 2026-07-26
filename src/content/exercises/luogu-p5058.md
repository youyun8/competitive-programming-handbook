---
id: luogu-p5058
volume: lower
source_file: lower-volume
original_label: '洛谷 P5058'
title: '洛谷 P5058 嗅探器'
chapter: 10
section: '10.5'
kind: external-oj
difficulty: 3
topics: [articulation-point, low-link]
prerequisites: [depth-first-search, graph-connectivity]
statement: >-
  在無向網路中選一個非中心伺服器，使兩個指定資訊中心間的所有路徑都經過它；有多解取編號最小。
constraints: [伺服器編號從 1 開始, 邊以 0 0 結束]
input_format: >-
  先給 n，接著若干無向邊至 0 0，最後給兩個中心 s t。
output_format: >-
  輸出最小可行伺服器編號；不存在輸出 No solution。
samples:
  - input: |
      5
      2 1
      2 5
      1 4
      5 3
      2 3
      5 1
      0 0
      4 2
    output: |
      1
    explanation: >-
      移除 1 後，中心 4 與 2 分離。
core_knowledge: [DFS 樹, low-link, 指定兩點分離]
judgment: >-
  在以 s 為根的 DFS 中，若 t 位於子樹 v 且 low[v]>=dfn[u]，則 u 截斷 s 與 t。
hints:
  - 從其中一個中心做 DFS。
  - 回傳子樹是否包含另一中心。
  - 只有包住 t 的樹枝需要檢查 low。
solution_outline: >-
  以 s 為根跑 Tarjan；回溯時若子樹含 t 且無回邊越過 u，記錄非 s、t 的 u，最後取最小。
proof_or_invariant: >-
  DFS 子樹除父鏈外能離開的最早祖先由 low 表示；low[v]>=dfn[u] 恰表示含 t 的子樹離開時必經 u，因此移除 u 使 s、t 分離，反之任何分隔點都會滿足此式。
complexity: { time: 'O(n + m)', space: 'O(n + m)' }
common_errors: [把所有割點都當答案, 把資訊中心本身列入, 忘記取最小編號]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);/* TODO：依提示完成演算法與輸出。*/return 0;}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<vector<int>>g(n+1);int u,v;while(cin>>u>>v&&(u||v))g[u].push_back(v),g[v].push_back(u);int source,target;cin>>source>>target;vector<int>dfn(n+1),low(n+1);int timer=0,answer=INT_MAX;auto dfs=[&](auto&&self,int x,int parent)->bool{dfn[x]=low[x]=++timer;bool has=x==target;for(int y:g[x])if(y!=parent){if(!dfn[y]){bool child_has=self(self,y,x);low[x]=min(low[x],low[y]);if(x!=source&&x!=target&&child_has&&low[y]>=dfn[x])answer=min(answer,x);has=has||child_has;}else low[x]=min(low[x],dfn[y]);}return has;};dfs(dfs,source,0);if(answer==INT_MAX)cout<<"No solution\n";else cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P5058
external_platform: 洛谷
external_problem_id: 'P5058'
external_title: '[ZJOI2004] 嗅探器'
external_relation: original
source_book_pages: [627]
source_pdf_pages: [257]
review_status: verified
---

本卡依官方題面與可信存檔重新整理；敘述、證明與程式均為本站獨立撰寫。卡片範例已由所附 C++17 解答實際執行核對。
