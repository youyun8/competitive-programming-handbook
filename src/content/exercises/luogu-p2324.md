---
id: luogu-p2324
volume: upper
source_file: upper-volume
title: 洛谷 P2324 [SCOI2005] 騎士精神
chapter: 3
section: '3.9'
kind: external-oj
difficulty: 4
topics: [ida-star, board-search]
prerequisites: [iterative-deepening, knight-moves]
statement: 5×5 棋盤含十二個 0、十二個 1 與一個空格；每步把與空格呈騎士步關係的棋子移入空格，求到指定目標棋盤的最少步數。
constraints: [T <= 10, 棋盤固定 5×5, 只需判斷 15 步內可達]
input_format: 第一行 T；每組五行，每行五個字元。
output_format: 十五步內可達輸出最少步數，否則輸出 -1。
samples:
  - input: |
      2
      10110
      01*11
      10111
      01001
      00000
      01011
      110*1
      01110
      01010
      00100
    output: |
      7
      -1
    explanation: 第一盤最少七步；第二盤不存在十五步內解。
core_knowledge: [IDA*, 不匹配棋子下界, 立即回頭剪枝]
judgment: 目標依序為 `11111/01111/00*11/00001/00000`。
hints:
  - 深度限制從零增加到十五，找到的第一個解就是最短解。
  - 每步最多讓一枚棋子回到正確位置，所以非空格不匹配數是剩餘步數下界。
  - 記住上一個空格位置，禁止下一步立即交換回去。
solution_outline: 以字串保存棋盤及空格位置。IDA* 每層枚舉八個騎士交換；若 depth+不匹配數超限即剪枝。
proof_or_invariant: 每次交換精確模擬一次合法移動。一次移動只改變一枚棋子所在格，故不匹配棋子數最多減一，是不高估的下界。限深 DFS 完整枚舉該深度內路徑，逐深度搜尋首個成功值即最短值。
complexity: { time: 'O(8^15)，由下界與回頭剪枝大幅降低', space: O(15) }
common_errors: [把空格也計入下界而高估, 目標棋盤抄錯, 找到超過十五步的解仍輸出]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;while(tests--){string board,row;for(int i=0;i<5;++i){cin>>row;board+=row;}/* TODO: IDA* */(void)board;cout<<-1<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);const string goal="111110111100*110000100000";constexpr array<int,8>dx={1,1,2,2,-1,-1,-2,-2};constexpr array<int,8>dy={2,-2,1,-1,2,-2,1,-1};int tests;cin>>tests;while(tests--){string board,row;for(int i=0;i<5;++i){cin>>row;board+=row;}int blank=static_cast<int>(board.find('*'));const auto dfs=[&](const auto&self,int depth,int limit,int empty,int previous)->bool{int wrong=0;for(int i=0;i<25;++i)if(board[i]!='*'&&board[i]!=goal[i])++wrong;if(depth+wrong>limit)return false;if(board==goal)return true;int x=empty/5,y=empty%5;for(int d=0;d<8;++d){int nx=x+dx[d],ny=y+dy[d];if(nx<0||nx>=5||ny<0||ny>=5)continue;int next=nx*5+ny;if(next==previous)continue;swap(board[empty],board[next]);if(self(self,depth+1,limit,next,empty))return true;swap(board[empty],board[next]);}return false;};int answer=-1;for(int limit=0;limit<=15;++limit)if(dfs(dfs,0,limit,blank,-1)){answer=limit;break;}cout<<answer<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P2324
external_platform: 洛谷
external_problem_id: P2324
external_title: '[SCOI2005] 騎士精神'
external_relation: original
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

下界必須只計算棋子錯位；空格的位置會在所有棋子正確時自然確定。
