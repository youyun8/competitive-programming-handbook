---
id: luogu-p2396
volume: upper
source_file: upper-volume
title: 洛谷 P2396 yyy loves Maths VII
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 4
topics: [state-compression-dp, counting]
prerequisites: [bitmask-dp]
statement: >-
  有 n 張彼此視為不同的卡片，第 i 張值為 a_i。每次選一張未用卡，向前走 a_i 並丟棄它；
  若任一步停在厄運座標便立刻失敗。求用完全部卡片且從未踩中厄運座標的卡片排列數，模
  1,000,000,007。
constraints:
  - 1 <= n <= 24
  - 0 <= m <= 2
  - 1 <= a_i,b_i <= 10^9
  - 即使卡片值相同，不同編號的卡片仍是不同選擇
input_format: 第一行 n；第二行 n 個 a_i；第三行 m；若 m>0，第四行給 m 個厄運座標 b_i。
output_format: 輸出勝利方案數模 1,000,000,007。
samples:
  - input: |-
      3
      1 2 3
      1
      3
    output: '2'
    explanation: 六種卡片順序中，只有 1、3、2 與 2、3、1 的每個前綴和都不等於 3。
core_knowledge: [子集合前綴和, 排列計數 DP]
judgment: 終點若也是厄運座標仍算失敗；數值相同的卡片仍按卡片編號區分。
hints:
  - 走完某個卡片集合後的位置就是該集合元素和，與使用順序無關。
  - dp[mask] 記恰好使用 mask 中卡片且所有前綴合法的排列數。
  - 若 sum[mask] 是厄運座標，dp[mask]=0；否則枚舉最後使用的卡片 i，累加 dp[mask 去掉 i]。
solution_outline: 以 lowbit 預處理每個集合總和，再依集合遞增，對非厄運狀態枚舉最後一張卡。
proof_or_invariant: >-
  任一到達 mask 的合法排列，其最後一張卡 i 唯一，移除後即為 mask\\{i} 的合法排列；且新增的
  唯一停靠點是 sum[mask]，只要不是厄運座標便保持合法。反之每個此前合法排列接上 i 都形成
  合法且互異的排列。因此轉移是不重不漏的雙射，從空集合的一種排列歸納至全集即可。
common_errors: [只檢查最終總和而未封鎖中途厄運集合, 把同值卡片當成不可區分, m為零時仍讀取厄運數]
complexity:
  time: O(n * 2^n)
  space: O(2^n)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      // TODO：以子集合總和判斷厄運狀態並計數。
      cout << n - n << '\n';
  }
cpp_solution: |
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      constexpr int mod = 1000000007;
      int n = 0; cin >> n;
      vector<long long> value(static_cast<size_t>(n));
      for (long long& x : value) cin >> x;
      int bad_count = 0; cin >> bad_count;
      vector<long long> bad(static_cast<size_t>(bad_count));
      for (long long& x : bad) cin >> x;
      const uint32_t states = uint32_t{1} << static_cast<unsigned int>(n);
      vector<long long> sum(static_cast<size_t>(states), 0);
      vector<int> dp(static_cast<size_t>(states), 0);
      dp[0] = 1;
      for (uint32_t mask = 1; mask < states; ++mask) {
          const uint32_t bit = mask & (~mask + 1U);
          const int index = __builtin_ctz(bit);
          sum[static_cast<size_t>(mask)] =
              sum[static_cast<size_t>(mask ^ bit)] + value[static_cast<size_t>(index)];
          bool forbidden = false;
          for (long long position : bad)
              if (sum[static_cast<size_t>(mask)] == position) forbidden = true;
          if (forbidden) continue;
          int ways = 0;
          for (uint32_t remaining = mask; remaining != 0; remaining &= remaining - 1U) {
              const uint32_t last = remaining & (~remaining + 1U);
              ways += dp[static_cast<size_t>(mask ^ last)];
              if (ways >= mod) ways -= mod;
          }
          dp[static_cast<size_t>(mask)] = ways;
      }
      cout << dp[static_cast<size_t>(states - 1U)] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2396
external_platform: 洛谷
external_problem_id: P2396
external_title: yyy loves Maths VII
external_relation: original
source_book_pages: [360]
source_pdf_pages: [378]
review_status: verified
---

集合總和使「目前是否踩陷阱」與排列歷史無關，因而能把階乘枚舉壓成子集合 DP。
