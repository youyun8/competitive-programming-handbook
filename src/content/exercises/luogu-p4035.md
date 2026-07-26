---
id: luogu-p4035
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P4035 球形空間產生器
chapter: 6
section: '6.4'
kind: external-oj
difficulty: 3
topics:
  - 線性代數
  - 數論
prerequisites:
  - 高斯消元與圖論
statement: 已知 n 維球面上的 n+1 個點，求唯一球心座標。
constraints:
  - 1<=n<=10
  - 座標絕對值<=20000
input_format: 依題面讀入維度、矩陣、圖或測試資料。
output_format: 依指定精度與固定字串輸出答案。
samples:
  - input: |
      2
      0.0 0.0
      -1.0 1.0
      1.0 0.0
    output: |
      0.500 1.500
    explanation: 依操作定義或方程直接驗算，可得到所示結果。
core_knowledge:
  - 不變量與代數建模
  - 消元或狀態搜尋
judgment: 兩個等半徑方程相減可消去半徑與球心平方項，得到 n 元一次方程組，再做主元選擇高斯消元。
hints:
  - 先將幾何、操作或連通條件寫成方程或有限狀態。
  - 選擇符合代數結構的消元、矩陣樹或 BFS。
  - 最後處理唯一性、模數、精度與輸出方案。
solution_outline: 兩個等半徑方程相減可消去半徑與球心平方項，得到 n 元一次方程組，再做主元選擇高斯消元。
proof_or_invariant: 每個線性方程與兩點到球心等距條件等價；唯一解保證消元所得座標即球心。
complexity:
  time: O(n^3)
  space: O(n^2)
common_errors:
  - 主元或狀態編號錯誤
  - 非質數模數誤用逆元
  - 輸出精度或固定字串不符
cpp_skeleton: |
  // TODO：依證明自行重寫核心步驟。
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;cin>>n;vector<vector<double>>p(n+1,vector<double>(n)),a(n,vector<double>(n+1));for(auto&r:p)for(double&x:r)cin>>x;for(int i=0;i<n;++i)for(int j=0;j<n;++j){a[i][j]=2*(p[i+1][j]-p[i][j]);a[i][n]+=p[i+1][j]*p[i+1][j]-p[i][j]*p[i][j];}for(int c=0;c<n;++c){int q=c;for(int i=c;i<n;++i)if(fabs(a[i][c])>fabs(a[q][c]))q=i;swap(a[c],a[q]);double d=a[c][c];for(int j=c;j<=n;++j)a[c][j]/=d;for(int i=0;i<n;++i)if(i!=c){d=a[i][c];for(int j=c;j<=n;++j)a[i][j]-=d*a[c][j];}}cout<<fixed<<setprecision(3);for(int i=0;i<n;++i)cout<<(i?" ":"")<<a[i][n];cout<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){int n;cin>>n;vector<vector<double>>p(n+1,vector<double>(n)),a(n,vector<double>(n+1));for(auto&r:p)for(double&x:r)cin>>x;for(int i=0;i<n;++i)for(int j=0;j<n;++j){a[i][j]=2*(p[i+1][j]-p[i][j]);a[i][n]+=p[i+1][j]*p[i+1][j]-p[i][j]*p[i][j];}for(int c=0;c<n;++c){int q=c;for(int i=c;i<n;++i)if(fabs(a[i][c])>fabs(a[q][c]))q=i;swap(a[c],a[q]);double d=a[c][c];for(int j=c;j<=n;++j)a[c][j]/=d;for(int i=0;i<n;++i)if(i!=c){d=a[i][c];for(int j=c;j<=n;++j)a[i][j]-=d*a[c][j];}}cout<<fixed<<setprecision(3);for(int i=0;i<n;++i)cout<<(i?" ":"")<<a[i][n];cout<<"\n";}
external_url: https://www.luogu.com.cn/problem/P4035
external_platform: Luogu
external_problem_id: P4035
external_title: 球形空間產生器
external_relation: original
review_status: verified
---

將題意轉成可驗證的代數或圖模型。
