---
id: luogu-p2680
volume: upper
source_file: upper-volume
source_book_pages: [244]
source_pdf_pages: [262]
chapter: 4
section: '4.8'
kind: external-oj
review_status: verified
external_relation: original
title: 洛谷 P2680 運輸計畫：二分答案與樹上差分
difficulty: 5
topics: [二分答案, LCA, 樹上差分, 路徑交]
prerequisites: [lowest-common-ancestor]
statement: 帶權樹上有 m 條運輸路徑。可以把恰一條樹邊的權重改為 0，求操作後所有運輸路徑長度最大值的最小可能值。
constraints:
  - '2 <= n,m <= 300000'
  - '1 <= edge_weight <= 1000'
  - 路徑端點可相同
input_format: 第一行 n、m；接著 n-1 行 u、v、w；再接 m 行運輸路徑端點。
output_format: 一個整數，最佳化後的最長運輸時間。
samples:
  - input: |
      4 2
      1 2 3
      2 3 4
      2 4 2
      1 3
      1 4
    output: |
      4
    explanation: 將邊 1—2 的權重 3 改為 0，兩條路徑長分別為 4、2，故最大值可降至 4。
core_knowledge: [path_length_lca, bad_path_intersection, edge_difference, binary_search]
judgment: 給定上限 X，所有原長度超過 X 的路徑都必須包含同一條被清零邊，且該邊權至少補足最長路徑超額。
hints:
  - 預處理每條計畫長度與 LCA，二分最終最大值 X。
  - 對 length>X 的路徑做邊版差分：delta[u]++、delta[v]++、delta[lca]-=2。
  - 後序累加後，delta[child] 等於通過 parent—child 的壞路徑數；找一條被全部壞路徑通過且 weight>=max_length-X 的邊。
solution_outline: LCA 求所有路徑長；二分 X，每次用樹上差分計算壞路徑共同邊，判斷是否有足夠重的共同邊可清零。
proof_or_invariant: 若最長路徑降至 X，每條壞路徑必含被操作邊；反之若共同邊權至少 max_length-X，清零後所有壞路徑長最多 X，原本不壞者也不會變長，故判定充要。
complexity:
  time: O((n+m)log n+(n+m)log total_weight)
  space: O(n log n+m)
common_errors:
  - 節點差分多減 parent[lca]；本題統計的是邊
  - 只找共同邊，未檢查其權重是否足以消去超額
  - 每次二分重新求 LCA 而多出不必要成本
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;/* TODO：LCA 預處理、二分與壞路徑差分。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Plan{int first,second,ancestor;long long length;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<vector<pair<int,int>>>graph(static_cast<size_t>(n+1));for(int i=1,u,v,w;i<n;++i){cin>>u>>v>>w;graph[static_cast<size_t>(u)].push_back({v,w});graph[static_cast<size_t>(v)].push_back({u,w});}int levels=1;while((1<<levels)<=n)++levels;vector<vector<int>>up(static_cast<size_t>(levels),vector<int>(static_cast<size_t>(n+1)));vector<int>depth(static_cast<size_t>(n+1)),parent_weight(static_cast<size_t>(n+1)),order{1};vector<long long>distance(static_cast<size_t>(n+1));for(size_t i=0;i<order.size();++i){int node=order[i];for(auto [next,weight]:graph[static_cast<size_t>(node)])if(next!=up[0][static_cast<size_t>(node)]){up[0][static_cast<size_t>(next)]=node;parent_weight[static_cast<size_t>(next)]=weight;depth[static_cast<size_t>(next)]=depth[static_cast<size_t>(node)]+1;distance[static_cast<size_t>(next)]=distance[static_cast<size_t>(node)]+weight;for(int bit=1;bit<levels;++bit)up[static_cast<size_t>(bit)][static_cast<size_t>(next)]=up[static_cast<size_t>(bit-1)][static_cast<size_t>(up[static_cast<size_t>(bit-1)][static_cast<size_t>(next)])];order.push_back(next);}}auto lca=[&](int x,int y){if(depth[static_cast<size_t>(x)]<depth[static_cast<size_t>(y)])swap(x,y);int difference=depth[static_cast<size_t>(x)]-depth[static_cast<size_t>(y)];for(int bit=0;bit<levels;++bit)if(((difference>>bit)&1)!=0)x=up[static_cast<size_t>(bit)][static_cast<size_t>(x)];if(x==y)return x;for(int bit=levels-1;bit>=0;--bit)if(up[static_cast<size_t>(bit)][static_cast<size_t>(x)]!=up[static_cast<size_t>(bit)][static_cast<size_t>(y)]){x=up[static_cast<size_t>(bit)][static_cast<size_t>(x)];y=up[static_cast<size_t>(bit)][static_cast<size_t>(y)];}return up[0][static_cast<size_t>(x)];};vector<Plan>plans(static_cast<size_t>(m));long long maximum_length=0;for(Plan&plan:plans){cin>>plan.first>>plan.second;plan.ancestor=lca(plan.first,plan.second);plan.length=distance[static_cast<size_t>(plan.first)]+distance[static_cast<size_t>(plan.second)]-2*distance[static_cast<size_t>(plan.ancestor)];maximum_length=max(maximum_length,plan.length);}auto feasible=[&](long long target){vector<int>delta(static_cast<size_t>(n+1));int bad_count=0;for(const Plan&plan:plans)if(plan.length>target){++bad_count;++delta[static_cast<size_t>(plan.first)];++delta[static_cast<size_t>(plan.second)];delta[static_cast<size_t>(plan.ancestor)]-=2;}if(bad_count==0)return true;bool found=false;for(auto iterator=order.rbegin();iterator!=order.rend();++iterator){int node=*iterator;if(node!=1&&delta[static_cast<size_t>(node)]==bad_count&&static_cast<long long>(parent_weight[static_cast<size_t>(node)])>=maximum_length-target)found=true;delta[static_cast<size_t>(up[0][static_cast<size_t>(node)])]+=delta[static_cast<size_t>(node)];}return found;};long long low=0,high=maximum_length;while(low<high){long long middle=(low+high)/2;if(feasible(middle))high=middle;else low=middle+1;}cout<<low<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2680
external_platform: 洛谷
external_problem_id: P2680
external_title: '[NOIP2015 提高组] 运输计划'
---

二分把最佳化問題變成「所有過長路徑是否有足夠重的公共邊」，而樹上差分能線性求出這個路徑交集。
