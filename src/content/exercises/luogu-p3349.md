---
id: luogu-p3349
volume: lower
source_file: lower-volume
title: 洛谷 P3349 樹到圖的雙射嵌入
chapter: 7
section: '7.5'
kind: external-oj
difficulty: 5
topics: [inclusion-exclusion, tree-dp, graph-homomorphism]
prerequisites: [inclusion-exclusion, tree-dynamic-programming]
statement: >-
  給定同樣有 n 個標號頂點的原圖與一棵樹。求樹頂點到原圖頂點的雙射數量，
  使樹的每條邊映射後都是原圖的一條邊。
constraints:
  - 1 <= n <= 17
  - 0 <= m <= n(n-1)/2
  - 原圖無自環與重邊，後一組 n-1 條邊保證形成樹
input_format: 第一行 n、m；接著 m 行為原圖邊，再接 n-1 行為樹邊。
output_format: 輸出可行對應方式數量；不存在則輸出 0。
samples:
  - input: |
      3 3
      1 2
      2 3
      1 3
      1 2
      2 3
    output: '6'
    explanation: 原圖是完全圖，樹的三個頂點任意雙射到三個原圖頂點都保留邊，共 3!=6。
core_knowledge:
  - 固定可用原圖頂點集合時，樹同態數可由樹形 DP 計算
  - 對未被映射到的原圖頂點做容斥可強制滿射；兩側同為 n 點時即雙射
judgment: 樹與原圖的頂點皆有標號；不同頂點映射即為不同方案。
hints:
  - 暫時允許多個樹頂點映到同一原圖頂點，並限制像只能落在集合 S。
  - 根樹後令 dp[u][v] 表示 u 映到 v 時，其子樹的同態數；每個孩子獨立乘上鄰點和。
  - 對所有 S 加總 (-1)^(n-|S|)hom(S)，容斥後每個原圖頂點至少被使用一次。
solution_outline: 枚舉原圖頂點子集；每個子集執行一次樹形同態 DP，再依漏掉頂點數的奇偶加入答案。
proof_or_invariant: >-
  dp 的孩子乘積枚舉且僅枚舉所有保留樹邊的映射。對任一映射，若其像集合大小為 r，
  它在所有包含該像的 S 中係數和為 (1-1)^(n-r)，只有 r=n 時保留係數 1。
  因定義域也有 n 點，滿射恰為雙射。
common_errors:
  - 直接把樹形 DP 當成答案，未排除多個樹點映到同一點
  - 容斥符號使用 |S| 而忘記與 n 的奇偶差
  - 中間同態數可能超過 64 位元，即使最後雙射數至多 n!
complexity:
  time: O(2^n n(n+m))
  space: O(n^2)
cpp_skeleton: |
  #include <boost/multiprecision/cpp_int.hpp>
  #include <iostream>
  using namespace std;
  using boost::multiprecision::cpp_int;
  int main() {
      int n, m;
      cin >> n >> m;
      // TODO：枚舉可用頂點集合，樹形 DP 計算同態數，再容斥成雙射。
      (void)n;
      (void)m;
      return 0;
  }
cpp_solution: |
  #include <boost/multiprecision/cpp_int.hpp>
  #include <iostream>
  #include <vector>
  using namespace std;
  using boost::multiprecision::cpp_int;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      cin >> n >> m;
      vector<vector<int>> graph(static_cast<size_t>(n));
      for (int i = 0; i < m; ++i) {
          int u, v;
          cin >> u >> v;
          --u;
          --v;
          graph[static_cast<size_t>(u)].push_back(v);
          graph[static_cast<size_t>(v)].push_back(u);
      }
      vector<vector<int>> tree(static_cast<size_t>(n));
      for (int i = 1; i < n; ++i) {
          int u, v;
          cin >> u >> v;
          --u;
          --v;
          tree[static_cast<size_t>(u)].push_back(v);
          tree[static_cast<size_t>(v)].push_back(u);
      }
      vector<int> parent(static_cast<size_t>(n), -1);
      vector<int> order{0};
      for (size_t index = 0; index < order.size(); ++index) {
          const int node = order[index];
          for (int next : tree[static_cast<size_t>(node)]) {
              if (next == parent[static_cast<size_t>(node)]) { continue; }
              parent[static_cast<size_t>(next)] = node;
              order.push_back(next);
          }
      }
      cpp_int answer = 0;
      const int all_masks = 1 << n;
      vector<vector<cpp_int>> dp(static_cast<size_t>(n), vector<cpp_int>(static_cast<size_t>(n)));
      for (int mask = 0; mask < all_masks; ++mask) {
          for (int index = n - 1; index >= 0; --index) {
              const int node = order[static_cast<size_t>(index)];
              for (int image = 0; image < n; ++image) {
                  if ((mask & (1 << image)) == 0) {
                      dp[static_cast<size_t>(node)][static_cast<size_t>(image)] = 0;
                      continue;
                  }
                  cpp_int ways = 1;
                  for (int child : tree[static_cast<size_t>(node)]) {
                      if (parent[static_cast<size_t>(child)] != node) { continue; }
                      cpp_int child_sum = 0;
                      for (int neighbor : graph[static_cast<size_t>(image)]) {
                          if ((mask & (1 << neighbor)) != 0) {
                              child_sum += dp[static_cast<size_t>(child)][static_cast<size_t>(neighbor)];
                          }
                      }
                      ways *= child_sum;
                  }
                  dp[static_cast<size_t>(node)][static_cast<size_t>(image)] = ways;
              }
          }
          cpp_int homomorphisms = 0;
          for (int image = 0; image < n; ++image) {
              homomorphisms += dp[0][static_cast<size_t>(image)];
          }
          if (((n - __builtin_popcount(static_cast<unsigned int>(mask))) & 1) == 0) {
              answer += homomorphisms;
          } else {
              answer -= homomorphisms;
          }
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3349
external_platform: 洛谷
external_problem_id: P3349
external_title: '[ZJOI2016] 小星星'
external_relation: original
source_book_pages: [481, 485]
source_pdf_pages: [111, 115]
review_status: verified
---

先數容易的樹同態，再用容斥把「允許碰撞」逐步收緊成雙射，是本題的核心轉換。
