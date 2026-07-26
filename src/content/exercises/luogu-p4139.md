---
id: luogu-p4139
volume: lower
source_file: lower-volume
title: 洛谷 P4139 上帝與集合的正確用法
chapter: 6
section: '6.13'
kind: external-oj
difficulty: 4
topics:
  - 歐拉函數
  - 擴展歐拉定理
  - 冪塔
prerequisites:
  - euler-totient
  - fast-power
statement: >-
  定義 a0=1、an=2^(a(n-1))，求序列模 p 最終穩定值，也就是無窮高 2 冪塔 mod p。
constraints:
  - 1 <= T <= 1000
  - 1 <= p <= 10^7
input_format: >-
  第一行 T，接著 T 行各一個 p。
output_format: >-
  每組輸出穩定值 mod p。
samples:
  - input: |
      3
      2
      3
      6
    output: |
      0
      1
      4
    explanation: >-
      無窮冪塔對 2、3、6 的穩定餘數分別為 0、1、4；官方樣例。
hints:
  - >-
    指數很大且底數可能與模數不互質，要使用擴展歐拉降冪。
  - >-
    遞迴到 phi(p)，公式可寫成 solve(p)=2^(solve(phi(p))+phi(p)) mod p。
  - >-
    phi 鏈很快降到 1；先線性篩出所有 phi。
core_knowledge:
  - 擴展歐拉定理
  - phi 鏈
  - 無窮冪塔
judgment: >-
  冪塔不能展開；模數沿 phi 鏈遞減，遞迴深度很小。
solution_outline: >-
  線性篩 phi[1..10^7]。遞迴 solve(mod)：mod=1 回 0，否則快速冪計算 2^(solve(phi[mod])+phi[mod]) mod mod。
proof_or_invariant: >-
  冪塔高度足夠後，真實指數必不小於 phi(p)，擴展歐拉定理允許將其替換成 exponent mod phi(p)+phi(p)。遞迴值正是該餘數；phi 鏈終止於 1，故歸納成立。
common_errors:
  - 誤用僅適於互質底數的普通歐拉定理
  - 遞迴基底 mod=1 未處理
  - 指數漏加 phi(mod)
complexity:
  time: 預處理 O(10^7)，每組 O(log^2 p)
  space: O(10^7)
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
  static long long power_mod(long long base, long long exponent, int mod) {
      long long result = 1 % mod;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) result = result * base % mod;
          base = base * base % mod; exponent >>= 1LL;
      }
      return result;
  }
  static int tower(int mod, const vector<int>& phi) {
      if (mod == 1) return 0;
      const int next = phi[static_cast<size_t>(mod)];
      return static_cast<int>(power_mod(2, static_cast<long long>(tower(next, phi)) + next, mod));
  }
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int tests; cin >> tests;
      vector<int> query(static_cast<size_t>(tests));
      int maximum = 1;
      for (int& p : query) { cin >> p; maximum = max(maximum, p); }
      vector<int> phi(static_cast<size_t>(maximum) + 1), primes;
      vector<char> composite(static_cast<size_t>(maximum) + 1, false);
      phi[1] = 1;
      for (int i = 2; i <= maximum; ++i) {
          if (!composite[static_cast<size_t>(i)]) { primes.push_back(i); phi[static_cast<size_t>(i)] = i - 1; }
          for (int p : primes) {
              if (p > maximum / i) break;
              const int next = i * p; composite[static_cast<size_t>(next)] = true;
              if (i % p == 0) { phi[static_cast<size_t>(next)] = phi[static_cast<size_t>(i)] * p; break; }
              phi[static_cast<size_t>(next)] = phi[static_cast<size_t>(i)] * (p - 1);
          }
      }
      for (int p : query) cout << tower(p, phi) << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4139
external_platform: 洛谷
external_problem_id: 'P4139'
external_title: '上帝與集合的正確用法'
external_relation: original
original_label: '洛谷 P4139'
source_book_pages: [437, 442]
source_pdf_pages: [67, 72]
review_status: verified
---

難點不是快速冪，而是底數與模數不互質時的降冪條件。

原始題單中本題位於第 6.13 節、習題 第 3 題；競賽來源記為「未標示」。可用小範圍直接枚舉作為對拍程式，逐一比較最佳化版本。
