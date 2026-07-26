---
id: openj-bailian-2763
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2763 Java Reader 類：原始位元組串流轉送
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 1
topics: [io, byte-stream, encoding]
prerequisites: []
statement: 標準輸入是一份可能採 ASCII、UTF-16 小端、UTF-16 大端或 UTF-8 儲存的文字檔。必須以正確編碼保留其所有行，並將同樣的文字檔內容輸出。
constraints: ['輸入為題目列出的四種文字編碼之一', '輸出需逐位元組保留原始內容']
input_format: 一份文字檔的完整內容，直到 EOF。
output_format: 原樣輸出輸入檔案的全部內容。
samples:
  - input: |
      同學們，
      大家好！
      我們現在來學習Java的IO
      這部分可能挺難，
      但學會了也挺容易！ :-)
    output: |
      同學們，
      大家好！
      我們現在來學習Java的IO
      這部分可能挺難，
      但學會了也挺容易！ :-)
    explanation: 不解碼、不修改換行與字元位元組，輸出自然與輸入完全一致。
core_knowledge: [編碼與位元組序列的區別, EOF 串流轉送]
judgment: 題目雖以 Java Reader 命名，但若輸出需與輸入相同，C++ 可直接轉送原始位元組，無須猜測或轉換編碼。
hints:
  - 不同編碼的解碼規則不同，但本題並未要求轉成另一種編碼。
  - 若輸出與輸入必須完全一致，最安全的資訊單位不是「字元」而是原始位元組。
  - 將 `cin` 的 stream buffer 直接送入 `cout`，直到 EOF，即可連 BOM、NUL 與換行一起保留。
solution_outline: 關閉不必要的同步後，使用 `cout << cin.rdbuf()` 將整個標準輸入位元組串流原樣複製至標準輸出。
proof_or_invariant: 串流緩衝區轉送不進行字元編碼解析；每個讀到的位元組依原順序寫出。因此輸出位元組序列與輸入完全相同，在任何列出的編碼下都代表相同文字與行。
common_errors: [以 getline 讀 UTF-16 導致內含 NUL 被錯誤處理, 自行轉碼而遺失 BOM, 額外輸出換行]
complexity: { time: 'O(B)，B 為輸入位元組數', space: 'O(1) 額外緩衝' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：不要解碼；直接轉送標準輸入的位元組串流。
      return 0;
  }
cpp_solution: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      cout << cin.rdbuf();
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/2763/
external_platform: OpenJudge 百練
external_problem_id: '2763'
external_title: Java Reader 類
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

此編號在題單章節中屬於錯配；官方頁是編碼輸入題，直接做無損位元組轉送比嘗試辨識編碼更可靠。
