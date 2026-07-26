---
id: luogu-p1175
volume: upper
source_file: upper-volume
original_label: 洛谷 P1175
title: 洛谷 P1175 表達式的轉換：中綴轉後綴與逐步求值
chapter: 1
section: '1.3'
kind: external-oj
difficulty: 3
topics: ['運算符堆疊', '中綴轉後綴', '後綴表達式', '結合律']
prerequisites: ['stack', 'operator-precedence', 'postfix-expression']
statement: |-
  給定一個合法中綴算式，操作數皆為單一數字，運算符可為 `+ - * / ^`，並可能含圓括號。先輸出其後綴形式，之後依後綴式由左至右每次計算一個運算符，逐行輸出以結果取代該次兩個操作數後的狀態，直到只剩最終值。每個輸出項目之間以空白分隔。
constraints:
  - 輸入只含 `0-9`、`+ - * / ^` 與圓括號，且保證算式合法
  - 每個原始操作數都是一位數，不含一元負號
  - 字串長度不超過 100
  - 中間結果的絕對值不超過 32 位元整數範圍
  - 除法採整數除法；乘方不會出現負指數，所有中間結果均為整數
input_format: 輸入一行合法的中綴表達式，不含空白。
output_format: 第一行輸出空白分隔的後綴表達式；每計算一個後綴運算符後再輸出一行目前狀態，最後一行只有答案。
samples:
  - input: |
      8-(3+2*6)/5+4
    output: |
      8 3 2 6 * + 5 / - 4 +
      8 3 12 + 5 / - 4 +
      8 15 5 / - 4 +
      8 3 - 4 +
      5 4 +
      9
    explanation: 先依括號與優先級得到後綴式。第一個可執行符號是 `*`，以 12 取代 2、6、`*`；接著依序計算 `+ / - +`，每次都輸出替換後的後綴狀態。
  - input: |
      2^2^3
    output: |
      2 2 3 ^ ^
      2 8 ^
      256
    explanation: '`^` 由右向左結合，因此算式是 `2^(2^3)`，不是 `(2^2)^3`。'
core_knowledge:
  - 調度場算法以運算符堆疊將中綴式轉成後綴式
  - 乘方為右結合，其餘同優先級運算符為左結合
  - 後綴求值時，已讀取的未合併值加上未讀 token 就是目前顯示狀態
judgment: 題目同時要求括號、五種優先級與逐步化簡；應先固定後綴 token 序列，再用數值堆疊求值並於每個運算符後輸出狀態。
hints:
  - 第一階段：先只考慮轉換。數字直接輸出；左括號入棧；右括號讓運算符彈到對應左括號為止。
  - 第二階段：新運算符到來時，先彈出優先級更高者；同級時通常也彈出，但 `^` 是右結合，所以遇到另一個 `^` 不能先彈。
  - 第三階段：得到後綴 token 後，用數值棧依序求值。每次算完一個運算符，輸出棧內所有值，再接上尚未掃描的後綴 token。
solution_outline: 先用調度場算法轉換：數字直接加入後綴序列，括號控制彈棧範圍，普通運算符依優先級與結合方向彈出棧頂。接著先輸出完整後綴序列，再掃描它；數字入數值棧，運算符取右、左操作數計算並推回，每次計算後輸出數值棧及剩餘 token。
proof_or_invariant: 轉換階段中，已輸出的 token 是已確定順序的後綴前綴，運算符棧保存尚待右操作數或右括號完成的運算；彈出條件精確實現優先級與結合律。求值階段處理到位置 i 後，數值棧依序代表已讀前綴中尚未被合併的子表達式，接上原序列 i 之後的 token，正是一次合法化簡後的後綴狀態。
complexity:
  time: 'O(L^2)，逐行輸出長度本身可達 O(L^2)；轉換與純計算皆為 O(L)'
  space: 'O(L)'
common_errors:
  - 把 `^` 當成左結合，將 `2^2^3` 算成 64
  - 右括號處理完後忘記丟棄對應左括號
  - 減法與除法顛倒左右操作數
  - 只輸出數值棧，漏掉尚未處理的後綴 token
  - 使用浮點 pow，造成整數精度或轉型問題
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <vector>

  using namespace std;

  struct Token {
      bool is_number;
      long long number;
      char operation;
  };

  vector<Token> to_postfix(const string& expression) {
      vector<Token> postfix;
      vector<char> operations;
      // TODO：實作中綴轉後綴，特別處理 ^ 的右結合性。
      (void)expression;
      (void)operations;
      return postfix;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      string expression;
      cin >> expression;
      vector<Token> postfix = to_postfix(expression);
      // TODO：輸出初始後綴式，再逐步求值與輸出。
      (void)postfix;
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>

  using namespace std;

  struct Token {
      bool is_number;
      long long number;
      char operation;
  };

  int precedence(char operation) {
      if (operation == '+' || operation == '-') {
          return 1;
      }
      if (operation == '*' || operation == '/') {
          return 2;
      }
      return 3;
  }

  vector<Token> to_postfix(const string& expression) {
      vector<Token> postfix;
      vector<char> operations;

      for (char token : expression) {
          if (token >= '0' && token <= '9') {
              postfix.push_back({true, token - '0', '\0'});
          } else if (token == '(') {
              operations.push_back(token);
          } else if (token == ')') {
              while (operations.back() != '(') {
                  postfix.push_back({false, 0, operations.back()});
                  operations.pop_back();
              }
              operations.pop_back();
          } else {
              while (!operations.empty() && operations.back() != '(' &&
                     (precedence(operations.back()) > precedence(token) ||
                      (precedence(operations.back()) == precedence(token) &&
                       token != '^'))) {
                  postfix.push_back({false, 0, operations.back()});
                  operations.pop_back();
              }
              operations.push_back(token);
          }
      }

      while (!operations.empty()) {
          postfix.push_back({false, 0, operations.back()});
          operations.pop_back();
      }
      return postfix;
  }

  long long integer_power(long long base, long long exponent) {
      long long result = 1;
      while (exponent > 0) {
          if (exponent % 2 == 1) {
              result *= base;
          }
          base *= base;
          exponent /= 2;
      }
      return result;
  }

  long long calculate(long long left, long long right, char operation) {
      if (operation == '+') {
          return left + right;
      }
      if (operation == '-') {
          return left - right;
      }
      if (operation == '*') {
          return left * right;
      }
      if (operation == '/') {
          return left / right;
      }
      return integer_power(left, right);
  }

  void print_state(const vector<long long>& values,
                   const vector<Token>& postfix,
                   size_t next_position) {
      bool first = true;
      for (long long value : values) {
          if (!first) {
              cout << ' ';
          }
          cout << value;
          first = false;
      }
      for (size_t i = next_position; i < postfix.size(); ++i) {
          if (!first) {
              cout << ' ';
          }
          if (postfix[i].is_number) {
              cout << postfix[i].number;
          } else {
              cout << postfix[i].operation;
          }
          first = false;
      }
      cout << '\n';
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      string expression;
      if (!(cin >> expression)) {
          return 0;
      }
      vector<Token> postfix = to_postfix(expression);
      vector<long long> values;

      print_state(values, postfix, 0);
      for (size_t i = 0; i < postfix.size(); ++i) {
          if (postfix[i].is_number) {
              values.push_back(postfix[i].number);
          } else {
              long long right = values.back();
              values.pop_back();
              long long left = values.back();
              values.pop_back();
              values.push_back(calculate(left, right, postfix[i].operation));
              print_state(values, postfix, i + 1);
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1175
external_platform: 洛谷
external_problem_id: P1175
external_title: 表達式的轉換
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

這題把兩個經典堆疊流程串起來：先決定運算順序，再依後綴序列逐步合併子表達式。
