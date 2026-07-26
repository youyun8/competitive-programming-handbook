---
id: openj-bailian-1845
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: OpenJ_Bailian 1845 Sumdiv
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 4
topics:
  - 數論
  - 最大公因數與同餘
prerequisites:
  - 整除與模運算
statement: 計算 A^B 的所有正因數和，答案模 9901。
constraints:
  - 0<=A,B<=50000000
input_format: 依題意讀入一組或多組整數資料；終止條件見敘述。
output_format: 依題目指定格式逐組輸出答案。
samples:
  - input: |
      2 3
    output: |
      15
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
cpp_skeleton: |
  // TODO：依提示自行重寫核心推導。
  #include <bits/stdc++.h>
  using namespace std;
  const long long M=9901;long long pw(long long a,long long n){long long r=1;for(;n;n>>=1,a=a*a%M)if(n&1)r=r*a%M;return r;}long long sum(long long p,long long n){if(n==0)return 1;if(n&1)return sum(p,n/2)*(1+pw(p,n/2+1))%M;return (sum(p,n-1)+pw(p,n))%M;}int main(){long long A,B,ans=1;cin>>A>>B;if(A==0){cout<<0<<"\n";return 0;}for(long long p=2;p<=A/p;++p)if(A%p==0){long long e=0;while(A%p==0)A/=p,++e;ans=ans*sum(p,e*B)%M;}if(A>1)ans=ans*sum(A,B)%M;cout<<ans<<"\n";}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  const long long M=9901;long long pw(long long a,long long n){long long r=1;for(;n;n>>=1,a=a*a%M)if(n&1)r=r*a%M;return r;}long long sum(long long p,long long n){if(n==0)return 1;if(n&1)return sum(p,n/2)*(1+pw(p,n/2+1))%M;return (sum(p,n-1)+pw(p,n))%M;}int main(){long long A,B,ans=1;cin>>A>>B;if(A==0){cout<<0<<"\n";return 0;}for(long long p=2;p<=A/p;++p)if(A%p==0){long long e=0;while(A%p==0)A/=p,++e;ans=ans*sum(p,e*B)%M;}if(A>1)ans=ans*sum(A,B)%M;cout<<ans<<"\n";}
external_url: http://bailian.openjudge.cn/practice/1845/
external_platform: OpenJ_Bailian
external_problem_id: '1845'
external_title: Sumdiv
external_relation: original
review_status: verified
---

以數論等價轉換縮小搜尋空間。
