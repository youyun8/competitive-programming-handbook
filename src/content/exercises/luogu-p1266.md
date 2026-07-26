---
id: luogu-p1266
volume: lower
source_file: lower-volume
original_label: 洛谷 P1266
title: 洛谷 P1266 速度限制：點與當前速度的分層最短路
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 4
topics: [分層圖, Dijkstra, 路徑還原]
prerequisites: [dijkstra]
core_knowledge: [速度狀態, 缺失標誌繼承, 前驅狀態]
judgment: 限速為 0 的道路沿用上一條道路速度，因此只知道目前路口不足以決定後續代價。
statement: 有向道路給限速與長度；限速標誌缺失（0）時保持目前速度，初速為 70。求從 0 到指定終點耗時最少的唯一城市序列。
constraints: ['2 <= n <= 150', 'm <= 22500', '0 <= speed <= 500']
input_format: 第一行 n、m、目的地 d；接著 m 行 a、b、speed、length。
output_format: 輸出最快路徑依序經過的城市，以空白分隔。
samples:
  - input: |-
      6 15 1
      0 1 25 68
      0 2 30 50
      0 5 0 101
      1 2 70 77
      1 3 35 42
      2 0 0 22
      2 1 40 86
      2 3 0 23
      2 4 45 40
      3 1 64 14
      3 5 0 23
      4 1 95 8
      5 1 0 84
      5 2 90 64
      5 3 36 40
    output: '0 5 2 3 1'
    explanation: 初速 70，沿這條路依規則繼承或更新速度，總耗時嚴格小於其他路線。
hints:
  - dist[u][v] 表示到路口 u 且目前速度為 v 的最短時間。
  - 道路標示速度非 0 時更新速度；為 0 時新速度仍是狀態中的 v。
  - 每次改善記錄前驅 (previous_node,previous_speed)，最後從終點最佳速度回溯。
solution_outline: 在最多 n×501 個狀態上跑非負權 Dijkstra；邊耗時為 length/new_speed，完成後選終點各速度中的最小值並還原路徑。
proof_or_invariant: 狀態包含決定未標示道路耗時所需的完整歷史資訊。原圖每條合法行駛與狀態圖路徑一一對應且總權等於耗時；權重正，Dijkstra 與前驅還原皆正確。
complexity: { time: 'O((501n+501m) log(501n))', space: 'O(501n+m)' }
common_errors: [初始速度不是 0 而是 70, 標誌 0 時把速度改成 0, 只記前驅城市而漏記前驅速度]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,m,d;cin>>n>>m>>d;/* TODO：以 (點,速度) 跑 Dijkstra 並回溯。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to,speed,length;};
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,m,target;if(!(cin>>n>>m>>target))return 0;vector<vector<Edge>> graph(static_cast<size_t>(n));for(int i=0;i<m;++i){int from,to,speed,length;cin>>from>>to>>speed>>length;graph[static_cast<size_t>(from)].push_back({to,speed,length});}
      const double inf=numeric_limits<double>::infinity();vector<array<double,501>> dist(static_cast<size_t>(n));vector<array<pair<int,int>,501>> parent(static_cast<size_t>(n));for(auto& row:dist)row.fill(inf);for(auto& row:parent)row.fill({-1,-1});
      using State=tuple<double,int,int>;priority_queue<State,vector<State>,greater<>> queue;dist[0][70]=0;queue.push({0,0,70});
      while(!queue.empty()){auto[time,u,current_speed]=queue.top();queue.pop();if(time!=dist[static_cast<size_t>(u)][static_cast<size_t>(current_speed)])continue;for(const Edge& edge:graph[static_cast<size_t>(u)]){int next_speed=edge.speed==0?current_speed:edge.speed;double candidate=time+static_cast<double>(edge.length)/next_speed;if(candidate+1e-12<dist[static_cast<size_t>(edge.to)][static_cast<size_t>(next_speed)]){dist[static_cast<size_t>(edge.to)][static_cast<size_t>(next_speed)]=candidate;parent[static_cast<size_t>(edge.to)][static_cast<size_t>(next_speed)]={u,current_speed};queue.push({candidate,edge.to,next_speed});}}}
      int best_speed=1;for(int speed=2;speed<=500;++speed)if(dist[static_cast<size_t>(target)][static_cast<size_t>(speed)]<dist[static_cast<size_t>(target)][static_cast<size_t>(best_speed)])best_speed=speed;vector<int> path;for(pair<int,int> state{target,best_speed};state.first!=-1;state=parent[static_cast<size_t>(state.first)][static_cast<size_t>(state.second)])path.push_back(state.first);reverse(path.begin(),path.end());for(size_t i=0;i<path.size();++i)cout<<(i?" ":"")<<path[i];cout<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P1266
external_platform: 洛谷
external_problem_id: P1266
external_title: '[BalticOI 2002] 速度限制'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

只要未來代價依賴「上一條邊的速度」，就要把速度納入最短路狀態，不能只保留每個路口的一個最優值。
