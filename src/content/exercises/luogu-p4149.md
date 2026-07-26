---
id: luogu-p4149
volume: upper
source_file: upper-volume
source_book_pages: [253]
source_pdf_pages: [271]
chapter: 4
section: '4.9'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P4149 Race：點分治找定長最少邊路徑
difficulty: 5
topics: [點分治, 距離互補, 最小邊數]
prerequisites: [tree-centroid]
statement: 帶非負權樹上找一條總權重恰為 K 的簡單路徑，使經過邊數最少；不存在輸出 -1。
constraints:
  - '1 <= n <= 200000'
  - '1 <= K <= 1000000'
  - 節點依原題以 0 到 n-1 編號
input_format: 第一行 n、K；接著 n-1 行 u、v、w。
output_format: 恰好距離 K 的路徑最少邊數，或 -1。
samples:
  - input: |
      4 5
      0 1 2
      1 2 3
      1 3 4
    output: |
      2
    explanation: 路徑 0—1—2 權重為 5，使用兩條邊。
core_knowledge: [centroid_decomposition, complement_distance, minimum_depth_table]
judgment: 固定重心後，跨不同分量且經重心的路徑由兩個到重心距離互補成 K；同時保留每個距離的最少邊數即可最佳化。
hints:
  - 對目前重心建立 best[0]=0，表示距離 0 使用 0 邊。
  - 逐個兒子收集 (distance,edge_count)；先用 best[K-distance] 更新答案，再把本兒子資料併入 best。
  - 先查後併可避免同一兒子內、路徑不經重心的點對；那些留給遞迴。
solution_outline: 點分治；每個重心依次處理子樹距離，互補查詢最少邊數，再遞迴刪除重心後的分量。
proof_or_invariant: 任一路徑在點分樹上首次分離時經當前重心，兩端距離和為 K；best 保存已處理分量對每個距離的最小邊數，因此該路徑及其同距離最佳版本都被正確考慮一次。
complexity:
  time: O(n log n)
  space: O(n+K)
common_errors:
  - 收集一個兒子後立即逐點查逐點加，誤配到同一兒子較早節點
  - 距離超過 K 後仍繼續 DFS
  - 忘記節點編號從 0 開始
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;cin>>n>>k;/* TODO：點分治與距離最少邊數表。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to,weight;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,target;cin>>n>>target;vector<vector<Edge>>graph(static_cast<size_t>(n));for(int i=1,u,v,w;i<n;++i){cin>>u>>v>>w;graph[static_cast<size_t>(u)].push_back({v,w});graph[static_cast<size_t>(v)].push_back({u,w});}vector<int>subtree(static_cast<size_t>(n)),best(static_cast<size_t>(target+1),numeric_limits<int>::max());vector<char>removed(static_cast<size_t>(n));function<int(int,int)>measure=[&](int node,int parent){subtree[static_cast<size_t>(node)]=1;for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)subtree[static_cast<size_t>(node)]+=measure(edge.to,node);return subtree[static_cast<size_t>(node)];};function<int(int,int,int)>centroid=[&](int node,int parent,int total){for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0&&subtree[static_cast<size_t>(edge.to)]>total/2)return centroid(edge.to,node,total);return node;};function<void(int,int,int,int,vector<pair<int,int>>&)>collect=[&](int node,int parent,int distance,int edges,vector<pair<int,int>>&values){if(distance>target)return;values.push_back({distance,edges});for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)collect(edge.to,node,distance+edge.weight,edges+1,values);};int answer=numeric_limits<int>::max();function<void(int)>decompose=[&](int start){int center=centroid(start,-1,measure(start,-1));vector<int>touched{0};best[0]=0;for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0){vector<pair<int,int>>values;collect(edge.to,center,edge.weight,1,values);for(auto [distance,edges]:values)if(best[static_cast<size_t>(target-distance)]!=numeric_limits<int>::max())answer=min(answer,edges+best[static_cast<size_t>(target-distance)]);for(auto [distance,edges]:values){if(best[static_cast<size_t>(distance)]==numeric_limits<int>::max())touched.push_back(distance);best[static_cast<size_t>(distance)]=min(best[static_cast<size_t>(distance)],edges);}}for(int distance:touched)best[static_cast<size_t>(distance)]=numeric_limits<int>::max();removed[static_cast<size_t>(center)]=1;for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0)decompose(edge.to);};decompose(0);cout<<(answer==numeric_limits<int>::max()?-1:answer)<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4149
external_platform: 洛谷
external_problem_id: P4149
external_title: '[IOI2011] Race'
---

點分治不只統計點對數；把距離桶的值改成最少邊數，就能在相同互補框架中做最佳化。
