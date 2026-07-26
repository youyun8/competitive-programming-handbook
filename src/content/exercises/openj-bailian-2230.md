---
id: openj-bailian-2230
volume: lower
source_file: lower-volume
original_label: OpenJ_Bailian 2230
title: Watchcow：每條小徑雙向巡查
chapter: 10
section: '10.3'
kind: external-oj
difficulty: 3
topics: [euler-circuit, directed-multigraph, iterative-hierholzer]
prerequisites: [directed-graph, indegree, outdegree]
statement: >-
  農場有 N 塊田與 M 條雙向小徑，兩塊田間可以有多條小徑。Bessie 從 1 號穀倉出發，
  每條小徑要恰走兩次且方向相反，最後回到穀倉；請輸出任一條符合要求的巡查路徑。
constraints:
  [2 <= N <= 10000, 1 <= M <= 50000, 兩田間可能有重邊, 時間限制 3000 ms, 記憶體限制 65536 kB, 保證存在合法路徑]
input_format: 第一行 N、M；接著 M 行各給一條小徑連接的田地 u、v。
output_format: 輸出 2M+1 行經過的田地，從 1 開始並以 1 結束。
samples:
  - input: "4 5\n1 2\n1 4\n2 3\n2 4\n3 4\n"
    output: "1\n2\n1\n4\n2\n3\n2\n4\n3\n4\n1"
    explanation: 每對相鄰輸出是一個有向步驟；十步恰為五條小徑的兩個相反方向，並回到 1。
core_knowledge: [無向小徑拆為兩條反向有向邊, 有向歐拉迴路, 線性疊代 Hierholzer]
judgment: 同一條小徑的兩次通行方向必須相反；重邊各自貢獻兩個方向，最後應輸出恰好 2M+1 個頂點。
hints:
  - 對輸入 u-v，各建立一條 u→v 及一條 v→u 的獨立有向邊。
  - 拆分後每個頂點的入度與出度相等，問題成為從 1 開始的有向歐拉迴路。
  - 以鄰接游標和顯式堆疊執行 Hierholzer，無邊可走才回溯記點，最後反轉。
solution_outline: >-
  鄰接串列的每一項直接代表一個尚未使用的方向；每條輸入邊在兩端各加入一項。從 1 開始，
  用 next_edge[u] 依序取出每條有向邊並壓入終點；頂點用盡出邊時彈出至答案，反轉後輸出。
proof_or_invariant: >-
  對每條實體小徑，建圖恰含兩個相反方向，因此走完全部鄰接項就恰好完成題目要求。每條
  相鄰小徑對某頂點各增加一條入邊與出邊，故所有點入出度相等；題目保證合法巡查存在。
  游標永不回退，使每條有向邊只走一次；Hierholzer 的回溯拼接保持相鄰端點吻合，最後
  得到從 1 出發、使用全部 2M 條有向邊並回到 1 的迴路。
common_errors: [把反向鄰接項當同一無向邊一起標記使用, 忽略平行小徑, 輸出少於 2M+1 行, 以十萬層遞迴實作而超出呼叫堆疊]
complexity: { time: O(N + M), space: O(N + M) }
cpp_skeleton: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int field_total = 0;
      int trail_total = 0;
      cin >> field_total >> trail_total;
      vector<vector<int>> graph(static_cast<size_t>(field_total + 1));
      for (int index = 0; index < trail_total; ++index) {
          int first = 0;
          int second = 0;
          cin >> first >> second;
          graph[static_cast<size_t>(first)].push_back(second);
          graph[static_cast<size_t>(second)].push_back(first);
      }
      vector<size_t> next_trail(static_cast<size_t>(field_total + 1), 0);
      vector<int> active{1};
      vector<int> reversed_path;
      (void)next_trail;
      (void)active;
      (void)reversed_path;
      // TODO：走完每個方向，反轉回溯頂點序並輸出。
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int field_total = 0;
      int trail_total = 0;
      cin >> field_total >> trail_total;
      vector<vector<int>> graph(static_cast<size_t>(field_total + 1));
      for (int index = 0; index < trail_total; ++index) {
          int first = 0;
          int second = 0;
          cin >> first >> second;
          graph[static_cast<size_t>(first)].push_back(second);
          graph[static_cast<size_t>(second)].push_back(first);
      }
      vector<size_t> next_trail(static_cast<size_t>(field_total + 1), 0);
      vector<int> active{1};
      vector<int> reversed_path;
      reversed_path.reserve(static_cast<size_t>(2 * trail_total + 1));
      while (!active.empty()) {
          int field = active.back();
          size_t& trail_index = next_trail[static_cast<size_t>(field)];
          if (trail_index < graph[static_cast<size_t>(field)].size()) {
              active.push_back(graph[static_cast<size_t>(field)][trail_index]);
              ++trail_index;
          } else {
              reversed_path.push_back(field);
              active.pop_back();
          }
      }
      reverse(reversed_path.begin(), reversed_path.end());
      for (int field : reversed_path) {
          cout << field << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/2230/
external_platform: OpenJ_Bailian
external_problem_id: '2230'
external_title: Watchcow
external_relation: original
source_book_pages: [615]
source_pdf_pages: [245]
review_status: verified
---

每條小徑在鄰接串列中保留兩個獨立方向；不要套用一般無向邊「正反共用 used」的寫法。
