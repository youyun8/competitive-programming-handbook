---
id: luogu-p1541
volume: upper
source_file: upper-volume
title: 洛谷 P1541 烏龜棋
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 3
topics: [dynamic-programming, multidimensional-dp]
prerequisites: [dynamic-programming]
statement: >-
  棋盤有 n 格及 m 張前進卡，卡片數字只可能是 1、2、3、4。棋子從第 1 格出發，每張卡恰用一次，
  每次移動卡片所示格數並取得抵達格分數，起點分也自動取得。安排卡片順序使總分最大。
constraints:
  - 1 <= n <= 350
  - 1 <= m <= 120
  - 每種卡片不超過 40 張
  - 棋盤分數為非負整數且不超過 100
input_format: 第一行 n、m；第二行 n 格分數；第三行 m 張卡片的數字。
output_format: 輸出可取得的最大總分。
samples:
  - input: |-
      9 5
      6 10 14 2 8 8 18 5 17
      1 3 1 2 1
    output: '73'
    explanation: 使用順序 1、1、3、2、1 可取得 73 分，四維 DP 證明這是最大值。
core_knowledge: [多維計數狀態, 卡片使用次數 DP]
judgment: 所有卡片必須恰用一次；輸入保證用完時剛好抵達終點。
hints:
  - 同數字卡彼此無差別，狀態只需記錄四種卡各用了幾張。
  - 已走位置由使用數量唯一決定：1+a+2b+3c+4d。
  - 從四個可能前驅取最大值，再加目前抵達格分數。
solution_outline: 以四維陣列枚舉四種卡片已用數量，位置由加權和算出，從少一張卡的狀態轉移。
proof_or_invariant: >-
  每個狀態代表且只代表使用指定數量四種卡後的所有排列，其終點位置由總步數唯一確定。任一非初始
  排列的最後一張卡屬於四種之一，移除後恰落到對應前驅；反之替前驅附加該卡必可行。取前驅最大值
  加當前格分數便涵蓋所有排列。由總用卡數歸納，終態是全局最大分。
common_errors: [漏算起點分數, 位置少加起點偏移 1, 四種卡片數量或步數索引混淆]
complexity:
  time: O((c1+1)(c2+1)(c3+1)(c4+1))
  space: O((c1+1)(c2+1)(c3+1)(c4+1))
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; int m = 0; cin >> n >> m;
      // TODO：以四種卡片已使用張數做 DP。
      cout << n - n + m - m << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; int m = 0; cin >> n >> m;
      vector<int> score(static_cast<size_t>(n + 1));
      for (int i = 1; i <= n; ++i) cin >> score[static_cast<size_t>(i)];
      array<int, 4> count{};
      for (int i = 0; i < m; ++i) { int card = 0; cin >> card; ++count[static_cast<size_t>(card - 1)]; }
      const int b_size = count[1] + 1, c_size = count[2] + 1, d_size = count[3] + 1;
      const size_t total = static_cast<size_t>(count[0] + 1) * static_cast<size_t>(b_size) *
          static_cast<size_t>(c_size) * static_cast<size_t>(d_size);
      vector<int> dp(total, -1);
      const auto index = [=](int a, int b, int c, int d) {
          return (((static_cast<size_t>(a) * static_cast<size_t>(b_size) + static_cast<size_t>(b)) *
              static_cast<size_t>(c_size) + static_cast<size_t>(c)) *
              static_cast<size_t>(d_size) + static_cast<size_t>(d));
      };
      dp[0] = score[1];
      for (int a = 0; a <= count[0]; ++a) for (int b = 0; b <= count[1]; ++b)
          for (int c = 0; c <= count[2]; ++c) for (int d = 0; d <= count[3]; ++d) {
              if (a + b + c + d == 0) continue;
              int best = -1;
              if (a > 0) best = max(best, dp[index(a - 1, b, c, d)]);
              if (b > 0) best = max(best, dp[index(a, b - 1, c, d)]);
              if (c > 0) best = max(best, dp[index(a, b, c - 1, d)]);
              if (d > 0) best = max(best, dp[index(a, b, c, d - 1)]);
              const int position = 1 + a + 2 * b + 3 * c + 4 * d;
              dp[index(a, b, c, d)] = best + score[static_cast<size_t>(position)];
          }
      cout << dp[index(count[0], count[1], count[2], count[3])] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1541
external_platform: 洛谷
external_problem_id: P1541
external_title: 乌龟棋
external_relation: original
source_book_pages: [332]
source_pdf_pages: [350]
review_status: verified
---

卡片排列很多，但四種已用數量已足以決定位置與所有後續選擇。
