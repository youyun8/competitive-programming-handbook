---
id: luogu-p5339
volume: lower
source_file: lower-volume
title: 洛谷 P5339 避免連續四種指定喜好
chapter: 7
section: '7.5'
kind: external-oj
difficulty: 4
topics: [inclusion-exclusion, binomial-prefix-sum, pattern-avoidance]
prerequisites: [inclusion-exclusion, combinatorics-basics]
statement: >-
  排出長度 n 的喜好序列，四種喜好各至多可用 a、b、c、d 人。禁止出現連續四格依序為
  唱、跳、rap、籃球。計算合法序列數模 998244353；同喜好的人不作區分。
constraints:
  - n <= 1000
  - a,b,c,d <= 500
  - a+b+c+d >= n
input_format: 一行五個整數 n、a、b、c、d。
output_format: 輸出不含指定四字模式的喜好序列數模 998244353。
samples:
  - input: '4 4 3 2 1'
    output: '174'
    explanation: 所有符合人數上限的長度四序列中，扣除唯一的「唱跳 rap 籃球」模式後得到 174。
core_knowledge:
  - 禁止模式沒有非空自重疊，可把每個指定出現黏成一個區塊
  - 四類受限序列數可拆成兩對類別並以二項式列前綴和計算
judgment: 只記錄喜好類別序列；同類學生彼此不區分。
hints:
  - 容斥指定 i 個禁模式出現，黏合後相當於在 n-3i 個物件中選 i 個模式區塊。
  - 扣掉每類各 i 人後，剩 n-4i 格只需滿足四個人數上限。
  - 枚舉前兩類共占 mid 格；兩類內部分配數都是一段二項式係數和，可用前綴表 O(1) 查詢。
solution_outline: 預處理 C(row,column) 與每列前綴和；枚舉模式區塊數 i，再枚舉 mid 計算剩餘序列數，最後交替加減。
proof_or_invariant: >-
  此四字模式無法與另一個出現重疊，因此指定 i 個出現後黏成 i 個不可區分區塊，
  位置數為 C(n-3i,i)。剩餘位置按四類計數，先選 AB 位置再在兩側分配的組合式逐一且不重複。
  容斥使含 r 個禁模式的序列係數為 Σ(-1)^i C(r,i)，僅 r=0 留下 1。
common_errors:
  - 區塊黏合後仍使用 C(n,i)，正確總物件數是 n-3i
  - 忘記每指定一個區塊會消耗四類各一人
  - 對二項式前綴查詢未裁切負下界或超過列長的上界
complexity:
  time: O(n^2)
  space: O(n^2)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      int n, a, b, c, d;
      cin >> n >> a >> b >> c >> d;
      // TODO：枚舉被指定的禁模式區塊並容斥。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;

  static constexpr int64_t mod_value = 998244353;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, a, b, c, d;
      cin >> n >> a >> b >> c >> d;
      vector<vector<int64_t>> combination(static_cast<size_t>(n) + 1U,
                                          vector<int64_t>(static_cast<size_t>(n) + 1U));
      vector<vector<int64_t>> prefix(static_cast<size_t>(n) + 1U,
                                     vector<int64_t>(static_cast<size_t>(n) + 1U));
      for (int row = 0; row <= n; ++row) {
          combination[static_cast<size_t>(row)][0] = 1;
          for (int column = 1; column <= row; ++column) {
              combination[static_cast<size_t>(row)][static_cast<size_t>(column)] =
                  (combination[static_cast<size_t>(row - 1)][static_cast<size_t>(column - 1)] +
                   combination[static_cast<size_t>(row - 1)][static_cast<size_t>(column)]) %
                  mod_value;
          }
          int64_t running = 0;
          for (int column = 0; column <= row; ++column) {
              running = (running + combination[static_cast<size_t>(row)][static_cast<size_t>(column)]) %
                        mod_value;
              prefix[static_cast<size_t>(row)][static_cast<size_t>(column)] = running;
          }
      }
      const auto range_sum = [&](int row, int left, int right) {
          left = max(left, 0);
          right = min(right, row);
          if (left > right) { return int64_t{0}; }
          int64_t result = prefix[static_cast<size_t>(row)][static_cast<size_t>(right)];
          if (left > 0) {
              result = (result - prefix[static_cast<size_t>(row)][static_cast<size_t>(left - 1)] +
                        mod_value) %
                       mod_value;
          }
          return result;
      };
      int64_t answer = 0;
      const int block_limit = min({n / 4, a, b, c, d});
      for (int blocks = 0; blocks <= block_limit; ++blocks) {
          const int remaining = n - 4 * blocks;
          const int cap_a = a - blocks;
          const int cap_b = b - blocks;
          const int cap_c = c - blocks;
          const int cap_d = d - blocks;
          int64_t remaining_ways = 0;
          const int lower_mid = max(0, remaining - cap_c - cap_d);
          const int upper_mid = min(remaining, cap_a + cap_b);
          for (int mid = lower_mid; mid <= upper_mid; ++mid) {
              const int64_t split_ab = range_sum(mid, mid - cap_b, cap_a);
              const int64_t split_cd =
                  range_sum(remaining - mid, remaining - mid - cap_d, cap_c);
              const int64_t choose_positions =
                  combination[static_cast<size_t>(remaining)][static_cast<size_t>(mid)];
              remaining_ways =
                  (remaining_ways + choose_positions * split_ab % mod_value * split_cd) % mod_value;
          }
          const int64_t term =
              combination[static_cast<size_t>(n - 3 * blocks)][static_cast<size_t>(blocks)] *
              remaining_ways % mod_value;
          answer = (blocks & 1) != 0 ? (answer - term + mod_value) % mod_value
                                     : (answer + term) % mod_value;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5339
external_platform: 洛谷
external_problem_id: P5339
external_title: '[TJOI2019] 唱、跳、rap 和籃球'
external_relation: original
source_book_pages: [481, 485]
source_pdf_pages: [111, 115]
review_status: verified
---

無自重疊模式可直接黏成區塊；四類上限再用兩組二項式前綴和壓到平方時間。
