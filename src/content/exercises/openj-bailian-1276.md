---
id: openj-bailian-1276
volume: upper
source_file: upper-volume
title: OpenJudge 1276 Cash Machine
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 3
topics: [dynamic-programming, bounded-knapsack]
prerequisites: [zero-one-knapsack]
statement: >-
  提款機有 N 種鈔票，第 i 種面額 D_i、數量 n_i。給定需求上限 cash，求現有鈔票能組成且
  不超過 cash 的最大金額。
constraints:
  - 0 <= cash <= 100000
  - 0 <= N <= 10
  - 0 <= n_i <= 1000
  - 1 <= D_i <= 1000
  - 輸入有多組資料，讀到 EOF
input_format: 每組依序為 cash、N，接著 N 對 n_i、D_i；空白與換行位置任意。
output_format: 每組輸出一行可支付的最大金額。
samples:
  - input: |-
      735 3 4 125 6 5 3 350
      633 4 500 30 6 100 1 5 0 1
      735 0
      0 3 10 100 10 50 10 10
    output: |-
      735
      630
      0
      0
    explanation: 第一組可恰付 735；第二組無法恰付 633，最大可付 630；空機器或上限零皆為零。
core_knowledge: [有限背包可達性, 二進位分組]
judgment: 每張鈔票最多使用一次；只求不超過上限的最大可達金額，不要求恰好等於 cash。
hints:
  - 只需記錄 0..cash 每個金額是否可達。
  - 將同面額鈔票數量拆成 1、2、4、… 的若干組，每組成為一件 0/1 物品。
  - 以金額遞減更新，最後從 cash 向下找第一個可達值。
solution_outline: 對每種鈔票二進位分組後做布林 0/1 背包，再逆序尋找最大可達金額。
proof_or_invariant: >-
  二進位組能表示從零到 n_i 的每個張數且不會超量，因此拆分不改變可支付集合。每處理一組，
  遞減轉移使 reachable[s] 恰表示已處理組能否組成 s；不選與選該組涵蓋全部可能。
  全部處理後由上限向下找到的首個真值即最大合法金額。
common_errors: [把 n_i 與 D_i 讀反, 金額遞增導致分組重複使用, 只判斷 cash 是否可達]
complexity:
  time: O(cash * sum(log(n_i + 1)))
  space: O(cash)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int cash = 0, types = 0;
      while (cin >> cash >> types) {
          // TODO：讀入鈔票並完成有限背包。
          cout << cash - cash + types - types << '\n';
      }
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int cash = 0, types = 0;
      while (cin >> cash >> types) {
          vector<bool> reachable(static_cast<size_t>(cash + 1), false);
          reachable[0] = true;
          for (int type = 0; type < types; ++type) {
              int count = 0, denomination = 0;
              cin >> count >> denomination;
              for (int block = 1; count > 0; block *= 2) {
                  const int take = min(block, count);
                  const int value = take * denomination;
                  for (int sum = cash; sum >= value; --sum)
                      reachable[static_cast<size_t>(sum)] =
                          reachable[static_cast<size_t>(sum)] ||
                          reachable[static_cast<size_t>(sum - value)];
                  count -= take;
              }
          }
          int answer = cash;
          while (answer > 0 && !reachable[static_cast<size_t>(answer)]) --answer;
          cout << answer << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/1276/
external_platform: OpenJudge 百練
external_problem_id: '1276'
external_title: Cash Machine
external_relation: original
source_book_pages: [333]
source_pdf_pages: [351]
review_status: verified
---

有限鈔票只影響「每種可用幾張」；分組後就是一般的可達性 0/1 背包。
