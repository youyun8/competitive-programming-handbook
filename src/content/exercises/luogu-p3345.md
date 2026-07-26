---
id: luogu-p3345
volume: upper
source_file: upper-volume
source_book_pages: [253]
source_pdf_pages: [271]
chapter: 4
section: '4.9'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3345 幻想鄉戰略遊戲：動態帶權樹中位點
difficulty: 5
topics: [動態點分治, 帶權重心, 距離和]
prerequisites: [tree-centroid]
statement: 帶權樹上每點有動態軍隊數。每次對一點增加或減少軍隊後，選一個補給站，最小化所有軍隊數乘到補給站距離之和，輸出最小代價。
constraints:
  - '1 <= n,q <= 100000'
  - 樹的節點度數不超過 20
  - 每次修改後軍隊數保持非負
input_format: 第一行 n、q；接著 n-1 行 u、v、edge_weight；再接 q 行 node、delta。
output_format: 每次修改後輸出最佳補給代價。
samples:
  - input: |
      3 3
      1 2 2
      2 3 3
      1 1
      3 1
      2 2
    output: |
      0
      5
      5
    explanation: 只有點 1 有軍隊時代價 0；兩端各一時任選路徑上的節點代價 5；再在 2 增兩隊，2 為最佳點且代價仍為 5。
core_knowledge: [centroid_distance_sum, branch_inclusion_exclusion, weighted_median_descent]
judgment: 點分樹可在 O(log n) 更新任意候選點的加權距離和；最優點是樹的帶權中位點，可沿唯一改善方向下降。
hints:
  - 每個點記錄到所有點分祖先的距離與所屬分支；祖先維護總軍隊權及加權距離和。
  - 計算 cost(x) 時逐祖先加 total_distance+total_weight×dist(x,center)，再減去 x 所屬分支的重複部分。
  - 從點分樹根開始；若某個點分兒子所代表原樹方向的相鄰點代價更小，就下降到該兒子，直到無法改善。
solution_outline: 建點分樹及每點的祖先距離關係。修改沿關係更新總量與分支量；查詢從點分根按相鄰方向代價貪心下降，最後輸出該點 cost。
proof_or_invariant: 點分祖先容斥讓每個軍隊對 cost(x) 恰貢獻一次。樹上距離和沿邊是離散凸函數，若目前不是中位點，恰有一個重量過半方向使代價下降；點分子分量完整涵蓋該方向，因此下降終止於全域最小點。
complexity:
  time: 建構 O(n log n)，每次修改 O(log n)，每次查詢 O(degree log^2 n)
  space: O(n log n)
common_errors:
  - cost 查詢加祖先總量卻未減去同分支重複貢獻
  - 比較點分兒子中心，而非目前重心朝該分量的原樹相鄰點
  - 修改量與距離乘積使用 32 位元
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,q;cin>>n>>q;/* TODO：點分祖先容斥與帶權中位點下降。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to;long long weight;};
  struct Relation{int center,branch;long long distance;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,query_count;cin>>n>>query_count;vector<vector<Edge>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){long long weight;cin>>u>>v>>weight;graph[static_cast<size_t>(u)].push_back({v,weight});graph[static_cast<size_t>(v)].push_back({u,weight});}vector<int>subtree(static_cast<size_t>(n+1)),near_node(static_cast<size_t>(n+1));vector<char>removed(static_cast<size_t>(n+1));vector<vector<int>>centroid_children(static_cast<size_t>(n+1));vector<vector<Relation>>relations(static_cast<size_t>(n+1));int branch_count=0;function<int(int,int)>measure=[&](int node,int parent){subtree[static_cast<size_t>(node)]=1;for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)subtree[static_cast<size_t>(node)]+=measure(edge.to,node);return subtree[static_cast<size_t>(node)];};function<int(int,int,int)>find_centroid=[&](int node,int parent,int total){for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0&&subtree[static_cast<size_t>(edge.to)]>total/2)return find_centroid(edge.to,node,total);return node;};function<void(int,int,long long,int,int)>attach=[&](int node,int parent,long long distance,int center,int branch){relations[static_cast<size_t>(node)].push_back({center,branch,distance});for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)attach(edge.to,node,distance+edge.weight,center,branch);};function<int(int)>decompose=[&](int start){int center=find_centroid(start,0,measure(start,0));relations[static_cast<size_t>(center)].push_back({center,-1,0});for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0){int branch=branch_count++;attach(edge.to,center,edge.weight,center,branch);}removed[static_cast<size_t>(center)]=1;for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0){int child=decompose(edge.to);centroid_children[static_cast<size_t>(center)].push_back(child);near_node[static_cast<size_t>(child)]=edge.to;}return center;};int centroid_root=decompose(1);vector<long long>total_weight(static_cast<size_t>(n+1)),total_distance(static_cast<size_t>(n+1)),branch_weight(static_cast<size_t>(branch_count)),branch_distance(static_cast<size_t>(branch_count));auto update=[&](int node,long long delta){for(const Relation&relation:relations[static_cast<size_t>(node)]){total_weight[static_cast<size_t>(relation.center)]+=delta;total_distance[static_cast<size_t>(relation.center)]+=delta*relation.distance;if(relation.branch>=0){branch_weight[static_cast<size_t>(relation.branch)]+=delta;branch_distance[static_cast<size_t>(relation.branch)]+=delta*relation.distance;}}};auto cost=[&](int node){long long result=0;for(const Relation&relation:relations[static_cast<size_t>(node)]){result+=total_distance[static_cast<size_t>(relation.center)]+total_weight[static_cast<size_t>(relation.center)]*relation.distance;if(relation.branch>=0)result-=branch_distance[static_cast<size_t>(relation.branch)]+branch_weight[static_cast<size_t>(relation.branch)]*relation.distance;}return result;};while(query_count--){int node;long long delta;cin>>node>>delta;update(node,delta);int current=centroid_root;long long current_cost=cost(current);while(true){int next_center=0;long long next_cost=current_cost;for(int child:centroid_children[static_cast<size_t>(current)]){long long candidate=cost(near_node[static_cast<size_t>(child)]);if(candidate<next_cost){next_cost=candidate;next_center=child;}}if(next_center==0)break;current=next_center;current_cost=cost(current);}cout<<current_cost<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P3345
external_platform: 洛谷
external_problem_id: P3345
external_title: '[ZJOI2015] 幻想乡战略游戏'
---

距離和在樹上具有凸性；點分樹提供快速 `cost(x)`，再用局部下降即可定位動態帶權中位點。
