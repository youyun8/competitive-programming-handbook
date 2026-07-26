---
id: luogu-p4128
volume: lower
source_file: lower-volume
title: 洛谷 P4128 完全圖邊染色同構計數
chapter: 7
section: '7.7'
kind: external-oj
difficulty: 8
topics: [burnside-lemma, graph-isomorphism, integer-partition]
prerequisites: [burnside-polya]
statement: 用 m 種顏色為 n 點完全圖的每條邊染色。若重新編號頂點後邊色完全相同，兩方案視為同構。求本質不同方案數模質數 p。
constraints: [1 <= n <= 53, 1 <= m <= 1000, n < p <= 1000000000, p 為質數]
input_format: 一行三個正整數 n、m、p。
output_format: 輸出本質不同染色數模 p。
samples:
  - input: '3 2 97'
    output: '4'
    explanation: 三條邊用兩色染色，在頂點重標號下只由其中一色出現 0、1、2、3 次區分。
core_knowledge: [Burnside 引理, 置換循環型, 邊軌道, 整數分拆]
judgment: 不必枚舉 n! 個置換；同一循環長度多重集對邊產生相同的軌道數。
hints:
  - 一個長度 a 的頂點循環，其內部邊形成 floor(a/2) 個軌道。
  - 長度 a、b 的兩循環之間有 gcd(a,b) 個邊軌道。
  - 循環型中長度 d 出現 c_d 次時，Burnside 權重會化為 1/(d^c_d c_d!)。
solution_outline: DFS 枚舉 n 的非降整數分拆。對每個循環型計算邊軌道數 e，固定染色數為 m^e。Burnside 中該類置換個數除以 n! 後的係數是所有 d^c c! 的逆元乘積；累加即可。
proof_or_invariant: 同一循環內，端點距離在同步旋轉下不變，無向距離 d 與 a-d 等價，故有 floor(a/2) 軌道。兩循環間同步走動的軌道長 lcm(a,b)，由 ab 條邊得到 gcd(a,b) 軌道。每個軌道可獨立選色。整數分拆恰枚舉全部置換共軛類，而標準共軛類大小公式與 Burnside 的 n! 相消後得到所用權重。
common_errors: [環內軌道誤算成 a, 忘記無向邊使距離 d 與 a-d 等價, 重複循環長度漏除 c!, 在非質數模數下套費馬逆元]
complexity: { time: 'O(P(n)n^2 log n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n, m, p; cin >> n >> m >> p; /* TODO: 枚舉循環型。 */ return 0; }
cpp_solution: |
  #include <algorithm>
  #include <functional>
  #include <iostream>
  #include <numeric>
  #include <vector>
  using namespace std;
  long long power_mod(long long base, long long exponent, long long mod_value) {
      long long result = 1 % mod_value;
      base %= mod_value;
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
      int colors;
      long long mod_value;
      cin >> n >> colors >> mod_value;
      vector<long long> inverse(static_cast<size_t>(n) + 1U, 1);
      for (int i = 1; i <= n; ++i)
          inverse[static_cast<size_t>(i)] = power_mod(i, mod_value - 2, mod_value);
      vector<int> parts;
      vector<int> count(static_cast<size_t>(n) + 1U);
      long long answer = 0;
      function<void(int, int, long long)> search =
          [&](int remaining, int minimum, long long weight) {
              if (remaining == 0) {
                  long long edge_orbits = 0;
                  for (size_t i = 0; i < parts.size(); ++i) {
                      edge_orbits += parts[i] / 2;
                      for (size_t j = 0; j < i; ++j)
                          edge_orbits += gcd(parts[i], parts[j]);
                  }
                  answer = (answer + weight *
                      power_mod(colors, edge_orbits, mod_value)) % mod_value;
                  return;
              }
              for (int length = minimum; length <= remaining; ++length) {
                  ++count[static_cast<size_t>(length)];
                  const int multiplicity = count[static_cast<size_t>(length)];
                  parts.push_back(length);
                  const long long next_weight = weight *
                      inverse[static_cast<size_t>(length)] % mod_value *
                      inverse[static_cast<size_t>(multiplicity)] % mod_value;
                  search(remaining - length, length, next_weight);
                  parts.pop_back();
                  --count[static_cast<size_t>(length)];
              }
          };
      search(n, 1, 1);
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4128
external_platform: 洛谷
external_problem_id: P4128
external_title: '[SHOI2006] 有色圖'
external_relation: original
source_book_pages: [493]
source_pdf_pages: [123]
review_status: verified
---

以整數分拆枚舉置換共軛類，能把 Burnside 的 n! 規模降到分拆數規模。
