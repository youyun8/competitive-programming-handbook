---
id: luogu-p6066
volume: lower
source_file: lower-volume
original_label: 洛谷 P6066
title: Watchcow S：每條道路正反各走一次
chapter: 10
section: '10.3'
kind: external-oj
difficulty: 3
topics: [euler-circuit, directed-multigraph, iterative-hierholzer]
prerequisites: [directed-graph, indegree, outdegree]
statement: >-
  有 N 個農場與 M 條可雙向通行的道路，兩農場間可能有重邊。從 1 號農場出發，要求每條
  道路的兩個方向各恰好走一次，最後回到 1 號農場；輸出任一條符合條件的巡邏路徑。
constraints: [2 <= N <= 10000, 1 <= M <= 50000, 可能有重邊, 保證存在合法路徑]
input_format: 第一行 N、M；接著 M 行各給一條道路連接的農場 u、v。
output_format: 逐行輸出經過的農場，共 2M+1 行，第一行與最後一行皆為 1。
samples:
  - input: "4 5\n1 2\n1 4\n2 3\n2 4\n3 4\n"
    output: "1\n2\n1\n4\n2\n3\n2\n4\n3\n4\n1"
    explanation: 序列使用十個有向步驟；原本五條道路各出現兩次，而且兩次方向相反，起終點均為 1。
core_knowledge: [一條無向邊拆成兩條反向有向邊, 平衡有向圖的歐拉迴路, 疊代 Hierholzer]
judgment: 每條輸入道路必須貢獻 u→v 與 v→u 各一次；不能把兩個方向綁成「其中一個走過便同時刪除」，輸出頂點數必為 2M+1。
hints:
  - 把每條雙向道路拆成兩條彼此獨立的有向邊。
  - 拆邊後每個頂點入度等於出度，且題目保證從 1 可完成整條歐拉迴路。
  - 用頂點堆疊走尚未使用的出邊；無出邊時彈出並加入回溯序，最後反轉。
solution_outline: >-
  對每條 u-v 道路，分別在 u 的鄰接串列加入 v、在 v 的串列加入 u，兩筆視為獨立有向邊。
  以每點游標記錄下一條未走出邊，從 1 執行疊代 Hierholzer；回溯頂點序反轉後逐行輸出。
proof_or_invariant: >-
  每條原道路恰建立 u→v 與 v→u 各一條，所以游標掃過全部鄰接項就精確滿足正反各一次。
  每點由每條相鄰道路各得到一條入邊及一條出邊，故入出度平衡；原圖的含邊部分連通且起點
  為 1，因此拆邊圖存在從 1 出發的歐拉迴路。Hierholzer 彈出頂點時已用盡其出邊，回溯
  拼接後相鄰頂點必對應已走有向邊，且每筆鄰接項只由游標取用一次。
common_errors:
  [把一對反向弧共用同一 used 標記而只走道路一次, 把重邊去重, 直接輸出堆疊彈出順序而未反轉, 遞迴深度達十萬造成堆疊溢位]
complexity: { time: O(N + M), space: O(N + M) }
cpp_skeleton: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int vertex_total = 0;
      int edge_total = 0;
      cin >> vertex_total >> edge_total;
      vector<vector<int>> graph(static_cast<size_t>(vertex_total + 1));
      for (int index = 0; index < edge_total; ++index) {
          int first = 0;
          int second = 0;
          cin >> first >> second;
          graph[static_cast<size_t>(first)].push_back(second);
          graph[static_cast<size_t>(second)].push_back(first);
      }
      vector<size_t> next_edge(static_cast<size_t>(vertex_total + 1), 0);
      vector<int> active{1};
      vector<int> reversed_path;
      (void)next_edge;
      (void)active;
      (void)reversed_path;
      // TODO：疊代執行 Hierholzer，反轉回溯序後逐行輸出。
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int vertex_total = 0;
      int edge_total = 0;
      cin >> vertex_total >> edge_total;
      vector<vector<int>> graph(static_cast<size_t>(vertex_total + 1));
      for (int index = 0; index < edge_total; ++index) {
          int first = 0;
          int second = 0;
          cin >> first >> second;
          graph[static_cast<size_t>(first)].push_back(second);
          graph[static_cast<size_t>(second)].push_back(first);
      }
      vector<size_t> next_edge(static_cast<size_t>(vertex_total + 1), 0);
      vector<int> active{1};
      vector<int> reversed_path;
      reversed_path.reserve(static_cast<size_t>(2 * edge_total + 1));
      while (!active.empty()) {
          int vertex = active.back();
          size_t& edge_index = next_edge[static_cast<size_t>(vertex)];
          if (edge_index < graph[static_cast<size_t>(vertex)].size()) {
              active.push_back(graph[static_cast<size_t>(vertex)][edge_index]);
              ++edge_index;
          } else {
              reversed_path.push_back(vertex);
              active.pop_back();
          }
      }
      reverse(reversed_path.begin(), reversed_path.end());
      for (int vertex : reversed_path) {
          cout << vertex << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P6066
external_platform: Luogu
external_problem_id: P6066
external_title: '[USACO05JAN] Watchcow S'
external_relation: original
source_book_pages: [615]
source_pdf_pages: [245]
review_status: verified
---

這題不是把道路走兩遍的無向歐拉問題；拆成一正一反兩條獨立有向邊後，入出度會自然平衡。
