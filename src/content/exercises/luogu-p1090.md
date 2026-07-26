---
id: luogu-p1090
volume: upper
source_file: upper-volume
title: 洛谷 P1090 合併果子：最小代價合併
chapter: 1
section: '1.5'
kind: external-oj
difficulty: 2
topics: ['堆積', '貪心', '霍夫曼樹']
prerequisites: ['heap', 'greedy']
statement: |-
  有 n 堆果子，第 i 堆有 a_i 顆。一次可任選兩堆合成一堆，這次耗費等於兩堆顆數之和；新堆之後仍可參與合併。求把所有果子合成一堆所需的最小總耗費。
constraints:
  - '1 ≤ n ≤ 10^4'
  - '1 ≤ a_i ≤ 2 × 10^4'
  - '答案保證小於 2^31'
input_format: '第一行為果子堆數 n；第二行為 n 個整數 a_i。'
output_format: '輸出一個整數，表示合併成一堆的最小總耗費。'
samples:
  - input: |
      4
      1 2 3 9
    output: |
      24
    explanation: |-
      先合併 1、2，耗費 3；再合併 3、3，耗費 6；最後合併 6、9，耗費 15，總和為 24。此為本站自製範例。
core_knowledge:
  - '每次取出兩個最小值的貪心策略'
  - '小根堆動態維護目前最小的兩堆'
  - '問題等價於建立最小加權外部路徑長度的霍夫曼樹'
judgment: '每次合併都會產生一個必須重新加入候選集合的新堆；需要反覆取兩個最小值並插入其和，正是小根堆的典型使用情境。'
hints:
  - '先想一想：較大的堆若很早合併，是否會在後續多次被重複計入成本？'
  - '可以用交換論證證明，某個最優方案的第一次合併一定能選目前最小的兩堆。'
  - '把所有堆放入小根堆；每輪彈出兩個最小值，將兩者之和加進答案並推回堆中，直到只剩一堆。'
solution_outline: |-
  將所有堆的大小放入小根堆。只要堆內多於一個元素，就取出最小的兩堆 x、y，累加 x+y，再把 x+y 放回。最後的累加值即為答案。
proof_or_invariant: |-
  設目前最小的兩堆為 x、y。任取一棵代表某個最優合併順序的二元樹，葉權重為初始堆大小，總成本等於各葉權重乘其深度。可在不增加成本下，讓深度最大的兩個同父葉改放最小權重 x、y；因此存在最優解先合併 x、y。把它們縮成權重 x+y 的新葉後，剩餘問題同型。反覆套用此論證，演算法每一步都可延伸成最優解。
common_errors:
  - '只排序一次後相鄰合併，沒有把新堆放回正確的大小位置'
  - '忘記 n=1 時不需合併，答案為 0'
  - '累加變數使用過小型別；即使本題答案受限，使用 long long 較穩健'
complexity:
  time: 'O(n log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n;
      if (!(cin >> n)) { return 0; }
      priority_queue<long long, vector<long long>, greater<long long>> heap;
      for (int i = 0; i < n; ++i) {
          long long pile_size;
          cin >> pile_size;
          heap.push(pile_size);
      }

      long long answer = 0;
      // TODO：當堆中至少有兩堆時，取最小的兩堆合併、累加並放回。
      cout << answer << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n;
      if (!(cin >> n)) { return 0; }
      priority_queue<long long, vector<long long>, greater<long long>> heap;
      for (int i = 0; i < n; ++i) {
          long long pile_size;
          cin >> pile_size;
          heap.push(pile_size);
      }

      long long answer = 0;
      while (heap.size() > 1) {
          long long first = heap.top();
          heap.pop();
          long long second = heap.top();
          heap.pop();
          answer += first + second;
          heap.push(first + second);
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1090
external_platform: 洛谷
external_problem_id: P1090
external_title: '[NOIP 2004 提高组] 合并果子'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

這是「每次合併都會把重量帶到後續成本」的經典模型；理解交換論證，比只背誦小根堆模板更重要。
