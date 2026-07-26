---
id: luogu-p3868
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P3868 猜數字
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 4
topics:
  - 數論
  - 最大公因數與同餘
prerequisites:
  - 整除與模運算
statement: 給定兩兩互質的模數 b_i 與餘數 a_i，求同時滿足所有同餘式的最小非負解。
constraints:
  - 1<=n<=10；乘積與答案在 64 位元範圍
input_format: 依題意讀入一組或多組整數資料；終止條件見敘述。
output_format: 依題目指定格式逐組輸出答案。
samples:
  - input: |
      2
      2 3
      3 5
    output: |
      8
    explanation: 代入題目定義計算，可得到所示結果。
core_knowledge:
  - 數論性質化簡
  - 64 位元安全運算
judgment: 先由整除、gcd 或同餘條件推導必要且充分條件，再以篩法、因數枚舉或擴展歐幾里得演算法計算。
hints:
  - 先把原條件改寫成整除或線性同餘式。
  - 用 gcd 判斷解是否存在，並縮小問題規模。
  - 注意正規化負餘數、乘法溢位與題目固定輸出格式。
solution_outline: 依證明中的等價轉換實作，對值域題預處理，對同餘題使用擴展歐幾里得演算法。
proof_or_invariant: 每一步僅使用雙向成立的整除或同餘等價轉換；演算法枚舉所有且僅有滿足轉換後條件的候選，因此不重不漏。
complexity:
  time: 依題型為 O(log V)、O(sqrt(V)) 或篩法 O(V log log V)
  space: O(1)；需要篩法時為 O(V)
common_errors:
  - 負餘數未正規化
  - 中間乘積使用 32 位元
  - 漏掉輸入終止條件
cpp_skeleton: |+
  // TODO：依提示自行重寫核心推導。
  #include <bits/stdc++.h>
  using namespace std;
  long long ex(long long a,long long b,long long&x,long long&y){if(!b){x=1;y=0;return a;}long long u,v,g=ex(b,a%b,u,v);x=v;y=u-a/b*v;return g;}
  long long mul(long long a,long long b,long long m){a=(a%m+m)%m;b=(b%m+m)%m;long long r=0;while(b){if(b&1)r=r>=m-a?r-(m-a):r+a;a=a>=m-a?a-(m-a):a+a;b>>=1;}return r;}
  int main(){int n;cin>>n;vector<long long>a(n),b(n);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;long long M=1,ans=0;for(long long x:b)M*=x;for(int i=0;i<n;++i){long long mi=M/b[i],x,y;ex(mi,b[i],x,y);long long term=mul(mul(a[i],mi,M),(x%b[i]+b[i])%b[i],M);ans=ans>=M-term?ans-(M-term):ans+term;}cout<<ans<<"\n";}

cpp_solution: |+
  #include <bits/stdc++.h>
  using namespace std;
  long long ex(long long a,long long b,long long&x,long long&y){if(!b){x=1;y=0;return a;}long long u,v,g=ex(b,a%b,u,v);x=v;y=u-a/b*v;return g;}
  long long mul(long long a,long long b,long long m){a=(a%m+m)%m;b=(b%m+m)%m;long long r=0;while(b){if(b&1)r=r>=m-a?r-(m-a):r+a;a=a>=m-a?a-(m-a):a+a;b>>=1;}return r;}
  int main(){int n;cin>>n;vector<long long>a(n),b(n);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;long long M=1,ans=0;for(long long x:b)M*=x;for(int i=0;i<n;++i){long long mi=M/b[i],x,y;ex(mi,b[i],x,y);long long term=mul(mul(a[i],mi,M),(x%b[i]+b[i])%b[i],M);ans=ans>=M-term?ans-(M-term):ans+term;}cout<<ans<<"\n";}

external_url: https://www.luogu.com.cn/problem/P3868
external_platform: Luogu
external_problem_id: P3868
external_title: 猜數字
external_relation: original
review_status: verified
---

以數論等價轉換縮小搜尋空間。
