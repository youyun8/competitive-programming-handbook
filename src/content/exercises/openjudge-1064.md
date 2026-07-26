---
id: openjudge-1064
volume: upper
source_file: upper-volume
title: OpenJudge 百練 1064 網線主管
chapter: 3
section: '3.2'
kind: external-oj
difficulty: 2
topics: [binary-search, integer-arithmetic]
prerequisites: [monotonicity]
statement: 給定 N 條精確到公分的網線，要把它們切成至少 K 段等長網線；求可行的最大段長，答案亦須精確到公分。
constraints:
  - 1 <= N <= 10000
  - 1 <= K <= 10000
  - 每條網線長度為 1 公尺至 100 公里，輸入恰有兩位小數
input_format: 第一行為 N、K；接著 N 行各為一條網線長度，單位為公尺。
output_format: 輸出最大可行長度，單位為公尺並固定兩位小數；若連 1 公分都不可行，輸出 0.00。
samples:
  - input: |
      4 11
      8.02
      7.43
      4.57
      5.39
    output: '2.00'
    explanation: 長度 2.00 公尺可分出 4+3+2+2=11 段；任何至少 2.01 公尺的共同長度皆不足十一段。
core_knowledge:
  - 把所有長度轉為整數公分避免浮點誤差
  - 可切段數隨候選段長增加而單調不增
judgment: 原網線可留下零頭，不要求全部材料用完；切出的段數多於 K 仍屬可行。
hints:
  - 先把 `8.02` 解析成整數 802，答案便是在整數公分上搜尋。
  - 對候選長度 x，可切出的段數是所有 `length_i / x` 的總和；總和至少 K 就可行。
  - 使用尋找最大可行值的二分搜尋；上界可取最長原線，若 1 公分不可行答案即為零。
solution_outline: 將字串長度解析為公分，在 [1,max_length] 二分搜尋。以整數除法統計段數，達到 K 後可提前停止；最後把最大可行公分數格式化回公尺。
proof_or_invariant: >-
  對固定 x，每條長度 L 能提供且最多提供 floor(L/x) 段，故總和至少 K 等價於 x 可行。
  若 x 可行，任何更短正整數長度亦可行，因此可行集合是整數前綴。二分搜尋維持 answer 為已知最大可行候選，
  並完整排除其餘區間，終止時 answer 即最大值。
complexity:
  time: O(N log M)，M 為最長網線的公分數
  space: O(N)
common_errors:
  - 以 double 相除並直接截斷，受到二進位浮點誤差影響
  - 段數剛好大於 K 時誤判為不可行
  - 輸出時漏補小數點後兩位
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int parse_centimeters(const string& text) {
      // TODO：把恰有兩位小數的公尺字串轉成公分。
      (void)text;
      return 0;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, required;
      cin >> n >> required;
      vector<int> lengths(n);
      for (int& length : lengths) {
          string text;
          cin >> text;
          length = parse_centimeters(text);
      }
      // TODO：二分搜尋最大可行整數公分數。
      (void)required;
      cout << "0.00\n";
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int parse_centimeters(const string& text) {
      const size_t dot = text.find('.');
      const int meters = stoi(text.substr(0, dot));
      int cents = 0;
      if (dot != string::npos) {
          cents = (text[dot + 1] - '0') * 10 + (text[dot + 2] - '0');
      }
      return meters * 100 + cents;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, required;
      cin >> n >> required;
      vector<int> lengths(n);
      int high = 0;
      for (int& length : lengths) {
          string text;
          cin >> text;
          length = parse_centimeters(text);
          high = max(high, length);
      }
      int low = 1;
      int answer = 0;
      while (low <= high) {
          const int middle = low + (high - low) / 2;
          long long pieces = 0;
          for (int length : lengths) {
              pieces += length / middle;
              if (pieces >= required) break;
          }
          if (pieces >= required) {
              answer = middle;
              low = middle + 1;
          } else {
              high = middle - 1;
          }
      }
      cout << answer / 100 << '.' << setw(2) << setfill('0') << answer % 100 << '\n';
  }
external_url: http://bailian.openjudge.cn/practice/1064/
external_platform: OpenJudge 百練
external_problem_id: '1064'
external_title: 網線主管
external_relation: original
source_book_pages: [44, 45, 252]
source_pdf_pages: [62, 63, 270]
review_status: verified
---

把量測單位轉成最小精度的整數，是這類切割與二分答案題最重要的實作防線。
