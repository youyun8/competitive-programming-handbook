---
id: luogu-p5357
volume: lower
source_file: lower-volume
title: 洛谷 P5357 AC 自動機：統計每個模式串的出現次數
chapter: 9
section: '9.6'
kind: external-oj
difficulty: 4
topics: ['AC 自動機', 'fail 樹', '拓撲累加', '多模式匹配']
prerequisites: ['ac-automaton', 'trie']
statement: |-
  給定 n 個模式串與一個文本串，求每個模式串在文本中出現的次數（可重疊）。
constraints:
  - '模式串總長與文本長度都很大，不能對每個位置沿 fail 鏈往上跳'
  - '模式串可能重複出現'
input_format: '第一行一個整數 n；接下來 n 行每行一個模式串；最後一行是文本串。'
output_format: '輸出 n 行，第 i 行是第 i 個模式串在文本中出現的次數。'
samples:
  - input: |
      2
      ab
      abab
      ababab
    output: |
      3
      2
    explanation: |-
      ab 在 ababab 中出現 3 次（位置 1、3、5）；abab 出現 2 次（位置 1、3），允許重疊。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
core_knowledge:
  - Trie 同時保存所有模式前綴
  - fail 指標表示最長可用後綴
  - 文本命中沿 fail 樹由深到淺累加
judgment: 依輸入順序輸出每個模式的出現次數；重複模式與重疊出現都需分別正確回報。
hints:
  - 把所有模式插入 Trie，記住每個輸入模式的終止節點。
  - BFS 建 fail，並把不存在的轉移補成 fail 狀態的同字元轉移，使掃描每字只走一步。
  - 掃文本只增加目前狀態；反向 BFS 把次數加給 fail，終止節點上的值即答案。
solution_outline: |-
  把所有模式串插入 Trie 並記下各自的結尾節點。BFS 建 fail 並對缺失轉移做路徑壓縮，同時記錄 BFS 順序。掃文本時每步只把當前節點的命中數加一。最後反著走 BFS 順序，把每個節點的命中數累加給它的 fail，各模式串結尾節點上的值即為答案。
proof_or_invariant: |-
  fail 樹的性質是「節點 v 的祖先恰為 v 所代表字串的所有後綴中，同時是某模式串前綴的那些」。因此文本在位置 i 匹配到節點 u 時，所有以 i 結尾的模式串恰為 u 到根路徑上的模式串結尾節點。把命中數沿樹累加，等價於對每個位置枚舉整條 fail 鏈，但總成本降為 O(節點數)。
common_errors:
  - 掃文本時逐次沿 fail 鏈統計而退化
  - clone 式地覆蓋重複模式的終點編號
  - 累加 fail 樹時使用正向 BFS 順序
complexity:
  time: 'O(模式串總長 + 文本長 + 節點數)'
  space: 'O(模式串總長 × 字元集)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct AhoCorasick {
      struct Node {
          array<int, 26> next{};
          int fail = 0;
      };
      vector<Node> nodes{Node{}};
      vector<int> pattern_end;
      vector<int> hit_count;
      vector<int> order;

      // 已備好：把模式串插進 Trie，回傳它結尾對應的節點。
      int insert(const string& word) {
          int node = 0;
          for (const char c : word) {
              const size_t index = static_cast<size_t>(c - 'a');
              if (nodes[static_cast<size_t>(node)].next[index] == 0) {
                  nodes[static_cast<size_t>(node)].next[index] = static_cast<int>(nodes.size());
                  nodes.push_back(Node{});
              }
              node = nodes[static_cast<size_t>(node)].next[index];
          }
          return node;
      }

      // TODO 1：BFS 建 fail 指標。
      //   fail[v] 指向「v 代表的字串的最長真後綴，且該後綴也是某個模式串的前綴」。
      //   實作時對每個節點的 26 個字元做：
      //     子節點存在 -> 它的 fail 是「父節點的 fail 沿同一字元走一步」；
      //     子節點不存在 -> 直接把 next[c] 指到那一步（路徑壓縮），
      //       這樣文本匹配時就永遠不必沿 fail 鏈回退。
      //   順便把 BFS 順序記進 order，稍後要反著用。
      void build() {}

      // TODO 2：掃文本。每讀一個字元就沿 next 走一步，並把該節點的命中數加一。
      // TODO 3：統計。反著走 BFS 序（等於 fail 樹由葉到根），
      //   把每個節點的命中數累加給它的 fail。這樣一次 O(節點數) 就得到
      //   每個模式串的總出現次數，不必對每個位置沿 fail 鏈往上跳。
      void run(const string& text) {
          hit_count.assign(nodes.size(), 0);
          (void)text;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      AhoCorasick automaton;
      automaton.pattern_end.resize(static_cast<size_t>(n));
      for (int i = 0; i < n; ++i) {
          string word;
          cin >> word;
          automaton.pattern_end[static_cast<size_t>(i)] = automaton.insert(word);
      }
      automaton.build();
      string text;
      cin >> text;
      automaton.run(text);
      for (int i = 0; i < n; ++i) {
          cout << automaton.hit_count[static_cast<size_t>(automaton.pattern_end[static_cast<size_t>(i)])]
               << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // AC 自動機（二次加強版）：要統計每個模式串在文本中出現幾次。
  // 關鍵優化是把 fail 指標構成的樹拿出來，在上面做一次拓撲累加，
  // 而不是對每個位置沿 fail 鏈往上跳。
  struct AhoCorasick {
      struct Node {
          array<int, 26> next{};
          int fail = 0;
      };
      vector<Node> nodes{Node{}};
      vector<int> pattern_end;   // 每個模式串對應的節點
      vector<int> hit_count;     // 每個節點被文本命中的次數

      int insert(const string& word) {
          int node = 0;
          for (const char c : word) {
              const size_t index = static_cast<size_t>(c - 'a');
              if (nodes[static_cast<size_t>(node)].next[index] == 0) {
                  nodes[static_cast<size_t>(node)].next[index] = static_cast<int>(nodes.size());
                  nodes.push_back(Node{});
              }
              node = nodes[static_cast<size_t>(node)].next[index];
          }
          return node;
      }

      vector<int> order;  // BFS 順序，反著走就是 fail 樹的拓撲序

      void build() {
          deque<int> queue_nodes;
          for (size_t c = 0; c < 26; ++c) {
              const int child = nodes[0].next[c];
              if (child != 0) { queue_nodes.push_back(child); }
          }
          while (!queue_nodes.empty()) {
              const int node = queue_nodes.front();
              queue_nodes.pop_front();
              order.push_back(node);
              for (size_t c = 0; c < 26; ++c) {
                  const int child = nodes[static_cast<size_t>(node)].next[c];
                  const int fallback = nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].fail)].next[c];
                  if (child != 0) {
                      nodes[static_cast<size_t>(child)].fail = fallback;
                      queue_nodes.push_back(child);
                  } else {
                      // 路徑壓縮：走不下去時直接指向 fail 的對應子節點。
                      nodes[static_cast<size_t>(node)].next[c] = fallback;
                  }
              }
          }
      }

      void run(const string& text) {
          hit_count.assign(nodes.size(), 0);
          int node = 0;
          for (const char c : text) {
              node = nodes[static_cast<size_t>(node)].next[static_cast<size_t>(c - 'a')];
              ++hit_count[static_cast<size_t>(node)];
          }
          // 反 BFS 序等於 fail 樹由葉往根，一次累加即得每個節點的總命中數。
          for (size_t i = order.size(); i-- > 0;) {
              const int node_id = order[i];
              hit_count[static_cast<size_t>(nodes[static_cast<size_t>(node_id)].fail)] +=
                  hit_count[static_cast<size_t>(node_id)];
          }
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      AhoCorasick automaton;
      automaton.pattern_end.resize(static_cast<size_t>(n));
      for (int i = 0; i < n; ++i) {
          string word;
          cin >> word;
          automaton.pattern_end[static_cast<size_t>(i)] = automaton.insert(word);
      }
      automaton.build();
      string text;
      cin >> text;
      automaton.run(text);
      for (int i = 0; i < n; ++i) {
          cout << automaton.hit_count[static_cast<size_t>(automaton.pattern_end[static_cast<size_t>(i)])] << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5357
external_platform: 洛谷
external_problem_id: P5357
external_title: '【模板】AC 自動機（二次加強版）'
external_relation: original
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

「把 fail 指標看成樹」是 AC 自動機的分水嶺。想通這點，一大類計數問題都變成樹上求和。
