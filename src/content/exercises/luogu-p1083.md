---
id: luogu-p1083
volume: upper
source_file: upper-volume
title: 洛谷 P1083 借教室
chapter: 2
section: '2.3'
kind: external-oj
difficulty: 3
topics: ['二分', '差分', '前綴和']
prerequisites: ['區間加法', '單調性']
statement: 第 i 天有 r_i 間教室。m 份訂單依序處理，每份要求在 s 到 t 每天使用 d 間；若某訂單加入後任一天超過容量，立即停止。判斷是否全數滿足，否則找第一份失敗訂單。
constraints: ['1 ≤ n,m ≤ 1000000', '容量與訂單需求為正整數且不超過 10^9', '1 ≤ s ≤ t ≤ n']
input_format: 第一行 n、m；第二行 n 個每日容量；之後 m 行 d、s、t。
output_format: 全部成功輸出 0；否則輸出 -1，下一行輸出首個失敗訂單編號。
samples:
  - input: |
      4 3
      2 5 4 3
      2 1 3
      3 2 4
      4 2 4
    output: |
      -1
      2
    explanation: 前兩單累計需求為 2、5、5、3，第 3 天容量僅 4，因此第 2 單首先失敗。
core_knowledge: ['前 k 份訂單的差分檢查', '首個失敗位置二分']
judgment: 若前 k 份訂單可行，任一更短前綴亦可行；一次判定用差分 O(n+k)。
hints:
  - '失敗之後加入更多訂單，是否可能重新可行？'
  - '檢查前 k 單：對每個 [s,t] 在差分 s 加 d、t+1 減 d。'
  - '前綴還原每日需求並與容量比較；二分第一個 check=false 的 k。'
solution_outline: 先檢查全部訂單。若可行輸出 0；否則在 [1,m] 二分第一個不可行前綴。check 每次清空差分、加入前 k 個區間，再掃描每日累計需求。
proof_or_invariant: 差分前綴精確等於前 k 單每日總需求，故 check 正確。訂單需求皆非負，前綴由可行只可能轉為不可行，二分第一個假值即需修改的申請編號。
common_errors: ['輸出失敗訂單前漏印 -1', '差分未在每次 check 清零', 't+1 越界', '累計需求用 int']
complexity: { time: 'O((n+m) log m)', space: 'O(n+m)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, m; cin >> n >> m;
      vector<long long> capacity(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) cin >> capacity[static_cast<size_t>(i)];
      for (int i = 0, s, t; i < m; ++i) { long long d; cin >> d >> s >> t; }
      // TODO：差分檢查訂單前綴，二分首個失敗編號。
      cout << 0 << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  struct Order { long long demand; int start; int finish; };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, m; cin >> n >> m;
      vector<long long> capacity(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) cin >> capacity[static_cast<size_t>(i)];
      vector<Order> orders(static_cast<size_t>(m));
      for (auto& order : orders) cin >> order.demand >> order.start >> order.finish;
      vector<long long> difference(static_cast<size_t>(n) + 2U);
      const auto feasible = [&](int count) {
          fill(difference.begin(), difference.end(), 0);
          for (int i = 0; i < count; ++i) {
              const Order& order = orders[static_cast<size_t>(i)];
              difference[static_cast<size_t>(order.start)] += order.demand;
              difference[static_cast<size_t>(order.finish + 1)] -= order.demand;
          }
          long long used = 0;
          for (int day = 1; day <= n; ++day) {
              used += difference[static_cast<size_t>(day)];
              if (used > capacity[static_cast<size_t>(day)]) return false;
          }
          return true;
      };
      if (feasible(m)) { cout << 0 << '\n'; return 0; }
      int low = 1, high = m;
      while (low < high) {
          const int mid = low + (high - low) / 2;
          if (feasible(mid)) low = mid + 1; else high = mid;
      }
      cout << -1 << '\n' << low << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1083
external_platform: 洛谷
external_problem_id: P1083
external_title: '[NOIP 2012 提高组] 借教室'
external_relation: original
source_book_pages: [49]
source_pdf_pages: [67]
review_status: verified
---

區間需求先用差分批次疊加，再利用訂單前綴的單調性定位首錯。
