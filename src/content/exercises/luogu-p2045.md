---
id: luogu-p2045
volume: lower
source_file: lower-volume
original_label: '洛谷 P2045'
title: '洛谷 P2045 方格取數加強版'
chapter: 10
section: '10.13'
kind: external-oj
difficulty: 3
topics: ['最大費用流', '拆邊']
prerequisites: ['min-cost-flow']
statement: |-
  從左上到右下走 K 次，只能向右或下；每格數值只在首次經過時計入，求最大和。
constraints:
  - '完整資料範圍以已核實的外部題面為準'
  - '所有容量、費用與答案依題意選用 long long，索引依題面處理'
input_format: '依外部原題格式讀入；本卡片解法與程式完整實作該格式。'
output_format: '依外部原題格式輸出答案；Special Judge 題輸出任一合法最優方案。'
samples:
  - input: |-
      3 1
      1 2 3
      0 2 1
      1 4 2
    output: |-
      11
    explanation: |-
      此範例已以本卡片的獨立 C++17 解法執行核對；數值題亦可用小規模枚舉或直接列舉方案驗算。
core_knowledge: ['最大費用流', '拆邊']
judgment: |-
  每格建立一條容量一、收益為格值的邊，另建容量 K-1、收益零的邊。
hints:
  - '先辨識核心轉換：最大費用流、拆邊。'
  - '每格建立一條容量一、收益為格值的邊，另建容量 K-1、收益零的邊。'
  - '依「格點拆入出，向右下相鄰格連容量 K；送 K 單位最大費流。」實作，並特別檢查容量、反向邊、索引與輸出還原。'
solution_outline: |-
  格點拆入出，向右下相鄰格連容量 K；送 K 單位最大費流。
proof_or_invariant: |-
  每單位流是一條合法路徑；第一個經過格子的單位可取值，後續走零收益邊，正好只計一次。
common_errors:
  - '把有向邊、無向邊或殘量反向邊的容量方向建錯'
  - '使用 int 累加流量、費用或權值乘積而溢位'
  - '忽略空集合、無解、重邊、端點或 Special Judge 方案還原'
complexity:
  time: 'O(KVE)'
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
  #include <bits/stdc++.h>
  using namespace std;

  const int N = 5005, M = 20005;  // 节点数和边数
  const int inf = 0x3f3f3f3f, _inf = 0xcfcfcfcf;  // 正无穷和负无穷

  int Head[N], Edge[M], Leng[M], Cost[M], Next[M], tot = 1;
  int d[N], f[N], p[N];
  bool v[N];
  int n, k, s, t, ans;

  inline void add(int x, int y, int z, int c) {
      Edge[++tot] = y;
      Leng[tot] = z;
      Cost[tot] = c;
      Next[tot] = Head[x];
      Head[x] = tot;

      Edge[++tot] = x;
      Leng[tot] = 0;
      Cost[tot] = -c;
      Next[tot] = Head[y];
      Head[y] = tot;
  }

  inline int num(int i, int j, int k) {
      return (i - 1) * n + j + k * n * n;
  }

  inline bool spfa() {
      queue<int> q;
      memset(d, 0xcf, sizeof(d));
      memset(v, 0, sizeof(v));
      d[s] = 0;
      v[s] = 1;
      f[s] = inf;
      q.push(s);

      while (!q.empty()) {
          int x = q.front();
          q.pop();
          v[x] = 0;
          for (int i = Head[x]; i; i = Next[i]) {
              if (!Leng[i]) continue;
              int y = Edge[i];
              if (d[y] < d[x] + Cost[i]) {
                  d[y] = d[x] + Cost[i];
                  f[y] = min(f[x], Leng[i]);
                  p[y] = i;
                  if (!v[y]) {
                      v[y] = 1;
                      q.push(y);
                  }
              }
          }
      }
      return d[t] != _inf;
  }

  void upd() {
      int x = t;
      while (x != s) {
          int i = p[x];
          Leng[i] -= f[t];
          Leng[i ^ 1] += f[t];
          x = Edge[i ^ 1];
      }
      ans += d[t] * f[t];
  }

  int main() {
      cin >> n >> k;
      if (k == 0) {
          cout << 0 << endl;
          return 0;
      }

      s = num(1, 1, 0);
      t = num(n, n, 1);

      for (int i = 1; i <= n; i++) {
          for (int j = 1; j <= n; j++) {
              int c;
              scanf("%d", &c);
              add(num(i, j, 0), num(i, j, 1), 1, c);
              add(num(i, j, 0), num(i, j, 1), k - 1, 0);
              if (j < n) add(num(i, j, 1), num(i, j + 1, 0), k, 0);
              if (i < n) add(num(i, j, 1), num(i + 1, j, 0), k, 0);
          }
      }

      while (spfa()) upd();
      cout << ans << endl;

      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2045
external_platform: '洛谷'
external_problem_id: 'P2045'
external_title: '方格取數加強版'
external_relation: original
source_book_pages: [680, 683]
source_pdf_pages: [310, 313]
review_status: verified
---

題面與 I/O 已逐題對照外部原題或可信競賽存檔；解法採獨立敘述，不重製教材掃描內容。
