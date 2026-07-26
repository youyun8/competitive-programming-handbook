---
id: luogu-p1722
volume: lower
source_file: lower-volume
title: 洛谷 P1722 平衡紅黑算籌
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 2
topics: [catalan-number, dynamic-programming]
prerequisites: [catalan-stirling]
statement: >-
  在長度 2n 的列中放入 n 個紅色與 n 個黑色算籌，要求任意前綴的紅色數不少於黑色數。
  求方案數對 100 取模。
constraints:
  - 1 <= n <= 100
input_format: 一個正整數 n。
output_format: 輸出合法方案數模 100。
samples:
  - input: '2'
    output: '2'
    explanation: 合法次序為紅黑紅黑、紅紅黑黑。
core_knowledge:
  - 平衡二色前綴序列由 Catalan 數計數
  - 合數模數下使用無除法的 Catalan 卷積最穩妥
judgment: 同色算籌不可區分，僅比較紅黑顏色序列。
hints:
  - 把紅色視為左括號、黑色視為右括號，條件就是合法括號序列。
  - 以第一個紅色所配對的黑色切開，左右各是一個較小合法序列。
  - 設 dp[0]=1，使用 dp[i]=Σ(j=0..i-1)dp[j]dp[i-1-j]，每步模 100。
solution_outline: 以 Catalan 卷積遞推到 dp[n]；不使用含除法的閉式，避免模 100 下逆元不存在。
proof_or_invariant: >-
  任一非空合法序列的第一個紅色有唯一匹配黑色；匹配內外分別含 j 與 i-1-j 對，
  且都是獨立合法序列。反之任選兩段並包上首尾配對都形成唯一合法序列，因此卷積不漏不重。
common_errors:
  - 用模逆元計算 C(2n,n)/(n+1)，但 n+1 在模 100 下未必可逆
  - 允許某個前綴黑色多於紅色
  - 忘記 dp[0]=1
complexity:
  time: O(n^2)
  space: O(n)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      // TODO：以無除法 Catalan 卷積遞推。
      (void)n;
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
      vector<int> catalan(static_cast<size_t>(n) + 1U);
      catalan[0] = 1;
      for (int length = 1; length <= n; ++length) {
          for (int left = 0; left < length; ++left) {
              catalan[static_cast<size_t>(length)] =
                  (catalan[static_cast<size_t>(length)] +
                   catalan[static_cast<size_t>(left)] *
                       catalan[static_cast<size_t>(length - 1 - left)]) %
                  100;
          }
      }
      cout << catalan[static_cast<size_t>(n)] << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1722
external_platform: 洛谷
external_problem_id: P1722
external_title: 矩陣 II
external_relation: original
source_book_pages: [486, 491]
source_pdf_pages: [116, 121]
review_status: verified
---

模數為合數時，保留 Catalan 的組合遞推比套用帶除法公式更安全。
