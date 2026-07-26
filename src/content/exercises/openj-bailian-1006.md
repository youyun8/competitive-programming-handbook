---
id: openj-bailian-1006
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: OpenJ_Bailian 1006 Biorhythms
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 2
topics:
  - 數論
  - 最大公因數與同餘
prerequisites:
  - 整除與模運算
statement: 已知三個週期上次高峰日與目前日數，求下一次三週期同時高峰距今幾天。
constraints:
  - 輸入 p,e,i,d；全為 -1 結束
input_format: 依題意讀入一組或多組整數資料；終止條件見敘述。
output_format: 依題目指定格式逐組輸出答案。
samples:
  - input: |
      0 0 0 0
      -1 -1 -1 -1
    output: |
      Case 1: the next triple peak occurs in 21252 days.
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
  int main(){long long p,e,i,d;int tc=0;while(cin>>p>>e>>i>>d&&p!=-1){long long x=(5544*p+14421*e+1288*i-d)%21252;if(x<=0)x+=21252;cout<<"Case "<<++tc<<": the next triple peak occurs in "<<x<<" days.\n";}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){long long p,e,i,d;int tc=0;while(cin>>p>>e>>i>>d&&p!=-1){long long x=(5544*p+14421*e+1288*i-d)%21252;if(x<=0)x+=21252;cout<<"Case "<<++tc<<": the next triple peak occurs in "<<x<<" days.\n";}}
external_url: http://bailian.openjudge.cn/practice/1006/
external_platform: OpenJ_Bailian
external_problem_id: '1006'
external_title: Biorhythms
external_relation: original
review_status: verified
---

以數論等價轉換縮小搜尋空間。
