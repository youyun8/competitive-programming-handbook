---
id: luogu-p1099
volume: upper
source_file: upper-volume
source_book_pages: [229]
source_pdf_pages: [247]
chapter: 4
section: '4.7'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P1099 樹網的核：直徑上的受限中心路徑
difficulty: 5
topics: [樹直徑, 路徑投影, 枚舉]
prerequisites: [tree-diameter]
statement: 在帶正權樹上選一條長度不超過 s 的簡單路徑作為「核」，最小化所有節點到核的距離最大值，輸出此最小偏心距。
constraints:
  - '2 <= n <= 300'
  - '0 <= s <= 10^9'
  - 邊權為不超過 1000 的正整數
input_format: 第一行 n、s；接著 n-1 行 u、v、w。
output_format: 一個整數，最小偏心距。
samples:
  - input: |
      5 2
      1 2 1
      2 3 1
      3 4 1
      3 5 2
    output: |
      2
    explanation: 選直徑上一段長度不超過 2 的核，所有節點到該段的最遠距離可達 2。
core_knowledge: [最優核位於直徑, 分支投影, 加權距離]
judgment: 樹的最優中心路徑可移到任一直徑上而不增大最遠距離；固定直徑區段後，每個節點距離由投影分支高度及沿直徑距離組成。
hints:
  - 兩次最遠點搜尋取得一條加權直徑及沿線座標。
  - 對每個直徑節點，DFS 不走直徑邊，求掛在此處的最大分支深度。
  - 枚舉直徑端點 L、R 且 coordinate[R]-coordinate[L]<=s，掃描所有投影 i 計算 branch[i]+到區段的距離。
solution_outline: 求直徑，標記直徑節點並計算各投影分支高度；O(diameter_nodes^2) 枚舉合法核，再 O(diameter_nodes) 評估偏心距。
proof_or_invariant: 任一節點到直徑區段的唯一路徑先抵達其直徑投影，距離恰為 branch_distance 加投影到區段距離。列舉所有端點即列舉所有端點在節點上的候選最優核；正權下端點移至相鄰節點不劣於停在邊內。
complexity:
  time: O(n^3)
  space: O(n)
common_errors:
  - 只考慮直徑兩端而漏掉側分支高度
  - 用邊數而非權重限制核長度
  - 分支 DFS 誤走回直徑而重複計算
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;long long s;cin>>n>>s;/* TODO：求直徑、投影分支高度並枚舉核。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to;long long weight;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;long long limit;cin>>n>>limit;vector<vector<Edge>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){long long weight;cin>>u>>v>>weight;graph[static_cast<size_t>(u)].push_back({v,weight});graph[static_cast<size_t>(v)].push_back({u,weight});}auto farthest=[&](int start,vector<int>*saved_parent){vector<int>parent(static_cast<size_t>(n+1)),order{start};vector<long long>distance(static_cast<size_t>(n+1));for(size_t i=0;i<order.size();++i){int node=order[i];for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent[static_cast<size_t>(node)]){parent[static_cast<size_t>(edge.to)]=node;distance[static_cast<size_t>(edge.to)]=distance[static_cast<size_t>(node)]+edge.weight;order.push_back(edge.to);}}int result=start;for(int node=1;node<=n;++node)if(distance[static_cast<size_t>(node)]>distance[static_cast<size_t>(result)])result=node;if(saved_parent!=nullptr)*saved_parent=move(parent);return result;};int endpoint=farthest(1,nullptr);vector<int>parent;int other=farthest(endpoint,&parent);vector<int>path;for(int node=other;;node=parent[static_cast<size_t>(node)]){path.push_back(node);if(node==endpoint)break;}reverse(path.begin(),path.end());vector<char>on_path(static_cast<size_t>(n+1));for(int node:path)on_path[static_cast<size_t>(node)]=1;vector<long long>coordinate(path.size()),branch(path.size());for(size_t i=1;i<path.size();++i)for(Edge edge:graph[static_cast<size_t>(path[i-1])])if(edge.to==path[i]){coordinate[i]=coordinate[i-1]+edge.weight;break;}function<void(int,int,long long,long long&)>scan=[&](int node,int previous,long long distance,long long&maximum){maximum=max(maximum,distance);for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=previous&&on_path[static_cast<size_t>(edge.to)]==0)scan(edge.to,node,distance+edge.weight,maximum);};for(size_t i=0;i<path.size();++i)scan(path[i],0,0,branch[i]);long long answer=numeric_limits<long long>::max();for(size_t left=0;left<path.size();++left)for(size_t right=left;right<path.size();++right)if(coordinate[right]-coordinate[left]<=limit){long long worst=0;for(size_t i=0;i<path.size();++i){long long along=0;if(i<left)along=coordinate[left]-coordinate[i];else if(i>right)along=coordinate[i]-coordinate[right];worst=max(worst,branch[i]+along);}answer=min(answer,worst);}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1099
external_platform: 洛谷
external_problem_id: P1099
external_title: '[NOIP2007 提高组] 树网的核'
---

直徑不只用來求兩端距離，也提供了整棵樹的一維骨架；側枝只需壓縮成各投影點的最大高度。
