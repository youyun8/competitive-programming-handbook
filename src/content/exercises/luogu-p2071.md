---
id: luogu-p2071
volume: lower
source_file: lower-volume
original_label: '洛谷 P2071'
title: '洛谷 P2071 座位安排'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 3
topics: ['容量為二的二分圖匹配']
prerequisites: ['bipartite']
statement: |-
  車上有 n 排、每排兩席；2n 人各指定兩排，求最多可滿足多少人。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      4
      1 2
      1 3
      1 2
      1 3
      1 3
      2 4
      1 3
      2 3
    output: |-
      7
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['容量為二的二分圖匹配']
judgment: |-
  把每排拆成兩個獨立座位，再將每人連到其兩個偏好排的四個座位。
hints:
  - '先辨識核心轉換：容量為二的二分圖匹配。'
  - '把每排拆成兩個獨立座位，再將每人連到其兩個偏好排的四個座位。'
  - '依「在人與 2n 個實際座位間求最大匹配。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  在人與 2n 個實際座位間求最大匹配。
proof_or_invariant: |-
  每個匹配恰是一份互不衝突的座位安排，反之任何可行安排也對應同大小匹配。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(n^2)'
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
  #include<iostream>
  #include<cstdio>
  #include<cstring>
  using namespace std;

  const int MAXN = 4005; // 因为N最大2000，人数4000，所以设4005
  struct Edge {
      int to, next;
  } edges[MAXN * 4]; // 每个人2条边，所以最多8000条边
  int head[MAXN], cnt;
  int result[MAXN][2]; // result[i][0]和result[i][1]存储第i排匹配的两个人
  bool use[MAXN]; // 在DFS中标记已访问的座位排
  int n;

  void add_edge(int u, int v) {
      edges[++cnt].to = v;
      edges[cnt].next = head[u];
      head[u] = cnt;
  }

  bool dfs(int now) {
      for (int i = head[now]; i; i = edges[i].next) {
          int v = edges[i].to; // 座位排编号
          if (!use[v]) {
              use[v] = true;
              // 检查第一个槽位是否为空
              if (!result[v][0]) {
                  result[v][0] = now;
                  return true;
              }
              // 检查第二个槽位是否为空
              if (!result[v][1]) {
                  result[v][1] = now;
                  return true;
              }
              // 两个槽位都满了，尝试重新分配第一个槽位
              if (dfs(result[v][0])) {
                  result[v][0] = now;
                  return true;
              }
              // 尝试重新分配第二个槽位
              if (dfs(result[v][1])) {
                  result[v][1] = now;
                  return true;
              }
          }
      }
      return false;
  }

  int main() {
      scanf("%d", &n);
      // 读取每个人的偏好
      for (int i = 1; i <= 2 * n; i++) {
          int a, b;
          scanf("%d%d", &a, &b);
          add_edge(i, a);
          add_edge(i, b);
      }

      int ans = 0;
      for (int i = 1; i <= 2 * n; i++) {
          memset(use, 0, sizeof(use));
          if (dfs(i)) {
              ans++;
          }
      }

      printf("%d\n", ans);
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2071
external_platform: '洛谷'
external_problem_id: 'P2071'
external_title: '座位安排'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
