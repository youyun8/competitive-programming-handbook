---
id: luogu-p5321
volume: upper
source_file: upper-volume
title: '洛谷 P5321 [BJOI2019] 送別'
chapter: 4
section: '4.16'
kind: external-oj
difficulty: 5
topics: ['置換環', 'FHQ Treap', '動態序列分裂合併']
prerequisites: ['置換環', 'FHQ Treap', '動態序列分裂合併']
statement: |-
  動態增刪格線牆；人在指定牆的一側以左手扶牆前進，詢問到另一指定牆側的行走距離，不可到達輸出 -1。
constraints:
  - 'n,m <= 500'
  - '操作數以官方題面為準'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      1 2 1
      1
      3 0 1 1 1 0 0 1 1 1 0
    output: |-
      0
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['置換環', 'FHQ Treap', '動態序列分裂合併']
judgment: |-
  牆的兩側是不同狀態；答案以半格為單位，題目輸出的是兩倍距離。
hints:
  - '先辨識核心模型：置換環、FHQ Treap、動態序列分裂合併；暫時不要處理所有操作細節。'
  - '牆的兩側是不同狀態；答案以半格為單位，題目輸出的是兩倍距離。'
  - '最後依此不變量實作：把每個格點拆成四個角狀態，每個狀態有唯一後繼，整體形成若干置換環。增刪一堵牆只交換兩個後繼；用帶父指標的 FHQ Treap 維護每個環及邊長和，交換時切分／合併環，詢問同環有向距離。'
solution_outline: |-
  把每個格點拆成四個角狀態，每個狀態有唯一後繼，整體形成若干置換環。增刪一堵牆只交換兩個後繼；用帶父指標的 FHQ Treap 維護每個環及邊長和，交換時切分／合併環，詢問同環有向距離。
proof_or_invariant: |-
  左手規則在每個角狀態唯一決定下一狀態，因此行走軌跡必為置換環。牆修改局部只交換兩條轉移；Treap 的環切接完全等價於此交換，路徑和即行走長度。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O((nm+q)log(nm))'
  space: 'O(nm)'
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
  #include <cstdio>
  #include <random>
  #include <utility>
  #include <vector>
  using namespace std;

  constexpr int limit = 505;
  constexpr int node_limit = limit * limit * 4;
  struct Node {
      int parent = 0, left = 0, right = 0;
      unsigned priority = 0;
      int size = 1, value = 0, sum = 0;
  };
  int rows, columns, query_count, node_count;
  int upper_left[limit][limit], upper_right[limit][limit];
  int lower_left[limit][limit], lower_right[limit][limit];
  Node tree[node_limit];
  mt19937 random_engine(181766U);

  void pull(int node) {
      tree[node].size = tree[tree[node].left].size + tree[tree[node].right].size + 1;
      tree[node].sum = tree[tree[node].left].sum + tree[tree[node].right].sum + tree[node].value;
      if (tree[node].left != 0) tree[tree[node].left].parent = node;
      if (tree[node].right != 0) tree[tree[node].right].parent = node;
      tree[node].parent = 0;
  }
  void split(int root, int count, int& left_root, int& right_root) {
      if (root == 0) {
          left_root = right_root = 0;
          return;
      }
      if (count <= tree[tree[root].left].size) {
          right_root = root;
          split(tree[root].left, count, left_root, tree[root].left);
      } else {
          left_root = root;
          split(tree[root].right, count - tree[tree[root].left].size - 1,
                tree[root].right, right_root);
      }
      pull(root);
  }
  int merge(int left_root, int right_root) {
      if (left_root == 0 || right_root == 0) return left_root | right_root;
      if (tree[left_root].priority < tree[right_root].priority) {
          tree[left_root].right = merge(tree[left_root].right, right_root);
          pull(left_root);
          return left_root;
      }
      tree[right_root].left = merge(left_root, tree[right_root].left);
      pull(right_root);
      return right_root;
  }
  bool is_right_child(int node) {
      return tree[tree[node].parent].right == node;
  }
  pair<int, int> locate(int node) {
      int rank = tree[tree[node].left].size + 1;
      while (tree[node].parent != 0) {
          if (is_right_child(node)) {
              rank += tree[tree[tree[node].parent].left].size + 1;
          }
          node = tree[node].parent;
      }
      return {node, rank};
  }
  void set_last_edge(int root, int value) {
      int node = root;
      while (tree[node].right != 0) node = tree[node].right;
      tree[node].value = value;
      while (node != 0) {
          int parent = tree[node].parent;
          pull(node);
          node = parent;
      }
  }
  void swap_successors(int x1, int y1, int x2, int y2, int value) {
      if (x1 > x2 || (x1 == x2 && y1 > y2)) {
          swap(x1, x2);
          swap(y1, y2);
      }
      int first = 0, second = 0;
      if (y2 == y1 + 1) {
          first = lower_right[x1][y1];
          second = upper_left[x2][y2];
      } else {
          first = lower_left[x1][y1];
          second = upper_right[x2][y2];
      }
      auto [root1, rank1] = locate(first);
      auto [root2, rank2] = locate(second);
      if (root1 == root2) {
          if (rank1 > rank2) swap(rank1, rank2);
          int prefix = 0, middle = 0, suffix = 0, rest = 0;
          split(root1, rank2, rest, suffix);
          split(rest, rank1, prefix, middle);
          set_last_edge(prefix, value);
          set_last_edge(middle, value);
          (void)merge(prefix, suffix);
      } else {
          int prefix1 = 0, suffix1 = 0, prefix2 = 0, suffix2 = 0;
          split(root1, rank1, prefix1, suffix1);
          split(root2, rank2, prefix2, suffix2);
          set_last_edge(prefix1, value);
          set_last_edge(prefix2, value);
          (void)merge(merge(prefix1, suffix2), merge(prefix2, suffix1));
      }
  }
  int suffix_sum(int node) {
      int result = tree[node].value + tree[tree[node].right].sum;
      while (tree[node].parent != 0) {
          if (!is_right_child(node)) {
              result += tree[tree[tree[node].parent].right].sum + tree[tree[node].parent].value;
          }
          node = tree[node].parent;
      }
      return result;
  }
  int directed_distance(int from, int to) {
      auto [root1, rank1] = locate(from);
      auto [root2, rank2] = locate(to);
      if (root1 != root2) return -1;
      int result = suffix_sum(from) - suffix_sum(to);
      if (rank1 > rank2) result += tree[root1].sum;
      return result;
  }
  int state_for_wall(int x1, int y1, int x2, int y2, int side) {
      if (x1 == x2) {
          if (y1 > y2) swap(y1, y2);
          return side != 0 ? lower_right[x1][y1] : upper_left[x2][y2];
      }
      if (x1 > x2) swap(x1, x2);
      return side != 0 ? upper_right[x2][y2] : lower_left[x1][y1];
  }
  void build_cycles() {
      static int next_node[node_limit], visited[node_limit];
      for (int i = 0; i <= rows; ++i) {
          for (int j = 0; j <= columns; ++j) {
              next_node[upper_left[i][j]] = lower_left[i][j];
              next_node[lower_left[i][j]] = lower_right[i][j];
              next_node[lower_right[i][j]] = upper_right[i][j];
              next_node[upper_right[i][j]] = upper_left[i][j];
          }
      }
      auto add_horizontal = [&](int x, int y) {
          int first = lower_right[x][y], second = upper_left[x][y + 1];
          tree[first].value = tree[first].sum = 1;
          tree[second].value = tree[second].sum = 1;
          swap(next_node[first], next_node[second]);
      };
      auto add_vertical = [&](int x, int y) {
          int first = lower_left[x][y], second = upper_right[x + 1][y];
          tree[first].value = tree[first].sum = 1;
          tree[second].value = tree[second].sum = 1;
          swap(next_node[first], next_node[second]);
      };
      for (int i = 0; i < rows; ++i) {
          add_vertical(i, 0);
          add_vertical(i, columns);
      }
      for (int j = 0; j < columns; ++j) {
          add_horizontal(0, j);
          add_horizontal(rows, j);
      }
      for (int i = 1; i <= rows; ++i) {
          for (int j = 1; j < columns; ++j) {
              int exists = 0;
              scanf("%d", &exists);
              if (exists != 0) add_vertical(i - 1, j);
          }
      }
      for (int i = 1; i < rows; ++i) {
          for (int j = 1; j <= columns; ++j) {
              int exists = 0;
              scanf("%d", &exists);
              if (exists != 0) add_horizontal(i, j - 1);
          }
      }
      for (int start = 1; start <= node_count; ++start) {
          if (visited[start] != 0) continue;
          int root = start;
          visited[start] = 1;
          for (int node = next_node[start]; node != start; node = next_node[node]) {
              visited[node] = 1;
              root = merge(root, node);
          }
          (void)root;
      }
  }
  int main() {
      scanf("%d%d%d", &rows, &columns, &query_count);
      for (int i = 0; i <= rows; ++i) {
          for (int j = 0; j <= columns; ++j) {
              upper_left[i][j] = ++node_count;
              upper_right[i][j] = ++node_count;
              lower_left[i][j] = ++node_count;
              lower_right[i][j] = ++node_count;
              for (int node = node_count - 3; node <= node_count; ++node) {
                  tree[node].priority = random_engine();
              }
          }
      }
      build_cycles();
      while (query_count-- > 0) {
          int operation = 0, x1 = 0, y1 = 0, x2 = 0, y2 = 0;
          scanf("%d%d%d%d%d", &operation, &x1, &y1, &x2, &y2);
          if (operation <= 2) {
              swap_successors(x1, y1, x2, y2, operation == 1 ? 1 : 0);
          } else {
              int side1 = 0, x3 = 0, y3 = 0, x4 = 0, y4 = 0, side2 = 0;
              scanf("%d%d%d%d%d%d", &side1, &x3, &y3, &x4, &y4, &side2);
              int from = state_for_wall(x1, y1, x2, y2, side1);
              int to = state_for_wall(x3, y3, x4, y4, side2);
              printf("%d\n", directed_distance(from, to));
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5321
external_platform: '洛谷'
external_problem_id: 'P5321'
external_title: '[BJOI2019] 送別'
external_relation: original
source_book_pages: [296, 299]
source_pdf_pages: [314, 317]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
