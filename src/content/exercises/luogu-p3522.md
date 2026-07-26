---
id: luogu-p3522
volume: upper
source_file: upper-volume
title: 洛谷 P3522 TEM-Temperature
chapter: 5
section: '5.8'
kind: external-oj
difficulty: 3
topics: ['monotonic-queue', 'sliding-window']
prerequisites: ['depth-first-search', 'dynamic-programming']
statement: >-
  第 i 天真實溫度位於 [low_i,high_i]。求最長連續區間，使區間內可選出一個非遞減的真實溫度序列。
constraints:
  - 1 <= n <= 1000000
  - low_i <= high_i
  - 端點為整數
input_format: 第一行 n；接著 n 行 low_i、high_i。
output_format: 輸出最長可行連續區間長度。
samples:
  - input: |-
      6
      6 10
      1 5
      4 8
      2 5
      6 8
      3 5
    output: |-
      4
    explanation: 中間某個長度四的區間可逐日選出非遞減溫度。
core_knowledge: ['區間可行性', '單調佇列', '雙指標']
judgment: 區間可行當且僅當對任意較早 i、較晚 j 都不出現 low_i>high_j；維護窗口最大 low 即可。
hints:
  - 向右加入 j 時，若窗口內某個 low>high[j]，它及更早起點都不能保留。
  - 用 low 值遞減的 deque 保存候選最大值及索引。
  - 衝突時把左端移到該最大 low 的索引之後，移除過期項，再更新答案。
solution_outline: >-
  滑動右端；單調佇列維護目前窗口 low 的最大值。當隊首值大於新 high 時推進左端並彈隊首，直至相容，再加入新 low。
proof_or_invariant: >-
  非遞減選值存在等價於每個前綴需求上界不超過後續可用上界，即所有 i<j 有 low_i<=high_j。隊首是窗口最大 low；發生衝突時任何包含該索引的窗口都不合法，跳過它是最早可行左端。
common_errors: ['只比較相鄰兩天', 'deque 維護成最小值', '推進左端後未刪除過期索引']
complexity:
  time: 'O(n)'
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
  #include <algorithm>
  #include <deque>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main(){ios::sync_with_stdio(false);cin.tie(nullptr);int n;cin>>n;vector<int>lo(n),hi(n);for(int i=0;i<n;i++)cin>>lo[i]>>hi[i];deque<int>q;int left=0,answer=0;for(int right=0;right<n;right++){while(!q.empty()&&lo[q.front()]>hi[right]){left=q.front()+1;q.pop_front();while(!q.empty()&&q.front()<left)q.pop_front();}while(!q.empty()&&lo[q.back()]<=lo[right])q.pop_back();q.push_back(right);answer=max(answer,right-left+1);}cout<<answer<<'\n';}
external_url: https://www.luogu.com.cn/problem/P3522
external_platform: 洛谷
external_problem_id: 'P3522'
external_title: TEM-Temperature
external_relation: original
source_book_pages: [372]
source_pdf_pages: [390]
review_status: verified
---

窗口內最大的下界若超過新位置上界，正是最早無法延伸的衝突點。
