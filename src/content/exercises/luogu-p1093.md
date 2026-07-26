---
id: luogu-p1093
volume: upper
source_file: upper-volume
title: 洛谷 P1093 獎學金
chapter: 2
section: '2.8'
kind: external-oj
difficulty: 4
topics: ['排序', '多重關鍵字']
prerequisites: []
statement: |-
  依總分降序、語文降序、學號升序排列學生，輸出前五名學號與總分。
constraints:
  - 'n<=300；三科各<=100。'
input_format: '依上列敘述順序輸入所有參數與操作。'
output_format: '依題意輸出每組答案。'
samples:
  - input: |
      6
      90 90 90
      80 90 90
      90 80 90
      90 90 80
      100 100 100
      0 0 0
    output: |
      5 300
      1 270
      3 260
      4 260
      2 260
    explanation: '依操作或定義直接計算可得此結果。'
core_knowledge: ['排序', '多重關鍵字']
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
  using namespace std;struct S{int id,ch,total;};int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<S>a;for(int i=1;i<=n;++i){int x,y,z;cin>>x>>y>>z;a.push_back({i,x,x+y+z});}sort(a.begin(),a.end(),[](const S&x,const S&y){if(x.total!=y.total)return x.total>y.total;if(x.ch!=y.ch)return x.ch>y.ch;return x.id<y.id;});for(int i=0;i<5;++i)cout<<a[i].id<<' '<<a[i].total<<'\n';return 0;}
external_url: https://www.luogu.com.cn/problem/P1093
external_platform: 洛谷
external_problem_id: 'P1093'
external_title: '獎學金'
external_relation: original
source_book_pages: [81]
source_pdf_pages: [99]
review_status: verified
---

本題採獨立敘述與 C++17 解法。
