---
id: luogu-p4926
volume: lower
source_file: lower-volume
original_label: 洛谷 P4926
title: 洛谷 P4926 倍殺測量者：對數差分約束與二分
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 5
topics: [差分約束, 二分答案, 對數]
prerequisites: [dijkstra]
core_knowledge: [乘法轉加法, 固定值雙向限制, 正環判無解]
judgment: 假設沒有人違反 Flag 可得到一組乘法不等式；該系統無解就保證至少一人觸發。
statement: 選手分數為正實數，給多個倍殺 Flag 與部分已知分數；求最大正實數 T，使無論未知分數如何，都必有至少一個 Flag 被觸發。
constraints: ['倍數 k <= 10', '答案容許絕對誤差 1e-4', '所有分數為正']
input_format: 第一行 n、Flag 數 s、已知分數數 t；s 行給類型 o、A、B、k；t 行給選手 C 與固定分數 x。
output_format: 輸出最大的 T；不存在正 T 時輸出 -1。
samples:
  - input: |-
      3 5 1
      1 2 1 2
      1 3 2 2
      1 3 1 4
      2 1 2 2
      2 1 3 4
      1 1
    output: '-1'
    explanation: 即使 T 趨近 0，也能選擇分數使所有放寬後的 Flag 都不觸發，因此無法保證有人觸發。
hints:
  - 令 y_i=log(score_i)，倍數限制就轉成 y_A≥y_B+常數。
  - 類型 1 的常數是 log(k-T)，類型 2 是 -log(k+T)；固定分數用兩條反向邊鎖定。
  - 假設所有人都不觸發所得系統出現正環即無解；此性質對 T 單調，可二分邊界。
solution_outline: 儲存 Flag；給定 T 時建最長路差分約束圖並以 SPFA 判正環。若 T=0 仍可行輸出 -1，否則在 0 與所有類型 1 的最小 k 間二分最大無解 T。
proof_or_invariant: 對數嚴格單調，故每條乘法限制與建圖的加法限制等價；固定分數兩向不等式合成等式。差分系統無解當且僅當下界圖有正環。T 增大會放寬所有不觸發條件，因此無解區間是前綴，二分端點即所求。
complexity: { time: 'O(80ns) 最壞', space: 'O(n+s+t)' }
common_errors: [類型 2 忘記取倒數而符號錯誤, 在 k-T<=0 時仍取對數, 把有正環解讀成存在分數解]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,s,t;cin>>n>>s>>t;/* TODO：二分 T，以對數差分約束判無解。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Flag{int type,a,b;double k;};
  struct Edge{int to;double weight;};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,s,t;if(!(cin>>n>>s>>t))return 0;vector<Flag> flags(static_cast<size_t>(s));double upper=10;for(Flag& flag:flags){cin>>flag.type>>flag.a>>flag.b>>flag.k;if(flag.type==1)upper=min(upper,flag.k);}vector<pair<int,double>> known(static_cast<size_t>(t));for(auto& [person,score]:known)cin>>person>>score;
      auto impossible=[&](double tolerance){vector<vector<Edge>> graph(static_cast<size_t>(n+1));for(const Flag& flag:flags){if(flag.type==1){if(flag.k<=tolerance)return false;graph[static_cast<size_t>(flag.b)].push_back({flag.a,log(flag.k-tolerance)});}else graph[static_cast<size_t>(flag.b)].push_back({flag.a,-log(flag.k+tolerance)});}for(const auto& [person,score]:known){graph[0].push_back({person,log(score)});graph[static_cast<size_t>(person)].push_back({0,-log(score)});}
          vector<double> dist(static_cast<size_t>(n+1),0);vector<int> edge_count(static_cast<size_t>(n+1));vector<char> in_queue(static_cast<size_t>(n+1),1);queue<int> queue_nodes;for(int i=0;i<=n;++i)queue_nodes.push(i);while(!queue_nodes.empty()){int u=queue_nodes.front();queue_nodes.pop();in_queue[static_cast<size_t>(u)]=0;for(const Edge& edge:graph[static_cast<size_t>(u)]){double candidate=dist[static_cast<size_t>(u)]+edge.weight;if(candidate<=dist[static_cast<size_t>(edge.to)]+1e-12)continue;dist[static_cast<size_t>(edge.to)]=candidate;edge_count[static_cast<size_t>(edge.to)]=edge_count[static_cast<size_t>(u)]+1;if(edge_count[static_cast<size_t>(edge.to)]>n)return true;if(!in_queue[static_cast<size_t>(edge.to)]){in_queue[static_cast<size_t>(edge.to)]=1;queue_nodes.push(edge.to);}}}return false;};
      if(!impossible(0)){cout<<"-1\n";return 0;}double low=0,high=max(0.0,upper-1e-9);for(int iteration=0;iteration<80;++iteration){double middle=(low+high)/2;if(impossible(middle))low=middle;else high=middle;}cout<<fixed<<setprecision(10)<<low<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P4926
external_platform: 洛谷
external_problem_id: P4926
external_title: '[1007] 倍殺測量者'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

分數是正數讓取對數合法；乘法限制轉為差分限制後，「一定有人觸發」就是假設全部不觸發時系統無解。
