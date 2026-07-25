---
id: luogu-p3834
volume: upper
source_file: upper-volume
title: 洛谷 P3834 主席樹：靜態區間第 k 小
chapter: 4
section: '4.4'
kind: external-oj
difficulty: 4
topics: ['主席樹', '可持久化線段樹', '權值線段樹', '前綴和']
prerequisites: ['persistent-segment-tree']
statement: |-
  給定一個靜態序列與若干查詢，每次求區間 [l, r] 內第 k 小的數。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '序列靜態不修改'
  - 'n 與查詢數都很大，需要單次 O(log n)'
  - '數值範圍大，需要離散化'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 m；第二行 n 個整數；接下來 m 行，每行三個整數 l、r、k。'
output_format: '每個查詢輸出一行，表示區間內第 k 小的數。'
samples:
  - input: |
      5 5
      25957 6405 15770 26287 26465
      2 2 1
      3 4 1
      4 5 1
      1 2 2
      4 4 1
    output: |
      6405
      15770
      26287
      25957
      26287
    explanation: |-
      第四個查詢是區間 [1,2] 的第 2 小，也就是 6405 與 25957 中較大的 25957。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    先想一個更簡單的問題：若只有一個固定的前綴 [1, r]，用**權值線段樹**（下標是離散化後的數值、節點存計數）就能在 O(log n) 內二分找第 k 小。
  - |-
    關鍵一步：對每個前綴 [1, i] 各建一棵權值線段樹。但相鄰兩棵只差一個數，正好可以用可持久化的路徑複製，總空間 O(n log n)。
  - |-
    區間 [l, r] 的權值分布 = 第 r 棵樹「減去」第 l−1 棵樹。因為線段樹的計數可加減，兩棵樹**同步往下走**、相減就得到區間的計數。
  - |-
    二分過程：算出左子樹的計數差 c。若 k <= c 就往左走，否則往右走並令 k -= c。走到葉子時的下標就是答案（記得反查離散化前的原值）。
  - |-
    兩棵樹一定要同步移動——只走其中一棵是最常見的錯誤。另外離散化後下標從 1 開始，別讓權值線段樹的區間出現 0。
solution_outline: |-
  離散化數值後，對每個前綴用可持久化插入建出權值線段樹，第 i 棵由第 i−1 棵路徑複製而來。查詢時把第 l−1 棵與第 r 棵一起往下走，用兩者的左子樹計數差決定往左或往右，走到葉即為第 k 小的離散下標，再反查原值。
proof_or_invariant: |-
  不變量是「第 i 棵樹的每個節點的計數，等於前綴 [1, i] 中落在該節點值域內的元素個數」。因為計數對前綴可加減，兩棵樹逐節點相減後恰為區間 [l, r] 的權值分布，於是在其上二分即可求第 k 小。
complexity:
  time: '建樹 O(n log n)，單次查詢 O(log n)'
  space: 'O(n log n)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }

      // TODO 1：離散化數值，讓權值線段樹的下標有界。
      // TODO 2：對每個前綴各建一棵權值線段樹——但相鄰兩棵只差一條路徑，
      //   所以用可持久化的方式插入，總空間 O(n log n)。
      // TODO 3：查詢第 k 小。第 r 棵樹減去第 l−1 棵樹，得到的就是區間 [l, r]
      //   的權值分布；在這個「差」上二分：左子樹的計數差若 >= k 就往左走，
      //   否則往右走並把 k 扣掉左邊的計數。單次 O(log n)。
      //   注意兩棵樹要**同步下移**，不能只走其中一棵。
      // 下面是每次都排序的樸素版本。
      for (int i = 0; i < m; ++i) {
          int l, r, k;
          cin >> l >> r >> k;
          vector<int> window(a.begin() + l, a.begin() + r + 1);
          nth_element(window.begin(), window.begin() + (k - 1), window.end());
          cout << window[static_cast<size_t>(k - 1)] << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 主席樹（可持久化權值線段樹）：對每個前綴各建一棵權值線段樹，
  // 第 i 棵與第 i−1 棵只差一條路徑。兩棵相減就得到區間 [l, r] 的權值分布，
  // 於是可以在樹上二分找第 k 小。
  struct PersistentCountTree {
      struct Node {
          int left = 0, right = 0, count = 0;
      };
      vector<Node> nodes{Node{}};

      int insert(int previous, int l, int r, int position) {
          const int id = static_cast<int>(nodes.size());
          nodes.push_back(nodes[static_cast<size_t>(previous)]);
          ++nodes[static_cast<size_t>(id)].count;
          if (l == r) { return id; }
          const int mid = (l + r) / 2;
          if (position <= mid) {
              const int child = insert(nodes[static_cast<size_t>(previous)].left, l, mid, position);
              nodes[static_cast<size_t>(id)].left = child;
          } else {
              const int child = insert(nodes[static_cast<size_t>(previous)].right, mid + 1, r, position);
              nodes[static_cast<size_t>(id)].right = child;
          }
          return id;
      }

      int kth(int older, int newer, int l, int r, int k) const {
          if (l == r) { return l; }
          const int left_count = nodes[static_cast<size_t>(nodes[static_cast<size_t>(newer)].left)].count -
                                 nodes[static_cast<size_t>(nodes[static_cast<size_t>(older)].left)].count;
          const int mid = (l + r) / 2;
          if (k <= left_count) {
              return kth(nodes[static_cast<size_t>(older)].left, nodes[static_cast<size_t>(newer)].left, l, mid, k);
          }
          return kth(nodes[static_cast<size_t>(older)].right, nodes[static_cast<size_t>(newer)].right,
                     mid + 1, r, k - left_count);
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      vector<int> sorted_values(a.begin() + 1, a.end());
      sort(sorted_values.begin(), sorted_values.end());
      sorted_values.erase(unique(sorted_values.begin(), sorted_values.end()), sorted_values.end());
      const int values = static_cast<int>(sorted_values.size());

      PersistentCountTree tree;
      vector<int> root(static_cast<size_t>(n) + 1, 0);
      for (int i = 1; i <= n; ++i) {
          const int index = static_cast<int>(
              lower_bound(sorted_values.begin(), sorted_values.end(), a[static_cast<size_t>(i)]) -
              sorted_values.begin()) + 1;
          root[static_cast<size_t>(i)] = tree.insert(root[static_cast<size_t>(i - 1)], 1, values, index);
      }
      for (int i = 0; i < m; ++i) {
          int l, r, k;
          cin >> l >> r >> k;
          const int index = tree.kth(root[static_cast<size_t>(l - 1)], root[static_cast<size_t>(r)], 1, values, k);
          cout << sorted_values[static_cast<size_t>(index - 1)] << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3834
external_platform: 洛谷
external_problem_id: P3834
external_title: '【模板】可持久化線段樹 2'
external_relation: original
source_book_pages: [179, 196]
source_pdf_pages: [197, 214]
review_status: verified
---

主席樹＝可持久化 ＋ 權值線段樹 ＋ 前綴相減。三個想法各自簡單，組合起來威力極大。
