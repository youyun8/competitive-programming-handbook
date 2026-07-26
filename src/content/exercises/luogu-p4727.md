---
id: luogu-p4727
volume: lower
source_file: lower-volume
title: 洛谷 P4727 無標號簡單圖計數
chapter: 7
section: '7.7'
kind: external-oj
difficulty: 5
topics: [burnside-lemma, graph-isomorphism, integer-partition]
prerequisites: [burnside-polya]
statement: 求 n 個頂點的無標號簡單無向圖數；頂點重新編號後相同的圖只算一次。答案模 997。
constraints: [0 <= n <= 60]
input_format: 一行一個非負整數 n。
output_format: 輸出互不同構簡單圖數模 997。
samples:
  - input: '4'
    output: '11'
    explanation: 四個頂點共有 11 種互不同構簡單圖。
core_knowledge: [圖視為二色邊染色, Burnside 引理, 置換共軛類, 整數分拆]
judgment: 每條完全圖邊的「存在／不存在」就是兩色染色，因此可直接使用邊染色的 Burnside 模型。
hints:
  - 頂點置換的循環型只與 n 的整數分拆有關。
  - 長 a 循環內有 floor(a/2) 個邊軌道；長 a、b 循環間有 gcd(a,b) 個。
  - 某循環型的 Burnside 權重是所有 a^c_a c_a! 的倒數。
solution_outline: 特判 n=0 的空圖。DFS 枚舉非降整數分拆，計算對應邊軌道數 e，加入 2^e/(Πa^c_a c_a!)。所有分母皆小於 997，可用費馬逆元。
proof_or_invariant: 在固定頂點置換下，圖不變當且僅當同一邊軌道中的邊同時存在或同時不存在，所以固定圖數是 2^e。循環內與循環間的軌道公式分別由無向環距離及 lcm 軌道長推出。共軛類大小 n!/(Πa^c c!) 除以 Burnside 的 n! 後正是累加權重，故總和為軌道數。
common_errors: [漏掉 n=0 的唯一空圖, 把有標號圖數直接除以 n!, 環間軌道用 lcm 而非 gcd, 未除相同循環的階乘]
complexity: { time: 'O(P(n)n^2 log n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n; cin >> n; /* TODO: Burnside 與整數分拆。 */ return 0; }
cpp_solution: |
  #include <functional>
  #include <iostream>
  #include <numeric>
  #include <vector>
  using namespace std;
  constexpr int mod_value = 997;
  int power_mod(int base, int exponent) {
      int result = 1;
      while (exponent > 0) {
          if ((exponent & 1) != 0)
              result = static_cast<int>(static_cast<long long>(result) * base % mod_value);
          base = static_cast<int>(static_cast<long long>(base) * base % mod_value);
          exponent >>= 1;
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      if (n == 0) {
          cout << 1 << '\n';
          return 0;
      }
      vector<int> inverse(static_cast<size_t>(n) + 1U, 1);
      for (int i = 1; i <= n; ++i)
          inverse[static_cast<size_t>(i)] = power_mod(i, mod_value - 2);
      vector<int> parts;
      vector<int> count(static_cast<size_t>(n) + 1U);
      int answer = 0;
      function<void(int, int, int)> search = [&](int remaining, int minimum, int weight) {
          if (remaining == 0) {
              int edge_orbits = 0;
              for (size_t i = 0; i < parts.size(); ++i) {
                  edge_orbits += parts[i] / 2;
                  for (size_t j = 0; j < i; ++j)
                      edge_orbits += gcd(parts[i], parts[j]);
              }
              answer = static_cast<int>(
                  (answer + static_cast<long long>(weight) * power_mod(2, edge_orbits)) % mod_value);
              return;
          }
          for (int length = minimum; length <= remaining; ++length) {
              ++count[static_cast<size_t>(length)];
              const int multiplicity = count[static_cast<size_t>(length)];
              parts.push_back(length);
              const int next_weight = static_cast<int>(
                  static_cast<long long>(weight) * inverse[static_cast<size_t>(length)] %
                  mod_value * inverse[static_cast<size_t>(multiplicity)] % mod_value);
              search(remaining - length, length, next_weight);
              parts.pop_back();
              --count[static_cast<size_t>(length)];
          }
      };
      search(n, 1, 1);
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4727
external_platform: 洛谷
external_problem_id: P4727
external_title: '[HNOI2009] 圖的同構計數'
external_relation: original
source_book_pages: [493]
source_pdf_pages: [123]
review_status: verified
---

簡單圖是完全圖邊的二色染色，因此與有色圖共享同一組邊軌道公式。
