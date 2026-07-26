---
id: luogu-p5354
volume: upper
source_file: upper-volume
title: 洛谷 P5354 由乃的 OJ：有向路徑位元函數合成
chapter: 4
section: '4.10'
kind: external-oj
difficulty: 5
topics: [link-cut-tree, bitwise-operation, function-composition]
prerequisites: [link-cut-tree, bitwise-greedy]
statement: 樹上每點有 AND、OR 或 XOR 常數操作。查詢 x、y、z：選 0<=v<=z，依 x 到 y 順序套用路徑所有操作，使最終值最大；也可單點修改操作種類與常數。所有值小於 2^k。
constraints: ['0 <= n,m <= 100000', '0 <= k <= 64', '操作常數與 z 小於 2^k']
input_format: 第一行 n、m、k；接著 n 行操作編號（1=&、2=|、3=^）與常數；再給 n-1 條邊及 m 行 `1 x y z` 查詢或 `2 x op value` 修改。
output_format: 每個查詢輸出可得到的最大值。
samples:
  - input: |
      5 5 3
      1 7
      2 6
      3 7
      3 6
      3 1
      1 2
      2 3
      3 4
      1 5
      1 1 4 7
      1 1 3 5
      2 1 1 3
      2 3 3 3
      1 1 3 2
    output: |
      7
      1
      5
    explanation: 每個查詢先把有向路徑操作合成為一個逐位布林函數，再在 v<=z 限制下由高位到低位選擇輸入。
core_knowledge: [以 f(0)與f(1)壓縮逐位函數, 非交換函數合成, LCT 維護有向路徑]
judgment: 位運算套用順序是 x 到 y，反向結果通常不同；k=64 時不可計算 `1ULL<<64`。
hints:
  - 對每一位，整串操作只是一個 `{0,1}->{0,1}` 函數；把所有位壓成 f0、f1，表示全 0/全 1 輸入的輸出。
  - 函數合成可用常數次整數位運算完成；資料結構必須同時維護正序與逆序合成。
  - LCT 的 makeroot(x)、access(y) 會暴露有向 x-y 路徑。得到 f0/f1 後，高位貪心：f0 為 1 則免費取得；否則僅在 f1 為 1 且加入該輸入位不超過 z 時選 1。
solution_outline: 將每點操作轉成二元函數對。LCT 節點維護輔助樹中序的正、逆向合成，翻轉標記時交換兩者。查詢暴露路徑後逐位貪心；修改則 expose 該點後替換自身函數。
proof_or_invariant: f0/f1 對每位完整描述布林函數，合成公式與逐點套用等價。LCT 正序聚合始終等於輔助樹中序路徑函數，makeroot/access 後即 x 到 y。高位貪心在不超過 z 的可行輸入中優先最大化最終值，低位不可能推翻較高位選擇。
common_errors:
  [
    合成順序顛倒,
    makeroot 翻轉時只換左右子而未換正逆聚合,
    使用 signed long long 位移到第 63 位,
    f0 已為 1 時仍浪費輸入預算
  ]
complexity: { time: '每次攤還 O(log n+k)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：將位元操作壓成 f0/f1，並用 LCT 維護正反向合成。
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;
  struct Function {
      uint64_t zero = 0, one = ~uint64_t{0};
  };
  Function compose(const Function& first, const Function& second, uint64_t mask) {
      return {((~first.zero & second.zero) | (first.zero & second.one)) & mask,
              ((~first.one & second.zero) | (first.one & second.one)) & mask};
  }
  struct LinkCutTree {
      struct Node {
          int child[2] = {0, 0}, parent = 0;
          bool reverse = false;
          Function own, forward, backward;
      };
      vector<Node> nodes;
      uint64_t mask;
      LinkCutTree(int n, uint64_t bit_mask) : nodes(static_cast<size_t>(n) + 1U), mask(bit_mask) {}
      bool is_root(int x) const { int p = nodes[static_cast<size_t>(x)].parent; return p == 0 || (nodes[static_cast<size_t>(p)].child[0] != x && nodes[static_cast<size_t>(p)].child[1] != x); }
      void pull(int x) {
          Node& node = nodes[static_cast<size_t>(x)];
          Function forward = nodes[static_cast<size_t>(node.child[0])].forward;
          forward = compose(forward, node.own, mask);
          forward = compose(forward, nodes[static_cast<size_t>(node.child[1])].forward, mask);
          node.forward = forward;
          Function backward = nodes[static_cast<size_t>(node.child[1])].backward;
          backward = compose(backward, node.own, mask);
          backward = compose(backward, nodes[static_cast<size_t>(node.child[0])].backward, mask);
          node.backward = backward;
      }
      void apply_reverse(int x) { if (x == 0) return; Node& node = nodes[static_cast<size_t>(x)]; swap(node.child[0], node.child[1]); swap(node.forward, node.backward); node.reverse = !node.reverse; }
      void push(int x) { if (nodes[static_cast<size_t>(x)].reverse) { apply_reverse(nodes[static_cast<size_t>(x)].child[0]); apply_reverse(nodes[static_cast<size_t>(x)].child[1]); nodes[static_cast<size_t>(x)].reverse = false; } }
      void rotate(int x) {
          int y = nodes[static_cast<size_t>(x)].parent, z = nodes[static_cast<size_t>(y)].parent;
          int direction = nodes[static_cast<size_t>(y)].child[1] == x, middle = nodes[static_cast<size_t>(x)].child[direction ^ 1];
          if (!is_root(y)) nodes[static_cast<size_t>(z)].child[nodes[static_cast<size_t>(z)].child[1] == y] = x;
          nodes[static_cast<size_t>(x)].parent = z; nodes[static_cast<size_t>(x)].child[direction ^ 1] = y;
          nodes[static_cast<size_t>(y)].parent = x; nodes[static_cast<size_t>(y)].child[direction] = middle;
          if (middle != 0) nodes[static_cast<size_t>(middle)].parent = y;
          pull(y); pull(x);
      }
      void splay(int x) {
          vector<int> ancestors{x}; for (int node = x; !is_root(node); node = nodes[static_cast<size_t>(node)].parent) ancestors.push_back(nodes[static_cast<size_t>(node)].parent);
          for (auto it = ancestors.rbegin(); it != ancestors.rend(); ++it) push(*it);
          while (!is_root(x)) { int y = nodes[static_cast<size_t>(x)].parent, z = nodes[static_cast<size_t>(y)].parent; if (!is_root(y)) rotate((nodes[static_cast<size_t>(y)].child[1] == x) == (nodes[static_cast<size_t>(z)].child[1] == y) ? y : x); rotate(x); }
      }
      void access(int x) { for (int last = 0; x != 0; x = nodes[static_cast<size_t>(x)].parent) { splay(x); nodes[static_cast<size_t>(x)].child[1] = last; pull(x); last = x; } }
      void make_root(int x) { access(x); splay(x); apply_reverse(x); }
      Function path(int x, int y) { make_root(x); access(y); splay(y); return nodes[static_cast<size_t>(y)].forward; }
      void set(int x, Function function) { access(x); splay(x); nodes[static_cast<size_t>(x)].own = function; pull(x); }
  };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, m, bits; cin >> n >> m >> bits;
      const uint64_t mask = bits == 64 ? ~uint64_t{0} : (bits == 0 ? 0 : (uint64_t{1} << bits) - 1);
      LinkCutTree tree(n, mask);
      tree.nodes[0].own = tree.nodes[0].forward = tree.nodes[0].backward = {0, mask};
      auto make_function = [&](int operation, uint64_t value) {
          value &= mask;
          if (operation == 1) return Function{0, value};
          if (operation == 2) return Function{value, mask};
          return Function{value, mask ^ value};
      };
      for (int node = 1; node <= n; ++node) { int operation; uint64_t value; cin >> operation >> value; tree.nodes[static_cast<size_t>(node)].own = tree.nodes[static_cast<size_t>(node)].forward = tree.nodes[static_cast<size_t>(node)].backward = make_function(operation, value); }
      vector<vector<int>> graph(static_cast<size_t>(n) + 1U);
      for (int i = 1; i < n; ++i) { int u, v; cin >> u >> v; graph[static_cast<size_t>(u)].push_back(v); graph[static_cast<size_t>(v)].push_back(u); }
      vector<int> stack{1}; tree.nodes[1].parent = 0;
      while (!stack.empty()) { int node = stack.back(); stack.pop_back(); for (int next : graph[static_cast<size_t>(node)]) if (next != tree.nodes[static_cast<size_t>(node)].parent) { tree.nodes[static_cast<size_t>(next)].parent = node; stack.push_back(next); } }
      while (m--) {
          int type, x, y; uint64_t z; cin >> type >> x >> y >> z;
          if (type == 2) tree.set(x, make_function(y, z));
          else {
              Function function = tree.path(x, y);
              uint64_t input = 0, answer = 0;
              for (int bit = bits - 1; bit >= 0; --bit) {
                  const uint64_t value = uint64_t{1} << bit;
                  if ((function.zero & value) != 0) answer |= value;
                  else if ((function.one & value) != 0 && input + value <= z) { input += value; answer |= value; }
              }
              cout << answer << '\n';
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5354
external_platform: 洛谷
external_problem_id: P5354
external_title: '[Ynoi Easy Round 2017] 由乃的 OJ'
external_relation: original
source_book_pages: [277, 292]
source_pdf_pages: [295, 310]
review_status: verified
---

每一位只有四種可能函數；用兩個 64 位元數即可一次合成所有位，LCT 則負責保留路徑方向。
