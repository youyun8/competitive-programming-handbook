---
id: luogu-p5818
volume: lower
source_file: lower-volume
title: 洛谷 P5818 限環長環烷烴同構計數
chapter: 7
section: '7.7'
kind: external-oj
difficulty: 5
topics: [burnside-lemma, generating-function, unlabeled-tree, dihedral-group]
prerequisites: [burnside-polya, generating-functions]
statement: 一個 n 碳環烷烴是 n 點 n 邊、連通、簡單且最大度數不超過 4 的無向圖，因此由一個基環與向外樹構成。求基環長至多 m 的互不同構結構數模質數 p。
constraints: [3 <= n <= 1000, 3 <= m <= 50, m <= n, 10000 <= p <= 2000000000, p 為質數]
input_format: 一行三個整數 n、m、p。
output_format: 輸出 n 個碳、環長不超過 m 的結構數模 p。
samples:
  - input: '10 10 66103'
    output: '475'
    explanation: 枚舉環長 3..10，對每個環以二面體群去除旋轉與翻轉同構後加總。
core_knowledge: [烷基與環附著樹生成函數, Pólya 計數, 二面體群, 多項式冪]
judgment: 環上每個碳已有兩條環邊，因此外掛部分的根最多再接兩棵烷基；其他碳最多接三棵。
hints:
  - 先求烷基生成函數 F=1+x(F^3+3F F(x^2)+2F(x^3))/6。
  - 環上一點可掛至多兩棵烷基，其生成函數 T=x(F^2+F(x^2))/2。
  - 固定環長 k 後，對 T 裝飾的 k 邊形套用旋轉與兩類反射的 Burnside 平均。
solution_outline: 用係數遞推在 O(n²) 求 F 與 T；維護 F² 卷積可讓每個新係數只花 O(n)。預處理 T^0..T^m 的前 n 項。對每個 k=3..m，旋轉 d 的貢獻為 T(x^(k/g))^g，g=gcd(d,k)；反射按 k 奇偶使用標準二面體循環型。取 2k 的逆元後累加。
proof_or_invariant: S3 與 S2 的循環指標分別給出 F、T 方程，故其係數精確數出無標號根樹。基環上的 k 個 T-物件只有二面體群的旋轉與翻轉會保留圖同構；Burnside 對每個群元素要求同一置換循環內裝飾相同，正對應 T(x^d) 的乘積。枚舉所有允許環長後，每個單環圖恰屬唯一一項。
common_errors: [把環上根也允許三個孩子, 反射時不區分奇偶環長, 忘記環至少三點, 模數由輸入且不固定]
complexity: { time: 'O(n^2+mn^2)', space: 'O(mn)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n, m; long long p; cin >> n >> m >> p; /* TODO: 根樹生成函數與二面體 Burnside。 */ return 0; }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <numeric>
  #include <vector>
  using namespace std;
  long long power_mod(long long base, long long exponent, long long mod_value) {
      long long result = 1;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) result = result * base % mod_value;
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int maximum_cycle;
      long long mod_value;
      cin >> n >> maximum_cycle >> mod_value;
      maximum_cycle = min(maximum_cycle, n);
      const long long inverse_two = power_mod(2, mod_value - 2, mod_value);
      const long long inverse_six = power_mod(6, mod_value - 2, mod_value);
      vector<long long> alkyl(static_cast<size_t>(n) + 1U);
      vector<long long> square(static_cast<size_t>(2 * n) + 1U);
      vector<long long> attachment(static_cast<size_t>(n) + 1U);
      alkyl[0] = 1;
      square[0] = 1;
      for (int size = 1; size <= n; ++size) {
          const int target = size - 1;
          long long cube = 0;
          long long mixed = 0;
          for (int first = 0; first <= target; ++first) {
              cube = (cube + alkyl[static_cast<size_t>(first)] *
                      square[static_cast<size_t>(target - first)]) % mod_value;
              if (2 * first <= target)
                  mixed = (mixed + alkyl[static_cast<size_t>(target - 2 * first)] *
                           alkyl[static_cast<size_t>(first)]) % mod_value;
          }
          long long triple = 0;
          if (target % 3 == 0) triple = alkyl[static_cast<size_t>(target / 3)];
          alkyl[static_cast<size_t>(size)] =
              (cube + 3 * mixed + 2 * triple) % mod_value * inverse_six % mod_value;
          attachment[static_cast<size_t>(size)] =
              (square[static_cast<size_t>(target)] +
               (target % 2 == 0 ? alkyl[static_cast<size_t>(target / 2)] : 0)) %
              mod_value * inverse_two % mod_value;
          for (int other = 0; other < size; ++other) {
              const size_t degree = static_cast<size_t>(size + other);
              square[degree] = (square[degree] +
                  2 * alkyl[static_cast<size_t>(size)] *
                  alkyl[static_cast<size_t>(other)]) % mod_value;
          }
          square[static_cast<size_t>(2 * size)] =
              (square[static_cast<size_t>(2 * size)] +
               alkyl[static_cast<size_t>(size)] * alkyl[static_cast<size_t>(size)]) % mod_value;
      }
      vector<vector<long long>> powers(
          static_cast<size_t>(maximum_cycle) + 1U,
          vector<long long>(static_cast<size_t>(n) + 1U));
      powers[0][0] = 1;
      for (int exponent = 1; exponent <= maximum_cycle; ++exponent) {
          for (int old_degree = 0; old_degree <= n; ++old_degree) {
              const long long old_value =
                  powers[static_cast<size_t>(exponent - 1)][static_cast<size_t>(old_degree)];
              if (old_value == 0) continue;
              for (int add = 1; old_degree + add <= n; ++add)
                  powers[static_cast<size_t>(exponent)][static_cast<size_t>(old_degree + add)] =
                      (powers[static_cast<size_t>(exponent)][static_cast<size_t>(old_degree + add)] +
                       old_value * attachment[static_cast<size_t>(add)]) % mod_value;
          }
      }
      long long answer = 0;
      for (int cycle = 3; cycle <= maximum_cycle; ++cycle) {
          long long fixed_sum = powers[static_cast<size_t>(cycle)][static_cast<size_t>(n)];
          for (int shift = 1; shift < cycle; ++shift) {
              const int cycles = gcd(shift, cycle);
              const int orbit_length = cycle / cycles;
              if (n % orbit_length == 0)
                  fixed_sum = (fixed_sum +
                      powers[static_cast<size_t>(cycles)][static_cast<size_t>(n / orbit_length)]) %
                      mod_value;
          }
          if ((cycle & 1) != 0) {
              long long reflection = 0;
              for (int doubled_degree = 0; doubled_degree <= n; doubled_degree += 2)
                  reflection = (reflection +
                      powers[static_cast<size_t>(cycle / 2)]
                            [static_cast<size_t>(doubled_degree / 2)] *
                      attachment[static_cast<size_t>(n - doubled_degree)]) % mod_value;
              fixed_sum = (fixed_sum + cycle * reflection) % mod_value;
          } else {
              long long through_edges = 0;
              if ((n & 1) == 0)
                  through_edges =
                      powers[static_cast<size_t>(cycle / 2)][static_cast<size_t>(n / 2)];
              long long through_vertices = 0;
              for (int doubled_degree = 0; doubled_degree <= n; doubled_degree += 2)
                  through_vertices = (through_vertices +
                      powers[static_cast<size_t>(cycle / 2 - 1)]
                            [static_cast<size_t>(doubled_degree / 2)] *
                      powers[2][static_cast<size_t>(n - doubled_degree)]) % mod_value;
              fixed_sum = (fixed_sum + (cycle / 2) *
                  ((through_edges + through_vertices) % mod_value)) % mod_value;
          }
          answer = (answer + fixed_sum *
              power_mod(2LL * cycle, mod_value - 2, mod_value)) % mod_value;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5818
external_platform: 洛谷
external_problem_id: P5818
external_title: '[JSOI2011] 同分異構體計數'
external_relation: original
source_book_pages: [493]
source_pdf_pages: [123]
review_status: verified
---

先把每個環點壓成一個無標號根樹裝飾，再對環的二面體對稱做 Burnside 平均。
