---
id: luogu-p1288
volume: lower
source_file: lower-volume
title: 洛谷 P1288 環上取數遊戲
chapter: 7
section: '7.9'
kind: external-oj
difficulty: 3
topics: [game-theory, parity]
prerequisites: [combinatorial-game-theory]
statement: 一個環的 n 條邊各有非負數且至少一條為 0，硬幣起於第 n 與第 1 邊之間。每回合選硬幣相鄰的一條正值邊，將值減少至任意非負數並把硬幣跨過該邊。無法操作者輸，判斷先手勝負。
constraints: [1 <= n <= 20, 0 <= edge_i <= 30, 至少一個 edge_i=0]
input_format: 第一行 n；第二行按順序給 n 條邊的值，起點在最後一條與第一條之間。
output_format: 先手必勝輸出 YES，否則輸出 NO。
samples:
  - input: |-
      4
      2 5 3 0
    output: 'YES'
    explanation: 起點往第一條邊方向，到第一個零以前有三條連續正值邊，長度為奇數。
  - input: |-
      3
      0 0 0
    output: 'NO'
    explanation: 起點兩側都是零，先手一開始便無法操作。
core_knowledge: [零邊切斷可達區域, 路徑長度奇偶策略]
judgment: 從起點分別沿兩方向只需考慮遇到第一條零以前的連續正值邊。
hints:
  - 一旦某條邊被減為零，就不能再跨過它。
  - 固定向一側走時，玩家可用「直接減成零」封住身後，遊戲等價於依序跨邊。
  - 左或右任一方向的連續正值邊數為奇數，先手即可選該方向獲勝。
solution_outline: 計算陣列開頭連續非零長度 right_length，以及結尾連續非零長度 left_length；任一為奇數即輸出 YES。
proof_or_invariant: 環上既有零邊，起點兩側遇到首個零後皆不可再前進。選定方向後，把剛跨過的邊降為零可封住返回方向，迫使雙方沿該鏈交替前進；奇數條由先手走最後一步，偶數條由後手走最後一步。先手可從兩方向擇一，因此存在奇長鏈即勝。
common_errors: [把所有非零邊總數拿來判奇偶, 起點左右順序弄反, 忽略全零情況]
complexity: { time: 'O(n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n; cin >> n; /* TODO: 計算起點兩側非零前綴。 */ return 0; }
cpp_solution: |
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<int> edge(static_cast<size_t>(n));
      for (int &value : edge) cin >> value;
      int right_length = 0;
      while (right_length < n && edge[static_cast<size_t>(right_length)] != 0) ++right_length;
      int left_length = 0;
      while (left_length < n &&
             edge[static_cast<size_t>(n - 1 - left_length)] != 0) ++left_length;
      cout << (((right_length & 1) != 0 || (left_length & 1) != 0) ? "YES\n" : "NO\n");
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1288
external_platform: 洛谷
external_problem_id: P1288
external_title: 取數遊戲 II
external_relation: original
source_book_pages: [511, 515]
source_pdf_pages: [141, 145]
review_status: verified
---

零邊把環切成起點兩側的有限鏈，策略只剩鏈長奇偶。
