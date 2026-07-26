---
id: luogu-p1208
volume: upper
source_file: upper-volume
title: 洛谷 P1208 混合牛奶
chapter: 2
section: '2.10'
kind: external-oj
difficulty: 4
topics: ['排序', '貪心採購']
prerequisites: []
statement: |-
  從有限供應量的奶農購足需求，求最低成本。
constraints:
  - '需求與供應<=2000000；奶農<=5000；單價<=1000。'
input_format: '依題意輸入測資數、規模與各項資料。'
output_format: '依題意輸出每組最優值。'
samples:
  - input: |
      10 2
      2 4
      3 10
    output: |
      26
    explanation: '按所述限制比較所有必要決策後，可得此最優值。'
core_knowledge: ['排序', '貪心採購']
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
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);long long need;int m;cin>>need>>m;vector<pair<int,int>>a(m);for(auto&x:a)cin>>x.first>>x.second;sort(a.begin(),a.end());long long ans=0;for(auto[p,q]:a){long long take=min(need,static_cast<long long>(q));ans+=take*p;need-=take;}cout<<ans<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P1208
external_platform: 洛谷
external_problem_id: 'P1208'
external_title: '混合牛奶'
external_relation: original
source_book_pages: [99]
source_pdf_pages: [117]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
