---
id: luogu-p3336
volume: upper
source_file: upper-volume
title: 洛谷 P3336 話舊
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 5
topics: [dynamic-programming, combinatorics, piecewise-linear]
prerequisites: [counting-dp]
statement: >-
  函數在整點間斜率只能為 ±1，f(0)=f(N)=0，且所有局部極小值都等於 0。給若干整點函數值，
  求符合條件的函數數量模 19940417，以及所有可行函數能達到的最大高度。
constraints:
  - 0 <= N <= 10^9
  - 0 <= K <= 10^6
input_format: 第一行 N、K；接著 K 行 x_i、f(x_i)，同一位置可能重複出現。
output_format: 輸出方案數模 19940417，以及可行函數的最大高度。
samples:
  - input: '2 0'
    output: '1 1'
    explanation: 唯一路徑為先上升再下降，高度序列 0、1、0。
core_knowledge: [山峰山谷分解, 稀疏約束區間轉移, 方向狀態]
judgment: 斜率切換由下降轉上升時只能位於高度零；重複給定同一整點不代表多個限制。
hints:
  - 在每個已知點保存抵達時最後一步是上升或下降的方案數。
  - 相鄰限制點間若無法碰到零，路徑至多先升後降；若有多餘偶數步，可插入若干完整山峰。
  - 最大高度也按抵達方向 DP；區間內最高峰可由步數、兩端高度及是否經過零直接計算。
solution_outline: 排序去重限制並補 (0,0)、(N,0)，對每段以二方向 2×2 閉式轉移同時計數與最大高度。
proof_or_invariant: 局部谷底只能為零，故一段未碰零時方向序列至多是若干上升後若干下降；碰零後則分解為首尾殘段與若干完整山峰。依區間長度扣除兩端高度後，剩餘步數每兩步提供一次獨立「結束山峰或開始下一山峰」選擇，得到二次冪轉移。方向狀態完整記錄跨限制點是否可轉彎；最大值轉移枚舉同一四種方向組合並把額外步數集中到單一峰，因而同時正確。
common_errors: [允許在正高度由下降轉上升, 未檢查距離與高度奇偶性, 只用方案總數而忽略端點方向]
complexity:
  time: O(K log K)
  space: O(K)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { long long n = 0; int k = 0; cin >> n >> k; /* TODO：稀疏區間方向 DP。 */ }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <limits>
  #include <map>
  #include <utility>
  #include <vector>
  using namespace std;
  constexpr long long mod = 19940417;
  long long power_two(long long exponent) {
      long long result = 1, base = 2;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) result = result * base % mod;
          base = base * base % mod;
          exponent >>= 1LL;
      }
      return result;
  }
  long long interval_peak(long long length, long long from, long long to,
                          int incoming, int outgoing) {
      const long long impossible = numeric_limits<long long>::min() / 4;
      long long best = impossible;
      if (outgoing == 1 && from - to == length) best = max(best, from);
      if (incoming == 0) {
          if (outgoing == 0 && to - from == length) best = max(best, to);
          if (outgoing == 1 && (length + from + to) % 2 == 0) {
              const long long peak = (length + from + to) / 2;
              if (peak >= max(from, to) && peak > to) best = max(best, peak);
          }
      }
      const long long suffix = outgoing == 0 ? to : (to == 0 ? 0 : to + 2);
      const long long extra = length - from - suffix;
      if (extra >= 0 && extra % 2 == 0 && !(outgoing == 0 && to == 0)) {
          best = max(best, max(from, outgoing == 0 ? to : (to == 0 ? 0 : to + 1)));
          if (incoming == 0) best = max(best, from + extra / 2);
          best = max(best, extra / 2);
          if (outgoing == 1 && to > 0) best = max(best, to + 1 + extra / 2);
      }
      return best;
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      long long n = 0; int k = 0; cin >> n >> k;
      map<long long, long long> known;
      bool valid = true;
      for (int i = 0; i < k; ++i) {
          long long x = 0, y = 0; cin >> x >> y;
          if (known.count(x) != 0 && known[x] != y) valid = false;
          known[x] = y;
      }
      if ((known.count(0) != 0 && known[0] != 0) ||
          (known.count(n) != 0 && known[n] != 0)) valid = false;
      known[0] = known[n] = 0;
      vector<pair<long long, long long>> point(known.begin(), known.end());
      array<long long, 2> ways{0, 1};
      const long long impossible = numeric_limits<long long>::min() / 4;
      array<long long, 2> height{impossible, 0};
      for (size_t segment = 1; segment < point.size() && valid; ++segment) {
          const long long length = point[segment].first - point[segment - 1].first;
          const long long from = point[segment - 1].second;
          const long long to = point[segment].second;
          array<array<long long, 2>, 2> transition{};
          if (from < 0 || to < 0 || length < 0 || length < llabs(from - to) ||
              ((length + from + to) & 1LL) != 0) {
              valid = false;
              break;
          }
          if (length == to - from) {
              transition[0][0] = 1;
              if (from == 0) transition[1][0] = 1;
          } else if (length == from - to) {
              transition[0][1] = transition[1][1] = 1;
          } else {
              const long long spare = length - from - to;
              if (spare < 0) {
                  transition[0][1] = 1;
              } else if (spare == 0) {
                  transition[0][0] = transition[1][0] = transition[0][1] = 1;
              } else {
                  const long long from_up = power_two(spare / 2);
                  const long long from_down = power_two(spare / 2 - 1);
                  transition[0][0] = transition[0][1] = from_up;
                  transition[1][0] = transition[1][1] = from_down;
              }
          }
          array<long long, 2> next_ways{0, 0};
          array<long long, 2> next_height{impossible, impossible};
          for (int incoming = 0; incoming < 2; ++incoming)
              for (int outgoing = 0; outgoing < 2; ++outgoing)
                  if (ways[static_cast<size_t>(incoming)] != 0 &&
                      transition[static_cast<size_t>(incoming)][static_cast<size_t>(outgoing)] != 0) {
                      next_ways[static_cast<size_t>(outgoing)] =
                          (next_ways[static_cast<size_t>(outgoing)] +
                           ways[static_cast<size_t>(incoming)] *
                           transition[static_cast<size_t>(incoming)][static_cast<size_t>(outgoing)]) % mod;
                      const long long peak = interval_peak(length, from, to, incoming, outgoing);
                      if (peak != impossible)
                          next_height[static_cast<size_t>(outgoing)] =
                              max(next_height[static_cast<size_t>(outgoing)],
                                  max(height[static_cast<size_t>(incoming)], peak));
                  }
          ways = next_ways;
          height = next_height;
          if (to == 0) {
              ways[0] = 0;
              height[0] = impossible;
          }
      }
      if (!valid || ways[1] == 0) cout << "0 0\n";
      else cout << ways[1] << ' ' << height[1] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P3336
external_platform: 洛谷
external_problem_id: P3336
external_title: 话旧
external_relation: original
source_book_pages: [320]
source_pdf_pages: [338]
review_status: verified
---

端點方向使跨越正高度的轉彎限制可組合，長區間則以完整山峰的二次冪閉式壓縮。
