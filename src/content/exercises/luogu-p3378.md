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
  維護一個初始為空的小根堆，支援三種操作：插入一個數、輸出最小數、刪除最小數。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '操作次數大，每次操作需為 O(log n)'
  - '完整限制條件請參閱外部題目頁面'
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
      依序插入 5、2 後最小值是 2；再插入 8 最小值仍是 2；刪除最小值後剩 5、8，最小值為 5。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    C++ 的 `priority_queue` 預設是**大根堆**，直接 `top()` 拿到的是最大值。要小根堆必須把比較器換成 `greater<int>`，也就是 `priority_queue<int, vector<int>, greater<int>>`。
  - |-
    不要用 `vector` 加 `min_element` 硬撐：那樣每次查詢與刪除都是 O(n)，總複雜度退化成 O(n²)。堆的價值就在於插入與刪除都是 O(log n)、取極值是 O(1)。
  - |-
    若想自己手寫二元堆：用一維陣列存完全二元樹，節點 i 的子節點是 2i 與 2i+1。插入時放到尾端再「上浮」，刪除時把尾端搬到根再「下沉」，兩者都只走一條到葉的路徑，所以是 O(log n)。
  - |-
    輸出要記得換行，且不要在操作 3 時輸出任何東西——只有操作 2 才產生輸出。
solution_outline: |-
  直接用 `priority_queue<int, vector<int>, greater<int>>`。操作 1 對應 `push`，操作 2 對應 `top`，操作 3 對應 `pop`。全部交給 STL，重點是記得指定 `greater` 把預設的大根堆翻成小根堆。
proof_or_invariant: |-
  二元堆的不變量是「每個節點都不大於它的兩個子節點」，因此根一定是全域最小值。插入時的上浮與刪除時的下沉各自只沿一條根到葉的路徑移動，路徑長度為 O(log n)，且移動過程中始終維持該不變量。
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
