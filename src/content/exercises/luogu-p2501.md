---
id: luogu-p2501
volume: upper
source_file: upper-volume
title: 洛谷 P2501 數字序列
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 5
topics: [dynamic-programming, longest-nondecreasing-subsequence]
prerequisites: [longest-increasing-subsequence]
statement: 將整數序列修改成嚴格遞增。第一目標是修改項數最少；在此前提下，第二目標是所有修改量絕對值總和最小。輸出兩個最優值。
constraints:
  - 1 <= n <= 35000
  - 測資保證隨機生成
input_format: 第一行 n；第二行 n 個整數 a_i。
output_format: 第一行最少修改項數；第二行在此條件下的最小絕對修改量總和。
samples:
  - input: |-
      4
      5 2 3 5
    output: |-
      1
      4
    explanation: 將第一項 5 改為 1，可得 1、2、3、5，只改一項且修改量為 4。
core_knowledge: [嚴格遞增轉不下降, LNDS分層, 區間雙端調整]
judgment: 必須先最小化修改項數，不能為降低幅度而多修改一項。
hints:
  - 令 b_i=a_i-i，則修改後 a 嚴格遞增等價於修改後 b 不下降。
  - 能保持不變的最多項數是 b 的最長不下降子序列長度。
  - 對最長子序列相鄰保留點 l、r，中間最優值可在某切點前全取 b_l、後全取 b_r；枚舉切點用前後綴和求成本。
solution_outline: 先以 upper_bound 求 LNDS 層數；再只在相鄰層的可行保留點間轉移，計算各間隔最小 L1 調整成本。
proof_or_invariant: 變換後保留原值的索引必構成不下降子序列，反之任一此子序列都可補成不下降序列，故第一問是 n-LNDS。固定兩相鄰保留端點時，若中間存在值可作額外保留點就會產生更長子序列；在無此情形下，L1 最優不下降填值可壓到兩端值，並存在單一切點分界。枚舉所有相鄰 LNDS 層端點與切點，即涵蓋第一問最優方案中的最小成本。
common_errors: [直接對a求不下降子序列, 第二問只重建任意一條LNDS, 忘記加入兩端哨兵處理首尾]
complexity:
  time: 隨機資料下近似 O(n log n)，最壞可達 O(n^2)
  space: O(n)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n = 0; cin >> n; /* TODO：LNDS 分層後做成本 DP。 */ }
cpp_solution: |
  #include <algorithm>
  #include <cstdlib>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      vector<long long> value(static_cast<size_t>(n + 2));
      value[0] = -4000000000LL;
      for (int i = 1; i <= n; ++i) {
          cin >> value[static_cast<size_t>(i)];
          value[static_cast<size_t>(i)] -= i;
      }
      value[static_cast<size_t>(n + 1)] = 4000000000LL;
      vector<long long> tail;
      vector<int> level(static_cast<size_t>(n + 2), 0);
      vector<vector<int>> at_level(static_cast<size_t>(n + 3));
      at_level[0].push_back(0);
      for (int i = 1; i <= n + 1; ++i) {
          const auto iterator = upper_bound(tail.begin(), tail.end(), value[static_cast<size_t>(i)]);
          const int current_level = static_cast<int>(iterator - tail.begin()) + 1;
          level[static_cast<size_t>(i)] = current_level;
          if (iterator == tail.end()) tail.push_back(value[static_cast<size_t>(i)]);
          else *iterator = value[static_cast<size_t>(i)];
          at_level[static_cast<size_t>(current_level)].push_back(i);
      }
      const int longest = level[static_cast<size_t>(n + 1)] - 1;
      cout << n - longest << '\n';
      const long long infinity = numeric_limits<long long>::max() / 4;
      vector<long long> best(static_cast<size_t>(n + 2), infinity);
      vector<long long> prefix(static_cast<size_t>(n + 2));
      vector<long long> suffix(static_cast<size_t>(n + 2));
      best[0] = 0;
      for (int right = 1; right <= n + 1; ++right) {
          for (int left : at_level[static_cast<size_t>(level[static_cast<size_t>(right)] - 1)]) {
              if (left >= right || value[static_cast<size_t>(left)] > value[static_cast<size_t>(right)]) continue;
              prefix[static_cast<size_t>(left)] = 0;
              for (int i = left + 1; i < right; ++i)
                  prefix[static_cast<size_t>(i)] =
                      prefix[static_cast<size_t>(i - 1)] +
                      llabs(value[static_cast<size_t>(i)] - value[static_cast<size_t>(left)]);
              suffix[static_cast<size_t>(right)] = 0;
              for (int i = right - 1; i > left; --i)
                  suffix[static_cast<size_t>(i)] =
                      suffix[static_cast<size_t>(i + 1)] +
                      llabs(value[static_cast<size_t>(i)] - value[static_cast<size_t>(right)]);
              for (int split = left; split < right; ++split)
                  best[static_cast<size_t>(right)] =
                      min(best[static_cast<size_t>(right)],
                          best[static_cast<size_t>(left)] +
                          prefix[static_cast<size_t>(split)] +
                          suffix[static_cast<size_t>(split + 1)]);
          }
      }
      cout << best[static_cast<size_t>(n + 1)] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2501
external_platform: 洛谷
external_problem_id: P2501
external_title: 数字序列
external_relation: original
source_book_pages: [319]
source_pdf_pages: [337]
review_status: verified
---

減去索引後，兩級目標分別成為保留最長不下降子序列與其間隔的最小 L1 調整。
