---
id: openj-bailian-3386
volume: upper
source_file: upper-volume
title: OpenJudge 百練 3386 Hotel
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 4
topics: &id001
  - segment-tree
  - maximum-free-run
  - leftmost-search
prerequisites:
  - segment-tree
statement: N 間房初始空；入住要最左連續 D 間，退房釋放指定區間。
constraints:
  - N,M < 50000
input_format: 1 D 入住；2 X D 退房。
output_format: 入住成功輸出首房號，失敗輸出 0。
samples:
  - input: |
      10 6
      1 3
      1 3
      1 3
      1 3
      2 5 5
      1 6
    output: |
      1
      4
      7
      0
      5
    explanation: 前三組入住 1、4、7；退房後最左六連空房從 5 開始。
core_knowledge: *id001
judgment: 懶線段樹維護連續空段並找最左可行位置。
hints:
  - 節點維護前綴空、後綴空與最長空段。
  - 合併候選還包含左後綴+右前綴。
  - 定位依左子、跨中點、右子的順序，保證最左。
solution_outline: 懶線段樹維護連續空段並找最左可行位置。
proof_or_invariant: 三摘要完整描述跨界最長空段；固定搜尋優先序返回所有可行段中起點最小者。
common_errors:
  - 懶標記合成順序錯誤
  - 閉區間端點或 0/1 起始索引混淆
  - 合併節點摘要時漏掉跨左右子樹的候選
complexity:
  time: O(M log N)
  space: O(N)
cpp_skeleton: |
  // TODO：依三階段提示完成資料結構。
  #include <bits/stdc++.h>
  using namespace std;struct Node{int pref=0,suff=0,best=0,lazy=-1;};static vector<Node>tr;static void apply(int p,int l,int r,int free_value){int v=free_value?(r-l+1):0;tr[static_cast<size_t>(p)].pref=tr[static_cast<size_t>(p)].suff=tr[static_cast<size_t>(p)].best=v;tr[static_cast<size_t>(p)].lazy=free_value;}static void pull(int p,int l,int r){int m=(l+r)/2;Node&a=tr[static_cast<size_t>(p)],&x=tr[static_cast<size_t>(p*2)],&y=tr[static_cast<size_t>(p*2+1)];a.pref=x.pref+(x.pref==m-l+1?y.pref:0);a.suff=y.suff+(y.suff==r-m?x.suff:0);a.best=max({x.best,y.best,x.suff+y.pref});}static void push(int p,int l,int r){if(tr[static_cast<size_t>(p)].lazy<0||l==r)return;int m=(l+r)/2;apply(p*2,l,m,tr[static_cast<size_t>(p)].lazy);apply(p*2+1,m+1,r,tr[static_cast<size_t>(p)].lazy);tr[static_cast<size_t>(p)].lazy=-1;}static void update(int p,int l,int r,int ql,int qr,int free_value){if(qr<l||r<ql)return;if(ql<=l&&r<=qr){apply(p,l,r,free_value);return;}push(p,l,r);int m=(l+r)/2;update(p*2,l,m,ql,qr,free_value);update(p*2+1,m+1,r,ql,qr,free_value);pull(p,l,r);}static int locate(int p,int l,int r,int need){if(l==r)return l;push(p,l,r);int m=(l+r)/2;if(tr[static_cast<size_t>(p*2)].best>=need)return locate(p*2,l,m,need);if(tr[static_cast<size_t>(p*2)].suff+tr[static_cast<size_t>(p*2+1)].pref>=need)return m-tr[static_cast<size_t>(p*2)].suff+1;return locate(p*2+1,m+1,r,need);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;tr.assign(static_cast<size_t>(4*n+4),Node{});apply(1,1,n,1);while(m--){int op,x;cin>>op>>x;if(op==1){if(tr[1].best<x)cout<<0<<'\n';else{int start=locate(1,1,n,x);cout<<start<<'\n';update(1,1,n,start,start+x-1,0);}}else{int d;cin>>d;update(1,1,n,x,x+d-1,1);}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;struct Node{int pref=0,suff=0,best=0,lazy=-1;};static vector<Node>tr;static void apply(int p,int l,int r,int free_value){int v=free_value?(r-l+1):0;tr[static_cast<size_t>(p)].pref=tr[static_cast<size_t>(p)].suff=tr[static_cast<size_t>(p)].best=v;tr[static_cast<size_t>(p)].lazy=free_value;}static void pull(int p,int l,int r){int m=(l+r)/2;Node&a=tr[static_cast<size_t>(p)],&x=tr[static_cast<size_t>(p*2)],&y=tr[static_cast<size_t>(p*2+1)];a.pref=x.pref+(x.pref==m-l+1?y.pref:0);a.suff=y.suff+(y.suff==r-m?x.suff:0);a.best=max({x.best,y.best,x.suff+y.pref});}static void push(int p,int l,int r){if(tr[static_cast<size_t>(p)].lazy<0||l==r)return;int m=(l+r)/2;apply(p*2,l,m,tr[static_cast<size_t>(p)].lazy);apply(p*2+1,m+1,r,tr[static_cast<size_t>(p)].lazy);tr[static_cast<size_t>(p)].lazy=-1;}static void update(int p,int l,int r,int ql,int qr,int free_value){if(qr<l||r<ql)return;if(ql<=l&&r<=qr){apply(p,l,r,free_value);return;}push(p,l,r);int m=(l+r)/2;update(p*2,l,m,ql,qr,free_value);update(p*2+1,m+1,r,ql,qr,free_value);pull(p,l,r);}static int locate(int p,int l,int r,int need){if(l==r)return l;push(p,l,r);int m=(l+r)/2;if(tr[static_cast<size_t>(p*2)].best>=need)return locate(p*2,l,m,need);if(tr[static_cast<size_t>(p*2)].suff+tr[static_cast<size_t>(p*2+1)].pref>=need)return m-tr[static_cast<size_t>(p*2)].suff+1;return locate(p*2+1,m+1,r,need);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;tr.assign(static_cast<size_t>(4*n+4),Node{});apply(1,1,n,1);while(m--){int op,x;cin>>op>>x;if(op==1){if(tr[1].best<x)cout<<0<<'\n';else{int start=locate(1,1,n,x);cout<<start<<'\n';update(1,1,n,start,start+x-1,0);}}else{int d;cin>>d;update(1,1,n,x,x+d-1,1);}}}
external_url: http://bailian.openjudge.cn/practice/3386/
external_platform: OpenJ_Bailian
external_problem_id: '3386'
external_title: OpenJudge 百練 3386 Hotel
external_relation: original
source_book_pages:
  - 182
  - 192
source_pdf_pages:
  - 200
  - 210
review_status: verified
---

本卡片依外部題面與限制獨立整理。
