---
id: luogu-p3805
volume: lower
source_file: lower-volume
title: 洛谷 P3805 Manacher：最長迴文子串
chapter: 9
section: '9.2'
kind: external-oj
difficulty: 3
topics: ['Manacher', '迴文', '線性演算法']
prerequisites: ['manacher']
statement: |-
  給定一個字串，求它最長迴文子串的長度。
constraints:
  - '1 <= |s| <= 1.1 * 10^7'
  - s 只含小寫英文字母
input_format: '一行一個由小寫字母組成的字串。'
output_format: '一行一個整數，表示最長迴文子串的長度。'
samples:
  - input: |
      aaabbbabb
    output: |
      5
    explanation: |-
      `abbba` 與 `bbabb` 都是長度 5 的迴文，且不存在更長的迴文子串。
core_knowledge:
  - 插入分隔符可把奇、偶長迴文統一成奇數長度
  - Manacher 以鏡射半徑跳過已知相等區域
  - 最右邊界單調前進，擴張總成本是線性的
judgment: 輸出整個字串中最長的連續迴文子串長度，單一字元也算迴文。
hints:
  - 在字元間插入分隔符並在兩端放不同哨兵，奇、偶長迴文便能用同一種中心表示。
  - 維護目前最靠右迴文的中心 center 與邊界 right；i 在邊界內時先借用鏡射位置的半徑，但不可越過 right。
  - 從借得的半徑繼續擴張並更新 right；所有成功越界擴張只會使 right 右移，最後取最大半徑。
solution_outline: |-
  先把字串改寫成 `^#a#b#...#$` 的形式統一奇偶並加上哨兵。掃描時維護當前最靠右迴文的 center 與 right：若 i < right 先用對稱點的半徑取 min(right − i, radius[2·center − i]) 當起點，再暴力向外擴張；若擴張後超過 right 就更新 center 與 right。答案為最大半徑。
proof_or_invariant: |-
  不變量是「right 是已發現的所有迴文中最靠右的右端點，center 是對應中心」。對稱借用的正確性來自：i 與 2·center − i 關於 center 對稱，在 center 的迴文範圍內兩者的局部結構相同，因此半徑至少為對稱點的半徑與 right − i 的較小者。攤還分析：right 單調不減且上界為 n，每次暴力擴張至少讓 right 前進一格，故總時間 O(n)。
common_errors:
  - 未插分隔符而漏掉偶數長度迴文
  - 借用鏡射半徑時沒有取 min(right-i, mirror)，越過已知範圍
  - 轉換字串位置與原字串長度混淆，答案多算分隔符
complexity:
  time: 'O(n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string text;
      if (!(cin >> text)) { return 0; }

      // 已備好：插入分隔符讓奇偶長度統一成奇數，兩端再加哨兵避免越界判斷。
      string padded = "^";
      for (const char c : text) {
          padded += '#';
          padded += c;
      }
      padded += "#$";
      const size_t n = padded.size();
      vector<int> radius(n, 0);

      // TODO 1：維護當前「最靠右的迴文」的中心 center 與右端 right。
      // TODO 2：對每個 i，若 i < right，可先用對稱位置 2*center - i 的半徑
      //         取 min(right - i, radius[對稱點]) 當作起點，跳過已知相同的部分。
      // TODO 3：再從該起點暴力往外擴張；若擴張後超過 right 就更新 center 與 right。
      //         每次擴張都把 right 往右推，所以總擴張次數是 O(n)。
      // 下面是 O(n^2) 的樸素版本，先確認答案定義再換成上面的做法。
      int best = 0;
      for (size_t i = 1; i + 1 < n; ++i) {
          int reach = 0;
          while (padded[i + static_cast<size_t>(reach) + 1] == padded[i - static_cast<size_t>(reach) - 1]) {
              ++reach;
          }
          radius[i] = reach;
          best = max(best, reach);
      }

      // 答案：最大半徑就是原字串中最長迴文子串的長度。
      cout << best << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // Manacher：在字元間插入分隔符，讓奇偶長度統一成奇數處理。
  // radius[i] 是以 i 為中心的最大回文半徑，答案即 max(radius) - 1。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string text;
      if (!(cin >> text)) { return 0; }
      string padded = "^";
      for (const char c : text) {
          padded += '#';
          padded += c;
      }
      padded += "#$";  // 兩端哨兵讓內層迴圈不必檢查越界

      const size_t n = padded.size();
      vector<int> radius(n, 0);
      int center = 0;
      int right = 0;
      int best = 0;
      for (int i = 1; i + 1 < static_cast<int>(n); ++i) {
          // 利用對稱位置的結果先跳過已知相同的部分。
          if (i < right) {
              radius[static_cast<size_t>(i)] =
                  min(right - i, radius[static_cast<size_t>(2 * center - i)]);
          }
          while (padded[static_cast<size_t>(i + radius[static_cast<size_t>(i)] + 1)] ==
                 padded[static_cast<size_t>(i - radius[static_cast<size_t>(i)] - 1)]) {
              ++radius[static_cast<size_t>(i)];
          }
          if (i + radius[static_cast<size_t>(i)] > right) {
              center = i;
              right = i + radius[static_cast<size_t>(i)];
          }
          best = max(best, radius[static_cast<size_t>(i)]);
      }
      cout << best << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3805
external_platform: 洛谷
external_problem_id: P3805
external_title: '【模板】Manacher'
external_relation: original
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

Manacher 是少數「看起來像暴力但其實線性」的演算法。攤還分析的關鍵在 right 單調不減，理解這點就不會怕它。
