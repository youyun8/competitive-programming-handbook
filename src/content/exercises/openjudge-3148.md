---
id: openjudge-3148
volume: upper
source_file: upper-volume
title: OpenJudge 百練 3148 付費道路
chapter: 3
section: '3.2'
kind: external-oj
difficulty: 4
topics: [state-compression, dijkstra]
prerequisites: [shortest-path, bitmask]
statement: n 城市間有 m 條有向道路。邊 `(a,b)` 指定城市 c：若之前曾到達 c，通行費為 P，否則為 R。道路可重複走，求城市 1 到 n 的最少費用。
constraints: ['1 <= n,m <= 10', '0 <= P <= R <= 100', 兩城間可有多條有向邊]
input_format: 第一行 n、m；接著 m 行 `a b c P R`。
output_format: 輸出最少費用；無論如何皆不可達時輸出 `impossible`。
samples:
  - input: "4 5\n1 2 1 10 10\n2 3 1 30 50\n3 4 3 80 80\n2 1 2 10 10\n1 3 2 10 50\n"
    output: '110'
    explanation: 最佳路徑的費率取決於抵達各城市的歷史，最少總費用為 110。
core_knowledge: [頂點加已訪城市遮罩, 非負權 Dijkstra, 歷史相依費用]
judgment: 是否享有 P 只看通行該邊以前是否曾到達 c；抵達 b 後才把 b 加入遮罩。
hints:
  - 單記目前城市不足以決定下一條邊費用，還須記錄曾到達城市集合。
  - 狀態為 `(city,mask)`，初態遮罩已包含城市 1。
  - 邊權依舊非負，因此可直接在擴張後的狀態圖跑 Dijkstra。
solution_outline: 建立至多 `n·2^n` 個隱式狀態；由 `(u,mask)` 枚舉 u 的出邊，按 mask 是否含 c 選 P/R，轉到 `(v,mask∪{v})`。
proof_or_invariant: mask 精確保存未來定價所需的全部歷史，故同一狀態後續成本與更早路徑無關。每條原問題行程唯一對應擴張圖路徑且費用相同；所有邊非負，Dijkstra 首次確定任一終點狀態的最小距離即為全域答案。
complexity: { time: 'O(m·2^n log(n·2^n))', space: 'O(n·2^n)' }
common_errors: [只以城市判重, 先把 b 加入遮罩再判 c, 把道路當無向]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { /* TODO：在 (city,visited_mask) 上跑 Dijkstra。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Edge{int to,condition,cheap,regular;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<vector<Edge>> graph(n);for(int i=0,a,b,c,p,r;i<m;++i){cin>>a>>b>>c>>p>>r;graph[a-1].push_back({b-1,c-1,p,r});}const int inf=numeric_limits<int>::max()/4;vector distance(n,vector<int>(1<<n,inf));using State=tuple<int,int,int>;priority_queue<State,vector<State>,greater<State>> pending;distance[0][1]=0;pending.push({0,0,1});int answer=inf;while(!pending.empty()){auto [cost,node,mask]=pending.top();pending.pop();if(cost!=distance[node][mask])continue;if(node==n-1){answer=cost;break;}for(const Edge&e:graph[node]){int next_mask=mask|(1<<e.to),next_cost=cost+((mask>>e.condition)&1?e.cheap:e.regular);if(next_cost<distance[e.to][next_mask]){distance[e.to][next_mask]=next_cost;pending.push({next_cost,e.to,next_mask});}}}if(answer==inf)cout<<"impossible\n";else cout<<answer<<'\n';}
external_url: http://bailian.openjudge.cn/practice/3148/
external_platform: OpenJudge 百練
external_problem_id: '3148'
external_title: 付费道路
external_relation: original
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

到訪集合不是附帶資訊，而是決定未來邊權的必要狀態。
