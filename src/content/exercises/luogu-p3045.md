---
id: luogu-p3045
volume: upper
source_file: upper-volume
title: 洛谷 P3045 Cow Coupons：反悔貪心
chapter: 1
section: '1.5'
kind: external-oj
difficulty: 4
topics: ['堆積', '貪心', '反悔貪心']
prerequisites: ['heap', 'greedy']
statement: |-
  市場有 N 頭牛，第 i 頭原價 P_i；若在它身上使用一張優惠券，價格改為 C_i。手上共有 K 張券，每頭牛至多使用一張，總支出不可超過預算 M。求最多能買幾頭牛。
constraints:
  - '1 ≤ K ≤ N ≤ 50000'
  - '1 ≤ C_i ≤ P_i ≤ 10^9'
  - '1 ≤ M ≤ 10^14'
input_format: '第一行為 N、K、M；接下來 N 行各為一頭牛的原價 P_i 與優惠價 C_i。'
output_format: '輸出一個整數，表示預算內最多能買的牛數。'
samples:
  - input: |
      4 1 7
      3 2
      2 2
      8 1
      4 3
    output: |
      3
    explanation: |-
      可把唯一的券用在第三頭牛，另以原價買第一、二頭，共花 1+3+2=6，能買三頭；任何四頭都至少超過預算 7。此範例與解釋已和 USACO 官方題面及洛谷頁面核對。
core_knowledge:
  - '以多個小根堆維護原價、優惠價與撤回優惠的代價'
  - '反悔貪心：把既有優惠券改派給新牛'
  - '延遲刪除避免同一頭牛被購買兩次'
judgment: '直接挑優惠價最低者會把券浪費在折扣很小的牛上；需同時比較原價購買，以及撤回一張既有券再用於新牛的增量成本。'
hints:
  - '若已用券買了某頭牛，把它改成原價需要多付多少？這筆差額可視為「收回一張券」的價格。'
  - '先用券買 K 頭優惠價最低的牛，並把每頭的 P_i-C_i 放進另一個小根堆。之後新增一頭牛有兩種方式。'
  - '每次比較「未買牛的最小原價」與「未買牛的最小優惠價＋最小收券差額」；選較小者，並用已購買標記對兩個牛價堆做延遲刪除。'
solution_outline: |-
  建立依 C_i、P_i 排序的兩個小根堆。先依 C_i 購買至多 K 頭，對每頭把 P_i-C_i 放入 recover 堆。之後每次清除兩個價格堆中已購買的牛，比較直接付最小 P_i，或付最小 C_j 加 recover 堆頂以把某張券改派給 j。採較便宜者，更新預算、已購買標記與 recover 堆；若最小增量也超出預算便停止。
proof_or_invariant: |-
  已買少於 K 頭時，使用券的最低成本顯然是取最小的 C_i。已用滿 K 張券後，對固定的已購買集合，最小成本等價於把券放在節省額 P_i-C_i 最大的 K 頭。新增牛 j 時，若不用券，最小增量是所有未買牛中的最小 P_j；若用券，必須從既有持券牛中撤回一張，最小增量是 C_j 加最小撤回代價 P_i-C_i。兩種情況各取最小候選，再取兩者較小，即為增加一頭牛的全域最小可能成本；替換後 recover 堆仍保存目前持券牛的撤回代價。歸納可知買到任意數量時累計成本皆最小，因此首次無法再買時，數量最大。
common_errors:
  - '只挑 P_i-C_i 最大的 K 頭用券，卻忽略可能根本不應購買那些牛'
  - '從優惠價堆買牛後，未在原價堆以已購買標記延遲刪除，導致重複購買'
  - '優惠券改派後只加入新差額，卻忘記彈出被收回券的最小差額'
  - '預算與累計成本使用 32 位元整數'
complexity:
  time: 'O(N log N)'
  space: 'O(N)'
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Cow {
      long long full_price;
      long long coupon_price;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int k;
      long long budget;
      if (!(cin >> n >> k >> budget)) { return 0; }
      vector<Cow> cows(static_cast<size_t>(n));
      for (Cow& cow : cows) { cin >> cow.full_price >> cow.coupon_price; }

      // TODO 1：建立依原價、優惠價排序的兩個小根堆。
      // TODO 2：先以優惠價買至多 k 頭，記錄每張券的撤回代價。
      // TODO 3：比較直接購買與改派優惠券的增量成本，直到預算不足。
      cout << 0 << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Cow {
      long long full_price;
      long long coupon_price;
  };

  using Entry = pair<long long, int>;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      int k;
      long long budget;
      if (!(cin >> n >> k >> budget)) { return 0; }

      vector<Cow> cows(static_cast<size_t>(n));
      priority_queue<Entry, vector<Entry>, greater<Entry>> by_full_price;
      priority_queue<Entry, vector<Entry>, greater<Entry>> by_coupon_price;
      for (int i = 0; i < n; ++i) {
          cin >> cows[static_cast<size_t>(i)].full_price
              >> cows[static_cast<size_t>(i)].coupon_price;
          by_full_price.push({cows[static_cast<size_t>(i)].full_price, i});
          by_coupon_price.push({cows[static_cast<size_t>(i)].coupon_price, i});
      }

      vector<bool> bought(static_cast<size_t>(n), false);
      priority_queue<long long, vector<long long>, greater<long long>> recover;
      int answer = 0;

      while (answer < k) {
          Entry choice = by_coupon_price.top();
          by_coupon_price.pop();
          if (choice.first > budget) {
              cout << answer << '\n';
              return 0;
          }
          budget -= choice.first;
          int id = choice.second;
          bought[static_cast<size_t>(id)] = true;
          recover.push(
              cows[static_cast<size_t>(id)].full_price
              - cows[static_cast<size_t>(id)].coupon_price
          );
          ++answer;
      }

      while (answer < n) {
          while (bought[static_cast<size_t>(by_full_price.top().second)]) {
              by_full_price.pop();
          }
          while (bought[static_cast<size_t>(by_coupon_price.top().second)]) {
              by_coupon_price.pop();
          }

          long long direct_cost = by_full_price.top().first;
          long long reassignment_cost = by_coupon_price.top().first + recover.top();
          if (min(direct_cost, reassignment_cost) > budget) { break; }

          int id;
          if (direct_cost <= reassignment_cost) {
              budget -= direct_cost;
              id = by_full_price.top().second;
              by_full_price.pop();
          } else {
              budget -= reassignment_cost;
              recover.pop();
              id = by_coupon_price.top().second;
              by_coupon_price.pop();
              recover.push(
                  cows[static_cast<size_t>(id)].full_price
                  - cows[static_cast<size_t>(id)].coupon_price
              );
          }
          bought[static_cast<size_t>(id)] = true;
          ++answer;
      }

      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3045
external_platform: 洛谷
external_problem_id: P3045
external_title: '[USACO12FEB] Cow Coupons G'
external_relation: original
source_book_pages: [1, 31]
source_pdf_pages: [19, 49]
review_status: verified
---

這題展示堆積不只用來反覆取極值，也能保存「撤回先前決策」的最低代價。
