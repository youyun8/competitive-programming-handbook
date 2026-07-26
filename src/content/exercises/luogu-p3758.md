---
volume: lower
source_file: lower-volume
chapter: 6
section: '6.3'
kind: external-oj
review_status: verified
external_relation: original
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
id: luogu-p3758
title: 洛谷 P3758 可樂
difficulty: 3
topics:
  - 圖上計數
  - 吸收狀態
  - 矩陣快速冪
prerequisites:
  - 鄰接矩陣
statement: 機器人第 0 秒在城市 1。每秒可留在原城、沿無向邊移動，或自爆；求經過 t 秒的行為序列總數模 2017。
constraints:
  - 1 <= N <= 30
  - 0 < M < 100
  - 1 < t <= 1000000
input_format: 第一行 N、M；接著 M 條無向邊；最後一行 t。
output_format: 輸出行為方案數模 2017。
samples:
  - input: |
      3 2
      1 2
      2 3
      2
    output: |
      8
    explanation: 包含第一秒或第二秒自爆的三種，以及兩秒後仍在城市的五種，共八種。
core_knowledge:
  - 鄰接矩陣路徑計數
  - 自環
  - 吸收爆炸狀態
judgment: 把留在原地設為自環，自爆設為額外吸收點，所有行為序列就成為增廣圖上的定長路徑。
hints:
  - 留在原地對應每個城市的自環。
  - 新增爆炸狀態：每個城市可走入它，它只能留在自己，確保爆炸後剩餘秒數只有一種延續。
  - 增廣鄰接矩陣取 t 次方後，將從城市 1 到所有狀態的方案數相加。
solution_outline: 建立 N+1 階轉移矩陣，加入道路、自環與爆炸吸收邊；快速冪 t 次並求第一列總和。
proof_or_invariant: 每秒每種合法行為與增廣圖上一條出邊一一對應；吸收狀態使已爆炸序列不重複分支。因此長 t 路徑與行為序列雙射。
complexity:
  time: O(N^3 log t)
  space: O(N^2)
common_errors:
  - 漏掉原地自環
  - 爆炸狀態沒有自環
  - 只計算 t 秒後仍未爆炸的方案
cpp_skeleton: >-
  #include <bits/stdc++.h>

  using namespace std;static const int MOD=2017;struct Mat{int n=0,a[31][31]{};};static Mat mul(const Mat&x,const
  Mat&y){Mat z;z.n=x.n;for(int i=0;i<z.n;i++)for(int k=0;k<z.n;k++)for(int
  j=0;j<z.n;j++)z.a[i][j]=(z.a[i][j]+x.a[i][k]*y.a[k][j])%MOD;return z;}static Mat power(Mat b,int e){Mat
  r;r.n=b.n;for(int i=0;i<r.n;i++)r.a[i][i]=1;while(e){if(e&1)r=mul(r,b);b=mul(b,b);e>>=1;}return r;}int
  main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;Mat g;g.n=n+1;while(m--){int
  u,v;cin>>u>>v;--u;--v;g.a[u][v]=g.a[v][u]=1;}for(int i=0;i<n;i++){g.a[i][i]=1;g.a[i][n]=1;}g.a[n][n]=1;int
  t;cin>>t;Mat r=power(g,t);int ans=0;for(int j=0;j<=n;j++)ans=(ans+r.a[0][j])%MOD;cout<<ans<<'\n';return 0;}
cpp_solution: >-
  #include <bits/stdc++.h>

  using namespace std;static const int MOD=2017;struct Mat{int n=0,a[31][31]{};};static Mat mul(const Mat&x,const
  Mat&y){Mat z;z.n=x.n;for(int i=0;i<z.n;i++)for(int k=0;k<z.n;k++)for(int
  j=0;j<z.n;j++)z.a[i][j]=(z.a[i][j]+x.a[i][k]*y.a[k][j])%MOD;return z;}static Mat power(Mat b,int e){Mat
  r;r.n=b.n;for(int i=0;i<r.n;i++)r.a[i][i]=1;while(e){if(e&1)r=mul(r,b);b=mul(b,b);e>>=1;}return r;}int
  main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;Mat g;g.n=n+1;while(m--){int
  u,v;cin>>u>>v;--u;--v;g.a[u][v]=g.a[v][u]=1;}for(int i=0;i<n;i++){g.a[i][i]=1;g.a[i][n]=1;}g.a[n][n]=1;int
  t;cin>>t;Mat r=power(g,t);int ans=0;for(int j=0;j<=n;j++)ans=(ans+r.a[0][j])%MOD;cout<<ans<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P3758
external_platform: Luogu
external_problem_id: P3758
external_title: '[TJOI2017] 可樂'
---

把「終止行為」改造成吸收狀態後，也能統一納入固定步數矩陣模型。
