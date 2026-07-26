---
id: luogu-p5018
volume: upper
source_file: upper-volume
title: 洛谷 P5018 對稱二叉樹
chapter: 1
section: '1.4'
kind: external-oj
difficulty: 3
topics: [binary-tree, tree-hashing, symmetry, postorder]
prerequisites: [tree-traversal, hashing]
statement: >-
  給定一棵以 1 為根、每個節點有整數權值的二元樹。若把某棵子樹中所有節點的左右孩子交換後，
  樹形與對應權值仍和原子樹完全一致，就稱它對稱。請找出節點數最多的對稱子樹。
constraints:
  - 1 <= n <= 10^6
  - 1 <= v_i <= 1000
  - 節點編號為 1..n，根為 1；缺少的孩子以 -1 表示
  - 時間限制 1 秒，洛谷頁面列示記憶體限制 125 MB
input_format: 第一行 n；第二行 n 個節點權值；接著 n 行依編號給各節點的左、右孩子編號。
output_format: 輸出最大對稱子樹的節點數。
samples:
  - input: |
      10
      2 2 5 5 5 5 4 4 2 3
      9 10
      -1 -1
      -1 -1
      -1 -1
      -1 -1
      -1 2
      3 4
      5 6
      -1 -1
      7 8
    output: '3'
    explanation: 以節點 7 為根的三節點子樹，其兩個葉子的權值同為 5，交換左右後不變。
core_knowledge: [鏡像遞迴定義, 子樹規範化編號, 迭代後序]
judgment: 單一節點必為對稱；比較時樹形與每個鏡像位置的權值都必須相同。
hints:
  - 為每棵子樹同時計算「原方向」與「完全鏡像」兩種描述。
  - 一個描述可由三元組（根權值、左描述編號、右描述編號）唯一規範化成整數編號。
  - 後序處理後，若某節點的原方向編號等於鏡像編號，整棵子樹即對稱；用子樹大小更新答案。
solution_outline: >-
  先迭代取得根可達節點順序，再反向處理。以同一張雜湊表為三元組分配規範化 ID；
  normal[u]=(value,normal[left],normal[right])，mirror[u]=(value,mirror[right],mirror[left])。
  兩 ID 相等即表示逐點帶權鏡像相同，同時計算子樹大小並取最大值。
proof_or_invariant: >-
  規範化函式讓且僅讓三元組完全相同者取得同一 ID。依後序歸納，normal ID 唯一表示原子樹的帶權有序結構，
  mirror ID 唯一表示交換所有左右孩子後的結構；故二者相等恰好等價於題目定義的對稱。每個節點都檢查一次，因此最大值不會遺漏。
common_errors:
  - 只比較左右子樹大小或根孩子權值
  - 對每個候選根重新鏡像 DFS，最壞會退化成平方時間
  - n 可達一百萬仍使用深遞迴而爆堆疊
complexity:
  time: 預期 O(n)，雜湊表操作採平均常數時間
  space: O(n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Key {
      int value, left_id, right_id;
      bool operator==(const Key& other) const {
          return value == other.value && left_id == other.left_id && right_id == other.right_id;
      }
  };

  class Interner {
    public:
      explicit Interner(int maximum_keys) {
          size_t capacity = 1;
          while (capacity < static_cast<size_t>(maximum_keys) * 2) { capacity <<= 1; }
          table_.resize(capacity);
          ids_.resize(capacity);
          mask_ = capacity - 1;
      }

      int intern(const Key& key) {
          // TODO：以開放定址尋找 key；完整三元組相同才可共用 ID。
          return 0;
      }

    private:
      vector<Key> table_;
      vector<int> ids_;
      size_t mask_ = 0;
      int next_id_ = 0;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<int> value(n + 1), left_child(n + 1), right_child(n + 1);
      for (int i = 1; i <= n; ++i) { cin >> value[i]; }
      for (int i = 1; i <= n; ++i) { cin >> left_child[i] >> right_child[i]; }
      // TODO：建立迭代後序，規範化原樹與鏡像樹，更新最大對稱子樹大小。
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Key {
      int value, left_id, right_id;
      bool operator==(const Key& other) const {
          return value == other.value && left_id == other.left_id && right_id == other.right_id;
      }
  };

  class Interner {
    public:
      explicit Interner(int maximum_keys) {
          size_t capacity = 1;
          while (capacity < static_cast<size_t>(maximum_keys) * 2) { capacity <<= 1; }
          table_.resize(capacity);
          ids_.resize(capacity);
          mask_ = capacity - 1;
      }

      int intern(const Key& key) {
          size_t slot = hash_key(key) & mask_;
          while (table_[slot].value != 0) {
              if (table_[slot] == key) { return ids_[slot]; }
              slot = (slot + 1) & mask_;
          }
          table_[slot] = key;
          ids_[slot] = ++next_id_;
          return ids_[slot];
      }

    private:
      static uint64_t hash_key(const Key& key) {
          uint64_t result = static_cast<uint32_t>(key.value);
          result = (result ^ static_cast<uint32_t>(key.left_id)) * 0x9e3779b185ebca87ULL;
          result = (result ^ static_cast<uint32_t>(key.right_id)) * 0xc2b2ae3d27d4eb4fULL;
          return result ^ (result >> 29);
      }

      vector<Key> table_;
      vector<int> ids_;
      size_t mask_ = 0;
      int next_id_ = 0;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<int> value(n + 1), left_child(n + 1), right_child(n + 1);
      for (int i = 1; i <= n; ++i) { cin >> value[i]; }
      for (int i = 1; i <= n; ++i) { cin >> left_child[i] >> right_child[i]; }

      vector<int> order;
      order.reserve(n);
      order.push_back(1);
      for (size_t i = 0; i < order.size(); ++i) {
          const int node = order[i];
          if (left_child[node] != -1) { order.push_back(left_child[node]); }
          if (right_child[node] != -1) { order.push_back(right_child[node]); }
      }

      vector<int> normal_id(n + 1), mirror_id(n + 1), subtree_size(n + 1);
      Interner interner(2 * n);

      int answer = 1;
      for (auto it = order.rbegin(); it != order.rend(); ++it) {
          const int node = *it;
          const int left = left_child[node] == -1 ? 0 : left_child[node];
          const int right = right_child[node] == -1 ? 0 : right_child[node];
          subtree_size[node] = 1 + subtree_size[left] + subtree_size[right];
          normal_id[node] = interner.intern({value[node], normal_id[left], normal_id[right]});
          mirror_id[node] = interner.intern({value[node], mirror_id[right], mirror_id[left]});
          if (normal_id[node] == mirror_id[node]) {
              answer = max(answer, subtree_size[node]);
          }
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P5018
external_platform: 洛谷
external_problem_id: P5018
external_title: '[NOIP 2018 普及組] 對稱二叉樹'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

規範化 ID 是精確的結構駐留，不是可能碰撞後直接視為相同的單一數值雜湊。
