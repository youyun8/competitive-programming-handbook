---
id: luogu-p1449
volume: upper
source_file: upper-volume
original_label: 洛谷 P1449
title: 洛谷 P1449 後綴表達式：以數值堆疊求值
chapter: 1
section: '1.3'
kind: external-oj
difficulty: 1
topics: ['堆疊', '後綴表達式', '字串解析']
prerequisites: ['stack', 'integer-arithmetic']
statement: |-
  給定一個後綴算術式。每個非負整數後有 `.` 作為結束記號，運算符為 `+`、`-`、`*`、`/`，整個算式以 `@` 結束。依後綴順序計算並輸出結果；整數除法向 0 取整。
constraints:
  - '1 <= 算式字串長度 <= 50'
  - 除法的除數保證不為 0
  - 答案及所有中間值的絕對值不超過 1000000000
input_format: 輸入一行以 `@` 結束的後綴表達式；操作數可為多位數，並以 `.` 分隔。
output_format: 輸出表達式的整數值。
samples:
  - input: |
      3.5.2.-*7.+@
    output: |
      16
    explanation: 依序推入 3、5、2；讀到 `-` 得 5-2=3，讀到 `*` 得 3*3=9，推入 7 後以 `+` 得 16。
  - input: |
      10.28.30./*7.-@
    output: |
      -7
    explanation: '`28/30` 依向 0 取整為 0，接著 `10*0=0`，最後 `0-7=-7`。'
core_knowledge:
  - 後綴式遇到運算符即可立即計算
  - 多位數要累積到 `.` 才能入棧
  - 減法與除法必須維持左右操作數次序
judgment: 後綴式已把優先順序編入符號排列，不需要運算符堆疊；只要一個數值堆疊即可由左至右求值。
hints:
  - 第一階段：後綴式中的運算符一定作用於它前面最近的兩個尚未合併結果，哪種容器能取得它們？
  - 第二階段：數字可能有多位；每讀一位就累積，遇到 `.` 才把完整數字推入數值堆疊。
  - 第三階段：遇到運算符時先取出的值是右運算元，再取出的是左運算元；計算後把結果推回，讀到 `@` 時棧頂即答案。
solution_outline: 維護目前正在解析的整數與一個數值堆疊。數字字元用十進位累積，`.` 將整數推入堆疊並歸零。運算符則依序彈出右、左運算元，計算後推回。遇到 `@` 結束。
proof_or_invariant: 掃描任一前綴後，堆疊由底到頂恰好存放該前綴中尚未被後續運算符合併的子表達式值。讀入完整數字會新增一個子表達式；讀入二元運算符則把最後兩個子表達式依正確左右次序合成一個，故不變量保持。完整合法算式結束時只剩整體值。
complexity:
  time: 'O(L)，L 為算式長度'
  space: 'O(L)'
common_errors:
  - 每讀到一個數字字元就入棧，無法處理 10、28 等多位數
  - 把 `right-left` 或 `right/left` 當成運算結果
  - 將 `.` 誤當小數點；本題所有數都是整數
  - 自行套用中綴優先級，而不是依後綴符號出現順序計算
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <vector>

  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      string expression;
      cin >> expression;
      vector<long long> values;
      long long current_number = 0;

      // TODO：解析數字、句點、運算符與結束記號。
      (void)current_number;

      if (!values.empty()) {
          cout << values.back() << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>

  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      string expression;
      if (!(cin >> expression)) {
          return 0;
      }

      vector<long long> values;
      long long current_number = 0;
      for (char token : expression) {
          if (token >= '0' && token <= '9') {
              current_number = current_number * 10 + (token - '0');
          } else if (token == '.') {
              values.push_back(current_number);
              current_number = 0;
          } else if (token == '@') {
              break;
          } else {
              long long right = values.back();
              values.pop_back();
              long long left = values.back();
              values.pop_back();

              if (token == '+') {
                  values.push_back(left + right);
              } else if (token == '-') {
                  values.push_back(left - right);
              } else if (token == '*') {
                  values.push_back(left * right);
              } else {
                  values.push_back(left / right);
              }
          }
      }

      cout << values.back() << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1449
external_platform: 洛谷
external_problem_id: P1449
external_title: 後綴表達式
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

後綴表示法把括號與優先級消去，求值時只需維護尚未合併的子表達式值。
