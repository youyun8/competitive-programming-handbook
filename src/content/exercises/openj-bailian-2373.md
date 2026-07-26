---
id: openj-bailian-2373
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2373 Dividing the Path
chapter: 5
section: '5.8'
kind: external-oj
difficulty: 4
topics: ['monotonic-queue', 'dynamic-programming']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  長度 L 的山脊須由互不重疊的灑水區間恰好覆蓋，每個噴頭半徑為 A..B 的整數。每頭牛偏好的閉區間必須完整落在同一噴頭內；求最少噴頭數，無解輸出 -1。
constraints:
  - 1 <= L <= 1000000 且 L 為偶數
  - 1 <= A <= B <= 1000
  - 1 <= N <= 1000
input_format: 第一行 N、L，第二行 A、B；接著 N 行偏好區間 S、E。
output_format: 輸出最少噴頭數，無解輸出 -1。
samples:
  - input: |-
      2 8
      1 2
      6 7
      3 6
    output: |-
      3
    explanation: 可用長度 2、4、2 的三個灑水區間，且兩段偏好各自不跨越分界。
core_knowledge: ['區間分割', '禁用切點', '窗口最小值']
judgment: 相鄰噴頭的覆蓋分界必為偶數位置；任何偏好區間內部都不能放分界。相鄰分界距離須在 [2A,2B]。
hints:
  - 用差分標記每個 S<x<E 的位置為禁用分界。
  - dp[x] 表示恰覆蓋到分界 x 的最少噴頭，僅處理偶數 x。
  - 轉移取 dp[y]+1，其中 x-2B<=y<=x-2A；用遞增 deque 維護窗口最小值。
solution_outline: >-
  先將所有偏好區間內部標記為禁用。從 0 到 L 每次跨兩單位掃描，維護合法前驅 dp 的單調佇列，禁用位置不建立狀態。
proof_or_invariant: >-
  不重疊且恰覆蓋等價於以噴頭直徑切分 [0,L]；半徑限制給出每段長度範圍。偏好區間由單一噴頭覆蓋當且僅當其內部沒有分界。DP 枚舉最後一段起點，deque 保持同一合法窗口最小值。
common_errors: ['把偏好端點也禁用', '使用半徑 A..B 而非直徑 2A..2B', '讓禁用位置進入 deque']
complexity:
  time: 'O(L+N)'
  space: 'O(L)'
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
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n,length,a,b;cin>>n>>length>>a>>b;vector<int>diff(length+2);for(int i=0,s,e;i<n;i++){cin>>s>>e;if(s+1<=e-1)diff[s+1]++,diff[e]--;}vector<char>blocked(length+1);for(int x=1,cover=0;x<=length;x++){cover+=diff[x];blocked[x]=cover>0;}const int inf=1000000000;vector<int>dp(length+1,inf);dp[0]=0;deque<int>q;for(int x=2;x<=length;x+=2){int add=x-2*a;if(add>=0&&dp[add]<inf&&!blocked[add]){while(!q.empty()&&dp[q.back()]>=dp[add])q.pop_back();q.push_back(add);}while(!q.empty()&&q.front()<x-2*b)q.pop_front();if(!blocked[x]&&!q.empty())dp[x]=dp[q.front()]+1;}cout<<(dp[length]>=inf?-1:dp[length])<<'\n';}
external_url: http://bailian.openjudge.cn/practice/2373/
external_platform: OpenJudge 百練
external_problem_id: '2373'
external_title: Dividing the Path
external_relation: original
source_book_pages: [372]
source_pdf_pages: [390]
review_status: verified
---

牛的限制只會禁用分界位置，剩餘問題就是固定長度範圍的最短分段。
