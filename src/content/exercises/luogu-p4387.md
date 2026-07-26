---
id: luogu-p4387
volume: lower
source_file: lower-volume
source_book_pages: [387, 461]
source_pdf_pages: [17, 91]
title: 洛谷 P4387 驗證棧序列
chapter: 6
section: '6.4'
kind: external-oj
difficulty: 2
topics: ['棧', '序列模擬']
prerequisites: ['stack']
statement: 給定互不重複的入棧序列 pushed 與候選出棧序列 popped，判斷是否能以合法的逐次入棧、出棧操作得到 popped。
constraints:
  - 每個測試點有不超過 5 組詢問
  - 每組兩個序列都是同一組互異元素的排列
input_format: 第一行為詢問數 q；每組先給長度 n，再依序給 n 個入棧元素及 n 個候選出棧元素。
output_format: 每組可行輸出 `Yes`，否則輸出 `No`。
samples:
  - input: |
      2
      5
      1 2 3 4 5
      5 4 3 2 1
      4
      1 2 3 4
      2 4 1 3
    output: |
      Yes
      No
    explanation: 第一組全部入棧後逆序彈出即可；第二組彈出 2、4 後，1 被 3 壓住，無法再先彈出 1。
core_knowledge:
  - LIFO 棧序
  - 貪心模擬
judgment: 每讀入一個 pushed 元素便入棧，並盡可能匹配 popped 的下一項；延遲已可進行的匹配不會創造額外可能性。
hints:
  - 依 pushed 的固定順序逐一入棧，維護 popped 中下一個尚未匹配的位置。
  - 每次入棧後，只要棧頂等於下一個待彈值，就立刻彈出並繼續檢查新棧頂。
  - 掃描結束後，若恰好匹配 n 個 popped 元素則可行；否則被較晚元素壓住的目標永遠無法先出棧。
solution_outline: 對 pushed 線性掃描並以 vector 模擬棧；每次 push 後反覆比較棧頂與 popped 指標，最後檢查指標是否到 n。
proof_or_invariant: 掃描 pushed 前 i 項後，棧中恰為已入棧但尚未匹配的元素，且 popped 指標之前的前綴已合法產生。若棧頂等於下一目標，任何合法方案都可立即彈出它；若不等，當前無合法彈出能推進目標。歸納可知演算法判定正確。
complexity:
  time: 每組 O(n)
  space: O(n)
common_errors:
  - 只在每次入棧後匹配一次，漏掉連續彈出
  - 把 pushed 與 popped 的角色顛倒
  - 僅檢查最後棧是否為空而未確認 popped 指標
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int query_count;
      cin >> query_count;
      while (query_count-- > 0) {
          int n;
          cin >> n;
          vector<int> pushed(static_cast<size_t>(n));
          vector<int> popped(static_cast<size_t>(n));
          for (int& value : pushed) { cin >> value; }
          for (int& value : popped) { cin >> value; }
          vector<int> stack_values;
          int pop_index = 0;
          for (int value : pushed) {
              stack_values.push_back(value);
              // TODO：反覆彈出所有已等於下一個目標的棧頂。
              while (false) { stack_values.pop_back(); }
          }
          cout << (pop_index == n ? "Yes\n" : "No\n");
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int query_count;
      cin >> query_count;
      while (query_count-- > 0) {
          int n;
          cin >> n;
          vector<int> pushed(static_cast<size_t>(n));
          vector<int> popped(static_cast<size_t>(n));
          for (int& value : pushed) { cin >> value; }
          for (int& value : popped) { cin >> value; }
          vector<int> stack_values;
          int pop_index = 0;
          for (int value : pushed) {
              stack_values.push_back(value);
              while (!stack_values.empty() && pop_index < n &&
                     stack_values.back() == popped[static_cast<size_t>(pop_index)]) {
                  stack_values.pop_back();
                  ++pop_index;
              }
          }
          cout << (pop_index == n ? "Yes\n" : "No\n");
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4387
external_platform: Luogu
external_problem_id: P4387
external_title: '【深基15.習9】驗證棧序列'
external_relation: original
review_status: verified
---

本題雖列在消元章節題單，實際核心是棧的 LIFO 模擬。
