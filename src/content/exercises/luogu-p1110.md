---
id: luogu-p1110
volume: upper
source_file: upper-volume
title: '洛谷 P1110 [ZJOI2007] 報表統計'
chapter: 4
section: '4.16'
kind: external-oj
difficulty: 5
topics: ['multiset', '有序集合', '局部差分維護']
prerequisites: ['multiset', '有序集合', '局部差分維護']
statement: |-
  維護按原始位置分組追加的非負整數序列，查相鄰差最小值 MIN_GAP 與任意兩值差最小值 MIN_SORT_GAP。
constraints:
  - '2 <= n,m <= 500000'
  - '0 <= a_i,k <= 500000000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      3 5
      5 3 1
      INSERT 2 9
      MIN_GAP
      MIN_SORT_GAP
      INSERT 2 6
      MIN_SORT_GAP
    output: |-
      2
      2
      1
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['multiset', '有序集合', '局部差分維護']
judgment: |-
  INSERT i k 永遠接在原始第 i 項及其既有追加項之後，不是目前序列第 i 名之後。
hints:
  - '先辨識核心模型：multiset、有序集合、局部差分維護；暫時不要處理所有操作細節。'
  - 'INSERT i k 永遠接在原始第 i 項及其既有追加項之後，不是目前序列第 i 名之後。'
  - '最後依此不變量實作：記每個原始位置目前尾值。插入只會替換該尾值與下一原始首值的一條相鄰差；另以有序 multiset 維護所有值，插入時只更新其前驅與後繼差。'
solution_outline: |-
  記每個原始位置目前尾值。插入只會替換該尾值與下一原始首值的一條相鄰差；另以有序 multiset 維護所有值，插入時只更新其前驅與後繼差。
proof_or_invariant: |-
  除被切開的舊鄰接與兩條新鄰接外，其餘相鄰對不變；排序後也只有新值與其前驅、後繼可能產生新的最小差，故兩個 multiset 始終完整。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O((n+m)log(n+m))'
  space: 'O(n+m)'
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
  // P1110.cpp
  #include <bits/stdc++.h>
  using namespace std;
  const int MAX_N = 1000100;
  int n, m, nxt[MAX_N], prv[MAX_N], val[MAX_N], tmpx, curs[MAX_N], ltot, min_gap = 0x3f3f3f3f;
  multiset<int> ms, splay;
  char opt[20];
  void insert_list(int x, int d)
  {
      int cursor = ++ltot;
      ms.erase(ms.lower_bound(abs(val[nxt[curs[d]]] - val[curs[d]])));
      nxt[cursor] = nxt[curs[d]], prv[cursor] = curs[d], val[cursor] = x;
      prv[nxt[curs[d]]] = ltot, nxt[curs[d]] = ltot;
      curs[d] = cursor;
      ms.insert(abs(val[prv[curs[d]]] - val[curs[d]])), ms.insert(abs(val[nxt[curs[d]]] - val[curs[d]]));
  }
  void update_set(int x)
  {
      multiset<int>::iterator it = splay.lower_bound(x);
      int nw = abs(*it - x);
      nw = min(nw, abs(x - *(--it)));
      min_gap = min(min_gap, nw);
      splay.insert(x);
  }
  int main()
  {
      scanf("%d%d", &n, &m);
      splay.insert(0x3f3f3f3f), splay.insert(-0x3f3f3f3f);
      for (int i = 1; i <= n; i++)
      {
          scanf("%d", &tmpx);
          val[i] = tmpx, prv[i] = i - 1, nxt[i] = i + 1, curs[i] = i;
          if (i != 1)
              ms.insert(abs(val[i] - val[i - 1]));
          update_set(tmpx);
      }
      nxt[n] = 0, ltot = n;
      while (m--)
      {
          scanf("%s", opt + 1);
          if (opt[1] == 'I')
          {
              int x, d;
              scanf("%d%d", &d, &x);
              insert_list(x, d), update_set(x);
          }
          else if (opt[5] == 'S')
              printf("%d\n", min_gap);
          else
              printf("%d\n", *(ms.begin()));
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1110
external_platform: '洛谷'
external_problem_id: 'P1110'
external_title: '[ZJOI2007] 報表統計'
external_relation: original
source_book_pages: [296, 299]
source_pdf_pages: [314, 317]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
