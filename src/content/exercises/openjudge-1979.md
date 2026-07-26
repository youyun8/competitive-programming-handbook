---
volume: upper
source_file: upper-volume
chapter: 3
section: '3.3'
kind: external-oj
difficulty: 3
topics:
  - search
prerequisites:
  - recursion
id: openjudge-1979
title: OpenJudge 百練 1979 Red and Black
statement: 矩形房間中 `.` 與 `@` 是可走黑格，`#` 是紅格。由唯一 `@` 四向移動，計算可到達黑格數，含起點。
constraints:
  - W,H <= 20
  - 每組恰有一個 @
  - 0 0 結束
judgment: 只可上下左右移動，不能斜走。
hints:
  - 從 @ 作為唯一搜尋起點。
  - '每次只把界內、非 #、未訪格加入佇列。'
  - 入隊時標記並計數，避免重複加入。
input_format: 每組 W、H，後接 H 行各 W 字元。
output_format: 每組輸出可達格數。
samples:
  - input: |
      7 7
      ..#.#..
      ..#.#..
      ###.###
      ...@...
      ###.###
      ..#.#..
      ..#.#..
      0 0
    output: '13'
    explanation: 由中央可走到十字形連通區，共十三格。
core_knowledge:
  - 網格 flood fill
  - 連通分量大小
solution_outline: BFS 或 DFS 淹水起點所在連通分量。
proof_or_invariant: 搜尋只沿合法邊，故標記格皆可達；任一可達格沿路徑歸納必被展開，故計數恰為連通分量大小。
common_errors:
  - 未計入起點
  - 把 W、H 讀反
  - 用八方向
complexity:
  time: O(WH)
  space: O(WH)
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int w,h;while(cin>>w>>h&&(w||h)){vector<string>g(h);pair<int,int>s;for(int r=0;r<h;++r){cin>>g[r];for(int c=0;c<w;++c)if(g[r][c]=='@')s={r,c};}queue<pair<int,int>>q;q.push(s);g[s.first][s.second]='#';int answer=0;constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(!q.empty()){auto[r,c]=q.front();q.pop();++answer;for(int k=0;k<4;++k){int nr=r+dr[k],nc=c+dc[k];if(nr>=0&&nr<h&&nc>=0&&nc<w&&g[nr][nc]!='#'){g[nr][nc]='#';q.push({nr,nc});}}}cout<<answer<<'\n';}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int w,h;while(cin>>w>>h&&(w||h)){vector<string>g(h);pair<int,int>s;for(int r=0;r<h;++r){cin>>g[r];for(int c=0;c<w;++c)if(g[r][c]=='@')s={r,c};}queue<pair<int,int>>q;q.push(s);g[s.first][s.second]='#';int answer=0;constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(!q.empty()){auto[r,c]=q.front();q.pop();++answer;for(int k=0;k<4;++k){int nr=r+dr[k],nc=c+dc[k];if(nr>=0&&nr<h&&nc>=0&&nc<w&&g[nr][nc]!='#'){g[nr][nc]='#';q.push({nr,nc});}}}cout<<answer<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/1979/
external_platform: OpenJudge 百練
external_problem_id: '1979'
external_title: Red and Black
external_relation: original
source_book_pages:
  - 123
source_pdf_pages:
  - 141
review_status: verified
---

依官方題面獨立重述與實作。
