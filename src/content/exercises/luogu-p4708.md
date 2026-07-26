---
id: luogu-p4708
volume: lower
source_file: lower-volume
title: 洛谷 P4708 無標號偶度圖計數
chapter: 7
section: '7.7'
kind: external-oj
difficulty: 10
topics: [burnside-lemma, graph-isomorphism, parity, disjoint-set]
prerequisites: [burnside-polya, disjoint-set-union]
statement: 求 n 個頂點、每個連通塊都有歐拉迴路的無標號簡單無向圖數。孤立點允許；等價地，每個頂點度數皆為偶數。答案模 998244353。
constraints: [1 <= n <= 50]
input_format: 一行一個正整數 n。
output_format: 輸出互不同構偶度簡單圖數模 998244353。
samples:
  - input: '3'
    output: '2'
    explanation: 只有空圖與三角形兩種。
core_knowledge: [Burnside 引理, 邊軌道, GF(2) 次數約束, 整數分拆, 並查集求秩]
judgment: 固定一個頂點置換後，邊軌道是二元變數；偶度條件是這些變數上的 GF(2) 線性方程。
hints:
  - 循環型仍可用 n 的整數分拆枚舉，邊變數數量與一般無標號圖相同。
  - 兩個頂點循環間的一個邊軌道，對兩側每點的度數貢獻分別是 b/g 與 a/g 的奇偶。
  - 每個方程欄至多含兩個 1；以並查集連接「兩端皆奇」，並標記只有單端為奇的連通塊即可求秩。
solution_outline: 對每個循環型計算邊軌道總數 e。建立以每個頂點循環為一列的奇偶方程：偶長循環的直徑邊軌道提供單列約束；兩循環間依 a/g、b/g 奇偶提供零列、單列或兩列約束。兩列約束用 DSU 合併，單列把該連通塊標為錨定。若一個分量大小 s，錨定時秩 s，否則秩 s-1。固定圖數為 2^(e-rank)，再乘共軛類 Burnside 權重。
proof_or_invariant: 在置換下固定的圖由邊軌道選取集合唯一決定。偶度方程在同一頂點循環上完全相同，故每循環只留一列。任一欄為 0、e_i 或 e_i+e_j；後兩類形成帶錨定點的圖形矩陣。每個未錨定連通分量只有「所有列和為零」一個依賴，錨定後全秩，因此 rank 公式成立。解空間維度 e-rank，Burnside 加權後即為無標號答案。
common_errors: [把每個邊軌道都當作不受偶度限制, 偶長循環漏掉對徑邊, 兩循環間把每點入度寫成 gcd, DSU 合併後遺失錨定標記]
complexity: { time: 'O(P(n)n^2 α(n))', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n; cin >> n; /* TODO: Burnside 下的 GF(2) 方程秩。 */ return 0; }
cpp_solution: |
  #include <functional>
  #include <iostream>
  #include <numeric>
  #include <vector>
  using namespace std;
  constexpr int mod_value = 998244353;
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
  class DisjointSet {
  public:
      explicit DisjointSet(int n)
          : parent_(static_cast<size_t>(n)), size_(static_cast<size_t>(n), 1),
            anchored_(static_cast<size_t>(n)) {
          iota(parent_.begin(), parent_.end(), 0);
      }
      int find(int x) {
          if (parent_[static_cast<size_t>(x)] != x)
              parent_[static_cast<size_t>(x)] = find(parent_[static_cast<size_t>(x)]);
          return parent_[static_cast<size_t>(x)];
      }
      void unite(int x, int y) {
          x = find(x);
          y = find(y);
          if (x == y) return;
          if (size_[static_cast<size_t>(x)] < size_[static_cast<size_t>(y)]) swap(x, y);
          parent_[static_cast<size_t>(y)] = x;
          size_[static_cast<size_t>(x)] += size_[static_cast<size_t>(y)];
          anchored_[static_cast<size_t>(x)] =
              static_cast<char>(anchored_[static_cast<size_t>(x)] |
                                anchored_[static_cast<size_t>(y)]);
      }
      void anchor(int x) { anchored_[static_cast<size_t>(find(x))] = 1; }
      int rank() {
          int result = 0;
          for (int i = 0; i < static_cast<int>(parent_.size()); ++i) {
              if (find(i) != i) continue;
              result += size_[static_cast<size_t>(i)] -
                  (anchored_[static_cast<size_t>(i)] != 0 ? 0 : 1);
          }
          return result;
      }
  private:
      vector<int> parent_;
      vector<int> size_;
      vector<char> anchored_;
  };
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<int> inverse(static_cast<size_t>(n) + 1U, 1);
      for (int i = 1; i <= n; ++i) inverse[static_cast<size_t>(i)] = power_mod(i, mod_value - 2);
      vector<int> parts;
      vector<int> count(static_cast<size_t>(n) + 1U);
      int answer = 0;
      function<void(int, int, int)> search = [&](int remaining, int minimum, int weight) {
          if (remaining == 0) {
              const int cycles = static_cast<int>(parts.size());
              DisjointSet equations(cycles);
              int variables = 0;
              for (int i = 0; i < cycles; ++i) {
                  const int a = parts[static_cast<size_t>(i)];
                  variables += a / 2;
                  if ((a & 1) == 0) equations.anchor(i);
                  for (int j = 0; j < i; ++j) {
                      const int b = parts[static_cast<size_t>(j)];
                      const int divisor = gcd(a, b);
                      variables += divisor;
                      const bool at_i = ((b / divisor) & 1) != 0;
                      const bool at_j = ((a / divisor) & 1) != 0;
                      if (at_i && at_j) equations.unite(i, j);
                      else if (at_i) equations.anchor(i);
                      else if (at_j) equations.anchor(j);
                  }
              }
              const int free_variables = variables - equations.rank();
              answer = static_cast<int>(
                  (answer + static_cast<long long>(weight) *
                  power_mod(2, free_variables)) % mod_value);
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
external_url: https://www.luogu.com.cn/problem/P4708
external_platform: 洛谷
external_problem_id: P4708
external_title: 畫畫
external_relation: original
source_book_pages: [493]
source_pdf_pages: [123]
review_status: verified
---

偶度限制在每個置換循環上只留一條方程，稀疏到能用帶錨定的並查集直接求秩。
