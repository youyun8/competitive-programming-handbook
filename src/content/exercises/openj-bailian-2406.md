---
id: openj-bailian-2406
volume: lower
source_file: lower-volume
title: OpenJ 百練 2406 字串乘方
chapter: 9
section: '9.5'
kind: external-oj
difficulty: 2
topics: [kmp, prefix-function, periodic-string]
prerequisites: [string-prefix, divisibility]
statement: >-
  若把字串連接視為乘法，a 的 n 次方就是把 a 連接 n 次。對每個輸入字串 s，求最大的正整數 n，
  使得存在某個字串 a 滿足 s=a^n。
constraints:
  - 1 <= |s| <= 1000000
  - s 的字元皆為可列印字元；每組測資占一行
  - 單獨一行句點 `.` 是輸入終止標記，不屬於測資
  - 官方總時間限制 3000 ms，記憶體限制 65536 kB
input_format: 每行是一個待處理字串 s；讀到內容恰為 `.` 的一行時結束。
output_format: 對每個 s 輸出一行整數，表示 s 可寫成同一子字串重複的最大次數。
samples:
  - input: |-
      abcd
      aaaa
      ababab
      .
    output: |-
      1
      4
      3
    explanation: >-
      `abcd` 沒有更短的重複單位；`aaaa` 是 `a` 的四次方；`ababab` 是 `ab` 的三次方。
core_knowledge:
  - KMP 前綴函數可在線性時間求整個字串的最長真前綴兼後綴
  - 若 n 為字串長度，候選最短週期為 n - pi[n - 1]
  - 候選週期整除 n 時答案為 n / period，否則答案為 1
judgment: 每個非終止輸入行恰輸出一個最大重複次數；輸入可能有多組，句點行不輸出答案。
hints:
  - 若首尾有很長的相同部分，未被這段邊界覆蓋的長度可能就是最短重複單位。
  - 求出整個字串的 KMP 前綴函數，令 candidate = n - pi[n - 1]。
  - candidate 只有在能整除 n 時才能鋪滿字串；此時輸出 n / candidate，否則沒有非平凡乘方，輸出 1。
solution_outline: >-
  對每個輸入行計算 KMP 前綴函數。由最長邊界得到候選週期 p=n-pi[n-1]。若 n%p==0，
  最短重複單位長 p，答案是 n/p；否則只能把整個 s 當作底數，答案為 1。
proof_or_invariant: >-
  前綴函數保證 pi[n-1] 是 s 的最長真前綴兼後綴。若 s 由長度 p 的區塊重複，則前 n-p
  個字元等於後 n-p 個字元，因此 n-p 是邊界，候選 p0=n-pi[n-1] 不大於任何可行區塊長度。
  當 p0 整除 n 時，週期性會把等式沿每個 p0 長度區塊傳遞，故所有區塊相同，n/p0 可行且最大。
  若 p0 不整除 n，則不存在能整除 n 的更短週期，否則會產生比 pi[n-1] 更長的邊界；答案只能是 1。
common_errors:
  - 直接輸出 n / candidate 而未檢查 n % candidate，對只有首尾重疊的字串會答錯
  - 把終止行 `.` 當作長度一的普通字串
  - 對每個候選長度逐字比較，最壞會退化成 O(n^2)
complexity:
  time: O(n)，其中 n 是該測資的字串長度
  space: O(n)，儲存前綴函數
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;

  static vector<int> build_prefix_function(const string& text) {
      vector<int> prefix(text.size(), 0);
      // TODO：在線性時間求每個前綴的最長真前綴兼後綴。
      return prefix;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      string text;
      while (getline(cin, text) && text != ".") {
          const vector<int> prefix = build_prefix_function(text);
          const int length = static_cast<int>(text.size());
          const int candidate = length - prefix.back();
          // TODO：候選週期能鋪滿字串時輸出重複次數，否則輸出 1。
          (void)candidate;
      }
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;

  static vector<int> build_prefix_function(const string& text) {
      vector<int> prefix(text.size(), 0);
      for (size_t i = 1; i < text.size(); ++i) {
          int matched = prefix[i - 1];
          while (matched > 0 && text[i] != text[static_cast<size_t>(matched)]) {
              matched = prefix[static_cast<size_t>(matched - 1)];
          }
          if (text[i] == text[static_cast<size_t>(matched)]) {
              ++matched;
          }
          prefix[i] = matched;
      }
      return prefix;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      string text;
      while (getline(cin, text) && text != ".") {
          const vector<int> prefix = build_prefix_function(text);
          const int length = static_cast<int>(text.size());
          const int candidate = length - prefix.back();
          const int answer = length % candidate == 0 ? length / candidate : 1;
          cout << answer << '\n';
      }
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/2406/
external_platform: OpenJ_Bailian
external_problem_id: '2406'
external_title: 字串乘方
external_relation: original
source_book_pages: [576]
source_pdf_pages: [206]
review_status: verified
---

最長邊界看似只描述首尾重疊，但配合長度整除，就能精確辨認整個字串由多少份最短單位構成。
