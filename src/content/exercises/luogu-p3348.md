---
id: luogu-p3348
volume: upper
source_file: upper-volume
title: '洛谷 P3348 [ZJOI2016] 大森林'
chapter: 4
section: '4.18'
kind: external-oj
difficulty: 5
topics: ['離線掃描', '虛節點', 'Link-Cut Tree']
prerequisites: ['離線掃描', '虛節點', 'Link-Cut Tree']
statement: |-
  同時維護很多棵共享節點標號的樹；區間樹可在生長點新增同標號子節點、區間更換生長點，並查某棵樹兩點距離。
constraints:
  - 'n <= 100000'
  - 'm <= 200000'
input_format: '依官方題面依序輸入初始資料與操作。'
output_format: '對每個詢問依序輸出答案。'
samples:
  - input: |-
      2 3
      0 1 2
      1 1 1 2
      2 1 1 2
    output: |-
      1
    explanation: '此例已用卡片程式執行核對；亦可依題意手算驗證。'
core_knowledge: ['離線掃描', '虛節點', 'Link-Cut Tree']
judgment: |-
  更換到某標號只影響實際含該點的樹；虛節點不計路徑長度。
hints:
  - '先辨識核心模型：離線掃描、虛節點、Link-Cut Tree；暫時不要處理所有操作細節。'
  - '更換到某標號只影響實際含該點的樹；虛節點不計路徑長度。'
  - '最後依此不變量實作：每次更換生長點建立一個虛節點，之後新增實點接在目前虛節點。把區間修改拆成樹編號掃描事件；掃到事件時 cut 虛點舊父並 link 新父。LCT 以實點值 1、虛點值 0 求兩點路徑實點數減一。'
solution_outline: |-
  每次更換生長點建立一個虛節點，之後新增實點接在目前虛節點。把區間修改拆成樹編號掃描事件；掃到事件時 cut 虛點舊父並 link 新父。LCT 以實點值 1、虛點值 0 求兩點路徑實點數減一。
proof_or_invariant: |-
  固定掃描到樹 x 時，所有覆蓋 x 的修改事件已把虛點接到該樹當時生長點，故 LCT 形狀與第 x 棵樹同構；虛點權零使路徑和只計真實節點，距離公式正確。
common_errors:
  - '索引、加密參數或區間端點偏移一位'
  - '懶標記、旋轉或虛實邊切換前沒有先下傳'
  - '距離、乘積、子樹和或答案使用 int 而溢位'
complexity:
  time: 'O((m+詢問)log m)'
  space: 'O(m+n)'
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
  #include <vector>
  using namespace std;

  constexpr int maximum_operations = 200005;
  struct Event {
      int tree_index;
      int order;
      int first;
      int second;
  };
  int parent_node[maximum_operations], child[maximum_operations][2];
  int subtree_sum[maximum_operations], node_value[maximum_operations];
  int born_left[maximum_operations], born_right[maximum_operations], real_node[maximum_operations];
  int answer[maximum_operations];

  bool is_auxiliary_root(int node) {
      int parent = parent_node[node];
      return child[parent][0] != node && child[parent][1] != node;
  }
  void pull(int node) {
      subtree_sum[node] = subtree_sum[child[node][0]] + subtree_sum[child[node][1]] + node_value[node];
  }
  void rotate(int node) {
      int parent = parent_node[node];
      int grandparent = parent_node[parent];
      int direction = child[parent][1] == node ? 1 : 0;
      int middle = child[node][direction ^ 1];
      if (!is_auxiliary_root(parent)) child[grandparent][child[grandparent][1] == parent ? 1 : 0] = node;
      parent_node[node] = grandparent;
      child[node][direction ^ 1] = parent;
      parent_node[parent] = node;
      child[parent][direction] = middle;
      if (middle != 0) parent_node[middle] = parent;
      pull(parent);
      pull(node);
  }
  void splay(int node) {
      while (!is_auxiliary_root(node)) {
          int parent = parent_node[node];
          int grandparent = parent_node[parent];
          if (!is_auxiliary_root(parent)) {
              bool same = (child[parent][1] == node) == (child[grandparent][1] == parent);
              rotate(same ? parent : node);
          }
          rotate(node);
      }
      pull(node);
  }
  int access(int node) {
      int previous = 0;
      while (node != 0) {
          splay(node);
          child[node][1] = previous;
          pull(node);
          previous = node;
          node = parent_node[node];
      }
      return previous;
  }
  void link_root(int node, int parent) {
      access(node);
      splay(node);
      parent_node[node] = parent;
  }
  void cut_from_parent(int node) {
      access(node);
      splay(node);
      int left = child[node][0];
      child[node][0] = 0;
      if (left != 0) parent_node[left] = 0;
      pull(node);
  }
  int distance_between(int first, int second) {
      access(first);
      splay(first);
      int first_depth = subtree_sum[first];
      int ancestor = access(second);
      splay(second);
      int second_depth = subtree_sum[second];
      access(ancestor);
      splay(ancestor);
      return first_depth + second_depth - 2 * subtree_sum[ancestor];
  }
  int main() {
      int tree_count = 0, operation_count = 0;
      scanf("%d%d", &tree_count, &operation_count);
      vector<Event> events;
      events.reserve(static_cast<size_t>(operation_count) * 2U);
      int real_count = 1, total_nodes = 2, current_growth = 2, query_count = 0;
      real_node[1] = 1;
      born_left[1] = 1;
      born_right[1] = tree_count;
      node_value[1] = subtree_sum[1] = 1;
      link_root(current_growth, 1);
      for (int operation_index = 1; operation_index <= operation_count; ++operation_index) {
          int operation = 0;
          scanf("%d", &operation);
          if (operation == 0) {
              int left = 0, right = 0;
              scanf("%d%d", &left, &right);
              ++real_count;
              real_node[real_count] = ++total_nodes;
              born_left[real_count] = left;
              born_right[real_count] = right;
              node_value[total_nodes] = subtree_sum[total_nodes] = 1;
              link_root(total_nodes, current_growth);
          } else if (operation == 1) {
              int left = 0, right = 0, target = 0;
              scanf("%d%d%d", &left, &right, &target);
              left = max(left, born_left[target]);
              right = min(right, born_right[target]);
              if (left > right) continue;
              int new_virtual = ++total_nodes;
              link_root(new_virtual, current_growth);
              events.push_back({left, operation_index - operation_count, new_virtual, real_node[target]});
              events.push_back({right + 1, operation_index - operation_count, new_virtual, current_growth});
              current_growth = new_virtual;
          } else {
              int tree_index = 0, first = 0, second = 0;
              scanf("%d%d%d", &tree_index, &first, &second);
              events.push_back({tree_index, ++query_count, real_node[first], real_node[second]});
          }
      }
      sort(events.begin(), events.end(), [](const Event& left, const Event& right) {
          if (left.tree_index != right.tree_index) return left.tree_index < right.tree_index;
          return left.order < right.order;
      });
      for (const Event& event : events) {
          if (event.order <= 0) {
              cut_from_parent(event.first);
              link_root(event.first, event.second);
          } else {
              answer[event.order] = distance_between(event.first, event.second);
          }
      }
      for (int index = 1; index <= query_count; ++index) printf("%d\n", answer[index]);
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3348
external_platform: '洛谷'
external_problem_id: 'P3348'
external_title: '[ZJOI2016] 大森林'
external_relation: original
source_book_pages: [310, 317]
source_pdf_pages: [328, 335]
review_status: verified
---

題意、限制與輸入輸出已逐題對照官方題面或可信競賽存檔；解說以繁體中文獨立整理。
