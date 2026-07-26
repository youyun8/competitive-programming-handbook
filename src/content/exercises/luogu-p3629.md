---
id: luogu-p3629
volume: upper
source_file: upper-volume
source_book_pages: [229]
source_pdf_pages: [247]
chapter: 4
section: '4.7'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3629 巡邏：樹直徑與加邊
difficulty: 5
topics: [樹直徑, 樹形 DP, 路徑反權]
prerequisites: [tree-diameter]
statement: 巡邏員每天從節點 1 出發，走遍樹上每條原邊至少一次並回到 1。可以在原樹上新增 K 條不同且原本不存在的邊（K 為 1 或 2），求最短巡邏長度。
constraints:
  - '3 <= n <= 100000'
  - 'K in {1,2}'
  - 輸入為無權樹
input_format: 第一行 n、K；接著 n-1 行樹邊。
output_format: 一個整數，最短巡邏長度。
samples:
  - input: |
      4 1
      1 2
      2 3
      3 4
    output: |
      4
    explanation: 新增 1—4 後沿環一圈即可；相較每條樹邊往返的 6，節省直徑 3 再付新邊 1。
core_knowledge: [基準邊雙走, 第一條直徑, 負權標記, 最大路徑 DP]
judgment: 新邊端點間的樹路徑可由走兩次降為一次，單條邊應選直徑；兩條新邊的第二次收益需扣除與第一條路徑重疊的部分。
hints:
  - 不加邊時答案是 2(n-1)；新增端點距離 d 的邊，淨節省 d-1。
  - K=1 時最大化 d，即求樹直徑。
  - K=2 時把第一條直徑邊權改成 -1、其餘為 +1；第二條可得的淨額外樹路徑收益是此帶權樹的最大路徑和。
solution_outline: 兩次 DFS 找直徑並記父邊。K=2 時反轉直徑邊權，以樹形 DP 求最大帶權路徑；代入 2(n-1)-d1-d2+K。
proof_or_invariant: 每條新邊使其樹路徑少走一次但新增邊需走一次。第一路徑選最長；與它重疊的邊若再被第二路徑使用會抵消而非再次節省，故置 -1，非重疊邊置 +1，最大路徑 DP 枚舉最佳第二路徑。
complexity:
  time: O(n)
  space: O(n)
common_errors:
  - 忘記每條新增邊本身增加一次路程
  - K=2 直接取兩條最長直徑而未處理重疊
  - 遞迴 DFS 在鏈狀樹爆棧
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;cin>>n>>k;vector<vector<int>>g(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;g[static_cast<size_t>(u)].push_back(v);g[static_cast<size_t>(v)].push_back(u);}/* TODO：直徑、反權與最大路徑。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to,index;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;cin>>n>>k;vector<vector<Edge>>graph(static_cast<size_t>(n+1));for(int index=1,u,v;index<n;++index){cin>>u>>v;graph[static_cast<size_t>(u)].push_back({v,index});graph[static_cast<size_t>(v)].push_back({u,index});}auto farthest=[&](int start,vector<int>*output_parent,vector<int>*output_edge){vector<int>distance(static_cast<size_t>(n+1),-1),parent(static_cast<size_t>(n+1)),parent_edge(static_cast<size_t>(n+1)),queue{start};distance[static_cast<size_t>(start)]=0;for(size_t i=0;i<queue.size();++i){int node=queue[i];for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent[static_cast<size_t>(node)]){parent[static_cast<size_t>(edge.to)]=node;parent_edge[static_cast<size_t>(edge.to)]=edge.index;distance[static_cast<size_t>(edge.to)]=distance[static_cast<size_t>(node)]+1;queue.push_back(edge.to);}}int result=start;for(int node=1;node<=n;++node)if(distance[static_cast<size_t>(node)]>distance[static_cast<size_t>(result)])result=node;if(output_parent!=nullptr)*output_parent=move(parent);if(output_edge!=nullptr)*output_edge=move(parent_edge);return pair<int,int>{result,distance[static_cast<size_t>(result)]};};int first=farthest(1,nullptr,nullptr).first;vector<int>parent,parent_edge;auto [second,diameter]=farthest(first,&parent,&parent_edge);if(k==1){cout<<2*(n-1)-diameter+1<<'\n';return 0;}vector<int>weight(static_cast<size_t>(n),1);for(int node=second;node!=first;node=parent[static_cast<size_t>(node)])weight[static_cast<size_t>(parent_edge[static_cast<size_t>(node)])]=-1;vector<int>tree_parent(static_cast<size_t>(n+1)),order{1},down(static_cast<size_t>(n+1));vector<int>tree_edge(static_cast<size_t>(n+1));for(size_t i=0;i<order.size();++i){int node=order[i];for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=tree_parent[static_cast<size_t>(node)]){tree_parent[static_cast<size_t>(edge.to)]=node;tree_edge[static_cast<size_t>(edge.to)]=edge.index;order.push_back(edge.to);}}int second_path=0;for(auto iterator=order.rbegin();iterator!=order.rend();++iterator){int node=*iterator,best=0,next_best=0;for(Edge edge:graph[static_cast<size_t>(node)])if(tree_parent[static_cast<size_t>(edge.to)]==node){int candidate=max(0,down[static_cast<size_t>(edge.to)]+weight[static_cast<size_t>(edge.index)]);if(candidate>best){next_best=best;best=candidate;}else next_best=max(next_best,candidate);}down[static_cast<size_t>(node)]=best;second_path=max(second_path,best+next_best);}cout<<2*(n-1)-diameter-second_path+2<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3629
external_platform: 洛谷
external_problem_id: P3629
external_title: '[APIO2010] 巡逻'
---

把「新增一條捷徑」視為對原樹路徑邊權的節省，第二條路徑的重疊處自然應以負權抵消。
