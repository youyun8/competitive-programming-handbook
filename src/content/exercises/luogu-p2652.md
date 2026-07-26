---
id: luogu-p2652
volume: upper
source_file: upper-volume
title: 洛谷 P2652 同花順
chapter: 2
section: '2.7'
kind: external-oj
difficulty: 4
topics: ['排序', '雙指標', '去重']
prerequisites: []
statement: |-
  更換最少牌，使 n 張牌花色相同且點數連續。
constraints:
  - 'n<=100000；花色與點數<=10^9。'
input_format: '依上列敘述順序輸入所有參數與操作。'
output_format: '依題意輸出每組答案。'
samples:
  - input: |
      5
      1 9
      1 10
      2 11
      2 12
      2 13
    output: |
      2
    explanation: '依操作或定義直接計算可得此結果。'
core_knowledge: ['排序', '雙指標', '去重']
judgment: '座標或狀態範圍大，但實際事件有限，應用本節離散化、差分或狀態壓縮。'
hints:
  [
    '先找出真正會改變答案的事件或邊界。',
    '將大座標／大量區間轉成有限狀態後依序處理。',
    '維持狀態不變量，最後掃描所有候選並取最優。'
  ]
solution_outline: '依核心知識壓縮資料，再按事件順序更新並輸出答案。'
proof_or_invariant: '壓縮後每個原始事件仍有唯一對應，且事件間狀態不變；逐段計算涵蓋所有候選，因此所得值與原問題相同。'
common_errors: ['閉區間端點處理錯誤', '多組資料未清空', '計數或面積使用 int 溢位']
complexity:
  time: 'O(n log n) 或與壓縮後網格大小同階'
  space: 'O(n) 或與壓縮後網格大小同階'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      // TODO：依提示完成。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<pair<long long,long long>>a(n);for(auto&[c,v]:a)cin>>c>>v;sort(a.begin(),a.end());a.erase(unique(a.begin(),a.end()),a.end());int best=0;for(size_t l=0,r=0;r<a.size();++r){if(r>0&&a[r].first!=a[r-1].first)l=r;while(l<r&&a[r].second-a[l].second>=n)++l;best=max(best,static_cast<int>(r-l+1));}cout<<n-best<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P2652
external_platform: 洛谷
external_problem_id: 'P2652'
external_title: '同花順'
external_relation: original
source_book_pages: [78]
source_pdf_pages: [96]
review_status: verified
---

本題採獨立敘述與 C++17 解法。
