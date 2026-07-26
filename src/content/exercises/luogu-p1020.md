---
id: luogu-p1020
volume: upper
source_file: upper-volume
title: 洛谷 P1020 導彈攔截
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 3
topics: [longest-increasing-subsequence, greedy, binary-search]
prerequisites: [binary-search]
statement: >-
  導彈依序飛來，每套系統第一次可攔任意高度，之後只能攔截不高於前一次的導彈。
  求一套系統最多可攔幾枚，以及攔下全部導彈最少需要幾套系統。
constraints:
  - 導彈數不超過 100000
  - 每個高度為不超過 50000 的正整數
input_format: 一行若干個整數，依序為導彈高度，讀到 EOF。
output_format: 第一行輸出一套最多攔截數；第二行輸出攔截全部所需最少系統數。
samples:
  - input: '389 207 155 300 299 170 158 65'
    output: |-
      6
      2
    explanation: 一套可攔 389、300、299、170、158、65 共六枚；全部導彈至少且可以用兩套攔下。
core_knowledge: [最長非遞增子序列, Dilworth 對偶, patience-sorting]
judgment: 同高度可以由同一套系統連續攔截，因此第一問是非嚴格遞減；第二問對應嚴格遞增長度。
hints:
  - 第一問是原序列的最長非遞增子序列。
  - 對高度取負後，第一問變成最長非遞減子序列，應使用 upper_bound 維護尾值。
  - 最少非遞增序列覆蓋數等於最長嚴格遞增子序列長度，使用 lower_bound。
solution_outline: 同時維護負高度的 LNDS 尾值陣列與原高度的 LIS 尾值陣列，輸出兩者長度。
proof_or_invariant: >-
  patience sorting 的尾值陣列在長度固定時保存最小末值；upper_bound 允許相等值延長，故在負高度上
  得到最長非遞減、即原高度最長非遞增長度。對第二問，任何嚴格遞增子序列的相鄰元素不能放進同一
  非遞增系統，故系統數至少是 LIS 長度；貪心把每枚導彈放入末高度最小但仍不低於它的系統，可用
  恰好 LIS 長度完成分割，因此此下界可達。
common_errors: [第一問誤用 lower_bound 而排除相等高度, 第二問也求非嚴格 LIS, 假設輸入先給 n]
complexity:
  time: O(n log n)
  space: O(n)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int height = 0;
      while (cin >> height) { (void)height; }
      // TODO：分別維護 LNIS 與 LIS 的最小尾值。
      cout << "0\n0\n";
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      vector<int> nondecreasing_negative;
      vector<int> increasing;
      int height = 0;
      while (cin >> height) {
          const int negative = -height;
          const auto first = upper_bound(nondecreasing_negative.begin(),
                                         nondecreasing_negative.end(), negative);
          if (first == nondecreasing_negative.end()) nondecreasing_negative.push_back(negative);
          else *first = negative;
          const auto second = lower_bound(increasing.begin(), increasing.end(), height);
          if (second == increasing.end()) increasing.push_back(height);
          else *second = height;
      }
      cout << nondecreasing_negative.size() << '\n' << increasing.size() << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1020
external_platform: 洛谷
external_problem_id: P1020
external_title: 导弹拦截
external_relation: original
source_book_pages: [332]
source_pdf_pages: [350]
review_status: verified
---

兩問的嚴格性不同：相等高度能延長單套攔截序列，卻不會增加覆蓋所需套數。
