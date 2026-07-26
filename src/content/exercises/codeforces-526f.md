---
id: codeforces-526f
volume: lower
source_file: lower-volume
title: Codeforces 526F Pudding Monsters：連續值子區間計數
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['單調棧', '區間加值', '線段樹']
prerequisites: ['排列', '單調棧', 'lazy propagation']
statement: n×n 方格中恰有 n 隻怪物，每列與每欄各恰有一隻。計算所有軸對齊正方形子棋盤中，邊長為 k 且恰含 k 隻怪物的子棋盤數，k 可為 1 到 n。
constraints:
  - '1 <= n <= 300000'
  - '1 <= r_i, c_i <= n'
  - 所有 r_i 互異，且所有 c_i 互異
input_format: 第一行為 n；接著 n 行為怪物所在格的列 r_i 與欄 c_i。
output_format: 輸出符合條件的不同正方形子棋盤總數。
samples:
  - input: |
      5
      1 1
      4 3
      3 2
      2 4
      5 5
    output: |
      10
    explanation: 官方範例把怪物依列整理成欄排列 [1,4,2,3,5]；共有 10 個連續列區間的欄值集合也連續，因此對應 10 個合法正方形。
core_knowledge:
  - 每列一點可轉成欄編號排列
  - 不同整數區間連續的充要條件是 max-min=length-1
  - 單調棧分段更新所有左端點的區間最大、最小值
judgment: 依列建立排列 p。列區間 [l,r] 能形成唯一 k×k 合法正方形，當且僅當欄範圍寬度 max-min 等於 r-l。逐右端點維護所有左端點的 f=max-min-(r-l)，f 永不為負；線段樹只需統計最小值 0 的個數。
hints:
  - 因每列、每欄各一隻，選連續 k 列後恰有 k 隻；它們能落在某 k 個連續欄內，恰等價於最大欄減最小欄等於 k-1。
  - 固定右端 r，對每個 l 定義 f_l=max(p_l..p_r)-min(p_l..p_r)-(r-l)。加入新右端時，舊 l 的長度項使 f 全部減 1。
  - 用遞減棧找出新值成為區間最大值的左端點段並加上 max 增量；遞增棧同理加入 min 降低造成的增量。線段樹維護區間加、全域最小值及其出現次數。
solution_outline: 先按列建立欄排列。右端點由 1 掃到 n：對既有左端點 f 減 1，以最大值單調棧和最小值單調棧對各段補上變化量，再把新左端 r 設為 0。若線段樹根最小值為 0，把其計數加入答案。
proof_or_invariant: 對排列中的 k 個不同整數，max-min >= k-1，所以 f_l 始終非負，且 f_l=0 恰表示欄值連續。加入 p_r 後，長度增加使所有舊 f 減 1；最大值遞減棧的每個節點精確代表一段左端點共享的舊最大值，彈出段加 p_r-old_max 後得到新最大值，最小值棧同理加 old_min-p_r。因此線段樹葉值始終等於定義的 f，根節點計數在最小值 0 時正是以 r 結尾的合法區間數；逐 r 相加無重複。
complexity:
  time: O(n log n)
  space: O(n)
common_errors:
  - 未先按列重建排列，直接使用輸入順序
  - 把條件寫成 max-min=length 而差一
  - 加入右端點時忘記讓舊區間的 -(r-l) 全部減 1
  - 單調棧彈出多段時沒有更新下一段右界
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：維護每個左端點的 max-min-length+1，統計值為 0 的葉節點。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  class SegmentTree {
  public:
      explicit SegmentTree(int size)
          : size_(size),
            minimum_(static_cast<size_t>(4 * size), kInfinity),
            lazy_(static_cast<size_t>(4 * size), 0),
            count_(static_cast<size_t>(4 * size), 0) {
          build(1, 1, size_);
      }

      void add(int left, int right, long long value) {
          if (left <= right) { add(1, 1, size_, left, right, value); }
      }

      void activate(int position) { activate(1, 1, size_, position); }
      long long minimum() const { return minimum_[1]; }
      int minimum_count() const { return count_[1]; }

  private:
      static constexpr long long kInfinity = 1000000000000000LL;
      int size_;
      vector<long long> minimum_;
      vector<long long> lazy_;
      vector<int> count_;

      void build(int node, int left, int right) {
          if (left == right) {
              count_[static_cast<size_t>(node)] = 1;
              return;
          }
          const int middle = (left + right) / 2;
          build(node * 2, left, middle);
          build(node * 2 + 1, middle + 1, right);
          pull(node);
      }

      void apply(int node, long long value) {
          minimum_[static_cast<size_t>(node)] += value;
          lazy_[static_cast<size_t>(node)] += value;
      }

      void push(int node) {
          const long long value = lazy_[static_cast<size_t>(node)];
          if (value != 0) {
              apply(node * 2, value);
              apply(node * 2 + 1, value);
              lazy_[static_cast<size_t>(node)] = 0;
          }
      }

      void pull(int node) {
          const long long value =
              min(minimum_[static_cast<size_t>(node * 2)],
                  minimum_[static_cast<size_t>(node * 2 + 1)]);
          minimum_[static_cast<size_t>(node)] = value;
          count_[static_cast<size_t>(node)] = 0;
          if (minimum_[static_cast<size_t>(node * 2)] == value) {
              count_[static_cast<size_t>(node)] +=
                  count_[static_cast<size_t>(node * 2)];
          }
          if (minimum_[static_cast<size_t>(node * 2 + 1)] == value) {
              count_[static_cast<size_t>(node)] +=
                  count_[static_cast<size_t>(node * 2 + 1)];
          }
      }

      void add(int node, int left, int right, int query_left,
               int query_right, long long value) {
          if (query_left <= left && right <= query_right) {
              apply(node, value);
              return;
          }
          push(node);
          const int middle = (left + right) / 2;
          if (query_left <= middle) {
              add(node * 2, left, middle, query_left, query_right, value);
          }
          if (query_right > middle) {
              add(node * 2 + 1, middle + 1, right, query_left, query_right,
                  value);
          }
          pull(node);
      }

      void activate(int node, int left, int right, int position) {
          if (left == right) {
              minimum_[static_cast<size_t>(node)] = 0;
              lazy_[static_cast<size_t>(node)] = 0;
              return;
          }
          push(node);
          const int middle = (left + right) / 2;
          if (position <= middle) {
              activate(node * 2, left, middle, position);
          } else {
              activate(node * 2 + 1, middle + 1, right, position);
          }
          pull(node);
      }
  };

  struct StackEntry {
      int value;
      int left;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<int> permutation(static_cast<size_t>(n + 1));
      for (int i = 0; i < n; ++i) {
          int row;
          int column;
          cin >> row >> column;
          permutation[static_cast<size_t>(row)] = column;
      }
      SegmentTree tree(n);
      vector<StackEntry> maximum_stack;
      vector<StackEntry> minimum_stack;
      long long answer = 0;
      for (int right = 1; right <= n; ++right) {
          tree.add(1, right - 1, -1);
          const int value = permutation[static_cast<size_t>(right)];

          int left = right;
          while (!maximum_stack.empty() &&
                 maximum_stack.back().value < value) {
              const StackEntry entry = maximum_stack.back();
              maximum_stack.pop_back();
              tree.add(entry.left, left - 1,
                       static_cast<long long>(value - entry.value));
              left = entry.left;
          }
          maximum_stack.push_back({value, left});

          left = right;
          while (!minimum_stack.empty() &&
                 minimum_stack.back().value > value) {
              const StackEntry entry = minimum_stack.back();
              minimum_stack.pop_back();
              tree.add(entry.left, left - 1,
                       static_cast<long long>(entry.value - value));
              left = entry.left;
          }
          minimum_stack.push_back({value, left});

          tree.activate(right);
          if (tree.minimum() == 0) { answer += tree.minimum_count(); }
      }
      cout << answer << '\n';
  }
external_url: https://codeforces.com/problemset/problem/526/F
external_platform: Codeforces
external_problem_id: 526F
external_title: Pudding Monsters
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面、限制、範例與 URL 已依 Codeforces 官方題面核實；敘述、證明與程式為本站獨立撰寫。
