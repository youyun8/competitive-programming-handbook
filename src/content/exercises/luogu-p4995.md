---
id: luogu-p4995
volume: upper
source_file: upper-volume
title: 洛谷 P4995 跳跳！
chapter: 2
section: '2.10'
kind: external-oj
difficulty: 4
topics: ['排序', '雙指標', '極值交替']
prerequisites: []
statement: |-
  從高度 0 開始走遍所有石頭，使相鄰高度差平方和最大。
constraints:
  - 'n<=300；高度<=10000。'
input_format: '依題意輸入測資數、規模與各項資料。'
output_format: '依題意輸出每組最優值。'
samples:
  - input: |
      3
      1 2 3
    output: |
      14
    explanation: '按所述限制比較所有必要決策後，可得此最優值。'
core_knowledge: ['排序', '雙指標', '極值交替']
judgment: '目標具有可交換的局部決策；以兩項交換論證導出排序規則，再線性累積。'
hints:
  [
    '先假設只有兩個候選，分別計算兩種先後順序。',
    '把較優順序化成可排序的比較式，避免浮點除法。',
    '排序後維護前綴量、剩餘量或樹形子問題答案。'
  ]
solution_outline: '依交換論證得到貪心次序，排序後逐項更新累積狀態與答案。'
proof_or_invariant: '若相鄰兩項違反比較式，交換它們不會使目標更差；反覆消除逆序可得到排序後方案，因此該方案全域最優。'
common_errors: ['比較器不滿足嚴格弱序', '乘積或總和溢位', '相等與邊界狀況處理錯誤']
complexity:
  time: 'O(n log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：完成貪心排序與答案計算。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;int main(){int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());int l=0,r=n-1;long long cur=0,ans=0;bool high=true;while(l<=r){long long x=high?a[r--]:a[l++];ans+=(x-cur)*(x-cur);cur=x;high=!high;}cout<<ans<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P4995
external_platform: 洛谷
external_problem_id: 'P4995'
external_title: '跳跳！'
external_relation: original
source_book_pages: [99]
source_pdf_pages: [117]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
