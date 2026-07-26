---
id: luogu-p4302
volume: upper
source_file: upper-volume
title: 洛谷 P4302 字串摺疊
chapter: 5
section: '5.5'
kind: external-oj
difficulty: 4
topics: [dynamic-programming, interval-dp, periodic-string]
prerequisites: [interval-dp]
statement: >-
  字串可原樣表示、可把 X 個相同子串 S 表成 X(S)，也可串接兩個摺疊表示，且允許巢狀。
  給大寫字母字串，求能表示原串的最短摺疊字串長度。
constraints:
  - 1 <= |S| <= 100
  - S 只含大寫英文字母
input_format: 一行字串 S。
output_format: 輸出最短摺疊表示的長度。
samples:
  - input: 'NEERCYESYESYESNEERCYESYESYES'
    output: '14'
    explanation: 最短表示之一是 2(NEERC3(YES))，其字元總長度為 14。
core_knowledge: [區間 DP, 週期判定, 巢狀壓縮]
judgment: X>1 且十進位位數也計入長度；括號各占一字元，子模式本身可再摺疊。
hints:
  - dp[l][r] 表示子串的最短表示長度，初值是原樣長度。
  - 枚舉切點可串接兩個最短表示。
  - 若區間由長度 p 的模式重複 q 次，候選長度為 digits(q)+2+dp[l][l+p-1]。
solution_outline: 依區間長度計算，枚舉串接切點與所有整除區間長度的週期，取最短候選。
proof_or_invariant: >-
  任一最外層表示若是串接，必對應某切點的兩個子表示；若是 X(S)，原串必具有模式長度 p 的
  完整週期，且括號內可取該模式的最短表示。枚舉兩類涵蓋所有表示語法的最外層形式，候選也都
  能展開成原子串。由短區間歸納，dp 精確等於最短長度。
common_errors: [把重複次數當成固定一位, 括號內使用原長而非最短表示, 未驗證整段確實週期相同]
complexity:
  time: O(n^4)
  space: O(n^2)
cpp_skeleton: |
  #include <iostream>
  #include <string>
  using namespace std;
  int main() {
      string text; cin >> text;
      // TODO：區間 DP 枚舉串接與週期摺疊。
      cout << text.size() << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <string>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      string text; cin >> text;
      const int n = static_cast<int>(text.size());
      vector<vector<int>> dp(static_cast<size_t>(n), vector<int>(static_cast<size_t>(n), 0));
      for (int length = 1; length <= n; ++length)
          for (int left = 0; left + length <= n; ++left) {
              const int right = left + length - 1;
              dp[static_cast<size_t>(left)][static_cast<size_t>(right)] = length;
              for (int split = left; split < right; ++split)
                  dp[static_cast<size_t>(left)][static_cast<size_t>(right)] =
                      min(dp[static_cast<size_t>(left)][static_cast<size_t>(right)],
                          dp[static_cast<size_t>(left)][static_cast<size_t>(split)] +
                          dp[static_cast<size_t>(split + 1)][static_cast<size_t>(right)]);
              for (int period = 1; period < length; ++period) {
                  if (length % period != 0) continue;
                  bool repeated = true;
                  for (int offset = period; offset < length; ++offset)
                      if (text[static_cast<size_t>(left + offset)] !=
                          text[static_cast<size_t>(left + offset % period)]) {
                          repeated = false;
                          break;
                      }
                  if (repeated) {
                      const int copies = length / period;
                      const int candidate = static_cast<int>(to_string(copies).size()) + 2 +
                          dp[static_cast<size_t>(left)][static_cast<size_t>(left + period - 1)];
                      dp[static_cast<size_t>(left)][static_cast<size_t>(right)] =
                          min(dp[static_cast<size_t>(left)][static_cast<size_t>(right)], candidate);
                  }
              }
          }
      cout << dp[0][static_cast<size_t>(n - 1)] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P4302
external_platform: 洛谷
external_problem_id: P4302
external_title: 字符串折叠
external_relation: original
source_book_pages: [377]
source_pdf_pages: [395]
review_status: verified
---

最外層語法只有串接或重複兩類，因此區間 DP 可以完整枚舉所有巢狀摺疊。
