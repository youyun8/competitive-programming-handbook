---
id: luogu-p1168
volume: upper
source_file: upper-volume
title: 洛谷 P1168 中位數：對頂堆
chapter: 1
section: '1.5'
kind: external-oj
difficulty: 2
topics: ['堆積', '對頂堆', '動態中位數']
prerequisites: ['heap']
statement: |-
  給定一個長度為 N 的非負整數序列。讀入第 1、3、5……個元素後，分別輸出目前整個前綴排序後正中央的數；也就是對每個奇數長度前綴求一次中位數。
constraints:
  - '1 ≤ N ≤ 100000'
  - '0 ≤ A_i ≤ 10^9'
input_format: '第一行為序列長度 N；第二行為 N 個非負整數 A_i。'
output_format: '共 (N+1)/2 行，依序輸出前 1、3、5……項的中位數。'
samples:
  - input: |
      7
      5 1 9 2 8 3 4
    output: |
      5
      5
      5
      4
    explanation: |-
      奇數長度前綴排序後依序為 [5]、[1,5,9]、[1,2,5,8,9]、[1,2,3,4,5,8,9]，中央值依序為 5、5、5、4。此為本站自製範例。
core_knowledge:
  - '大根堆保存較小的一半，小根堆保存較大的一半'
  - '兩堆間的順序與大小不變量'
  - '線上維護順序統計量'
judgment: '查詢只出現在奇數長度前綴，但每次加入都會改變排名；重新排序每個前綴成本過高，可用對頂堆讓插入與平衡皆為 O(log N)。'
hints:
  - '若把已讀元素切成較小、較大兩半，中位數會位於哪一半的邊界？'
  - '使用大根堆存較小的一半、小根堆存較大的一半，並維持前者元素皆不大於後者。'
  - '每次插入後搬動堆頂，使大根堆的大小等於小根堆，或恰好多一個；在奇數位置輸出大根堆頂。'
solution_outline: |-
  令 lower 為大根堆，upper 為小根堆。新值不大於 lower 堆頂時放入 lower，否則放入 upper；接著搬動堆頂，使 lower 的元素數不小於 upper 且最多多一。每處理奇數個元素時，lower 堆頂就是中位數。
proof_or_invariant: |-
  維持兩個不變量：(1) lower 中每個值都不大於 upper 中每個值；(2) |lower| 等於 |upper| 或多 1。依 lower 堆頂分流新值不破壞順序，跨堆搬動邊界值也保持順序，並恢復大小條件。奇數個元素時 lower 恰好多一個，因此其最大值之前有相同數量的元素、之後也有相同數量的元素，正是中位數。
common_errors:
  - '兩堆大小平衡了，卻未維持 lower 的所有值不大於 upper'
  - '在偶數位置也輸出，造成答案行數錯誤'
  - '將中位數誤解為偶數前綴兩個中央值的平均；本題只查奇數前綴'
complexity:
  time: 'O(N log N)'
  space: 'O(N)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n;
      if (!(cin >> n)) { return 0; }
      priority_queue<long long> lower;
      priority_queue<long long, vector<long long>, greater<long long>> upper;

      for (int i = 1; i <= n; ++i) {
          long long value;
          cin >> value;
          // TODO 1：依邊界把 value 放入其中一個堆。
          // TODO 2：搬動堆頂，使 lower 的大小等於 upper 或多一個。
          // TODO 3：i 為奇數時輸出中位數。
      }
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
      priority_queue<long long> lower;
      priority_queue<long long, vector<long long>, greater<long long>> upper;

      for (int i = 1; i <= n; ++i) {
          long long value;
          cin >> value;
          if (lower.empty() || value <= lower.top()) {
              lower.push(value);
          } else {
              upper.push(value);
          }

          if (lower.size() > upper.size() + 1) {
              upper.push(lower.top());
              lower.pop();
          } else if (upper.size() > lower.size()) {
              lower.push(upper.top());
              upper.pop();
          }

          if (i % 2 == 1) {
              cout << lower.top() << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1168
external_platform: 洛谷
external_problem_id: P1168
external_title: 中位数
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

對頂堆把「動態排序後的中央位置」轉成兩個堆頂，是串流資料中維護中位數的標準技巧。
