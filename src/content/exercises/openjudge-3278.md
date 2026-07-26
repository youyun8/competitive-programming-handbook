---
id: openjudge-3278
volume: upper
source_file: upper-volume
title: OpenJudge 3278 Catch That Cow
chapter: 3
section: '3.4'
kind: external-oj
difficulty: 2
topics: [bfs, shortest-path, implicit-graph]
prerequisites: [queue]
statement: 農夫位於數線座標 N，牛固定在 K。農夫每分鐘可由 x 到 x-1、x+1 或 2x，求抓到牛的最少分鐘數。
constraints:
  - 0 <= N <= 100000
  - 0 <= K <= 100000
input_format: 一行兩個整數 N、K。
output_format: 輸出最少所需分鐘數。
samples:
  - input: '5 17'
    output: '4'
    explanation: 可走 5→10→9→18→17，共四分鐘。
core_knowledge:
  - 將每個整數位置視為圖頂點，三種操作視為單位權邊
  - BFS 第一次抵達某點即得到最短步數
judgment: 牛不移動；三種移動均恰耗一分鐘。
hints:
  - 這是一張不必顯式建邊的圖，每個位置最多產生三個相鄰位置。
  - 所有邊權皆為一，從 N 做 BFS，第一次遇到 K 即可停止。
  - 搜尋座標限制在 0 到 200000 足夠：超過兩倍的輸入上界後，只能靠減一回來，不會優於直接移動。
solution_outline: 在座標 0..200000 上做 BFS，以距離陣列兼作 visited。每次展開 x-1、x+1、2x 中合法且未訪問的位置。
proof_or_invariant: >-
  每個合法操作對應隱式圖的一條單位權邊，反之每條生成邊都是一次合法操作，因此操作序列與圖中路徑一一對應。
  BFS 按路徑長度非遞減順序展開，故 K 第一次被訪問時的距離就是最少分鐘。若最短路曾超過 200000，
  第一次越界後只能以減一接近不超過 100000 的 K，刪去該繞行不會更差，故界限安全。
complexity:
  time: O(B)，B=200000
  space: O(B)
common_errors:
  - 未限制負座標或陣列上界
  - 出隊後才標記 visited，造成大量重複入隊
  - 把瞬移誤認為不耗時間
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int start, target;
      cin >> start >> target;
      // TODO：在隱式圖上做 BFS。
      (void)start;
      (void)target;
      cout << 0 << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int start, target;
      cin >> start >> target;
      constexpr int maximum = 200000;
      vector<int> distance(maximum + 1, -1);
      queue<int> pending;
      distance[start] = 0;
      pending.push(start);
      while (!pending.empty()) {
          const int position = pending.front();
          pending.pop();
          if (position == target) break;
          const array<int, 3> next_positions = {position - 1, position + 1, position * 2};
          for (int next : next_positions) {
              if (next < 0 || next > maximum || distance[next] != -1) continue;
              distance[next] = distance[position] + 1;
              pending.push(next);
          }
      }
      cout << distance[target] << '\n';
  }
external_url: http://poj.org/problem?id=3278
external_platform: POJ / OpenJudge
external_problem_id: '3278'
external_title: Catch That Cow
external_relation: original
source_book_pages: [73, 74, 253]
source_pdf_pages: [91, 92, 271]
review_status: verified
---

隱式圖 BFS 的關鍵是定義狀態邊界，並在入隊時立即判重。
