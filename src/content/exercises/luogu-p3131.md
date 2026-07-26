---
id: luogu-p3131
volume: upper
source_file: upper-volume
title: 洛谷 P3131 Subsequences Summing to Sevens S
chapter: 2
section: '2.6'
kind: external-oj
difficulty: 3
topics: ['前綴和', '同餘']
prerequisites: []
statement: |-
  求總和為 7 倍數的最長連續子序列。
constraints:
  - 'n<=50000；ID<=1000000。'
input_format: '輸入 n 與 n 個 ID。'
output_format: '輸出最長長度。'
samples:
  - input: |
      5
      5
      1
      6
      2
      14
    output: |
      5
    explanation: '範例依題意逐步套用操作後得到所示結果。'
core_knowledge: ['前綴和', '同餘']
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
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;array<int,7>f;f.fill(-1);f[0]=0;int r=0,ans=0;for(int i=1,x;i<=n;++i){cin>>x;r=(r+x)%7;if(f[r]<0)f[r]=i;else ans=max(ans,i-f[r]);}cout<<ans<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P3131
external_platform: 洛谷
external_problem_id: 'P3131'
external_title: 'Subsequences Summing to Sevens S'
external_relation: original
source_book_pages: [75]
source_pdf_pages: [93]
review_status: verified
---

本題以獨立敘述與 C++17 解法整理。
