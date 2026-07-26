---
id: luogu-p3065
volume: lower
source_file: lower-volume
title: 洛谷 P3065 First! G
chapter: 9
section: '9.3'
kind: external-oj
difficulty: 5
topics: [trie, precedence-graph, topological-sort]
prerequisites: [trie, directed-acyclic-graph]
statement: 給定互異的小寫字串，可以任意重排 26 個字母的先後順序。求哪些字串能在某種字母順序下嚴格排在其他所有字串之前。
constraints: ['1 <= n <= 30000', 所有字串總長不超過 300000, 字串非空且互異]
input_format: 第一行 n，接著 n 行小寫字串。
output_format: 先輸出可行字串數，再依原輸入順序逐行輸出可行字串。
samples:
  - input: "4\nomm\nmoo\nmom\nommnom\n"
    output: "2\nomm\nmom\n"
    explanation: omm 與 mom 各有一種字母順序可使自己最小；ommnom 永遠排在其前綴 omm 之後。
core_knowledge: [Trie 首次分歧, 字母先後限制圖, 有向圖判環]
judgment: 每個候選可使用不同的字母順序；輸出仍須保持原輸入順序。
hints:
  - 若另一字串是候選的嚴格前綴，候選在任何字母表下都不可能先於它。
  - 沿候選的 Trie 路徑選邊 c 時，對同節點每條其他孩子邊 d 加入限制 c<d。
  - 26 個字母的限制圖無環時才存在拓撲序，也就是可行的字母順序。
solution_outline: 建立全部字串 Trie。逐候選沿路徑收集所選字母指向其他孩子字母的邊，檢查途中終止節點，再以 Kahn 判斷限制圖是否無環。
proof_or_invariant: 任一其他字串與候選若無前綴關係，字典序只由首次分歧的兩字母決定，演算法恰加入使候選較小的必要限制；前綴情形另行排除。所有限制可同時滿足當且僅當圖可拓撲排序，因此判定充要。
common_errors: [漏判另一字串是候選前綴, 把限制方向寫反, 不同候選沿用前一張限制圖]
complexity: { time: O(26L), space: O(L) }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：建 Trie；逐候選建立 26 字母限制圖並判環。
      return 0;
  }
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <queue>
  #include <string>
  #include <vector>
  using namespace std;

  struct Node {
      array<int, 26> next{};
      bool terminal = false;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n = 0;
      cin >> n;
      vector<string> words(static_cast<size_t>(n));
      vector<Node> trie(1);
      for (string& word : words) {
          cin >> word;
          int node = 0;
          for (char ch : word) {
              const size_t c = static_cast<size_t>(ch - 'a');
              if (trie[static_cast<size_t>(node)].next[c] == 0) {
                  trie[static_cast<size_t>(node)].next[c] = static_cast<int>(trie.size());
                  trie.push_back({});
              }
              node = trie[static_cast<size_t>(node)].next[c];
          }
          trie[static_cast<size_t>(node)].terminal = true;
      }

      vector<string> answer;
      for (const string& word : words) {
          array<array<bool, 26>, 26> edge{};
          bool valid = true;
          int node = 0;
          for (char ch : word) {
              if (trie[static_cast<size_t>(node)].terminal) {
                  valid = false;
                  break;
              }
              const int chosen = ch - 'a';
              for (int other = 0; other < 26; ++other) {
                  if (other != chosen &&
                      trie[static_cast<size_t>(node)].next[static_cast<size_t>(other)] != 0) {
                      edge[static_cast<size_t>(chosen)][static_cast<size_t>(other)] = true;
                  }
              }
              node = trie[static_cast<size_t>(node)].next[static_cast<size_t>(chosen)];
          }
          if (valid) {
              array<int, 26> indegree{};
              for (int from = 0; from < 26; ++from) {
                  for (int to = 0; to < 26; ++to) {
                      if (edge[static_cast<size_t>(from)][static_cast<size_t>(to)]) {
                          ++indegree[static_cast<size_t>(to)];
                      }
                  }
              }
              queue<int> ready;
              for (int c = 0; c < 26; ++c) {
                  if (indegree[static_cast<size_t>(c)] == 0) { ready.push(c); }
              }
              int seen = 0;
              while (!ready.empty()) {
                  const int from = ready.front();
                  ready.pop();
                  ++seen;
                  for (int to = 0; to < 26; ++to) {
                      if (edge[static_cast<size_t>(from)][static_cast<size_t>(to)] &&
                          --indegree[static_cast<size_t>(to)] == 0) {
                          ready.push(to);
                      }
                  }
              }
              valid = seen == 26;
          }
          if (valid) { answer.push_back(word); }
      }
      cout << answer.size() << '\n';
      for (const string& word : answer) { cout << word << '\n'; }
  }
external_url: https://www.luogu.com.cn/problem/P3065
external_platform: 洛谷
external_problem_id: P3065
external_title: '[USACO12DEC] First! G'
external_relation: original
source_book_pages: [554, 574]
source_pdf_pages: [184, 204]
review_status: verified
---

Trie 的每個首次分歧都產生一條字母先後限制；全域只剩一張 26 點有向圖是否無環。
