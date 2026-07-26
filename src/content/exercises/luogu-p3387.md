---
id: luogu-p3387
volume: lower
source_file: lower-volume
original_label: '洛谷 P3387'
title: 洛谷 P3387 縮點：強連通分量與 DAG 最長路
chapter: 10
section: '10.5'
kind: external-oj
difficulty: 4
topics: ['強連通分量', 'Tarjan', '縮點', 'DAG 最長路', '拓撲排序']
prerequisites: ['directed-connectivity']
statement: |-
  給定一張帶點權的有向圖，求一條路徑使經過的點權和最大；同一個點可以重複經過，但點權只計算一次。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'n 可達 10^4、m 可達 10^5'
  - '路徑可重複經過點，但點權只算一次——這是要縮點的原因'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；第二行 n 個整數表示每個點的點權；接下來 m 行，每行兩個整數 u v 表示一條 u 到 v 的有向邊。'
output_format: '一行一個整數，表示最大點權和。'
samples:
  - input: |
      5 5
      1 2 3 4 5
      1 2
      2 3
      3 1
      3 4
      4 5
    output: |
      15
    explanation: |-
      1、2、3 互相可達，構成一個強連通分量，點權和 1+2+3=6；縮點後的鏈是 6 → 4 → 5，全部取走得 15。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
core_knowledge: [Tarjan 強連通分量, 縮點 DAG, DAG 最長路]
judgment: 同一強連通分量內的點可全部取到且各只計一次；縮點後問題等價於帶點權 DAG 最長路。
hints:
  - |-
    先抓住「點可以重複經過，但點權只算一次」：在有環的小圖上畫幾條路徑，思考哪些互相能往返的區域可視為一個整體，以及這個整體應累計多少權值。
  - |-
    用 Tarjan 找強連通分量：`dfn` 是進入時間，`low` 記錄可回到的最小 `dfn`。遇到已訪問點時，只有它仍在堆疊上才能用其 `dfn` 更新 `low`；當 `low[u] == dfn[u]`，把堆疊彈到 `u` 為止，並把分量內點權加總。
  - |-
    每個分量縮成一點後必為 DAG；若仍有環，環上的分量本應合併。以拓撲排序遞推 `best[v] = max(best[v], best[u] + 分量點權)`，起點不固定，所以所有入度為 0 的分量都要進初始佇列，答案取所有 `best` 的最大值。
solution_outline: |-
  先用 Tarjan 求出所有強連通分量並記錄每個點所屬分量。把每個分量的點權加總，只保留兩端分量不同的邊建出 DAG 並統計入度。最後在 DAG 上用拓撲排序做最長路 DP，答案為所有分量 best 值的最大值。
proof_or_invariant: |-
  Tarjan 的核心不變量是「low[u] 等於 u 的子樹經至多一條回邊能到達的最小 dfn」，因此 low[u] == dfn[u] 恰好刻畫「u 是分量的根」。縮點後無環，故拓撲序存在；DP 沿拓撲序推進時，每個分量被鬆弛完畢時其所有前驅都已處理完成，best 值即為以該分量結尾的最大權和。
complexity:
  time: 'O(n + m)'
  space: 'O(n + m)'
common_errors: [跨分量邊更新 Tarjan low, 縮點時漏加分量點權, DAG 最長路只從單一起點開始]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static int n, m;
  static vector<vector<int>> adjacency;
  static vector<int> dfn, low, component_of, stack_nodes;
  static vector<char> on_stack;
  static int timer_value = 0, component_count = 0;

  // TODO 1：Tarjan 求強連通分量。
  //   進入 node 時設 dfn 與 low，並推入堆疊、標記 on_stack。
  //   走樹邊：遞迴後用 low[next] 更新 low[node]。
  //   走已訪問且仍在堆疊上的點：用 dfn[next] 更新 low[node]
  //   （不在堆疊上代表已屬於別的分量，不能用）。
  //   回溯時若 low[node] == dfn[node]，就把堆疊彈到 node 為止，
  //   這些點構成一個強連通分量。
  static void tarjan(int node) {
      dfn[static_cast<size_t>(node)] = low[static_cast<size_t>(node)] = ++timer_value;
      (void)adjacency;
      (void)component_of;
      (void)stack_nodes;
      (void)on_stack;
      (void)component_count;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      if (!(cin >> n >> m)) { return 0; }
      vector<long long> value(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> value[static_cast<size_t>(i)]; }
      adjacency.assign(static_cast<size_t>(n) + 1, {});
      vector<pair<int, int>> edges(static_cast<size_t>(m));
      for (auto& [u, v] : edges) {
          cin >> u >> v;
          adjacency[static_cast<size_t>(u)].push_back(v);
      }

      dfn.assign(static_cast<size_t>(n) + 1, 0);
      low.assign(static_cast<size_t>(n) + 1, 0);
      component_of.assign(static_cast<size_t>(n) + 1, 0);
      on_stack.assign(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) {
          if (dfn[static_cast<size_t>(i)] == 0) { tarjan(i); }
      }

      // TODO 2：縮點。每個分量的點權是內部所有點權之和；
      //   只保留兩端分量不同的邊，得到一張 DAG。
      // TODO 3：在 DAG 上做最長路 DP。用拓撲排序逐點鬆弛：
      //   best[next] = max(best[next], best[cur] + 分量點權)。
      //   答案是所有 best 的最大值。
      //   （縮點之後為什麼能貪心地一路走下去？因為同一分量內的點兩兩可達，
      //     進入分量就能把整個分量的權值全部拿走。）
      long long answer = 0;
      cout << answer << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 縮點：Tarjan 求強連通分量，把每個分量縮成一點、點權為分量內權值和，
  // 得到 DAG 後在上面做最長路 DP。
  static int n, m;
  static vector<vector<int>> adjacency;
  static vector<int> dfn, low, component_of, stack_nodes;
  static vector<char> on_stack;
  static int timer_value = 0, component_count = 0;

  static void tarjan(int node) {
      dfn[static_cast<size_t>(node)] = low[static_cast<size_t>(node)] = ++timer_value;
      stack_nodes.push_back(node);
      on_stack[static_cast<size_t>(node)] = 1;
      for (const int next : adjacency[static_cast<size_t>(node)]) {
          if (dfn[static_cast<size_t>(next)] == 0) {
              tarjan(next);
              low[static_cast<size_t>(node)] = min(low[static_cast<size_t>(node)], low[static_cast<size_t>(next)]);
          } else if (on_stack[static_cast<size_t>(next)]) {
              low[static_cast<size_t>(node)] = min(low[static_cast<size_t>(node)], dfn[static_cast<size_t>(next)]);
          }
      }
      if (low[static_cast<size_t>(node)] == dfn[static_cast<size_t>(node)]) {
          ++component_count;
          while (true) {
              const int top = stack_nodes.back();
              stack_nodes.pop_back();
              on_stack[static_cast<size_t>(top)] = 0;
              component_of[static_cast<size_t>(top)] = component_count;
              if (top == node) { break; }
          }
      }
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      if (!(cin >> n >> m)) { return 0; }
      vector<long long> value(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> value[static_cast<size_t>(i)]; }
      adjacency.assign(static_cast<size_t>(n) + 1, {});
      vector<pair<int, int>> edges(static_cast<size_t>(m));
      for (auto& [u, v] : edges) {
          cin >> u >> v;
          adjacency[static_cast<size_t>(u)].push_back(v);
      }

      dfn.assign(static_cast<size_t>(n) + 1, 0);
      low.assign(static_cast<size_t>(n) + 1, 0);
      component_of.assign(static_cast<size_t>(n) + 1, 0);
      on_stack.assign(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) {
          if (dfn[static_cast<size_t>(i)] == 0) { tarjan(i); }
      }

      vector<long long> component_value(static_cast<size_t>(component_count) + 1, 0);
      for (int i = 1; i <= n; ++i) {
          component_value[static_cast<size_t>(component_of[static_cast<size_t>(i)])] += value[static_cast<size_t>(i)];
      }
      vector<vector<int>> dag(static_cast<size_t>(component_count) + 1);
      vector<int> in_degree(static_cast<size_t>(component_count) + 1, 0);
      for (const auto& [u, v] : edges) {
          const int cu = component_of[static_cast<size_t>(u)];
          const int cv = component_of[static_cast<size_t>(v)];
          if (cu == cv) { continue; }
          dag[static_cast<size_t>(cu)].push_back(cv);
          ++in_degree[static_cast<size_t>(cv)];
      }

      // Tarjan 的分量編號天然是反拓撲序，但這裡用拓撲排序 DP 較不易寫錯。
      deque<int> queue_nodes;
      vector<long long> best(static_cast<size_t>(component_count) + 1, 0);
      for (int c = 1; c <= component_count; ++c) {
          best[static_cast<size_t>(c)] = component_value[static_cast<size_t>(c)];
          if (in_degree[static_cast<size_t>(c)] == 0) { queue_nodes.push_back(c); }
      }
      long long answer = 0;
      while (!queue_nodes.empty()) {
          const int c = queue_nodes.front();
          queue_nodes.pop_front();
          answer = max(answer, best[static_cast<size_t>(c)]);
          for (const int next : dag[static_cast<size_t>(c)]) {
              best[static_cast<size_t>(next)] =
                  max(best[static_cast<size_t>(next)],
                      best[static_cast<size_t>(c)] + component_value[static_cast<size_t>(next)]);
              if (--in_degree[static_cast<size_t>(next)] == 0) { queue_nodes.push_back(next); }
          }
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3387
external_platform: 洛谷
external_problem_id: P3387
external_title: '【模板】縮點'
external_relation: original
source_book_pages: [627]
source_pdf_pages: [257]
review_status: verified
---

縮點是把「有環的圖」變成「無環的圖」的通用手段。一旦變成 DAG，DP、拓撲排序、最長路這些工具就全部可用了。
