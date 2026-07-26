---
id: luogu-p1347
volume: lower
source_file: lower-volume
original_label: 洛谷 P1347
title: 排序：逐條判定偏序關係
chapter: 10
section: '10.2'
kind: external-oj
difficulty: 3
topics: [topological-sort, cycle-detection, unique-order]
prerequisites: [directed-graph, indegree]
statement: >-
  有 n 個以 A、B、C……表示的相異元素，接著依序給出 m 條「某元素小於另一元素」的關係。
  每加入一條關係後，判斷目前是否已能唯一確定全部元素的升序、是否已出現矛盾，或仍無法
  確定。輸出最早能得出結論時用了幾條關係；若所有關係處理完仍不確定，也要回報。
constraints:
  - 2 <= n <= 26
  - 1 <= m <= 600
  - 元素依序以 A 到第 n 個大寫英文字母表示
input_format: >-
  第一行為 n 與 m。接著 m 行各有一個 A<B 形式的關係，表示左側元素必須排在右側元素之前。
output_format: >-
  若前 x 條關係已唯一決定順序 y，輸出「Sorted sequence determined after x relations: y.」；
  若前 x 條首次造成矛盾，輸出「Inconsistency found after x relations.」；若全部讀完仍不唯一，
  輸出「Sorted sequence cannot be determined.」。
samples:
  - input: |
      4 6
      A<B
      A<C
      B<C
      C<D
      B<D
      A<B
    output: 'Sorted sequence determined after 4 relations: ABCD.'
    explanation: >-
      加入前三條後 D 的相對位置尚未固定；第四條 C<D 加入後唯一拓撲序為 ABCD，所以後續關係不影響最早結論。
core_knowledge:
  - DAG 有唯一拓撲序，若且唯若 Kahn 演算法每一步都恰有一個零入度頂點
  - 若拓撲排序無法取出全部 n 個頂點，圖中存在有向環，代表關係矛盾
  - 題目要求最早結論，因此每加入一條關係就要重新判定目前圖的狀態
judgment: >-
  唯一順序或矛盾一旦首次出現即可確定答案；確定唯一順序後，不必考慮後續輸入可能形成的矛盾。
hints:
  - 將 X<Y 視為 X→Y；加入每條邊後，用目前所有邊嘗試一次拓撲排序。
  - 若某一步有兩個以上零入度頂點，這次排序即使能完成，也還不是唯一；若最後仍有頂點未取出則有環。
  - 依題意優先回報有環；否則若每一步候選都唯一，就保存這次取出的完整順序。
solution_outline: >-
  以布林鄰接矩陣保存邊，避免重複關係重複增加入度。每讀一條關係後複製入度，執行 Kahn
  拓撲排序。每輪統計所有尚可選的零入度頂點：候選超過一個就標記不唯一，再任取一個繼續；
  若最後取出的頂點少於 n，狀態為矛盾；若完整取出且從未有多個候選，狀態為唯一並得到順序。
  最先出現矛盾或唯一狀態時輸出並結束；否則讀完輸出無法確定。
proof_or_invariant: >-
  Kahn 演算法中，剩餘入度為零的頂點恰是所有前置元素都已放入序列的元素，因此任一拓撲序
  的下一項必在候選集合中。候選為空且仍有頂點時，剩餘子圖每點都有前驅，必含有向環；
  反之 DAG 必有零入度點。若某步至少有兩個候選，交換先選哪一個可延伸成兩個不同拓撲序，
  所以不唯一；若每步恰有一個候選，所有合法序列每個位置都被強制，故唯一。逐條檢查並在
  首次非「不確定」狀態停止，所得關係編號即題目要求的最早位置。
common_errors:
  - 只在讀完全部關係後檢查，因而輸出錯誤的關係編號
  - 以某次取出的字典序結果存在就判定唯一，沒有檢查每一步的零入度候選數
  - 重複邊仍增加入度，造成不存在的環或漏取頂點
  - 發現唯一順序後仍以後續矛盾覆蓋答案，違反題目要求
complexity:
  time: O(m * n^2)，n <= 26
  space: O(n^2)
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;

  struct CheckResult {
      int state = 0;  // -1：矛盾，0：未確定，1：唯一。
      string order;
  };

  static CheckResult check_order(const vector<vector<bool>>& edge,
                                 const vector<int>& indegree) {
      // TODO：執行 Kahn 拓撲排序，同時判斷每一步的候選是否唯一。
      (void)edge;
      (void)indegree;
      return {};
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int element_count = 0;
      int relation_count = 0;
      cin >> element_count >> relation_count;
      vector<vector<bool>> edge(
          static_cast<size_t>(element_count),
          vector<bool>(static_cast<size_t>(element_count), false));
      vector<int> indegree(static_cast<size_t>(element_count), 0);
      for (int relation = 1; relation <= relation_count; ++relation) {
          string constraint;
          cin >> constraint;
          // TODO：加入新邊、檢查狀態，並在首次得到結論時輸出。
          (void)constraint;
          (void)check_order(edge, indegree);
      }
      cout << "Sorted sequence cannot be determined.\n";
  }
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;

  struct CheckResult {
      int state = 0;
      string order;
  };

  static CheckResult check_order(const vector<vector<bool>>& edge,
                                 const vector<int>& original_indegree) {
      const int element_count = static_cast<int>(edge.size());
      vector<int> indegree = original_indegree;
      vector<bool> used(edge.size(), false);
      string order;
      bool unique = true;
      for (int position = 0; position < element_count; ++position) {
          int candidate = -1;
          int candidate_count = 0;
          for (int vertex = 0; vertex < element_count; ++vertex) {
              if (!used[static_cast<size_t>(vertex)] &&
                  indegree[static_cast<size_t>(vertex)] == 0) {
                  candidate = vertex;
                  ++candidate_count;
              }
          }
          if (candidate_count == 0) { return {-1, ""}; }
          if (candidate_count > 1) { unique = false; }
          used[static_cast<size_t>(candidate)] = true;
          order.push_back(static_cast<char>('A' + candidate));
          for (int next = 0; next < element_count; ++next) {
              if (edge[static_cast<size_t>(candidate)][static_cast<size_t>(next)]) {
                  --indegree[static_cast<size_t>(next)];
              }
          }
      }
      return {unique ? 1 : 0, order};
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int element_count = 0;
      int relation_count = 0;
      cin >> element_count >> relation_count;
      vector<vector<bool>> edge(
          static_cast<size_t>(element_count),
          vector<bool>(static_cast<size_t>(element_count), false));
      vector<int> indegree(static_cast<size_t>(element_count), 0);

      for (int relation = 1; relation <= relation_count; ++relation) {
          string constraint;
          cin >> constraint;
          const int from = constraint[0] - 'A';
          const int to = constraint[2] - 'A';
          if (!edge[static_cast<size_t>(from)][static_cast<size_t>(to)]) {
              edge[static_cast<size_t>(from)][static_cast<size_t>(to)] = true;
              ++indegree[static_cast<size_t>(to)];
          }
          const CheckResult result = check_order(edge, indegree);
          if (result.state == -1) {
              cout << "Inconsistency found after " << relation << " relations.\n";
              return 0;
          }
          if (result.state == 1) {
              cout << "Sorted sequence determined after " << relation
                   << " relations: " << result.order << ".\n";
              return 0;
          }
      }
      cout << "Sorted sequence cannot be determined.\n";
  }
external_url: https://www.luogu.com.cn/problem/P1347
external_platform: Luogu
external_problem_id: P1347
external_title: '[ECNA 2001] 排序'
external_relation: original
source_book_pages: [610]
source_pdf_pages: [240]
review_status: verified
---

這題的重點不是產生一個拓撲序，而是辨認「每一步是否都被迫只能選同一個元素」。
