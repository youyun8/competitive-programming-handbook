---
id: luogu-p3369
volume: upper
source_file: upper-volume
title: 洛谷 P3369 普通平衡樹：FHQ Treap 六種操作
chapter: 4
section: '4.12'
kind: external-oj
difficulty: 4
topics: ['平衡樹', 'FHQ Treap', 'split', 'merge']
prerequisites: ['scapegoat-tree', 'fhq-treap']
statement: |-
  維護一個可重集合，支援插入、刪除一個元素、查詢某值的排名、查詢第 k 小、查詢前驅與後繼。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '操作數可達 10^5，每次操作需為 O(log n)'
  - '集合可重，刪除只刪一個'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行一個整數 n；接下來 n 行，每行兩個整數 op 與 x，op 為 1..6 分別對應插入、刪除、查排名、查第 k 小、查前驅、查後繼。'
output_format: '對 op 為 3、4、5、6 的操作各輸出一行結果。'
samples:
  - input: |
      10
      1 106465
      4 1
      1 317721
      1 460929
      1 644985
      1 84185
      1 89851
      6 81968
      1 492737
      5 493598
    output: |
      106465
      84185
      492737
    explanation: |-
      第二個操作查第 1 小，此時集合只有 106465；倒數第二個操作查 81968 的後繼得 84185；最後查 493598 的前驅得 492737。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    FHQ Treap（無旋 Treap）只需要兩個基本操作：**split**（把樹切成兩棵）與 **merge**（把兩棵合成一棵）。所有功能都是這兩者的組合，完全不需要旋轉，程式碼比 Splay 或 AVL 短得多。
  - |-
    平衡從哪來？每個節點有一個**隨機優先度**，merge 時依優先度決定誰當根。這讓樹的形狀等價於隨機插入的 BST，期望高度是 O(log n)。
  - |-
    split(node, key) 把樹切成「值 <= key」與「值 > key」兩棵。有了它，插入就是 split 後把新節點夾在中間再 merge 回去；刪除就是切出「等於 x」那一段、丟掉其中一個節點再接回去。
  - |-
    查排名：split(root, x−1) 之後左子樹的大小加一就是答案。查前驅：split(root, x−1) 後在左子樹一路往右走。查後繼：split(root, x) 後在右子樹一路往左走。第 k 小則直接依左子樹大小往下走。
  - |-
    每個節點都要維護 size，且任何改變樹形的操作（split、merge）在回溯時都必須 pull 更新 size。漏掉某一處，排名與第 k 小就會錯得很隱蔽。
solution_outline: |-
  實作 FHQ Treap 的 split（依值切分）與 merge（依隨機優先度合併），每個節點維護子樹大小。六種操作分別由 split / merge 組合而成：插入夾入新節點、刪除切出等值段後移除一個、排名取左子樹大小加一、第 k 小依大小往下走、前驅與後繼各自切分後走到極端。
proof_or_invariant: |-
  兩個不變量同時維持：對值是二元搜尋樹（中序有序），對隨機優先度是堆。後者讓樹的形狀分佈等同於隨機插入順序建出的 BST，期望高度 O(log n)。split 與 merge 都只沿一條根到葉的路徑遞迴，故單次操作期望 O(log n)。
complexity:
  time: '期望 O(log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // FHQ Treap 的骨架。整棵樹只靠 split 與 merge 兩個操作，
  // 不需要任何旋轉——這是它比 Splay、AVL 好寫得多的原因。
  struct Treap {
      struct Node {
          int left = 0, right = 0;
          int value = 0;
          unsigned long priority = 0;
          int size = 0;
      };
      vector<Node> nodes{Node{}};
      int root = 0;
      mt19937 rng{20260725};

      int create(int value) {
          nodes.push_back(Node{});
          const int id = static_cast<int>(nodes.size()) - 1;
          nodes[static_cast<size_t>(id)].value = value;
          nodes[static_cast<size_t>(id)].priority = rng();  // 隨機優先度是平衡的來源
          nodes[static_cast<size_t>(id)].size = 1;
          return id;
      }

      void pull(int node) {
          nodes[static_cast<size_t>(node)].size =
              1 + nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].left)].size +
              nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].right)].size;
      }

      // TODO 1：依值切分。left 子樹的值全部 <= key，right 子樹全部 > key。
      //   遞迴時注意：走到哪一邊，就把該邊的指標交給遞迴去填。回溯要 pull。
      void split(int node, int key, int& left, int& right) {
          (void)node;
          (void)key;
          left = right = 0;
      }

      // TODO 2：合併。前提是 left 的所有值都不大於 right 的所有值。
      //   比較兩者的優先度決定誰當根——這一步維持了堆的性質，也就維持了平衡。
      int merge(int left, int right) {
          (void)right;
          return left;
      }

      // TODO 3：用 split / merge 組出六種操作。
      //   插入：split(root, value) 後把新節點夾在中間 merge 回去。
      //   刪除：split 出「等於 value」的那一段，只丟掉其中一個節點
      //         （把它的左右子 merge 起來），再接回去。
      //   排名：split(root, value − 1) 後左子樹大小加一。
      //   第 k 小：從根往下走，比較左子樹大小。
      //   前驅：split(root, value − 1) 後在左子樹一路往右。
      //   後繼：split(root, value) 後在右子樹一路往左。
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      Treap treap;
      (void)treap;
      // 樸素替代：用有序 vector 直接做，正確但單次操作是 O(n)。
      vector<int> sorted_values;
      for (int i = 0; i < n; ++i) {
          int op, x;
          cin >> op >> x;
          if (op == 1) {
              sorted_values.insert(lower_bound(sorted_values.begin(), sorted_values.end(), x), x);
          } else if (op == 2) {
              sorted_values.erase(lower_bound(sorted_values.begin(), sorted_values.end(), x));
          } else if (op == 3) {
              cout << (lower_bound(sorted_values.begin(), sorted_values.end(), x) -
                       sorted_values.begin()) + 1
                   << '\n';
          } else if (op == 4) {
              cout << sorted_values[static_cast<size_t>(x - 1)] << '\n';
          } else if (op == 5) {
              cout << *prev(lower_bound(sorted_values.begin(), sorted_values.end(), x)) << '\n';
          } else {
              cout << *upper_bound(sorted_values.begin(), sorted_values.end(), x) << '\n';
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // FHQ Treap（無旋轉平衡樹）：只靠 split 與 merge 兩個操作就能支援
  // 插入、刪除、排名、第 k 小、前驅、後繼。
  struct Treap {
      struct Node {
          int left = 0, right = 0;
          int value = 0;
          unsigned long priority = 0;
          int size = 0;
      };
      vector<Node> nodes{Node{}};
      int root = 0;
      mt19937 rng{20260725};

      int create(int value) {
          nodes.push_back(Node{});
          const int id = static_cast<int>(nodes.size()) - 1;
          nodes[static_cast<size_t>(id)].value = value;
          nodes[static_cast<size_t>(id)].priority = rng();
          nodes[static_cast<size_t>(id)].size = 1;
          return id;
      }

      void pull(int node) {
          nodes[static_cast<size_t>(node)].size =
              1 + nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].left)].size +
              nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].right)].size;
      }

      // 依值切分：left 子樹全部 <= key，right 子樹全部 > key。
      void split(int node, int key, int& left, int& right) {
          if (node == 0) { left = right = 0; return; }
          if (nodes[static_cast<size_t>(node)].value <= key) {
              left = node;
              split(nodes[static_cast<size_t>(node)].right, key, nodes[static_cast<size_t>(node)].right, right);
          } else {
              right = node;
              split(nodes[static_cast<size_t>(node)].left, key, left, nodes[static_cast<size_t>(node)].left);
          }
          pull(node);
      }

      // 前提：left 的所有值都不大於 right 的所有值。依優先度決定誰當根。
      int merge(int left, int right) {
          if (left == 0 || right == 0) { return left | right; }
          if (nodes[static_cast<size_t>(left)].priority < nodes[static_cast<size_t>(right)].priority) {
              nodes[static_cast<size_t>(left)].right = merge(nodes[static_cast<size_t>(left)].right, right);
              pull(left);
              return left;
          }
          nodes[static_cast<size_t>(right)].left = merge(left, nodes[static_cast<size_t>(right)].left);
          pull(right);
          return right;
      }

      void insert(int value) {
          int a, b;
          split(root, value, a, b);
          root = merge(merge(a, create(value)), b);
      }

      void erase(int value) {
          int a, b, c;
          split(root, value, a, c);
          split(a, value - 1, a, b);
          // b 是所有等於 value 的節點，只刪掉其中一個。
          b = merge(nodes[static_cast<size_t>(b)].left, nodes[static_cast<size_t>(b)].right);
          root = merge(merge(a, b), c);
      }

      int rank_of(int value) {
          int a, b;
          split(root, value - 1, a, b);
          const int result = nodes[static_cast<size_t>(a)].size + 1;
          root = merge(a, b);
          return result;
      }

      int kth(int k) const {
          int node = root;
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

      int predecessor(int value) {
          int a, b;
          split(root, value - 1, a, b);
          int node = a;
          while (nodes[static_cast<size_t>(node)].right != 0) { node = nodes[static_cast<size_t>(node)].right; }
          const int result = nodes[static_cast<size_t>(node)].value;
          root = merge(a, b);
          return result;
      }

      int successor(int value) {
          int a, b;
          split(root, value, a, b);
          int node = b;
          while (nodes[static_cast<size_t>(node)].left != 0) { node = nodes[static_cast<size_t>(node)].left; }
          const int result = nodes[static_cast<size_t>(node)].value;
          root = merge(a, b);
          return result;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      Treap treap;
      for (int i = 0; i < n; ++i) {
          int op, x;
          cin >> op >> x;
          switch (op) {
              case 1: treap.insert(x); break;
              case 2: treap.erase(x); break;
              case 3: cout << treap.rank_of(x) << '\n'; break;
              case 4: cout << treap.kth(x) << '\n'; break;
              case 5: cout << treap.predecessor(x) << '\n'; break;
              default: cout << treap.successor(x) << '\n'; break;
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3369
external_platform: 洛谷
external_problem_id: P3369
external_title: '【模板】普通平衡樹'
external_relation: original
source_book_pages: [307, 322]
source_pdf_pages: [325, 340]
review_status: verified
---

FHQ Treap 用「隨機優先度 + split/merge」取代了旋轉。學會這兩個操作，區間翻轉、可持久化都能沿用同一套骨架。
