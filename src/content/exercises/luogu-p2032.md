---
id: luogu-p2032
volume: upper
source_file: upper-volume
title: 洛谷 P2032 掃描：滑動窗口最大值
chapter: 1
section: '1.2'
kind: external-oj
difficulty: 2
topics: ['單調佇列', '雙端佇列', '滑動窗口']
prerequisites: ['queue']
statement: |-
  給定一列 n 個正整數。一塊長度恰為 k 的板子起初覆蓋第 1 到第 k 個數，之後每次向右移一格，直到覆蓋最後一個數。請依移動順序輸出每次覆蓋範圍內的最大值。
constraints:
  - '1 <= k <= n <= 2 * 10^6'
  - '每個序列值皆為不超過 10^4 的正整數'
input_format: 第一行為 n、k；第二行為 n 個整數。
output_format: 共 n-k+1 行，第 i 行是區間 [i, i+k-1] 的最大值。
samples:
  - input: |
      6 3
      1 5 2 4 3 6
    output: |
      5
      5
      4
      6
    explanation: 自製範例。四個窗口依序為 [1,5,2]、[5,2,4]、[2,4,3]、[4,3,6]，最大值分別為 5、5、4、6。
core_knowledge:
  - 雙端佇列只保留仍可能成為窗口最大值的索引
  - 隊首過期淘汰與隊尾支配淘汰
judgment: n 可達兩百萬，逐窗口掃描會達 O(nk)；每個索引至多入隊、出隊一次的單調佇列才能穩定通過。
hints:
  - 先想想：窗口右移後，哪些舊元素已確定不在答案範圍內？哪些元素即使還在窗口，也永遠不會勝過右側新出現且更大的元素？
  - 用雙端佇列存索引，使索引由前到後遞增、對應值嚴格遞減；如此隊首便是當前最大值。
  - 掃到 i 時，先移除小於等於 i-k 的隊首，再移除值不大於 a[i] 的隊尾，推入 i；i>=k-1 時輸出隊首值。
solution_outline: 從左到右掃描序列，以遞減單調佇列保存候選索引。先清掉滑出窗口的索引，再刪除被新元素支配的隊尾，加入新索引並在窗口完整時輸出隊首。
proof_or_invariant: |-
  佇列內索引遞增且值嚴格遞減，並且都位於當前窗口。隊首因此是窗口最大值。從隊尾刪除的索引，其值不大於更晚進入的新值；在兩者同時留在任何未來窗口時，新值都不劣，而舊值會更早離開，所以舊值不可能再成為答案。故輸出無遺漏且正確。
complexity:
  time: 'O(n)'
  space: 'O(k)'
common_errors:
  - 把值而非索引放入佇列，導致無法判斷是否過期
  - 過期條件誤寫成小於 i-k，而留下恰好已離開窗口的索引
  - 在窗口尚未累積到 k 個元素前就輸出
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, k;
      if (!(cin >> n >> k)) return 0;
      vector<int> values(n);
      for (int& value : values) cin >> value;
      deque<int> candidates;
      for (int i = 0; i < n; ++i) {
          // TODO：移除過期索引，並維護值遞減的候選佇列。
          // TODO：窗口完整後輸出 candidates 隊首所指的值。
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, k;
      if (!(cin >> n >> k)) return 0;
      vector<int> values(n);
      for (int& value : values) cin >> value;
      deque<int> candidates;
      for (int i = 0; i < n; ++i) {
          while (!candidates.empty() && candidates.front() <= i - k) {
              candidates.pop_front();
          }
          while (!candidates.empty() && values[candidates.back()] <= values[i]) {
              candidates.pop_back();
          }
          candidates.push_back(i);
          if (i >= k - 1) cout << values[candidates.front()] << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2032
external_platform: 洛谷
external_problem_id: P2032
external_title: 掃描
external_relation: original
source_book_pages: [16]
source_pdf_pages: [34]
review_status: verified
---

這題只求最大值；熟悉後可再比較 P1886 同時求最小值與最大值的寫法。
