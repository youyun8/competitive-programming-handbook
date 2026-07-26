---
id: luogu-p1102
volume: upper
source_file: upper-volume
title: 洛谷 P1102 A-B 數對
chapter: 2
section: '2.2'
kind: external-oj
difficulty: 2
topics: ['排序', '雙指標', '計數']
prerequisites: ['排序', '64 位元整數']
statement: 給定 N 個正整數與正整數 C，計算有多少組有序位置對 (i,j) 滿足 a_i-a_j=C。不同位置即視為不同數對，即使兩位置的值相同亦然。
constraints:
  - '1 ≤ N ≤ 200000'
  - '0 ≤ a_i < 2^30'
  - '1 ≤ C < 2^30'
input_format: 第一行輸入 N、C；第二行輸入 N 個正整數 a_i。
output_format: 輸出一個整數，表示滿足差為 C 的有序位置對數量。
samples:
  - input: |
      4 1
      1 1 2 3
    output: |
      3
    explanation: 值為 2 的位置可分別搭配兩個值為 1 的位置，值為 3 的位置可搭配值為 2 的位置，共 3 對。
core_knowledge:
  - '排序後以兩個單調指標尋找固定差'
  - '相同值要以兩側出現次數相乘'
judgment: '答案計算的是位置對，不能把重複值去除；最壞可能有 O(N^2) 對，答案須使用 64 位元整數。'
hints:
  - '排序後，若兩個值的差太小或太大，哪一個指標應向右？'
  - '讓 left、right 各指向一個值並比較 values[right]-values[left] 與 C；兩指標都只前進。'
  - '差恰為 C 時，分別數出 left 值與 right 值的連續出現次數，將兩數相乘加入答案，再一起越過這兩組。'
solution_outline: 先排序。維護 left 與 right，並保持 right 不落後於 left。差小於 C 時增加 right，差大於 C 時增加 left。相等時統計兩端當前值各有幾個連續副本，將 count_left×count_right 加入答案，兩指標分別跳過整組。
proof_or_invariant: '排序後固定 left 時，差值隨 right 增加而不減；固定 right 時，差值隨 left 增加而不增。因此差太小只可能增加 right，差太大只可能增加 left，不會跳過可行值。差恰為 C>0 時兩端值不同，兩個相同值群組間的笛卡兒積恰好包含所有以這兩值組成的位置對，共為兩群大小乘積；跳過群組後不會遺漏或重算。'
common_errors:
  - '用 set 去重後只計算不同值組合，漏掉重複位置'
  - '差相等時只加一，未乘上兩側頻率'
  - '答案使用 int 而溢位'
  - '未排序便嘗試移動雙指標'
complexity:
  time: 'O(N log N)：排序為主，雙指標掃描為 O(N)'
  space: 'O(N)：儲存輸入；排序本身的額外空間依實作而定'
cpp_skeleton: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n = 0;
      long long difference = 0;
      cin >> n >> difference;
      vector<long long> values(static_cast<size_t>(n));
      for (long long& value : values) { cin >> value; }
      sort(values.begin(), values.end());
      long long answer = 0;
      // TODO：以雙指標尋找差為 difference 的兩個值群組並累加頻率乘積。
      cout << answer << '\n';
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
      int n = 0;
      long long difference = 0;
      cin >> n >> difference;
      vector<long long> values(static_cast<size_t>(n));
      for (long long& value : values) { cin >> value; }
      sort(values.begin(), values.end());

      size_t left = 0;
      size_t right = 0;
      long long answer = 0;
      while (left < values.size() && right < values.size()) {
          if (right <= left) {
              right = left + 1U;
              continue;
          }
          const long long current_difference = values[right] - values[left];
          if (current_difference < difference) {
              ++right;
          } else if (current_difference > difference) {
              ++left;
          } else {
              const long long left_value = values[left];
              const long long right_value = values[right];
              long long left_count = 0;
              long long right_count = 0;
              while (left < values.size() && values[left] == left_value) {
                  ++left_count;
                  ++left;
              }
              while (right < values.size() && values[right] == right_value) {
                  ++right_count;
                  ++right;
              }
              answer += left_count * right_count;
          }
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1102
external_platform: 洛谷
external_problem_id: P1102
external_title: A-B 数对
external_relation: original
source_book_pages: [42]
source_pdf_pages: [60]
review_status: verified
---

排序後同值成群，雙指標不僅找值，也必須正確計算位置的多重性。
