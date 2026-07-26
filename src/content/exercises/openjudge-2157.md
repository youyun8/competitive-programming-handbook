---
id: openjudge-2157
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2157 Maze
chapter: 3
section: '3.3'
kind: external-oj
difficulty: 4
topics:
  - search
prerequisites:
  - graph-search
statement: 迷宮內至多五種門 A..E；要通過某門，必須先收集迷宮中該門種類的所有小寫鑰匙。判斷從 S 能否到寶藏 G。
constraints:
  - 1 < M,N < 20
  - 每種門至少有一把對應鑰匙
  - 0 0 結束
judgment: 拾取鑰匙後永久持有；同種鑰匙必須全部取得，門格本身可有多個。
hints:
  - 先統計每種小寫鑰匙總數。
  - 從目前可達格 flood fill，遇到未開門先記住；撿到鑰匙則增加持有數。
  - 只要某種持有數達總數，就把對應門加入搜尋；持續到沒有新格。
input_format: 每組 M、N，後接 M 行迷宮。
output_format: 可達輸出 YES，否則 NO。
samples:
  - input: |
      4 4
      S.X.
      a.X.
      ..XG
      ....
      3 4
      S.Xa
      .aXB
      b.AG
      0 0
    output: |-
      YES
      NO
    explanation: 第一組可繞過牆到達 G；第二組門的全鑰匙條件造成阻塞。
core_knowledge:
  - 可達區域反覆擴張
  - 門的全體鑰匙條件
solution_outline: BFS 保存已訪格與等待中的門；收齊某類鑰匙時開放所有該類門。
proof_or_invariant: BFS 只進入牆外空格或已滿足條件的門，故所有訪格合法可達。任何合法路徑上的下一格，若非門會被展開；若是門，收齊鑰匙時會被重新加入，故不漏 G。
complexity:
  time: O(MN)
  space: O(MN)
common_errors:
  - 拿到一把就開門
  - 門首次遇到後永久略過
  - 未統計同種鑰匙總數
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int m,n;while(cin>>m>>n&&(m||n)){vector<string>g(m);array<int,5>total{},have{};pair<int,int>start,goal;for(int r=0;r<m;++r){cin>>g[r];for(int c=0;c<n;++c){char ch=g[r][c];if(ch>='a'&&ch<='e')++total[ch-'a'];if(ch=='S')start={r,c};if(ch=='G')goal={r,c};}}vector seen(m,vector<bool>(n));array<vector<pair<int,int>>,5>waiting;queue<pair<int,int>>q;auto add=[&](int r,int c){if(!seen[r][c]){seen[r][c]=true;q.push({r,c});}};add(start.first,start.second);constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(!q.empty()){auto[r,c]=q.front();q.pop();char here=g[r][c];if(here>='a'&&here<='e'){int k=here-'a';++have[k];if(have[k]==total[k])for(auto p:waiting[k])add(p.first,p.second);}for(int k=0;k<4;++k){int nr=r+dr[k],nc=c+dc[k];if(nr<0||nr>=m||nc<0||nc>=n||g[nr][nc]=='X'||seen[nr][nc])continue;char ch=g[nr][nc];if(ch>='A'&&ch<='E'&&have[ch-'A']<total[ch-'A'])waiting[ch-'A'].push_back({nr,nc});else add(nr,nc);}}cout<<(seen[goal.first][goal.second]?"YES\n":"NO\n");}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int m,n;while(cin>>m>>n&&(m||n)){vector<string>g(m);array<int,5>total{},have{};pair<int,int>start,goal;for(int r=0;r<m;++r){cin>>g[r];for(int c=0;c<n;++c){char ch=g[r][c];if(ch>='a'&&ch<='e')++total[ch-'a'];if(ch=='S')start={r,c};if(ch=='G')goal={r,c};}}vector seen(m,vector<bool>(n));array<vector<pair<int,int>>,5>waiting;queue<pair<int,int>>q;auto add=[&](int r,int c){if(!seen[r][c]){seen[r][c]=true;q.push({r,c});}};add(start.first,start.second);constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(!q.empty()){auto[r,c]=q.front();q.pop();char here=g[r][c];if(here>='a'&&here<='e'){int k=here-'a';++have[k];if(have[k]==total[k])for(auto p:waiting[k])add(p.first,p.second);}for(int k=0;k<4;++k){int nr=r+dr[k],nc=c+dc[k];if(nr<0||nr>=m||nc<0||nc>=n||g[nr][nc]=='X'||seen[nr][nc])continue;char ch=g[nr][nc];if(ch>='A'&&ch<='E'&&have[ch-'A']<total[ch-'A'])waiting[ch-'A'].push_back({nr,nc});else add(nr,nc);}}cout<<(seen[goal.first][goal.second]?"YES\n":"NO\n");}}
external_url: http://bailian.openjudge.cn/practice/2157/
external_platform: OpenJudge 百練
external_problem_id: '2157'
external_title: Maze
external_relation: original
source_book_pages:
  - 122
source_pdf_pages:
  - 140
review_status: verified
---

依官方題面獨立重述與實作。
