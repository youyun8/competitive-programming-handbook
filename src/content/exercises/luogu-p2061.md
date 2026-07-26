---
id: luogu-p2061
volume: lower
source_file: lower-volume
title: 洛谷 P2061 City Horizon：城市天際線面積
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 3
topics: ['掃描線', '事件排序', 'multiset']
prerequisites: ['區間', '排序', '平衡樹']
statement: 地平線上有 N 座軸對齊矩形建築，第 i 座底邊涵蓋 [A_i,B_i]，高度為 H_i。建築可以重疊；求所有建築聯集形成的城市輪廓面積。
constraints:
  - '1 <= N <= 40000'
  - '1 <= A_i < B_i <= 1000000000'
  - '1 <= H_i <= 1000000000'
input_format: 第一行為建築數 N；接著 N 行各有 A_i、B_i、H_i。
output_format: 輸出所有建築輪廓聯集的整數面積。
samples:
  - input: |
      4
      2 5 1
      9 10 4
      6 8 2
      4 6 3
    output: |
      16
    explanation: 官方範例的最高輪廓在區間 [2,4)、[4,6)、[6,8)、[9,10) 高度分別為 1、3、2、4，面積為 2+6+4+4=16。
core_knowledge:
  - 面積是最高建築函數的積分
  - 左右端點轉為加入、刪除事件
  - 相鄰事件座標間最高高度固定
judgment: 座標達 1e9 但事件只有 2N 個。按 x 掃描並以 multiset 維護目前覆蓋建築高度；相鄰事件座標之間輪廓高度固定，可直接累加寬乘最大高度。
hints:
  - 每座建築在 A_i 產生加入 H_i 事件，在 B_i 產生刪除 H_i 事件。
  - 到達新座標 x 時，先用「上一座標到 x 的寬 × 目前最高高度」累加面積，再處理 x 上所有事件。
  - 同一高度可能同時存在多座建築，刪除時只能 erase(find(h)) 一份，不能 erase(h) 全刪。
solution_outline: 建立 2N 個端點事件並按 x 分組排序。維護含哨兵 0 的高度 multiset；每組事件前用當前最大值累加前一段面積，再逐一加入或刪除高度。
proof_or_invariant: 處理座標 x 前，multiset 恰包含所有滿足 A_i<=previous_x<B_i 的建築高度，因此在前一事件座標到 x 的整個開區間內，建築集合與最大高度不變，所加矩形面積正確。處理 x 的全部事件後，不變量對下一區間成立。所有非零寬度區間恰被掃描一次，總和即輪廓聯集面積。
complexity:
  time: O(N log N)
  space: O(N)
common_errors:
  - 先處理新座標事件再計算前一段面積
  - 同座標事件未分組而錯誤加入零寬段以外的高度
  - multiset.erase(value) 一次刪除所有相同高度
  - 面積使用 32 位元整數溢位
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：把每棟建築拆成左右事件，掃描時維護目前最高高度。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Event {
      long long x;
      long long height;
      int type;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<Event> events;
      events.reserve(static_cast<size_t>(2 * n));
      for (int i = 0; i < n; ++i) {
          long long left;
          long long right;
          long long height;
          cin >> left >> right >> height;
          events.push_back({left, height, 1});
          events.push_back({right, height, -1});
      }
      sort(events.begin(), events.end(), [](const Event& a, const Event& b) {
          return a.x < b.x;
      });
      multiset<long long> active{0};
      long long area = 0;
      long long previous_x = events[0].x;
      size_t index = 0;
      while (index < events.size()) {
          const long long current_x = events[index].x;
          area +=
              (current_x - previous_x) * (*active.rbegin());
          while (index < events.size() && events[index].x == current_x) {
              if (events[index].type == 1) {
                  active.insert(events[index].height);
              } else {
                  const auto position = active.find(events[index].height);
                  active.erase(position);
              }
              ++index;
          }
          previous_x = current_x;
      }
      cout << area << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2061
external_platform: 洛谷
external_problem_id: P2061
external_title: '[USACO07OPEN] City Horizon S'
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面、限制與 URL 已依洛谷官方題面核實；敘述、證明與程式為本站獨立撰寫。
