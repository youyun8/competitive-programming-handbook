---
id: openjudge-2157
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2157 Maze
chapter: 3
section: '3.3'
kind: external-oj
difficulty: 3
topics: [bfs, deferred-edges, keys-and-doors]
prerequisites: [grid-bfs]
statement: 迷宮有至多五類門 A..E 與鑰匙 a..e。某類門必須在找齊迷宮內該類所有鑰匙後才能通過；從 S 只能四方向走，判斷能否抵達寶藏 G。
constraints: ['1 < M,N < 20', 最多五類門, 多組資料以 0 0 結束]
input_format: 每組先給 M、N，再給 M 行迷宮；X 為牆，`.` 為空地。
output_format: 可抵達 G 輸出 YES，否則輸出 NO。
samples:
  - input: "4 4\nS.X.\na.X.\n..XG\n....\n3 4\nS.Xa\n.aXB\nb.AG\n0 0\n"
    output: "YES\nNO"
    explanation: 第一組可繞過牆抵達；第二組無法在通過相關門前找齊鑰匙。
core_knowledge: [延遲展開門格, 全域鑰匙計數, 單調可達集合]
judgment: 開門條件是收集該字母的全部鑰匙，不是任一把；鑰匙收集後永久有效。
hints:
  - 預先統計每類鑰匙總數，BFS 中維護已找到數量。
  - 遇到尚未解鎖的門先放進該類等待清單，不標成已訪問。
  - 找到最後一把某類鑰匙時，把等待中的該類門全部加入 BFS。
solution_outline: 從 S 做 BFS；一般格直接展開，鎖門延遲。每次新鑰匙令計數達總數時釋放對應等待門，直到找到 G 或佇列耗盡。
proof_or_invariant: 佇列與已訪問集合恰為依目前鑰匙可合法到達的格；找齊某類鑰匙只會單調新增該類門邊，釋放等待門補上所有新可達區域。因每格最多正式入隊一次，結束時未訪問 G 即不存在合法路徑。
complexity: { time: 'O(MN)', space: 'O(MN)' }
common_errors: [拿到一把就開門, 鎖門提早標 visited 而無法重新啟用, 取得最後鑰匙後只開一扇門]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { /* TODO：用五個等待清單延遲展開鎖門。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int rows,cols;constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(cin>>rows>>cols&&(rows||cols)){vector<string> grid(rows);pair<int,int> start;int total[5]={},found[5]={};for(int r=0;r<rows;++r){cin>>grid[r];for(int c=0;c<cols;++c){if(grid[r][c]=='S')start={r,c};else if(grid[r][c]>='a'&&grid[r][c]<='e')++total[grid[r][c]-'a'];}}vector seen(rows,vector<bool>(cols));bool waiting_mark[20][20]={};array<vector<pair<int,int>>,5> waiting;queue<pair<int,int>> pending;auto enter=[&](int r,int c){if(!seen[r][c]){seen[r][c]=true;pending.push({r,c});}};enter(start.first,start.second);bool reached=false;while(!pending.empty()){auto [r,c]=pending.front();pending.pop();char cell=grid[r][c];if(cell=='G'){reached=true;break;}if(cell>='a'&&cell<='e'){int type=cell-'a';++found[type];grid[r][c]='.';if(found[type]==total[type])for(auto door:waiting[type])enter(door.first,door.second);}for(int d=0;d<4;++d){int nr=r+dr[d],nc=c+dc[d];if(nr<0||nr>=rows||nc<0||nc>=cols||seen[nr][nc]||grid[nr][nc]=='X')continue;char next=grid[nr][nc];if(next>='A'&&next<='E'&&found[next-'A']<total[next-'A']){if(!waiting_mark[nr][nc]){waiting_mark[nr][nc]=true;waiting[next-'A'].push_back({nr,nc});}}else enter(nr,nc);}}cout<<(reached?"YES":"NO")<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/2157/
external_platform: OpenJudge 百練
external_problem_id: '2157'
external_title: Maze
external_relation: original
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

鑰匙只增加可走邊；利用這個單調性，鎖門可以延遲而不需把鑰匙集合納入狀態。
