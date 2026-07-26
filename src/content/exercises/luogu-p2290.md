---
id: luogu-p2290
volume: lower
source_file: lower-volume
title: 洛谷 P2290 由度數序列計算標號樹
chapter: 7
section: '7.1'
kind: external-oj
difficulty: 3
topics: [prufer-sequence, labeled-tree, multinomial]
prerequisites: [combinatorics-basics, prime-factorization]
statement: 給定 n 個有標號頂點各自的度數，計算恰好符合此度數序列的不同無根樹數量。
constraints:
  - 1 <= n <= 150
  - 正確答案不超過 10^17
input_format: 第一行為 n；第二行依序給出 n 個頂點的度數 d_i。
output_format: 輸出符合條件的標號樹數量；不存在則輸出 0。
samples:
  - input: |
      4
      1 1 2 2
    output: '2'
    explanation: Prüfer 序列長度為 2，頂點 3、4 各出現一次，只有 [3,4] 與 [4,3]。
core_knowledge:
  - 頂點 i 在 Prüfer 序列中恰出現 d_i-1 次
  - 固定各符號次數的序列數是多項式係數
judgment: 頂點帶有 1 到 n 的標號；邊集合不同即為不同樹。
hints:
  - 先檢查 n>1 時每個度數至少為 1，且度數總和必須是 2(n-1)。
  - 標號樹與長度 n-2 的 Prüfer 序列一一對應，頂點 i 出現 d_i-1 次。
  - 答案為 (n-2)!/Π(d_i-1)!；可累計各質數在階乘中的指數，避免中間階乘溢位。
solution_outline: 特判 n=1；驗證度數後，對每個不超過 n 的質數計算 (n-2)! 與各 (d_i-1)! 的指數差，再把質數冪乘回答案。
proof_or_invariant: >-
  Prüfer 雙射中，每刪除一次葉子就記錄其鄰點，因此頂點 i 被記錄的次數正是其度數減一。
  所以合法樹恰對應於含 d_i-1 個符號 i 的所有序列；多重集合排列數即所列多項式係數。
  度數檢查則正好保證符號總數為 n-2 且沒有負次數。
common_errors:
  - 忽略 n=1、d_1=0 的唯一空邊樹
  - 只檢查度數總和，未排除 n>1 時度數為 0
  - 直接計算 148! 導致溢位後再除法
complexity:
  time: O(n^2 / log n)
  space: O(n)
cpp_skeleton: |
  #include <iostream>
  #include <vector>
  using namespace std;

  static int factorial_prime_exponent(int value, int prime) {
      int result = 0;
      while (value > 0) {
          value /= prime;
          result += value;
      }
      return result;
  }

  int main() {
      int n;
      cin >> n;
      vector<int> degree(static_cast<size_t>(n));
      for (int& value : degree) { cin >> value; }
      // TODO：驗證度數，並以 Prüfer 序列的多項式係數計算答案。
      (void)factorial_prime_exponent;
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;

  static int factorial_prime_exponent(int value, int prime) {
      int result = 0;
      while (value > 0) {
          value /= prime;
          result += value;
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<int> degree(static_cast<size_t>(n));
      long long degree_sum = 0;
      for (int& value : degree) {
          cin >> value;
          degree_sum += value;
      }
      if (n == 1) {
          cout << (degree[0] == 0 ? 1 : 0) << '\n';
          return 0;
      }
      for (int value : degree) {
          if (value == 0) {
              cout << 0 << '\n';
              return 0;
          }
      }
      if (degree_sum != 2LL * (n - 1)) {
          cout << 0 << '\n';
          return 0;
      }
      vector<bool> is_prime(static_cast<size_t>(n) + 1U, true);
      is_prime[0] = false;
      is_prime[1] = false;
      for (int value = 2; value * value <= n; ++value) {
          if (!is_prime[static_cast<size_t>(value)]) { continue; }
          for (int multiple = value * value; multiple <= n; multiple += value) {
              is_prime[static_cast<size_t>(multiple)] = false;
          }
      }
      long long answer = 1;
      for (int prime = 2; prime <= n; ++prime) {
          if (!is_prime[static_cast<size_t>(prime)]) { continue; }
          int exponent = factorial_prime_exponent(n - 2, prime);
          for (int value : degree) {
              exponent -= factorial_prime_exponent(value - 1, prime);
          }
          while (exponent-- > 0) { answer *= prime; }
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2290
external_platform: 洛谷
external_problem_id: P2290
external_title: '[HNOI2004] 樹的計數'
external_relation: original
source_book_pages: [463, 467]
source_pdf_pages: [93, 97]
review_status: verified
---

Prüfer 序列把樹的度數限制精確轉成符號出現次數，問題因此化為一個多重集合排列。
