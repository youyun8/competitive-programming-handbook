---
id: luogu-p4183
volume: upper
source_file: upper-volume
source_book_pages: [253]
source_pdf_pages: [271]
chapter: 4
section: '4.9'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P4183 Cow at Large：點分治與度數容斥
difficulty: 5
topics: [點分治, 最近葉距離, 度數恆等式, 離線偏序]
prerequisites: [tree-centroid]
statement: 樹的葉節點是出口。奶牛從某節點出現並企圖到出口，農夫可選若干出口同時出發且雙方等速、資訊完全。對每個奶牛起點求保證捕獲所需的最少農夫數。
constraints:
  - '2 <= n <= 100000'
  - 樹邊皆為單位長
  - 需對每個節點輸出答案
input_format: 第一行 n；接著 n-1 行無向邊。
output_format: 共 n 行，第 i 行為從節點 i 出發所需最少農夫數。
samples:
  - input: |
      3
      1 2
      2 3
    output: |
      1
      2
      1
    explanation: 從出口出現只需一名農夫；從中點出現需封住兩端出口。
core_knowledge: [multi_source_bfs, prufer_degree_identity, weighted_distance_condition, centroid_inclusion_exclusion]
judgment: 對非葉起點 u，答案可化為 Σ_v (2-degree[v])·[nearest_leaf[v] <= dist(u,v)]；這是可由點分治統計的帶權距離偏序。
hints:
  - 先從所有葉節點多源 BFS，得到 g[v]：v 到最近出口距離。
  - 一個完整被封鎖子樹的 Σ(2-degree) 恰為 1，因此最小封鎖數可改寫成上述加權指示式。
  - 在重心處 dist(u,v)=d[u]+d[v]；按 key[v]=g[v]-d[v] 排序做前綴權重，對每個 u 查 key<=d[u]，再減去各單一子樹結果。
solution_outline: 多源 BFS 求 g。點分治每層對整個分量做一次鍵排序統計，再對每個重心子分量做同式扣除；葉起點依規則直接為 1。
proof_or_invariant: 度數恆等式把每個最小封鎖前沿子樹壓成權重和 1。點分治容斥使每對 (u,v) 在路徑首次經分治重心時恰計一次，此時條件等價於 g[v]-d[v]<=d[u]，故累加值即最少農夫數。
complexity:
  time: O(n log^2 n)
  space: O(n)
common_errors:
  - 把條件方向寫成 nearest_leaf >= distance
  - 忘記權重 2-degree 可能為負
  - 葉節點起點未依遊戲規則直接輸出 1
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;/* TODO：最近葉距離、度數權與點分治偏序。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<vector<int>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;graph[static_cast<size_t>(u)].push_back(v);graph[static_cast<size_t>(v)].push_back(u);}vector<int>nearest_leaf(static_cast<size_t>(n+1),-1);queue<int>pending;for(int node=1;node<=n;++node)if(graph[static_cast<size_t>(node)].size()==1){nearest_leaf[static_cast<size_t>(node)]=0;pending.push(node);}while(!pending.empty()){int node=pending.front();pending.pop();for(int next:graph[static_cast<size_t>(node)])if(nearest_leaf[static_cast<size_t>(next)]<0){nearest_leaf[static_cast<size_t>(next)]=nearest_leaf[static_cast<size_t>(node)]+1;pending.push(next);}}vector<int>subtree(static_cast<size_t>(n+1));vector<char>removed(static_cast<size_t>(n+1));vector<long long>answer(static_cast<size_t>(n+1));function<int(int,int)>measure=[&](int node,int parent){subtree[static_cast<size_t>(node)]=1;for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0)subtree[static_cast<size_t>(node)]+=measure(next,node);return subtree[static_cast<size_t>(node)];};function<int(int,int,int)>centroid=[&](int node,int parent,int total){for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0&&subtree[static_cast<size_t>(next)]>total/2)return centroid(next,node,total);return node;};function<void(int,int,int,vector<pair<int,int>>&)>collect=[&](int node,int parent,int distance,vector<pair<int,int>>&records){records.push_back({node,distance});for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0)collect(next,node,distance+1,records);};auto calculate=[&](const vector<pair<int,int>>&records,int sign){vector<pair<int,int>>keys;keys.reserve(records.size());for(auto [node,distance]:records)keys.push_back({nearest_leaf[static_cast<size_t>(node)]-distance,2-static_cast<int>(graph[static_cast<size_t>(node)].size())});sort(keys.begin(),keys.end());vector<long long>prefix(keys.size()+1);for(size_t i=0;i<keys.size();++i)prefix[i+1]=prefix[i]+keys[i].second;for(auto [node,distance]:records){size_t count=static_cast<size_t>(upper_bound(keys.begin(),keys.end(),pair<int,int>{distance,numeric_limits<int>::max()})-keys.begin());answer[static_cast<size_t>(node)]+=sign*prefix[count];}};function<void(int)>decompose=[&](int start){int center=centroid(start,0,measure(start,0));vector<pair<int,int>>all{{center,0}};for(int next:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(next)]==0){vector<pair<int,int>>part;collect(next,center,1,part);calculate(part,-1);all.insert(all.end(),part.begin(),part.end());}calculate(all,1);removed[static_cast<size_t>(center)]=1;for(int next:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(next)]==0)decompose(next);};decompose(1);for(int node=1;node<=n;++node)cout<<(graph[static_cast<size_t>(node)].size()==1?1:answer[static_cast<size_t>(node)])<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4183
external_platform: 洛谷
external_problem_id: P4183
external_title: '[USACO18JAN] Cow at Large P'
---

度數權 `2-degree` 看似會出現負數，卻能把每個完整封鎖前沿的整棵子樹精確壓縮成一次貢獻。
