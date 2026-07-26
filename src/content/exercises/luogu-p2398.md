---
id: luogu-p2398
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P2398 GCD SUM
chapter: 6
section: '6.7'
kind: external-oj
difficulty: 4
topics:
  - 歐拉函數
  - 整除分塊
prerequisites:
  - 最大公因數與整除
statement: 給定 n，計算 sum_{i=1..n} sum_{j=1..n} gcd(i,j)。
constraints:
  - 1 <= n <= 10^5
input_format: 一個整數 n。
output_format: 輸出 GCD 總和。
samples:
  - input: |
      2
    output: |
      5
    explanation: 四對的 gcd 分別為 1、1、1、2，總和 5。
core_knowledge:
  - 歐拉函數恆等式
  - 篩法
judgment: 利用 gcd(i,j)=sum_{d|i,d|j} phi(d)，交換求和得 sum_{d=1..n} phi(d)·floor(n/d)^2。
hints:
  - 嘗試把 gcd 表成其所有因數的函數和。
  - 使用 sum_{d|x} phi(d)=x。
  - 交換 d 與數對的枚舉順序。
solution_outline: 利用 gcd(i,j)=sum_{d|i,d|j} phi(d)，交換求和得 sum_{d=1..n} phi(d)·floor(n/d)^2。
proof_or_invariant: 對每對 (i,j)，共同因數恰為 gcd(i,j) 的因數，phi 的因數和等於 gcd；交換有限總和後，每個 d 整除 floor(n/d)^2 對。
complexity:
  time: O(n log log n)
  space: O(n)
common_errors:
  - 平方在 int 溢位
  - 誤算無序數對
cpp_skeleton: |
  // TODO：理解證明後，可嘗試自行重寫核心步驟。
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<long long> phi(n+1);for(int i=0;i<=n;++i)phi[i]=i;for(int i=2;i<=n;++i)if(phi[i]==i)for(int j=i;j<=n;j+=i)phi[j]=phi[j]/i*(i-1);long long ans=0;for(int d=1;d<=n;++d){long long q=n/d;ans+=phi[d]*q*q;}cout<<ans<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<long long> phi(n+1);for(int i=0;i<=n;++i)phi[i]=i;for(int i=2;i<=n;++i)if(phi[i]==i)for(int j=i;j<=n;j+=i)phi[j]=phi[j]/i*(i-1);long long ans=0;for(int d=1;d<=n;++d){long long q=n/d;ans+=phi[d]*q*q;}cout<<ans<<"\n";}
external_url: https://www.luogu.com.cn/problem/P2398
external_platform: Luogu
external_problem_id: P2398
external_title: GCD SUM
external_relation: original
review_status: verified
---

本題以可驗證的數論性質化簡後實作。
