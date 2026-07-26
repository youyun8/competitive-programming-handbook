---
id: luogu-p3948
volume: upper
source_file: upper-volume
title: 洛谷 P3948 資料結構
chapter: 2
section: '2.6'
kind: external-oj
difficulty: 3
topics: ['延遲差分', '前綴計數']
prerequisites: []
statement: |-
  維護初始零序列的區間加；查詢區間內 min<=a_i*i mod mod<=max 的位置數，最後另有只查詢階段。
constraints:
  - 'n<=80000；操作中 Q<=1000；mod<=10000000。'
input_format: '輸入 n opt mod min max、操作，再輸入 Final 與查詢。'
output_format: '每次查詢輸出計數。'
samples:
  - input: |
      3 1 10 0 9
      Q 1 3
      1
      2 3
    output: |
      3
      2
    explanation: '範例依題意逐步套用操作後得到所示結果。'
core_knowledge: ['延遲差分', '前綴計數']
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
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,o;long long m,lo,hi;cin>>n>>o>>m>>lo>>hi;vector<long long>a(n+1),d(n+2);auto apply=[&](){long long s=0;for(int i=1;i<=n;++i){s+=d[i];a[i]+=s;d[i]=0;}d[n+1]=0;};auto ok=[&](int i){long long v=a[i]*i%m;return lo<=v&&v<=hi;};while(o--){char c;int l,r;cin>>c>>l>>r;if(c=='A'){long long x;cin>>x;d[l]+=x;d[r+1]-=x;}else{apply();int z=0;for(int i=l;i<=r;++i)z+=ok(i);cout<<z<<'\n';}}apply();vector<int>p(n+1);for(int i=1;i<=n;++i)p[i]=p[i-1]+ok(i);int q;cin>>q;while(q--){int l,r;cin>>l>>r;cout<<p[r]-p[l-1]<<'\n';}return 0;}
external_url: https://www.luogu.com.cn/problem/P3948
external_platform: 洛谷
external_problem_id: 'P3948'
external_title: '資料結構'
external_relation: original
source_book_pages: [75]
source_pdf_pages: [93]
review_status: verified
---

本題以獨立敘述與 C++17 解法整理。
