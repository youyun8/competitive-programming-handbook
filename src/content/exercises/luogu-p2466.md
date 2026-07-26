---
id: luogu-p2466
volume: upper
source_file: upper-volume
title: 洛谷 P2466 Sue 的小球
chapter: 5
section: '5.5'
kind: external-oj
difficulty: 4
topics: [dynamic-programming, interval-dp]
prerequisites: [interval-dp]
statement: >-
  n 顆彩蛋初始在 (x_i,y_i)，以速度 v_i 向下落。Sue 從 x_0 出發，以水平速度 1 移動，
  抵達彩蛋正下方即可瞬間收集，得分為當時 y 座標的千分之一。必須收集全部彩蛋，求最高總分。
constraints:
  - n <= 1000
  - -10000 <= x_i,y_i <= 10000
  - 0 <= v_i <= 10000
input_format: 第一行 n、x_0；第二行 x_i；第三行 y_i；第四行 v_i。
output_format: 輸出最高總分，保留三位小數。
samples:
  - input: |-
      3 0
      -4 -2 2
      22 30 26
      1 9 8
    output: '0.000'
    explanation: 最佳收集順序造成的總下落損失恰抵銷初始魅力總和，故得分為零。
core_knowledge: [已收集區間性質, 剩餘速度總和, 端點區間 DP]
judgment: 彩蛋落到海面下仍須收集且可得到負分；同一 x 座標的彩蛋可在同一時刻全部取得。
hints:
  - 按 x 排序後，移動途中經過的彩蛋應立即收集，因此已收集集合可視為連續區間。
  - 移動距離 d 的期間，每顆尚未收集彩蛋都損失 d*v_i，故只需其速度總和。
  - dp[l][r][0/1] 表示已收集 [l,r] 並停在左／右端時，可達到的最大縮放後總分。
solution_outline: 排序後從單點區間向外擴張；加入左或右端彩蛋時，加初始 y 並扣除該段路程乘尚未收集速度總和。
proof_or_invariant: 若路徑越過某彩蛋卻不收集，立刻收集不花時間且只會提高得分，因此收集集合在排序後必為區間。固定已收集區間與所在端點後，未來損失只取決於外部彩蛋速度總和；最後加入的一端必由較小區間的某端移來，兩種轉移完備。單點基底已扣除從起點移動時全部彩蛋的下落損失，歸納後全區間最大值即最佳總分。
common_errors: [只扣即將收集彩蛋的下落損失, 忘記基底路程使全部彩蛋同時下落, 輸出前未除以1000]
complexity:
  time: O(n^2)
  space: O(n^2)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n = 0, start = 0; cin >> n >> start; /* TODO：排序後端點區間 DP。 */ }
cpp_solution: |
  #include <algorithm>
  #include <iomanip>
  #include <iostream>
  #include <limits>
  #include <vector>
  using namespace std;
  struct Egg { long long x; long long y; long long speed; };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; long long start = 0; cin >> n >> start;
      vector<Egg> egg(static_cast<size_t>(n));
      for (Egg& item : egg) cin >> item.x;
      for (Egg& item : egg) cin >> item.y;
      for (Egg& item : egg) cin >> item.speed;
      sort(egg.begin(), egg.end(), [](const Egg& left, const Egg& right) { return left.x < right.x; });
      vector<long long> prefix(static_cast<size_t>(n + 1), 0);
      for (int i = 0; i < n; ++i)
          prefix[static_cast<size_t>(i + 1)] = prefix[static_cast<size_t>(i)] + egg[static_cast<size_t>(i)].speed;
      const long long total_speed = prefix[static_cast<size_t>(n)];
      const long long negative_infinity = numeric_limits<long long>::min() / 4;
      vector<vector<long long>> left(static_cast<size_t>(n), vector<long long>(static_cast<size_t>(n), negative_infinity));
      vector<vector<long long>> right = left;
      for (int i = 0; i < n; ++i) {
          const long long initial = egg[static_cast<size_t>(i)].y -
                                    llabs(start - egg[static_cast<size_t>(i)].x) * total_speed;
          left[static_cast<size_t>(i)][static_cast<size_t>(i)] = initial;
          right[static_cast<size_t>(i)][static_cast<size_t>(i)] = initial;
      }
      for (int length = 2; length <= n; ++length)
          for (int l = 0; l + length <= n; ++l) {
              const int r = l + length - 1;
              const long long outside_left =
                  prefix[static_cast<size_t>(l + 1)] +
                  total_speed - prefix[static_cast<size_t>(r + 1)];
              left[static_cast<size_t>(l)][static_cast<size_t>(r)] =
                  egg[static_cast<size_t>(l)].y +
                  max(left[static_cast<size_t>(l + 1)][static_cast<size_t>(r)] -
                          (egg[static_cast<size_t>(l + 1)].x - egg[static_cast<size_t>(l)].x) * outside_left,
                      right[static_cast<size_t>(l + 1)][static_cast<size_t>(r)] -
                          (egg[static_cast<size_t>(r)].x - egg[static_cast<size_t>(l)].x) * outside_left);
              const long long outside_right =
                  prefix[static_cast<size_t>(l)] +
                  total_speed - prefix[static_cast<size_t>(r)];
              right[static_cast<size_t>(l)][static_cast<size_t>(r)] =
                  egg[static_cast<size_t>(r)].y +
                  max(left[static_cast<size_t>(l)][static_cast<size_t>(r - 1)] -
                          (egg[static_cast<size_t>(r)].x - egg[static_cast<size_t>(l)].x) * outside_right,
                      right[static_cast<size_t>(l)][static_cast<size_t>(r - 1)] -
                          (egg[static_cast<size_t>(r)].x - egg[static_cast<size_t>(r - 1)].x) * outside_right);
          }
      const long long scaled = max(left[0][static_cast<size_t>(n - 1)],
                                   right[0][static_cast<size_t>(n - 1)]);
      cout << fixed << setprecision(3) << static_cast<double>(scaled) / 1000.0 << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2466
external_platform: 洛谷
external_problem_id: P2466
external_title: Sue 的小球
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

移動時所有未收集彩蛋同步掉分，排序後的區間端點狀態正好保留必要資訊。
