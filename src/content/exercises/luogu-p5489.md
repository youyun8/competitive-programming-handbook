---
id: luogu-p5489
volume: upper
source_file: upper-volume
title: '洛谷 P5489 EntropyIncreaser 與動態圖'
chapter: 4
section: '4.18'
kind: external-oj
difficulty: 5
topics: ['增量點雙連通', 'Link-Cut Tree', '路徑縮點']
prerequisites: ['增量點雙連通', 'Link-Cut Tree', '路徑縮點']
statement: |-
  空無向圖只加邊，線上詢問兩點間所有路徑共同包含的割邊數或割點數；不連通輸出 -1。
constraints:
  - 'n <= 100000'
  - 'q <= 300000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      3 4
      1 1 2
      1 2 3
      2 1 3
      3 0 1
    output: |-
      2
      2
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['增量點雙連通', 'Link-Cut Tree', '路徑縮點']
judgment: |-
  割點定義包含端點；輸入 u、v 要 XOR 最近一次非 -1 答案。
hints:
  - '先辨識核心模型：增量點雙連通、Link-Cut Tree、路徑縮點；暫時不要處理所有操作細節。'
  - '割點定義包含端點；輸入 u、v 要 XOR 最近一次非 -1 答案。'
  - '最後依此不變量實作：維護兩棵 LCT：第一棵把每條尚為橋的邊建成權 1 虛點，成環時把路徑賦 0；第二棵維護點雙連通森林，成環時把路徑收縮到新虛點。查詢分別取兩棵樹的路徑和。'
solution_outline: |-
  維護兩棵 LCT：第一棵把每條尚為橋的邊建成權 1 虛點，成環時把路徑賦 0；第二棵維護點雙連通森林，成環時把路徑收縮到新虛點。查詢分別取兩棵樹的路徑和。
proof_or_invariant: |-
  增量圖的非樹邊只會讓其樹路徑上的橋失效，故第一棵路徑賦零正確；第二棵把同一新點雙連通分量完整縮成虛點，原點權一使路徑和等於共同必經頂點數。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: '均攤 O(log n) 加上總縮點 O((n+q)log n)'
  space: 'O(n+q)'
cpp_skeleton: |-
  #include <iostream>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依題卡的不變量完成平衡樹、KD-tree 或 Link-Cut Tree。
      return 0;
  }
cpp_solution: |-
  #if defined(__GNUC__)
  #pragma GCC diagnostic ignored "-Wconversion"
  #pragma GCC diagnostic ignored "-Wshadow"
  #pragma GCC diagnostic ignored "-Wpedantic"
  #pragma GCC diagnostic ignored "-Wsign-compare"
  #pragma GCC diagnostic ignored "-Wunused-parameter"
  #pragma GCC diagnostic ignored "-Wunused-variable"
  #pragma GCC diagnostic ignored "-Wunused-function"
  #pragma GCC diagnostic ignored "-Wunused-result"
  #pragma GCC diagnostic ignored "-Wparentheses"
  #pragma GCC diagnostic ignored "-Wmisleading-indentation"
  #pragma GCC diagnostic ignored "-Wdangling-else"
  #pragma GCC diagnostic ignored "-Wsequence-point"
  #pragma GCC diagnostic ignored "-Wclass-memaccess"
  #pragma GCC diagnostic ignored "-Wimplicit-fallthrough"
  #endif
  #include <algorithm>
  #include <iostream>
  #include <numeric>
  #include <vector>
  using namespace std;

  class LinkCutTree {
  public:
      struct Node {
          int child[2]{};
          int parent = 0;
          int value = 0, sum = 0, size = 1;
          int assignment = -1;
          bool reversed = false;
      };
      explicit LinkCutTree(int capacity) : nodes(static_cast<size_t>(capacity) + 1U) {
          nodes[0].size = 0;
      }
      void set_value(int node, int value) {
          nodes[static_cast<size_t>(node)].value = value;
          pull(node);
      }
      void make_root(int node) {
          access(node);
          splay(node);
          apply_reverse(node);
      }
      int find_root(int node) {
          access(node);
          splay(node);
          push(node);
          while (nodes[static_cast<size_t>(node)].child[0] != 0) {
              node = nodes[static_cast<size_t>(node)].child[0];
              push(node);
          }
          splay(node);
          return node;
      }
      void link(int first, int second) {
          make_root(first);
          nodes[static_cast<size_t>(first)].parent = second;
      }
      void cut(int first, int second) {
          make_root(first);
          access(second);
          splay(second);
          if (nodes[static_cast<size_t>(second)].child[0] == first) {
              nodes[static_cast<size_t>(second)].child[0] = 0;
              nodes[static_cast<size_t>(first)].parent = 0;
              pull(second);
          }
      }
      int path_sum(int first, int second) {
          split(first, second);
          return nodes[static_cast<size_t>(second)].sum;
      }
      void assign_path(int first, int second, int value) {
          split(first, second);
          apply_assignment(second, value);
      }
      vector<int> path_nodes(int first, int second) {
          split(first, second);
          vector<int> order;
          vector<pair<int, bool>> stack{{second, false}};
          while (!stack.empty()) {
              auto [node, visited] = stack.back();
              stack.pop_back();
              if (node == 0) continue;
              if (visited) {
                  order.push_back(node);
                  continue;
              }
              push(node);
              stack.push_back({nodes[static_cast<size_t>(node)].child[1], false});
              stack.push_back({node, true});
              stack.push_back({nodes[static_cast<size_t>(node)].child[0], false});
          }
          return order;
      }

  private:
      vector<Node> nodes;
      bool is_auxiliary_root(int node) const {
          int parent = nodes[static_cast<size_t>(node)].parent;
          return nodes[static_cast<size_t>(parent)].child[0] != node &&
                 nodes[static_cast<size_t>(parent)].child[1] != node;
      }
      void pull(int node) {
          Node& current = nodes[static_cast<size_t>(node)];
          current.size = nodes[static_cast<size_t>(current.child[0])].size +
                         nodes[static_cast<size_t>(current.child[1])].size + 1;
          current.sum = nodes[static_cast<size_t>(current.child[0])].sum +
                        nodes[static_cast<size_t>(current.child[1])].sum + current.value;
      }
      void apply_reverse(int node) {
          if (node == 0) return;
          Node& current = nodes[static_cast<size_t>(node)];
          swap(current.child[0], current.child[1]);
          current.reversed = !current.reversed;
      }
      void apply_assignment(int node, int value) {
          if (node == 0) return;
          Node& current = nodes[static_cast<size_t>(node)];
          current.value = value;
          current.sum = value * current.size;
          current.assignment = value;
      }
      void push(int node) {
          Node& current = nodes[static_cast<size_t>(node)];
          if (current.reversed) {
              apply_reverse(current.child[0]);
              apply_reverse(current.child[1]);
              current.reversed = false;
          }
          if (current.assignment != -1) {
              apply_assignment(current.child[0], current.assignment);
              apply_assignment(current.child[1], current.assignment);
              current.assignment = -1;
          }
      }
      void rotate(int node) {
          int parent = nodes[static_cast<size_t>(node)].parent;
          int grandparent = nodes[static_cast<size_t>(parent)].parent;
          int direction = nodes[static_cast<size_t>(parent)].child[1] == node ? 1 : 0;
          int middle = nodes[static_cast<size_t>(node)].child[direction ^ 1];
          if (!is_auxiliary_root(parent))
              nodes[static_cast<size_t>(grandparent)].child[
                  nodes[static_cast<size_t>(grandparent)].child[1] == parent ? 1 : 0] = node;
          nodes[static_cast<size_t>(node)].parent = grandparent;
          nodes[static_cast<size_t>(node)].child[direction ^ 1] = parent;
          nodes[static_cast<size_t>(parent)].parent = node;
          nodes[static_cast<size_t>(parent)].child[direction] = middle;
          if (middle != 0) nodes[static_cast<size_t>(middle)].parent = parent;
          pull(parent);
          pull(node);
      }
      void splay(int node) {
          vector<int> ancestors{node};
          for (int current = node; !is_auxiliary_root(current);
               current = nodes[static_cast<size_t>(current)].parent)
              ancestors.push_back(nodes[static_cast<size_t>(current)].parent);
          for (auto iterator = ancestors.rbegin(); iterator != ancestors.rend(); ++iterator) push(*iterator);
          while (!is_auxiliary_root(node)) {
              int parent = nodes[static_cast<size_t>(node)].parent;
              int grandparent = nodes[static_cast<size_t>(parent)].parent;
              if (!is_auxiliary_root(parent)) {
                  bool same = (nodes[static_cast<size_t>(parent)].child[1] == node) ==
                              (nodes[static_cast<size_t>(grandparent)].child[1] == parent);
                  rotate(same ? parent : node);
              }
              rotate(node);
          }
      }
      void access(int node) {
          int previous = 0;
          for (int current = node; current != 0;
               current = nodes[static_cast<size_t>(current)].parent) {
              splay(current);
              nodes[static_cast<size_t>(current)].child[1] = previous;
              pull(current);
              previous = current;
          }
      }
      void split(int first, int second) {
          make_root(first);
          access(second);
          splay(second);
      }
  };

  class DisjointSet {
  public:
      explicit DisjointSet(int n) : parent(static_cast<size_t>(n) + 1U), size(static_cast<size_t>(n) + 1U, 1) {
          iota(parent.begin(), parent.end(), 0);
      }
      int find(int node) {
          while (parent[static_cast<size_t>(node)] != node) {
              parent[static_cast<size_t>(node)] =
                  parent[static_cast<size_t>(parent[static_cast<size_t>(node)])];
              node = parent[static_cast<size_t>(node)];
          }
          return node;
      }
      bool unite(int first, int second) {
          first = find(first);
          second = find(second);
          if (first == second) return false;
          if (size[static_cast<size_t>(first)] < size[static_cast<size_t>(second)]) swap(first, second);
          parent[static_cast<size_t>(second)] = first;
          size[static_cast<size_t>(first)] += size[static_cast<size_t>(second)];
          return true;
      }

  private:
      vector<int> parent, size;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n = 0, operation_count = 0;
      cin >> n >> operation_count;
      int capacity = n + operation_count + 5;
      LinkCutTree bridge_tree(capacity), block_tree(capacity);
      for (int node = 1; node <= n; ++node) block_tree.set_value(node, 1);
      DisjointSet components(n);
      int bridge_virtual = n, block_virtual = n;
      int last_answer = 0;
      while (operation_count-- > 0) {
          int operation = 0, first = 0, second = 0;
          cin >> operation >> first >> second;
          first ^= last_answer;
          second ^= last_answer;
          if (operation == 1) {
              if (components.unite(first, second)) {
                  ++bridge_virtual;
                  bridge_tree.set_value(bridge_virtual, 1);
                  bridge_tree.link(first, bridge_virtual);
                  bridge_tree.link(second, bridge_virtual);
                  block_tree.link(first, second);
              } else {
                  bridge_tree.assign_path(first, second, 0);
                  vector<int> path = block_tree.path_nodes(first, second);
                  for (size_t index = 1; index < path.size(); ++index)
                      block_tree.cut(path[index - 1], path[index]);
                  ++block_virtual;
                  for (int node : path) block_tree.link(node, block_virtual);
              }
          } else {
              int answer = -1;
              if (components.find(first) == components.find(second)) {
                  answer = operation == 2 ? bridge_tree.path_sum(first, second)
                                          : block_tree.path_sum(first, second);
                  last_answer = answer;
              }
              cout << answer << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5489
external_platform: '洛谷'
external_problem_id: 'P5489'
external_title: 'EntropyIncreaser 與動態圖'
external_relation: original
source_book_pages: [310, 317]
source_pdf_pages: [328, 335]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
