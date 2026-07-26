---
id: openjudge-3435
volume: upper
source_file: upper-volume
title: OpenJudge 百練 3435 Borg Maze
chapter: 3
section: '3.3'
kind: external-oj
difficulty: 4
topics:
  - search
prerequisites:
  - graph-search
statement: 迷宮中一群由 S 出發，抵達 A 後可分裂；總成本是所有群組走過步數總和。求同化所有 A 的最低成本。
constraints:
  - 測試組數 <= 50
  - 1 <= 寬高 <= 50
  - 最多 100 個 A，且皆可達
judgment: 群組只能在 S 或已同化的 A 分裂，成本可表示為連接所有特殊點的樹總長。
hints:
  - 收集 S 與所有 A 作為特殊點。
  - 從每個特殊點做 BFS，得到它到其他特殊點的迷宮距離。
  - 在特殊點完全圖上求 MST；樹邊可依已到達端點分裂實現。
input_format: 每組先給寬、高，再給含空格、#、S、A 的地圖。
output_format: 每組輸出最低總成本。
samples:
  - input: |
      2
      6 5
      ##### 
      #A#A##
      # # A#
      #S  ##
      ##### 
      7 7
      #####  
      #AAA###
      #    A#
      # S ###
      #     #
      #AAA###
      #####
    output: |-
      8
      11
    explanation: 把 S 與所有 A 間迷宮最短距離建完全圖，其最小生成樹權重分別為 8、11。
core_knowledge:
  - 多源點對最短距離
  - 最小生成樹
solution_outline: 對每個特殊點 BFS 建距離矩陣，再用 Prim 求 MST 權重。
proof_or_invariant: 任一搜尋方案的已走通道連接全部特殊點，刪去環不增成本，故至少為某棵生成樹；反之沿 MST 邊在已到達特殊點分裂可實現同成本，最優值等於 MST。
complexity:
  time: O(KWH+K^2)
  space: O(WH+K^2)
common_errors:
  - 直接在網格所有格求 MST
  - 只算 S 到各 A 距離
  - 讀含空格地圖時用 >>
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;string line;getline(cin,line);while(tests--){int w,h;cin>>w>>h;getline(cin,line);vector<string>g(h);vector<pair<int,int>>points;for(int r=0;r<h;++r){getline(cin,g[r]);if(static_cast<int>(g[r].size())<w)g[r]+=string(static_cast<size_t>(w-g[r].size()),' ');for(int c=0;c<w;++c)if(g[r][c]=='S'||g[r][c]=='A')points.push_back({r,c});}int k=static_cast<int>(points.size());vector d(k,vector<int>(k));constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};for(int s=0;s<k;++s){vector dist(h,vector<int>(w,-1));queue<pair<int,int>>q;q.push(points[s]);dist[points[s].first][points[s].second]=0;while(!q.empty()){auto[r,c]=q.front();q.pop();for(int z=0;z<4;++z){int nr=r+dr[z],nc=c+dc[z];if(nr>=0&&nr<h&&nc>=0&&nc<w&&g[nr][nc]!='#'&&dist[nr][nc]<0){dist[nr][nc]=dist[r][c]+1;q.push({nr,nc});}}}for(int t=0;t<k;++t)d[s][t]=dist[points[t].first][points[t].second];}vector<int>best(k,1e9);vector<bool>used(k);best[0]=0;int answer=0;for(int it=0;it<k;++it){int v=-1;for(int i=0;i<k;++i)if(!used[i]&&(v<0||best[i]<best[v]))v=i;used[v]=true;answer+=best[v];for(int i=0;i<k;++i)best[i]=min(best[i],d[v][i]);}cout<<answer<<'\n';}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;string line;getline(cin,line);while(tests--){int w,h;cin>>w>>h;getline(cin,line);vector<string>g(h);vector<pair<int,int>>points;for(int r=0;r<h;++r){getline(cin,g[r]);if(static_cast<int>(g[r].size())<w)g[r]+=string(static_cast<size_t>(w-g[r].size()),' ');for(int c=0;c<w;++c)if(g[r][c]=='S'||g[r][c]=='A')points.push_back({r,c});}int k=static_cast<int>(points.size());vector d(k,vector<int>(k));constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};for(int s=0;s<k;++s){vector dist(h,vector<int>(w,-1));queue<pair<int,int>>q;q.push(points[s]);dist[points[s].first][points[s].second]=0;while(!q.empty()){auto[r,c]=q.front();q.pop();for(int z=0;z<4;++z){int nr=r+dr[z],nc=c+dc[z];if(nr>=0&&nr<h&&nc>=0&&nc<w&&g[nr][nc]!='#'&&dist[nr][nc]<0){dist[nr][nc]=dist[r][c]+1;q.push({nr,nc});}}}for(int t=0;t<k;++t)d[s][t]=dist[points[t].first][points[t].second];}vector<int>best(k,1e9);vector<bool>used(k);best[0]=0;int answer=0;for(int it=0;it<k;++it){int v=-1;for(int i=0;i<k;++i)if(!used[i]&&(v<0||best[i]<best[v]))v=i;used[v]=true;answer+=best[v];for(int i=0;i<k;++i)best[i]=min(best[i],d[v][i]);}cout<<answer<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/3435/
external_platform: OpenJudge 百練
external_problem_id: '3435'
external_title: Borg Maze
external_relation: original
source_book_pages:
  - 122
source_pdf_pages:
  - 140
review_status: verified
---

依官方題面獨立重述與實作。
