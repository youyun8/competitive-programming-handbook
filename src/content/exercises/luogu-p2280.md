---
id: luogu-p2280
volume: upper
source_file: upper-volume
title: 洛谷 P2280 激光炸彈
chapter: 2
section: '2.6'
kind: external-oj
difficulty: 3
topics: ['二維前綴和', '固定窗口']
prerequisites: []
statement: |-
  用邊長 R 的軸平行正方形覆蓋帶價值整點，求最大價值。
constraints:
  - '座標在 0..5000；同座標價值累加。'
input_format: '輸入 n R 與 n 行 x y value。'
output_format: '輸出最大價值。'
samples:
  - input: |
      2 1
      0 0 1
      1 1 1
    output: |
      1
    explanation: '範例依題意逐步套用操作後得到所示結果。'
core_knowledge: ['二維前綴和', '固定窗口']
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
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,r;cin>>n>>r;const int z=5001;vector<vector<int>>s(z+1,vector<int>(z+1));while(n--){int x,y,v;cin>>x>>y>>v;s[x+1][y+1]+=v;}int ans=0;for(int i=1;i<=z;++i)for(int j=1;j<=z;++j){s[i][j]+=s[i-1][j]+s[i][j-1]-s[i-1][j-1];int a=max(0,i-r),b=max(0,j-r);ans=max(ans,s[i][j]-s[a][j]-s[i][b]+s[a][b]);}cout<<ans<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P2280
external_platform: 洛谷
external_problem_id: 'P2280'
external_title: '激光炸彈'
external_relation: original
source_book_pages: [75]
source_pdf_pages: [93]
review_status: verified
---

本題以獨立敘述與 C++17 解法整理。
