---
id: luogu-p2447
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P2447 外星千足蟲
chapter: 6
section: '6.4'
kind: external-oj
difficulty: 5
topics:
  - 線性代數
  - 數論
prerequisites:
  - 高斯消元與圖論
statement: 由 m 條 GF(2) 統計方程判定 n 隻蟲子的奇偶身份；若唯一解，輸出最早足以確定解的觀測編號及各身份。
constraints:
  - n,m<=2000
  - 資料保證方程相容
input_format: 依題面讀入維度、矩陣、圖或測試資料。
output_format: 依指定精度與固定字串輸出答案。
samples:
  - input: |
      3 5
      011 1
      110 1
      101 0
      111 1
      010 1
    output: |
      4
      Earth
      ?y7M#
      Earth
    explanation: 依操作定義或方程直接驗算，可得到所示結果。
core_knowledge:
  - 不變量與代數建模
  - 消元或狀態搜尋
judgment: 以 64 位元區塊壓縮 GF(2) 增廣矩陣，逐欄選主元並消成單位矩陣；主元原始行號最大值即最早觀測數。
hints:
  - 先將幾何、操作或連通條件寫成方程或有限狀態。
  - 選擇符合代數結構的消元、矩陣樹或 BFS。
  - 最後處理唯一性、模數、精度與輸出方案。
solution_outline: 以 64 位元區塊壓縮 GF(2) 增廣矩陣，逐欄選主元並消成單位矩陣；主元原始行號最大值即最早觀測數。
proof_or_invariant: 異或列運算保持解集；秩為 n 當且僅當唯一解。每個主元首次使用的最大輸入行決定所有主元齊備的最早前綴。
complexity:
  time: O(nm(n/64))
  space: O(mn/64)
common_errors:
  - 主元或狀態編號錯誤
  - 非質數模數誤用逆元
  - 輸出精度或固定字串不符
cpp_skeleton: |
  // TODO：依證明自行重寫核心步驟。
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;int W=(n+1+63)/64;vector<vector<unsigned long long>>a(m,vector<unsigned long long>(W));for(int i=0;i<m;++i){string s;int v;cin>>s>>v;for(int j=0;j<n;++j)if(s[j]=='1')a[i][j/64]|=1ULL<<(j%64);if(v)a[i][n/64]|=1ULL<<(n%64);}int row=0,last=0;for(int c=0;c<n;++c){int p=row;while(p<m&&!((a[p][c/64]>>(c%64))&1ULL))++p;if(p==m)continue;last=max(last,p+1);swap(a[p],a[row]);for(int i=0;i<m;++i)if(i!=row&&((a[i][c/64]>>(c%64))&1ULL))for(int w=0;w<W;++w)a[i][w]^=a[row][w];++row;}if(row<n){cout<<"Cannot Determine\n";return 0;}cout<<last<<"\n";for(int i=0;i<n;++i)cout<<(((a[i][n/64]>>(n%64))&1ULL)?"?y7M#":"Earth")<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;int W=(n+1+63)/64;vector<vector<unsigned long long>>a(m,vector<unsigned long long>(W));for(int i=0;i<m;++i){string s;int v;cin>>s>>v;for(int j=0;j<n;++j)if(s[j]=='1')a[i][j/64]|=1ULL<<(j%64);if(v)a[i][n/64]|=1ULL<<(n%64);}int row=0,last=0;for(int c=0;c<n;++c){int p=row;while(p<m&&!((a[p][c/64]>>(c%64))&1ULL))++p;if(p==m)continue;last=max(last,p+1);swap(a[p],a[row]);for(int i=0;i<m;++i)if(i!=row&&((a[i][c/64]>>(c%64))&1ULL))for(int w=0;w<W;++w)a[i][w]^=a[row][w];++row;}if(row<n){cout<<"Cannot Determine\n";return 0;}cout<<last<<"\n";for(int i=0;i<n;++i)cout<<(((a[i][n/64]>>(n%64))&1ULL)?"?y7M#":"Earth")<<"\n";}
external_url: https://www.luogu.com.cn/problem/P2447
external_platform: Luogu
external_problem_id: P2447
external_title: 外星千足蟲
external_relation: original
review_status: verified
---

將題意轉成可驗證的代數或圖模型。
