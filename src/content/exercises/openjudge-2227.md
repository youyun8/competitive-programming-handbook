---
volume: upper
source_file: upper-volume
chapter: 3
section: '3.3'
kind: external-oj
difficulty: 3
topics:
  - search
prerequisites:
  - recursion
id: openjudge-2227
title: OpenJudge 百練 2227 The Wedding Juicer
statement: 給定 W×H 方柱高度地形，邊界無牆可漏水。求降水後所有格子最多能容納的總體積。
constraints:
  - 3 <= W,H <= 300
  - 1 <= 高度 <= 10^9
  - 每格底面積為 1
judgment: 水可由任何邊界格流出；答案可能超過 32 位整數。
hints:
  - 從所有邊界開始，把目前最低的包圍高度放入小根堆。
  - 取出高度 h 後，鄰格水面至少可到 h；若鄰格較低，增加 h-height。
  - 鄰格入堆高度取 max(h,height)，且只入隊一次。
input_format: 第一行 W、H；其後 H 行各 W 個高度。
output_format: 輸出可容納總體積。
samples:
  - input: |
      4 5
      5 8 7 7
      5 2 1 5
      7 1 7 1
      8 9 6 9
      9 8 9 9
    output: '12'
    explanation: 三個低窪與一個高度六的格子合計盛水十二單位。
core_knowledge:
  - 邊界最小堆淹水
  - 二維接雨水
solution_outline: 多源優先佇列由外向內擴張，累加低於當前邊界的高度差。
proof_or_invariant: 小根堆取出的高度是該格通往邊界所有路徑中最小可能瓶頸；較低鄰格必被此瓶頸填至 h，較高者成為新邊界。此與最小瓶頸水位等價。
common_errors:
  - 由最低內格開始
  - 未把有效高度提升後入堆
  - 用 int 累加體積
complexity:
  time: O(WH log(WH))
  space: O(WH)
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int w,h;cin>>w>>h;vector<vector<long long>>a(h,vector<long long>(w));for(auto&row:a)for(auto&x:row)cin>>x;using S=tuple<long long,int,int>;priority_queue<S,vector<S>,greater<S>>q;vector seen(h,vector<bool>(w));auto add=[&](int r,int c){if(!seen[r][c]){seen[r][c]=true;q.push({a[r][c],r,c});}};for(int r=0;r<h;++r){add(r,0);add(r,w-1);}for(int c=0;c<w;++c){add(0,c);add(h-1,c);}long long ans=0;constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(!q.empty()){auto[level,r,c]=q.top();q.pop();for(int k=0;k<4;++k){int nr=r+dr[k],nc=c+dc[k];if(nr<0||nr>=h||nc<0||nc>=w||seen[nr][nc])continue;seen[nr][nc]=true;if(a[nr][nc]<level)ans+=level-a[nr][nc];q.push({max(level,a[nr][nc]),nr,nc});}}cout<<ans<<'\n';}
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int w,h;cin>>w>>h;vector<vector<long long>>a(h,vector<long long>(w));for(auto&row:a)for(auto&x:row)cin>>x;using S=tuple<long long,int,int>;priority_queue<S,vector<S>,greater<S>>q;vector seen(h,vector<bool>(w));auto add=[&](int r,int c){if(!seen[r][c]){seen[r][c]=true;q.push({a[r][c],r,c});}};for(int r=0;r<h;++r){add(r,0);add(r,w-1);}for(int c=0;c<w;++c){add(0,c);add(h-1,c);}long long ans=0;constexpr int dr[4]={-1,1,0,0},dc[4]={0,0,-1,1};while(!q.empty()){auto[level,r,c]=q.top();q.pop();for(int k=0;k<4;++k){int nr=r+dr[k],nc=c+dc[k];if(nr<0||nr>=h||nc<0||nc>=w||seen[nr][nc])continue;seen[nr][nc]=true;if(a[nr][nc]<level)ans+=level-a[nr][nc];q.push({max(level,a[nr][nc]),nr,nc});}}cout<<ans<<'\n';}
external_url: http://bailian.openjudge.cn/practice/2227/
external_platform: OpenJudge 百練
external_problem_id: '2227'
external_title: The Wedding Juicer
external_relation: original
source_book_pages:
  - 122
source_pdf_pages:
  - 140
review_status: verified
---

依官方題面獨立重述與實作。
