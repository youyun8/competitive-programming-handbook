---
id: luogu-p1486
volume: upper
source_file: upper-volume
title: '洛谷 P1486 [NOI2004] 鬱悶的出納員'
chapter: 4
section: '4.16'
kind: external-oj
difficulty: 5
topics: ['平衡樹', '全域偏移', '第 k 大']
prerequisites: ['平衡樹', '全域偏移', '第 k 大']
statement: |-
  維護員工薪資，支援合法入職、全體加減、查第 k 高；減薪後刪除低於最低標準者，最後輸出離職總數。
constraints:
  - '操作數 <= 100000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      7 10
      I 20
      I 5
      A 3
      F 1
      S 15
      F 1
      F 2
    output: |-
      23
      -1
      -1
      1
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['平衡樹', '全域偏移', '第 k 大']
judgment: |-
  初薪低於下限者不入職，也不計入離職人數。
hints:
  - '先辨識核心模型：平衡樹、全域偏移、第 k 大；暫時不要處理所有操作細節。'
  - '初薪低於下限者不入職，也不計入離職人數。'
  - '最後依此不變量實作：以實際薪資減全域 offset 作鍵。I 插入 x-offset；A/S 只改 offset。S 後分裂掉鍵小於 min-offset 的整棵子樹並累計大小；F 以子樹大小查第 k 大。'
solution_outline: |-
  以實際薪資減全域 offset 作鍵。I 插入 x-offset；A/S 只改 offset。S 後分裂掉鍵小於 min-offset 的整棵子樹並累計大小；F 以子樹大小查第 k 大。
proof_or_invariant: |-
  所有在職者實薪恆為 key+offset。整體調薪只改 offset 保持順序；分裂界線等價於實薪下限，故刪除與排名都精確。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O(n log n)'
  space: 'O(n)'
cpp_skeleton: |-
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依題卡的不變量完成平衡樹、KD-tree 或 Link-Cut Tree。
      return 0;
  }
cpp_solution: |-
  #if defined(__GNUC__)
  #pragma GCC diagnostic ignored "-Wconversion"
  #pragma GCC diagnostic ignored "-Wshadow"
  #pragma GCC diagnostic ignored "-Wpedantic"
  #pragma GCC diagnostic ignored "-Wsign-compare"
  #pragma GCC diagnostic ignored "-Wunused-parameter"
  #pragma GCC diagnostic ignored "-Wunused-variable"
  #pragma GCC diagnostic ignored "-Wunused-function"
  #pragma GCC diagnostic ignored "-Wunused-result"
  #pragma GCC diagnostic ignored "-Wparentheses"
  #pragma GCC diagnostic ignored "-Wmisleading-indentation"
  #pragma GCC diagnostic ignored "-Wdangling-else"
  #pragma GCC diagnostic ignored "-Wsequence-point"
  #pragma GCC diagnostic ignored "-Wclass-memaccess"
  #pragma GCC diagnostic ignored "-Wimplicit-fallthrough"
  #endif
  // P1486.cpp
  #include <bits/stdc++.h>
  #include <ext/pb_ds/tree_policy.hpp>
  #include <ext/pb_ds/assoc_container.hpp>
  using namespace __gnu_pbds;
  using namespace std;

  struct node
  {
      int salary, id;
      bool operator>(const node &nd) const { return salary == nd.salary ? id > nd.id : salary > nd.salary; }
  };

  tree<node, null_type, greater<node>, rb_tree_tag, tree_order_statistics_node_update> T, tre;
  char str[10];

  int main()
  {
      int cases, m, k, bias = 0, q, ans = 0;
      scanf("%d%d", &cases, &m);
      while (cases--)
      {
          scanf("%s%d", str, &k);
          if (str[0] == 'I')
          {
              k += bias;
              if (k >= m)
                  T.insert(node{k, cases});
          }
          else if (str[0] == 'A')
              m -= k, bias -= k;
          else if (str[0] == 'S')
          {
              m += k, bias += k;
              T.split(node{m, -1}, tre);
              ans += tre.size();
          }
          else
              printf(k > T.size() ? "-1\n" : "%d\n", T.find_by_order(k - 1)->salary - bias);
      }
      printf("%d", ans);
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1486
external_platform: '洛谷'
external_problem_id: 'P1486'
external_title: '[NOI2004] 鬱悶的出納員'
external_relation: original
source_book_pages: [296, 299]
source_pdf_pages: [314, 317]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
