---
id: luogu-p3935
volume: lower
source_file: lower-volume
title: 洛谷 P3935 Calculating
chapter: 6
section: '6.14'
kind: external-oj
difficulty: 3
topics:
  - 整除分塊
  - 約數函數
  - 前綴差
prerequisites:
  - divisor-summation
statement: >-
  令 f(x) 為 x 的正約數個數，求 sum_{i=l}^r f(i) mod 998244353。
constraints:
  - 1 <= l <= r <= 10^12（官方資料表上界）
input_format: >-
  一行兩個整數 l,r。
output_format: >-
  輸出區間約數個數和模 998244353。
samples:
  - input: |
      2 4
    output: |
      7
    explanation: >-
      f(2),f(3),f(4) 分別為 2,2,3，總和 7；可信題面存檔樣例。
hints:
  - >-
    把每個數的約數逐一計數，交換枚舉順序。
  - >-
    S(n)=sum_{x<=n}f(x)=sum_{d=1}^n floor(n/d)。
  - >-
    用整除分塊算 S(r)-S(l-1)，每步都取模。
core_knowledge:
  - 約數函數前綴和
  - 整除分塊
judgment: >-
  f(x) 的質因數公式不是計算方向；交換約數枚舉後只剩 floor 和。
solution_outline: >-
  函式 prefix(n) 依商值分塊，累加 (right-left+1)*(n/left)；答案為兩個前綴差。
proof_or_invariant: >-
  每一對 (d,x) 且 d|x、x<=n 對 S(n) 貢獻一次。固定 d 時合法 x 為 d,2d,...，數量 floor(n/d)，故換序公式成立；前綴相減留下 [l,r]。
common_errors:
  - 誤把 f(x) 當約數和而非約數個數
  - 前綴差漏掉 l-1
  - 相減後未做非負正規化
complexity:
  time: O(sqrt(r))
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
  static constexpr long long kMod = 998244353;
  static long long prefix(long long n) {
      long long result = 0;
      for (long long left = 1; left <= n;) {
          const long long quotient = n / left;
          const long long right = n / quotient;
          result = (result + (right - left + 1) % kMod * (quotient % kMod)) % kMod;
          left = right + 1;
      }
      return result;
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      long long left, right; cin >> left >> right;
      cout << (prefix(right) - prefix(left - 1) + kMod) % kMod << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3935
external_platform: 洛谷
external_problem_id: 'P3935'
external_title: 'Calculating'
external_relation: original
original_label: '洛谷 P3935'
source_book_pages: [442, 446]
source_pdf_pages: [72, 76]
review_status: verified
---

先換序，再分塊，是數論求和常見的兩段式推導。

原始題單中本題位於第 6.14 節、習題 第 3 題；競賽來源記為「未標示」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
