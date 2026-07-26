---
id: luogu-p2824
volume: upper
source_file: upper-volume
title: 洛谷 P2824 [HEOI2016/TJOI2016] 排序
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 5
topics: &id001
  - binary-search-answer
  - 01-sequence
  - range-assignment
prerequisites:
  - segment-tree
statement: 對 1..N 排列做多次區間升序或降序排序，求最終指定位置值。
constraints:
  - N,M <= 100000
  - 初始序列為排列
input_format: 0 l r 升序，1 l r 降序；最後輸入查詢位置。
output_format: 輸出該位置最終值。
samples:
  - input: |
      6 3
      1 6 2 5 3 4
      0 1 4
      1 3 6
      0 2 4
      3
    output: |
      5
    explanation: 官方範例。
core_knowledge: *id001
judgment: 二分答案，每次用懶線段樹模擬所有 01 排序。
hints:
  - 對候選 v，把 >=v 設一，其餘設零。
  - 01 區間排序只需統計一數量再分段賦值。
  - 最後查詢位是否為一對 v 具有單調性。
solution_outline: 二分答案，每次用懶線段樹模擬所有 01 排序。
proof_or_invariant: 排序與閾值化可交換；查詢位為一當且僅當最終值至少 v，因此二分找到精確值。
common_errors:
  - 同座標事件順序或開閉邊界處理錯誤
  - 區間為空時仍遞迴更新
  - 合併時忘記保留跨左右區間候選
complexity:
  time: O((N+M) log²N)
  space: O(N+M)
cpp_skeleton: |
  // TODO：依三階段提示自行完成核心。
  #include <bits/stdc++.h>
  using namespace std;struct Op{int type,l,r;};static vector<int>sum,tag,a;static void build(int p,int l,int r,int v){tag[static_cast<size_t>(p)]=-1;if(l==r){sum[static_cast<size_t>(p)]=a[static_cast<size_t>(l)]>=v;return;}int m=(l+r)/2;build(p*2,l,m,v);build(p*2+1,m+1,r,v);sum[static_cast<size_t>(p)]=sum[static_cast<size_t>(p*2)]+sum[static_cast<size_t>(p*2+1)];}static void apply(int p,int l,int r,int v){sum[static_cast<size_t>(p)]=(r-l+1)*v;tag[static_cast<size_t>(p)]=v;}static void push(int p,int l,int r){if(tag[static_cast<size_t>(p)]<0)return;int m=(l+r)/2;apply(p*2,l,m,tag[static_cast<size_t>(p)]);apply(p*2+1,m+1,r,tag[static_cast<size_t>(p)]);tag[static_cast<size_t>(p)]=-1;}static void setr(int p,int l,int r,int ql,int qr,int v){if(ql>qr||qr<l||r<ql)return;if(ql<=l&&r<=qr){apply(p,l,r,v);return;}push(p,l,r);int m=(l+r)/2;setr(p*2,l,m,ql,qr,v);setr(p*2+1,m+1,r,ql,qr,v);sum[static_cast<size_t>(p)]=sum[static_cast<size_t>(p*2)]+sum[static_cast<size_t>(p*2+1)];}static int ask(int p,int l,int r,int ql,int qr){if(qr<l||r<ql)return 0;if(ql<=l&&r<=qr)return sum[static_cast<size_t>(p)];push(p,l,r);int m=(l+r)/2;return ask(p*2,l,m,ql,qr)+ask(p*2+1,m+1,r,ql,qr);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;a.assign(static_cast<size_t>(n+1),0);for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];vector<Op>ops(static_cast<size_t>(m));for(auto&o:ops)cin>>o.type>>o.l>>o.r;int q;cin>>q;sum.resize(static_cast<size_t>(4*n+4));tag.resize(static_cast<size_t>(4*n+4));auto check=[&](int v){build(1,1,n,v);for(auto o:ops){int ones=ask(1,1,n,o.l,o.r);setr(1,1,n,o.l,o.r,0);if(o.type==0)setr(1,1,n,o.r-ones+1,o.r,1);else setr(1,1,n,o.l,o.l+ones-1,1);}return ask(1,1,n,q,q)!=0;};int lo=1,hi=n,ans=1;while(lo<=hi){int mid=(lo+hi)/2;if(check(mid)){ans=mid;lo=mid+1;}else hi=mid-1;}cout<<ans<<'\n';}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;struct Op{int type,l,r;};static vector<int>sum,tag,a;static void build(int p,int l,int r,int v){tag[static_cast<size_t>(p)]=-1;if(l==r){sum[static_cast<size_t>(p)]=a[static_cast<size_t>(l)]>=v;return;}int m=(l+r)/2;build(p*2,l,m,v);build(p*2+1,m+1,r,v);sum[static_cast<size_t>(p)]=sum[static_cast<size_t>(p*2)]+sum[static_cast<size_t>(p*2+1)];}static void apply(int p,int l,int r,int v){sum[static_cast<size_t>(p)]=(r-l+1)*v;tag[static_cast<size_t>(p)]=v;}static void push(int p,int l,int r){if(tag[static_cast<size_t>(p)]<0)return;int m=(l+r)/2;apply(p*2,l,m,tag[static_cast<size_t>(p)]);apply(p*2+1,m+1,r,tag[static_cast<size_t>(p)]);tag[static_cast<size_t>(p)]=-1;}static void setr(int p,int l,int r,int ql,int qr,int v){if(ql>qr||qr<l||r<ql)return;if(ql<=l&&r<=qr){apply(p,l,r,v);return;}push(p,l,r);int m=(l+r)/2;setr(p*2,l,m,ql,qr,v);setr(p*2+1,m+1,r,ql,qr,v);sum[static_cast<size_t>(p)]=sum[static_cast<size_t>(p*2)]+sum[static_cast<size_t>(p*2+1)];}static int ask(int p,int l,int r,int ql,int qr){if(qr<l||r<ql)return 0;if(ql<=l&&r<=qr)return sum[static_cast<size_t>(p)];push(p,l,r);int m=(l+r)/2;return ask(p*2,l,m,ql,qr)+ask(p*2+1,m+1,r,ql,qr);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;a.assign(static_cast<size_t>(n+1),0);for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];vector<Op>ops(static_cast<size_t>(m));for(auto&o:ops)cin>>o.type>>o.l>>o.r;int q;cin>>q;sum.resize(static_cast<size_t>(4*n+4));tag.resize(static_cast<size_t>(4*n+4));auto check=[&](int v){build(1,1,n,v);for(auto o:ops){int ones=ask(1,1,n,o.l,o.r);setr(1,1,n,o.l,o.r,0);if(o.type==0)setr(1,1,n,o.r-ones+1,o.r,1);else setr(1,1,n,o.l,o.l+ones-1,1);}return ask(1,1,n,q,q)!=0;};int lo=1,hi=n,ans=1;while(lo<=hi){int mid=(lo+hi)/2;if(check(mid)){ans=mid;lo=mid+1;}else hi=mid-1;}cout<<ans<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2824
external_platform: 洛谷
external_problem_id: P2824
external_title: 洛谷 P2824 [HEOI2016/TJOI2016] 排序
external_relation: original
source_book_pages:
  - 202
source_pdf_pages:
  - 220
review_status: verified
---

本卡片依外部題面與限制獨立整理。
