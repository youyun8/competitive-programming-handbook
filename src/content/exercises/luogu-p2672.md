---
id: luogu-p2672
volume: upper
source_file: upper-volume
title: 洛谷 P2672 推銷員
chapter: 2
section: '2.10'
kind: external-oj
difficulty: 4
topics: ['排序', '前綴和', '後綴最大值']
prerequisites: []
statement: |-
  選恰好 k 家推銷；疲勞為銷售疲勞和加最遠距離兩倍，對每個 k 求最大值。
constraints:
  - 'n<=100000；距離遞增且<10^8；銷售疲勞<1000。'
input_format: '依題意輸入測資數、規模與各項資料。'
output_format: '依題意輸出每組最優值。'
samples:
  - input: |
      3
      1 2 3
      1 1 1
    output: |
      7
      8
      9
    explanation: '按所述限制比較所有必要決策後，可得此最優值。'
core_knowledge: ['排序', '前綴和', '後綴最大值']
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
  using namespace std;struct H{long long s,a;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<H>h(n);for(auto&x:h)cin>>x.s;for(auto&x:h)cin>>x.a;sort(h.begin(),h.end(),[](H x,H y){return x.a>y.a;});vector<long long>sum(n+1),far(n+1),suf(n+1);for(int i=1;i<=n;++i){sum[i]=sum[i-1]+h[i-1].a;far[i]=max(far[i-1],h[i-1].s);}for(int i=n-1;i>=0;--i)suf[i]=max(suf[i+1],2*h[i].s+h[i].a);for(int k=1;k<=n;++k)cout<<max(sum[k]+2*far[k],sum[k-1]+suf[k-1])<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P2672
external_platform: 洛谷
external_problem_id: 'P2672'
external_title: '推銷員'
external_relation: original
source_book_pages: [99]
source_pdf_pages: [117]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
