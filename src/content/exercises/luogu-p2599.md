---
id: luogu-p2599
volume: lower
source_file: lower-volume
title: 洛谷 P2599 雙端取石子博弈
chapter: 7
section: '7.9'
kind: external-oj
difficulty: 5
topics: [game-theory, interval-dp]
prerequisites: [combinatorial-game-theory]
statement: n 堆正數石子排成一列。每回合可從最左或最右堆取任意正數顆，可取完整堆；無法操作的人輸。判斷先手是否必勝。
constraints: [1 <= test_cases <= 10, 1 <= n <= 1000, 1 <= a_i <= 1000000000]
input_format: 第一行 T；每組第一行 n，第二行 n 個堆大小。
output_format: 每組輸出 1 表示先手必勝，否則輸出 0。
samples:
  - input: |-
      1
      4
      3 1 9 4
    output: '0'
    explanation: 此局面符合區間特徵值所刻畫的唯一必敗配置。
core_knowledge: [必敗補值的存在唯一性, 區間動態規劃]
judgment: 端點堆可以只取一部分；取完後下一堆才成為新端點。
hints:
  - 定義 L[i][j]：在區間左側補一堆 L 顆後，整個局面恰為必敗；R 對稱定義。
  - 單堆區間有 L[i][i]=R[i][i]=a_i，因兩個相等端堆可鏡像回應。
  - 擴張一個端點時只需比較新值 x 與舊 L、R，分成相等、夾在兩者間、其餘三類。
solution_outline: 依區間長度遞推 L、R。求 L[i][j] 時使用 [i,j-1] 的 L、R 與 a_j；R 對稱。最終 a_1=L[2][n] 恰表示必敗。
proof_or_invariant: 對固定區間，能使左補局面必敗的非負整數至多一個，否則較大補值可一步降到較小必敗值；以有限右端選擇的反證可證至少一個。分類遞推維持此唯一補值：x 等於對側補值時可補 0；x 落在兩閾值間時需補 x±1 供後手維持差一；同側時補 x 供鏡像。對 R 完全對稱，故最終判準成立。
common_errors: [只允許取整堆而做一般區間勝敗 DP, 忽略補值可為 0, n=1 未特判]
complexity: { time: 'O(n^2) per case', space: 'O(n^2)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int test_cases; cin >> test_cases; /* TODO: L/R 區間 DP。 */ }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int test_cases;
      cin >> test_cases;
      while (test_cases-- > 0) {
          int n;
          cin >> n;
          vector<int> stones(static_cast<size_t>(n));
          for (int &value : stones) cin >> value;
          if (n == 1) { cout << 1 << '\n'; continue; }
          vector<vector<int>> left(static_cast<size_t>(n), vector<int>(static_cast<size_t>(n)));
          vector<vector<int>> right(static_cast<size_t>(n), vector<int>(static_cast<size_t>(n)));
          for (int i = 0; i < n; ++i)
              left[static_cast<size_t>(i)][static_cast<size_t>(i)] =
                  right[static_cast<size_t>(i)][static_cast<size_t>(i)] =
                      stones[static_cast<size_t>(i)];
          for (int length = 2; length <= n; ++length) {
              for (int i = 0; i + length <= n; ++i) {
                  const int j = i + length - 1;
                  int l = left[static_cast<size_t>(i)][static_cast<size_t>(j - 1)];
                  int r = right[static_cast<size_t>(i)][static_cast<size_t>(j - 1)];
                  int x = stones[static_cast<size_t>(j)];
                  if (x == r) left[static_cast<size_t>(i)][static_cast<size_t>(j)] = 0;
                  else if (x >= l && x < r) left[static_cast<size_t>(i)][static_cast<size_t>(j)] = x + 1;
                  else if (x > r && x <= l) left[static_cast<size_t>(i)][static_cast<size_t>(j)] = x - 1;
                  else left[static_cast<size_t>(i)][static_cast<size_t>(j)] = x;
                  l = left[static_cast<size_t>(i + 1)][static_cast<size_t>(j)];
                  r = right[static_cast<size_t>(i + 1)][static_cast<size_t>(j)];
                  x = stones[static_cast<size_t>(i)];
                  if (x == l) right[static_cast<size_t>(i)][static_cast<size_t>(j)] = 0;
                  else if (x >= r && x < l) right[static_cast<size_t>(i)][static_cast<size_t>(j)] = x + 1;
                  else if (x > l && x <= r) right[static_cast<size_t>(i)][static_cast<size_t>(j)] = x - 1;
                  else right[static_cast<size_t>(i)][static_cast<size_t>(j)] = x;
              }
          }
          cout << (stones[0] == left[1][static_cast<size_t>(n - 1)] ? 0 : 1) << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2599
external_platform: 洛谷
external_problem_id: P2599
external_title: '[ZJOI2009] 取石子遊戲'
external_relation: original
source_book_pages: [511, 515]
source_pdf_pages: [141, 145]
review_status: verified
---

本題不是一般的「取整堆」區間博弈；補值唯一性才把無限取法壓縮成有限狀態。
