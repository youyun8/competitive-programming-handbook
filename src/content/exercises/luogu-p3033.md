---
id: luogu-p3033
volume: lower
source_file: lower-volume
original_label: '洛谷 P3033'
title: '洛谷 P3033 Cow Steeplechase G'
chapter: 10
section: '10.11'
kind: external-oj
difficulty: 3
topics: ['二分圖最大獨立集', '線段相交']
prerequisites: ['bipartite']
statement: |-
  從互不共線重疊的水平、垂直線段中選最多條兩兩不相交線段。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3 
      4 5 10 5 
      6 2 6 12 
      8 3 8 5
    output: |-
      2
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['二分圖最大獨立集', '線段相交']
judgment: |-
  交點只可能出現在水平與垂直線段之間，交圖是二分圖。
hints:
  - '先辨識核心轉換：二分圖最大獨立集、線段相交。'
  - '交點只可能出現在水平與垂直線段之間，交圖是二分圖。'
  - '依「水平線段與相交的垂直線段連邊；由 König 定理輸出 N-最大匹配。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  水平線段與相交的垂直線段連邊；由 König 定理輸出 N-最大匹配。
proof_or_invariant: |-
  刪除最小點覆蓋後恰無交邊；二分圖最小點覆蓋等於最大匹配，保留數因此為 N-|M|。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(N^2+VE)'
  space: 'O(N^2)'
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

  const int N = 1005;  // 因为n<=250，所以1005足够

  int n, n1, tot, cnt;
  int x1[N], y1[N], x2[N], y2[N], a[N];
  int nd[N], cp[N];
  bool bk[N];

  struct edge {
      int v, nxt;
  } ed[N * N];  // 最大边数可能达到n*n

  void add(int u, int v) {
      ed[++tot] = {v, nd[u]};
      nd[u] = tot;
  }

  bool hung(int u) {
      bk[u] = true;
      for (int i = nd[u]; i; i = ed[i].nxt) {
          int v = ed[i].v;
          if (bk[cp[v]]) continue;
          if (cp[v] == 0 || hung(cp[v])) {
              cp[v] = u;
              return true;
          }
      }
      return false;
  }

  int main() {
      cin >> n;
      for (int i = 1; i <= n; i++) {
          cin >> x1[i] >> y1[i] >> x2[i] >> y2[i];
          // 规范化端点
          if (x1[i] > x2[i]) swap(x1[i], x2[i]);
          if (y1[i] > y2[i]) swap(y1[i], y2[i]);

          if (x1[i] == x2[i]) {
              a[i] = 1;  // 垂直线段
              n1++;
          } else {
              a[i] = 2;  // 水平线段
          }
      }

      // 构建二分图
      for (int i = 1; i <= n; i++) {
          for (int j = i + 1; j <= n; j++) {
              if (a[i] == 1 && a[j] == 2) {  // i垂直，j水平
                  if (x1[i] >= x1[j] && x1[i] <= x2[j] &&
                      y1[j] >= y1[i] && y1[j] <= y2[i]) {
                      add(i, j + n1);  // 左部节点i指向右部节点j+n1
                  }
              } else if (a[i] == 2 && a[j] == 1) {  // i水平，j垂直
                  if (x1[j] >= x1[i] && x1[j] <= x2[i] &&
                      y1[i] >= y1[j] && y1[i] <= y2[j]) {
                      add(j, i + n1);  // 左部节点j指向右部节点i+n1
                  }
              }
          }
      }

      // 匈牙利算法求最大匹配
      for (int i = 1; i <= n; i++) {
          if (a[i] == 1) {  // 只对垂直线段（左部节点）进行匹配
              memset(bk, 0, sizeof(bk));
              if (hung(i)) cnt++;
          }
      }

      cout << n - cnt << endl;
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3033
external_platform: '洛谷'
external_problem_id: 'P3033'
external_title: 'Cow Steeplechase G'
external_relation: original
source_book_pages: [676, 678]
source_pdf_pages: [306, 308]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
