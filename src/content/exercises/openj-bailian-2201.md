---
id: openj-bailian-2201
volume: upper
source_file: upper-volume
title: OpenJudge 百練 2201 Cartesian Tree：輸出父子關係
chapter: 4
section: '4.15'
kind: external-oj
difficulty: 3
topics: [cartesian-tree, monotonic-stack, sorting]
prerequisites: [cartesian-tree]
statement: 給定 n 個節點，每個節點有互異的主鍵 k 與互異的輔助鍵 a。建出對 k 滿足二元搜尋樹、對 a 滿足小根堆的笛卡兒樹；節點編號沿用輸入順序，輸出每點的父、左子與右子編號。
constraints: ['1 <= n <= 50000', '|k_i|, |a_i| <= 30000', '主鍵彼此互異，輔助鍵也彼此互異']
input_format: 第一行 n；接下來 n 行各有 k_i、a_i。
output_format: 第一行輸出 YES；接著依原編號輸出每點的 `parent left right`，不存在者為 0。
samples:
  - input: |
      7
      5 4
      2 2
      3 9
      0 5
      1 3
      6 6
      4 11
    output: |
      YES
      2 3 6
      0 5 1
      1 0 7
      5 0 0
      2 4 0
      1 0 0
      3 0 0
    explanation: 輔助鍵最小的原節點 2 為根；按主鍵中序仍是 4、5、2、3、7、1、6，並符合每個父節點輔助鍵較小。
core_knowledge: [主鍵排序固定中序, 小根笛卡兒樹, 原編號映射]
judgment: 小根堆條件是父節點 a 較小；輸出順序是原輸入編號，不是排序後位置。題設鍵值互異時一定存在唯一解。
hints:
  - 先按 k 排序；任何合法 BST 的中序遍歷都必須是這個順序。
  - 在固定中序上要求 a 為小根堆，就是建立小根笛卡兒樹。
  - 用 a 遞增的單調棧維護右鏈；每次改左右子時同步填入原編號的 parent。
solution_outline: 保存原編號並依主鍵排序；掃描排序序列，以單調棧線性建立小根笛卡兒樹，同步記錄左右子及父節點；最後按原編號輸出。
proof_or_invariant: 棧由底到頂是目前樹的右鏈且 a 遞增。新點彈出的節點形成其左子樹，剩餘棧頂是最近的較小 a 祖先。此操作保持排序後中序不變並滿足小根堆；互異鍵使樹唯一。
common_errors: [誤建大根堆, 依排序位置而非原編號輸出, 改接左子後漏改 parent, 認為合法輸入可能輸出 NO]
complexity: { time: 'O(n log n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      int n;
      cin >> n;
      vector<int> key(static_cast<size_t>(n) + 1U);
      vector<int> priority(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) cin >> key[static_cast<size_t>(i)] >> priority[static_cast<size_t>(i)];
      // TODO：依 key 排序並用單調棧建小根笛卡兒樹。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <numeric>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<int> key(static_cast<size_t>(n) + 1U), auxiliary(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) cin >> key[static_cast<size_t>(i)] >> auxiliary[static_cast<size_t>(i)];
      vector<int> order(static_cast<size_t>(n));
      iota(order.begin(), order.end(), 1);
      sort(order.begin(), order.end(), [&](int x, int y) {
          return key[static_cast<size_t>(x)] < key[static_cast<size_t>(y)];
      });
      vector<int> parent(static_cast<size_t>(n) + 1U), left(static_cast<size_t>(n) + 1U);
      vector<int> right(static_cast<size_t>(n) + 1U), stack_nodes;
      for (int node : order) {
          int last = 0;
          while (!stack_nodes.empty() &&
                 auxiliary[static_cast<size_t>(stack_nodes.back())] > auxiliary[static_cast<size_t>(node)]) {
              last = stack_nodes.back();
              stack_nodes.pop_back();
          }
          left[static_cast<size_t>(node)] = last;
          if (last != 0) parent[static_cast<size_t>(last)] = node;
          if (!stack_nodes.empty()) {
              right[static_cast<size_t>(stack_nodes.back())] = node;
              parent[static_cast<size_t>(node)] = stack_nodes.back();
          }
          stack_nodes.push_back(node);
      }
      cout << "YES\n";
      for (int node = 1; node <= n; ++node)
          cout << parent[static_cast<size_t>(node)] << ' ' << left[static_cast<size_t>(node)] << ' '
               << right[static_cast<size_t>(node)] << '\n';
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/2201/
external_platform: OpenJudge 百練
external_problem_id: '2201'
external_title: Cartesian Tree
external_relation: original
source_book_pages: [363, 376]
source_pdf_pages: [381, 394]
review_status: verified
---

主鍵排序與輔助鍵堆序共同唯一決定樹；輸出時最容易錯的是忘記映回原輸入編號。
