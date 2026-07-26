---
id: luogu-p5537
volume: lower
source_file: lower-volume
title: 洛谷 P5537 系統設計
chapter: 9
section: '9.1'
kind: external-oj
difficulty: 5
topics: [tree-path-hash, segment-tree, dynamic-sequence]
prerequisites: [rooted-tree, polynomial-hash, segment-tree]
statement: >-
  給定一棵有根樹與序列 a。操作一從節點 x 開始依序讀 a[l..r]：值 k 表示走到目前節點編號
  第 k 小的孩子；沒有第 k 個孩子或讀完時停止並輸出所在節點。操作二單點修改 a。
constraints:
  - '1 <= n,m,q <= 5 * 10^5'
  - '1 <= a_i <= n'
  - 查詢滿足 1 <= x <= n 且 1 <= l <= r <= m
input_format: >-
  第一行 n m q；第二行 n 個父節點 f_i，根的父節點為 0；第三行 m 個 a_i；
  接著 q 行操作：`1 x l r` 或 `2 t k`。
output_format: 每個操作一輸出停止時的節點編號。
samples:
  - input: "5 3 4\n0 1 1 2 2\n1 2 1\n1 1 1 3\n1 3 1 2\n2 2 1\n1 1 1 3\n"
    output: "5\n3\n4\n"
    explanation: 初始從根依 1、2 到節點 5；節點 3 無孩子。修改後依 1、1 到節點 4，第三步無法走。
core_knowledge:
  - 根到節點的孩子排名序列唯一識別節點
  - 線段樹維護可拼接的動態多項式雜湊
  - 在線段樹上下降可找到第一個不再對應樹節點的位置
judgment: 孩子按節點編號遞增排名且排名從 1 開始；遇到第一個非法步驟時停在移動前節點。
hints:
  - 對每個節點記錄從根走來的孩子排名序列；查詢從 x 走一段，相當於把該段接到 x 的路徑後。
  - 以同一進制雜湊所有根路徑，建立 `hash -> node` 表；序列 a 用線段樹維護區間雜湊與長度。
  - 若整個線段拼接後存在於表中就整段接受，否則向左右孩子下降；第一個失敗葉之前的節點就是答案。
solution_outline: >-
  將每個父節點的孩子排序並賦 1-based 排名，迭代走樹求雙 64 位根路徑雜湊，存入雜湊表。
  線段樹維護 a 的雙雜湊，支援單點更新。查詢以目前節點雜湊為狀態，對 [l,r] 做線段樹 consume：
  完整節點可映到某樹節點就整段跳過，否則遞迴到第一個失敗位置。
proof_or_invariant: >-
  根到節點的排名序列在有根樹中唯一，拼接查詢前綴後，雜湊表命中等價於這段移動存在（忽略雙 64 位
  碰撞的可忽略機率）。consume 的不變量是目前狀態恰為已接受查詢前綴的終點；整段命中可安全跳過，
  不命中時若其中仍有合法前綴，第一個失敗必在某子區間，依左至右遞迴恰定位它。
common_errors:
  - 使用輸入順序而非孩子節點編號順序排名
  - 區間雜湊拼接時忘記乘右段長度次方
  - 失敗葉仍把該步加入目前節點
complexity:
  time: O((n+m+q) log m) 期望時間
  space: O(n+m)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：雜湊樹上排名路徑，以線段樹維護動態序列並下降找首個失敗。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <cstdint>
  #include <iostream>
  #include <unordered_map>
  #include <utility>
  #include <vector>
  using namespace std;

  struct HashValue {
      uint64_t first = 0;
      uint64_t second = 0;
      bool operator==(const HashValue& other) const {
          return first == other.first && second == other.second;
      }
  };

  struct HashFunction {
      size_t operator()(const HashValue& value) const noexcept {
          return static_cast<size_t>(value.first ^
                                     (value.second + 0x9e3779b97f4a7c15ULL +
                                      (value.first << 6U) + (value.first >> 2U)));
      }
  };

  struct SegmentTree {
      int size;
      const vector<HashValue>& power;
      vector<HashValue> tree;

      SegmentTree(const vector<int>& values, const vector<HashValue>& powers)
          : size(static_cast<int>(values.size()) - 1),
            power(powers),
            tree(static_cast<size_t>(4 * size + 4)) {
          build(1, 1, size, values);
      }

      HashValue combine(const HashValue& left, const HashValue& right,
                        int right_length) const {
          return {left.first * power[static_cast<size_t>(right_length)].first + right.first,
                  left.second * power[static_cast<size_t>(right_length)].second +
                      right.second};
      }

      void build(int node, int left, int right, const vector<int>& values) {
          if (left == right) {
              const uint64_t value = static_cast<uint64_t>(values[static_cast<size_t>(left)]);
              tree[static_cast<size_t>(node)] = {value, value};
              return;
          }
          const int middle = (left + right) / 2;
          build(node * 2, left, middle, values);
          build(node * 2 + 1, middle + 1, right, values);
          tree[static_cast<size_t>(node)] =
              combine(tree[static_cast<size_t>(node * 2)],
                      tree[static_cast<size_t>(node * 2 + 1)], right - middle);
      }

      void update(int position, int value, int node, int left, int right) {
          if (left == right) {
              const uint64_t converted = static_cast<uint64_t>(value);
              tree[static_cast<size_t>(node)] = {converted, converted};
              return;
          }
          const int middle = (left + right) / 2;
          if (position <= middle) {
              update(position, value, node * 2, left, middle);
          } else {
              update(position, value, node * 2 + 1, middle + 1, right);
          }
          tree[static_cast<size_t>(node)] =
              combine(tree[static_cast<size_t>(node * 2)],
                      tree[static_cast<size_t>(node * 2 + 1)], right - middle);
      }

      void update(int position, int value) { update(position, value, 1, 1, size); }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n = 0;
      int m = 0;
      int query_count = 0;
      cin >> n >> m >> query_count;
      vector<vector<int>> children(static_cast<size_t>(n + 1));
      int root = 0;
      for (int node = 1; node <= n; ++node) {
          int parent = 0;
          cin >> parent;
          if (parent == 0) {
              root = node;
          } else {
              children[static_cast<size_t>(parent)].push_back(node);
          }
      }
      for (auto& list : children) { sort(list.begin(), list.end()); }

      constexpr uint64_t base_first = 1000003ULL;
      constexpr uint64_t base_second = 1000033ULL;
      vector<HashValue> power(static_cast<size_t>(m + n + 2), {1, 1});
      for (size_t i = 1; i < power.size(); ++i) {
          power[i] = {power[i - 1].first * base_first,
                      power[i - 1].second * base_second};
      }
      vector<HashValue> path_hash(static_cast<size_t>(n + 1));
      unordered_map<HashValue, int, HashFunction> node_by_hash;
      node_by_hash.reserve(static_cast<size_t>(2 * n + 1));
      node_by_hash[{0, 0}] = root;
      vector<int> stack{root};
      while (!stack.empty()) {
          const int node = stack.back();
          stack.pop_back();
          const auto& list = children[static_cast<size_t>(node)];
          for (size_t index = 0; index < list.size(); ++index) {
              const int child = list[index];
              const uint64_t rank = static_cast<uint64_t>(index + 1);
              path_hash[static_cast<size_t>(child)] = {
                  path_hash[static_cast<size_t>(node)].first * base_first + rank,
                  path_hash[static_cast<size_t>(node)].second * base_second + rank};
              node_by_hash[path_hash[static_cast<size_t>(child)]] = child;
              stack.push_back(child);
          }
      }

      vector<int> values(static_cast<size_t>(m + 1));
      for (int i = 1; i <= m; ++i) { cin >> values[static_cast<size_t>(i)]; }
      SegmentTree segment_tree(values, power);

      struct State {
          HashValue hash;
          int node;
      };
      auto consume = [&](auto&& self, int tree_node, int left, int right, int query_left,
                         int query_right, State& state) -> bool {
          if (right < query_left || query_right < left) { return true; }
          if (query_left <= left && right <= query_right) {
              const int length = right - left + 1;
              const HashValue combined = {
                  state.hash.first * power[static_cast<size_t>(length)].first +
                      segment_tree.tree[static_cast<size_t>(tree_node)].first,
                  state.hash.second * power[static_cast<size_t>(length)].second +
                      segment_tree.tree[static_cast<size_t>(tree_node)].second};
              const auto found = node_by_hash.find(combined);
              if (found != node_by_hash.end()) {
                  state = {combined, found->second};
                  return true;
              }
              if (left == right) { return false; }
          }
          const int middle = (left + right) / 2;
          if (!self(self, tree_node * 2, left, middle, query_left, query_right, state)) {
              return false;
          }
          return self(self, tree_node * 2 + 1, middle + 1, right, query_left, query_right,
                      state);
      };

      while (query_count-- > 0) {
          int type = 0;
          cin >> type;
          if (type == 1) {
              int start = 0;
              int left = 0;
              int right = 0;
              cin >> start >> left >> right;
              State state{path_hash[static_cast<size_t>(start)], start};
              consume(consume, 1, 1, m, left, right, state);
              cout << state.node << '\n';
          } else {
              int position = 0;
              int value = 0;
              cin >> position >> value;
              segment_tree.update(position, value);
          }
      }
  }
external_url: https://www.luogu.com.cn/problem/P5537
external_platform: 洛谷
external_problem_id: P5537
external_title: '【XR-3】系統設計'
external_relation: original
source_book_pages: [554, 574]
source_pdf_pages: [184, 204]
review_status: verified
---

查詢不是逐步走樹，而是在線段樹上以雜湊一次吞掉仍能對應某個根路徑的最大區塊。
