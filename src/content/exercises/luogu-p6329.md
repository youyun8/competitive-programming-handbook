---
id: luogu-p6329
volume: upper
source_file: upper-volume
title: 洛谷 P6329 點分樹：帶修改的樹上鄰域求和
chapter: 4
section: '4.9'
kind: external-oj
difficulty: 5
topics: ['點分樹', '重心樹', '樹狀陣列', '容斥', '強制在線']
prerequisites: ['tree-divide-and-conquer', 'lca', 'fenwick-tree']
core_knowledge: [點分樹, 距離桶, 容斥]
judgment: 修改與距離球查詢都需在線；將點分治層級固化後，每個點只屬於 O(log n) 個重心距離桶，可逐層更新與查詢。
statement: |-
  給定一棵樹，每個點有權值，支援兩種強制在線的操作：查詢與某點距離不超過 k 的所有點的權值和；把某點的權值改成新值。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '1 <= n, m <= 100000'
  - '點權、修改值與解碼後的距離參數都是非負整數'
  - '每次操作的 x、y 都先與上一次查詢答案做位元 XOR'
input_format: '第一行兩個整數 n 與 m；第二行 n 個初始權值；接下來 n−1 行每行兩個整數表示一條邊；最後 m 行每行三個整數 op、x、y（x 與 y 需異或上一次答案），op 為 0 表示查詢距離 x 不超過 y 的權值和，op 為 1 表示把 x 的權值改成 y。'
output_format: '對每個查詢輸出一行。'
samples:
  - input: |
      6 7
      3 1 4 1 5 9
      1 2
      1 3
      2 4
      2 5
      3 6
      0 1 1
      0 12 10
      1 9 0
      0 11 8
      0 27 29
      1 12 9
      0 11 10
    output: |
      8
      10
      29
      9
      24
    explanation: |-
      第一個查詢是「距離 1 號點不超過 1 的權值和」＝3+1+4＝8。之後的參數都被上一次答案異或過，例如第二行的 `0 12 10` 解碼後是「查詢距離 4 不超過 2」。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    點分治是把重心層級一次性走完；**點分樹**則是把它固化下來：把每層的重心當節點、上一層的重心當父親，得到一棵深度 O(log n) 的輔助樹。
  - |-
    關鍵性質：原樹上任意兩點 x、y 的路徑，一定經過它們在點分樹上的某個共同祖先 c，且 dist(x,y) = dist(x,c) + dist(c,y)。所以「x 的 k 鄰域」可以拆成沿點分樹往上跳的 O(log n) 段。
  - |-
    每個重心 c 掛一棵以「距離」為下標的樹狀陣列 `inside[c]`，記錄 c 到自己連通塊內每個點的距離。查詢時往上跳，每層加上 `inside[父].prefix(k − dist(x, 父))`。
solution_outline: |-
  先遞迴找重心建出點分樹並記錄 centroid_parent，同時為每個重心開兩棵樹狀陣列 inside 與 border（大小分別是該塊到自己、到父重心的最大距離）。修改點 x 時沿點分樹往上跳，對每個祖先 c 在 `inside[c]` 的下標 dist(c,x) 加上差值，並在「來時的那個子重心」的 border 同一下標加上差值。查詢 (x,k) 時取 `inside[x].prefix(k)`，再往上跳累加 `inside[c].prefix(k−d)` 並減去 `border[child].prefix(k−d)`。
proof_or_invariant: |-
  正確性依賴兩件事。其一，點分樹深度 O(log n)（每層塊大小減半），故單次操作只跳 O(log n) 層。其二，容斥恰好不重不漏：對每個祖先 c，`inside[c]` 涵蓋 c 的整個連通塊，而其中「經由 child 這一側」的點會在下一層被重新計入，`border[child]` 記的正是這批點到 c 的距離，減掉後每個點恰好被計數一次。
complexity:
  time: '單次操作 O(log² n)'
  space: 'O(n log n)'
common_errors:
  - 只加祖先的 inside 桶，沒有減去來向子塊造成重複計數
  - 用點分樹深度代替原樹兩點距離
  - 忘記將在線操作參數與上一次答案做 XOR
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<long long> value_of(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) { cin >> value_of[static_cast<size_t>(i)]; }
      vector<vector<int>> adjacency(static_cast<size_t>(n) + 1);
      for (int i = 0; i < n - 1; ++i) {
          int u, v;
          cin >> u >> v;
          adjacency[static_cast<size_t>(u)].push_back(v);
          adjacency[static_cast<size_t>(v)].push_back(u);
      }

      // TODO：點分樹（把點分治的重心層級固化成一棵深度 O(log n) 的輔助樹）。
      //   1. 遞迴找重心並記錄 centroid_parent，得到點分樹。
      //   2. 每個重心 c 掛兩棵以「距離」為下標的樹狀陣列：
      //        inside[c]：c 到自己連通塊內每個點的距離；
      //        border[c]：c 的**點分樹父親**到 c 這個連通塊內每個點的距離。
      //   3. 查詢 (x, k)：先取 inside[x] 的前綴，再沿點分樹往上跳，
      //      每層加上 inside[父] 的前綴、**扣掉** border[來時的那個子] 的前綴——
      //      後者正是被重複計算的部分。這個容斥是點分樹的靈魂。
      //   4. 修改就是沿同一條鏈更新兩種樹狀陣列。
      //   距離用原樹上的 LCA 計算；點分樹深度 O(log n)，故單次操作 O(log² n)。
      //   注意本題強制在線，參數要異或上一次答案。
      // 下面是每次都 BFS 的樸素版本。
      long long last_answer = 0;
      for (int i = 0; i < m; ++i) {
          long long op, x, y;
          cin >> op >> x >> y;
          x ^= last_answer;
          y ^= last_answer;
          if (op == 0) {
              vector<int> distance_to(static_cast<size_t>(n) + 1, -1);
              deque<int> queue_nodes{static_cast<int>(x)};
              distance_to[static_cast<size_t>(x)] = 0;
              long long total = 0;
              while (!queue_nodes.empty()) {
                  const int node = queue_nodes.front();
                  queue_nodes.pop_front();
                  if (distance_to[static_cast<size_t>(node)] <= y) {
                      total += value_of[static_cast<size_t>(node)];
                  }
                  for (const int next : adjacency[static_cast<size_t>(node)]) {
                      if (distance_to[static_cast<size_t>(next)] >= 0) { continue; }
                      distance_to[static_cast<size_t>(next)] = distance_to[static_cast<size_t>(node)] + 1;
                      queue_nodes.push_back(next);
                  }
              }
              last_answer = total;
              cout << total << '\n';
          } else {
              value_of[static_cast<size_t>(x)] = y;
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 點分樹（重心樹）：把點分治的重心層級固化成一棵深度 O(log n) 的輔助樹。
  // 每個重心掛兩棵以「距離」為下標的樹狀陣列：
  //   inside[c] 記錄 c 到自己連通塊內每個點的距離；
  //   border[c] 記錄 c 的點分樹父親到 c 這個連通塊內每個點的距離，
  // 查詢時往上跳並用 border 扣掉重複計算的部分。
  static int n_global;
  static vector<vector<int>> adjacency;
  static vector<char> removed_flag;
  static vector<int> subtree_size;
  static vector<int> centroid_parent;
  static vector<long long> value_of;

  // 原樹上的 LCA，用來算任意兩點距離。
  static vector<int> depth_of;
  static vector<vector<int>> up_table;
  static int levels_global;

  struct Fenwick {
      vector<long long> tree;
      void init(size_t size) { tree.assign(size + 2, 0); }
      void add(int position, long long delta) {
          for (size_t i = static_cast<size_t>(position) + 1; i < tree.size(); i += i & (~i + 1)) {
              tree[i] += delta;
          }
      }
      long long prefix(int position) const {
          if (position < 0) { return 0; }
          long long total = 0;
          size_t i = static_cast<size_t>(position) + 1;
          if (i >= tree.size()) { i = tree.size() - 1; }
          for (; i > 0; i -= i & (~i + 1)) { total += tree[i]; }
          return total;
      }
  };

  static vector<Fenwick> inside;
  static vector<Fenwick> border;

  static int distance_between(int x, int y) {
      int a = x;
      int b = y;
      if (depth_of[static_cast<size_t>(a)] < depth_of[static_cast<size_t>(b)]) { swap(a, b); }
      int diff = depth_of[static_cast<size_t>(a)] - depth_of[static_cast<size_t>(b)];
      for (int j = 0; diff > 0; ++j, diff >>= 1) {
          if (diff & 1) { a = up_table[static_cast<size_t>(j)][static_cast<size_t>(a)]; }
      }
      if (a != b) {
          for (int j = levels_global - 1; j >= 0; --j) {
              if (up_table[static_cast<size_t>(j)][static_cast<size_t>(a)] !=
                  up_table[static_cast<size_t>(j)][static_cast<size_t>(b)]) {
                  a = up_table[static_cast<size_t>(j)][static_cast<size_t>(a)];
                  b = up_table[static_cast<size_t>(j)][static_cast<size_t>(b)];
              }
          }
          a = up_table[0][static_cast<size_t>(a)];
      }
      return depth_of[static_cast<size_t>(x)] + depth_of[static_cast<size_t>(y)] -
             2 * depth_of[static_cast<size_t>(a)];
  }

  static void gather(int root, vector<int>& nodes) {
      vector<pair<int, int>> stack_nodes{{root, 0}};
      while (!stack_nodes.empty()) {
          const auto [node, parent] = stack_nodes.back();
          stack_nodes.pop_back();
          nodes.push_back(node);
          for (const int next : adjacency[static_cast<size_t>(node)]) {
              if (next == parent || removed_flag[static_cast<size_t>(next)]) { continue; }
              stack_nodes.push_back({next, node});
          }
      }
  }

  static int find_centroid(int root, const vector<int>& nodes) {
      const int total = static_cast<int>(nodes.size());
      vector<pair<int, int>> stack_nodes{{root, 0}};
      vector<pair<int, int>> order;
      while (!stack_nodes.empty()) {
          const auto entry = stack_nodes.back();
          stack_nodes.pop_back();
          order.push_back(entry);
          subtree_size[static_cast<size_t>(entry.first)] = 1;
          for (const int next : adjacency[static_cast<size_t>(entry.first)]) {
              if (next == entry.second || removed_flag[static_cast<size_t>(next)]) { continue; }
              stack_nodes.push_back({next, entry.first});
          }
      }
      int centroid = root;
      int best = total;
      for (size_t i = order.size(); i-- > 0;) {
          const auto [node, parent] = order[i];
          int largest = 0;
          for (const int next : adjacency[static_cast<size_t>(node)]) {
              if (next == parent || removed_flag[static_cast<size_t>(next)]) { continue; }
              subtree_size[static_cast<size_t>(node)] += subtree_size[static_cast<size_t>(next)];
              largest = max(largest, subtree_size[static_cast<size_t>(next)]);
          }
          largest = max(largest, total - subtree_size[static_cast<size_t>(node)]);
          if (largest < best) {
              best = largest;
              centroid = node;
          }
      }
      return centroid;
  }

  static void build(int root, int parent_centroid) {
      vector<int> nodes;
      gather(root, nodes);
      const int centroid = find_centroid(root, nodes);
      centroid_parent[static_cast<size_t>(centroid)] = parent_centroid;

      int radius = 0;
      for (const int node : nodes) { radius = max(radius, distance_between(centroid, node)); }
      inside[static_cast<size_t>(centroid)].init(static_cast<size_t>(radius) + 1);
      if (parent_centroid != 0) {
          int outer = 0;
          for (const int node : nodes) { outer = max(outer, distance_between(parent_centroid, node)); }
          border[static_cast<size_t>(centroid)].init(static_cast<size_t>(outer) + 1);
      }

      removed_flag[static_cast<size_t>(centroid)] = 1;
      for (const int next : adjacency[static_cast<size_t>(centroid)]) {
          if (removed_flag[static_cast<size_t>(next)]) { continue; }
          build(next, centroid);
      }
  }

  static void apply_update(int x, long long delta) {
      inside[static_cast<size_t>(x)].add(0, delta);
      int child = x;
      for (int c = centroid_parent[static_cast<size_t>(x)]; c != 0;
           child = c, c = centroid_parent[static_cast<size_t>(c)]) {
          const int d = distance_between(c, x);
          inside[static_cast<size_t>(c)].add(d, delta);
          border[static_cast<size_t>(child)].add(d, delta);
      }
  }

  static long long query(int x, int k) {
      long long total = inside[static_cast<size_t>(x)].prefix(k);
      int child = x;
      for (int c = centroid_parent[static_cast<size_t>(x)]; c != 0;
           child = c, c = centroid_parent[static_cast<size_t>(c)]) {
          const int d = distance_between(c, x);
          if (d > k) { continue; }
          total += inside[static_cast<size_t>(c)].prefix(k - d);
          total -= border[static_cast<size_t>(child)].prefix(k - d);
      }
      return total;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int m;
      if (!(cin >> n_global >> m)) { return 0; }
      value_of.assign(static_cast<size_t>(n_global) + 1, 0);
      for (int i = 1; i <= n_global; ++i) { cin >> value_of[static_cast<size_t>(i)]; }
      adjacency.assign(static_cast<size_t>(n_global) + 1, {});
      for (int i = 0; i < n_global - 1; ++i) {
          int u, v;
          cin >> u >> v;
          adjacency[static_cast<size_t>(u)].push_back(v);
          adjacency[static_cast<size_t>(v)].push_back(u);
      }

      levels_global = 1;
      while ((1 << levels_global) < n_global) { ++levels_global; }
      ++levels_global;
      up_table.assign(static_cast<size_t>(levels_global), vector<int>(static_cast<size_t>(n_global) + 1, 1));
      depth_of.assign(static_cast<size_t>(n_global) + 1, 0);
      {
          vector<char> seen(static_cast<size_t>(n_global) + 1, 0);
          deque<int> queue_nodes{1};
          seen[1] = 1;
          while (!queue_nodes.empty()) {
              const int node = queue_nodes.front();
              queue_nodes.pop_front();
              for (const int next : adjacency[static_cast<size_t>(node)]) {
                  if (seen[static_cast<size_t>(next)]) { continue; }
                  seen[static_cast<size_t>(next)] = 1;
                  depth_of[static_cast<size_t>(next)] = depth_of[static_cast<size_t>(node)] + 1;
                  up_table[0][static_cast<size_t>(next)] = node;
                  queue_nodes.push_back(next);
              }
          }
          for (size_t j = 1; j < static_cast<size_t>(levels_global); ++j) {
              for (int v = 1; v <= n_global; ++v) {
                  up_table[j][static_cast<size_t>(v)] =
                      up_table[j - 1][static_cast<size_t>(up_table[j - 1][static_cast<size_t>(v)])];
              }
          }
      }

      removed_flag.assign(static_cast<size_t>(n_global) + 1, 0);
      subtree_size.assign(static_cast<size_t>(n_global) + 1, 0);
      centroid_parent.assign(static_cast<size_t>(n_global) + 1, 0);
      inside.assign(static_cast<size_t>(n_global) + 1, Fenwick{});
      border.assign(static_cast<size_t>(n_global) + 1, Fenwick{});
      build(1, 0);
      for (int i = 1; i <= n_global; ++i) { apply_update(i, value_of[static_cast<size_t>(i)]); }

      long long last_answer = 0;
      for (int i = 0; i < m; ++i) {
          long long op, x, y;
          cin >> op >> x >> y;
          x ^= last_answer;
          y ^= last_answer;
          if (op == 0) {
              last_answer = query(static_cast<int>(x), static_cast<int>(y));
              cout << last_answer << '\n';
          } else {
              apply_update(static_cast<int>(x), y - value_of[static_cast<size_t>(x)]);
              value_of[static_cast<size_t>(x)] = y;
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P6329
external_platform: 洛谷
external_problem_id: P6329
external_title: '【模板】點分樹 / 震波'
external_relation: original
source_book_pages: [256, 276]
source_pdf_pages: [274, 294]
review_status: verified
---

從點分治到點分樹，是從「離線走一遍」到「固化成可反覆查詢的結構」。inside 減 border 這個容斥值得自己畫圖推一次——推過就再也不會忘。
