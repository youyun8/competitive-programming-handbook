---
id: luogu-p3386
volume: lower
source_file: lower-volume
title: 洛谷 P3386 二分圖最大匹配：匈牙利演算法
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 3
topics: ['二分圖', '最大匹配', '匈牙利演算法', '增廣路']
prerequisites: ['bipartite']
statement: |-
  給定一張二分圖，左部 n 個點、右部 m 個點與若干條邊，求最大匹配的邊數。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '資料中可能出現端點越界的邊，需要忽略'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行三個整數 n、m、e；接下來 e 行，每行兩個整數 u v 表示左部 u 與右部 v 之間有一條邊。'
output_format: '一行一個整數，表示最大匹配數。'
samples:
  - input: |
      3 3 5
      1 1
      1 2
      2 1
      2 3
      3 2
    output: |
      3
    explanation: |-
      左 1 配右 1、左 2 配右 3、左 3 配右 2，三條邊互不共用端點，達到滿匹配 3。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    匹配是一組兩兩不共用端點的邊。**增廣路**是一條起點與終點都未匹配、匹配邊與非匹配邊交替出現的路徑；沿著它把匹配與非匹配狀態全部翻轉，匹配數就會加一。
  - |-
    貝爾熱定理：一個匹配是最大匹配，若且唯若不存在增廣路。所以演算法就是「反覆找增廣路直到找不到」。
  - |-
    匈牙利演算法對每個左部點跑一次 DFS 找增廣路。對左點 u 的每個鄰居 v：若 v 未被匹配，直接配對成功；若 v 已被 w 匹配，就遞迴問 w 能不能改配到別的右點，能的話就把 v 讓給 u。
  - |-
    visited 陣列只在**單次**增廣內有效，每個左點開始前都要重置。它的作用是避免在同一次搜尋中重複走訪同一個右點而陷入無窮遞迴。
  - |-
    複雜度是 O(n·e)：每個左點各跑一次 DFS，單次最多走遍所有邊。注意題目資料可能出現越界的邊，讀入時要過濾掉，否則會越界寫入。
solution_outline: |-
  為左部每個點建鄰接表。依序對每個左點呼叫一次增廣搜尋：走訪它的每個右點鄰居，若該右點未匹配、或其現有配對能改配到別處，就把它讓給當前左點並回傳成功。每次成功讓匹配數加一，visited 在每次增廣前重置。
proof_or_invariant: |-
  由貝爾熱定理，最大匹配的充要條件是不存在增廣路。演算法對每個左點只嘗試一次的正確性在於：若某輪對 u 找不到增廣路，之後其他點的增廣操作也不會讓 u 重新變得可匹配（可匹配集合只會單調變化），因此無需回頭重試。
complexity:
  time: 'O(n·e)'
  space: 'O(n + e)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static vector<vector<int>> adjacency;
  static vector<int> matched_with;  // 右側點目前配對的左側點，0 表示未配對
  static vector<char> visited;

  // TODO 1：匈牙利演算法的增廣。對左側點 left 嘗試每個相鄰的右側點 right：
  //   本輪已經試過就跳過（visited 防止無窮遞迴）；
  //   若 right 沒人要，或它的舊配對 matched_with[right] 能改配到別處
  //   （遞迴呼叫 try_augment），就把 right 讓給 left 並回傳 true。
  static bool try_augment(int left) {
      (void)left;
      (void)adjacency;
      (void)matched_with;
      (void)visited;
      return false;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, e;
      if (!(cin >> n >> m >> e)) { return 0; }
      adjacency.assign(static_cast<size_t>(n) + 1, {});
      for (int i = 0; i < e; ++i) {
          int u, v;
          cin >> u >> v;
          if (u < 1 || u > n || v < 1 || v > m) { continue; }  // 題目允許出現越界的邊
          adjacency[static_cast<size_t>(u)].push_back(v);
      }
      matched_with.assign(static_cast<size_t>(m) + 1, 0);

      // TODO 2：對每個左側點跑一次增廣，成功就把答案加一。
      //   每輪都要重置 visited——它只在單次增廣內防止重複走訪。
      int result = 0;
      for (int left = 1; left <= n; ++left) {
          (void)left;
          (void)try_augment;
      }
      cout << result << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 匈牙利演算法：對每個左側點嘗試找增廣路。
  static vector<vector<int>> adjacency;
  static vector<int> matched_with;  // 右側點目前配對的左側點
  static vector<char> visited;

  static bool try_augment(int left) {
      for (const int right : adjacency[static_cast<size_t>(left)]) {
          if (visited[static_cast<size_t>(right)]) { continue; }
          visited[static_cast<size_t>(right)] = 1;
          // 右側點沒人要，或它的舊配對能改配到別處，就讓給我。
          if (matched_with[static_cast<size_t>(right)] == 0 ||
              try_augment(matched_with[static_cast<size_t>(right)])) {
              matched_with[static_cast<size_t>(right)] = left;
              return true;
          }
      }
      return false;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, e;
      if (!(cin >> n >> m >> e)) { return 0; }
      adjacency.assign(static_cast<size_t>(n) + 1, {});
      for (int i = 0; i < e; ++i) {
          int u, v;
          cin >> u >> v;
          if (u < 1 || u > n || v < 1 || v > m) { continue; }  // 題目允許出現越界的邊
          adjacency[static_cast<size_t>(u)].push_back(v);
      }
      matched_with.assign(static_cast<size_t>(m) + 1, 0);
      int result = 0;
      for (int left = 1; left <= n; ++left) {
          visited.assign(static_cast<size_t>(m) + 1, 0);
          if (try_augment(left)) { ++result; }
      }
      cout << result << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3386
external_platform: 洛谷
external_problem_id: P3386
external_title: '【模板】二分圖最大匹配'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

匈牙利演算法的遞迴只有幾行，難的是相信「讓出去再遞迴」真的能找到增廣路。畫兩張圖走一遍就懂了。
