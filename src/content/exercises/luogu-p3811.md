---
id: luogu-p3811
volume: lower
source_file: lower-volume
title: 洛谷 P3811 乘法逆元：線性遞推求 1..n 的逆元
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 3
topics:
  - 乘法逆元
  - 同餘
  - 線性遞推
  - 費馬小定理
prerequisites:
  - congruence
  - fast-power
statement: 給定正整數 n 與質數 p，依序求 1 到 n 在模 p 意義下的乘法反元素。
constraints:
  - 1 <= n <= 3000000
  - n < p <= 1000000007
  - p 為質數
input_format: 一行兩個正整數 n、p。
output_format: 輸出 n 行，第 i 行為 i 在模 p 下的乘法反元素。
samples:
  - input: |
      5 13
    output: |
      1
      7
      9
      10
      8
    explanation: 驗證一下：2×7=14≡1、3×9=27≡1、4×10=40≡1、5×8=40≡1（mod 13），全部正確。 本示例依官方輸入輸出格式設計。
hints:
  - 單個逆元可以用費馬小定理：p 是質數時 i^(p-1) ≡ 1，所以 i^(p-2) 就是逆元，一次快速冪 O(log p)。但要求 n 個就是 O(n log p)，n = 3×10^6 時太慢。
  - 關鍵是找出遞推。把 p 除以 i 寫成帶餘除法：p = ⌊p/i⌋·i + (p mod i)。在模 p 意義下左邊是 0，於是 ⌊p/i⌋·i + (p mod i) ≡ 0。
  - 兩邊同乘 i 的逆元與 (p mod i) 的逆元，整理得 inv[i] ≡ -⌊p/i⌋ · inv[p mod i]。注意 p mod i < i，所以右邊用到的逆元一定已經算過了——這就是遞推能成立的原因。
solution_outline:
  用 inv[1] = 1 起頭，依遞推式 `inv[i] = (p - p / i) * inv[p % i] % p` 由小到大遞推到 n。因為 p mod i 恆小於
  i，所需的值必定已算出。最後把所有結果拼成一個字串一次輸出，避免大量 I/O 呼叫。
proof_or_invariant:
  遞推式由帶餘除法 p = ⌊p/i⌋·i + (p mod i) 在模 p 下推得，等價於 inv[i] ≡ -⌊p/i⌋·inv[p mod i]。因為 0 <= p mod i <
  i，遞推嚴格朝更小的索引依賴，故按 i 遞增的順序計算時右側必定已知，歸納可得每個 inv[i] 都滿足 i·inv[i] ≡ 1。
complexity:
  time: O(n)
  space: O(n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static long long power_mod(long long base, long long exponent, long long mod_value) {
      long long result = 1;
      base %= mod_value;
      while (exponent > 0) {
          if (exponent & 1) { result = result * base % mod_value; }
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      long long n, p;
      if (!(cin >> n >> p)) { return 0; }
      vector<long long> inverse(static_cast<size_t>(n) + 1);

      // 目前是每個數各做一次快速冪（費馬小定理），總共 O(n log p)——
      // n 到 3×10^6 時會超時。
      // TODO：改成 O(n) 的線性遞推。
      //   把 p 寫成 p = ⌊p/i⌋·i + (p mod i)，在模 p 下移項後兩邊同乘
      //   i 與 (p mod i) 的逆元，可得
      //       inv[i] = -(p / i) · inv[p mod i]  (mod p)
      //   為了避免負數，實作時寫成 (p - p / i) * inv[p % i] % p。
      for (long long i = 1; i <= n; ++i) {
          inverse[static_cast<size_t>(i)] = power_mod(i, p - 2, p);
      }

      string out;
      out.reserve(static_cast<size_t>(n) * 8);
      for (long long i = 1; i <= n; ++i) {
          out += to_string(inverse[static_cast<size_t>(i)]);
          out += '\n';
      }
      cout << out;
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      long long n, p;
      if (!(cin >> n >> p)) { return 0; }
      vector<long long> inverse(static_cast<size_t>(n) + 1);
      inverse[1] = 1;
      // 由 p = ⌊p/i⌋·i + p mod i 兩邊同乘 i^{-1}·(p mod i)^{-1} 推得的線性遞推。
      for (long long i = 2; i <= n; ++i) {
          inverse[static_cast<size_t>(i)] =
              (p - p / i) % p * inverse[static_cast<size_t>(p % i)] % p;
      }
      string out;
      out.reserve(static_cast<size_t>(n) * 8);
      for (long long i = 1; i <= n; ++i) {
          out += to_string(inverse[static_cast<size_t>(i)]);
          out += '\n';
      }
      cout << out;
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3811
external_platform: 洛谷
external_problem_id: P3811
external_title: 【模板】模意義下的乘法逆元
external_relation: original
source_book_pages:
  - 418
  - 424
source_pdf_pages:
  - 48
  - 54
review_status: verified
core_knowledge:
  - 線性遞推求模反元素
  - 質數模
  - 整除分塊關係
judgment: 逐個快速冪需 O(n log p)；由 p = floor(p/i)·i + p mod i 可推出 inv[i] 的 O(1) 遞推，總計 O(n)。
common_errors:
  - 在 p 不為質數或 n >= p 時照套遞推
  - 乘法只用 int，尚未取模便溢位
  - 遞推式漏掉取模或負值正規化
---

這題示範了「用帶餘除法把一個問題化簡到更小的同類問題」。同樣的手法也能線性求階乘逆元與組合數。
