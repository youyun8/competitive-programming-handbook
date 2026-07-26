---
id: luogu-p5324
volume: upper
source_file: upper-volume
title: 洛谷 P5324 刪數：動態區間覆蓋
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 5
topics: ['線段樹', '區間覆蓋', '貪心', '全域偏移']
prerequisites: ['lazy-propagation', 'coordinate-shift']
statement: |-
  長度為 k 的數列可進行一次操作：刪除所有值等於 k 的元素。若有限次操作後能刪空，
  稱數列可刪空。給定長度 n 的數列，支援單點改值與全體加一或減一；
  每次修改後，求至少還需改動多少個元素才能使數列可刪空。
constraints:
  - 1 ≤ n,m ≤ 150000
  - 初始 1 ≤ a_i ≤ n
  - 單點修改的新值在 [1,n]
  - 全域修改量為 -1 或 1
input_format: |-
  第一行 n、m，第二行 n 個初值。接下來 m 行為 p、x：
  p>0 時令 a_p=x；p=0 時令全數列加 x。
output_format: 每次修改後輸出一行最少額外修改次數。
samples:
  - input: |
      3 9
      1 2 3
      1 1
      0 1
      0 1
      0 1
      2 2
      3 2
      0 -1
      0 -1
      0 -1
    output: |
      0
      1
      2
      3
      2
      1
      1
      2
      2
    explanation: 每種值 v 若出現 cnt_v 次，可向左覆蓋 cnt_v 個「刪除階段」。
core_knowledge:
  - 可刪空條件的區間覆蓋轉化
  - 線段樹維護區間最小值與最小值個數
  - 用偏移量把全體加減轉成查詢窗平移
judgment: |-
  對每個有效值 v 維護覆蓋 [v-cnt_v+1,v]；答案是目前長度窗中覆蓋次數為零的位置數。
hints:
  - 反向觀察刪除過程：值 v 的所有副本可以填補哪些連續的數列長度？
  - 出現 cnt_v 次的 v 能覆蓋 v 往左的 cnt_v 個整數位置。
  - 全體加減不必搬動所有桶；固定桶座標並平移代表實際值 1..n 的查詢窗。
solution_outline: |-
  令 cnt_v 為值 v 的出現次數。每種值覆蓋 [v-cnt_v+1,v]，
  [1,n] 中未覆蓋點數即最少修改數。線段樹維護覆蓋次數的區間最小值及其個數。
  單點改值只需移除舊桶區間、更新桶計數、加入新桶區間。
  以 shift 表示「內部值 = 實際值 + shift」；全域 +1 時 shift 減一，
  並處理滑動窗兩端進出的一個桶，-1 同理。
proof_or_invariant: |-
  刪除時數列長度只會下降；cnt_v 個值 v 最多承擔從 v 開始向左的 cnt_v 個連續
  長度階段，故對應覆蓋區間。未覆蓋的每個階段至少需要一個被修改元素，而把一個
  元素改成該缺少長度可逐階段補齊，所以下界可達。線段樹始終記錄所有目前有效桶
  的覆蓋和，最小值為零時其個數正是答案；若最小值大於零則答案為零。
common_errors:
  - 全域平移後仍讓查詢窗外的桶產生覆蓋
  - 桶計數增減時更新了錯誤的左端點
  - 座標範圍沒有預留 m 次負向平移
complexity:
  time: O((n+m) log(n+m))
  space: O(n+m)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // TODO：維護 [v-cnt[v]+1,v] 的覆蓋次數，
  // 並以 shift 平移有效查詢窗。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct MinimumInfo {
      int value;
      int count;
  };

  class SegmentTree {
  public:
      explicit SegmentTree(int size)
          : minimum_(static_cast<size_t>(size) * 4 + 4),
            count_(static_cast<size_t>(size) * 4 + 4),
            lazy_(static_cast<size_t>(size) * 4 + 4) {
          build(1, 1, size);
      }

      void add(int node, int l, int r, int ql, int qr, int delta) {
          if (ql > qr || qr < l || r < ql) { return; }
          if (ql <= l && r <= qr) {
              minimum_[static_cast<size_t>(node)] += delta;
              lazy_[static_cast<size_t>(node)] += delta;
              return;
          }
          push(node);
          const int mid = (l + r) / 2;
          add(node * 2, l, mid, ql, qr, delta);
          add(node * 2 + 1, mid + 1, r, ql, qr, delta);
          pull(node);
      }

      MinimumInfo query(int node, int l, int r, int ql, int qr) {
          if (ql <= l && r <= qr) {
              return {
                  minimum_[static_cast<size_t>(node)],
                  count_[static_cast<size_t>(node)],
              };
          }
          push(node);
          const int mid = (l + r) / 2;
          if (qr <= mid) { return query(node * 2, l, mid, ql, qr); }
          if (ql > mid) {
              return query(node * 2 + 1, mid + 1, r, ql, qr);
          }
          return merge_info(
              query(node * 2, l, mid, ql, qr),
              query(node * 2 + 1, mid + 1, r, ql, qr));
      }

  private:
      vector<int> minimum_;
      vector<int> count_;
      vector<int> lazy_;

      static MinimumInfo merge_info(const MinimumInfo left,
                                    const MinimumInfo right) {
          if (left.value < right.value) { return left; }
          if (right.value < left.value) { return right; }
          return {left.value, left.count + right.count};
      }

      void build(int node, int l, int r) {
          if (l == r) {
              count_[static_cast<size_t>(node)] = 1;
              return;
          }
          const int mid = (l + r) / 2;
          build(node * 2, l, mid);
          build(node * 2 + 1, mid + 1, r);
          pull(node);
      }

      void push(int node) {
          const int tag = lazy_[static_cast<size_t>(node)];
          if (tag == 0) { return; }
          for (const int child : {node * 2, node * 2 + 1}) {
              minimum_[static_cast<size_t>(child)] += tag;
              lazy_[static_cast<size_t>(child)] += tag;
          }
          lazy_[static_cast<size_t>(node)] = 0;
      }

      void pull(int node) {
          const MinimumInfo merged = merge_info(
              {minimum_[static_cast<size_t>(node * 2)],
               count_[static_cast<size_t>(node * 2)]},
              {minimum_[static_cast<size_t>(node * 2 + 1)],
               count_[static_cast<size_t>(node * 2 + 1)]});
          minimum_[static_cast<size_t>(node)] = merged.value;
          count_[static_cast<size_t>(node)] = merged.count;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n, operation_count;
      cin >> n >> operation_count;
      const int coordinate_count = 2 * (n + operation_count) + 10;
      int shift = n + operation_count + 3;
      vector<int> sequence(static_cast<size_t>(n) + 1);
      vector<int> frequency(static_cast<size_t>(coordinate_count) + 1);
      for (int i = 1; i <= n; ++i) {
          int value;
          cin >> value;
          sequence[static_cast<size_t>(i)] = value + shift;
          ++frequency[static_cast<size_t>(value + shift)];
      }

      SegmentTree tree(coordinate_count);
      const auto change_bucket = [&](int value, int delta) {
          const int frequency_value = frequency[static_cast<size_t>(value)];
          if (frequency_value == 0) { return; }
          tree.add(1, 1, coordinate_count,
                   value - frequency_value + 1, value, delta);
      };
      for (int value = shift + 1; value <= shift + n; ++value) {
          change_bucket(value, 1);
      }

      for (int operation = 0; operation < operation_count; ++operation) {
          int position, value;
          cin >> position >> value;
          if (position != 0) {
              const int old_value = sequence[static_cast<size_t>(position)];
              if (shift < old_value && old_value <= shift + n) {
                  change_bucket(old_value, -1);
              }
              --frequency[static_cast<size_t>(old_value)];
              if (shift < old_value && old_value <= shift + n) {
                  change_bucket(old_value, 1);
              }

              const int new_value = value + shift;
              if (frequency[static_cast<size_t>(new_value)] > 0) {
                  change_bucket(new_value, -1);
              }
              ++frequency[static_cast<size_t>(new_value)];
              change_bucket(new_value, 1);
              sequence[static_cast<size_t>(position)] = new_value;
          } else if (value == 1) {
              change_bucket(shift + n, -1);
              --shift;
              change_bucket(shift + 1, 1);
          } else {
              change_bucket(shift + 1, -1);
              ++shift;
              change_bucket(shift + n, 1);
          }

          const MinimumInfo result =
              tree.query(1, 1, coordinate_count, shift + 1, shift + n);
          cout << (result.value == 0 ? result.count : 0) << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5324
external_platform: Luogu
external_problem_id: P5324
external_title: '[BJOI2019] 刪數'
external_relation: original
source_book_pages: [204]
source_pdf_pages: [222]
review_status: verified
---

關鍵不是模擬刪除，而是數出哪些「目前長度」沒有任何值能承擔。
