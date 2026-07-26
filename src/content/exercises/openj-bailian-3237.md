---
id: openj-bailian-3237
volume: upper
source_file: upper-volume
title: OpenJudge 百練 3237 雞兔同籠：由腳數求動物數範圍
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 1
topics: [math, parity]
prerequisites: []
statement: 籠內只有每隻兩腳的雞與每隻四腳的兔。給定腳的總數 a，求可能的最少與最多動物數；若不存在任何整數組合則輸出 0 0。
constraints: ['測試組數為正整數', 'a 是正整數且 a < 32768']
input_format: 第一行測試組數 n；接著 n 行各有一個腳數 a。
output_format: 每組輸出最少動物數與最多動物數；無解輸出 `0 0`。
samples:
  - input: |
      2
      3
      20
    output: |
      0 0
      5 10
    explanation: 3 是奇數，不可能由 2 與 4 相加；20 腳全為兔時有 5 隻，全為雞時有 10 隻。
core_knowledge: [奇偶性判斷, 整數上下界]
judgment: 雞或兔的數量都可為零；題目只問動物總數的極值，不問方案數。
hints:
  - 每種動物的腳數都是偶數，因此奇數 a 必定無解。
  - 要讓動物最少，應盡量使用四腳動物；答案是 a 除以 4 的向上取整。
  - 要讓動物最多，全部使用兩腳動物即可；偶數 a 的答案為 a/2。
solution_outline: 奇數直接輸出 0 0；偶數的最少值為 `(a+3)/4`，最大值為 `a/2`。
proof_or_invariant: k 隻動物的腳數介於 2k 與 4k，且皆為偶數。對偶數 a，`ceil(a/4)` 可用若干兔加至多一隻雞達成，a/2 可由全雞達成，故兩端皆可行且最優。
common_errors: [把最少值寫成向下取整 a/4, 忘記奇數無解, 誤認為雞兔都必須至少一隻]
complexity: { time: '每組 O(1)', space: 'O(1)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      int test_count;
      cin >> test_count;
      while (test_count--) {
          int feet;
          cin >> feet;
          // TODO：判斷奇偶並計算動物數上下界。
      }
      return 0;
  }
cpp_solution: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int test_count;
      cin >> test_count;
      while (test_count--) {
          int feet;
          cin >> feet;
          if (feet % 2 != 0) cout << "0 0\n";
          else cout << (feet + 3) / 4 << ' ' << feet / 2 << '\n';
      }
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/3237/
external_platform: OpenJudge 百練
external_problem_id: '3237'
external_title: 雞兔同籠
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

題單把這個編號列在樹鏈剖分段落，但官方頁實際是基礎整數題；卡片忠實對應已核實的外部頁面。
