---
id: luogu-p1908
volume: upper
source_file: upper-volume
title: 洛谷 P1908 逆序對
chapter: 2
section: '2.9'
kind: external-oj
difficulty: 4
topics: ['歸併排序', '逆序對']
prerequisites: []
statement: |-
  計算 i<j 且 a_i>a_j 的配對數。
constraints:
  - 'n<=500000；a_i<=10^9。'
input_format: '依題意輸入測資數、規模與資料；多組題讀到指定終止條件。'
output_format: '每組依題意輸出答案或圖形。'
samples:
  - input: |
      6
      5 4 2 6 3 1
    output: |
      11
    explanation: '依定義計算或遞迴展開後得到所示結果。'
core_knowledge: ['歸併排序', '逆序對']
judgment: '直接列舉成本過高或圖形具有自相似性，應使用排序、分治、遞迴或數學分解。'
hints:
  [
    '先明確定義較小子問題或排序後的局部目標。',
    '證明合併子問題結果時不會遺漏或重複計數。',
    '實作時處理相等值、端點、終止條件與寬整數。'
  ]
solution_outline: '依核心技巧拆成較小問題，求解後合併為原問題答案。'
proof_or_invariant: '每次拆分保持原問題所有候選恰被分配至一個子問題；合併步驟依定義計入跨區資訊，因此歸納可得答案正確。'
common_errors: ['終止條件或下標差一', '相等元素誤算', '計數溢位或輸出格式錯誤']
complexity:
  time: 'O(n log n)；圖形題與輸出大小同階'
  space: 'O(n)；圖形題與輸出大小同階'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：依三個提示完成。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;long long f(vector<int>&a,vector<int>&b,int l,int r){if(r-l<2)return 0;int m=(l+r)/2;long long z=f(a,b,l,m)+f(a,b,m,r);int i=l,j=m,k=l;while(i<m||j<r)if(j==r||(i<m&&a[i]<=a[j]))b[k++]=a[i++];else{b[k++]=a[j++];z+=m-i;}copy(b.begin()+l,b.begin()+r,a.begin()+l);return z;}int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>a(n),b(n);for(int&x:a)cin>>x;cout<<f(a,b,0,n)<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P1908
external_platform: 洛谷
external_problem_id: 'P1908'
external_title: '逆序對'
external_relation: original
source_book_pages: [92]
source_pdf_pages: [110]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
