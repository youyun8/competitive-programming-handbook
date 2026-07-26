---
id: luogu-p2325
volume: upper
source_file: upper-volume
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
chapter: 4
section: '4.5'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P2325 王室聯邦：樹分塊
difficulty: 4
topics: [樹分塊, DFS 堆疊, 塊重心]
prerequisites: [tree-dfs]
statement: 把 n 個城市分成若干州，每州城市數介於 B 與 3B 之間，且州內城市到該州省會的路徑不能經過其他州城市；輸出一組合法劃分。題目保證 n>=B。
constraints:
  - '1 <= B <= n <= 1000'
  - 輸入 n-1 條邊構成一棵樹
  - 省會可以不屬於它所代表的州
input_format: 第一行 n、B；接著 n-1 行無向邊。
output_format: 第一行州數；第二行每個城市的州編號；第三行每州省會編號。
samples:
  - input: |
      7 2
      1 2
      1 3
      2 4
      2 5
      3 6
      3 7
    output: |
      3
      3 3 3 1 1 2 2
      2 3 1
    explanation: 州 1 為 4、5，省會 2；州 2 為 6、7，省會 3；其餘節點併入省會 1 的州 3，所有州大小與路徑條件皆合法。
core_knowledge: [後序 DFS, 待分配節點棧, 樹分塊]
judgment: 後序處理子樹時，累積滿 B 個尚未分州的節點便可成塊，並以目前節點作省會；最後殘餘併入最後一州。
hints:
  - DFS 前記錄全域棧大小，子樹完成後，新增且尚未分配的節點都位於棧頂連續區段。
  - 若這段長度至少 B，就彈出整段成新州，省會選目前 DFS 節點。
  - DFS 結束後不足 B 的殘餘節點全部放入最後建立的州；利用每次成塊前各子段小於 B 證明上界。
solution_outline: 後序 DFS，把未分配節點壓入棧；每個節點處若本子樹新累積至少 B 個便全部彈成州。最後殘餘併到最後州。
proof_or_invariant: 棧中節點尚未分州，且同一 DFS 子樹形成連續尾段。彈出尾段的所有路徑都經目前節點，滿足省會條件；每個兒子留下少於 B，故新州及最後合併州皆不超過 3B。
complexity:
  time: O(n)
  space: O(n)
common_errors:
  - 每湊到恰 B 個就切，破壞子樹連通條件
  - 最後殘餘另開不足 B 的州
  - n=B 時沒有先建立任何州便處理殘餘
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,b;cin>>n>>b;vector<vector<int>>g(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;g[static_cast<size_t>(u)].push_back(v);g[static_cast<size_t>(v)].push_back(u);}/* TODO：後序 DFS 與待分配棧。 */cout<<1<<'\n';for(int i=1;i<=n;++i)cout<<1<<(i==n?'\n':' ');cout<<1<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,minimum_size;cin>>n>>minimum_size;vector<vector<int>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;graph[static_cast<size_t>(u)].push_back(v);graph[static_cast<size_t>(v)].push_back(u);}vector<int>stack_nodes,belong(static_cast<size_t>(n+1)),capital(1);int block_count=0;function<void(int,int)>dfs=[&](int node,int parent){size_t base=stack_nodes.size();for(int next:graph[static_cast<size_t>(node)])if(next!=parent){dfs(next,node);if(stack_nodes.size()-base>=static_cast<size_t>(minimum_size)){++block_count;capital.push_back(node);while(stack_nodes.size()>base){belong[static_cast<size_t>(stack_nodes.back())]=block_count;stack_nodes.pop_back();}}}stack_nodes.push_back(node);};dfs(1,0);if(block_count==0){block_count=1;capital.push_back(1);}while(!stack_nodes.empty()){belong[static_cast<size_t>(stack_nodes.back())]=block_count;stack_nodes.pop_back();}cout<<block_count<<'\n';for(int i=1;i<=n;++i)cout<<belong[static_cast<size_t>(i)]<<(i==n?'\n':' ');for(int i=1;i<=block_count;++i)cout<<capital[static_cast<size_t>(i)]<<(i==block_count?'\n':' ');}
external_url: https://www.luogu.com.cn/problem/P2325
external_platform: 洛谷
external_problem_id: P2325
external_title: '[HNOI2009] 王室联邦'
---

樹分塊不要求每州誘導連通；它要求的是到省會路徑不穿過其他州，後序棧正好保證此結構。
