---
id: luogu-p3375
volume: lower
source_file: lower-volume
title: 洛谷 P3375 KMP：字串匹配與 border 陣列
chapter: 9
section: '9.5'
kind: external-oj
difficulty: 3
topics: ['KMP', 'border', '前綴函數', '字串匹配']
prerequisites: ['kmp']
statement: |-
  給定文本串 s1 與模式串 s2，輸出 s2 在 s1 中所有出現位置（允許重疊），並輸出 s2 的 border 陣列（每個前綴的最長真前綴＝真後綴長度）。
constraints:
  - '兩串長度都很大，必須是 O(n + m)'
  - '出現位置允許重疊，不能找到一次就跳過整個模式串'
input_format: '第一行是文本串 s1；第二行是模式串 s2。'
output_format: '先依序輸出每個出現位置（1-based 起點），每個一行；最後一行輸出 s2 的 border 陣列，以空格分隔。'
samples:
  - input: |
      ABABABC
      ABA
    output: |
      1
      3
      0 0 1
    explanation: |-
      ABA 在位置 1 與 3 各出現一次（兩次重疊）。border 陣列中前綴 A 與 AB 都沒有真前綴等於真後綴，故為 0；前綴 ABA 的最長 border 是 A，長度 1。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
core_knowledge:
  - 前綴函數記錄最長真前綴兼後綴
  - 失配沿 border 鏈回退且文本指標不倒退
  - 完整匹配後回退以保留重疊答案
judgment: 先逐行輸出所有 1-based 出現位置，允許重疊；最後輸出模式每個前綴的前綴函數。
hints:
  - 先對模式自身計算前綴函數，失配時沿已知 border 回退。
  - 掃文本時維護目前匹配長度，文本字元不回頭；相等遞增，不等沿前綴函數回退。
  - 匹配完整模式後輸出起點，再回退到模式的最長 border，才能找到重疊出現。
solution_outline: |-
  先用自我匹配求出 border 陣列。再掃描文本：維護已匹配長度 matched，失配時沿 border 回退，匹配時遞增；matched 達到模式串長度時記錄一次出現位置（起點為 i − m + 2），並令 matched = border[m−1] 以支援重疊匹配。最後輸出 border 陣列。
proof_or_invariant: |-
  迴圈不變量是「matched 恆等於 pattern 中同時是 text[0..i] 之後綴的最長前綴長度」。回退到 border[matched − 1] 之所以不會漏解，是因為所有比 matched 更短且仍是後綴的前綴長度，恰好由 border 鏈依遞減順序枚舉。攤還上 matched 的總增加量不超過 n，故總回退量也不超過 n。
common_errors:
  - 完整匹配後把 matched 清零而漏掉重疊
  - 輸出 0-based 起點
  - 前綴函數把整個前綴本身算成真前綴
complexity:
  time: 'O(n + m)'
  space: 'O(m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // TODO 1：建 border 陣列。border[i] 是 pattern 前綴 [0, i] 的
  //   最長「真前綴 = 真後綴」長度。遞推時用一個 length 指標：
  //   不匹配就 length = border[length - 1] 回退，匹配就 ++length。
  static vector<int> build_border(const string& pattern) {
      const size_t m = pattern.size();
      vector<int> border(m, 0);
      // 樸素版：對每個 i 由長到短檢查，O(m^3)。
      for (size_t i = 1; i < m; ++i) {
          for (size_t len = i; len >= 1; --len) {
              if (pattern.compare(0, len, pattern, i + 1 - len, len) == 0) {
                  border[i] = static_cast<int>(len);
                  break;
              }
          }
      }
      return border;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string text, pattern;
      if (!(cin >> text >> pattern)) { return 0; }
      const vector<int> border = build_border(pattern);
      const size_t n = text.size();
      const size_t m = pattern.size();

      string out;
      // TODO 2：用 border 做匹配。維護已匹配長度 matched：
      //   text[i] 與 pattern[matched] 不同時，matched = border[matched - 1] 回退；
      //   相同就 ++matched。matched 等於 m 時記錄一次出現位置（1-based 起點是 i - m + 2），
      //   然後同樣令 matched = border[m - 1] 繼續找下一個（允許重疊）。
      //   關鍵：text 的指標 i 從不倒退，所以整體是 O(n + m)。
      for (size_t i = 0; i + m <= n; ++i) {
          if (text.compare(i, m, pattern) == 0) {
              out += to_string(i + 1);
              out += '\n';
          }
      }

      for (size_t i = 0; i < m; ++i) { out += to_string(border[i]); out += " \n"[i + 1 == m]; }
      cout << out;
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // KMP：border[i] 是 pattern 前綴 [0, i] 的最長「真前綴＝真後綴」長度。
  // 比對失敗時沿 border 回退，text 的指標永不倒退，因此總共 O(n + m)。
  static vector<int> build_border(const string& pattern) {
      const size_t m = pattern.size();
      vector<int> border(m, 0);
      for (size_t i = 1; i < m; ++i) {
          int length = border[i - 1];
          while (length > 0 && pattern[i] != pattern[static_cast<size_t>(length)]) {
              length = border[static_cast<size_t>(length - 1)];
          }
          if (pattern[i] == pattern[static_cast<size_t>(length)]) { ++length; }
          border[i] = length;
      }
      return border;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string text, pattern;
      if (!(cin >> text >> pattern)) { return 0; }
      const vector<int> border = build_border(pattern);
      const size_t n = text.size();
      const size_t m = pattern.size();

      string out;
      int matched = 0;
      for (size_t i = 0; i < n; ++i) {
          while (matched > 0 && text[i] != pattern[static_cast<size_t>(matched)]) {
              matched = border[static_cast<size_t>(matched - 1)];
          }
          if (text[i] == pattern[static_cast<size_t>(matched)]) { ++matched; }
          if (static_cast<size_t>(matched) == m) {
              out += to_string(i - m + 2);  // 1-based 起始位置
              out += '\n';
              matched = border[m - 1];
          }
      }
      for (size_t i = 0; i < m; ++i) { out += to_string(border[i]); out += " \n"[i + 1 == m]; }
      cout << out;
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3375
external_platform: 洛谷
external_problem_id: P3375
external_title: '【模板】KMP'
external_relation: original
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

KMP 的難點從來不是程式碼長度，而是 border 的定義。把 border 想成「失配後還能保住多少」，回退鏈就會變得自然。
