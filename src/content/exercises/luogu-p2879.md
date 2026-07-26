---
id: luogu-p2879
volume: upper
source_file: upper-volume
title: 洛谷 P2879 Tallest Cow S
chapter: 2
section: '2.6'
kind: external-oj
difficulty: 3
topics: ['差分陣列', '關係去重']
prerequisites: []
statement: |-
  已知最高高度 H 與可見關係；每對端點間的牛必須更矮，求每頭牛最大可能高度。
constraints:
  - 'n,R<=10000；H<=1000000；保證有解。'
input_format: '輸入 n I H R 與 R 行端點。'
output_format: '逐行輸出最大高度。'
samples:
  - input: |
      3 1 5 1
      1 3
    output: |
      5
      4
      5
    explanation: '範例依題意逐步套用操作後得到所示結果。'
core_knowledge: ['差分陣列', '關係去重']
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
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,k,h,r;cin>>n>>k>>h>>r;(void)k;vector<int>d(n+2);set<pair<int,int>>s;while(r--){int a,b;cin>>a>>b;if(a>b)swap(a,b);if(s.insert({a,b}).second){--d[a+1];++d[b];}}int x=0;for(int i=1;i<=n;++i){x+=d[i];cout<<h+x<<'\n';}return 0;}
external_url: https://www.luogu.com.cn/problem/P2879
external_platform: 洛谷
external_problem_id: 'P2879'
external_title: 'Tallest Cow S'
external_relation: original
source_book_pages: [75]
source_pdf_pages: [93]
review_status: verified
---

本題以獨立敘述與 C++17 解法整理。
