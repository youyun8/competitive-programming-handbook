---
id: luogu-p5535
volume: lower
source_file: lower-volume
title: 洛谷 P5535 小道消息
chapter: 6
section: '6.10'
kind: external-oj
difficulty: 3
topics:
  - 伯特蘭–切比雪夫定理
  - 質數判定
  - 互質
prerequisites:
  - prime-numbers
statement: >-
  有 n 人，編號 i 的衣服數字為 i+1；已知消息者隔天告知所有與其衣服數字互質的人。第 0 天只有第 k 人知道，求所有人都知道所需天數。
constraints:
  - 2 <= n <= 10^14
  - 1 <= k <= n
input_format: >-
  一行兩個正整數 n,k。
output_format: >-
  輸出答案天數。
samples:
  - input: |
      3 1
    output: |
      2
    explanation: >-
      衣服數字 2 先通知 3，再由 3 通知 4，故第 2 天全員得知；官方樣例。
hints:
  - >-
    答案只可能是 1 或 2。
  - >-
    若 k+1 是質數且其兩倍大於 n+1，區間內沒有它的其他倍數，所以它與所有其他衣服數字互質。
  - >-
    其餘情況用伯特蘭–切比雪夫定理可證第二天一定補齊。
core_knowledge:
  - 伯特蘭–切比雪夫定理
  - 質數判定
judgment: >-
  n 雖大，但只需判定單一 k+1 是否為質數，不需模擬 n 個人或建圖。
solution_outline: >-
  試除判定 start=k+1 是否為質數；僅當 start 為質數且 2*start>n+1 時輸出 1，否則輸出 2。
proof_or_invariant: >-
  一日完成等價於 start 與 [2,n+1] 內其餘每個數互質，恰在 start 為質數且範圍內無 2*start 時成立。其他情況第一天可通知一個大於半界的質數；伯特蘭定理保證其存在，該質數第二天與範圍中所有其他數互質，故兩日完成。
common_errors:
  - 把人的編號 k 當成衣服數字而漏加 1
  - 條件誤寫成 2*(k+1)>n
  - 嘗試建立 n 個節點而爆記憶體
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
  static bool is_prime(long long value) {
      if (value == 2) return true;
      if (value < 2 || value % 2 == 0) return false;
      for (long long d = 3; d <= value / d; d += 2)
          if (value % d == 0) return false;
      return true;
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      long long n, k; cin >> n >> k;
      const long long start = k + 1;
      cout << ((is_prime(start) && start * 2 > n + 1) ? 1 : 2) << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5535
external_platform: 洛谷
external_problem_id: 'P5535'
external_title: '[XR-3] 小道消息'
external_relation: original
original_label: '洛谷 P5535'
source_book_pages: [424, 430]
source_pdf_pages: [54, 60]
review_status: verified
---

關鍵是辨認一日完成的精確充要條件。

原始題單中本題位於第 6.10 節、習題 第 4 題；競賽來源記為「XR-3」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
