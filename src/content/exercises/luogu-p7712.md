---
id: luogu-p7712
volume: lower
source_file: lower-volume
title: 洛谷 P7712 hlcpq：隱式相交圖割點
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['掃描線', 'Tarjan 割點', '線段樹套線段樹', '隱式圖']
prerequisites: ['割點', 'DFS', '線段樹', '區間分解']
statement: 平面上有 n 條水平線段與 n 條垂直線段；第 i 條水平線段是 (l_i,i) 到 (r_i,i)，第 i 條垂直線段是 (i,l_i) 到 (i,r_i)。兩線段相交即在相交圖中連邊。判斷每條線段是否為相交圖的割點。
constraints:
  - '1 <= n <= 100000'
  - '1 <= l_i <= r_i <= n'
  - 同方向的不同線段不在同一直線上
input_format: 第一行 n；接著 n 行為水平線段的 l_i、r_i；再接著 n 行為垂直線段的 l_i、r_i。
output_format: 輸出兩個長度 n 的 01 字串；第一行依序表示水平線段是否關鍵，第二行表示垂直線段是否關鍵。
samples:
  - input: |
      10
      1 4
      2 7
      1 6
      3 7
      2 4
      1 9
      1 3
      9 10
      3 5
      1 7
      1 7
      1 3
      1 3
      3 7
      1 2
      3 5
      1 7
      5 7
      3 9
      9 10
    output: |
      0100010000
      1001000010
    explanation: 將每條線段視為頂點、每個水平與垂直交點視為邊；輸出恰為此二分相交圖的割點標記。
core_knowledge:
  - 不顯式建立最壞可達 n^2 條邊的相交圖
  - Tarjan DFS 中，未訪問鄰點只會被取出一次；已訪問鄰點只需回報最小 dfn
  - 固定方向線段可表示為「位置 p 與另一軸區間 [l,r]」，鄰接查詢是位置區間加單點刺穿
judgment: 對水平、垂直線段各建一個二維資料結構。把每條區間分解到外層線段樹的 O(log n) 個節點，各節點按固定位置排序並建內層最小值樹，同時維護尚未訪問的頂點編號及已訪問頂點的 dfn。以顯式堆疊執行 Tarjan；找樹邊時反覆報告並刪除一個未訪問鄰點，結束子樹時查所有已訪問鄰點的最小 dfn。
hints:
  - 水平 y 的鄰接垂直線必須同時滿足 x 在水平線範圍內，且垂直線的 y 區間包含 y；這是「位置範圍 + 區間刺點」。
  - 一條線段被 DFS 發現後，從未訪問結構刪除並把 dfn 寫入已訪問結構；每條樹邊只被找一次。
  - 計算 low 時要排除父邊；可暫時把父頂點在已訪問結構中的值設為無限大，查完再還原。
solution_outline: >-
  IntervalPointStructure 的外層是區間座標線段樹。每個物件 (position,[left,right])
  被加入 [left,right] 的標準 O(log n) 分解節點；每個節點內依 position 排序，建兩棵迭代最小值樹，
  分別存未訪問頂點編號與已訪問 dfn。查詢某 point、position 範圍時走 point 到根的 O(log n)
  個節點，各做一次內層範圍最小值。以 frame 記錄 DFS 頂點；若找到未訪問鄰點便建立樹邊，
  否則查最小已訪問鄰點更新 low、彈出 frame，並用標準 low 判準標記父親。
proof_or_invariant: >-
  區間的標準分解保證物件區間包含查詢 point 當且僅當 point 到根路徑上恰有一個桶存有該物件，
  內層 position 範圍再精確篩出相交線段。因此資料結構回報的正是隱式圖鄰點。每個頂點一經發現
  即從未訪問集合永久刪除，所以所有找樹邊操作總數 O(n)；已訪問查詢取到所有非父鄰邊的最小 dfn，
  與顯式 Tarjan 對 low 的更新完全相同。故 low[child] >= dfn[parent] 及 DFS 根至少兩個子樹的
  判準精確找出所有割點。
complexity:
  time: O(n log^2 n)
  space: O(n log n)
common_errors:
  - 顯式枚舉全部交點，導致 O(n^2)
  - low 查詢未排除父邊，漏報割點
  - 把不同連通分量的 DFS 根沿用同一個子節點計數
  - 使用遞迴 DFS，在 2n 深鏈上耗盡呼叫堆疊
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：建立區間刺點結構，於隱式二分圖上執行非遞迴 Tarjan。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  class IntervalPointStructure {
    private:
      static constexpr int infinity = numeric_limits<int>::max();
      struct Bucket {
          vector<int> positions;
          vector<int> ids;
          vector<int> unvisited;
          vector<int> visited;

          void build() {
              vector<pair<int, int>> entries;
              entries.reserve(positions.size());
              for (size_t i = 0; i < positions.size(); ++i) {
                  entries.push_back({positions[i], ids[i]});
              }
              sort(entries.begin(), entries.end());
              for (size_t i = 0; i < entries.size(); ++i) {
                  positions[i] = entries[i].first;
                  ids[i] = entries[i].second;
              }
              const size_t count = positions.size();
              unvisited.assign(count * 2U, infinity);
              visited.assign(count * 2U, infinity);
              for (size_t i = 0; i < count; ++i) {
                  unvisited[count + i] = ids[i] + 1;
              }
              for (size_t i = count; i-- > 1U;) {
                  unvisited[i] =
                      min(unvisited[i * 2U], unvisited[i * 2U + 1U]);
              }
          }

          void set_value(int position, int unvisited_value,
                         int visited_value) {
              const size_t count = positions.size();
              size_t index = static_cast<size_t>(
                  lower_bound(positions.begin(), positions.end(), position) -
                  positions.begin());
              index += count;
              unvisited[index] = unvisited_value;
              visited[index] = visited_value;
              while (index > 1U) {
                  index /= 2U;
                  unvisited[index] =
                      min(unvisited[index * 2U],
                          unvisited[index * 2U + 1U]);
                  visited[index] =
                      min(visited[index * 2U], visited[index * 2U + 1U]);
              }
          }

          int query_tree(const vector<int>& tree, int left, int right) const {
              const int count = static_cast<int>(positions.size());
              int begin = static_cast<int>(
                  lower_bound(positions.begin(), positions.end(), left) -
                  positions.begin());
              int end = static_cast<int>(
                  upper_bound(positions.begin(), positions.end(), right) -
                  positions.begin());
              begin += count;
              end += count;
              int answer = infinity;
              while (begin < end) {
                  if ((begin & 1) != 0) {
                      answer =
                          min(answer, tree[static_cast<size_t>(begin++)]);
                  }
                  if ((end & 1) != 0) {
                      --end;
                      answer = min(answer,
                                   tree[static_cast<size_t>(end)]);
                  }
                  begin /= 2;
                  end /= 2;
              }
              return answer;
          }
      };

    public:
      IntervalPointStructure(int size, const vector<pair<int, int>>& intervals,
                             int id_offset)
          : size_(size), intervals_(intervals), id_offset_(id_offset),
            buckets_(static_cast<size_t>(size * 2)) {
          for (int position = 1; position <= size_; ++position) {
              int left =
                  intervals_[static_cast<size_t>(position - 1)].first - 1;
              int right =
                  intervals_[static_cast<size_t>(position - 1)].second;
              for (left += size_, right += size_; left < right;
                   left /= 2, right /= 2) {
                  if ((left & 1) != 0) {
                      add_to_bucket(left++, position,
                                    id_offset_ + position - 1);
                  }
                  if ((right & 1) != 0) {
                      add_to_bucket(--right, position,
                                    id_offset_ + position - 1);
                  }
              }
          }
          for (Bucket& bucket : buckets_) {
              if (!bucket.positions.empty()) { bucket.build(); }
          }
      }

      void set_state(int position, int discovery_time) {
          visit_interval_nodes(position, [&](Bucket& bucket) {
              bucket.set_value(
                  position,
                  discovery_time == 0
                      ? id_offset_ + position
                      : infinity,
                  discovery_time == 0 ? infinity : discovery_time);
          });
      }

      int query_unvisited(int left_position, int right_position,
                          int point) const {
          return query(left_position, right_position, point, false);
      }
      int query_visited_time(int left_position, int right_position,
                             int point) const {
          return query(left_position, right_position, point, true);
      }

    private:
      void add_to_bucket(int node, int position, int id) {
          Bucket& bucket = buckets_[static_cast<size_t>(node)];
          bucket.positions.push_back(position);
          bucket.ids.push_back(id);
      }

      template <class Function>
      void visit_interval_nodes(int position, Function function) {
          int left =
              intervals_[static_cast<size_t>(position - 1)].first - 1;
          int right =
              intervals_[static_cast<size_t>(position - 1)].second;
          for (left += size_, right += size_; left < right;
               left /= 2, right /= 2) {
              if ((left & 1) != 0) {
                  function(buckets_[static_cast<size_t>(left++)]);
              }
              if ((right & 1) != 0) {
                  function(buckets_[static_cast<size_t>(--right)]);
              }
          }
      }

      int query(int left_position, int right_position, int point,
                bool use_visited) const {
          int answer = infinity;
          for (int node = point - 1 + size_; node > 0; node /= 2) {
              const Bucket& bucket =
                  buckets_[static_cast<size_t>(node)];
              if (bucket.positions.empty()) { continue; }
              answer = min(
                  answer,
                  bucket.query_tree(
                      use_visited ? bucket.visited : bucket.unvisited,
                      left_position, right_position));
          }
          return answer;
      }

      int size_;
      vector<pair<int, int>> intervals_;
      int id_offset_;
      vector<Bucket> buckets_;
  };

  struct Frame {
      int vertex;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<pair<int, int>> horizontal(static_cast<size_t>(n));
      vector<pair<int, int>> vertical(static_cast<size_t>(n));
      for (auto& [left, right] : horizontal) { cin >> left >> right; }
      for (auto& [left, right] : vertical) { cin >> left >> right; }

      IntervalPointStructure horizontal_structure(n, horizontal, 0);
      IntervalPointStructure vertical_structure(n, vertical, n);
      const int vertex_count = n * 2;
      vector<int> discovery(static_cast<size_t>(vertex_count), 0);
      vector<int> low(static_cast<size_t>(vertex_count), 0);
      vector<int> parent(static_cast<size_t>(vertex_count), -1);
      vector<int> root_children(static_cast<size_t>(vertex_count), 0);
      vector<unsigned char> articulation(
          static_cast<size_t>(vertex_count), 0);
      int timer = 0;

      const auto set_state = [&](int vertex, int time) {
          if (vertex < n) {
              horizontal_structure.set_state(vertex + 1, time);
          } else {
              vertical_structure.set_state(vertex - n + 1, time);
          }
      };
      const auto unvisited_neighbor = [&](int vertex) {
          int encoded = numeric_limits<int>::max();
          if (vertex < n) {
              const auto [left, right] =
                  horizontal[static_cast<size_t>(vertex)];
              encoded = vertical_structure.query_unvisited(
                  left, right, vertex + 1);
          } else {
              const int index = vertex - n;
              const auto [left, right] =
                  vertical[static_cast<size_t>(index)];
              encoded = horizontal_structure.query_unvisited(
                  left, right, index + 1);
          }
          return encoded == numeric_limits<int>::max() ? -1 : encoded - 1;
      };
      const auto minimum_neighbor_time = [&](int vertex) {
          if (vertex < n) {
              const auto [left, right] =
                  horizontal[static_cast<size_t>(vertex)];
              return vertical_structure.query_visited_time(
                  left, right, vertex + 1);
          }
          const int index = vertex - n;
          const auto [left, right] =
              vertical[static_cast<size_t>(index)];
          return horizontal_structure.query_visited_time(
              left, right, index + 1);
      };

      for (int root = 0; root < vertex_count; ++root) {
          if (discovery[static_cast<size_t>(root)] != 0) { continue; }
          discovery[static_cast<size_t>(root)] = ++timer;
          low[static_cast<size_t>(root)] = timer;
          set_state(root, timer);
          vector<Frame> stack;
          stack.push_back({root});
          while (!stack.empty()) {
              const int vertex = stack.back().vertex;
              const int neighbor = unvisited_neighbor(vertex);
              if (neighbor != -1) {
                  parent[static_cast<size_t>(neighbor)] = vertex;
                  if (vertex == root) {
                      ++root_children[static_cast<size_t>(root)];
                  }
                  discovery[static_cast<size_t>(neighbor)] = ++timer;
                  low[static_cast<size_t>(neighbor)] = timer;
                  set_state(neighbor, timer);
                  stack.push_back({neighbor});
                  continue;
              }

              const int parent_vertex =
                  parent[static_cast<size_t>(vertex)];
              if (parent_vertex != -1) {
                  const int parent_time =
                      discovery[static_cast<size_t>(parent_vertex)];
                  set_state(parent_vertex, 0);
                  const int back_time = minimum_neighbor_time(vertex);
                  set_state(parent_vertex, parent_time);
                  if (back_time != numeric_limits<int>::max()) {
                      low[static_cast<size_t>(vertex)] =
                          min(low[static_cast<size_t>(vertex)], back_time);
                  }
              } else {
                  const int back_time = minimum_neighbor_time(vertex);
                  if (back_time != numeric_limits<int>::max()) {
                      low[static_cast<size_t>(vertex)] =
                          min(low[static_cast<size_t>(vertex)], back_time);
                  }
              }
              stack.pop_back();
              if (parent_vertex != -1) {
                  low[static_cast<size_t>(parent_vertex)] =
                      min(low[static_cast<size_t>(parent_vertex)],
                          low[static_cast<size_t>(vertex)]);
                  if (parent[static_cast<size_t>(parent_vertex)] != -1 &&
                      low[static_cast<size_t>(vertex)] >=
                          discovery[static_cast<size_t>(parent_vertex)]) {
                      articulation[static_cast<size_t>(parent_vertex)] = 1;
                  }
              }
          }
          if (root_children[static_cast<size_t>(root)] >= 2) {
              articulation[static_cast<size_t>(root)] = 1;
          }
      }

      for (int i = 0; i < n; ++i) {
          cout << static_cast<int>(
              articulation[static_cast<size_t>(i)]);
      }
      cout << '\n';
      for (int i = 0; i < n; ++i) {
          cout << static_cast<int>(
              articulation[static_cast<size_t>(n + i)]);
      }
      cout << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P7712
external_platform: 洛谷
external_problem_id: P7712
external_title: '[Ynoi2077] hlcpq'
external_relation: original
source_book_pages: [554]
source_pdf_pages: [184]
review_status: verified
---

題意、座標定義、限制與樣例依洛谷原題及公開題解交叉核實。解法不建立稠密相交圖；本站另以小規模顯式建圖 Tarjan 隨機對拍。
