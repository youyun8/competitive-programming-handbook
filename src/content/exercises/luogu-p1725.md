---
id: luogu-p1725
volume: upper
source_file: upper-volume
title: 洛谷 P1725 琪露諾：單調佇列優化 DP
chapter: 1
section: '1.2'
kind: external-oj
difficulty: 3
topics: ['單調佇列', '動態規劃', '滑動窗口']
prerequisites: ['queue', '動態規劃']
statement: |-
  河上格子編號為 0 到 n，起點是 0。從格子 i 每次只能向右跳 l 到 r 格；停在格子 i 會取得該格的整數分數。只要下一次跳到編號大於 n 的位置便抵達對岸。求抵達對岸時可累積的最大分數。
constraints:
  - 'n <= 2 * 10^5'
  - '1 <= l <= r <= n'
  - '每格分數絕對值不超過 1000'
  - '保證答案不超過 2^31-1'
input_format: 第一行為 n、l、r；第二行為 n+1 個整數，依序是格子 0 到 n 的分數。
output_format: 輸出抵達對岸時可取得的最大分數。
samples:
  - input: |
      5 2 3
      0 12 3 11 7 -2
    output: |
      11
    explanation: 核實官方範例。可由 0 跳到 3 取得 11 分，再從 3 跳至少 3 格而越過 n；其他可行路徑不會得到更高總分。
core_knowledge:
  - 固定轉移距離區間的動態規劃
  - 以遞減單調佇列維護轉移最大值
judgment: 直接對每格枚舉前方 r-l+1 個來源是 O(nr)；來源索引形成固定滑動窗口，可將最大值查詢降為均攤 O(1)。
hints:
  - 定義 dp[i] 為抵達格子 i 時的最大累積分數；其來源 j 必須滿足 i-r <= j <= i-l。
  - 當 i 遞增時，合法來源窗口也只向右移一格；用值遞減的雙端佇列保存可達來源，隊首就是最大 dp。
  - 每輪先把 newly=i-l 加入候選（不可達狀態不要加入），再淘汰小於 i-r 的隊首。最後答案是所有可在下一跳越過 n 的格子 i，也就是 i>=n-r+1 的 dp 最大值。
solution_outline: 設 dp[0]=0，其餘為負無限。依序處理 i=1..n，把 i-l 加入遞減單調佇列並移除早於 i-r 的索引；若佇列非空，令 dp[i]=dp[隊首]+score[i]。在可一跳越界的尾端格子中取最大值。
proof_or_invariant: |-
  處理 i 時，佇列恰含合法區間 [i-r,i-l] 內可達且未被更晚、更優狀態支配的索引，並按 dp 值遞減，故隊首給出完整轉移集合的最大值，dp[i] 正確。任何成功路徑越界前的最後格 i 都滿足 i+r>n，即 i>=n-r+1；反之這些格子皆可選一個合法距離跳過 n，所以其 dp 最大值就是答案。
complexity:
  time: 'O(n)'
  space: 'O(n)'
common_errors:
  - 把不可達狀態加入單調佇列
  - 誤以為一定要停在 n，而漏掉從較早格子直接越界的路徑
  - 將加入新來源與移除過期來源的索引邊界寫錯一格
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, l, r;
      if (!(cin >> n >> l >> r)) return 0;
      vector<long long> score(n + 1);
      for (long long& value : score) cin >> value;
      const long long unreachable = numeric_limits<long long>::lowest() / 4;
      vector<long long> dp(n + 1, unreachable);
      dp[0] = 0;
      deque<int> candidates;
      // TODO：維護來源窗口的最大 dp，並求可越界尾端狀態的最大值。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, l, r;
      if (!(cin >> n >> l >> r)) return 0;
      vector<long long> score(n + 1);
      for (long long& value : score) cin >> value;
      const long long unreachable = numeric_limits<long long>::lowest() / 4;
      vector<long long> dp(n + 1, unreachable);
      dp[0] = 0;
      deque<int> candidates;
      for (int i = 1; i <= n; ++i) {
          const int incoming = i - l;
          if (incoming >= 0 && dp[incoming] != unreachable) {
              while (!candidates.empty() &&
                     dp[candidates.back()] <= dp[incoming]) {
                  candidates.pop_back();
              }
              candidates.push_back(incoming);
          }
          while (!candidates.empty() && candidates.front() < i - r) {
              candidates.pop_front();
          }
          if (!candidates.empty()) {
              dp[i] = dp[candidates.front()] + score[i];
          }
      }
      long long answer = unreachable;
      for (int i = max(0, n - r + 1); i <= n; ++i) {
          answer = max(answer, dp[i]);
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1725
external_platform: 洛谷
external_problem_id: P1725
external_title: 琪露諾
external_relation: original
source_book_pages: [16]
source_pdf_pages: [34]
review_status: verified
---

這是標準的「轉移來源為滑動窗口最大值」模型；先把合法索引區間寫準，再維護單調性。
