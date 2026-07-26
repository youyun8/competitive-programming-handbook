---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
review_status: verified
id: openjudge-2251
title: OpenJudge 百練 2251 Dungeon Master
section: '3.1'
difficulty: 2
topics:
  - breadth-first-search
  - 3d-grid
prerequisites:
  - queue
statement: 在 L×R×C 三維地牢中，每分鐘可往六個軸向相鄰空格移動，岩石不可進入。求 S 到 E 的最短逃脫時間。
constraints:
  - 1 <= L,R,C <= 30
  - '地牢由 #、.、S、E 組成'
  - 0 0 0 結束
input_format: 多組 L、R、C，後接 L 層各 R 行；空白行可由字串讀取自然略過。
output_format: 可達輸出 `Escaped in x minute(s).`，否則 `Trapped!`。
samples:
  - input: |
      1 3 3
      S..
      .#.
      ..E
      0 0 0
    output: Escaped in 4 minute(s).
    explanation: 沿同一層繞過中央岩石需四步。
core_knowledge:
  - 三維無權最短路
  - 六方向位移
judgment: 上下層移動與平面四方向同樣耗時一分鐘。
hints:
  - 以 (level,row,column) 作為 BFS 節點。
  - 距離初始化為 -1，第一次到達時設為前一格加一。
  - 枚舉六個軸向位移；取出出口時即可輸出距離。
solution_outline: 定位 S，使用三維距離陣列做六方向 BFS，最後讀取 E 距離。
proof_or_invariant: 每次合法移動都是單位邊，BFS 按步數非遞減展開；第一次抵達每格必是最短路，出口距離因此正確。
complexity:
  time: O(LRC)
  space: O(LRC)
common_errors:
  - 只枚舉同層四方向
  - 沒有重設每組距離
  - 輸出 minute(s) 格式錯誤
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int l,r,c;while(cin>>l>>r>>c&&(l||r||c)){vector grid(l,vector<string>(r));array<int,3>s{},e{};for(int z=0;z<l;++z)for(int x=0;x<r;++x){cin>>grid[z][x];for(int y=0;y<c;++y){if(grid[z][x][y]=='S')s={z,x,y};if(grid[z][x][y]=='E')e={z,x,y};}}vector dist(l,vector(r,vector<int>(c,-1)));queue<array<int,3>>q;q.push(s);dist[s[0]][s[1]][s[2]]=0;constexpr int dz[6]={1,-1,0,0,0,0},dx[6]={0,0,1,-1,0,0},dy[6]={0,0,0,0,1,-1};while(!q.empty()){auto p=q.front();q.pop();for(int k=0;k<6;++k){int nz=p[0]+dz[k],nx=p[1]+dx[k],ny=p[2]+dy[k];if(nz<0||nz>=l||nx<0||nx>=r||ny<0||ny>=c||grid[nz][nx][ny]=='#'||dist[nz][nx][ny]!=-1)continue;dist[nz][nx][ny]=dist[p[0]][p[1]][p[2]]+1;q.push({nz,nx,ny});}}int answer=dist[e[0]][e[1]][e[2]];if(answer<0)cout<<"Trapped!\n";else cout<<"Escaped in "<<answer<<" minute(s).\n";}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int l,r,c;while(cin>>l>>r>>c&&(l||r||c)){vector grid(l,vector<string>(r));array<int,3>s{},e{};for(int z=0;z<l;++z)for(int x=0;x<r;++x){cin>>grid[z][x];for(int y=0;y<c;++y){if(grid[z][x][y]=='S')s={z,x,y};if(grid[z][x][y]=='E')e={z,x,y};}}vector dist(l,vector(r,vector<int>(c,-1)));queue<array<int,3>>q;q.push(s);dist[s[0]][s[1]][s[2]]=0;constexpr int dz[6]={1,-1,0,0,0,0},dx[6]={0,0,1,-1,0,0},dy[6]={0,0,0,0,1,-1};while(!q.empty()){auto p=q.front();q.pop();for(int k=0;k<6;++k){int nz=p[0]+dz[k],nx=p[1]+dx[k],ny=p[2]+dy[k];if(nz<0||nz>=l||nx<0||nx>=r||ny<0||ny>=c||grid[nz][nx][ny]=='#'||dist[nz][nx][ny]!=-1)continue;dist[nz][nx][ny]=dist[p[0]][p[1]][p[2]]+1;q.push({nz,nx,ny});}}int answer=dist[e[0]][e[1]][e[2]];if(answer<0)cout<<"Trapped!\n";else cout<<"Escaped in "<<answer<<" minute(s).\n";}}
external_url: http://bailian.openjudge.cn/practice/2251/
external_platform: OpenJudge 百練
external_problem_id: '2251'
external_title: OpenJudge 百練 2251 Dungeon Master
external_relation: original
source_book_pages:
  - 109
source_pdf_pages:
  - 127
---

本卡片依官方題面重述，解法與程式為獨立撰寫。
