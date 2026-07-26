---
id: openjudge-3429
volume: lower
source_file: lower-volume
title: OpenJudge 3429 D：可重集合操作
chapter: 8
section: '8.7'
kind: external-oj
difficulty: 1
topics:
  - 雜湊表
  - 集合
  - 計數
prerequisites:
  - 關聯式容器
statement: 維護一個初始為空、允許重複值的整數集合。add x 加入一個 x 並輸出加入後數量；del x 刪除所有 x 並輸出刪除前數量；ask x 輸出 x 是否曾被 add 過，以及目前數量。
constraints:
  - 0 <= n <= 100000
  - 共有 n 個命令
  - 命令為 add、del 或 ask 加一個整數
input_format: 第一行為命令數 n，接著 n 行各為一個命令與整數 x。
output_format: 每個命令輸出一行；add/del 輸出數量，ask 輸出 ever current。
samples:
  - input: |
      7
      add 1
      add 1
      ask 1
      ask 2
      del 2
      del 1
      ask 1
    output: |
      1
      2
      1 2
      0 0
      0
      2
      1 0
    explanation: 1 曾加入兩次，del 會一次刪掉兩份；刪除後 ask 仍須回報「曾加入」為 1。
core_knowledge:
  - 歷史狀態與目前狀態分離
  - 雜湊計數
  - 整批刪除
judgment: ask 同時詢問兩種不同狀態，不能只保存目前 multiset；用目前次數表加曾出現集合即可期望 O(1) 處理。
hints:
  - del 之後仍要知道 x 曾經加入過，因此「目前個數」與「歷史出現」不可共用同一個布林值。
  - add 只增加 count[x] 並把 x 放入歷史集合；del 先讀舊 count 再設為 0。
  - 使用 unordered_map<int,int> 與 unordered_set<int>；查不存在的鍵時目前數量視為 0。
solution_outline: 逐命令維護 unordered_map 的目前計數及 unordered_set 的曾加入紀錄，依命令規格在更新前後的正確時機輸出。
proof_or_invariant: 處理任意前綴後，count[x] 等於該前綴 add x 次數扣除最後一次 del x 以前所有 add 的結果；ever 恰包含曾出現過 add x 的值。三種操作按定義更新或查詢這兩個量，歸納可知每次輸出正確。
complexity:
  time: 期望 O(n)
  space: O(k)，k 為不同整數個數
common_errors:
  - del 只刪一份
  - del 後清掉曾出現紀錄
  - add 輸出更新前數量
  - 用 map 導致不必要的 O(log n) 但仍可通過
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依提示實作核心演算法。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int command_count;
      cin >> command_count;
      unordered_map<long long, int> count;
      unordered_set<long long> ever;
      while (command_count-- > 0) {
          string command;
          long long value;
          cin >> command >> value;
          if (command == "add") {
              ever.insert(value);
              cout << ++count[value] << '\n';
          } else if (command == "del") {
              cout << count[value] << '\n';
              count[value] = 0;
          } else {
            cout << (ever.find(value) != ever.end() ? 1 : 0) << ' ' << count[value] << '\n';
          }
      }
  }
external_url: http://bailian.openjudge.cn/practice/3429/
external_platform: OpenJudge 百練
external_problem_id: '3429'
external_title: D
external_relation: original
source_book_pages:
  - 548
source_pdf_pages:
  - 178
review_status: verified
---

題面資訊以外部 OJ 頁面逐項核實；解說為本站獨立撰寫。
