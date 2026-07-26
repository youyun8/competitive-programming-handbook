---
id: luogu-p3783
volume: lower
source_file: lower-volume
title: 洛谷 P3783 天才黑客
chapter: 9
section: '9.3'
kind: external-oj
difficulty: 5
topics: [trie, virtual-tree, shortest-path, lcp]
prerequisites: [lca, dijkstra, virtual-tree]
statement: >-
  有 n 個內聯網節點與 m 條有向網線。每條網線有基礎耗時 c，並以字典樹根到節點 d
  的字串作口令。依序走多條網線時，每條的實際耗時為 c 加上它與上一條網線口令的最長公共前綴長度；
  第一條的上一口令為空字串。求從節點 1 到其餘每個節點的最短時間。
constraints:
  - 'T <= 10'
  - '2 <= n <= 50000，1 <= m <= 50000，1 <= k <= 20000'
  - '0 <= c_i <= 20000'
  - 字典樹以 1 為根；內聯網可有自環與重邊
input_format: >-
  第一行 T。每組先給 n m k；接著 m 行 a b c d 描述網線；再給 k-1 行 u v w
  描述字典樹有向邊（w 是字元）。
output_format: 每組輸出 n-1 行；第 i 行為從 1 到 i+1 的最短時間，不可達輸出 -1。
samples:
  - input: "1\n4 4 6\n1 2 2 5\n2 3 2 5\n2 4 1 6\n4 2 1 6\n1 2 1\n2 3 1\n3 4 1\n4 5 2\n1 6 2\n"
    output: "2\n7\n3\n"
    explanation: 直接走 1→2→3 要 8；改走 1→2→4→2→3 可降低相鄰口令造成的總附加耗時，答案為 7。
core_knowledge:
  - 兩個字典樹根路徑字串的 LCP 長度等於其 LCA 深度
  - 對每個內聯網節點只需保留相鄰入出邊口令形成的虛樹
  - 前綴與後綴匯點可在線性邊數中連接所有不同虛子樹
  - 擴充圖所有權重非負，可直接執行 Dijkstra
judgment: 每走一條邊都支付該邊 c；附加費取本邊與上一邊口令 LCP，第一邊附加費為 0。
hints:
  - 把「走完某條原網線」視為最短路狀態，兩狀態間轉移發生在前一邊終點等於後一邊起點時。
  - 在字典樹上，兩口令的 LCP 是 LCA 深度；為每個內聯網節點用所有相鄰邊的 d 建虛樹。
  - LCA 恰為虛樹節點 u 的兩標記，或一個在 u、或分屬 u 的不同虛孩子；用子樹上下匯點及孩子前後綴匯點表示這些轉移。
solution_outline: >-
  原網線 e 建一個狀態，距離表示已走完 e。對每個內聯網節點 v，將所有入邊與出邊的口令節點及必要
  LCA 建虛樹。每個虛節點設入子樹向上匯點與出子樹向下匯點：入邊可零成本向上聚合，向下匯點可
  零成本分派，最後到出邊時支付其 c。LCA=u 的轉移分三類：入標記恰在 u、出標記恰在 u、兩者在
  u 的不同虛孩子。第三類以孩子的前綴／後綴出匯點排除同一孩子，只建線性數量的邊，轉移邊支付
  depth(u)。從節點 1 的出邊以 c 初始化，於整張非負擴充圖跑 Dijkstra。
proof_or_invariant: >-
  任意入邊口令 x 與出邊口令 y 在該虛樹中有唯一 LCA u。若 x=u，從精確入標記到 u 的向下匯點；
  若 y=u，從 x 所在孩子的向上匯點到精確出匯點；否則 x、y 分屬 u 的不同孩子，恰由前綴或後綴
  匯點連通。三類路徑都且只支付 depth(u)+c_y，也不會以較淺祖先錯連同一孩子。故擴充圖中每個合法
  相鄰原邊轉移都有等成本路徑，反之每條跨匯點路徑都對應合法轉移。Dijkstra 因此得到原問題最短路。
common_errors:
  - 直接建立每個節點所有入邊到出邊的二次方轉移
  - 用字典樹節點編號或字元值代替 LCA 深度
  - 允許同一虛孩子經較淺祖先匯點轉移，錯把 LCP 降低
  - 忘記第一條邊不收 LCP 費用，或在多組資料間保留圖狀態
complexity:
  time: O((m log k) + E' log V')，其中擴充圖 V',E' 均為 O(m)
  space: O(k log k + n + m)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：逐內聯網節點建口令虛樹與線性轉移擴充圖，再跑 Dijkstra。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <functional>
  #include <iostream>
  #include <limits>
  #include <queue>
  #include <utility>
  #include <vector>
  using namespace std;

  struct NetworkEdge {
      int from;
      int to;
      int cost;
      int word;
  };

  struct ExpandedGraph {
      vector<vector<pair<int, int>>> adjacency;

      explicit ExpandedGraph(int original_states)
          : adjacency(static_cast<size_t>(original_states)) {}

      int new_node() {
          adjacency.emplace_back();
          return static_cast<int>(adjacency.size()) - 1;
      }

      void add_edge(int from, int to, int weight) {
          adjacency[static_cast<size_t>(from)].push_back({to, weight});
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int test_count = 0;
      cin >> test_count;
      while (test_count-- > 0) {
          int n = 0;
          int m = 0;
          int trie_size = 0;
          cin >> n >> m >> trie_size;
          vector<NetworkEdge> edges(static_cast<size_t>(m));
          vector<vector<int>> incoming(static_cast<size_t>(n + 1));
          vector<vector<int>> outgoing(static_cast<size_t>(n + 1));
          for (int id = 0; id < m; ++id) {
              NetworkEdge& edge = edges[static_cast<size_t>(id)];
              cin >> edge.from >> edge.to >> edge.cost >> edge.word;
              incoming[static_cast<size_t>(edge.to)].push_back(id);
              outgoing[static_cast<size_t>(edge.from)].push_back(id);
          }

          vector<vector<int>> trie_children(static_cast<size_t>(trie_size + 1));
          vector<int> trie_parent(static_cast<size_t>(trie_size + 1), 1);
          for (int i = 1; i < trie_size; ++i) {
              int parent = 0;
              int child = 0;
              int character = 0;
              cin >> parent >> child >> character;
              static_cast<void>(character);
              trie_children[static_cast<size_t>(parent)].push_back(child);
              trie_parent[static_cast<size_t>(child)] = parent;
          }

          int log = 1;
          while ((1 << log) <= trie_size) { ++log; }
          vector<vector<int>> up(static_cast<size_t>(log),
                                 vector<int>(static_cast<size_t>(trie_size + 1), 1));
          vector<int> depth(static_cast<size_t>(trie_size + 1), 0);
          vector<int> tin(static_cast<size_t>(trie_size + 1), 0);
          vector<int> tout(static_cast<size_t>(trie_size + 1), 0);
          vector<pair<int, int>> dfs_stack;
          dfs_stack.push_back({1, 0});
          int timer = 0;
          tin[1] = ++timer;
          while (!dfs_stack.empty()) {
              const int node = dfs_stack.back().first;
              int& next_child = dfs_stack.back().second;
              if (next_child <
                  static_cast<int>(trie_children[static_cast<size_t>(node)].size())) {
                  const int child =
                      trie_children[static_cast<size_t>(node)]
                                   [static_cast<size_t>(next_child++)];
                  depth[static_cast<size_t>(child)] = depth[static_cast<size_t>(node)] + 1;
                  up[0][static_cast<size_t>(child)] = node;
                  for (int level = 1; level < log; ++level) {
                      up[static_cast<size_t>(level)][static_cast<size_t>(child)] =
                          up[static_cast<size_t>(level - 1)]
                            [static_cast<size_t>(
                                up[static_cast<size_t>(level - 1)]
                                  [static_cast<size_t>(child)])];
                  }
                  tin[static_cast<size_t>(child)] = ++timer;
                  dfs_stack.push_back({child, 0});
              } else {
                  tout[static_cast<size_t>(node)] = timer;
                  dfs_stack.pop_back();
              }
          }

          auto is_ancestor = [&](int ancestor, int node) {
              return tin[static_cast<size_t>(ancestor)] <=
                         tin[static_cast<size_t>(node)] &&
                     tout[static_cast<size_t>(node)] <=
                         tout[static_cast<size_t>(ancestor)];
          };
          auto lca = [&](int first, int second) {
              if (is_ancestor(first, second)) { return first; }
              if (is_ancestor(second, first)) { return second; }
              int current = first;
              for (int level = log - 1; level >= 0; --level) {
                  const int candidate =
                      up[static_cast<size_t>(level)][static_cast<size_t>(current)];
                  if (!is_ancestor(candidate, second)) { current = candidate; }
              }
              return up[0][static_cast<size_t>(current)];
          };

          ExpandedGraph graph(m);
          for (int network_node = 1; network_node <= n; ++network_node) {
              const auto& in_list = incoming[static_cast<size_t>(network_node)];
              const auto& out_list = outgoing[static_cast<size_t>(network_node)];
              if (in_list.empty() || out_list.empty()) { continue; }

              vector<int> virtual_nodes;
              virtual_nodes.reserve(in_list.size() + out_list.size());
              for (const int edge_id : in_list) {
                  virtual_nodes.push_back(edges[static_cast<size_t>(edge_id)].word);
              }
              for (const int edge_id : out_list) {
                  virtual_nodes.push_back(edges[static_cast<size_t>(edge_id)].word);
              }
              sort(virtual_nodes.begin(), virtual_nodes.end(), [&](int first, int second) {
                  return tin[static_cast<size_t>(first)] <
                         tin[static_cast<size_t>(second)];
              });
              virtual_nodes.erase(unique(virtual_nodes.begin(), virtual_nodes.end()),
                                  virtual_nodes.end());
              const int original_count = static_cast<int>(virtual_nodes.size());
              for (int i = 1; i < original_count; ++i) {
                  virtual_nodes.push_back(
                      lca(virtual_nodes[static_cast<size_t>(i - 1)],
                          virtual_nodes[static_cast<size_t>(i)]));
              }
              sort(virtual_nodes.begin(), virtual_nodes.end(), [&](int first, int second) {
                  return tin[static_cast<size_t>(first)] <
                         tin[static_cast<size_t>(second)];
              });
              virtual_nodes.erase(unique(virtual_nodes.begin(), virtual_nodes.end()),
                                  virtual_nodes.end());
              const int virtual_size = static_cast<int>(virtual_nodes.size());

              vector<vector<int>> virtual_children(static_cast<size_t>(virtual_size));
              vector<int> node_stack;
              for (int index = 0; index < virtual_size; ++index) {
                  while (!node_stack.empty() &&
                         !is_ancestor(
                             virtual_nodes[static_cast<size_t>(node_stack.back())],
                             virtual_nodes[static_cast<size_t>(index)])) {
                      node_stack.pop_back();
                  }
                  if (!node_stack.empty()) {
                      virtual_children[static_cast<size_t>(node_stack.back())]
                          .push_back(index);
                  }
                  node_stack.push_back(index);
              }

              vector<vector<int>> exact_in(static_cast<size_t>(virtual_size));
              vector<vector<int>> exact_out(static_cast<size_t>(virtual_size));
              auto local_index = [&](int word) {
                  const auto iterator = lower_bound(
                      virtual_nodes.begin(), virtual_nodes.end(), word,
                      [&](int node, int target) {
                          return tin[static_cast<size_t>(node)] <
                                 tin[static_cast<size_t>(target)];
                      });
                  return static_cast<int>(iterator - virtual_nodes.begin());
              };
              for (const int edge_id : in_list) {
                  exact_in[static_cast<size_t>(
                      local_index(edges[static_cast<size_t>(edge_id)].word))]
                      .push_back(edge_id);
              }
              for (const int edge_id : out_list) {
                  exact_out[static_cast<size_t>(
                      local_index(edges[static_cast<size_t>(edge_id)].word))]
                      .push_back(edge_id);
              }

              vector<int> in_hub(static_cast<size_t>(virtual_size));
              vector<int> out_hub(static_cast<size_t>(virtual_size));
              vector<int> exact_out_hub(static_cast<size_t>(virtual_size));
              for (int index = 0; index < virtual_size; ++index) {
                  in_hub[static_cast<size_t>(index)] = graph.new_node();
                  out_hub[static_cast<size_t>(index)] = graph.new_node();
                  exact_out_hub[static_cast<size_t>(index)] = graph.new_node();
              }

              for (int index = 0; index < virtual_size; ++index) {
                  const int extra =
                      depth[static_cast<size_t>(virtual_nodes[static_cast<size_t>(index)])];
                  for (const int edge_id : exact_in[static_cast<size_t>(index)]) {
                      graph.add_edge(edge_id, in_hub[static_cast<size_t>(index)], 0);
                      graph.add_edge(edge_id, out_hub[static_cast<size_t>(index)], extra);
                  }
                  for (const int edge_id : exact_out[static_cast<size_t>(index)]) {
                      graph.add_edge(out_hub[static_cast<size_t>(index)], edge_id,
                                     edges[static_cast<size_t>(edge_id)].cost);
                      graph.add_edge(exact_out_hub[static_cast<size_t>(index)], edge_id,
                                     edges[static_cast<size_t>(edge_id)].cost);
                  }

                  const auto& child_list =
                      virtual_children[static_cast<size_t>(index)];
                  const int child_count = static_cast<int>(child_list.size());
                  for (const int child : child_list) {
                      graph.add_edge(in_hub[static_cast<size_t>(child)],
                                     in_hub[static_cast<size_t>(index)], 0);
                      graph.add_edge(out_hub[static_cast<size_t>(index)],
                                     out_hub[static_cast<size_t>(child)], 0);
                      graph.add_edge(in_hub[static_cast<size_t>(child)],
                                     exact_out_hub[static_cast<size_t>(index)], extra);
                  }
                  if (child_count <= 1) { continue; }

                  vector<int> prefix(static_cast<size_t>(child_count));
                  vector<int> suffix(static_cast<size_t>(child_count));
                  for (int i = 0; i < child_count; ++i) {
                      prefix[static_cast<size_t>(i)] = graph.new_node();
                      suffix[static_cast<size_t>(i)] = graph.new_node();
                      const int child = child_list[static_cast<size_t>(i)];
                      graph.add_edge(prefix[static_cast<size_t>(i)],
                                     out_hub[static_cast<size_t>(child)], 0);
                      graph.add_edge(suffix[static_cast<size_t>(i)],
                                     out_hub[static_cast<size_t>(child)], 0);
                      if (i > 0) {
                          graph.add_edge(prefix[static_cast<size_t>(i)],
                                         prefix[static_cast<size_t>(i - 1)], 0);
                      }
                  }
                  for (int i = child_count - 1; i >= 0; --i) {
                      if (i + 1 < child_count) {
                          graph.add_edge(suffix[static_cast<size_t>(i)],
                                         suffix[static_cast<size_t>(i + 1)], 0);
                      }
                      const int child = child_list[static_cast<size_t>(i)];
                      if (i > 0) {
                          graph.add_edge(in_hub[static_cast<size_t>(child)],
                                         prefix[static_cast<size_t>(i - 1)], extra);
                      }
                      if (i + 1 < child_count) {
                          graph.add_edge(in_hub[static_cast<size_t>(child)],
                                         suffix[static_cast<size_t>(i + 1)], extra);
                      }
                  }
              }
          }

          const long long infinity = numeric_limits<long long>::max() / 4;
          vector<long long> distance(graph.adjacency.size(), infinity);
          priority_queue<pair<long long, int>, vector<pair<long long, int>>,
                         greater<pair<long long, int>>>
              queue;
          for (const int edge_id : outgoing[1]) {
              const long long initial = edges[static_cast<size_t>(edge_id)].cost;
              if (initial < distance[static_cast<size_t>(edge_id)]) {
                  distance[static_cast<size_t>(edge_id)] = initial;
                  queue.push({initial, edge_id});
              }
          }
          while (!queue.empty()) {
              const auto [current_distance, node] = queue.top();
              queue.pop();
              if (current_distance != distance[static_cast<size_t>(node)]) { continue; }
              for (const auto& [next, weight] :
                   graph.adjacency[static_cast<size_t>(node)]) {
                  const long long candidate = current_distance + weight;
                  if (candidate < distance[static_cast<size_t>(next)]) {
                      distance[static_cast<size_t>(next)] = candidate;
                      queue.push({candidate, next});
                  }
              }
          }

          vector<long long> answer(static_cast<size_t>(n + 1), infinity);
          for (int edge_id = 0; edge_id < m; ++edge_id) {
              const int destination = edges[static_cast<size_t>(edge_id)].to;
              answer[static_cast<size_t>(destination)] =
                  min(answer[static_cast<size_t>(destination)],
                      distance[static_cast<size_t>(edge_id)]);
          }
          for (int node = 2; node <= n; ++node) {
              if (answer[static_cast<size_t>(node)] == infinity) {
                  cout << -1 << '\n';
              } else {
                  cout << answer[static_cast<size_t>(node)] << '\n';
              }
          }
      }
  }
external_url: https://www.luogu.com.cn/problem/P3783
external_platform: 洛谷
external_problem_id: P3783
external_title: '[SDOI2017] 天才黑客'
external_relation: original
source_book_pages: [554, 574]
source_pdf_pages: [184, 204]
review_status: verified
---

虛樹保留所有可能成為相鄰口令 LCA 的分界；前後綴匯點只連不同孩子，因而同時保證線性規模與精確費用。
