---
id: luogu-p1198
volume: upper
source_file: upper-volume
title: 洛谷 P1198 最大數：尾端插入與後綴最大值
chapter: 2
section: '2.5'
kind: external-oj
difficulty: 3
topics: ['線段樹', '動態 RMQ']
prerequisites: ['segment-tree']
statement: |-
  維護一個初始為空的數列。操作 `Q L` 查詢最後 L 個數的最大值並記為 t；操作 `A x` 把 (x+t) mod D 插入數列尾端。尚未查詢時 t=0。依序輸出每次查詢結果。
constraints:
  - '1 <= M <= 200000'
  - '1 <= D <= 2000000000'
  - 'Q 操作滿足 1 <= L <= 目前數列長度'
  - 'A 操作的 x 可能為負且在 long 範圍內'
input_format: '第一行輸入操作數 M 與模數 D；接著 M 行各為 `Q L` 或 `A x`。'
output_format: '每個 Q 操作輸出一行答案。'
samples:
  - input: |
      5 100
      A 96
      Q 1
      A 97
      Q 1
      Q 2
    output: |
      96
      93
      96
    explanation: '第一次查詢得 96；接著插入 (97+96) mod 100=93，最後兩數最大值仍為 96。'
core_knowledge:
  - '插入位置只會向右增加，可用單點更新線段樹。'
  - '最後 L 個數對應區間 [size-L,size-1]。'
judgment: '同時有追加與區間最大值查詢，靜態 ST 表不適用；使用線段樹。'
hints:
  - '先配置 M 個葉節點，因為最多只有 M 次插入。'
  - '每次 A 都在目前 size 位置單點寫入，再令 size 加一。'
  - 'A 的 x 可能為負，將 `(x+t)%D` 再加 D 取模，避免得到負餘數。'
solution_outline: '以最大值線段樹維護已插入元素。A 做尾端單點更新；Q 查詢 size-L 到 size-1 並更新 t。'
proof_or_invariant: |-
  每次插入後，線段樹每個節點皆保存其區間中所有已插入值的最大值。標準區間查詢把後綴分成互斥節點區間，合併其最大值即得答案；因此 t 與後續插入值也正確。
common_errors:
  - '忘記更新最近一次查詢答案 t。'
  - '把 Q L 誤解成查詢前 L 個數。'
  - '負數直接使用 C++ 的 `%` 而留下負結果。'
complexity:
  time: '每個操作 O(log M)'
  space: 'O(M)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int operation_count;
      long long modulus;
      cin >> operation_count >> modulus;
      // TODO：建立線段樹並實作尾端單點更新、後綴最大值查詢。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  class SegmentTree {
   public:
      explicit SegmentTree(int size) : leaf_count_(1) {
          while (leaf_count_ < size) { leaf_count_ *= 2; }
          tree_.assign(static_cast<size_t>(leaf_count_ * 2), 0);
      }
      void set_value(int position, long long value) {
          int node = position + leaf_count_;
          tree_[static_cast<size_t>(node)] = value;
          for (node /= 2; node > 0; node /= 2) {
              tree_[static_cast<size_t>(node)] =
                  max(tree_[static_cast<size_t>(node * 2)],
                      tree_[static_cast<size_t>(node * 2 + 1)]);
          }
      }
      long long query(int left, int right) const {
          long long answer = 0;
          for (left += leaf_count_, right += leaf_count_; left <= right;
               left /= 2, right /= 2) {
              if (left % 2 == 1) { answer = max(answer, tree_[static_cast<size_t>(left++)]); }
              if (right % 2 == 0) { answer = max(answer, tree_[static_cast<size_t>(right--)]); }
          }
          return answer;
      }
   private:
      int leaf_count_;
      vector<long long> tree_;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int operation_count;
      long long modulus;
      if (!(cin >> operation_count >> modulus)) { return 0; }
      SegmentTree tree(operation_count);
      int size = 0;
      long long last_answer = 0;
      for (int operation = 0; operation < operation_count; ++operation) {
          char type;
          long long argument;
          cin >> type >> argument;
          if (type == 'A') {
              const long long value =
                  ((argument + last_answer) % modulus + modulus) % modulus;
              tree.set_value(size, value);
              ++size;
          } else {
              const int length = static_cast<int>(argument);
              last_answer = tree.query(size - length, size - 1);
              cout << last_answer << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1198
external_platform: 洛谷
external_problem_id: P1198
external_title: '[JSOI2008] 最大數'
external_relation: original
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

這題凸顯靜態 RMQ 與動態 RMQ 的分界：一旦資料會新增，就需要支援更新的結構。
