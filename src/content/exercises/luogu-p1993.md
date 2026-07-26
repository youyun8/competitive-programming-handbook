---
id: luogu-p1993
volume: lower
source_file: lower-volume
original_label: 洛谷 P1993
title: 洛谷 P1993 小 K 的農場：差分約束可行性
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: [差分約束, SPFA, 正環]
prerequisites: [dijkstra]
core_knowledge: [不等式建邊, 最長路模型, 環矛盾]
judgment: 將限制統一成 x_v >= x_u+w；可繼續增大的正環代表矛盾。
statement: 給定農場作物數量間的至少、至多與相等限制，判斷是否存在同時滿足全部資訊的數值。
constraints: ['n, m <= 5000', 'a, b, c <= 5000']
input_format: 第一行 n、m；每條資訊以類型 1、2、3 加參數描述至少、至多、相等。
output_format: 可行輸出 Yes，否則輸出 No。
samples:
  - input: |-
      3 3
      1 1 2 2
      2 1 3 5
      3 2 3
    output: 'Yes'
    explanation: 例如令三座農場數量為 2、0、0，即同時滿足三條限制。
hints:
  - 統一使用 x_v >= x_u+w 的最長路形式。
  - 類型 1 建 b→a 權 c；類型 2 建 a→b 權 -c；相等則雙向權 0。
  - 所有點初始距離 0 並入隊，等價於超級源點，可偵測任一分量的正環。
solution_outline: 依三種限制建最長路差分約束圖，以 SPFA 鬆弛；若某條當前最長路含至少 n 條邊即經過正環而無解。
proof_or_invariant: 每條邊 u→v,w 精確表示 x_v>=x_u+w。無正環時最長路距離對所有邊滿足該不等式，構成一組解；正環沿環相加會得到 x>x 的矛盾，因此兩者互為充要。
complexity: { time: '最壞 O(nm)', space: 'O(n+m)' }
common_errors: [類型 2 的方向或負號寫反, 只從 1 號點開始而漏掉其他分量, 用入隊總次數取代當前路徑邊數]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { int n, m; cin >> n >> m; /* TODO：建差分約束圖並判正環。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, m; if (!(cin >> n >> m)) return 0;
      vector<vector<pair<int, int>>> graph(static_cast<size_t>(n + 1));
      for (int i = 0; i < m; ++i) {
          int type, a, b; cin >> type >> a >> b;
          if (type == 1) {
              int c; cin >> c; graph[static_cast<size_t>(b)].push_back({a, c});
          } else if (type == 2) {
              int c; cin >> c; graph[static_cast<size_t>(a)].push_back({b, -c});
          } else {
              graph[static_cast<size_t>(a)].push_back({b, 0});
              graph[static_cast<size_t>(b)].push_back({a, 0});
          }
      }
      vector<long long> dist(static_cast<size_t>(n + 1), 0);
      vector<int> edge_count(static_cast<size_t>(n + 1), 0);
      vector<char> in_queue(static_cast<size_t>(n + 1), 1);
      queue<int> pending;
      for (int i = 1; i <= n; ++i) pending.push(i);
      while (!pending.empty()) {
          const int node = pending.front(); pending.pop();
          in_queue[static_cast<size_t>(node)] = 0;
          for (const auto& [next, weight] : graph[static_cast<size_t>(node)]) {
              if (dist[static_cast<size_t>(next)] >= dist[static_cast<size_t>(node)] + weight) continue;
              dist[static_cast<size_t>(next)] = dist[static_cast<size_t>(node)] + weight;
              edge_count[static_cast<size_t>(next)] = edge_count[static_cast<size_t>(node)] + 1;
              if (edge_count[static_cast<size_t>(next)] >= n) {
                  cout << "No\n"; return 0;
              }
              if (!in_queue[static_cast<size_t>(next)]) {
                  pending.push(next); in_queue[static_cast<size_t>(next)] = 1;
              }
          }
      }
      cout << "Yes\n";
  }
external_url: https://www.luogu.com.cn/problem/P1993
external_platform: 洛谷
external_problem_id: P1993
external_title: 小 K 的農場
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

差分約束先選定「最短路」或「最長路」形式，再逐條對照不等式，最不容易接反。
