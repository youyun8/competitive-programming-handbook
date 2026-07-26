---
id: openj-bailian-2464
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2464 Brownie Points II
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 5
topics: &id001
  - fenwick-tree
  - sweep-line
  - minimax
prerequisites:
  - segment-tree
statement: Stan 選過點的垂線，Ollie 再選該垂線上一點的橫線；兩人各取對角象限點數並最優決策。
constraints:
  - 1 < N < 200000 且 N 為奇數
  - 點座標互異
input_format: 多組 N 與 N 個點，0 結束。
output_format: 輸出 Stan 保證分與所有可能 Ollie 高分。
samples:
  - input: |
      11
      3 2
      3 3
      3 4
      3 6
      2 -2
      1 -3
      0 0
      -3 -3
      -3 -2
      -3 -4
      3 -7
      0
    output: |
      Stan: 7; Ollie: 2 3;
    explanation: 官方範例的兩種最優垂線回應。
core_knowledge: *id001
judgment: 枚舉垂線組，以 BIT 計四象限並套決策順序。
hints:
  - 按 x 分組掃描，兩棵 BIT 維護垂線左右的 y 分布。
  - 固定交點即可用四個前綴和得到雙方分數。
  - 先模擬 Ollie 最優回應，再由 Stan 最大化可保證分。
solution_outline: 枚舉垂線組，以 BIT 計四象限並套決策順序。
proof_or_invariant: 每個合法垂線與橫線交點都被枚舉，象限計數精確；逐層最優化即題目博弈定義。
common_errors:
  - 同座標事件順序或開閉邊界處理錯誤
  - 區間為空時仍遞迴更新
  - 合併時忘記保留跨左右區間候選
complexity:
  time: O(N log N)
  space: O(N)
cpp_skeleton: |
  // TODO：依三階段提示自行完成核心。
  #include <bits/stdc++.h>
  using namespace std;struct F{vector<int>t;explicit F(int n):t(static_cast<size_t>(n+1)){}void add(int x,int v){for(;x<static_cast<int>(t.size());x+=x&-x)t[static_cast<size_t>(x)]+=v;}int sum(int x)const{int s=0;for(;x>0;x-=x&-x)s+=t[static_cast<size_t>(x)];return s;}};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;while(cin>>n&&n){struct P{int x,y,yi;};vector<P>a(static_cast<size_t>(n));vector<int>ys;for(auto&p:a){cin>>p.x>>p.y;ys.push_back(p.y);}sort(ys.begin(),ys.end());ys.erase(unique(ys.begin(),ys.end()),ys.end());for(auto&p:a)p.yi=static_cast<int>(lower_bound(ys.begin(),ys.end(),p.y)-ys.begin())+1;sort(a.begin(),a.end(),[](const P&u,const P&v){return u.x<v.x;});F left(static_cast<int>(ys.size())),right(static_cast<int>(ys.size()));for(auto p:a)right.add(p.yi,1);int best=-1;vector<int>ollie;for(size_t i=0;i<a.size();){size_t j=i;while(j<a.size()&&a[j].x==a[i].x){right.add(a[j].yi,-1);++j;}int chosen_ollie=-1,worst_stan=INT_MAX;for(size_t k=i;k<j;++k){int y=a[k].yi;int lb=left.sum(y-1),la=left.sum(static_cast<int>(ys.size()))-left.sum(y);int rb=right.sum(y-1),ra=right.sum(static_cast<int>(ys.size()))-right.sum(y);int s=lb+ra,o=la+rb;if(o>chosen_ollie){chosen_ollie=o;worst_stan=s;}else if(o==chosen_ollie)worst_stan=min(worst_stan,s);}if(worst_stan>best){best=worst_stan;ollie.clear();ollie.push_back(chosen_ollie);}else if(worst_stan==best)ollie.push_back(chosen_ollie);for(size_t k=i;k<j;++k)left.add(a[k].yi,1);i=j;}sort(ollie.begin(),ollie.end());ollie.erase(unique(ollie.begin(),ollie.end()),ollie.end());cout<<"Stan: "<<best<<"; Ollie:";for(int x:ollie)cout<<' '<<x;cout<<";\n";}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;struct F{vector<int>t;explicit F(int n):t(static_cast<size_t>(n+1)){}void add(int x,int v){for(;x<static_cast<int>(t.size());x+=x&-x)t[static_cast<size_t>(x)]+=v;}int sum(int x)const{int s=0;for(;x>0;x-=x&-x)s+=t[static_cast<size_t>(x)];return s;}};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;while(cin>>n&&n){struct P{int x,y,yi;};vector<P>a(static_cast<size_t>(n));vector<int>ys;for(auto&p:a){cin>>p.x>>p.y;ys.push_back(p.y);}sort(ys.begin(),ys.end());ys.erase(unique(ys.begin(),ys.end()),ys.end());for(auto&p:a)p.yi=static_cast<int>(lower_bound(ys.begin(),ys.end(),p.y)-ys.begin())+1;sort(a.begin(),a.end(),[](const P&u,const P&v){return u.x<v.x;});F left(static_cast<int>(ys.size())),right(static_cast<int>(ys.size()));for(auto p:a)right.add(p.yi,1);int best=-1;vector<int>ollie;for(size_t i=0;i<a.size();){size_t j=i;while(j<a.size()&&a[j].x==a[i].x){right.add(a[j].yi,-1);++j;}int chosen_ollie=-1,worst_stan=INT_MAX;for(size_t k=i;k<j;++k){int y=a[k].yi;int lb=left.sum(y-1),la=left.sum(static_cast<int>(ys.size()))-left.sum(y);int rb=right.sum(y-1),ra=right.sum(static_cast<int>(ys.size()))-right.sum(y);int s=lb+ra,o=la+rb;if(o>chosen_ollie){chosen_ollie=o;worst_stan=s;}else if(o==chosen_ollie)worst_stan=min(worst_stan,s);}if(worst_stan>best){best=worst_stan;ollie.clear();ollie.push_back(chosen_ollie);}else if(worst_stan==best)ollie.push_back(chosen_ollie);for(size_t k=i;k<j;++k)left.add(a[k].yi,1);i=j;}sort(ollie.begin(),ollie.end());ollie.erase(unique(ollie.begin(),ollie.end()),ollie.end());cout<<"Stan: "<<best<<"; Ollie:";for(int x:ollie)cout<<' '<<x;cout<<";\n";}}
external_url: http://bailian.openjudge.cn/practice/2464/
external_platform: OpenJ_Bailian
external_problem_id: '2464'
external_title: OpenJudge 百練 2464 Brownie Points II
external_relation: original
source_book_pages:
  - 202
source_pdf_pages:
  - 220
review_status: verified
---

本卡片依外部題面與限制獨立整理。
