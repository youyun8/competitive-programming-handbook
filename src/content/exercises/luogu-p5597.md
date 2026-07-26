---
id: luogu-p5597
volume: upper
source_file: upper-volume
title: 洛谷 P5597 復讀
chapter: 1
section: '1.4'
kind: external-oj
difficulty: 5
topics: [binary-tree, periodic-walk, tree-union, enumeration]
prerequisites: [preorder-encoding, tree-traversal, depth-first-search]
statement: >-
  機器人起初位於一棵無限滿二元樹的根。指令 L、R、U 分別走向左孩子、右孩子、父節點，
  一段錄好的指令會無限重複。有限且包含根的連通節點集上各有一份寶藏；輸入以 0、1、2、3
  的前序編碼描述這棵有限二元樹。求能讓機器人造訪全部寶藏，且永遠不會在總根執行 U 的最短週期長度。
constraints:
  - 2 <= n <= 2000，其中 n 為輸入字串長度，也就是寶藏節點數
  - 字元 0、1、2、3 分別表示無孩子、只有左孩子、只有右孩子、左右孩子皆有
  - 時間限制 1 秒，記憶體限制 500 MB
input_format: 一行由 0、1、2、3 組成的字串，依前序順序描述每個寶藏節點的孩子種類。
output_format: 輸出一個整數，表示最短週期的指令數。
samples:
  - input: '1313000'
    output: '3'
    explanation: 官方範例可使用週期 LRU；重複後能採完七個節點的寶藏。
  - input: '333003003300300'
    output: '15'
    explanation: 此樹共有十五個寶藏節點；最佳週期長度為 15。
core_knowledge:
  - 週期結束位置可表示成一條由 L、R 組成的相對下降路徑
  - 沿週期端點形成的巢狀子樹可分層，再把各層平移回同一根合併
  - 樹上開放巡訪的最短長度等於兩倍邊數減去起終點距離
judgment: 只輸出最短週期長度；週期可經過沒有寶藏的節點，但任何一次執行都不得越過無限樹的總根。
hints:
  - 最佳週期不必回到根；枚舉第一輪結束於哪個非根寶藏節點，其根到節點路徑就是每輪的相對位移 p。
  - 從 root 反覆套用 p 得到 x_0、x_1、…；把 x_i 子樹扣掉 x_(i+1) 子樹後的部分平移至共同根並取聯集，這正是一輪必須巡訪的形狀。
  - 若合併樹有 S 個節點且 p 長 d，一輪從根巡完它並停在 p，只需讓非 p 路徑的邊來回、p 路徑的邊只走一次，長度為 2(S-1)-d。
solution_outline: >-
  先由前序編碼建出左右孩子、父節點與方向。對每個非根節點反向追父指標，取得根到該點的方向序列 p。
  令 current 為根，反覆算 next=follow(current,p)。將 current 子樹合併到一棵相對座標樹，但走到 next 時只保留
  該邊界節點、不再合併其後代；接著令 current=next，直到 next 不在寶藏樹。各次被略過的子樹由下一層接手，
  因而一次候選的總走訪量為 O(n)。設合併樹大小為 S，以 2(S-1)-|p| 更新答案。
proof_or_invariant: >-
  固定一個週期，其第一輪由總根出發且不能向根上方走，所以整輪軌跡是一棵以根為起點的有限連通形狀，
  終點必是某條下降路徑 p。若終點仍為根，改成巡完後停在任一非根寶藏可少走至少一條回程邊，
  因此最優解可在枚舉的非根終點中取得。之後每輪在無限滿二元樹中的動作完全相同，只是起點依序為
  x_0=root、x_(i+1)=follow(x_i,p)。這些 x_i 的寶藏子樹彼此巢狀；「x_i 子樹保留 x_(i+1)
  邊界但刪去其後代」恰把全部寶藏分成不重疊的層。把每層相對於 x_i 平移回共同根後取聯集 M，
  任一可行週期都必須造訪 M 的每個位置，反之造訪 M 會在各輪覆蓋相應層，故條件充要。
  M 是含根與 p 的樹。從根出發、遍歷 M 並停在 p 時，不在根到 p 路徑上的每條邊都必須去而復返，
  該路徑上的每條邊至少走一次且可不回頭，所以最短長度正是 2(|M|-1)-|p|；深度優先走訪可達此下界。
  枚舉所有非根終點後必含最佳 p。每個 p 的巢狀分層總共只展開 O(n) 個原樹節點，故總時間 O(n^2)。
common_errors:
  - 只計算一次 DFS 巡訪，忽略同一週期在不同下降起點會覆蓋不同寶藏層
  - 合併一層時把 next 邊界節點也刪掉，導致合併樹缺少終點路徑
  - 將候選寫成 2(S-1)，忘記根到 p 的 d 條邊不用回程
  - 用字串位置直接當父子關係，未依 1、2、3 的孩子數遞迴解析前序編碼
complexity:
  time: O(n^2)
  space: O(n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct TreeNode {
      array<int, 2> child{0, 0};
      int parent = 0;
      int direction = -1;
  };

  struct MergedNode {
      array<int, 2> child{0, 0};
  };

  static int parse_tree(const string& encoding, int& position, int parent, int direction,
                        vector<TreeNode>& tree) {
      const int node = static_cast<int>(tree.size());
      tree.push_back({{0, 0}, parent, direction});
      const char type = encoding[position++];
      if (type == '1' || type == '3') {
          tree[node].child[0] = parse_tree(encoding, position, node, 0, tree);
      }
      if (type == '2' || type == '3') {
          tree[node].child[1] = parse_tree(encoding, position, node, 1, tree);
      }
      return node;
  }

  static int solve_candidate(const vector<TreeNode>& tree, const vector<int>& path) {
      // TODO：沿 path 形成的巢狀端點逐層合併相對形狀，回傳 2(S-1)-|path|。
      (void)tree;
      (void)path;
      return numeric_limits<int>::max();
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string encoding;
      cin >> encoding;
      vector<TreeNode> tree(1);
      int position = 0;
      parse_tree(encoding, position, 0, -1, tree);
      int answer = numeric_limits<int>::max();
      for (int endpoint = 2; endpoint < static_cast<int>(tree.size()); ++endpoint) {
          vector<int> path;
          for (int node = endpoint; tree[node].parent != 0; node = tree[node].parent) {
              path.push_back(tree[node].direction);
          }
          reverse(path.begin(), path.end());
          answer = min(answer, solve_candidate(tree, path));
      }
      cout << answer << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct TreeNode {
      array<int, 2> child{0, 0};
      int parent = 0;
      int direction = -1;
  };

  struct MergedNode {
      array<int, 2> child{0, 0};
  };

  static int parse_tree(const string& encoding, int& position, int parent, int direction,
                        vector<TreeNode>& tree) {
      const int node = static_cast<int>(tree.size());
      tree.push_back({{0, 0}, parent, direction});
      const char type = encoding[position++];
      if (type == '1' || type == '3') {
          tree[node].child[0] = parse_tree(encoding, position, node, 0, tree);
      }
      if (type == '2' || type == '3') {
          tree[node].child[1] = parse_tree(encoding, position, node, 1, tree);
      }
      return node;
  }

  static int follow_path(const vector<TreeNode>& tree, int start, const vector<int>& path) {
      int node = start;
      for (int direction : path) {
          node = tree[node].child[direction];
          if (node == 0) { return 0; }
      }
      return node;
  }

  static void merge_layer(const vector<TreeNode>& tree, int source, int stop,
                          int merged_node, vector<MergedNode>& merged) {
      if (source == stop) { return; }
      for (int direction = 0; direction < 2; ++direction) {
          const int source_child = tree[source].child[direction];
          if (source_child == 0) { continue; }
          int merged_child = merged[merged_node].child[direction];
          if (merged_child == 0) {
              merged_child = static_cast<int>(merged.size());
              merged.push_back({});
              merged[merged_node].child[direction] = merged_child;
          }
          merge_layer(tree, source_child, stop, merged_child, merged);
      }
  }

  static int solve_candidate(const vector<TreeNode>& tree, const vector<int>& path) {
      vector<MergedNode> merged(1);
      int current = 1;
      while (current != 0) {
          const int next = follow_path(tree, current, path);
          merge_layer(tree, current, next, 0, merged);
          current = next;
      }
      const int node_count = static_cast<int>(merged.size());
      return 2 * (node_count - 1) - static_cast<int>(path.size());
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      string encoding;
      cin >> encoding;
      vector<TreeNode> tree(1);
      int position = 0;
      parse_tree(encoding, position, 0, -1, tree);

      int answer = numeric_limits<int>::max();
      for (int endpoint = 2; endpoint < static_cast<int>(tree.size()); ++endpoint) {
          vector<int> path;
          for (int node = endpoint; tree[node].parent != 0; node = tree[node].parent) {
              path.push_back(tree[node].direction);
          }
          reverse(path.begin(), path.end());
          answer = min(answer, solve_candidate(tree, path));
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P5597
external_platform: 洛谷
external_problem_id: P5597
external_title: '【XR-4】復讀'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

週期的難點不在「走完整棵樹」，而在辨認同一段相對軌跡重播後，會把哪些巢狀子樹層疊到一起。
