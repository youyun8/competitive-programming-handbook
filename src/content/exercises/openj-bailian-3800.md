---
id: openj-bailian-3800
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: OpenJ_Bailian 3800 Widget Factory
chapter: 6
section: '6.4'
kind: external-oj
difficulty: 5
topics:
  - 高斯消元
  - 動態規劃
prerequisites:
  - 模運算與狀態還原
statement: 由工人開始、結束星期與製作零件記錄，推斷每種零件需 3..9 天；判斷唯一解、多解或矛盾。
constraints:
  - 1<=n,m<=300
  - 每筆製作數 k<=10000；0 0 結束
input_format: 依題面讀入一組或多組矩陣、序列資料。
output_format: 依題面固定格式輸出數值、判定或操作方案。
samples:
  - input: |
      2 3
      2 MON THU
      1 2
      3 MON FRI
      1 1 2
      3 MON SUN
      1 2 2
      10 2
      1 MON TUE
      3
      1 MON WED
      3
      0 0
    output: |
      8 3
      Inconsistent data.
    explanation: 依題意模擬或代入方程可驗證此輸出。
core_knowledge:
  - 有限域消元
  - 方案構造
judgment: 工作天數方程在模 7 下成立；高斯消元比較係數秩與增廣秩，唯一解的剩餘類映射至 3..9。
hints:
  - 先確認操作可否轉成線性方程或符號選擇。
  - 利用模域消元、第一列枚舉或可達和 DP。
  - 除答案外還要保存最早行號、前驅或固定輸出格式。
solution_outline: 工作天數方程在模 7 下成立；高斯消元比較係數秩與增廣秩，唯一解的剩餘類映射至 3..9。
proof_or_invariant: 星期差包含首尾兩天，故常數為 end-start+1；域上的秩判準完整區分無解、多解、唯一解。
complexity:
  time: 每組 O(mn min(m,n)+總 k)
  space: O(mn)
common_errors:
  - 星期首尾天數少加一
  - 自由變數與矛盾列判斷錯誤
  - 方案還原後操作下標未隨刪除調整
cpp_skeleton: |
  // TODO：理解證明後重寫核心消元或 DP。
  #include <bits/stdc++.h>
  using namespace std;
  int inv7(int x){for(int i=1;i<7;++i)if(x*i%7==1)return i;return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);map<string,int>d{{"MON",0},{"TUE",1},{"WED",2},{"THU",3},{"FRI",4},{"SAT",5},{"SUN",6}};int n,m;while(cin>>n>>m&&(n||m)){vector<vector<int>>a(m,vector<int>(n+1));for(int i=0;i<m;++i){int k;string s,t;cin>>k>>s>>t;a[i][n]=(d[t]-d[s]+8)%7;while(k--){int x;cin>>x;--x;a[i][x]=(a[i][x]+1)%7;}}int row=0;vector<int>where(n,-1);for(int c=0;c<n&&row<m;++c){int p=row;while(p<m&&!a[p][c])++p;if(p==m)continue;swap(a[p],a[row]);int iv=inv7(a[row][c]);for(int j=c;j<=n;++j)a[row][j]=a[row][j]*iv%7;for(int i=0;i<m;++i)if(i!=row&&a[i][c]){int q=a[i][c];for(int j=c;j<=n;++j)a[i][j]=(a[i][j]-q*a[row][j]%7+7)%7;}where[c]=row++;}bool bad=false;for(int i=row;i<m;++i)if(a[i][n])bad=true;if(bad)cout<<"Inconsistent data.\n";else if(row<n)cout<<"Multiple solutions.\n";else{for(int i=0;i<n;++i){int x=a[where[i]][n];if(x<3)x+=7;cout<<(i?" ":"")<<x;}cout<<"\n";}}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int inv7(int x){for(int i=1;i<7;++i)if(x*i%7==1)return i;return 0;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);map<string,int>d{{"MON",0},{"TUE",1},{"WED",2},{"THU",3},{"FRI",4},{"SAT",5},{"SUN",6}};int n,m;while(cin>>n>>m&&(n||m)){vector<vector<int>>a(m,vector<int>(n+1));for(int i=0;i<m;++i){int k;string s,t;cin>>k>>s>>t;a[i][n]=(d[t]-d[s]+8)%7;while(k--){int x;cin>>x;--x;a[i][x]=(a[i][x]+1)%7;}}int row=0;vector<int>where(n,-1);for(int c=0;c<n&&row<m;++c){int p=row;while(p<m&&!a[p][c])++p;if(p==m)continue;swap(a[p],a[row]);int iv=inv7(a[row][c]);for(int j=c;j<=n;++j)a[row][j]=a[row][j]*iv%7;for(int i=0;i<m;++i)if(i!=row&&a[i][c]){int q=a[i][c];for(int j=c;j<=n;++j)a[i][j]=(a[i][j]-q*a[row][j]%7+7)%7;}where[c]=row++;}bool bad=false;for(int i=row;i<m;++i)if(a[i][n])bad=true;if(bad)cout<<"Inconsistent data.\n";else if(row<n)cout<<"Multiple solutions.\n";else{for(int i=0;i<n;++i){int x=a[where[i]][n];if(x<3)x+=7;cout<<(i?" ":"")<<x;}cout<<"\n";}}}
external_url: http://bailian.openjudge.cn/practice/3800/
external_platform: OpenJ_Bailian
external_problem_id: '3800'
external_title: Widget Factory
external_relation: original
review_status: verified
---

本題需同時證明判定與輸出構造正確。
