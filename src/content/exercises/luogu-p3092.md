---
id: luogu-p3092
volume: upper
source_file: upper-volume
title: 洛谷 P3092 No Change G
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 4
topics: [state-compression-dp, prefix-sum, binary-search]
prerequisites: [bitmask]
statement: >-
  有 k 枚硬幣與依序購買的 n 件商品。每次用一枚未用硬幣支付自上次付款後的一段連續商品，
  面額須足夠且不找零。買完全部商品後，求未用硬幣總值最大值；無法買完輸出 -1。
constraints:
  - 1 <= k <= 16
  - 1 <= n <= 100000
  - 1 <= coin_i <= 100000000
  - 1 <= cost_i <= 10000
input_format: 第一行 k、n；接著 k 行硬幣面額，再接 n 行商品價格。
output_format: 輸出最多剩餘金額，無法完成則輸出 -1。
samples:
  - input: |-
      3 6
      12
      15
      10
      6
      3
      3
      2
      3
      7
    output: '12'
    explanation: 用面額 10 支付前兩件、15 支付其餘四件，最後留下 12。
core_knowledge: [硬幣子集 DP, 最遠可購買前綴, 前綴和二分]
judgment: 每枚硬幣至多使用一次且不找零；每次付款必涵蓋下一段尚未付款的連續商品。
hints:
  - dp[mask] 記使用 mask 中硬幣後，最多完成前幾件商品。
  - 枚舉 mask 最後使用的硬幣，從前一狀態的終點開始付款。
  - 商品價格前綴和嚴格遞增，可用 upper_bound 找該硬幣能涵蓋的最遠終點。
solution_outline: 對所有硬幣子集枚舉最後一枚硬幣，二分可買到的最遠前綴；完成全部商品的狀態取未用面額最大值。
proof_or_invariant: >-
  固定已用硬幣集合，任一付款順序的最後硬幣唯一；移除它後最多完成 dp[previous] 件，而從更遠
  前綴開始付款不會比更近者差，因此以前一狀態最遠前綴轉移足夠。二分得到該硬幣可延伸的精確
  最遠位置，枚舉最後硬幣涵蓋所有順序。所有完成 n 件的 mask 中，總面額減已用面額即剩餘值。
common_errors: [把硬幣拆開支付多段, 忘記不找零, 用 32 位整數累加商品或硬幣總值]
complexity:
  time: O(k * 2^k * log n)
  space: O(2^k + n)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int k = 0, n = 0; cin >> k >> n;
      // TODO：以已用硬幣集合記錄最遠購買前綴。
      cout << k - k + n - n - 1 << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int k = 0, n = 0; cin >> k >> n;
      vector<long long> coin(static_cast<size_t>(k));
      long long all_money = 0;
      for (long long& value : coin) { cin >> value; all_money += value; }
      vector<long long> prefix(static_cast<size_t>(n + 1), 0);
      for (int i = 1; i <= n; ++i) {
          cin >> prefix[static_cast<size_t>(i)];
          prefix[static_cast<size_t>(i)] += prefix[static_cast<size_t>(i - 1)];
      }
      const int states = 1 << k;
      vector<int> farthest(static_cast<size_t>(states), -1);
      vector<long long> used_sum(static_cast<size_t>(states), 0);
      farthest[0] = 0;
      long long answer = -1;
      for (int mask = 1; mask < states; ++mask) {
          const int bit = __builtin_ctz(static_cast<unsigned int>(mask));
          used_sum[static_cast<size_t>(mask)] =
              used_sum[static_cast<size_t>(mask ^ (1 << bit))] + coin[static_cast<size_t>(bit)];
          for (int i = 0; i < k; ++i) if ((mask & (1 << i)) != 0) {
              const int previous = mask ^ (1 << i);
              if (farthest[static_cast<size_t>(previous)] < 0) continue;
              const int start = farthest[static_cast<size_t>(previous)];
              const long long bound = prefix[static_cast<size_t>(start)] + coin[static_cast<size_t>(i)];
              const int finish = static_cast<int>(upper_bound(prefix.begin(), prefix.end(), bound) -
                                                  prefix.begin()) - 1;
              farthest[static_cast<size_t>(mask)] = max(farthest[static_cast<size_t>(mask)], finish);
          }
          if (farthest[static_cast<size_t>(mask)] >= n)
              answer = max(answer, all_money - used_sum[static_cast<size_t>(mask)]);
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P3092
external_platform: 洛谷
external_problem_id: P3092
external_title: No Change G
external_relation: original
source_book_pages: [344]
source_pdf_pages: [362]
review_status: verified
---

對固定硬幣集合只保留「能走多遠」即可，因為更遠前綴永遠支配較近前綴。
