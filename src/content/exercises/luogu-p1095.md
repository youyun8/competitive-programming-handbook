---
id: luogu-p1095
volume: upper
source_file: upper-volume
title: 洛谷 P1095 守望者的逃離
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 2
topics: [dynamic-programming, greedy, simulation]
prerequisites: [dynamic-programming]
statement: >-
  守望者初始有 M 點魔法，距出口 S 公尺，島在 T 秒後沉沒。每秒可跑 17 公尺、耗 10 魔法
  閃爍 60 公尺，或原地休息恢復 4 魔法。求能否在期限內逃出；能則求最短時間，否則求最遠距離。
constraints:
  - 0 <= M <= 1000
  - 1 <= S <= 100000000
  - 1 <= T <= 300000
input_format: 一行三個整數 M、S、T。
output_format: 第一行輸出 Yes 或 No；第二行輸出最短逃出秒數，或 T 秒內最遠距離。
samples:
  - input: '39 200 4'
    output: |-
      No
      197
    explanation: 四秒內最佳組合可前進 197 公尺，仍小於 200，故輸出 No 與最遠距離。
core_knowledge: [逐秒最優狀態, 閃爍與休息策略合併]
judgment: 每秒只能跑、閃爍、休息三選一；到達距離 S 的最早整秒即成功。
hints:
  - 單獨考慮只閃爍或休息的策略，每秒只需貪心：魔法足夠便閃爍，否則恢復。
  - 令 magic_distance 為上述策略距離；總最佳距離可由上一秒最佳距離跑 17，或取 magic_distance。
  - 每秒更新後立刻檢查是否達 S，第一次達到就是最短時間。
solution_outline: 同步維護純魔法策略距離與允許跑步的總最佳距離，逐秒更新並檢查出口。
proof_or_invariant: >-
  對純魔法策略，魔法足夠時立即閃爍不會比延後差；不足時唯一能改善未來閃爍能力的是休息。
  第 t 秒總最佳方案的末步若跑步，距離為前一秒總最佳值加 17；若非跑步，其距離不超過純魔法
  策略在 t 秒的值（過往跑步後再休息/閃爍可由取最大值的歷史前綴接續涵蓋）。故逐秒最大值
  保持最遠距離，首次達標自然是最短時間。
common_errors: [只比較全跑與全閃爍而漏掉混合策略, 成功後仍繼續模擬, 休息秒錯加移動距離]
complexity:
  time: O(T)
  space: O(1)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int magic = 0; int target = 0; int seconds = 0;
      cin >> magic >> target >> seconds;
      // TODO：逐秒合併純魔法策略與跑步策略。
      cout << "No\n" << magic - magic + target - target + seconds - seconds << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int magic = 0; int target = 0; int seconds = 0;
      cin >> magic >> target >> seconds;
      int magic_distance = 0;
      int best_distance = 0;
      for (int time = 1; time <= seconds; ++time) {
          if (magic >= 10) {
              magic -= 10;
              magic_distance += 60;
          } else {
              magic += 4;
          }
          best_distance = max(best_distance + 17, magic_distance);
          if (best_distance >= target) {
              cout << "Yes\n" << time << '\n';
              return 0;
          }
      }
      cout << "No\n" << best_distance << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1095
external_platform: 洛谷
external_problem_id: P1095
external_title: 守望者的逃离
external_relation: original
source_book_pages: [332]
source_pdf_pages: [350]
review_status: verified
---

將「只靠魔法」的前緣與「任意策略」的前緣分開維護，可把看似三選一的 DP 壓成常數狀態。
