---
id: luogu-p1714
volume: upper
source_file: upper-volume
title: 洛谷 P1714 切蛋糕：長度受限最大子段和
chapter: 1
section: '1.2'
kind: external-oj
difficulty: 3
topics: ['單調佇列', '前綴和', '最大子段和']
prerequisites: ['queue', '前綴和']
statement: 給定 n 塊依序排列的蛋糕及每塊的整數幸運值。必須選擇一段非空、連續且長度不超過 m 的蛋糕，求可取得的最大幸運值總和。
constraints:
  - '1 <= n <= 5 * 10^5，1 <= m <= n'
  - '|p_i| <= 500'
  - '答案絕對值不超過 2^31-1'
input_format: 第一行為 n、m；第二行為 n 個整數 p_i。
output_format: 輸出一個整數，表示長度至多 m 的非空連續子段最大總和。
samples:
  - input: |
      6 3
      2 -5 4 3 -2 6
    output: |
      7
    explanation: 自製範例。可選 [4,3] 或 [3,-2,6]，兩者總和皆為 7；任何長度不超過 3 的其他連續區間都不更大。
core_knowledge:
  - 子段和改寫為兩個前綴和之差
  - 滑動窗口最小前綴和
judgment: 對每個右端點 r，最佳左界等價於在最近 m 個前綴和中取最小值；這正是單調佇列的窗口最小值模型。
hints:
  - 令 prefix[i] 為前 i 項總和；以 r 結尾、從 l+1 開始的子段和可寫成 prefix[r]-prefix[l]。
  - 長度限制要求 r-m <= l < r，所以固定 r 時，只需知道這段索引範圍內最小的 prefix[l]。
  - 讓雙端佇列保存前綴和索引、值由小到大；處理 r 前先淘汰 l<r-m，再用隊首更新答案，最後把 prefix[r] 維持單調後入隊。
solution_outline: 計算前綴和。佇列初始放索引 0；依序枚舉右端點 r，移除不符合長度的舊索引，以隊首最小前綴和計算候選答案，再將 prefix[r] 加入遞增單調佇列。
proof_or_invariant: |-
  處理右端點 r 時，佇列恰保留 [r-m,r-1] 中未被支配的前綴索引，且其前綴和值遞增，所以隊首是合法範圍內最小 prefix[l]。prefix[r]-prefix[l] 因而是所有以 r 結尾合法非空子段中的最大值；對所有 r 取最大即得全域答案。被新索引淘汰的較大前綴和既不優且更早過期，不會影響未來答案。
complexity:
  time: 'O(n)'
  space: 'O(n)'
common_errors:
  - 允許空子段而在全負數時錯誤輸出 0
  - 把候選左界範圍寫成 [r-m+1,r]，造成長度與空子段錯誤
  - 在使用隊首計算答案前先加入 prefix[r]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) return 0;
      vector<long long> prefix(n + 1);
      for (int i = 1; i <= n; ++i) {
          int value;
          cin >> value;
          prefix[i] = prefix[i - 1] + value;
      }
      deque<int> candidates{0};
      long long answer = numeric_limits<long long>::lowest();
      for (int right = 1; right <= n; ++right) {
          // TODO：維護合法且前綴和值遞增的索引，再更新 answer。
      }
      cout << answer << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n, m;
      if (!(cin >> n >> m)) return 0;
      vector<long long> prefix(n + 1);
      for (int i = 1; i <= n; ++i) {
          int value;
          cin >> value;
          prefix[i] = prefix[i - 1] + value;
      }
      deque<int> candidates{0};
      long long answer = numeric_limits<long long>::lowest();
      for (int right = 1; right <= n; ++right) {
          while (!candidates.empty() && candidates.front() < right - m) {
              candidates.pop_front();
          }
          answer = max(answer, prefix[right] - prefix[candidates.front()]);
          while (!candidates.empty() && prefix[candidates.back()] >= prefix[right]) {
              candidates.pop_back();
          }
          candidates.push_back(right);
      }
      cout << answer << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P1714
external_platform: 洛谷
external_problem_id: P1714
external_title: 切蛋糕
external_relation: original
source_book_pages: [16]
source_pdf_pages: [34]
review_status: verified
---

這題把「長度不超過 m」轉成前綴和索引窗口，是單調佇列優化動態規劃前的重要橋梁。
