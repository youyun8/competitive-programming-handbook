---
id: luogu-p3406
volume: upper
source_file: upper-volume
title: 洛谷 P3406 海底高鐵
chapter: 2
section: '2.6'
kind: external-oj
difficulty: 3
topics: ['差分陣列', '獨立決策']
prerequisites: []
statement: |-
  依序造訪城市；每段鐵路可原價逐次購票或付卡費後用優惠價，求最小總費。
constraints:
  - 'n,m<=100000；三種費用<=100000。'
input_format: '輸入 n m、造訪序列及 n-1 行 A B C。'
output_format: '輸出最小費用。'
samples:
  - input: |
      3 2
      1 3
      5 3 1
      5 3 1
    output: |
      8
    explanation: '範例依題意逐步套用操作後得到所示結果。'
core_knowledge: ['差分陣列', '獨立決策']
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
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<int>p(m),d(n+1);for(int&i:p)cin>>i;for(int i=1;i<m;++i){int l=min(p[i-1],p[i]),r=max(p[i-1],p[i]);++d[l];--d[r];}long long ans=0;int c=0;for(int i=1;i<n;++i){c+=d[i];long long a,b,k;cin>>a>>b>>k;ans+=min(a*c,b*c+k);}cout<<ans<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P3406
external_platform: 洛谷
external_problem_id: 'P3406'
external_title: '海底高鐵'
external_relation: original
source_book_pages: [75]
source_pdf_pages: [93]
review_status: verified
---

本題以獨立敘述與 C++17 解法整理。
