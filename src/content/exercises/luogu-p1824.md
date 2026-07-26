---
id: luogu-p1824
volume: upper
source_file: upper-volume
title: 洛谷 P1824 進擊的奶牛
chapter: 2
section: '2.3'
kind: external-oj
difficulty: 2
topics: ['答案二分', '貪心', '最大化最小值']
prerequisites: ['排序', '二分搜尋']
statement: 有 n 間位於數線不同位置的牛舍，要把 m 頭牛各放進一間牛舍。為避免牛互相攻擊，希望任意兩頭牛之間距離的最小值盡可能大。求這個最大最小距離。
constraints:
  - '2 ≤ n ≤ 100000'
  - '2 ≤ m ≤ n'
  - '0 ≤ x_i ≤ 1000000000'
  - '輸入牛舍位置不保證遞增'
input_format: 第一行輸入 n、m；接下來 n 行輸入各牛舍位置 x_i。
output_format: 輸出配置 m 頭牛後，最近兩頭牛距離可達到的最大值。
samples:
  - input: |
      5 3
      1
      2
      8
      4
      9
    output: |
      3
    explanation: 可將牛放在位置 1、4、8，最近距離為 3；不存在最近距離至少 4 的三舍配置。
core_knowledge:
  - '排序牛舍位置'
  - '固定距離時，貪心放置最多奶牛'
  - '二分最大可行最短距離'
judgment: '位置本身可排序，但答案不是某個固定相鄰差；以候選距離做單調判斷比枚舉牛舍組合有效。'
hints:
  - '若最小距離 d 能放下 m 頭牛，較小距離是否都能？'
  - '固定 d，第一頭放最左牛舍；每頭後續牛都放在距上一頭至少 d 的最左牛舍。'
  - '貪心放置數至少 m 即可行。對 0 到最右減最左的距離二分最後一個可行值。'
solution_outline: 先排序。is_feasible(d) 把第一頭牛放最左端，再由左至右遇到第一個距上一頭至少 d 的牛舍便放牛。若可放至少 m 頭則 d 可行。二分最大可行 d。
proof_or_invariant: '固定 d 時，貪心第 k 頭牛的位置不晚於任何可行配置第 k 頭的位置：第一頭取最左顯然成立；若第 k 頭成立，貪心為第 k+1 頭選擇第一個距離足夠的位置，也不晚於其他配置。故若貪心放不滿 m 頭，任何配置都不行；若放滿則構造出可行配置。可行性對 d 單調，二分結果即最優值。'
common_errors:
  - '未排序便依輸入順序放牛'
  - '檢查時只看原本相鄰牛舍，而非與上一個已選牛舍比較'
  - '要求放置數等於 m 才可行；多於 m 也表示可任取 m 頭'
  - '二分上界使用最大座標而未考慮最小座標，雖可運作但範圍不精確'
complexity:
  time: 'O(n log n + n log R)，R 為最右與最左牛舍距離'
  space: 'O(n)'
cpp_skeleton: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int stall_count = 0;
      int cow_count = 0;
      cin >> stall_count >> cow_count;
      vector<long long> stalls(static_cast<size_t>(stall_count));
      for (long long& position : stalls) { cin >> position; }
      sort(stalls.begin(), stalls.end());
      // TODO：二分距離，貪心檢查最多可放幾頭牛。
      (void)cow_count;
      cout << 0 << '\n';
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int stall_count = 0;
      int cow_count = 0;
      cin >> stall_count >> cow_count;
      vector<long long> stalls(static_cast<size_t>(stall_count));
      for (long long& position : stalls) { cin >> position; }
      sort(stalls.begin(), stalls.end());

      const auto is_feasible = [&](long long minimum_distance) {
          int placed = 1;
          long long last_position = stalls.front();
          for (size_t i = 1; i < stalls.size() && placed < cow_count; ++i) {
              if (stalls[i] - last_position >= minimum_distance) {
                  ++placed;
                  last_position = stalls[i];
              }
          }
          return placed >= cow_count;
      };

      long long low = 0;
      long long high = stalls.back() - stalls.front() + 1;
      while (low + 1 < high) {
          const long long middle = low + (high - low) / 2;
          if (is_feasible(middle)) {
              low = middle;
          } else {
              high = middle;
          }
      }
      cout << low << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1824
external_platform: 洛谷
external_problem_id: P1824
external_title: '[USACO05FEB] 进击的奶牛 Aggressive Cows G'
external_relation: original
source_book_pages: [43]
source_pdf_pages: [61]
review_status: verified
---

「把下一頭牛放在最早可行位置」會為後面的牛保留最多空間。
