---
id: luogu-p3286
volume: upper
source_file: upper-volume
title: 洛谷 P3286 方伯伯的商場之旅
chapter: 5
section: '5.3'
kind: external-oj
difficulty: 5
topics: [digit-dp, weighted-median, convexity]
prerequisites: [digit-dp, prefix-difference]
statement: >-
  對每個整數 x，把其 K 進位第 j 位數字視為第 j 堆石子的數量。可在堆間搬石子，每顆從位置
  i 搬到位置 j 的成本為 |i-j|。求區間 [L,R] 中每個 x 各自合併成一堆的最小成本總和。
constraints:
  - 1 <= L <= R <= 10^15
  - 2 <= K <= 20
input_format: 一行 L、R、K。
output_format: 輸出區間內最小成本總和。
samples:
  - input: '3 8 3'
    output: '5'
    explanation: 逐一把 3 到 8 寫成三進位並把各位石子搬到其加權中位數位置，成本總和為 5。
core_knowledge: [加權中位數, 凸成本差分, 數位 DP]
judgment: 每個數獨立選擇最終合併位置；高位前導零不影響答案。
hints:
  - 固定一個數時，把全部石子搬到某位的成本是加權絕對距離和，最優位置為加權中位數。
  - 從位置 t-1 把終點移到 t，成本變化為左側石子數減右側石子數；這個差值單調不減。
  - 先統計全部搬到最低位的成本，再對每個邊界用數位 DP 累計負的成本變化。
solution_outline: 計算 F(N) 為 0..N 的答案；數位 DP 先加總最低位成本，再逐邊界統計 max(右側數量-左側數量,0) 並扣除，最後輸出 F(R)-F(L-1)。
proof_or_invariant: >-
  固定數字時，終點由 0 向高位移動的成本差 delta_t=left-right，且 delta_t 隨 t 單調增加，
  所以最低成本等於 cost_0 加上所有負 delta_t。對邊界 t，right-left 完全是各數位的帶正負
  線性和；數位 DP 精確枚舉 0..N 並按此和聚合，累計其正部即 -min(delta_t,0)。
  因此 F(N) 對每個數都加入且只加入其最小成本，前綴相減得到區間答案。
common_errors: [把石子總數中位數誤當位數中點, 對每個數固定同一合併位置, 漏掉成本差只取負部]
complexity:
  time: O(d^3 K^2)，d 為 R 的 K 進位位數且不超過 50
  space: O(dK)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { long long left = 0, right = 0; int base = 0; cin >> left >> right >> base; /* TODO：數位 DP。 */ }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <vector>
  using namespace std;
  long long prefix_cost(long long limit, int base) {
      if (limit < 0) return 0;
      vector<int> digit;
      long long value = limit;
      do {
          digit.push_back(static_cast<int>(value % base));
          value /= base;
      } while (value != 0);
      const int positions = static_cast<int>(digit.size());
      array<long long, 2> count{0, 1};
      array<long long, 2> cost{0, 0};
      for (int position = positions - 1; position >= 0; --position) {
          array<long long, 2> next_count{0, 0};
          array<long long, 2> next_cost{0, 0};
          for (int tight = 0; tight <= 1; ++tight)
              for (int chosen = 0; chosen <= (tight != 0 ? digit[static_cast<size_t>(position)] : base - 1); ++chosen) {
                  const int next_tight = tight != 0 && chosen == digit[static_cast<size_t>(position)];
                  next_count[static_cast<size_t>(next_tight)] += count[static_cast<size_t>(tight)];
                  next_cost[static_cast<size_t>(next_tight)] +=
                      cost[static_cast<size_t>(tight)] +
                      count[static_cast<size_t>(tight)] * chosen * position;
              }
          count = next_count;
          cost = next_cost;
      }
      long long answer = cost[0] + cost[1];
      const int range = positions * (base - 1);
      const int width = range * 2 + 1;
      for (int boundary = 1; boundary < positions; ++boundary) {
          vector<array<long long, 2>> ways(static_cast<size_t>(width), {0, 0});
          ways[static_cast<size_t>(range)][1] = 1;
          for (int position = positions - 1; position >= 0; --position) {
              vector<array<long long, 2>> next(static_cast<size_t>(width), {0, 0});
              const int sign = position >= boundary ? 1 : -1;
              for (int balance = -range; balance <= range; ++balance)
                  for (int tight = 0; tight <= 1; ++tight) {
                      const long long current = ways[static_cast<size_t>(balance + range)]
                                                    [static_cast<size_t>(tight)];
                      if (current == 0) continue;
                      const int upper = tight != 0 ? digit[static_cast<size_t>(position)] : base - 1;
                      for (int chosen = 0; chosen <= upper; ++chosen) {
                          const int next_balance = balance + sign * chosen;
                          const int next_tight = tight != 0 && chosen == upper;
                          next[static_cast<size_t>(next_balance + range)]
                              [static_cast<size_t>(next_tight)] += current;
                      }
                  }
              ways.swap(next);
          }
          for (int balance = 1; balance <= range; ++balance)
              answer -= static_cast<long long>(balance) *
                        (ways[static_cast<size_t>(balance + range)][0] +
                         ways[static_cast<size_t>(balance + range)][1]);
      }
      return answer;
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      long long left = 0, right = 0; int base = 0;
      cin >> left >> right >> base;
      cout << prefix_cost(right, base) - prefix_cost(left - 1, base) << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P3286
external_platform: 洛谷
external_problem_id: P3286
external_title: 方伯伯的商场之旅
external_relation: original
source_book_pages: [340]
source_pdf_pages: [358]
review_status: verified
---

加權中位數的凸性把每個數的最小值化成若干可由數位 DP 聚合的線性差值。
