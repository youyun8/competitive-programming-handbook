---
id: luogu-p3806
volume: upper
source_file: upper-volume
title: 洛谷 P3806 點分治：樹上是否存在給定長度的路徑
chapter: 4
section: '4.9'
kind: external-oj
difficulty: 5
topics: ['點分治', '重心', '分治', '樹上路徑']
prerequisites: ['tree-divide-and-conquer']
core_knowledge: [樹重心, 點分治, 距離配對]
judgment: 每條路徑可在某一層依是否經過重心分類；逐子樹合併距離並遞迴剩餘連通塊，可避免枚舉所有點對。
statement: |-
  給定一棵帶邊權的樹與若干詢問，每個詢問給一個長度 k，回答樹上是否存在一條長度恰為 k 的簡單路徑。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '1 <= n <= 10000，1 <= m <= 100'
  - '1 <= 邊權 <= 1000'
  - '1 <= 每個詢問長度 <= 10000000'
input_format: '第一行兩個整數 n 與 m；接下來 n−1 行每行三個整數 u、v、w 表示一條邊權為 w 的邊；最後 m 行每行一個詢問長度 k。'
output_format: '對每個詢問輸出一行，存在輸出 `AYE`，否則輸出 `NAY`。'
samples:
  - input: |
      7 5
      1 2 2
      1 3 3
      2 4 4
      2 5 1
      3 6 5
      3 7 2
      6
      5
      9
      11
      100
    output: |
      AYE
      AYE
      AYE
      AYE
      NAY
    explanation: |-
      長度 5 對應路徑 4–2–5（4+1），長度 11 對應路徑 5–2–1–3–6（1+2+3+5）；100 超過整棵樹的直徑，故為 NAY。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    樹上路徑問題的通用切法：選一個點當「分治中心」，把路徑分成**經過它**與**完全在某棵子樹內**兩類。後者遞迴處理，於是隻要會算前者就行。
  - |-
    分治中心不能隨便選——選到鏈的端點就退化成 O(n²)。要選**重心**：刪掉它之後最大的那塊最小。重心保證每塊大小不超過原來的一半，所以遞迴深度是 O(log n)。
  - |-
    算「經過重心的路徑」時，兩個端點必須來自**不同子樹**，否則路徑根本不經過重心。技巧是逐棵子樹處理：先拿「先前子樹累積的距離集合」回答詢問，再把本子樹的距離併進集合。
solution_outline: |-
  遞迴函式 solve(root)：先算連通塊大小並找出重心，標記重心為已刪。對重心的每棵子樹做一次 DFS 收集所有到重心的距離；每收集完一棵，先用「已累積的距離集合」逐一檢查未回答的詢問（need − d 是否可達），再把本棵的距離併入集合。處理完後只清除本層改動過的標記，最後對每棵子樹遞迴。
proof_or_invariant: |-
  重心的定義保證「刪掉它之後最大子塊 ≤ n/2」，因此遞迴深度 O(log n)，每層總共只走 O(n) 個點。正確性來自兩點：任一條簡單路徑必定在某一層恰好經過該層的重心一次；而逐棵子樹「先查詢再併入」保證配對的兩個距離必來自不同子樹，不會把同一棵子樹內的兩點誤配成經過重心的路徑。
complexity:
  time: 'O(n log n × m) 量級（每層對每個詢問掃描距離集合）'
  space: 'O(n + V)，V 為詢問長度上界'
common_errors:
  - 同一棵重心子樹的兩個距離互相配對
  - 忘記先加入距離 0，漏掉以重心為端點的路徑
  - 每層清空整個值域陣列而使時間複雜度退化
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<vector<pair<int, int>>> adjacency(static_cast<size_t>(n) + 1);
      for (int i = 0; i < n - 1; ++i) {
          int u, v, w;
          cin >> u >> v >> w;
          adjacency[static_cast<size_t>(u)].push_back({v, w});
          adjacency[static_cast<size_t>(v)].push_back({u, w});
      }
      vector<int> queries(static_cast<size_t>(m));
      for (int& q : queries) { cin >> q; }

      // TODO：點分治。
      //   1. 找**重心**：讓「刪掉它之後最大子樹」最小的那個點。
      //      重心的性質保證每個子塊大小至多是原來的一半，遞迴深度 O(log n)。
      //   2. 統計所有**經過重心**的路徑：對重心的每棵子樹依序處理，
      //      先拿已累積的距離集合回答詢問（保證兩端來自不同子樹），
      //      再把本子樹的距離併進集合。
      //   3. 刪掉重心，對每棵子樹遞迴。
      //   實作細節：距離集合用一個大布林陣列標記，清空時只清「改動過的位置」，
      //   不要每層都 memset 整個陣列，否則複雜度會退化。
      // 下面是 O(n²) 的樸素版本：對每個起點各做一次 BFS/DFS 求距離。
      set<long long> reachable;
      for (int s = 1; s <= n; ++s) {
          vector<long long> distance_to(static_cast<size_t>(n) + 1, -1);
          vector<int> stack_nodes{s};
          distance_to[static_cast<size_t>(s)] = 0;
          while (!stack_nodes.empty()) {
              const int node = stack_nodes.back();
              stack_nodes.pop_back();
              for (const auto& [next, weight] : adjacency[static_cast<size_t>(node)]) {
                  if (distance_to[static_cast<size_t>(next)] >= 0) { continue; }
                  distance_to[static_cast<size_t>(next)] = distance_to[static_cast<size_t>(node)] + weight;
                  stack_nodes.push_back(next);
              }
          }
          for (int t = 1; t <= n; ++t) {
              if (t != s && distance_to[static_cast<size_t>(t)] >= 0) {
                  reachable.insert(distance_to[static_cast<size_t>(t)]);
              }
          }
      }
      for (const int q : queries) { cout << (reachable.count(q) ? "AYE" : "NAY") << '\n'; }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 點分治：每次找出重心，統計「經過重心」的路徑，再把重心刪掉遞迴各子樹。
  // 每層的子樹大小至多減半，所以遞迴深度是 O(log n)。
  static const int kMaxDistance = 10000000;

  static int n_global, m_global;
  static vector<vector<pair<int, int>>> adjacency;
  static vector<char> removed;
  static vector<int> subtree_size;
  static vector<char> achievable;   // 目前重心下已出現過的距離
  static vector<int> touched;       // 記錄改動過的位置，之後只清這些
  static vector<int> queries;
  static vector<char> answer;

  // 求以 root 為根、忽略已刪點的連通塊大小，同時找重心。
  static int count_nodes(int root) {
      int total = 0;
      vector<pair<int, int>> stack_nodes{{root, 0}};
      while (!stack_nodes.empty()) {
          const auto [node, parent] = stack_nodes.back();
          stack_nodes.pop_back();
          ++total;
          for (const auto& [next, weight] : adjacency[static_cast<size_t>(node)]) {
              (void)weight;
              if (next == parent || removed[static_cast<size_t>(next)]) { continue; }
              stack_nodes.push_back({next, node});
          }
      }
      return total;
  }

  static int find_centroid(int root, int total) {
      vector<pair<int, int>> stack_nodes{{root, 0}};
      vector<pair<int, int>> order;
      while (!stack_nodes.empty()) {
          const auto entry = stack_nodes.back();
          stack_nodes.pop_back();
          order.push_back(entry);
          subtree_size[static_cast<size_t>(entry.first)] = 1;
          for (const auto& [next, weight] : adjacency[static_cast<size_t>(entry.first)]) {
              (void)weight;
              if (next == entry.second || removed[static_cast<size_t>(next)]) { continue; }
              stack_nodes.push_back({next, entry.first});
          }
      }
      int centroid = root;
      int best = total;
      for (size_t i = order.size(); i-- > 0;) {
          const auto [node, parent] = order[i];
          int largest = total - subtree_size[static_cast<size_t>(node)];
          for (const auto& [next, weight] : adjacency[static_cast<size_t>(node)]) {
              (void)weight;
              if (next == parent || removed[static_cast<size_t>(next)]) { continue; }
              subtree_size[static_cast<size_t>(node)] += subtree_size[static_cast<size_t>(next)];
              largest = max(largest, subtree_size[static_cast<size_t>(next)]);
          }
          largest = max(largest, total - subtree_size[static_cast<size_t>(node)]);
          if (largest < best) {
              best = largest;
              centroid = node;
          }
      }
      return centroid;
  }

  static void collect(int root, int parent, int distance, vector<int>& out) {
      if (distance > kMaxDistance) { return; }
      out.push_back(distance);
      for (const auto& [next, weight] : adjacency[static_cast<size_t>(root)]) {
          if (next == parent || removed[static_cast<size_t>(next)]) { continue; }
          collect(next, root, distance + weight, out);
      }
  }

  static void solve(int root) {
      const int total = count_nodes(root);
      const int centroid = find_centroid(root, total);
      removed[static_cast<size_t>(centroid)] = 1;

      achievable[0] = 1;
      touched.push_back(0);
      for (const auto& [next, weight] : adjacency[static_cast<size_t>(centroid)]) {
          if (removed[static_cast<size_t>(next)]) { continue; }
          vector<int> distances;
          collect(next, centroid, weight, distances);
          // 先用「先前子樹」的距離集合回答詢問，再把本子樹併進去，
          // 這樣配對的兩個端點必定來自不同子樹。
          for (int q = 0; q < m_global; ++q) {
              if (answer[static_cast<size_t>(q)]) { continue; }
              const int need = queries[static_cast<size_t>(q)];
              for (const int d : distances) {
                  if (d <= need && achievable[static_cast<size_t>(need - d)]) {
                      answer[static_cast<size_t>(q)] = 1;
                      break;
                  }
              }
          }
          for (const int d : distances) {
              if (!achievable[static_cast<size_t>(d)]) {
                  achievable[static_cast<size_t>(d)] = 1;
                  touched.push_back(d);
              }
          }
      }
      for (const int d : touched) { achievable[static_cast<size_t>(d)] = 0; }
      touched.clear();

      for (const auto& [next, weight] : adjacency[static_cast<size_t>(centroid)]) {
          (void)weight;
          if (removed[static_cast<size_t>(next)]) { continue; }
          solve(next);
      }
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      if (!(cin >> n_global >> m_global)) { return 0; }
      adjacency.assign(static_cast<size_t>(n_global) + 1, {});
      for (int i = 0; i < n_global - 1; ++i) {
          int u, v, w;
          cin >> u >> v >> w;
          adjacency[static_cast<size_t>(u)].push_back({v, w});
          adjacency[static_cast<size_t>(v)].push_back({u, w});
      }
      queries.assign(static_cast<size_t>(m_global), 0);
      for (int& q : queries) { cin >> q; }
      answer.assign(static_cast<size_t>(m_global), 0);
      removed.assign(static_cast<size_t>(n_global) + 1, 0);
      subtree_size.assign(static_cast<size_t>(n_global) + 1, 0);
      achievable.assign(static_cast<size_t>(kMaxDistance) + 1, 0);
      solve(1);
      for (int q = 0; q < m_global; ++q) {
          cout << (answer[static_cast<size_t>(q)] ? "AYE" : "NAY") << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3806
external_platform: 洛谷
external_problem_id: P3806
external_title: '【模板】點分治'
external_relation: original
source_book_pages: [256, 276]
source_pdf_pages: [274, 294]
review_status: verified
---

點分治是「樹上的分治」的起手式。真正的門檻不是程式碼長度，而是兩個細節：重心保證了複雜度，逐子樹合併保證了正確性。少了任何一個，這個演算法就不成立。
