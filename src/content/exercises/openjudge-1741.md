---
id: openjudge-1741
volume: upper
source_file: upper-volume
source_book_pages: [253]
source_pdf_pages: [271]
chapter: 4
section: '4.9'
kind: external-oj
review_status: verified
external_relation: original
title: OpenJudge 1741 Tree：點分治統計距離對
difficulty: 5
topics: [點分治, 樹距離, 雙指標]
prerequisites: [tree-centroid]
statement: 給定帶正權樹與 K，統計無序節點對 (u,v)，u<v，且兩點距離不超過 K。
constraints:
  - '1 <= n <= 10000'
  - '0 <= K <= 10^9'
  - 輸入多組測資，以 0 0 結束
input_format: 每組第一行 n、K；接著 n-1 行 u、v、w；最後 0 0。
output_format: 每組輸出符合條件的無序點對數。
samples:
  - input: |
      5 4
      1 2 1
      2 3 2
      2 4 3
      4 5 1
      0 0
    output: |
      7
    explanation: 逐對計算唯一樹距離，可得七對距離不超過 4。
core_knowledge: [centroid_decomposition, inclusion_exclusion, sorted_pair_count]
judgment: 全部點對無法逐一枚舉；以重心分治時只統計路徑經過目前重心的點對，再遞迴各子樹。
hints:
  - 收集某集合內每點到重心的距離，排序後用雙指標計數和不超過 K 的兩元素對。
  - 先計所有子樹合併後的距離對，再減去每個單一子樹內的距離對，留下路徑經過重心者。
  - 刪除重心後每個分量至多原大小一半，遞迴處理尚未統計的內部點對。
solution_outline: 點分治找重心；以 calc(all)-Σcalc(child) 累加跨分量合法對；標記重心後遞迴各分量。
proof_or_invariant: 每對節點在點分樹上首次被某重心分到不同分量時，其路徑經該重心並恰被計一次；同分量對先被容斥扣除，留待遞迴，因此不重不漏。
complexity:
  time: O(n log^2 n)
  space: O(n)
common_errors:
  - 把同一子樹內、路徑不經重心的點對也計入
  - 忘記距離列表加入重心自己的 0
  - 點對數用 32 位元溢位
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;long long k;while(cin>>n>>k&&n!=0){/* TODO：點分治與距離容斥。 */}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to;long long weight;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;long long limit;while(cin>>n>>limit&&(n!=0||limit!=0)){vector<vector<Edge>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){long long weight;cin>>u>>v>>weight;graph[static_cast<size_t>(u)].push_back({v,weight});graph[static_cast<size_t>(v)].push_back({u,weight});}vector<int>subtree(static_cast<size_t>(n+1));vector<char>removed(static_cast<size_t>(n+1));function<int(int,int)>measure=[&](int node,int parent){subtree[static_cast<size_t>(node)]=1;for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)subtree[static_cast<size_t>(node)]+=measure(edge.to,node);return subtree[static_cast<size_t>(node)];};function<int(int,int,int)>centroid=[&](int node,int parent,int total){for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0&&subtree[static_cast<size_t>(edge.to)]>total/2)return centroid(edge.to,node,total);return node;};function<void(int,int,long long,vector<long long>&)>collect=[&](int node,int parent,long long distance,vector<long long>&values){values.push_back(distance);for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)collect(edge.to,node,distance+edge.weight,values);};auto count_pairs=[&](vector<long long>values){sort(values.begin(),values.end());long long result=0;size_t left=0,right=values.size();if(right==0)return result;--right;while(left<right){if(values[left]+values[right]<=limit){result+=static_cast<long long>(right-left);++left;}else --right;}return result;};long long answer=0;function<void(int)>decompose=[&](int start){int center=centroid(start,0,measure(start,0));vector<long long>all{0};for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0){vector<long long>part;collect(edge.to,center,edge.weight,part);answer-=count_pairs(part);all.insert(all.end(),part.begin(),part.end());}answer+=count_pairs(all);removed[static_cast<size_t>(center)]=1;for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0)decompose(edge.to);};decompose(1);cout<<answer<<'\n';}}
external_url: http://poj.org/problem?id=1741
external_platform: OpenJudge
external_problem_id: '1741'
external_title: Tree
---

點分治的容斥式 `全部距離對－各子樹內距離對` 是統計「路徑經過某點」的標準形式。
