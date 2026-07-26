---
volume: upper
source_file: upper-volume
chapter: 3
section: '3.2'
kind: external-oj
difficulty: 3
topics:
  - search
prerequisites:
  - recursion
id: openjudge-2982
title: OpenJudge 百練 2982 Sudoku
statement: 完成多組 9×9 數獨，使每列、欄及每個 3×3 宮都恰含 1..9；0 表示空格，多解可輸出任一解。
constraints:
  - 固定 9×9
  - 首行為測試組數
  - 題目保證可按規則求解
judgment: 多解時任何一組完整合法盤面都接受。
hints:
  - 以三組九位遮罩記錄列、欄、宮已用數字。
  - 每層選候選數最少的空格。
  - 逐一取候選最低位填入，成功後停止，失敗則撤銷遮罩。
input_format: 每組九行，每行九個數字字元。
output_format: 每組輸出解出的九行，不加空白。
samples:
  - input: |
      1
      103000509
      002109400
      000704000
      300502006
      060000050
      700803004
      000401000
      009205800
      804000107
    output: |-
      143628579
      572139468
      986754231
      391542786
      468917352
      725863914
      237481695
      619275843
      854396127
    explanation: 輸出每列、欄、宮皆含 1..9，且保留所有已知數。
core_knowledge:
  - 數獨位元遮罩
  - MRV 回溯
solution_outline: 建立遮罩與空格列表，以 MRV 選格做位元回溯。
proof_or_invariant: 遮罩使每次填值保持三種唯一性；候選恰是所有合法值。MRV 只改順序，DFS 成功時盤面合法且完整。
common_errors:
  - 宮索引錯誤
  - 回溯未撤銷遮罩
  - 輸出時加入空白
complexity:
  time: 最壞 O(9^E)
  space: O(E)
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;while(tests--){vector<string>b(9);array<int,9>row{},col{},box{};vector<pair<int,int>>empty;for(int r=0;r<9;++r){cin>>b[r];for(int c=0;c<9;++c)if(b[r][c]=='0')empty.push_back({r,c});else{int bit=1<<(b[r][c]-'0');row[r]|=bit;col[c]|=bit;box[(r/3)*3+c/3]|=bit;}}const auto dfs=[&](const auto&self,int pos)->bool{if(pos==static_cast<int>(empty.size()))return true;int best=pos,count=10;for(int i=pos;i<static_cast<int>(empty.size());++i){auto[r,c]=empty[i];int mask=(~(row[r]|col[c]|box[(r/3)*3+c/3]))&0x3FE;int now=__builtin_popcount(static_cast<unsigned>(mask));if(now<count){count=now;best=i;}}swap(empty[pos],empty[best]);auto[r,c]=empty[pos];int k=(r/3)*3+c/3,mask=(~(row[r]|col[c]|box[k]))&0x3FE;while(mask){int bit=mask&-mask;mask-=bit;int d=__builtin_ctz(static_cast<unsigned>(bit));b[r][c]=static_cast<char>('0'+d);row[r]|=bit;col[c]|=bit;box[k]|=bit;if(self(self,pos+1))return true;row[r]^=bit;col[c]^=bit;box[k]^=bit;}swap(empty[pos],empty[best]);return false;};dfs(dfs,0);for(auto&s:b)cout<<s<<'\n';}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int tests;cin>>tests;while(tests--){vector<string>b(9);array<int,9>row{},col{},box{};vector<pair<int,int>>empty;for(int r=0;r<9;++r){cin>>b[r];for(int c=0;c<9;++c)if(b[r][c]=='0')empty.push_back({r,c});else{int bit=1<<(b[r][c]-'0');row[r]|=bit;col[c]|=bit;box[(r/3)*3+c/3]|=bit;}}const auto dfs=[&](const auto&self,int pos)->bool{if(pos==static_cast<int>(empty.size()))return true;int best=pos,count=10;for(int i=pos;i<static_cast<int>(empty.size());++i){auto[r,c]=empty[i];int mask=(~(row[r]|col[c]|box[(r/3)*3+c/3]))&0x3FE;int now=__builtin_popcount(static_cast<unsigned>(mask));if(now<count){count=now;best=i;}}swap(empty[pos],empty[best]);auto[r,c]=empty[pos];int k=(r/3)*3+c/3,mask=(~(row[r]|col[c]|box[k]))&0x3FE;while(mask){int bit=mask&-mask;mask-=bit;int d=__builtin_ctz(static_cast<unsigned>(bit));b[r][c]=static_cast<char>('0'+d);row[r]|=bit;col[c]|=bit;box[k]|=bit;if(self(self,pos+1))return true;row[r]^=bit;col[c]^=bit;box[k]^=bit;}swap(empty[pos],empty[best]);return false;};dfs(dfs,0);for(auto&s:b)cout<<s<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/2982/
external_platform: OpenJudge 百練
external_problem_id: '2982'
external_title: Sudoku
external_relation: original
source_book_pages:
  - 121
source_pdf_pages:
  - 139
review_status: verified
---

依官方題面獨立重述與實作。
