---
id: openj-bailian-2635
volume: lower
source_file: lower-volume
source_book_pages:
  - 387
  - 461
source_pdf_pages:
  - 17
  - 91
title: OpenJ_Bailian 2635 The Embarrassed Cryptographer
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 3
topics:
  - 數論
  - 最大公因數與同餘
prerequisites:
  - 整除與模運算
statement: 給定巨大十進位整數 K 與 L，找出小於 L 且整除 K 的最小質數；不存在則輸出 GOOD。
constraints:
  - K 最多 100 位，L<=10^6；K=0、L=0 結束
input_format: 依題意讀入一組或多組整數資料；終止條件見敘述。
output_format: 依題目指定格式逐組輸出答案。
samples:
  - input: |
      141 10
      17 10
      0 0
    output: |
      BAD 3
      GOOD
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
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);const int V=1000000;vector<bool>c(V);vector<int>p;for(int i=2;i<V;++i)if(!c[i]){p.push_back(i);if((long long)i*i<V)for(int j=i*i;j<V;j+=i)c[j]=true;}string k;int L;while(cin>>k>>L&&k!="0"){int bad=0;for(int q:p){if(q>=L)break;int r=0;for(char z:k)r=(r*10+z-'0')%q;if(!r){bad=q;break;}}if(bad)cout<<"BAD "<<bad<<"\n";else cout<<"GOOD\n";}}
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);const int V=1000000;vector<bool>c(V);vector<int>p;for(int i=2;i<V;++i)if(!c[i]){p.push_back(i);if((long long)i*i<V)for(int j=i*i;j<V;j+=i)c[j]=true;}string k;int L;while(cin>>k>>L&&k!="0"){int bad=0;for(int q:p){if(q>=L)break;int r=0;for(char z:k)r=(r*10+z-'0')%q;if(!r){bad=q;break;}}if(bad)cout<<"BAD "<<bad<<"\n";else cout<<"GOOD\n";}}
external_url: http://bailian.openjudge.cn/practice/2635/
external_platform: OpenJ_Bailian
external_problem_id: '2635'
external_title: The Embarrassed Cryptographer
external_relation: original
review_status: verified
---

以數論等價轉換縮小搜尋空間。
