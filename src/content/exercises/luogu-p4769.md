---
id: luogu-p4769
volume: lower
source_file: lower-volume
title: 洛谷 P4769 好排列的字典序計數
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 9
topics: [catalan-number, permutation, combinatorics, fenwick-tree]
prerequisites: [catalan-stirling, modular-combination]
statement: 對 1..n 的排列，氣泡排序交換次數的下界為所有元素位移絕對值總和的一半；達到下界者稱為好排列。給定排列 q，求字典序嚴格大於 q 的好排列數，答案模 998244353。
constraints: [1 <= T, 1 <= n <= 600000, 所有測試的 n 總和 <= 2000000]
input_format: 第一行 T；每組先給 n，再給一行 1..n 的排列 q。
output_format: 每組輸出一行答案模 998244353。
samples:
  - input: |-
      1
      3
      1 3 2
    output: '3'
    explanation: 字典序較大的四個排列中只有 3 2 1 不是好排列。
core_knowledge: [好排列等價於最長下降子序列不超過二, Catalan 三角形, 字典序首個差異位, 樹狀陣列]
judgment: 氣泡排序達到位移下界，等價於不存在某元素同時被較大元素向右跨越、又被較小元素向左跨越，也就是不存在長度三下降子序列。
hints:
  - 好排列可拆成兩條遞增子序列；固定前綴後，未用且小於當前最大值的元素只能依序放入第二條。
  - 設剩 i 個元素、其中 j 個大於當前最大值，完成數是受對角線限制的格路數。
  - 枚舉第一個與 q 不同的位置；樹狀陣列可判斷 q 的前綴能否繼續成為好排列。
solution_outline: 預處理到 1200000 的階乘與逆階乘。完成數由反射原理化為兩個組合數之差。逐位維護已用且較小的數量與「仍可選作較大首異值」的最小數量，加入當位所有合法較大選擇的完成數；若原排列當位既非新最大值、也非剩餘最小值，就停止延伸前綴。
proof_or_invariant: 對可拆成兩遞增序列的前綴，把含目前最大值者記為 A。後續大於最大值的元素可選入 A；較小未用元素只能按遞增順序進 B。其 DP 是 Catalan 三角形，反射原理給出 closed form。枚舉首異位置互斥且涵蓋所有字典序較大的排列；前綴檢查恰維持上述 A/B 可完成條件。
common_errors: [把字典序大於誤作逐位都大於, 組合數預處理只到 n, 前綴非法後仍繼續計數, 忘記答案取模]
complexity: { time: 'O(max_n + Σn log n)', space: 'O(max_n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int tests; cin >> tests; /* TODO: Catalan 三角形與前綴枚舉。 */ return 0; }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  constexpr int mod_value = 998244353;
  int power_mod(int base, int exponent) {
      long long result = 1;
      long long value = base;
      while (exponent > 0) {
          if ((exponent & 1) != 0) result = result * value % mod_value;
          value = value * value % mod_value;
          exponent >>= 1;
      }
      return static_cast<int>(result);
  }
  class Fenwick {
  public:
      explicit Fenwick(int n) : tree_(static_cast<size_t>(n) + 1U) {}
      void add(int index) {
          for (int i = index; i < static_cast<int>(tree_.size()); i += i & -i)
              ++tree_[static_cast<size_t>(i)];
      }
      int prefix_sum(int index) const {
          int result = 0;
          for (int i = index; i > 0; i -= i & -i)
              result += tree_[static_cast<size_t>(i)];
          return result;
      }
  private:
      vector<int> tree_;
  };
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests;
      cin >> tests;
      vector<vector<int>> permutations(static_cast<size_t>(tests));
      int maximum_n = 0;
      for (vector<int> &values : permutations) {
          int n;
          cin >> n;
          maximum_n = max(maximum_n, n);
          values.resize(static_cast<size_t>(n));
          for (int &value : values) cin >> value;
      }
      const int limit = 2 * maximum_n + 2;
      vector<int> factorial(static_cast<size_t>(limit) + 1U, 1);
      vector<int> inverse_factorial(static_cast<size_t>(limit) + 1U, 1);
      for (int i = 1; i <= limit; ++i)
          factorial[static_cast<size_t>(i)] =
              static_cast<int>(static_cast<long long>(factorial[static_cast<size_t>(i - 1)]) * i % mod_value);
      inverse_factorial[static_cast<size_t>(limit)] =
          power_mod(factorial[static_cast<size_t>(limit)], mod_value - 2);
      for (int i = limit; i > 0; --i)
          inverse_factorial[static_cast<size_t>(i - 1)] =
              static_cast<int>(static_cast<long long>(inverse_factorial[static_cast<size_t>(i)]) * i % mod_value);
      const auto combination = [&](int n, int k) {
          if (k < 0 || k > n) return 0;
          return static_cast<int>(
              static_cast<long long>(factorial[static_cast<size_t>(n)]) *
              inverse_factorial[static_cast<size_t>(k)] % mod_value *
              inverse_factorial[static_cast<size_t>(n - k)] % mod_value);
      };
      for (const vector<int> &values : permutations) {
          const int n = static_cast<int>(values.size());
          Fenwick used(n);
          int available_larger = n;
          int answer = 0;
          for (int index = 0; index < n; ++index) {
              const int value = values[static_cast<size_t>(index)];
              const int used_smaller = used.prefix_sum(value);
              const int unused_larger = n - value - (index - used_smaller);
              const bool new_maximum = unused_larger < available_larger;
              if (new_maximum) available_larger = unused_larger;
              if (available_larger == 0) break;
              const int remaining = n - index;
              const int j = available_larger - 1;
              int ways = combination(remaining + j - 1, j);
              if (j >= 2) {
                  ways -= combination(remaining + j - 1, j - 2);
                  if (ways < 0) ways += mod_value;
              }
              answer += ways;
              if (answer >= mod_value) answer -= mod_value;
              if (!new_maximum && used_smaller != value - 1) break;
              used.add(value);
          }
          cout << answer << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4769
external_platform: 洛谷
external_problem_id: P4769
external_title: '[NOI2018] 冒泡排序'
external_relation: original
source_book_pages: [484]
source_pdf_pages: [114]
review_status: verified
---

反射原理把二維 DP 壓成組合數，樹狀陣列則在線維護給定排列前綴是否合法。
