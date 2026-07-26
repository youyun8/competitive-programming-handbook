---
id: luogu-p2346
volume: upper
source_file: upper-volume
title: 洛谷 P2346 四子連棋
chapter: 3
section: '3.9'
kind: external-oj
difficulty: 4
topics: [bfs, state-compression]
prerequisites: [alternating-turns, hashing]
statement: 4×4 棋盤有七黑、七白與兩空格。黑白交替把己方棋移到上下左右相鄰空格，任一方可先走；求首次出現同色橫、直或對角四連線的最少步數。
constraints: [棋盤固定 4×4, B 與 W 各七枚, O 為兩個空格]
input_format: 四行各四字元的初始棋局。
output_format: 輸出達成任一同色四連線的最少步數。
samples:
  - input: |
      BWBO
      WBWB
      BWBW
      WBWO
    output: '5'
    explanation: 依任一方可先走且之後交替的規則，最少五步能形成同色四連線。
core_knowledge: [三進位棋盤編碼, 帶回合 BFS, 多源起點]
judgment: 只有目前回合顏色能移動；任一方可先手，初態若已連線答案為零。
hints:
  - 狀態不只包含棋盤，還要包含下一步輪到 B 或 W。
  - 同時把「黑先走」與「白先走」兩個初始狀態以距離零入隊。
  - 用 0/1/2 表示空、黑、白，十六格可編成三進位整數判重。
solution_outline: 多源 BFS 搜尋 `(board,turn)`；枚舉每個空格相鄰且顏色等於 turn 的棋子交換，下一回合換色，生成後檢查八條勝利線。
proof_or_invariant: 狀態中的 turn 精確維持交替規則，每條生成邊是一個合法行棋且每個合法行棋都被生成。兩種可選先手均以零距離入隊，BFS 第一次生成目標狀態的層數就是所有合法行棋序列的最短長度。
complexity: { time: 'O(2·3^16)', space: 'O(2·3^16)' }
common_errors: [判重時忽略回合, 只允許固定顏色先手, 漏檢查兩條長對角線]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string board,row;for(int i=0;i<4;++i){cin>>row;board+=row;}/* TODO: 對兩種先手做帶回合 BFS。*/(void)board;cout<<0<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct State{string board;int turn;int distance;};
  bool won(const string&b){constexpr int lines[10][4]={{0,1,2,3},{4,5,6,7},{8,9,10,11},{12,13,14,15},{0,4,8,12},{1,5,9,13},{2,6,10,14},{3,7,11,15},{0,5,10,15},{3,6,9,12}};for(const auto&line:lines)if(b[line[0]]!='O'&&b[line[0]]==b[line[1]]&&b[line[1]]==b[line[2]]&&b[line[2]]==b[line[3]])return true;return false;}
  int code(const string&b,int turn){int value=turn,power=2;for(char cell:b){int digit=(cell=='O'?0:(cell=='B'?1:2));value+=digit*power;power*=3;}return value;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string board,row;for(int i=0;i<4;++i){cin>>row;board+=row;}if(won(board)){cout<<0<<'\n';return 0;}queue<State>q;unordered_set<int>seen;for(int turn=0;turn<2;++turn){q.push({board,turn,0});seen.insert(code(board,turn));}constexpr array<int,4>dx={1,-1,0,0},dy={0,0,1,-1};while(!q.empty()){State current=q.front();q.pop();char color=current.turn==0?'B':'W';for(int empty=0;empty<16;++empty)if(current.board[empty]=='O'){int x=empty/4,y=empty%4;for(int d=0;d<4;++d){int nx=x+dx[d],ny=y+dy[d];if(nx<0||nx>=4||ny<0||ny>=4)continue;int piece=nx*4+ny;if(current.board[piece]!=color)continue;string next=current.board;swap(next[empty],next[piece]);if(won(next)){cout<<current.distance+1<<'\n';return 0;}int key=code(next,1-current.turn);if(seen.insert(key).second)q.push({move(next),1-current.turn,current.distance+1});}}}}
external_url: https://www.luogu.com.cn/problem/P2346
external_platform: 洛谷
external_problem_id: P2346
external_title: 四子連棋
external_relation: original
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

棋盤相同但輪到不同顏色時，後續合法邊集合不同，必須視為兩個狀態。
