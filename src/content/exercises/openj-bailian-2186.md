---
id: openj-bailian-2186
volume: lower
source_file: lower-volume
original_label: OpenJ_Bailian 2186
title: Popular Cows：被所有牛認可的牛
chapter: 10
section: '10.5'
kind: external-oj
difficulty: 3
topics: [strongly-connected-component, condensation-dag, tarjan]
prerequisites: [directed-graph, depth-first-search]
statement: >-
  有 N 頭牛，關係 A→B 表示 A 認為 B 受歡迎；此關係具有傳遞性。求有多少頭牛能由每一頭
  其他牛沿關係鏈到達，也就是被全體認為受歡迎。
constraints: [1 <= N <= 10000, 1 <= M <= 50000, 1 <= A, B <= N, 時間限制 2000 ms, 記憶體限制 65536 kB]
input_format: 第一行 N M；接著 M 行 A B，表示 A 認為 B 受歡迎。
output_format: 輸出被所有牛認為受歡迎的牛數。
samples:
  - input: "3 3\n1 2\n2 1\n2 3\n"
    output: '1'
    explanation: 1、2 互相可達且都能到 3；只有牛 3 能由所有牛到達。
core_knowledge: [SCC 內頂點彼此可達, 縮點 DAG, 唯一出度零分量]
judgment: 若縮點圖有超過一個匯分量，答案必為零；唯一匯分量內所有牛都是答案。
hints:
  - 先以 Tarjan 將互相可達的牛縮成強連通分量。
  - 在縮點 DAG 中，若某分量可由所有分量到達，它一定是唯一出度零分量。
  - DAG 有唯一匯點時每個分量都能沿邊到它；答案就是該分量大小。
solution_outline: 用 Tarjan 求 SCC 編號與大小；掃描原邊標記跨 SCC 的出度。若恰一個 SCC 出度為零，輸出其大小，否則輸出零。
proof_or_invariant: >-
  SCC 內任兩點互達，所以答案要麼包含整個分量，要麼不含。縮點後為 DAG；能被所有分量
  到達的分量不能有出邊到另一分量，故必為匯點。若有兩個匯點，兩者互不可達，無答案；
  若匯點唯一，任一分量沿出邊終會到某匯點，只能是該唯一匯點，故其全部頂點皆符合。
common_errors: [把入度零當成答案, 只找任意匯 SCC 而未確認唯一, 回傳牛數時輸出 SCC 數, 同 SCC 邊誤計出度]
complexity: { time: O(N + M), space: O(N + M) }
cpp_skeleton: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,m=0;cin>>n>>m;vector<vector<int>> graph(static_cast<size_t>(n));vector<pair<int,int>> edges;for(int i=0;i<m;++i){int a=0,b=0;cin>>a>>b;--a;--b;graph[static_cast<size_t>(a)].push_back(b);edges.emplace_back(a,b);}/* TODO：Tarjan 縮點並尋找唯一出度零 SCC。*/}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  static void tarjan(int u,const vector<vector<int>>& graph,vector<int>& dfn,vector<int>& low,vector<int>& stack,vector<bool>& in_stack,int& timer,vector<int>& component,vector<int>& sizes){
      dfn[static_cast<size_t>(u)]=low[static_cast<size_t>(u)]=++timer;stack.push_back(u);in_stack[static_cast<size_t>(u)]=true;
      for(int v:graph[static_cast<size_t>(u)]){if(dfn[static_cast<size_t>(v)]==0){tarjan(v,graph,dfn,low,stack,in_stack,timer,component,sizes);low[static_cast<size_t>(u)]=min(low[static_cast<size_t>(u)],low[static_cast<size_t>(v)]);}else if(in_stack[static_cast<size_t>(v)])low[static_cast<size_t>(u)]=min(low[static_cast<size_t>(u)],dfn[static_cast<size_t>(v)]);}
      if(low[static_cast<size_t>(u)]==dfn[static_cast<size_t>(u)]){int id=static_cast<int>(sizes.size());sizes.push_back(0);while(true){int v=stack.back();stack.pop_back();in_stack[static_cast<size_t>(v)]=false;component[static_cast<size_t>(v)]=id;++sizes[static_cast<size_t>(id)];if(v==u)break;}}
  }
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,m=0;cin>>n>>m;vector<vector<int>> graph(static_cast<size_t>(n));vector<pair<int,int>> edges;edges.reserve(static_cast<size_t>(m));
      for(int i=0;i<m;++i){int a=0,b=0;cin>>a>>b;--a;--b;graph[static_cast<size_t>(a)].push_back(b);edges.emplace_back(a,b);}
      vector<int> dfn(static_cast<size_t>(n),0),low(static_cast<size_t>(n),0),stack,component(static_cast<size_t>(n),-1),sizes;vector<bool> in_stack(static_cast<size_t>(n),false);int timer=0;
      for(int v=0;v<n;++v)if(dfn[static_cast<size_t>(v)]==0)tarjan(v,graph,dfn,low,stack,in_stack,timer,component,sizes);
      vector<bool> has_out(sizes.size(),false);for(auto [u,v]:edges)if(component[static_cast<size_t>(u)]!=component[static_cast<size_t>(v)])has_out[static_cast<size_t>(component[static_cast<size_t>(u)])]=true;
      int sink=-1;for(int id=0;id<static_cast<int>(sizes.size());++id)if(!has_out[static_cast<size_t>(id)]){if(sink!=-1){cout<<0<<'\n';return 0;}sink=id;}cout<<sizes[static_cast<size_t>(sink)]<<'\n';
  }
external_url: http://bailian.openjudge.cn/practice/2186/
external_platform: OpenJ_Bailian
external_problem_id: '2186'
external_title: Popular Cows
external_relation: original
source_book_pages: [619]
source_pdf_pages: [249]
review_status: verified
---

傳遞性不必顯式求閉包；縮點後「所有點都能到達」完全由唯一匯 SCC 刻畫。
