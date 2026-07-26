---
id: luogu-p4552
volume: upper
source_file: upper-volume
title: 洛谷 P4552 IncDec Sequence
chapter: 2
section: '2.6'
kind: external-oj
difficulty: 3
topics: ['差分陣列', '正負配對']
prerequisites: []
statement: |-
  每次把任一區間加一或減一；求全序列相等的最少操作及最終值種類數。
constraints:
  - 'n<=100000；0<=a_i<=2^31。'
input_format: '輸入 n 與 n 個值。'
output_format: '輸出最少次數及種類數。'
samples:
  - input: |
      4
      1
      2
      2
      1
    output: |
      1
      1
    explanation: '範例依題意逐步套用操作後得到所示結果。'
core_knowledge: ['差分陣列', '正負配對']
judgment: '資料規模要求避免逐區間逐元素重算，應利用本節的差分、前綴或離散化技巧。'
hints:
  [
    '先把一次區間操作對邊界造成的變化寫出來。',
    '選擇能避免逐項重做的前綴／差分狀態。',
    '維護狀態不變量並特別檢查端點與輸出格式。'
  ]
solution_outline: '依核心狀態處理所有操作，再以一次掃描還原答案；完整實作見解答。'
proof_or_invariant: '每次更新只改變其影響範圍的邊界狀態；依序累積後，每個位置得到的值恰等於所有涵蓋它的操作貢獻，因此輸出正確。'
common_errors: ['端點差一', '未使用足夠寬的整數型別', '多組測資狀態未重設']
complexity:
  time: '符合官方資料範圍，至多線性或二維網格線性'
  space: '與輸入序列或網格大小同階'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：依提示完成演算法。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;long long p;cin>>p;long long a=0,b=0;for(int i=1;i<n;++i){long long x;cin>>x;long long d=x-p;if(d>0)a+=d;else b-=d;p=x;}cout<<max(a,b)<<'\n'<<llabs(a-b)+1<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P4552
external_platform: 洛谷
external_problem_id: 'P4552'
external_title: 'IncDec Sequence'
external_relation: original
source_book_pages: [75]
source_pdf_pages: [93]
review_status: verified
---

本題以獨立敘述與 C++17 解法整理。
