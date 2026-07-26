---
id: luogu-p3572
volume: upper
source_file: upper-volume
title: 洛谷 P3572 PTA-Little Bird
chapter: 5
section: '5.8'
kind: external-oj
difficulty: 3
topics: ['monotonic-queue', 'dynamic-programming']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  小鳥從第 1 棵樹跳到第 n 棵，每次向右跳最多 k 棵；若落點高度不低於起點就增加 1 疲勞，否則不增加。多次詢問不同 k 的最小疲勞。
constraints:
  - 1 <= n <= 1000000
  - 1 <= 詢問數 <= 25
  - 1 <= k < n
input_format: 第一行 n，第二行各樹高度；再給詢問數，每行一個 k。
output_format: 每個詢問輸出最小疲勞。
samples:
  - input: |-
      5
      4 2 7 3 6
      2
      1
      3
    output: |-
      2
      1
    explanation: k=1 必逐棵跳；k=3 可先跳到高度 7，再向較低的終點跳，疲勞為 1。
core_knowledge: ['滑動窗口 DP', '字典序鍵值', '多次詢問']
judgment: dp[i] 只查前 k 個狀態；先最小化 dp，dp 相同時保留高度較高者即可決定是否額外加一。
hints:
  - 轉移 dp[i]=min(dp[j]+[height[j]<=height[i]])，j 位於滑動窗口。
  - deque 按 (dp 升序、height 降序) 維護不被支配候選。
  - 移除過期索引後，隊首直接給轉移；相同 dp 時新高度不低於隊尾即可淘汰隊尾。
solution_outline: >-
  每個 k 獨立線性掃描。單調佇列保存窗口中依 dp 最小、同 dp 高度最大的候選，計算新 dp 後維護支配關係。
proof_or_invariant: >-
  任何 dp 較小兩級以上的候選必優；最小 dp 候選若存在高度高於落點可不加一，否則其值加一，而更大 dp 不可能改善。同 dp 中較高且較新的候選對未來永不較差，可安全淘汰較矮舊候選。
common_errors: ['高度嚴格比較方向寫反', '只按 dp 而未處理同值高度', '忘記每個詢問清空 deque']
complexity:
  time: 'O(nq)'
  space: 'O(n)'
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依狀態定義完成初始化、子問題合併與邊界處理。
      return 0;
  }
cpp_solution: |
  #include <deque>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>h(n),dp(n);for(int&x:h)cin>>x;int queries;cin>>queries;while(queries--){int k;cin>>k;deque<int>q;q.push_back(0);dp[0]=0;for(int i=1;i<n;i++){while(!q.empty()&&q.front()<i-k)q.pop_front();dp[i]=dp[q.front()]+(h[q.front()]<=h[i]);while(!q.empty()&&(dp[q.back()]>dp[i]||(dp[q.back()]==dp[i]&&h[q.back()]<=h[i])))q.pop_back();q.push_back(i);}cout<<dp[n-1]<<'\n';}}
external_url: https://www.luogu.com.cn/problem/P3572
external_platform: 洛谷
external_problem_id: 'P3572'
external_title: PTA-Little Bird
external_relation: original
source_book_pages: [372]
source_pdf_pages: [390]
review_status: verified
---

窗口候選的支配順序不是單一 dp，而是 dp 優先、同值時高度越高越好。
