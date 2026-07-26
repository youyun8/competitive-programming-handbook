---
id: openj-bailian-1014
volume: upper
source_file: upper-volume
title: OpenJudge 1014 Dividing
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 3
topics: [dynamic-programming, bounded-knapsack, partition]
prerequisites: [zero-one-knapsack]
statement: 已知價值 1 到 6 的彈珠各有若干顆，判斷能否把全部彈珠分成總價值相等的兩份。
constraints:
  - 每種彈珠數量為非負整數
  - 所有彈珠總顆數不超過 20000
  - 輸入以六個數量全為零結束
input_format: 每組一行六個整數 n_1..n_6，分別代表價值 1..6 的數量。
output_format: 依官方格式輸出 Collection 編號、Can be divided. 或 Can't be divided.，每組後空一行。
samples:
  - input: |-
      1 0 1 2 0 0
      1 0 0 0 1 1
      0 0 0 0 0 0
    output: |-
      Collection #1:
      Can't be divided.

      Collection #2:
      Can be divided.
    explanation: 第一組總值雖為偶數但無法湊出一半；第二組可把價值 6 與價值 1、5 分到兩側。
core_knowledge: [等和分割, 有限背包, 二進位分組]
judgment: 每顆彈珠必須分給其中一人；只要能從全部彈珠選出總值一半，另一半便自動相等。
hints:
  - 總價值為奇數時可直接判定不能平分。
  - 偶數時問題化為：各價值使用不超過給定數量，能否湊出 total/2。
  - 把每種數量二進位分組，對目標做遞減布林背包。
solution_outline: 計算總值；若為偶數，將六種有限物品分組做 0/1 可達性背包並檢查一半。
proof_or_invariant: >-
  平分存在當且僅當能選出一個總值為 total/2 的子集合。二進位分組完整表示每種合法使用數量；
  遞減 0/1 轉移後 reachable[s] 精確表示已處理彈珠能否湊出 s。故目標狀態真假與公平分割存在性
  完全等價；總值奇數時整數兩份顯然不可能。
common_errors: [總值為奇數仍執行背包, 忘記終止行不編號, 官方輸出中的空行或撇號錯誤]
complexity:
  time: O((total/2) * sum(log(n_i + 1)))
  space: O(total)
cpp_skeleton: |
  #include <array>
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      array<int, 6> count{};
      int test_case = 0;
      while (cin >> count[0] >> count[1] >> count[2] >> count[3] >> count[4] >> count[5]) {
          if (count == array<int, 6>{}) break;
          cout << "Collection #" << ++test_case << ":\nCan't be divided.\n\n";
      }
  }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      array<int, 6> count{};
      int test_case = 0;
      while (cin >> count[0] >> count[1] >> count[2] >> count[3] >> count[4] >> count[5]) {
          if (count == array<int, 6>{}) break;
          int total = 0;
          for (int i = 0; i < 6; ++i) total += count[static_cast<size_t>(i)] * (i + 1);
          bool possible = total % 2 == 0;
          const int target = total / 2;
          vector<bool> reachable(static_cast<size_t>(target + 1), false);
          reachable[0] = true;
          for (int i = 0; i < 6 && possible; ++i) {
              int remaining = count[static_cast<size_t>(i)];
              for (int block = 1; remaining > 0; block *= 2) {
                  const int take = min(block, remaining);
                  const int value = take * (i + 1);
                  for (int sum = target; sum >= value; --sum)
                      reachable[static_cast<size_t>(sum)] =
                          reachable[static_cast<size_t>(sum)] ||
                          reachable[static_cast<size_t>(sum - value)];
                  remaining -= take;
              }
          }
          possible = possible && reachable[static_cast<size_t>(target)];
          cout << "Collection #" << ++test_case << ":\n"
               << (possible ? "Can be divided." : "Can't be divided.") << "\n\n";
      }
  }
external_url: http://bailian.openjudge.cn/practice/1014/
external_platform: OpenJudge 百練
external_problem_id: '1014'
external_title: Dividing
external_relation: original
source_book_pages: [333]
source_pdf_pages: [351]
review_status: verified
---

公平分割不必同時追蹤兩人；找出一個價值恰為總和一半的子集合就已足夠。
