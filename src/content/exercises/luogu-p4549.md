---
id: luogu-p4549
volume: lower
source_file: lower-volume
title: 洛谷 P4549 裴蜀定理：最小可表示正整數
chapter: 6
section: '6.7'
kind: external-oj
difficulty: 2
topics: ['裴蜀定理', 'GCD', '線性丟番圖方程']
prerequisites: ['gcd-lcm']
statement: |-
  給定 n 個整數 a1..an，求最小的正整數 s，使得存在整數 x1..xn 滿足 a1·x1 + ... + an·xn = s。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '係數 xi 可以是任意整數，包含負數與零'
  - '輸入的 ai 可能為負'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行一個整數 n；第二行 n 個整數 a1..an。'
output_format: '一行一個整數，表示能表示出來的最小正整數。'
samples:
  - input: |
      2
      4 6
    output: |
      2
    explanation: |-
      4 與 6 的最大公因數是 2，例如 4×(-1) + 6×1 = 2；而 1 無法表示，因為任何 4x+6y 都是偶數。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    裴蜀定理：對整數 a、b，集合 {ax + by : x, y ∈ ℤ} 恰好等於 gcd(a, b) 的所有倍數。所以能表示的最小正整數就是 gcd(a, b)。
  - |-
    推廣到 n 個數同樣成立：{Σ ai·xi} = gcd(a1, ..., an) 的倍數集合。於是這題就是求所有數的最大公因數。
  - |-
    為什麼 gcd 一定可達？用擴展歐幾裡得可以構造出 ax + by = gcd(a, b) 的一組解。反過來，任何 ax + by 都被 gcd 整除，所以比 gcd 更小的正整數不可能表示出來——上下界一夾就得到答案。
  - |-
    係數可正可負，所以 ai 的正負號完全不影響答案：ai 是負的只要把對應的 xi 取負即可。實作時先取絕對值。
  - |-
    用 `gcd(0, x) = x` 這個性質，把初始值設成 0 再依序 gcd 進去，就不必特判第一個元素。C++17 起 `<numeric>` 直接提供 `std::gcd`。
solution_outline: |-
  答案就是所有 |ai| 的最大公因數。把結果初始化為 0（gcd 的單位元），依序對每個 |ai| 取 gcd 即可。單次 gcd 是 O(log)，整體 O(n log V)。
proof_or_invariant: |-
  裴蜀定理保證 {Σ ai·xi : xi ∈ ℤ} 恰為 gcd(|a1|,...,|an|) 的倍數集合。可達性由擴展歐幾裡得構造，不可達性由「gcd 整除每個 ai，故整除任何線性組合」得出。因此最小正元素就是該 gcd。
complexity:
  time: 'O(n log V)'
  space: 'O(1)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      vector<long long> values(static_cast<size_t>(n));
      for (long long& value : values) { cin >> value; }

      // TODO：裴蜀定理說 a1·x1 + ... + an·xn 取遍的正是 gcd(|a1|,...,|an|) 的所有倍數，
      //       所以最小正整數就是這個 gcd。注意先取絕對值——係數可正可負，
      //       負的 ai 只要把對應的 xi 取負即可，不影響能表示的集合。
      long long result = 0;
      (void)values;

      cout << result << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 裴蜀定理：a1x1+...+anxn 能取到的最小正整數就是 gcd(|a1|, ..., |an|)。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      long long result = 0;
      for (int i = 0; i < n; ++i) {
          long long value;
          cin >> value;
          result = gcd(result, llabs(value));
      }
      cout << result << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4549
external_platform: 洛谷
external_problem_id: P4549
external_title: '【模板】裴蜀定理'
external_relation: original
source_book_pages: [410, 414]
source_pdf_pages: [40, 44]
review_status: verified
---

程式只有幾行，但背後是整個線性丟番圖方程理論的入口。想清楚「上界可構造、下界必整除」的夾擊論證。
