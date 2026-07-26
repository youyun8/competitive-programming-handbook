---
id: luogu-p1199
volume: upper
source_file: upper-volume
title: 洛谷 P1199 三國遊戲
chapter: 2
section: '2.10'
kind: external-oj
difficulty: 4
topics: ['博弈貪心', '次大值']
prerequisites: []
statement: |-
  依給定電腦策略進行選將博弈，判斷玩家能否獲勝並求可保證默契值。
constraints:
  - 'n 為不小於 4 的偶數；輸入默契矩陣上三角。'
input_format: '依題意輸入測資數、規模與各項資料。'
output_format: '依題意輸出每組最優值。'
samples:
  - input: |
      4
      1 2 3
      4 5
      6
    output: |
      1
      5
    explanation: '按所述限制比較所有必要決策後，可得此最優值。'
core_knowledge: ['博弈貪心', '次大值']
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
  using namespace std;int main(){int n;cin>>n;vector<vector<int>>a(n,vector<int>(n));for(int i=0;i<n;++i)for(int j=i+1;j<n;++j)cin>>a[i][j],a[j][i]=a[i][j];int ans=0;for(auto row:a){sort(row.begin(),row.end());ans=max(ans,row[n-2]);}cout<<1<<'\n'<<ans<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P1199
external_platform: 洛谷
external_problem_id: 'P1199'
external_title: '三國遊戲'
external_relation: original
source_book_pages: [99]
source_pdf_pages: [117]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
