---
id: luogu-p2613
volume: lower
source_file: lower-volume
title: 洛谷 P2613 有理數取餘：大數取模與費馬逆元
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 2
topics: ['乘法逆元', '費馬小定理', '大數取模', '秦九韶']
prerequisites: ['congruence']
statement: |-
  給定分數 a/b，求它在模 19260817 意義下的值；若分母在模意義下為 0 則輸出 Angry!。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'a 與 b 可能長達一萬位，無法存入任何整數型別'
  - '模數 19260817 是質數'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行一個整數 a；第二行一個整數 b。'
output_format: '一行一個整數表示 a/b 在模意義下的值；若逆元不存在則輸出 Angry!。'
samples:
  - input: |
      233
      666
    output: |
      18595654
    explanation: |-
      把輸出乘上 666 再對 19260817 取模會得到 233，可驗證結果正確。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    模意義下沒有「除法」，只有「乘上逆元」。p 是質數時由費馬小定理 b^(p−1) ≡ 1，所以 b^(p−2) 就是 b 的逆元，答案是 a · b^(p−2) mod p。
  - |-
    a 與 b 有一萬位，任何整數型別都放不下。但我們只需要它們**模 p 的值**，所以邊讀邊取模即可：把數字當字串讀入，用 `value = (value * 10 + digit) % p` 逐位累積。這就是秦九韶（Horner）法。
  - |-
    這個做法之所以正確，是因為取模對加法與乘法都是同態的：先取模再運算，與先運算再取模結果相同。
  - |-
    b 取模後若為 0，代表 b 是 p 的倍數，此時 b 在模 p 下沒有逆元（0 沒有乘法反元素），要輸出 Angry!。注意判斷的是「取模之後」是否為 0，而不是 b 本身是否為 0。
  - |-
    快速冪的指數 p−2 約兩千萬，用二進位快速冪只需約 25 次乘法。
solution_outline: |-
  把 a 與 b 當字串讀入，用 Horner 法邊讀邊對 19260817 取模。若 b 的模值為 0 就輸出 Angry!，否則用快速冪求 b^(p−2) 作為逆元，答案為 a · 逆元 mod p。
proof_or_invariant: |-
  取模是環同態：(x + y) mod p 與 (x mod p + y mod p) mod p 相等，乘法亦然。因此逐位 Horner 累積得到的值恰為原數模 p 的餘數。費馬小定理保證 p 為質數且 b 不被 p 整除時 b^(p−2) 是 b 的乘法逆元。
complexity:
  time: 'O(位數 + log p)'
  space: 'O(位數)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static const long long kMod = 19260817;

  // TODO 1：a 與 b 可能長達一萬位，放不進任何整數型別。
  //   改成邊讀邊取模（秦九韶 / Horner）：value = (value * 10 + 該位數字) % kMod。
  static long long read_mod() {
      string digits;
      cin >> digits;
      long long value = 0;
      (void)digits;
      return value;
  }

  // 已備好：快速冪。
  static long long power_mod(long long base, long long exponent) {
      long long result = 1;
      base %= kMod;
      while (exponent > 0) {
          if (exponent & 1) { result = result * base % kMod; }
          base = base * base % kMod;
          exponent >>= 1;
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      const long long a = read_mod();
      const long long b = read_mod();
      // TODO 2：b 取模後若為 0，代表 b 是模數的倍數，逆元不存在，輸出 Angry!。
      // TODO 3：否則答案是 a · b^(kMod−2) mod kMod（費馬小定理求逆元）。
      (void)a;
      (void)b;
      (void)power_mod;
      cout << "Angry!\n";
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static const long long kMod = 19260817;

  // a、b 可能有一萬位，無法存進整數，改用秦九韶（Horner）邊讀邊取模。
  static long long read_mod() {
      string digits;
      cin >> digits;
      long long value = 0;
      for (const char c : digits) {
          value = (value * 10 + (c - '0')) % kMod;
      }
      return value;
  }

  static long long power_mod(long long base, long long exponent) {
      long long result = 1;
      base %= kMod;
      while (exponent > 0) {
          if (exponent & 1) { result = result * base % kMod; }
          base = base * base % kMod;
          exponent >>= 1;
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      const long long a = read_mod();
      const long long b = read_mod();
      if (b == 0) { cout << "Angry!\n"; return 0; }  // 分母是模數的倍數，逆元不存在
      cout << a * power_mod(b, kMod - 2) % kMod << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2613
external_platform: 洛谷
external_problem_id: P2613
external_title: '【模板】有理數取餘'
external_relation: original
source_book_pages: [418, 424]
source_pdf_pages: [48, 54]
review_status: verified
---

「大數只要餘數」是一個很常用的觀察。看到超長數字先問自己：真的需要完整的值嗎？
