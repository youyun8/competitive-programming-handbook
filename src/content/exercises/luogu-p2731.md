---
id: luogu-p2731
volume: lower
source_file: lower-volume
original_label: 洛谷 P2731
title: 騎馬修柵欄 Riding the Fences：字典序最小歐拉跡
chapter: 10
section: '10.3'
kind: external-oj
difficulty: 3
topics: [euler-trail, undirected-multigraph, lexicographic-order]
prerequisites: [degree, connectivity, hierholzer]
statement: >-
  農場有若干連通的無向柵欄，每條柵欄連接兩個編號頂點，兩點間可有多條柵欄。請輸出一條
  恰好經過每條柵欄一次的頂點序列；若有多條可行路徑，輸出頂點序列字典序最小者。
constraints: [1 <= m <= 1024, 1 <= u, v <= 500, 所有柵欄位於同一含邊連通分量, 保證至少有一組解]
input_format: 第一行為柵欄數 m；接著 m 行各給一條無向柵欄的兩端 u、v。
output_format: 輸出 m+1 行，每行一個依序經過的頂點編號。
samples:
  - input: "9\n1 2\n2 3\n3 4\n4 2\n4 5\n2 5\n5 6\n5 7\n4 6\n"
    output: "1\n2\n3\n4\n2\n5\n4\n6\n5\n7"
    explanation: 奇度頂點為 1、7，所以必由較小的 1 出發；依可行的最小鄰點順序走完九條柵欄，得到題目要求的最小序列。
core_knowledge: [無向歐拉跡的奇度端點, Hierholzer 回溯拼接, 多重邊計數, 字典序起點與鄰點順序]
judgment: 有兩個奇度點時必從較小奇點出發；全為偶度時從最小非零度點出發。平行邊須分別使用，輸出必須恰有 m+1 個頂點。
hints:
  - 先統計度數；若有奇度點，字典序最小路徑的起點只能是編號較小的奇度點。
  - 用鄰接計數矩陣保留平行邊，從小到大尋找目前頂點仍未使用的鄰邊。
  - Hierholzer 在無邊可走時才把頂點加入答案，最後反轉回溯序列。
solution_outline: >-
  統計每點度數及每對頂點間的柵欄數。選最小奇度點為起點；若沒有奇度點，選最小非零度點。
  執行 Hierholzer，每次從小到大消耗一條鄰邊，回溯時記錄頂點，最後反轉並逐行輸出。
proof_or_invariant: >-
  每次遞迴同時刪除無向邊兩端的一份計數，因此每條實際柵欄恰被使用一次。Hierholzer
  回溯時，當前頂點已無未用邊，故拼接後的序列連續且涵蓋全部邊。歐拉跡的端點條件決定
  最小可能起點；固定任一共同前綴時，從小到大取邊的 Hierholzer 會選到可形成完整巡迴的
  最小下一頂點，因此由首次分歧比較可知反轉後序列字典序最小。
common_errors: [兩個奇點時仍從最小非零度點開始, 將平行柵欄去重, 直接輸出回溯序而未反轉, 只刪除鄰接矩陣的一個方向]
complexity: { time: O(500*m), space: O(500^2 + m) }
cpp_skeleton: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <vector>
  using namespace std;
  constexpr int vertex_limit = 500;
  using EdgeCounts = array<array<int, vertex_limit + 1>, vertex_limit + 1>;
  [[maybe_unused]] static void build_trail(int vertex, EdgeCounts& edge_count, vector<int>& reversed_path) {
      (void)vertex;
      (void)edge_count;
      (void)reversed_path;
      // TODO：從小到大消耗鄰邊，並在回溯時記錄頂點。
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int edge_total = 0;
      cin >> edge_total;
      EdgeCounts edge_count{};
      array<int, vertex_limit + 1> degree{};
      for (int index = 0; index < edge_total; ++index) {
          int first = 0;
          int second = 0;
          cin >> first >> second;
          ++edge_count[static_cast<size_t>(first)][static_cast<size_t>(second)];
          ++edge_count[static_cast<size_t>(second)][static_cast<size_t>(first)];
          ++degree[static_cast<size_t>(first)];
          ++degree[static_cast<size_t>(second)];
      }
      // TODO：選起點、建立路徑、反轉並輸出。
  }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <vector>
  using namespace std;
  constexpr int vertex_limit = 500;
  using EdgeCounts = array<array<int, vertex_limit + 1>, vertex_limit + 1>;
  static void build_trail(int vertex, EdgeCounts& edge_count, vector<int>& reversed_path) {
      for (int next = 1; next <= vertex_limit; ++next) {
          while (edge_count[static_cast<size_t>(vertex)][static_cast<size_t>(next)] > 0) {
              --edge_count[static_cast<size_t>(vertex)][static_cast<size_t>(next)];
              --edge_count[static_cast<size_t>(next)][static_cast<size_t>(vertex)];
              build_trail(next, edge_count, reversed_path);
          }
      }
      reversed_path.push_back(vertex);
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int edge_total = 0;
      cin >> edge_total;
      EdgeCounts edge_count{};
      array<int, vertex_limit + 1> degree{};
      for (int index = 0; index < edge_total; ++index) {
          int first = 0;
          int second = 0;
          cin >> first >> second;
          ++edge_count[static_cast<size_t>(first)][static_cast<size_t>(second)];
          ++edge_count[static_cast<size_t>(second)][static_cast<size_t>(first)];
          ++degree[static_cast<size_t>(first)];
          ++degree[static_cast<size_t>(second)];
      }
      int start = 0;
      for (int vertex = 1; vertex <= vertex_limit; ++vertex) {
          if (degree[static_cast<size_t>(vertex)] % 2 != 0) {
              start = vertex;
              break;
          }
      }
      if (start == 0) {
          for (int vertex = 1; vertex <= vertex_limit; ++vertex) {
              if (degree[static_cast<size_t>(vertex)] > 0) {
                  start = vertex;
                  break;
              }
          }
      }
      vector<int> reversed_path;
      reversed_path.reserve(static_cast<size_t>(edge_total + 1));
      build_trail(start, edge_count, reversed_path);
      reverse(reversed_path.begin(), reversed_path.end());
      for (int vertex : reversed_path) {
          cout << vertex << '\n';
      }
  }
external_url: https://www.luogu.com.cn/problem/P2731
external_platform: Luogu
external_problem_id: P2731
external_title: '[USACO3.3] 騎馬修柵欄 Riding the Fences'
external_relation: original
source_book_pages: [615]
source_pdf_pages: [245]
review_status: verified
---

先決定字典序最小的合法端點，再把「優先較小鄰點」放進 Hierholzer，即可同時滿足完整用邊與唯一輸出要求。
