---
id: luogu-p3172
volume: lower
source_file: lower-volume
title: 洛谷 P3172 選數
chapter: 6
section: '6.16'
kind: external-oj
difficulty: 4
topics:
  - 莫比烏斯反演
  - 容斥
  - 快速冪
prerequisites:
  - mobius-inversion
statement: >-
  從整數區間 [L,H] 有序且可重複地選 N 個數，求這 N 個數的 gcd 恰為 K 的方案數，模 10^9+7。
constraints:
  - 1 <= N,K <= 10^9
  - 1 <= L <= H <= 10^9
  - H-L <= 10^5
input_format: >-
  一行 N,K,L,H。
output_format: >-
  輸出方案數模 10^9+7。
samples:
  - input: |
      2 2 2 4
    output: |
      3
    explanation: >-
      符合者為 (2,2),(2,4),(4,2)，共 3 組；官方樣例。
hints:
  - >-
    先把區間縮放為 [ceil(L/K),floor(H/K)]，目標 gcd=1。
  - >-
    扣掉所有元素相同的方案後，任一 gcd 大於區間寬度的方案都不可能含兩個不同值。
  - >-
    只需對 d<=R-L 做倍數容斥；最後若縮放區間含 1，再補上全選 1。
core_knowledge:
  - GCD 容斥
  - 區間縮放
judgment: >-
  H 本身很大，但 H-L 小；扣除全相同方案後，gcd 上界縮到區間寬度。
solution_outline: >-
  設 width=R-L。f[d]=區間內 d 倍數個數的 N 次方減去全相同方案數；由大到小減去 f 的倍數得到 gcd 恰為 d 且不全同的方案。答案 f[1]，若 L=1 加回全 1。
proof_or_invariant: >-
  不全相同的序列至少含兩個相異值，其 gcd 不超過兩值之差，故不超過 R-L；容斥範圍完整。每個序列依 gcd 唯一歸類，倒序減倍數得到恰值。全相同且 gcd=1 只有全 1。
common_errors:
  - L 除以 K 時未向上取整
  - 忘記全選 1 的方案
  - width=0 時存取不存在的 exact[1]
complexity:
  time: O((H-L) log(H-L) + log N)
  space: O(H-L)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依照三個提示完成演算法；先保留可編譯的輸入輸出骨架。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  static constexpr long long kMod = 1000000007;
  static long long power_mod(long long base, long long exponent) {
      long long result = 1;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) result = result * base % kMod;
          base = base * base % kMod; exponent >>= 1LL;
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      long long n, k, low, high; cin >> n >> k >> low >> high;
      low = (low + k - 1) / k; high /= k;
      if (low > high) { cout << "0\n"; return 0; }
      const int width = static_cast<int>(high - low);
      vector<long long> exact(static_cast<size_t>(width) + 1, 0);
      for (int divisor = 1; divisor <= width; ++divisor) {
          const long long count = high / divisor - (low - 1) / divisor;
          exact[static_cast<size_t>(divisor)] = (power_mod(count, n) - count + kMod) % kMod;
      }
      for (int divisor = width; divisor >= 1; --divisor)
          for (int multiple = divisor * 2; multiple <= width; multiple += divisor)
              exact[static_cast<size_t>(divisor)] =
                  (exact[static_cast<size_t>(divisor)] - exact[static_cast<size_t>(multiple)] + kMod) % kMod;
      long long answer = width == 0 ? 0 : exact[1];
      if (low == 1) answer = (answer + 1) % kMod;
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3172
external_platform: 洛谷
external_problem_id: 'P3172'
external_title: '[CQOI2015] 選數'
external_relation: original
original_label: '洛谷 P3172'
source_book_pages: [450, 456]
source_pdf_pages: [80, 86]
review_status: verified
---

這題有杜教篩解法，但窄區間條件也能導出更直接的有限容斥。

原始題單中本題位於第 6.16 節、習題 第 1 題；競賽來源記為「CQOI2015」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
