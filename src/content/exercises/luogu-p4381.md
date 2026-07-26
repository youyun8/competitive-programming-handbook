---
id: luogu-p4381
volume: lower
source_file: lower-volume
original_label: 洛谷 P4381
title: 洛谷 P4381 Island：基環樹直徑總和
chapter: 10
section: '10.6'
kind: external-oj
difficulty: 5
topics: [基環樹, 樹形 DP, 單調佇列]
prerequisites: [trees, monotonic-queue]
core_knowledge: [剝葉找環, 掛樹直徑, 斷環成鏈]
judgment: 每點恰連出一條邊，故每個連通分量都是基環樹；各分量可獨立取最長簡單路後相加。
statement: n 座島每座連一座島並給橋長；在每個連通分量選一條不重複經過島的最長路，求各分量答案總和。
constraints: ['n <= 10^6', '邊權為正', '可能有重邊形成二元環']
input_format: 第一行 n；接著第 i 行給 i 所連的島 v 與橋長 w。
output_format: 輸出所有連通分量最長簡單路長度之和。
samples:
  - input: |-
      3
      2 1
      3 2
      1 3
    output: '5'
    explanation: 三島成環，簡單路最多取其中兩條橋；取長 2 與 3 的橋得 5。
hints:
  - 先以度數剝葉；葉向內累積掛樹最大深度與樹內直徑。
  - 剩餘點形成環，把環複製一遍並用前綴距離表示順時針弧長。
  - 對每個右端點，以單調佇列維護最近環長−1 個左端點的 depth[i]-prefix[i] 最大值。
solution_outline: 剝葉同時計算各環點掛樹的深度與直徑；逐環取樹內直徑，並以倍長環、滑動最大值計算兩棵掛樹深度加一段環路的最大值；分量答案求和。
proof_or_invariant: 剝葉 DP 正確涵蓋不使用環邊的路。任何使用環邊的簡單路有兩端掛在環點，且沿環選一個不滿一圈的有向弧；倍長序列中距離小於環長的左右端點唯一表示它。滑窗枚舉所有這類弧並取最大，故分量直徑完整。
complexity: { time: 'O(n)', space: 'O(n)' }
common_errors: [只計兩端間較短環弧, 用前一個點而非邊編號遍歷二元重邊環, 忘記把掛樹內直徑納入分量答案]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;cin>>n;/* TODO：剝葉 DP，逐環以單調佇列求直徑。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to,id;long long weight;};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n;if(!(cin>>n))return 0;vector<vector<Edge>> graph(static_cast<size_t>(n));vector<int> degree(static_cast<size_t>(n));for(int u=0;u<n;++u){int v;long long w;cin>>v>>w;--v;graph[static_cast<size_t>(u)].push_back({v,u,w});graph[static_cast<size_t>(v)].push_back({u,u,w});++degree[static_cast<size_t>(u)];++degree[static_cast<size_t>(v)];}
      vector<long long> depth(static_cast<size_t>(n)),tree_diameter(static_cast<size_t>(n));vector<char> removed(static_cast<size_t>(n));queue<int> leaves;for(int i=0;i<n;++i)if(degree[static_cast<size_t>(i)]==1)leaves.push(i);
      while(!leaves.empty()){int u=leaves.front();leaves.pop();removed[static_cast<size_t>(u)]=1;for(const Edge& edge:graph[static_cast<size_t>(u)])if(!removed[static_cast<size_t>(edge.to)]){int v=edge.to;tree_diameter[static_cast<size_t>(v)]=max({tree_diameter[static_cast<size_t>(v)],tree_diameter[static_cast<size_t>(u)],depth[static_cast<size_t>(v)]+depth[static_cast<size_t>(u)]+edge.weight});depth[static_cast<size_t>(v)]=max(depth[static_cast<size_t>(v)],depth[static_cast<size_t>(u)]+edge.weight);if(--degree[static_cast<size_t>(v)]==1)leaves.push(v);}}
      vector<char> used(static_cast<size_t>(n));long long answer=0;
      for(int start=0;start<n;++start)if(!removed[static_cast<size_t>(start)]&&!used[static_cast<size_t>(start)]){vector<int> cycle;vector<long long> edge_length;int current=start,previous_edge=-1;
          do{used[static_cast<size_t>(current)]=1;cycle.push_back(current);Edge chosen{-1,-1,0};for(const Edge& edge:graph[static_cast<size_t>(current)])if(!removed[static_cast<size_t>(edge.to)]&&edge.id!=previous_edge){chosen=edge;break;}edge_length.push_back(chosen.weight);previous_edge=chosen.id;current=chosen.to;}while(current!=start);
          int size=static_cast<int>(cycle.size());long long best=0,total=0;for(int u:cycle)best=max(best,tree_diameter[static_cast<size_t>(u)]);for(long long value:edge_length)total+=value;
          vector<long long> prefix(static_cast<size_t>(2*size));for(int i=1;i<2*size;++i)prefix[static_cast<size_t>(i)]=prefix[static_cast<size_t>(i-1)]+edge_length[static_cast<size_t>((i-1)%size)];
          deque<int> candidates;candidates.push_back(0);for(int right=1;right<2*size;++right){while(!candidates.empty()&&candidates.front()<right-size+1)candidates.pop_front();if(!candidates.empty()){int left=candidates.front();best=max(best,depth[static_cast<size_t>(cycle[static_cast<size_t>(left%size)])]+depth[static_cast<size_t>(cycle[static_cast<size_t>(right%size)])]+prefix[static_cast<size_t>(right)]-prefix[static_cast<size_t>(left)]);}
              long long value=depth[static_cast<size_t>(cycle[static_cast<size_t>(right%size)])]-prefix[static_cast<size_t>(right)];while(!candidates.empty()){int back=candidates.back();long long back_value=depth[static_cast<size_t>(cycle[static_cast<size_t>(back%size)])]-prefix[static_cast<size_t>(back)];if(back_value>=value)break;candidates.pop_back();}candidates.push_back(right);
          }
          answer+=best;
      }
      cout<<answer<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P4381
external_platform: 洛谷
external_problem_id: P4381
external_title: '[IOI 2008] Island'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

基環樹直徑由「完全在掛樹內」與「兩端掛樹加一段環」兩類組成；後者斷環後就是滑動最大值。
