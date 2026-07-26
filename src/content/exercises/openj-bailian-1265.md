---
id: openj-bailian-1265
volume: lower
source_file: lower-volume
source_book_pages:
  - 420
source_pdf_pages:
  - 50
title: OpenJ_Bailian 1265 Area
chapter: 6
section: '6.8'
kind: external-oj
difficulty: 3
topics:
  - 數論
  - 最大公因數與同餘
prerequisites:
  - 整除與模運算
statement: 給定格點多邊形依序的邊向量，求內部格點數、邊界格點數與面積。
constraints:
  - 測試組數 T；每組邊數 n，頂點為整數格點
input_format: 依題意讀入一組或多組整數資料；終止條件見敘述。
output_format: 依題目指定格式逐組輸出答案。
samples:
  - input: |
      1
      4
      1 0
      0 1
      -1 0
      0 -1
    output: |+
      Scenario #1:
      0 4 1.0

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
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;for(int tc=1;tc<=T;++tc){int n;cin>>n;long long x=0,y=0,a=0,b=0;for(int i=0;i<n;++i){long long dx,dy;cin>>dx>>dy;long long nx=x+dx,ny=y+dy;a+=x*ny-y*nx;b+=gcd(llabs(dx),llabs(dy));x=nx;y=ny;}a=llabs(a);cout<<"Scenario #"<<tc<<":\n"<<(a-b+2)/2<<' '<<b<<' '<<a/2<<(a%2?".5":".0")<<"\n\n";}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;for(int tc=1;tc<=T;++tc){int n;cin>>n;long long x=0,y=0,a=0,b=0;for(int i=0;i<n;++i){long long dx,dy;cin>>dx>>dy;long long nx=x+dx,ny=y+dy;a+=x*ny-y*nx;b+=gcd(llabs(dx),llabs(dy));x=nx;y=ny;}a=llabs(a);cout<<"Scenario #"<<tc<<":\n"<<(a-b+2)/2<<' '<<b<<' '<<a/2<<(a%2?".5":".0")<<"\n\n";}}
external_url: http://bailian.openjudge.cn/practice/1265/
external_platform: OpenJ_Bailian
external_problem_id: '1265'
external_title: Area
external_relation: original
review_status: verified
---

以數論等價轉換縮小搜尋空間。
