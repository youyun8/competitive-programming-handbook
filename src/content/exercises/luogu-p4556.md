---
id: luogu-p4556
volume: upper
source_file: upper-volume
title: 洛谷 P4556 線段樹合併：樹上差分統計眾數
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 5
topics: ['線段樹合併', '樹上差分', '動態開點', 'LCA']
prerequisites: ['segment-tree', 'lca']
statement: |-
  在一棵樹上進行若干次操作，每次在一條路徑上的所有節點增加一件某種類型的物品；最後求每個節點數量最多的物品類型（平手取編號小者），沒有物品輸出 0。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '路徑操作次數與節點數都很大，不能逐點更新'
  - '物品類型的值域很大，需要動態開點'
  - '平手時取類型編號較小者'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；接下來 n−1 行每行一條邊；接下來 m 行每行三個整數 x、y、z。'
output_format: '輸出 n 行，第 i 行是節點 i 的眾數類型（無物品時為 0）。'
samples:
  - input: |
      5 5
      1 2
      3 1
      3 4
      5 3
      2 5 14
      3 4 14
      2 5 10
      3 4 10
      2 5 14
    output: |
      14
      14
      14
      10
      14
    explanation: |-
      節點 4 只在路徑 3–4 上被經過，14 與 10 各一件，平手時取編號小的 10；其餘節點的 14 都比 10 多，所以是 14。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    第一步是把「路徑加」變成「單點加」：**樹上差分**。在路徑 x→y 上加一件 z，等價於 x 與 y 各 +1、LCA 與 LCA 的父節點各 −1。這樣每次操作只動四個點。
  - |-
    第二步是每個節點掛一棵**動態開點的權值線段樹**（下標是物品類型），節點維護「最大計數」與「達到該計數的最小類型」。值域很大但實際用到的節點數只有 O(m log C)。
  - |-
    第三步是**線段樹合併**：自底向上把每個子節點的線段樹併進父節點。兩棵樹同時往下走，其中一邊為空就直接接過去，都非空就遞迴合併並在回溯時 pull。
  - |-
    合併的總複雜度是 O(m log C)：每次真正的遞迴合併都會讓節點總數減少一個，而節點總數本來就是 O(m log C)。這個攤還論證值得自己想一遍。
  - |-
    平手取小的規則要寫進 pull：只有右子嚴格大於左子時才選右子，否則一律選左子（左子代表較小的類型）。
solution_outline: |-
  用樹上差分把每次路徑操作轉成四個單點修改，每個節點掛一棵動態開點權值線段樹。BFS 求出 DFS 順序與 LCA 所需的倍增表。最後反著走 BFS 序，把每個子節點的線段樹合併進父節點，根節點的最大值資訊即為該節點的答案。
proof_or_invariant: |-
  樹上差分的正確性來自「子樹和」：節點 u 的答案等於它子樹內所有差分值之和，而 x、y 各 +1、LCA 與其父各 −1 恰好讓路徑上的節點子樹和為 +1、其餘為 0。線段樹合併保持「每棵樹代表對應子樹的累計計數」這個不變量。
complexity:
  time: 'O((n + m) log C)'
  space: 'O(m log C)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<vector<int>> adjacency(static_cast<size_t>(n) + 1);
      for (int i = 0; i < n - 1; ++i) {
          int u, v;
          cin >> u >> v;
          adjacency[static_cast<size_t>(u)].push_back(v);
          adjacency[static_cast<size_t>(v)].push_back(u);
      }

      // TODO 1：樹上差分。路徑 x→y 加一個救濟品 z，等價於四個單點操作：
      //   x 與 y 各 +1，LCA 與 LCA 的父節點各 −1。這樣就不必真的走整條路徑。
      // TODO 2：每個節點掛一棵**動態開點的權值線段樹**（下標是救濟品種類），
      //   節點維護「最大計數」與「達到該計數的最小種類」。
      // TODO 3：**線段樹合併**。自底向上把每個子節點的線段樹合併進父節點：
      //   兩棵樹同時往下走，其中一邊為空就直接接過去；都非空就遞迴合併。
      //   合併的總複雜度是 O(n log n)——每次合併都會減少一個節點，
      //   而節點總數是 O(m log C)。
      //   注意遞迴中若會 push_back 新節點，就不要把 nodes[x].left 以參考傳進去，
      //   vector 重新配置會讓那個參考懸空。
      // 下面是「每個節點各存一個 map 計數、路徑逐點更新」的樸素版本。
      vector<int> parent_of(static_cast<size_t>(n) + 1, 0);
      vector<int> depth_of(static_cast<size_t>(n) + 1, 0);
      vector<char> seen(static_cast<size_t>(n) + 1, 0);
      deque<int> queue_nodes{1};
      seen[1] = 1;
      while (!queue_nodes.empty()) {
          const int node = queue_nodes.front();
          queue_nodes.pop_front();
          for (const int next : adjacency[static_cast<size_t>(node)]) {
              if (seen[static_cast<size_t>(next)]) { continue; }
              seen[static_cast<size_t>(next)] = 1;
              parent_of[static_cast<size_t>(next)] = node;
              depth_of[static_cast<size_t>(next)] = depth_of[static_cast<size_t>(node)] + 1;
              queue_nodes.push_back(next);
          }
      }
      vector<map<int, int>> count_at(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int x, y, z;
          cin >> x >> y >> z;
          while (x != y) {
              if (depth_of[static_cast<size_t>(x)] >= depth_of[static_cast<size_t>(y)]) {
                  ++count_at[static_cast<size_t>(x)][z];
                  x = parent_of[static_cast<size_t>(x)];
              } else {
                  ++count_at[static_cast<size_t>(y)][z];
                  y = parent_of[static_cast<size_t>(y)];
              }
          }
          ++count_at[static_cast<size_t>(x)][z];
      }
      for (int i = 1; i <= n; ++i) {
          int best_type = 0;
          int best_count = 0;
          for (const auto& [type, count] : count_at[static_cast<size_t>(i)]) {
              if (count > best_count) {
                  best_count = count;
                  best_type = type;
              }
          }
          cout << best_type << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 線段樹合併：每個節點掛一棵「動態開點的權值線段樹」，
  // 用樹上差分把「路徑加」變成四個單點加，最後自底向上合併子樹的線段樹。
  struct DynamicSegmentTree {
      struct Node {
          int left = 0, right = 0, count = 0, best = 0;
      };
      vector<Node> nodes{Node{}};

      void pull(int node) {
          const Node& l = nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].left)];
          const Node& r = nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].right)];
          // 平手時取編號較小的，所以左子嚴格佔優時才選右子。
          if (l.count >= r.count) {
              nodes[static_cast<size_t>(node)].count = l.count;
              nodes[static_cast<size_t>(node)].best = l.best;
          } else {
              nodes[static_cast<size_t>(node)].count = r.count;
              nodes[static_cast<size_t>(node)].best = r.best;
          }
      }

      void update(int& node, int l, int r, int position, int delta) {
          if (node == 0) {
              node = static_cast<int>(nodes.size());
              nodes.push_back(Node{});
          }
          if (l == r) {
              nodes[static_cast<size_t>(node)].count += delta;
              nodes[static_cast<size_t>(node)].best = nodes[static_cast<size_t>(node)].count > 0 ? l : 0;
              return;
          }
          const int mid = (l + r) / 2;
          // 不能把 nodes[node].left 直接以參考傳進遞迴：遞迴裡的 push_back 會讓
          // vector 重新配置，那個參考就懸空了。先取出、遞迴、再寫回。
          if (position <= mid) {
              int child = nodes[static_cast<size_t>(node)].left;
              update(child, l, mid, position, delta);
              nodes[static_cast<size_t>(node)].left = child;
          } else {
              int child = nodes[static_cast<size_t>(node)].right;
              update(child, mid + 1, r, position, delta);
              nodes[static_cast<size_t>(node)].right = child;
          }
          pull(node);
      }

      int merge(int x, int y, int l, int r) {
          if (x == 0 || y == 0) { return x | y; }
          if (l == r) {
              nodes[static_cast<size_t>(x)].count += nodes[static_cast<size_t>(y)].count;
              nodes[static_cast<size_t>(x)].best = nodes[static_cast<size_t>(x)].count > 0 ? l : 0;
              return x;
          }
          const int mid = (l + r) / 2;
          const int left_merged = merge(nodes[static_cast<size_t>(x)].left, nodes[static_cast<size_t>(y)].left, l, mid);
          const int right_merged =
              merge(nodes[static_cast<size_t>(x)].right, nodes[static_cast<size_t>(y)].right, mid + 1, r);
          nodes[static_cast<size_t>(x)].left = left_merged;
          nodes[static_cast<size_t>(x)].right = right_merged;
          pull(x);
          return x;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<vector<int>> adjacency(static_cast<size_t>(n) + 1);
      for (int i = 0; i < n - 1; ++i) {
          int u, v;
          cin >> u >> v;
          adjacency[static_cast<size_t>(u)].push_back(v);
          adjacency[static_cast<size_t>(v)].push_back(u);
      }

      // 倍增求 LCA。
      int levels = 1;
      while ((1 << levels) < n) { ++levels; }
      ++levels;
      vector<vector<int>> up(static_cast<size_t>(levels), vector<int>(static_cast<size_t>(n) + 1, 1));
      vector<int> depth(static_cast<size_t>(n) + 1, 0);
      vector<int> order;
      vector<char> seen(static_cast<size_t>(n) + 1, 0);
      deque<int> queue_nodes{1};
      seen[1] = 1;
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
          for (int v = 1; v <= n; ++v) {
              up[j][static_cast<size_t>(v)] = up[j - 1][static_cast<size_t>(up[j - 1][static_cast<size_t>(v)])];
          }
      }
      auto lca = [&](int x, int y) {
          if (depth[static_cast<size_t>(x)] < depth[static_cast<size_t>(y)]) { swap(x, y); }
          int diff = depth[static_cast<size_t>(x)] - depth[static_cast<size_t>(y)];
          for (int j = 0; diff > 0; ++j, diff >>= 1) {
              if (diff & 1) { x = up[static_cast<size_t>(j)][static_cast<size_t>(x)]; }
          }
          if (x == y) { return x; }
          for (int j = levels - 1; j >= 0; --j) {
              if (up[static_cast<size_t>(j)][static_cast<size_t>(x)] !=
                  up[static_cast<size_t>(j)][static_cast<size_t>(y)]) {
                  x = up[static_cast<size_t>(j)][static_cast<size_t>(x)];
                  y = up[static_cast<size_t>(j)][static_cast<size_t>(y)];
              }
          }
          return up[0][static_cast<size_t>(x)];
      };

      DynamicSegmentTree tree;
      const int limit = 100000;
      vector<int> root(static_cast<size_t>(n) + 1, 0);
      for (int i = 0; i < m; ++i) {
          int x, y, z;
          cin >> x >> y >> z;
          const int ancestor = lca(x, y);
          // 樹上差分：路徑加 z 等於 x、y 各 +1，LCA 與其父各 −1。
          tree.update(root[static_cast<size_t>(x)], 1, limit, z, 1);
          tree.update(root[static_cast<size_t>(y)], 1, limit, z, 1);
          tree.update(root[static_cast<size_t>(ancestor)], 1, limit, z, -1);
          if (ancestor != 1) {
              tree.update(root[static_cast<size_t>(up[0][static_cast<size_t>(ancestor)])], 1, limit, z, -1);
          }
      }
      vector<int> answer(static_cast<size_t>(n) + 1, 0);
      for (size_t i = order.size(); i-- > 0;) {
          const int node = order[i];
          for (const int next : adjacency[static_cast<size_t>(node)]) {
              if (next == up[0][static_cast<size_t>(node)] || depth[static_cast<size_t>(next)] <= depth[static_cast<size_t>(node)]) {
                  continue;
              }
              root[static_cast<size_t>(node)] =
                  tree.merge(root[static_cast<size_t>(node)], root[static_cast<size_t>(next)], 1, limit);
          }
          answer[static_cast<size_t>(node)] = tree.nodes[static_cast<size_t>(root[static_cast<size_t>(node)])].best;
      }
      for (int i = 1; i <= n; ++i) { cout << answer[static_cast<size_t>(i)] << '\n'; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4556
external_platform: 洛谷
external_problem_id: P4556
external_title: '【模板】線段樹合併 / [Vani 有約會] 雨天的尾巴'
external_relation: original
source_book_pages: [151, 314]
source_pdf_pages: [169, 332]
review_status: verified
---

三個技巧串成一題：差分把路徑變單點、動態開點壓住值域、合併把子樹資訊聚起來。每一步都值得單獨練熟。
