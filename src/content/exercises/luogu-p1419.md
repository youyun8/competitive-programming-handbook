---
id: luogu-p1419
volume: upper
source_file: upper-volume
title: 洛谷 P1419 尋找段落
chapter: 2
section: '2.3'
kind: external-oj
difficulty: 4
topics: ['實數二分', '前綴和', '單調佇列']
prerequisites: ['平均值轉換', '滑動最小值']
statement: 給定長度 n 的數列，從所有長度介於 S 與 T 的連續段中，求最大平均值。
constraints: ['1 ≤ n ≤ 100000', '1 ≤ S ≤ T ≤ n', '-10000 ≤ a_i ≤ 10000']
input_format: 第一行 n；第二行 S、T；之後 n 行依序輸入元素。
output_format: 輸出最大平均值，保留三位小數。
samples:
  - input: |
      3
      2 2
      3
      -1
      2
    output: |
      1.000
    explanation: 長度只能為 2；兩段的平均值皆為 1，因此答案為 1.000。
core_knowledge: ['平均值二分轉為區間和非負', '候選前綴索引的滑動最小值']
judgment: 對候選平均 x 令 b_i=a_i-x；存在合法段平均至少 x，等價於存在長度 S..T 的 b 區間和非負。
hints:
  - '猜平均值 x 後，把每個元素減去 x。'
  - '對右端 r，需要在前綴索引 [r-T,r-S] 中找最小值。'
  - '用 deque 維護該滑動範圍的最小前綴和；若 prefix[r] 不小於隊首即表示 x 可行。'
solution_outline: 在元素最小、最大值間二分。每次重建轉換後前綴和，右端由 S 掃到 n；加入 r-S，移除小於 r-T 的索引，並維護前綴值遞增 deque，判斷區間和是否非負。
proof_or_invariant: 合法段 [l+1,r] 的轉換和為 prefix[r]-prefix[l]，其長度限制恰使 l∈[r-T,r-S]。deque 精確保存此範圍的最小前綴值，因此判定充要。可行平均形成向下封閉區間，二分收斂到最大值。
common_errors: ['只檢查固定長度 S', 'deque 移除邊界少一', '原序列含負數卻用普通正數滑窗', '迭代或輸出精度不足']
complexity: { time: 'O(n log(值域/ε))', space: 'O(n)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, min_length, max_length; cin >> n >> min_length >> max_length;
      vector<double> values(static_cast<size_t>(n) + 1U);
      for (int i = 1; i <= n; ++i) cin >> values[static_cast<size_t>(i)];
      // TODO：二分平均值，以單調佇列判斷合法長度區間是否有非負和。
      cout << fixed << setprecision(3) << 0.0 << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, min_length, max_length; cin >> n >> min_length >> max_length;
      vector<double> values(static_cast<size_t>(n) + 1U), prefix(static_cast<size_t>(n) + 1U);
      double low = 1e100, high = -1e100;
      for (int i = 1; i <= n; ++i) {
          cin >> values[static_cast<size_t>(i)];
          low = min(low, values[static_cast<size_t>(i)]);
          high = max(high, values[static_cast<size_t>(i)]);
      }
      const auto feasible = [&](double average) {
          prefix[0] = 0;
          for (int i = 1; i <= n; ++i)
              prefix[static_cast<size_t>(i)] = prefix[static_cast<size_t>(i - 1)] + values[static_cast<size_t>(i)] - average;
          deque<int> candidates;
          for (int right = min_length; right <= n; ++right) {
              const int added = right - min_length;
              while (!candidates.empty() && prefix[static_cast<size_t>(candidates.back())] >= prefix[static_cast<size_t>(added)])
                  candidates.pop_back();
              candidates.push_back(added);
              while (candidates.front() < right - max_length) candidates.pop_front();
              if (prefix[static_cast<size_t>(right)] >= prefix[static_cast<size_t>(candidates.front())]) return true;
          }
          return false;
      };
      for (int iteration = 0; iteration < 70; ++iteration) {
          const double mid = (low + high) / 2;
          if (feasible(mid)) low = mid; else high = mid;
      }
      cout << fixed << setprecision(3) << low << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1419
external_platform: 洛谷
external_problem_id: P1419
external_title: 寻找段落
external_relation: original
source_book_pages: [49]
source_pdf_pages: [67]
review_status: verified
---

平均值限制經減法轉換後，變成固定長度範圍的前綴差判定。
