---
id: openj-bailian-3863
volume: upper
source_file: upper-volume
title: OpenJudge 百練 3863 Parade
chapter: 5
section: '5.8'
kind: external-oj
difficulty: 5
topics: ['monotonic-queue', 'dynamic-programming']
prerequisites: ['dynamic-programming']
statement: >-
  城市有 n+1 條東西路與 m+1 條南北路。遊行由最南路任一交叉口到最北路任一交叉口，不可向南或重訪交叉口；每條東西路水平行駛時間不得超過 k。每個水平路段有歡迎值與時間，求最大歡迎值。
constraints:
  - 0 < n <= 100
  - 0 < m <= 10000
  - 0 <= k <= 3000000
  - 答案在 32 位範圍
  - 以 0 0 0 結束
input_format: 每組 n、m、k；接著 n+1 行歡迎值，再 n+1 行路段時間，皆由北到南。
output_format: 每組輸出最大歡迎值。
samples:
  - input: |-
      2 3 2
      7 8 1
      4 5 6
      1 2 3
      1 1 1
      1 1 1
      1 1 1
      0 0 0
    output: |-
      27
    explanation: 逐列選擇時間不超過 2 的水平區間，再向北移動，可取得最大歡迎值 27。
core_knowledge: ['網格逐列 DP', '雙向滑動窗口', '前綴和']
judgment: 固定一條東西路，入列與出列交叉口間只能走一個簡單水平區間；由左向右及右向左各是一個受時間限制的窗口最大值。
hints:
  - dp[col] 表示到達目前道路某交叉口前的最大值，最南道路初始各列皆為 0。
  - 向右移時候選為 dp[i]-value_prefix[i]，並要求 time_prefix[j]-time_prefix[i]<=k。
  - 再反向維護 dp[i]+value_prefix[i]；兩方向最大值組成新 dp，按道路由南往北處理。
solution_outline: >-
  讀入所有道路資料。對每一列建立歡迎與時間前綴；用兩個 deque 分別線性計算從左側、右側入口到每個出口的最佳值，更新 dp 後進入上一條道路。
proof_or_invariant: >-
  不向南且不重訪使一條東西路上的行程必為單一方向的連續區間。固定出口 j，左入口與右入口的收益分別可移項成前綴常數加窗口最大值；deque 精確維護時間差不超過 k 的候選。逐列 DP 枚舉所有垂直上行選擇。
common_errors: ['按輸入北到南順序處理而方向顛倒', '只處理向東行駛', '窗口以路段數而非時間前綴限制']
complexity:
  time: 'O(nm)'
  space: 'O(nm)'
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
  #include <deque>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,m;long long limit;while(cin>>n>>m>>limit&&(n||m||limit)){vector<vector<long long>>value(n+1,vector<long long>(m)),length=value;for(auto&row:value)for(auto&x:row)cin>>x;for(auto&row:length)for(auto&x:row)cin>>x;vector<long long>dp(m+1),next(m+1);for(int row=n;row>=0;row--){vector<long long>pv(m+1),pt(m+1);for(int i=1;i<=m;i++){pv[i]=pv[i-1]+value[row][i-1];pt[i]=pt[i-1]+length[row][i-1];}fill(next.begin(),next.end(),numeric_limits<long long>::min()/4);deque<int>q;for(int j=0;j<=m;j++){while(!q.empty()&&pt[j]-pt[q.front()]>limit)q.pop_front();while(!q.empty()&&dp[q.back()]-pv[q.back()]<=dp[j]-pv[j])q.pop_back();q.push_back(j);next[j]=max(next[j],pv[j]+dp[q.front()]-pv[q.front()]);}q.clear();for(int j=m;j>=0;j--){while(!q.empty()&&pt[q.front()]-pt[j]>limit)q.pop_front();while(!q.empty()&&dp[q.back()]+pv[q.back()]<=dp[j]+pv[j])q.pop_back();q.push_back(j);next[j]=max(next[j],-pv[j]+dp[q.front()]+pv[q.front()]);}dp.swap(next);}cout<<*max_element(dp.begin(),dp.end())<<'\n';}}
external_url: http://bailian.openjudge.cn/practice/3863/
external_platform: OpenJudge 百練
external_problem_id: '3863'
external_title: Parade
external_relation: original
source_book_pages: [372]
source_pdf_pages: [390]
review_status: verified
---

每列的最佳水平區間可拆成左右兩個時間窗口，令整個網格 DP 保持 O(nm)。
