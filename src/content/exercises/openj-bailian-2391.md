---
id: openj-bailian-2391
volume: lower
source_file: lower-volume
original_label: OpenJudge 百練 2391
title: 百練 2391 Ombrophobic Bovines：最短路、二分與最大流
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 5
topics: [Floyd-Warshall, 二分答案, 最大流]
prerequisites: [dijkstra, max-flow]
core_knowledge: [全源最短路, 距離門檻配對, 容量分配]
judgment: 固定最長移動距離 D 後，只有最短距離不超過 D 的牛舍配對可用，剩下是容量二分圖最大流。
statement: 各牧場有若干牛與避雨容量，牛可沿帶權道路移動；求把所有牛安置進容量內時，單頭牛移動距離最大值的最小可能值，不可能則輸出 -1。
constraints: ['n <= 200', '道路無向且權為正', '牛不可拆分但同牧場牛可分流']
input_format: 第一行牧場數 n、道路數 m；接著 n 行牛數與容量，再輸入 m 條道路 u、v、w。
output_format: 輸出最小可行最大距離，無解輸出 -1。
samples:
  - input: |-
      2 1
      3 0
      0 3
      1 2 5
    output: '5'
    explanation: 三頭牛都從牧場 1 移至牧場 2，最遠距離為 5。
hints:
  - Floyd 先求每對牧場的真正最短距離。
  - 建左側供應、右側容量的二分流網路；dist[i][j]≤D 才連無限容量邊。
  - 可行性隨 D 單調，對所有有限最短距離排序後二分。
solution_outline: Floyd 後收集候選距離；固定候選建立源到供應、供應到可達容量、容量到匯的 Dinic 網路，流量等於總牛數即可行；二分第一個可行距離。
proof_or_invariant: 任一距離上限 D 的搬運方案可按來源與目的聚合成網路流，且所有使用配對都有 dist≤D；任一整數流反向給出合法牛隻分配。故最大流可行性與原問題等價，單調二分得到最小門檻。
complexity: { time: 'O(n^3 + log(n^2)×MaxFlow)', space: 'O(n^2)' }
common_errors: [直接道路距離未先做 Floyd, 容量節點與供應節點混成同一層, 總容量足夠卻忽略圖上不可達]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,m;cin>>n>>m;/* TODO：Floyd、二分門檻、最大流判定。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Dinic{
      struct Edge{int to,reverse;long long capacity;};
      vector<vector<Edge>> graph;vector<int> level,current;
      explicit Dinic(int n):graph(static_cast<size_t>(n)),level(static_cast<size_t>(n)),current(static_cast<size_t>(n)){}
      void add_edge(int from,int to,long long capacity){Edge forward{to,static_cast<int>(graph[static_cast<size_t>(to)].size()),capacity};Edge backward{from,static_cast<int>(graph[static_cast<size_t>(from)].size()),0};graph[static_cast<size_t>(from)].push_back(forward);graph[static_cast<size_t>(to)].push_back(backward);}
      bool bfs(int source,int sink){fill(level.begin(),level.end(),-1);queue<int> queue_nodes;level[static_cast<size_t>(source)]=0;queue_nodes.push(source);while(!queue_nodes.empty()){int u=queue_nodes.front();queue_nodes.pop();for(const Edge& edge:graph[static_cast<size_t>(u)])if(edge.capacity>0&&level[static_cast<size_t>(edge.to)]<0){level[static_cast<size_t>(edge.to)]=level[static_cast<size_t>(u)]+1;queue_nodes.push(edge.to);}}return level[static_cast<size_t>(sink)]>=0;}
      long long dfs(int u,int sink,long long flow){if(u==sink)return flow;for(int& index=current[static_cast<size_t>(u)];index<static_cast<int>(graph[static_cast<size_t>(u)].size());++index){Edge& edge=graph[static_cast<size_t>(u)][static_cast<size_t>(index)];if(edge.capacity<=0||level[static_cast<size_t>(edge.to)]!=level[static_cast<size_t>(u)]+1)continue;long long sent=dfs(edge.to,sink,min(flow,edge.capacity));if(sent>0){edge.capacity-=sent;graph[static_cast<size_t>(edge.to)][static_cast<size_t>(edge.reverse)].capacity+=sent;return sent;}}return 0;}
      long long max_flow(int source,int sink){long long result=0;while(bfs(source,sink)){fill(current.begin(),current.end(),0);while(long long sent=dfs(source,sink,LLONG_MAX/4))result+=sent;}return result;}
  };
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,m;if(!(cin>>n>>m))return 0;vector<long long> cows(static_cast<size_t>(n)),capacity(static_cast<size_t>(n));long long total=0;for(int i=0;i<n;++i){cin>>cows[static_cast<size_t>(i)]>>capacity[static_cast<size_t>(i)];total+=cows[static_cast<size_t>(i)];}
      const long long inf=LLONG_MAX/4;vector<vector<long long>> dist(static_cast<size_t>(n),vector<long long>(static_cast<size_t>(n),inf));for(int i=0;i<n;++i)dist[static_cast<size_t>(i)][static_cast<size_t>(i)]=0;for(int i=0;i<m;++i){int u,v;long long w;cin>>u>>v>>w;--u;--v;dist[static_cast<size_t>(u)][static_cast<size_t>(v)]=dist[static_cast<size_t>(v)][static_cast<size_t>(u)]=min(dist[static_cast<size_t>(u)][static_cast<size_t>(v)],w);}
      for(int k=0;k<n;++k)for(int i=0;i<n;++i)for(int j=0;j<n;++j)if(dist[static_cast<size_t>(i)][static_cast<size_t>(k)]<inf&&dist[static_cast<size_t>(k)][static_cast<size_t>(j)]<inf)dist[static_cast<size_t>(i)][static_cast<size_t>(j)]=min(dist[static_cast<size_t>(i)][static_cast<size_t>(j)],dist[static_cast<size_t>(i)][static_cast<size_t>(k)]+dist[static_cast<size_t>(k)][static_cast<size_t>(j)]);
      vector<long long> values;for(const auto& row:dist)for(long long value:row)if(value<inf)values.push_back(value);sort(values.begin(),values.end());values.erase(unique(values.begin(),values.end()),values.end());
      auto feasible=[&](long long limit){int source=2*n,sink=source+1;Dinic flow(2*n+2);for(int i=0;i<n;++i){flow.add_edge(source,i,cows[static_cast<size_t>(i)]);flow.add_edge(n+i,sink,capacity[static_cast<size_t>(i)]);for(int j=0;j<n;++j)if(dist[static_cast<size_t>(i)][static_cast<size_t>(j)]<=limit)flow.add_edge(i,n+j,total);}return flow.max_flow(source,sink)==total;};
      int left=0,right=static_cast<int>(values.size())-1,answer=-1;while(left<=right){int middle=(left+right)/2;if(feasible(values[static_cast<size_t>(middle)])){answer=middle;right=middle-1;}else left=middle+1;}if(answer<0)cout<<"-1\n";else cout<<values[static_cast<size_t>(answer)]<<'\n';
  }
external_url: http://bailian.openjudge.cn/practice/2391/
external_platform: OpenJudge 百練
external_problem_id: '2391'
external_title: Ombrophobic Bovines
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

先把道路網壓成最短距離矩陣，再以距離門檻決定可用配對，便能把搬運問題精確化為最大流。
