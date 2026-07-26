---
id: luogu-p2471
volume: upper
source_file: upper-volume
title: 洛谷 P2471 [SCOI2007] 降雨量
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 4
topics: &id001
  - sparse-table
  - incomplete-information
  - case-analysis
prerequisites:
  - segment-tree
statement: 依不完整雨量紀錄判斷「X 年是自 Y 年以來最多」必真、必假或可能。
constraints:
  - N <= 50000
  - M <= 10000
  - 年份與雨量範圍至 10^9
input_format: 已知年份雨量遞增排序；再輸入詢問 Y X。
output_format: 每問 true、false 或 maybe。
samples:
  - input: |
      4
      2002 4920
      2003 5901
      2004 2832
      2005 3890
      2
      2003 2005
      2002 2005
    output: |
      true
      false
    explanation: 2005 不超過 2003 且中間較小；卻超過 2002 條件。
core_knowledge: *id001
judgment: 二分定位端點並做 RMQ 分類。
hints:
  - 先用 RMQ 找已知中間年份最大雨量。
  - 任何已知資料違反端點或中間條件即 false。
  - 只有兩端已知且年份連續無缺才可能 true，其餘合法情形是 maybe。
solution_outline: 二分定位端點並做 RMQ 分類。
proof_or_invariant: false 條件皆為已知反例；資料完整且無反例時命題必真；缺資料而無反例可補成真或假，故 maybe。
common_errors:
  - 同座標事件順序或開閉邊界處理錯誤
  - 區間為空時仍遞迴更新
  - 合併時忘記保留跨左右區間候選
complexity:
  time: O(N log N+M log N)
  space: O(N log N)
cpp_skeleton: |
  // TODO：依三階段提示自行完成核心。
  #include <bits/stdc++.h>
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<long long>year(static_cast<size_t>(n)),rain(static_cast<size_t>(n));for(int i=0;i<n;++i)cin>>year[static_cast<size_t>(i)]>>rain[static_cast<size_t>(i)];int levels=1;while((1<<levels)<=n)++levels;vector<vector<long long>>st(static_cast<size_t>(levels),rain);for(int k=1;k<levels;++k)for(int i=0;i+(1<<k)<=n;++i)st[static_cast<size_t>(k)][static_cast<size_t>(i)]=max(st[static_cast<size_t>(k-1)][static_cast<size_t>(i)],st[static_cast<size_t>(k-1)][static_cast<size_t>(i+(1<<(k-1)))]);auto rmq=[&](int l,int r){if(l>r)return -1LL;int k=31-__builtin_clz(static_cast<unsigned>(r-l+1));return max(st[static_cast<size_t>(k)][static_cast<size_t>(l)],st[static_cast<size_t>(k)][static_cast<size_t>(r-(1<<k)+1)]);};int q;cin>>q;while(q--){long long y,x;cin>>y>>x;int iy=static_cast<int>(lower_bound(year.begin(),year.end(),y)-year.begin()),ix=static_cast<int>(lower_bound(year.begin(),year.end(),x)-year.begin());bool ky=iy<n&&year[static_cast<size_t>(iy)]==y,kx=ix<n&&year[static_cast<size_t>(ix)]==x;int l=static_cast<int>(upper_bound(year.begin(),year.end(),y)-year.begin()),r=ix-1;long long middle=rmq(l,r);bool bad=(kx&&middle>=rain[static_cast<size_t>(ix)])||(ky&&!kx&&middle>=rain[static_cast<size_t>(iy)])||(ky&&kx&&rain[static_cast<size_t>(ix)]>rain[static_cast<size_t>(iy)]);if(bad)cout<<"false\n";else if(ky&&kx&&ix-iy==x-y)cout<<"true\n";else cout<<"maybe\n";}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<long long>year(static_cast<size_t>(n)),rain(static_cast<size_t>(n));for(int i=0;i<n;++i)cin>>year[static_cast<size_t>(i)]>>rain[static_cast<size_t>(i)];int levels=1;while((1<<levels)<=n)++levels;vector<vector<long long>>st(static_cast<size_t>(levels),rain);for(int k=1;k<levels;++k)for(int i=0;i+(1<<k)<=n;++i)st[static_cast<size_t>(k)][static_cast<size_t>(i)]=max(st[static_cast<size_t>(k-1)][static_cast<size_t>(i)],st[static_cast<size_t>(k-1)][static_cast<size_t>(i+(1<<(k-1)))]);auto rmq=[&](int l,int r){if(l>r)return -1LL;int k=31-__builtin_clz(static_cast<unsigned>(r-l+1));return max(st[static_cast<size_t>(k)][static_cast<size_t>(l)],st[static_cast<size_t>(k)][static_cast<size_t>(r-(1<<k)+1)]);};int q;cin>>q;while(q--){long long y,x;cin>>y>>x;int iy=static_cast<int>(lower_bound(year.begin(),year.end(),y)-year.begin()),ix=static_cast<int>(lower_bound(year.begin(),year.end(),x)-year.begin());bool ky=iy<n&&year[static_cast<size_t>(iy)]==y,kx=ix<n&&year[static_cast<size_t>(ix)]==x;int l=static_cast<int>(upper_bound(year.begin(),year.end(),y)-year.begin()),r=ix-1;long long middle=rmq(l,r);bool bad=(kx&&middle>=rain[static_cast<size_t>(ix)])||(ky&&!kx&&middle>=rain[static_cast<size_t>(iy)])||(ky&&kx&&rain[static_cast<size_t>(ix)]>rain[static_cast<size_t>(iy)]);if(bad)cout<<"false\n";else if(ky&&kx&&ix-iy==x-y)cout<<"true\n";else cout<<"maybe\n";}}
external_url: https://www.luogu.com.cn/problem/P2471
external_platform: 洛谷
external_problem_id: P2471
external_title: 洛谷 P2471 [SCOI2007] 降雨量
external_relation: original
source_book_pages:
  - 202
source_pdf_pages:
  - 220
review_status: verified
---

本卡片依外部題面與限制獨立整理。
