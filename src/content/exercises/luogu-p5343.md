---
id: luogu-p5343
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P5343 分塊
chapter: 6
section: '6.3'
kind: external-oj
difficulty: 4
topics:
  - 矩陣快速冪
  - 線性遞推
prerequisites:
  - Fibonacci 與模運算
statement: 長度 n 的序列需同時滿足兩人允許的塊長集合；求使用交集塊長切分整段的方案數模 10^9+7。
constraints:
  - n<=10^18
  - 塊長<=100
input_format: 依題面輸入 n、模數或兩組塊長。
output_format: 輸出一行答案。
samples:
  - input: |
      4
      2
      1 2
      2
      1 2
    output: |
      5
    explanation: 小型案例可直接遞推驗算。
core_knowledge:
  - 週期降冪
  - 線性遞推矩陣
judgment: 合法末塊長屬於兩集合交集，故 f_i=Σf_{i-len}。最大塊長至多 100，以 companion matrix 快速冪。
hints:
  - 先找出真正影響轉移的週期或集合交集。
  - 將巨大 n 對週期取模，或對固定階遞推做矩陣冪。
  - 特判模數 1、空交集與 n 不超過預處理範圍。
solution_outline: 合法末塊長屬於兩集合交集，故 f_i=Σf_{i-len}。最大塊長至多 100，以 companion matrix 快速冪。
proof_or_invariant: 按最後一塊分類不重不漏得到線性遞推；轉移矩陣逐次推進狀態，快速冪保持相同轉移次數。
complexity:
  time: O(K^3 log n+集合排序)
  space: O(K^2)
common_errors:
  - 週期只算質數而漏質數冪
  - 矩陣狀態順序顛倒
  - 漏掉 f_0=1
cpp_skeleton: |
  // TODO：依提示重寫週期或矩陣部分。
  #include <bits/stdc++.h>
  #pragma GCC diagnostic ignored "-Wshadow"
  using namespace std;
  const long long M=1000000007;struct A{int n;vector<vector<long long>>x;A(int n=0,bool id=false):n(n),x(n,vector<long long>(n)){if(id)for(int i=0;i<n;++i)x[i][i]=1;}};A mul(const A&a,const A&b){A c(a.n);for(int i=0;i<a.n;++i)for(int k=0;k<a.n;++k)if(a.x[i][k])for(int j=0;j<a.n;++j)c.x[i][j]=(c.x[i][j]+a.x[i][k]*b.x[k][j])%M;return c;}A pw(A a,unsigned long long e){A r(a.n,true);for(;e;e>>=1,a=mul(a,a))if(e&1)r=mul(r,a);return r;}int main(){unsigned long long n;int p,q;cin>>n>>p;set<int>s,t;while(p--){int x;cin>>x;s.insert(x);}cin>>q;while(q--){int x;cin>>x;t.insert(x);}vector<int>v;set_intersection(s.begin(),s.end(),t.begin(),t.end(),back_inserter(v));if(v.empty()){cout<<0<<"\n";return 0;}int K=*max_element(v.begin(),v.end());vector<long long>f(K+1);f[0]=1;for(int i=1;i<=K;++i)for(int z:v)if(z<=i)f[i]=(f[i]+f[i-z])%M;if(n<=(unsigned)K){cout<<f[(size_t)n]<<"\n";return 0;}A a(K);for(int j=0;j<K;++j)if(find(v.begin(),v.end(),j+1)!=v.end())a.x[0][j]=1;for(int i=1;i<K;++i)a.x[i][i-1]=1;A r=pw(a,n-K);long long ans=0;for(int j=0;j<K;++j)ans=(ans+r.x[0][j]*f[K-j])%M;cout<<ans<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  #pragma GCC diagnostic ignored "-Wshadow"
  using namespace std;
  const long long M=1000000007;struct A{int n;vector<vector<long long>>x;A(int n=0,bool id=false):n(n),x(n,vector<long long>(n)){if(id)for(int i=0;i<n;++i)x[i][i]=1;}};A mul(const A&a,const A&b){A c(a.n);for(int i=0;i<a.n;++i)for(int k=0;k<a.n;++k)if(a.x[i][k])for(int j=0;j<a.n;++j)c.x[i][j]=(c.x[i][j]+a.x[i][k]*b.x[k][j])%M;return c;}A pw(A a,unsigned long long e){A r(a.n,true);for(;e;e>>=1,a=mul(a,a))if(e&1)r=mul(r,a);return r;}int main(){unsigned long long n;int p,q;cin>>n>>p;set<int>s,t;while(p--){int x;cin>>x;s.insert(x);}cin>>q;while(q--){int x;cin>>x;t.insert(x);}vector<int>v;set_intersection(s.begin(),s.end(),t.begin(),t.end(),back_inserter(v));if(v.empty()){cout<<0<<"\n";return 0;}int K=*max_element(v.begin(),v.end());vector<long long>f(K+1);f[0]=1;for(int i=1;i<=K;++i)for(int z:v)if(z<=i)f[i]=(f[i]+f[i-z])%M;if(n<=(unsigned)K){cout<<f[(size_t)n]<<"\n";return 0;}A a(K);for(int j=0;j<K;++j)if(find(v.begin(),v.end(),j+1)!=v.end())a.x[0][j]=1;for(int i=1;i<K;++i)a.x[i][i-1]=1;A r=pw(a,n-K);long long ans=0;for(int j=0;j<K;++j)ans=(ans+r.x[0][j]*f[K-j])%M;cout<<ans<<"\n";}
external_url: https://www.luogu.com.cn/problem/P5343
external_platform: Luogu
external_problem_id: P5343
external_title: 分塊
external_relation: original
review_status: verified
---

巨大下標需先證明可安全降維。
