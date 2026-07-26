---
id: luogu-p5435
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P5435 基於值域預處理的快速 GCD
chapter: 6
section: '6.7'
kind: external-oj
difficulty: 5
topics:
  - 數論
  - 線性基
prerequisites:
  - CRT、gcd 與樹上倍增
statement: 給兩個長度 n、值域至 10^6 的陣列。對每個 i，計算 Σ_j i^j·gcd(a_i,b_j) 模 998244353。
constraints:
  - n<=5000
  - 1<=a_i,b_i<=10^6
input_format: 依題面讀入整數、陣列、樹與詢問。
output_format: 逐行輸出指定答案。
samples:
  - input: |
      5
      200 300 300 300 23333
      666 666 666 666 123456
    output: |
      16
      564
      3636
      14328
      3905
    explanation: 依定義直接驗算小型資料可得。
core_knowledge:
  - 代數分解
  - 預處理與查詢
judgment: 將每個值分解成三個不超過 1000 的因子（至多一個大質因子），預處理小值 gcd，讓每次 gcd 成為常數次查表。
hints:
  - 先辨認可分解的模數、路徑或值域結構。
  - 預處理 Lucas/CRT、常數 gcd 或倍增線性基。
  - 查詢時只合併必要資訊並使用 64 位元。
solution_outline: 將每個值分解成三個不超過 1000 的因子（至多一個大質因子），預處理小值 gcd，讓每次 gcd 成為常數次查表。
proof_or_invariant: 依序從 y 除去與三因子的 gcd，三者乘積即完整 gcd；分解構造與小表覆蓋所有可能因子。
complexity:
  time: O(V log log V+S²+n²)
  space: O(V+S²)
common_errors:
  - CRT 乘積溢位
  - 線性基漏掉 LCA
  - 快速 gcd 未逐次從 y 除掉已取因子
cpp_skeleton: |
  // TODO：依提示自行重寫核心結構。
  #include <bits/stdc++.h>
  using namespace std;
  const int V=1000000,S=1000,MOD=998244353;static int fac[V+1][3],g[S+1][S+1],spf[V+1];void init(){fac[1][0]=fac[1][1]=fac[1][2]=1;for(int i=2;i<=V;++i){if(!spf[i]){for(int j=i;j<=V;j+=i)if(!spf[j])spf[j]=i;}fac[i][0]=fac[i/spf[i]][0]*spf[i];fac[i][1]=fac[i/spf[i]][1];fac[i][2]=fac[i/spf[i]][2];sort(fac[i],fac[i]+3);}for(int i=0;i<=S;++i)for(int j=0;j<=S;++j)g[i][j]=std::gcd(i,j);}int fastgcd(int x,int y){int r=1;for(int k=0;k<3;++k){int z=fac[x][k],q=z>S?(y%z?1:z):g[z][y%z];r*=q;y/=q;}return r;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);init();int n;cin>>n;vector<int>a(n),b(n);for(int&x:a)cin>>x;for(int&x:b)cin>>x;for(int i=0;i<n;++i){long long ans=0,p=1;for(int j=0;j<n;++j){p=p*(i+1)%MOD;ans=(ans+p*fastgcd(a[i],b[j]))%MOD;}cout<<ans<<"\n";}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  const int V=1000000,S=1000,MOD=998244353;static int fac[V+1][3],g[S+1][S+1],spf[V+1];void init(){fac[1][0]=fac[1][1]=fac[1][2]=1;for(int i=2;i<=V;++i){if(!spf[i]){for(int j=i;j<=V;j+=i)if(!spf[j])spf[j]=i;}fac[i][0]=fac[i/spf[i]][0]*spf[i];fac[i][1]=fac[i/spf[i]][1];fac[i][2]=fac[i/spf[i]][2];sort(fac[i],fac[i]+3);}for(int i=0;i<=S;++i)for(int j=0;j<=S;++j)g[i][j]=std::gcd(i,j);}int fastgcd(int x,int y){int r=1;for(int k=0;k<3;++k){int z=fac[x][k],q=z>S?(y%z?1:z):g[z][y%z];r*=q;y/=q;}return r;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);init();int n;cin>>n;vector<int>a(n),b(n);for(int&x:a)cin>>x;for(int&x:b)cin>>x;for(int i=0;i<n;++i){long long ans=0,p=1;for(int j=0;j<n;++j){p=p*(i+1)%MOD;ans=(ans+p*fastgcd(a[i],b[j]))%MOD;}cout<<ans<<"\n";}}
external_url: https://www.luogu.com.cn/problem/P5435
external_platform: Luogu
external_problem_id: P5435
external_title: 基於值域預處理的快速 GCD
external_relation: original
review_status: verified
---

本題以代數分解換取可驗證的快速查詢。
