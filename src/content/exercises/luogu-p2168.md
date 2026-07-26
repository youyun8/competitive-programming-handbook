---
id: luogu-p2168
volume: upper
source_file: upper-volume
title: 洛谷 P2168 荷馬史詩
chapter: 1
section: '1.4'
kind: external-oj
difficulty: 4
topics: [k-ary-huffman, greedy, priority-queue]
prerequisites: [huffman, prefix-code, greedy]
statement: >-
  有 n 種單詞，第 i 種出現 w_i 次，要為每種單詞指定互不為彼此前綴的 k 進位碼。
  先最小化所有「出現次數乘碼長」之和；在總長同為最小時，再最小化最長碼字的長度。輸出這兩個值。
constraints:
  - 2 <= n <= 100000
  - 2 <= k <= 9
  - 0 < w_i <= 10^11
  - 計算與輸出須使用 64 位元整數
input_format: 第一行為 n、k；接著 n 行各有一個出現次數 w_i。
output_format: 第一行輸出最小總編碼長度；第二行輸出在此前提下最小的最長碼長。
samples:
  - input: |
      6 3
      1
      1
      3
      3
      9
      9
    output: |
      36
      3
    explanation: 先補一個零權虛擬葉，使葉數符合三元滿樹；逐次合併三個最小項後，總合併成本為 36，最深葉深度為 3。
core_knowledge: [k 叉霍夫曼樹, 零權補點, 雙關鍵字貪心]
judgment: 必須依序輸出總長與最大碼長；只答對第一行不足以完成第二個最佳化目標。
hints:
  - 每次把 k 個最小權重子樹接到同一個新父節點，這些葉子的深度都增加一。
  - 滿 k 叉樹的葉數必須滿足 (leaf_count - 1) 可被 (k - 1) 整除；不足時補零權葉。
  - 堆元素保存（權重和、最大深度）；同權重時先取最大深度較小者，合併後深度為組內最大值加一。
solution_outline: >-
  計算最少零權葉數，使 (n-1) mod (k-1)=0，連同原權重放入以權重、深度排序的最小堆。
  每輪取 k 項，將權重和累加到總長，並把（權重和、最大深度+1）放回；最後堆頂深度即第二答案。
proof_or_invariant: >-
  k 叉霍夫曼交換論證保證最小的 k 個權重可成為最深的一組兄弟，縮合後仍是同型最優子問題；零權葉不增加目標值，
  卻讓每輪都能恰合併 k 棵樹。若權重相同，先合併較淺子樹不改變第一目標，並以交換方式不會增加最終最大深度，
  所以以深度為第二鍵可得到字典序的兩階段最優解。
common_errors:
  - 未補零權葉，最後一輪少於 k 項
  - 堆中只保存權重，無法正確完成第二問
  - 權重和與答案使用 32 位元整數
complexity:
  time: O(n log n)
  space: O(n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Node {
      long long weight;
      int depth;
      bool operator>(const Node& other) const {
          return tie(weight, depth) > tie(other.weight, other.depth);
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, k;
      cin >> n >> k;
      priority_queue<Node, vector<Node>, greater<Node>> min_heap;
      for (int i = 0; i < n; ++i) {
          long long weight;
          cin >> weight;
          min_heap.push({weight, 0});
      }
      // TODO：補零權葉，並反覆合併 k 項以求總成本與最大深度。
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Node {
      long long weight;
      int depth;
      bool operator>(const Node& other) const {
          return tie(weight, depth) > tie(other.weight, other.depth);
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, k;
      cin >> n >> k;
      priority_queue<Node, vector<Node>, greater<Node>> min_heap;
      for (int i = 0; i < n; ++i) {
          long long weight;
          cin >> weight;
          min_heap.push({weight, 0});
      }
      const int remainder = (n - 1) % (k - 1);
      const int padding = remainder == 0 ? 0 : (k - 1) - remainder;
      for (int i = 0; i < padding; ++i) { min_heap.push({0, 0}); }

      long long total_length = 0;
      while (min_heap.size() > 1) {
          long long merged_weight = 0;
          int merged_depth = 0;
          for (int i = 0; i < k; ++i) {
              const Node current = min_heap.top();
              min_heap.pop();
              merged_weight += current.weight;
              merged_depth = max(merged_depth, current.depth);
          }
          total_length += merged_weight;
          min_heap.push({merged_weight, merged_depth + 1});
      }
      cout << total_length << '\n' << min_heap.top().depth << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2168
external_platform: 洛谷
external_problem_id: P2168
external_title: '[NOI2015] 荷馬史詩'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

補零不是技巧性例外，而是把不完整的第一層合併轉成標準滿 k 叉樹，讓霍夫曼交換論證可一路一致套用。
