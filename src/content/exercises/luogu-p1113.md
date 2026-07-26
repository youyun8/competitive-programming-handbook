---
id: luogu-p1113
volume: lower
source_file: lower-volume
original_label: 洛谷 P1113
title: 雜務：平行工作的最短完工時間
chapter: 10
section: '10.2'
kind: external-oj
difficulty: 2
topics: [directed-acyclic-graph, dynamic-programming, critical-path]
prerequisites: [topological-order, dependency-graph]
statement: >-
  農場有 n 項工作，每項工作有自己的耗時，並可能必須等若干前置工作全部完成後才能開始。
  工人數量足夠，互不相依的工作可以同時進行。工作依編號輸入，且每項工作的前置工作編號
  都比它小。求從時間零開始，完成全部工作的最短時間。
constraints:
  - 3 <= n <= 10000
  - 每項工作耗時介於 1 到 100
  - 每項工作至多有 100 項前置工作
  - 第 k 項工作的所有前置工作編號都在 1 到 k-1 之間，輸入因此已是拓撲序
input_format: >-
  第一行為工作數 n。接著 n 行依編號遞增描述工作：先給工作編號與耗時，再給零個或多個
  前置工作編號，最後以 0 結束該行。
output_format: 輸出一個整數，表示所有工作皆完成所需的最短時間。
samples:
  - input: |
      7
      1 5 0
      2 2 1 0
      3 3 2 0
      4 6 1 0
      5 1 2 4 0
      6 8 2 4 0
      7 4 3 5 6 0
    output: '23'
    explanation: >-
      工作 7 最早在時間 19 開始並於 23 完成；其他工作不會更晚完成，因此全部工作的最短完工時間是 23。
core_knowledge:
  - 有無限平行資源時，工作最早開始時間是所有前置工作的最早完成時間最大值
  - 輸入保證前置編號較小，所以可依讀入順序直接做 DAG 動態規劃
  - 全部工作完成的時刻是各工作最早完成時間的最大值
judgment: 只需輸出最短總時間，不必輸出排程；互不相依的工作可完全重疊執行。
hints:
  - 為每項工作記錄「若所有工作都儘早開始，它最早何時完成」。
  - 一項工作必須等到最慢完成的前置工作結束；沒有前置工作時可從時間零開始。
  - 由於前置編號一定較小，讀到工作 k 時所需的狀態都已算好；最後取所有完成時間最大值。
solution_outline: >-
  建立 earliest_finish 陣列。依輸入順序處理每項工作，掃描該行直到 0，取所有前置工作的
  earliest_finish 最大值作為 earliest_start，再加上本項耗時。以所有 earliest_finish
  的最大值作答。無須另外建圖或執行拓撲排序。
proof_or_invariant: >-
  處理完編號 1 到 k 後，earliest_finish[i] 等於工作 i 在所有工作都儘早執行時的最早完成
  時刻。基底是無前置工作的工作可於時間零開始。對工作 k，所有前置工作的值已由較小編號
  算出；任何可行排程都必須等它們全數完成，所以開始時間至少是其最大值，而在工人無限時
  恰可於該時刻開始，故轉移同時是下界且可達。歸納後所有狀態正確，最晚的完成時刻即全部
  工作完成的最短時間。
common_errors:
  - 把前置工作的完成時間相加；它們可以平行執行，應取最大值
  - 只輸出第 n 項工作的完成時間；最後完成者不一定編號最大
  - 把行末的 0 當成工作編號存取陣列
  - 額外做逐輪拓撲處理並把每輪最大耗時相加，錯誤延後本可提早開始的工作
complexity:
  time: O(n + p)，p 為所有前置關係的總數
  space: O(n)
cpp_skeleton: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int task_count = 0;
      cin >> task_count;
      vector<int> earliest_finish(static_cast<size_t>(task_count + 1), 0);
      int answer = 0;
      for (int row = 0; row < task_count; ++row) {
          int task = 0;
          int duration = 0;
          cin >> task >> duration;
          int prerequisite = 0;
          int earliest_start = 0;
          while (cin >> prerequisite && prerequisite != 0) {
              // TODO：以這項前置工作的完成時間更新 earliest_start。
          }
          // TODO：計算 task 的最早完成時間並更新答案。
          (void)duration;
          (void)earliest_start;
      }
      cout << answer << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int task_count = 0;
      cin >> task_count;
      vector<int> earliest_finish(static_cast<size_t>(task_count + 1), 0);
      int answer = 0;
      for (int row = 0; row < task_count; ++row) {
          int task = 0;
          int duration = 0;
          cin >> task >> duration;
          int prerequisite = 0;
          int earliest_start = 0;
          while (cin >> prerequisite && prerequisite != 0) {
              earliest_start = max(
                  earliest_start,
                  earliest_finish[static_cast<size_t>(prerequisite)]);
          }
          earliest_finish[static_cast<size_t>(task)] = earliest_start + duration;
          answer = max(answer, earliest_finish[static_cast<size_t>(task)]);
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1113
external_platform: Luogu
external_problem_id: P1113
external_title: 雜務
external_relation: original
source_book_pages: [610]
source_pdf_pages: [240]
review_status: verified
---

先後關係已經藏在輸入順序中；抓住「前置完成時間的最大值」，就能直接得到關鍵路徑長度。
