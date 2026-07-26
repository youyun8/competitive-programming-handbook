---
id: codeforces-997e
volume: lower
source_file: lower-volume
title: Codeforces 997E Good Subsegments：好子區間離線詢問
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['單調堆疊', '線段樹', '離線詢問', '歷史最小值']
prerequisites: ['區間加值線段樹', '單調堆疊']
statement: 給定長度 n 的排列。若子區間內從最小值到最大值之間的每個整數都恰出現在該子區間中，稱它為好子區間。每次詢問一個範圍 [l,r]，求完全包含在此範圍內的好子區間數量。
constraints:
  - '1 <= n <= 120000'
  - p 是 1..n 的排列
  - '1 <= q <= 120000'
  - '1 <= l <= r <= n'
input_format: 第一行為 n，第二行為排列 p_1..p_n，第三行為詢問數 q；接著 q 行各給 l、r。
output_format: 對每個詢問輸出一行，表示 [l,r] 內好子區間的數量。
samples:
  - input: |
      5
      1 3 2 5 4
      15
      1 1
      1 2
      1 3
      1 4
      1 5
      2 2
      2 3
      2 4
      2 5
      3 3
      3 4
      3 5
      4 4
      4 5
      5 5
    output: |
      1
      2
      5
      6
      10
      1
      3
      4
      7
      1
      2
      4
      1
      3
      1
    explanation: 例如整個排列共有十個好子區間；查詢 [2,5] 內則有七個。排列元素互異，因此好區間等價於最大值減最小值等於區間長度減一。
core_knowledge:
  - 排列區間必有 max-min >= length-1，等號成立恰為好區間
  - 固定右端點時，各左端點的 max 與 min 變化可由兩個單調堆疊轉成區間加值
  - 線段樹可累積「每個左端點歷次取到全域最小值 0」的次數
judgment: 把詢問按右端點離線。掃到 r 時在線段樹葉 l 維護 f(l)=max(p_l..p_r)-min(p_l..p_r)-(r-l)。單調堆疊更新 max/min 的分段常數，再對舊左端點全減一。f 永不為負，所以最小值 0 的葉恰是以 r 結尾的好區間；將這些葉的歷史計數加一後，區間和即可回答詢問。
hints:
  - 因為 p 是排列，長度 k 的區間含 k 個不同整數，所以 max-min 至少 k-1；好區間正是等號。
  - 右端加入 p_r 時，彈出遞減最大值堆疊中較小元素；每個被彈區段的 max 從舊值升到 p_r，對對應左端範圍加差值。最小值堆疊對稱。
  - 線段樹節點除 min 與最小值個數外，再存這些最小葉的歷史貢獻和；每輪只對根節點的最小集合加一，查詢左端點區間的歷史和。
solution_outline: 建立尚未啟用葉為大值的線段樹。依 r 遞增，使用最大、最小單調堆疊對左端點區間加上極值變化，對 [1,r-1] 加 -1，啟用葉 r 為 0。此時根最小值必為 0，對根的「當前最小葉」增加一次歷史貢獻。把右端為 r 的詢問 [l,r] 回答成葉區間 [l,r] 的歷史貢獻總和。
proof_or_invariant: 第 r 輪更新後，已啟用葉 l 精確保存 f(l,r)=max(p_l..p_r)-min(p_l..p_r)-(r-l)：兩個單調堆疊分段更新加入 p_r 所造成的 max、min 差，而統一 -1 對應長度增加。排列互異保證 f>=0，故 f=0 與好區間等價。每輪對所有最小葉恰加一次，使葉 l 的歷史值等於右端 y<=r 且 [l,y] 為好區間的數目；查詢 [l,r] 的葉和正好枚舉所有 l<=x<=y<=r，各好區間一次。
complexity:
  time: O((n+q) log n)
  space: O(n+q)
common_errors:
  - 把一般陣列也套用 max-min=length-1 的充要條件，忽略重複值
  - 單調堆疊彈出後更新左界錯一格
  - 每輪只查當前最小值個數，沒有保存各左端點跨右端點的歷史貢獻
  - 線段樹下推歷史標記時加到非最小子節點
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Node {
      int minimum;
      int minimum_count;
      int add_tag;
      long long history_sum;
      int history_tag;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：以單調堆疊維護 f(l,r)，線段樹累積 f=0 葉的歷史次數。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Node {
      int minimum = 0;
      int minimum_count = 0;
      int add_tag = 0;
      long long history_sum = 0;
      int history_tag = 0;
  };

  class SegmentTree {
    public:
      explicit SegmentTree(int size)
          : size_(size), tree_(static_cast<size_t>(size) * 4U) {
          build(1, 1, size_);
      }

      void add(int left, int right, int value) {
          if (left <= right) { add(1, 1, size_, left, right, value); }
      }

      void activate(int position) {
          activate(1, 1, size_, position);
      }

      void record_minimum() {
          apply_history(1, 1);
      }

      long long query(int left, int right) {
          return query(1, 1, size_, left, right);
      }

    private:
      static constexpr int kInfinity = 1000000000;
      int size_;
      vector<Node> tree_;

      void build(int node, int left, int right) {
          tree_[static_cast<size_t>(node)].minimum = kInfinity;
          tree_[static_cast<size_t>(node)].minimum_count = right - left + 1;
          if (left == right) { return; }
          const int middle = (left + right) / 2;
          build(node * 2, left, middle);
          build(node * 2 + 1, middle + 1, right);
      }

      void apply_add(int node, int value) {
          Node& current = tree_[static_cast<size_t>(node)];
          current.minimum += value;
          current.add_tag += value;
      }

      void apply_history(int node, int times) {
          Node& current = tree_[static_cast<size_t>(node)];
          current.history_sum +=
              static_cast<long long>(current.minimum_count) * times;
          current.history_tag += times;
      }

      void push(int node) {
          Node& current = tree_[static_cast<size_t>(node)];
          if (current.add_tag != 0) {
              apply_add(node * 2, current.add_tag);
              apply_add(node * 2 + 1, current.add_tag);
              current.add_tag = 0;
          }
          if (current.history_tag != 0) {
              const int left_minimum =
                  tree_[static_cast<size_t>(node * 2)].minimum;
              const int right_minimum =
                  tree_[static_cast<size_t>(node * 2 + 1)].minimum;
              if (left_minimum == current.minimum) {
                  apply_history(node * 2, current.history_tag);
              }
              if (right_minimum == current.minimum) {
                  apply_history(node * 2 + 1, current.history_tag);
              }
              current.history_tag = 0;
          }
      }

      void pull(int node) {
          Node& current = tree_[static_cast<size_t>(node)];
          const Node& left = tree_[static_cast<size_t>(node * 2)];
          const Node& right = tree_[static_cast<size_t>(node * 2 + 1)];
          current.minimum = min(left.minimum, right.minimum);
          current.minimum_count = 0;
          if (left.minimum == current.minimum) {
              current.minimum_count += left.minimum_count;
          }
          if (right.minimum == current.minimum) {
              current.minimum_count += right.minimum_count;
          }
          current.history_sum = left.history_sum + right.history_sum;
      }

      void add(int node, int left, int right, int query_left,
               int query_right, int value) {
          if (query_left <= left && right <= query_right) {
              apply_add(node, value);
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
              Node& current = tree_[static_cast<size_t>(node)];
              current.minimum = 0;
              current.minimum_count = 1;
              current.add_tag = 0;
              current.history_sum = 0;
              current.history_tag = 0;
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

      long long query(int node, int left, int right, int query_left,
                      int query_right) {
          if (query_left <= left && right <= query_right) {
              return tree_[static_cast<size_t>(node)].history_sum;
          }
          push(node);
          const int middle = (left + right) / 2;
          long long result = 0;
          if (query_left <= middle) {
              result +=
                  query(node * 2, left, middle, query_left, query_right);
          }
          if (query_right > middle) {
              result += query(node * 2 + 1, middle + 1, right, query_left,
                              query_right);
          }
          return result;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<int> permutation(static_cast<size_t>(n + 1));
      for (int i = 1; i <= n; ++i) {
          cin >> permutation[static_cast<size_t>(i)];
      }
      int query_count;
      cin >> query_count;
      vector<vector<pair<int, int>>> queries_by_right(
          static_cast<size_t>(n + 1));
      for (int id = 0; id < query_count; ++id) {
          int left;
          int right;
          cin >> left >> right;
          queries_by_right[static_cast<size_t>(right)].push_back({left, id});
      }

      SegmentTree tree(n);
      vector<int> maximum_stack(1, 0);
      vector<int> minimum_stack(1, 0);
      vector<long long> answers(static_cast<size_t>(query_count));
      for (int right = 1; right <= n; ++right) {
          while (maximum_stack.size() > 1U &&
                 permutation[static_cast<size_t>(maximum_stack.back())] <
                     permutation[static_cast<size_t>(right)]) {
              const int old = maximum_stack.back();
              maximum_stack.pop_back();
              tree.add(maximum_stack.back() + 1, old,
                       permutation[static_cast<size_t>(right)] -
                           permutation[static_cast<size_t>(old)]);
          }
          maximum_stack.push_back(right);
          while (minimum_stack.size() > 1U &&
                 permutation[static_cast<size_t>(minimum_stack.back())] >
                     permutation[static_cast<size_t>(right)]) {
              const int old = minimum_stack.back();
              minimum_stack.pop_back();
              tree.add(minimum_stack.back() + 1, old,
                       permutation[static_cast<size_t>(old)] -
                           permutation[static_cast<size_t>(right)]);
          }
          minimum_stack.push_back(right);
          tree.add(1, right - 1, -1);
          tree.activate(right);
          tree.record_minimum();
          for (const auto& [left, id] :
               queries_by_right[static_cast<size_t>(right)]) {
              answers[static_cast<size_t>(id)] = tree.query(left, right);
          }
      }
      for (long long answer : answers) { cout << answer << '\n'; }
      return 0;
  }
external_url: https://codeforces.com/problemset/problem/997/E
external_platform: CodeForces
external_problem_id: 997E
external_title: Good Subsegments
external_relation: original
source_book_pages: [560]
source_pdf_pages: [190]
review_status: verified
---

題面、限制、官方 URL 與範例已依 Codeforces 官方題面核實；繁中敘述、證明與程式為本站獨立撰寫。
