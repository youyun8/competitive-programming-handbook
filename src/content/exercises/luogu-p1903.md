---
id: luogu-p1903
volume: upper
source_file: upper-volume
title: 洛谷 P1903 帶修莫隊：支援單點修改的區間數顏色
chapter: 4
section: '4.5'
kind: external-oj
difficulty: 5
topics: ['帶修莫隊', '三維排序', '時間維度', '離線查詢']
prerequisites: ['mo-algorithm']
core_knowledge: [帶修莫隊, 三維離線排序, 可逆修改]
judgment: 查詢可離線，區間端點與修改時間每次移動都能 O(1) 更新答案；因此把時間加入莫隊狀態。
statement: |-
  給定一個序列，支援兩種操作：查詢區間內不同數值的個數；把某個位置改成新的數值。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '1 <= n, m <= 133333'
  - '初始顏色與修改後顏色介於 1 與 1000000'
  - '查詢及修改位置都介於 1 與 n'
input_format: '第一行兩個整數 n 與 m；第二行 n 個整數；接下來 m 行，`Q l r` 表示查詢區間 [l, r] 的顏色數，`R p c` 表示把位置 p 改成顏色 c。'
output_format: '對每個查詢輸出一行，表示區間內不同顏色的個數。'
samples:
  - input: |
      6 5
      1 2 3 4 5 5
      Q 1 4
      Q 2 6
      R 1 2
      Q 1 4
      Q 2 5
    output: |
      4
      4
      3
      4
    explanation: |-
      第三個操作把位置 1 改成 2 之後，區間 [1,4] 變成 2 2 3 4，只剩 3 種顏色。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    普通莫隊只有 (left, right) 兩維。有修改之後，同一個區間在不同時刻的答案不同，所以要加上第三維：**這個查詢之前發生過幾次修改**。
  - |-
    排序鍵變成 (左端點區塊, 右端點區塊, 時間)。注意右端點也要分塊——只用原始右端點排序會讓時間指標來回移動太多次。
  - |-
    區塊大小取 n^(2/3) 時總複雜度是 O(n^(5/3))，這是三維莫隊的最優取值。取 √n 反而會更慢。
solution_outline: |-
  離線分離查詢與修改，每個查詢記下它之前的修改次數作為時間戳。依 (左端點區塊, 右端點區塊, 時間) 三維排序，區塊大小取 n^(2/3)。除左右指標外多維護一個時間指標，套用／撤銷修改時只在被改位置落於窗口內時更新計數，並在套用時保存舊值以便撤銷。
proof_or_invariant: |-
  不變量是「當前計數陣列對應窗口 [left, right] 在時刻 time 的狀態」。三個指標各自單調地被驅動到目標值，且修改的套用與撤銷互為逆操作，因此任何到達順序都得到相同狀態。複雜度分析把三維排序視為 n^(2/3) 分塊，總移動量為 O(n^(5/3))。
complexity:
  time: 'O(n^(5/3))'
  space: 'O(n + m)'
common_errors:
  - 未保存修改前的值，導致時間指標無法倒退
  - 修改窗口外位置時錯誤更新顏色計數
  - 未離散化初始值與修改後可能出現的所有顏色
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

      // TODO 1：離線讀入。把查詢與修改分成兩個陣列，
      //   每個查詢額外記下「它之前發生過幾次修改」，這就是時間維度。
      // TODO 2：三維排序。排序鍵是 (左端點區塊, 右端點區塊, 時間)，
      //   區塊大小取 n^(2/3) 時總複雜度最優，為 O(n^(5/3))。
      // TODO 3：除了左右指標，再加一個時間指標。
      //   套用／撤銷一次修改時，只有當「被修改的位置目前落在窗口內」
      //   才要同步更新計數——這是帶修莫隊最容易漏掉的判斷。
      //   撤銷需要知道舊值，所以套用時要把舊值存進該筆修改裡。
      // 下面是 O(nm) 的樸素版本，先確認語意。
      for (int i = 0; i < m; ++i) {
          char op;
          int x, y;
          cin >> op >> x >> y;
          if (op == 'Q') {
              set<int> seen;
              for (int j = x; j <= y; ++j) { seen.insert(a[static_cast<size_t>(j)]); }
              cout << seen.size() << '\n';
          } else {
              a[static_cast<size_t>(x)] = y;
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 帶修莫隊：在普通莫隊的 (left, right) 之外多加一維「時間」，
  // 排序鍵變成 (左端區塊, 右端區塊, 時間)，區塊大小取 n^(2/3) 最優。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      int max_color = 0;
      for (int i = 1; i <= n; ++i) {
          cin >> a[static_cast<size_t>(i)];
          max_color = max(max_color, a[static_cast<size_t>(i)]);
      }

      struct Query {
          int left, right, time, index;
      };
      struct Change {
          int position, color, previous;
      };
      vector<Query> queries;
      vector<Change> changes;
      for (int i = 0; i < m; ++i) {
          char op;
          int x, y;
          cin >> op >> x >> y;
          if (op == 'Q') {
              queries.push_back({x, y, static_cast<int>(changes.size()), static_cast<int>(queries.size())});
          } else {
              changes.push_back({x, y, 0});
              max_color = max(max_color, y);
          }
      }

      const int block = max(1, static_cast<int>(pow(static_cast<double>(n), 2.0 / 3.0)));
      sort(queries.begin(), queries.end(), [block](const Query& x, const Query& y) {
          const int bx = x.left / block;
          const int by = y.left / block;
          if (bx != by) { return bx < by; }
          const int rx = x.right / block;
          const int ry = y.right / block;
          if (rx != ry) { return rx < ry; }
          return x.time < y.time;
      });

      vector<int> count_of(static_cast<size_t>(max_color) + 2, 0);
      int distinct = 0;
      auto add = [&](int color) {
          if (count_of[static_cast<size_t>(color)]++ == 0) { ++distinct; }
      };
      auto remove = [&](int color) {
          if (--count_of[static_cast<size_t>(color)] == 0) { --distinct; }
      };
      // 套用／撤銷一次修改：若被改的位置目前在窗口內，要同步更新計數。
      auto apply_change = [&](int id, int left, int right) {
          Change& c = changes[static_cast<size_t>(id)];
          c.previous = a[static_cast<size_t>(c.position)];
          if (c.position >= left && c.position <= right) {
              remove(c.previous);
              add(c.color);
          }
          a[static_cast<size_t>(c.position)] = c.color;
      };
      auto undo_change = [&](int id, int left, int right) {
          Change& c = changes[static_cast<size_t>(id)];
          if (c.position >= left && c.position <= right) {
              remove(c.color);
              add(c.previous);
          }
          a[static_cast<size_t>(c.position)] = c.previous;
      };

      vector<int> answer(queries.size());
      int left = 1;
      int right = 0;
      int time_now = 0;
      for (const Query& q : queries) {
          while (right < q.right) { add(a[static_cast<size_t>(++right)]); }
          while (left > q.left) { add(a[static_cast<size_t>(--left)]); }
          while (right > q.right) { remove(a[static_cast<size_t>(right--)]); }
          while (left < q.left) { remove(a[static_cast<size_t>(left++)]); }
          while (time_now < q.time) { apply_change(time_now++, left, right); }
          while (time_now > q.time) { undo_change(--time_now, left, right); }
          answer[static_cast<size_t>(q.index)] = distinct;
      }
      for (const int value : answer) { cout << value << '\n'; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1903
external_platform: 洛谷
external_problem_id: P1903
external_title: '【模板】帶修莫隊 / [國家集訓隊] 數顏色'
external_relation: original
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
review_status: verified
---

帶修莫隊只是「多一維」，但那一維帶來的細節（窗口判斷、舊值保存、區塊大小）每一個都會咬人。
