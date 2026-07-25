---
id: luogu-p3376
volume: lower
source_file: lower-volume
title: 洛谷 P3376 網路最大流：Dinic 演算法
chapter: 10
section: '10.10'
kind: external-oj
difficulty: 4
topics: ['最大流', 'Dinic', '殘量網路', '分層圖']
prerequisites: ['max-flow']
statement: |-
  給定一張帶容量的有向圖與源點、匯點，求從源點到匯點的最大流量。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '需要 Dinic 或 ISAP 等高效演算法，樸素增廣會超時'
  - '流量總和可能超過 32 位元，需用 long long'
  - '可能有重邊與反向邊'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行四個整數 n、m、s、t；接下來 m 行，每行三個整數 u v w 表示一條 u 到 v、容量 w 的有向邊。'
output_format: '一行一個整數，表示最大流量。'
samples:
  - input: |
      4 5 1 4
      1 2 3
      1 3 2
      2 3 1
      2 4 2
      3 4 3
    output: |
      5
    explanation: |-
      源點 1 最多送出 3+2=5，匯點 4 最多接收 2+3=5，且確實存在流量 5 的方案，因此最大流是 5。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    把邊**成對**存進同一個陣列：正向邊在偶數位、反向邊在奇數位，於是 `i ^ 1` 就是配對邊。反向邊初始容量為 0，推流時正向減、反向加——這讓演算法有機會「反悔」，是最大流正確性的關鍵。
  - |-
    Dinic 分兩層。外層用 BFS 依殘量網路建**分層圖**，level[v] 是 s 到 v 的最短邊數；若 t 不可達就結束。內層在分層圖上 DFS 找增廣路，且只走 level 恰好加一的邊。
  - |-
    為什麼要限制只走 level+1 的邊？這保證每條增廣路都是當前殘量網路中的**最短路**。每輪結束後最短路長度至少加一，而長度上限是 n，所以最多 O(n) 輪。
  - |-
    內層要加「當前弧優化」：用 iter[v] 記錄 v 已經試到第幾條出邊，同一輪內走不通的邊不再重試。少了這個優化複雜度會退化，模板題就會超時。
  - |-
    正確性的收尾是最大流最小割定理：當 BFS 找不到到 t 的路徑時，已訪問點集與其餘點構成一個割，其容量等於當前流量，因此該流量已是最大。這個定理也是驗證答案的好工具——小圖可以枚舉所有割來對拍。
solution_outline: |-
  用成對存放的邊陣列表示殘量網路。反覆執行：BFS 建分層圖（只走剩餘容量為正的邊），若匯點不可達則結束；否則在分層圖上以 DFS 榨乾阻塞流，配合當前弧優化避免重複嘗試。累加每次推送的流量即為答案。
proof_or_invariant: |-
  每輪 BFS 後的分層圖只含最短增廣路。可以證明每輪結束後 s 到 t 的最短距離嚴格增加，故至多 O(n) 輪；每輪內的阻塞流在當前弧優化下為 O(nm)，總計 O(n²m)。演算法終止時 t 在殘量網路中不可達，由最大流最小割定理，此時的流量即為最大流。
complexity:
  time: '一般圖 O(n²m)，單位容量圖更快'
  space: 'O(n + m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // 已備好：殘量網路的骨架。邊成對存放，i^1 就是反向邊，
  // 這個技巧讓「退流」變成對反向邊加容量。
  struct Dinic {
      struct Edge {
          int to;
          long long capacity;
      };
      vector<Edge> edges;
      vector<vector<int>> incident;
      vector<int> level;
      vector<size_t> iter;

      explicit Dinic(size_t n) : incident(n), level(n), iter(n) {}

      void add_edge(int from, int to, long long capacity) {
          incident[static_cast<size_t>(from)].push_back(static_cast<int>(edges.size()));
          edges.push_back({to, capacity});
          incident[static_cast<size_t>(to)].push_back(static_cast<int>(edges.size()));
          edges.push_back({from, 0});
      }

      // TODO 1：BFS 建分層圖。level[v] 是 source 到 v 在殘量網路上的最短邊數，
      //   只走 capacity > 0 的邊。回傳 sink 是否可達。
      bool build_levels(int source, int sink) {
          fill(level.begin(), level.end(), -1);
          (void)source;
          (void)sink;
          return false;
      }

      // TODO 2：在分層圖上 DFS 找增廣路，只沿 level 恰好 +1 的邊走。
      //   找到就沿路扣正向容量、加反向容量。iter 記錄每個點試到第幾條邊，
      //   讓同一輪不會重複嘗試已經走不通的邊（當前弧優化）。
      long long push_flow(int node, int sink, long long limit) {
          if (node == sink) { return limit; }
          (void)limit;
          return 0;
      }

      // TODO 3：外層反覆「建分層圖 → 榨乾阻塞流」，直到 sink 不可達。
      long long max_flow(int source, int sink) {
          long long total = 0;
          (void)source;
          (void)sink;
          return total;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, source, sink;
      if (!(cin >> n >> m >> source >> sink)) { return 0; }
      Dinic solver(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int u, v;
          long long w;
          cin >> u >> v >> w;
          solver.add_edge(u, v, w);
      }
      cout << solver.max_flow(source, sink) << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // Dinic：反覆用 BFS 建分層圖，再用 DFS 在分層圖上找阻塞流。
  struct Dinic {
      struct Edge {
          int to;
          long long capacity;
      };
      vector<Edge> edges;                 // 成對存放，i^1 就是反向邊
      vector<vector<int>> incident;
      vector<int> level;
      vector<size_t> iter;

      explicit Dinic(size_t n) : incident(n), level(n), iter(n) {}

      void add_edge(int from, int to, long long capacity) {
          incident[static_cast<size_t>(from)].push_back(static_cast<int>(edges.size()));
          edges.push_back({to, capacity});
          incident[static_cast<size_t>(to)].push_back(static_cast<int>(edges.size()));
          edges.push_back({from, 0});
      }

      bool build_levels(int source, int sink) {
          fill(level.begin(), level.end(), -1);
          deque<int> queue_nodes{source};
          level[static_cast<size_t>(source)] = 0;
          while (!queue_nodes.empty()) {
              const int node = queue_nodes.front();
              queue_nodes.pop_front();
              for (const int id : incident[static_cast<size_t>(node)]) {
                  const Edge& e = edges[static_cast<size_t>(id)];
                  if (e.capacity > 0 && level[static_cast<size_t>(e.to)] < 0) {
                      level[static_cast<size_t>(e.to)] = level[static_cast<size_t>(node)] + 1;
                      queue_nodes.push_back(e.to);
                  }
              }
          }
          return level[static_cast<size_t>(sink)] >= 0;
      }

      long long push_flow(int node, int sink, long long limit) {
          if (node == sink) { return limit; }
          for (size_t& index = iter[static_cast<size_t>(node)];
               index < incident[static_cast<size_t>(node)].size(); ++index) {
              const int id = incident[static_cast<size_t>(node)][index];
              Edge& e = edges[static_cast<size_t>(id)];
              if (e.capacity <= 0 || level[static_cast<size_t>(e.to)] != level[static_cast<size_t>(node)] + 1) {
                  continue;
              }
              const long long pushed = push_flow(e.to, sink, min(limit, e.capacity));
              if (pushed > 0) {
                  e.capacity -= pushed;
                  edges[static_cast<size_t>(id ^ 1)].capacity += pushed;
                  return pushed;
              }
          }
          return 0;
      }

      long long max_flow(int source, int sink) {
          long long total = 0;
          while (build_levels(source, sink)) {
              fill(iter.begin(), iter.end(), 0);
              while (const long long pushed = push_flow(source, sink, LLONG_MAX)) { total += pushed; }
          }
          return total;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, source, sink;
      if (!(cin >> n >> m >> source >> sink)) { return 0; }
      Dinic solver(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int u, v;
          long long w;
          cin >> u >> v >> w;
          solver.add_edge(u, v, w);
      }
      cout << solver.max_flow(source, sink) << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3376
external_platform: 洛谷
external_problem_id: P3376
external_title: '【模板】網路最大流'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

Dinic 是網路流的主力。反向邊、分層圖、當前弧優化這三件事缺一不可，少任何一個不是算錯就是超時。
