---
id: luogu-p4000
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P4000 斐波那契數列
chapter: 6
section: '6.3'
kind: external-oj
difficulty: 5
topics:
  - 矩陣快速冪
  - 線性遞推
prerequisites:
  - Fibonacci 與模運算
statement: F_0=0、F_1=1、F_n=F_{n-1}+F_{n-2}。n 最長三千萬位，求 F_n mod p。
constraints:
  - 0<=n<=10^30000000
  - 1<=p<2^31
input_format: 依題面輸入 n、模數或兩組塊長。
output_format: 輸出一行答案。
samples:
  - input: |
      5
      1000000007
    output: |
      5
    explanation: 小型案例可直接遞推驗算。
core_knowledge:
  - 週期降冪
  - 線性遞推矩陣
judgment: 分解 p，取各質數冪 Pisano 週期倍數的 lcm；以字串計算 n 模週期，再快速倍增求 Fibonacci。
hints:
  - 先找出真正影響轉移的週期或集合交集。
  - 將巨大 n 對週期取模，或對固定階遞推做矩陣冪。
  - 特判模數 1、空交集與 n 不超過預處理範圍。
solution_outline: 分解 p，取各質數冪 Pisano 週期倍數的 lcm；以字串計算 n 模週期，再快速倍增求 Fibonacci。
proof_or_invariant: 所取 prime-power 值均為對應 Pisano 週期的倍數；互質模數乘積的週期整除各週期 lcm，因此縮減 n 不改餘數。快速倍增恆等式正確計算 F_n。
complexity:
  time: O(|n|+sqrt(p)+log p)
  space: O(log p)
common_errors:
  - 週期只算質數而漏質數冪
  - 矩陣狀態順序顛倒
  - 漏掉 f_0=1
cpp_skeleton: |
  // TODO：依提示重寫週期或矩陣部分。
  #include <bits/stdc++.h>
  using namespace std;
  using ll=long long;ll period(ll m){ll x=m,res=1;for(ll p=2;p<=x/p;++p)if(x%p==0){int e=0;ll pk=1;while(x%p==0)x/=p,++e,pk*=p;ll t=p==2?3:p==5?20:(p%5==1||p%5==4?p-1:2*(p+1));for(int i=1;i<e;++i)t*=p;res=lcm(res,t);}if(x>1){ll p=x,t=p==2?3:p==5?20:(p%5==1||p%5==4?p-1:2*(p+1));res=lcm(res,t);}return res;}pair<ll,ll>fib(ll n,ll m){if(!n)return {0,1%m};auto [a,b]=fib(n/2,m);ll c=a*((2*b%m-a+m)%m)%m,d=(a*a%m+b*b%m)%m;return n&1?make_pair(d,(c+d)%m):make_pair(c,d);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string n;ll p;cin>>n>>p;if(p==1){cout<<0<<"\n";return 0;}ll per=period(p),e=0;for(char c:n)e=(e*10+c-'0')%per;cout<<fib(e,p).first<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  using ll=long long;ll period(ll m){ll x=m,res=1;for(ll p=2;p<=x/p;++p)if(x%p==0){int e=0;ll pk=1;while(x%p==0)x/=p,++e,pk*=p;ll t=p==2?3:p==5?20:(p%5==1||p%5==4?p-1:2*(p+1));for(int i=1;i<e;++i)t*=p;res=lcm(res,t);}if(x>1){ll p=x,t=p==2?3:p==5?20:(p%5==1||p%5==4?p-1:2*(p+1));res=lcm(res,t);}return res;}pair<ll,ll>fib(ll n,ll m){if(!n)return {0,1%m};auto [a,b]=fib(n/2,m);ll c=a*((2*b%m-a+m)%m)%m,d=(a*a%m+b*b%m)%m;return n&1?make_pair(d,(c+d)%m):make_pair(c,d);}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);string n;ll p;cin>>n>>p;if(p==1){cout<<0<<"\n";return 0;}ll per=period(p),e=0;for(char c:n)e=(e*10+c-'0')%per;cout<<fib(e,p).first<<"\n";}
external_url: https://www.luogu.com.cn/problem/P4000
external_platform: Luogu
external_problem_id: P4000
external_title: 斐波那契數列
external_relation: original
review_status: verified
---

巨大下標需先證明可安全降維。
