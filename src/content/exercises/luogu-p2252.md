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
constraints:
  - '0 <= a,b <= 10^9'
  - '每次必須取至少一顆石子'
input_format: '一行兩個整數 a 與 b，表示兩堆石子的數量。'
output_format: '先手必敗輸出 0，先手必勝輸出 1。'
samples:
  - input: |
      8 4
    output: |
      1
    explanation: (4,8) 不是奇異局勢；先手可取走大堆的一顆，走到必敗局面 (4,7)。
core_knowledge:
  - 威佐夫博弈的 P 局面由兩條互補 Beatty 序列刻畫
  - 排序兩堆後只需以堆差定位唯一候選 P 局面
judgment: 輸出 0 表示先手必敗，輸出 1 表示先手存在必勝策略。
hints:
  - 小規模必敗局面依序是 (0,0)、(1,2)、(3,5)、(4,7)、(6,10)；觀察兩堆差恰為 0、1、2、3、4。
  - 第 k 個必敗局面是 (floor(kφ),floor(kφ)+k)，其中 φ=(1+sqrt(5))/2。
  - 將兩堆排序，令 k=b-a；若 floor(kφ)=a 就是必敗局面，否則先手必勝。
solution_outline: |-
  把兩堆排序使 a ≤ b。令 k = b − a，計算 ⌊k·φ⌋ 其中 φ = (1+√5)/2。若結果等於 a 則當前是奇異局勢、先手必敗輸出 0，否則輸出 1。
proof_or_invariant: |-
  奇異局勢集合 {(⌊kφ⌋, ⌊kφ⌋+k)} 滿足 P 局面的兩個條件：(1) 由奇異局勢出發的任何合法走法都會離開該集合；(2) 任何非奇異局勢都存在一步走進該集合。這兩點分別由 Beatty 序列的互補性與稠密性給出，因此該集合恰為必敗局面全體。
common_errors:
  - 未先交換兩堆使 a<=b
  - 把 k 誤設為較小堆，而不是兩堆之差
  - 以四捨五入代替 floor 計算 Beatty 序列
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
