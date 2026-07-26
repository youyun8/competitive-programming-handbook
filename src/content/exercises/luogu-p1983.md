---
id: luogu-p1983
volume: lower
source_file: lower-volume
original_label: 洛谷 P1983
title: 車站分級：由停靠規則建立偏序
chapter: 10
section: '10.2'
kind: external-oj
difficulty: 3
topics: [topological-sort, longest-path, graph-modeling]
prerequisites: [dag]
statement: >-
  n 個車站依序排列。每班車所停靠的站中，凡位於該班始末站之間且未停靠的站，等級都必須
  低於每個停靠站。已知所有班次均合法，求至少需要多少種車站等級。
constraints: [1 <= n, m <= 1000, 每班停靠站編號嚴格遞增, 所有班次保證可滿足]
input_format: 第一行 n m；接著 m 行先給停靠數 s，再給 s 個遞增站號。
output_format: 輸出最少等級數。
samples:
  - input: "9 2\n4 1 3 5 6\n3 3 5 6\n"
    output: '2'
    explanation: 區間內未停的 2、4 號必須低於所停各站，兩級已足夠。
core_knowledge: [把嚴格大小關係建成 DAG, 拓撲序最長路, 重複邊去重]
judgment: 只比較一班車首末站之間的站；停靠站彼此沒有強制高低關係。
hints:
  - 對每班車標記停靠站，掃描首站到末站間所有未停站。
  - 每個未停站必須低於這班的每個停靠站，建立由低到高的邊。
  - DAG 上令 level[v]=max(level[u]+1)，最大 level 就是最少級數。
solution_outline: 對每班建立所有「區間內未停站→停靠站」邊並以矩陣去重，接著 Kahn 拓撲排序，同時做最長路 DP，初值皆為 1。
proof_or_invariant: >-
  每條邊 u→v 精確表示 level[u]<level[v]。任一分級至少需要 DAG 最長鏈的頂點數；
  依拓撲序令每點為所有前驅等級最大值加一，會滿足每條邊且最高等級正是最長鏈長，故下界可達。
common_errors: [把區間外車站也加入限制, 對重複邊多加入度, 最長路初值設為 0 導致少一級, 只連相鄰停靠站]
complexity: { time: O(m*n^2 + n^2), space: O(n^2) }
cpp_skeleton: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,m=0;cin>>n>>m;vector<vector<bool>> edge(static_cast<size_t>(n+1),vector<bool>(static_cast<size_t>(n+1),false));vector<int> indegree(static_cast<size_t>(n+1),0);/* TODO：建圖並做拓撲最長路。*/(void)edge;(void)indegree;}
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <queue>
  #include <vector>
  using namespace std;
  int main(){
      ios::sync_with_stdio(false);cin.tie(nullptr);int n=0,m=0;cin>>n>>m;
      vector<vector<bool>> edge(static_cast<size_t>(n+1),vector<bool>(static_cast<size_t>(n+1),false));vector<int> indegree(static_cast<size_t>(n+1),0);
      for(int trip=0;trip<m;++trip){int count=0;cin>>count;vector<int> stops(static_cast<size_t>(count));vector<bool> is_stop(static_cast<size_t>(n+1),false);for(int& station:stops){cin>>station;is_stop[static_cast<size_t>(station)]=true;}
          for(int low=stops.front();low<=stops.back();++low)if(!is_stop[static_cast<size_t>(low)])for(int high:stops)if(!edge[static_cast<size_t>(low)][static_cast<size_t>(high)]){edge[static_cast<size_t>(low)][static_cast<size_t>(high)]=true;++indegree[static_cast<size_t>(high)];}}
      queue<int> ready;vector<int> level(static_cast<size_t>(n+1),1);for(int v=1;v<=n;++v)if(indegree[static_cast<size_t>(v)]==0)ready.push(v);int answer=1;
      while(!ready.empty()){int u=ready.front();ready.pop();answer=max(answer,level[static_cast<size_t>(u)]);for(int v=1;v<=n;++v)if(edge[static_cast<size_t>(u)][static_cast<size_t>(v)]){level[static_cast<size_t>(v)]=max(level[static_cast<size_t>(v)],level[static_cast<size_t>(u)]+1);if(--indegree[static_cast<size_t>(v)]==0)ready.push(v);}}
      cout<<answer<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P1983
external_platform: Luogu
external_problem_id: P1983
external_title: '[NOIP 2013 普及組] 車站分級'
external_relation: original
source_book_pages: [610]
source_pdf_pages: [240]
review_status: verified
---

真正的難點是把一班車轉成大量「未停站低於停靠站」的嚴格關係。
