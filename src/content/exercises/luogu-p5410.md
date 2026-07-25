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
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '字串長度可達 2×10^7，必須是 O(n + m)'
  - '結果以逐項異或的方式壓成兩個整數輸出'
  - '完整限制條件請參閱外部題目頁面'
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
hints:
  - |-
    Z 函數定義：z[i] 是 s 與 s[i..] 的最長公共前綴長度（習慣上 z[0] = n）。這和 KMP 的 border 陣列不同——border 問「前綴等於後綴」，Z 問「後綴與整體的公共前綴」。
  - |-
    核心技巧與 Manacher 幾乎一樣：維護目前**最靠右的匹配段** [left, right]，意思是 s[left..right−1] 等於 s[0..right−left−1]。
  - |-
    處理位置 i 時，若 i < right，那麼 s[i..] 的開頭有一段已經被這個匹配段覆蓋，可以直接借用對稱位置 z[i − left] 的結果，但不能超過 right − i（超出的部分沒有被覆蓋，無法保證）。
  - |-
    借用之後再從該起點暴力往後比對。看似 O(n²)，但每次成功比對都會把 right 往右推，而 right 單調不減且上界為 n，所以總比對次數是 O(n)。
  - |-
    第二部分求 a 對 b 的匹配陣列，做法完全相同，只是「借用」的來源換成 b 的 Z 陣列、比對的對象換成 b。把兩段寫成同一個函式的兩次呼叫會更清楚。
solution_outline: |-
  先用「最右匹配段」技巧求出 b 的 Z 陣列：i < right 時以 min(right − i, z[i − left]) 起步，再暴力擴展，超過 right 就更新匹配段。求 a 對 b 的匹配陣列時沿用同一套流程，只是借用 b 的 z 值、與 b 比對。最後依題目公式把兩個陣列各壓成一個整數。
proof_or_invariant: |-
  不變量是「[left, right) 是目前已知最靠右的、與 s 前綴相同的區段」。借用的正確性來自該區段內 s[i] 與 s[i − left] 的局部結構完全相同；截斷在 right − i 是因為超出部分未被驗證。攤還上 right 單調不減且不超過 n，故總擴展次數為 O(n)。
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
