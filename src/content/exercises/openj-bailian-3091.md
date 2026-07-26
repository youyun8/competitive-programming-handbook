---
id: openj-bailian-3091
volume: lower
source_file: lower-volume
original_label: OpenJudge 百練 3091
title: Road Construction：最少增建道路消除所有橋
chapter: 10
section: '10.4'
kind: external-oj
difficulty: 3
topics: [bridge, edge-biconnected-components, tree]
prerequisites: [depth-first-search, undirected-graph]
statement: >-
  一座島上有 n 個景點與 r 條雙向道路，現況保證連通。施工時任一條道路可能暫時無法通行；
  求至少增建幾條道路，才能保證移除任意一條道路後，任兩景點仍然互相可達。
constraints: [3 <= n <= 1000, 2 <= r <= 1000, 無自環與重邊, 原圖連通, 時間限制 1000 ms, 記憶體限制 65536 kB]
input_format: 第一行 n r；接著 r 行 v w，表示一條雙向道路。
output_format: 輸出至少需要增建的道路數。
samples:
  - input: "10 12\n1 2\n1 3\n1 4\n2 5\n2 6\n5 6\n3 7\n3 8\n7 8\n4 9\n4 10\n9 10\n"
    output: "2\n"
    explanation: 縮去三個末端環狀區塊後，橋樹有三個葉分量，至少且只需增建兩條道路。
  - input: "3 3\n1 2\n2 3\n1 3\n"
    output: "0\n"
    explanation: 三角形沒有橋，移除任一道路仍連通，不必增建。
core_knowledge: [橋的 low-link 判定, 邊雙連通分量縮點, 橋樹葉節點配對]
judgment: 將所有非橋邊縮成分量後得到一棵橋樹；若葉分量數為 L，答案為 (L+1)/2。
hints:
  - 先以 DFS 的 dfn/low 判定每條樹邊是否為橋；平行邊雖未出現，仍建議按邊編號略過父邊。
  - 忽略所有橋，以 DFS 或 BFS 將剩餘頂點染成邊雙連通分量，原圖便縮成一棵樹。
  - 每個橋樹葉都需要一個新邊端點；一條新邊最多照顧兩葉，依序配對葉即可達到下界。
solution_outline: >-
  Tarjan DFS 標出橋；再沿非橋邊染分量。掃描每條橋，增加其兩端分量在橋樹中的度數，
  統計度數為一的分量數 leaves，輸出 (leaves+1)/2。
proof_or_invariant: >-
  非橋邊縮點不改變「移除一邊是否斷開」；原圖連通，因此縮點後是樹。每個葉分量只有唯一
  一條橋連向其餘圖，若沒有新增邊以該葉一側為端點，這條橋仍會斷圖，所以至少需要
  ceil(L/2) 條。把葉按橋樹 DFS 次序分成前後兩半配對（奇數時讓一葉再與首葉配對），
  每條樹邊的兩側都至少被某條新增邊跨越，故每條原橋都進入環；此構造恰用 ceil(L/2) 條，
  達到下界。
common_errors: [只計算橋數而非橋樹葉數, 把父頂點而非父邊略過, 已無橋時誤輸出一, 葉數為奇數時忘記上取整]
complexity: { time: 'O(n + r)', space: 'O(n + r)' }
cpp_skeleton: |
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,r=0;cin>>n>>r;vector<vector<pair<int,int>>> graph(static_cast<size_t>(n));/* TODO：標橋、沿非橋邊縮點，再統計橋樹葉數。*/}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <queue>
  #include <utility>
  #include <vector>
  using namespace std;
  static void find_bridges(int u,int parent_edge,const vector<vector<pair<int,int>>>& graph,vector<int>& dfn,vector<int>& low,vector<bool>& is_bridge,int& timer){
      dfn[static_cast<size_t>(u)]=low[static_cast<size_t>(u)]=++timer;
      for(const auto& [v,edge_id]:graph[static_cast<size_t>(u)]){
          if(edge_id==parent_edge)continue;
          if(dfn[static_cast<size_t>(v)]==0){
              find_bridges(v,edge_id,graph,dfn,low,is_bridge,timer);
              low[static_cast<size_t>(u)]=min(low[static_cast<size_t>(u)],low[static_cast<size_t>(v)]);
              if(low[static_cast<size_t>(v)]>dfn[static_cast<size_t>(u)])is_bridge[static_cast<size_t>(edge_id)]=true;
          }else{
              low[static_cast<size_t>(u)]=min(low[static_cast<size_t>(u)],dfn[static_cast<size_t>(v)]);
          }
      }
  }
  int main(){
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n=0,r=0;
      if(!(cin>>n>>r))return 0;
      vector<vector<pair<int,int>>> graph(static_cast<size_t>(n));
      vector<pair<int,int>> edges(static_cast<size_t>(r));
      for(int edge_id=0;edge_id<r;++edge_id){
          int u=0,v=0;cin>>u>>v;--u;--v;
          edges[static_cast<size_t>(edge_id)]={u,v};
          graph[static_cast<size_t>(u)].push_back({v,edge_id});
          graph[static_cast<size_t>(v)].push_back({u,edge_id});
      }
      vector<int> dfn(static_cast<size_t>(n),0),low(static_cast<size_t>(n),0);
      vector<bool> is_bridge(static_cast<size_t>(r),false);
      int timer=0;
      find_bridges(0,-1,graph,dfn,low,is_bridge,timer);
      vector<int> component(static_cast<size_t>(n),-1);
      int component_count=0;
      for(int start=0;start<n;++start){
          if(component[static_cast<size_t>(start)]!=-1)continue;
          queue<int> pending;pending.push(start);component[static_cast<size_t>(start)]=component_count;
          while(!pending.empty()){
              const int u=pending.front();pending.pop();
              for(const auto& [v,edge_id]:graph[static_cast<size_t>(u)]){
                  if(is_bridge[static_cast<size_t>(edge_id)]||component[static_cast<size_t>(v)]!=-1)continue;
                  component[static_cast<size_t>(v)]=component_count;pending.push(v);
              }
          }
          ++component_count;
      }
      vector<int> degree(static_cast<size_t>(component_count),0);
      for(int edge_id=0;edge_id<r;++edge_id){
          if(!is_bridge[static_cast<size_t>(edge_id)])continue;
          const auto [u,v]=edges[static_cast<size_t>(edge_id)];
          ++degree[static_cast<size_t>(component[static_cast<size_t>(u)])];
          ++degree[static_cast<size_t>(component[static_cast<size_t>(v)])];
      }
      const int leaves=static_cast<int>(count(degree.begin(),degree.end(),1));
      cout<<(leaves+1)/2<<'\n';
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/3091/
external_platform: OpenJ_Bailian
external_problem_id: '3091'
external_title: Road Construction
external_relation: original
source_book_pages: [619, 620]
source_pdf_pages: [249, 250]
review_status: verified
---

百練原題的兩組帶文字標籤範例已整理為純標準輸入輸出；題意與限制另和同題可信存檔交叉核對。
