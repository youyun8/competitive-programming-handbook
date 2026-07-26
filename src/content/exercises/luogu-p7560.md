---
id: luogu-p7560
volume: lower
source_file: lower-volume
title: 洛谷 P7560 Food Court：區間佇列離線查詢
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['掃描線', '線段樹 beats', 'Fenwick 樹', '離線詢問']
prerequisites: ['區間加值', '區間 chmax', '差分掃描']
statement: 有 N 家商店，每家各有一條初始為空的佇列。事件可讓同一家庭的 K 人加入一段商店的隊尾、讓一段商店各自從隊首離開 min(K,目前人數) 人，或詢問某商店隊首起第 B 人的家庭編號；若不足 B 人輸出 0。
constraints:
  - '1 <= N,M,Q <= 250000'
  - '1 <= K_i <= 10^9'
  - '1 <= B_i <= 10^15'
  - '1 <= L_i <= R_i <= N'
  - 至少有一次服務詢問
input_format: 第一行為 N、M、Q。其後 Q 行：類型 1 為 1 L R C K；類型 2 為 2 L R K；類型 3 為 3 A B。
output_format: 對每個類型 3 事件輸出一行；若第 B 人存在則輸出其家庭編號，否則輸出 0。
samples:
  - input: |
      3 5 7
      1 2 3 5 2
      1 1 2 2 4
      3 2 3
      2 1 3 3
      3 1 2
      1 2 3 4 2
      3 3 2
    output: |
      2
      0
      4
    explanation: 第三事件時商店 2 的隊列為 (5,5,2,2,2,2)，第 3 人屬家庭 2；離隊後商店 1 只剩一人，所以第二次服務輸出 0；最後商店 3 的兩人皆屬家庭 4。
core_knowledge:
  - 每家目前隊長只受區間 x←max(0,x+delta) 操作
  - 有效詢問的第 B 人，是該店歷來第 total_added-current_length+B 個入隊者
  - 依商店編號掃描時，區間入隊事件可差分成加入與刪除
judgment: 第一階段用支援區間加與區間 chmax(0) 的 Segment Tree Beats 維護所有隊長，另以 Fenwick 差分取得歷史總入隊數，將有效詢問轉成絕對入隊名次。第二階段按商店掃描，以事件時間為 Fenwick 座標，維護適用於該店的所有入隊批次，二分第 target 名落在哪個事件。
hints:
  - 離隊 K 人後隊長是 max(0,len-K)；線段樹維護最小值、次小值與最小值個數即可對整段做 chmax(0)。
  - 若目前長度為 len、歷史共加入 total 人，隊首前已有 total-len 人離開；第 B 人的歷史序號是 total-len+B。
  - 將每次 [L,R] 入隊批次在商店 L 加入、R+1 移除；掃到商店 A 時，按事件時間的權重前綴 lower_bound(target) 即得到家庭。
solution_outline: 讀事件時在線段樹維護各店目前長度，差分 Fenwick 維護歷史加入總量。服務事件若長度不足直接記 0，否則記錄商店與絕對入隊序號。所有事件讀完後，按店號掃描區間入隊事件的差分，在事件時間 Fenwick 中增刪批次人數；對掛在該店的有效詢問找最小前綴達 target 的事件，回傳其家庭。
proof_or_invariant: 第一階段線段樹葉恆等於實際隊長，因加入是加 K，離開正是先減 K 再取下界 0。佇列只從尾加入、從頭刪除，所以剩餘者是歷史入隊序列的後綴，第 B 人的絕對序號公式成立。第二階段掃到商店 s 時，時間 Fenwick 恰含所有 L<=s<=R 的入隊事件，且依原事件順序排列；其權重前綴就是該店歷史入隊序列批次長度，因此 lower_bound 唯一定位目標家庭。
complexity:
  time: O(Q log N + (Q+服務次數) log Q)
  space: O(N+Q)
common_errors:
  - 離隊直接做區間減而允許隊長變負
  - 用目前第 B 人直接在所有入隊事件中找第 B，忽略已離隊前綴
  - 第二階段沒有在 R+1 移除入隊批次
  - B 與累積人數使用 32-bit 整數溢位
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：第一階段維護隊長並轉成絕對名次，第二階段按商店掃描入隊事件。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Node {
      long long minimum = 0;
      long long second_minimum = numeric_limits<long long>::max();
      long long lazy_add = 0;
      int minimum_count = 0;
  };

  class BeatsTree {
    public:
      explicit BeatsTree(int size)
          : size_(size), tree_(static_cast<size_t>(size) * 4U) {
          build(1, 1, size_);
      }
      void add(int left, int right, long long value) {
          add(1, 1, size_, left, right, value);
      }
      void raise_to_zero(int left, int right) {
          chmax(1, 1, size_, left, right, 0);
      }
      long long point(int position) {
          return point(1, 1, size_, position);
      }

    private:
      int size_;
      vector<Node> tree_;

      void build(int node, int left, int right) {
          tree_[static_cast<size_t>(node)].minimum_count = right - left + 1;
          if (left == right) { return; }
          const int middle = (left + right) / 2;
          build(node * 2, left, middle);
          build(node * 2 + 1, middle + 1, right);
      }
      void apply_add(int node, long long value) {
          Node& current = tree_[static_cast<size_t>(node)];
          current.minimum += value;
          if (current.second_minimum != numeric_limits<long long>::max()) {
              current.second_minimum += value;
          }
          current.lazy_add += value;
      }
      void apply_chmax(int node, long long value) {
          tree_[static_cast<size_t>(node)].minimum = value;
      }
      void push(int node) {
          Node& current = tree_[static_cast<size_t>(node)];
          if (current.lazy_add != 0) {
              apply_add(node * 2, current.lazy_add);
              apply_add(node * 2 + 1, current.lazy_add);
              current.lazy_add = 0;
          }
          const long long floor = current.minimum;
          if (tree_[static_cast<size_t>(node * 2)].minimum < floor) {
              apply_chmax(node * 2, floor);
          }
          if (tree_[static_cast<size_t>(node * 2 + 1)].minimum < floor) {
              apply_chmax(node * 2 + 1, floor);
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
          const long long left_next =
              left.minimum == current.minimum ? left.second_minimum
                                              : left.minimum;
          const long long right_next =
              right.minimum == current.minimum ? right.second_minimum
                                               : right.minimum;
          current.second_minimum = min(left_next, right_next);
      }
      void add(int node, int left, int right, int query_left,
               int query_right, long long value) {
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
      void chmax(int node, int left, int right, int query_left,
                 int query_right, long long value) {
          Node& current = tree_[static_cast<size_t>(node)];
          if (query_right < left || right < query_left ||
              current.minimum >= value) {
              return;
          }
          if (query_left <= left && right <= query_right &&
              current.second_minimum > value) {
              apply_chmax(node, value);
              return;
          }
          push(node);
          const int middle = (left + right) / 2;
          chmax(node * 2, left, middle, query_left, query_right, value);
          chmax(node * 2 + 1, middle + 1, right, query_left, query_right,
                value);
          pull(node);
      }
      long long point(int node, int left, int right, int position) {
          if (left == right) {
              return tree_[static_cast<size_t>(node)].minimum;
          }
          push(node);
          const int middle = (left + right) / 2;
          return position <= middle
                     ? point(node * 2, left, middle, position)
                     : point(node * 2 + 1, middle + 1, right, position);
      }
  };

  class Fenwick {
    public:
      explicit Fenwick(int size)
          : size_(size), tree_(static_cast<size_t>(size + 1), 0) {}
      void add(int position, long long value) {
          for (int i = position; i <= size_; i += i & -i) {
              tree_[static_cast<size_t>(i)] += value;
          }
      }
      long long sum(int position) const {
          long long result = 0;
          for (int i = position; i > 0; i -= i & -i) {
              result += tree_[static_cast<size_t>(i)];
          }
          return result;
      }
      int lower_bound(long long target) const {
          int position = 0;
          long long prefix = 0;
          int step = 1;
          while (step <= size_ / 2) { step *= 2; }
          for (; step > 0; step /= 2) {
              const int next = position + step;
              if (next <= size_ &&
                  prefix + tree_[static_cast<size_t>(next)] < target) {
                  position = next;
                  prefix += tree_[static_cast<size_t>(next)];
              }
          }
          return position + 1;
      }

    private:
      int size_;
      vector<long long> tree_;
  };

  struct SweepChange { int event; long long delta; };
  struct Request { long long target; int event; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int store_count;
      int family_count;
      int event_count;
      cin >> store_count >> family_count >> event_count;
      (void)family_count;
      BeatsTree lengths(store_count);
      Fenwick total_added(store_count + 1);
      vector<vector<SweepChange>> changes(
          static_cast<size_t>(store_count + 2));
      vector<vector<Request>> requests(
          static_cast<size_t>(store_count + 1));
      vector<int> family(static_cast<size_t>(event_count + 1), 0);
      vector<long long> answers(static_cast<size_t>(event_count + 1), -1);
      vector<bool> is_service(static_cast<size_t>(event_count + 1), false);

      for (int event = 1; event <= event_count; ++event) {
          int type;
          cin >> type;
          if (type == 1) {
              int left;
              int right;
              int group;
              long long count;
              cin >> left >> right >> group >> count;
              family[static_cast<size_t>(event)] = group;
              lengths.add(left, right, count);
              total_added.add(left, count);
              total_added.add(right + 1, -count);
              changes[static_cast<size_t>(left)].push_back({event, count});
              changes[static_cast<size_t>(right + 1)].push_back(
                  {event, -count});
          } else if (type == 2) {
              int left;
              int right;
              long long count;
              cin >> left >> right >> count;
              lengths.add(left, right, -count);
              lengths.raise_to_zero(left, right);
          } else {
              int store;
              long long rank;
              cin >> store >> rank;
              is_service[static_cast<size_t>(event)] = true;
              const long long length = lengths.point(store);
              if (length < rank) {
                  answers[static_cast<size_t>(event)] = 0;
              } else {
                  const long long target =
                      total_added.sum(store) - length + rank;
                  requests[static_cast<size_t>(store)].push_back(
                      {target, event});
              }
          }
      }

      Fenwick by_time(event_count);
      for (int store = 1; store <= store_count; ++store) {
          for (const SweepChange& change :
               changes[static_cast<size_t>(store)]) {
              by_time.add(change.event, change.delta);
          }
          for (const Request& request :
               requests[static_cast<size_t>(store)]) {
              const int source_event = by_time.lower_bound(request.target);
              answers[static_cast<size_t>(request.event)] =
                  family[static_cast<size_t>(source_event)];
          }
      }
      for (int event = 1; event <= event_count; ++event) {
          if (is_service[static_cast<size_t>(event)]) {
              cout << answers[static_cast<size_t>(event)] << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P7560
external_platform: 洛谷
external_problem_id: P7560
external_title: '[JOISC 2021] フードコート (Day1)'
external_relation: original
source_book_pages: [561]
source_pdf_pages: [191]
review_status: verified
---

題面、限制與三組範例已依 JOI 官方存檔、AtCoder JOISC 2021 頁及 UOJ 612 交叉核實；繁中敘述、證明與程式為本站獨立撰寫。
