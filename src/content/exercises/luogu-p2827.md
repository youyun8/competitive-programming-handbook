---
id: luogu-p2827
volume: upper
source_file: upper-volume
title: 洛谷 P2827 蚯蚓：三個單調佇列
chapter: 1
section: '1.5'
kind: external-oj
difficulty: 4
topics: ['優先佇列', '單調佇列', '全域偏移量', '模擬']
prerequisites: ['heap', 'queue', 'sorting']
statement: |-
  初始有 n 條長度非負的蚯蚓。連續 m 秒中，每秒選目前最長者（並列時任選）切成 floor(x·u/v) 與其餘長度兩段；同一秒內，其他既有蚯蚓各增長 q，新產生的兩段不增長。第一階段要依時間輸出每逢第 t 秒被切蚯蚓的切前長度。m 秒後，再把所有蚯蚓按長度遞減排列，輸出排名為 t、2t、3t……者。
constraints:
  - '1 ≤ n ≤ 10^5，0 ≤ m ≤ 7 × 10^6'
  - '0 ≤ q ≤ 200，0 < u < v ≤ 10^9，1 ≤ t ≤ 71'
  - '0 ≤ a_i ≤ 10^8'
input_format: '第一行為 n、m、q、u、v、t；第二行為 n 條蚯蚓的初始長度。'
output_format: '第一行輸出第 t、2t……秒被切者的切前長度；第二行輸出 m 秒後第 t、2t……大的長度。某行沒有數值時仍須輸出空行。'
samples:
  - input: |
      3 7 1 1 3 2
      3 3 2
    output: |
      4 4 5
      6 5 4 3 2
    explanation: |-
      只輸出第 2、4、6 秒切下前的長度，所以第一行為 4、4、5。七秒後共有十條，按遞減次序只輸出第 2、4、6、8、10 名，得到第二行。此範例已與洛谷題面核對。
core_knowledge:
  - '以共同偏移量消除對所有元素加 q 的批次更新'
  - '初始序列與兩類切割結果各自形成非遞增佇列'
  - '每次比較三個隊首即可取得全域最大值'
judgment: 'm 可達七百萬，O(m log m) 的堆積模擬仍可能超時；需進一步利用兩種切割結果各自保持單調的性質，把每步降到 O(1)。'
hints:
  - '先不要真的替所有未切蚯蚓加 q；記錄經過秒數，取出時再補上共同增量。'
  - '把初始長度降序排列。觀察每次被選中的調整後長度，以及由它切出的第一段、第二段，各自會以什麼順序出現。'
  - '維護三條非遞增佇列：初始值、第一段、第二段。每步取三個隊首最大者，加回偏移後切割，再把兩段減去新時間偏移後分別入隊。'
solution_outline: |-
  將初始長度降序存為第一條佇列，另備兩條佇列存兩種切割結果。第 i 秒開始時，所有存值加上 (i-1)q 才是真實長度；從三個隊首取最大存值並還原。切成兩段後，因新段在該秒不增長，分別減去 iq 再放入後兩條佇列。完成 m 步後，反覆用相同方式取三隊最大值並加回 mq，即得到最終降序排列。
proof_or_invariant: |-
  不變量是：第 i 秒開始前，每條尚存蚯蚓的真實長度等於其佇列存值加 (i-1)q，且三條佇列都按存值非遞增。共同增長不改變大小順序，因此最大值必在三個隊首。若本秒切出 y、x-y，存入 y-iq 與 x-y-iq，下一秒加回 iq 後恰為未增長的新段；其他元素因偏移由 (i-1)q 變 iq，恰好多 q。

  還需證明新段的兩條佇列保持單調。設相鄰兩秒取出的真實最大值為 x_i、x_(i+1)。第 i 秒留下的舊元素到下一秒至多變成 x_i+q，而兩個新段都不超過 x_i，所以 x_(i+1) <= x_i+q。兩個切割函數 f(x)=floor(xu/v) 與 g(x)=x-f(x) 都單調且滿足 f(x+q)<=f(x)+q、g(x+q)<=g(x)+q。因此 f(x_(i+1))-(i+1)q <= f(x_i)-iq，g 亦同，兩類新段的存值各自非遞增。不變量遂持續成立，每次取出的都是當下全域最大值。
common_errors:
  - '讓剛切出的兩段也在同一秒增加 q，造成一秒的偏移誤差'
  - '使用浮點數計算 floor(x·u/v)；應先用 long long 相乘再做整數除法'
  - '以 priority_queue 做 m 次 O(log m) 操作，無法利用本題要求的線性模擬'
  - '第一行沒有輸出項目時漏掉換行'
complexity:
  time: 'O(n log n + m + n)，其中排序為 O(n log n)，模擬與最終輸出掃描為 O(n+m)'
  space: 'O(n+m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int m;
      long long q;
      long long u;
      long long v;
      int t;
      if (!(cin >> n >> m >> q >> u >> v >> t)) { return 0; }
      vector<int> initial(static_cast<size_t>(n));
      for (int& length : initial) { cin >> length; }
      sort(initial.begin(), initial.end(), greater<int>());

      // TODO：建立兩條切割結果佇列及三個隊首索引。
      // 第 i 秒取三個隊首的最大存值，加回 (i-1)*q。
      // 兩個新段要減去 i*q 後，才分別放入結果佇列。
      cout << '\n' << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  long long take_largest(
      const vector<int>& initial,
      const vector<int>& first_parts,
      const vector<int>& second_parts,
      size_t& initial_head,
      size_t& first_head,
      size_t& second_head
  ) {
      long long best = numeric_limits<long long>::min();
      int source = -1;
      if (initial_head < initial.size() && initial[initial_head] > best) {
          best = initial[initial_head];
          source = 0;
      }
      if (first_head < first_parts.size() && first_parts[first_head] > best) {
          best = first_parts[first_head];
          source = 1;
      }
      if (second_head < second_parts.size() && second_parts[second_head] > best) {
          best = second_parts[second_head];
          source = 2;
      }
      if (source == 0) {
          ++initial_head;
      } else if (source == 1) {
          ++first_head;
      } else {
          ++second_head;
      }
      return best;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int m;
      long long q;
      long long u;
      long long v;
      int t;
      if (!(cin >> n >> m >> q >> u >> v >> t)) { return 0; }

      vector<int> initial(static_cast<size_t>(n));
      for (int& length : initial) { cin >> length; }
      sort(initial.begin(), initial.end(), greater<int>());
      vector<int> first_parts;
      vector<int> second_parts;
      first_parts.reserve(static_cast<size_t>(m));
      second_parts.reserve(static_cast<size_t>(m));
      size_t initial_head = 0;
      size_t first_head = 0;
      size_t second_head = 0;

      bool printed = false;
      for (int second = 1; second <= m; ++second) {
          long long stored = take_largest(
              initial, first_parts, second_parts,
              initial_head, first_head, second_head
          );
          long long length = stored + static_cast<long long>(second - 1) * q;
          if (second % t == 0) {
              if (printed) { cout << ' '; }
              cout << length;
              printed = true;
          }

          long long first_length = length * u / v;
          long long second_length = length - first_length;
          long long offset = static_cast<long long>(second) * q;
          first_parts.push_back(static_cast<int>(first_length - offset));
          second_parts.push_back(static_cast<int>(second_length - offset));
      }
      cout << '\n';

      printed = false;
      int total = n + m;
      for (int rank = 1; rank <= total; ++rank) {
          long long stored = take_largest(
              initial, first_parts, second_parts,
              initial_head, first_head, second_head
          );
          long long length = stored + static_cast<long long>(m) * q;
          if (rank % t == 0) {
              if (printed) { cout << ' '; }
              cout << length;
              printed = true;
          }
      }
      cout << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2827
external_platform: 洛谷
external_problem_id: P2827
external_title: '[NOIP 2016 提高组] 蚯蚓'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

本題雖放在堆積章節，完整資料要求辨認出更強的單調性；三個隊首的常數時間比較才是關鍵。
