---
id: luogu-p4113
volume: upper
source_file: upper-volume
title: 洛谷 P4113 [HEOI2012] 採花
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 4
topics: &id001
  - offline-query
  - second-last-occurrence
  - fenwick-tree
prerequisites:
  - fenwick-tree
statement: 每次詢問區間內出現至少兩次的顏色種類數。
constraints:
  - n,c,m <= 2000000
  - 顏色 1..c
input_format: 輸入 n c m、顏色序列與 m 個 l r。
output_format: 每問輸出符合顏色數。
samples:
  - input: |
      5 3 5
      1 2 2 3 1
      1 5
      1 2
      2 2
      2 3
      3 5
    output: |
      2
      0
      0
      1
      0
    explanation: 整段顏色 1、2 都至少兩次；[2,3] 只有顏色 2 符合。
core_knowledge: *id001
judgment: 依右端點離線掃描，以 BIT 維護每色倒數第二位置。
hints:
  - 固定右端點時，每色是否至少兩次取決於倒數第二個位置。
  - BIT 每色只標記目前倒數第二次出現位置。
  - 加入新出現時移除舊倒數第二、標記舊倒數第一。
solution_outline: 依右端點離線掃描，以 BIT 維護每色倒數第二位置。
proof_or_invariant: 某色在 [l,r] 至少兩次當且僅當截至 r 的倒數第二位置 >=l；唯一標記使查詢和正確。
common_errors:
  - 索引或閉區間邊界處理錯誤
  - 離線排序後遺失原詢問順序
  - 計數或乘積未使用 long long
complexity:
  time: O((n+m) log n)
  space: O(n+c+m)
cpp_skeleton: |
  // TODO：依提示補完核心資料結構。
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  struct Q{int l,r,id;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,c,m;cin>>n>>c>>m;vector<int>a(static_cast<size_t>(n+1)),last(static_cast<size_t>(c+1)),previous(static_cast<size_t>(n+1));for(int i=1;i<=n;++i){cin>>a[static_cast<size_t>(i)];previous[static_cast<size_t>(i)]=last[static_cast<size_t>(a[static_cast<size_t>(i)])];last[static_cast<size_t>(a[static_cast<size_t>(i)])]=i;}vector<Q>qs(static_cast<size_t>(m));for(int i=0;i<m;++i){cin>>qs[static_cast<size_t>(i)].l>>qs[static_cast<size_t>(i)].r;qs[static_cast<size_t>(i)].id=i;}sort(qs.begin(),qs.end(),[](const Q&x,const Q&y){return x.r<y.r;});Fenwick bit(n);vector<int>ans(static_cast<size_t>(m));int p=0;for(auto q:qs){while(p<q.r){++p;int one=previous[static_cast<size_t>(p)],two=one==0?0:previous[static_cast<size_t>(one)];if(two!=0)bit.add(two,-1);if(one!=0)bit.add(one,1);}ans[static_cast<size_t>(q.id)]=static_cast<int>(bit.sum(q.r)-bit.sum(q.l-1));}for(int x:ans)cout<<x<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  struct Q{int l,r,id;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,c,m;cin>>n>>c>>m;vector<int>a(static_cast<size_t>(n+1)),last(static_cast<size_t>(c+1)),previous(static_cast<size_t>(n+1));for(int i=1;i<=n;++i){cin>>a[static_cast<size_t>(i)];previous[static_cast<size_t>(i)]=last[static_cast<size_t>(a[static_cast<size_t>(i)])];last[static_cast<size_t>(a[static_cast<size_t>(i)])]=i;}vector<Q>qs(static_cast<size_t>(m));for(int i=0;i<m;++i){cin>>qs[static_cast<size_t>(i)].l>>qs[static_cast<size_t>(i)].r;qs[static_cast<size_t>(i)].id=i;}sort(qs.begin(),qs.end(),[](const Q&x,const Q&y){return x.r<y.r;});Fenwick bit(n);vector<int>ans(static_cast<size_t>(m));int p=0;for(auto q:qs){while(p<q.r){++p;int one=previous[static_cast<size_t>(p)],two=one==0?0:previous[static_cast<size_t>(one)];if(two!=0)bit.add(two,-1);if(one!=0)bit.add(one,1);}ans[static_cast<size_t>(q.id)]=static_cast<int>(bit.sum(q.r)-bit.sum(q.l-1));}for(int x:ans)cout<<x<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4113
external_platform: Luogu
external_problem_id: P4113
external_title: 洛谷 P4113 [HEOI2012] 採花
external_relation: original
source_book_pages:
  - 151
  - 170
source_pdf_pages:
  - 169
  - 188
review_status: verified
---

本卡片依外部題面與限制獨立整理。
