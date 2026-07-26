---
id: luogu-p4111
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P4111 小 Z 的房間
chapter: 6
section: '6.4'
kind: external-oj
difficulty: 5
topics:
  - 線性代數
  - 數論
prerequisites:
  - 高斯消元與圖論
statement: 網格中的點號代表房間、星號代表柱子；拆除相鄰房間牆壁，使全部房間連通且任兩房間僅一條路，求方案數模 10^9。
constraints:
  - 1<=n,m<=9
input_format: 依題面讀入維度、矩陣、圖或測試資料。
output_format: 依指定精度與固定字串輸出答案。
samples:
  - input: |
      2 2
      ..
      ..
    output: |
      4
    explanation: 依操作定義或方程直接驗算，可得到所示結果。
core_knowledge:
  - 不變量與代數建模
  - 消元或狀態搜尋
judgment: 把房間建成無向圖；矩陣樹定理將生成樹數轉為拉普拉斯矩陣任一主子式行列式。模數非質數，使用整數輾轉消元。
hints:
  - 先將幾何、操作或連通條件寫成方程或有限狀態。
  - 選擇符合代數結構的消元、矩陣樹或 BFS。
  - 最後處理唯一性、模數、精度與輸出方案。
solution_outline: 把房間建成無向圖；矩陣樹定理將生成樹數轉為拉普拉斯矩陣任一主子式行列式。模數非質數，使用整數輾轉消元。
proof_or_invariant: 合法拆牆方案與圖的生成樹一一對應；Kirchhoff 定理給出主子式行列式，整數行列式消元只做保持或改變符號的初等操作。
complexity:
  time: O((nm)^3)
  space: O((nm)^2)
common_errors:
  - 主元或狀態編號錯誤
  - 非質數模數誤用逆元
  - 輸出精度或固定字串不符
cpp_skeleton: |
  // TODO：依證明自行重寫核心步驟。
  #include <bits/stdc++.h>
  using namespace std;
  const long long M=1000000000;int main(){int n,m;cin>>n>>m;vector<string>s(n);for(auto&x:s)cin>>x;vector<vector<int>>id(n,vector<int>(m,-1));int N=0;for(int i=0;i<n;++i)for(int j=0;j<m;++j)if(s[i][j]=='.')id[i][j]=N++;if(N==1){cout<<1<<"\n";return 0;}vector<vector<long long>>a(N-1,vector<long long>(N-1));int dx[2]={1,0},dy[2]={0,1};for(int i=0;i<n;++i)for(int j=0;j<m;++j)if(id[i][j]>=0)for(int z=0;z<2;++z){int x=i+dx[z],y=j+dy[z];if(x<n&&y<m&&id[x][y]>=0){int u=id[i][j],v=id[x][y];if(u<N-1)++a[u][u];if(v<N-1)++a[v][v];if(u<N-1&&v<N-1)--a[u][v],--a[v][u];}}long long ans=1;for(int i=0;i<N-1;++i){for(int j=i+1;j<N-1;++j)while(a[j][i]){long long q=a[i][i]/a[j][i];for(int k=i;k<N-1;++k){a[i][k]=(a[i][k]-q*a[j][k])%M;swap(a[i][k],a[j][k]);}ans=-ans;}ans=ans*a[i][i]%M;}cout<<(ans%M+M)%M<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  const long long M=1000000000;int main(){int n,m;cin>>n>>m;vector<string>s(n);for(auto&x:s)cin>>x;vector<vector<int>>id(n,vector<int>(m,-1));int N=0;for(int i=0;i<n;++i)for(int j=0;j<m;++j)if(s[i][j]=='.')id[i][j]=N++;if(N==1){cout<<1<<"\n";return 0;}vector<vector<long long>>a(N-1,vector<long long>(N-1));int dx[2]={1,0},dy[2]={0,1};for(int i=0;i<n;++i)for(int j=0;j<m;++j)if(id[i][j]>=0)for(int z=0;z<2;++z){int x=i+dx[z],y=j+dy[z];if(x<n&&y<m&&id[x][y]>=0){int u=id[i][j],v=id[x][y];if(u<N-1)++a[u][u];if(v<N-1)++a[v][v];if(u<N-1&&v<N-1)--a[u][v],--a[v][u];}}long long ans=1;for(int i=0;i<N-1;++i){for(int j=i+1;j<N-1;++j)while(a[j][i]){long long q=a[i][i]/a[j][i];for(int k=i;k<N-1;++k){a[i][k]=(a[i][k]-q*a[j][k])%M;swap(a[i][k],a[j][k]);}ans=-ans;}ans=ans*a[i][i]%M;}cout<<(ans%M+M)%M<<"\n";}
external_url: https://www.luogu.com.cn/problem/P4111
external_platform: Luogu
external_problem_id: P4111
external_title: 小 Z 的房間
external_relation: original
review_status: verified
---

將題意轉成可驗證的代數或圖模型。
