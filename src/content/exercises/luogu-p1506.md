---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
difficulty: 3
topics:
  - search
prerequisites:
  - graph-search
id: luogu-p1506
title: 洛谷 P1506 拯救 oibh 總部
section: '3.3'
statement: '`*` 築成圍牆保護總部，`0` 是空地。洪水由矩形外側進入所有與邊界四連通的空地；求未被洪水淹到的空地格數。'
constraints:
  - 1 <= n,m <= 500
  - 地圖只含 0 與 *
  - 洪水只能上下左右流動
judge: 只要能沿 0 到達任一邊界就會淹水；牆格不計答案。
hints:
  - 把所有邊界上的 0 同時加入佇列。
  - BFS 只穿過 0，標記所有外部可達空地。
  - 最後掃描未標記的 0，其數量就是答案。
input_format: 第一行 n、m；接著 n 行地圖。
output_format: 輸出被牆保護、未淹沒的 0 格數。
samples:
  - input: |
      4 5
      00000
      0***0
      0*00*
      0****
    output: '2'
    explanation: 右下內部兩個 0 被星號牆與邊界隔開。
core_knowledge:
  - 邊界多源 flood fill
  - 封閉區域計數
solution_outline: 由四邊所有空格多源 BFS，再計數未訪零格。
proof_or_invariant: 被標記格有通往邊界的零格路徑，必淹沒；任何可淹格反向沿該路徑必由某個 BFS 起點到達。故未標記零格恰為受保護區。
complexity:
  time: O(nm)
  space: O(nm)
common_errors:
  - 只從一個角落開始
  - 把斜角當連通
  - 將牆格計入答案
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;int main(){int n,m;cin>>n>>m;vector<string>g(n);for(auto&s:g)cin>>s;queue<pair<int,int>>q;auto add=[&](int r,int c){if(g[r][c]=='0'){g[r][c]='v';q.push({r,c});}};for(int r=0;r<n;++r){add(r,0);add(r,m-1);}for(int c=0;c<m;++c){add(0,c);add(n-1,c);}constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(!q.empty()){auto[r,c]=q.front();q.pop();for(int k=0;k<4;++k){int nr=r+dr[k],nc=c+dc[k];if(nr>=0&&nr<n&&nc>=0&&nc<m)add(nr,nc);}}int ans=0;for(auto&s:g)ans+=static_cast<int>(count(s.begin(),s.end(),'0'));cout<<ans<<'\n';}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;int main(){int n,m;cin>>n>>m;vector<string>g(n);for(auto&s:g)cin>>s;queue<pair<int,int>>q;auto add=[&](int r,int c){if(g[r][c]=='0'){g[r][c]='v';q.push({r,c});}};for(int r=0;r<n;++r){add(r,0);add(r,m-1);}for(int c=0;c<m;++c){add(0,c);add(n-1,c);}constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(!q.empty()){auto[r,c]=q.front();q.pop();for(int k=0;k<4;++k){int nr=r+dr[k],nc=c+dc[k];if(nr>=0&&nr<n&&nc>=0&&nc<m)add(nr,nc);}}int ans=0;for(auto&s:g)ans+=static_cast<int>(count(s.begin(),s.end(),'0'));cout<<ans<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1506
external_platform: 洛谷
external_problem_id: P1506
external_title: 洛谷 P1506 拯救 oibh 總部
external_relation: original
source_book_pages:
  - 123
source_pdf_pages:
  - 141
review_status: verified
---

依官方或可信存檔題面獨立重述與實作。
