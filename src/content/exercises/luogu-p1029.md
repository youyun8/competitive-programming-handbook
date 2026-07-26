---
id: luogu-p1029
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P1029 最大公約數和最小公倍數問題
chapter: 6
section: '6.7'
kind: external-oj
difficulty: 2
topics:
  - GCD 與 LCM
  - 質因數
prerequisites:
  - 最大公因數與整除
statement: 給定正整數 x0、y0，求有序正整數對 (p,q) 滿足 gcd(p,q)=x0 且 lcm(p,q)=y0 的數量。
constraints:
  - 2 <= x0,y0 <= 10^5
input_format: 兩個整數 x0、y0。
output_format: 輸出符合條件的有序數對數。
samples:
  - input: |
      3 60
    output: |
      4
    explanation: 除以 3 後需互質且乘積為 20，可分為 (1,20)、(4,5) 及反序。
core_knowledge:
  - 互質分配
  - 質因數分解
judgment: 若 x0 不整除 y0 則為 0；令 r=y0/x0，r 的每個完整質數冪必須全部分配給 p/x0 或 q/x0，故答案為 2^omega(r)。
hints:
  - 由 gcd·lcm=p·q 建立乘積關係。
  - 兩數同除 x0 後必須互質。
  - 同一質數的整個冪不能拆到兩邊。
solution_outline: 若 x0 不整除 y0 則為 0；令 r=y0/x0，r 的每個完整質數冪必須全部分配給 p/x0 或 q/x0，故答案為 2^omega(r)。
proof_or_invariant: 互質條件使 r 的每種質因數只能出現在一側；每種有兩個獨立選擇，反之每個分配都滿足 gcd 與 lcm。
complexity:
  time: O(sqrt(y0/x0))
  space: O(1)
common_errors:
  - 忘記檢查整除
  - 把質因數次方也當多次選擇
cpp_skeleton: |
  // TODO：理解證明後，可嘗試自行重寫核心步驟。
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);long long x,y;cin>>x>>y;if(y%x){cout<<0<<"\n";return 0;}long long r=y/x,ans=1;for(long long p=2;p<=r/p;++p)if(r%p==0){ans*=2;while(r%p==0)r/=p;}if(r>1)ans*=2;cout<<ans<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);long long x,y;cin>>x>>y;if(y%x){cout<<0<<"\n";return 0;}long long r=y/x,ans=1;for(long long p=2;p<=r/p;++p)if(r%p==0){ans*=2;while(r%p==0)r/=p;}if(r>1)ans*=2;cout<<ans<<"\n";}
external_url: https://www.luogu.com.cn/problem/P1029
external_platform: Luogu
external_problem_id: P1029
external_title: 最大公約數和最小公倍數問題
external_relation: original
review_status: verified
---

本題以可驗證的數論性質化簡後實作。
