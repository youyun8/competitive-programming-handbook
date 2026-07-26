---
id: luogu-p1776
volume: upper
source_file: upper-volume
title: 洛谷 P1776 寶物篩選
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 3
topics: [dynamic-programming, bounded-knapsack, binary-grouping]
prerequisites: [zero-one-knapsack]
statement: 採集車容量為 W；第 i 種寶物每件價值 v_i、重量 w_i，至多有 m_i 件。求不超重的最大總價值。
constraints:
  - 寶物種數、容量、價值、重量與數量皆為正整數
  - 每種寶物不可選超過其給定數量
input_format: 第一行為種類數 n 與容量 W；接著 n 行各給 v_i、w_i、m_i。
output_format: 輸出最大總價值。
samples:
  - input: |-
      4 20
      3 9 3
      5 9 1
      9 4 2
      8 1 3
    output: '47'
    explanation: 在容量 20 內最佳組合總價值為 47；有限背包枚舉了每種寶物的所有合法件數。
core_knowledge: [多重背包, 二進位分組, 一維 DP]
judgment: 同種寶物可選零到 m_i 件，每一件都具有相同重量與價值。
hints:
  - 直接逐件展開可能過慢，但件數 0..m 的選擇可以拆成少數幾組。
  - 把數量分成 1、2、4、… 與最後餘數，每組視為不可重複選的物品。
  - 對每個分組物品以容量遞減做 0/1 背包。
solution_outline: 對每種寶物二進位分組，將每組重量與價值乘上組大小後做標準 0/1 背包。
proof_or_invariant: >-
  分組大小可表示 0 到 m 的每個件數且不會超量，因此拆分前後可選集合相同。對每個分組做容量
  遞減的 0/1 轉移後，dp[c] 是已處理組在容量 c 內的最大價值；不選與選入兩種情況完備。
  歸納處理全部分組後 dp[W] 即原多重背包最優值。
common_errors: [容量遞增而重複選同一分組, 最後餘數遺漏, 把輸入價值與重量順序讀反]
complexity:
  time: O(W * sum(log(m_i + 1)))
  space: O(W)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; int capacity = 0; cin >> n >> capacity;
      // TODO：二進位分組後做 0/1 背包。
      cout << n - n + capacity - capacity << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; int capacity = 0; cin >> n >> capacity;
      vector<int> dp(static_cast<size_t>(capacity + 1), 0);
      for (int type = 0; type < n; ++type) {
          int value = 0; int weight = 0; int count = 0;
          cin >> value >> weight >> count;
          for (int block = 1; count > 0; block *= 2) {
              const int take = min(block, count);
              const int group_weight = take * weight;
              const int group_value = take * value;
              for (int c = capacity; c >= group_weight; --c)
                  dp[static_cast<size_t>(c)] =
                      max(dp[static_cast<size_t>(c)],
                          dp[static_cast<size_t>(c - group_weight)] + group_value);
              count -= take;
          }
      }
      cout << dp[static_cast<size_t>(capacity)] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1776
external_platform: 洛谷
external_problem_id: P1776
external_title: 宝物筛选
external_relation: original
source_book_pages: [325]
source_pdf_pages: [343]
review_status: verified
---

二進位分組將「選幾件」壓成對數個互斥位元，同時保留所有合法數量。
