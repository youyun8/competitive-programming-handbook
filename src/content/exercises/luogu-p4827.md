---
id: luogu-p4827
volume: lower
source_file: lower-volume
title: 洛谷 P4827 樹上距離 k 次方和
chapter: 7
section: '7.6'
kind: external-oj
difficulty: 5
topics: [stirling-number, tree-dp, rerooting]
prerequisites: [catalan-stirling, tree-dp]
statement: 給一棵 n 點、每邊長一的樹與正整數 k。對每個點 u，求所有點 v 的 dist(u,v)^k 之和，答案模 10007。
constraints: [1 <= n <= 50000, 1 <= k <= 150]
input_format: 第一行 n、k；接著 n-1 行各給一條無向邊 u、v。
output_format: 輸出 n 行，第 u 行為以 u 為首都的距離 k 次方和模 10007。
samples:
  - input: |-
      5 2
      1 2
      1 3
      2 4
      2 5
    output: |-
      10
      7
      23
      18
      18
    explanation: 以點 1 為例，距離為 0、1、1、2、2，平方和是 10。
core_knowledge: [冪轉下降階乘, 第二類 Stirling 數, Pascal 恆等式, 換根 DP]
judgment: 直接維護距離冪，跨一條邊時會混合所有低次冪；改維護 C(dist,j) 後只相鄰兩階。
hints:
  - 使用 x^k=Σ_j S(k,j)j!C(x,j)。
  - 距離增加一時，C(d+1,j)=C(d,j)+C(d,j-1)。
  - 先算子樹貢獻，再把父側貢獻移到每個孩子。
solution_outline: 預處理 S(k,j)j!。任選根建立父子序；由下往上算 down[u][j]=Σ_(v 在 u 子樹)C(dist(u,v),j)。再由上往下令 all[u] 表示全樹同類和，扣除孩子子樹在 u 的貢獻後，把其餘部分距離加一並加入孩子。最後線性組合各階。
proof_or_invariant: Stirling 恆等式逐距離成立，故交換求和後只需 all[u][j]。down 的合併由 Pascal 恆等式精確把孩子座標的距離加一。換根時先扣掉孩子對父親的完整貢獻，再把剩餘點距離加一，因此每個點恰被計一次；依樹序歸納 all 正確。
common_errors:
  - 把模數寫成常見 NTT 模數
  - j=0 時存取 j-1
  - 換根只減 down[v][j] 而漏減 down[v][j-1]
  - 遞迴深度爆棧
complexity: { time: 'O(nk+k^2)', space: 'O(nk)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n, k; cin >> n >> k; /* TODO: Stirling 轉換與換根 DP。 */ return 0; }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;
  constexpr int mod_value = 10007;
  int normalize(int value) {
      value %= mod_value;
      if (value < 0) value += mod_value;
      return value;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int k;
      cin >> n >> k;
      vector<vector<int>> graph(static_cast<size_t>(n));
      for (int i = 1; i < n; ++i) {
          int u;
          int v;
          cin >> u >> v;
          --u;
          --v;
          graph[static_cast<size_t>(u)].push_back(v);
          graph[static_cast<size_t>(v)].push_back(u);
      }
      vector<int> parent(static_cast<size_t>(n), -1);
      vector<int> order;
      order.reserve(static_cast<size_t>(n));
      order.push_back(0);
      for (size_t index = 0; index < order.size(); ++index) {
          const int u = order[index];
          for (int v : graph[static_cast<size_t>(u)]) {
              if (v == parent[static_cast<size_t>(u)]) continue;
              parent[static_cast<size_t>(v)] = u;
              order.push_back(v);
          }
      }
      const int width = k + 1;
      vector<int> down(static_cast<size_t>(n) * static_cast<size_t>(width));
      const auto position = [width](int u, int j) {
          return static_cast<size_t>(u) * static_cast<size_t>(width) + static_cast<size_t>(j);
      };
      for (int u = 0; u < n; ++u) down[position(u, 0)] = 1;
      for (auto iterator = order.rbegin(); iterator != order.rend(); ++iterator) {
          const int u = *iterator;
          const int p = parent[static_cast<size_t>(u)];
          if (p < 0) continue;
          down[position(p, 0)] = normalize(down[position(p, 0)] + down[position(u, 0)]);
          for (int j = 1; j <= k; ++j)
              down[position(p, j)] = normalize(
                  down[position(p, j)] + down[position(u, j)] + down[position(u, j - 1)]);
      }
      vector<int> all = down;
      vector<int> outside(static_cast<size_t>(width));
      for (int u : order) {
          for (int v : graph[static_cast<size_t>(u)]) {
              if (parent[static_cast<size_t>(v)] != u) continue;
              outside[0] = normalize(all[position(u, 0)] - down[position(v, 0)]);
              for (int j = 1; j <= k; ++j)
                  outside[static_cast<size_t>(j)] = normalize(
                      all[position(u, j)] - down[position(v, j)] - down[position(v, j - 1)]);
              all[position(v, 0)] = normalize(down[position(v, 0)] + outside[0]);
              for (int j = 1; j <= k; ++j)
                  all[position(v, j)] = normalize(
                      down[position(v, j)] + outside[static_cast<size_t>(j)] +
                      outside[static_cast<size_t>(j - 1)]);
          }
      }
      vector<vector<int>> stirling(
          static_cast<size_t>(k) + 1U, vector<int>(static_cast<size_t>(k) + 1U));
      stirling[0][0] = 1;
      for (int i = 1; i <= k; ++i)
          for (int j = 1; j <= i; ++j)
              stirling[static_cast<size_t>(i)][static_cast<size_t>(j)] = normalize(
                  stirling[static_cast<size_t>(i - 1)][static_cast<size_t>(j - 1)] +
                  j * stirling[static_cast<size_t>(i - 1)][static_cast<size_t>(j)]);
      vector<int> factorial(static_cast<size_t>(k) + 1U, 1);
      for (int j = 1; j <= k; ++j)
          factorial[static_cast<size_t>(j)] =
              factorial[static_cast<size_t>(j - 1)] * j % mod_value;
      for (int u = 0; u < n; ++u) {
          int answer = 0;
          for (int j = 0; j <= k; ++j)
              answer = normalize(answer +
                  stirling[static_cast<size_t>(k)][static_cast<size_t>(j)] *
                  factorial[static_cast<size_t>(j)] % mod_value * all[position(u, j)]);
          cout << answer << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4827
external_platform: 洛谷
external_problem_id: P4827
external_title: '[國家集訓隊] Crash 的文明世界'
external_relation: original
source_book_pages: [484]
source_pdf_pages: [114]
review_status: verified
---

Stirling 轉換把「距離加一」造成的高階展開壓成相鄰兩欄的換根轉移。
