---
id: openj-bailian-2115
volume: lower
source_file: lower-volume
source_book_pages:
  - 425
source_pdf_pages:
  - 55
title: OpenJ_Bailian 2115 C Looooops
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 3
topics:
  - 數論
  - 最大公因數與同餘
prerequisites:
  - 整除與模運算
statement: 求最小非負 x 使 a+c*x 與 b 在模 2^k 下同餘；無解輸出 FOREVER。
constraints:
  - 0<=a,b,c<2^k，k<=31；四個 0 結束
input_format: 依題意讀入一組或多組整數資料；終止條件見敘述。
output_format: 依題目指定格式逐組輸出答案。
samples:
  - input: |
      3 3 2 4
      1 2 2 2
      0 0 0 0
    output: |
      0
      FOREVER
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
  int main(){long long a,b,c,k,x,y;while(cin>>a>>b>>c>>k&&(a||b||c||k)){long long mod=1LL<<k,g=ex(c,mod,x,y),d=b-a;if(d%g)cout<<"FOREVER\n";else{long long q=mod/g,ans=x*(d/g)%q;cout<<(ans+q)%q<<"\n";}}}

cpp_solution: |+
  #include <bits/stdc++.h>
  using namespace std;
  long long ex(long long a,long long b,long long&x,long long&y){if(!b){x=1;y=0;return a;}long long u,v,g=ex(b,a%b,u,v);x=v;y=u-a/b*v;return g;}
  int main(){long long a,b,c,k,x,y;while(cin>>a>>b>>c>>k&&(a||b||c||k)){long long mod=1LL<<k,g=ex(c,mod,x,y),d=b-a;if(d%g)cout<<"FOREVER\n";else{long long q=mod/g,ans=x*(d/g)%q;cout<<(ans+q)%q<<"\n";}}}

external_url: http://bailian.openjudge.cn/practice/2115/
external_platform: OpenJ_Bailian
external_problem_id: '2115'
external_title: C Looooops
external_relation: original
review_status: verified
---

以數論等價轉換縮小搜尋空間。
