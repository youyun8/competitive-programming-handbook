---
id: luogu-p1229
volume: upper
source_file: upper-volume
title: 洛谷 P1229 遍歷問題
chapter: 1
section: '1.4'
kind: external-oj
difficulty: 2
topics: [binary-tree, preorder, postorder, combinatorics]
prerequisites: [tree-traversal, multiplication-principle]
statement: >-
  已知一棵節點字母互異的二元樹之先序與後序遍歷。這兩種遍歷可能無法判定只有一個孩子時孩子位於左側或右側；
  請計算所有相容樹形能產生多少種不同的中序遍歷。
constraints:
  - 節點以互不相同的大寫字母表示，因此節點數至多 26
  - 兩個序列長度相同，且描述同一棵合法二元樹
input_format: 兩行字串，依序為先序遍歷與後序遍歷。
output_format: 輸出可能的中序遍歷數量。
samples:
  - input: |
      AB
      BA
    output: '2'
    explanation: 本站自製最小測資。B 可以是 A 的左孩子或右孩子，分別得到 BA 與 AB 兩種中序。
core_knowledge: [單子節點歧義, 遍歷相鄰關係, 乘法原理]
judgment: 只需輸出方案數，不需列舉中序字串；每個只有一個孩子的節點使答案獨立乘 2。
hints:
  - 有兩個孩子時，先序與後序可以區分兩棵子樹；真正的歧義來自只有一個孩子。
  - 若父節點 x 只有孩子 y，先序中會相鄰出現 xy，後序中會相鄰出現 yx。
  - 掃描先序的相鄰對，在後序中檢查反向相鄰對；找到 k 對後答案是 2^k。
solution_outline: 建立每個字母在後序中的位置。對先序每一組相鄰字母 x、y，若後序中 y 的下一個字母是 x，則 x 只有一棵子樹，答案乘 2。
proof_or_invariant: >-
  若 x 只有孩子子樹，y 為該子樹根，先序在 x 後立刻進入 y，後序則完成 y 的整棵子樹後立刻輸出 x，故出現反向相鄰；
  反之這種相鄰在合法且節點唯一的遍歷中表示 x 與 y 間沒有另一棵兄弟子樹。每個此類孩子可獨立選左或右，且兩種中序不同，故乘法原理給出 2^k。
common_errors:
  - 嘗試由先序與後序唯一重建左右方向
  - 只在後序搜尋字母順序，未要求兩字母相鄰
  - 掃描到字串末端後仍存取下一格
complexity:
  time: O(n)
  space: O(字母表大小)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      string preorder, postorder;
      cin >> preorder >> postorder;
      array<int, 256> post_position{};
      for (int i = 0; i < static_cast<int>(postorder.size()); ++i) {
          post_position[static_cast<unsigned char>(postorder[i])] = i;
      }
      long long answer = 1;
      // TODO：找出先序相鄰且在後序反向相鄰的父子對，每次讓答案乘 2。
      cout << answer << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string preorder, postorder;
      cin >> preorder >> postorder;
      array<int, 256> post_position{};
      for (int i = 0; i < static_cast<int>(postorder.size()); ++i) {
          post_position[static_cast<unsigned char>(postorder[i])] = i;
      }
      long long answer = 1;
      for (int i = 0; i + 1 < static_cast<int>(preorder.size()); ++i) {
          const int child_position =
              post_position[static_cast<unsigned char>(preorder[i + 1])];
          if (child_position + 1 < static_cast<int>(postorder.size()) &&
              postorder[child_position + 1] == preorder[i]) {
              answer *= 2;
          }
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1229
external_platform: 洛谷
external_problem_id: P1229
external_title: 遍歷問題
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

這不是重建題，而是辨認「先序與後序共同遺失了哪一項資訊」：單一孩子的左右方向。
