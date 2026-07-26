---
id: luogu-p2569
volume: upper
source_file: upper-volume
title: 洛谷 P2569 股票交易
chapter: 5
section: '5.8'
kind: external-oj
difficulty: 4
topics: ['monotonic-queue', 'dynamic-programming']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  在 t 天內交易股票，每天買價 AP、賣價 BP、買賣量上限 AS、BS 已知；持股不超過 maxp，任兩次交易至少相隔 w+1 天。初始零股，求最大收益。
constraints:
  - 0 <= w < t <= 2000
  - 1 <= maxp <= 2000
  - 1 <= BP <= AP <= 1000
input_format: 第一行 t、maxp、w；接著 t 行 AP、BP、AS、BS。
output_format: 輸出最大收益。
samples:
  - input: |-
      5 2 0
      2 1 1 1
      2 1 1 1
      3 2 1 1
      4 3 1 1
      5 4 1 1
    output: |-
      3
    explanation: 低價買入後於較高賣價日出售，可得到最大收益 3。
core_knowledge: ['股票 DP', '交易間隔', '單調佇列優化']
judgment: 交易日 i 的來源層固定為 i-w-1；買或賣的持股範圍都是連續窗口，可將平方枚舉降為單調佇列。
hints:
  - dp[i][j] 表示第 i 天結束持 j 股的最大現金，包含不交易繼承。
  - 買入時維護 dp[p][k]+k*AP 在 k∈[j-AS,j] 的最大值。
  - 賣出時維護 dp[p][k]+k*BP 在 k∈[j,j+BS] 的最大值。
solution_outline: >-
  逐日以兩個相反掃描方向的 deque 處理買入與賣出，並初始化從零持股首次買入的狀態；答案取最後一天零持股。
proof_or_invariant: >-
  冷卻限制使任何當日交易只能接在 p=i-w-1 層，而該層已繼承所有更早不交易狀態。代數移項後，固定 j 的最佳 k 是連續窗口最大值；deque 精確維護它，故所有合法最後動作均被比較。
common_errors: ['冷卻層差一', '買入股數窗口超過 AS', '最後取所有持股最大值而把未變現股票當收益']
complexity:
  time: 'O(t*maxp)'
  space: 'O(t*maxp)'
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
  #include <algorithm>
  #include <deque>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int days,limit,wait;cin>>days>>limit>>wait;const long long neg=numeric_limits<long long>::min()/4;vector<vector<long long>>dp(days+1,vector<long long>(limit+1,neg));dp[0][0]=0;for(int day=1;day<=days;day++){int ap,bp,as,bs;cin>>ap>>bp>>as>>bs;dp[day]=dp[day-1];for(int j=0;j<=min(limit,as);j++)dp[day][j]=max(dp[day][j],-1LL*j*ap);int prev=day-wait-1;if(prev<0)continue;deque<int>q;for(int j=0;j<=limit;j++){while(!q.empty()&&q.front()<j-as)q.pop_front();while(!q.empty()&&dp[prev][q.back()]+1LL*q.back()*ap<=dp[prev][j]+1LL*j*ap)q.pop_back();q.push_back(j);dp[day][j]=max(dp[day][j],dp[prev][q.front()]+1LL*q.front()*ap-1LL*j*ap);}q.clear();for(int j=limit;j>=0;j--){while(!q.empty()&&q.front()>j+bs)q.pop_front();while(!q.empty()&&dp[prev][q.back()]+1LL*q.back()*bp<=dp[prev][j]+1LL*j*bp)q.pop_back();q.push_back(j);dp[day][j]=max(dp[day][j],dp[prev][q.front()]+1LL*q.front()*bp-1LL*j*bp);}}cout<<dp[days][0]<<'\n';}
external_url: https://www.luogu.com.cn/problem/P2569
external_platform: 洛谷
external_problem_id: 'P2569'
external_title: 股票交易
external_relation: original
source_book_pages: [372]
source_pdf_pages: [390]
review_status: verified
---

兩個交易方向各自是一個持股索引窗口最大值，因而可線性處理每天。
