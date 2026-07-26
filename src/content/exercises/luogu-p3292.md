---
id: luogu-p3292
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P3292 幸運數字
chapter: 6
section: '6.5'
kind: external-oj
difficulty: 5
topics:
  - 數論
  - 線性基
prerequisites:
  - CRT、gcd 與樹上倍增
statement: 給定帶 64 位元點權的樹；每次詢問路徑 u-v 上任選點權 XOR，求最大值。
constraints:
  - n,q<=20000
  - 點權<=10^18
input_format: 依題面讀入整數、陣列、樹與詢問。
output_format: 逐行輸出指定答案。
samples:
  - input: |
      3 2
      1 2 4
      1 2
      2 3
      1 3
      2 2
    output: |
      7
      2
    explanation: 依定義直接驗算小型資料可得。
core_knowledge:
  - 代數分解
  - 預處理與查詢
judgment: 倍增表除祖先外，同步保存向上 2^k 個節點的 XOR 線性基；查詢 LCA 時合併經過區段。
hints:
  - 先辨認可分解的模數、路徑或值域結構。
  - 預處理 Lucas/CRT、常數 gcd 或倍增線性基。
  - 查詢時只合併必要資訊並使用 64 位元。
solution_outline: 倍增表除祖先外，同步保存向上 2^k 個節點的 XOR 線性基；查詢 LCA 時合併經過區段。
proof_or_invariant: 倍增拆分覆蓋且僅覆蓋路徑；重複插入不改張成空間。合併基張成所有路徑點權，貪心求其最大 XOR。
complexity:
  time: O((n+q)·log n·61²)
  space: O(n log n·61)
common_errors:
  - CRT 乘積溢位
  - 線性基漏掉 LCA
  - 快速 gcd 未逐次從 y 除掉已取因子
cpp_skeleton: |
  // TODO：依提示自行重寫核心結構。
  #include <bits/stdc++.h>
  using namespace std;
  using ull=unsigned long long;struct B{array<ull,61>a{};void ins(ull x){for(int i=60;i>=0;--i)if(x>>i&1ULL){if(a[i])x^=a[i];else{a[i]=x;break;}}}void add(const B&o){for(auto x:o.a)if(x)ins(x);}ull mx()const{ull r=0;for(int i=60;i>=0;--i)r=max(r,r^a[i]);return r;}};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,q;cin>>n>>q;vector<ull>w(n+1);for(int i=1;i<=n;++i)cin>>w[i];vector<vector<int>>e(n+1);for(int i=1,u,v;i<n;++i){cin>>u>>v;e[u].push_back(v);e[v].push_back(u);}const int L=15;vector<array<int,L>>up(n+1);vector<array<B,L>>bs(n+1);vector<int>dep(n+1);queue<int>qu;qu.push(1);dep[1]=1;while(!qu.empty()){int u=qu.front();qu.pop();up[u][0]=up[u][0];bs[u][0].ins(w[u]);for(int k=1;k<L;++k){up[u][k]=up[up[u][k-1]][k-1];bs[u][k]=bs[u][k-1];bs[u][k].add(bs[up[u][k-1]][k-1]);}for(int v:e[u])if(v!=up[u][0])up[v][0]=u,dep[v]=dep[u]+1,qu.push(v);}while(q--){int u,v;cin>>u>>v;B r;if(dep[u]<dep[v])swap(u,v);for(int k=L-1;k>=0;--k)if(dep[u]-(1<<k)>=dep[v])r.add(bs[u][k]),u=up[u][k];if(u==v)r.ins(w[u]);else{for(int k=L-1;k>=0;--k)if(up[u][k]!=up[v][k])r.add(bs[u][k]),r.add(bs[v][k]),u=up[u][k],v=up[v][k];r.ins(w[u]);r.ins(w[v]);r.ins(w[up[u][0]]);}cout<<r.mx()<<"\n";}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  using ull=unsigned long long;struct B{array<ull,61>a{};void ins(ull x){for(int i=60;i>=0;--i)if(x>>i&1ULL){if(a[i])x^=a[i];else{a[i]=x;break;}}}void add(const B&o){for(auto x:o.a)if(x)ins(x);}ull mx()const{ull r=0;for(int i=60;i>=0;--i)r=max(r,r^a[i]);return r;}};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,q;cin>>n>>q;vector<ull>w(n+1);for(int i=1;i<=n;++i)cin>>w[i];vector<vector<int>>e(n+1);for(int i=1,u,v;i<n;++i){cin>>u>>v;e[u].push_back(v);e[v].push_back(u);}const int L=15;vector<array<int,L>>up(n+1);vector<array<B,L>>bs(n+1);vector<int>dep(n+1);queue<int>qu;qu.push(1);dep[1]=1;while(!qu.empty()){int u=qu.front();qu.pop();up[u][0]=up[u][0];bs[u][0].ins(w[u]);for(int k=1;k<L;++k){up[u][k]=up[up[u][k-1]][k-1];bs[u][k]=bs[u][k-1];bs[u][k].add(bs[up[u][k-1]][k-1]);}for(int v:e[u])if(v!=up[u][0])up[v][0]=u,dep[v]=dep[u]+1,qu.push(v);}while(q--){int u,v;cin>>u>>v;B r;if(dep[u]<dep[v])swap(u,v);for(int k=L-1;k>=0;--k)if(dep[u]-(1<<k)>=dep[v])r.add(bs[u][k]),u=up[u][k];if(u==v)r.ins(w[u]);else{for(int k=L-1;k>=0;--k)if(up[u][k]!=up[v][k])r.add(bs[u][k]),r.add(bs[v][k]),u=up[u][k],v=up[v][k];r.ins(w[u]);r.ins(w[v]);r.ins(w[up[u][0]]);}cout<<r.mx()<<"\n";}}
external_url: https://www.luogu.com.cn/problem/P3292
external_platform: Luogu
external_problem_id: P3292
external_title: 幸運數字
external_relation: original
review_status: verified
---

本題以代數分解換取可驗證的快速查詢。
