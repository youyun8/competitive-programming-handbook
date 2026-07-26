---
id: luogu-p3386
volume: lower
source_file: lower-volume
original_label: '洛谷 P3386'
title: '洛谷 P3386 二分圖最大匹配'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 3
topics: ['二分圖最大匹配', '增廣路']
prerequisites: ['bipartite']
statement: |-
  給定左右兩部點與跨部邊，求最大匹配邊數。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      1 1 1
      1 1
    output: |-
      1
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['二分圖最大匹配', '增廣路']
judgment: |-
  對每個左點尋找一條增廣路；輸入中越界端點不形成合法邊。
hints:
  - '先辨識核心轉換：二分圖最大匹配、增廣路。'
  - '對每個左點尋找一條增廣路；輸入中越界端點不形成合法邊。'
  - '依「依序從每個左點 DFS；遇到已配對右點時，遞迴替它改配，成功便更新配對。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  依序從每個左點 DFS；遇到已配對右點時，遞迴替它改配，成功便更新配對。
proof_or_invariant: |-
  每次成功搜尋都沿交錯路翻轉，使匹配增加一；全部搜尋後不存在可由未配左點出發的增廣路，依 Berge 定理匹配最大。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(n e)'
  space: 'O(n+m+e)'
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

  const int MAXN = 510;
  const int MAXM = 510;

  vector<int> graph[MAXN];
  int match[MAXM];
  bool visited[MAXM];

  bool dfs(int u) {
      for (int v : graph[u]) {
          if (!visited[v]) {
              visited[v] = true;
              if (match[v] == 0 || dfs(match[v])) {
                  match[v] = u;
                  return true;
              }
          }
      }
      return false;
  }

  int main() {
      int n, m, e;
      cin >> n >> m >> e;

      for (int i = 0; i < e; i++) {
          int u, v;
          cin >> u >> v;
          if (u >= 1 && u <= n && v >= 1 && v <= m) {
              graph[u].push_back(v);
          }
      }

      memset(match, 0, sizeof(match));
      int ans = 0;

      for (int i = 1; i <= n; i++) {
          memset(visited, false, sizeof(visited));
          if (dfs(i)) {
              ans++;
          }
      }

      cout << ans << endl;
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3386
external_platform: '洛谷'
external_problem_id: 'P3386'
external_title: '二分圖最大匹配'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
