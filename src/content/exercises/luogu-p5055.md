---
id: luogu-p5055
volume: upper
source_file: upper-volume
title: 洛谷 P5055 可持久化文藝平衡樹：翻轉、求和與版本
chapter: 4
section: '4.4'
kind: external-oj
difficulty: 5
topics: ['可持久化', 'FHQ Treap', '區間翻轉', '強制在線']
prerequisites: ['fhq-treap', 'persistent-segment-tree']
statement: |-
  維護一個支援版本回溯的序列，支援在指定位置插入、刪除某個位置、翻轉一個區間、查詢區間和。強制在線。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '強制在線：版本編號與所有參數都要異或上「上一次查詢的答案」'
  - '同時需要可持久化與懶標記，兩者互相牽制'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行一個整數 n；接下來 n 行，每行為 `v opt` 與對應參數（1 插入 p x、2 刪除 p、3 翻轉 l r、4 求和 l r）。'
output_format: '對每個操作 4 輸出一行區間和。'
samples:
  - input: |
      5
      0 1 0 1
      1 1 1 2
      2 4 1 2
      1 3 2 1
      7 4 2 1
    output: |
      3
      3
    explanation: |-
      前兩個操作把 1、2 依序插入得到序列 (1, 2)，第三個操作查其區間和得 3；之後的參數都要異或 3 才是真正的值。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    這題把三件事疊在一起：**依大小切分**（序列而非有序集合）、**翻轉懶標記**、**可持久化**。單獨每一件都不難，難在它們互相牽制。
  - |-
    最關鍵的一行是：**push_down 時必須先 clone 子節點再翻轉**。子節點可能被舊版本共用，就地打標記等於竄改歷史。這是本題與非持久化文藝平衡樹唯一的本質差別。
  - |-
    節點除了 size 還要維護 sum，才能回答區間和。pull 時記得同時更新兩者。
  - |-
    強制在線的設計是刻意的：版本編號與所有參數都要異或上「上一次操作 4 的答案」，逼你不能離線重排操作順序。
  - |-
    空間會長得很快：每次操作 O(log n) 個新節點，加上 push_down 產生的 clone。開陣列時要估足，或直接用 vector 動態增長。
solution_outline: |-
  用 FHQ Treap 表示序列，split 依子樹大小切分，節點維護 size 與 sum。split / merge 沿路 clone 以維持可持久化；push_down 翻轉標記時先 clone 兩個子節點再交換與取反。四種操作分別由三段切分組合而成，查詢型操作把新版本指回原版本。
proof_or_invariant: |-
  兩個不變量並存：中序遍歷恆為該版本的序列；每個節點的 flip 標記表示其子樹尚未實際套用的一次翻轉。clone-on-write 保證舊版本的節點永不被改寫，因此「先複製再下推標記」是可持久化與懶標記能共存的唯一正確順序。
complexity:
  time: '期望 O(log n)'
  space: 'O(n log n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }

      // TODO：可持久化 + 依大小切分 + 翻轉標記，三者疊在一起。
      //   1. split / merge 沿路 clone，維持可持久化。
      //   2. 節點除了 size 還要維護 sum，才能回答區間和。
      //   3. **push_down 時必須先 clone 子節點再翻轉**——子節點可能被舊版本共用，
      //      就地修改會汙染歷史。這是本題與非持久化版本最大的差別，也是最容易錯的一行。
      //   4. 本題強制在線：版本編號與所有參數都要異或上「上一次操作 4 的答案」。
      // 下面是每個版本存一份完整序列的樸素版本，正確但空間是 O(n²)。
      vector<vector<long long>> versions{{}};
      long long last_answer = 0;
      for (int i = 1; i <= n; ++i) {
          long long version, op;
          cin >> version >> op;
          version ^= last_answer;
          vector<long long> base = versions[static_cast<size_t>(version)];
          if (op == 1) {
              long long p, x;
              cin >> p >> x;
              p ^= last_answer;
              x ^= last_answer;
              base.insert(base.begin() + static_cast<long>(p), x);
          } else if (op == 2) {
              long long p;
              cin >> p;
              p ^= last_answer;
              base.erase(base.begin() + static_cast<long>(p) - 1);
          } else if (op == 3) {
              long long l, r;
              cin >> l >> r;
              l ^= last_answer;
              r ^= last_answer;
              reverse(base.begin() + static_cast<long>(l) - 1, base.begin() + static_cast<long>(r));
          } else {
              long long l, r;
              cin >> l >> r;
              l ^= last_answer;
              r ^= last_answer;
              last_answer = accumulate(base.begin() + static_cast<long>(l) - 1,
                                       base.begin() + static_cast<long>(r), 0LL);
              cout << last_answer << '\n';
          }
          versions.push_back(base);
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 可持久化文藝平衡樹：FHQ Treap 同時具備「依大小切分」「翻轉標記」與「可持久化」。
  // 三者疊在一起的關鍵是：下推標記時必須先複製子節點再修改，
  // 否則會改到舊版本共用的節點。
  struct PersistentTreap {
      struct Node {
          int left = 0, right = 0;
          long long value = 0;
          long long sum = 0;
          unsigned long priority = 0;
          int size = 0;
          bool flip = false;
      };
      vector<Node> nodes{Node{}};
      mt19937 rng{20260725};

      int create(long long value) {
          nodes.push_back(Node{});
          const int id = static_cast<int>(nodes.size()) - 1;
          nodes[static_cast<size_t>(id)].value = value;
          nodes[static_cast<size_t>(id)].sum = value;
          nodes[static_cast<size_t>(id)].priority = rng();
          nodes[static_cast<size_t>(id)].size = 1;
          return id;
      }

      int clone(int node) {
          nodes.push_back(nodes[static_cast<size_t>(node)]);
          return static_cast<int>(nodes.size()) - 1;
      }

      void pull(int node) {
          const Node& l = nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].left)];
          const Node& r = nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].right)];
          nodes[static_cast<size_t>(node)].size = 1 + l.size + r.size;
          nodes[static_cast<size_t>(node)].sum = nodes[static_cast<size_t>(node)].value + l.sum + r.sum;
      }

      // 下推翻轉標記。子節點必須先複製，因為它們可能被別的版本共用。
      void push_down(int node) {
          if (!nodes[static_cast<size_t>(node)].flip) { return; }
          const int old_left = nodes[static_cast<size_t>(node)].left;
          const int old_right = nodes[static_cast<size_t>(node)].right;
          int new_left = 0;
          int new_right = 0;
          if (old_right != 0) {
              new_left = clone(old_right);
              nodes[static_cast<size_t>(new_left)].flip = !nodes[static_cast<size_t>(new_left)].flip;
          }
          if (old_left != 0) {
              new_right = clone(old_left);
              nodes[static_cast<size_t>(new_right)].flip = !nodes[static_cast<size_t>(new_right)].flip;
          }
          nodes[static_cast<size_t>(node)].left = new_left;
          nodes[static_cast<size_t>(node)].right = new_right;
          nodes[static_cast<size_t>(node)].flip = false;
      }

      void split(int node, int count, int& left, int& right) {
          if (node == 0) { left = right = 0; return; }
          const int copy = clone(node);
          push_down(copy);
          const int left_size = nodes[static_cast<size_t>(nodes[static_cast<size_t>(copy)].left)].size;
          if (left_size + 1 <= count) {
              int sub_left, sub_right;
              split(nodes[static_cast<size_t>(copy)].right, count - left_size - 1, sub_left, sub_right);
              nodes[static_cast<size_t>(copy)].right = sub_left;
              pull(copy);
              left = copy;
              right = sub_right;
          } else {
              int sub_left, sub_right;
              split(nodes[static_cast<size_t>(copy)].left, count, sub_left, sub_right);
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
              push_down(copy);
              const int merged = merge(nodes[static_cast<size_t>(copy)].right, right);
              nodes[static_cast<size_t>(copy)].right = merged;
              pull(copy);
              return copy;
          }
          const int copy = clone(right);
          push_down(copy);
          const int merged = merge(left, nodes[static_cast<size_t>(copy)].left);
          nodes[static_cast<size_t>(copy)].left = merged;
          pull(copy);
          return copy;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      PersistentTreap treap;
      vector<int> root(static_cast<size_t>(n) + 1, 0);
      long long last_answer = 0;
      for (int i = 1; i <= n; ++i) {
          long long version, op;
          cin >> version >> op;
          version ^= last_answer;
          const int base = root[static_cast<size_t>(version)];
          if (op == 1) {
              long long p, x;
              cin >> p >> x;
              p ^= last_answer;
              x ^= last_answer;
              int a, b;
              treap.split(base, static_cast<int>(p), a, b);
              root[static_cast<size_t>(i)] = treap.merge(treap.merge(a, treap.create(x)), b);
          } else if (op == 2) {
              long long p;
              cin >> p;
              p ^= last_answer;
              int a, b, c;
              treap.split(base, static_cast<int>(p), a, c);
              treap.split(a, static_cast<int>(p) - 1, a, b);
              root[static_cast<size_t>(i)] = treap.merge(a, c);
              (void)b;
          } else if (op == 3) {
              long long l, r;
              cin >> l >> r;
              l ^= last_answer;
              r ^= last_answer;
              int a, b, c;
              treap.split(base, static_cast<int>(r), a, c);
              treap.split(a, static_cast<int>(l) - 1, a, b);
              if (b != 0) {
                  b = treap.clone(b);
                  treap.nodes[static_cast<size_t>(b)].flip = !treap.nodes[static_cast<size_t>(b)].flip;
              }
              root[static_cast<size_t>(i)] = treap.merge(treap.merge(a, b), c);
          } else {
              long long l, r;
              cin >> l >> r;
              l ^= last_answer;
              r ^= last_answer;
              int a, b, c;
              treap.split(base, static_cast<int>(r), a, c);
              treap.split(a, static_cast<int>(l) - 1, a, b);
              last_answer = treap.nodes[static_cast<size_t>(b)].sum;
              cout << last_answer << '\n';
              root[static_cast<size_t>(i)] = base;  // 查詢不改變序列內容
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5055
external_platform: 洛谷
external_problem_id: P5055
external_title: '【模板】可持久化文藝平衡樹'
external_relation: original
source_book_pages: [179, 196]
source_pdf_pages: [197, 214]
review_status: verified
---

本題是可持久化資料結構的綜合考。記住那句話：任何要修改子節點的時刻，先問它是不是共用的。
