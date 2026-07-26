---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
difficulty: 3
topics:
  - search
prerequisites:
  - graph-search
id: luogu-p1649
title: 洛谷 P1649 Obstacle Course S
section: '3.3'
statement: 在 N×N 網格由 A 走到 B，`x` 不可通行。第一步方向任意；沿原方向繼續不增加轉彎數，改成垂直方向增加一次，求最少 90° 轉彎數。
constraints:
  - 1 <= N <= 100
  - 字元為 x、.、A、B
  - 若不可達輸出 -1
judge: 起始方向任選，不算第一次選方向為轉彎；只能四方向移動。
judgment: 狀態必須包含抵達目前格的方向；沿同方向前進費用為 0，改成垂直方向費用為 1，起點的首個方向不計轉彎；立即折返不可能改善最優解，可安全忽略。
hints:
  - 同一格面向不同方向是不同狀態。
  - 保持方向的邊權為 0，改方向的邊權為 1。
  - 把 A 的四種方向距離都初始化為 0，再做 0-1 BFS。
input_format: 第一行 N，接著 N 行網格。
output_format: 輸出最少轉彎次數；不可達輸出 -1。
samples:
  - input: |
      5
      .....
      .A...
      .....
      ...B.
      .....
    output: '1'
    explanation: 可先水平再垂直抵達 B，只需一次轉彎。
core_knowledge:
  - 位置加方向狀態
  - 0-1 BFS
solution_outline: 在 (row,column,direction) 狀態圖上執行 0-1 BFS，取 B 四方向最小值。
proof_or_invariant: 每條網格路徑連同移動方向唯一對應狀態路徑，其邊權和恰是轉彎數。0-1 BFS 求得非負 0/1 邊最短距離，因此答案正確。
complexity:
  time: O(N^2)
  space: O(N^2)
common_errors:
  - 把第一步算一次轉彎
  - 只存每格一個距離
  - 用普通 BFS 處理 0/1 邊
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;int main(){int n;cin>>n;vector<string>g(n);pair<int,int>s,t;for(int r=0;r<n;++r){cin>>g[r];for(int c=0;c<n;++c){if(g[r][c]=='A')s={r,c};if(g[r][c]=='B')t={r,c};}}const int inf=1e9;vector dist(n,vector<array<int,4>>(n,array<int,4>{inf,inf,inf,inf}));deque<array<int,3>>q;for(int d=0;d<4;++d){dist[s.first][s.second][d]=0;q.push_back({s.first,s.second,d});}constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(!q.empty()){auto[r,c,d]=q.front();q.pop_front();int base=dist[r][c][d];for(int nd=0;nd<4;++nd){int nr=r+dr[nd],nc=c+dc[nd],w=(nd==d?0:1);if(nr>=0&&nr<n&&nc>=0&&nc<n&&g[nr][nc]!='x'&&base+w<dist[nr][nc][nd]){dist[nr][nc][nd]=base+w;if(w)q.push_back({nr,nc,nd});else q.push_front({nr,nc,nd});}}}int ans=*min_element(dist[t.first][t.second].begin(),dist[t.first][t.second].end());cout<<(ans==inf?-1:ans)<<'\n';}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;int main(){int n;cin>>n;vector<string>g(n);pair<int,int>s,t;for(int r=0;r<n;++r){cin>>g[r];for(int c=0;c<n;++c){if(g[r][c]=='A')s={r,c};if(g[r][c]=='B')t={r,c};}}const int inf=1e9;vector dist(n,vector<array<int,4>>(n,array<int,4>{inf,inf,inf,inf}));deque<array<int,3>>q;for(int d=0;d<4;++d){dist[s.first][s.second][d]=0;q.push_back({s.first,s.second,d});}constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(!q.empty()){auto[r,c,d]=q.front();q.pop_front();int base=dist[r][c][d];for(int nd=0;nd<4;++nd){int nr=r+dr[nd],nc=c+dc[nd],w=(nd==d?0:1);if(nr>=0&&nr<n&&nc>=0&&nc<n&&g[nr][nc]!='x'&&base+w<dist[nr][nc][nd]){dist[nr][nc][nd]=base+w;if(w)q.push_back({nr,nc,nd});else q.push_front({nr,nc,nd});}}}int ans=*min_element(dist[t.first][t.second].begin(),dist[t.first][t.second].end());cout<<(ans==inf?-1:ans)<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1649
external_platform: 洛谷
external_problem_id: P1649
external_title: 洛谷 P1649 Obstacle Course S
external_relation: original
source_book_pages:
  - 123
source_pdf_pages:
  - 141
review_status: verified
---

依官方或可信存檔題面獨立重述與實作。
