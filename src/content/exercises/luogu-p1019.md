---
id: luogu-p1019
volume: upper
source_file: upper-volume
title: 洛谷 P1019 單詞接龍
chapter: 3
section: '3.1'
kind: external-oj
difficulty: 2
topics: [depth-first-search, backtracking, string-overlap]
prerequisites: [recursion, string]
statement: 給定一組單詞與起始字母，要串出最長字串。後一個單詞的前綴須與目前字串的後綴重合，重合部分只保留一次；相鄰兩詞不能讓其中一詞完全包含於重合部分。每個輸入單詞至多使用兩次，求最長可能長度。
constraints:
  - 每個單詞最多使用兩次
  - 只允許長度小於相鄰兩詞長度的非空重合
  - 保證至少有一個單詞以指定字母開頭
input_format: 第一行為單詞數 n；接著 n 行各一個單詞；最後一行為接龍起始字母。
output_format: 輸出最長接龍字串的長度。
samples:
  - input: |
      5
      at
      touch
      cheat
      choose
      tact
      a
    output: '23'
    explanation: 可形成 `atoucheatactactouchoose`，長度為 23；每次只附加新單詞未重合的尾段。
core_knowledge:
  - 預處理最短合法重合長度
  - 有使用次數上限的 DFS 回溯
judgment: 同樣拼字但位於輸入不同列的單詞仍是不同項；為讓結果最長，兩詞若有多種重合，應使用最短的合法重合。
hints:
  - 對每個有序詞對，檢查前詞後綴與後詞前綴；重合不能等於任一詞的完整長度。
  - 預先保存每對詞最短的合法重合；使用該邊時，總長度增加後詞長度減重合長度。
  - 從所有首字母符合的詞開始 DFS，以計數陣列限制每個詞最多兩次，返回時撤銷。
solution_outline: 對所有有序詞對由短至長找第一個合法重合。枚舉起始詞後回溯；每次可接上尚未使用兩次且有重合的詞，更新目前長度與全域最大值。
proof_or_invariant: DFS 狀態的使用次數與目前接龍完全一致，current_length 等於拼接結果長度。每次轉移恰枚舉所有可接且未超限的下一詞，所以所有合法接龍都會出現。固定相鄰兩詞時，選較短重合只增加長度且不改變結果尾端，因此不會減少後續可接選擇；只保留最短合法重合仍包含某個最優解。
complexity:
  time: O(n^2 L^2 + n^(2n)) 的搜尋上界，L 為最大詞長；實際由重合關係大量剪枝
  space: O(n^2 + n)
common_errors:
  - 允許重合整個單詞，違反相鄰部分不可包含
  - 每次選最大重合，與求最長總字串的目標相反
  - 回溯後忘記減少使用次數
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<string> words(n);
      for (string& word : words) cin >> word;
      char initial;
      cin >> initial;
      // TODO：預處理最短合法重合，再從每個合法起始詞回溯求最大長度。
      cout << 0 << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<string> words(n);
      for (string& word : words) cin >> word;
      char initial;
      cin >> initial;
      vector<vector<int>> overlap(n, vector<int>(n, 0));
      for (int from = 0; from < n; ++from) {
          for (int to = 0; to < n; ++to) {
              const int limit = static_cast<int>(min(words[from].size(), words[to].size()));
              for (int length = 1; length < limit; ++length) {
                  if (words[from].compare(words[from].size() - static_cast<size_t>(length),
                                          static_cast<size_t>(length), words[to], 0,
                                          static_cast<size_t>(length)) == 0) {
                      overlap[from][to] = length;
                      break;
                  }
              }
          }
      }
      vector<int> used(n, 0);
      int answer = 0;
      const auto search = [&](const auto& self, int last, int current_length) -> void {
          answer = max(answer, current_length);
          for (int next = 0; next < n; ++next) {
              if (used[next] == 2 || overlap[last][next] == 0) continue;
              ++used[next];
              self(self, next, current_length + static_cast<int>(words[next].size())
                   - overlap[last][next]);
              --used[next];
          }
      };
      for (int start = 0; start < n; ++start) {
          if (words[start].front() != initial) continue;
          ++used[start];
          search(search, start, static_cast<int>(words[start].size()));
          --used[start];
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1019
external_platform: 洛谷
external_problem_id: P1019
external_title: '[NOIP 2000 提高組] 單詞接龍（疑似錯題）'
external_relation: original
source_book_pages: [109]
source_pdf_pages: [127]
review_status: verified
---

預處理詞與詞的接法後，搜尋只需維護最後一詞、使用次數與目前長度。
