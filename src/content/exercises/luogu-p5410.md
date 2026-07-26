---
id: luogu-p5410
volume: lower
source_file: lower-volume
title: 洛谷 P5410 擴展 KMP：Z 函數
chapter: 9
section: '9.5'
kind: external-oj
difficulty: 4
topics: ['Z 函數', '擴展 KMP', '最長公共前綴', '攤還分析']
prerequisites: ['kmp']
statement: |-
  給定字串 a 與 b，求 b 的 Z 函數（b 與自己每個後綴的最長公共前綴），以及 a 的每個後綴與 b 的最長公共前綴。
constraints:
  - '字串長度可達 2×10^7，必須是 O(n + m)'
  - '結果以逐項異或的方式壓成兩個整數輸出'
input_format: '第一行是字串 a；第二行是字串 b。'
output_format: '第一行輸出 b 的 Z 陣列壓成的值，第二行輸出 a 對 b 的匹配陣列壓成的值（皆為 Σ 逐項異或 i·(值+1)）。'
samples:
  - input: |
      aaaabaa
      aaaaa
    output: |
      6
      21
    explanation: |-
      b = aaaaa 的 Z 陣列是 5 4 3 2 1；a 對 b 的匹配陣列是 4 3 2 1 0 2 1。把它們依題目公式逐項異或即得兩個輸出值。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
core_knowledge:
  - Z 函數描述每個後綴與整串前綴的 LCP
  - Z-box 可重用已知匹配區段
  - 最右邊界單調前進形成線性攤還
judgment: 輸出兩個依官方 1-based 公式逐項 XOR 的 64 位整數；b 的 z[0] 定為 |b|。
hints:
  - 先求模式 b 的 Z 函數，維護目前最靠右的匹配區間。
  - 位置落在區間內時，可由 b 的 Z 值借用不超過右邊界的部分，再繼續擴張。
  - 同樣方法讓 a 的各後綴與 b 比對；最後嚴格依 i*(value+1) 做 1-based XOR。
solution_outline: |-
  先用「最右匹配段」技巧求出 b 的 Z 陣列：i < right 時以 min(right − i, z[i − left]) 起步，再暴力擴展，超過 right 就更新匹配段。求 a 對 b 的匹配陣列時沿用同一套流程，只是借用 b 的 z 值、與 b 比對。最後依題目公式把兩個陣列各壓成一個整數。
proof_or_invariant: |-
  不變量是「[left, right) 是目前已知最靠右的、與 s 前綴相同的區段」。借用的正確性來自該區段內 s[i] 與 s[i − left] 的局部結構完全相同；截斷在 right − i 是因為超出部分未被驗證。攤還上 right 單調不減且不超過 n，故總擴展次數為 O(n)。
common_errors:
  - 把 z[0] 設為 0 導致第一個校驗值錯誤
  - 借用長度越過最右邊界
  - XOR 公式使用 0-based 下標或 32 位整數
complexity:
  time: 'O(n + m)'
  space: 'O(n + m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // TODO 1：Z 函數。z[i] 是 s 與 s[i..] 的最長公共前綴長度（z[0] 定為 n）。
  //   維護目前「最靠右的匹配段」[left, right]：
  //     若 i < right，可先借用對稱位置 z[i − left]，但不能超過 right − i；
  //     再從該起點暴力往後比對；比對後若超過 right 就更新 [left, right]。
  //   攤還後是 O(n)，論證與 Manacher 相同——right 單調不減。
  static vector<int> z_function(const string& s) {
      const int n = static_cast<int>(s.size());
      vector<int> z(static_cast<size_t>(n), 0);
      // 樸素版：逐位比對，O(n^2)。
      for (int i = 0; i < n; ++i) {
          int k = 0;
          while (i + k < n && s[static_cast<size_t>(k)] == s[static_cast<size_t>(i + k)]) { ++k; }
          z[static_cast<size_t>(i)] = k;
      }
      return z;
  }

  // TODO 2：p[i] 是 a[i..] 與 b 的最長公共前綴。做法與 z 函數完全相同，
  //   只是「借用」的來源換成 b 的 z 陣列，比對的對象換成 b。
  static vector<int> extend(const string& a, const string& b, const vector<int>& z) {
      const int n = static_cast<int>(a.size());
      const int m = static_cast<int>(b.size());
      vector<int> p(static_cast<size_t>(n), 0);
      (void)z;
      for (int i = 0; i < n; ++i) {
          int k = 0;
          while (i + k < n && k < m && a[static_cast<size_t>(i + k)] == b[static_cast<size_t>(k)]) { ++k; }
          p[static_cast<size_t>(i)] = k;
      }
      return p;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string a, b;
      if (!(cin >> a >> b)) { return 0; }
      const vector<int> z = z_function(b);
      const vector<int> p = extend(a, b, z);
      // 題目要求把結果壓成兩個雜湊值輸出（逐項異或）。
      long long first = 0;
      for (size_t i = 0; i < z.size(); ++i) { first ^= static_cast<long long>(i + 1) * (z[i] + 1); }
      long long second = 0;
      for (size_t i = 0; i < p.size(); ++i) { second ^= static_cast<long long>(i + 1) * (p[i] + 1); }
      cout << first << '\n' << second << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // Z 函數（擴展 KMP）：z[i] 是 s 與 s[i..] 的最長公共前綴長度。
  // 維護目前「最靠右的匹配段」[left, right]，新位置可先借用對稱位置的結果。
  static vector<int> z_function(const string& s) {
      const int n = static_cast<int>(s.size());
      vector<int> z(static_cast<size_t>(n), 0);
      if (n == 0) { return z; }
      z[0] = n;
      int left = 0;
      int right = 0;
      for (int i = 1; i < n; ++i) {
          if (i < right) { z[static_cast<size_t>(i)] = min(right - i, z[static_cast<size_t>(i - left)]); }
          while (i + z[static_cast<size_t>(i)] < n &&
                 s[static_cast<size_t>(z[static_cast<size_t>(i)])] ==
                     s[static_cast<size_t>(i + z[static_cast<size_t>(i)])]) {
              ++z[static_cast<size_t>(i)];
          }
          if (i + z[static_cast<size_t>(i)] > right) {
              left = i;
              right = i + z[static_cast<size_t>(i)];
          }
      }
      return z;
  }

  // p[i] 是 a[i..] 與 b 的最長公共前綴，做法與 z 函數完全相同，
  // 只是比對的對象換成 b。
  static vector<int> extend(const string& a, const string& b, const vector<int>& z) {
      const int n = static_cast<int>(a.size());
      const int m = static_cast<int>(b.size());
      vector<int> p(static_cast<size_t>(n), 0);
      int left = 0;
      int right = 0;
      for (int i = 0; i < n; ++i) {
          if (i < right) { p[static_cast<size_t>(i)] = min(right - i, z[static_cast<size_t>(i - left)]); }
          while (i + p[static_cast<size_t>(i)] < n && p[static_cast<size_t>(i)] < m &&
                 b[static_cast<size_t>(p[static_cast<size_t>(i)])] ==
                     a[static_cast<size_t>(i + p[static_cast<size_t>(i)])]) {
              ++p[static_cast<size_t>(i)];
          }
          if (i + p[static_cast<size_t>(i)] > right) {
              left = i;
              right = i + p[static_cast<size_t>(i)];
          }
      }
      return p;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string a, b;
      if (!(cin >> a >> b)) { return 0; }
      const vector<int> z = z_function(b);
      const vector<int> p = extend(a, b, z);
      long long first = 0;
      for (size_t i = 0; i < z.size(); ++i) {
          first ^= static_cast<long long>(i + 1) * (z[i] + 1);
      }
      long long second = 0;
      for (size_t i = 0; i < p.size(); ++i) {
          second ^= static_cast<long long>(i + 1) * (p[i] + 1);
      }
      cout << first << '\n' << second << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5410
external_platform: 洛谷
external_problem_id: P5410
external_title: '【模板】擴展 KMP / exKMP（Z 函數）'
external_relation: original
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

Z 函數與 Manacher 是同一個「最右已知區段」框架的兩個實例。學會其中一個，另一個就只是換了比對對象。
