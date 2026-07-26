---
id: luogu-p4513
volume: upper
source_file: upper-volume
title: 洛谷 P4513 小白逛公園
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 3
topics: &id001
  - maximum-subarray
  - segment-tree-merge
prerequisites:
  - segment-tree
statement: 支援單點修改分數與查詢指定區間的非空最大連續子段和。
constraints:
  - N <= 500000
  - M <= 100000
  - 分數絕對值 <= 1000
input_format: 操作 1 a b 查詢；2 p s 修改。
output_format: 每個查詢輸出最大得分。
samples:
  - input: |
      5 3
      1
      -2
      3
      4
      -1
      1 1 5
      2 2 5
      1 1 3
    output: |
      7
      9
    explanation: 初次最佳為 3+4，修改後前三項總和九。
core_knowledge: *id001
judgment: 單點修改、區間回傳最大子段摘要。
hints:
  - 節點維護總和、最大前綴、最大後綴、最大子段。
  - 跨中點答案是左最大後綴加右最大前綴。
  - 查詢也必須按左右順序合併摘要。
solution_outline: 單點修改、區間回傳最大子段摘要。
proof_or_invariant: 任一最大子段位於左、右或跨接縫，合併枚舉三類且歸納成立。
common_errors:
  - 同座標事件順序或開閉邊界處理錯誤
  - 區間為空時仍遞迴更新
  - 合併時忘記保留跨左右區間候選
complexity:
  time: O((N+M) log N)
  space: O(N)
cpp_skeleton: |
  // TODO：依三階段提示自行完成核心。
  #include <bits/stdc++.h>
  using namespace std;struct N{long long sum=0,pre=LLONG_MIN/4,suf=LLONG_MIN/4,best=LLONG_MIN/4;};static N merge_n(N a,N b){return {a.sum+b.sum,max(a.pre,a.sum+b.pre),max(b.suf,b.sum+a.suf),max({a.best,b.best,a.suf+b.pre})};}static vector<N>tr;static vector<long long>a;static void build(int p,int l,int r){if(l==r){long long v=a[static_cast<size_t>(l)];tr[static_cast<size_t>(p)]={v,v,v,v};return;}int m=(l+r)/2;build(p*2,l,m);build(p*2+1,m+1,r);tr[static_cast<size_t>(p)]=merge_n(tr[static_cast<size_t>(p*2)],tr[static_cast<size_t>(p*2+1)]);}static void update(int p,int l,int r,int x,long long v){if(l==r){tr[static_cast<size_t>(p)]={v,v,v,v};return;}int m=(l+r)/2;if(x<=m)update(p*2,l,m,x,v);else update(p*2+1,m+1,r,x,v);tr[static_cast<size_t>(p)]=merge_n(tr[static_cast<size_t>(p*2)],tr[static_cast<size_t>(p*2+1)]);}static N query(int p,int l,int r,int ql,int qr){if(ql<=l&&r<=qr)return tr[static_cast<size_t>(p)];int m=(l+r)/2;if(qr<=m)return query(p*2,l,m,ql,qr);if(ql>m)return query(p*2+1,m+1,r,ql,qr);return merge_n(query(p*2,l,m,ql,qr),query(p*2+1,m+1,r,ql,qr));}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;a.assign(static_cast<size_t>(n+1),0);for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];tr.resize(static_cast<size_t>(4*n+4));build(1,1,n);while(m--){int op,x;long long y;cin>>op>>x>>y;if(op==1){int r=static_cast<int>(y);if(x>r)swap(x,r);cout<<query(1,1,n,x,r).best<<'\n';}else update(1,1,n,x,y);}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;struct N{long long sum=0,pre=LLONG_MIN/4,suf=LLONG_MIN/4,best=LLONG_MIN/4;};static N merge_n(N a,N b){return {a.sum+b.sum,max(a.pre,a.sum+b.pre),max(b.suf,b.sum+a.suf),max({a.best,b.best,a.suf+b.pre})};}static vector<N>tr;static vector<long long>a;static void build(int p,int l,int r){if(l==r){long long v=a[static_cast<size_t>(l)];tr[static_cast<size_t>(p)]={v,v,v,v};return;}int m=(l+r)/2;build(p*2,l,m);build(p*2+1,m+1,r);tr[static_cast<size_t>(p)]=merge_n(tr[static_cast<size_t>(p*2)],tr[static_cast<size_t>(p*2+1)]);}static void update(int p,int l,int r,int x,long long v){if(l==r){tr[static_cast<size_t>(p)]={v,v,v,v};return;}int m=(l+r)/2;if(x<=m)update(p*2,l,m,x,v);else update(p*2+1,m+1,r,x,v);tr[static_cast<size_t>(p)]=merge_n(tr[static_cast<size_t>(p*2)],tr[static_cast<size_t>(p*2+1)]);}static N query(int p,int l,int r,int ql,int qr){if(ql<=l&&r<=qr)return tr[static_cast<size_t>(p)];int m=(l+r)/2;if(qr<=m)return query(p*2,l,m,ql,qr);if(ql>m)return query(p*2+1,m+1,r,ql,qr);return merge_n(query(p*2,l,m,ql,qr),query(p*2+1,m+1,r,ql,qr));}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;a.assign(static_cast<size_t>(n+1),0);for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];tr.resize(static_cast<size_t>(4*n+4));build(1,1,n);while(m--){int op,x;long long y;cin>>op>>x>>y;if(op==1){int r=static_cast<int>(y);if(x>r)swap(x,r);cout<<query(1,1,n,x,r).best<<'\n';}else update(1,1,n,x,y);}}
external_url: https://www.luogu.com.cn/problem/P4513
external_platform: 洛谷
external_problem_id: P4513
external_title: 洛谷 P4513 小白逛公園
external_relation: original
source_book_pages:
  - 202
source_pdf_pages:
  - 220
review_status: verified
---

本卡片依外部題面與限制獨立整理。
