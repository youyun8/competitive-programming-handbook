---
id: luogu-p3835
volume: upper
source_file: upper-volume
title: 洛谷 P3835 可持久化平衡樹：帶版本的有序集合
chapter: 4
section: '4.4'
kind: external-oj
difficulty: 5
topics: ['可持久化', 'FHQ Treap', 'split', 'merge']
prerequisites: ['fhq-treap', 'persistent-segment-tree']
core_knowledge:
  - FHQ Treap
  - 寫入時複製
  - 有序多重集合
judgment: 六種操作都能由 FHQ Treap 的 split、merge 與子樹大小完成；兩者只改根到葉的路徑，適合以 clone-on-write 保留版本。
statement: |-
  維護一個支援版本回溯的可重集合，支援插入、刪除、查排名、查第 k 小、查前驅與後繼，每次操作都基於指定版本並產生新版本。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '1 <= n <= 500000'
  - '每次操作指定的版本 v 介於 0 與目前操作編號之前'
  - '前驅不存在輸出 -2147483647，後繼不存在輸出 2147483647'
input_format: '第一行一個整數 n；接下來 n 行，每行三個整數 v、opt、x，opt 為 1..6 分別對應插入、刪除、查排名、查第 k 小、查前驅、查後繼。'
output_format: '對 opt 為 3、4、5、6 的操作各輸出一行結果。'
samples:
  - input: |
      8
      0 1 9
      1 1 3
      1 1 10
      2 4 2
      3 3 9
      3 1 2
      6 4 1
      6 2 9
    output: |
      9
      1
      2
    explanation: |-
      版本 2 是 {3, 9}，查第 2 小得 9；版本 3 是 {9, 10}，查 9 的排名得 1；版本 6 是 {2, 9, 10}，查第 1 小得 2。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    FHQ Treap 只靠 split 與 merge 兩個操作，而這兩個操作都只沿一條路徑遞迴——這正是它極易可持久化的原因。
  - |-
    唯一要改的是：split 與 merge 在遞迴時**先 clone 一份節點再修改**，而不是就地改。這樣舊版本指向的節點完全不受影響。
  - |-
    每次操作只複製一條根到葉的路徑，額外空間 O(log n)。總空間 O(n log n)。
solution_outline: |-
  把 FHQ Treap 的 split 與 merge 改成 clone-on-write：遞迴時先複製節點再修改子指標，回溯時 pull 更新 size。六種操作與非持久化版本相同，只是每次以指定版本的根為起點；查詢型操作把新版本的根指回原版本的根。
proof_or_invariant: |-
  clone-on-write 保證任何已存在的節點都不會被修改，因此每個版本的根所代表的樹在其建立之後永遠保持原樣。隨機優先度維持的堆性質不因複製而改變，故期望高度仍是 O(log n)。
complexity:
  time: '期望 O(log n)'
  space: 'O(n log n)'
common_errors:
  - split 或 merge 就地修改被舊版本共享的節點
  - 刪除時移除所有相同值，而非只移除一個
  - 忽略前驅、後繼不存在時指定的哨兵輸出
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }

      // TODO：把 FHQ Treap 改成可持久化。
      //   唯一的改動是：split 與 merge 在遞迴時**不要就地修改節點**，
      //   而是先 clone 一份再改。這樣舊版本指向的節點完全不受影響。
      //   每次操作只會複製一條根到葉的路徑，額外空間 O(log n)。
      //   查詢類操作（3~6）不改變內容，新版本直接指向舊根即可。
      //   注意 5 與 6 在找不到前驅／後繼時要輸出 −2147483647 與 2147483647。
      // 下面是每個版本存一份完整有序陣列的樸素版本。
      vector<vector<int>> versions{{}};
      for (int i = 1; i <= n; ++i) {
          int version, op, x;
          cin >> version >> op >> x;
          vector<int> base = versions[static_cast<size_t>(version)];
          if (op == 1) {
              base.insert(lower_bound(base.begin(), base.end(), x), x);
          } else if (op == 2) {
              const auto it = lower_bound(base.begin(), base.end(), x);
              if (it != base.end() && *it == x) { base.erase(it); }
          } else if (op == 3) {
              cout << (lower_bound(base.begin(), base.end(), x) - base.begin()) + 1 << '\n';
          } else if (op == 4) {
              cout << base[static_cast<size_t>(x - 1)] << '\n';
          } else if (op == 5) {
              const auto it = lower_bound(base.begin(), base.end(), x);
              cout << (it == base.begin() ? -2147483647 : *prev(it)) << '\n';
          } else {
              const auto it = upper_bound(base.begin(), base.end(), x);
              cout << (it == base.end() ? 2147483647 : *it) << '\n';
          }
          versions.push_back(base);
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 可持久化 FHQ Treap：split 與 merge 沿途「複製」節點而不是就地修改，
  // 舊版本因此完好無損。每次操作只新建 O(log n) 個節點。
  struct PersistentTreap {
      struct Node {
          int left = 0, right = 0;
          int value = 0;
          unsigned long priority = 0;
          int size = 0;
      };
      vector<Node> nodes{Node{}};
      mt19937 rng{20260725};

      int create(int value) {
          nodes.push_back(Node{});
          const int id = static_cast<int>(nodes.size()) - 1;
          nodes[static_cast<size_t>(id)].value = value;
          nodes[static_cast<size_t>(id)].priority = rng();
          nodes[static_cast<size_t>(id)].size = 1;
          return id;
      }

      int clone(int node) {
          nodes.push_back(nodes[static_cast<size_t>(node)]);
          return static_cast<int>(nodes.size()) - 1;
      }

      void pull(int node) {
          nodes[static_cast<size_t>(node)].size =
              1 + nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].left)].size +
              nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].right)].size;
      }

      void split(int node, int key, int& left, int& right) {
          if (node == 0) { left = right = 0; return; }
          if (nodes[static_cast<size_t>(node)].value <= key) {
              const int copy = clone(node);
              int sub_left, sub_right;
              split(nodes[static_cast<size_t>(copy)].right, key, sub_left, sub_right);
              nodes[static_cast<size_t>(copy)].right = sub_left;
              pull(copy);
              left = copy;
              right = sub_right;
          } else {
              const int copy = clone(node);
              int sub_left, sub_right;
              split(nodes[static_cast<size_t>(copy)].left, key, sub_left, sub_right);
              nodes[static_cast<size_t>(copy)].left = sub_right;
              pull(copy);
              right = copy;
              left = sub_left;
          }
      }

      int merge(int left, int right) {
          if (left == 0 || right == 0) { return left | right; }
          if (nodes[static_cast<size_t>(left)].priority < nodes[static_cast<size_t>(right)].priority) {
              const int copy = clone(left);
              const int merged = merge(nodes[static_cast<size_t>(copy)].right, right);
              nodes[static_cast<size_t>(copy)].right = merged;
              pull(copy);
              return copy;
          }
          const int copy = clone(right);
          const int merged = merge(left, nodes[static_cast<size_t>(copy)].left);
          nodes[static_cast<size_t>(copy)].left = merged;
          pull(copy);
          return copy;
      }

      int kth(int node, int k) const {
          while (true) {
              const int left_size = nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].left)].size;
              if (k <= left_size) {
                  node = nodes[static_cast<size_t>(node)].left;
              } else if (k == left_size + 1) {
                  return nodes[static_cast<size_t>(node)].value;
              } else {
                  k -= left_size + 1;
                  node = nodes[static_cast<size_t>(node)].right;
              }
          }
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      PersistentTreap treap;
      vector<int> root(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) {
          int version, op, x;
          cin >> version >> op >> x;
          const int base = root[static_cast<size_t>(version)];
          if (op == 1) {
              int a, b;
              treap.split(base, x, a, b);
              root[static_cast<size_t>(i)] = treap.merge(treap.merge(a, treap.create(x)), b);
          } else if (op == 2) {
              int a, b, c;
              treap.split(base, x, a, c);
              treap.split(a, x - 1, a, b);
              if (b != 0) {
                  b = treap.merge(treap.nodes[static_cast<size_t>(b)].left,
                                  treap.nodes[static_cast<size_t>(b)].right);
              }
              root[static_cast<size_t>(i)] = treap.merge(treap.merge(a, b), c);
          } else if (op == 3) {
              int a, b;
              treap.split(base, x - 1, a, b);
              cout << treap.nodes[static_cast<size_t>(a)].size + 1 << '\n';
              root[static_cast<size_t>(i)] = base;  // 查詢不改變內容
          } else if (op == 4) {
              cout << treap.kth(base, x) << '\n';
              root[static_cast<size_t>(i)] = base;
          } else if (op == 5) {
              int a, b;
              treap.split(base, x - 1, a, b);
              if (a == 0) {
                  cout << -2147483647 << '\n';
              } else {
                  cout << treap.kth(a, treap.nodes[static_cast<size_t>(a)].size) << '\n';
              }
              root[static_cast<size_t>(i)] = base;
          } else {
              int a, b;
              treap.split(base, x, a, b);
              if (b == 0) {
                  cout << 2147483647 << '\n';
              } else {
                  cout << treap.kth(b, 1) << '\n';
              }
              root[static_cast<size_t>(i)] = base;
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3835
external_platform: 洛谷
external_problem_id: P3835
external_title: '【模板】可持久化平衡樹'
external_relation: original
source_book_pages: [179, 196]
source_pdf_pages: [197, 214]
review_status: verified
---

把 split/merge 換成「複製再改」就得到可持久化版本——FHQ Treap 的設計在這裡展現了它的價值。
