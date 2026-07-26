---
id: luogu-p5652
volume: lower
source_file: lower-volume
title: 洛谷 P5652 多區間移動減一博弈
chapter: 7
section: '7.9'
kind: external-oj
difficulty: 5
topics: [game-theory, rooted-tree, dfs-order]
prerequisites: [combinatorial-game-theory]
statement: 對每個詢問區間 [l,r]，取子序列作遊戲：先把首位置值減一，之後棋子所在 i 的玩家可選 j∈[i,min(i+m,end)] 且值為正的位置，移到 j 並將其值減一；無法操作者輸。求所有先手勝的詢問編號平方和模 2^32。
constraints: [1 <= n, m, q <= 1000000]
input_format: 第一行 n、m、q、type，第二行序列。type=0 時接 q 行 l、r；type=1 時接 A、B、C、P 並按題定 LCG 生成詢問。
output_format: 輸出所有先手勝詢問 i 的 i^2 總和模 4294967296。
samples:
  - input: |-
      5 2 3 0
      2 4 1 2 3
      1 5
      3 5
      3 4
    output: '5'
    explanation: 前兩筆詢問先手勝，故答案為 1^2+2^2=5。
core_knowledge: [勝負只依賴數值奇偶, 祖先查詢壓縮區間博弈]
judgment: 棋子可留在原位置 j=i，只要該位置仍為正；每次必將選中值減一。
hints:
  - 只保留 a_i 的奇偶，記 pre[i] 為不超過 i 的最後奇數位置。
  - 將每個 i 掛到 pre[max(0,i-m-1)]，所得關係形成以 0 為根的樹。
  - 區間 [l,r] 必敗當且僅當 l 是 pre[r] 的祖先；用 DFS 進出時間 O(1) 判斷。
solution_outline: 建樹後以迭代 DFS 求 tin/tout。逐詢問取得 l,r，若 l 不是 pre[r] 祖先便將編號平方累加到 uint32_t。
proof_or_invariant: 從最右端逆推，奇數位置翻轉「由誰耗盡該格」，而一個已知必敗點前 m 格都可一步交給對手，因此為必勝；再往前 m+1 格才重新由最近奇數決定。把這個遞推父關係建成樹後，沿父鏈恰表示同一區間中的必敗邊界序列，故 l 位於 pre[r] 的祖先鏈上等價於先手必敗。
common_errors: [用完整 a_i 而非奇偶, 壓縮詢問忘記交換 l, r, 平方和未按 2^32 自然溢位]
complexity: { time: 'O(n+q)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n, m, q, type; cin >> n >> m >> q >> type; /* TODO: 建樹與祖先查詢。 */ }
cpp_solution: |
  #include <algorithm>
  #include <cstdint>
  #include <iostream>
  #include <utility>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, move_limit, query_count, type;
      cin >> n >> move_limit >> query_count >> type;
      vector<int> previous_odd(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) {
          long long value;
          cin >> value;
          previous_odd[static_cast<size_t>(i)] =
              (value & 1LL) != 0 ? i : previous_odd[static_cast<size_t>(i - 1)];
      }
      vector<int> first_child(static_cast<size_t>(n) + 1U, -1);
      vector<int> next_sibling(static_cast<size_t>(n) + 1U, -1);
      for (int i = 1; i <= n; ++i) {
          const int boundary = i - move_limit - 1;
          const int parent = boundary > 0 ? previous_odd[static_cast<size_t>(boundary)] : 0;
          next_sibling[static_cast<size_t>(i)] = first_child[static_cast<size_t>(parent)];
          first_child[static_cast<size_t>(parent)] = i;
      }
      vector<int> tin(static_cast<size_t>(n) + 1U);
      vector<int> tout(static_cast<size_t>(n) + 1U);
      vector<pair<int, bool>> stack;
      stack.reserve(static_cast<size_t>(2 * (n + 1)));
      stack.emplace_back(0, false);
      int timer = 0;
      while (!stack.empty()) {
          const auto [node, exiting] = stack.back();
          stack.pop_back();
          if (!exiting) {
              tin[static_cast<size_t>(node)] = ++timer;
              stack.emplace_back(node, true);
              for (int child = first_child[static_cast<size_t>(node)]; child != -1;
                   child = next_sibling[static_cast<size_t>(child)])
                  stack.emplace_back(child, false);
          } else {
              tout[static_cast<size_t>(node)] = timer;
          }
      }
      long long random_a = 0, random_b = 0, random_c = 0, random_modulus = 1;
      if (type != 0) cin >> random_a >> random_b >> random_c >> random_modulus;
      const auto random_value = [&]() {
          random_a = (random_a * random_b + random_c) % random_modulus;
          return random_a;
      };
      uint32_t answer = 0;
      for (int index = 1; index <= query_count; ++index) {
          int left, right;
          if (type == 0) {
              cin >> left >> right;
          } else {
              left = static_cast<int>(random_value() % n) + 1;
              right = static_cast<int>(random_value() % n) + 1;
              if (left > right) swap(left, right);
          }
          const int target = previous_odd[static_cast<size_t>(right)];
          const bool is_ancestor =
              tin[static_cast<size_t>(left)] <= tin[static_cast<size_t>(target)] &&
              tin[static_cast<size_t>(target)] <= tout[static_cast<size_t>(left)];
          if (!is_ancestor) {
              const uint32_t number = static_cast<uint32_t>(index);
              answer += number * number;
          }
      }
      cout << static_cast<uint64_t>(answer) << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5652
external_platform: 洛谷
external_problem_id: P5652
external_title: 基礎博弈練習題
external_relation: original
source_book_pages: [511, 515]
source_pdf_pages: [141, 145]
review_status: verified
---

百萬筆區間博弈被壓成固定樹上的祖先查詢，且迭代 DFS 避免深遞迴爆棧。
