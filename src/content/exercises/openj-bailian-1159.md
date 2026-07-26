---
id: openj-bailian-1159
volume: upper
source_file: upper-volume
title: OpenJudge 1159 Palindrome
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 3
topics: [dynamic-programming, longest-common-subsequence, palindrome]
prerequisites: [dynamic-programming]
statement: 給一個字串，只允許在任意位置插入字元；求至少插入幾個字元，才能使結果成為回文。
constraints:
  - 3 <= n <= 5000
  - 字串由大小寫英文字母與數字組成，大小寫視為不同字元
input_format: 第一行為長度 n，第二行為長度 n 的字串。
output_format: 輸出最少插入字元數。
samples:
  - input: |-
      5
      Ab3bd
    output: '2'
    explanation: 插入兩字元可得到 dAb3bAd；少於兩個字元無法補齊所有不對稱處。
core_knowledge: [最長回文子序列, 最長共同子序列, 滾動陣列]
judgment: 只能插入、不能刪除或替換；但最少插入數等於 n 減最長回文子序列長度。
hints:
  - 最終回文中，不需新增的原字元必形成原字串的一個回文子序列。
  - 原字串與反轉字串的最長共同子序列長度，就是最長回文子序列長度。
  - 用一列 LCS 狀態並保存更新前的左上格，把空間控制在 O(n)。
solution_outline: 反轉字串，求原字串與反轉字串的 LCS 長度 lps，輸出 n-lps。
proof_or_invariant: >-
  任一插入所得回文保留的原字元依原順序排列，且與回文對稱次序一致，因此最多保留一個最長回文
  子序列，其餘至少 n-lps 個位置需各補一個配對字元。反之保留任一最長回文子序列，對其外側及
  相鄰保留字元間未被選的字元逐一在對稱側插入副本，即可用 n-lps 次形成回文，故界限可達。
common_errors: [使用 O(n^2) 整張表而超出記憶體, 忽略大小寫有別, 一維 LCS 未保存舊左上格]
complexity:
  time: O(n^2)
  space: O(n)
cpp_skeleton: |
  #include <iostream>
  #include <string>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; string text; cin >> n >> text;
      // TODO：求 text 的最長回文子序列長度。
      cout << n << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; string text; cin >> n >> text;
      string reversed = text;
      reverse(reversed.begin(), reversed.end());
      vector<int> dp(static_cast<size_t>(n + 1), 0);
      for (char value : text) {
          int diagonal = 0;
          for (int j = 1; j <= n; ++j) {
              const int above = dp[static_cast<size_t>(j)];
              if (value == reversed[static_cast<size_t>(j - 1)]) {
                  dp[static_cast<size_t>(j)] = diagonal + 1;
              } else {
                  dp[static_cast<size_t>(j)] =
                      max(dp[static_cast<size_t>(j)], dp[static_cast<size_t>(j - 1)]);
              }
              diagonal = above;
          }
      }
      cout << n - dp[static_cast<size_t>(n)] << '\n';
  }
external_url: http://bailian.openjudge.cn/practice/1159/
external_platform: OpenJudge 百練
external_problem_id: '1159'
external_title: Palindrome
external_relation: original
source_book_pages: [333]
source_pdf_pages: [351]
review_status: verified
---

利用最長回文子序列後，只要為其餘每個原字元在對稱側補上一個副本。
