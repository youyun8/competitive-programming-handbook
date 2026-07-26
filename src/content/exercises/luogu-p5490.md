---
id: luogu-p5490
volume: upper
source_file: upper-volume
title: 洛谷 P5490 掃描線：矩形面積並
chapter: 4
section: '4.3'
kind: external-oj
difficulty: 3
topics: &id001
  - 掃描線
  - 線段樹
  - 離散化
  - 矩形面積並
prerequisites:
  - segment-tree
  - discretization
  - scanline
statement: 給定 n 個座標軸對齊的矩形（各以左下角與右上角座標表示），求它們聯集的面積。本卡片的題意為本站依題目主題重新敘述； 完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - 座標範圍大、矩形個數多，必須離散化後用 O(n log n) 的掃描線
  - 面積可達 10^18 量級，累加要用 long long
  - 完整限制條件請參閱外部題目頁面
input_format: 第一行一個整數 n；接下來 n 行每行四個整數 x1 y1 x2 y2，表示矩形的左下角與右上角。
output_format: 一行一個整數，所有矩形聯集的面積。
samples:
  - input: |
      2
      0 0 2 2
      1 1 3 3
    output: |
      7
    explanation: 本站自製測資（本次工作環境無法連線原 OJ 取得官方範例）。兩個 2×2 正方形各佔 4， 重疊部分是 1×1，聯集為 4 + 4 − 1 = 7。
hints:
  - 每個矩形拆成進入與離開兩條掃描事件。
  - 葉節點代表相鄰離散 y 座標之間的區間，而非座標點。
  - 節點 cover>0 時取全長，否則取兩個子節點覆蓋長之和。
solution_outline:
  收集所有 y1、y2 排序去重成 ys，線段樹葉子數為 ys.size() - 1，葉子 i 代表區間 [ys[i], ys[i+1])。 每個矩形產生事件 (x1, lo, hi-1, +1) 與 (x2,
  lo, hi-1, -1)，其中 lo、hi 是 y1、y2 在 ys 中的位置； 跳過退化矩形。事件按 x 遞增排序後掃過：先 area += len[1] * (x_i − x_{i−1})，再套用事件更新。 更新時只在「查詢區間完整包含節點區間」時累加
  cover，回溯時依 cover 是否為正、是否為葉子重算 len。
proof_or_invariant:
  cover[u] 恰等於「以 u 為完整覆蓋單位」的矩形數，任一 y 座標點的覆蓋次數等於根到該葉路徑上所有 cover 之和。 len[u] 的正確性可歸納：cover[u] > 0 時整段被覆蓋故取全長；否則沒有矩形完整蓋住
  u，被覆蓋部分只能來自子節點，取兩者相加；葉子為基底。 每個 +1 都有對應的 −1 且作用在完全相同的節點集合上，故 cover 恆非負，不會出現需要下推標記才能算對子孫的情況。 事件按 x 排序後相鄰事件之間覆蓋長度為常數，累加 L·Δx
  即為聯集面積；同一個 x 上多個事件時 Δx = 0 不貢獻，處理順序不影響結果。
complexity:
  time: O(n log n)
  space: O(n)
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Event {
      long long x;
      size_t lo;
      size_t hi;  // 覆蓋的離散區間索引範圍 [lo, hi]
      int delta;
  };

  static vector<long long> ys;
  static vector<int> cover;
  static vector<long long> len;

  static void update(size_t node, size_t l, size_t r, size_t ql, size_t qr, int delta) {
      if (qr < l || r < ql) { return; }
      if (ql <= l && r <= qr) {
          cover[node] += delta;
      } else {
          const size_t mid = (l + r) / 2;
          update(2 * node, l, mid, ql, qr, delta);
          update(2 * node + 1, mid + 1, r, ql, qr, delta);
      }
      // TODO 1：回溯重算 len[node]。
      //   cover > 0        -> 全長 ys[r + 1] - ys[l]
      //   cover == 0 且葉子 -> 0
      //   其他             -> 兩個子節點的 len 相加
  }

  int main() {
      int n;
      if (!(cin >> n)) { return 0; }
      vector<array<long long, 4>> rects(static_cast<size_t>(n));
      for (auto& r : rects) { cin >> r[0] >> r[1] >> r[2] >> r[3]; }

      for (const auto& r : rects) { ys.push_back(r[1]); ys.push_back(r[3]); }
      sort(ys.begin(), ys.end());
      ys.erase(unique(ys.begin(), ys.end()), ys.end());
      if (ys.size() < 2) { cout << 0 << '\n'; return 0; }

      // TODO 2：每個矩形拆成 (x1, lo, hi - 1, +1) 與 (x2, lo, hi - 1, -1)，
      //         並跳過 x1 == x2 或 y1 == y2 的退化矩形。
      vector<Event> events;
      if (events.empty()) { cout << 0 << '\n'; return 0; }
      sort(events.begin(), events.end(),
           [](const Event& a, const Event& b) { return a.x < b.x; });

      const size_t leaves = ys.size() - 1;
      cover.assign(4 * leaves, 0);
      len.assign(4 * leaves, 0);

      // TODO 3：先用上一段寬度結算面積，再套用當前事件。順序寫反會整條算錯。
      long long area = 0;
      for (size_t i = 0; i < events.size(); ++i) {
          update(1, 0, leaves - 1, events[i].lo, events[i].hi, events[i].delta);
      }
      cout << area << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Event {
      long long x;
      size_t lo;
      size_t hi;  // 覆蓋的離散區間索引範圍 [lo, hi]
      int delta;
  };

  static vector<long long> ys;
  static vector<int> cover;
  static vector<long long> len;

  static void update(size_t node, size_t l, size_t r, size_t ql, size_t qr, int delta) {
      if (qr < l || r < ql) { return; }
      if (ql <= l && r <= qr) {
          cover[node] += delta;
      } else {
          const size_t mid = (l + r) / 2;
          update(2 * node, l, mid, ql, qr, delta);
          update(2 * node + 1, mid + 1, r, ql, qr, delta);
      }
      // 進出成對，cover 永不為負，因此不需要 lazy pushdown。
      if (cover[node] > 0) {
          len[node] = ys[r + 1] - ys[l];
      } else if (l == r) {
          len[node] = 0;
      } else {
          len[node] = len[2 * node] + len[2 * node + 1];
      }
  }

  int main() {
      int n;
      if (!(cin >> n)) { return 0; }
      vector<array<long long, 4>> rects(static_cast<size_t>(n));
      for (auto& r : rects) { cin >> r[0] >> r[1] >> r[2] >> r[3]; }

      for (const auto& r : rects) { ys.push_back(r[1]); ys.push_back(r[3]); }
      sort(ys.begin(), ys.end());
      ys.erase(unique(ys.begin(), ys.end()), ys.end());
      if (ys.size() < 2) { cout << 0 << '\n'; return 0; }

      vector<Event> events;
      for (const auto& r : rects) {
          if (r[0] == r[2] || r[1] == r[3]) { continue; }  // 退化矩形沒有面積
          const size_t lo = static_cast<size_t>(lower_bound(ys.begin(), ys.end(), r[1]) - ys.begin());
          const size_t hi = static_cast<size_t>(lower_bound(ys.begin(), ys.end(), r[3]) - ys.begin());
          events.push_back({r[0], lo, hi - 1, +1});
          events.push_back({r[2], lo, hi - 1, -1});
      }
      if (events.empty()) { cout << 0 << '\n'; return 0; }
      sort(events.begin(), events.end(),
           [](const Event& a, const Event& b) { return a.x < b.x; });

      const size_t leaves = ys.size() - 1;
      cover.assign(4 * leaves, 0);
      len.assign(4 * leaves, 0);

      long long area = 0;
      for (size_t i = 0; i < events.size(); ++i) {
          // 先用上一段寬度結算面積，再套用當前事件。
          if (i > 0) { area += len[1] * (events[i].x - events[i - 1].x); }
          update(1, 0, leaves - 1, events[i].lo, events[i].hi, events[i].delta);
      }
      cout << area << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5490
external_platform: 洛谷
external_problem_id: P5490
external_title: 【模板】掃描線 & 矩形面積並
external_relation: original
source_book_pages:
  - 151
  - 314
source_pdf_pages:
  - 169
  - 332
review_status: verified
core_knowledge: *id001
judgment:
  收集所有 y1、y2 排序去重成 ys，線段樹葉子數為 ys.size() - 1，葉子 i 代表區間 [ys[i], ys[i+1])。 每個矩形產生事件 (x1, lo, hi-1, +1) 與 (x2, lo, hi-1,
  -1)，其中 lo、hi 是 y1、y2 在 ys 中的位置； 跳過退化矩形。事件按 x 遞增排序後掃過：先 area += len[1] * (x_i − x_{i−1})，再套用事件更新。 更新時只在「查詢區間完整包含節點區間」時累加
  cover，回溯時依 cover 是否為正、是否為葉子重算 len。
common_errors:
  - 端點或索引範圍處理錯誤
  - 懶標記或摘要合併順序顛倒
  - 使用不足以容納答案的整數型別
---

掃描線的模板題。最容易錯的一步是讓線段樹的葉子代表區間而不是座標點；記住「量長度就以區間為單位」。
