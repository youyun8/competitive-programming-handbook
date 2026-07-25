---
id: luogu-p5960
volume: lower
source_file: lower-volume
title: 洛谷 P5960 差分約束：把不等式組變成最短路
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: ['差分約束', 'SPFA', '最短路徑', '三角不等式']
prerequisites: ['dijkstra']
statement: |-
  給定 m 條形如 x_a − x_b <= y 的約束，求一組滿足全部約束的整數解；若無解則輸出 NO。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '約束可能互相矛盾，此時輸出 NO'
  - '解不唯一，輸出任意一組合法解即可'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；接下來 m 行，每行三個整數 c1 c2 y，表示約束 x_{c1} − x_{c2} <= y。'
output_format: '若有解則輸出一行 n 個整數表示一組解；否則輸出 NO。'
samples:
  - input: |
      3 4
      1 2 3
      2 3 -2
      1 3 1
      3 1 2
    output: |
      0 -2 0
    explanation: |-
      把 x = (0, −2, 0) 代入四條約束：0−(−2)=2 <= 3、(−2)−0=−2 <= −2、0−0=0 <= 1、0−0=0 <= 2，全部成立。把整組解平移同一個常數也仍然合法，因此答案不唯一。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    把約束 x_a − x_b <= y 改寫成 x_a <= x_b + y。再看最短路的三角不等式：dist[a] <= dist[b] + w(b→a)。兩者形式完全相同——所以只要建一條 **b → a、權重 y** 的邊，求出的最短路就是一組合法解。
  - |-
    方向很容易搞反。記法：不等式左邊被減的那個變數是邊的終點，右邊那個是起點。
  - |-
    有些點可能不在任何約束裡，或整張圖不連通，那樣它們的距離會是無限大。解法是加一個**超級源點**連向所有點、權重 0，保證全部可達，同時也讓「全部取 0」成為合法的起始基準。
  - |-
    約束互相矛盾時會出現負環（沿著環走一圈能無限變小），用 SPFA 的邊數計數判定即可：某點的最短路邊數超過 n 就輸出 NO。
  - |-
    解不唯一是正常的：把一組解整體平移同一個常數仍然是解，因為所有約束都只涉及差值。所以輸出任何一組都算對。
solution_outline: |-
  對每條約束 x_a − x_b <= y 建一條 b → a、權重 y 的邊。再加超級源點 0 向所有點連權重 0 的邊。從超級源點跑 SPFA 並用邊數計數偵測負環：有負環輸出 NO，否則 dist[1..n] 就是一組合法解。
proof_or_invariant: |-
  三角不等式 dist[a] <= dist[b] + w(b→a) 在 SPFA 收斂後對每條邊都成立，而這正是原約束 x_a − x_b <= y。反之若約束組可滿足，則任一組解都給出圖上無負環的證明。因此「有解」與「無負環」互為充要條件。
complexity:
  time: '最壞 O(nm)'
  space: 'O(n + m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<vector<pair<int, long long>>> adjacency(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int a, b;
          long long y;
          cin >> a >> b >> y;
          // TODO 1：把約束 x_a − x_b <= y 建成一條邊。
          //   最短路的三角不等式是 dist[a] <= dist[b] + w(b→a)，
          //   兩式對照可知應該加一條 b → a、權重 y 的邊。
          (void)a;
          (void)b;
          (void)y;
      }

      // TODO 2：加一個超級源點 0，向每個點連權重 0 的邊。
      //   這保證所有點都可達（否則孤立的點沒有值），
      //   同時讓「全部取 0」成為合法的起始解。

      // TODO 3：從超級源點跑 SPFA。維護 edge_count 判負環：
      //   某點的最短路邊數超過 n 就代表約束互相矛盾，輸出 NO。
      //   否則 dist[i] 就是一組合法解——三角不等式恰好等價於原本的約束。
      (void)adjacency;
      cout << "NO\n";
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 差分約束：把 x_a − x_b <= y 看成一條 b → a、權重 y 的邊，
  // 那麼「最短路的三角不等式 dist[a] <= dist[b] + y」正好就是這條約束。
  // 於是求一組解等價於求單源最短路；有負環代表約束互相矛盾、無解。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<vector<pair<int, long long>>> adjacency(static_cast<size_t>(n) + 1);
      for (int i = 0; i < m; ++i) {
          int a, b;
          long long y;
          cin >> a >> b >> y;
          adjacency[static_cast<size_t>(b)].push_back({a, y});
      }
      // 超級源點 0 連向每個點、權重 0，保證所有點都可達，
      // 同時讓所有 x_i <= 0 這組平凡解成為起點。
      for (int i = 1; i <= n; ++i) { adjacency[0].push_back({i, 0}); }

      const long long kInfinity = LLONG_MAX / 4;
      vector<long long> distance_to(static_cast<size_t>(n) + 1, kInfinity);
      vector<int> edge_count(static_cast<size_t>(n) + 1, 0);
      vector<char> in_queue(static_cast<size_t>(n) + 1, 0);
      deque<int> queue_nodes{0};
      distance_to[0] = 0;
      in_queue[0] = 1;

      while (!queue_nodes.empty()) {
          const int node = queue_nodes.front();
          queue_nodes.pop_front();
          in_queue[static_cast<size_t>(node)] = 0;
          for (const auto& [next, weight] : adjacency[static_cast<size_t>(node)]) {
              const long long candidate = distance_to[static_cast<size_t>(node)] + weight;
              if (candidate >= distance_to[static_cast<size_t>(next)]) { continue; }
              distance_to[static_cast<size_t>(next)] = candidate;
              edge_count[static_cast<size_t>(next)] = edge_count[static_cast<size_t>(node)] + 1;
              if (edge_count[static_cast<size_t>(next)] > n) { cout << "NO\n"; return 0; }
              if (!in_queue[static_cast<size_t>(next)]) {
                  queue_nodes.push_back(next);
                  in_queue[static_cast<size_t>(next)] = 1;
              }
          }
      }
      for (int i = 1; i <= n; ++i) { cout << distance_to[static_cast<size_t>(i)] << " \n"[i == n]; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5960
external_platform: 洛谷
external_problem_id: P5960
external_title: '【模板】差分約束'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

差分約束是「換個角度看不等式」的經典案例。把三角不等式和約束並排寫出來，建圖方向就一目了然。
