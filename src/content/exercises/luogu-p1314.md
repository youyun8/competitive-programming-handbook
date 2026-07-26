---
id: luogu-p1314
volume: upper
source_file: upper-volume
title: 洛谷 P1314 聰明的質監員
chapter: 2
section: '2.3'
kind: external-oj
difficulty: 4
topics: ['答案二分', '前綴和']
prerequisites: ['單調函數', '區間查詢']
statement: 每顆礦石有重量 w_i、價值 v_i。選門檻 W；每個給定區間的檢驗值為其中 w_i≥W 的顆數乘其價值總和，所有區間檢驗值再相加為 Y。求 |Y-S| 的最小值。
constraints: ['1 ≤ n,m ≤ 200000', '0 < w_i,v_i ≤ 10^6', '0 < S ≤ 10^12', '1 ≤ l_i ≤ r_i ≤ n']
input_format: 第一行 n、m、S；接著 n 行重量與價值；最後 m 行區間端點。
output_format: 輸出所有整數門檻中 |Y-S| 的最小值。
samples:
  - input: |
      5 3 15
      1 5
      2 5
      3 5
      4 5
      5 5
      1 5
      2 4
      3 3
    output: |
      10
    explanation: W=4 時三區間檢驗值為 20、5、0，Y=25，與 15 相差 10，且無更小差值。
core_knowledge: ['門檻提高時 Y 單調不增', '計數與價值雙前綴和']
judgment: 固定 W 可 O(n+m) 算 Y；答案在 Y 穿越 S 的相鄰門檻處取得。
hints:
  - '門檻 W 增大後，被選礦石集合如何改變？'
  - '建立「合格顆數」與「合格價值」兩個前綴和，即可 O(1) 算一區間貢獻。'
  - '二分第一個 Y<S 的 W，並在每次判定更新 |Y-S|。'
solution_outline: check(W) 掃礦石建立 count_prefix、value_prefix，再加總每個區間兩個差值的乘積。於 [0,max_w+1] 二分單調的 Y，過程持續更新最小絕對差。
proof_or_invariant: 雙前綴差精確給出每區間合格顆數與價值和。提高 W 只會刪除礦石，兩者非增且非負，所以每區間乘積及 Y 非增。單調序列與 S 的最小距離必在穿越附近，二分評估過的兩側值涵蓋最優。
common_errors: ['條件誤寫為 w_i>W', '乘法在轉成 long long 前已溢位', '只回傳二分單側而未比較差值', '區間端點少一']
complexity: { time: 'O((n+m) log max_w)', space: 'O(n+m)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, m; long long standard; cin >> n >> m >> standard;
      vector<pair<int,int>> minerals(static_cast<size_t>(n)), ranges(static_cast<size_t>(m));
      for (auto& x : minerals) cin >> x.first >> x.second;
      for (auto& x : ranges) cin >> x.first >> x.second;
      // TODO：二分重量門檻，以雙前綴和計算 Y。
      cout << 0 << '\n';
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n, m; long long standard; cin >> n >> m >> standard;
      vector<int> weight(static_cast<size_t>(n) + 1U), value(static_cast<size_t>(n) + 1U);
      int max_weight = 0;
      for (int i = 1; i <= n; ++i) { cin >> weight[static_cast<size_t>(i)] >> value[static_cast<size_t>(i)]; max_weight = max(max_weight, weight[static_cast<size_t>(i)]); }
      vector<pair<int,int>> ranges(static_cast<size_t>(m));
      for (auto& range : ranges) cin >> range.first >> range.second;
      vector<long long> count_prefix(static_cast<size_t>(n) + 1U), value_prefix(static_cast<size_t>(n) + 1U);
      const auto inspect = [&](int threshold) {
          for (int i = 1; i <= n; ++i) {
              const bool chosen = weight[static_cast<size_t>(i)] >= threshold;
              count_prefix[static_cast<size_t>(i)] = count_prefix[static_cast<size_t>(i - 1)] + (chosen ? 1 : 0);
              value_prefix[static_cast<size_t>(i)] = value_prefix[static_cast<size_t>(i - 1)] + (chosen ? value[static_cast<size_t>(i)] : 0);
          }
          long long result = 0;
          for (const auto& [left, right] : ranges) {
              const long long count = count_prefix[static_cast<size_t>(right)] - count_prefix[static_cast<size_t>(left - 1)];
              const long long sum = value_prefix[static_cast<size_t>(right)] - value_prefix[static_cast<size_t>(left - 1)];
              result += count * sum;
          }
          return result;
      };
      long long answer = numeric_limits<long long>::max();
      int low = 0, high = max_weight + 1;
      while (low <= high) {
          const int mid = low + (high - low) / 2;
          const long long result = inspect(mid);
          answer = min(answer, llabs(result - standard));
          if (result >= standard) low = mid + 1; else high = mid - 1;
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1314
external_platform: 洛谷
external_problem_id: P1314
external_title: '[NOIP 2011 提高组] 聪明的质监员'
external_relation: original
source_book_pages: [49]
source_pdf_pages: [67]
review_status: verified
---

門檻讓檢驗值單調，雙前綴和則把每次門檻評估壓到線性。
