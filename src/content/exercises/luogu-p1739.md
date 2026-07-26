---
id: luogu-p1739
volume: upper
source_file: upper-volume
original_label: 洛谷 P1739
title: 洛谷 P1739 表達式括號匹配
chapter: 1
section: '1.3'
kind: external-oj
difficulty: 1
topics: ['堆疊', '括號匹配', '字串掃描']
prerequisites: ['stack', 'strings']
statement: |-
  一個算式由數字、小寫英文字母、四則運算符與圓括號組成，並以 `@` 標示結束。請判斷其中每個右括號是否都有較早且尚未配對的左括號，且最後不留下任何左括號。
constraints:
  - 表達式長度小於 255
  - 左括號數量少於 20
  - 表達式以 `@` 結束
input_format: 輸入一行表達式；內容可含數字、小寫字母、`+ - * /` 及圓括號，掃描至 `@` 為止。
output_format: 圓括號完全正確配對時輸出 `YES`，否則輸出 `NO`。
samples:
  - input: |
      2*(x+y)/(1-x)@
    output: |
      YES
    explanation: 兩組左括號都在稍後遇到對應右括號，掃描途中沒有多餘右括號，結束時也沒有未配對左括號。
  - input: |
      (25+x)*(a*(a+b+b)@
    output: |
      NO
    explanation: 算式結束時仍有一個左括號尚未配對，因此不合法。
core_knowledge:
  - 左括號代表一個等待配對的狀態
  - 右括號只能配對最近的未配對左括號
  - 前綴合法與結尾清空是兩個都必須滿足的條件
judgment: 只有一種括號時，堆疊內容全相同，也可用深度計數器等價實作；仍須同時檢查深度從不為負且結束時為零。
hints:
  - 第一階段：僅比較左右括號總數不夠；例如 `)(` 數量相同，順序卻不合法。
  - 第二階段：由左至右掃描，左括號表示新增一個待配對項；右括號必須消除最近的待配對項。
  - 第三階段：遇到 `(` 就入棧；遇到 `)` 時若棧空立即判錯，否則彈出；讀到 `@` 後還要確認棧為空。
solution_outline: 忽略非括號字元。每遇到左括號便推入堆疊；遇到右括號時，若堆疊為空則已有無法配對的右括號，否則彈出一個左括號。掃描至 `@`，只有未曾失敗且堆疊為空才輸出 YES。
proof_or_invariant: 掃描每個前綴後，堆疊大小恰為該前綴中尚未配對的左括號數。若右括號到來時堆疊為空，它不可能由未來字元補上，故必定不合法；若可彈出，便與最近的左括號配對。結束時堆疊空等價於所有左括號也都有配對。
complexity:
  time: 'O(L)，L 為表達式長度'
  space: 'O(L)'
common_errors:
  - 只在最後比較左右括號數量，沒有偵測前綴中的多餘右括號
  - 遇到第一個 `)` 就直接彈棧，未先檢查是否為空
  - 讀到 `@` 後沒有檢查是否仍留有左括號
  - 將算式中的其他字元誤判為括號
cpp_skeleton: |
  #include <iostream>
  #include <stack>
  #include <string>

  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      string expression;
      cin >> expression;
      stack<char> openings;
      bool valid = true;

      // TODO：掃描到 @，處理左右括號。

      cout << (valid && openings.empty() ? "YES" : "NO") << '\n';
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <stack>
  #include <string>

  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      string expression;
      if (!(cin >> expression)) {
          return 0;
      }

      stack<char> openings;
      bool valid = true;
      for (char token : expression) {
          if (token == '@') {
              break;
          }
          if (token == '(') {
              openings.push(token);
          } else if (token == ')') {
              if (openings.empty()) {
                  valid = false;
                  break;
              }
              openings.pop();
          }
      }

      cout << (valid && openings.empty() ? "YES" : "NO") << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1739
external_platform: 洛谷
external_problem_id: P1739
external_title: 表達式括號匹配
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

合法括號序列不只要求總數相同，還要求任何前綴都不能先出現無法配對的右括號。
