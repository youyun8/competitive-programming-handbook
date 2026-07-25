---
id: luogu-p5496
volume: lower
source_file: lower-volume
title: 洛谷 P5496 回文自動機：每個位置的回文後綴個數
chapter: 9
section: '9.4'
kind: external-oj
difficulty: 5
topics: ['回文自動機', 'PAM', 'Eertree', '強制在線']
prerequisites: ['palindromic-tree', 'manacher']
statement: |-
  給定一個字串，對每個位置求出以該位置結尾的回文子串個數。字串是加密的，每個字元要用上一個答案解密，因此必須線上處理。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '強制在線：第 i 個字元需用第 i−1 個答案解密，不能先讀完再處理'
  - '字串長度可達 5×10^5'
  - '完整限制條件請參閱外部題目頁面'
input_format: '一行一個字串（加密後）。第 i 個字元的真實值為 (s[i] − 97 + last) mod 26 + 97，其中 last 是上一個答案、初始為 0。'
output_format: '一行若干個整數，第 i 個表示以第 i 個位置結尾的回文子串個數。'
samples:
  - input: |
      abbbaaaa
    output: |
      1 1 2 1 1 2 1 2
    explanation: |-
      字元是加密的，所以實際處理的字串並不是輸入看起來的樣子：依 (s[i] − 97 + last) mod 26 + 97 逐位解密後得到 accdbbcb，每個位置的回文後綴個數即為 1 1 2 1 1 2 1 2。例如最後一位的 b 有 b 與 bcb 兩個回文後綴。這也說明為什麼本題必須線上處理。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    回文自動機（又稱 Eertree）的每個節點代表一個**本質不同**的回文串。關鍵事實是：長度為 n 的字串最多只有 n 個本質不同的回文子串，所以節點數是 O(n)。
  - |-
    結構有兩個根：長度 0 的偶根與長度 −1 的奇根。長度 −1 看起來很怪，但它讓「單一字元」也能套用同一條擴展公式 len = len[parent] + 2（−1 + 2 = 1），省掉大量特判。
  - |-
    fail[v] 指向 v 所代表回文的**最長回文真後綴**。加入新字元時，從 last 沿 fail 鏈往上找第一個能兩側擴展的回文（也就是 s[i − len − 1] == s[i]），在它下面掛新節點。
  - |-
    本題要的答案是 depth[v]＝沿 fail 鏈到根的步數。這恰好等於「以當前位置結尾的回文子串個數」，因為每個回文後綴各對應 fail 鏈上的一個節點，一一對應不重不漏。
  - |-
    強制在線是刻意的設計：字元要用上一個答案解密，所以你不能先讀完整個字串再處理。這正好逼你寫出真正線上的 PAM——它本來就是逐字元擴展的結構，不像後綴陣列那樣需要看到全文。
solution_outline: |-
  建立奇偶兩個根。逐字元處理：先用上一個答案解密，再沿 fail 鏈找到第一個可兩側擴展的回文作為父節點；若該轉移不存在就新建節點（length = len[parent] + 2，fail 由父節點的 fail 再找一次可擴展節點取得，depth = depth[fail] + 1）。輸出新 last 節點的 depth 即為該位置的答案。
proof_or_invariant: |-
  核心不變量是「last 恆為當前前綴的最長回文後綴」。由此出發沿 fail 鏈即可枚舉所有回文後綴，且鏈長等於回文後綴個數，故 depth 就是答案。每個字元最多新增一個節點，配合 fail 鏈的攤還論證（與 KMP 相同），總時間為 O(n)。
complexity:
  time: 'O(n)'
  space: 'O(n × 字元集)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // 回文自動機（PAM / Eertree）：每個節點代表一個「本質不同」的回文串。
  struct PalindromicTree {
      struct Node {
          array<int, 26> next{};
          int fail = 0;
          int length = 0;
          int depth = 0;
      };
      vector<Node> nodes;
      string text;
      int last = 0;

      // 已備好：兩個根。奇根長度 −1 是個巧妙的技巧——
      // 它讓「單一字元」也能套用同一條擴展公式 len = len[parent] + 2。
      PalindromicTree() {
          nodes.resize(2);
          nodes[0].length = -1;
          nodes[0].fail = 0;
          nodes[1].length = 0;
          nodes[1].fail = 0;
          last = 1;
      }

      // TODO 1：沿 fail 鏈往上找到第一個能在兩側同時擴展的回文，
      //   也就是滿足 text[position − len[node] − 1] == text[position] 的節點。
      int find_extendable(int node, int position) const {
          (void)position;
          return node;
      }

      // TODO 2：加入一個字元並回傳「以此位置結尾的回文子串個數」。
      //   1. 用 find_extendable 找到可擴展的父節點 parent。
      //   2. 若 parent 沒有 c 轉移就新建節點：
      //        length = len[parent] + 2；
      //        長度為 1 時 fail 指向偶根（空串），
      //        否則從 fail[parent] 再找一次可擴展節點，取它的 c 轉移；
      //        depth = depth[fail] + 1。
      //   3. last 更新為該節點，回傳它的 depth。
      //   關鍵事實：depth（沿 fail 鏈到根的步數）恰好等於
      //   「以當前位置結尾的回文子串個數」，因為每個回文後綴各對應一個節點。
      int add(char c) {
          text += c;
          (void)c;
          return 0;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string encrypted;
      if (!(cin >> encrypted)) { return 0; }
      PalindromicTree tree;
      long long last_answer = 0;
      string out;
      for (const char raw : encrypted) {
          // 強制在線：本題的字元是加密的，必須用「上一個答案」解密，
          // 因此不能先讀完整個字串再處理——只能逐字元線上建構。
          const int shifted = (raw - 'a' + static_cast<int>(last_answer % 26)) % 26;
          last_answer = tree.add(static_cast<char>('a' + shifted));
          out += to_string(last_answer);
          out += ' ';
      }
      if (!out.empty()) { out.back() = '\n'; }
      cout << out;
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 回文自動機（PAM / Eertree）：每個節點代表一個本質不同的回文串，
  // fail 指向該回文的最長回文真後綴。節點的深度（沿 fail 到根的步數）
  // 恰好等於「以當前位置結尾的回文子串個數」。
  struct PalindromicTree {
      struct Node {
          array<int, 26> next{};
          int fail = 0;
          int length = 0;
          int depth = 0;  // 沿 fail 鏈往上有幾個回文
      };
      vector<Node> nodes;
      string text;
      int last = 0;

      PalindromicTree() {
          nodes.resize(2);
          nodes[0].length = -1;  // 奇根：長度 -1，讓單字元回文能掛上來
          nodes[0].fail = 0;
          nodes[1].length = 0;   // 偶根：長度 0
          nodes[1].fail = 0;
          last = 1;
          text = "";
      }

      // 沿 fail 鏈找到第一個能在兩側擴展的回文。
      int find_extendable(int node, int position) const {
          while (position - nodes[static_cast<size_t>(node)].length - 1 < 0 ||
                 text[static_cast<size_t>(position - nodes[static_cast<size_t>(node)].length - 1)] !=
                     text[static_cast<size_t>(position)]) {
              node = nodes[static_cast<size_t>(node)].fail;
          }
          return node;
      }

      int add(char c) {
          text += c;
          const int position = static_cast<int>(text.size()) - 1;
          const size_t index = static_cast<size_t>(c - 'a');
          const int parent = find_extendable(last, position);
          if (nodes[static_cast<size_t>(parent)].next[index] == 0) {
              const int created = static_cast<int>(nodes.size());
              nodes.push_back(Node{});
              nodes[static_cast<size_t>(created)].length = nodes[static_cast<size_t>(parent)].length + 2;
              if (nodes[static_cast<size_t>(created)].length == 1) {
                  nodes[static_cast<size_t>(created)].fail = 1;  // 單字元的回文後綴是空串
              } else {
                  const int fallback = find_extendable(nodes[static_cast<size_t>(parent)].fail, position);
                  nodes[static_cast<size_t>(created)].fail =
                      nodes[static_cast<size_t>(fallback)].next[index];
              }
              nodes[static_cast<size_t>(created)].depth =
                  nodes[static_cast<size_t>(nodes[static_cast<size_t>(created)].fail)].depth + 1;
              nodes[static_cast<size_t>(parent)].next[index] = created;
          }
          last = nodes[static_cast<size_t>(parent)].next[index];
          return nodes[static_cast<size_t>(last)].depth;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string encrypted;
      if (!(cin >> encrypted)) { return 0; }
      PalindromicTree tree;
      long long last_answer = 0;
      string out;
      for (const char raw : encrypted) {
          // 強制在線：每個字元要用上一個答案解密。
          const int shifted = (raw - 'a' + static_cast<int>(last_answer % 26)) % 26;
          last_answer = tree.add(static_cast<char>('a' + shifted));
          out += to_string(last_answer);
          out += ' ';
      }
      if (!out.empty()) { out.back() = '\n'; }
      cout << out;
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5496
external_platform: 洛谷
external_problem_id: P5496
external_title: '【模板】回文自動機（PAM）'
external_relation: original
source_book_pages: [549, 599]
source_pdf_pages: [179, 229]
review_status: verified
---

PAM 是專為回文設計的自動機。長度 −1 的奇根與「depth 即答案」這兩個設計，值得畫一次小例子親手驗證。
