---
id: luogu-p2664
volume: upper
source_file: upper-volume
source_book_pages: [253]
source_pdf_pages: [271]
chapter: 4
section: '4.9'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P2664 樹上遊戲：點分治統計路徑顏色
difficulty: 5
topics: [點分治, 路徑顏色聯集, 首次出現貢獻, 子樹容斥]
prerequisites: [tree-centroid]
statement: 樹上每點有顏色，s(i,j) 為 i 到 j 路徑上的不同顏色數。對每個 i，求 sum_i=Σ_j s(i,j)。
constraints:
  - '1 <= n <= 100000'
  - '1 <= color_i <= 100000'
  - 答案需使用 64 位元
input_format: 第一行 n；第二行 n 個節點顏色；接著 n-1 行無向邊。
output_format: 共 n 行，第 i 行輸出 sum_i。
samples:
  - input: |
      3
      1 2 1
      1 2
      2 3
    output: |
      5
      5
      5
    explanation: 每個起點到自身、相鄰／遠端三條路徑的不同顏色數總和皆為 1+2+2=5。
core_knowledge: [centroid_path_union, first_color_occurrence, subtree_size_contribution, per_child_exclusion]
judgment: 固定重心後，顏色 c 對「重心到終點」路徑的出現次數，可由每條根路徑上 c 的首次出現節點子樹大小總和線性求出。
hints:
  - 以重心為根；若節點 x 是顏色 c 在該根路徑首次出現處，則 c 對 subtree_size[x] 個終點路徑有貢獻。
  - 對起點 u 的重心路徑顏色集合 A，跨子樹終點貢獻為 outside_sum+|A|×outside_count-Σ_{c∈A}outside_occ[c]。
  - 分別求全分量 total_occ 與 u 所在兒子分量 child_occ，相減得到 outside_occ；處理跨重心路徑後遞迴各分量。
solution_outline: 每層點分治重新以重心求子樹大小；用首次顏色出現累加 total_occ。逐兒子建立 child_occ，DFS 維護起點到重心顏色集合並套聯集公式更新答案。
proof_or_invariant: occ[c] 精確等於候選終點中路徑含 c 的數量。聯集公式對每個終點計算 |A_u∪A_v|；扣掉同兒子終點後只留下路徑經重心者。每個有序點對在首次分離重心恰處理一次，自身對在節點成為重心時計入。
complexity:
  time: O(n log n)
  space: O(n)
common_errors:
  - 把顏色出現節點數當成含該色的路徑數
  - 子分量沒有先包含重心顏色
  - 清空顏色陣列時遍歷整個值域，退化為 O(n log n+value_range·n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;/* TODO：點分治、首次顏色貢獻與聯集公式。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>color(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>color[static_cast<size_t>(i)];vector<vector<int>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){cin>>u>>v;graph[static_cast<size_t>(u)].push_back(v);graph[static_cast<size_t>(v)].push_back(u);}vector<int>subtree(static_cast<size_t>(n+1)),frequency(static_cast<size_t>(100001));vector<char>removed(static_cast<size_t>(n+1));vector<long long>answer(static_cast<size_t>(n+1)),total_occ(static_cast<size_t>(100001)),child_occ(static_cast<size_t>(100001));function<int(int,int)>measure=[&](int node,int parent){subtree[static_cast<size_t>(node)]=1;for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0)subtree[static_cast<size_t>(node)]+=measure(next,node);return subtree[static_cast<size_t>(node)];};function<int(int,int,int)>centroid=[&](int node,int parent,int total){for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0&&subtree[static_cast<size_t>(next)]>total/2)return centroid(next,node,total);return node;};function<void(int,int,vector<long long>&,vector<int>&)>build_occ=[&](int node,int parent,vector<long long>&occ,vector<int>&touched){int current=color[static_cast<size_t>(node)];if(frequency[static_cast<size_t>(current)]++==0){if(occ[static_cast<size_t>(current)]==0)touched.push_back(current);occ[static_cast<size_t>(current)]+=subtree[static_cast<size_t>(node)];}for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0)build_occ(next,node,occ,touched);--frequency[static_cast<size_t>(current)];};function<void(int,int,long long,long long,int,long long)>apply=[&](int node,int parent,long long outside_sum,long long outside_count,int distinct,long long selected){int current=color[static_cast<size_t>(node)];bool first=frequency[static_cast<size_t>(current)]++==0;if(first){++distinct;selected+=total_occ[static_cast<size_t>(current)]-child_occ[static_cast<size_t>(current)];}answer[static_cast<size_t>(node)]+=outside_sum+static_cast<long long>(distinct)*outside_count-selected;for(int next:graph[static_cast<size_t>(node)])if(next!=parent&&removed[static_cast<size_t>(next)]==0)apply(next,node,outside_sum,outside_count,distinct,selected);--frequency[static_cast<size_t>(current)];};function<void(int)>decompose=[&](int start){int center=centroid(start,0,measure(start,0));int total_size=measure(center,0),center_color=color[static_cast<size_t>(center)];vector<int>total_touched;total_occ[static_cast<size_t>(center_color)]=total_size;total_touched.push_back(center_color);frequency[static_cast<size_t>(center_color)]=1;for(int next:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(next)]==0)build_occ(next,center,total_occ,total_touched);frequency[static_cast<size_t>(center_color)]=0;long long total_sum=0;for(int current:total_touched)total_sum+=total_occ[static_cast<size_t>(current)];answer[static_cast<size_t>(center)]+=total_sum;for(int next:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(next)]==0){vector<int>child_touched;child_occ[static_cast<size_t>(center_color)]=subtree[static_cast<size_t>(next)];child_touched.push_back(center_color);frequency[static_cast<size_t>(center_color)]=1;build_occ(next,center,child_occ,child_touched);frequency[static_cast<size_t>(center_color)]=0;long long child_sum=0;for(int current:child_touched)child_sum+=child_occ[static_cast<size_t>(current)];long long outside_sum=total_sum-child_sum,outside_count=total_size-subtree[static_cast<size_t>(next)];frequency[static_cast<size_t>(center_color)]=1;apply(next,center,outside_sum,outside_count,1,total_occ[static_cast<size_t>(center_color)]-child_occ[static_cast<size_t>(center_color)]);frequency[static_cast<size_t>(center_color)]=0;for(int current:child_touched)child_occ[static_cast<size_t>(current)]=0;}for(int current:total_touched)total_occ[static_cast<size_t>(current)]=0;removed[static_cast<size_t>(center)]=1;for(int next:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(next)]==0)decompose(next);};decompose(1);for(int node=1;node<=n;++node)cout<<answer[static_cast<size_t>(node)]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2664
external_platform: 洛谷
external_problem_id: P2664
external_title: 树上游戏
---

「某色出現在多少條根路徑」不是逐路徑計數；只要把每條路徑的首次出現位置所覆蓋子樹大小相加即可。
