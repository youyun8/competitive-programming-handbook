---
id: openj-bailian-3758
volume: lower
source_file: lower-volume
original_label: OpenJudge 百練 3758
title: 百練 3758 Sightseeing：最短與次短路計數
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 4
topics: [次短路, 路徑計數, Dijkstra]
prerequisites: [dijkstra]
core_knowledge: [每點兩個距離, 狀態計數, 相差一納入]
judgment: 答案包含所有最短路；若嚴格次短距離恰比最短多 1，也包含全部次短路。
statement: 多組正權有向圖與起終點，計算最短路條數；若次短路只比最短路長 1，再加上次短路條數。
constraints: [多組資料, 邊權為正, 允許多條路]
input_format: 第一行 T；每組輸入 n、m、m 條有向邊，再輸入起點與終點。
output_format: 每組輸出符合觀光條件的路徑數。
samples:
  - input: |-
      1
      3 3
      1 2 1
      2 3 1
      1 3 3
      1 3
    output: '2'
    explanation: 最短路長 2 有一條，次短路長 3 也有一條且只多 1，因此答案為 2。
hints:
  - 每點保存 rank 0、1 兩個嚴格不同距離及各自方案數。
  - 同距離到達同一狀態時只累加方案，不重新建立第三個距離。
  - 最後先取最短計數，再檢查次短距離是否等於最短加一。
solution_outline: 在擴充狀態 (點,第幾短) 上執行 Dijkstra；鬆弛維護兩個距離與計數，按題意合併終點兩種狀態。
proof_or_invariant: 正權使狀態依距離遞增確定。維護規則保留每點最小兩個不同長度，所有同長路徑的最後一條邊都會把前驅計數累加，故距離與方案數皆完整。
complexity: { time: 'O((n+m) log n)', space: 'O(n+m)' }
common_errors: [把等長另一條路當作次短距離, 次短不只多 1 仍計入, 距離更新時沒有搬移最短方案數]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;/* TODO：雙距離 Dijkstra 並計數。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int tests;if(!(cin>>tests))return 0;while(tests-->0){int n,m;cin>>n>>m;vector<vector<pair<int,int>>> graph(static_cast<size_t>(n+1));for(int i=0;i<m;++i){int u,v,w;cin>>u>>v>>w;graph[static_cast<size_t>(u)].push_back({v,w});}int start,target;cin>>start>>target;
          const long long inf=LLONG_MAX/4;vector<array<long long,2>> dist(static_cast<size_t>(n+1),{inf,inf}),ways(static_cast<size_t>(n+1),{0,0});using State=tuple<long long,int,int>;priority_queue<State,vector<State>,greater<>> queue;dist[static_cast<size_t>(start)][0]=0;ways[static_cast<size_t>(start)][0]=1;queue.push({0,start,0});
          while(!queue.empty()){auto[d,u,rank]=queue.top();queue.pop();if(d!=dist[static_cast<size_t>(u)][static_cast<size_t>(rank)])continue;for(const auto& [v,w]:graph[static_cast<size_t>(u)]){long long nd=d+w;
                  if(nd<dist[static_cast<size_t>(v)][0]){dist[static_cast<size_t>(v)][1]=dist[static_cast<size_t>(v)][0];ways[static_cast<size_t>(v)][1]=ways[static_cast<size_t>(v)][0];dist[static_cast<size_t>(v)][0]=nd;ways[static_cast<size_t>(v)][0]=ways[static_cast<size_t>(u)][static_cast<size_t>(rank)];queue.push({nd,v,0});if(dist[static_cast<size_t>(v)][1]<inf)queue.push({dist[static_cast<size_t>(v)][1],v,1});}
                  else if(nd==dist[static_cast<size_t>(v)][0])ways[static_cast<size_t>(v)][0]+=ways[static_cast<size_t>(u)][static_cast<size_t>(rank)];
                  else if(nd<dist[static_cast<size_t>(v)][1]){dist[static_cast<size_t>(v)][1]=nd;ways[static_cast<size_t>(v)][1]=ways[static_cast<size_t>(u)][static_cast<size_t>(rank)];queue.push({nd,v,1});}
                  else if(nd==dist[static_cast<size_t>(v)][1])ways[static_cast<size_t>(v)][1]+=ways[static_cast<size_t>(u)][static_cast<size_t>(rank)];}}
          long long answer=ways[static_cast<size_t>(target)][0];if(dist[static_cast<size_t>(target)][1]==dist[static_cast<size_t>(target)][0]+1)answer+=ways[static_cast<size_t>(target)][1];cout<<answer<<'\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/3758/
external_platform: OpenJudge 百練
external_problem_id: '3758'
external_title: Sightseeing
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

距離與計數要一起維護：距離決定狀態，所有同距離來源共同貢獻方案。
