---
id: luogu-p2123
volume: upper
source_file: upper-volume
title: 洛谷 P2123 皇后遊戲
chapter: 2
section: '2.10'
kind: external-oj
difficulty: 4
topics: ['Johnson 法則', '交換論證']
prerequisites: []
statement: |-
  安排工作次序，使兩階段串行加工全部完成的時間最小。
constraints:
  - 'T<=20；n<=20000；加工時間<=100000。'
input_format: '依題意輸入測資數、規模與各項資料。'
output_format: '依題意輸出每組最優值。'
samples:
  - input: |
      1
      2
      1 3
      2 1
    output: |
      5
    explanation: '按所述限制比較所有必要決策後，可得此最優值。'
core_knowledge: ['Johnson 法則', '交換論證']
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
  using namespace std;struct J{long long a,b;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int T;cin>>T;while(T--){int n;cin>>n;vector<J>x(n);for(auto&v:x)cin>>v.a>>v.b;sort(x.begin(),x.end(),[](J p,J q){bool pg=p.a<p.b,qg=q.a<q.b;if(pg!=qg)return pg;if(pg)return p.a<q.a;return p.b>q.b;});long long first=0,second=0;for(auto v:x){first+=v.a;second=max(second,first)+v.b;}cout<<second<<'\n';}return 0;}
external_url: https://www.luogu.com.cn/problem/P2123
external_platform: 洛谷
external_problem_id: 'P2123'
external_title: '皇后遊戲'
external_relation: original
source_book_pages: [99]
source_pdf_pages: [117]
review_status: verified
---

本題採獨立繁體中文敘述與 C++17 解法。
