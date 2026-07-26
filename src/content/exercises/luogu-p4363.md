---
id: luogu-p4363
volume: upper
source_file: upper-volume
title: 洛谷 P4363 一雙木棋
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 5
topics: [game-dp, state-compression, minimax]
prerequisites: [minimax]
statement: n×m 空棋盤上兩人輪流落子，黑方先手。格子可落子當且僅當其上方與左方所有格子都已有棋。終局黑方得分為其格子 A 值總和，白方得分為其格子 B 值總和；兩人皆最優，求黑分減白分。
constraints:
  - 1 <= n,m <= 10
  - 0 <= A_i,j,B_i,j <= 100000
input_format: 第一行 n、m；接著 n 行矩陣 A，再 n 行矩陣 B。
output_format: 輸出雙方最優策略下的黑方得分減白方得分。
samples:
  - input: |-
      1 2
      5 7
      3 4
    output: '1'
    explanation: 唯一落子順序由左至右；黑方得 5，白方得 4。
core_knowledge: [楊圖輪廓狀態, 奇偶回合, 極大極小 DP]
judgment: 上方與左方是該格同欄上側、同行左側的全部格子；不是僅相鄰格。
hints:
  - 任一時刻每行已填格必為前綴，且各行前綴長度由上到下不增。
  - 用 n 個介於 0..m 的數記每行已填長度，合法下一步是在仍短於上一行的某行末端加一。
  - 已填格數偶數時黑方最大化並加 A，奇數時白方最小化並減 B。
solution_outline: 以 base-(m+1) 編碼輪廓，記憶化 minimax 搜尋所有合法楊圖狀態。
proof_or_invariant: 落子條件等價於已填集合為左上封閉的楊圖，因此行前綴長度完整且唯一描述局面。每個合法下一格恰是某行前綴末端且不超過上一行長度。黑回合選最大、白回合選最小分差，分別加入該格終局貢獻；由滿盤基底反向歸納即為雙方最優博弈值。
common_errors: [把輪廓長度方向寫反, 白方回合仍取最大值, 白棋貢獻誤加A或未取負]
complexity:
  time: O(n * C(n+m,n))
  space: O(C(n+m,n))
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n = 0, m = 0; cin >> n >> m; /* TODO：輪廓 minimax。 */ cout << 0 << '\n'; }
cpp_solution: |
  #include <algorithm>
  #include <functional>
  #include <iostream>
  #include <limits>
  #include <unordered_map>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, m = 0; cin >> n >> m;
      vector<vector<long long>> black(static_cast<size_t>(n), vector<long long>(static_cast<size_t>(m)));
      vector<vector<long long>> white(static_cast<size_t>(n), vector<long long>(static_cast<size_t>(m)));
      for (auto& row : black) for (long long& value : row) cin >> value;
      for (auto& row : white) for (long long& value : row) cin >> value;
      const long long base = m + 1LL;
      unordered_map<long long, long long> memo;
      function<long long(vector<int>&, int, long long)> solve =
          [&](vector<int>& length, int placed, long long code) -> long long {
              if (placed == n * m) return 0;
              const auto found = memo.find(code);
              if (found != memo.end()) return found->second;
              const bool black_turn = placed % 2 == 0;
              long long best = black_turn ? numeric_limits<long long>::min()
                                          : numeric_limits<long long>::max();
              long long place_value = 1;
              for (int row = 0; row < n; ++row) {
                  if (length[static_cast<size_t>(row)] < m &&
                      (row == 0 || length[static_cast<size_t>(row)] <
                                       length[static_cast<size_t>(row - 1)])) {
                      const int column = length[static_cast<size_t>(row)];
                      ++length[static_cast<size_t>(row)];
                      const long long future = solve(length, placed + 1, code + place_value);
                      --length[static_cast<size_t>(row)];
                      const long long candidate =
                          future + (black_turn ? black[static_cast<size_t>(row)][static_cast<size_t>(column)]
                                               : -white[static_cast<size_t>(row)][static_cast<size_t>(column)]);
                      best = black_turn ? max(best, candidate) : min(best, candidate);
                  }
                  place_value *= base;
              }
              memo[code] = best;
              return best;
          };
      vector<int> length(static_cast<size_t>(n), 0);
      cout << solve(length, 0, 0) << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P4363
external_platform: 洛谷
external_problem_id: P4363
external_title: 一双木棋 chess
external_relation: original
source_book_pages: [360]
source_pdf_pages: [378]
review_status: verified
---

左上封閉的棋面只有二項係數量級輪廓，遠少於任意格子子集合。
