---
id: luogu-p8421
volume: lower
source_file: lower-volume
title: 洛谷 P8421 rsraogps：三種區間聚合值之和
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['掃描線', '按位與', '按位或', '最大公因數']
prerequisites: ['區間聚合', '離線詢問', '攤還分析']
statement: 給定三個長度 n 的正整數序列 a、b、c。區間 [l,r] 的價值定義為 AND(a_l..a_r)×OR(b_l..b_r)×gcd(c_l..c_r)。每次詢問 [l,r]，求完全位於其中的所有子區間價值總和，答案對 2^32 取模。
constraints:
  - '1 <= n <= 10^6'
  - '1 <= m <= 5*10^6'
  - '1 <= a_i,b_i,c_i <= n'
  - '1 <= l <= r <= n'
input_format: 第一行為 n、m；接著三行分別給 a、b、c；再接 m 行詢問 l、r。
output_format: 每個詢問輸出一行所有內含子區間的價值總和，對 2^32 取模。
samples:
  - input: |
      5 3
      3 3 1 1 1
      2 1 3 2 2
      4 5 3 4 4
      1 2
      2 5
      4 5
    output: |
      48
      63
      24
    explanation: 例如 [1,2] 的三個子區間價值為 3×2×4、3×1×5、3×3×1，總和 48；其餘詢問同樣累加全部內含子區間。
core_knowledge:
  - 固定右端點時，AND 只會清除位元、OR 只會加入位元、gcd 只會變成真因數
  - 三種值沿左端點移動的不同狀態總數皆為對數級
  - 把詢問按右端點離線，可維護「所有右端不超過目前位置」的前綴貢獻
judgment: 逐右端點掃描，原地保存每個左端點至目前右端的三個聚合值。從新單點向左合併，直到三個值都不再改變；總改變次數攤還 O(n log n)。對受影響的前綴貢獻做惰性時間戳結算，即可 O(1) 回答掛在目前右端的詢問。
hints:
  - 新增右端 i 時，令位置 j 保存 [j,i] 的 AND、OR、gcd；若 j 合併 j+1 後三者全不變，更左位置也無須繼續更新。
  - 令 add[x] 為目前所有左端不超過 x 的區間價值前綴和；每前進一個右端，它會再加到累積答案一次。
  - 用 val[x] 保存 add[x] 上次物化時的累積值、nt[x] 保存時間；查詢當前值為 val[x]+add[x]×(T-nt[x])，只物化此次真正改變的 O(log n) 個位置。
solution_outline: 將詢問以鏈結串列掛到右端 r。掃描 i 時，把新單點狀態放在 i，向左以相鄰狀態更新 AND、OR、gcd，遇到完全不變即停止。先物化受影響位置的舊惰性貢獻，再重建其 add 前綴值與時間戳。時間前進後，詢問 [l,i] 的答案為 query(i)-query(l-1)。全部數值用 uint32_t 自然溢位實現模 2^32。
proof_or_invariant: 第 i 輪更新後，位置 j 的三個狀態分別等於區間 [j,i] 的 AND、OR、gcd，因為它由單點 j 與已正確的 [j+1,i] 以相應結合運算合成。若三者均未改變，左側再與此狀態合成的結果也不變，故停止安全。add[x] 是所有 j<=x 的 [j,i] 價值和；每完成一輪，它對「右端至多 i」的累積量貢獻一次。時間戳公式精確補上未物化輪數，因此 query(i)-query(l-1) 恰保留左端 j>=l、右端不超過 i 的所有子區間，也就是詢問答案。
complexity:
  time: O(n log n + m) 攤還
  space: O(n+m)
common_errors:
  - 把答案模數寫成 998244353；本題要求模 2^32
  - 乘積先存 32-bit signed integer而觸發未定義溢位
  - 狀態已穩定後仍一路更新到左端，退化成 O(n²)
  - 詢問直接取 query(r)，忘記減去 query(l-1)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：按右端掃描三種聚合狀態，以時間戳惰性維護價值前綴。
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
      vector<int> query_left(static_cast<size_t>(query_count));
      for (int id = 0; id < query_count; ++id) {
          int left;
          int right;
          cin >> left >> right;
          query_left[static_cast<size_t>(id)] = left;
          next[static_cast<size_t>(id)] =
              head[static_cast<size_t>(right)];
          head[static_cast<size_t>(right)] = id;
      }

      vector<uint32_t> materialized(static_cast<size_t>(n + 1), 0U);
      vector<uint32_t> current_prefix(static_cast<size_t>(n + 1), 0U);
      vector<uint32_t> timestamp(static_cast<size_t>(n + 1), 0U);
      vector<uint32_t> answers(static_cast<size_t>(query_count));
      uint32_t time = 0U;
      const auto query = [&materialized, &current_prefix, &timestamp,
                          &time](int position) {
          const size_t index = static_cast<size_t>(position);
          return static_cast<uint32_t>(
              materialized[index] +
              current_prefix[index] *
                  static_cast<uint32_t>(time - timestamp[index]));
      };

      for (int right = 1; right <= n; ++right) {
          int stable = right - 1;
          while (stable > 0) {
              const size_t index = static_cast<size_t>(stable);
              const size_t next_index = static_cast<size_t>(stable + 1);
              const uint32_t next_and =
                  values_and[index] & values_and[next_index];
              const uint32_t next_or =
                  values_or[index] | values_or[next_index];
              const uint32_t next_gcd =
                  gcd(values_gcd[index], values_gcd[next_index]);
              if (next_and == values_and[index] &&
                  next_or == values_or[index] &&
                  next_gcd == values_gcd[index]) {
                  break;
              }
              values_and[index] = next_and;
              values_or[index] = next_or;
              values_gcd[index] = next_gcd;
              --stable;
          }
          materialized[static_cast<size_t>(right)] = query(right - 1);
          for (int position = stable + 1; position <= right; ++position) {
              const size_t index = static_cast<size_t>(position);
              materialized[index] = query(position);
              timestamp[index] = time;
              const uint64_t product =
                  static_cast<uint64_t>(values_and[index]) *
                  static_cast<uint64_t>(values_or[index]) *
                  static_cast<uint64_t>(values_gcd[index]);
              current_prefix[index] = static_cast<uint32_t>(
                  current_prefix[index - 1U] +
                  static_cast<uint32_t>(product));
          }
          ++time;
          for (int id = head[static_cast<size_t>(right)]; id != -1;
               id = next[static_cast<size_t>(id)]) {
              answers[static_cast<size_t>(id)] = static_cast<uint32_t>(
                  query(right) -
                  query(query_left[static_cast<size_t>(id)] - 1));
          }
      }
      for (uint32_t answer : answers) { cout << answer << '\n'; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P8421
external_platform: 洛谷
external_problem_id: P8421
external_title: '[THUPC 2022 決賽] rsraogps'
external_relation: original
source_book_pages: [564]
source_pdf_pages: [194]
review_status: verified
---

題面、限制、模數、官方 URL 與範例已依洛谷題面核實；繁中敘述、證明與程式為本站獨立撰寫。
