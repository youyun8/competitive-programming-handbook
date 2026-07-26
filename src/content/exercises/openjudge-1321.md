---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
review_status: verified
id: openjudge-1321
title: OpenJudge 百練 1321 棋盤問題
section: '3.1'
difficulty: 2
topics:
  - depth-first-search
  - backtracking
prerequisites:
  - recursion
statement: 在 n×n 的不規則棋盤上選 k 個 `#` 格放置棋子，使任兩棋子不同列且不同欄，求方案數。
constraints:
  - 1 <= n <= 8
  - 1 <= k <= n
  - 答案小於 2^31；以 -1 -1 結束
input_format: 多組資料：n、k 後接 n 行棋盤；-1 -1 結束。
output_format: 每組輸出合法方案數。
samples:
  - input: |
      2 1
      #.
      .#
      4 4
      ...#
      ..#.
      .#..
      #...
      -1 -1
    output: |-
      2
      1
    explanation: 第一組兩個 `#` 都可單獨選；第二組只有反對角線四格能同時放置。
core_knowledge:
  - 逐列選或略過
  - 欄占用回溯
judgment: 棋子無區別；可略過某列，因為 k 不一定等於 n。
hints:
  - 以列作為遞迴層，便能自動避免同行。
  - 每列可不放，或在尚未占用的 `#` 欄放一枚。
  - 已放數加剩餘列數少於 k 時可停止分支。
solution_outline: DFS 逐列處理，以布林陣列標記已用欄；枚舉略過或選一個合法格，放滿 k 枚時計數。
proof_or_invariant: 進入某列時，已選棋子皆位於先前不同列且 used 欄互異。每個合法配置在當列只有略過或選其唯一格兩種對應分支，故被恰計一次。
complexity:
  time: O((n+1)^n)
  space: O(n)
common_errors:
  - 強迫每列都放棋子
  - 未撤銷欄標記
  - 把點號當可放區域
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;while(cin>>n>>k&&n!=-1){vector<string>b(n);for(auto& s:b)cin>>s;vector<bool>used(n);int answer=0;const auto dfs=[&](const auto& self,int row,int placed)->void{if(placed==k){++answer;return;}if(row==n||placed+n-row<k)return;self(self,row+1,placed);for(int c=0;c<n;++c)if(b[row][c]=='#'&&!used[c]){used[c]=true;self(self,row+1,placed+1);used[c]=false;}};dfs(dfs,0,0);cout<<answer<<'\n';}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k;while(cin>>n>>k&&n!=-1){vector<string>b(n);for(auto& s:b)cin>>s;vector<bool>used(n);int answer=0;const auto dfs=[&](const auto& self,int row,int placed)->void{if(placed==k){++answer;return;}if(row==n||placed+n-row<k)return;self(self,row+1,placed);for(int c=0;c<n;++c)if(b[row][c]=='#'&&!used[c]){used[c]=true;self(self,row+1,placed+1);used[c]=false;}};dfs(dfs,0,0);cout<<answer<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/1321/
external_platform: OpenJudge 百練
external_problem_id: '1321'
external_title: OpenJudge 百練 1321 棋盤問題
external_relation: original
source_book_pages:
  - 109
source_pdf_pages:
  - 127
---

本卡片依官方題面重述，解法與程式為獨立撰寫。
