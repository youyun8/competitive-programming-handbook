---
id: luogu-p3366
volume: lower
source_file: lower-volume
title: 洛谷 P3366 最小生成樹：Kruskal 加並查集
chapter: 10
section: '10.9'
kind: external-oj
difficulty: 2
topics: ['最小生成樹', 'Kruskal', '並查集', '貪心']
prerequisites: ['mst', 'union-find']
statement: |-
  給定一張帶權無向圖，求最小生成樹的邊權總和；若圖不連通則輸出 orz。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '邊數可達 2×10^5，需要 O(m log m) 的排序加並查集'
  - '圖可能不連通，必須判斷並輸出 orz'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；接下來 m 行，每行三個整數 x y z 表示 x 與 y 之間有一條權重 z 的無向邊。'
output_format: '若圖連通則輸出一個整數表示最小生成樹的邊權和；否則輸出 orz。'
samples:
  - input: |
      4 5
      1 2 2
      1 3 2
      1 4 3
      2 3 4
      3 4 3
    output: |
      7
    explanation: |-
      由小到大取邊：權重 2 的 1–2 與 1–3 都不成環，接著權重 3 的 1–4 也不成環，湊滿 3 條邊，總和 2+2+3=7。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    Kruskal 的貪心非常直接：把所有邊依權重由小到大排序，逐條考慮，只要加進去不會成環就選它，直到選滿 n−1 條邊。
  - |-
    「會不會成環」等價於「兩端是否已經連通」，這正是並查集的拿手好戲。查找時做路徑壓縮，整體幾乎是常數時間。
  - |-
    為什麼貪心是對的？切割性質（cut property）：對任意把頂點分成兩半的切割，橫跨這個切割的最小邊一定屬於某棵最小生成樹。Kruskal 每次選的邊，正是某個切割上的最小邊。
  - |-
    判斷不連通不需要額外跑一次 BFS：掃完所有邊後若選中的邊少於 n−1 條，就代表圖不連通。
  - |-
    邊權總和可能超過 32 位元，用 long long 累加。另外 n = 1 時需要 0 條邊，程式要能正確處理（used == n − 1 == 0 成立）。
solution_outline: |-
  把邊依權重排序，並查集初始化為每點自成一集。依序掃邊：兩端已同集就跳過，否則合併並累加權重、邊數加一；選滿 n−1 條即可提前結束。最後檢查邊數是否達到 n−1，未達則輸出 orz。
proof_or_invariant: |-
  迴圈不變量是「已選的邊集合恆為某棵最小生成樹的子集」。歸納步驟由切割性質給出：考慮已選邊構成的連通塊，當前這條最小的跨塊邊是該切割上的最小邊，故必屬於某棵最小生成樹，加入後不變量仍成立。
complexity:
  time: 'O(m log m)，排序主導'
  space: 'O(n + m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static vector<int> parent_of;

  // 已備好：並查集的查找（含路徑壓縮）。
  static int find_root(int x) {
      while (parent_of[static_cast<size_t>(x)] != x) {
          parent_of[static_cast<size_t>(x)] = parent_of[static_cast<size_t>(parent_of[static_cast<size_t>(x)])];
          x = parent_of[static_cast<size_t>(x)];
      }
      return x;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      struct Edge {
          int u, v, w;
      };
      vector<Edge> edges(static_cast<size_t>(m));
      for (Edge& e : edges) { cin >> e.u >> e.v >> e.w; }

      // TODO 1：把邊依權重由小到大排序——Kruskal 的貪心順序。
      parent_of.resize(static_cast<size_t>(n) + 1);
      for (int i = 0; i <= n; ++i) { parent_of[static_cast<size_t>(i)] = i; }

      // TODO 2：依序考慮每條邊。若兩端已在同一集合就跳過（加了會成環），
      //         否則合併兩個集合、把權重累加，並記錄已選邊數。
      // TODO 3：選滿 n-1 條邊代表生成樹完成，可以提早跳出；
      //         若掃完所有邊仍不足 n-1 條，代表圖不連通，輸出 orz。
      long long total = 0;
      int used = 0;
      for (const Edge& e : edges) {
          (void)e;
          (void)find_root;
      }

      if (used == n - 1) {
          cout << total << '\n';
      } else {
          cout << "orz\n";
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // Kruskal：把邊由小到大排序，用並查集判斷是否成環，不成環就選。
  static vector<int> parent_of;

  static int find_root(int x) {
      while (parent_of[static_cast<size_t>(x)] != x) {
          parent_of[static_cast<size_t>(x)] = parent_of[static_cast<size_t>(parent_of[static_cast<size_t>(x)])];
          x = parent_of[static_cast<size_t>(x)];
      }
      return x;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      struct Edge {
          int u, v, w;
      };
      vector<Edge> edges(static_cast<size_t>(m));
      for (Edge& e : edges) { cin >> e.u >> e.v >> e.w; }
      sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) { return a.w < b.w; });

      parent_of.resize(static_cast<size_t>(n) + 1);
      for (int i = 0; i <= n; ++i) { parent_of[static_cast<size_t>(i)] = i; }

      long long total = 0;
      int used = 0;
      for (const Edge& e : edges) {
          const int ru = find_root(e.u);
          const int rv = find_root(e.v);
          if (ru == rv) { continue; }  // 已連通，這條邊會成環
          parent_of[static_cast<size_t>(ru)] = rv;
          total += e.w;
          if (++used == n - 1) { break; }
      }
      if (used == n - 1) {
          cout << total << '\n';
      } else {
          cout << "orz\n";
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3366
external_platform: 洛谷
external_problem_id: P3366
external_title: '【模板】最小生成樹'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

Kruskal 是「排序 + 並查集」的經典組合。把切割性質想清楚，就知道為什麼這麼貪心的做法會是對的。
