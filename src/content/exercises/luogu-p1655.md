---
id: luogu-p1655
volume: lower
source_file: lower-volume
title: 洛谷 P1655 相異球放入相同非空盒
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 3
topics: [stirling-number-second-kind, arbitrary-precision]
prerequisites: [catalan-stirling]
statement: 對每組 N、M，計算把 N 個彼此不同的球分入 M 個彼此相同的盒子，且每盒非空的方案數。
constraints:
  - 1 <= N,M <= 100
  - 每個檔案至多 10 組資料
  - 輸入讀到 EOF
input_format: 多組資料，每行兩個整數 N、M，讀到 EOF。
output_format: 每組輸出一行完整方案數。
samples:
  - input: '3 2'
    output: '3'
    explanation: 三顆相異球分成一顆與兩顆的兩個無標號盒，單獨的球有三種選擇。
core_knowledge:
  - 此方案數正是第二類 Stirling 數 S(N,M)
  - 依最後一顆球是否獨立成盒得到標準遞推
judgment: 球可區分、盒不可區分；只交換兩盒不形成新方案。
hints:
  - 加入第 N 顆球時，它可以單獨形成新盒，留下 S(N-1,M-1)。
  - 否則把它放進既有 M 盒之一，貢獻 M·S(N-1,M)。
  - 預處理 S(n,m)=S(n-1,m-1)+mS(n-1,m)，並用任意精度整數。
solution_outline: 以 S(0,0)=1 建立到 100 的第二類 Stirling 數表，之後每組詢問直接輸出。
proof_or_invariant: >-
  依第 N 顆球所在盒是否只有它一顆，所有劃分唯一分成兩類。單獨時刪除該盒得到
  S(N-1,M-1)；非單獨時先劃分前 N-1 顆，再選 M 個既有盒之一。兩類互斥且完整。
common_errors:
  - 把盒視為有標號而多乘 M!
  - 使用第一類 Stirling 數
  - N<M 時未輸出 0
complexity:
  time: 預處理 O(100²)，每組 O(1)
  space: O(100²) 個大整數
cpp_skeleton: |
  #include <boost/multiprecision/cpp_int.hpp>
  #include <iostream>
  using namespace std;
  using boost::multiprecision::cpp_int;
  int main() {
      // TODO：預處理第二類 Stirling 數表，再讀到 EOF。
      return 0;
  }
cpp_solution: |
  #include <boost/multiprecision/cpp_int.hpp>
  #include <iostream>
  #include <vector>
  using namespace std;
  using boost::multiprecision::cpp_int;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      constexpr int limit = 100;
      vector<vector<cpp_int>> stirling(static_cast<size_t>(limit) + 1U,
                                       vector<cpp_int>(static_cast<size_t>(limit) + 1U));
      stirling[0][0] = 1;
      for (int balls = 1; balls <= limit; ++balls) {
          for (int boxes = 1; boxes <= balls; ++boxes) {
              stirling[static_cast<size_t>(balls)][static_cast<size_t>(boxes)] =
                  stirling[static_cast<size_t>(balls - 1)][static_cast<size_t>(boxes - 1)] +
                  boxes * stirling[static_cast<size_t>(balls - 1)][static_cast<size_t>(boxes)];
          }
      }
      int balls, boxes;
      while (cin >> balls >> boxes) {
          cout << stirling[static_cast<size_t>(balls)][static_cast<size_t>(boxes)] << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1655
external_platform: 洛谷
external_problem_id: P1655
external_title: 小朋友的球
external_relation: original
source_book_pages: [486, 491]
source_pdf_pages: [116, 121]
review_status: verified
---

「相異元素分進無標號非空組」就是第二類 Stirling 數最直接的組合意義。
