---
id: luogu-p2251
volume: upper
source_file: upper-volume
title: 洛谷 P2251 品質檢測：固定窗格最小值
chapter: 2
section: '2.5'
kind: external-oj
difficulty: 2
topics: ['單調佇列', '滑動窗口', 'RMQ']
prerequisites: ['monotonic-queue']
statement: |-
  生產線依序有 n 件產品，第 i 件的品質分數是 a_i。對每一段恰含 m 件連續產品的區間，求其中最低的品質分數；依左端點由小到大輸出。
constraints:
  - '1 <= m <= n <= 100000'
  - 'a_i <= 1000000'
input_format: '第一行輸入 n、m；第二行輸入 n 個品質分數。'
output_format: '輸出 n-m+1 行，第 i 行是 a_i 到 a_{i+m-1} 的最小值。'
samples:
  - input: |
      10 4
      16 5 6 9 5 13 14 20 8 12
    output: |
      5
      5
      5
      5
      5
      8
      8
    explanation: '第一個窗格是 16,5,6,9，最小值為 5；最後一個窗格是 14,20,8,12，最小值為 8。'
core_knowledge:
  - '遞增單調佇列保存仍可能成為未來窗格最小值的索引。'
  - '每個索引至多進出佇列一次。'
judgment: '固定長度窗格逐格右移並求最值，可用單調佇列線性完成。'
hints:
  - '佇列只需留下值嚴格遞增的候選索引；新值不大於隊尾時，隊尾不可能再成為答案。'
  - '處理位置 i 前，移除所有索引小於 i-m+1 的隊首，它們已離開窗格。'
  - '插入 i 後，若 i+1 >= m，隊首就是以 i 結尾的窗格最小值。'
solution_outline: |-
  從左至右掃描。先從隊尾刪除值不小於 a_i 的索引，再插入 i；刪除小於目前窗格左界的隊首。窗格形成後輸出隊首對應值。
proof_or_invariant: |-
  佇列索引遞增、對應值嚴格遞增，且只含目前窗格內索引。被新元素刪除的舊元素更大且更早離開，永不可能優於新元素；故所有可能最小值都保留，而隊首是其中最小者。
common_errors:
  - '以數值而非索引判斷元素是否離開窗格。'
  - '在第一個完整窗格形成前就輸出。'
  - '忘記相等時也可刪除舊索引。'
complexity:
  time: 'O(n)'
  space: 'O(m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      cin >> n >> m;
      vector<int> a(static_cast<size_t>(n));
      for (int& value : a) { cin >> value; }
      deque<int> candidates;
      for (int i = 0; i < n; ++i) {
          // TODO：維護合法且值遞增的候選索引。
          // TODO：窗格形成後輸出隊首。
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<int> a(static_cast<size_t>(n));
      for (int& value : a) { cin >> value; }
      deque<int> candidates;
      for (int i = 0; i < n; ++i) {
          const int left = i - m + 1;
          while (!candidates.empty() && candidates.front() < left) {
              candidates.pop_front();
          }
          while (!candidates.empty() &&
                 a[static_cast<size_t>(candidates.back())] >= a[static_cast<size_t>(i)]) {
              candidates.pop_back();
          }
          candidates.push_back(i);
          if (left >= 0) {
              cout << a[static_cast<size_t>(candidates.front())] << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2251
external_platform: 洛谷
external_problem_id: P2251
external_title: 品質檢測
external_relation: original
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

固定窗格最值除了 ST 表，也能用單調佇列把時間降至線性。
