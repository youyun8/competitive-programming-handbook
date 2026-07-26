---
id: openj-bailian-2065
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: OpenJ_Bailian 2065 SETI
chapter: 6
section: '6.4'
kind: external-oj
difficulty: 4
topics:
  - 高斯消元
  - 動態規劃
prerequisites:
  - 模運算與狀態還原
statement: 給定質數 p 與字串，字元代表 f(1)..f(n) 的值，其中 f(k)=Σa_i k^i mod p；求全部係數 a_i。
constraints:
  - p 為大於 n、26 的質數且 p<=30000
  - 字串長度<=70
input_format: 依題面讀入一組或多組矩陣、序列資料。
output_format: 依題面固定格式輸出數值、判定或操作方案。
samples:
  - input: |
      3
      31 aaa
      37 abc
      29 hello*earth
    output: |
      1 0 0
      0 1 0
      8 13 9 13 4 27 18 10 12 24 15
    explanation: 依題意模擬或代入方程可驗證此輸出。
core_knowledge:
  - 有限域消元
  - 方案構造
judgment: 以 k=1..n 建立范德蒙德方程組，在模質數 p 下用費馬逆元高斯消元。
hints:
  - 先確認操作可否轉成線性方程或符號選擇。
  - 利用模域消元、第一列枚舉或可達和 DP。
  - 除答案外還要保存最早行號、前驅或固定輸出格式。
solution_outline: 以 k=1..n 建立范德蒙德方程組，在模質數 p 下用費馬逆元高斯消元。
proof_or_invariant: p>n 使 1..n 互異，范德蒙德行列式非零，因此方程唯一；模域初等列運算保持解。
complexity:
  time: 每組 O(n^3+n log p)
  space: O(n^2)
common_errors:
  - 星期首尾天數少加一
  - 自由變數與矛盾列判斷錯誤
  - 方案還原後操作下標未隨刪除調整
cpp_skeleton: |
  // TODO：理解證明後重寫核心消元或 DP。
  #include <bits/stdc++.h>
  using namespace std;
  long long pw(long long a,long long e,long long p){long long r=1;for(;e;e>>=1,a=a*a%p)if(e&1)r=r*a%p;return r;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;while(T--){long long p;string s;cin>>p>>s;int n=static_cast<int>(s.size());vector<vector<long long>>a(n,vector<long long>(n+1));for(int i=0;i<n;++i){long long v=1;for(int j=0;j<n;++j)a[i][j]=v,v=v*(i+1)%p;a[i][n]=s[i]=='*'?0:s[i]-'a'+1;}for(int c=0;c<n;++c){int r=c;while(!a[r][c])++r;swap(a[r],a[c]);long long iv=pw(a[c][c],p-2,p);for(int j=c;j<=n;++j)a[c][j]=a[c][j]*iv%p;for(int i=0;i<n;++i)if(i!=c){long long q=a[i][c];for(int j=c;j<=n;++j)a[i][j]=(a[i][j]-q*a[c][j]%p+p)%p;}}for(int i=0;i<n;++i)cout<<(i?" ":"")<<a[i][n];cout<<"\n";}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  long long pw(long long a,long long e,long long p){long long r=1;for(;e;e>>=1,a=a*a%p)if(e&1)r=r*a%p;return r;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;while(T--){long long p;string s;cin>>p>>s;int n=static_cast<int>(s.size());vector<vector<long long>>a(n,vector<long long>(n+1));for(int i=0;i<n;++i){long long v=1;for(int j=0;j<n;++j)a[i][j]=v,v=v*(i+1)%p;a[i][n]=s[i]=='*'?0:s[i]-'a'+1;}for(int c=0;c<n;++c){int r=c;while(!a[r][c])++r;swap(a[r],a[c]);long long iv=pw(a[c][c],p-2,p);for(int j=c;j<=n;++j)a[c][j]=a[c][j]*iv%p;for(int i=0;i<n;++i)if(i!=c){long long q=a[i][c];for(int j=c;j<=n;++j)a[i][j]=(a[i][j]-q*a[c][j]%p+p)%p;}}for(int i=0;i<n;++i)cout<<(i?" ":"")<<a[i][n];cout<<"\n";}}
external_url: http://bailian.openjudge.cn/practice/2065/
external_platform: OpenJ_Bailian
external_problem_id: '2065'
external_title: SETI
external_relation: original
review_status: verified
---

本題需同時證明判定與輸出構造正確。
