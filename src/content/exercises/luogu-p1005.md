---
id: luogu-p1005
volume: upper
source_file: upper-volume
title: 洛谷 P1005 矩陣取數遊戲
chapter: 5
section: '5.5'
kind: external-oj
difficulty: 4
topics: [dynamic-programming, interval-dp, arbitrary-precision]
prerequisites: [interval-dp]
statement: >-
  對 n×m 非負整數矩陣進行 m 輪；每輪每行從目前行首或行尾取一數。第 t 輪某行取值 x
  貢獻 x×2^t。各行獨立選擇，求所有行最大總分之和。
constraints:
  - 1 <= n,m <= 80
  - 矩陣元素為不超過 1000 的非負整數
  - 答案可能超出 64 位整數
input_format: 第一行 n、m；接著 n 行各 m 個矩陣元素。
output_format: 輸出最大總得分。
samples:
  - input: |-
      2 3
      1 2 3
      3 4 2
    output: '82'
    explanation: 每行分別做端點區間 DP，再將兩行最佳得分相加，結果為 82。
core_knowledge: [行獨立性, 端點區間 DP, 大整數]
judgment: 每輪每行都必須取一個數；輪次權重從 2^1 開始，直到 2^m。
hints:
  - 不同行的選擇互不影響，可逐行求最佳值後相加。
  - 剩餘區間 [l,r] 時，下一步只能取 l 或 r，指數由已取數量唯一決定。
  - m 可達 80，使用 boost::multiprecision::cpp_int 保存分數與二次冪。
solution_outline: 對每行按剩餘區間長度遞增，取左右端點兩方案最大值；用 cpp_int 累加各行答案。
proof_or_invariant: >-
  固定一行與剩餘區間，其已取數量及下一輪權重由區間長度唯一決定。任一合法策略下一步只可能
  取左端或右端，移除後分別留下更短區間的同型最優子問題；兩者取大無遺漏。由空區間向上歸納
  得單行最優值。不同行的操作同步但沒有共享限制，故各行最優值可獨立同時達成，總和即全局最優。
common_errors: [第一輪誤用 2^0, 用 long long 導致溢位, 把不同行混入同一區間状态]
complexity:
  time: O(n * m^2)
  space: O(m^2)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, m = 0; cin >> n >> m;
      // TODO：逐行以大整數進行端點區間 DP。
      cout << n - n + m - m << '\n';
  }
cpp_solution: |
  #include <boost/multiprecision/cpp_int.hpp>
  #include <iostream>
  #include <vector>
  using namespace std;
  using boost::multiprecision::cpp_int;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, m = 0; cin >> n >> m;
      vector<cpp_int> power(static_cast<size_t>(m + 1));
      power[0] = 1;
      for (int i = 1; i <= m; ++i) power[static_cast<size_t>(i)] = power[static_cast<size_t>(i - 1)] * 2;
      cpp_int total = 0;
      for (int row = 0; row < n; ++row) {
          vector<int> value(static_cast<size_t>(m));
          for (int& x : value) cin >> x;
          vector<vector<cpp_int>> dp(static_cast<size_t>(m),
                                     vector<cpp_int>(static_cast<size_t>(m)));
          for (int length = 1; length <= m; ++length)
              for (int left = 0; left + length <= m; ++left) {
                  const int right = left + length - 1;
                  const int exponent = m - length + 1;
                  const cpp_int inside_left = length == 1 ? 0 : dp[static_cast<size_t>(left + 1)][static_cast<size_t>(right)];
                  const cpp_int inside_right = length == 1 ? 0 : dp[static_cast<size_t>(left)][static_cast<size_t>(right - 1)];
                  const cpp_int take_left = inside_left + value[static_cast<size_t>(left)] * power[static_cast<size_t>(exponent)];
                  const cpp_int take_right = inside_right + value[static_cast<size_t>(right)] * power[static_cast<size_t>(exponent)];
                  dp[static_cast<size_t>(left)][static_cast<size_t>(right)] =
                      take_left > take_right ? take_left : take_right;
              }
          total += dp[0][static_cast<size_t>(m - 1)];
      }
      cout << total << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1005
external_platform: 洛谷
external_problem_id: P1005
external_title: 矩阵取数游戏
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

矩陣只是多個互不干擾的一維端點遊戲；真正的額外要求是精確保存 2^80 級別分數。
