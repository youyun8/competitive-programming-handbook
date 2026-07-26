---
id: luogu-p4782
volume: lower
source_file: lower-volume
original_label: 洛谷 P4782
title: 洛谷 P4782 2-SAT：用強連通分量解布林方程
chapter: 10
section: '10.7'
kind: external-oj
difficulty: 4
topics: ['2-SAT', '強連通分量', 'Tarjan', '蘊含圖']
prerequisites: ['directed-connectivity']
core_knowledge:
  - 每個布林變數拆成代表 x_i=0 與 x_i=1 的一對互補文字節點
  - 子句「x_i=a 或 x_j=b」建成「x_i≠a → x_j=b」與「x_j≠b → x_i=a」兩條蘊含邊
  - 以 SCC 判斷矛盾，並依縮點 DAG 的逆拓撲順序選出一組合法賦值
judgment: 若某個變數的 0、1 文字位於同一強連通分量，兩者會互相蘊含而必定無解；否則每對互補 SCC 可依逆拓撲序擇一為真，得到可驗證的完整賦值。
statement: |-
  給定 n 個布林變數與 m 個形如「x_i = a 或 x_j = b」的子句，判斷是否存在一組賦值滿足全部子句，有的話輸出任意一組。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'n 與 m 都很大，需要線性演算法'
  - '有解時輸出任意一組合法賦值即可'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；接下來 m 行，每行四個整數 i a j b，表示子句「x_i = a 或 x_j = b」。'
output_format: '無解輸出 IMPOSSIBLE；否則第一行輸出 POSSIBLE，第二行輸出 n 個 0/1 表示一組合法賦值。'
samples:
  - input: |
      3 3
      1 1 3 0
      1 0 2 0
      2 1 3 1
    output: |
      POSSIBLE
      0 1 0
    explanation: |-
      賦值 x = (0, 1, 0) 逐條檢查：「x1=1 或 x3=0」由 x3=0 成立、「x1=0 或 x2=0」由 x1=0 成立、「x2=1 或 x3=1」由 x2=1 成立，三條全部滿足。合法賦值通常不只一組，輸出任意一組即可。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    把每個變數拆成兩個節點：「x_i 為真」與「x_i 為假」。子句 (a ∨ b) 在邏輯上等價於兩條蘊含：¬a → b 以及 ¬b → a。把它們建成有向邊，就得到**蘊含圖**。
  - |-
    兩條邊都要加。只加一條會漏掉一半的推導，導致把有解判成無解或給出錯誤賦值。
  - |-
    有解的充要條件是每個變數的真、假不在同一 SCC。構造時選縮點 DAG 拓撲序較後者；本實作的 Tarjan 編號是反拓撲序，所以選編號較小者。
solution_outline: |-
  把 x_i 為假、為真分別編號為 2i 與 2i+1。每個子句加兩條蘊含邊。用 Tarjan 求強連通分量後檢查每個變數的兩個節點是否同分量：有則輸出 IMPOSSIBLE。否則對每個變數選分量編號較小者為真（Tarjan 編號是反拓撲序），輸出賦值。
proof_or_invariant: |-
  蘊含圖具有對稱性：若存在邊 u → v，則必存在 ¬v → ¬u。因此強連通分量成對出現。當 x 與 ¬x 不同分量時，取拓撲序較後者為真不會引發矛盾——若它能推出某個文字，那個文字的拓撲序更後，因而也被選為真，賦值自洽。
common_errors:
  - 一個析取子句只加入一條蘊含邊
  - 未檢查同一變數的真、假是否同 SCC
  - 混淆所用 SCC 實作的拓撲編號方向，輸出相反賦值
complexity:
  time: 'O(n + m)'
  space: 'O(n + m)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static vector<vector<int>> adjacency;
  static vector<int> dfn, low, component_of, stack_nodes;
  static vector<char> on_stack;
  static int timer_value = 0, component_count = 0;

  // 已備好：Tarjan 求強連通分量。component_of 的編號是「反拓撲序」，
  // 也就是編號較小的分量在拓撲上較後面——這個性質待會決定變數取值時會用到。
  static void tarjan(int node) {
      dfn[static_cast<size_t>(node)] = low[static_cast<size_t>(node)] = ++timer_value;
      stack_nodes.push_back(node);
      on_stack[static_cast<size_t>(node)] = 1;
      for (const int next : adjacency[static_cast<size_t>(node)]) {
          if (dfn[static_cast<size_t>(next)] == 0) {
              tarjan(next);
              low[static_cast<size_t>(node)] = min(low[static_cast<size_t>(node)], low[static_cast<size_t>(next)]);
          } else if (on_stack[static_cast<size_t>(next)]) {
              low[static_cast<size_t>(node)] = min(low[static_cast<size_t>(node)], dfn[static_cast<size_t>(next)]);
          }
      }
      if (low[static_cast<size_t>(node)] == dfn[static_cast<size_t>(node)]) {
          ++component_count;
          while (true) {
              const int top = stack_nodes.back();
              stack_nodes.pop_back();
              on_stack[static_cast<size_t>(top)] = 0;
              component_of[static_cast<size_t>(top)] = component_count;
              if (top == node) { break; }
          }
      }
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      const size_t total = 2 * static_cast<size_t>(n) + 2;
      adjacency.assign(total, {});
      // 節點編號約定：2i 代表 x_i 為假，2i+1 代表 x_i 為真。
      auto literal = [](int variable, int value) { return 2 * variable + value; };

      for (int k = 0; k < m; ++k) {
          int i, a, j, b;
          cin >> i >> a >> j >> b;
          // TODO 1：子句 (x_i = a) ∨ (x_j = b) 等價於兩條蘊含邊：
          //   「x_i ≠ a」必然推出「x_j = b」，以及「x_j ≠ b」必然推出「x_i = a」。
          //   用 a ^ 1 取反即可。兩條都要加，只加一條會漏解。
          (void)i;
          (void)a;
          (void)j;
          (void)b;
          (void)literal;
      }

      dfn.assign(total, 0);
      low.assign(total, 0);
      component_of.assign(total, 0);
      on_stack.assign(total, 0);
      for (int i = 1; i <= n; ++i) {
          for (int value = 0; value < 2; ++value) {
              const int node = literal(i, value);
              if (dfn[static_cast<size_t>(node)] == 0) { tarjan(node); }
          }
      }

      // TODO 2：判定。若某個變數的「真」與「假」兩個點落在同一個強連通分量，
      //   代表 x_i 能推出 ¬x_i 且反之亦然，矛盾，輸出 IMPOSSIBLE。
      // TODO 3：構造解。兩點不同分量時，選拓撲序較後面的那個為真——
      //   由於 Tarjan 的編號是反拓撲序，也就是選分量編號較小的那一個。
      cout << "IMPOSSIBLE\n";
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 2-SAT：每個變數拆成兩個點（為真、為假）。子句 (a ∨ b) 等價於
  // 兩條蘊含邊 ¬a → b 與 ¬b → a。有解的充要條件是沒有變數的兩個點
  // 落在同一個強連通分量裡。
  static vector<vector<int>> adjacency;
  static vector<int> dfn, low, component_of, stack_nodes;
  static vector<char> on_stack;
  static int timer_value = 0, component_count = 0;

  static void tarjan(int node) {
      dfn[static_cast<size_t>(node)] = low[static_cast<size_t>(node)] = ++timer_value;
      stack_nodes.push_back(node);
      on_stack[static_cast<size_t>(node)] = 1;
      for (const int next : adjacency[static_cast<size_t>(node)]) {
          if (dfn[static_cast<size_t>(next)] == 0) {
              tarjan(next);
              low[static_cast<size_t>(node)] = min(low[static_cast<size_t>(node)], low[static_cast<size_t>(next)]);
          } else if (on_stack[static_cast<size_t>(next)]) {
              low[static_cast<size_t>(node)] = min(low[static_cast<size_t>(node)], dfn[static_cast<size_t>(next)]);
          }
      }
      if (low[static_cast<size_t>(node)] == dfn[static_cast<size_t>(node)]) {
          ++component_count;
          while (true) {
              const int top = stack_nodes.back();
              stack_nodes.pop_back();
              on_stack[static_cast<size_t>(top)] = 0;
              component_of[static_cast<size_t>(top)] = component_count;
              if (top == node) { break; }
          }
      }
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      const size_t total = 2 * static_cast<size_t>(n) + 2;
      adjacency.assign(total, {});
      // 節點編號：2i 表示 x_i 為假，2i+1 表示 x_i 為真。
      auto literal = [](int variable, int value) { return 2 * variable + value; };
      for (int k = 0; k < m; ++k) {
          int i, a, j, b;
          cin >> i >> a >> j >> b;
          adjacency[static_cast<size_t>(literal(i, a ^ 1))].push_back(literal(j, b));
          adjacency[static_cast<size_t>(literal(j, b ^ 1))].push_back(literal(i, a));
      }

      dfn.assign(total, 0);
      low.assign(total, 0);
      component_of.assign(total, 0);
      on_stack.assign(total, 0);
      for (int i = 1; i <= n; ++i) {
          for (int value = 0; value < 2; ++value) {
              const int node = literal(i, value);
              if (dfn[static_cast<size_t>(node)] == 0) { tarjan(node); }
          }
      }

      for (int i = 1; i <= n; ++i) {
          if (component_of[static_cast<size_t>(literal(i, 0))] ==
              component_of[static_cast<size_t>(literal(i, 1))]) {
              cout << "IMPOSSIBLE\n";
              return 0;
          }
      }
      cout << "POSSIBLE\n";
      // Tarjan 的分量編號是反拓撲序，編號較小者在拓撲上較後面，選它為真。
      for (int i = 1; i <= n; ++i) {
          const bool value = component_of[static_cast<size_t>(literal(i, 1))] <
                             component_of[static_cast<size_t>(literal(i, 0))];
          cout << (value ? 1 : 0) << " \n"[i == n];
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4782
external_platform: 洛谷
external_problem_id: P4782
external_title: '【模板】2-SAT'
external_relation: original
source_book_pages: [632]
source_pdf_pages: [262]
review_status: verified
---

2-SAT 把邏輯問題翻譯成圖論問題。「子句等於兩條蘊含邊」與「同分量即矛盾」這兩句話就是全部。
