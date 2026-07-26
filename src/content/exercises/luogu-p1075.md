---
id: luogu-p1075
volume: lower
source_file: lower-volume
title: 洛谷 P1075 質因數分解
chapter: 6
section: '6.10'
kind: external-oj
difficulty: 1
topics:
  - 質因數分解
  - 試除法
prerequisites:
  - prime-numbers
statement: >-
  已知正整數 n 是兩個不同質數的乘積，輸出兩者中較大的質數。
constraints:
  - 1 <= n <= 2 * 10^9
  - n 保證為兩個不同質數的乘積
input_format: >-
  一行一個正整數 n。
output_format: >-
  輸出較大的質因數。
samples:
  - input: |
      21
    output: |
      7
    explanation: >-
      21=3*7，較大的質因數是 7；官方樣例。
hints:
  - >-
    兩個因數中至少一個不大於 sqrt(n)。
  - >-
    從 2 往上找第一個能整除 n 的數，它就是較小質因數。
  - >-
    找到小因數 d 後，答案直接是 n/d。
core_knowledge:
  - 質因數分解
  - 合數的平方根界
judgment: >-
  題目保證只有兩個不同質因數，因此找到最小因數後不必繼續完整分解。
solution_outline: >-
  由小到大試除至平方根，找到第一個因數 d 便輸出 n/d。
proof_or_invariant: >-
  題目保證 n=pq 且 p<q。由 p<=sqrt(n)，試除一定先找到 p；因此 n/p=q 正是較大質數。
common_errors:
  - 錯把 n 本身當作答案
  - 試除終點漏掉平方根
  - 未使用足以容納 2*10^9 的型別
complexity:
  time: O(sqrt(n))
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
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      long long n; cin >> n;
      for (long long divisor = 2; divisor <= n / divisor; ++divisor) {
          if (n % divisor == 0) { cout << n / divisor << '\n'; return 0; }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1075
external_platform: 洛谷
external_problem_id: 'P1075'
external_title: '[NOIP 2012 普及組] 質因數分解'
external_relation: original
original_label: '洛谷 P1075'
source_book_pages: [424, 430]
source_pdf_pages: [54, 60]
review_status: verified
---

保證條件讓完整質因數分解退化成一次試除。

原始題單中本題位於第 6.10 節、習題 第 2 題；競賽來源記為「NOIP 2012 普及組」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
