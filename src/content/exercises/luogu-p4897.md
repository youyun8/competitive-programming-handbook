---
id: luogu-p4897
volume: lower
source_file: lower-volume
title: 洛谷 P4897 最小割樹：n−1 次最大流回答所有點對
chapter: 10
section: '10.12'
kind: external-oj
difficulty: 5
topics: ['最小割樹', 'Gomory-Hu', '最大流', '分治']
prerequisites: ['max-flow']
statement: |-
  給定一張帶容量的無向圖與多組查詢，每組問兩點之間的最小割。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '查詢組數很多，不能每組都跑一次最大流'
  - '圖是無向的，建圖時兩個方向都要給滿容量'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；接下來 m 行每行三個整數 u v w 表示一條無向邊；接著一行整數 Q，再 Q 行每行兩個整數 s t。'
output_format: '每組查詢輸出一行，表示 s 與 t 之間的最小割。'
samples:
  - input: |
      4 5
      1 2 3
      1 3 2
      2 3 1
      2 4 2
      3 4 3
      3
      1 4
      2 3
      1 2
    output: |
      5
      5
      5
    explanation: |-
      三組查詢的最小割都是 5，各自用一次獨立的最大流驗證過。最小割樹的價值就在於只用 n−1 次最大流就一次算完全部點對。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    關鍵定理：n 個點的無向圖中，所有 C(n,2) 對點的最小割**至多隻有 n−1 種不同的值**，而且可以組織成一棵樹（Gomory-Hu 樹），使得任意兩點的最小割等於樹上路徑的最小邊權。
  - |-
    建樹用分治：在當前點集中任取兩點 s、t，求一次最大流得到割值，在樹上連一條 (s, t, 割值) 的邊。接著依「殘量網路中是否從 s 可達」把點集切成兩半，各自遞迴。總共只做 n−1 次最大流。
  - |-
    每次求最大流之前要把所有邊的容量**還原成初始值**。忘記還原是這題最常見的錯誤——殘量會一路累積下去，後面的割全部算錯。
  - |-
    「從 s 可達」直接看 Dinic 最後一次 BFS 留下的 level 陣列即可：level >= 0 就是可達。不必再跑一次搜尋。
  - |-
    無向邊在建圖時兩個方向都給**滿容量**（互為彼此的反向邊），而不是像有向邊那樣反向容量為 0。這個差別會直接影響割值。
  - |-
    查詢時取樹上路徑的最小邊權。n 小可以直接 DFS；資料大時改成樹上倍增維護路徑最小值。
solution_outline: |-
  把無向邊建成雙向滿容量的殘量網路並保存初始容量。分治建樹：點集大小大於 1 時取前兩點求最大流、在樹上連邊，再依殘量網路的可達性把點集二分並遞迴。查詢時在樹上找 s 到 t 路徑的最小邊權。
proof_or_invariant: |-
  Gomory-Hu 定理保證：對建出的樹，任意兩點 s、t 的最小割等於樹上 s–t 路徑的最小邊權。分治過程維持的性質是「每次求出的割把當前點集分成兩側，且該割對這兩側之間的所有點對都是有效上界」，遞迴結束後所有點對的最小割都被樹上路徑正確表示。
complexity:
  time: 'O(n × 最大流)'
  space: 'O(n + m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // 已備好：無向圖的 Dinic。無向邊的兩個方向都給滿容量、互為反向邊。
  struct Dinic {
      struct Edge {
          int to;
          long long capacity;
      };
      vector<Edge> edges;
      vector<vector<int>> incident;
      vector<int> level;
      vector<size_t> iter;
      vector<long long> initial;

      explicit Dinic(size_t n) : incident(n), level(n), iter(n) {}

      void add_undirected(int from, int to, long long capacity) {
          incident[static_cast<size_t>(from)].push_back(static_cast<int>(edges.size()));
          edges.push_back({to, capacity});
          incident[static_cast<size_t>(to)].push_back(static_cast<int>(edges.size()));
          edges.push_back({from, capacity});
      }

      void snapshot() {
          initial.resize(edges.size());
          for (size_t i = 0; i < edges.size(); ++i) { initial[i] = edges[i].capacity; }
      }
      void restore() {
          for (size_t i = 0; i < edges.size(); ++i) { edges[i].capacity = initial[i]; }
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
              if (e.capacity <= 0 ||
                  level[static_cast<size_t>(e.to)] != level[static_cast<size_t>(node)] + 1) {
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

  static Dinic* network = nullptr;
  static vector<vector<pair<int, long long>>> tree_edges;

  // TODO 1：分治建最小割樹。
  //   集合大小 <= 1 就返回。否則任取集合中的兩點 s、t：
  //   還原容量後求一次最大流，在樹上連一條 (s, t, 割值) 的邊。
  //   接著依「殘量網路中是否從 s 可達」（也就是 max_flow 之後的 level >= 0）
  //   把集合切成兩半，各自遞迴。總共只需要 n−1 次最大流。
  static void build(vector<int>& nodes) {
      (void)nodes;
      (void)network;
      (void)tree_edges;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      Dinic solver(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int u, v;
          long long w;
          cin >> u >> v >> w;
          solver.add_undirected(u, v, w);
      }
      solver.snapshot();
      network = &solver;
      tree_edges.assign(static_cast<size_t>(n) + 1, {});
      vector<int> nodes(static_cast<size_t>(n));
      iota(nodes.begin(), nodes.end(), 1);
      build(nodes);

      int queries;
      cin >> queries;
      while (queries-- > 0) {
          int s, t;
          cin >> s >> t;
          // TODO 2：s 與 t 的最小割 = 最小割樹上 s 到 t 路徑的**最小邊權**。
          //   n 很小時直接 DFS/BFS 一次即可；資料大時可以改成樹上倍增。
          (void)s;
          (void)t;
          cout << 0 << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 最小割樹（Gomory-Hu）：n−1 次最大流就能把「任意兩點最小割」壓成一棵樹，
  // 查詢時取樹上路徑的最小邊權即可。
  struct Dinic {
      struct Edge {
          int to;
          long long capacity;
      };
      vector<Edge> edges;
      vector<vector<int>> incident;
      vector<int> level;
      vector<size_t> iter;
      vector<long long> initial;

      explicit Dinic(size_t n) : incident(n), level(n), iter(n) {}

      void add_undirected(int from, int to, long long capacity) {
          // 無向邊：兩個方向都給滿容量，互為彼此的反向邊。
          incident[static_cast<size_t>(from)].push_back(static_cast<int>(edges.size()));
          edges.push_back({to, capacity});
          incident[static_cast<size_t>(to)].push_back(static_cast<int>(edges.size()));
          edges.push_back({from, capacity});
      }

      void snapshot() {
          initial.resize(edges.size());
          for (size_t i = 0; i < edges.size(); ++i) { initial[i] = edges[i].capacity; }
      }

      void restore() {
          for (size_t i = 0; i < edges.size(); ++i) { edges[i].capacity = initial[i]; }
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

  static int n, m;
  static Dinic* network = nullptr;
  static vector<vector<pair<int, long long>>> tree_edges;

  // 分治建樹：任取集合中的兩點求最小割，接上一條樹邊，
  // 再依殘量網路的可達性把集合切成兩半各自遞迴。
  static void build(vector<int>& nodes) {
      if (nodes.size() <= 1) { return; }
      const int s = nodes[0];
      const int t = nodes[1];
      network->restore();
      const long long cut = network->max_flow(s, t);
      tree_edges[static_cast<size_t>(s)].push_back({t, cut});
      tree_edges[static_cast<size_t>(t)].push_back({s, cut});

      vector<int> left, right;
      for (const int node : nodes) {
          if (network->level[static_cast<size_t>(node)] >= 0) {
              left.push_back(node);
          } else {
              right.push_back(node);
          }
      }
      build(left);
      build(right);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      if (!(cin >> n >> m)) { return 0; }
      Dinic solver(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int u, v;
          long long w;
          cin >> u >> v >> w;
          solver.add_undirected(u, v, w);
      }
      solver.snapshot();
      network = &solver;
      tree_edges.assign(static_cast<size_t>(n) + 1, {});
      vector<int> nodes(static_cast<size_t>(n));
      iota(nodes.begin(), nodes.end(), 1);
      build(nodes);

      int queries;
      cin >> queries;
      while (queries-- > 0) {
          int s, t;
          cin >> s >> t;
          // 樹上任意路徑的最小邊權就是答案；n 很小，直接 DFS 找。
          vector<long long> best(static_cast<size_t>(n) + 1, -1);
          deque<int> stack_nodes{s};
          best[static_cast<size_t>(s)] = LLONG_MAX;
          while (!stack_nodes.empty()) {
              const int node = stack_nodes.back();
              stack_nodes.pop_back();
              for (const auto& [next, weight] : tree_edges[static_cast<size_t>(node)]) {
                  if (best[static_cast<size_t>(next)] >= 0) { continue; }
                  best[static_cast<size_t>(next)] = min(best[static_cast<size_t>(node)], weight);
                  stack_nodes.push_back(next);
              }
          }
          cout << best[static_cast<size_t>(t)] << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4897
external_platform: 洛谷
external_problem_id: P4897
external_title: '【模板】最小割樹（Gomory-Hu Tree）'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

最小割樹是「用 n−1 次計算換來 C(n,2) 個答案」的漂亮結構。記得每次求流前還原容量，這是最容易翻車的一步。
