---
id: luogu-p2261
volume: lower
source_file: lower-volume
title: 洛谷 P2261 餘數求和
chapter: 6
section: '6.14'
kind: external-oj
difficulty: 3
topics:
  - 整除分塊
  - 等差數列
prerequisites:
  - divisor-summation
statement: >-
  給定 n,k，計算 sum_{i=1}^n (k mod i)。
constraints:
  - 1 <= n,k <= 10^9
input_format: >-
  一行兩個整數 n,k。
output_format: >-
  輸出餘數和。
samples:
  - input: |
      10 5
    output: |
      29
    explanation: >-
      各項為 0,1,2,1,0,5,5,5,5,5，總和 29；官方樣例。
hints:
  - >-
    k mod i = k-i*floor(k/i)。
  - >-
    floor(k/i) 在一段連續 i 上相同，右端點為 k/floor(k/i)。
  - >-
    區間 i 的總和用 (l+r)(r-l+1)/2，並處理 i>k 時商為 0。
core_knowledge:
  - 整除分塊
  - 餘數恆等式
judgment: >-
  n,k 到十億，線性枚舉不可行；商值只有 O(sqrt(k)) 段。
solution_outline: >-
  答案先設 n*k；對商相同的每個區塊 [l,r]，減去 floor(k/l)*sum(l..r)。
proof_or_invariant: >-
  代入餘數恆等式後逐項相等。整除分塊只把相同商的連續項合併，等差和精確等於原區段 i 的總和，因此不改變總值。
common_errors:
  - 商為 0 時仍計算 k/quotient
  - 區間右端點未限制 n
  - 等差和乘法使用 32 位元
complexity:
  time: O(sqrt(k))
  space: O(1)
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
  static long long range_sum(long long left, long long right) {
      const long long count = right - left + 1;
      return count % 2 == 0 ? count / 2 * (left + right) : count * ((left + right) / 2);
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      long long n, k; cin >> n >> k;
      long long answer = n * k;
      for (long long left = 1; left <= n;) {
          const long long quotient = k / left;
          if (quotient == 0) break;
          const long long right = min(n, k / quotient);
          answer -= quotient * range_sum(left, right);
          left = right + 1;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2261
external_platform: 洛谷
external_problem_id: 'P2261'
external_title: '[CQOI2007] 餘數求和'
external_relation: original
original_label: '洛谷 P2261'
source_book_pages: [442, 446]
source_pdf_pages: [72, 76]
review_status: verified
---

整除分塊最直接的入門模型。

原始題單中本題位於第 6.14 節、習題 第 2 題；競賽來源記為「CQOI2007」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
