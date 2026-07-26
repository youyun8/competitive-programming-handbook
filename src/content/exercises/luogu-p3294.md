---
id: luogu-p3294
volume: lower
source_file: lower-volume
title: 洛谷 P3294 背單詞
chapter: 9
section: '9.3'
kind: external-oj
difficulty: 5
topics: [reversed-trie, tree-greedy, exchange-argument]
prerequisites: [trie, subtree-size]
statement: >-
  排列所有單字。若某單字的後綴尚未學習，代價為 n^2；否則代價為目前位置減去最近一個已學後綴的位置
  （不存在後綴時視為位置 0）。求最小總代價。
constraints: ['1 <= n <= 100000', 單字互異且只含小寫字母, 所有單字總長不超過 510000]
input_format: 第一行 n，接著 n 行單字。
output_format: 輸出最少總代價。
samples:
  - input: "2\na\nba\n"
    output: '2'
    explanation: 先學 a 再學 ba，兩次代價都是 1，總和 2。
core_knowledge: [反向 Trie 把後綴變祖先, 最近終止祖先形成單字樹, 小子樹優先的交換論證]
judgment: 單字互異；必須避免任何後綴排在原單字之後所造成的 n^2 代價。
hints:
  - 反轉單字插入 Trie，某單字的後綴就對應它的祖先終止節點。
  - 壓縮掉非終止節點，讓每個單字連到最近祖先單字，合法順序必須父先於子。
  - 同一父節點的孩子子樹完整處理時，將較小子樹排前面；交換兩相鄰子樹即可比較代價。
solution_outline: 建反向 Trie 與壓縮單字樹，求每棵子樹的單字數，將孩子依大小遞增排序後 DFS 編號；答案累加 position[u]-position[parent[u]]。
proof_or_invariant: >-
  最優排列不會讓後綴晚於原字，否則 n^2 可由拓撲順序嚴格改善。固定父節點，交換相鄰的兩個完整子樹時，
  只有等待位置偏移改變；小子樹先的成本不大於大子樹先。對每個節點遞迴套用交換論證即得全域最優。
common_errors: [正向建 Trie 而處理成前綴關係, 把非終止 Trie 節點也當單字, 將大子樹排在前面]
complexity: { time: O(L + n log n), space: O(L) }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：反向建 Trie、壓縮成單字樹、依子樹大小貪心 DFS。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <functional>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;

  struct Node {
      array<int, 26> next{};
      int word_id = 0;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n = 0;
      cin >> n;
      vector<Node> trie(1);
      for (int id = 1; id <= n; ++id) {
          string word;
          cin >> word;
          int node = 0;
          for (auto it = word.rbegin(); it != word.rend(); ++it) {
              const size_t c = static_cast<size_t>(*it - 'a');
              if (trie[static_cast<size_t>(node)].next[c] == 0) {
                  trie[static_cast<size_t>(node)].next[c] = static_cast<int>(trie.size());
                  trie.push_back({});
              }
              node = trie[static_cast<size_t>(node)].next[c];
          }
          trie[static_cast<size_t>(node)].word_id = id;
      }

      vector<vector<int>> tree(static_cast<size_t>(n + 1));
      vector<int> parent(static_cast<size_t>(n + 1), 0);
      function<void(int, int)> compress = [&](int node, int ancestor) {
          int next_ancestor = ancestor;
          if (trie[static_cast<size_t>(node)].word_id != 0) {
              const int id = trie[static_cast<size_t>(node)].word_id;
              tree[static_cast<size_t>(ancestor)].push_back(id);
              parent[static_cast<size_t>(id)] = ancestor;
              next_ancestor = id;
          }
          for (int child : trie[static_cast<size_t>(node)].next) {
              if (child != 0) { compress(child, next_ancestor); }
          }
      };
      compress(0, 0);

      vector<int> subtree_size(static_cast<size_t>(n + 1), 1);
      subtree_size[0] = 0;
      function<void(int)> measure = [&](int node) {
          for (int child : tree[static_cast<size_t>(node)]) {
              measure(child);
              subtree_size[static_cast<size_t>(node)] +=
                  subtree_size[static_cast<size_t>(child)];
          }
          sort(tree[static_cast<size_t>(node)].begin(), tree[static_cast<size_t>(node)].end(),
               [&](int lhs, int rhs) {
                   return subtree_size[static_cast<size_t>(lhs)] <
                          subtree_size[static_cast<size_t>(rhs)];
               });
      };
      measure(0);

      vector<int> position(static_cast<size_t>(n + 1), 0);
      int timer = 0;
      function<void(int)> assign_order = [&](int node) {
          if (node != 0) { position[static_cast<size_t>(node)] = ++timer; }
          for (int child : tree[static_cast<size_t>(node)]) { assign_order(child); }
      };
      assign_order(0);

      long long answer = 0;
      for (int node = 1; node <= n; ++node) {
          answer += position[static_cast<size_t>(node)] -
                    position[static_cast<size_t>(parent[static_cast<size_t>(node)])];
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P3294
external_platform: 洛谷
external_problem_id: P3294
external_title: '[SCOI2016] 背單詞'
external_relation: original
source_book_pages: [554, 574]
source_pdf_pages: [184, 204]
review_status: verified
---

反向 Trie 先把後綴依賴變成樹，再由「短工作先做」式交換論證決定兄弟子樹順序。
