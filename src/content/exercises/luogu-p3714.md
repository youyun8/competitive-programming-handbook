---
id: luogu-p3714
volume: upper
source_file: upper-volume
source_book_pages: [253]
source_pdf_pages: [271]
chapter: 4
section: '4.9'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P3714 樹的難題：彩色段權點分治
difficulty: 5
topics: [點分治, 路徑合併, 線段樹, 顏色分組]
prerequisites: [tree-centroid, segment-tree]
statement: 樹邊有顏色，每種顏色有可正可負的權值。路徑顏色序列切成極大同色段，路徑權值為各段顏色權值之和。求邊數在 [L,R] 的簡單路徑最大權值。
constraints:
  - '1 <= n,m <= 200000'
  - '1 <= L <= R <= n-1'
  - '|color_weight_i| <= 10000'
  - 保證存在合法長度路徑
input_format: 第一行 n、m、L、R；第二行 m 個顏色權值；接著 n-1 行 u、v、color。
output_format: 一個整數，合法路徑的最大權值。
samples:
  - input: |
      4 2 1 3
      5 -2
      1 2 1
      2 3 1
      2 4 2
    output: |
      5
    explanation: 路徑 1—2—3 雖有兩條邊但只有一個顏色 1 段，權值為 5。
core_knowledge: [centroid_path_records, first_edge_color, same_color_join_correction, depth_range_max]
judgment: 經重心拼接兩條路徑時，權值通常相加；若兩側靠重心的第一條邊同色，兩段其實合成一段，需扣除一次該色權值。
hints:
  - 收集每個重心分支內 (depth,path_value)，其中 path_value 只在沿路顏色改變時增加新色權。
  - 將重心分支依第一邊顏色排序；維護「較早顏色」與「目前同色」兩棵以深度為索引的區間最大值樹。
  - 對深度 d 查 [L-d,R-d]；異色直接相加，同色答案再減 color_weight。整個分支查完後才插入，避免同子樹配對。
solution_outline: 點分治。每個重心按首邊顏色分組處理分支，以兩棵線段樹合併合法深度路徑；同色組結束後併入全域樹，再遞迴各分量。
proof_or_invariant: 每條跨重心路徑由不同分支兩筆記錄唯一組成，深度和限制由區間查詢完整枚舉；首色同異兩種公式精確計算段權。點分治使任一路徑在端點首次分離的重心被計一次。
complexity:
  time: O(n log^2 n)
  space: O(n)
common_errors:
  - 同色拼接未扣一次顏色權值
  - 邊權可負卻把線段樹初值設為 0
  - 查詢同分支已插入資料，產生不經重心的非法路徑
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m,l,r;cin>>n>>m>>l>>r;/* TODO：點分治、按首色分組與深度區間最大值。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  constexpr long long negative_infinity=numeric_limits<long long>::lowest()/4;
  struct Edge{int to,color;};
  struct SegmentTree{int base;vector<long long>tree;explicit SegmentTree(int n):base(1){while(base<=n)base*=2;tree.assign(static_cast<size_t>(2*base),negative_infinity);}void set_value(int position,long long value){int index=base+position;tree[static_cast<size_t>(index)]=value;for(index/=2;index>0;index/=2)tree[static_cast<size_t>(index)]=max(tree[static_cast<size_t>(2*index)],tree[static_cast<size_t>(2*index+1)]);}void maximize(int position,long long value){int index=base+position;if(tree[static_cast<size_t>(index)]>=value)return;set_value(position,value);}long long get(int position)const{return tree[static_cast<size_t>(base+position)];}long long query(int left,int right)const{if(left>right)return negative_infinity;left+=base;right+=base;long long result=negative_infinity;while(left<=right){if((left&1)!=0)result=max(result,tree[static_cast<size_t>(left++)]);if((right&1)==0)result=max(result,tree[static_cast<size_t>(right--)]);left/=2;right/=2;}return result;}};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,color_count,minimum_length,maximum_length;cin>>n>>color_count>>minimum_length>>maximum_length;vector<long long>color_weight(static_cast<size_t>(color_count+1));for(int i=1;i<=color_count;++i)cin>>color_weight[static_cast<size_t>(i)];vector<vector<Edge>>graph(static_cast<size_t>(n+1));for(int i=1,u,v,color;i<n;++i){cin>>u>>v>>color;graph[static_cast<size_t>(u)].push_back({v,color});graph[static_cast<size_t>(v)].push_back({u,color});}vector<int>subtree(static_cast<size_t>(n+1));vector<char>removed(static_cast<size_t>(n+1)),global_active(static_cast<size_t>(maximum_length+1)),same_active(static_cast<size_t>(maximum_length+1));function<int(int,int)>measure=[&](int node,int parent){subtree[static_cast<size_t>(node)]=1;for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)subtree[static_cast<size_t>(node)]+=measure(edge.to,node);return subtree[static_cast<size_t>(node)];};function<int(int,int,int)>centroid=[&](int node,int parent,int total){for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0&&subtree[static_cast<size_t>(edge.to)]>total/2)return centroid(edge.to,node,total);return node;};function<void(int,int,int,int,long long,vector<pair<int,long long>>&)>collect=[&](int node,int parent,int depth,int previous_color,long long value,vector<pair<int,long long>>&records){if(depth>maximum_length)return;records.push_back({depth,value});for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)collect(edge.to,node,depth+1,edge.color,value+(edge.color==previous_color?0:color_weight[static_cast<size_t>(edge.color)]),records);};SegmentTree global_tree(maximum_length),same_tree(maximum_length);long long answer=negative_infinity;function<void(int)>decompose=[&](int start){int center=centroid(start,0,measure(start,0));vector<Edge>branches;for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0)branches.push_back(edge);sort(branches.begin(),branches.end(),[](const Edge&a,const Edge&b){return a.color<b.color;});vector<int>global_touched;size_t begin=0;while(begin<branches.size()){size_t end=begin;while(end<branches.size()&&branches[end].color==branches[begin].color)++end;vector<int>same_touched;for(size_t index=begin;index<end;++index){vector<pair<int,long long>>records;collect(branches[index].to,center,1,branches[index].color,color_weight[static_cast<size_t>(branches[index].color)],records);for(auto [depth,value]:records){if(depth>=minimum_length)answer=max(answer,value);int left=max(0,minimum_length-depth),right=min(maximum_length,maximum_length-depth);long long other=global_tree.query(left,right);if(other!=negative_infinity)answer=max(answer,value+other);long long equal=same_tree.query(left,right);if(equal!=negative_infinity)answer=max(answer,value+equal-color_weight[static_cast<size_t>(branches[index].color)]);}sort(records.begin(),records.end());for(size_t i=0;i<records.size();){size_t j=i;long long best=negative_infinity;while(j<records.size()&&records[j].first==records[i].first)best=max(best,records[j++].second);int depth=records[i].first;if(same_active[static_cast<size_t>(depth)]==0){same_active[static_cast<size_t>(depth)]=1;same_touched.push_back(depth);}same_tree.maximize(depth,best);i=j;}}for(int depth:same_touched){if(global_active[static_cast<size_t>(depth)]==0){global_active[static_cast<size_t>(depth)]=1;global_touched.push_back(depth);}global_tree.maximize(depth,same_tree.get(depth));same_tree.set_value(depth,negative_infinity);same_active[static_cast<size_t>(depth)]=0;}begin=end;}for(int depth:global_touched){global_tree.set_value(depth,negative_infinity);global_active[static_cast<size_t>(depth)]=0;}removed[static_cast<size_t>(center)]=1;for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0)decompose(edge.to);};decompose(1);cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3714
external_platform: 洛谷
external_problem_id: P3714
external_title: '[BJOI2017] 树的难题'
---

路徑摘要除了長度與權值，還需保留靠近拼接點的首色；這個一位狀態正好決定是否要合併同色段。
