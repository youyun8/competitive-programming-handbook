---
id: luogu-p4568
volume: lower
source_file: lower-volume
original_label: 洛谷 P4568
title: 洛谷 P4568 飛行路線：分層圖最短路
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: [分層圖, Dijkstra, 狀態最短路]
prerequisites: [dijkstra]
core_knowledge: [節點與已用優惠次數, 層內付費邊, 跨層免費邊]
judgment: 狀態需同時記錄城市與已使用免費航線數。
statement: 帶非負權雙向圖中從 s 到 t，最多 k 條航線可免費，求最小花費。
constraints: ['n <= 10000', 'm <= 50000', 'k <= 10']
input_format: 第一行 n、m、k；第二行 s、t；接著 m 條雙向航線 a、b、c。
output_format: 輸出最少花費。
samples:
  - input: |-
      3 3 1
      0 2
      0 1 5
      1 2 4
      0 2 10
    output: '0'
    explanation: 把直達航線作為唯一一次免費航線即可零成本抵達。
hints:
  - 狀態 (u,used) 表示位於 u 且已免費 used 次。
  - 付費走邊留在同層；免費走邊轉到 used+1 層且代價 0。
  - 所有轉移非負，可直接在狀態圖上跑 Dijkstra。
solution_outline: 建原圖鄰接表，以 (城市,免費次數) 為 Dijkstra 狀態，對每條邊同時嘗試付費與尚可用時的免費轉移。
proof_or_invariant: 任一原旅行方案依免費使用次序唯一映射到分層圖路徑，反之亦然，且權重等於實付金額；因此分層圖到任一 (t,used) 的最短路最小值即答案。
complexity: { time: 'O(k(n+m) log(kn))', space: 'O(k n+m)' }
common_errors: [只允許恰好 k 次而非最多 k 次, 免費轉移後沒有增加層數, 城市編號從 0 開始卻配置不足]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { int n,m,k,s,t; cin>>n>>m>>k>>s>>t; /* TODO：分層 Dijkstra。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n,m,k,s,t; if(!(cin>>n>>m>>k>>s>>t)) return 0;
      vector<vector<pair<int,int>>> graph(static_cast<size_t>(n));
      for(int i=0;i<m;++i){int a,b,c;cin>>a>>b>>c;graph[static_cast<size_t>(a)].push_back({b,c});graph[static_cast<size_t>(b)].push_back({a,c});}
      const long long inf=LLONG_MAX/4;
      vector<vector<long long>> dist(static_cast<size_t>(k+1),vector<long long>(static_cast<size_t>(n),inf));
      using State=tuple<long long,int,int>;
      priority_queue<State,vector<State>,greater<>> queue;
      dist[0][static_cast<size_t>(s)]=0;queue.push({0,s,0});
      while(!queue.empty()){
          auto [d,u,used]=queue.top();queue.pop();
          if(d!=dist[static_cast<size_t>(used)][static_cast<size_t>(u)]) continue;
          for(const auto& [v,w]:graph[static_cast<size_t>(u)]){
              if(d+w<dist[static_cast<size_t>(used)][static_cast<size_t>(v)]){
                  dist[static_cast<size_t>(used)][static_cast<size_t>(v)]=d+w;queue.push({d+w,v,used});
              }
              if(used<k&&d<dist[static_cast<size_t>(used+1)][static_cast<size_t>(v)]){
                  dist[static_cast<size_t>(used+1)][static_cast<size_t>(v)]=d;queue.push({d,v,used+1});
              }
          }
      }
      long long answer=inf;for(int used=0;used<=k;++used)answer=min(answer,dist[static_cast<size_t>(used)][static_cast<size_t>(t)]);
      cout<<answer<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P4568
external_platform: 洛谷
external_problem_id: P4568
external_title: '[JLOI2011] 飛行路線'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

當限制帶有一個很小的使用次數，把它展開成圖的一維通常最直接。
