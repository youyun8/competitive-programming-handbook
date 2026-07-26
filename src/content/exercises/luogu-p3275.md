---
id: luogu-p3275
volume: lower
source_file: lower-volume
original_label: 洛谷 P3275
title: 洛谷 P3275 糖果：SCC 與差分約束最長路
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 4
topics: [差分約束, 強連通分量, DAG 最長路]
prerequisites: [directed-connectivity, dijkstra]
core_knowledge: [五類不等式建邊, 零權 SCC, 最小可行勢能]
judgment: 統一成 candy[v]>=candy[u]+w；同 SCC 內若有權 1 邊即矛盾。
statement: 每名小朋友至少一顆糖，另有五類相等或大小限制；求滿足要求的最小糖果總數，無解輸出 -1。
constraints: ['n, k <= 100000', '嚴格不等式轉成差至少 1']
input_format: 第一行 n、k；接著 k 行 X、A、B，五種 X 的語意依官方題面。
output_format: 輸出最少糖果總數，無解輸出 -1。
samples:
  - input: |-
      3 2
      2 1 2
      5 2 3
    output: '5'
    explanation: 要求 1 號少於 2 號且 2 號不多於 3 號，最小分配為 1、2、2，總數 5。
hints:
  - 邊 u→v 權 w 表示 candy[v]>=candy[u]+w，嚴格大小的 w 為 1。
  - 權重只有 0、1；互相零權可達的點必須相等，可先縮 SCC。
  - 縮點 DAG 上每個分量初值 1，按拓撲序做最長路，所得是逐點最小可行值。
solution_outline: 依五類限制建 0/1 權邊；Kosaraju 求 SCC，若 SCC 內有權 1 邊則無解。縮點後拓撲最長路，按各 SCC 點數加權求和。
proof_or_invariant: 邊正是原不等式。SCC 內有正權路徑再沿回路返回會推出 x>=x+1；反之縮點後為 DAG，最長路值滿足全部邊且是所有可行解的逐分量下界，故總和最小。
complexity: { time: 'O(n+k)', space: 'O(n+k)' }
common_errors: [五類關係方向寫反, 忘記每人至少一顆, 正權邊位於同 SCC 時未判無解]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,k;cin>>n>>k;/* TODO：建 0/1 約束圖、縮點、DAG 最長路。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to,weight;};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,k;if(!(cin>>n>>k))return 0;
      vector<vector<Edge>> graph(static_cast<size_t>(n)),reverse_graph(static_cast<size_t>(n));
      auto add=[&](int u,int v,int w){--u;--v;graph[static_cast<size_t>(u)].push_back({v,w});reverse_graph[static_cast<size_t>(v)].push_back({u,w});};
      for(int i=0;i<k;++i){int type,a,b;cin>>type>>a>>b;
          if(type==1){add(a,b,0);add(b,a,0);}else if(type==2)add(a,b,1);else if(type==3)add(b,a,0);else if(type==4)add(b,a,1);else add(a,b,0);}
      vector<char> seen(static_cast<size_t>(n),0);vector<int> order;
      for(int start=0;start<n;++start)if(!seen[static_cast<size_t>(start)]){
          vector<pair<int,size_t>> stack_nodes{{start,0}};seen[static_cast<size_t>(start)]=1;
          while(!stack_nodes.empty()){int u=stack_nodes.back().first;size_t& index=stack_nodes.back().second;
              if(index<graph[static_cast<size_t>(u)].size()){int v=graph[static_cast<size_t>(u)][index++].to;
                  if(!seen[static_cast<size_t>(v)]){seen[static_cast<size_t>(v)]=1;stack_nodes.push_back({v,0});}}
              else{order.push_back(u);stack_nodes.pop_back();}}
      }
      vector<int> component(static_cast<size_t>(n),-1);int count=0;
      for(auto it=order.rbegin();it!=order.rend();++it)if(component[static_cast<size_t>(*it)]<0){
          vector<int> stack_nodes{*it};component[static_cast<size_t>(*it)]=count;
          while(!stack_nodes.empty()){int u=stack_nodes.back();stack_nodes.pop_back();for(const Edge& e:reverse_graph[static_cast<size_t>(u)])
              if(component[static_cast<size_t>(e.to)]<0){component[static_cast<size_t>(e.to)]=count;stack_nodes.push_back(e.to);}}
          ++count;
      }
      vector<int> size(static_cast<size_t>(count),0),indegree(static_cast<size_t>(count),0);vector<vector<Edge>> dag(static_cast<size_t>(count));
      for(int u=0;u<n;++u){++size[static_cast<size_t>(component[static_cast<size_t>(u)])];for(auto e:graph[static_cast<size_t>(u)]){
          int a=component[static_cast<size_t>(u)],b=component[static_cast<size_t>(e.to)];if(a==b){if(e.weight>0){cout<<-1<<'\n';return 0;}}else{dag[static_cast<size_t>(a)].push_back({b,e.weight});++indegree[static_cast<size_t>(b)];}}}
      queue<int> pending;vector<long long> dist(static_cast<size_t>(count),1);for(int i=0;i<count;++i)if(indegree[static_cast<size_t>(i)]==0)pending.push(i);
      while(!pending.empty()){int u=pending.front();pending.pop();for(auto e:dag[static_cast<size_t>(u)]){dist[static_cast<size_t>(e.to)]=max(dist[static_cast<size_t>(e.to)],dist[static_cast<size_t>(u)]+e.weight);if(--indegree[static_cast<size_t>(e.to)]==0)pending.push(e.to);}}
      long long answer=0;for(int i=0;i<count;++i)answer+=dist[static_cast<size_t>(i)]*size[static_cast<size_t>(i)];cout<<answer<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P3275
external_platform: 洛谷
external_problem_id: P3275
external_title: '[SCOI2011] 糖果'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

零權環先縮成一個變數，差分約束便從可能卡住的 SPFA 變成線性的 DAG 最長路。
