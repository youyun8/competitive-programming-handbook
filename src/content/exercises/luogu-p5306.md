---
id: luogu-p5306
volume: upper
source_file: upper-volume
source_book_pages: [253]
source_pdf_pages: [271]
chapter: 4
section: '4.9'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P5306 Transport：有向可行路徑點分治
difficulty: 5
topics: [點分治, 路徑前綴限制, 有序點對, 二分計數]
prerequisites: [tree-centroid]
statement: 帶權樹每城有可取得的燃料，卡車油箱初始為 0、容量無限，抵達城市可取得不超過該城存量的燃料，每公里耗一單位。統計 u≠v 且卡車可沿唯一簡單路徑由 u 到 v 的有序點對。
constraints:
  - '1 <= n <= 100000'
  - '1 <= fuel_i,edge_weight <= 10^9'
  - 答案需使用 64 位元
input_format: 第一行 n；第二行 n 個燃料量；接著 n-1 行 u、v、distance。
output_format: 一個整數，可行有序點對數。
samples:
  - input: |
      2
      3 1
      1 2 2
    output: |
      1
    explanation: 1 號城可加 3 單位並駛到 2；2 號城只有 1 單位，無法反向行駛 2 公里。
core_knowledge: [上行剩餘油量, 下行最低初始油量, centroid_inclusion_exclusion, ordered_pairs]
judgment: 經過重心的有向路徑可拆成「起點到重心可行且剩餘 leftover」與「重心到終點需要 need」；拼接充要條件為 leftover>=need。
hints:
  - 對重心到節點路徑令 b_i=fuel_i-edge_i；反向走到重心可行，等價於總 balance 不小於此前最大前綴 balance。
  - 正向由重心走到節點所需初始油量，是各前綴的 distance-before-next-edge 減去途中已取得燃料的最大值。
  - 收集每點的可行 leftover 與 need，排序 leftover 計數 >=need；用 calc(all)-Σcalc(child)，再扣掉重心自身對。
solution_outline: 點分治。每個重心 DFS 計算各節點向重心的可行剩餘油與重心向節點的最低需求；二分計有序拼接，容斥扣同子樹後遞迴。
proof_or_invariant: 上行的所有後綴油量非負條件由 balance 與最大前綴精確表示；下行 need 是所有行駛前油量約束的最大值。不同重心分支的唯一路徑經重心，故 leftover>=need 充要。點分容斥令每個 u≠v 有序對恰計一次。
complexity:
  time: O(n log^2 n)
  space: O(n)
common_errors:
  - 把有向點對當無序點對乘二；兩方向可行性不同
  - 在重心燃料同時於上行與下行各加一次
  - 忘記排除 (center,center) 自己到自己
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;/* TODO：點分治，維護 leftover 與 need。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to;long long weight;};
  struct Record{long long need,leftover;bool valid_start;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<long long>fuel(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>fuel[static_cast<size_t>(i)];vector<vector<Edge>>graph(static_cast<size_t>(n+1));for(int i=1,u,v;i<n;++i){long long weight;cin>>u>>v>>weight;graph[static_cast<size_t>(u)].push_back({v,weight});graph[static_cast<size_t>(v)].push_back({u,weight});}vector<int>subtree(static_cast<size_t>(n+1));vector<char>removed(static_cast<size_t>(n+1));function<int(int,int)>measure=[&](int node,int parent){subtree[static_cast<size_t>(node)]=1;for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)subtree[static_cast<size_t>(node)]+=measure(edge.to,node);return subtree[static_cast<size_t>(node)];};function<int(int,int,int)>centroid=[&](int node,int parent,int total){for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0&&subtree[static_cast<size_t>(edge.to)]>total/2)return centroid(edge.to,node,total);return node;};function<void(int,int,long long,long long,long long,long long,long long,long long,vector<Record>&)>collect=[&](int node,int parent,long long edge_weight,long long distance_parent,long long gain_parent,long long balance_parent,long long max_prefix,long long need_parent,vector<Record>&records){long long distance=distance_parent+edge_weight;long long balance=balance_parent+fuel[static_cast<size_t>(node)]-edge_weight;long long need=max(need_parent,distance-gain_parent);bool valid=balance>=max_prefix;records.push_back({need,balance,valid});long long next_prefix=max(max_prefix,balance),next_gain=gain_parent+fuel[static_cast<size_t>(node)];for(Edge edge:graph[static_cast<size_t>(node)])if(edge.to!=parent&&removed[static_cast<size_t>(edge.to)]==0)collect(edge.to,node,edge.weight,distance,next_gain,balance,next_prefix,need,records);};auto count_pairs=[](const vector<Record>&records,long long center_fuel){vector<long long>leftovers;leftovers.reserve(records.size());for(const Record&record:records)if(record.valid_start)leftovers.push_back(center_fuel+record.leftover);sort(leftovers.begin(),leftovers.end());long long result=0;for(const Record&record:records)result+=static_cast<long long>(leftovers.end()-lower_bound(leftovers.begin(),leftovers.end(),record.need));return result;};long long answer=0;function<void(int)>decompose=[&](int start){int center=centroid(start,0,measure(start,0));vector<Record>all{{0,0,true}};for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0){vector<Record>part;collect(edge.to,center,edge.weight,0,0,0,0,0,part);answer-=count_pairs(part,fuel[static_cast<size_t>(center)]);all.insert(all.end(),part.begin(),part.end());}answer+=count_pairs(all,fuel[static_cast<size_t>(center)])-1;removed[static_cast<size_t>(center)]=1;for(Edge edge:graph[static_cast<size_t>(center)])if(removed[static_cast<size_t>(edge.to)]==0)decompose(edge.to);};decompose(1);cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P5306
external_platform: 洛谷
external_problem_id: P5306
external_title: '[COCI2018/2019#5] Transport'
---

有向路徑雖不能用對稱距離直接計數，仍可在重心切成「可供應量」與「最低需求量」兩個可比較摘要。
