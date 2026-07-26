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
  給定長度為 n 的排列 p。建出唯一的笛卡兒樹：節點編號為排列下標，中序遍歷依序為 1..n，且每個父節點的 p 值都小於其子節點。令 l_i、r_i 分別為節點 i 的左右子編號，缺少子節點時記為 0；輸出所有 i×(l_i+1) 的位元 XOR，以及所有 i×(r_i+1) 的位元 XOR。
constraints:
  - '1 <= n <= 10000000'
  - 'p 是 1..n 的排列，因此所有權值互異'
input_format: '第一行一個整數 n；第二行 n 個整數表示排列。'
output_format: '一行兩個整數，分別是 XOR_{i=1..n} i×(l_i+1) 與 XOR_{i=1..n} i×(r_i+1)。'
samples:
  - input: |
      5
      3 1 4 2 5
    output: |
      19 21
    explanation: |-
      最小值 1 位於位置 2，所以節點 2 是根；其左子為 1、右子為 4，節點 4 的左右子分別為 3、5。故 l=(0,1,0,3,0)、r=(0,4,0,5,0)，代入兩個 XOR 式得到 19 與 21。
core_knowledge: ['笛卡兒樹同時滿足索引二元搜尋樹與權值小根堆', '單調棧維護最右鏈', '每個節點至多進棧與出棧一次']
judgment: '節點編號是元素位置而非排列值；本題建的是小根笛卡兒樹；最後聚合使用位元 XOR 而非加總，且空子節點仍要先加一。'
hints:
  - |-
    對一個區間而言，最小值必為根，左右區間分別形成左右子樹；直接遞迴找最小值雖能說明唯一性，最壞卻會退化為平方時間。
  - |-
    從左到右加入節點，維護目前樹從根走右子可到達的整條右鏈；依小根堆性質，鏈上的 p 值嚴格遞增，可存於單調棧。
  - |-
    加入 i 時彈出所有 p 值大於 p_i 的節點：最後彈出的節點成為 i 的左子；若棧仍非空，i 成為新棧頂的右子。每個節點只進出棧一次。
solution_outline: |-
  用一個棧維護當前的右鏈（權值遞增）。逐一加入元素：彈出所有權值更大的節點，最後彈出者成為新節點的左子；若棧非空則新節點成為棧頂的右子；把新節點推入棧。掃完後依公式計算兩個 XOR 值。
proof_or_invariant: |-
  不變量是「棧中由底到頂恰為當前笛卡兒樹的右鏈，且權值遞增」。加入新元素時，所有權值大於它的節點都不可能再有新的右子，因此可以永久彈出；被彈出的那一段構成新節點的左子樹，恰好滿足中序在左、權值更大兩個條件。
common_errors:
  [
    '把第一個而非最後一個彈出節點設為新節點左子',
    '彈棧後忘記把新節點設為剩餘棧頂的右子',
    '把最終 XOR 誤寫成算術加總或以 int 計算乘積'
  ]
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

      long long first_xor = 0;
      long long second_xor = 0;
      for (int i = 1; i <= n; ++i) {
          first_xor ^= static_cast<long long>(i) * (left_child[static_cast<size_t>(i)] + 1);
          second_xor ^= static_cast<long long>(i) * (right_child[static_cast<size_t>(i)] + 1);
      }
      cout << first_xor << ' ' << second_xor << '\n';
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

      long long first_xor = 0;
      long long second_xor = 0;
      for (int i = 1; i <= n; ++i) {
          first_xor ^= static_cast<long long>(i) * (left_child[static_cast<size_t>(i)] + 1);
          second_xor ^= static_cast<long long>(i) * (right_child[static_cast<size_t>(i)] + 1);
      }
      cout << first_xor << ' ' << second_xor << '\n';
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
