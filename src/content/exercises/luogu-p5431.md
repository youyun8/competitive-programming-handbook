---
id: luogu-p5431
volume: lower
source_file: lower-volume
title: 洛谷 P5431 乘法逆元 2：前綴積求一批逆元
chapter: 6
section: '6.9'
kind: external-oj
difficulty: 3
topics:
  - 乘法逆元
  - 前綴積
  - 批次求逆
  - 快速冪
prerequisites:
  - congruence
statement: |-
  給定 n 個正整數 a_i 與常數 k，求 Σ k^i / a_i 在模 p 意義下的值。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - n 可達 5×10^6，對每個數各做一次快速冪會超時
  - a_i 兩兩不一定不同，且不保證有序
  - 輸入量大，需要快速讀入
  - 完整限制條件請參閱外部題目頁面
input_format: 第一行三個整數 n、p 與 k；第二行 n 個正整數 a_1..a_n。
output_format: 一行一個整數，表示 Σ k^i · a_i^{-1} 對 p 取模的結果。
samples:
  - input: |
      6 1000000007 3
      1 2 3 4 5 6
    output: |
      450000210
    explanation:
      逐項計算 3^1/1 + 3^2/2 + … + 3^6/6 在模 10^9+7 下的值即得此結果；把每一項的分母換成它的模逆元再累加即可手動驗算。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ
      網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - 對每個 a_i 各做一次快速冪是 O(n log p)，n = 5×10^6 時太慢。關鍵技巧是「用一次快速冪求出一批逆元」。
  - 先算前綴積 prefix[i] = a_1·a_2·…·a_i。只對 prefix[n] 做**一次**快速冪求出它的逆元，記為 suffix_inverse[n]。
  - 接著由後往前遞推：suffix_inverse[i−1] = suffix_inverse[i] · a_i。因為 suffix_inverse[i] 是 prefix[i] 的逆元，乘上 a_i 後正好變成 prefix[i−1]
    的逆元。
solution_outline:
  邊讀邊算前綴積 prefix[i]。對 prefix[n] 做一次快速冪求逆元，再由後往前遞推 suffix_inverse[i−1] = suffix_inverse[i] · a_i。第 i
  項的逆元為 suffix_inverse[i] · prefix[i−1]，配合滾動累乘的 k^i 累加即得答案。
proof_or_invariant:
  遞推的不變量是「suffix_inverse[i] 恆為 prefix[i] 的乘法逆元」。基底由一次快速冪建立；歸納步驟成立是因為 prefix[i] =
  prefix[i−1]·a_i，兩邊取逆元得 prefix[i−1]^{-1} = prefix[i]^{-1}·a_i。由此 a_i^{-1} = prefix[i]^{-1}·prefix[i−1]。
complexity:
  time: O(n + log p)
  space: O(n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      long long n, p, k;
      if (!(cin >> n >> p >> k)) { return 0; }
      const size_t size = static_cast<size_t>(n);
      vector<long long> a(size + 1);
      for (size_t i = 1; i <= size; ++i) { cin >> a[i]; a[i] %= p; }

      auto power_mod = [p](long long base, long long exponent) {
          long long result = 1;
          base %= p;
          while (exponent > 0) {
              if (exponent & 1) { result = result * base % p; }
              base = base * base % p;
              exponent >>= 1;
          }
          return result;
      };

      // 目前對每個 a[i] 各做一次快速冪求逆元，總共 O(n log p)——本題會超時。
      // TODO：改成「一次快速冪求 n 個逆元」的前綴積技巧。
      //   1. 算前綴積 prefix[i] = a[1]·a[2]·…·a[i]。
      //   2. 只對 prefix[n] 做一次快速冪求出它的逆元。
      //   3. 由後往前遞推：suffix_inverse[i-1] = suffix_inverse[i] · a[i]，
      //      於是 a[i] 的逆元就是 suffix_inverse[i] · prefix[i-1]。
      //   這樣總共只做一次快速冪，其餘都是乘法，整體 O(n + log p)。
      long long answer = 0;
      long long coefficient = 1;
      for (size_t i = 1; i <= size; ++i) {
          coefficient = coefficient * (k % p) % p;  // k^i
          answer = (answer + coefficient * power_mod(a[i], p - 2)) % p;
      }
      cout << answer << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 一次求 n 個逆元：先算前綴積，用一次快速冪求總積的逆元，
  // 再由後往前把逆元「剝」回每個元素，總共只做一次快速冪。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      long long n, p, k;
      if (!(cin >> n >> p >> k)) { return 0; }
      const size_t size = static_cast<size_t>(n);
      vector<long long> a(size + 1);
      vector<long long> prefix(size + 1);
      prefix[0] = 1;
      for (size_t i = 1; i <= size; ++i) {
          cin >> a[i];
          a[i] %= p;
          prefix[i] = prefix[i - 1] * a[i] % p;
      }

      auto power_mod = [p](long long base, long long exponent) {
          long long result = 1;
          base %= p;
          while (exponent > 0) {
              if (exponent & 1) { result = result * base % p; }
              base = base * base % p;
              exponent >>= 1;
          }
          return result;
      };

      vector<long long> suffix_inverse(size + 1);
      suffix_inverse[size] = power_mod(prefix[size], p - 2);
      for (size_t i = size; i >= 1; --i) {
          suffix_inverse[i - 1] = suffix_inverse[i] * a[i] % p;
      }

      long long answer = 0;
      long long coefficient = 1;
      for (size_t i = 1; i <= size; ++i) {
          coefficient = coefficient * (k % p) % p;             // k^i
          const long long inverse = suffix_inverse[i] * prefix[i - 1] % p;  // a[i] 的逆元
          answer = (answer + coefficient * inverse) % p;
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5431
external_platform: 洛谷
external_problem_id: P5431
external_title: 【模板】模意義下的乘法逆元 2
external_relation: original
source_book_pages:
  - 418
  - 424
source_pdf_pages:
  - 48
  - 54
review_status: verified
core_knowledge:
  - 前綴乘積
  - 一次模反元素
  - 批次反元素
  - 權重遞推
judgment: n 達數百萬，逐項快速冪過慢；先求所有數的總乘積之逆，再由後綴方向拆回每個反元素，可在線性時間完成加權總和。
common_errors:
  - 為每個 a_i 各做一次快速冪而超時
  - 反向掃描時先更新乘積，造成索引錯一位
  - k 的冪次或累加未及時取模
---

這個前綴積技巧不只用於逆元，任何「可結合且可逆」的運算要批次求反元素都適用。
