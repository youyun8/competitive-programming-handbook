---
id: luogu-p5520
volume: lower
source_file: lower-volume
title: 洛谷 P5520 不相鄰幼苗排列
chapter: 7
section: '7.1'
kind: external-oj
difficulty: 2
topics: [permutation, gap-method, modular-arithmetic]
prerequisites: [combinatorics-basics]
statement: >-
  有 n 個排成一列的位置與 m 株彼此可區分的櫻花幼苗。每個位置至多種一株，
  且任意兩株幼苗不能相鄰。求種完全部幼苗的方案數對 p 取模；位置或幼苗編號不同即為不同方案。
constraints:
  - 1 <= n <= 2000000
  - 1 <= m <= 1000000
  - 1 <= m <= ceil(n/2)
  - 1 <= p <= 1000000000，p 不保證為質數
  - 輸入的 type 僅標示子任務，不影響答案
input_format: 一行四個整數 type、n、m、p。
output_format: 輸出合法方案數對 p 取模的結果。
samples:
  - input: '3 3 2 10007'
    output: '2'
    explanation: 兩株幼苗只能佔位置 1、3，而兩株編號的排列次序有兩種。
core_knowledge:
  - 先消除相鄰限制再排列相異物件
  - 合併 C(n-m+1,m) 與 m! 可避免模逆元
judgment: 幼苗彼此有編號；交換兩株幼苗即形成不同方案。
hints:
  - 暫時只看哪些位置被種，將每株幼苗右側（最後一株除外）保留一個必空位置。
  - 不相鄰位置集合數為 C(n-m+1,m)，選定位置後 m 株相異幼苗有 m! 種排列。
  - 兩式相乘可約成連續 m 個整數：(n-2m+2)(n-2m+3)...(n-m+1)，不需對任意 p 求逆元。
solution_outline: 設 start=n-2m+2，依序把 start 到 n-m+1 共 m 個整數乘入答案，每步對 p 取模；type 不參與計算。
proof_or_invariant: >-
  對遞增的種植位置 x_i，映射 y_i=x_i-(i-1)，便得到從 1..n-m+1 任選 m 個位置的雙射，
  所以位置集合有 C(n-m+1,m) 種。每個集合可任意放置 m 株相異幼苗，共乘 m!；
  乘積等於 (n-m+1)!/(n-2m+1)!，即演算法乘入的連續整數。全程只有乘法，
  因此 p 是否為質數都不影響正確性。
common_errors:
  - 只算位置集合而漏乘幼苗排列數 m!
  - 對組合數使用費馬逆元，但 p 可能是合數
  - 把 type 當成公式的一部分
complexity:
  time: O(m)
  space: O(1)
cpp_skeleton: |
  #include <cstdint>
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int type, n, m;
      int64_t p;
      cin >> type >> n >> m >> p;
      // TODO：乘入化簡後的 m 個連續整數。
      (void)type;
      (void)n;
      (void)m;
      (void)p;
      return 0;
  }
cpp_solution: |
  #include <cstdint>
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int type, n, m;
      int64_t p;
      cin >> type >> n >> m >> p;
      (void)type;
      int64_t answer = 1 % p;
      const int first_factor = n - 2 * m + 2;
      const int last_factor = n - m + 1;
      for (int factor = first_factor; factor <= last_factor; ++factor) {
          answer = answer * factor % p;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5520
external_platform: 洛谷
external_problem_id: P5520
external_title: '[yLOI2019] 青原櫻'
external_relation: original
source_book_pages: [463, 467]
source_pdf_pages: [93, 97]
review_status: verified
---

把「選不相鄰位置」與「排列相異幼苗」合併化簡，不但線性可算，也避開了合數模數下不存在逆元的陷阱。
