---
id: luogu-p1030
volume: upper
source_file: upper-volume
title: 洛谷 P1030 求先序排列
chapter: 1
section: '1.4'
kind: external-oj
difficulty: 1
topics: [binary-tree, traversal, recursion]
prerequisites: [inorder, postorder, preorder]
statement: 給定同一棵二元樹的中序與後序遍歷；所有節點以互不相同的大寫字母表示。請還原並輸出先序遍歷。
constraints:
  - 節點數不超過 8
  - 節點字母互不相同
  - 兩個輸入字串分別是合法且對應同一棵樹的中序、後序遍歷
input_format: 兩行大寫字母字串；第一行為中序，第二行為後序。
output_format: 一行，輸出先序遍歷字串。
samples:
  - input: |
      BADC
      BDCA
    output: 'ABCD'
    explanation: 後序末字元 A 是根；中序在 A 左側為 B、右側為 DC，再對兩側套用相同分割。
core_knowledge: [遍歷序列重建, 分治, 子樹大小對應]
judgment: 只輸出先序字串；節點必須各出現一次。
hints:
  - 後序遍歷的一段中，最後一個字元一定是該子樹的根。
  - 根在中序中的位置會把節點分成左、右子樹，左段長度也決定後序中的切點。
  - 先輸出根，再以對應的中序與後序區間遞迴左子樹、右子樹。
solution_outline: 維護兩種遍歷的半開區間。取後序末端為根，在中序找到位置並算左子樹大小；依此切出兩組區間，以根、左、右順序輸出。
proof_or_invariant: >-
  每次呼叫的兩個區間恰含同一棵子樹。後序末項唯一決定根，中序唯一字母使左右節點集合與大小唯一；
  切出的後序前段和後段因此分別對應左右子樹。遞迴輸出根、左、右，依子樹大小歸納即為先序。
common_errors:
  - 用後序第一個字元當根
  - 右子樹的後序區間仍包含根
  - 中序與後序切出的左子樹長度不一致
complexity:
  time: O(n)，先建立字元在中序的位置
  space: O(n) 遞迴深度
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static void emit_preorder(const string& inorder, const string& postorder,
                            const array<int, 256>& position,
                            int in_left, int in_right, int post_left, int post_right) {
      if (in_left == in_right) { return; }
      // TODO：輸出根，計算左子樹大小，遞迴左右兩段。
      (void)inorder;
      (void)postorder;
      (void)position;
      (void)post_left;
      (void)post_right;
  }

  int main() {
      string inorder, postorder;
      cin >> inorder >> postorder;
      array<int, 256> position{};
      for (int i = 0; i < static_cast<int>(inorder.size()); ++i) { position[inorder[i]] = i; }
      emit_preorder(inorder, postorder, position, 0, static_cast<int>(inorder.size()),
                    0, static_cast<int>(postorder.size()));
      cout << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static void emit_preorder(const string& inorder, const string& postorder,
                            const array<int, 256>& position,
                            int in_left, int in_right, int post_left, int post_right) {
      if (in_left == in_right) { return; }
      const char root = postorder[post_right - 1];
      cout << root;
      const int root_position = position[static_cast<unsigned char>(root)];
      const int left_size = root_position - in_left;
      emit_preorder(inorder, postorder, position, in_left, root_position,
                    post_left, post_left + left_size);
      emit_preorder(inorder, postorder, position, root_position + 1, in_right,
                    post_left + left_size, post_right - 1);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string inorder, postorder;
      cin >> inorder >> postorder;
      array<int, 256> position{};
      for (int i = 0; i < static_cast<int>(inorder.size()); ++i) {
          position[static_cast<unsigned char>(inorder[i])] = i;
      }
      emit_preorder(inorder, postorder, position, 0, static_cast<int>(inorder.size()),
                    0, static_cast<int>(postorder.size()));
      cout << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1030
external_platform: 洛谷
external_problem_id: P1030
external_title: '[NOIP 2001 普及組] 求先序排列'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

真正需要維護的是兩套遍歷中「同一棵子樹」的區間對應，而不是先建出指標樹。
