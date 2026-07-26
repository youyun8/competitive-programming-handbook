---
id: luogu-p1890
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P1890 gcd 區間
chapter: 6
section: '6.7'
kind: external-oj
difficulty: 2
topics:
  - 區間 GCD
  - 稀疏表
prerequisites:
  - 最大公因數與整除
statement: 給定正整數序列，回答多次區間 [l,r] 的最大公因數。
constraints:
  - 1 <= n,m <= 10^5
  - 序列元素為 32 位元正整數
input_format: 第一行 n、m；第二行 n 個數；接著 m 行各給 l、r。
output_format: 每個詢問輸出一行區間 gcd。
samples:
  - input: |
      5 3
      2 6 9 3 15
      1 2
      2 5
      3 3
    output: |
      2
      3
      9
    explanation: 三段的 gcd 分別為 gcd(2,6)、gcd(6,9,3,15) 與單點 9。
core_knowledge:
  - 冪等運算
  - Sparse Table
judgment: gcd 具結合律與冪等性，可用兩個長度 2^k、覆蓋查詢區間的重疊區塊回答。
hints:
  - 區間內容不修改，可先預處理。
  - 長度為 2^k 的 gcd 可由兩半合併。
  - 查詢時選 k=floor(log2(length))，取左右兩塊 gcd。
solution_outline: gcd 具結合律與冪等性，可用兩個長度 2^k、覆蓋查詢區間的重疊區塊回答。
proof_or_invariant: 左右兩塊聯集覆蓋整個區間；重疊元素因 gcd(x,x)=x 不影響結果，結合律保證合併等於全區間 gcd。
complexity:
  time: 預處理 O(n log n)，每詢問 O(1)
  space: O(n log n)
common_errors:
  - log 長度算錯
  - 右區塊起點少加 1
cpp_skeleton: |
  // TODO：理解證明後，可嘗試自行重寫核心步驟。
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;int K=1;while((1<<K)<=n)++K;vector<vector<int>>st(K,vector<int>(n));for(int&i:st[0])cin>>i;for(int k=1;k<K;++k)for(int i=0;i+(1<<k)<=n;++i)st[k][i]=gcd(st[k-1][i],st[k-1][i+(1<<(k-1))]);vector<int>lg(n+1);for(int i=2;i<=n;++i)lg[i]=lg[i/2]+1;while(m--){int l,r;cin>>l>>r;--l;int k=lg[r-l];cout<<gcd(st[k][l],st[k][r-(1<<k)])<<"\n";}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;int K=1;while((1<<K)<=n)++K;vector<vector<int>>st(K,vector<int>(n));for(int&i:st[0])cin>>i;for(int k=1;k<K;++k)for(int i=0;i+(1<<k)<=n;++i)st[k][i]=gcd(st[k-1][i],st[k-1][i+(1<<(k-1))]);vector<int>lg(n+1);for(int i=2;i<=n;++i)lg[i]=lg[i/2]+1;while(m--){int l,r;cin>>l>>r;--l;int k=lg[r-l];cout<<gcd(st[k][l],st[k][r-(1<<k)])<<"\n";}}
external_url: https://www.luogu.com.cn/problem/P1890
external_platform: Luogu
external_problem_id: P1890
external_title: gcd 區間
external_relation: original
review_status: verified
---

本題以可驗證的數論性質化簡後實作。
