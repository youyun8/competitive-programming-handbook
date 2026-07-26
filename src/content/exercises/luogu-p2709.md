---
id: luogu-p2709
volume: upper
source_file: upper-volume
title: 洛谷 P2709 莫隊：區間內相同數字的平方和
chapter: 4
section: '4.5'
kind: external-oj
difficulty: 3
topics: ['莫隊', '離線查詢', '分塊', '增量維護']
prerequisites: ['mo-algorithm']
core_knowledge: [莫隊演算法, 區間指標轉移, 平方和增量]
judgment: 所有詢問可離線，加入或移除一個值時能由其目前頻率 O(1) 更新平方和，符合莫隊條件。
statement: |-
  給定長度為 n 的序列（值域 1..k）與 m 個區間查詢，每次求該區間內每種數字出現次數的平方和。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '1 <= n, m, k <= 50000'
  - '1 <= a_i <= k'
  - '1 <= l <= r <= n'
input_format: '第一行三個整數 n、m、k；第二行 n 個整數；接下來 m 行每行兩個整數 l 與 r。'
output_format: '每個查詢輸出一行，表示 Σ cnt_i²。'
samples:
  - input: |
      6 4 3
      1 3 2 1 1 3
      1 4
      2 6
      3 5
      5 6
    output: |
      6
      9
      5
      2
    explanation: |-
      第一個區間 1 3 2 1 的計數是 1 出現 2 次、2 與 3 各 1 次，平方和 4+1+1 = 6；第二個區間 3 2 1 1 3 的計數是 1 與 3 各 2 次、2 一次，平方和 4+4+1 = 9。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    莫隊的適用條件有兩個：查詢可以**離線**，而且從區間 [l, r] 變成 [l±1, r] 或 [l, r±1] 的代價是 O(1)。這題兩個條件都滿足。
  - |-
    增量公式要自己推。加入一個數字時，它的計數從 cnt 變成 cnt+1，平方和的增量是 (cnt+1)² − cnt² = 2·cnt + 1；移除時對稱地減去 2·(cnt−1) + 1。
  - |-
    排序是莫隊的靈魂：把查詢依 (左端點所在區塊, 右端點) 排序，區塊大小取 √n。這樣左指標在每個區塊內只移動 O(√n)，右指標在每個區塊內單調移動 O(n)，總計 O(n√m)。
solution_outline: |-
  離線讀入所有查詢，依 (左端點區塊, 右端點) 排序並套用奇偶優化。維護計數陣列與當前平方和，加入時累加 2·cnt+1、移除時扣掉對應值。兩個指標依排序後的順序移動到每個查詢區間，記錄答案後依原始順序輸出。
proof_or_invariant: |-
  不變量是「count_of 恆為當前窗口 [left, right] 內各數值的出現次數，current 恆為其平方和」。增量公式由 (c+1)² − c² = 2c + 1 直接得出。複雜度來自排序：左指標每塊移動 O(√n)、右指標每塊單調掃過 O(n)，共 O(n√m)。
complexity:
  time: 'O((n + m)√n)'
  space: 'O(n + m + k)'
common_errors:
  - 移除元素時先後次序錯誤，使用了移除前而非移除後的頻率
  - 平方和使用 32 位元整數造成溢位
  - 輸出排序後查詢順序，而非原始輸入順序
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, k;
      if (!(cin >> n >> m >> k)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      struct Query {
          int left, right, index;
      };
      vector<Query> queries(static_cast<size_t>(m));
      for (int i = 0; i < m; ++i) {
          cin >> queries[static_cast<size_t>(i)].left >> queries[static_cast<size_t>(i)].right;
          queries[static_cast<size_t>(i)].index = i;
      }

      // TODO 1：離線排序。區塊大小取 √n，排序鍵是 (左端點所在區塊, 右端點)。
      //   進階：同一區塊內讓右端點交替遞增／遞減（奇偶排序），可再省下約一半移動。

      // TODO 2：兩個指標 left、right 逐步移動到每個查詢的區間。
      //   四個 while 的順序要正確（先擴張再收縮），否則指標會交錯出負區間。

      // TODO 3：增量維護 Σcnt²。加入一個數時增量是 2·cnt + 1，移除時是 −(2·cnt − 1)。
      //   這正是莫隊能用的前提：單點增刪的代價是 O(1)。
      //   下面是 O(nm) 的樸素版本，先確認答案定義。
      vector<long long> count_of(static_cast<size_t>(k) + 1, 0);
      for (const Query& q : queries) {
          fill(count_of.begin(), count_of.end(), 0);
          for (int i = q.left; i <= q.right; ++i) { ++count_of[static_cast<size_t>(a[static_cast<size_t>(i)])]; }
          long long total = 0;
          for (const long long c : count_of) { total += c * c; }
          cout << total << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 普通莫隊：把查詢離線後依「左端點所在區塊、右端點」排序，
  // 讓兩個指標的總移動量降到 O(n√m)。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m, k;
      if (!(cin >> n >> m >> k)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }

      struct Query {
          int left, right, index;
      };
      vector<Query> queries(static_cast<size_t>(m));
      for (int i = 0; i < m; ++i) {
          cin >> queries[static_cast<size_t>(i)].left >> queries[static_cast<size_t>(i)].right;
          queries[static_cast<size_t>(i)].index = i;
      }

      const int block = max(1, static_cast<int>(sqrt(static_cast<double>(n))));
      sort(queries.begin(), queries.end(), [block](const Query& x, const Query& y) {
          const int bx = x.left / block;
          const int by = y.left / block;
          if (bx != by) { return bx < by; }
          // 奇偶排序：同一塊內右端點交替遞增／遞減，可省下約一半的移動。
          return (bx & 1) ? x.right > y.right : x.right < y.right;
      });

      vector<long long> count_of(static_cast<size_t>(k) + 1, 0);
      long long current = 0;
      // 加入一個數時，Σcnt² 的增量是 2·cnt + 1；移除時是 −(2·cnt − 1)。
      auto add = [&](int value) {
          current += 2 * count_of[static_cast<size_t>(value)] + 1;
          ++count_of[static_cast<size_t>(value)];
      };
      auto remove = [&](int value) {
          --count_of[static_cast<size_t>(value)];
          current -= 2 * count_of[static_cast<size_t>(value)] + 1;
      };

      vector<long long> answer(static_cast<size_t>(m));
      int left = 1;
      int right = 0;
      for (const Query& q : queries) {
          while (right < q.right) { add(a[static_cast<size_t>(++right)]); }
          while (left > q.left) { add(a[static_cast<size_t>(--left)]); }
          while (right > q.right) { remove(a[static_cast<size_t>(right--)]); }
          while (left < q.left) { remove(a[static_cast<size_t>(left++)]); }
          answer[static_cast<size_t>(q.index)] = current;
      }
      for (const long long value : answer) { cout << value << '\n'; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P2709
external_platform: 洛谷
external_problem_id: P2709
external_title: '【模板】莫隊 / 小 B 的詢問'
external_relation: original
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
review_status: verified
---

莫隊是「離線 + 排序 + 增量」的組合拳。先確認你的統計量支援 O(1) 增刪，剩下的都是模板。
