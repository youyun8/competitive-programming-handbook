---
id: luogu-p2056
volume: upper
source_file: upper-volume
source_book_pages: [253]
source_pdf_pages: [271]
chapter: 4
section: '4.9'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P2056 捉迷藏：動態點分治維護直徑
difficulty: 5
topics: [動態點分治, 可刪集合, 動態直徑]
prerequisites: [tree-centroid]
statement: 樹上房間初始全部關燈。支援切換一個房間燈光，以及查詢目前兩個關燈房間的最遠距離；僅一間關燈輸出 0，全部開燈輸出 -1。
constraints:
  - '1 <= n <= 100000'
  - '1 <= q <= 500000'
  - 樹邊長皆為 1
input_format: 第一行 n；接著 n-1 條邊；再給 q 與 q 個操作。C i 切換，G 查詢。
output_format: 每個 G 輸出目前關燈點集的直徑。
samples:
  - input: |
      3
      1 2
      2 3
      5
      G
      C 1
      G
      C 3
      G
    output: |
      2
      1
      0
    explanation: 關燈集合依序為 {1,2,3}、{2,3}、{2}。
core_knowledge: [centroid_ancestor_chain, branch_maximum, two_best_branches, global_multiset]
judgment: 任一點對在點分樹上首次分離的重心處屬於不同分支；每個重心只需維護各分支最遠活躍點，再取最大的兩個分支。
hints:
  - 建點分樹時，為每個原節點記錄所有點分祖先、距離，以及它在該祖先下所屬分支。
  - 每個分支維護活躍點距離 multiset；每個重心再維護各非空分支最大值的 multiset。
  - 切換節點時沿其 O(log n) 關係逐層更新；更新前後把該重心前兩大之和從全域 multiset 刪除／加入。
solution_outline: 建立點分解關係。以兩層 multiset 維護分支最大距離、重心候選直徑，再以全域 multiset 回答最大候選。
proof_or_invariant: 對任兩活躍點，存在唯一首個將兩者分入不同分支的點分重心，兩點距離等於各自到該重心距離之和；該重心前兩大分支涵蓋最佳點對。全域最大因此正是動態直徑。
complexity:
  time: 建構 O(n log n)，每次切換 O(log^2 n)，查詢 O(1)
  space: O(n log n)
common_errors:
  - 同一分支取兩個最遠值相加，該路徑不一定經重心
  - 更新分支最大值前未從重心集合刪除舊最大值
  - 零或一個關燈房間的特殊輸出錯誤
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;/* TODO：建立點分關係並維護兩層可刪集合。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Relation{int center,branch,distance;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<vector<int>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;graph[static_cast<size_t>(u)].push_back(v);graph[static_cast<size_t>(v)].push_back(u);}vector<int>subtree(static_cast<size_t>(n+1));vector<char>removed(static_cast<size_t>(n+1));vector<vector<Relation>>relations(static_cast<size_t>(n+1));int branch_count=0;function<int(int,int)>measure=[&](int node,int parent){subtree[static_cast<size_t>(node)]=1;for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0)subtree[static_cast<size_t>(node)]+=measure(next,node);return subtree[static_cast<size_t>(node)];};function<int(int,int,int)>centroid=[&](int node,int parent,int total){for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0&&subtree[static_cast<size_t>(next)]>total/2)return centroid(next,node,total);return node;};function<void(int,int,int,int,int)>attach=[&](int node,int parent,int distance,int center,int branch){relations[static_cast<size_t>(node)].push_back({center,branch,distance});for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0)attach(next,node,distance+1,center,branch);};function<void(int)>decompose=[&](int start){int center=centroid(start,0,measure(start,0));int self_branch=branch_count++;relations[static_cast<size_t>(center)].push_back({center,self_branch,0});for(int next:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(next)]==0){int branch=branch_count++;attach(next,center,1,center,branch);}removed[static_cast<size_t>(center)]=1;for(int next:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(next)]==0)decompose(next);};decompose(1);vector<multiset<int>>branch_values(static_cast<size_t>(branch_count));vector<multiset<int>>center_tops(static_cast<size_t>(n+1));vector<int>candidate(static_cast<size_t>(n+1),-1);multiset<int>global_candidates;vector<char>active(static_cast<size_t>(n+1));int active_count=0;auto erase_one=[](multiset<int>&values,int value){auto iterator=values.find(value);if(iterator!=values.end())values.erase(iterator);};auto refresh_candidate=[&](int center){if(candidate[static_cast<size_t>(center)]>=0)erase_one(global_candidates,candidate[static_cast<size_t>(center)]);if(center_tops[static_cast<size_t>(center)].size()>=2){auto iterator=center_tops[static_cast<size_t>(center)].rbegin();int first=*iterator;++iterator;candidate[static_cast<size_t>(center)]=first+*iterator;global_candidates.insert(candidate[static_cast<size_t>(center)]);}else candidate[static_cast<size_t>(center)]=-1;};auto set_state=[&](int node,bool turn_on){for(const Relation&relation:relations[static_cast<size_t>(node)]){refresh_candidate(relation.center);multiset<int>&branch=branch_values[static_cast<size_t>(relation.branch)];multiset<int>&tops=center_tops[static_cast<size_t>(relation.center)];if(!branch.empty())erase_one(tops,*branch.rbegin());if(turn_on)branch.insert(relation.distance);else erase_one(branch,relation.distance);if(!branch.empty())tops.insert(*branch.rbegin());refresh_candidate(relation.center);}active[static_cast<size_t>(node)]=static_cast<char>(turn_on);active_count+=turn_on?1:-1;};for(int node=1;node<=n;++node)set_state(node,true);int query_count;cin>>query_count;while(query_count--){char operation;cin>>operation;if(operation=='C'){int node;cin>>node;set_state(node,active[static_cast<size_t>(node)]==0);}else if(active_count==0)cout<<-1<<'\n';else if(active_count==1)cout<<0<<'\n';else cout<<*global_candidates.rbegin()<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P2056
external_platform: 洛谷
external_problem_id: P2056
external_title: '[ZJOI2007] 捉迷藏'
---

動態點分治的核心是把每個點對交給「首次分離它們的重心」；更新只需沿點分祖先鏈修改摘要。
