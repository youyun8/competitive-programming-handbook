---
id: luogu-p3089
volume: upper
source_file: upper-volume
title: 洛谷 P3089 Pogo-Cow S
chapter: 5
section: '5.8'
kind: external-oj
difficulty: 4
topics: ['dynamic-programming', 'two-pointers']
prerequisites: ['dynamic-programming']
statement: >-
  數線上 n 個目標各有分數。可從任一點開始，只朝一個方向跳，且每次跳距不小於上次；落點得分，求最高總分。
constraints:
  - 1 <= n <= 1000
  - 目標座標互異
  - 分數為非負整數
input_format: 第一行 n；接著 n 行座標 x 與分數 p。
output_format: 輸出最高總分。
samples:
  - input: |-
      6
      5 6
      1 1
      10 5
      7 6
      4 8
      8 10
    output: |-
      25
    explanation: 可依序跳過座標 4、5、7、10，跳距 1、2、3，得分 25。
core_knowledge: ['非遞減跳距', '狀態換序', '雙向處理']
judgment: 狀態需記最後兩點；固定中間點後，隨下一落點遠離，合法前驅集合單調擴張，可用指標與前綴最大值。
hints:
  - 排序後先處理只向右跳，dp[i][j] 記從 i 的下一跳到 j 後可得的後續最佳值。
  - 固定 i，枚舉左側起點 j 時，以指標納入右側距離不小於 i-j 的候選。
  - 把座標取負並反轉，再做一次相同流程以涵蓋向左跳。
solution_outline: >-
  依 USACO 官方分析做兩輪。每輪從右向左固定 i，掃描 j 並單調移動 k，維護 score[k]+dp[k][i] 最大值，更新答案；第二輪鏡射座標。
proof_or_invariant: >-
  固定 i 時，當起跳點 j 向左移，首跳距離增大，符合下一跳距離至少首跳的右側 k 集合單調縮放；指標恰在每個門檻納入所有合法 k，running maximum 即完整轉移。鏡射後同理涵蓋另一方向。
common_errors: ['只計一個方向', '跳距不等號寫成嚴格大於', 'dp 未清零就錯誤混用鏡射輪次']
complexity:
  time: 'O(n^2)'
  space: 'O(n^2)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依狀態定義完成初始化、轉移與答案輸出。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<pair<int,int>>a(n);for(auto&[x,p]:a)cin>>x>>p;sort(a.begin(),a.end());vector<vector<int>>dp(n,vector<int>(n));int answer=0;for(int turn=0;turn<2;turn++){for(auto&row:dp)fill(row.begin(),row.end(),0);for(int i=n-1;i>=0;i--){int k=n,best=0;for(int j=0;j<=i;j++){while(k-1>i&&a[k-1].first-a[i].first>=a[i].first-a[j].first){--k;best=max(best,a[k].second+dp[k][i]);}dp[i][j]=best;answer=max(answer,a[i].second+best);}}for(auto&item:a)item.first=-item.first;reverse(a.begin(),a.end());}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3089
external_platform: 洛谷
external_problem_id: 'P3089'
external_title: Pogo-Cow S
external_relation: original
source_book_pages: [372]
source_pdf_pages: [390]
review_status: verified
---

改變枚舉順序後，原本第三層的合法前驅會隨距離門檻單調移動。
