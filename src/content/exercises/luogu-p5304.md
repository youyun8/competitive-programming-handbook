---
id: luogu-p5304
volume: lower
source_file: lower-volume
original_label: 洛谷 P5304
title: 洛谷 P5304 旅行者：二進位分組多源最短路
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 4
topics: [多源最短路, 二進位分組, Dijkstra]
prerequisites: [dijkstra]
core_knowledge: [關鍵點分組, 超級源點等價, 有向距離]
judgment: 任意兩個不同關鍵點必在某個二進位位元被分到相反集合。
statement: 多組帶非負權有向圖，給定 k 個特殊城市，求不同特殊城市間有向最短距離的最小值。
constraints: [多組資料, 邊權非負, 至少一對特殊城市互相可達]
input_format: 第一行 T；每組輸入 n、m、k，m 條有向邊及 k 個特殊城市。
output_format: 每組輸出最近一對特殊城市的最短距離。
samples:
  - input: |-
      1
      3 3 2
      1 2 5
      2 3 2
      1 3 10
      1 3
    output: '7'
    explanation: 特殊城市 1 到 3 經過 2 的最短距離為 7。
hints:
  - 枚舉特殊點下標的每個二進位位，把 0 組作多源、1 組作終點。
  - 同一位還要交換兩組再跑一次，因為圖有方向。
  - 多源 Dijkstra 只需把所有來源距離設 0 並一起入堆。
solution_outline: 對每個下標位元，分別以兩側作來源執行兩次多源 Dijkstra，取另一側特殊點距離最小值。
proof_or_invariant: 任意兩個不同特殊點的下標至少有一位不同，因此其有向距離會在該位、正確方向的一次 Dijkstra 中被考慮；每次結果又都對應一對不同特殊點，故全域最小值不漏且不會混入自身距離。
complexity: { time: 'O(log k (n+m) log n)', space: 'O(n+m)' }
common_errors: [有向圖只跑一個分組方向, 以城市編號而非特殊點下標分組卻漏位元, 把同一特殊點同時放進來源與終點]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;/* TODO：每位兩方向多源 Dijkstra。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int tests;if(!(cin>>tests))return 0;
      while(tests-->0){
          int n,m,k;cin>>n>>m>>k;
          vector<vector<pair<int,int>>> graph(static_cast<size_t>(n+1));
          for(int i=0;i<m;++i){int u,v,w;cin>>u>>v>>w;graph[static_cast<size_t>(u)].push_back({v,w});}
          vector<int> special(static_cast<size_t>(k));for(int& x:special)cin>>x;
          const long long inf=LLONG_MAX/4;long long answer=inf;
          int levels=0;while((1<<levels)<k)++levels;
          for(int bit=0;bit<levels;++bit)for(int side=0;side<2;++side){
              vector<long long> dist(static_cast<size_t>(n+1),inf);
              priority_queue<pair<long long,int>,vector<pair<long long,int>>,greater<>> queue;
              for(int i=0;i<k;++i)if(((i>>bit)&1)==side){dist[static_cast<size_t>(special[static_cast<size_t>(i)])]=0;queue.push({0,special[static_cast<size_t>(i)]});}
              while(!queue.empty()){auto[d,u]=queue.top();queue.pop();if(d!=dist[static_cast<size_t>(u)])continue;
                  for(const auto& [v,w]:graph[static_cast<size_t>(u)])if(d+w<dist[static_cast<size_t>(v)]){dist[static_cast<size_t>(v)]=d+w;queue.push({d+w,v});}}
              for(int i=0;i<k;++i)if(((i>>bit)&1)!=side)answer=min(answer,dist[static_cast<size_t>(special[static_cast<size_t>(i)])]);
          }
          cout<<answer<<'\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P5304
external_platform: 洛谷
external_problem_id: P5304
external_title: '[GXOI/GZOI2019] 旅行者'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

二進位分組把「不能讓來源和終點是同一個關鍵點」轉成少量可證明覆蓋全部點對的切割。
