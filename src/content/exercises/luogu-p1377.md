---
id: luogu-p1377
volume: upper
source_file: upper-volume
title: 洛谷 P1377 樹的序：插入時間笛卡兒樹
chapter: 4
section: '4.15'
kind: external-oj
difficulty: 3
topics: [cartesian-tree, binary-search-tree, preorder]
prerequisites: [cartesian-tree, binary-search-tree]
statement: 給定 1..n 的一個排列，依序插入空二元搜尋樹。求所有能生成相同 BST 的插入序列中，字典序最小的一個。
constraints: ['1 <= n <= 100000', '輸入序列是 1..n 的排列']
input_format: 第一行 n；第二行 n 個鍵值，表示原插入順序。
output_format: 一行 n 個整數，為生成相同 BST 的字典序最小插入序列。
samples:
  - input: |
      4
      1 3 4 2
    output: |
      1 3 2 4
    explanation: 原序列建立的樹以 1 為根，3 是其右子，3 的左右子分別是 2、4；先序 1、3、2、4 是可行序列中最小者。
core_knowledge: [鍵值排序固定 BST 中序, 插入時間形成小根堆, 字典序最小生成序列是先序]
judgment: 需要保持樹形而非只保持中序；節點必須在其所有後代之前插入。
hints:
  - 對每個鍵值記下它在原序列中的插入時間；BST 的中序則固定為 1..n。
  - 父節點必比後代早插入，因此在鍵值中序上建立「插入時間小根堆」的笛卡兒樹。
  - 根必須先出現；左右子樹都可選時，左子樹所有鍵都較小，所以字典序最小方案是根、左、右的先序。
solution_outline: 令 position[value] 為原插入時間。按 value=1..n 掃描，以 position 遞增單調棧建立小根笛卡兒樹；再做迭代先序遍歷輸出鍵值。
proof_or_invariant: 固定中序與插入時間小根堆唯一決定原 BST，因每個區間最早插入者必為該子樹根。任何生成序列都須讓根先於後代；左右子樹根皆可選時左根鍵值較小，遞迴先完成字典序較小的左子樹，故先序全域最小。
common_errors: [直接輸出 BST 中序, 把原鍵值而非插入位置當堆權, 遞迴遍歷退化鏈爆棧]
complexity: { time: 'O(n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      vector<int> position(static_cast<size_t>(n) + 1U);
      for (int time = 1; time <= n; ++time) {
          int value;
          cin >> value;
          position[static_cast<size_t>(value)] = time;
      }
      // TODO：按 value 建 position 小根笛卡兒樹並輸出先序。
      return 0;
  }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<int> position(static_cast<size_t>(n) + 1U);
      for (int time = 1; time <= n; ++time) {
          int value;
          cin >> value;
          position[static_cast<size_t>(value)] = time;
      }
      vector<int> left(static_cast<size_t>(n) + 1U), right(static_cast<size_t>(n) + 1U), stack_nodes;
      for (int value = 1; value <= n; ++value) {
          int last = 0;
          while (!stack_nodes.empty() &&
                 position[static_cast<size_t>(stack_nodes.back())] > position[static_cast<size_t>(value)]) {
              last = stack_nodes.back();
              stack_nodes.pop_back();
          }
          left[static_cast<size_t>(value)] = last;
          if (!stack_nodes.empty()) right[static_cast<size_t>(stack_nodes.back())] = value;
          stack_nodes.push_back(value);
      }
      vector<int> traversal{stack_nodes.front()};
      bool first = true;
      while (!traversal.empty()) {
          const int node = traversal.back();
          traversal.pop_back();
          if (!first) cout << ' ';
          first = false;
          cout << node;
          if (right[static_cast<size_t>(node)] != 0) traversal.push_back(right[static_cast<size_t>(node)]);
          if (left[static_cast<size_t>(node)] != 0) traversal.push_back(left[static_cast<size_t>(node)]);
      }
      cout << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1377
external_platform: 洛谷
external_problem_id: P1377
external_title: '[TJOI2011] 樹的序'
external_relation: original
source_book_pages: [363, 376]
source_pdf_pages: [381, 394]
review_status: verified
---

把「何時插入」當成笛卡兒樹優先度後，原 BST 可以線性重建；先序恰是字典序最小的合法拓撲序。
