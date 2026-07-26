---
id: luogu-p1044
volume: lower
source_file: lower-volume
title: 洛谷 P1044 合法出棧序列計數
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 2
topics: [catalan-number, stack, dynamic-programming]
prerequisites: [stack, catalan-stirling]
statement: >-
  輸入序列依序為 1,2,...,n；每一步可把下一個輸入推入容量足夠的棧，或把棧頂彈到輸出末端。
  求所有可能得到的不同輸出序列數量。
constraints:
  - 1 <= n <= 18
  - 棧容量大於 n，不會因容量限制而禁止 push
input_format: 一個整數 n。
output_format: 輸出可產生的不同出棧序列總數。
samples:
  - input: '3'
    output: '5'
    explanation: 三個元素共有 123、132、213、231、321 五種合法出棧次序，312 無法由單一棧產生。
core_knowledge:
  - push/pop 操作序列對應不越過對角線的格路
  - 合法序列數是第 n 個 Catalan 數
judgment: 只計算不同輸出排列；同一輸出不會由兩種不同 push/pop 序列產生。
hints:
  - 把 push 記為向右一步、pop 記為向上一步；任何前綴都不能 pop 多於 push。
  - 第一個進棧元素在輸出中的位置會把其餘操作分成互不干擾的左右兩段。
  - 令 dp[i] 為 i 個元素的答案，枚舉分割點可得 dp[i]=Σ dp[j]dp[i-1-j]。
solution_outline: 設 dp[0]=1。對 i=1..n，枚舉 j=0..i-1，把第一個配對的 pop 左右兩側分成 j 與 i-1-j 個元素，累加兩側方案數乘積。
proof_or_invariant: >-
  任一合法操作序列的第一個 push 都有唯一配對 pop。其間包含 j 對完整 push/pop，之後包含
  i-1-j 對；兩段各自是合法序列且可獨立選擇。反之把任意兩段合法序列包在第一對操作內外
  都會得到唯一合法序列，因此遞推既不遺漏也不重複。
common_errors:
  - 把答案誤認為 n!，忽略棧的後進先出限制
  - 未設定 dp[0]=1，導致邊界子問題無法貢獻
  - 使用 32 位元 int；Catalan(18)=477638700 雖可容納，但中間乘積應以 long long 計算
complexity:
  time: O(n^2)
  space: O(n)
cpp_skeleton: |
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<long long> dp(static_cast<size_t>(n) + 1U);
      dp[0] = 1;
      // TODO：用 Catalan 遞推填滿 dp。
      cout << dp[static_cast<size_t>(n)] << '\n';
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<long long> dp(static_cast<size_t>(n) + 1U);
      dp[0] = 1;
      for (int length = 1; length <= n; ++length) {
          for (int left_size = 0; left_size < length; ++left_size) {
              dp[static_cast<size_t>(length)] +=
                  dp[static_cast<size_t>(left_size)] *
                  dp[static_cast<size_t>(length - 1 - left_size)];
          }
      }
      cout << dp[static_cast<size_t>(n)] << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1044
external_platform: 洛谷
external_problem_id: P1044
external_title: '[NOIP 2003 普及組] 棧'
external_relation: original
source_book_pages: [486, 491]
source_pdf_pages: [116, 121]
review_status: verified
---

合法 push/pop 前綴的限制與 Catalan 路徑完全相同；用結構分解遞推可避免依賴除法公式。
