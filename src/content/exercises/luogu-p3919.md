---
id: luogu-p3919
volume: upper
source_file: upper-volume
title: 洛谷 P3919 可持久化陣列：路徑複製
chapter: 4
section: '4.4'
kind: external-oj
difficulty: 3
topics: ['可持久化', '線段樹', '路徑複製', '版本管理']
prerequisites: ['persistent-segment-tree']
core_knowledge:
  - 路徑複製
  - 版本根管理
  - 可持久化陣列
judgment: 每次操作只改一個位置，而新舊版本的其他位置完全相同；以線段樹路徑複製共享未變子樹，可避免為每個版本複製整個陣列。
statement: |-
  維護一個陣列的所有歷史版本，支援「在某版本上修改一個位置」與「查詢某版本的某位置」，每次操作都產生一個新版本。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '1 <= n, m <= 1000000'
  - '每個初始值與修改值可用 32 位元有號整數表示'
  - '操作引用的版本編號介於 0 與 i-1；查詢操作也產生版本 i'
input_format: '第一行兩個整數 n 與 m；第二行 n 個初始值；接下來 m 行，`v 1 loc value` 表示在版本 v 上把 loc 改成 value，`v 2 loc` 表示查詢版本 v 的 loc。'
output_format: '對每個查詢輸出一行。'
samples:
  - input: |
      5 5
      59 46 14 87 41
      0 1 2 100
      1 1 3 200
      2 2 2
      0 2 4
      3 2 5
    output: |
      100
      87
      41
    explanation: |-
      版本 2 是「在版本 1 的基礎上把位置 3 改成 200」，所以查它的位置 2 得到版本 1 改過的 100；版本 0 是原始陣列，位置 4 仍是 87。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    每個版本存一份完整陣列是 O(nm) 空間，n、m 到 10^6 完全放不下。可持久化的核心觀察是：一次單點修改隻影響**根到該葉的那條路徑**，其餘子樹完全沒變。
  - |-
    所以用線段樹存陣列，修改時只新建那條路徑上的 O(log n) 個節點，其他子節點指標直接**沿用舊版本**。這就是「路徑複製」，總空間 O((n + m) log n)。
  - |-
    每個版本只需記住它的根節點編號。查詢就是從指定版本的根往下走到葉。
solution_outline: |-
  用線段樹存陣列，葉子放元素值。修改時沿路新建節點（其餘子樹沿用舊指標），回傳新根；查詢時從指定版本的根走到葉。每個版本只保存根編號，查詢型操作直接複用舊根。
proof_or_invariant: |-
  不變量是「每個版本的根所代表的整棵樹，語意上等於該版本的完整陣列」。路徑複製保證舊版本的任何節點都不被修改，因此歷史永遠可讀；新版本與舊版本共享 O(n) 個子樹，只有 O(log n) 個節點是新的。
complexity:
  time: '每次操作 O(log n)'
  space: 'O((n + m) log n)'
common_errors:
  - 修改既有節點而破壞舊版本
  - 查詢操作後未讓新版本根沿用被查詢版本
  - 遞迴新增節點時保留 vector 元素參考，擴容後形成懸空參考
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }

      // TODO：改成可持久化線段樹。
      //   1. build 出版本 0 的樹，葉子存陣列值。
      //   2. 修改時**沿路複製**：新建根到該葉的 O(log n) 個節點，
      //      其餘子樹直接沿用舊版本的指標——這就是「共享」。
      //   3. 查詢就是在指定版本的樹上往下走到葉。
      //   注意遞迴裡若要修改 nodes[x].left，不要把它以參考傳進遞迴：
      //   遞迴中的 push_back 會讓 vector 重新配置，那個參考就懸空了。
      //   先取出區域變數、遞迴、再寫回。
      // 下面是每個版本都存一份完整陣列的樸素版本，正確但空間是 O(nm)。
      vector<vector<int>> versions{a};
      for (int i = 1; i <= m; ++i) {
          int version, op, position;
          cin >> version >> op >> position;
          vector<int> next = versions[static_cast<size_t>(version)];
          if (op == 1) {
              int value;
              cin >> value;
              next[static_cast<size_t>(position)] = value;
          } else {
              cout << next[static_cast<size_t>(position)] << '\n';
          }
          versions.push_back(next);
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 可持久化陣列：用線段樹存陣列，每次修改只新建「根到葉」這條路徑上的 O(log n)
  // 個節點，其餘子樹直接與舊版本共用指標。
  struct PersistentArray {
      struct Node {
          int left = 0, right = 0, value = 0;
      };
      vector<Node> nodes{Node{}};

      int build(const vector<int>& a, int l, int r) {
          const int id = static_cast<int>(nodes.size());
          nodes.push_back(Node{});
          if (l == r) {
              nodes[static_cast<size_t>(id)].value = a[static_cast<size_t>(l)];
              return id;
          }
          const int mid = (l + r) / 2;
          const int left_child = build(a, l, mid);
          const int right_child = build(a, mid + 1, r);
          nodes[static_cast<size_t>(id)].left = left_child;
          nodes[static_cast<size_t>(id)].right = right_child;
          return id;
      }

      int assign(int previous, int l, int r, int position, int value) {
          const int id = static_cast<int>(nodes.size());
          nodes.push_back(nodes[static_cast<size_t>(previous)]);  // 先複製，再改動這條路徑
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

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      PersistentArray tree;
      vector<int> root(static_cast<size_t>(m) + 1);
      root[0] = tree.build(a, 1, n);
      for (int i = 1; i <= m; ++i) {
          int version, op, position;
          cin >> version >> op >> position;
          if (op == 1) {
              int value;
              cin >> value;
              root[static_cast<size_t>(i)] =
                  tree.assign(root[static_cast<size_t>(version)], 1, n, position, value);
          } else {
              cout << tree.query(root[static_cast<size_t>(version)], 1, n, position) << '\n';
              // 查詢也會產生一個新版本，內容與被查詢的版本相同。
              root[static_cast<size_t>(i)] = root[static_cast<size_t>(version)];
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3919
external_platform: 洛谷
external_problem_id: P3919
external_title: '【模板】可持久化線段樹 1（可持久化陣列）'
external_relation: original
source_book_pages: [179, 196]
source_pdf_pages: [197, 214]
review_status: verified
---

可持久化的第一課。「只複製改動路徑、其餘共享」這個想法之後會不斷出現。
