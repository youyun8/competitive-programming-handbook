---
volume: lower
source_file: lower-volume
chapter: 6
section: '6.3'
kind: external-oj
review_status: verified
external_relation: original
id: openj-bailian-3759
title: OpenJudge 百練 3759 Cow Relays：恰走 N 邊最短路
difficulty: 4
topics:
  - min-plus 矩陣
  - 矩陣快速冪
  - 離散化
prerequisites:
  - 最短路
  - 矩陣快速冪
statement: 給定無向加權圖、起點 S、終點 E，求從 S 到 E 恰好經過 N 條邊的最小總長度；頂點標號不連續。
constraints:
  - 2 <= N <= 1000000
  - 2 <= T <= 100
  - 1 <= 交點標號 <= 1000
  - 1 <= 邊長 <= 1000
  - 同一對交點間至多一條直接跑道
input_format: 第一行 N、T、S、E；接著 T 行各為 length、u、v，表示一條無向跑道。
output_format: 輸出從 S 到 E 恰走 N 條跑道的最短總長。
samples:
  - input: |
      2 6 6 4
      11 4 6
      4 4 8
      8 4 9
      6 6 8
      2 6 9
      3 8 9
    output: |
      10
    explanation: 恰走兩邊的最短方案為 6→8→4，長度 6+4=10；直接邊只走一邊，不合條件。
core_knowledge:
  - min-plus 半環
  - 恰定邊數最短路
  - 頂點離散化
judgment: N 達百萬，逐層 DP 太慢；把加法改為取最小、乘法改為距離相加後，鄰接矩陣的 N 次方正好描述恰走 N 邊。
hints:
  - 令 D_t[i][j] 表示從 i 到 j 恰走 t 邊的最短距離，寫出合併 t 與 u 段的轉移。
  - 轉移 D_{t+u}[i][j]=min_k(D_t[i][k]+D_u[k][j])，就是 min-plus 矩陣乘法。
  - 先把實際出現的交點標號壓成連續索引，再對鄰接矩陣做 N 次方；單位矩陣對角線是 0。
solution_outline: 離散化所有端點，以邊長建立 min-plus 鄰接矩陣；用 min-plus 乘法做二進位快速冪，輸出 N 次方的 S,E 元素。
proof_or_invariant: min-plus 乘法枚舉兩段路徑的銜接點，因此兩個分別代表恰走 x、y 邊的矩陣相乘後代表恰走 x+y 邊。由快速冪分解 N，所得矩陣遂包含所有恰走 N 邊路徑的最小長度。
complexity:
  time: O(V^3 log N)，V <= 2T
  space: O(V^2)
common_errors:
  - 使用普通最短路而允許任意邊數
  - min-plus 單位矩陣設成普通的 1
  - 直接以最大標號配置並混淆未出現頂點
cpp_skeleton: >-
  #include <bits/stdc++.h>

  using namespace std;


  static const long long kInf = numeric_limits<long long>::max() / 4;


  struct Matrix {
      vector<vector<long long>> value;
      explicit Matrix(int size = 0) : value(static_cast<size_t>(size), vector<long long>(static_cast<size_t>(size), kInf)) {}
  };


  static Matrix multiply(const Matrix& left, const Matrix& right) {
      const int size = static_cast<int>(left.value.size());
      Matrix result(size);
      for (int i = 0; i < size; ++i) {
          for (int k = 0; k < size; ++k) {
              if (left.value[static_cast<size_t>(i)][static_cast<size_t>(k)] == kInf) { continue; }
              for (int j = 0; j < size; ++j) {
                  if (right.value[static_cast<size_t>(k)][static_cast<size_t>(j)] == kInf) { continue; }
                  result.value[static_cast<size_t>(i)][static_cast<size_t>(j)] =
                      min(result.value[static_cast<size_t>(i)][static_cast<size_t>(j)],
                          left.value[static_cast<size_t>(i)][static_cast<size_t>(k)] +
                              right.value[static_cast<size_t>(k)][static_cast<size_t>(j)]);
              }
          }
      }
      return result;
  }


  static Matrix power(Matrix base_matrix, int exponent) {
      const int size = static_cast<int>(base_matrix.value.size());
      Matrix result(size);
      for (int i = 0; i < size; ++i) { result.value[static_cast<size_t>(i)][static_cast<size_t>(i)] = 0; }
      while (exponent > 0) {
          if ((exponent & 1) != 0) { result = multiply(result, base_matrix); }
          base_matrix = multiply(base_matrix, base_matrix);
          exponent >>= 1;
      }
      return result;
  }


  // TODO：依提示重建狀態轉移與快速冪；目前保留可編譯框架。

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int edge_count, trail_count, start_label, end_label;
      if (!(cin >> edge_count >> trail_count >> start_label >> end_label)) { return 0; }
      vector<array<int, 3>> trails(static_cast<size_t>(trail_count));
      map<int, int> index;
      auto add_label = [&index](int label) {
          if (index.count(label) == 0U) {
              const int next = static_cast<int>(index.size());
              index[label] = next;
          }
      };
      add_label(start_label);
      add_label(end_label);
      for (auto& trail : trails) {
          cin >> trail[0] >> trail[1] >> trail[2];
          add_label(trail[1]);
          add_label(trail[2]);
      }
      Matrix graph(static_cast<int>(index.size()));
      for (const auto& trail : trails) {
          const int u = index[trail[1]], v = index[trail[2]];
          graph.value[static_cast<size_t>(u)][static_cast<size_t>(v)] = trail[0];
          graph.value[static_cast<size_t>(v)][static_cast<size_t>(u)] = trail[0];
      }
      Matrix answer = power(graph, edge_count);
      cout << answer.value[static_cast<size_t>(index[start_label])][static_cast<size_t>(index[end_label])] << '\n';
      return 0;
  }
cpp_solution: >-
  #include <bits/stdc++.h>

  using namespace std;


  static const long long kInf = numeric_limits<long long>::max() / 4;


  struct Matrix {
      vector<vector<long long>> value;
      explicit Matrix(int size = 0) : value(static_cast<size_t>(size), vector<long long>(static_cast<size_t>(size), kInf)) {}
  };


  static Matrix multiply(const Matrix& left, const Matrix& right) {
      const int size = static_cast<int>(left.value.size());
      Matrix result(size);
      for (int i = 0; i < size; ++i) {
          for (int k = 0; k < size; ++k) {
              if (left.value[static_cast<size_t>(i)][static_cast<size_t>(k)] == kInf) { continue; }
              for (int j = 0; j < size; ++j) {
                  if (right.value[static_cast<size_t>(k)][static_cast<size_t>(j)] == kInf) { continue; }
                  result.value[static_cast<size_t>(i)][static_cast<size_t>(j)] =
                      min(result.value[static_cast<size_t>(i)][static_cast<size_t>(j)],
                          left.value[static_cast<size_t>(i)][static_cast<size_t>(k)] +
                              right.value[static_cast<size_t>(k)][static_cast<size_t>(j)]);
              }
          }
      }
      return result;
  }


  static Matrix power(Matrix base_matrix, int exponent) {
      const int size = static_cast<int>(base_matrix.value.size());
      Matrix result(size);
      for (int i = 0; i < size; ++i) { result.value[static_cast<size_t>(i)][static_cast<size_t>(i)] = 0; }
      while (exponent > 0) {
          if ((exponent & 1) != 0) { result = multiply(result, base_matrix); }
          base_matrix = multiply(base_matrix, base_matrix);
          exponent >>= 1;
      }
      return result;
  }


  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int edge_count, trail_count, start_label, end_label;
      if (!(cin >> edge_count >> trail_count >> start_label >> end_label)) { return 0; }
      vector<array<int, 3>> trails(static_cast<size_t>(trail_count));
      map<int, int> index;
      auto add_label = [&index](int label) {
          if (index.count(label) == 0U) {
              const int next = static_cast<int>(index.size());
              index[label] = next;
          }
      };
      add_label(start_label);
      add_label(end_label);
      for (auto& trail : trails) {
          cin >> trail[0] >> trail[1] >> trail[2];
          add_label(trail[1]);
          add_label(trail[2]);
      }
      Matrix graph(static_cast<int>(index.size()));
      for (const auto& trail : trails) {
          const int u = index[trail[1]], v = index[trail[2]];
          graph.value[static_cast<size_t>(u)][static_cast<size_t>(v)] = trail[0];
          graph.value[static_cast<size_t>(v)][static_cast<size_t>(u)] = trail[0];
      }
      Matrix answer = power(graph, edge_count);
      cout << answer.value[static_cast<size_t>(index[start_label])][static_cast<size_t>(index[end_label])] << '\n';
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/3759/
external_platform: OpenJ_Bailian
external_problem_id: '3759'
external_title: Cow Relays
---

本題的「矩陣乘法」工作在 min-plus 半環，而不是一般加乘。
