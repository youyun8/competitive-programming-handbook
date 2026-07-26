---
id: luogu-p1685
volume: lower
source_file: lower-volume
original_label: 洛谷 P1685
title: 遊覽：加總 DAG 的所有路線時間
chapter: 10
section: '10.2'
kind: external-oj
difficulty: 3
topics: [dag, topological-sort, dynamic-programming]
prerequisites: [path-counting, modular-arithmetic]
statement: >-
  一座島以有向無環圖表示，從西端 s 到東端 t 至少有一條路線，平行邊視為不同道路。
  旅客要把每條不同路線各走一次；除最後一次外，每走完一條路線還要花 t0 搭船回到 s。
  求走完所有路線的總耗時除以 10000 的餘數。
constraints: [2 <= n <= 10000, 1 <= m <= 50000, 道路耗時與 t0 均不超過 10000, 圖無環且 s 可到達 t]
input_format: 第一行 n m s t t0；接著 m 行 x y w，表示 x 到 y 有一條耗時 w 的有向道路。
output_format: 輸出總耗時 modulo 10000。
samples:
  - input: "3 4 1 3 7\n1 2 5\n2 3 7\n2 3 10\n1 3 15\n"
    output: '56'
    explanation: 三條路線耗時為 12、15、15，前兩次另付 7 的回程時間，合計 56。
core_knowledge: [拓撲序上的路徑計數, 路徑總權重的線性轉移, 只保留模數下狀態]
judgment: 平行邊代表不同路線；最後一條路線結束後不再搭船。
hints:
  - 對每點維護從 s 到它的路線數與這些路線的耗時總和。
  - 經過權重 w 的邊時，每條到達 u 的路線都多付 w。
  - 答案是 t 的路線耗時總和，再加上「路線數減一」次回程。
solution_outline: >-
  Kahn 拓撲排序。沿 u→v、權重 w 轉移 count[v]+=count[u]，
  sum[v]+=sum[u]+count[u]*w，全部取模。僅令 count[s]=1；處理完後輸出
  sum[t]+(count[t]-1)*t0。
proof_or_invariant: >-
  處理完 v 的所有前驅時，count[v] 恰計數所有 s→v 路線；每條經 u→v 的路線由唯一
  s→u 前綴延伸，新增耗時是前綴耗時加 w，故兩個轉移不漏不重。所有完整路線的道路耗時
  為 sum[t]，且只有最後一次免回程，所以公式成立。
common_errors:
  - 把平行邊去重
  - 將所有零入度點的 count 都設為 1
  - 邊權只加一次而未乘前綴路線數
  - 忘記處理 count[target]-1 的負餘數
complexity: { time: O(n + m), space: O(n + m) }
cpp_skeleton: |
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  struct Edge { int to; int weight; };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n=0,m=0,start=0,target=0,return_time=0;
      cin>>n>>m>>start>>target>>return_time;
      vector<vector<Edge>> graph(static_cast<size_t>(n+1));
      vector<int> indegree(static_cast<size_t>(n+1),0);
      for(int i=0;i<m;++i){int u=0,v=0,w=0;cin>>u>>v>>w;graph[static_cast<size_t>(u)].push_back({v,w});++indegree[static_cast<size_t>(v)];}
      // TODO：依拓撲序維護路線數與耗時總和。
      (void)start; (void)target; (void)return_time;
  }
cpp_solution: |
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  struct Edge { int to; int weight; };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      constexpr int mod=10000;
      int n=0,m=0,start=0,target=0,return_time=0;
      cin>>n>>m>>start>>target>>return_time;
      vector<vector<Edge>> graph(static_cast<size_t>(n+1));
      vector<int> indegree(static_cast<size_t>(n+1),0);
      for(int i=0;i<m;++i){int u=0,v=0,w=0;cin>>u>>v>>w;graph[static_cast<size_t>(u)].push_back({v,w});++indegree[static_cast<size_t>(v)];}
      vector<int> count(static_cast<size_t>(n+1),0),sum(static_cast<size_t>(n+1),0);
      count[static_cast<size_t>(start)]=1;
      queue<int> ready;
      for(int v=1;v<=n;++v)if(indegree[static_cast<size_t>(v)]==0)ready.push(v);
      while(!ready.empty()){
          int u=ready.front();ready.pop();
          for(const Edge edge:graph[static_cast<size_t>(u)]){
              size_t v=static_cast<size_t>(edge.to);
              sum[v]=(sum[v]+sum[static_cast<size_t>(u)]+count[static_cast<size_t>(u)]*edge.weight)%mod;
              count[v]=(count[v]+count[static_cast<size_t>(u)])%mod;
              if(--indegree[v]==0)ready.push(edge.to);
          }
      }
      int answer=(sum[static_cast<size_t>(target)]+(count[static_cast<size_t>(target)]-1+mod)%mod*return_time)%mod;
      cout<<answer<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P1685
external_platform: Luogu
external_problem_id: P1685
external_title: 遊覽
external_relation: original
source_book_pages: [610]
source_pdf_pages: [240]
review_status: verified
---

兩個狀態分別回答「有幾條路」與「這些路一共多長」，因此不用真的枚舉指數多條路線。
