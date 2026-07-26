---
id: luogu-p3197
volume: lower
source_file: lower-volume
title: 洛谷 P3197 相鄰同類的排列計數
chapter: 7
section: '7.1'
kind: external-oj
difficulty: 2
topics: [complement-counting, fast-power, combinatorics]
prerequisites: [combinatorics-basics, fast-power]
statement: >-
  一列有 n 個房間，每房一人；每人可信仰 m 種宗教之一。只要至少一對相鄰房間信仰相同，
  該狀態就可能發生越獄。求可能越獄的信仰配置數，答案對 100003 取模。
constraints:
  - 1 <= m <= 100000000
  - 1 <= n <= 1000000000000
input_format: 一行兩個整數 m、n，依序為宗教種類數與房間數。
output_format: 輸出可能越獄的配置數對 100003 取模的結果。
samples:
  - input: '2 3'
    output: '6'
    explanation: 八種二元配置中，只有 121 與 212 的相鄰位置全都不同，其餘六種皆可能越獄。
core_knowledge:
  - 至少一處違規可用全集減去完全不違規計數
  - 巨大指數需以二進位快速冪計算
judgment: 房間有固定順序，兩個配置只要任一房間的宗教不同就視為不同。
hints:
  - 直接枚舉「哪一對相同」會因多對同時相同而重複計數，先考慮補集。
  - 所有配置有 m^n 種；若要求每對相鄰都不同，第一間有 m 種，之後各有 m-1 種。
  - 答案是 m^n-m(m-1)^(n-1)，用快速冪取模，減法後補上模數。
solution_outline: 以快速冪分別計算 total=m^n 與 safe=m·(m-1)^(n-1)，輸出 (total-safe+100003) mod 100003。
proof_or_invariant: >-
  所有配置恰分成「至少一對相鄰相同」與「每對相鄰都不同」兩類。後者第一房任選 m 種，
  每個後續房間只須避開前一房，獨立有 m-1 種，故為 m(m-1)^(n-1)。
  從全集 m^n 扣除後者即得所求，兩類互斥且涵蓋全集。
common_errors:
  - 把安全配置誤算成排列數，禁止了非相鄰房間使用相同宗教
  - 指數 n 使用 32 位元整數而溢位
  - 模減後直接輸出負數
complexity:
  time: O(log n)
  space: O(1)
cpp_skeleton: |
  #include <cstdint>
  #include <iostream>
  using namespace std;

  static constexpr int64_t mod_value = 100003;
  static int64_t power_mod(int64_t base, int64_t exponent) {
      // TODO：二進位快速冪。
      (void)base;
      (void)exponent;
      return 1;
  }

  int main() {
      int64_t m, n;
      cin >> m >> n;
      // TODO：用全集減去所有相鄰皆不同的配置。
      (void)m;
      (void)n;
      (void)power_mod(m, n);
      return 0;
  }
cpp_solution: |
  #include <cstdint>
  #include <iostream>
  using namespace std;

  static constexpr int64_t mod_value = 100003;
  static int64_t power_mod(int64_t base, int64_t exponent) {
      int64_t result = 1;
      base %= mod_value;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) { result = result * base % mod_value; }
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int64_t m, n;
      cin >> m >> n;
      const int64_t total = power_mod(m, n);
      const int64_t safe = m % mod_value * power_mod(m - 1, n - 1) % mod_value;
      cout << (total - safe + mod_value) % mod_value << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3197
external_platform: 洛谷
external_problem_id: P3197
external_title: '[HNOI2008] 越獄'
external_relation: original
source_book_pages: [463, 467]
source_pdf_pages: [93, 97]
review_status: verified
---

「至少一個相鄰衝突」直接分類會重複；改數完全沒有衝突的補集，便只剩一次快速冪。
