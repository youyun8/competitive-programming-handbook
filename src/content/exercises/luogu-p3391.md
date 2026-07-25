---
id: luogu-p3391
volume: upper
source_file: upper-volume
title: 洛谷 P3391 文藝平衡樹：區間翻轉
chapter: 4
section: '4.14'
kind: external-oj
difficulty: 4
topics: ['FHQ Treap', '區間翻轉', '懶標記', '序列維護']
prerequisites: ['fhq-treap']
statement: |-
  給定序列 1..n 與 m 次操作，每次把某個區間翻轉，輸出最終的序列。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'n 與 m 可達 10^5，不能每次真的翻轉陣列'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；接下來 m 行每行兩個整數 l 與 r，表示翻轉區間 [l, r]。'
output_format: '一行 n 個整數，表示所有操作結束後的序列。'
samples:
  - input: |
      5 3
      1 3
      1 3
      1 4
    output: |
      4 3 2 1 5
    explanation: |-
      前兩次翻轉互相抵消，只剩最後一次把 [1,4] 翻轉，得到 4 3 2 1 5。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    把 FHQ Treap 的切分依據從「值」換成「**子樹大小**」，它就從有序集合變成一個可以任意分割、拼接的序列——中序遍歷就是序列本身，樹裡不再需要有序性。
  - |-
    翻轉 [l, r] 的做法：split 出前 l−1 個、中間 r−l+1 個、其餘三段，對中間那段打上翻轉標記，再 merge 回去。三次 split/merge，O(log n)。
  - |-
    翻轉標記怎麼作用？翻轉一整棵子樹**等價於交換它的左右子**並把標記取反。想清楚為什麼：中序是「左-根-右」，交換左右子後變成「右-根-左」，正是反序。
  - |-
    任何會往下看子節點的操作（split、merge、最後輸出）在遞迴之前都必須先 push_down，否則會讀到尚未翻轉的舊結構。這是這題唯一但致命的坑。
  - |-
    標記是可疊加的：翻轉兩次等於沒翻，所以下推時用布林取反而不是賦值。範例中前兩次操作互相抵消，正好示範了這一點。
solution_outline: |-
  用 FHQ Treap 表示序列，split 依子樹大小切分。翻轉區間時切成三段、對中段套用翻轉標記再合併。標記的語意是「交換左右子」，任何遞迴向下的操作都先 push_down。最後中序遍歷輸出整個序列。
proof_or_invariant: |-
  不變量是「中序遍歷恆為當前序列，且每個節點的 flip 標記表示其子樹尚未實際套用的一次翻轉」。因為翻轉等價於交換左右子，套用標記後中序自然反轉；標記可疊加且為對合（翻兩次還原），故用布林取反即可正確合成。
complexity:
  time: '單次操作期望 O(log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // 文藝平衡樹：把 FHQ Treap 的切分依據從「值」換成「子樹大小」，
  // 它就從一棵有序集合變成一個可以任意分割、拼接的**序列**。
  struct Treap {
      struct Node {
          int left = 0, right = 0;
          int value = 0;
          unsigned long priority = 0;
          int size = 0;
          bool flip = false;  // 翻轉懶標記
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

      // TODO 1：套用翻轉。翻轉一整棵子樹，等價於**交換它的左右子**並把標記取反。
      //   想清楚為什麼：中序遍歷左-根-右，交換左右子後就變成右-根-左，正是反序。
      void apply_flip(int node) { (void)node; }

      // TODO 2：下推標記。任何會「看到子節點」的操作（split、merge、輸出）
      //   在往下走之前都必須先 push_down，否則會讀到未翻轉的舊結構。
      void push_down(int node) { (void)node; }

      // TODO 3：依大小切分——left 子樹恰好含前 count 個元素。
      //   與依值切分的差別只在比較的對象換成「左子樹大小 + 1」。
      void split(int node, int count, int& left, int& right) {
          (void)node;
          (void)count;
          left = right = 0;
      }

      int merge(int left, int right) {
          (void)right;
          return left;
      }

      // TODO 4：翻轉 [l, r]。切成三段（前 l−1 個、中間 r−l+1 個、其餘），
      //   對中間那段打上翻轉標記，再 merge 回去。
      void reverse(int l, int r) {
          (void)l;
          (void)r;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      Treap treap;
      (void)treap;
      // 樸素替代：直接對 vector 翻轉，正確但單次是 O(n)。
      vector<int> sequence(static_cast<size_t>(n));
      iota(sequence.begin(), sequence.end(), 1);
      for (int i = 0; i < m; ++i) {
          int l, r;
          cin >> l >> r;
          reverse(sequence.begin() + (l - 1), sequence.begin() + r);
      }
      for (size_t i = 0; i < sequence.size(); ++i) {
          cout << sequence[i] << " \n"[i + 1 == sequence.size()];
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 文藝平衡樹：FHQ Treap 依「子樹大小」切分（而不是依值），
  // 就能表示一個序列。區間翻轉靠一個布林懶標記：翻轉整棵子樹等於交換左右子。
  struct Treap {
      struct Node {
          int left = 0, right = 0;
          int value = 0;
          unsigned long priority = 0;
          int size = 0;
          bool flip = false;
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

      void apply_flip(int node) {
          if (node == 0) { return; }
          swap(nodes[static_cast<size_t>(node)].left, nodes[static_cast<size_t>(node)].right);
          nodes[static_cast<size_t>(node)].flip = !nodes[static_cast<size_t>(node)].flip;
      }

      void push_down(int node) {
          if (!nodes[static_cast<size_t>(node)].flip) { return; }
          apply_flip(nodes[static_cast<size_t>(node)].left);
          apply_flip(nodes[static_cast<size_t>(node)].right);
          nodes[static_cast<size_t>(node)].flip = false;
      }

      // 依大小切分：left 子樹恰好含前 count 個元素。
      void split(int node, int count, int& left, int& right) {
          if (node == 0) { left = right = 0; return; }
          push_down(node);
          const int left_size = nodes[static_cast<size_t>(nodes[static_cast<size_t>(node)].left)].size;
          if (left_size + 1 <= count) {
              left = node;
              split(nodes[static_cast<size_t>(node)].right, count - left_size - 1,
                    nodes[static_cast<size_t>(node)].right, right);
          } else {
              right = node;
              split(nodes[static_cast<size_t>(node)].left, count, left,
                    nodes[static_cast<size_t>(node)].left);
          }
          pull(node);
      }

      int merge(int left, int right) {
          if (left == 0 || right == 0) { return left | right; }
          if (nodes[static_cast<size_t>(left)].priority < nodes[static_cast<size_t>(right)].priority) {
              push_down(left);
              nodes[static_cast<size_t>(left)].right = merge(nodes[static_cast<size_t>(left)].right, right);
              pull(left);
              return left;
          }
          push_down(right);
          nodes[static_cast<size_t>(right)].left = merge(left, nodes[static_cast<size_t>(right)].left);
          pull(right);
          return right;
      }

      void reverse(int l, int r) {
          int a, b, c;
          split(root, r, a, c);
          split(a, l - 1, a, b);
          apply_flip(b);
          root = merge(merge(a, b), c);
      }

      void collect(int node, string& out) {
          if (node == 0) { return; }
          push_down(node);
          collect(nodes[static_cast<size_t>(node)].left, out);
          out += to_string(nodes[static_cast<size_t>(node)].value);
          out += ' ';
          collect(nodes[static_cast<size_t>(node)].right, out);
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      Treap treap;
      for (int i = 1; i <= n; ++i) { treap.root = treap.merge(treap.root, treap.create(i)); }
      for (int i = 0; i < m; ++i) {
          int l, r;
          cin >> l >> r;
          treap.reverse(l, r);
      }
      string out;
      treap.collect(treap.root, out);
      if (!out.empty()) { out.back() = '\n'; }
      cout << out;
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3391
external_platform: 洛谷
external_problem_id: P3391
external_title: '【模板】文藝平衡樹'
external_relation: original
source_book_pages: [341, 362]
source_pdf_pages: [359, 380]
review_status: verified
---

把平衡樹當序列用，是 FHQ Treap 最有價值的用法。split 依大小、翻轉即交換左右子，這兩句話就是全部。
