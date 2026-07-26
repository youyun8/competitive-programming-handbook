---
id: luogu-p2756
volume: lower
source_file: lower-volume
original_label: '洛谷 P2756'
title: '洛谷 P2756 飛行員配對方案'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 3
topics: ['二分圖最大匹配', '方案還原']
prerequisites: ['bipartite']
statement: |-
  在外籍與英籍飛行員的相容關係中求最大配對，並輸出一組方案。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      1 2
      1 2
      -1 -1
    output: |-
      1
      1 2
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['二分圖最大匹配', '方案還原']
judgment: |-
  只由 1..m 的外籍點向 m+1..n 的英籍點增廣。
hints:
  - '先辨識核心轉換：二分圖最大匹配、方案還原。'
  - '只由 1..m 的外籍點向 m+1..n 的英籍點增廣。'
  - '依「匈牙利演算法求最大匹配；右側 match 陣列直接還原配對。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  匈牙利演算法求最大匹配；右側 match 陣列直接還原配對。
proof_or_invariant: |-
  Berge 定理保證無增廣路時匹配最大；match 中每個右點至多對應一個左點，故輸出合法。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(nm)'
  space: 'O(n+m)'
cpp_skeleton: |-
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依卡片解法建立圖或狀態，完成增廣／動態規劃並輸出答案。
      return 0;
  }
cpp_solution: |-
  #if defined(__GNUC__)
  #pragma GCC diagnostic ignored "-Wconversion"
  #pragma GCC diagnostic ignored "-Wshadow"
  #pragma GCC diagnostic ignored "-Wunused-parameter"
  #pragma GCC diagnostic ignored "-Wunused-variable"
  #pragma GCC diagnostic ignored "-Wpedantic"
  #pragma GCC diagnostic ignored "-Wcomment"
  #pragma GCC diagnostic ignored "-Wsign-compare"
  #pragma GCC diagnostic ignored "-Wmisleading-indentation"
  #endif
  #include <bits/stdc++.h>
  using namespace std;

  static vector<vector<int>> graph;
  static vector<int> matched_left;
  static vector<char> visited;

  static bool augment(int left) {
      for (const int right : graph[static_cast<size_t>(left)]) {
          if (visited[static_cast<size_t>(right)]) continue;
          visited[static_cast<size_t>(right)] = 1;
          if (matched_left[static_cast<size_t>(right)] == 0 ||
              augment(matched_left[static_cast<size_t>(right)])) {
              matched_left[static_cast<size_t>(right)] = left;
              return true;
          }
      }
      return false;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int foreign_count, total_count;
      cin >> foreign_count >> total_count;
      graph.assign(static_cast<size_t>(foreign_count) + 1, {});
      while (true) {
          int left, right;
          cin >> left >> right;
          if (left == -1 && right == -1) break;
          graph[static_cast<size_t>(left)].push_back(right);
      }
      matched_left.assign(static_cast<size_t>(total_count) + 1, 0);
      int answer = 0;
      for (int left = 1; left <= foreign_count; ++left) {
          visited.assign(static_cast<size_t>(total_count) + 1, 0);
          if (augment(left)) ++answer;
      }
      cout << answer << '\n';
      for (int right = foreign_count + 1; right <= total_count; ++right) {
          if (matched_left[static_cast<size_t>(right)] != 0) {
              cout << matched_left[static_cast<size_t>(right)] << ' ' << right << '\n';
          }
      }
  }
external_url: https://www.luogu.com.cn/problem/P2756
external_platform: '洛谷'
external_problem_id: 'P2756'
external_title: '飛行員配對方案'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
