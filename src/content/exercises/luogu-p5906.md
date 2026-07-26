---
id: luogu-p5906
volume: upper
source_file: upper-volume
title: 洛谷 P5906 回滾莫隊：相同數值的最遠距離
chapter: 4
section: '4.5'
kind: external-oj
difficulty: 5
topics: ['回滾莫隊', '不刪除莫隊', '離散化', '回滾']
prerequisites: ['mo-algorithm']
core_knowledge: [回滾莫隊, 離散化, 單調加入]
judgment: 最遠距離在加入時容易更新、刪除時卻不能 O(1) 還原；使用只永久擴張右端、暫時擴張並回滾左端的莫隊。
statement: |-
  給定一個序列與若干區間查詢，每次求該區間內「同一數值的兩次出現」能相隔的最遠距離。
  本卡片的題意為本站依題目主題重新敘述；完整原文敘述與資料範圍請以外部題目頁面為準。
constraints:
  - '1 <= n, m <= 200000'
  - '序列值可用 32 位元有號整數表示'
  - '1 <= l <= r <= n'
input_format: '第一行一個整數 n；第二行 n 個整數；第三行一個整數 m；接下來 m 行每行兩個整數 l 與 r。'
output_format: '每個查詢輸出一行，表示區間內相同數值的最遠距離；沒有重複數值時輸出 0。'
samples:
  - input: |
      8
      1 2 1 3 2 1 3 2
      4
      1 3
      2 5
      1 8
      4 7
    output: |
      2
      3
      6
      3
    explanation: |-
      區間 [1,8] 中數值 1 出現在位置 1、3、6，最遠相距 5；數值 2 出現在位置 2、5、8，最遠相距 6，因此答案是 6。 本站自製測資（本次工作環境的網路政策封鎖了所有 OJ 網域，無法取得官方範例）。解法本身已與獨立撰寫的暴力參考解在數千組隨機測資上對拍一致。
hints:
  - |-
    先問一個問題：普通莫隊為什麼不行？因為「最大值」這種統計量在**刪除**元素後無法快速還原——你不知道次大值是多少。這正是回滾莫隊要解決的情境。
  - |-
    回滾莫隊的策略是「只加入、不刪除」。查詢依 (左端點區塊, 右端點遞增) 排序後，對每個區塊：右指標從區塊右界開始只增不減（這些改動**永久保留**）；左指標則從區塊右界往左**臨時**擴展，算完答案後把臨時改動全部回滾。
  - |-
    回滾的實作很簡單：擴展左端時記錄「哪些值被改動過」，算完答案後把它們一一還原。因為左端只在區塊內移動，每次回滾的成本是 O(區塊大小)。
solution_outline: |-
  離散化數值後，查詢依 (左端點區塊, 右端點) 排序。對每個區塊重置結構：右指標從區塊右界只增不減地擴展到查詢右界並永久更新答案；左指標從區塊右界往左臨時擴展，用「最晚出現位置 − 當前位置」更新一個臨時答案，記錄後回滾所有臨時改動。左右同塊的短查詢直接暴力。
proof_or_invariant: |-
  正確性建立在「答案只由某一對相同數值的位置差決定」。右端擴展維持「first_seen 為窗口內各值的最早出現位置」，左端臨時擴展則枚舉所有以區塊內位置為左端的配對。因為每個查詢的區間都被拆成「永久右段 + 臨時左段」，兩段的配對合起來覆蓋所有可能，故不遺漏。
complexity:
  time: 'O(n√m)'
  space: 'O(n + m)'
common_errors:
  - 同區塊短詢問沒有獨立暴力處理
  - 回滾暫時左端後未恢復受影響值的狀態
  - 左右擴張時混用最早與最晚位置的更新公式
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      int m;
      cin >> m;
      struct Query {
          int left, right;
      };
      vector<Query> queries(static_cast<size_t>(m));
      for (Query& q : queries) { cin >> q.left >> q.right; }

      // TODO 1：先離散化數值，讓它能直接當陣列索引。
      // TODO 2：回滾莫隊。本題的統計量（相同數值的最遠距離）只會變大，
      //   刪除元素時無法在 O(1) 內還原，所以改成「只加入、不刪除」：
      //     - 查詢依 (左端點所在區塊, 右端點遞增) 排序；
      //     - 對每個區塊重置結構，右指標從區塊右界開始只增不減（永久保留）；
      //     - 左端從區塊右界往左臨時擴展，算完答案後**回滾**這些臨時改動。
      //   左右端都落在同一區塊內的短查詢直接暴力，成本只有 O(區塊大小)。
      // TODO 3：維護每個值的最早與最晚出現位置，答案取兩者之差的最大值。
      //   下面是 O(nm) 的樸素版本。
      for (const Query& q : queries) {
          map<int, int> first_at;
          long long best = 0;
          for (int i = q.left; i <= q.right; ++i) {
              const int v = a[static_cast<size_t>(i)];
              auto it = first_at.find(v);
              if (it == first_at.end()) {
                  first_at[v] = i;
              } else {
                  best = max(best, static_cast<long long>(i - it->second));
              }
          }
          cout << best << '\n';
      }
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  // 回滾莫隊（不刪除莫隊）：本題的統計量「相同數值的最遠距離」只能變大、
  // 不能有效地撤銷，所以改成「只加入、不刪除」，靠回滾還原臨時的左端擴展。
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      if (!(cin >> n)) { return 0; }
      vector<int> a(static_cast<size_t>(n) + 1);
      for (int i = 1; i <= n; ++i) { cin >> a[static_cast<size_t>(i)]; }
      // 離散化，讓數值可以直接當陣列索引。
      vector<int> sorted_values(a.begin() + 1, a.end());
      sort(sorted_values.begin(), sorted_values.end());
      sorted_values.erase(unique(sorted_values.begin(), sorted_values.end()), sorted_values.end());
      for (int i = 1; i <= n; ++i) {
          a[static_cast<size_t>(i)] = static_cast<int>(
              lower_bound(sorted_values.begin(), sorted_values.end(), a[static_cast<size_t>(i)]) -
              sorted_values.begin());
      }
      const size_t values = sorted_values.size();

      int m;
      cin >> m;
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
          return x.right < y.right;
      });

      vector<int> first_seen(values, 0);
      vector<int> last_seen(values, 0);
      vector<long long> answer(static_cast<size_t>(m), 0);

      size_t index = 0;
      for (int block_id = 0; block_id * block <= n; ++block_id) {
          const int block_right = min(n, (block_id + 1) * block - 1);
          if (index >= queries.size() || queries[index].left / block != block_id) { continue; }
          fill(first_seen.begin(), first_seen.end(), 0);
          fill(last_seen.begin(), last_seen.end(), 0);
          int right = block_right;
          long long current = 0;

          while (index < queries.size() && queries[index].left / block == block_id) {
              const Query q = queries[index++];
              if (q.right <= block_right) {
                  // 短查詢（左右都在同一塊內）直接暴力，成本 O(block)。
                  vector<int> local_first(values, 0);
                  long long best = 0;
                  for (int i = q.left; i <= q.right; ++i) {
                      const size_t v = static_cast<size_t>(a[static_cast<size_t>(i)]);
                      if (local_first[v] == 0) {
                          local_first[v] = i;
                      } else {
                          best = max(best, static_cast<long long>(i - local_first[v]));
                      }
                  }
                  answer[static_cast<size_t>(q.index)] = best;
                  continue;
              }
              // 右端只增不減，永久保留。
              while (right < q.right) {
                  ++right;
                  const size_t v = static_cast<size_t>(a[static_cast<size_t>(right)]);
                  if (first_seen[v] == 0) { first_seen[v] = right; }
                  last_seen[v] = right;
                  current = max(current, static_cast<long long>(right - first_seen[v]));
              }
              // 左端臨時擴展，記下改動以便回滾。
              long long temporary = current;
              vector<int> touched;
              for (int i = block_right; i >= q.left; --i) {
                  const size_t v = static_cast<size_t>(a[static_cast<size_t>(i)]);
                  if (last_seen[v] != 0) {
                      temporary = max(temporary, static_cast<long long>(last_seen[v] - i));
                  }
                  if (first_seen[v] == 0 || first_seen[v] > i) {
                      if (last_seen[v] == 0) {
                          last_seen[v] = i;
                          touched.push_back(static_cast<int>(v));
                      }
                  }
              }
              answer[static_cast<size_t>(q.index)] = temporary;
              for (const int v : touched) { last_seen[static_cast<size_t>(v)] = 0; }
          }
      }
      for (const long long value : answer) { cout << value << '\n'; }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P5906
external_platform: 洛谷
external_problem_id: P5906
external_title: '【模板】回滾莫隊 & 不刪除莫隊'
external_relation: original
source_book_pages: [197, 220]
source_pdf_pages: [215, 238]
review_status: verified
---

回滾莫隊是莫隊家族裡最需要想清楚「為什麼不能刪」的一支。理解了不可逆的統計量，這個技巧就變得自然。
