---
id: openjudge-3148
volume: upper
source_file: upper-volume
title: OpenJudge 百練 3148 付費道路
chapter: 3
section: '3.2'
kind: external-oj
difficulty: 4
topics:
  - search
prerequisites:
  - graph-search
statement: 有向邊有優惠價 P 與原價 R；若過去曾到達指定城市 c，走該邊可付 P，否則付 R。求城市 1 到 n 的最低費用。
constraints:
  - 1 <= n,m <= 10
  - 0 <= P <= R <= 100
  - 平行邊允許
judgment: 判斷優惠使用的是歷史上曾到達，而非目前位置；道路可重複通過並重複付費。
hints:
  - 狀態需同時保存目前城市與曾到達城市的 bitmask。
  - 走邊時先用舊 mask 判斷 c 是否到過，再把目的城市加入 mask。
  - 所有費用非負，在 (mask,city) 狀態圖上做 Dijkstra。
input_format: 第一行 n、m；其後每行 a、b、c、P、R。
output_format: 輸出最低費用；不可達輸出 impossible。
samples:
  - input: |
      4 5
      1 2 1 10 10
      2 3 1 30 50
      3 4 3 80 80
      2 1 2 10 10
      1 3 2 10 50
    output: '110'
    explanation: 先到城市 2 後返回 1，可讓 1→3 使用優惠，總費用最低為 110。
core_knowledge:
  - 造訪集合狀態壓縮
  - Dijkstra
solution_outline: 建立邊表，以 mask*n+city 編碼狀態，Dijkstra 到任一 city=n 狀態。
proof_or_invariant: mask 精確摘要所有會影響未來邊價的歷史。每次道路轉移與題意一一對應且權非負，因此 Dijkstra 首次定稿終點即最低費用。
complexity:
  time: O(2^n(n+m) log(2^n n))
  space: O(2^n n)
common_errors:
  - 用更新後 mask 判斷優惠
  - 只保留每城一個距離
  - 不可達時輸出 -1
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to,condition,low,regular;};
  int main(){int n,m;cin>>n>>m;vector<vector<Edge>>g(n);while(m--){int a,b,c,p,r;cin>>a>>b>>c>>p>>r;g[a-1].push_back({b-1,c-1,p,r});}int states=1<<n,inf=1e9;vector dist(states,vector<int>(n,inf));using S=tuple<int,int,int>;priority_queue<S,vector<S>,greater<S>>q;dist[1][0]=0;q.push({0,1,0});int answer=-1;while(!q.empty()){auto[d,mask,v]=q.top();q.pop();if(d!=dist[mask][v])continue;if(v==n-1){answer=d;break;}for(auto e:g[v]){int cost=(mask&(1<<e.condition))?e.low:e.regular,nmask=mask|(1<<e.to);if(d+cost<dist[nmask][e.to]){dist[nmask][e.to]=d+cost;q.push({d+cost,nmask,e.to});}}}if(answer<0)cout<<"impossible\n";else cout<<answer<<'\n';}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to,condition,low,regular;};
  int main(){int n,m;cin>>n>>m;vector<vector<Edge>>g(n);while(m--){int a,b,c,p,r;cin>>a>>b>>c>>p>>r;g[a-1].push_back({b-1,c-1,p,r});}int states=1<<n,inf=1e9;vector dist(states,vector<int>(n,inf));using S=tuple<int,int,int>;priority_queue<S,vector<S>,greater<S>>q;dist[1][0]=0;q.push({0,1,0});int answer=-1;while(!q.empty()){auto[d,mask,v]=q.top();q.pop();if(d!=dist[mask][v])continue;if(v==n-1){answer=d;break;}for(auto e:g[v]){int cost=(mask&(1<<e.condition))?e.low:e.regular,nmask=mask|(1<<e.to);if(d+cost<dist[nmask][e.to]){dist[nmask][e.to]=d+cost;q.push({d+cost,nmask,e.to});}}}if(answer<0)cout<<"impossible\n";else cout<<answer<<'\n';}
external_url: http://bailian.openjudge.cn/practice/3148/
external_platform: OpenJudge 百練
external_problem_id: '3148'
external_title: 付費道路
external_relation: original
source_book_pages:
  - 122
source_pdf_pages:
  - 140
review_status: verified
---

依官方題面獨立重述與實作。
