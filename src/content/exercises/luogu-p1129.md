---
id: luogu-p1129
volume: lower
source_file: lower-volume
original_label: '洛谷 P1129'
title: '洛谷 P1129 矩陣遊戲'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 3
topics: ['完美匹配', '行列置換']
prerequisites: ['bipartite']
statement: |-
  可任意交換矩陣的行與列，判斷能否使主對角線全為 1。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      2
      2
      0 0
      0 1
      3
      0 0 1
      0 1 0
      1 0 0
    output: |-
      No
      Yes
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['完美匹配', '行列置換']
judgment: |-
  把行與列當二分圖兩側，值為 1 的格子建立邊。
hints:
  - '先辨識核心轉換：完美匹配、行列置換。'
  - '把行與列當二分圖兩側，值為 1 的格子建立邊。'
  - '依「求最大匹配並判斷大小是否為 n。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  求最大匹配並判斷大小是否為 n。
proof_or_invariant: |-
  可行對角線等價於選出 n 個分屬不同列的 1；這正是行列二分圖的完美匹配。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(T n^3)'
  space: 'O(n^2)'
cpp_skeleton: |-
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依卡片解法建立圖或狀態，完成增廣／動態規劃並輸出答案。
      return 0;
  }
cpp_solution: |-
  #if defined(__GNUC__)
  #pragma GCC diagnostic ignored "-Wconversion"
  #pragma GCC diagnostic ignored "-Wshadow"
  #pragma GCC diagnostic ignored "-Wunused-parameter"
  #pragma GCC diagnostic ignored "-Wunused-variable"
  #pragma GCC diagnostic ignored "-Wpedantic"
  #pragma GCC diagnostic ignored "-Wcomment"
  #pragma GCC diagnostic ignored "-Wsign-compare"
  #pragma GCC diagnostic ignored "-Wmisleading-indentation"
  #endif
  #include <iostream>
  #include <vector>
  #include <cstring>
  using namespace std;

  const int MAXN = 205;

  bool dfs(int u, vector<bool>& visited, vector<vector<int>>& graph, vector<int>& match) {
      for (int v : graph[u]) {
          if (!visited[v]) {
              visited[v] = true;
              if (match[v] == -1 || dfs(match[v], visited, graph, match)) {
                  match[v] = u;
                  return true;
              }
          }
      }
      return false;
  }

  int main() {
      int T;
      cin >> T;
      while (T--) {
          int n;
          cin >> n;
          vector<vector<int>> matrix(n, vector<int>(n));
          for (int i = 0; i < n; i++) {
              for (int j = 0; j < n; j++) {
                  cin >> matrix[i][j];
              }
          }

          // Build bipartite graph
          vector<vector<int>> graph(n);
          for (int i = 0; i < n; i++) {
              for (int j = 0; j < n; j++) {
                  if (matrix[i][j] == 1) {
                      graph[i].push_back(j);
                  }
              }
          }

          // Hungarian algorithm
          vector<int> match(n, -1);
          int match_count = 0;
          for (int i = 0; i < n; i++) {
              vector<bool> visited(n, false);
              if (dfs(i, visited, graph, match)) {
                  match_count++;
              }
          }

          if (match_count == n) {
              cout << "Yes" << endl;
          } else {
              cout << "No" << endl;
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1129
external_platform: '洛谷'
external_problem_id: 'P1129'
external_title: '矩陣遊戲'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
