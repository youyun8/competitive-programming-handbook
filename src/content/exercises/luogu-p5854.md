---
id: luogu-p5854
volume: upper
source_file: upper-volume
title: 洛谷 P5854 笛卡兒樹：單調棧線性建樹
chapter: 4
section: '4.15'
kind: external-oj
difficulty: 3
topics: ['笛卡兒樹', '單調棧', '二元搜尋樹', '堆']
prerequisites: ['cartesian-tree', 'stack']
statement: |-
  給定一個排列，建出它的笛卡兒樹（對索引是二元搜尋樹、對權值是小根堆），輸出左右子節點編號的加權和。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'n 可達 10^7，必須是 O(n)'
  - '輸入是排列，權值兩兩不同'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行一個整數 n；第二行 n 個整數表示排列。'
output_format: '一行兩個整數，分別是 Σ i×(l_i+1) 與 Σ i×(r_i+1)，其中 l_i、r_i 是節點 i 的左右子（無子節點記為 0）。'
samples:
  - input: |
      5
      3 1 4 2 5
    output: |
      29 43
    explanation: |-
      權值最小的 1 在位置 2，成為根；左子是位置 1，右子是位置 4（權值 2），位置 4 底下再掛位置 3 與 5。左子陣列為 0 1 0 3 0、右子為 0 4 0 5 0，代入公式即得 29 與 43。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    笛卡兒樹的雙重定義：對**索引**是二元搜尋樹（中序遍歷回到原序列順序），對**權值**是小根堆（父節點權值小於子節點）。這兩個條件在權值互異時唯一確定一棵樹。
  - |-
    最直觀的做法是遞迴：找出區間最小值當根，左右兩段各自遞迴。但最壞是 O(n²)（序列已排序時退化成鏈）。
  - |-
    線性做法用單調棧。維護的是樹的**右鏈**——從根一路往右子走的那條路徑，權值沿路遞增。
  - |-
    加入新元素 i 時：把棧中所有權值大於 value[i] 的節點彈出，**最後一個被彈出的**成為 i 的左子（它們的整棵子樹都在 i 左邊、權值都比 i 大）；若棧還有元素，i 就成為棧頂的右子；最後把 i 推入棧。
  - |-
    每個元素進出棧各一次，所以總計 O(n)。n 到 10^7 時還要注意輸入輸出速度，`cin` 記得關同步或改手寫讀入。
solution_outline: |-
  用一個棧維護當前的右鏈（權值遞增）。逐一加入元素：彈出所有權值更大的節點，最後彈出者成為新節點的左子；若棧非空則新節點成為棧頂的右子；把新節點推入棧。掃完後依公式計算兩個加權和。
proof_or_invariant: |-
  不變量是「棧中由底到頂恰為當前笛卡兒樹的右鏈，且權值遞增」。加入新元素時，所有權值大於它的節點都不可能再有新的右子，因此可以永久彈出；被彈出的那一段構成新節點的左子樹，恰好滿足中序在左、權值更大兩個條件。
complexity:
  time: 'O(n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      vector<long long> value(static_cast<size_t>(n) + 1);
      vector<int> left_child(static_cast<size_t>(n) + 1, 0);
      vector<int> right_child(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) { cin >> value[static_cast<size_t>(i)]; }

      // TODO：用單調棧在 O(n) 內建出笛卡兒樹。
      //   笛卡兒樹的定義：對「索引」是二元搜尋樹（中序遍歷即原序列），
      //   對「權值」是小根堆。
      //   維護一條由棧表示的「右鏈」（根到最右節點的路徑），權值遞增。
      //   加入 i 時：把所有權值大於 value[i] 的節點彈出，
      //   **最後一個被彈出的**成為 i 的左子（它們整棵子樹都在 i 左邊且權值更大）；
      //   若棧還有元素，i 成為棧頂的右子；最後把 i 推入棧。
      //   每個元素進出棧各一次，總計 O(n)。
      vector<int> stack_nodes;
      (void)stack_nodes;

      long long first = 0;
      long long second = 0;
      for (int i = 1; i <= n; ++i) {
          first += static_cast<long long>(i) * (left_child[static_cast<size_t>(i)] + 1);
          second += static_cast<long long>(i) * (right_child[static_cast<size_t>(i)] + 1);
      }
      cout << first << ' ' << second << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 笛卡兒樹：對索引是二元搜尋樹、對權值是小根堆。
  // 用單調棧建構：維護一條「右鏈」，新元素把所有比它大的彈出，
  // 最後一個被彈出者成為它的左子，它接到當前棧頂的右子。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      vector<long long> value(static_cast<size_t>(n) + 1);
      vector<int> left_child(static_cast<size_t>(n) + 1, 0);
      vector<int> right_child(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) { cin >> value[static_cast<size_t>(i)]; }

      vector<int> stack_nodes;
      for (int i = 1; i <= n; ++i) {
          int last_popped = 0;
          while (!stack_nodes.empty() &&
                 value[static_cast<size_t>(stack_nodes.back())] > value[static_cast<size_t>(i)]) {
              last_popped = stack_nodes.back();
              stack_nodes.pop_back();
          }
          left_child[static_cast<size_t>(i)] = last_popped;
          if (!stack_nodes.empty()) { right_child[static_cast<size_t>(stack_nodes.back())] = i; }
          stack_nodes.push_back(i);
      }

      long long first = 0;
      long long second = 0;
      for (int i = 1; i <= n; ++i) {
          first += static_cast<long long>(i) * (left_child[static_cast<size_t>(i)] + 1);
          second += static_cast<long long>(i) * (right_child[static_cast<size_t>(i)] + 1);
      }
      cout << first << ' ' << second << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5854
external_platform: 洛谷
external_problem_id: P5854
external_title: '【模板】笛卡兒樹'
external_relation: original
source_book_pages: [363, 376]
source_pdf_pages: [381, 394]
review_status: verified
---

笛卡兒樹把「區間最小值」的結構顯式建出來，是 RMQ 轉 LCA、Treap、以及一類分治問題的橋樑。
