---
id: luogu-p3690
volume: upper
source_file: upper-volume
title: 洛谷 P3690 Link-Cut Tree：動態樹路徑查詢
chapter: 4
section: '4.18'
kind: external-oj
difficulty: 5
topics: ['LCT', '動態樹', 'Splay', '偏好路徑']
prerequisites: ['link-cut-tree', 'fhq-treap']
statement: |-
  給定 n 個各自獨立、帶整數點權的節點，動態維護一座森林。依序支援：查詢兩個連通節點間簡單路徑上所有點權的異或和；若兩點尚未連通便加邊；若指定邊存在便刪除；把單一節點的權值改為新值。
constraints:
  - '1 <= n <= 100000'
  - '1 <= m <= 300000'
  - '1 <= 初始點權、修改後點權 <= 1000000000'
  - '查詢的兩點保證連通；對已連通兩點的加邊與不存在邊的刪除皆不改變森林'
input_format: '第一行兩個整數 n 與 m；接著輸入 n 個初始點權；再輸入 m 行操作：`0 x y` 查詢路徑異或和、`1 x y` 嘗試連邊、`2 x y` 嘗試斷邊、`3 x y` 把 x 的點權改成 y。'
output_format: '對每個查詢輸出一行。'
samples:
  - input: |
      3 8
      1 2 3
      1 1 2
      1 2 3
      0 1 3
      3 2 5
      0 1 3
      2 1 2
      1 1 3
      0 2 3
    output: |
      0
      7
      6
    explanation: |-
      連成鏈 1–2–3 後，路徑異或為 1^2^3=0；把節點 2 改成 5 後，同一路徑為 1^5^3=7。斷開 1–2、改連 1–3 後，2 與 3 的路徑只包含這兩點，答案為 5^3=6。
core_knowledge: ['Link-Cut Tree 以 Splay 維護偏好路徑', 'access 與 make_root', '路徑異或聚合與翻轉懶標記']
judgment: '路徑聚合包含兩個端點；操作 3 的第二個參數是新點權而非增量；link 與 cut 必須自行判斷是否能生效。'
hints:
  - |-
    將每條「偏好路徑」以一棵 Splay 表示，Splay 的中序順序對應樹上由淺到深的順序；每個節點維護子樹點權異或。
  - |-
    `access(x)` 沿 path-parent 向上，逐段把當前節點 splay 到根並將右子改接成上一段，最後 x 所在輔助樹正好表示原樹根到 x 的路徑。
  - |-
    `make_root(x)` 是 access 後翻轉路徑；接著 `access(y)` 便使 y 的輔助子樹代表 x–y。link 令換根後的 x 指向 y；cut 則在暴露 x–y 後確認 x 是 y 的直接左子，再斷開。
solution_outline: |-
  用 Splay 維護偏好路徑，節點保存點權與子樹異或和，並帶翻轉標記。access 沿 parent 逐段 splay 並改接右子；make_root 在 access 後打翻轉標記；split 組合兩者取得路徑。link 前用 find_root 確認不連通，cut 前確認 y 的父是 x 且 y 無左子。改點權時先 splay 再 pull。
proof_or_invariant: |-
  不變量是「每棵 Splay 恰對應森林中的一條偏好路徑，中序即該路徑由淺到深的順序」。access 只改變偏好路徑的劃分而不改變森林結構；翻轉標記讓「換根」在不移動實際邊的前提下生效。攤還分析（與 LCT 的重輕邊論證相同）給出單次操作 O(log n)。
common_errors:
  [
    '把輔助樹根誤判為 parent 等於 0，而未檢查父節點是否真的以它為子',
    'splay 前未由上而下推送翻轉標記',
    'cut 只檢查連通性，未確認兩點之間是直接邊',
    '修改點權後漏掉 pull'
  ]
complexity:
  time: '攤還 O(log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<int> value(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> value[static_cast<size_t>(i)]; }

      // TODO：Link-Cut Tree。
      //   核心是用 Splay 維護每條「偏好路徑」，森林的形狀可以動態改變。
      //   1. access(x)：把根到 x 的路徑打通成一條偏好路徑。
      //      沿 parent 一路 splay 上去，每次把右子換成上一段。
      //   2. make_root(x)：access 之後對 x 打翻轉標記，x 就成為所在樹的根。
      //      有了換根，link / cut / 路徑查詢才能統一處理。
      //   3. split(x, y) = make_root(x) 後 access(y)，此時 y 的 Splay 恰好是路徑 x–y。
      //   4. link 前要確認兩點不連通（find_root 比較），
      //      cut 前要確認 x–y 真的是一條邊（y 的父是 x 且 y 沒有左子）。
      //   兩個常見陷阱：splay 之前必須把根到該點路徑上的標記**由上而下**全部下推；
      //   is_root 的判斷是「父節點的兩個子都不是我」，不是「沒有父節點」。
      // 下面是每次都重建鄰接表、用 BFS 找路徑的樸素版本。
      vector<set<int>> adjacency(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int op, x, y;
          cin >> op >> x >> y;
          if (op == 0) {
              vector<int> previous(static_cast<size_t>(n) + 1, 0);
              deque<int> queue_nodes{x};
              previous[static_cast<size_t>(x)] = x;
              while (!queue_nodes.empty()) {
                  const int node = queue_nodes.front();
                  queue_nodes.pop_front();
                  for (const int next : adjacency[static_cast<size_t>(node)]) {
                      if (previous[static_cast<size_t>(next)] != 0) { continue; }
                      previous[static_cast<size_t>(next)] = node;
                      queue_nodes.push_back(next);
                  }
              }
              int total = 0;
              for (int node = y; node != x; node = previous[static_cast<size_t>(node)]) {
                  total ^= value[static_cast<size_t>(node)];
              }
              total ^= value[static_cast<size_t>(x)];
              cout << total << '\n';
          } else if (op == 1) {
              adjacency[static_cast<size_t>(x)].insert(y);
              adjacency[static_cast<size_t>(y)].insert(x);
          } else if (op == 2) {
              adjacency[static_cast<size_t>(x)].erase(y);
              adjacency[static_cast<size_t>(y)].erase(x);
          } else {
              value[static_cast<size_t>(x)] = y;
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // Link-Cut Tree：用 Splay 維護每條「偏好路徑」，森林的形狀可以動態改變。
  // access(x) 把根到 x 的路徑變成一條偏好路徑；make_root 再配合翻轉標記換根。
  struct LinkCutTree {
      struct Node {
          int child[2] = {0, 0};
          int parent = 0;
          int value = 0;
          int path_xor = 0;
          bool flip = false;
      };
      vector<Node> nodes;

      explicit LinkCutTree(size_t n) : nodes(n) {}

      bool is_root(int x) const {
          const int p = nodes[static_cast<size_t>(x)].parent;
          return p == 0 || (nodes[static_cast<size_t>(p)].child[0] != x &&
                            nodes[static_cast<size_t>(p)].child[1] != x);
      }

      void pull(int x) {
          nodes[static_cast<size_t>(x)].path_xor =
              nodes[static_cast<size_t>(x)].value ^
              nodes[static_cast<size_t>(nodes[static_cast<size_t>(x)].child[0])].path_xor ^
              nodes[static_cast<size_t>(nodes[static_cast<size_t>(x)].child[1])].path_xor;
      }

      void apply_flip(int x) {
          if (x == 0) { return; }
          swap(nodes[static_cast<size_t>(x)].child[0], nodes[static_cast<size_t>(x)].child[1]);
          nodes[static_cast<size_t>(x)].flip = !nodes[static_cast<size_t>(x)].flip;
      }

      void push_down(int x) {
          if (!nodes[static_cast<size_t>(x)].flip) { return; }
          apply_flip(nodes[static_cast<size_t>(x)].child[0]);
          apply_flip(nodes[static_cast<size_t>(x)].child[1]);
          nodes[static_cast<size_t>(x)].flip = false;
      }

      void rotate(int x) {
          const int p = nodes[static_cast<size_t>(x)].parent;
          const int g = nodes[static_cast<size_t>(p)].parent;
          const int side = nodes[static_cast<size_t>(p)].child[1] == x ? 1 : 0;
          const int child = nodes[static_cast<size_t>(x)].child[side ^ 1];
          if (!is_root(p)) {
              nodes[static_cast<size_t>(g)].child[nodes[static_cast<size_t>(g)].child[1] == p ? 1 : 0] = x;
          }
          nodes[static_cast<size_t>(x)].child[side ^ 1] = p;
          nodes[static_cast<size_t>(p)].child[side] = child;
          if (child != 0) { nodes[static_cast<size_t>(child)].parent = p; }
          nodes[static_cast<size_t>(p)].parent = x;
          nodes[static_cast<size_t>(x)].parent = g;
          pull(p);
          pull(x);
      }

      void splay(int x) {
          vector<int> path{x};
          int current = x;
          while (!is_root(current)) {
              current = nodes[static_cast<size_t>(current)].parent;
              path.push_back(current);
          }
          for (size_t i = path.size(); i-- > 0;) { push_down(path[i]); }
          while (!is_root(x)) {
              const int p = nodes[static_cast<size_t>(x)].parent;
              const int g = nodes[static_cast<size_t>(p)].parent;
              if (!is_root(p)) {
                  const bool same = (nodes[static_cast<size_t>(g)].child[1] == p) ==
                                    (nodes[static_cast<size_t>(p)].child[1] == x);
                  rotate(same ? p : x);
              }
              rotate(x);
          }
      }

      // 把根到 x 的路徑打通成一條偏好路徑，並讓 x 成為該 Splay 的根。
      void access(int x) {
          int last = 0;
          for (int current = x; current != 0; current = nodes[static_cast<size_t>(current)].parent) {
              splay(current);
              nodes[static_cast<size_t>(current)].child[1] = last;
              pull(current);
              last = current;
          }
          splay(x);
      }

      void make_root(int x) {
          access(x);
          apply_flip(x);
      }

      int find_root(int x) {
          access(x);
          while (nodes[static_cast<size_t>(x)].child[0] != 0) {
              push_down(x);
              x = nodes[static_cast<size_t>(x)].child[0];
          }
          splay(x);
          return x;
      }

      void split(int x, int y) {
          make_root(x);
          access(y);
      }

      void link(int x, int y) {
          make_root(x);
          if (find_root(y) == x) { return; }  // 已連通，連了會成環
          nodes[static_cast<size_t>(x)].parent = y;
      }

      void cut(int x, int y) {
          make_root(x);
          access(y);
          // 暴露 x–y 後，若它們直接相鄰，x 必為 y 的左子且 x 沒有右子。
          if (nodes[static_cast<size_t>(y)].child[0] != x ||
              nodes[static_cast<size_t>(x)].child[1] != 0) { return; }
          nodes[static_cast<size_t>(y)].child[0] = 0;
          nodes[static_cast<size_t>(x)].parent = 0;
          pull(y);
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      LinkCutTree tree(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) {
          cin >> tree.nodes[static_cast<size_t>(i)].value;
          tree.nodes[static_cast<size_t>(i)].path_xor = tree.nodes[static_cast<size_t>(i)].value;
      }
      for (int i = 0; i < m; ++i) {
          int op, x, y;
          cin >> op >> x >> y;
          if (op == 0) {
              tree.split(x, y);
              cout << tree.nodes[static_cast<size_t>(y)].path_xor << '\n';
          } else if (op == 1) {
              tree.link(x, y);
          } else if (op == 2) {
              tree.cut(x, y);
          } else {
              tree.splay(x);
              tree.nodes[static_cast<size_t>(x)].value = y;
              tree.pull(x);
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3690
external_platform: 洛谷
external_problem_id: P3690
external_title: '【模板】動態樹（LCT）'
external_relation: original
source_book_pages: [421, 448]
source_pdf_pages: [439, 466]
review_status: verified
---

LCT 是動態樹問題的終極武器。把 access 想清楚，其餘操作都只是它的組合。
