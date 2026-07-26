---
id: luogu-p1312
volume: upper
source_file: upper-volume
title: 洛谷 P1312 Mayan 遊戲
chapter: 3
section: '3.2'
kind: external-oj
difficulty: 5
topics: [backtracking, simulation, pruning]
prerequisites: [dfs]
statement: 7 行 5 列棋盤中，每次把一個方塊向左右相鄰列交換；之後方塊下落，橫向或直向連續至少三個同色方塊同時消除，反覆至穩定。要求恰好 n 步清空棋盤，輸出字典序最小方案。
constraints: ['0 < n <= 5', 棋盤 7×5, 顏色不超過 10 種, 初態沒有可立即消除方塊]
input_format: 第一行 n；接著五行分別描述各直列，由下而上給顏色並以 0 結束。
output_format: 有解輸出 n 行 `x y g`，g=1 向右、g=-1 向左；無解輸出 -1。
samples:
  - input: "3\n1 0\n2 1 0\n2 3 4 0\n3 1 0\n2 4 3 4 0\n"
    output: "2 1 1\n3 1 1\n3 0 1"
    explanation: 依序執行三次右移後，連鎖消除清空棋盤。
core_knowledge: [重力與同步消除模擬, 深度受限 DFS, 顏色數剪枝]
judgment: 每輪所有符合條件方塊須同步刪除，再下落並繼續檢查；少於三個的殘存顏色永遠不可能消除。
hints:
  - 每次交換後先壓實各列，再標記所有橫、直三連塊同步清除，直到沒有新消除。
  - 若某非零顏色剩一或兩塊，直接剪枝。
  - 依 x、y 遞增枚舉，對同一格先右後左；左移只需在左格為空時枚舉，其他情況已由相鄰格右移涵蓋。
solution_outline: 以棋盤快照回溯至固定深度 n，按題目字典序枚舉有效交換，完整模擬穩定化並套用顏色數剪枝；深度 n 時只接受空棋盤。
proof_or_invariant: 穩定化每輪先標記後清除，等價於題目同步規則，且方塊數嚴格減少所以必終止。枚舉略去的「向左交換非空格」與左鄰方塊向右是同一交換，故不漏不同棋局；DFS 首個深度 n 解即為指定字典序最小方案。
complexity: { time: 'O(10^n·35)，n<=5', space: 'O(n·35)' }
common_errors: [邊掃描邊消除造成非同步, 只做一次連鎖消除, 接受少於 n 步的清空狀態]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { /* TODO：交換後反覆執行下落與同步消除。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  using Board=array<array<int,7>,5>;struct Move{int x,y,d;};int required_steps;array<Move,5> answer;
  void settle(Board&b){while(true){for(int x=0;x<5;++x){int write=0;for(int y=0;y<7;++y)if(b[x][y])b[x][write++]=b[x][y];while(write<7)b[x][write++]=0;}bool remove[5][7]={},any=false;for(int x=0;x<5;++x)for(int y=0;y<7;++y)if(b[x][y]){if(x+2<5&&b[x][y]==b[x+1][y]&&b[x][y]==b[x+2][y])for(int k=x;k<5&&b[k][y]==b[x][y];++k)remove[k][y]=true;if(y+2<7&&b[x][y]==b[x][y+1]&&b[x][y]==b[x][y+2])for(int k=y;k<7&&b[x][k]==b[x][y];++k)remove[x][k]=true;}for(int x=0;x<5;++x)for(int y=0;y<7;++y)if(remove[x][y]){b[x][y]=0;any=true;}if(!any)break;}}
  bool possible(const Board&b){int count[11]={};for(auto column:b)for(int value:column)if(value)++count[value];for(int color=1;color<=10;++color)if(count[color]>0&&count[color]<3)return false;return true;}
  bool empty(const Board&b){for(auto column:b)for(int value:column)if(value)return false;return true;}
  bool search(Board&b,int depth){if(depth==required_steps)return empty(b);if(empty(b)||!possible(b))return false;for(int x=0;x<5;++x)for(int y=0;y<7&&b[x][y];++y){if(x<4&&b[x][y]!=b[x+1][y]){Board next=b;swap(next[x][y],next[x+1][y]);settle(next);answer[depth]={x,y,1};if(search(next,depth+1))return true;}if(x>0&&b[x-1][y]==0){Board next=b;swap(next[x][y],next[x-1][y]);settle(next);answer[depth]={x,y,-1};if(search(next,depth+1))return true;}}return false;}
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);cin>>required_steps;Board board{};for(int x=0;x<5;++x)for(int y=0,value;cin>>value&&value;++y)board[x][y]=value;if(!search(board,0)){cout<<-1<<'\n';return 0;}for(int i=0;i<required_steps;++i)cout<<answer[i].x<<' '<<answer[i].y<<' '<<answer[i].d<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1312
external_platform: 洛谷
external_problem_id: P1312
external_title: Mayan 遊戲
external_relation: original
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

搜尋深度很小，正確且可回溯的同步消除模擬比複雜估價更重要。
