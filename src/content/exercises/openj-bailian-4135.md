---
id: openj-bailian-4135
volume: upper
source_file: upper-volume
title: OpenJudge 4135 月度開銷
chapter: 2
section: '2.3'
kind: external-oj
difficulty: 2
topics: ['答案二分', '貪心', '連續分段']
prerequisites: ['二分搜尋', '陣列']
statement: |-
  已知接下來 N 天每天的開銷，要依原順序把所有天分成連續的 M 個非空財政月份，每天恰屬一個月份。求一種分法，使所有月份中最大的開銷總和盡可能小，並輸出這個最小值。
constraints:
  - '1 ≤ M ≤ N ≤ 100000'
  - '1 ≤ 每日開銷 ≤ 10000'
input_format: 第一行輸入 N、M，接下來 N 行依序各輸入一天的開銷。
output_format: 輸出最大月度開銷能達到的最小值。
samples:
  - input: |
      7 5
      100
      400
      300
      100
      500
      101
      400
    output: |
      500
    explanation: 可分成 [100,400]、[300,100]、[500]、[101]、[400]，各月最大值為 500；任何上限低於單日開銷 500 都不可能。
core_knowledge:
  - '最大分段和的下界是最大單項，上界是總和'
  - '固定上限後，以貪心求所需最少段數'
  - '可行性對上限具有單調性'
judgment: '直接枚舉切點組合數過大；但給定月度上限後，能在線性時間判斷是否可在至多 M 段完成，適合答案二分。'
hints:
  - '答案不可能小於哪一天的開銷？把所有天放同一段又給出什麼上界？'
  - '固定上限 limit，從左到右盡量把更多天放進當月；放不下時才開始下一月。'
  - '若貪心得到的最少月份數不超過 M，limit 可行；對 [max_day,total] 二分第一個可行值。至多 M 段可再切成恰好 M 段。'
solution_outline: 搜尋區間設為最大單日開銷到總開銷。檢查 limit 時從第一天開始累加；若加入下一天會超過 limit，就增加月份數並以該天開新月。所需月份不超過 M 表示可行。以 lower_bound 形式二分最小可行 limit。
proof_or_invariant: '固定 limit 時，貪心的每一月都取不超限的最長前綴。任何合法分法的第一月不可能比它涵蓋更多天；移除第一月後重複此論證，可知貪心使用的月份數最少。因此其段數≤M 當且僅當存在至多 M 段分法。每日開銷為正，任何至多 M 段分法都能繼續切割至恰 M 個非空段而不增加最大段和。可行性隨 limit 增大保持成立，二分所得即最小可行答案。'
common_errors:
  - '二分下界設為 0，卻未處理單日開銷已超過 limit'
  - '用 int 儲存總和；最壞可達 10^9，雖仍可容納但邊界運算容易溢位'
  - '檢查時要求貪心段數恰等於 M；正確條件是至多 M'
  - '加入元素後才判斷超限，卻忘記把該元素放入新月份'
complexity:
  time: 'O(N log S)，S 為所有開銷總和'
  space: 'O(N)'
cpp_skeleton: |
  #include <algorithm>
  #include <iostream>
  #include <numeric>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n = 0;
      int month_limit = 0;
      cin >> n >> month_limit;
      vector<long long> expenses(static_cast<size_t>(n));
      for (long long& expense : expenses) { cin >> expense; }
      long long low = *max_element(expenses.begin(), expenses.end());
      long long high = accumulate(expenses.begin(), expenses.end(), 0LL);
      // TODO：二分最小可行月度上限，並以貪心計算所需最少月份。
      (void)month_limit;
      (void)low;
      cout << high << '\n';
      return 0;
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <numeric>
  #include <vector>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n = 0;
      int month_limit = 0;
      cin >> n >> month_limit;
      vector<long long> expenses(static_cast<size_t>(n));
      for (long long& expense : expenses) { cin >> expense; }

      const auto is_feasible = [&](long long limit) {
          int month_count = 1;
          long long current_sum = 0;
          for (const long long expense : expenses) {
              if (current_sum + expense > limit) {
                  ++month_count;
                  current_sum = expense;
              } else {
                  current_sum += expense;
              }
          }
          return month_count <= month_limit;
      };

      long long low = *max_element(expenses.begin(), expenses.end());
      long long high = accumulate(expenses.begin(), expenses.end(), 0LL);
      while (low < high) {
          const long long middle = low + (high - low) / 2;
          if (is_feasible(middle)) {
              high = middle;
          } else {
              low = middle + 1;
          }
      }
      cout << low << '\n';
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/4135/
external_platform: OpenJ_Bailian
external_problem_id: '4135'
external_title: 月度开销
external_relation: original
source_book_pages: [43]
source_pdf_pages: [61]
review_status: verified
---

將「最小化最大值」改寫成單調可行性判斷，是答案二分的典型模型。
