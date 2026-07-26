---
id: luogu-p4097
volume: upper
source_file: upper-volume
title: 洛谷 P4097 李超線段樹：線段最值查詢
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 5
topics: &id001
  - 李超線段樹
  - 線段最值
  - 標記永久化
  - 強制在線
prerequisites:
  - segment-tree
statement: |-
  維護一組線段，支援插入一條線段、以及查詢在某個橫座標處縱座標最大的線段編號（平手取編號小者）。強制在線。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 橫座標範圍固定為 1..39989
  - 強制在線：參數需用上一次答案解碼
  - 沒有線段覆蓋該處時輸出 0
  - 完整限制條件請參閱外部題目頁面
input_format: 第一行一個整數 n；接下來 n 行，`0 k` 為查詢，`1 x0 y0 x1 y1` 為插入線段（參數皆需解碼）。
output_format: 對每個查詢輸出一行，表示縱座標最大的線段編號，無線段時輸出 0。
samples:
  - input: |
      6
      1 1 10 5 20
      1 3 3 7 30
      0 4
      0 6
      1 2 50 6 50
      0 5
    output: |
      1
      2
      3
    explanation: 注意所有參數都要先用上一次的答案解碼，所以輸入看到的數字不是真正的座標——這正是強制在線的用意。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - 每個李超樹節點保留在區間中點較優的直線。
  - 中點較差的直線只可能在其中一側翻盤，往該側遞迴。
  - 線段先拆到完整覆蓋節點；查詢沿根葉路徑比較，平手取小編號。
solution_outline: 對橫座標區間建線段樹，每個節點存一條優勢線段。插入線段時先做區間定位拆成 O(log n) 個節點，各自執行「與優勢線段比中點、較差者往可能翻盤的一半遞迴」。查詢時沿路徑對所有優勢線段求值取最大，平手取編號小者。
proof_or_invariant: 不變量是「對任意橫座標 x，最優線段必定出現在根到 x 所在葉的路徑上的某個節點的優勢線段中」。這由插入時的取捨保證：被換下的線段只在可能翻盤的那一半繼續下沉，因此它在自己真正佔優的區間裡一定留有紀錄。
complexity:
  time: 插入 O(log² n)，查詢 O(log n)
  space: O(n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static const int kRange = 39989;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }

      // TODO：李超線段樹。
      //   每個節點存一條「在該區間中點處最優」的線段。
      //   插入一條線段時，與節點上的線段比中點：把較優的留在節點，
      //   較差的那條**只可能在某一半翻盤**（兩條直線最多交一次），
      //   所以只往那一邊遞迴，單次插入 O(log n)。
      //   本題是「線段」而非整條直線，要先用區間定位拆成 O(log n) 個節點
      //   再各自插入，因此是 O(log² n)。
      //   查詢時沿根到葉，把路徑上所有線段在該點求值取最大；平手取編號小的。
      //   別忘了強制在線的解碼：x 對 39989 取模、y 對 10^9 取模，都要先加上 lastans。
      // 下面是「存下所有線段、查詢時逐條求值」的樸素版本。
      struct Segment {
          long long x0, y0, x1, y1;
      };
      vector<Segment> segments;
      long long last_answer = 0;
      for (int i = 0; i < n; ++i) {
          int op;
          cin >> op;
          if (op == 0) {
              long long k;
              cin >> k;
              const long long x = (k + last_answer - 1) % kRange + 1;
              int best = 0;
              double best_value = 0;
              for (size_t j = 0; j < segments.size(); ++j) {
                  const Segment& s = segments[j];
                  if (x < s.x0 || x > s.x1) { continue; }
                  const double value =
                      s.x0 == s.x1
                          ? static_cast<double>(max(s.y0, s.y1))
                          : static_cast<double>(s.y0) + static_cast<double>(s.y1 - s.y0) *
                                                            static_cast<double>(x - s.x0) /
                                                            static_cast<double>(s.x1 - s.x0);
                  if (best == 0 || value > best_value + 1e-9) {
                      best = static_cast<int>(j) + 1;
                      best_value = value;
                  }
              }
              last_answer = best;
              cout << best << '\n';
          } else {
              long long x0, y0, x1, y1;
              cin >> x0 >> y0 >> x1 >> y1;
              x0 = (x0 + last_answer - 1) % kRange + 1;
              x1 = (x1 + last_answer - 1) % kRange + 1;
              y0 = (y0 + last_answer - 1) % 1000000000 + 1;
              y1 = (y1 + last_answer - 1) % 1000000000 + 1;
              if (x0 > x1) { swap(x0, x1); swap(y0, y1); }
              segments.push_back({x0, y0, x1, y1});
          }
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 李超線段樹：每個節點存一條「在該區間中點處最優」的線段。
  // 插入時與節點上的線段比較，把「在中點較差」的那條往下遞迴——
  // 兩條直線最多交一次，所以較差的那條只可能在半邊翻盤。
  static const int kRange = 39989;
  static const double kEps = 1e-9;

  struct Segment {
      double slope = 0;
      double intercept = 0;
      int left = 0, right = 0;
  };

  static vector<Segment> segments{Segment{}};
  static vector<int> best_line;

  static double value_at(int id, int x) {
      if (id == 0) { return -1e18; }
      return segments[static_cast<size_t>(id)].slope * x + segments[static_cast<size_t>(id)].intercept;
  }

  // 比較兩條線段在 x 處的優劣；平手時取編號小的。
  static bool better(int candidate, int current, int x) {
      const double a = value_at(candidate, x);
      const double b = value_at(current, x);
      if (fabs(a - b) > kEps) { return a > b; }
      return candidate < current;
  }

  static void insert(size_t node, int l, int r, int id) {
      const int mid = (l + r) / 2;
      if (better(id, best_line[node], mid)) { swap(id, best_line[node]); }
      if (l == r || id == 0) { return; }
      // 只有可能在某一半翻盤的那邊需要繼續往下。
      if (better(id, best_line[node], l)) { insert(2 * node, l, mid, id); }
      if (better(id, best_line[node], r)) { insert(2 * node + 1, mid + 1, r, id); }
  }

  static void insert_range(size_t node, int l, int r, int ql, int qr, int id) {
      if (qr < l || r < ql) { return; }
      if (ql <= l && r <= qr) { insert(node, l, r, id); return; }
      const int mid = (l + r) / 2;
      insert_range(2 * node, l, mid, ql, qr, id);
      insert_range(2 * node + 1, mid + 1, r, ql, qr, id);
  }

  static int query(size_t node, int l, int r, int x) {
      int result = best_line[node];
      if (l == r) { return result; }
      const int mid = (l + r) / 2;
      const int child = x <= mid ? query(2 * node, l, mid, x) : query(2 * node + 1, mid + 1, r, x);
      if (better(child, result, x)) { result = child; }
      return result;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      best_line.assign(4 * (static_cast<size_t>(kRange) + 1), 0);
      long long last_answer = 0;
      for (int i = 0; i < n; ++i) {
          int op;
          cin >> op;
          if (op == 0) {
              long long k;
              cin >> k;
              const int x = static_cast<int>((k + last_answer - 1) % kRange + 1);
              last_answer = query(1, 1, kRange, x);
              cout << last_answer << '\n';
          } else {
              long long x0, y0, x1, y1;
              cin >> x0 >> y0 >> x1 >> y1;
              x0 = (x0 + last_answer - 1) % kRange + 1;
              x1 = (x1 + last_answer - 1) % kRange + 1;
              y0 = (y0 + last_answer - 1) % 1000000000 + 1;
              y1 = (y1 + last_answer - 1) % 1000000000 + 1;
              if (x0 > x1) { swap(x0, x1); swap(y0, y1); }
              Segment segment;
              segment.left = static_cast<int>(x0);
              segment.right = static_cast<int>(x1);
              if (x0 == x1) {
                  // 垂直線段退化成一個點，用常數函數表示該點的較大值。
                  segment.slope = 0;
                  segment.intercept = static_cast<double>(max(y0, y1));
              } else {
                  segment.slope = static_cast<double>(y1 - y0) / static_cast<double>(x1 - x0);
                  segment.intercept = static_cast<double>(y0) - segment.slope * static_cast<double>(x0);
              }
              segments.push_back(segment);
              insert_range(1, 1, kRange, static_cast<int>(x0), static_cast<int>(x1),
                           static_cast<int>(segments.size()) - 1);
          }
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4097
external_platform: 洛谷
external_problem_id: P4097
external_title: 【模板】李超線段樹 / [HEOI2013] Segment
external_relation: original
source_book_pages:
  - 151
  - 314
source_pdf_pages:
  - 169
  - 332
review_status: verified
core_knowledge: *id001
judgment: 對橫座標區間建線段樹，每個節點存一條優勢線段。插入線段時先做區間定位拆成 O(log n) 個節點，各自執行「與優勢線段比中點、較差者往可能翻盤的一半遞迴」。查詢時沿路徑對所有優勢線段求值取最大，平手取編號小者。
common_errors:
  - 端點或索引範圍處理錯誤
  - 懶標記或摘要合併順序顛倒
  - 使用不足以容納答案的整數型別
---

李超樹是「標記永久化」最漂亮的例子。想清楚「兩條直線最多交一次」這件事，整個演算法就自然了。
