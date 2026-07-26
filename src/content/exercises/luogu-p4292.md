---
id: luogu-p4292
volume: upper
source_file: upper-volume
source_book_pages: [253]
source_pdf_pages: [271]
chapter: 4
section: '4.9'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P4292 重建計畫：分數規劃與點分治
difficulty: 5
topics: [二分答案, 點分治, 單調佇列, 最大平均值]
prerequisites: [tree-centroid]
statement: 帶正權樹上選一條邊數介於 L 與 U 的簡單路徑，使路徑邊權平均值最大，輸出三位小數。
constraints:
  - '1 <= n <= 100000'
  - '1 <= L <= U <= n-1'
  - '1 <= edge_value <= 1000000'
  - 保證存在合法路徑
input_format: 第一行 n；第二行 L、U；接著 n-1 行 u、v、value。
output_format: 最大平均值，保留小數點後三位。
samples:
  - input: |
      4
      2 3
      1 2 2
      1 3 3
      1 4 2
    output: |
      2.500
    explanation: 選路徑 2—1—3，兩條邊平均值為 (2+3)/2=2.5。
core_knowledge: [parametric_search, transformed_edge_weight, centroid_path_merge, sliding_window_max]
judgment: 猜平均值 mid 後把每邊改成 value-mid；存在長度 [L,U] 且總和非負的路徑，等價於真正最大平均值至少 mid。
hints:
  - 先建立點分治各層資料；每個重心分支按深度記錄原始路徑和最大值。
  - 判定時，深度 d 的轉換值是 original_sum-mid×d；與先前分支深度 t 配對，需 t∈[L-d,U-d]。
  - 分支按最大深度遞增處理；對每個分支由深到淺掃描，合法 t 區間單調右移，可用 deque 維護先前深度陣列的區間最大值。
solution_outline: 預先點分解並壓縮每分支各深度最大原始和。二分平均值，每次在線性於點分資料量的判定中，以單調佇列合併不同分支。
proof_or_invariant: 轉權後路徑和等於路徑長乘「該路徑平均值-mid」，故非負判定充要。每條路徑在點分治首次分離重心由兩個不同分支記錄合併；滑動窗口恰枚舉所有合法互補深度。
complexity:
  time: O(n log n log(value_range/precision))
  space: O(n log n)
common_errors:
  - 二分判定仍用原始和而未減 mid×depth
  - 同一分支資料在查詢前就併入 best
  - deque 掃描方向與合法深度區間移動方向不一致
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,l,u;cin>>n>>l>>u;/* TODO：預建點分資料、二分與單調佇列判定。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to;long long value;};
  struct Unit{vector<vector<long long>>groups;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,minimum_length,maximum_length;cin>>n;cin>>minimum_length>>maximum_length;vector<vector<Edge>>graph(static_cast<size_t>(n+1));long long minimum_value=numeric_limits<long long>::max(),maximum_value=0;for(int i=1,u,v;i<n;++i){long long value;cin>>u>>v>>value;minimum_value=min(minimum_value,value);maximum_value=max(maximum_value,value);graph[static_cast<size_t>(u)].push_back({v,value});graph[static_cast<size_t>(v)].push_back({u,value});}vector<int>subtree(static_cast<size_t>(n+1));vector<char>removed(static_cast<size_t>(n+1));vector<Unit>units;function<int(int,int)>measure=[&](int node,int parent){subtree[static_cast<size_t>(node)]=1;for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)subtree[static_cast<size_t>(node)]+=measure(edge.to,node);return subtree[static_cast<size_t>(node)];};function<int(int,int,int)>centroid=[&](int node,int parent,int total){for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0&&subtree[static_cast<size_t>(edge.to)]>total/2)return centroid(edge.to,node,total);return node;};function<void(int,int,int,long long,vector<long long>&)>collect=[&](int node,int parent,int depth,long long sum,vector<long long>&group){if(depth>maximum_length)return;if(group.size()<=static_cast<size_t>(depth))group.resize(static_cast<size_t>(depth+1),numeric_limits<long long>::lowest()/4);group[static_cast<size_t>(depth)]=max(group[static_cast<size_t>(depth)],sum);for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)collect(edge.to,node,depth+1,sum+edge.value,group);};function<void(int)>decompose=[&](int start){int center=centroid(start,0,measure(start,0));Unit unit;for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0){vector<long long>group(1,numeric_limits<long long>::lowest()/4);collect(edge.to,center,1,edge.value,group);unit.groups.push_back(move(group));}sort(unit.groups.begin(),unit.groups.end(),[](const vector<long long>&a,const vector<long long>&b){return a.size()<b.size();});units.push_back(move(unit));removed[static_cast<size_t>(center)]=1;for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0)decompose(edge.to);};decompose(1);auto feasible=[&](double average){const double negative=-1e100;for(const Unit&unit:units){vector<double>best(1,0.0);for(const vector<long long>&group:unit.groups){deque<int>window;int added=-1;for(int depth=static_cast<int>(group.size())-1;depth>=1;--depth){if(group[static_cast<size_t>(depth)]<=numeric_limits<long long>::lowest()/8)continue;int left=max(0,minimum_length-depth),right=min(static_cast<int>(best.size())-1,maximum_length-depth);if(left>right)continue;while(added<right){++added;while(!window.empty()&&best[static_cast<size_t>(window.back())]<=best[static_cast<size_t>(added)])window.pop_back();window.push_back(added);}while(!window.empty()&&window.front()<left)window.pop_front();double current=static_cast<double>(group[static_cast<size_t>(depth)])-average*depth;if(!window.empty()&&current+best[static_cast<size_t>(window.front())]>=0.0)return true;}if(best.size()<group.size())best.resize(group.size(),negative);for(size_t depth=1;depth<group.size();++depth)if(group[depth]>numeric_limits<long long>::lowest()/8)best[depth]=max(best[depth],static_cast<double>(group[depth])-average*static_cast<double>(depth));}}return false;};double low=static_cast<double>(minimum_value),high=static_cast<double>(maximum_value);for(int iteration=0;iteration<45;++iteration){double middle=(low+high)/2.0;if(feasible(middle))low=middle;else high=middle;}cout<<fixed<<setprecision(3)<<low<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4292
external_platform: 洛谷
external_problem_id: P4292
external_title: '[WC2010] 重建计划'
---

分數規劃把平均值最佳化轉成加總判定；真正的難點轉為在點分治中快速找長度落於區間的兩段最大和。
