---
id: openj-bailian-1026
volume: lower
source_file: lower-volume
title: OpenJudge 1026 重複置換密碼
chapter: 7
section: '7.7'
kind: external-oj
difficulty: 3
topics: [permutation-cycle, string]
prerequisites: [burnside-polya]
statement: 給長度 n 的置換 a；一次編碼把原位置 i 的字元移到位置 a_i。對每個 k 與訊息，把訊息補空白至 n 後編碼 k 次並輸出。
constraints: [1 <= n <= 200, a 是 1..n 的置換, 訊息長度 <= n]
input_format: 多區塊；每區塊先 n 與置換，接著多行 k message，以 k=0 結束；n=0 結束全部輸入。
output_format: 每次查詢輸出恰 n 個字元；每個區塊後輸出空行。
samples:
  - input: |-
      10
      4 5 3 7 2 8 1 6 10 9
      1 Hello Bob
      1995 CERC
      0
      0
    output: |-
      BolHeol  b
      C RCE
    explanation: 每個字元只沿其所在置換循環移動，步數可對循環長度取模。
core_knowledge: [置換循環分解, 行輸入與尾端空白]
judgment: k 後面的第一個空白只是分隔符；訊息內其餘空白皆是內容。
hints:
  - 置換的每個位置恰屬於一個循環。
  - 一個循環長 L，編碼 k 次只需移動 k mod L 格。
  - 對循環依序記位置 cycle[j]，令 answer[cycle[(j+k)%L]]=message[cycle[j]]。
solution_outline: 預先分解置換循環；每筆讀完整行、補空白，逐循環旋轉字元後輸出。
proof_or_invariant: 一次編碼把 cycle[j] 的字元移到 cycle[j+1]；歸納得 k 次後移到 cycle[j+k mod L]。循環互斥且覆蓋全部位置，因此每個輸出位置恰被填一次。
common_errors: [用 cin 讀訊息而丟失空白, 置換方向反轉, 未輸出尾端補上的空白]
complexity: { time: 'O(n) preprocessing and O(n) per query', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n; while (cin >> n && n != 0) { /* TODO: 分解循環並處理訊息。 */ } }
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      while (cin >> n && n != 0) {
          vector<int> permutation(static_cast<size_t>(n));
          for (int &position : permutation) { cin >> position; --position; }
          vector<bool> visited(static_cast<size_t>(n), false);
          vector<vector<int>> cycles;
          for (int start = 0; start < n; ++start) {
              if (visited[static_cast<size_t>(start)]) continue;
              vector<int> cycle;
              int current = start;
              do {
                  cycle.push_back(current);
                  visited[static_cast<size_t>(current)] = true;
                  current = permutation[static_cast<size_t>(current)];
              } while (current != start);
              cycles.push_back(cycle);
          }
          long long repetitions;
          while (cin >> repetitions && repetitions != 0) {
              string message;
              getline(cin, message);
              if (!message.empty()) message.erase(message.begin());
              message.resize(static_cast<size_t>(n), ' ');
              string answer(static_cast<size_t>(n), ' ');
              for (const vector<int> &cycle : cycles) {
                  const long long length = static_cast<long long>(cycle.size());
                  for (long long index = 0; index < length; ++index) {
                      const int from = cycle[static_cast<size_t>(index)];
                      const int to = cycle[static_cast<size_t>((index + repetitions) % length)];
                      answer[static_cast<size_t>(to)] = message[static_cast<size_t>(from)];
                  }
              }
              cout << answer << '\n';
          }
          cout << '\n';
      }
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/1026/
external_platform: OpenJudge 百練
external_problem_id: '1026'
external_title: Cipher
external_relation: original
source_book_pages: [492, 499]
source_pdf_pages: [122, 129]
review_status: verified
---

把巨大重複次數縮到各置換循環內，是置換群最直接的程式應用。
