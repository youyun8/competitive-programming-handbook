---
id: huffman-encoding
volume: upper
source_file: upper-volume
title: OpenJudge 1521 Entropy
chapter: 1
section: '1.4'
kind: external-oj
difficulty: 2
topics: [huffman, greedy, priority-queue]
prerequisites: [priority-queue, trees]
statement: >-
  給定若干行只含大寫英文字母、數字與底線的文字（底線代表空白），比較固定使用 8 位元表示每個字元時的長度，
  與最佳二進位前綴碼所需的最少位元數，並計算兩者的壓縮比。單獨一行 END 表示輸入結束，不納入處理。
constraints:
  - 總時間限制 1000 ms，記憶體限制 65536 kB
  - 每行只含大寫英文字母、數字與底線；官方題面未另列字串長度上限
  - 若文字只有一種字元，仍以一位元碼表示每次出現
input_format: 每行一個待編碼字串；讀到內容恰為 END 的一行時結束。
output_format: 每筆依序輸出固定 8 位元編碼長度、最佳前綴碼長度，以及前者除以後者的比值（四捨五入至小數一位）。
samples:
  - input: |
      AAAAABCD
      THE_CAT_IN_THE_HAT
      END
    output: |
      64 13 4.9
      144 51 2.8
    explanation: 第一行頻率為 5、1、1、1；依序合併 1+1、1+2、3+5，成本總和為 2+3+8=13。
core_knowledge:
  - 最佳二進位前綴碼的總長度等於霍夫曼樹的帶權外部路徑長度
  - 每次合併兩個最小頻率，可用最小堆實作
judgment: 每筆答案為三個欄位；壓縮比須使用浮點除法並固定輸出一位小數，END 不得產生輸出。
hints:
  - 先只統計每個可出現字元的次數；實際碼字內容不影響答案。
  - 一棵前綴碼樹最深的一對兄弟葉可以安排給目前頻率最小的兩個字元。
  - 把這兩個頻率合成一個新頻率放回最小堆；每次合併值的總和就是最佳位元數。
solution_outline: >-
  對每行統計字元頻率並放進最小堆。若只有一種字元，最佳長度就是原字串長度；否則反覆取出兩個最小值，
  將它們的和累加到答案並放回堆，直到只剩一項。固定編碼長度為字串長度乘 8。
proof_or_invariant: >-
  在任一最佳前綴碼樹中，可交換葉子而不改變樹形，令最小的兩個權重位於最深的一對兄弟；縮合這對兄弟後，
  剩下的是權重和取代兩者的同型最佳子問題。反覆套用即得霍夫曼合併，而每次合併和正是兩棵子樹所有葉子深度增加一的成本。
common_errors:
  - 把 END 當成資料處理
  - 唯一字元時讓合併成本保持為 0，而忽略題目採一位元碼
  - 用整數相除計算壓縮比
complexity:
  time: O(L + a log a)，L 為該行長度，a 為不同字元數且 a <= 37
  space: O(a)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static long long optimal_bits(const string& text) {
      array<int, 256> frequency{};
      for (unsigned char ch : text) { ++frequency[ch]; }
      priority_queue<long long, vector<long long>, greater<long long>> min_heap;
      for (int count : frequency) {
          if (count > 0) { min_heap.push(count); }
      }
      if (min_heap.size() == 1) { return static_cast<long long>(text.size()); }
      long long result = 0;
      // TODO：反覆合併兩個最小頻率，並累加合併成本。
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string text;
      while (getline(cin, text) && text != "END") {
          const long long ascii_bits = static_cast<long long>(text.size()) * 8;
          const long long encoded_bits = optimal_bits(text);
          cout << ascii_bits << ' ' << encoded_bits << ' '
               << fixed << setprecision(1)
               << static_cast<double>(ascii_bits) / static_cast<double>(encoded_bits) << '\n';
      }
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static long long optimal_bits(const string& text) {
      array<int, 256> frequency{};
      for (unsigned char ch : text) { ++frequency[ch]; }
      priority_queue<long long, vector<long long>, greater<long long>> min_heap;
      for (int count : frequency) {
          if (count > 0) { min_heap.push(count); }
      }
      if (min_heap.size() == 1) { return static_cast<long long>(text.size()); }
      long long result = 0;
      while (min_heap.size() > 1) {
          const long long first = min_heap.top();
          min_heap.pop();
          const long long second = min_heap.top();
          min_heap.pop();
          const long long merged = first + second;
          result += merged;
          min_heap.push(merged);
      }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string text;
      while (getline(cin, text) && text != "END") {
          const long long ascii_bits = static_cast<long long>(text.size()) * 8;
          const long long encoded_bits = optimal_bits(text);
          cout << ascii_bits << ' ' << encoded_bits << ' '
               << fixed << setprecision(1)
               << static_cast<double>(ascii_bits) / static_cast<double>(encoded_bits) << '\n';
      }
  }
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
external_url: http://bailian.openjudge.cn/practice/1521/
external_platform: OpenJudge 百練
external_problem_id: '1521'
external_title: Entropy
external_relation: original
---

官方範例可直接看出「固定八位元」與「最佳前綴碼」的差距；本卡只重述計算任務，不重製原題的背景文章。
