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
id: luogu-p5303
title: 洛谷 P5303 逼死強迫症
difficulty: 4
topics:
  - 鋪磚 DP
  - 線性遞推
  - 矩陣快速冪
prerequisites:
  - 動態規劃
statement: 用 N-1 塊 2×1 磚與兩塊 1×1 磚鋪滿 2×N 長方形，要求兩塊 1×1 不共邊；求方案數模 1000000007。
constraints:
  - 多組詢問
  - 1 <= N <= 2000000000
input_format: 第一行測試組數 T；接著 T 行各一個 N。
output_format: 每組輸出合法鋪法數模 1000000007。
samples:
  - input: |
      3
      1
      2
      4
    output: |
      0
      0
      6
    explanation: 寬度 1、2 無法分離兩小磚；寬度 4 有六種合法鋪法。
core_knowledge:
  - 骨牌鋪法費波那契
  - 帶常數線性遞推
  - 矩陣快速冪
judgment: 合法方案 F_n 滿足 F_n=F_{n-1}+F_{n-2}+2(g_{n-1}-1)，其中 g 是普通 2×n 骨牌鋪法數；固定五維狀態可加速。
hints:
  - 先令 g_n 為只用 2×1 磚鋪 2×n 的方案，則 g_n=g_{n-1}+g_{n-2}。
  - 按最右側結構分類可得 F_n=F_{n-1}+F_{n-2}+2(g_{n-1}-1)。
  - 保存 [F_i,F_{i-1},g_i,g_{i-1},1]，把減 2 寫成模數下的常數係數。
solution_outline: 以 i=1 的五維初始狀態建立轉移矩陣，對每個 N 快速冪 N-1 次並讀 F_N。
proof_or_invariant: F 遞推覆蓋右端不含或含 1×1 磚的互斥情況，係數 2 對應上下對稱；g 遞推是標準骨牌分類。矩陣逐項實現兩遞推與常數，歸納得答案。
complexity:
  time: 每組 O(log N)
  space: O(1)
common_errors:
  - 把兩塊 1×1 相鄰的方案算入
  - 常數 -2 未做模正規化
  - N<=2 未輸出 0
cpp_skeleton: >-
  #include <bits/stdc++.h>

  using namespace std;static const long long MOD=1000000007;struct Mat{long long a[5][5]{};};static Mat mul(const
  Mat&x,const Mat&y){Mat z;for(int i=0;i<5;i++)for(int k=0;k<5;k++)for(int
  j=0;j<5;j++)z.a[i][j]=(z.a[i][j]+x.a[i][k]*y.a[k][j])%MOD;return z;}static Mat power(Mat b,long long e){Mat r;for(int
  i=0;i<5;i++)r.a[i][i]=1;while(e){if(e&1LL)r=mul(r,b);b=mul(b,b);e>>=1;}return r;}int
  main(){ios::sync_with_stdio(false);cin.tie(nullptr);Mat
  t;t.a[0][0]=1;t.a[0][1]=1;t.a[0][2]=2;t.a[0][4]=MOD-2;t.a[1][0]=1;t.a[2][2]=1;t.a[2][3]=1;t.a[3][2]=1;t.a[4][4]=1;int
  q;cin>>q;while(q--){long long n;cin>>n;if(n<=2){cout<<0<<'\n';continue;}Mat r=power(t,n-1);long long
  s[5]={0,0,1,1,1},ans=0;for(int j=0;j<5;j++)ans=(ans+r.a[0][j]*s[j])%MOD;cout<<ans<<'\n';}return 0;}
cpp_solution: >-
  #include <bits/stdc++.h>

  using namespace std;static const long long MOD=1000000007;struct Mat{long long a[5][5]{};};static Mat mul(const
  Mat&x,const Mat&y){Mat z;for(int i=0;i<5;i++)for(int k=0;k<5;k++)for(int
  j=0;j<5;j++)z.a[i][j]=(z.a[i][j]+x.a[i][k]*y.a[k][j])%MOD;return z;}static Mat power(Mat b,long long e){Mat r;for(int
  i=0;i<5;i++)r.a[i][i]=1;while(e){if(e&1LL)r=mul(r,b);b=mul(b,b);e>>=1;}return r;}int
  main(){ios::sync_with_stdio(false);cin.tie(nullptr);Mat
  t;t.a[0][0]=1;t.a[0][1]=1;t.a[0][2]=2;t.a[0][4]=MOD-2;t.a[1][0]=1;t.a[2][2]=1;t.a[2][3]=1;t.a[3][2]=1;t.a[4][4]=1;int
  q;cin>>q;while(q--){long long n;cin>>n;if(n<=2){cout<<0<<'\n';continue;}Mat r=power(t,n-1);long long
  s[5]={0,0,1,1,1},ans=0;for(int j=0;j<5;j++)ans=(ans+r.a[0][j]*s[j])%MOD;cout<<ans<<'\n';}return 0;}
external_url: https://www.luogu.com.cn/problem/P5303
external_platform: Luogu
external_problem_id: P5303
external_title: '[GXOI/GZOI2019] 逼死強迫症'
---

把普通骨牌鋪法數一併放進狀態，就能線性表示含兩塊特殊磚的方案。
