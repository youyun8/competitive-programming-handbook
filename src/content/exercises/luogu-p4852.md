---
id: luogu-p4852
volume: upper
source_file: upper-volume
title: 洛谷 P4852 yyf hates choukapai
chapter: 5
section: '5.8'
kind: external-oj
difficulty: 4
topics: ['monotonic-queue', 'dynamic-programming']
prerequisites: ['dynamic-programming']
statement: >-
  依序有 c*n+m 張卡。必須安排 n 次恰含 c 張的連抽，其餘 m 張單抽，且連續單抽不得超過 d 張。單抽貢獻該卡歐氣，連抽只貢獻首卡歐氣；最大化總歐氣並輸出連抽起點。
constraints:
  - 1 <= n <= 40
  - 1 <= m <= 80000
  - 2 <= c <= 3000
  - 1 <= d <= m
  - d*(n+1) >= m
input_format: 第一行 n、m、c、d；第二行 c*n+m 個歐氣值。
output_format: 第一行最大歐氣；第二行遞增輸出 n 個連抽起點。
samples:
  - input: |-
      1 1 2 1
      5 2 3
    output: |-
      8
      1
    explanation: 從第 1 張開始連抽，貢獻 5；第 3 張單抽貢獻 3，總和 8。
core_knowledge: ['定長區間選擇', '間隔限制', '方案重建']
judgment: 總歐氣等於所有卡歐氣總和，減去每個連抽中除首卡外的歐氣；只需在相鄰連抽間保證單抽間隔不超過 d。
hints:
  - 令 penalty[i] 為從 i 開始連抽時，被捨棄的 i+1..i+c-1 歐氣和。
  - dp[j][i] 表示第 j 次連抽起於 i 的最小總 penalty；前驅起點 p∈[i-c-d,i-c]。
  - 每層以遞增 deque 維護此前驅窗口最小 dp，記 parent 後從尾端合法起點回溯。
solution_outline: >-
  以前綴和求每個連抽 penalty。第一個起點限制在 1..d+1；其後每層掃描起點，用 deque 維護相隔 c..c+d 的前驅最小值。最後要求尾端剩餘單抽不超過 d，取最小 penalty 並重建。
proof_or_invariant: >-
  每張卡若單抽貢獻自身；若落在連抽內，只有首卡保留，因此目標恰為總和減去各連抽 penalty。連抽不重疊且中間單抽數至多 d 等價於起點差介於 c 與 c+d，首尾亦由邊界限制。DP 與窗口完整枚舉所有合法排列。
common_errors: ['把連抽首卡也計入 penalty', '相鄰起點允許小於 c 而重疊', '只檢查中間間隔而漏掉首尾 d 限制']
complexity:
  time: 'O(n(cn+m))'
  space: 'O(n(cn+m))'
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
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int blocks,singles,length,max_gap;cin>>blocks>>singles>>length>>max_gap;int total_cards=blocks*length+singles;vector<long long>a(total_cards+1),prefix(total_cards+1);long long total=0;for(int i=1;i<=total_cards;i++){cin>>a[i];total+=a[i];prefix[i]=prefix[i-1]+a[i];}int last_start=total_cards-length+1;vector<long long>penalty(last_start+1);for(int i=1;i<=last_start;i++)penalty[i]=prefix[i+length-1]-prefix[i];const long long inf=numeric_limits<long long>::max()/4;vector<long long>previous(last_start+1,inf),current(last_start+1,inf);vector<vector<int>>parent(blocks+1,vector<int>(last_start+1,-1));for(int i=1;i<=min(last_start,max_gap+1);i++)previous[i]=penalty[i];for(int used=2;used<=blocks;used++){fill(current.begin(),current.end(),inf);deque<int>q;for(int i=1;i<=last_start;i++){int add=i-length;if(add>=1&&previous[add]<inf){while(!q.empty()&&previous[q.back()]>=previous[add])q.pop_back();q.push_back(add);}while(!q.empty()&&q.front()<i-length-max_gap)q.pop_front();if(!q.empty()){current[i]=previous[q.front()]+penalty[i];parent[used][i]=q.front();}}previous.swap(current);}int start=max(1,last_start-max_gap),best=start;for(int i=start;i<=last_start;i++)if(previous[i]<previous[best])best=i;cout<<total-previous[best]<<'\n';vector<int>answer;for(int used=blocks;used>=1;used--){answer.push_back(best);best=parent[used][best];}reverse(answer.begin(),answer.end());for(int i=0;i<blocks;i++)cout<<answer[i]<<(i+1==blocks?'\n':' ');}
external_url: https://www.luogu.com.cn/problem/P4852
external_platform: 洛谷
external_problem_id: 'P4852'
external_title: yyf hates choukapai
external_relation: original
source_book_pages: [372]
source_pdf_pages: [390]
review_status: verified
---

把最大化貢獻改成最小化連抽捨棄值後，相鄰連抽的距離限制正好形成滑動窗口。
