---
id: luogu-p9335
volume: lower
source_file: lower-volume
title: 洛谷 P9335 雪に咲く花：區間 AND、OR、GCD 價值和
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['掃描線', '按位與', '按位或', '最大公因數']
prerequisites: ['區間聚合', '離線詢問', '攤還分析']
statement: 給定三個長度 n 的正整數序列 a、b、c。區間 [l,r] 的價值為 AND(a_l..a_r)×OR(b_l..b_r)×gcd(c_l..c_r)。每次詢問 [l,r]，求完全位於其中的所有子區間價值總和，答案對 2^32 取模。
constraints:
  - '1 <= n <= 10^6'
  - '1 <= m <= 5*10^6'
  - '1 <= a_i,b_i,c_i <= n'
  - '1 <= l <= r <= n'
input_format: 第一行為 n、m；接著三行分別給 a、b、c；再接 m 行詢問 l、r。
output_format: 每個詢問輸出一行所有內含子區間的價值總和，對 2^32 取模。
samples:
  - input: |
      2 1
      3 3
      2 1
      4 5
      1 2
    output: |
      48
    explanation: 本站依已核實定義建立的最小範例。三個子區間價值依序為 3×2×4、3×1×5、3×3×1，總和為 48。
core_knowledge:
  - 固定右端點時，AND、OR、gcd 的不同狀態數皆為對數級
  - 新增右端點後可由相鄰左端狀態合成，穩定後立即停止
  - 時間戳可惰性累積每個價值前綴在多輪掃描中的貢獻
judgment: 將詢問掛到右端點並掃描。位置 j 原地保存 [j,r] 的三個聚合值，向左更新到三者都不變為止；物化受影響位置的惰性累積量並重建目前價值前綴，即可用兩個前綴查詢相減回答。
hints:
  - '區間 [j,r] 的三個狀態可由單點 j 與 [j+1,r] 分別做 AND、OR、gcd 得到。'
  - 若某 j 合成後三個值全都沒變，更左側再與它合成的結果也不會改變，可停止回掃。
  - 保存 add[x]、上次物化時間 nt[x] 與累積 val[x]；當前值是 val[x]+add[x]×(T-nt[x])。
solution_outline: 以鏈結串列把大量詢問掛在各右端。逐 r 更新左端狀態直到穩定，先結算此次改變位置的舊時間戳，再重建其價值前綴 add。時間加一後，以 query(r)-query(l-1) 回答。所有算術使用 uint32_t 自然溢位實作模 2^32。
proof_or_invariant: 第 r 輪後，位置 j 的三個狀態由結合律精確等於 [j,r] 的 AND、OR、gcd；穩定點左方不需更新。add[x] 是目前所有 j<=x、右端為 r 的價值和，而時間戳公式補上它未物化期間每輪對累積答案的同量貢獻。因此 query(r)-query(l-1) 恰計入 l<=j<=end<=r 的每個子區間一次。
complexity:
  time: O(n log n + m) 攤還
  space: O(n+m)
common_errors:
  - 誤用常見質數模數；本題是模 2^32
  - signed 32-bit 乘法溢位造成未定義行為
  - 聚合狀態穩定後仍掃到陣列開頭而退化
  - 忘記用右前綴減去 l-1 前綴
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：掃描右端、原地合成三種聚合狀態，並以時間戳累積價值前綴。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int query_count;
      cin >> n >> query_count;
      vector<uint32_t> values_and(static_cast<size_t>(n + 1));
      vector<uint32_t> values_or(static_cast<size_t>(n + 1));
      vector<uint32_t> values_gcd(static_cast<size_t>(n + 1));
      for (int i = 1; i <= n; ++i) {
          cin >> values_and[static_cast<size_t>(i)];
      }
      for (int i = 1; i <= n; ++i) {
          cin >> values_or[static_cast<size_t>(i)];
      }
      for (int i = 1; i <= n; ++i) {
          cin >> values_gcd[static_cast<size_t>(i)];
      }
      vector<int> head(static_cast<size_t>(n + 1), -1);
      vector<int> next(static_cast<size_t>(query_count), -1);
      vector<int> left_endpoint(static_cast<size_t>(query_count));
      for (int id = 0; id < query_count; ++id) {
          int left;
          int right;
          cin >> left >> right;
          left_endpoint[static_cast<size_t>(id)] = left;
          next[static_cast<size_t>(id)] = head[static_cast<size_t>(right)];
          head[static_cast<size_t>(right)] = id;
      }
      vector<uint32_t> value(static_cast<size_t>(n + 1), 0U);
      vector<uint32_t> add(static_cast<size_t>(n + 1), 0U);
      vector<uint32_t> last_time(static_cast<size_t>(n + 1), 0U);
      vector<uint32_t> answers(static_cast<size_t>(query_count));
      uint32_t time = 0U;
      const auto current = [&value, &add, &last_time, &time](int position) {
          const size_t index = static_cast<size_t>(position);
          return static_cast<uint32_t>(
              value[index] +
              add[index] * static_cast<uint32_t>(time - last_time[index]));
      };
      for (int right = 1; right <= n; ++right) {
          int stable = right - 1;
          while (stable > 0) {
              const size_t index = static_cast<size_t>(stable);
              const size_t following = static_cast<size_t>(stable + 1);
              const uint32_t new_and =
                  values_and[index] & values_and[following];
              const uint32_t new_or =
                  values_or[index] | values_or[following];
              const uint32_t new_gcd =
                  gcd(values_gcd[index], values_gcd[following]);
              if (new_and == values_and[index] &&
                  new_or == values_or[index] &&
                  new_gcd == values_gcd[index]) {
                  break;
              }
              values_and[index] = new_and;
              values_or[index] = new_or;
              values_gcd[index] = new_gcd;
              --stable;
          }
          value[static_cast<size_t>(right)] = current(right - 1);
          for (int position = stable + 1; position <= right; ++position) {
              const size_t index = static_cast<size_t>(position);
              value[index] = current(position);
              last_time[index] = time;
              const uint64_t product =
                  static_cast<uint64_t>(values_and[index]) *
                  static_cast<uint64_t>(values_or[index]) *
                  static_cast<uint64_t>(values_gcd[index]);
              add[index] = static_cast<uint32_t>(
                  add[index - 1U] + static_cast<uint32_t>(product));
          }
          ++time;
          for (int id = head[static_cast<size_t>(right)]; id != -1;
               id = next[static_cast<size_t>(id)]) {
              answers[static_cast<size_t>(id)] = static_cast<uint32_t>(
                  current(right) -
                  current(left_endpoint[static_cast<size_t>(id)] - 1));
          }
      }
      for (uint32_t answer : answers) { cout << answer << '\n'; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P9335
external_platform: 洛谷
external_problem_id: P9335
external_title: '[Ynoi2001] 雪に咲く花'
external_relation: original
source_book_pages: [558]
source_pdf_pages: [188]
review_status: verified
---

題意、限制、模數與官方 URL 已依洛谷題面核實；官方頁無公開範例，本站範例依定義獨立建立並以程式實跑核對。
