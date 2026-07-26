---
id: luogu-p3978
volume: lower
source_file: lower-volume
title: 洛谷 P3978 隨機二元樹的葉數期望
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 4
topics: [catalan-number, expectation, double-counting]
prerequisites: [catalan-stirling]
statement: 從所有具有 n 個節點、左右子樹有別的有根二元樹形態中等機率選一棵，求葉節點數的期望。
constraints:
  - 1 <= n <= 1000000000
input_format: 一個正整數 n。
output_format: 輸出期望，絕對或相對誤差小於 1e-9。
samples:
  - input: '1'
    output: '1.000000000000'
    explanation: 唯一的樹只有根，根也是葉節點。
  - input: '3'
    output: '1.200000000'
    explanation: 五種有序二元樹共有六個葉節點，期望為 6/5。
core_knowledge: [二元樹形態數是 Catalan 數, 刪葉與加葉的雙重計數]
judgment: 左、右子樹的位置有別；題目的同構判定不容許交換左右兒子。
hints:
  - 設 f_n 為樹形態數、g_n 為所有形態的葉數總和。
  - 對每棵 n 節點樹逐一刪除其葉；反向看每棵 n-1 節點樹有恰好 n 種加葉方式。
  - 因此 g_n=n f_(n-1)，再代入 Catalan 相鄰項比值。
solution_outline: 化簡 g_n/f_n=n·Cat_(n-1)/Cat_n=n(n+1)/(2(2n-1))，以 long double 計算。
proof_or_invariant: 將一棵 n 節點樹標記一片待刪葉，刪除後得到 n-1 節點樹；反之，每棵 n-1 節點樹的空兒子位置共有 n 個，接一片新葉即可唯一還原。故配對總數 g_n=n f_(n-1)，代入 Catalan 公式即得期望。
common_errors: [把無序二元樹當作題目樣本空間, 整數除法截斷, 中間 2n 使用 32 位元溢位]
complexity: { time: 'O(1)', space: 'O(1)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { long long n; cin >> n; /* TODO: 輸出化簡後公式。 */ return 0; }
cpp_solution: |
  #include <iomanip>
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      long long n;
      cin >> n;
      const long double value =
          static_cast<long double>(n) * static_cast<long double>(n + 1) /
          (2.0L * static_cast<long double>(2 * n - 1));
      cout << fixed << setprecision(12) << value << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3978
external_platform: 洛谷
external_problem_id: P3978
external_title: '[TJOI2015] 概率論'
external_relation: original
source_book_pages: [486, 491]
source_pdf_pages: [116, 121]
review_status: verified
---

雙重計數先消去巨大的 Catalan 數，使十億級 n 只需常數時間。
