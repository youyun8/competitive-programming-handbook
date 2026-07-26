---
id: luogu-p1305
volume: upper
source_file: upper-volume
title: 洛谷 P1305 新二叉樹
chapter: 1
section: '1.4'
kind: external-oj
difficulty: 1
topics: [binary-tree, preorder, tree-representation]
prerequisites: [recursion, preorder]
statement: 給定一棵以小寫字母標示節點的二元樹；每筆關係列出父節點、左孩子、右孩子，星號代表空節點。請輸出整棵樹的先序遍歷。
constraints:
  - 1 <= n <= 26
  - 第一筆關係的父節點保證是根
  - 空孩子以星號 * 表示
input_format: 第一行為節點數 n；接著 n 行各有三個字元，依序為父節點、左孩子與右孩子。
output_format: 輸出二元樹的先序遍歷字串。
samples:
  - input: |
      6
      abc
      bdi
      cj*
      d**
      i**
      j**
    output: 'abdicj'
    explanation: 從根 a 先走左子樹 b（依序 d、i），再走右子樹 c（接著 j）。
core_knowledge: [鄰接關係建樹, 先序遍歷, 空節點標記]
judgment: 輸出節點字母且不輸出星號；每個真實節點恰出現一次。
hints:
  - 先把每個父字母映射到它的左右孩子，不必依輸入行順序遍歷。
  - 星號不是節點，可把它當作遞迴停止條件。
  - 先序遍歷順序是目前節點、左子樹、右子樹；根就是第一筆關係的第一個字元。
solution_outline: 用兩個 26 格陣列保存各字母的左右孩子，記住第一筆的父字母。從根遞迴：遇星號返回，否則輸出自身，再遞迴左右孩子。
proof_or_invariant: 對任一節點，遞迴函式依序輸出該節點及左右子樹的先序；空節點不輸出。由子樹高度歸納，從根呼叫所得恰是整棵樹先序。
common_errors:
  - 誤以為字母關係一定按遍歷順序給出
  - 輸出星號
  - 把第一個孩子誤當根
complexity:
  time: O(n)
  space: O(n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static void emit_preorder(char node, const array<char, 26>& left_child,
                            const array<char, 26>& right_child) {
      if (node == '*') { return; }
      // TODO：輸出目前節點，再走左、右孩子。
      (void)left_child;
      (void)right_child;
  }

  int main() {
      int n;
      cin >> n;
      array<char, 26> left_child{}, right_child{};
      char root = '*';
      for (int i = 0; i < n; ++i) {
          char parent, left, right;
          cin >> parent >> left >> right;
          if (i == 0) { root = parent; }
          left_child[parent - 'a'] = left;
          right_child[parent - 'a'] = right;
      }
      emit_preorder(root, left_child, right_child);
      cout << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static void emit_preorder(char node, const array<char, 26>& left_child,
                            const array<char, 26>& right_child) {
      if (node == '*') { return; }
      cout << node;
      emit_preorder(left_child[node - 'a'], left_child, right_child);
      emit_preorder(right_child[node - 'a'], left_child, right_child);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      array<char, 26> left_child{}, right_child{};
      char root = '*';
      for (int i = 0; i < n; ++i) {
          char parent, left, right;
          cin >> parent >> left >> right;
          if (i == 0) { root = parent; }
          left_child[parent - 'a'] = left;
          right_child[parent - 'a'] = right;
      }
      emit_preorder(root, left_child, right_child);
      cout << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1305
external_platform: 洛谷
external_problem_id: P1305
external_title: 新二叉樹
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

輸入描述的是邊，不是遍歷結果；先完成映射後，真正的遍歷只有一趟。
