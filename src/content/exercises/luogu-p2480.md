---
id: luogu-p2480
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P2480 古代豬文
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 5
topics:
  - 數論
  - 線性基
prerequisites:
  - CRT、gcd 與樹上倍增
statement: 給定 N、G，計算 G 的「所有 d|N 的 C(N,d) 之和」次方，模 999911659。
constraints:
  - 1<=N,G<=10^9
input_format: 依題面讀入整數、陣列、樹與詢問。
output_format: 逐行輸出指定答案。
samples:
  - input: |
      1 2
    output: |
      2
    explanation: 依定義直接驗算小型資料可得。
core_knowledge:
  - 代數分解
  - 預處理與查詢
judgment: 指數依費馬定理只需模 999911658；將其分解為四個互質質數，分別用 Lucas 計算組合數和，再 CRT 合併。
hints:
  - 先辨認可分解的模數、路徑或值域結構。
  - 預處理 Lucas/CRT、常數 gcd 或倍增線性基。
  - 查詢時只合併必要資訊並使用 64 位元。
solution_outline: 指數依費馬定理只需模 999911658；將其分解為四個互質質數，分別用 Lucas 計算組合數和，再 CRT 合併。
proof_or_invariant: Lucas 定理正確計算各質數模下的組合數；CRT 唯一恢復指數模 φ，費馬定理保持最終冪值。
complexity:
  time: O(sqrt(N)·Σlog_p N+Σp+log MOD)
  space: O(sqrt(N)+35617)
common_errors:
  - CRT 乘積溢位
  - 線性基漏掉 LCA
  - 快速 gcd 未逐次從 y 除掉已取因子
cpp_skeleton: |
  // TODO：依提示自行重寫核心結構。
  #include <bits/stdc++.h>
  using namespace std;
  const long long MOD=999911659,PHI=999911658;long long pw(long long a,long long e,long long m){long long r=1%m;for(a%=m;e;e>>=1,a=a*a%m)if(e&1)r=r*a%m;return r;}long long luc(long long n,long long k,int p,const vector<long long>&f){long long r=1;while(n||k){int a=int(n%p),b=int(k%p);if(b>a)return 0;r=r*f[a]%p*pw(f[b],p-2,p)%p*pw(f[a-b],p-2,p)%p;n/=p;k/=p;}return r;}int main(){long long n,g;cin>>n>>g;if(g%MOD==0){cout<<0<<"\n";return 0;}vector<long long>d;for(long long i=1;i<=n/i;++i)if(n%i==0){d.push_back(i);if(i!=n/i)d.push_back(n/i);}int ps[4]={2,3,4679,35617};long long e=0;for(int p:ps){vector<long long>f(p,1);for(int i=1;i<p;++i)f[i]=f[i-1]*i%p;long long r=0;for(long long x:d)r=(r+luc(n,x,p,f))%p;long long q=PHI/p,iv=pw(q,p-2,p);e=(e+r*q%PHI*iv)%PHI;}cout<<pw(g,e,MOD)<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  const long long MOD=999911659,PHI=999911658;long long pw(long long a,long long e,long long m){long long r=1%m;for(a%=m;e;e>>=1,a=a*a%m)if(e&1)r=r*a%m;return r;}long long luc(long long n,long long k,int p,const vector<long long>&f){long long r=1;while(n||k){int a=int(n%p),b=int(k%p);if(b>a)return 0;r=r*f[a]%p*pw(f[b],p-2,p)%p*pw(f[a-b],p-2,p)%p;n/=p;k/=p;}return r;}int main(){long long n,g;cin>>n>>g;if(g%MOD==0){cout<<0<<"\n";return 0;}vector<long long>d;for(long long i=1;i<=n/i;++i)if(n%i==0){d.push_back(i);if(i!=n/i)d.push_back(n/i);}int ps[4]={2,3,4679,35617};long long e=0;for(int p:ps){vector<long long>f(p,1);for(int i=1;i<p;++i)f[i]=f[i-1]*i%p;long long r=0;for(long long x:d)r=(r+luc(n,x,p,f))%p;long long q=PHI/p,iv=pw(q,p-2,p);e=(e+r*q%PHI*iv)%PHI;}cout<<pw(g,e,MOD)<<"\n";}
external_url: https://www.luogu.com.cn/problem/P2480
external_platform: Luogu
external_problem_id: P2480
external_title: 古代豬文
external_relation: original
review_status: verified
---

本題以代數分解換取可驗證的快速查詢。
