---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
review_status: verified
id: luogu-p3956
title: 洛谷 P3956 棋盤
section: '3.1'
difficulty: 3
topics:
  - dijkstra
  - state-space
  - grid
prerequisites:
  - priority-queue
  - shortest-path
statement: m×m 棋盤部分格子為紅或黃，其餘無色。走到原有色格時，同色花 0、異色花 1；可花 2
  使下一個無色格暫時採用目前顏色，但不能連續對無色格施法。求左上到右下最少金幣。
constraints:
  - 1 <= m <= 100
  - 1 <= n <= 1000
  - 起點 (1,1) 保證有色
input_format: 第一行 m、n；其後 n 行為 x、y、c，c=0 紅色、c=1 黃色。
output_format: 輸出最少金幣；無法到達輸出 -1。
samples:
  - input: |
      5 7
      1 1 0
      1 2 0
      2 2 1
      3 3 1
      3 4 0
      4 4 1
      5 5 0
    output: '8'
    explanation: 路徑可交替經過原有色格與一次暫時染色格，總成本為 8。
core_knowledge:
  - 非負權狀態圖最短路
  - 暫時顏色與是否剛施法的狀態
judgment: 暫時染色格離開後恢復無色；站在暫時格時不可再對下一個無色格施法。
hints:
  - 位置不足以描述狀態，還要知道目前腳下顏色與上一格是否由魔法產生。
  - 走到原有色格後魔法限制解除，成本由顏色是否相同決定。
  - 邊權為 0、1、2，使用 Dijkstra 對所有狀態求最短路。
solution_outline: 狀態為列、欄、目前顏色、是否位於魔法格。向原有色格移動花顏色差並清除魔法標記；只有標記為假時可花 2 進無色格。Dijkstra 求終點最小距離。
proof_or_invariant: 每個合法行走歷史的未來只由四個狀態量決定，轉移與題目操作一一對應。所有成本非負，Dijkstra 定稿距離即最短；終點所有狀態最小值即答案。
complexity:
  time: O(m^2 log m)
  space: O(m^2)
common_errors:
  - 允許連續踏入兩個無色格
  - 進入原有色格後仍保留魔法限制
  - 用一般 BFS 處理不同邊權
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int m,n;cin>>m>>n;vector<vector<int>> board(m,vector<int>(m,-1));while(n--){int x,y,c;cin>>x>>y>>c;board[x-1][y-1]=c;}const int inf=1e9;using State=array<int,5>;vector dist(m,vector(m,array<array<int,2>,2>{array<int,2>{inf,inf},array<int,2>{inf,inf}}));priority_queue<State,vector<State>,greater<State>> pq;int sc=board[0][0];dist[0][0][sc][0]=0;pq.push({0,0,0,sc,0});constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(!pq.empty()){auto [d,r,c,color,magic]=pq.top();pq.pop();if(d!=dist[r][c][color][magic])continue;for(int k=0;k<4;++k){int nr=r+dr[k],nc=c+dc[k];if(nr<0||nr>=m||nc<0||nc>=m)continue;int nc_color=color,nmagic=0,w=0;if(board[nr][nc]==-1){if(magic)continue;nmagic=1;w=2;}else{nc_color=board[nr][nc];w=(nc_color==color?0:1);}if(d+w<dist[nr][nc][nc_color][nmagic]){dist[nr][nc][nc_color][nmagic]=d+w;pq.push({d+w,nr,nc,nc_color,nmagic});}}}int ans=inf;for(int c=0;c<2;++c)for(int z=0;z<2;++z)ans=min(ans,dist[m-1][m-1][c][z]);cout<<(ans==inf?-1:ans)<<'\n';}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int m,n;cin>>m>>n;vector<vector<int>> board(m,vector<int>(m,-1));while(n--){int x,y,c;cin>>x>>y>>c;board[x-1][y-1]=c;}const int inf=1e9;using State=array<int,5>;vector dist(m,vector(m,array<array<int,2>,2>{array<int,2>{inf,inf},array<int,2>{inf,inf}}));priority_queue<State,vector<State>,greater<State>> pq;int sc=board[0][0];dist[0][0][sc][0]=0;pq.push({0,0,0,sc,0});constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(!pq.empty()){auto [d,r,c,color,magic]=pq.top();pq.pop();if(d!=dist[r][c][color][magic])continue;for(int k=0;k<4;++k){int nr=r+dr[k],nc=c+dc[k];if(nr<0||nr>=m||nc<0||nc>=m)continue;int nc_color=color,nmagic=0,w=0;if(board[nr][nc]==-1){if(magic)continue;nmagic=1;w=2;}else{nc_color=board[nr][nc];w=(nc_color==color?0:1);}if(d+w<dist[nr][nc][nc_color][nmagic]){dist[nr][nc][nc_color][nmagic]=d+w;pq.push({d+w,nr,nc,nc_color,nmagic});}}}int ans=inf;for(int c=0;c<2;++c)for(int z=0;z<2;++z)ans=min(ans,dist[m-1][m-1][c][z]);cout<<(ans==inf?-1:ans)<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3956
external_platform: 洛谷
external_problem_id: P3956
external_title: 棋盤
external_relation: original
source_book_pages:
  - 109
source_pdf_pages:
  - 127
---

本卡片依官方題面重述，解法與程式為獨立撰寫。
