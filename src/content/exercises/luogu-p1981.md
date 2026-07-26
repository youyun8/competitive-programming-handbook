---
id: luogu-p1981
volume: upper
source_file: upper-volume
original_label: 洛谷 P1981
title: 洛谷 P1981 表達式求值：加法與乘法優先級
chapter: 1
section: '1.3'
kind: external-oj
difficulty: 2
topics: ['堆疊', '表達式求值', '模運算']
prerequisites: ['stack', 'operator-precedence', 'modular-arithmetic']
statement: |-
  給定一個沒有括號、只含非負整數、加號與乘號的中綴算式。依一般規則先乘後加，輸出算式值的末四位所代表的整數；若不足四位，不補前導零。
constraints:
  - 每個操作數介於 0 與 2147483647 之間
  - 運算符總數最多 100000
  - 輸入只含數字、`+`、`*`
input_format: 輸入一行不含空白的算式，操作數可為多位非負整數，運算符只有 `+` 與 `*`。
output_format: 輸出完整算式值除以 10000 的餘數，不補前導零。
samples:
  - input: |
      1+1*3+4
    output: |
      8
    explanation: 先算乘法得到 `1+3+4`，總和為 8。
  - input: |
      1+1234567890*1
    output: |
      7891
    explanation: 完整值為 1234567891，除以 10000 的餘數是 7891。
core_knowledge:
  - 乘法項可立即合併，加法則切開不同乘積項
  - 加法與乘法都可在過程中取模 10000
  - 多位整數須逐字解析且同步取模
judgment: 運算符只有兩種且沒有括號，可把算式視為若干「連乘項」的總和；不必使用通用雙堆疊，也能完整保留一般優先級。
hints:
  - 第一階段：先把算式依 `+` 想成數個區塊；每個區塊內只剩乘法。
  - 第二階段：掃描到 `*` 時，下一個數仍屬目前乘積；掃描到 `+` 時，才把目前乘積加入總和。
  - 第三階段：解析每個數後，依前一個運算符更新 `current_product` 或結算至 `answer`；每一步都對 10000 取模，最後別漏掉末項。
solution_outline: 逐字解析多位整數。維護上一個運算符、目前連乘項 current_product 與已完成項之和 answer。若上一個符號是乘號就把數乘入目前項；若是加號則先把舊項加入答案，再以新數開始下一項。掃描完結算最後一項。
proof_or_invariant: 每解析完一個操作數，answer 等於所有已遇到且由加號封閉之連乘項總和，current_product 等於尚未封閉的最後一項乘積，兩者皆與真值模 10000 同餘。乘號只延長最後一項，加號則封閉它並開始新項，因此不變量成立；最後封閉末項即得整個算式。
complexity:
  time: 'O(L)，L 為輸入字串長度'
  space: 'O(1)'
common_errors:
  - 完全由左至右計算，忽略乘法優先於加法
  - 只在最後取模，導致中間連乘溢位
  - 使用 int 相乘後才轉型，乘積已先溢位
  - 掃描結束時忘記把最後一個連乘項加入答案
cpp_skeleton: |
  #include <iostream>
  #include <string>

  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      string expression;
      cin >> expression;
      constexpr long long modulus = 10000;
      long long answer = 0;
      long long current_product = 0;

      // TODO：逐一解析操作數，以 + 切分連乘項，過程中取模。

      cout << (answer + current_product) % modulus << '\n';
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <string>

  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      string expression;
      if (!(cin >> expression)) {
          return 0;
      }

      constexpr long long modulus = 10000;
      long long answer = 0;
      long long current_product = 0;
      char previous_operator = '+';
      size_t position = 0;

      while (position < expression.size()) {
          long long number = 0;
          while (position < expression.size() &&
                 expression[position] >= '0' && expression[position] <= '9') {
              number = (number * 10 + (expression[position] - '0')) % modulus;
              ++position;
          }

          if (previous_operator == '*') {
              current_product = current_product * number % modulus;
          } else {
              answer = (answer + current_product) % modulus;
              current_product = number;
          }

          if (position < expression.size()) {
              previous_operator = expression[position];
              ++position;
          }
      }

      answer = (answer + current_product) % modulus;
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1981
external_platform: 洛谷
external_problem_id: P1981
external_title: '[NOIP 2013 普及組] 表達式求值'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

只有加法與乘法時，整個算式就是「連乘項的總和」；這個分組觀點比通用語法分析更精簡。
