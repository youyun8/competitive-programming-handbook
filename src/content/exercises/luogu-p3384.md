---
id: luogu-p3384
volume: upper
source_file: upper-volume
title: 洛谷 P3384 樹鏈剖分：路徑與子樹的區間操作
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 4
topics: ['樹鏈剖分', '重鏈', '線段樹', 'DFS 序']
prerequisites: ['heavy-light-decomposition', 'segment-tree']
statement: |-
  給定一棵帶點權的樹，支援四種操作：路徑上每個點加值、查詢路徑點權和、子樹每個點加值、查詢子樹點權和。所有查詢結果對給定模數取模。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'n 與操作數都很大，需要 O(log² n) 的單次操作'
  - '樹可能退化成長鏈，DFS 建議用顯式堆疊'
  - '所有輸出對給定模數取模'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行四個整數 n、m、根節點與模數；第二行 n 個初始點權；接下來 n−1 行每行一條邊；接下來 m 行為操作。'
output_format: '對每個查詢操作輸出一行結果（已取模）。'
samples:
  - input: |
      5 5 2 24
      7 3 7 8 0
      1 2
      1 5
      3 1
      4 1
      3 4 2
      3 2 2
      4 5
      1 5 1 3
      2 1 3
    output: |
      2
      21
    explanation: |-
      第三個操作查詢節點 5 的子樹和；最後一個操作查詢路徑 1–3 的點權和，兩者都已對 24 取模。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    核心想法：把每個點連向「子樹最大的兒子」（重兒子）的邊標記為重邊，重邊自然串成若干條**重鏈**。沿重鏈優先做 DFS 編號，同一條鏈上的點在 DFS 序中就是連續的。
  - |-
    有了連續編號，兩件事同時變簡單：**子樹**恰好是 [pos[x], pos[x] + size[x] − 1] 這一段連續區間；**路徑**可以拆成 O(log n) 段連續區間。剩下的交給線段樹。
  - |-
    路徑操作的迴圈：當 x 與 y 的鏈頭不同時，把鏈頭較深的那一邊整條鏈 [pos[head[x]], pos[x]] 處理掉，然後跳到 parent[head[x]]；兩者同鏈時處理 [pos[較淺者], pos[較深者]] 結束。
  - |-
    為什麼是 O(log n) 段？每次跳過一條輕邊時，子樹大小至少翻倍（否則那條邊就會是重邊），而子樹大小上限是 n，所以最多跳 log n 次。
  - |-
    兩次 DFS 都建議寫成顯式堆疊。樹退化成一條長鏈時遞迴深度可達 n，遞迴版會爆棧——這在模板題的極限資料上是真的會發生的。
solution_outline: |-
  第一次 DFS 求父節點、深度、子樹大小與重兒子；第二次 DFS 沿重鏈連續編號並記錄每個點的鏈頭。線段樹維護區間加與區間和。路徑操作沿鏈頭逐段跳躍處理，子樹操作直接對應一段連續區間。
proof_or_invariant: |-
  剖分的關鍵性質是「從任一點到根的路徑上，輕邊數量不超過 log n」——因為每經過一條輕邊子樹大小至少翻倍。因此路徑被拆成的重鏈段數為 O(log n)，每段一次線段樹操作 O(log n)，單次操作總計 O(log² n)。子樹連續性則由 DFS 序的定義直接得出。
complexity:
  time: '單次操作 O(log² n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // 樹鏈剖分的骨架。線段樹部分（區間加、區間和）與線段樹 1 完全相同，
  // 這裡的重點是「如何把樹上路徑拆成 O(log n) 段連續區間」。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, root;
      long long mod_value;
      if (!(cin >> n >> m >> root >> mod_value)) { return 0; }
      vector<long long> value_of(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> value_of[static_cast<size_t>(i)]; }
      vector<vector<int>> adjacency(static_cast<size_t>(n) + 1);
      for (int i = 0; i < n - 1; ++i) {
          int u, v;
          cin >> u >> v;
          adjacency[static_cast<size_t>(u)].push_back(v);
          adjacency[static_cast<size_t>(v)].push_back(u);
      }

      // TODO 1：第一次 DFS 求 parent、depth、subtree_size 與**重兒子**
      //   （子樹最大的那個兒子）。樹可能退化成長鏈，用顯式堆疊比遞迴安全。
      // TODO 2：第二次 DFS 沿重鏈連續編號。先走重兒子，讓同一條重鏈的
      //   DFS 序連續；每個點記下所屬鏈的鏈頭 head。
      //   關鍵性質：子樹恰好是 [pos[x], pos[x] + size[x] − 1] 這段連續區間。
      // TODO 3：路徑操作。當 head[x] != head[y] 時，把鏈頭較深的那一邊
      //   整條鏈 [pos[head[x]], pos[x]] 處理掉，再跳到 parent[head[x]]；
      //   最後兩點同鏈時處理 [pos[較淺者], pos[較深者]]。
      //   每次跳躍至少讓子樹大小翻倍，所以最多 O(log n) 段。
      // TODO 4：子樹操作直接用上面那段連續區間，一次線段樹操作即可。
      (void)adjacency;
      (void)value_of;
      (void)mod_value;
      for (int i = 0; i < m; ++i) {
          int op;
          cin >> op;
          if (op == 1) {
              int x, y;
              long long z;
              cin >> x >> y >> z;
          } else if (op == 2) {
              int x, y;
              cin >> x >> y;
              cout << 0 << '\n';
          } else if (op == 3) {
              int x;
              long long z;
              cin >> x >> z;
          } else {
              int x;
              cin >> x;
              cout << 0 << '\n';
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 樹鏈剖分：把每個點連向「子樹最大的兒子」的邊設為重邊，重邊串成重鏈。
  // 依 DFS 序給重鏈上的點連續編號，樹上路徑就變成 O(log n) 段連續區間，
  // 交給線段樹處理；子樹也剛好是一段連續區間。
  static long long mod_value;
  static int n;
  static vector<vector<int>> adjacency;
  static vector<int> parent_of, depth_of, heavy_of, head_of, position_of, subtree_size, order_value;
  static vector<long long> value_of;
  static int timer_value = 0;

  static vector<long long> sum_tree, lazy_add;

  static void apply_add(size_t node, size_t count, long long delta) {
      sum_tree[node] = (sum_tree[node] + delta % mod_value * static_cast<long long>(count)) % mod_value;
      lazy_add[node] = (lazy_add[node] + delta) % mod_value;
  }

  static void push_down(size_t node, size_t l, size_t r) {
      if (lazy_add[node] == 0) { return; }
      const size_t mid = (l + r) / 2;
      apply_add(2 * node, mid - l + 1, lazy_add[node]);
      apply_add(2 * node + 1, r - mid, lazy_add[node]);
      lazy_add[node] = 0;
  }

  static void build(size_t node, size_t l, size_t r) {
      if (l == r) { sum_tree[node] = order_value[l] % mod_value; return; }
      const size_t mid = (l + r) / 2;
      build(2 * node, l, mid);
      build(2 * node + 1, mid + 1, r);
      sum_tree[node] = (sum_tree[2 * node] + sum_tree[2 * node + 1]) % mod_value;
  }

  static void update(size_t node, size_t l, size_t r, size_t ql, size_t qr, long long delta) {
      if (qr < l || r < ql) { return; }
      if (ql <= l && r <= qr) { apply_add(node, r - l + 1, delta); return; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      update(2 * node, l, mid, ql, qr, delta);
      update(2 * node + 1, mid + 1, r, ql, qr, delta);
      sum_tree[node] = (sum_tree[2 * node] + sum_tree[2 * node + 1]) % mod_value;
  }

  static long long query(size_t node, size_t l, size_t r, size_t ql, size_t qr) {
      if (qr < l || r < ql) { return 0; }
      if (ql <= l && r <= qr) { return sum_tree[node]; }
      push_down(node, l, r);
      const size_t mid = (l + r) / 2;
      return (query(2 * node, l, mid, ql, qr) + query(2 * node + 1, mid + 1, r, ql, qr)) % mod_value;
  }

  // 第一次 DFS：求父節點、深度、子樹大小與重兒子。用顯式堆疊避免深鏈爆棧。
  static void dfs_sizes(int root) {
      vector<int> order;
      vector<int> stack_nodes{root};
      parent_of[static_cast<size_t>(root)] = 0;
      depth_of[static_cast<size_t>(root)] = 1;
      vector<char> seen(static_cast<size_t>(n) + 1, 0);
      seen[static_cast<size_t>(root)] = 1;
      while (!stack_nodes.empty()) {
          const int node = stack_nodes.back();
          stack_nodes.pop_back();
          order.push_back(node);
          for (const int next : adjacency[static_cast<size_t>(node)]) {
              if (seen[static_cast<size_t>(next)]) { continue; }
              seen[static_cast<size_t>(next)] = 1;
              parent_of[static_cast<size_t>(next)] = node;
              depth_of[static_cast<size_t>(next)] = depth_of[static_cast<size_t>(node)] + 1;
              stack_nodes.push_back(next);
          }
      }
      for (size_t i = order.size(); i-- > 0;) {
          const int node = order[i];
          subtree_size[static_cast<size_t>(node)] = 1;
          int best = 0;
          for (const int next : adjacency[static_cast<size_t>(node)]) {
              if (next == parent_of[static_cast<size_t>(node)]) { continue; }
              subtree_size[static_cast<size_t>(node)] += subtree_size[static_cast<size_t>(next)];
              if (best == 0 || subtree_size[static_cast<size_t>(next)] > subtree_size[static_cast<size_t>(best)]) {
                  best = next;
              }
          }
          heavy_of[static_cast<size_t>(node)] = best;
      }
  }

  // 第二次 DFS：沿重鏈連續編號，同一條鏈的位置才會相鄰。
  static void dfs_chains(int root) {
      vector<pair<int, int>> stack_nodes{{root, root}};
      while (!stack_nodes.empty()) {
          const auto [node, chain_head] = stack_nodes.back();
          stack_nodes.pop_back();
          int current = node;
          int current_head = chain_head;
          while (current != 0) {
              head_of[static_cast<size_t>(current)] = current_head;
              position_of[static_cast<size_t>(current)] = ++timer_value;
              order_value[static_cast<size_t>(timer_value)] =
                  static_cast<int>(value_of[static_cast<size_t>(current)]);
              for (const int next : adjacency[static_cast<size_t>(current)]) {
                  if (next == parent_of[static_cast<size_t>(current)] ||
                      next == heavy_of[static_cast<size_t>(current)]) {
                      continue;
                  }
                  stack_nodes.push_back({next, next});  // 輕兒子各自開新鏈
              }
              current = heavy_of[static_cast<size_t>(current)];
          }
          (void)current_head;
      }
  }

  static void path_update(int x, int y, long long delta) {
      while (head_of[static_cast<size_t>(x)] != head_of[static_cast<size_t>(y)]) {
          if (depth_of[static_cast<size_t>(head_of[static_cast<size_t>(x)])] <
              depth_of[static_cast<size_t>(head_of[static_cast<size_t>(y)])]) {
              swap(x, y);
          }
          update(1, 1, static_cast<size_t>(n),
                 static_cast<size_t>(position_of[static_cast<size_t>(head_of[static_cast<size_t>(x)])]),
                 static_cast<size_t>(position_of[static_cast<size_t>(x)]), delta);
          x = parent_of[static_cast<size_t>(head_of[static_cast<size_t>(x)])];
      }
      if (depth_of[static_cast<size_t>(x)] > depth_of[static_cast<size_t>(y)]) { swap(x, y); }
      update(1, 1, static_cast<size_t>(n), static_cast<size_t>(position_of[static_cast<size_t>(x)]),
             static_cast<size_t>(position_of[static_cast<size_t>(y)]), delta);
  }

  static long long path_query(int x, int y) {
      long long total = 0;
      while (head_of[static_cast<size_t>(x)] != head_of[static_cast<size_t>(y)]) {
          if (depth_of[static_cast<size_t>(head_of[static_cast<size_t>(x)])] <
              depth_of[static_cast<size_t>(head_of[static_cast<size_t>(y)])]) {
              swap(x, y);
          }
          total = (total + query(1, 1, static_cast<size_t>(n),
                                 static_cast<size_t>(position_of[static_cast<size_t>(head_of[static_cast<size_t>(x)])]),
                                 static_cast<size_t>(position_of[static_cast<size_t>(x)]))) % mod_value;
          x = parent_of[static_cast<size_t>(head_of[static_cast<size_t>(x)])];
      }
      if (depth_of[static_cast<size_t>(x)] > depth_of[static_cast<size_t>(y)]) { swap(x, y); }
      return (total + query(1, 1, static_cast<size_t>(n),
                            static_cast<size_t>(position_of[static_cast<size_t>(x)]),
                            static_cast<size_t>(position_of[static_cast<size_t>(y)]))) % mod_value;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int m, root;
      if (!(cin >> n >> m >> root >> mod_value)) { return 0; }
      const size_t size = static_cast<size_t>(n) + 1;
      value_of.assign(size, 0);
      for (int i = 1; i <= n; ++i) { cin >> value_of[static_cast<size_t>(i)]; }
      adjacency.assign(size, {});
      for (int i = 0; i < n - 1; ++i) {
          int u, v;
          cin >> u >> v;
          adjacency[static_cast<size_t>(u)].push_back(v);
          adjacency[static_cast<size_t>(v)].push_back(u);
      }
      parent_of.assign(size, 0);
      depth_of.assign(size, 0);
      heavy_of.assign(size, 0);
      head_of.assign(size, 0);
      position_of.assign(size, 0);
      subtree_size.assign(size, 0);
      order_value.assign(size, 0);
      dfs_sizes(root);
      dfs_chains(root);
      sum_tree.assign(4 * size, 0);
      lazy_add.assign(4 * size, 0);
      build(1, 1, static_cast<size_t>(n));

      for (int i = 0; i < m; ++i) {
          int op;
          cin >> op;
          if (op == 1) {
              int x, y;
              long long z;
              cin >> x >> y >> z;
              path_update(x, y, z % mod_value);
          } else if (op == 2) {
              int x, y;
              cin >> x >> y;
              cout << path_query(x, y) << '\n';
          } else if (op == 3) {
              int x;
              long long z;
              cin >> x >> z;
              update(1, 1, static_cast<size_t>(n), static_cast<size_t>(position_of[static_cast<size_t>(x)]),
                     static_cast<size_t>(position_of[static_cast<size_t>(x)] +
                                         subtree_size[static_cast<size_t>(x)] - 1),
                     z % mod_value);
          } else {
              int x;
              cin >> x;
              cout << query(1, 1, static_cast<size_t>(n),
                            static_cast<size_t>(position_of[static_cast<size_t>(x)]),
                            static_cast<size_t>(position_of[static_cast<size_t>(x)] +
                                                subtree_size[static_cast<size_t>(x)] - 1))
                   << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3384
external_platform: 洛谷
external_problem_id: P3384
external_title: '【模板】重鏈剖分 / 樹鏈剖分'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

樹鏈剖分把樹上問題化歸為序列問題。「輕邊最多 log n 條」這個論證是整個複雜度的地基，值得自己推一遍。
