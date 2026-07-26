---
id: luogu-p3372
volume: upper
source_file: upper-volume
title: 洛谷 P3372 線段樹 1：區間加與區間和
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 3
topics: &id001
  - segment-tree
  - lazy-propagation
  - range-update
prerequisites:
  - range-query
statement: 維護長度 n 的序列：操作 1 將區間 [x,y] 每項加 k；操作 2 查詢區間 [x,y] 的總和。
constraints:
  - 1 <= n,m <= 100000
  - 初值與修改值絕對值不超過 100000
  - 答案可能超過 32 位元
input_format: 第一行 n、m；第二行 n 個初值；接著 m 行為 `1 x y k` 或 `2 x y`。
output_format: 每次操作 2 輸出一行區間和。
samples:
  - input: |
      5 5
      1 5 4 2 3
      2 2 4
      1 2 3 2
      2 3 4
      1 1 5 1
      2 1 4
    output: |
      11
      8
      20
    explanation: 首次查詢為 5+4+2=11；第一次修改後第 3 到 4 項和為 6+2=8；全體再加一後，第 1 到 4 項總和為 20。
core_knowledge: *id001
judgment: 操作 1 是區間每一項都加 k，節點總和要增加 k 乘區間長度。
hints:
  - 完整覆蓋節點時先保留懶標記，不必走到葉節點。
  - sum 永遠是當前正確區間和；lazy 是尚未下推給孩子的增量。
  - 部分覆蓋前先 push，回溯時以左右孩子重新 pull。
solution_outline: 線段樹節點保存 sum 與 lazy_add；完整覆蓋直接 apply，部分覆蓋下推後遞迴。
proof_or_invariant: apply 同時修正節點真實總和並記錄子樹欠款；push 只把等價修改分派給孩子，故不變量保持，查詢分解的節點和即答案。
common_errors:
  - sum 只加 k 未乘長度
  - 查詢或部分修改前未 push
  - 使用 int 儲存區間和
complexity:
  time: O((n+m) log n)
  space: O(n)
cpp_skeleton: |
  // TODO：先自行補出核心更新與查詢，再用此可編譯框架核對。
  #include <bits/stdc++.h>
  using namespace std;
  class SegmentTree{public:explicit SegmentTree(const vector<long long>& a):n_(static_cast<int>(a.size())-1),sum_(static_cast<size_t>(4*n_+4)),lazy_(static_cast<size_t>(4*n_+4)){build(1,1,n_,a);}void add(int l,int r,long long v){add(1,1,n_,l,r,v);}long long query(int l,int r){return query(1,1,n_,l,r);}private:void build(int p,int l,int r,const vector<long long>&a){if(l==r){sum_[static_cast<size_t>(p)]=a[static_cast<size_t>(l)];return;}int m=(l+r)/2;build(p*2,l,m,a);build(p*2+1,m+1,r,a);pull(p);}void apply(int p,int l,int r,long long v){sum_[static_cast<size_t>(p)]+=v*(r-l+1);lazy_[static_cast<size_t>(p)]+=v;}void push(int p,int l,int r){if(lazy_[static_cast<size_t>(p)]==0||l==r)return;int m=(l+r)/2;apply(p*2,l,m,lazy_[static_cast<size_t>(p)]);apply(p*2+1,m+1,r,lazy_[static_cast<size_t>(p)]);lazy_[static_cast<size_t>(p)]=0;}void pull(int p){sum_[static_cast<size_t>(p)]=sum_[static_cast<size_t>(p*2)]+sum_[static_cast<size_t>(p*2+1)];}void add(int p,int l,int r,int ql,int qr,long long v){if(ql<=l&&r<=qr){apply(p,l,r,v);return;}push(p,l,r);int m=(l+r)/2;if(ql<=m)add(p*2,l,m,ql,qr,v);if(qr>m)add(p*2+1,m+1,r,ql,qr,v);pull(p);}long long query(int p,int l,int r,int ql,int qr){if(ql<=l&&r<=qr)return sum_[static_cast<size_t>(p)];push(p,l,r);int m=(l+r)/2;long long ans=0;if(ql<=m)ans+=query(p*2,l,m,ql,qr);if(qr>m)ans+=query(p*2+1,m+1,r,ql,qr);return ans;}int n_;vector<long long>sum_,lazy_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<long long>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];SegmentTree tree(a);while(m--){int op,l,r;cin>>op>>l>>r;if(op==1){long long k;cin>>k;tree.add(l,r,k);}else cout<<tree.query(l,r)<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  class SegmentTree{public:explicit SegmentTree(const vector<long long>& a):n_(static_cast<int>(a.size())-1),sum_(static_cast<size_t>(4*n_+4)),lazy_(static_cast<size_t>(4*n_+4)){build(1,1,n_,a);}void add(int l,int r,long long v){add(1,1,n_,l,r,v);}long long query(int l,int r){return query(1,1,n_,l,r);}private:void build(int p,int l,int r,const vector<long long>&a){if(l==r){sum_[static_cast<size_t>(p)]=a[static_cast<size_t>(l)];return;}int m=(l+r)/2;build(p*2,l,m,a);build(p*2+1,m+1,r,a);pull(p);}void apply(int p,int l,int r,long long v){sum_[static_cast<size_t>(p)]+=v*(r-l+1);lazy_[static_cast<size_t>(p)]+=v;}void push(int p,int l,int r){if(lazy_[static_cast<size_t>(p)]==0||l==r)return;int m=(l+r)/2;apply(p*2,l,m,lazy_[static_cast<size_t>(p)]);apply(p*2+1,m+1,r,lazy_[static_cast<size_t>(p)]);lazy_[static_cast<size_t>(p)]=0;}void pull(int p){sum_[static_cast<size_t>(p)]=sum_[static_cast<size_t>(p*2)]+sum_[static_cast<size_t>(p*2+1)];}void add(int p,int l,int r,int ql,int qr,long long v){if(ql<=l&&r<=qr){apply(p,l,r,v);return;}push(p,l,r);int m=(l+r)/2;if(ql<=m)add(p*2,l,m,ql,qr,v);if(qr>m)add(p*2+1,m+1,r,ql,qr,v);pull(p);}long long query(int p,int l,int r,int ql,int qr){if(ql<=l&&r<=qr)return sum_[static_cast<size_t>(p)];push(p,l,r);int m=(l+r)/2;long long ans=0;if(ql<=m)ans+=query(p*2,l,m,ql,qr);if(qr>m)ans+=query(p*2+1,m+1,r,ql,qr);return ans;}int n_;vector<long long>sum_,lazy_;};
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<long long>a(static_cast<size_t>(n+1));for(int i=1;i<=n;++i)cin>>a[static_cast<size_t>(i)];SegmentTree tree(a);while(m--){int op,l,r;cin>>op>>l>>r;if(op==1){long long k;cin>>k;tree.add(l,r,k);}else cout<<tree.query(l,r)<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P3372
external_platform: 洛谷
external_problem_id: P3372
external_title: 【模板】線段樹 1
external_relation: original
source_book_pages:
  - 151
  - 314
source_pdf_pages:
  - 169
  - 332
review_status: verified
---

將每個標記的語意固定後再實作，可避免重複計算。
