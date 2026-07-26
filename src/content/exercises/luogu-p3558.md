---
id: luogu-p3558
volume: upper
source_file: upper-volume
title: 洛谷 P3558 BAJ-Bytecomputer
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 4
topics: [dynamic-programming, finite-state-dp]
prerequisites: [dynamic-programming]
statement: >-
  給只含 -1、0、1 的序列。一次操作可選 i<n，令 a_(i+1) 加上 a_i；可重複操作。
  求把序列變成非遞減所需最少操作數，無解輸出 BRAK。
constraints:
  - 1 <= n <= 1000000
  - a_i ∈ {-1,0,1}
input_format: 第一行 n，第二行 n 個序列元素。
output_format: 輸出最少操作數；若無法達成則輸出 BRAK。
samples:
  - input: |-
      6
      -1 1 0 -1 0 1
    output: '3'
    explanation: 三次操作可得到 -1、-1、-1、-1、0、1，這已是最少操作數。
core_knowledge: [線性有限狀態 DP, 前一值決定可操作增量]
judgment: 操作只改變右鄰元素；中間與最終數值理論上不限於 -1、0、1，但最優可限制在這三值。
hints:
  - 處理到位置 i 時，後續只需知道已合法前綴最後值。
  - 最優終值只需考慮 -1、0、1；對原值三種情況列出變成各終值所需操作及合法前驅。
  - 維護三個成本並滾動更新；所有狀態無限大時輸出 BRAK。
solution_outline: dp[v] 表示合法前綴最後值為 v∈{-1,0,1} 的最少操作，依當前原值套用常數個轉移。
proof_or_invariant: >-
  前一最終值為 -1、0、1 時，重複把它加到當前原值，能以最少 0、1、2 次到達轉移表中的合法值；
  超出此範圍只會增加操作且不放寬非遞減所需的臨界類別，因此可交換成三值之一而不變差。
  dp 精確保存每種末值的最佳合法前綴；每個新狀態枚舉所有能產生它且不下降的前驅，故逐位歸納
  後三個終態最小值即全局最優，皆不可達時即無解。
common_errors: [誤允許原值 -1 從前值 1 變成 0, 未用足夠大值表示不可達, 對 n=1 仍執行轉移]
complexity:
  time: O(n)
  space: O(1)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      // TODO：維護前綴末值為 -1、0、1 的最小操作數。
      cout << n - n << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      constexpr int infinity = 1000000000;
      int n = 0, first = 0; cin >> n >> first;
      array<int, 3> dp{{infinity, infinity, infinity}};
      dp[static_cast<size_t>(first + 1)] = 0;
      for (int i = 1; i < n; ++i) {
          int value = 0; cin >> value;
          array<int, 3> next{{infinity, infinity, infinity}};
          if (value == -1) {
              next[0] = dp[0];
              if (dp[2] < infinity) next[2] = dp[2] + 2;
          } else if (value == 0) {
              if (dp[0] < infinity) next[0] = dp[0] + 1;
              next[1] = min(dp[0], dp[1]);
              if (dp[2] < infinity) next[2] = dp[2] + 1;
          } else {
              if (dp[0] < infinity) {
                  next[0] = dp[0] + 2;
                  next[1] = dp[0] + 1;
              }
              next[2] = min({dp[0], dp[1], dp[2]});
          }
          dp = next;
      }
      const int answer = min({dp[0], dp[1], dp[2]});
      if (answer >= infinity) cout << "BRAK\n";
      else cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P3558
external_platform: 洛谷
external_problem_id: P3558
external_title: BAJ-Bytecomputer
external_relation: original
source_book_pages: [333]
source_pdf_pages: [351]
review_status: verified
---

雖然機器可存任意整數，非遞減約束只需要追蹤三個臨界末值，因而能做常數狀態線性 DP。
