---
id: luogu-p2419
volume: lower
source_file: lower-volume
original_label: 洛谷 P2419
title: 洛谷 P2419 Cow Contest：確定排名
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 2
topics: [傳遞閉包, Floyd-Warshall, 排名]
prerequisites: [dijkstra]
core_knowledge: [偏序可比性, 布林 Floyd, 入出可達數]
judgment: 一頭牛與其餘每頭牛的強弱方向都已知時，排名才唯一。
statement: 給定無矛盾的比賽勝負，勝負具傳遞性；求排名能唯一確定的牛數。
constraints: ['n <= 100', 'm <= 4500', '資料無矛盾']
input_format: 第一行 n、m；接著 m 行 A、B 表示 A 勝 B。
output_format: 輸出排名可確定的牛數。
samples:
  - input: |-
      5 5
      4 3
      4 2
      3 2
      1 2
      2 5
    output: '2'
    explanation: 2 號比三頭牛弱、比 5 號強，故為第 4；5 號必為最後一名。
hints:
  - 先求勝負關係的傳遞閉包。
  - 對牛 i，任一 j 必須滿足 i 能勝 j 或 j 能勝 i。
  - 資料保證不矛盾，不需處理雙向可達造成的平手。
solution_outline: 以布林 Floyd 求所有可推出的勝負；逐頭統計與它可比較的其他牛，恰為 n-1 就計入。
proof_or_invariant: 閉包後 reachable[i][j] 當且僅當可推出 i 強於 j。若 i 與所有其他牛可比，強於它與弱於它的數量固定其唯一位置；若有不可比者，兩者相對順序可變，排名不唯一。
complexity: { time: 'O(n^3)', space: 'O(n^2)' }
common_errors: [只統計勝過多少頭而忽略輸掉者, 把直接勝負數當成傳遞結果, 對 i 本身也計數]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { int n, m; cin >> n >> m; /* TODO：傳遞閉包與可比性。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, m; if (!(cin >> n >> m)) return 0;
      vector<vector<char>> reach(static_cast<size_t>(n), vector<char>(static_cast<size_t>(n), 0));
      for (int i = 0; i < m; ++i) {
          int a, b; cin >> a >> b;
          reach[static_cast<size_t>(a - 1)][static_cast<size_t>(b - 1)] = 1;
      }
      for (int k = 0; k < n; ++k)
          for (int i = 0; i < n; ++i)
              if (reach[static_cast<size_t>(i)][static_cast<size_t>(k)])
                  for (int j = 0; j < n; ++j)
                      reach[static_cast<size_t>(i)][static_cast<size_t>(j)] |=
                          reach[static_cast<size_t>(k)][static_cast<size_t>(j)];
      int answer = 0;
      for (int i = 0; i < n; ++i) {
          int comparable = 0;
          for (int j = 0; j < n; ++j)
              if (i != j && (reach[static_cast<size_t>(i)][static_cast<size_t>(j)] ||
                             reach[static_cast<size_t>(j)][static_cast<size_t>(i)])) ++comparable;
          if (comparable == n - 1) ++answer;
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2419
external_platform: 洛谷
external_problem_id: P2419
external_title: '[USACO08JAN] Cow Contest S'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

排名唯一的本質，是與其餘所有元素都可比較。
