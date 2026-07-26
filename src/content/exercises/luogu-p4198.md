---
id: luogu-p4198
volume: upper
source_file: upper-volume
title: 洛谷 P4198 樓房重建
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 5
topics: &id001
  - slope
  - segment-tree-summary
  - dynamic-visible-prefix
prerequisites:
  - segment-tree
statement: 動態修改第 x 棟樓高度，每次求從原點能看見的樓房數。
constraints:
  - N,M <= 100000
  - 高度 <= 1000000000
input_format: 輸入 N M 與 M 次 x y 賦值。
output_format: 每次輸出可見樓數。
samples:
  - input: |
      3 3
      1 1
      2 1
      3 6
    output: |
      1
      1
      2
    explanation: 斜率依次為一、二分之一、二，第一與第三可見。
core_knowledge: *id001
judgment: 線段樹遞迴計算超過給定門檻的前綴紀錄數。
hints:
  - 樓可見當且僅當斜率嚴格大於左側所有斜率。
  - 節點維護最大斜率與從零門檻出發的可見數。
  - 合併時左側全取，再計右側中超過左最大斜率的紀錄。
solution_outline: 線段樹遞迴計算超過給定門檻的前綴紀錄數。
proof_or_invariant: 由左至右的可見樓恰為嚴格前綴最大值；合併函式完整保留這些紀錄。
common_errors:
  - 同座標事件順序或開閉邊界處理錯誤
  - 區間為空時仍遞迴更新
  - 合併時忘記保留跨左右區間候選
complexity:
  time: O(M log²N)
  space: O(N)
cpp_skeleton: |
  // TODO：依三階段提示自行完成核心。
  #include <bits/stdc++.h>
  using namespace std;struct S{long long h=0,x=1;};static bool greater_s(S a,S b){return a.h*b.x>b.h*a.x;}static S max_s(S a,S b){return greater_s(a,b)?a:b;}static vector<S>mx;static vector<int>cnt;static int count_above(int p,int l,int r,S base){if(!greater_s(mx[static_cast<size_t>(p)],base))return 0;if(l==r)return 1;int m=(l+r)/2;if(!greater_s(mx[static_cast<size_t>(p*2)],base))return count_above(p*2+1,m+1,r,base);return count_above(p*2,l,m,base)+cnt[static_cast<size_t>(p)]-cnt[static_cast<size_t>(p*2)];}static void update(int p,int l,int r,int x,long long h){if(l==r){mx[static_cast<size_t>(p)]={h,x};cnt[static_cast<size_t>(p)]=h>0;return;}int m=(l+r)/2;if(x<=m)update(p*2,l,m,x,h);else update(p*2+1,m+1,r,x,h);mx[static_cast<size_t>(p)]=max_s(mx[static_cast<size_t>(p*2)],mx[static_cast<size_t>(p*2+1)]);cnt[static_cast<size_t>(p)]=cnt[static_cast<size_t>(p*2)]+count_above(p*2+1,m+1,r,mx[static_cast<size_t>(p*2)]);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;mx.assign(static_cast<size_t>(4*n+4),S{});cnt.assign(static_cast<size_t>(4*n+4),0);while(m--){int x;long long y;cin>>x>>y;update(1,1,n,x,y);cout<<cnt[1]<<'\n';}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;struct S{long long h=0,x=1;};static bool greater_s(S a,S b){return a.h*b.x>b.h*a.x;}static S max_s(S a,S b){return greater_s(a,b)?a:b;}static vector<S>mx;static vector<int>cnt;static int count_above(int p,int l,int r,S base){if(!greater_s(mx[static_cast<size_t>(p)],base))return 0;if(l==r)return 1;int m=(l+r)/2;if(!greater_s(mx[static_cast<size_t>(p*2)],base))return count_above(p*2+1,m+1,r,base);return count_above(p*2,l,m,base)+cnt[static_cast<size_t>(p)]-cnt[static_cast<size_t>(p*2)];}static void update(int p,int l,int r,int x,long long h){if(l==r){mx[static_cast<size_t>(p)]={h,x};cnt[static_cast<size_t>(p)]=h>0;return;}int m=(l+r)/2;if(x<=m)update(p*2,l,m,x,h);else update(p*2+1,m+1,r,x,h);mx[static_cast<size_t>(p)]=max_s(mx[static_cast<size_t>(p*2)],mx[static_cast<size_t>(p*2+1)]);cnt[static_cast<size_t>(p)]=cnt[static_cast<size_t>(p*2)]+count_above(p*2+1,m+1,r,mx[static_cast<size_t>(p*2)]);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;mx.assign(static_cast<size_t>(4*n+4),S{});cnt.assign(static_cast<size_t>(4*n+4),0);while(m--){int x;long long y;cin>>x>>y;update(1,1,n,x,y);cout<<cnt[1]<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P4198
external_platform: 洛谷
external_problem_id: P4198
external_title: 洛谷 P4198 樓房重建
external_relation: original
source_book_pages:
  - 202
source_pdf_pages:
  - 220
review_status: verified
---

本卡片依外部題面與限制獨立整理。
