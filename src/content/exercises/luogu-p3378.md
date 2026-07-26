---
id: luogu-p3378
volume: upper
source_file: upper-volume
title: 洛谷 P3378 堆：小根堆的三種操作
chapter: 1
section: '1.5'
kind: external-oj
difficulty: 1
topics: ['堆積', '優先佇列', 'STL']
prerequisites: ['heap']
statement: |-
  維護一個初始為空的整數多重集合。每次指令可能加入一個整數、詢問目前的最小值，或只刪除一份目前的最小值。相同數值可同時存在多份。
constraints:
  - '1 ≤ n ≤ 10^6'
  - '插入值滿足 1 ≤ x < 2^31；操作代碼為 1、2 或 3'
  - '詢問或刪除最小值時，集合保證非空'
input_format: '第一行一個整數 n 表示操作次數；接下來 n 行，每行是 `1 x`（插入 x）、`2`（輸出最小值）或 `3`（刪除最小值）。'
output_format: '對每個操作 2 輸出一行，表示當前堆中的最小值。'
samples:
  - input: |
      7
      1 5
      1 2
      2
      1 8
      2
      3
      2
    output: |
      2
      2
      5
    explanation: |-
      依序插入 5、2 後最小值是 2；加入 8 不改變最小值；刪除一份 2 後，剩餘元素為 5、8。此為本站依操作規格自製的範例。
core_knowledge:
  - '小根堆的根節點保存全域最小值'
  - 'priority_queue 搭配 greater 建立小根堆'
  - '插入上浮與刪除根節點後下沉'
judgment: '資料量達百萬筆操作；線性搜尋最小值會退化為平方級，需使用每次更新 O(log n)、查詢 O(1) 的小根堆。'
hints:
  - |-
    C++ 的 `priority_queue` 預設是**大根堆**，直接 `top()` 拿到的是最大值。要小根堆必須把比較器換成 `greater<int>`，也就是 `priority_queue<int, vector<int>, greater<int>>`。
  - |-
    不要用 `vector` 加 `min_element` 硬撐：那樣每次查詢與刪除都是 O(n)，總複雜度退化成 O(n²)。堆的價值就在於插入與刪除都是 O(log n)、取極值是 O(1)。
  - |-
    若手寫二元堆，可用一維陣列存完全二元樹：插入後上浮，刪除時把尾端搬到根再下沉。使用 STL 時三種操作依序對應 `push`、`top`、`pop`；只有查詢指令需要輸出。
solution_outline: |-
  直接用 `priority_queue<int, vector<int>, greater<int>>`。操作 1 對應 `push`，操作 2 對應 `top`，操作 3 對應 `pop`。全部交給 STL，重點是記得指定 `greater` 把預設的大根堆翻成小根堆。
proof_or_invariant: |-
  小根堆的不變量是「每個父節點都不大於其子節點」，沿根到任一節點的路徑可知根不大於所有元素，因此根是全域最小值。插入只可能破壞新節點至根的路徑，上浮可修復；刪除根後只可能破壞新根至葉的路徑，下沉可修復。故每次操作後，不變量與集合中的元素份數皆正確。
common_errors:
  - '沿用 priority_queue 的預設大根堆，導致 top() 取得最大值'
  - '刪除最小值時誤刪所有同值元素，而非只刪除一份'
  - '在刪除指令輸出數值，或在保證非空以外自行加入錯誤的空堆行為'
complexity:
  time: '每次操作 O(log n)，取最小值 O(1)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }

      // TODO 1：宣告一個小根堆。priority_queue 預設是「大根堆」，
      //         要拿最小值必須自己指定比較器。
      vector<int> values;  // 先用最樸素的容器佔位，之後換掉

      for (int i = 0; i < n; ++i) {
          int op;
          cin >> op;
          if (op == 1) {
              int x;
              cin >> x;
              // TODO 2：插入 x。
              values.push_back(x);
          } else if (op == 2) {
              // TODO 3：輸出當前最小值，應該是 O(1) 而不是每次掃一遍。
              cout << *min_element(values.begin(), values.end()) << '\n';
          } else {
              // TODO 4：刪除最小值。
              values.erase(min_element(values.begin(), values.end()));
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 小根堆：STL priority_queue 預設是大根堆，套 greater<> 才會變小根。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      priority_queue<int, vector<int>, greater<int>> heap;
      for (int i = 0; i < n; ++i) {
          int op;
          cin >> op;
          if (op == 1) {
              int x;
              cin >> x;
              heap.push(x);
          } else if (op == 2) {
              cout << heap.top() << '\n';
          } else {
              heap.pop();
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3378
external_platform: 洛谷
external_problem_id: P3378
external_title: '【模板】堆'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

最短的模板題，但正是最容易在比賽中因為忘記 `greater` 而吃 WA 的地方。手寫一次上浮與下沉，之後用 STL 才會踏實。
