---
id: luogu-p3402
volume: upper
source_file: upper-volume
title: 洛谷 P3402 可持久化並查集：不能路徑壓縮
chapter: 4
section: '4.4'
kind: external-oj
difficulty: 5
topics: ['可持久化並查集', '按秩合併', '可持久化陣列', '版本回溯']
prerequisites: ['persistent-segment-tree', 'union-find']
statement: |-
  維護一個支援版本回溯的並查集：合併兩個集合、回到某個歷史版本、查詢兩點是否同集合。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '需要支援回到任意歷史版本'
  - '不能使用路徑壓縮'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；接下來 m 行，`1 a b` 合併、`2 k` 回到第 k 個版本、`3 a b` 查詢是否同集合。'
output_format: '對每個查詢輸出一行，同集合輸出 1，否則 0。'
samples:
  - input: |
      5 6
      1 1 2
      3 1 2
      2 0
      3 1 2
      1 3 4
      3 3 4
    output: |
      1
      0
      1
    explanation: |-
      合併 1、2 後查詢得 1；回到版本 0（初始狀態）後再查同樣兩點得 0，正好展示版本回溯的效果。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    把並查集的 parent 陣列換成**可持久化陣列**（用可持久化線段樹實作），版本回溯就變成「把根指標指回舊版本」，成本 O(1)。
  - |-
    **絕對不能用路徑壓縮。** 路徑壓縮會一次改寫一整條路徑上的所有 parent，而那些節點正被舊版本共用；改了它們就等於竄改歷史。
  - |-
    沒有路徑壓縮，樹高怎麼辦？用**按秩合併**（把秩較小的樹接到秩較大的下面）。這單獨就能把樹高壓在 O(log n)，不需要路徑壓縮輔助。
  - |-
    所以 rank 陣列也要可持久化。find 沿 parent 往上跳 O(log n) 步，每步查一次可持久化陣列又是 O(log n)，單次操作合計 O(log² n)。
  - |-
    合併時若兩者的秩相等，接完之後新根的秩要加一；秩不同時秩不變。這一步寫錯不會馬上出錯，但樹高會慢慢退化。
solution_outline: |-
  parent 與 rank 兩個陣列都用可持久化線段樹維護。find 不做路徑壓縮，純粹沿 parent 往上跳。合併時比較兩根的秩，把秩小的接到秩大的下面，秩相等時新根的秩加一。版本回溯只需把兩個根指標指回指定版本。
proof_or_invariant: |-
  按秩合併單獨即可保證樹高 O(log n)：秩為 r 的樹至少含 2^r 個節點，故秩不超過 log n，而樹高不超過秩。可持久化保證任何舊版本的節點都不被改寫，因此回溯到任意版本後的結構與當時完全一致。
complexity:
  time: '單次操作 O(log² n)'
  space: 'O((n + m) log n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }

      // TODO：把 parent 陣列與 rank 陣列都換成可持久化線段樹。
      //   關鍵限制：**不能用路徑壓縮**。路徑壓縮會改寫一大批節點，
      //   而那些節點正被舊版本共用，改了就毀掉歷史。
      //   改用**按秩合併**（把秩小的接到秩大的下面）把樹高壓在 O(log n)，
      //   於是 find 沿 parent 往上跳是 O(log n)，
      //   每次 query 又是 O(log n)，合起來單次操作 O(log² n)。
      //   操作 2 只要把根指標指回舊版本即可，成本 O(1)。
      // 下面是每個版本存一份完整 DSU 陣列的樸素版本。
      vector<vector<int>> versions;
      vector<int> initial(static_cast<size_t>(n) + 1);
      iota(initial.begin(), initial.end(), 0);
      versions.push_back(initial);
      auto find_root = [](vector<int>& parent, int x) {
          while (parent[static_cast<size_t>(x)] != x) { x = parent[static_cast<size_t>(x)]; }
          return x;
      };
      for (int i = 1; i <= m; ++i) {
          int op;
          cin >> op;
          if (op == 1) {
              int a, b;
              cin >> a >> b;
              vector<int> next = versions[static_cast<size_t>(i - 1)];
              const int ra = find_root(next, a);
              const int rb = find_root(next, b);
              if (ra != rb) { next[static_cast<size_t>(ra)] = rb; }
              versions.push_back(next);
          } else if (op == 2) {
              int k;
              cin >> k;
              versions.push_back(versions[static_cast<size_t>(k)]);
          } else {
              int a, b;
              cin >> a >> b;
              vector<int> next = versions[static_cast<size_t>(i - 1)];
              cout << (find_root(next, a) == find_root(next, b) ? 1 : 0) << '\n';
              versions.push_back(next);
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 可持久化並查集 = 可持久化陣列存 parent + 按秩合併。
  // 不能用路徑壓縮：壓縮會大量改寫舊版本共用的節點，破壞可持久化。
  struct PersistentArray {
      struct Node {
          int left = 0, right = 0, value = 0;
      };
      vector<Node> nodes{Node{}};
      int n = 0;

      int build(int l, int r, const function<int(int)>& init) {
          const int id = static_cast<int>(nodes.size());
          nodes.push_back(Node{});
          if (l == r) {
              nodes[static_cast<size_t>(id)].value = init(l);
              return id;
          }
          const int mid = (l + r) / 2;
          const int left_child = build(l, mid, init);
          const int right_child = build(mid + 1, r, init);
          nodes[static_cast<size_t>(id)].left = left_child;
          nodes[static_cast<size_t>(id)].right = right_child;
          return id;
      }

      int assign(int previous, int l, int r, int position, int value) {
          const int id = static_cast<int>(nodes.size());
          nodes.push_back(nodes[static_cast<size_t>(previous)]);
          if (l == r) {
              nodes[static_cast<size_t>(id)].value = value;
              return id;
          }
          const int mid = (l + r) / 2;
          if (position <= mid) {
              const int child = assign(nodes[static_cast<size_t>(previous)].left, l, mid, position, value);
              nodes[static_cast<size_t>(id)].left = child;
          } else {
              const int child = assign(nodes[static_cast<size_t>(previous)].right, mid + 1, r, position, value);
              nodes[static_cast<size_t>(id)].right = child;
          }
          return id;
      }

      int query(int node, int l, int r, int position) const {
          if (l == r) { return nodes[static_cast<size_t>(node)].value; }
          const int mid = (l + r) / 2;
          return position <= mid ? query(nodes[static_cast<size_t>(node)].left, l, mid, position)
                                 : query(nodes[static_cast<size_t>(node)].right, mid + 1, r, position);
      }
  };

  static PersistentArray parent_array;
  static PersistentArray rank_array;
  static int n_global;

  static int find_root(int root_parent, int x) {
      while (true) {
          const int p = parent_array.query(root_parent, 1, n_global, x);
          if (p == x) { return x; }
          x = p;
      }
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int m;
      if (!(cin >> n_global >> m)) { return 0; }
      vector<int> parent_root(static_cast<size_t>(m) + 1);
      vector<int> rank_root(static_cast<size_t>(m) + 1);
      parent_root[0] = parent_array.build(1, n_global, [](int i) { return i; });
      rank_root[0] = rank_array.build(1, n_global, [](int) { return 0; });

      for (int i = 1; i <= m; ++i) {
          int op;
          cin >> op;
          if (op == 1) {
              int a, b;
              cin >> a >> b;
              const int ra = find_root(parent_root[static_cast<size_t>(i - 1)], a);
              const int rb = find_root(parent_root[static_cast<size_t>(i - 1)], b);
              if (ra == rb) {
                  parent_root[static_cast<size_t>(i)] = parent_root[static_cast<size_t>(i - 1)];
                  rank_root[static_cast<size_t>(i)] = rank_root[static_cast<size_t>(i - 1)];
                  continue;
              }
              int deep = ra;
              int shallow = rb;
              const int rank_a = rank_array.query(rank_root[static_cast<size_t>(i - 1)], 1, n_global, ra);
              const int rank_b = rank_array.query(rank_root[static_cast<size_t>(i - 1)], 1, n_global, rb);
              if (rank_a < rank_b) { swap(deep, shallow); }
              // 把秩小的接到秩大的下面，樹高才不會退化。
              parent_root[static_cast<size_t>(i)] =
                  parent_array.assign(parent_root[static_cast<size_t>(i - 1)], 1, n_global, shallow, deep);
              if (rank_a == rank_b) {
                  rank_root[static_cast<size_t>(i)] = rank_array.assign(
                      rank_root[static_cast<size_t>(i - 1)], 1, n_global, deep, max(rank_a, rank_b) + 1);
              } else {
                  rank_root[static_cast<size_t>(i)] = rank_root[static_cast<size_t>(i - 1)];
              }
          } else if (op == 2) {
              int k;
              cin >> k;
              parent_root[static_cast<size_t>(i)] = parent_root[static_cast<size_t>(k)];
              rank_root[static_cast<size_t>(i)] = rank_root[static_cast<size_t>(k)];
          } else {
              int a, b;
              cin >> a >> b;
              const int ra = find_root(parent_root[static_cast<size_t>(i - 1)], a);
              const int rb = find_root(parent_root[static_cast<size_t>(i - 1)], b);
              cout << (ra == rb ? 1 : 0) << '\n';
              parent_root[static_cast<size_t>(i)] = parent_root[static_cast<size_t>(i - 1)];
              rank_root[static_cast<size_t>(i)] = rank_root[static_cast<size_t>(i - 1)];
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3402
external_platform: 洛谷
external_problem_id: P3402
external_title: '【模板】可持久化並查集'
external_relation: original
source_book_pages: [179, 196]
source_pdf_pages: [197, 214]
review_status: verified
---

這題把「路徑壓縮是一種破壞性優化」這件事講得很透。可持久化的世界裡，任何就地修改都要先問一句：這個節點是不是別人也在用？
