---
volume: lower
source_file: lower-volume
source_book_pages: [387, 461]
source_pdf_pages: [17, 91]
chapter: 6
section: '6.3'
kind: external-oj
review_status: verified
external_relation: original
id: luogu-p1306
title: 洛谷 P1306 斐波那契公約數
difficulty: 3
topics:
  - 費波那契恆等式
  - 最大公因數
  - 快速倍增
prerequisites:
  - 歐幾里得算法
  - 費波那契數列
statement: 令 F_1=F_2=1。給定 n、m，求 gcd(F_n,F_m) 的末八位，即對 100000000 取模。
constraints:
  - 1 <= n,m <= 1000000000
input_format: 一行兩個正整數 n、m。
output_format: 輸出 gcd(F_n,F_m) mod 100000000，不補前導零。
samples:
  - input: |
      4 7
    output: |
      1
    explanation: F_4=3、F_7=13，兩者互質。
core_knowledge:
  - gcd(F_n,F_m)=F_gcd(n,m)
  - 費波那契快速倍增
judgment: F_n 本身極大，不能建立後再求 gcd；先把問題化為索引的 gcd，再只計算該費波那契值的模。
hints:
  - 觀察費波那契數列的整除性：若 d 整除 n，F_d 也整除 F_n。
  - 更強的恆等式是 gcd(F_n,F_m)=F_gcd(n,m)，先對索引做歐幾里得算法。
  - 用快速倍增同時計算 F_k、F_{k+1}，每層把索引減半並全程模 10^8。
solution_outline: 計算 g=gcd(n,m)，再以費波那契快速倍增遞迴求 F_g mod 100000000。
proof_or_invariant: 費波那契加法公式與相鄰項互質可模擬歐幾里得算法，得到 gcd(F_n,F_m)=F_gcd(n,m)。快速倍增公式由加法公式導出，遞迴回傳的配對始終為 (F_k,F_{k+1})，故答案正確。
complexity:
  time: O(log min(n,m))
  space: O(log min(n,m)) 遞迴堆疊
common_errors:
  - 直接計算巨大 F_n 與 F_m
  - 誤把答案模數寫成 10^9+7
  - 固定輸出八位而補前導零
cpp_skeleton: |-
  #include <bits/stdc++.h>
  using namespace std;

  static const long long kMod = 100000000;

  static pair<long long, long long> fibonacci(long long n) {
      if (n == 0) { return {0, 1}; }
      const auto half = fibonacci(n / 2);
      const long long first = half.first;
      const long long second = half.second;
      const long long twice_second = (2 * second) % kMod;
      const long long c = first * ((twice_second - first + kMod) % kMod) % kMod;
      const long long d = (first * first + second * second) % kMod;
      if ((n & 1LL) != 0) { return {d, (c + d) % kMod}; }
      return {c, d};
  }

  // TODO：依提示重建狀態轉移與快速冪；目前保留可編譯框架。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      long long n, m;
      if (!(cin >> n >> m)) { return 0; }
      cout << fibonacci(gcd(n, m)).first << '\n';
      return 0;
  }
cpp_solution: |-
  #include <bits/stdc++.h>
  using namespace std;

  static const long long kMod = 100000000;

  static pair<long long, long long> fibonacci(long long n) {
      if (n == 0) { return {0, 1}; }
      const auto half = fibonacci(n / 2);
      const long long first = half.first;
      const long long second = half.second;
      const long long twice_second = (2 * second) % kMod;
      const long long c = first * ((twice_second - first + kMod) % kMod) % kMod;
      const long long d = (first * first + second * second) % kMod;
      if ((n & 1LL) != 0) { return {d, (c + d) % kMod}; }
      return {c, d};
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      long long n, m;
      if (!(cin >> n >> m)) { return 0; }
      cout << fibonacci(gcd(n, m)).first << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1306
external_platform: Luogu
external_problem_id: P1306
external_title: 斐波那契公約數
---

先在索引上求 gcd，是避免接觸巨大費波那契整數的關鍵。
