---
id: luogu-p4054
volume: upper
source_file: upper-volume
title: 洛谷 P4054 [JSOI2009] 計數問題
chapter: 4
section: '4.2'
kind: external-oj
difficulty: 4
topics: &id001
  - two-dimensional-fenwick-tree
  - frequency-dimension
prerequisites:
  - fenwick-tree
statement: 網格支援單格改色與查詢矩形內指定顏色的格數。
constraints:
  - n,m <= 300
  - Q <= 200000
  - 顏色 1..100
input_format: 輸入網格；1 x y c 改色；2 x1 x2 y1 y2 c 查詢。
output_format: 每個操作 2 輸出數量。
samples:
  - input: |
      3 3
      1 2 3
      3 2 1
      2 1 3
      3
      2 1 2 1 2 1
      1 2 3 2
      2 2 3 2 3 2
    output: |
      1
      2
    explanation: 第一次矩形有一格顏色 1；改色後第二次有兩格顏色 2。
core_knowledge: *id001
judgment: 100 棵二維 BIT 維護各顏色指示矩陣。
hints:
  - 顏色只有 100，可為每色維護獨立二維 BIT。
  - 改色先從舊色 -1，再向新色 +1。
  - 矩形計數用四個前綴容斥。
solution_outline: 100 棵二維 BIT 維護各顏色指示矩陣。
proof_or_invariant: 每棵樹精確維護該色的 0/1 矩陣，矩形和因此等於指定顏色格數。
common_errors:
  - 索引或閉區間邊界處理錯誤
  - 離線排序後遺失原詢問順序
  - 計數或乘積未使用 long long
complexity:
  time: O((nm+Q) log n log m)
  space: O(100nm)
cpp_skeleton: |
  // TODO：依提示補完核心資料結構。
  #include <bits/stdc++.h>
  using namespace std;
  static int n,m;static vector<int>tree,grid;static size_t index_of(int color,int x,int y){return (static_cast<size_t>(color)*(n+1)+static_cast<size_t>(x))*(m+1)+static_cast<size_t>(y);}static void add(int color,int x,int y,int delta){for(int i=x;i<=n;i+=i&-i)for(int j=y;j<=m;j+=j&-j)tree[index_of(color,i,j)]+=delta;}static int prefix(int color,int x,int y){int s=0;for(int i=x;i>0;i-=i&-i)for(int j=y;j>0;j-=j&-j)s+=tree[index_of(color,i,j)];return s;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);cin>>n>>m;tree.assign(static_cast<size_t>(101*(n+1)*(m+1)),0);grid.assign(static_cast<size_t>((n+1)*(m+1)),0);for(int i=1;i<=n;++i)for(int j=1;j<=m;++j){int c;cin>>c;grid[static_cast<size_t>(i*(m+1)+j)]=c;add(c,i,j,1);}int q;cin>>q;while(q--){int op;cin>>op;if(op==1){int x,y,c;cin>>x>>y>>c;int&old=grid[static_cast<size_t>(x*(m+1)+y)];add(old,x,y,-1);old=c;add(c,x,y,1);}else{int x1,x2,y1,y2,c;cin>>x1>>x2>>y1>>y2>>c;cout<<prefix(c,x2,y2)-prefix(c,x1-1,y2)-prefix(c,x2,y1-1)+prefix(c,x1-1,y1-1)<<'\n';}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  static int n,m;static vector<int>tree,grid;static size_t index_of(int color,int x,int y){return (static_cast<size_t>(color)*(n+1)+static_cast<size_t>(x))*(m+1)+static_cast<size_t>(y);}static void add(int color,int x,int y,int delta){for(int i=x;i<=n;i+=i&-i)for(int j=y;j<=m;j+=j&-j)tree[index_of(color,i,j)]+=delta;}static int prefix(int color,int x,int y){int s=0;for(int i=x;i>0;i-=i&-i)for(int j=y;j>0;j-=j&-j)s+=tree[index_of(color,i,j)];return s;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);cin>>n>>m;tree.assign(static_cast<size_t>(101*(n+1)*(m+1)),0);grid.assign(static_cast<size_t>((n+1)*(m+1)),0);for(int i=1;i<=n;++i)for(int j=1;j<=m;++j){int c;cin>>c;grid[static_cast<size_t>(i*(m+1)+j)]=c;add(c,i,j,1);}int q;cin>>q;while(q--){int op;cin>>op;if(op==1){int x,y,c;cin>>x>>y>>c;int&old=grid[static_cast<size_t>(x*(m+1)+y)];add(old,x,y,-1);old=c;add(c,x,y,1);}else{int x1,x2,y1,y2,c;cin>>x1>>x2>>y1>>y2>>c;cout<<prefix(c,x2,y2)-prefix(c,x1-1,y2)-prefix(c,x2,y1-1)+prefix(c,x1-1,y1-1)<<'\n';}}}
external_url: https://www.luogu.com.cn/problem/P4054
external_platform: Luogu
external_problem_id: P4054
external_title: 洛谷 P4054 [JSOI2009] 計數問題
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
