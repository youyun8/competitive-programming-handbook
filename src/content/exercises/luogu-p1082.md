---
id: luogu-p1082
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: Luogu P1082 同餘方程
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 2
topics:
  - 數論
  - 最大公因數與同餘
prerequisites:
  - 整除與模運算
statement: 求 a 在模 b 下的最小正乘法逆元。
constraints:
  - 2<=a,b<=2*10^9 且 gcd(a,b)=1
input_format: 依題意讀入一組或多組整數資料；終止條件見敘述。
output_format: 依題目指定格式逐組輸出答案。
samples:
  - input: |
      3 10
    output: |
      7
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
  int main(){long long a,b,x,y;cin>>a>>b;ex(a,b,x,y);cout<<(x%b+b)%b<<"\n";}

cpp_solution: |+
  #include <bits/stdc++.h>
  using namespace std;
  long long ex(long long a,long long b,long long&x,long long&y){if(!b){x=1;y=0;return a;}long long u,v,g=ex(b,a%b,u,v);x=v;y=u-a/b*v;return g;}
  int main(){long long a,b,x,y;cin>>a>>b;ex(a,b,x,y);cout<<(x%b+b)%b<<"\n";}

external_url: https://www.luogu.com.cn/problem/P1082
external_platform: Luogu
external_problem_id: P1082
external_title: 同餘方程
external_relation: original
review_status: verified
---

以數論等價轉換縮小搜尋空間。
