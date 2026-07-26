---
id: luogu-p4767
volume: upper
source_file: upper-volume
title: 洛谷 P4767 郵局 加強版
chapter: 5
section: '5.10'
kind: external-oj
difficulty: 4
topics: ['divide-and-conquer-dp', 'median']
prerequisites: ['dynamic-programming']
statement: >-
  數線上有 n 個村莊，需設恰好 m 間郵局且郵局位於村莊；最小化每個村莊到最近郵局的距離總和。
constraints:
  - 1 <= m <= n <= 3000
  - 村莊座標嚴格遞增
  - 答案需 64 位
input_format: 第一行 n、m；第二行 n 個村莊座標。
output_format: 輸出最小距離總和。
samples:
  - input: |-
      5 2
      1 2 3 6 7
    output: |-
      3
    explanation: 在座標 2 與 6 設郵局，總距離為 1+0+1+0+1=3。
core_knowledge: ['郵局選址', '區間中位數', '決策單調性']
judgment: 固定一段連續村莊共用一間郵局時，最佳位置是中位數；全局最優可分成 m 個連續段。
hints:
  - 以前綴和 O(1) 計算 cost(l,r)：所有點到中位數座標的距離和。
  - dp[g][i]=min_{k<i}(dp[g-1][k]+cost(k+1,i))。
  - 區間中位數成本是 Monge，最佳 k 對 i 單調；用分治決策優化計算每層。
solution_outline: >-
  預處理前綴座標。每個郵局層以 divide(left,right,opt_left,opt_right) 計算中點最佳切點，再遞迴兩側；滾動 dp。
proof_or_invariant: >-
  一維絕對距離和由中位數最小化。最近郵局分配在排序後必形成連續段，否則交換交錯分配不增成本。中位數區間成本滿足四邊形不等式，故 DP 最佳切點單調，分治搜尋範圍包含真正最優值。
common_errors: ['中位數左右前綴和公式差一', '允許空分段', '分治右子樹仍使用舊 opt_left']
complexity:
  time: 'O(mn log n)'
  space: 'O(n)'
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
  #include <functional>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;cin>>n>>m;vector<long long>x(n+1),prefix(n+1);for(int i=1;i<=n;i++){cin>>x[i];prefix[i]=prefix[i-1]+x[i];}auto cost=[&](int l,int r){int mid=(l+r)/2;return x[mid]*(mid-l+1)-(prefix[mid]-prefix[l-1])+(prefix[r]-prefix[mid])-x[mid]*(r-mid);};const long long inf=numeric_limits<long long>::max()/4;vector<long long>previous(n+1,inf),current(n+1,inf);previous[0]=0;for(int group=1;group<=m;group++){fill(current.begin(),current.end(),inf);function<void(int,int,int,int)>solve=[&](int left,int right,int opt_left,int opt_right){if(left>right)return;int mid=(left+right)/2,best=-1;for(int cut=opt_left;cut<=min(mid-1,opt_right);cut++){long long value=previous[cut]+cost(cut+1,mid);if(value<current[mid])current[mid]=value,best=cut;}solve(left,mid-1,opt_left,best);solve(mid+1,right,best,opt_right);};solve(group,n,group-1,n-1);previous.swap(current);}cout<<previous[n]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P4767
external_platform: 洛谷
external_problem_id: 'P4767'
external_title: 郵局 加強版
external_relation: original
source_book_pages: [385]
source_pdf_pages: [403]
review_status: verified
---

中位數給出單段成本，Monge 單調性則讓每層分組 DP 只需分治搜尋決策。
