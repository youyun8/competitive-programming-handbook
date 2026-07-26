---
id: luogu-p3241
volume: upper
source_file: upper-volume
source_book_pages: [253]
source_pdf_pages: [271]
chapter: 4
section: '4.9'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3241 開店：點分樹年齡區間距離和
difficulty: 5
topics: [點分樹, 二分搜尋, 前綴和, 強制在線]
prerequisites: [tree-centroid]
statement: 帶權樹每點住一名有固定年齡的妖怪。強制在線詢問：給店址 u 與年齡區間 [L,R]，求所有年齡在區間內節點到 u 的距離和。
constraints:
  - '1 <= n,q <= 150000'
  - 樹上每點度數不超過 3
  - 年齡與解密模數 A 為非負整數範圍
input_format: 第一行 n、q、A；第二行 n 個年齡；接著 n-1 行 u、v、w；每次詢問 u、a、b，以前次答案 last 解密 L=(a+last)%A、R=(b+last)%A。
output_format: 每個詢問輸出年齡區間內所有節點到 u 的距離和。
samples:
  - input: |
      3 2 10
      2 5 8
      1 2 3
      2 3 4
      2 0 6
      1 1 1
    output: |
      3
      0
    explanation: 首次解密區間 [0,6]，點 1、2 距店址 2 的總距離為 3；last=3 後第二區間為 [4,4]，沒有符合者。
core_knowledge: [centroid_ancestor_inclusion_exclusion, age_sorted_bucket, distance_prefix_sum]
judgment: 對查詢點的每個點分祖先，可統計整個分治分量中符合年齡者，再扣除查詢點所在分支的重複部分。
hints:
  - 建點分治時，記錄每個節點到各重心的距離與所屬重心分支。
  - 每個重心及每個分支分別收集 (age,distance_to_center)，按 age 排序並建立距離前綴和。
  - 查詢一個桶時用兩次 lower/upper_bound 得到數量 count 與距離和 sum，對 u 的貢獻是 sum+count×dist(u,center)。
solution_outline: 建點分解關係與總桶／分支桶；排序建立前綴和。每次沿 u 的點分祖先做總桶加、同分支桶減。
proof_or_invariant: 在每層重心，總桶計入該分量全部候選；與 u 同分支者會在更深層再次計入，故當層扣除。每個候選節點在它與 u 首次分離的重心（或 u 所在最深重心）恰貢獻一次，距離可經重心相加。
complexity:
  time: 預處理 O(n log^2 n)，每次詢問 O(log^2 n)
  space: O(n log n)
common_errors:
  - 強制在線解密在交換 L、R 之後才取模
  - 只存距離前綴和，忘記 count×dist(u,center)
  - 扣除分支時使用另一個重心的距離
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,q,mod;cin>>n>>q>>mod;/* TODO：點分桶、年齡排序與容斥查詢。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to;long long weight;};
  struct Relation{int center,branch;long long distance;};
  struct Bucket{vector<pair<int,long long>>items;vector<int>ages;vector<long long>prefix;void build(){sort(items.begin(),items.end());ages.reserve(items.size());prefix.assign(items.size()+1,0);for(size_t i=0;i<items.size();++i){ages.push_back(items[i].first);prefix[i+1]=prefix[i]+items[i].second;}}pair<long long,long long>query(int left,int right)const{size_t first=static_cast<size_t>(lower_bound(ages.begin(),ages.end(),left)-ages.begin()),last=static_cast<size_t>(upper_bound(ages.begin(),ages.end(),right)-ages.begin());return {static_cast<long long>(last-first),prefix[last]-prefix[first]};}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,query_count,age_modulus;cin>>n>>query_count>>age_modulus;vector<int>age(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>age[static_cast<size_t>(i)];vector<vector<Edge>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){long long weight;cin>>u>>v>>weight;graph[static_cast<size_t>(u)].push_back({v,weight});graph[static_cast<size_t>(v)].push_back({u,weight});}vector<int>subtree(static_cast<size_t>(n+1));vector<char>removed(static_cast<size_t>(n+1));vector<vector<Relation>>relations(static_cast<size_t>(n+1));int branch_count=0;function<int(int,int)>measure=[&](int node,int parent){subtree[static_cast<size_t>(node)]=1;for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)subtree[static_cast<size_t>(node)]+=measure(edge.to,node);return subtree[static_cast<size_t>(node)];};function<int(int,int,int)>centroid=[&](int node,int parent,int total){for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0&&subtree[static_cast<size_t>(edge.to)]>total/2)return centroid(edge.to,node,total);return node;};function<void(int,int,long long,int,int)>attach=[&](int node,int parent,long long distance,int center,int branch){relations[static_cast<size_t>(node)].push_back({center,branch,distance});for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)attach(edge.to,node,distance+edge.weight,center,branch);};function<void(int)>decompose=[&](int start){int center=centroid(start,0,measure(start,0));relations[static_cast<size_t>(center)].push_back({center,-1,0});for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0){int branch=branch_count++;attach(edge.to,center,edge.weight,center,branch);}removed[static_cast<size_t>(center)]=1;for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0)decompose(edge.to);};decompose(1);vector<Bucket>center_bucket(static_cast<size_t>(n+1)),branch_bucket(static_cast<size_t>(branch_count));for(int node=1;node<=n;++node)for(const Relation&relation:relations[static_cast<size_t>(node)]){center_bucket[static_cast<size_t>(relation.center)].items.push_back({age[static_cast<size_t>(node)],relation.distance});if(relation.branch>=0)branch_bucket[static_cast<size_t>(relation.branch)].items.push_back({age[static_cast<size_t>(node)],relation.distance});}for(Bucket&bucket:center_bucket)bucket.build();for(Bucket&bucket:branch_bucket)bucket.build();auto query=[&](int node,int left,int right){long long result=0;for(const Relation&relation:relations[static_cast<size_t>(node)]){auto [count,sum]=center_bucket[static_cast<size_t>(relation.center)].query(left,right);result+=sum+count*relation.distance;if(relation.branch>=0){tie(count,sum)=branch_bucket[static_cast<size_t>(relation.branch)].query(left,right);result-=sum+count*relation.distance;}}return result;};long long last_answer=0;while(query_count--){int node;long long encoded_left,encoded_right;cin>>node>>encoded_left>>encoded_right;int left=static_cast<int>((encoded_left+last_answer)%age_modulus),right=static_cast<int>((encoded_right+last_answer)%age_modulus);if(left>right)swap(left,right);last_answer=query(node,left,right);cout<<last_answer<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P3241
external_platform: 洛谷
external_problem_id: P3241
external_title: '[HNOI2015] 开店'
---

靜態屬性篩選與點分距離容斥可以分離：每個點分桶先依年齡排序，查詢時只需二分切出所需區間。
