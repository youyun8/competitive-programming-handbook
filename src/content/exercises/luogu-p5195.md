---
id: luogu-p5195
volume: upper
source_file: upper-volume
title: 洛谷 P5195 Knights of Ni S
chapter: 3
section: '3.5'
kind: external-oj
difficulty: 3
topics: [bfs, shortest-path, meet-at-required-node]
prerequisites: [grid-bfs]
statement: 在 W×H 地圖中，貝茜由唯一的 2 出發，必須先到任一灌木 4，再到騎士 3；1 不可通行，且沒有灌木時不能進入騎士格。每次四方向移動一格耗一天，求最少天數。
constraints: ['1 <= W,H <= 1000', 保證存在可行方案]
input_format: 第一行 W、H，之後依列給 W×H 個地形數字；實體輸入行可能在每 40 個數字後換行。
output_format: 輸出取得灌木後抵達騎士的最少天數。
samples:
  - input: "8 4\n4 1 0 0 0 0 1 0\n0 0 0 1 0 1 0 0\n0 2 1 1 3 0 4 0\n0 0 0 4 1 1 1 0\n"
    output: '11'
    explanation: 對每個灌木合併起點距離與騎士距離，最小總和為 11。
core_knowledge: [兩次 BFS, 必經點距離分解, 網格最短路]
judgment: 起點到灌木的路徑不能穿過騎士格；取得灌木後則可由該灌木走到騎士。
hints:
  - 從起點 BFS 到所有格，但把地形 3 當牆，得到每株灌木的第一段距離。
  - 再從騎士反向 BFS 所有非牆格，得到每株灌木的第二段距離。
  - 對所有地形 4 取兩段距離和最小值。
solution_outline: 執行兩次無權網格 BFS；第一遍禁止騎士格，第二遍只禁止一般障礙，枚舉灌木合併距離。
proof_or_invariant: 任一合法方案首次取得某株灌木時可分成起點到該灌木及該灌木到騎士兩段，兩段至少是對應 BFS 距離；反之兩條最短路串接即為合法方案，因此所有灌木距離和的最小值恰是答案。
complexity: { time: 'O(WH)', space: 'O(WH)' }
common_errors: [第一遍允許先穿過騎士, 對每株灌木各跑一次 BFS, 把 W 與 H 顛倒]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { /* TODO：從起點與騎士各做一次 BFS。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int w,h;cin>>w>>h;vector grid(h,vector<int>(w));pair<int,int> start,target;vector<pair<int,int>> shrubs;for(int r=0;r<h;++r)for(int c=0;c<w;++c){cin>>grid[r][c];if(grid[r][c]==2)start={r,c};else if(grid[r][c]==3)target={r,c};else if(grid[r][c]==4)shrubs.push_back({r,c});}constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};auto bfs=[&](pair<int,int> source,bool block_target){vector distance(h,vector<int>(w,-1));queue<pair<int,int>> pending;pending.push(source);distance[source.first][source.second]=0;while(!pending.empty()){auto [r,c]=pending.front();pending.pop();for(int d=0;d<4;++d){int nr=r+dr[d],nc=c+dc[d];if(nr<0||nr>=h||nc<0||nc>=w||distance[nr][nc]>=0||grid[nr][nc]==1||(block_target&&grid[nr][nc]==3))continue;distance[nr][nc]=distance[r][c]+1;pending.push({nr,nc});}}return distance;};auto from_start=bfs(start,true),from_target=bfs(target,false);int answer=numeric_limits<int>::max();for(auto [r,c]:shrubs)if(from_start[r][c]>=0&&from_target[r][c]>=0)answer=min(answer,from_start[r][c]+from_target[r][c]);cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P5195
external_platform: 洛谷
external_problem_id: P5195
external_title: '[USACO05DEC] Knights of Ni S'
external_relation: original
source_book_pages: [97, 149]
source_pdf_pages: [115, 167]
review_status: verified
---

「必先取物」把路徑拆成經過某株灌木的兩段最短路。
