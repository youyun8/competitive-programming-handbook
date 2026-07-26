---
id: luogu-p3210
volume: lower
source_file: lower-volume
title: 洛谷 P3210 相鄰已空堆取石
chapter: 7
section: '7.9'
kind: external-oj
difficulty: 8
topics: [game-theory, greedy, stack]
prerequisites: [combinatorial-game-theory]
statement: n 堆石子成列，部分堆初始為 0。每回合可取走一整堆正數石子，但該堆至少有一個相鄰堆已空。雙方都最大化自己的最終石子總數，求兩人所得。
constraints: [2 <= n <= 1000000, 0 <= a_i <= 100000000, 至少一個 a_i=0]
input_format: 第一行 n，第二行 n 個 a_i。
output_format: 輸出先手與後手最終所得石子數。
samples:
  - input: |-
      8
      1 2 0 3 7 4 0 9
    output: '17 9'
    explanation: 一條最優取法為 9、2、1、4、7、3，兩人分別取得 17、9。
core_knowledge: [零堆分割成棧與雙端佇列, 局部峰值三合一, 分數差貪心]
judgment: 玩家目標是最大化自己的總石子數；因總和固定，等價於最大化自己減對手的分差。
hints:
  - 每段連續正數是雙端可取；位於整列兩端的段只有靠零的一端可取，像棧。
  - 若連續三權值 x<=y 且 z<=y，這三次的分差可壓成一個權值 x+z-y。
  - 消去所有局部峰後，除兩端棧的被迫成對部分外，剩餘權值可由大到小輪流取。
solution_outline: 每個正數段用單調棧反覆壓縮局部峰。兩個邊界段自可取端處理遞減成對損益；其餘壓縮值統一排序，交替加入分差，最後由總和還原兩人得分。
proof_or_invariant: 在 x<=y>=z 的局部峰中，先取 x（或 z）後，對手必取更大的 y，原玩家再取另一側，三步分差等效 x+z-y，且不改變外部可達順序。反覆替換後每個雙端段無局部峰，當前最大值總在可取端，故全域由大到小取最優。邊界棧不可先碰的遞增尾端只能成對結算，其符號由剩餘回合奇偶決定。
common_errors: [把初始零堆算入總分或回合, 峰值只壓一次而未連鎖, 總和與分差使用 32 位元]
complexity: { time: 'O(n log n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n; cin >> n; /* TODO: 分段、峰值壓縮與分差。 */ }
cpp_solution: |
  #include <algorithm>
  #include <functional>
  #include <iostream>
  #include <vector>
  using namespace std;
  vector<long long> compress_segment(const vector<long long> &segment) {
      vector<long long> stack;
      for (long long value : segment) {
          stack.push_back(value);
          while (stack.size() >= 3U) {
              const size_t size = stack.size();
              if (stack[size - 2U] < stack[size - 3U] ||
                  stack[size - 2U] < stack[size - 1U]) break;
              const long long merged =
                  stack[size - 3U] + stack[size - 1U] - stack[size - 2U];
              stack.resize(size - 3U);
              stack.push_back(merged);
          }
      }
      return stack;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<long long> stones(static_cast<size_t>(n));
      long long total = 0;
      for (long long &value : stones) { cin >> value; total += value; }
      vector<vector<long long>> segments;
      vector<int> segment_left;
      for (int i = 0; i < n;) {
          if (stones[static_cast<size_t>(i)] == 0) { ++i; continue; }
          const int left = i;
          vector<long long> segment;
          while (i < n && stones[static_cast<size_t>(i)] != 0)
              segment.push_back(stones[static_cast<size_t>(i++)]);
          segment_left.push_back(left);
          segments.push_back(compress_segment(segment));
      }
      vector<long long> free_values;
      long long delayed_difference = 0;
      for (size_t index = 0; index < segments.size(); ++index) {
          vector<long long> current = segments[index];
          const int left = segment_left[index];
          const int right = left + static_cast<int>(
              [&]() {
                  int length = 0;
                  while (left + length < n &&
                         stones[static_cast<size_t>(left + length)] != 0) ++length;
                  return length;
              }()) - 1;
          const bool boundary = left == 0 || right == n - 1;
          if (right == n - 1) reverse(current.begin(), current.end());
          size_t begin = 0;
          if (boundary) {
              while (begin + 1U < current.size() && current[begin] >= current[begin + 1U]) {
                  delayed_difference += current[begin + 1U] - current[begin];
                  begin += 2U;
              }
          }
          for (; begin < current.size(); ++begin) free_values.push_back(current[begin]);
      }
      sort(free_values.begin(), free_values.end(), greater<long long>());
      long long difference = 0;
      for (size_t i = 0; i < free_values.size(); ++i)
          difference += (i % 2U == 0U ? free_values[i] : -free_values[i]);
      difference += (free_values.size() % 2U == 0U ? delayed_difference : -delayed_difference);
      cout << (total + difference) / 2 << ' ' << (total - difference) / 2 << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3210
external_platform: 洛谷
external_problem_id: P3210
external_title: '[HNOI2010] 取石頭遊戲'
external_relation: original
source_book_pages: [511, 515]
source_pdf_pages: [141, 145]
review_status: verified
---

以「分差」看待計分博弈後，局部三步可壓縮，剩餘局面轉成排序貪心。
