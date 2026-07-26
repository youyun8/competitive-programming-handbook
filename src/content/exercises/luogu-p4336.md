---
id: luogu-p4336
volume: lower
source_file: lower-volume
title: 洛谷 P4336 每家公司恰建一邊的生成樹
chapter: 7
section: '7.5'
kind: external-oj
difficulty: 5
topics: [inclusion-exclusion, matrix-tree-theorem, determinant]
prerequisites: [inclusion-exclusion, matrix-tree-theorem]
statement: >-
  n 個城市原本無道路，恰有 n-1 家公司，各自列出能修建的無向邊。選 n-1 條道路連通所有城市，
  並讓每家公司恰好承建一條它能修的道路。計算邊集合或分配不同的方案數模 1000000007。
constraints:
  - 2 <= n <= 17
  - 0 <= m_i <= n(n-1)/2
  - 每家公司清單內無自環或重複邊
input_format: 第一行 n；接下來 n-1 行先給 m_i，再給 m_i 對端點 u、v。
output_format: 輸出方案數模 1000000007。
samples:
  - input: |
      3
      2 1 2 2 3
      2 1 3 2 3
    output: '3'
    explanation: 兩家公司分別可選 (12,13)、(12,23)、(23,13)，三組都形成生成樹。
core_knowledge:
  - 固定公司子集時，把公司標號視為平行邊可用 Matrix-Tree 定理計數
  - 對「某家公司未使用」容斥，因總邊數等於公司數，至少一次即恰好一次
judgment: 同一條城市邊交給不同公司視為不同分配；最後仍須形成含 n-1 條邊的生成樹。
hints:
  - 對公司集合 S，將每家公司能修的每條邊都加入一張帶標號的多重圖。
  - 此多重圖的生成樹數由 Laplacian 任一代數餘子式的行列式給出。
  - 對所有 S 加上 (-1)^((n-1)-|S|)；容斥後每家公司都至少出現一次。
solution_outline: 枚舉 2^(n-1) 個公司子集，建立邊重數 Laplacian，以模質數高斯消去求行列式，再依奇偶容斥。
proof_or_invariant: >-
  Matrix-Tree 定理在多重圖中會把每條帶公司標號的平行邊分別計數，因此得到只使用 S 公司、
  但允許公司重複承建的所有生成樹分配。容斥消去漏用任一公司的分配；生成樹恰有 n-1 條邊，
  而公司也有 n-1 家，所以每家至少一次等價於每家恰好一次。
common_errors:
  - 合併平行邊時只記是否存在，丟失不同公司的分配數
  - 行列式交換兩行後未改變符號
  - 容斥使用城市數 n 而非公司數 n-1
complexity:
  time: O(2^(n-1) n^3)
  space: O(n^2)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      // TODO：枚舉公司子集，以 Matrix-Tree 計數並容斥。
      (void)n;
      return 0;
  }
cpp_solution: |
  #include <cstdint>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;

  static constexpr int64_t mod_value = 1000000007;
  static int64_t power_mod(int64_t base, int64_t exponent) {
      int64_t result = 1;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) { result = result * base % mod_value; }
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }
  static int64_t determinant(vector<vector<int64_t>> matrix) {
      const int size = static_cast<int>(matrix.size());
      int64_t result = 1;
      for (int column = 0; column < size; ++column) {
          int pivot = column;
          while (pivot < size && matrix[static_cast<size_t>(pivot)][static_cast<size_t>(column)] == 0) {
              ++pivot;
          }
          if (pivot == size) { return 0; }
          if (pivot != column) {
              swap(matrix[static_cast<size_t>(pivot)], matrix[static_cast<size_t>(column)]);
              result = (mod_value - result) % mod_value;
          }
          const int64_t pivot_value = matrix[static_cast<size_t>(column)][static_cast<size_t>(column)];
          result = result * pivot_value % mod_value;
          const int64_t inverse = power_mod(pivot_value, mod_value - 2);
          for (int row = column + 1; row < size; ++row) {
              const int64_t factor =
                  matrix[static_cast<size_t>(row)][static_cast<size_t>(column)] * inverse % mod_value;
              for (int next = column; next < size; ++next) {
                  int64_t& cell = matrix[static_cast<size_t>(row)][static_cast<size_t>(next)];
                  cell = (cell - factor * matrix[static_cast<size_t>(column)][static_cast<size_t>(next)]) %
                         mod_value;
                  if (cell < 0) { cell += mod_value; }
              }
          }
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      const int company_count = n - 1;
      vector<vector<pair<int, int>>> edges(static_cast<size_t>(company_count));
      for (auto& company_edges : edges) {
          int count;
          cin >> count;
          while (count-- > 0) {
              int u, v;
              cin >> u >> v;
              company_edges.emplace_back(u - 1, v - 1);
          }
      }
      int64_t answer = 0;
      for (int mask = 0; mask < (1 << company_count); ++mask) {
          vector<vector<int64_t>> laplacian(static_cast<size_t>(n),
                                            vector<int64_t>(static_cast<size_t>(n)));
          for (int company = 0; company < company_count; ++company) {
              if ((mask & (1 << company)) == 0) { continue; }
              for (const auto& [u, v] : edges[static_cast<size_t>(company)]) {
                  ++laplacian[static_cast<size_t>(u)][static_cast<size_t>(u)];
                  ++laplacian[static_cast<size_t>(v)][static_cast<size_t>(v)];
                  --laplacian[static_cast<size_t>(u)][static_cast<size_t>(v)];
                  --laplacian[static_cast<size_t>(v)][static_cast<size_t>(u)];
              }
          }
          vector<vector<int64_t>> minor(static_cast<size_t>(n - 1),
                                        vector<int64_t>(static_cast<size_t>(n - 1)));
          for (int row = 0; row < n - 1; ++row) {
              for (int column = 0; column < n - 1; ++column) {
                  minor[static_cast<size_t>(row)][static_cast<size_t>(column)] =
                      (laplacian[static_cast<size_t>(row)][static_cast<size_t>(column)] + mod_value) %
                      mod_value;
              }
          }
          const int64_t trees = determinant(move(minor));
          if (((company_count - __builtin_popcount(static_cast<unsigned int>(mask))) & 1) == 0) {
              answer = (answer + trees) % mod_value;
          } else {
              answer = (answer - trees + mod_value) % mod_value;
          }
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4336
external_platform: 洛谷
external_problem_id: P4336
external_title: '[SHOI2016] 黑暗前的幻想鄉'
external_relation: original
source_book_pages: [481, 485]
source_pdf_pages: [111, 115]
review_status: verified
---

容斥負責「每家公司都出現」，Matrix-Tree 定理負責「所選道路恰為樹」，兩層計數彼此分工。
