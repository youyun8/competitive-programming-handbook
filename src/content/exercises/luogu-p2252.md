---
id: luogu-p2252
volume: lower
source_file: lower-volume
title: 洛谷 P2252 威佐夫博弈：兩堆石子的必敗局面
chapter: 7
section: '7.9'
kind: external-oj
difficulty: 3
topics: ['威佐夫博弈', '公平組合遊戲', '黃金比例', 'Beatty 序列']
prerequisites: ['combinatorial-game']
statement: |-
  兩堆石子，兩人輪流取，每次可以從一堆取任意多顆，或從兩堆取同樣多顆，取走最後一顆者獲勝。判斷先手是否必勝。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '石子數可達 10^9 等級，不能建表或搜尋'
  - '需要用到黃金比例，浮點精度要留意'
  - '完整限制條件請參閱外部題目頁面'
input_format: '一行兩個整數 a 與 b，表示兩堆石子的數量。'
output_format: '先手必敗輸出 0，先手必勝輸出 1。'
samples:
  - input: |
      8 4
    output: |
      1
    explanation: |-
      (4, 8) 不是奇異局勢，先手可以走到 (4, 7)——因為 ⌊3·φ⌋ = 4，(4, 7) 正是奇異局勢，於是後手陷入必敗。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    先用小規模的搜尋把必敗局面（P 局面）列出來：(0,0)、(1,2)、(3,5)、(4,7)、(6,10)、(8,13)…。觀察兩堆的差：0, 1, 2, 3, 4, 5…，而較小的那堆是 0, 1, 3, 4, 6, 8…。
  - |-
    這組數列有封閉形式：第 k 個必敗局面是 a_k = ⌊k·φ⌋、b_k = a_k + k，其中 φ = (1+√5)/2 是黃金比例。
  - |-
    所以判斷方法是：把兩堆排序使 a ≤ b，令 k = b − a，檢查 ⌊k·φ⌋ 是否等於 a。相等就是必敗局面（輸出 0），否則先手必勝（輸出 1）。
  - |-
    為什麼是黃金比例？因為 (⌊kφ⌋) 與 (⌊kφ²⌋) 構成一組互補的 Beatty 序列——每個正整數恰好出現在其中一個數列裡一次。這正好對應「每個數字恰好當一次某個必敗局面的小堆」。
  - |-
    證明思路分兩半：任何非奇異局勢都存在一步走到某個奇異局勢（必勝），而奇異局勢的任何一步都會離開奇異局勢（必敗）。這是所有 P/N 局面論證的標準結構。
solution_outline: |-
  把兩堆排序使 a ≤ b。令 k = b − a，計算 ⌊k·φ⌋ 其中 φ = (1+√5)/2。若結果等於 a 則當前是奇異局勢、先手必敗輸出 0，否則輸出 1。
proof_or_invariant: |-
  奇異局勢集合 {(⌊kφ⌋, ⌊kφ⌋+k)} 滿足 P 局面的兩個條件：(1) 由奇異局勢出發的任何合法走法都會離開該集合；(2) 任何非奇異局勢都存在一步走進該集合。這兩點分別由 Beatty 序列的互補性與稠密性給出，因此該集合恰為必敗局面全體。
complexity:
  time: 'O(1)'
  space: 'O(1)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      long long a, b;
      if (!(cin >> a >> b)) { return 0; }
      if (a > b) { swap(a, b); }

      // TODO：威佐夫博弈的必敗局面（奇異局勢）為
      //     a_k = ⌊k·φ⌋，b_k = a_k + k，其中 φ = (1+√5)/2 是黃金比例。
      //   因此把兩堆排序後，令 k = b − a，檢查 ⌊k·φ⌋ 是否等於 a：
      //     相等 -> 先手必敗，輸出 0；否則先手必勝，輸出 1。
      //   φ 用 sqrt(5.0) 算即可；先手必勝的證明思路是「任何非奇異局勢
      //   都能一步走到某個奇異局勢，而奇異局勢的任何一步都會離開奇異局勢」。
      (void)a;
      (void)b;
      cout << 1 << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 威佐夫博弈：先手必敗的局面（奇異局勢）恰為
  //   a_k = ⌊k·φ⌋、b_k = a_k + k，其中 φ = (1+√5)/2。
  // 因此把兩堆排序後，檢查 ⌊(b−a)·φ⌋ 是否等於 a 即可。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      long long a, b;
      if (!(cin >> a >> b)) { return 0; }
      if (a > b) { swap(a, b); }
      const double golden = (sqrt(5.0) + 1.0) / 2.0;
      const long long expected = static_cast<long long>(static_cast<double>(b - a) * golden);
      cout << (expected == a ? 0 : 1) << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2252
external_platform: 洛谷
external_problem_id: P2252
external_title: '【模板】威佐夫博弈 / [SHOI2002] 取石子遊戲'
external_relation: original
source_book_pages: [504, 509]
source_pdf_pages: [134, 139]
review_status: verified
---

威佐夫博弈是「先打表找規律、再證明封閉形式」的典範。遇到陌生的公平組合遊戲，先寫個暴力搜尋列出 P 局面永遠是對的第一步。
