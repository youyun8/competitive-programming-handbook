---
id: luogu-p3722
volume: upper
source_file: upper-volume
title: 洛谷 P3722 影魔：單調棧與離線掃描線
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 5
topics: ['單調棧', '掃描線', '線段樹', '離線查詢']
prerequisites: ['monotonic-stack', 'segment-tree']
statement: |-
  給定一個 1 到 n 的排列 k。對 i<j，若中間所有值都不大於兩端較小值，
  此點對貢獻 p1；若中間最大值嚴格介於兩端值之間，則貢獻 p2；其餘貢獻 0。
  每次詢問區間 [a,b] 內所有點對的貢獻總和。
constraints:
  - 1 ≤ n,m ≤ 200000
  - 1 ≤ p1,p2 ≤ 1000
  - k 是 1 到 n 的排列
input_format: |-
  第一行 n、m、p1、p2；第二行為排列 k；接下來 m 行各為詢問 a、b。
output_format: 每個詢問輸出一行區間內的攻擊力總和。
samples:
  - input: |
      10 5 2 3
      7 9 5 1 3 10 6 8 2 4
      1 7
      1 9
      1 3
      5 9
      1 5
    output: |
      30
      39
      4
      13
      16
    explanation: 相鄰點對固定貢獻 p1，其餘點對由區間內前三大值的相對位置決定。
core_knowledge:
  - 單調棧求左右第一個更大位置
  - 把合法點對拆成三類事件
  - 時間前綴差與區間加、區間和
judgment: |-
  預處理每個位置的 L_i、R_i，生成 p1/p2 點對事件；以事件座標掃描，
  在詢問右端時加入、左端前撤銷相應前綴。
hints:
  - 先把所有相鄰點對的 p1 貢獻獨立計入。
  - 對中間最大值所在位置 i，只需關心左、右第一個比 k_i 大的位置。
  - 把每個點對看成平面上的 (左端,右端)，詢問就是矩形權值和。
solution_outline: |-
  用單調遞減棧求 L_i、R_i。除相鄰點對外，合法貢獻恰為：
  (L_i,R_i) 貢獻 p1；(L_i,j), i<j<R_i 貢獻 p2；
  (j,R_i), L_i<j<i 貢獻 p2。把右端點當事件時間、左端點當線段樹座標。
  詢問 [l,r] 的額外貢獻等於時間前綴 r 減時間前綴 l-1，在兩個時間點查 [l,r] 的和。
proof_or_invariant: |-
  排列元素互異。對非相鄰點對取中間最大值 k_i：若兩端都大於 k_i，
  兩端必為 i 左右第一個更大值，貢獻 p1；若恰一端大於 k_i，
  較大端必為對應方向第一個更大值，貢獻 p2。三類互斥且完備。
  掃描至時間 x 時線段樹恰含右端不超過 x 的所有事件，故前綴差精確限制右端於 [l,r]。
common_errors:
  - 忘記相鄰點對沒有中間元素，必定貢獻 p1
  - p2 區間誤包含位置 i 或第一個更大位置
  - 使用 int 儲存總攻擊力
complexity:
  time: O((n+m) log n)
  space: O(n+m)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  // TODO：單調棧求 L/R，將三類點對轉成離線事件。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Event {
      int left;
      int right;
      long long value;
  };

  struct QueryEvent {
      int left;
      int right;
      int id;
      int sign;
  };

  class SegmentTree {
  public:
      explicit SegmentTree(int size)
          : sum_(static_cast<size_t>(size) * 4 + 4),
            lazy_(static_cast<size_t>(size) * 4 + 4) {}

      void add(int node, int l, int r, int ql, int qr, long long value) {
          if (qr < l || r < ql) { return; }
          if (ql <= l && r <= qr) {
              sum_[static_cast<size_t>(node)] +=
                  static_cast<long long>(r - l + 1) * value;
              lazy_[static_cast<size_t>(node)] += value;
              return;
          }
          const int mid = (l + r) / 2;
          add(node * 2, l, mid, ql, qr, value);
          add(node * 2 + 1, mid + 1, r, ql, qr, value);
          sum_[static_cast<size_t>(node)] =
              sum_[static_cast<size_t>(node * 2)] +
              sum_[static_cast<size_t>(node * 2 + 1)] +
              static_cast<long long>(r - l + 1) *
                  lazy_[static_cast<size_t>(node)];
      }

      long long query(int node, int l, int r, int ql, int qr,
                      long long inherited = 0) const {
          if (qr < l || r < ql) { return 0; }
          if (ql <= l && r <= qr) {
              return sum_[static_cast<size_t>(node)] +
                     static_cast<long long>(r - l + 1) * inherited;
          }
          inherited += lazy_[static_cast<size_t>(node)];
          const int mid = (l + r) / 2;
          return query(node * 2, l, mid, ql, qr, inherited) +
                 query(node * 2 + 1, mid + 1, r, ql, qr, inherited);
      }

  private:
      vector<long long> sum_;
      vector<long long> lazy_;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);

      int n, query_count;
      long long p1, p2;
      cin >> n >> query_count >> p1 >> p2;
      vector<int> value(static_cast<size_t>(n) + 2, n + 1);
      for (int i = 1; i <= n; ++i) {
          cin >> value[static_cast<size_t>(i)];
      }

      vector<int> nearest_left(static_cast<size_t>(n) + 2);
      vector<int> nearest_right(static_cast<size_t>(n) + 2, n + 1);
      vector<int> stack;
      stack.push_back(0);
      for (int i = 1; i <= n + 1; ++i) {
          while (stack.back() != 0 &&
                 value[static_cast<size_t>(stack.back())] <
                     value[static_cast<size_t>(i)]) {
              nearest_right[static_cast<size_t>(stack.back())] = i;
              stack.pop_back();
          }
          nearest_left[static_cast<size_t>(i)] = stack.back();
          stack.push_back(i);
      }

      vector<vector<Event>> events(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) {
          const int left = nearest_left[static_cast<size_t>(i)];
          const int right = nearest_right[static_cast<size_t>(i)];
          if (left >= 1 && right <= n) {
              events[static_cast<size_t>(right)].push_back({left, left, p1});
          }
          if (left >= 1 && i + 1 <= right - 1) {
              events[static_cast<size_t>(left)].push_back(
                  {i + 1, right - 1, p2});
          }
          if (right <= n && left + 1 <= i - 1) {
              events[static_cast<size_t>(right)].push_back(
                  {left + 1, i - 1, p2});
          }
      }

      vector<vector<QueryEvent>> queries(static_cast<size_t>(n) + 1);
      vector<long long> answer(static_cast<size_t>(query_count));
      for (int id = 0; id < query_count; ++id) {
          int left, right;
          cin >> left >> right;
          answer[static_cast<size_t>(id)] =
              static_cast<long long>(right - left) * p1;
          queries[static_cast<size_t>(right)].push_back(
              {left, right, id, 1});
          if (left > 1) {
              queries[static_cast<size_t>(left - 1)].push_back(
                  {left, right, id, -1});
          }
      }

      SegmentTree tree(n);
      for (int time = 1; time <= n; ++time) {
          for (const Event& event : events[static_cast<size_t>(time)]) {
              tree.add(1, 1, n, event.left, event.right, event.value);
          }
          for (const QueryEvent& query :
               queries[static_cast<size_t>(time)]) {
              answer[static_cast<size_t>(query.id)] +=
                  static_cast<long long>(query.sign) *
                  tree.query(1, 1, n, query.left, query.right);
          }
      }
      for (const long long result : answer) {
          cout << result << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3722
external_platform: Luogu
external_problem_id: P3722
external_title: '[AHOI2017/HNOI2017] 影魔'
external_relation: original
source_book_pages: [203]
source_pdf_pages: [221]
review_status: verified
---

把「中間最大值」改成貢獻者後，原本的二次枚舉就只剩三類線段事件。
