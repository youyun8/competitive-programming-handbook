---
id: luogu-p1972
volume: upper
source_file: upper-volume
title: 洛谷 P1972 [SDOI2009] HH 的項鍊
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 4
topics: &id001
  - offline-query
  - fenwick-tree
  - last-occurrence
prerequisites:
  - fenwick-tree
statement: 多次查詢靜態序列區間內不同顏色數。
constraints:
  - n,m <= 1000000
  - 顏色 <= 1000000
input_format: 輸入 n、顏色序列、m、m 個 l r。
output_format: 每問輸出不同顏色數。
samples:
  - input: |
      5
      1 2 1 3 2
      3
      1 5
      2 4
      3 3
    output: |
      3
      3
      1
    explanation: 整段有三色；[2,4] 亦有 2、1、3。
core_knowledge: *id001
judgment: 離線按 r 掃描，用 BIT 維護每色最新位置。
hints:
  - 把詢問依右端點排序。
  - 掃到 r 時，每色只在其最後出現位置保留 1。
  - '[l,r] 標記和即該區間不同顏色數。'
solution_outline: 離線按 r 掃描，用 BIT 維護每色最新位置。
proof_or_invariant: 某色在 [l,r] 出現當且僅當截至 r 的最後位置至少 l；每色唯一標記使計數不重複。
common_errors:
  - 索引或閉區間邊界處理錯誤
  - 離線排序後遺失原詢問順序
  - 計數或乘積未使用 long long
complexity:
  time: O((n+m) log n)
  space: O(n+C+m)
cpp_skeleton: |
  // TODO：依提示補完核心資料結構。
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  struct Q{int l,r,id;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];int m;cin>>m;vector<Q>qs(static_cast<size_t>(m));for(int i=0;i<m;++i){cin>>qs[static_cast<size_t>(i)].l>>qs[static_cast<size_t>(i)].r;qs[static_cast<size_t>(i)].id=i;}sort(qs.begin(),qs.end(),[](const Q&x,const Q&y){return x.r<y.r;});vector<int>last(1000001),ans(static_cast<size_t>(m));Fenwick bit(n);int r=0;for(auto q:qs){while(r<q.r){++r;int c=a[static_cast<size_t>(r)];if(last[static_cast<size_t>(c)]!=0)bit.add(last[static_cast<size_t>(c)],-1);last[static_cast<size_t>(c)]=r;bit.add(r,1);}ans[static_cast<size_t>(q.id)]=static_cast<int>(bit.sum(q.r)-bit.sum(q.l-1));}for(int x:ans)cout<<x<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class Fenwick{public:explicit Fenwick(int n):t(static_cast<size_t>(n+1)){}void add(int x,long long v){for(int i=x;i<static_cast<int>(t.size());i+=i&-i)t[static_cast<size_t>(i)]+=v;}long long sum(int x)const{long long s=0;for(int i=x;i>0;i-=i&-i)s+=t[static_cast<size_t>(i)];return s;}private:vector<long long>t;};
  struct Q{int l,r,id;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];int m;cin>>m;vector<Q>qs(static_cast<size_t>(m));for(int i=0;i<m;++i){cin>>qs[static_cast<size_t>(i)].l>>qs[static_cast<size_t>(i)].r;qs[static_cast<size_t>(i)].id=i;}sort(qs.begin(),qs.end(),[](const Q&x,const Q&y){return x.r<y.r;});vector<int>last(1000001),ans(static_cast<size_t>(m));Fenwick bit(n);int r=0;for(auto q:qs){while(r<q.r){++r;int c=a[static_cast<size_t>(r)];if(last[static_cast<size_t>(c)]!=0)bit.add(last[static_cast<size_t>(c)],-1);last[static_cast<size_t>(c)]=r;bit.add(r,1);}ans[static_cast<size_t>(q.id)]=static_cast<int>(bit.sum(q.r)-bit.sum(q.l-1));}for(int x:ans)cout<<x<<'\n';}
external_url: https://www.luogu.com.cn/problem/P1972
external_platform: Luogu
external_problem_id: P1972
external_title: 洛谷 P1972 [SDOI2009] HH 的項鍊
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
