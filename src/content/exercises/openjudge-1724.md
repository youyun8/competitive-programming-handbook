---
volume: upper
source_file: upper-volume
chapter: 3
section: '3.2'
kind: external-oj
difficulty: 3
topics:
  - search
prerequisites:
  - recursion
id: openjudge-1724
title: OpenJudge 百練 1724 ROADS
statement: 有向道路同時有長度與過路費。從城市 1 到 N，在總費用不超過 K 下最小化路程。
constraints:
  - 0 <= K <= 10000
  - 2 <= N <= 100
  - 1 <= R <= 10000
judgment: 平行道路可存在，費用可以為零。
hints:
  - 單一城市的最短距離不足以判斷，還要記已花費用。
  - 狀態 (city,cost) 沿道路轉移到 cost+toll。
  - 以路程為鍵做 Dijkstra，取所有終點費用狀態的最小值。
input_format: 依序為 K、N、R，再給 R 行起點、終點、長度、費用。
output_format: 輸出最短路程；不存在輸出 -1。
samples:
  - input: |
      5
      6
      7
      1 2 2 3
      2 4 3 3
      3 4 2 4
      1 3 4 1
      4 6 2 1
      3 5 2 0
      5 4 3 2
    output: '11'
    explanation: 路徑 1→3→5→4→6 費用不超過 5，長度 11。
core_knowledge:
  - 費用擴展狀態最短路
  - Pareto 狀態
solution_outline: 在 N*(K+1) 個狀態上執行 Dijkstra。
proof_or_invariant: 每條原道路在擴展圖中精確形成符合預算的非負權邊，合法路徑一一對應。Dijkstra 因而得到最短合法路程。
common_errors:
  - 只保存每城一個距離
  - 把費用當優化目標
  - 漏掉零費用道路
complexity:
  time: O((NK+RK) log(NK))
  space: O(NK)
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to,length,toll;};
  int main(){int budget,n,r;cin>>budget>>n>>r;vector<vector<Edge>>g(n);while(r--){int a,b,l,t;cin>>a>>b>>l>>t;g[a-1].push_back({b-1,l,t});}const int inf=1e9;vector dist(n,vector<int>(budget+1,inf));using State=tuple<int,int,int>;priority_queue<State,vector<State>,greater<State>>q;dist[0][0]=0;q.push({0,0,0});while(!q.empty()){auto[d,v,c]=q.top();q.pop();if(d!=dist[v][c])continue;for(auto e:g[v])if(c+e.toll<=budget&&d+e.length<dist[e.to][c+e.toll]){dist[e.to][c+e.toll]=d+e.length;q.push({d+e.length,e.to,c+e.toll});}}int ans=*min_element(dist[n-1].begin(),dist[n-1].end());cout<<(ans==inf?-1:ans)<<'\n';}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to,length,toll;};
  int main(){int budget,n,r;cin>>budget>>n>>r;vector<vector<Edge>>g(n);while(r--){int a,b,l,t;cin>>a>>b>>l>>t;g[a-1].push_back({b-1,l,t});}const int inf=1e9;vector dist(n,vector<int>(budget+1,inf));using State=tuple<int,int,int>;priority_queue<State,vector<State>,greater<State>>q;dist[0][0]=0;q.push({0,0,0});while(!q.empty()){auto[d,v,c]=q.top();q.pop();if(d!=dist[v][c])continue;for(auto e:g[v])if(c+e.toll<=budget&&d+e.length<dist[e.to][c+e.toll]){dist[e.to][c+e.toll]=d+e.length;q.push({d+e.length,e.to,c+e.toll});}}int ans=*min_element(dist[n-1].begin(),dist[n-1].end());cout<<(ans==inf?-1:ans)<<'\n';}
external_url: http://bailian.openjudge.cn/practice/1724/
external_platform: OpenJudge 百練
external_problem_id: '1724'
external_title: ROADS
external_relation: original
source_book_pages:
  - 121
source_pdf_pages:
  - 139
review_status: verified
---

依官方題面獨立重述與實作。
