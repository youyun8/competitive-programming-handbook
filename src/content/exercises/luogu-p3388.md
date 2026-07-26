---
id: luogu-p3388
volume: lower
source_file: lower-volume
original_label: '洛谷 P3388'
title: 洛谷 P3388 割點：Tarjan 求關節點
chapter: 10
section: '10.5'
kind: external-oj
difficulty: 3
topics: ['割點', 'Tarjan', '無向圖連通性', 'DFS 樹']
prerequisites: ['undirected-connectivity']
statement: |-
  給定一張無向圖，求所有割點——移除該點及其相連的邊後，圖的連通塊數量會增加的點。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '圖可能不連通，每個連通塊都要各自處理'
  - '可能有重邊與自環'
  - '輸出的割點需由小到大排序'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；接下來 m 行，每行兩個整數表示一條無向邊。'
output_format: '第一行輸出割點個數；第二行由小到大輸出所有割點編號。'
samples:
  - input: |
      6 7
      1 2
      1 3
      2 4
      3 4
      4 5
      5 6
      6 4
    output: |
      1
      4
    explanation: |-
      1、2、3、4 之間有環，5、6、4 之間也有環，兩個環只透過點 4 相連。移除 4 就會把 5、6 從其餘部分切開，因此 4 是唯一的割點。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
core_knowledge: [Tarjan 割點, DFS 樹, low-link]
judgment: 非根 u 為割點當且僅當存在樹邊 u→v 使 low[v]>=dfn[u]；DFS 根則需至少兩棵子樹。
hints:
  - |-
    在 DFS 樹上思考。dfn[u] 是 u 的進入時間；low[u] 定義為「u 的子樹中，不經由連向父節點的那條樹邊，最遠能回到的最小 dfn」。
  - |-
    對一條樹邊 (u, v)：若 low[v] >= dfn[u]，代表 v 的整棵子樹沒有任何回邊能繞過 u 回到更上面。那麼移除 u 就會把 v 的子樹切斷——u 是割點。
  - |-
    根節點是例外：它沒有父節點，所以上面的判斷不適用。根是割點的條件是它在 DFS 樹上有**兩棵以上**子樹；只有一棵時移除它不會切開任何東西。
  - |-
    更新 low 時要分清楚：走樹邊用 `low[u] = min(low[u], low[v])`，走回邊用 `low[u] = min(low[u], dfn[v])`。回邊用 dfn 而不是 low 是常見的錯誤點。
  - |-
    圖可能不連通，所以要對每個尚未走訪的點各跑一次 DFS 並各自視為根。自環對連通性毫無影響，讀入時直接跳過最省事。
solution_outline: |-
  對每個未走訪的點跑一次 DFS 並視為根。過程中維護 dfn 與 low：走樹邊時遞迴後以 low[v] 更新 low[u]，並在非根且 low[v] >= dfn[u] 時把 u 標記為割點；走回邊時以 dfn[v] 更新 low[u]。根節點則在子樹數達到兩棵時標記。最後依編號順序輸出所有割點。
proof_or_invariant: |-
  low[u] 的不變量是「u 的子樹經至多一條回邊可達的最小 dfn」。由此，low[v] >= dfn[u] 等價於「v 的子樹與 u 的祖先之間沒有任何不經過 u 的路徑」，正是 u 為割點的定義。根節點的例外來自它沒有祖先，因此改以子樹數量判斷。
complexity:
  time: 'O(n + m)'
  space: 'O(n + m)'
common_errors: [根節點套用非根判式, 回邊錯用 low 更新, 無向父邊處理錯誤]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static vector<vector<int>> adjacency;
  static vector<int> dfn, low;
  static vector<char> is_cut;
  static int timer_value = 0;

  // TODO：Tarjan 求割點。
  //   dfn[u] 是 u 的 DFS 進入時間；low[u] 是「u 的子樹不經由父邊，
  //   最遠能回到的最小 dfn」。
  //   走樹邊 (u, v)：先遞迴 v，再用 low[v] 更新 low[u]；
  //     若 u 不是根且 low[v] >= dfn[u]，代表 v 的子樹沒有任何回邊
  //     繞過 u，移除 u 就會把 v 的子樹切開，故 u 是割點。
  //   走回邊 (u, v)：用 dfn[v]（不是 low[v]）更新 low[u]。
  //   根節點特別處理：有兩棵以上子樹才是割點。
  static void dfs(int node, bool is_root) {
      dfn[static_cast<size_t>(node)] = low[static_cast<size_t>(node)] = ++timer_value;
      (void)is_root;
      (void)adjacency;
      (void)is_cut;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      adjacency.assign(static_cast<size_t>(n) + 1, {});
      for (int i = 0; i < m; ++i) {
          int u, v;
          cin >> u >> v;
          if (u == v) { continue; }  // 自環不影響連通性
          adjacency[static_cast<size_t>(u)].push_back(v);
          adjacency[static_cast<size_t>(v)].push_back(u);
      }
      dfn.assign(static_cast<size_t>(n) + 1, 0);
      low.assign(static_cast<size_t>(n) + 1, 0);
      is_cut.assign(static_cast<size_t>(n) + 1, 0);
      // 圖可能不連通，每個未走訪過的點都要當一次根。
      for (int i = 1; i <= n; ++i) {
          if (dfn[static_cast<size_t>(i)] == 0) { dfs(i, true); }
      }
      vector<int> answer;
      for (int i = 1; i <= n; ++i) {
          if (is_cut[static_cast<size_t>(i)]) { answer.push_back(i); }
      }
      cout << answer.size() << '\n';
      for (size_t i = 0; i < answer.size(); ++i) {
          cout << answer[i] << " \n"[i + 1 == answer.size()];
      }
      if (answer.empty()) { cout << '\n'; }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // Tarjan 求割點：dfn 是 DFS 序，low 是不經父邊能回到的最小 dfn。
  // 非根節點 u 是割點 <=> 存在子節點 v 使 low[v] >= dfn[u]；根則看子樹數是否 >= 2。
  static vector<vector<int>> adjacency;
  static vector<int> dfn, low;
  static vector<char> is_cut;
  static int timer_value = 0;

  static void dfs(int node, bool is_root) {
      dfn[static_cast<size_t>(node)] = low[static_cast<size_t>(node)] = ++timer_value;
      int child_count = 0;
      for (const int next : adjacency[static_cast<size_t>(node)]) {
          if (dfn[static_cast<size_t>(next)] == 0) {
              ++child_count;
              dfs(next, false);
              low[static_cast<size_t>(node)] = min(low[static_cast<size_t>(node)], low[static_cast<size_t>(next)]);
              if (!is_root && low[static_cast<size_t>(next)] >= dfn[static_cast<size_t>(node)]) {
                  is_cut[static_cast<size_t>(node)] = 1;
              }
          } else {
              low[static_cast<size_t>(node)] = min(low[static_cast<size_t>(node)], dfn[static_cast<size_t>(next)]);
          }
      }
      if (is_root && child_count >= 2) { is_cut[static_cast<size_t>(node)] = 1; }
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      adjacency.assign(static_cast<size_t>(n) + 1, {});
      for (int i = 0; i < m; ++i) {
          int u, v;
          cin >> u >> v;
          if (u == v) { continue; }  // 自環不影響連通性
          adjacency[static_cast<size_t>(u)].push_back(v);
          adjacency[static_cast<size_t>(v)].push_back(u);
      }
      dfn.assign(static_cast<size_t>(n) + 1, 0);
      low.assign(static_cast<size_t>(n) + 1, 0);
      is_cut.assign(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) {
          if (dfn[static_cast<size_t>(i)] == 0) { dfs(i, true); }
      }
      vector<int> answer;
      for (int i = 1; i <= n; ++i) {
          if (is_cut[static_cast<size_t>(i)]) { answer.push_back(i); }
      }
      cout << answer.size() << '\n';
      for (size_t i = 0; i < answer.size(); ++i) {
          cout << answer[i] << " \n"[i + 1 == answer.size()];
      }
      if (answer.empty()) { cout << '\n'; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3388
external_platform: 洛谷
external_problem_id: P3388
external_title: '【模板】割點（割頂）'
external_relation: original
source_book_pages: [627]
source_pdf_pages: [257]
review_status: verified
---

割點與橋是同一套 dfn/low 框架的兩個應用，差別只在判定式用 `>=` 還是 `>`。把 low 的定義背熟，兩者就都不會寫錯。
