---
id: luogu-p3270
volume: lower
source_file: lower-volume
title: 洛谷 P3270 排名與跨科碾壓計數
chapter: 7
section: '7.5'
kind: external-oj
difficulty: 5
topics: [dynamic-programming, lagrange-interpolation, combinatorics]
prerequisites: [inclusion-exclusion, polynomial-interpolation]
statement: >-
  N 位學生修 M 門課，每門分數介於 1..U_i；0 號學生每科排名為 R_i。
  若另一學生每科分數都不高於 0 號，稱被其碾壓。計算恰有 K 人被碾壓的所有完整成績方案數，模 1000000007。
constraints:
  - 1 <= N,M <= 100
  - 1 <= U_i <= 1000000000
  - 1 <= R_i <= N
  - 輸入保證至少存在一種符合條件的方案
input_format: 第一行 N、M、K；第二行 M 個 U_i；第三行 M 個 R_i。
output_format: 輸出符合排名及恰好 K 人被碾壓的方案數模 1000000007。
samples:
  - input: |
      2 1 1
      2
      1
    output: '3'
    explanation: B 神得 1 分時另一人只能得 1；得 2 分時另一人可得 1 或 2，共三種。
core_knowledge:
  - 逐科維護仍可能在所有已處理科目都不高於 B 神的人數
  - 固定單科排名的分數方案數是 U 的 N 次多項式，可用等距 Lagrange 插值
judgment: 同分算作不高於 B 神；排名 R_i 只統計嚴格高於 B 神的 R_i-1 人。
hints:
  - 固定 B 神單科分數 x，低側每人有 x 種、高側每人有 U-x 種選擇。
  - 單科係數 g(U,R)=Σ(x=1..U)x^(N-R)(U-x)^(R-1)，關於 U 的次數至多 N。
  - dp[p] 轉到 dp[j] 時，從 p 名候選中挑 p-j 人本課變高，再補足總共 R-1 名高分者。
solution_outline: 對每科在 0..N 求出 g 的點值並插值到 U_i；用組合數完成候選人集合大小 DP。
proof_or_invariant: >-
  dp[j] 在處理若干科後計數恰有 j 人每科都不高於 B 神。加入一科時，從舊候選與舊非候選中
  選出該科嚴格高分者的組合係數恰好描述交集縮小；固定高低身份後，各自分數選擇數為 g。
  g 是 N 次多項式，N+1 個點唯一決定其值，因此插值與直接枚舉 U 完全等價。
common_errors:
  - 將同分學生算入排名前方；題意只算嚴格較高
  - 插值只使用 N 個點，少了決定 N 次多項式所需的一點
  - DP 初始設成 0 名候選；尚未看任何科時應有 N-1 名
complexity:
  time: O(MN^2 log N + MN^2)
  space: O(N^2)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      int student_count, course_count, target;
      cin >> student_count >> course_count >> target;
      // TODO：插值求每科固定排名分數數量，再做候選人數 DP。
      (void)student_count;
      (void)course_count;
      (void)target;
      return 0;
  }
cpp_solution: |
  #include <cstdint>
  #include <iostream>
  #include <vector>
  using namespace std;

  static constexpr int64_t mod_value = 1000000007;
  static int64_t power_mod(int64_t base, int64_t exponent) {
      int64_t result = 1;
      base %= mod_value;
      while (exponent > 0) {
          if ((exponent & 1LL) != 0) { result = result * base % mod_value; }
          base = base * base % mod_value;
          exponent >>= 1;
      }
      return result;
  }
  static int64_t interpolate(const vector<int64_t>& values, int64_t point,
                             const vector<int64_t>& factorial,
                             const vector<int64_t>& inverse_factorial) {
      const int degree = static_cast<int>(values.size()) - 1;
      if (point <= degree) { return values[static_cast<size_t>(point)]; }
      point %= mod_value;
      vector<int64_t> prefix(static_cast<size_t>(degree) + 2U, 1);
      vector<int64_t> suffix(static_cast<size_t>(degree) + 2U, 1);
      for (int i = 0; i <= degree; ++i) {
          prefix[static_cast<size_t>(i + 1)] =
              prefix[static_cast<size_t>(i)] * (point - i + mod_value) % mod_value;
      }
      for (int i = degree; i >= 0; --i) {
          suffix[static_cast<size_t>(i)] =
              suffix[static_cast<size_t>(i + 1)] * (point - i + mod_value) % mod_value;
      }
      int64_t result = 0;
      for (int i = 0; i <= degree; ++i) {
          int64_t term = values[static_cast<size_t>(i)] * prefix[static_cast<size_t>(i)] %
                         mod_value * suffix[static_cast<size_t>(i + 1)] % mod_value;
          term = term * inverse_factorial[static_cast<size_t>(i)] % mod_value *
                 inverse_factorial[static_cast<size_t>(degree - i)] % mod_value;
          if (((degree - i) & 1) != 0) { term = (mod_value - term) % mod_value; }
          result = (result + term) % mod_value;
      }
      (void)factorial;
      return result;
  }
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int student_count, course_count, target;
      cin >> student_count >> course_count >> target;
      vector<int64_t> maximum(static_cast<size_t>(course_count));
      vector<int> ranking(static_cast<size_t>(course_count));
      for (int64_t& value : maximum) { cin >> value; }
      for (int& value : ranking) { cin >> value; }
      vector<vector<int64_t>> combination(static_cast<size_t>(student_count) + 1U,
                                          vector<int64_t>(static_cast<size_t>(student_count) + 1U));
      for (int i = 0; i <= student_count; ++i) {
          combination[static_cast<size_t>(i)][0] = 1;
          combination[static_cast<size_t>(i)][static_cast<size_t>(i)] = 1;
          for (int j = 1; j < i; ++j) {
              combination[static_cast<size_t>(i)][static_cast<size_t>(j)] =
                  (combination[static_cast<size_t>(i - 1)][static_cast<size_t>(j - 1)] +
                   combination[static_cast<size_t>(i - 1)][static_cast<size_t>(j)]) %
                  mod_value;
          }
      }
      vector<int64_t> factorial(static_cast<size_t>(student_count) + 1U, 1);
      vector<int64_t> inverse_factorial(static_cast<size_t>(student_count) + 1U, 1);
      for (int i = 1; i <= student_count; ++i) {
          factorial[static_cast<size_t>(i)] = factorial[static_cast<size_t>(i - 1)] * i % mod_value;
      }
      inverse_factorial.back() = power_mod(factorial.back(), mod_value - 2);
      for (int i = student_count; i >= 1; --i) {
          inverse_factorial[static_cast<size_t>(i - 1)] =
              inverse_factorial[static_cast<size_t>(i)] * i % mod_value;
      }
      vector<int64_t> dp(static_cast<size_t>(student_count));
      dp[static_cast<size_t>(student_count - 1)] = 1;
      for (int course = 0; course < course_count; ++course) {
          vector<int64_t> point_values(static_cast<size_t>(student_count) + 1U);
          for (int point = 1; point <= student_count; ++point) {
              int64_t sum = 0;
              for (int score = 1; score <= point; ++score) {
                  sum = (sum + power_mod(score, student_count - ranking[static_cast<size_t>(course)]) *
                                   power_mod(point - score, ranking[static_cast<size_t>(course)] - 1)) %
                        mod_value;
              }
              point_values[static_cast<size_t>(point)] = sum;
          }
          const int64_t score_ways =
              interpolate(point_values, maximum[static_cast<size_t>(course)], factorial, inverse_factorial);
          vector<int64_t> next(static_cast<size_t>(student_count));
          for (int previous = 0; previous < student_count; ++previous) {
              if (dp[static_cast<size_t>(previous)] == 0) { continue; }
              for (int remaining = 0; remaining <= previous; ++remaining) {
                  const int lost = previous - remaining;
                  const int extra_high = ranking[static_cast<size_t>(course)] - 1 - lost;
                  if (extra_high < 0 || extra_high > student_count - 1 - previous) { continue; }
                  int64_t ways = combination[static_cast<size_t>(previous)][static_cast<size_t>(lost)] *
                                 combination[static_cast<size_t>(student_count - 1 - previous)]
                                            [static_cast<size_t>(extra_high)] %
                                 mod_value;
                  ways = ways * score_ways % mod_value * dp[static_cast<size_t>(previous)] % mod_value;
                  next[static_cast<size_t>(remaining)] =
                      (next[static_cast<size_t>(remaining)] + ways) % mod_value;
              }
          }
          dp.swap(next);
      }
      cout << dp[static_cast<size_t>(target)] << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P3270
external_platform: 洛谷
external_problem_id: P3270
external_title: '[JLOI2016] 成績比較'
external_relation: original
source_book_pages: [481, 485]
source_pdf_pages: [111, 115]
review_status: verified
---

集合交集大小的 DP 與單科分數多項式分離後，龐大的分數上限只剩一次插值查值。
