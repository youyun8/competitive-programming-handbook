---
id: luogu-p3385
volume: lower
source_file: lower-volume
title: 洛谷 P3385 負環：SPFA 判定負權迴路
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: ['負環', 'SPFA', 'Bellman-Ford', '鴿巢原理']
prerequisites: ['dijkstra']
statement: |-
  給定一張圖，判斷是否存在從 1 號點出發可以到達的負權迴路。邊權非負時該邊為無向邊，邊權為負時只有單向。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '多組測資'
  - '非負權邊是無向的、負權邊是有向的——這個細節容易漏'
  - '只需判斷從 1 號點可達的負環'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行一個整數 T；每組測資第一行兩個整數 n 與 m，接下來 m 行每行三個整數 u v w。'
output_format: '每組測資輸出一行，存在可達的負環輸出 YES，否則輸出 NO。'
samples:
  - input: |
      2
      3 4
      1 2 2
      1 3 4
      2 3 1
      3 1 -6
      3 3
      1 2 2
      2 3 1
      3 1 3
    output: |
      YES
      NO
    explanation: |-
      第一組的 1→2→3→1 總權重為 2+1−6 = −3，是負環；第二組全部非負，不可能有負環。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    先注意題目的建圖規則：**邊權非負時是無向邊**（要加兩個方向），邊權為負時只加單向。漏掉這個條件是這題最常見的失分點。
  - |-
    負環判定的原理是鴿巢原理：一條不含環的最短路最多用 n−1 條邊。若某個點的最短路用了 n 條邊，這條路徑必定重複經過某個點，也就是繞了一個環——而它之所以能讓距離變小，代表那個環的總權重是負的。
  - |-
    所以在 SPFA 裡除了距離，還要維護 `edge_count[v]`＝「目前這條最短路用了幾條邊」，鬆弛時令 `edge_count[v] = edge_count[u] + 1`。一旦達到 n 就判定有負環。
  - |-
    **不要改成計「某點被鬆弛的次數」**。那個數字在完全沒有負權的圖上也可能超過 n——例如兩點之間有多條平行邊時，距離會被連續改小好幾次——會把沒有負環的圖誤判成有。這是實作這題最容易踩的坑。
  - |-
    題目只要求判斷「從 1 號點可達」的負環，所以從 1 開始跑就好，不必為每個連通塊各跑一次。
solution_outline: |-
  依規則建圖（非負權加雙向、負權加單向）。從 1 號點跑 SPFA，同時維護每個點當前最短路的邊數。鬆弛成功時把邊數設為前驅的邊數加一，一旦某點的邊數達到 n 就立即判定存在負環並結束該組測資。
proof_or_invariant: |-
  不變量是「edge_count[v] 等於目前 distance_to[v] 所對應那條路徑的邊數」。無負環時任何最短路都是簡單路徑，邊數不超過 n−1；因此邊數達到 n 當且僅當鬆弛過程沿著一個負權環繞行，兩者互為充要條件。
complexity:
  time: '最壞 O(nm)'
  space: 'O(n + m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests;
      if (!(cin >> tests)) { return 0; }
      while (tests-- > 0) {
          int n, m;
          cin >> n >> m;
          vector<vector<pair<int, long long>>> adjacency(static_cast<size_t>(n) + 1);
          for (int i = 0; i < m; ++i) {
              int u, v;
              long long w;
              cin >> u >> v >> w;
              adjacency[static_cast<size_t>(u)].push_back({v, w});
              // TODO 1：本題的邊權非負時是「無向邊」，負權時只有單向。
              //   下面這行漏掉了反向邊，補上條件判斷。
          }

          const long long kInfinity = LLONG_MAX / 4;
          vector<long long> distance_to(static_cast<size_t>(n) + 1, kInfinity);
          distance_to[1] = 0;
          bool has_negative_cycle = false;

          // TODO 2：用 SPFA 判負環。除了距離之外，再維護 edge_count[v]＝
          //   「目前這條最短路用了幾條邊」，鬆弛時 edge_count[v] = edge_count[u] + 1。
          //   一旦某點的邊數達到 n，依鴿巢原理該路徑必定重複經過某點，即存在負環。
          //
          //   常見錯誤：改成計「某點被鬆弛的次數」。那個數字在正權圖上也可能超過 n
          //   （例如有多條平行邊，距離會被連續改小好幾次），會把沒有負環的圖誤判成有。
          (void)adjacency;
          (void)distance_to;

          cout << (has_negative_cycle ? "YES" : "NO") << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 用 SPFA 判負環：記錄「目前最短路用了幾條邊」，一旦某點的邊數達到 n，
  // 依鴿巢原理該路徑必定重複經過某個點，也就是存在可從起點到達的負環。
  // 注意計的是邊數（edge_count[v] = edge_count[u] + 1），
  // 不是「被鬆弛的次數」——後者在正權圖上也可能超過 n，會誤判。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int tests;
      if (!(cin >> tests)) { return 0; }
      while (tests-- > 0) {
          int n, m;
          cin >> n >> m;
          vector<vector<pair<int, long long>>> adjacency(static_cast<size_t>(n) + 1);
          for (int i = 0; i < m; ++i) {
              int u, v;
              long long w;
              cin >> u >> v >> w;
              adjacency[static_cast<size_t>(u)].push_back({v, w});
              // 邊權非負時是無向邊，負權時只有單向。
              if (w >= 0) { adjacency[static_cast<size_t>(v)].push_back({u, w}); }
          }

          const long long kInfinity = LLONG_MAX / 4;
          vector<long long> distance_to(static_cast<size_t>(n) + 1, kInfinity);
          vector<int> edge_count(static_cast<size_t>(n) + 1, 0);
          vector<char> in_queue(static_cast<size_t>(n) + 1, 0);
          deque<int> queue_nodes{1};
          distance_to[1] = 0;
          in_queue[1] = 1;
          bool has_negative_cycle = false;

          while (!queue_nodes.empty() && !has_negative_cycle) {
              const int node = queue_nodes.front();
              queue_nodes.pop_front();
              in_queue[static_cast<size_t>(node)] = 0;
              for (const auto& [next, weight] : adjacency[static_cast<size_t>(node)]) {
                  const long long candidate = distance_to[static_cast<size_t>(node)] + weight;
                  if (candidate >= distance_to[static_cast<size_t>(next)]) { continue; }
                  distance_to[static_cast<size_t>(next)] = candidate;
                  edge_count[static_cast<size_t>(next)] = edge_count[static_cast<size_t>(node)] + 1;
                  if (edge_count[static_cast<size_t>(next)] >= n) {
                      has_negative_cycle = true;
                      break;
                  }
                  if (!in_queue[static_cast<size_t>(next)]) {
                      queue_nodes.push_back(next);
                      in_queue[static_cast<size_t>(next)] = 1;
                  }
              }
          }
          cout << (has_negative_cycle ? "YES" : "NO") << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3385
external_platform: 洛谷
external_problem_id: P3385
external_title: '【模板】負環'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

判負環的關鍵在於「數邊數」而不是「數次數」。這兩者只差一個字，結果卻天差地遠。
