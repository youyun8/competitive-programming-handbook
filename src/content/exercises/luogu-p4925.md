---
id: luogu-p4925
volume: upper
source_file: upper-volume
title: 洛谷 P4925 Scarlet 的字串不可能這麼可愛
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 2
topics: [combinatorics, modular-exponentiation]
prerequisites: [fast-power]
statement: 以 k 種字元構造長度 L 的字串，要求不存在長度大於 1 的回文連續子串。可選擇指定第 s 位必須是字元 w；s=0 表示不指定。求方案數模 p。
constraints:
  - 1 <= k,L <= 10^18
  - 0 <= s <= L，1 <= w <= k
  - 1 <= p <= 10^9
input_format: 第一行 k、L、p；第二行 s、w。
output_format: 輸出方案數模 p。
samples:
  - input: |-
      3 3 233
      1 1
    output: '2'
    explanation: 首字固定後，合法字串為 ABC、ACB。
core_knowledge: [短回文判定, 對稱計數, 快速冪]
judgment: 指定字元 w 一定在字元集中；模數不保證為質數。
hints:
  - 任意長回文的中央必含長度 2 或 3 的回文，因此只需避免相鄰相同與隔一位相同。
  - 第一位有 k 種，第二位有 k-1 種，之後每位皆有 k-2 種。
  - 固定任一位置為特定字元時，由字元置換對稱性，方案數直接少一個 k 因子，無須模逆元。
solution_outline: 依 L 是否為 1 分類，套用 k(k-1)(k-2)^(L-2)；若指定位置則移除首項 k。
proof_or_invariant: 無長度 2、3 回文等價於每個新字元不同於前兩字元，這也排除任何更長回文的中央。故逐位選擇數為 k、k-1、k-2。所有 k 個字元在合法字串集合中完全對稱，固定任一位置為指定 w 的方案恰為未固定集合的 1/k，可直接寫成移除 k 因子的整數公式。
common_errors: [只禁止相鄰相同而漏掉aba, 對合數模數使用k的模逆元, L為1時指數下溢]
complexity:
  time: O(log L)
  space: O(1)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { unsigned long long k, length, mod, position, symbol; cin >> k >> length >> mod >> position >> symbol; /* TODO */ }
cpp_solution: |
  #include <cstdint>
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      uint64_t alphabet = 0, length = 0, mod = 0, position = 0, symbol = 0;
      cin >> alphabet >> length >> mod >> position >> symbol;
      (void)symbol;
      const auto multiply = [mod](uint64_t a, uint64_t b) { return a * b % mod; };
      const auto power = [mod, &multiply](uint64_t base, uint64_t exponent) {
          uint64_t result = 1 % mod;
          base %= mod;
          while (exponent != 0) {
              if ((exponent & 1U) != 0) result = multiply(result, base);
              base = multiply(base, base);
              exponent >>= 1U;
          }
          return result;
      };
      uint64_t answer = 0;
      if (length == 1) {
          answer = position == 0 ? alphabet % mod : 1 % mod;
      } else {
          answer = (alphabet - 1) % mod;
          answer = multiply(answer, power(alphabet >= 2 ? alphabet - 2 : 0, length - 2));
          if (position == 0) answer = multiply(answer, alphabet % mod);
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P4925
external_platform: 洛谷
external_problem_id: P4925
external_title: Scarlet 的字符串不可能这么可爱
external_relation: original
source_book_pages: [357]
source_pdf_pages: [375]
review_status: verified
---

避免所有回文看似全域條件，實際只需讓每個新字元避開前兩位。
