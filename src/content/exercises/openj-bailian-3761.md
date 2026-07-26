---
id: openj-bailian-3761
volume: lower
source_file: lower-volume
original_label: OpenJudge 百練 3761
title: 百練 3761 Full Tank?：油量狀態最短路
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: [狀態圖, Dijkstra, 資源限制]
prerequisites: [dijkstra]
core_knowledge: [城市與油量狀態, 單位加油邊, 零成本行駛邊]
judgment: 同一城市不同剩餘油量會影響後續成本，必須拆成不同狀態。
statement: 各城市油價不同，道路消耗固定油量；多次詢問給油箱容量、起終點，求最低加油費或判定不可達。
constraints: [道路雙向, 每次可按單位購油, 多個獨立詢問]
input_format: 輸入 n、m、各城市油價及 m 條道路；再輸入 q，每問容量、起點、終點。
output_format: 每問輸出最低費用或 impossible。
samples:
  - input: |-
      2 1
      5 2
      0 1 3
      1
      3 0 1
    output: '15'
    explanation: 在 0 號城市買三單位油花費 15，恰好行駛至終點。
hints:
  - 狀態是 (city,fuel)，起點油量為 0。
  - 在城市買一單位油：油量加一、成本加該城油價。
  - 若油量足夠走道路，轉移到鄰城並扣油，成本不增加。
solution_outline: 對每個詢問在 n×(capacity+1) 狀態圖執行 Dijkstra，首次取出任一終點狀態即為最低費用。
proof_or_invariant: 每個實際方案可逐單位加油與逐道路行駛，唯一映射到狀態圖路徑，權重就是費用；反向也成立。狀態邊非負，Dijkstra 求得最小費用。
complexity: { time: '每問 O((nC+mC) log(nC))', space: 'O(nC)' }
common_errors: [把到達終點時油量限制為 0, 行駛時誤加道路長度到費用, 容量不足仍允許走邊]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n,m;cin>>n>>m;/* TODO：每問跑城市×油量 Dijkstra。 */}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);
      int n,m;if(!(cin>>n>>m))return 0;vector<int> price(static_cast<size_t>(n));for(int& x:price)cin>>x;vector<vector<pair<int,int>>> graph(static_cast<size_t>(n));
      for(int i=0;i<m;++i){int a,b,d;cin>>a>>b>>d;graph[static_cast<size_t>(a)].push_back({b,d});graph[static_cast<size_t>(b)].push_back({a,d});}
      int q;cin>>q;while(q-->0){int capacity,start,target;cin>>capacity>>start>>target;const int inf=1000000000;vector<vector<int>> dist(static_cast<size_t>(n),vector<int>(static_cast<size_t>(capacity+1),inf));
          using State=tuple<int,int,int>;priority_queue<State,vector<State>,greater<>> queue;dist[static_cast<size_t>(start)][0]=0;queue.push({0,start,0});int answer=-1;
          while(!queue.empty()){auto[cost,u,fuel]=queue.top();queue.pop();if(cost!=dist[static_cast<size_t>(u)][static_cast<size_t>(fuel)])continue;if(u==target){answer=cost;break;}
              if(fuel<capacity&&cost+price[static_cast<size_t>(u)]<dist[static_cast<size_t>(u)][static_cast<size_t>(fuel+1)]){dist[static_cast<size_t>(u)][static_cast<size_t>(fuel+1)]=cost+price[static_cast<size_t>(u)];queue.push({cost+price[static_cast<size_t>(u)],u,fuel+1});}
              for(const auto& [v,need]:graph[static_cast<size_t>(u)])if(fuel>=need&&cost<dist[static_cast<size_t>(v)][static_cast<size_t>(fuel-need)]){dist[static_cast<size_t>(v)][static_cast<size_t>(fuel-need)]=cost;queue.push({cost,v,fuel-need});}
          }
          if(answer<0)cout<<"impossible\n";else cout<<answer<<'\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/3761/
external_platform: OpenJudge 百練
external_problem_id: '3761'
external_title: Full Tank?
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

把剩餘資源放進狀態後，加油與行駛都只是普通的非負權邊。
