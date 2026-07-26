---
id: luogu-p2629
volume: upper
source_file: upper-volume
title: 洛谷 P2629 好消息，壞消息：環狀前綴和
chapter: 1
section: '1.2'
kind: external-oj
difficulty: 3
topics: ['單調佇列', '前綴和', '環狀序列']
prerequisites: ['queue', '前綴和']
statement: |-
  有 n 則按時間排列的消息，每則消息會使初始為 0 的心情增加一個可正可負的整數。可以選一個起點，從該則消息依原順序講到末尾，再接回第一則講至起點前一則。請計算有多少個起點能讓每次講完消息後的累積心情都不小於 0。
constraints:
  - '1 <= n <= 10^6'
  - '每則消息的數值絕對值不超過 10^4'
input_format: 第一行為 n；第二行為 n 個整數，依時間順序表示各消息造成的心情變化。
output_format: 輸出可行環狀起點的數量。
samples:
  - input: |
      4
      -3 5 1 2
    output: |
      2
    explanation: 核實官方範例。從值 5 或值 1 開始時，四次累積和皆不為負；其餘兩個起點會先跌到 0 以下。
core_knowledge:
  - 環狀序列展開為兩份
  - 固定長度窗口內的最小前綴和
judgment: 每個起點都重算 n 次會是 O(n^2)；合法性只取決於接下來 n 個前綴和的最小值，可用單調佇列線性滑動。
hints:
  - 把序列複製一遍。若從索引 start 開始，途中累積和等於 doubled_prefix[t]-doubled_prefix[start]。
  - 起點合法當且僅當接下來 n 個前綴和的最小值不小於起點前綴和。
  - 建立雙倍序列的前綴和，讓遞增單調佇列維護索引區間 [start+1,start+n] 的最小值；每次右移起點時同步淘汰與加入。
solution_outline: 建立長度 2n 的重複序列及前綴和。先把前綴索引 1..n 加入遞增佇列；依序枚舉 start=0..n-1，以隊首檢查窗口最小前綴和是否至少為 prefix[start]，再移除即將離窗的索引並加入 start+n+1。
proof_or_invariant: |-
  對起點 start，走完第 t-start 步後的心情為 prefix[t]-prefix[start]，其中 start<t<=start+n。因此所有途中值非負，等價於該範圍最小 prefix[t] 不小於 prefix[start]。佇列始終保存這個範圍中索引遞增、值遞增的未支配候選，隊首即最小值，故每次判斷正確。
complexity:
  time: 'O(n)'
  space: 'O(n)'
common_errors:
  - 只檢查一圈總和非負，卻忽略中途可能變成負數
  - 窗口漏掉最後一步 start+n
  - 使用 32 位整數儲存最多約 10^10 的前綴和
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) return 0;
      vector<long long> values(n), prefix(2 * n + 1);
      for (long long& value : values) cin >> value;
      for (int i = 1; i <= 2 * n; ++i) {
          prefix[i] = prefix[i - 1] + values[(i - 1) % n];
      }
      // TODO：以單調佇列維護每個起點之後 n 個前綴和的最小值。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) return 0;
      vector<long long> values(n), prefix(2 * n + 1);
      for (long long& value : values) cin >> value;
      for (int i = 1; i <= 2 * n; ++i) {
          prefix[i] = prefix[i - 1] + values[(i - 1) % n];
      }
      deque<int> candidates;
      for (int i = 1; i <= n; ++i) {
          while (!candidates.empty() && prefix[candidates.back()] >= prefix[i]) {
              candidates.pop_back();
          }
          candidates.push_back(i);
      }
      int answer = 0;
      for (int start = 0; start < n; ++start) {
          if (prefix[candidates.front()] >= prefix[start]) ++answer;
          if (!candidates.empty() && candidates.front() == start + 1) {
              candidates.pop_front();
          }
          const int incoming = start + n + 1;
          if (incoming <= 2 * n) {
              while (!candidates.empty() &&
                     prefix[candidates.back()] >= prefix[incoming]) {
                  candidates.pop_back();
              }
              candidates.push_back(incoming);
          }
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2629
external_platform: 洛谷
external_problem_id: P2629
external_title: 好消息，壞消息
external_relation: original
source_book_pages: [16]
source_pdf_pages: [34]
review_status: verified
---

環狀題先複製序列，再把「每段途中都合法」轉成窗口最小前綴和。
