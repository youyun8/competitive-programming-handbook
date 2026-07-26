---
id: luogu-p2679
volume: upper
source_file: upper-volume
title: 洛谷 P2679 子串
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 4
topics: [dynamic-programming, string, counting]
prerequisites: [dynamic-programming]
statement: >-
  給字串 A、B。從 A 中依原順序選出恰好 k 個互不重疊、非空且相鄰次序不變的子串，
  將它們依序串接後恰等於 B。求選法數模 1000000007。
constraints:
  - 1 <= n <= 1000
  - 1 <= m <= 200
  - 1 <= k <= m
  - A、B 只含小寫英文字母
input_format: 第一行 n、m、k；第二行 A；第三行 B。
output_format: 輸出合法選法數除以 1000000007 的餘數。
samples:
  - input: |-
      6 3 1
      aabaab
      aab
    output: '2'
    explanation: A 的前 3 個字元與後 3 個字元都是連續子串 aab，因此恰選一段共有兩種。
core_knowledge: [字串匹配計數 DP, 是否延續當前段的附加狀態]
judgment: 每段必須非空；段與段不可重疊，但中間可以跳過 A 的任意字元。
hints:
  - 除了已匹配 B 的長度與已開段數，還需區分目前是否選中了 A 的當前字元。
  - 當 A[i]=B[j]，新結尾狀態可由前一字元延續同一段，或由任意舊方案新開一段。
  - 用 total[j][q] 記所有方案、ending[j][q] 記最後一段恰在當前位置結束；掃描 A 時使用新舊兩層。
solution_outline: 逐字元掃描 A，保留跳過當前字元的 total；相等時由 ending[j-1][q] 延續，或由 total[j-1][q-1] 新開段。
proof_or_invariant: >-
  掃描 A 前 i 個字元後，total[j][q] 是匹配 B 前 j 字元且用了 q 段的全部方案；ending 是其中
  必選 A[i] 的方案。若新方案選 A[i]，其前一匹配字元若是 A[i-1] 就唯一屬於延續，否則唯一
  屬於新開一段，兩類分別由兩個轉移產生且不交。若不選 A[i]，方案原樣保留於 total。
  因此轉移無遺漏、無重複，歸納後 total[m][k] 即答案。
common_errors: [把相鄰兩段錯誤合併或重複計數, 原地更新讀到本輪狀態, 忘記每次加法取模]
complexity:
  time: O(n * m * k)
  space: O(m * k)
cpp_skeleton: |
  #include <iostream>
  #include <string>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, m = 0, k = 0; string a, b;
      cin >> n >> m >> k >> a >> b;
      // TODO：維護全部方案與「最後一段延伸至當前位置」方案。
      cout << n - n + m - m + k - k << '\n';
  }
cpp_solution: |
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      constexpr int mod = 1000000007;
      int n = 0, m = 0, segment_count = 0;
      string a, b; cin >> n >> m >> segment_count >> a >> b;
      const int width = segment_count + 1;
      const auto index = [width](int matched, int used) {
          return static_cast<size_t>(matched * width + used);
      };
      vector<int> total(static_cast<size_t>((m + 1) * width), 0);
      vector<int> ending(total.size(), 0);
      total[index(0, 0)] = 1;
      for (int i = 0; i < n; ++i) {
          vector<int> next_total = total;
          vector<int> next_ending(total.size(), 0);
          for (int matched = 1; matched <= m; ++matched) {
              if (a[static_cast<size_t>(i)] != b[static_cast<size_t>(matched - 1)]) continue;
              for (int used = 1; used <= segment_count; ++used) {
                  const int ways = (ending[index(matched - 1, used)] +
                                    total[index(matched - 1, used - 1)]) % mod;
                  next_ending[index(matched, used)] = ways;
                  next_total[index(matched, used)] =
                      (next_total[index(matched, used)] + ways) % mod;
              }
          }
          total.swap(next_total);
          ending.swap(next_ending);
      }
      cout << total[index(m, segment_count)] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2679
external_platform: 洛谷
external_problem_id: P2679
external_title: 子串
external_relation: original
source_book_pages: [332]
source_pdf_pages: [350]
review_status: verified
---

把「最後一段是否延伸到目前字元」分離出來，才能分清延續舊段與新開一段。
