---
id: luogu-p3805
volume: lower
source_file: lower-volume
title: 洛谷 P3805 Manacher：最長回文子串
chapter: 9
section: '9.2'
kind: external-oj
difficulty: 3
topics: ['Manacher', '回文', '線性演算法']
prerequisites: ['manacher']
statement: |-
  給定一個字串，求它最長回文子串的長度。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '字串長度可達 10^7，必須是 O(n)'
  - '要同時處理奇數長度與偶數長度的回文'
  - '完整限制條件請參閱外部題目頁面'
input_format: '一行一個由小寫字母組成的字串。'
output_format: '一行一個整數，表示最長回文子串的長度。'
samples:
  - input: |
      aaabbbabb
    output: |
      5
    explanation: |-
      最長回文子串有兩個，abbba（位置 3–7）與 bbabb（位置 5–9），長度都是 5；注意兩者一個是奇中心、一個也是奇中心，但若把字串改成 aabb 就會出現偶長度回文，這正是要插入分隔符的原因。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    第一個麻煩是奇偶長度要分開處理。標準技巧是在每兩個字元之間、以及頭尾都插入一個不會出現的分隔符（例如 #），這樣所有回文在新字串裡長度都是奇數，只要處理「以某位置為中心」一種情況。
  - |-
    再在兩端各加一個互不相同的哨兵（例如 ^ 和 $），向外擴張時就永遠不會越界，可以省掉邊界判斷。
  - |-
    核心是維護目前**右端最靠右**的那個回文的中心 center 與右端點 right。處理位置 i 時，若 i < right，就能利用回文的對稱性：i 關於 center 的對稱點是 2·center − i，它的半徑可以直接借用，但不能超過 right − i（超出的部分沒有被已知回文覆蓋，無法保證）。
  - |-
    借用之後再從該起點暴力往外擴張。看起來像 O(n²)，但每次成功擴張都會把 right 往右推，而 right 單調不減且最多走到 n，所以總擴張次數是 O(n)。
  - |-
    最後答案是最大半徑。在「插入分隔符」的表示法下，最大半徑恰好等於原字串中最長回文的長度——這個對應關係值得自己用小例子驗一次，不要死記。
solution_outline: |-
  先把字串改寫成 `^#a#b#...#$` 的形式統一奇偶並加上哨兵。掃描時維護當前最靠右回文的 center 與 right：若 i < right 先用對稱點的半徑取 min(right − i, radius[2·center − i]) 當起點，再暴力向外擴張；若擴張後超過 right 就更新 center 與 right。答案為最大半徑。
proof_or_invariant: |-
  不變量是「right 是已發現的所有回文中最靠右的右端點，center 是對應中心」。對稱借用的正確性來自：i 與 2·center − i 關於 center 對稱，在 center 的回文範圍內兩者的局部結構相同，因此半徑至少為對稱點的半徑與 right − i 的較小者。攤還分析：right 單調不減且上界為 n，每次暴力擴張至少讓 right 前進一格，故總時間 O(n)。
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

      // TODO 1：維護當前「最靠右的回文」的中心 center 與右端 right。
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

      // 答案：最大半徑就是原字串中最長回文子串的長度。
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
