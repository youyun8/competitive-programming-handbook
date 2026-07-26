---
id: luogu-p3379
volume: upper
source_file: upper-volume
title: 洛谷 P3379 LCA：倍增法求最近公共祖先
chapter: 4
section: '4.8'
kind: external-oj
difficulty: 3
topics: ['LCA', '倍增法', '樹上問題']
prerequisites: ['lca', 'sparse-table']
core_knowledge: [最近公共祖先, 二進位倍增, 樹深度]
judgment: 樹固定且詢問很多；預處理每個節點的 2 的冪次祖先後，可把每次上跳縮至對數時間。
statement: |-
  給定一棵 n 個節點的有根樹與 m 次詢問，每次詢問兩個節點的最近公共祖先。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '1 <= n, m <= 500000'
  - '根與所有節點編號介於 1 與 n'
  - '輸入的 n-1 條邊構成一棵連通無向樹'
input_format: '第一行三個整數 n、m 與根節點編號；接下來 n-1 行每行兩個整數表示一條邊；接下來 m 行每行兩個整數表示一次詢問。'
output_format: '每次詢問輸出一行，表示兩點的最近公共祖先。'
samples:
  - input: |
      5 3 1
      1 2
      1 3
      2 4
      2 5
      4 5
      4 3
      2 4
    output: |
      2
      1
      2
    explanation: |-
      4 與 5 都掛在 2 底下，LCA 是 2；4 在左子樹、3 在右子樹，LCA 是根 1；2 是 4 的祖先，LCA 就是 2。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    先用一次 BFS 或 DFS 求出每個節點的深度與父節點。樹可能退化成長鏈，用 BFS 或手寫堆疊比遞迴安全。
  - |-
    建倍增表 up[j][v]＝v 的第 2^j 級祖先，遞推是 up[j][v] = up[j-1][up[j-1][v]]（先跳 2^(j-1) 步，再跳 2^(j-1) 步）。根節點的祖先設成自己，跳過頭時就會停在根。
  - |-
    查詢分兩步。第一步把較深的節點提到與另一個同深度：把深度差寫成二進位，某一位是 1 就跳對應的 2^j 步。若此時兩點已相同，答案就是它——別漏掉這個情況。
solution_outline: |-
  BFS 求深度與父節點，再建倍增表 up[j][v]。查詢時先把較深的節點按深度差的二進位上跳到同深度，若已相等直接回答；否則從高位到低位，只在兩點的 2^j 級祖先不同時同時上跳，結束後 up[0][a] 即為 LCA。
proof_or_invariant: |-
  第一步後兩點深度相同。第二步的不變量是「a 與 b 始終在 LCA 的嚴格下方或就是 LCA 的子節點」：只在祖先不同時上跳，保證不會越過 LCA；而由大到小枚舉能把「到 LCA 子節點的距離」用二進位唯一表示出來，因此結束時 a、b 恰為 LCA 的兩個不同子節點。
complexity:
  time: '預處理 O(n log n)，單次詢問 O(log n)'
  space: 'O(n log n)'
common_errors:
  - 未先將兩個節點提升到相同深度
  - 從低位往高位跳，因而越過應停留的位置
  - 樹退化成長鏈時以深遞迴 DFS 導致堆疊溢位
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, root;
      if (!(cin >> n >> m >> root)) { return 0; }
      const size_t size = static_cast<size_t>(n) + 1;
      vector<vector<int>> adjacency(size);
      for (int i = 0; i < n - 1; ++i) {
          int u, v;
          cin >> u >> v;
          adjacency[static_cast<size_t>(u)].push_back(v);
          adjacency[static_cast<size_t>(v)].push_back(u);
      }

      // 已備好：BFS 求出每個點的深度與父節點（用迭代而非遞迴，深鏈才不會爆棧）。
      vector<int> depth(size, 0);
      vector<int> parent(size, root);
      vector<char> seen(size, 0);
      deque<int> queue_nodes{root};
      seen[static_cast<size_t>(root)] = 1;
      while (!queue_nodes.empty()) {
          const int node = queue_nodes.front();
          queue_nodes.pop_front();
          for (const int next : adjacency[static_cast<size_t>(node)]) {
              if (seen[static_cast<size_t>(next)]) { continue; }
              seen[static_cast<size_t>(next)] = 1;
              depth[static_cast<size_t>(next)] = depth[static_cast<size_t>(node)] + 1;
              parent[static_cast<size_t>(next)] = node;
              queue_nodes.push_back(next);
          }
      }

      // TODO 1：建倍增表 up[j][v]＝v 的第 2^j 級祖先。
      //         up[0] 就是 parent，up[j][v] = up[j-1][up[j-1][v]]。根的祖先設為自己。

      for (int q = 0; q < m; ++q) {
          int a, b;
          cin >> a >> b;
          // TODO 2：先把較深的一方沿倍增表跳到與另一方同深度。
          // TODO 3：若此時兩點相同，答案就是它；否則由大到小嘗試同時上跳，
          //         只在「跳完仍不相同」時才跳，最後 LCA 是 up[0][a]。
          //         下面是 O(depth) 的樸素寫法，先確認邏輯再換成倍增。
          while (depth[static_cast<size_t>(a)] > depth[static_cast<size_t>(b)]) {
              a = parent[static_cast<size_t>(a)];
          }
          while (depth[static_cast<size_t>(b)] > depth[static_cast<size_t>(a)]) {
              b = parent[static_cast<size_t>(b)];
          }
          while (a != b) {
              a = parent[static_cast<size_t>(a)];
              b = parent[static_cast<size_t>(b)];
          }
          cout << a << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 倍增法求 LCA：up[j][v] 是 v 的第 2^j 級祖先。先把深的一方跳到同深度，
  // 再讓兩點一起由大到小往上跳到「跳了就會相同」的臨界點，父節點即為 LCA。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, root;
      if (!(cin >> n >> m >> root)) { return 0; }
      const size_t size = static_cast<size_t>(n) + 1;
      vector<vector<int>> adjacency(size);
      for (int i = 0; i < n - 1; ++i) {
          int u, v;
          cin >> u >> v;
          adjacency[static_cast<size_t>(u)].push_back(v);
          adjacency[static_cast<size_t>(v)].push_back(u);
      }

      int levels = 1;
      while ((1 << levels) < n) { ++levels; }
      ++levels;
      vector<vector<int>> up(static_cast<size_t>(levels), vector<int>(size, 0));
      vector<int> depth(size, 0);

      // 迭代式 BFS 建表，避免深鏈遞迴爆棧。
      vector<int> order;
      order.reserve(static_cast<size_t>(n));
      vector<char> seen(size, 0);
      deque<int> queue_nodes{root};
      seen[static_cast<size_t>(root)] = 1;
      depth[static_cast<size_t>(root)] = 0;
      up[0][static_cast<size_t>(root)] = root;
      while (!queue_nodes.empty()) {
          const int node = queue_nodes.front();
          queue_nodes.pop_front();
          order.push_back(node);
          for (const int next : adjacency[static_cast<size_t>(node)]) {
              if (seen[static_cast<size_t>(next)]) { continue; }
              seen[static_cast<size_t>(next)] = 1;
              depth[static_cast<size_t>(next)] = depth[static_cast<size_t>(node)] + 1;
              up[0][static_cast<size_t>(next)] = node;
              queue_nodes.push_back(next);
          }
      }
      for (size_t j = 1; j < static_cast<size_t>(levels); ++j) {
          for (size_t v = 1; v < size; ++v) {
              up[j][v] = up[j - 1][static_cast<size_t>(up[j - 1][v])];
          }
      }

      for (int q = 0; q < m; ++q) {
          int a, b;
          cin >> a >> b;
          if (depth[static_cast<size_t>(a)] < depth[static_cast<size_t>(b)]) { swap(a, b); }
          int diff = depth[static_cast<size_t>(a)] - depth[static_cast<size_t>(b)];
          for (int j = 0; diff > 0; ++j, diff >>= 1) {
              if (diff & 1) { a = up[static_cast<size_t>(j)][static_cast<size_t>(a)]; }
          }
          if (a == b) { cout << a << '\n'; continue; }
          for (int j = levels - 1; j >= 0; --j) {
              const size_t level = static_cast<size_t>(j);
              if (up[level][static_cast<size_t>(a)] != up[level][static_cast<size_t>(b)]) {
                  a = up[level][static_cast<size_t>(a)];
                  b = up[level][static_cast<size_t>(b)];
              }
          }
          cout << up[0][static_cast<size_t>(a)] << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3379
external_platform: 洛谷
external_problem_id: P3379
external_title: '【模板】最近公共祖先（LCA）'
external_relation: original
source_book_pages: [151, 314]
source_pdf_pages: [169, 332]
review_status: verified
---

倍增法求 LCA 是樹上問題的通用入口，之後的樹上倍增、樹上差分、樹鏈剖分都建立在同一組深度與祖先資訊上。
