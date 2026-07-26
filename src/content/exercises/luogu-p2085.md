---
id: luogu-p2085
volume: upper
source_file: upper-volume
title: 洛谷 P2085 最小函數值：多路有序序列合併
chapter: 1
section: '1.5'
kind: external-oj
difficulty: 2
topics: ['堆積', '多路合併', '二次函數']
prerequisites: ['heap']
statement: |-
  給定 n 個二次函數 F_i(x)=A_i x²+B_i x+C_i，其中 x 只取正整數。把所有函數在所有合法 x 上得到的值合在一起，重複值也分別保留，求其中最小的 m 個值並由小到大輸出。
constraints:
  - '1 ≤ n,m ≤ 10000'
  - '1 ≤ A_i ≤ 10，1 ≤ B_i ≤ 100，1 ≤ C_i ≤ 10000'
  - 'x 為正整數'
input_format: '第一行為 n、m；接下來 n 行各有 A_i、B_i、C_i。'
output_format: '在同一行依非遞減順序輸出最小的 m 個函數值，以空格分隔。'
samples:
  - input: |
      3 10
      4 5 3
      3 4 5
      1 7 1
    output: |
      9 12 12 19 25 29 31 44 45 54
    explanation: |-
      三條遞增序列分別從 F_1(1)=12、F_2(1)=12、F_3(1)=9 開始。先取 9 後，只需把同一函數的下一項 F_3(2)=19 放入候選；如此重複十次即得到輸出。此範例已與洛谷題面核對。
core_knowledge:
  - '正係數使每個函數值序列嚴格遞增'
  - '小根堆合併 n 條有序序列'
  - '堆節點需同時記錄值、函數編號與目前的 x'
judgment: '每個函數各自產生一條無限遞增序列；不能枚舉完整範圍，但全域下一個最小值必在各序列尚未取用的第一項之中。'
hints:
  - '先比較 F_i(x+1) 與 F_i(x)：在係數皆為正數時，符號如何？'
  - '把每個函數視為一條已排序的無限序列，只保留每條序列目前尚未輸出的第一個值。'
  - '初始把所有 F_i(1) 放入小根堆；彈出 (i,x) 後輸出其值，再推入同一函數的 (i,x+1)，重複 m 次。'
solution_outline: |-
  保存每個函數的三個係數。小根堆先放入 n 個節點 (F_i(1),i,1)。每次取出最小節點並輸出，接著只將該節點所屬函數的下一個值放回。執行 m 次。
proof_or_invariant: |-
  因 F_i(x+1)-F_i(x)=A_i(2x+1)+B_i>0，每個函數形成嚴格遞增序列。堆的不變量是：對每條序列，堆內恰有其尚未輸出部分的第一項。任何未輸出值都不小於其序列的第一項，因此堆頂是所有未輸出值的全域最小者。彈出後補入同序列下一項即可恢復不變量，歸納可知輸出恰為前 m 小值。
common_errors:
  - '把 x 從 0 開始；題目限定 x 為正整數'
  - '只計算每個函數的前 m 項再全部排序，造成 O(nm) 的時間與空間'
  - '遇到相同函數值時去重；本題要求重複值也要輸出'
complexity:
  time: 'O((n+m) log n)'
  space: 'O(n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Function {
      long long a;
      long long b;
      long long c;
  };

  struct Node {
      long long value;
      int function_id;
      int x;
      bool operator>(const Node& other) const { return value > other.value; }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int m;
      if (!(cin >> n >> m)) { return 0; }
      vector<Function> functions(static_cast<size_t>(n));
      priority_queue<Node, vector<Node>, greater<Node>> heap;
      // TODO 1：讀入係數，並把每個函數在 x=1 的節點放入 heap。
      // TODO 2：取出並輸出 m 次；每次補入同一函數在 x+1 的節點。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Function {
      long long a;
      long long b;
      long long c;
  };

  struct Node {
      long long value;
      int function_id;
      int x;
      bool operator>(const Node& other) const { return value > other.value; }
  };

  long long evaluate(const Function& function, long long x) {
      return function.a * x * x + function.b * x + function.c;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int m;
      if (!(cin >> n >> m)) { return 0; }
      vector<Function> functions(static_cast<size_t>(n));
      priority_queue<Node, vector<Node>, greater<Node>> heap;
      for (int i = 0; i < n; ++i) {
          cin >> functions[static_cast<size_t>(i)].a
              >> functions[static_cast<size_t>(i)].b
              >> functions[static_cast<size_t>(i)].c;
          heap.push({evaluate(functions[static_cast<size_t>(i)], 1), i, 1});
      }

      for (int count = 0; count < m; ++count) {
          Node current = heap.top();
          heap.pop();
          if (count > 0) { cout << ' '; }
          cout << current.value;
          int next_x = current.x + 1;
          heap.push({
              evaluate(functions[static_cast<size_t>(current.function_id)], next_x),
              current.function_id,
              next_x
          });
      }
      cout << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2085
external_platform: 洛谷
external_problem_id: P2085
external_title: 最小函数值
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

這題的重點不是二次函數本身，而是辨認出「多條遞增序列取全域前 m 小」的通用模型。
