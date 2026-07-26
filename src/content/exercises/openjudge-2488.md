---
volume: upper
source_file: upper-volume
chapter: 3
kind: external-oj
review_status: verified
id: openjudge-2488
title: OpenJudge 百練 2488 A Knight's Journey
section: '3.1'
difficulty: 2
topics:
  - depth-first-search
  - hamiltonian-path
  - lexicographic-order
prerequisites:
  - backtracking
statement: 在 p×q 棋盤找一條馬的路徑，恰好造訪每格一次；起終點任意。輸出以「欄字母+列數字」串接的字典序最小路徑，無解輸出 impossible。
constraints:
  - 1 <= p*q <= 26
  - 欄依序為 A、B…，列為 1..p
  - 有多組情境
input_format: 第一行測試數；每組一行 p、q。
output_format: '每組輸出 `Scenario #i:`、答案或 impossible，之後空一行。'
samples:
  - input: |
      3
      1 1
      2 3
      4 3
    output: |-
      Scenario #1:
      A1

      Scenario #2:
      impossible

      Scenario #3:
      A1B3C1A2B4C2A3B1C3A4B2C4
    explanation: 第三組按格名的字典序搜尋，第一條完整路徑即所列答案。
core_knowledge:
  - 騎士巡遊回溯
  - 依輸出名稱控制字典序
judgment: 每格恰造訪一次；比較格名時先比較欄字母，再比較列數字。
hints:
  - 先產生所有格子並依「欄、列」排序作為起點順序。
  - 每層的下一格也按相同格名順序嘗試。
  - 造訪數等於 p*q 時立即成功；第一個成功解即字典序最小。
solution_outline: 枚舉字典序起點並 DFS；八個落點收集後依欄、列排序，對未訪格回溯。
proof_or_invariant: visited 與 path 恰記錄一條不重複合法馬步路徑。DFS 依完整路徑的字典序枚舉所有候選，所以第一個長度 p*q 的解既合法又最小。
complexity:
  time: O((pq)!)
  space: O(pq)
common_errors:
  - 把 p、q 的列欄含義顛倒
  - 只從 A1 起步
  - 位移順序未必等於格名字典序
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;for(int tc=1;tc<=tests;++tc){int p,q;cin>>p>>q;vector<vector<bool>>used(p,vector<bool>(q));vector<pair<int,int>>path;constexpr int dr[8]={-2,-2,-1,-1,1,1,2,2},dc[8]={-1,1,-2,2,-2,2,-1,1};const auto dfs=[&](const auto& self,int r,int c)->bool{path.push_back({r,c});used[r][c]=true;if(static_cast<int>(path.size())==p*q)return true;vector<pair<int,int>>next;for(int k=0;k<8;++k){int nr=r+dr[k],nc=c+dc[k];if(nr>=0&&nr<p&&nc>=0&&nc<q&&!used[nr][nc])next.push_back({nr,nc});}sort(next.begin(),next.end(),[](auto a,auto b){return tie(a.second,a.first)<tie(b.second,b.first);});for(auto [nr,nc]:next)if(self(self,nr,nc))return true;used[r][c]=false;path.pop_back();return false;};bool found=false;for(int c=0;c<q&&!found;++c)for(int r=0;r<p&&!found;++r)found=dfs(dfs,r,c);cout<<"Scenario #"<<tc<<":\n";if(!found)cout<<"impossible\n\n";else{for(auto [r,c]:path)cout<<static_cast<char>('A'+c)<<r+1;cout<<"\n\n";}}}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int tests;cin>>tests;for(int tc=1;tc<=tests;++tc){int p,q;cin>>p>>q;vector<vector<bool>>used(p,vector<bool>(q));vector<pair<int,int>>path;constexpr int dr[8]={-2,-2,-1,-1,1,1,2,2},dc[8]={-1,1,-2,2,-2,2,-1,1};const auto dfs=[&](const auto& self,int r,int c)->bool{path.push_back({r,c});used[r][c]=true;if(static_cast<int>(path.size())==p*q)return true;vector<pair<int,int>>next;for(int k=0;k<8;++k){int nr=r+dr[k],nc=c+dc[k];if(nr>=0&&nr<p&&nc>=0&&nc<q&&!used[nr][nc])next.push_back({nr,nc});}sort(next.begin(),next.end(),[](auto a,auto b){return tie(a.second,a.first)<tie(b.second,b.first);});for(auto [nr,nc]:next)if(self(self,nr,nc))return true;used[r][c]=false;path.pop_back();return false;};bool found=false;for(int c=0;c<q&&!found;++c)for(int r=0;r<p&&!found;++r)found=dfs(dfs,r,c);cout<<"Scenario #"<<tc<<":\n";if(!found)cout<<"impossible\n\n";else{for(auto [r,c]:path)cout<<static_cast<char>('A'+c)<<r+1;cout<<"\n\n";}}}
external_url: http://bailian.openjudge.cn/practice/2488/
external_platform: OpenJudge 百練
external_problem_id: '2488'
external_title: OpenJudge 百練 2488 A Knight's Journey
external_relation: original
source_book_pages:
  - 109
source_pdf_pages:
  - 127
---

本卡片依官方題面重述，解法與程式為獨立撰寫。
