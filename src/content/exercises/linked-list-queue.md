---
id: linked-list-queue
volume: upper
source_file: upper-volume
title: 洛谷 P1996 約瑟夫問題
chapter: 1
section: '1.1'
kind: external-oj
difficulty: 1
topics: ['循環鏈結串列', '模擬', '迭代器']
prerequisites: ['鏈結串列', '取模與循環']
statement: |-
  有 n 個人依編號 1 到 n 順時針圍成一圈。由 1 號開始依序報數，每輪報到 m 的人離開；下一輪從離開者的下一位重新由 1 開始報數。持續到所有人都離開，依先後順序輸出每位離開者的編號。
constraints:
  - '1 <= n <= 100'
  - '1 <= m <= 100'
input_format: 一行輸入兩個整數 n、m，分別表示人數與每輪報到即離開的數字。
output_format: 一行輸出 n 個整數，依序表示離開圓圈的人員編號。
samples:
  - input: |
      10 3
    output: |
      3 6 9 2 7 1 8 5 10 4
    explanation: |-
      這是核實過的官方範例。起初由 1 號報 1，因此前三位報數者是 1、2、3，3 號先離開。接著由 4 號重新報 1，故 6 號第二個離開；再來是 9 號。9 號離開後跨過圓圈尾端，10、1、2 分別報 1、2、3，所以 2 號接著離開。以同一規則維護目前仍在圈內的人，即得到完整順序。
core_knowledge:
  - 循環鏈結串列的尾端與首端銜接
  - 迭代器刪除後接續位置的維護
  - 只對仍在圈內的人計數
judgment: |-
  依序模擬每次報數與離開即可。n、m 均不超過 100，O(nm) 的循環鏈結串列模擬足以通過；重點是刪除目前節點後，下一輪必須由其後繼節點開始。
hints:
  - 先想像目前還在圈內的人依圓周順序排成一條「首尾相接」的串列；已離開者不應再占用報數次數。
  - 每輪從目前位置起走過 m 位仍在圈內的人，第 m 位就是本輪答案。走到容器尾端時要接回開頭。
  - 刪除節點後，讓游標停在 erase 回傳的後繼；若它等於 end，再移到 begin，便正好是下一輪報 1 的人。
solution_outline: |-
  把 1 到 n 依序放入 std::list，並以迭代器 current 指向本輪報 1 的人。每輪先將 current 前進 m-1 次，每次碰到 end 就繞回 begin；此時 current 所指的人報到 m，先輸出編號，再以 erase 刪除。erase 的回傳值就是下一位；若回傳 end 且串列尚未清空，就改指向 begin。重複直到串列為空。
proof_or_invariant: |-
  每輪開始時，串列由 current 起沿迭代方向排列的節點，恰好是仍在圈內的人從本輪報 1 者開始的圓周順序。前進 m-1 次後，current 因而指向第 m 位有效報數者，刪除它符合題意。erase 回傳被刪節點的後繼；必要時由尾端繞回首端後，該位置正是下一輪報 1 的人，因此不變量延續。串列每輪減少一個節點，最後輸出的 n 人及順序皆正確。
common_errors:
  - 把已離開的人仍算入 m 次報數。
  - 前進 m 次而不是 m-1 次，造成整體答案錯一位。
  - 迭代器到達 end 時沒有繞回 begin，或在串列清空後仍解參考迭代器。
complexity:
  time: 'O(nm)：共刪除 n 人，每輪最多前進 m-1 次；erase 本身為 O(1)'
  space: O(n)
cpp_skeleton: |
  #include <iostream>
  #include <list>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n = 0;
      int m = 0;
      cin >> n >> m;

      list<int> remaining;
      for (int person = 1; person <= n; ++person) {
          remaining.push_back(person);
      }

      auto current = remaining.begin();
      bool first_output = true;
      while (!remaining.empty()) {
          // TODO：將 current 前進 m-1 位；遇到 end 時繞回 begin。

          // TODO：輸出 current，刪除它，並讓 current 指向下一輪報 1 的人。
          // 提醒：remaining 清空後不可再取 begin 或解參考 current。
          (void)current;
          (void)first_output;
          break;
      }
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <list>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n = 0;
      int m = 0;
      cin >> n >> m;

      list<int> remaining;
      for (int person = 1; person <= n; ++person) {
          remaining.push_back(person);
      }

      auto current = remaining.begin();
      bool first_output = true;
      while (!remaining.empty()) {
          for (int count = 1; count < m; ++count) {
              ++current;
              if (current == remaining.end()) {
                  current = remaining.begin();
              }
          }

          if (!first_output) {
              cout << ' ';
          }
          first_output = false;
          cout << *current;

          current = remaining.erase(current);
          if (!remaining.empty() && current == remaining.end()) {
              current = remaining.begin();
          }
      }
      cout << '\n';
      return 0;
  }
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
external_url: https://www.luogu.com.cn/problem/P1996
external_platform: 洛谷
external_problem_id: P1996
external_title: 约瑟夫问题
external_relation: original
---

以循環鏈結串列保存仍在圈內的人，可以讓「刪除後從下一位繼續」直接對應到迭代器操作。
