---
id: luogu-p1450
volume: lower
source_file: lower-volume
title: 洛谷 P1450 四種硬幣的有界付款
chapter: 7
section: '7.5'
kind: external-oj
difficulty: 3
topics: [inclusion-exclusion, complete-knapsack, bounded-counting]
prerequisites: [inclusion-exclusion, dynamic-programming]
statement: >-
  固定四種硬幣面值。每次詢問給出四種硬幣各自可用的枚數上限與目標金額，
  求不超過各上限且總額恰為目標的付款方法數。
constraints:
  - 1 <= c_i,d_i,s <= 100000
  - 1 <= query_count <= 1000
input_format: 第一行為 c_1..c_4 與詢問數；每組詢問一行 d_1..d_4、s。
output_format: 每組輸出一行付款方法數。
samples:
  - input: |
      1 2 5 10 1
      2 2 0 0 4
    output: '2'
    explanation: 1 元與 2 元硬幣都至多使用兩枚；合法組合為 2+2 與 1+1+2。
core_knowledge:
  - 先預處理不限制枚數的四種硬幣完全背包
  - 以容斥強制至少一種硬幣超過上限，再平移目標金額
judgment: 同面值硬幣不可區分，只比較四種硬幣各使用幾枚。
hints:
  - 令 ways[x] 為四種硬幣不限數量時湊出 x 的方法數。
  - 若第 i 種超限，先固定使用 d_i+1 枚，剩餘金額減去 (d_i+1)c_i。
  - 枚舉四種硬幣的 16 個子集；子集大小奇數減、偶數加對應 ways。
solution_outline: 完全背包預處理 ways[0..100000]；每組枚舉 mask，計算平移後目標並依位數奇偶容斥。
proof_or_invariant: >-
  不限量方案是全集。事件 E_i 表示第 i 種至少使用 d_i+1 枚；固定拿走這些硬幣後，
  E_i 交集的方案與平移後的不限量方案雙射。對四個事件套用容斥，留下恰好沒有任何超限的方案。
common_errors:
  - 平移時使用 d_i 枚而非 d_i+1 枚
  - 完全背包把金額倒序更新，誤成每種只能用一次
  - 平移後目標為負仍存取 ways
complexity:
  time: O(4S + 16Q)
  space: O(S)
cpp_skeleton: |
  #include <array>
  #include <iostream>
  using namespace std;
  int main() {
      array<int, 4> coin{};
      int query_count;
      cin >> coin[0] >> coin[1] >> coin[2] >> coin[3] >> query_count;
      // TODO：完全背包預處理，再對每組詢問做 16 項容斥。
      (void)query_count;
      return 0;
  }
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      array<int, 4> coin{};
      int query_count;
      cin >> coin[0] >> coin[1] >> coin[2] >> coin[3] >> query_count;
      constexpr int limit = 100000;
      vector<long long> ways(static_cast<size_t>(limit) + 1U);
      ways[0] = 1;
      for (int value : coin) {
          for (int sum = value; sum <= limit; ++sum) {
              ways[static_cast<size_t>(sum)] += ways[static_cast<size_t>(sum - value)];
          }
      }
      while (query_count-- > 0) {
          array<int, 4> upper{};
          int target;
          cin >> upper[0] >> upper[1] >> upper[2] >> upper[3] >> target;
          long long answer = 0;
          for (int mask = 0; mask < 16; ++mask) {
              int remaining = target;
              int selected = 0;
              for (int type = 0; type < 4; ++type) {
                  if ((mask & (1 << type)) == 0) { continue; }
                  remaining -= (upper[static_cast<size_t>(type)] + 1) * coin[static_cast<size_t>(type)];
                  ++selected;
              }
              if (remaining < 0) { continue; }
              if ((selected & 1) == 0) {
                  answer += ways[static_cast<size_t>(remaining)];
              } else {
                  answer -= ways[static_cast<size_t>(remaining)];
              }
          }
          cout << answer << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1450
external_platform: 洛谷
external_problem_id: P1450
external_title: '[HAOI2008] 硬幣購物'
external_relation: original
source_book_pages: [481, 485]
source_pdf_pages: [111, 115]
review_status: verified
---

固定只有四種限制，使「不限量背包加 16 項容斥」比每次重做有界背包更有效率。
