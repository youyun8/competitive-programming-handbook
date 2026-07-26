---
id: luogu-p1091
volume: upper
source_file: upper-volume
title: 洛谷 P1091 合唱隊形
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 2
topics: [dynamic-programming, longest-increasing-subsequence]
prerequisites: [dynamic-programming]
statement: >-
  n 位同學依原順序站成一排，可讓若干人出列。留下者身高必先嚴格遞增、再嚴格遞減，
  峰頂可在任一位置。求最少需要出列的人數。
constraints:
  - 2 <= n <= 100
  - 130 <= height_i <= 230
input_format: 第一行為 n，第二行為 n 位同學依序的身高。
output_format: 輸出最少出列人數。
samples:
  - input: |-
      8
      186 186 150 200 160 130 197 220
    output: '4'
    explanation: 最長合法合唱隊形可保留四人，因此八人中最少移除四人。
core_knowledge: [最長遞增子序列, 雙向 DP, 山峰子序列]
judgment: 兩側皆為嚴格不等；原相對順序不能改變，只能刪人。
hints:
  - 固定某位同學作峰頂，左右兩側可以分開最佳化。
  - 計算每個位置結尾的最長嚴格遞增子序列，以及每個位置開始向右的最長嚴格遞減子序列。
  - 峰頂 i 可保留 left[i]+right[i]-1 人，答案是 n 減其最大值。
solution_outline: 以 O(n^2) 分別由左、由右計算兩個 LIS 長度，枚舉峰頂合併。
proof_or_invariant: >-
  任一合法隊形有唯一選定峰頂，其左段是以峰頂結尾的嚴格遞增子序列，右段是以峰頂開始的嚴格
  遞減子序列，故人數不超過兩個 DP 最佳值之和減一。反之把這兩段最佳子序列在共同峰頂拼接，
  必形成合法隊形並達到該值。枚舉所有峰頂後所得最大保留數正確，n 減之即最少移除數。
common_errors: [把嚴格比較寫成大於等於, 合併時把峰頂計算兩次, 右側 DP 的迴圈方向錯誤]
complexity:
  time: O(n^2)
  space: O(n)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      // TODO：計算每個峰頂左右兩側的最長合法子序列。
      cout << n << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      vector<int> height(static_cast<size_t>(n));
      vector<int> left(static_cast<size_t>(n), 1);
      vector<int> right(static_cast<size_t>(n), 1);
      for (int& value : height) cin >> value;
      for (int i = 0; i < n; ++i)
          for (int j = 0; j < i; ++j)
              if (height[static_cast<size_t>(j)] < height[static_cast<size_t>(i)])
                  left[static_cast<size_t>(i)] =
                      max(left[static_cast<size_t>(i)], left[static_cast<size_t>(j)] + 1);
      for (int i = n - 1; i >= 0; --i)
          for (int j = n - 1; j > i; --j)
              if (height[static_cast<size_t>(j)] < height[static_cast<size_t>(i)])
                  right[static_cast<size_t>(i)] =
                      max(right[static_cast<size_t>(i)], right[static_cast<size_t>(j)] + 1);
      int keep = 0;
      for (int i = 0; i < n; ++i)
          keep = max(keep, left[static_cast<size_t>(i)] + right[static_cast<size_t>(i)] - 1);
      cout << n - keep << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1091
external_platform: 洛谷
external_problem_id: P1091
external_title: 合唱队形
external_relation: original
source_book_pages: [332]
source_pdf_pages: [350]
review_status: verified
---

固定峰頂後，山形子序列就分解成左右兩個方向相反的最長遞增子序列問題。
