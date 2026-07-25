---
id: luogu-p4777
volume: lower
source_file: lower-volume
title: 洛谷 P4777 擴展中國剩餘定理：模數不互質的同餘方程組
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 4
topics: ['EXCRT', '中國剩餘定理', '擴展歐幾里得', '同餘']
prerequisites: ['congruence', 'extended-gcd']
statement: |-
  給定 n 條同餘方程 x ≡ r_i (mod m_i)，模數 m_i 不保證兩兩互質，求最小的非負整數解 x。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '模數不保證互質，不能直接套用中國剩餘定理'
  - '中間乘法會超過 64 位元，需要防溢位的乘法取模'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行一個整數 n；接下來 n 行，每行兩個整數 m_i 與 r_i。'
output_format: '一行一個整數，表示最小的非負整數解。'
samples:
  - input: |
      3
      11 6
      25 9
      33 17
    output: |
      809
    explanation: |-
      809 = 11×73 + 6、= 25×32 + 9、= 33×24 + 17，三條同餘式都滿足，且是最小的非負解。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    一般的中國剩餘定理要求模數兩兩互質。這題不保證，所以要改成**逐條合併**：先把前兩條併成一條，再拿結果去併第三條，依此類推。
  - |-
    設已合併的結果是 x ≡ remainder (mod modulus)，新的一條是 x ≡ next_remainder (mod next_modulus)。把 x 寫成 remainder + modulus·t 代入第二條，得到一次同餘方程 modulus·t ≡ next_remainder − remainder (mod next_modulus)。
  - |-
    這個方程有解的充要條件是 g = gcd(modulus, next_modulus) 整除右邊的差值；不整除就代表兩條式子矛盾，整個方程組無解。用擴展歐幾里得同時求出 g 與一組係數。
  - |-
    有解時 t 在模 (next_modulus / g) 下唯一。取最小非負的 t，代回得到新的 remainder，新的 modulus 則是兩者的**最小公倍數** modulus / g × next_modulus。
  - |-
    溢位是這題最大的陷阱：modulus 累乘後可達 10^18，乘上 t 會爆 long long。用二進位乘法取模（把乘數拆成二進位，逐位倍增累加）就能安全計算，而且不需要 __int128——本站的 C++ 檢查開了 -pedantic-errors，__int128 會被拒絕。
solution_outline: |-
  把第一條式子當作初始的 (modulus, remainder)，逐條合併其餘式子。合併時用擴展歐幾里得解 modulus·t ≡ 差值 (mod next_modulus)：差值不是 gcd 的倍數就輸出 −1；否則取最小非負的 t，更新 remainder 與 modulus（後者變成最小公倍數），並把 remainder 規約到 [0, modulus)。
proof_or_invariant: |-
  迴圈不變量是「(modulus, remainder) 恰好刻畫前 i 條同餘式的完整解集，即解集為 {remainder + k·modulus}」。合併步驟的正確性來自一次同餘方程的解結構：a·t ≡ b (mod m) 有解當且僅當 gcd(a, m) | b，且此時解在模 m/gcd(a, m) 下唯一。
complexity:
  time: 'O(n log V)'
  space: 'O(1)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // 已備好：二進位乘法取模，避開 64 位元乘法溢位，也不需要 __int128。
  static long long mul_mod(long long a, long long b, long long mod_value) {
      long long result = 0;
      a %= mod_value;
      b %= mod_value;
      while (b > 0) {
          if (b & 1) { result = (result + a) % mod_value; }
          a = (a + a) % mod_value;
          b >>= 1;
      }
      return result;
  }

  // TODO 1：擴展歐幾里得。回傳 gcd(a, b)，同時求出滿足 a·x + b·y = gcd 的一組 (x, y)。
  //   遞迴式：先解 (b, a mod b) 得到 (x1, y1)，則 x = y1、y = x1 - ⌊a/b⌋·y1。
  static long long extended_gcd(long long a, long long b, long long& x, long long& y) {
      x = 1;
      y = 0;
      (void)b;
      return a;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      long long modulus, remainder;
      cin >> modulus >> remainder;
      remainder %= modulus;

      for (int i = 1; i < n; ++i) {
          long long next_modulus, next_remainder;
          cin >> next_modulus >> next_remainder;
          // TODO 2：把已合併的 x ≡ remainder (mod modulus) 與新的一條
          //   x ≡ next_remainder (mod next_modulus) 併成一條。
          //   令 x = remainder + modulus·t，代入第二式得
          //       modulus·t ≡ next_remainder − remainder (mod next_modulus)
          //   這是一次同餘方程，用 extended_gcd 解。
          //   設 g = gcd(modulus, next_modulus)：
          //     差值不是 g 的倍數 -> 兩條式子矛盾，輸出 -1 結束；
          //     否則 t 在模 (next_modulus / g) 下唯一，取最小非負解。
          // TODO 3：更新 remainder += modulus·t，modulus 變成兩者的最小公倍數，
          //   最後把 remainder 規約到 [0, modulus)。
          (void)extended_gcd;
          (void)mul_mod;
      }
      cout << remainder << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 二進位乘法取模：避開 64 位元乘法溢位，也不依賴編譯器擴充的 __int128
  // （本站的 C++ 檢查開了 -pedantic-errors，__int128 會被拒絕）。
  static long long mul_mod(long long a, long long b, long long mod_value) {
      long long result = 0;
      a %= mod_value;
      b %= mod_value;
      while (b > 0) {
          if (b & 1) { result = (result + a) % mod_value; }
          a = (a + a) % mod_value;
          b >>= 1;
      }
      return result;
  }

  static long long extended_gcd(long long a, long long b, long long& x, long long& y) {
      if (b == 0) { x = 1; y = 0; return a; }
      long long x1, y1;
      const long long g = extended_gcd(b, a % b, x1, y1);
      x = y1;
      y = x1 - a / b * y1;
      return g;
  }

  // 擴展中國剩餘定理：模數不必兩兩互質，逐條把同餘式合併成一條。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      long long modulus, remainder;
      cin >> modulus >> remainder;
      remainder %= modulus;

      for (int i = 1; i < n; ++i) {
          long long next_modulus, next_remainder;
          cin >> next_modulus >> next_remainder;
          // 求 t 使得 remainder + modulus * t ≡ next_remainder (mod next_modulus)
          long long x, y;
          const long long g = extended_gcd(modulus, next_modulus, x, y);
          const long long difference =
              ((next_remainder - remainder) % next_modulus + next_modulus) % next_modulus;
          if (difference % g != 0) { cout << -1 << '\n'; return 0; }  // 兩條式子矛盾
          const long long step = next_modulus / g;
          const long long t = mul_mod(((x % step) + step) % step, (difference / g) % step, step);
          remainder += modulus * t;
          modulus *= step;  // 新模數是兩者的最小公倍數
          remainder = ((remainder % modulus) + modulus) % modulus;
      }
      cout << remainder << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4777
external_platform: 洛谷
external_problem_id: P4777
external_title: '【模板】擴展中國剩餘定理（EXCRT）'
external_relation: original
source_book_pages: [418, 424]
source_pdf_pages: [48, 54]
review_status: verified
---

EXCRT 的每一步都是「解一次同餘方程」，而那正是擴展歐幾里得的工作。想清楚合併的代數推導，程式就只是把它抄下來。
