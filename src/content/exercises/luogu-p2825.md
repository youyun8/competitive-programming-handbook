---
id: luogu-p2825
volume: lower
source_file: lower-volume
original_label: '洛谷 P2825'
title: '洛谷 P2825 遊戲'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 3
topics: ['網格分段', '二分圖匹配']
prerequisites: ['bipartite']
statement: |-
  在含空地、軟石與硬石的網格放最多炸彈；硬石阻擋同行同列爆炸。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      4 4
      #***
      *#**
      **#*
      xxx#
    output: |-
      5
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['網格分段', '二分圖匹配']
judgment: |-
  硬石把每行、每列切成獨立可視段；軟石不切段但不能放炸彈。
hints:
  - '先辨識核心轉換：網格分段、二分圖匹配。'
  - '硬石把每行、每列切成獨立可視段；軟石不切段但不能放炸彈。'
  - '依「為每個行段、列段編號，每個空地連接所屬兩段，答案為最大匹配。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  為每個行段、列段編號，每個空地連接所屬兩段，答案為最大匹配。
proof_or_invariant: |-
  炸彈選擇合法當且僅當沒有共用行段或列段，與二分圖匹配一一對應。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(VE)'
  space: 'O(nm)'
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
  #include <bits/stdc++.h>
  using namespace std;
  int n, m, ntot, mtot, tot, head[3000], nxt[3000], ver[3000], row[60][60], col[60][60], match[3000], ans;
  bool vis[3000];
  void add(int x, int y) {
      ver[++tot] = y;
      nxt[tot] = head[x];
      head[x] = tot;
  }
  bool find(int x) {
      for (int i = head[x]; i; i = nxt[i]) {
          int y = ver[i];
          if (!vis[y]) {
              vis[y] = true;
              if (!match[y] || find(match[y])) {
                  match[y] = x;
                  return true;
              }
          }
      }
      return false;
  }
  int main() {
      scanf("%d%d", &n, &m);
      char s[60][60];
      bool flag = 1;
      pair<int, int> last;
      for (int i = 1; i <= n; i++) {
          scanf("%s", (s[i] + 1));
          for (int j = 1; j <= m; j++) {
              if (s[i][j] == '#') {
                  flag = 1;
                  continue;
              }
              if (flag == 0) {
                  if (s[i][j] != 'x') {
                      row[i][j] = row[last.first][last.second];
                      last = make_pair(i, j);
                  }
              } else {
                  if (s[i][j] != 'x') {
                      row[i][j] = row[last.first][last.second] + 1;
                      ntot++;
                      last = make_pair(i, j);
                      flag = 0;
                  }
              }
          }
          flag = 1;
      }
      flag = 1;
      last = make_pair(0, 0);
      for (int i = 1; i <= m; i++) {
          for (int j = 1; j <= n; j++) {
              if (s[j][i] == '#') {
                  flag = 1;
                  continue;
              }
              if (flag == 0) {
                  if (s[j][i] != 'x') {
                      col[j][i] = col[last.second][last.first];
                      last = make_pair(i, j);
                  }
              } else {
                  if (s[j][i] != 'x') {
                      col[j][i] = col[last.second][last.first] + 1;
                      mtot++;
                      last = make_pair(i, j);
                      flag = 0;
                  }
              }
          }
          flag = 1;
      }
      for (int i = 1; i <= n; i++) {
          for (int j = 1; j <= m; j++) {
              if (s[i][j] == '*') {
                  add(row[i][j], col[i][j]);
              }
          }
      }
      for (int i = 1; i <= ntot; i++) {
          memset(vis, 0, sizeof(vis));
          if (find(i)) {
              ans++;
          }
      }
      printf("%d\n", ans);
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2825
external_platform: '洛谷'
external_problem_id: 'P2825'
external_title: '遊戲'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
