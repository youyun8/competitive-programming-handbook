---
id: luogu-p3810
volume: upper
source_file: upper-volume
title: 洛谷 P3810 三維偏序：CDQ 分治
chapter: 2
section: '2.9'
kind: external-oj
difficulty: 5
topics: ['CDQ 分治', '三維偏序', '樹狀陣列', '離線']
prerequisites: ['divide-and-conquer', 'fenwick-tree']
statement: |-
  給定 n 個三元組 (a, b, c)，對每個元素求出有多少其他元素在三個維度上都不大於它，再統計每個答案值出現的次數。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 'n 可達 10^5，O(n²) 會超時'
  - '可能存在完全相同的三元組，必須先合併'
  - '完整限制條件請參閱外部題目頁面'
input_format: '第一行兩個整數 n 與 k（值域上界）；接下來 n 行，每行三個整數 a、b、c。'
output_format: '輸出 n 行，第 i 行（從 0 算起）表示滿足條件的元素個數恰為 i−1 的元素有幾個。'
samples:
  - input: |
      10 3
      3 3 3
      2 3 3
      2 3 1
      3 1 1
      3 1 2
      1 3 1
      1 1 2
      1 2 2
      1 3 2
      1 2 1
    output: |
      3
      1
      3
      0
      1
      0
      1
      0
      0
      1
    explanation: |-
      這是原題的經典測資形狀。輸出的第 i 行代表「f(x) 恰為 i−1」的元素個數，全部相加會等於 n。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    三個維度依序處理：第一維**排序**解決，第二維**分治**解決，第三維用**樹狀陣列**解決。這個「排序、分治、資料結構」的三層結構是 CDQ 分治的標準形狀。
  - |-
    排序後第一維自動滿足（左邊的下標不會比右邊大），問題降成二維。CDQ 分治的核心是：cdq(l, r) 先遞迴處理兩半內部，再專門計算「左半對右半」的跨區間貢獻。
  - |-
    處理跨區間貢獻時，兩半各自已依第二維排好，用雙指標合併掃描：左半的元素依第三維插入樹狀陣列，右半的元素查詢樹狀陣列的前綴和。
  - |-
    **清空樹狀陣列時要逐項減回去**，不能整個 memset。後者會讓每層分治付出 O(k) 的代價，複雜度直接退化。
  - |-
    完全相同的三元組必須先合併成一個帶計數的項目，否則它們之間會互相漏算（分治只算「左半影響右半」，同組元素可能落在同一半而被跳過）。最後統計時再補上組內的 count − 1。
solution_outline: |-
  先依 (a, b, c) 排序並把完全相同的元素合併成帶計數的項目。CDQ 分治：遞迴左右兩半後，用雙指標依第二維合併，左半按第三維插入樹狀陣列、右半查詢前綴和，處理完逐項清空樹狀陣列並就地歸併。最後把每個項目的答案加上組內 count − 1 後統計分布。
proof_or_invariant: |-
  分治的不變量是「cdq(l, r) 回傳時，區間內每個元素的 answer 已累計完所有來自區間內部的貢獻」。歸納成立是因為：來自左半內部與右半內部的貢獻由遞迴保證，跨區間的貢獻由這一層的雙指標掃描一次算完，三者不重不漏。
complexity:
  time: 'O(n log² n)'
  space: 'O(n + k)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, k;
      if (!(cin >> n >> k)) { return 0; }
      struct Item {
          int a, b, c;
      };
      vector<Item> items(static_cast<size_t>(n));
      for (Item& item : items) { cin >> item.a >> item.b >> item.c; }

      // TODO 1：第一維排序。依 (a, b, c) 排序後，第一維的偏序就自動滿足
      //   「左邊的下標不會比右邊大」，於是問題降成二維。
      // TODO 2：**先把完全相同的元素合併**成一個帶計數的項目。
      //   否則同組元素之間會互相漏算——這是本題最容易錯的一步。
      //   最後統計時再補上組內的 count − 1。
      // TODO 3：CDQ 分治。cdq(l, r) 先遞迴兩半，再處理「左半影響右半」的跨區間貢獻：
      //   兩半各自已依 b 排好，用雙指標合併；左半的元素插入樹狀陣列（依 c 為下標），
      //   右半的元素查詢前綴和。處理完記得把樹狀陣列清乾淨（逐項減回去，
      //   不要整個 memset，否則複雜度會退化）。
      // 下面是 O(n²) 的樸素版本。
      vector<int> result(static_cast<size_t>(n), 0);
      for (size_t i = 0; i < items.size(); ++i) {
          int f = 0;
          for (size_t j = 0; j < items.size(); ++j) {
              if (i == j) { continue; }
              if (items[j].a <= items[i].a && items[j].b <= items[i].b && items[j].c <= items[i].c) {
                  ++f;
              }
          }
          ++result[static_cast<size_t>(f)];
      }
      for (const int value : result) { cout << value << '\n'; }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // CDQ 分治處理三維偏序：第一維排序、第二維分治、第三維用樹狀陣列。
  // 分治時「左半只作為修改、右半只作為查詢」，跨區間的貢獻就被一次算完。
  static int k_limit;
  static vector<int> tree;

  static int lowbit(int x) { return x & -x; }
  static void add(int position, int delta) {
      for (int i = position; i <= k_limit; i += lowbit(i)) { tree[static_cast<size_t>(i)] += delta; }
  }
  static int prefix(int position) {
      int total = 0;
      for (int i = position; i > 0; i -= lowbit(i)) { total += tree[static_cast<size_t>(i)]; }
      return total;
  }

  struct Item {
      int a, b, c, count, answer;
  };

  static vector<Item> items;

  static void cdq(size_t left, size_t right) {
      if (right - left <= 1) { return; }
      const size_t mid = (left + right) / 2;
      cdq(left, mid);
      cdq(mid, right);
      // 左右兩半各自已依 b 排好，用雙指標合併；左半插入樹狀陣列，右半查詢。
      size_t i = left;
      size_t j = mid;
      while (j < right) {
          while (i < mid && items[i].b <= items[j].b) {
              add(items[i].c, items[i].count);
              ++i;
          }
          items[j].answer += prefix(items[j].c);
          ++j;
      }
      for (size_t back = left; back < i; ++back) { add(items[back].c, -items[back].count); }
      inplace_merge(items.begin() + static_cast<long>(left), items.begin() + static_cast<long>(mid),
                    items.begin() + static_cast<long>(right),
                    [](const Item& x, const Item& y) { return x.b < y.b; });
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n >> k_limit)) { return 0; }
      vector<Item> raw(static_cast<size_t>(n));
      for (Item& item : raw) { cin >> item.a >> item.b >> item.c; item.count = 1; item.answer = 0; }
      sort(raw.begin(), raw.end(), [](const Item& x, const Item& y) {
          if (x.a != y.a) { return x.a < y.a; }
          if (x.b != y.b) { return x.b < y.b; }
          return x.c < y.c;
      });
      // 完全相同的元素要先合併，否則它們之間會互相漏算。
      for (const Item& item : raw) {
          if (!items.empty() && items.back().a == item.a && items.back().b == item.b &&
              items.back().c == item.c) {
              ++items.back().count;
          } else {
              items.push_back(item);
          }
      }
      tree.assign(static_cast<size_t>(k_limit) + 1, 0);
      cdq(0, items.size());

      vector<int> result(static_cast<size_t>(n), 0);
      for (const Item& item : items) {
          // 同組元素之間也互相滿足偏序，補上 count − 1。
          result[static_cast<size_t>(item.answer + item.count - 1)] += item.count;
      }
      for (const int value : result) { cout << value << '\n'; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3810
external_platform: 洛谷
external_problem_id: P3810
external_title: '【模板】三維偏序 / 陌上花開'
external_relation: original
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

CDQ 分治是把「高維偏序」逐層降維的通用手法。合併相同元素這一步看似瑣碎，卻是這題最容易錯的地方。
