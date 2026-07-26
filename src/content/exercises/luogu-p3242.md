---
id: luogu-p3242
volume: lower
source_file: lower-volume
title: 洛谷 P3242 接水果：樹路徑包含與整體二分
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['DFS 序', '矩形掃描線', '整體二分', 'Fenwick 樹']
prerequisites: ['LCA', '子樹區間', '第 k 小']
statement: 給定一棵 n 點樹與 p 個帶權盤子，每個盤子是一條兩端點不同的樹路徑。每個詢問水果也是一條路徑；盤子能接水果當且僅當盤子路徑是水果路徑的子路徑。求所有可接盤子中權值第 k 小者，盤子可重複使用且答案保證存在。
constraints:
  - '1 <= n,p,q <= 40000'
  - '0 <= plate_weight <= 10^9'
  - 盤子與水果的兩端點皆不同
input_format: 第一行 n、p、q；接著 n-1 行樹邊；再 p 行盤子端點 a、b 與權值 c；最後 q 行水果端點 u、v 與 k。
output_format: 對每個水果輸出一行，可接盤子的第 k 小權值。
samples:
  - input: |
      10 10 10
      1 2
      2 3
      3 4
      4 5
      5 6
      6 7
      7 8
      8 9
      9 10
      3 2 217394434
      10 7 13022269
      6 7 283254485
      6 8 333042360
      4 6 442139372
      8 3 225045590
      10 4 922205209
      10 8 808296330
      9 2 486331361
      4 9 551176338
      1 8 5
      3 8 3
      3 8 4
      1 8 3
      4 8 1
      2 3 1
      2 3 1
      2 3 1
      2 4 1
      1 4 1
    output: |
      442139372
      333042360
      442139372
      283254485
      283254485
      217394434
      217394434
      217394434
      217394434
      217394434
    explanation: 將水果兩端 DFS 序視為平面點，盤子可接住的所有水果形成一至兩個矩形；矩形覆蓋點的權值第 k 小即原答案。
core_knowledge:
  - 子樹在 DFS 序上是連續區間
  - 跨兩個分支的盤子對應「兩端各落在一個子樹」的矩形
  - 祖先—後代盤子對應「一端在後代子樹、另一端在通往後代之子樹外」的兩個矩形
judgment: 將每個盤子轉成至多兩個以水果排序後端點 DFS 序為座標的閉矩形。矩形再拆成 x=left 的 +1 與 x=right+1 的 -1 掃描事件。依權值做整體二分；每層按 x 掃描，Fenwick 對 y 區間加值並在詢問點取得權值屬於左半部的覆蓋數。
hints:
  - 若盤子兩端的 LCA 不是任一端，水果必須各有一端落在這兩端的子樹內。
  - 若盤子為祖先 x 到後代 y，設 z 為 x 往 y 的第一個兒子；水果一端在 subtree(y)，另一端必在 subtree(z) 外。
  - 整體二分中只加入權值索引不大於 mid 的矩形；覆蓋數至少 k 的詢問進左半，否則令 k 減去覆蓋數後進右半。
solution_outline: 迭代 DFS 求 tin、tout、depth 與倍增祖先。對每個盤子按 tin 排端點，依 LCA 關係產生一或兩個矩形，壓縮權值後拆成掃描事件。水果成為點詢問。所有操作先按 x 排序；遞迴二分權值，在每層以 Fenwick 統計左半權值矩形覆蓋數、穩定分割操作並回滾修改，葉節點即答案權值索引。
proof_or_invariant: 樹上路徑包含關係由盤子端點切出的分支決定：跨分支時水果兩端必分處兩端子樹；祖先—後代時一端必深入後代子樹，另一端必越過祖先而位於指定兒子子樹外，矩形轉換因此充要。整體二分節點 [L,R] 中，每個詢問的 k 表示只計本權值區間時所求排名；掃描精確得到 [L,mid] 覆蓋數，據此分支與扣除排名維持不變量，歸納至葉即為第 k 小。
complexity:
  time: O((p+q) log p log n)
  space: O(n+(p+q) log n)
common_errors:
  - 祖先—後代盤子只建立一個矩形，漏掉指定兒子子樹外的兩段
  - 沒先按 DFS 序統一水果兩端座標
  - x=right+1 的刪除事件排在同 x 查詢之後
  - 右半遞迴時忘記令 k 減去左半覆蓋數
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：把路徑包含轉成矩形覆蓋點，再以整體二分求第 k 小。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  class Fenwick {
    public:
      explicit Fenwick(int size)
          : size_(size), tree_(static_cast<size_t>(size + 1), 0) {}
      void add(int position, int value) {
          for (int i = position; i <= size_; i += i & -i) {
              tree_[static_cast<size_t>(i)] += value;
          }
      }
      int sum(int position) const {
          int result = 0;
          for (int i = position; i > 0; i -= i & -i) {
              result += tree_[static_cast<size_t>(i)];
          }
          return result;
      }

    private:
      int size_;
      vector<int> tree_;
  };

  struct Operation {
      int x;
      int y_left;
      int y_right;
      int weight;
      int delta;
      int k;
      int id;
      bool query;
  };

  static Fenwick* bit_pointer = nullptr;
  static vector<int> answers;

  static void divide(vector<Operation> operations, int left_weight,
                     int right_weight) {
      if (operations.empty()) { return; }
      if (left_weight == right_weight) {
          for (const Operation& operation : operations) {
              if (operation.query) {
                  answers[static_cast<size_t>(operation.id)] = left_weight;
              }
          }
          return;
      }
      const int middle = (left_weight + right_weight) / 2;
      vector<Operation> left;
      vector<Operation> right;
      left.reserve(operations.size());
      right.reserve(operations.size());
      for (Operation operation : operations) {
          if (!operation.query) {
              if (operation.weight <= middle) {
                  bit_pointer->add(operation.y_left, operation.delta);
                  bit_pointer->add(operation.y_right + 1, -operation.delta);
                  left.push_back(operation);
              } else {
                  right.push_back(operation);
              }
          } else {
              const int count = bit_pointer->sum(operation.y_left);
              if (count >= operation.k) {
                  left.push_back(operation);
              } else {
                  operation.k -= count;
                  right.push_back(operation);
              }
          }
      }
      for (const Operation& operation : left) {
          if (!operation.query) {
              bit_pointer->add(operation.y_left, -operation.delta);
              bit_pointer->add(operation.y_right + 1, operation.delta);
          }
      }
      divide(move(left), left_weight, middle);
      divide(move(right), middle + 1, right_weight);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int plate_count;
      int query_count;
      cin >> n >> plate_count >> query_count;
      vector<vector<int>> graph(static_cast<size_t>(n + 1));
      for (int i = 1; i < n; ++i) {
          int a;
          int b;
          cin >> a >> b;
          graph[static_cast<size_t>(a)].push_back(b);
          graph[static_cast<size_t>(b)].push_back(a);
      }

      constexpr int log = 17;
      vector<array<int, log>> up(static_cast<size_t>(n + 1));
      vector<int> depth(static_cast<size_t>(n + 1), 0);
      vector<int> tin(static_cast<size_t>(n + 1), 0);
      vector<int> tout(static_cast<size_t>(n + 1), 0);
      vector<pair<int, size_t>> stack;
      stack.push_back({1, 0});
      int timer = 1;
      tin[1] = 1;
      while (!stack.empty()) {
          const int node = stack.back().first;
          size_t& next_index = stack.back().second;
          if (next_index == graph[static_cast<size_t>(node)].size()) {
              tout[static_cast<size_t>(node)] = timer;
              stack.pop_back();
              continue;
          }
          const int next =
              graph[static_cast<size_t>(node)][next_index++];
          if (next == up[static_cast<size_t>(node)][0]) { continue; }
          up[static_cast<size_t>(next)][0] = node;
          depth[static_cast<size_t>(next)] =
              depth[static_cast<size_t>(node)] + 1;
          for (int level = 1; level < log; ++level) {
              up[static_cast<size_t>(next)][static_cast<size_t>(level)] =
                  up[static_cast<size_t>(
                      up[static_cast<size_t>(next)]
                        [static_cast<size_t>(level - 1)])]
                    [static_cast<size_t>(level - 1)];
          }
          tin[static_cast<size_t>(next)] = ++timer;
          stack.push_back({next, 0});
      }
      const auto lift = [&](int node, int distance) {
          for (int level = 0; level < log; ++level) {
              if ((distance & (1 << level)) != 0) {
                  node = up[static_cast<size_t>(node)]
                           [static_cast<size_t>(level)];
              }
          }
          return node;
      };
      const auto lca = [&](int first, int second) {
          if (depth[static_cast<size_t>(first)] <
              depth[static_cast<size_t>(second)]) {
              swap(first, second);
          }
          first = lift(first, depth[static_cast<size_t>(first)] -
                                  depth[static_cast<size_t>(second)]);
          if (first == second) { return first; }
          for (int level = log - 1; level >= 0; --level) {
              const int first_up =
                  up[static_cast<size_t>(first)]
                    [static_cast<size_t>(level)];
              const int second_up =
                  up[static_cast<size_t>(second)]
                    [static_cast<size_t>(level)];
              if (first_up != second_up) {
                  first = first_up;
                  second = second_up;
              }
          }
          return up[static_cast<size_t>(first)][0];
      };

      struct Plate { int first; int second; int weight; };
      vector<Plate> plates(static_cast<size_t>(plate_count));
      vector<int> weight_values;
      weight_values.reserve(static_cast<size_t>(plate_count));
      for (Plate& plate : plates) {
          cin >> plate.first >> plate.second >> plate.weight;
          weight_values.push_back(plate.weight);
      }
      sort(weight_values.begin(), weight_values.end());
      weight_values.erase(
          unique(weight_values.begin(), weight_values.end()),
          weight_values.end());

      vector<Operation> operations;
      operations.reserve(static_cast<size_t>(plate_count * 4 +
                                             query_count));
      const auto add_rectangle = [&](int x_left, int x_right, int y_left,
                                     int y_right, int weight) {
          if (x_left > x_right || y_left > y_right) { return; }
          operations.push_back(
              {x_left, y_left, y_right, weight, 1, 0, 0, false});
          operations.push_back(
              {x_right + 1, y_left, y_right, weight, -1, 0, 0, false});
      };
      for (const Plate& plate : plates) {
          int first = plate.first;
          int second = plate.second;
          if (tin[static_cast<size_t>(first)] >
              tin[static_cast<size_t>(second)]) {
              swap(first, second);
          }
          const int weight = static_cast<int>(
                                 lower_bound(weight_values.begin(),
                                             weight_values.end(),
                                             plate.weight) -
                                 weight_values.begin()) +
                             1;
          const int ancestor = lca(first, second);
          if (ancestor != first) {
              add_rectangle(tin[static_cast<size_t>(first)],
                            tout[static_cast<size_t>(first)],
                            tin[static_cast<size_t>(second)],
                            tout[static_cast<size_t>(second)], weight);
          } else {
              const int child =
                  lift(second, depth[static_cast<size_t>(second)] -
                                   depth[static_cast<size_t>(first)] - 1);
              add_rectangle(1, tin[static_cast<size_t>(child)] - 1,
                            tin[static_cast<size_t>(second)],
                            tout[static_cast<size_t>(second)], weight);
              add_rectangle(tin[static_cast<size_t>(second)],
                            tout[static_cast<size_t>(second)],
                            tout[static_cast<size_t>(child)] + 1, n,
                            weight);
          }
      }
      for (int id = 0; id < query_count; ++id) {
          int first;
          int second;
          int k;
          cin >> first >> second >> k;
          int x = tin[static_cast<size_t>(first)];
          int y = tin[static_cast<size_t>(second)];
          if (x > y) { swap(x, y); }
          operations.push_back({x, y, y, 0, 0, k, id, true});
      }
      sort(operations.begin(), operations.end(),
           [](const Operation& a, const Operation& b) {
               if (a.x != b.x) { return a.x < b.x; }
               return a.query < b.query;
           });
      Fenwick bit(n + 1);
      bit_pointer = &bit;
      answers.assign(static_cast<size_t>(query_count), 0);
      divide(move(operations), 1,
             static_cast<int>(weight_values.size()));
      for (int index : answers) {
          cout << weight_values[static_cast<size_t>(index - 1)] << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3242
external_platform: 洛谷
external_problem_id: P3242
external_title: '[HNOI2015] 接水果'
external_relation: original
source_book_pages: [550]
source_pdf_pages: [180]
review_status: verified
---

題面、限制與範例已依 HNOI 2015 題目存檔、洛谷及 Nowcoder 備份交叉核實；繁中敘述、證明與程式為本站獨立撰寫。
