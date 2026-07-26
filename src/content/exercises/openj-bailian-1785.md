---
id: openj-bailian-1785
volume: upper
source_file: upper-volume
title: OpenJudge 百練 1785 Binary Search Heap Construction
chapter: 4
section: '4.15'
kind: external-oj
difficulty: 3
topics: [cartesian-tree, treap, monotonic-stack]
prerequisites: [cartesian-tree, stack]
statement: 每個節點有唯一的小寫字母標籤與唯一的非負優先度。建出一棵對標籤滿足二元搜尋樹、對優先度滿足大根堆的 treap，並以指定括號表示法輸出。
constraints: ['每組 1 <= n <= 50000', '標籤非空且僅含小寫字母', '所有標籤與優先度各自互異；輸入以 n=0 結束']
input_format: 多組測資；每組先給 n，再給 n 個 `label/priority`，最後一行為 0。
output_format: 每組一行。節點輸出為 `(左子樹label/priority右子樹)`，空子樹省略。
samples:
  - input: |
      7 a/7 b/6 c/5 d/4 e/3 f/2 g/1
      7 a/1 b/2 c/3 d/4 e/5 f/6 g/7
      7 a/3 b/6 c/4 d/7 e/2 f/5 g/1
      0
    output: |
      (a/7(b/6(c/5(d/4(e/3(f/2(g/1)))))))
      (((((((a/1)b/2)c/3)d/4)e/5)f/6)g/7)
      (((a/3)b/6(c/4))d/7((e/2)f/5(g/1)))
    explanation: 第一組優先度隨標籤遞減，故形成全右鏈；第二組形成全左鏈；第三組根為最高優先度的 d/7。
core_knowledge: [依標籤排序固定中序序列, 大根笛卡兒樹, 單調棧線性建樹]
judgment: 優先度越大越靠近根；括號永遠包住一個非空節點，空子樹不輸出任何符號。
hints:
  - BST 性質表示中序遍歷必為標籤排序後的順序，先排序即可消除標籤維度。
  - 在固定中序上要求父優先度較大，正是大根笛卡兒樹。
  - 維護優先度遞減的右鏈；新節點彈出的最後一個節點成為其左子，剩餘棧頂把它設為右子。
solution_outline: 解析 pair 並按標籤排序，以單調棧 O(n) 建大根笛卡兒樹。從根做迭代狀態遍歷，依序輸出左括號、左子、節點資料、右子、右括號。
proof_or_invariant: 排序後索引順序就是唯一合法中序。單調棧始終保存目前樹的右鏈且優先度遞減；每次彈出的節點皆應落在新節點左子樹，剩餘棧頂則是新節點最近的較大優先度祖先。因此同時維持 BST 與大根堆性質，且唯一。
common_errors: [把優先度當小根堆, 未先依標籤排序, 葉節點錯輸出空子樹括號, 遞迴輸出退化鏈造成爆棧]
complexity: { time: '每組 O(n log n)', space: 'O(n)' }
cpp_skeleton: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      while (cin >> n && n != 0) {
          vector<string> token(static_cast<size_t>(n));
          for (string& item : token) cin >> item;
          // TODO：解析、按標籤排序，再建大根笛卡兒樹。
      }
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;

  struct Node {
      string label;
      int priority = 0;
      int left = -1;
      int right = -1;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      while (cin >> n && n != 0) {
          vector<Node> nodes(static_cast<size_t>(n));
          for (Node& node : nodes) {
              string token;
              cin >> token;
              const size_t slash = token.find('/');
              node.label = token.substr(0, slash);
              node.priority = stoi(token.substr(slash + 1));
          }
          sort(nodes.begin(), nodes.end(), [](const Node& a, const Node& b) { return a.label < b.label; });
          vector<int> stack_nodes;
          for (int i = 0; i < n; ++i) {
              int last = -1;
              while (!stack_nodes.empty() &&
                     nodes[static_cast<size_t>(stack_nodes.back())].priority < nodes[static_cast<size_t>(i)].priority) {
                  last = stack_nodes.back();
                  stack_nodes.pop_back();
              }
              nodes[static_cast<size_t>(i)].left = last;
              if (!stack_nodes.empty()) nodes[static_cast<size_t>(stack_nodes.back())].right = i;
              stack_nodes.push_back(i);
          }
          const int root = stack_nodes.front();
          struct Frame { int node; int state; };
          vector<Frame> traversal{{root, 0}};
          while (!traversal.empty()) {
              Frame& frame = traversal.back();
              const Node& node = nodes[static_cast<size_t>(frame.node)];
              if (frame.state == 0) {
                  cout << '(';
                  frame.state = 1;
                  if (node.left != -1) traversal.push_back({node.left, 0});
              } else if (frame.state == 1) {
                  cout << node.label << '/' << node.priority;
                  frame.state = 2;
                  if (node.right != -1) traversal.push_back({node.right, 0});
              } else {
                  cout << ')';
                  traversal.pop_back();
              }
          }
          cout << '\n';
      }
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/1785/
external_platform: OpenJudge 百練
external_problem_id: '1785'
external_title: Binary Search Heap Construction
external_relation: original
source_book_pages: [363, 376]
source_pdf_pages: [381, 394]
review_status: verified
---

Treap 的兩個排序條件在這裡沒有隨機性：標籤決定中序，優先度決定笛卡兒樹形。
