---
id: luogu-p2518
volume: upper
source_file: upper-volume
title: 洛谷 P2518 計數
chapter: 5
section: '5.3'
kind: external-oj
difficulty: 3
topics: [combinatorics, multiset-permutation, ranking]
prerequisites: [binomial-coefficient]
statement: 給一個不含前導零的整數。將它的全部數位任意重排；排列開頭的零不顯示。求能形成多少個互不相同且小於原數的整數。
constraints:
  - 輸入長度不超過 50
  - 答案不超過 2^63-1
input_format: 一行整數字串。
output_format: 輸出可形成且小於原數的不同整數個數。
samples:
  - input: '1020'
    output: '7'
    explanation: 可形成 12、21、102、120、201、210、1002，共七個。
core_knowledge: [可重集合排列數, 字典序排名]
judgment: 所有原數位都必須使用；開頭零省略，重複數位交換不產生新方案。
hints:
  - 把結果補足相同數量的前導零後，數值大小等同固定長度字串的字典序。
  - 從高位到低位，枚舉此位放一個仍有剩餘且小於原位的數字。
  - 固定該位後，後綴不同排列數為 r! 除以各數位剩餘數量階乘，可用連續二項係數相乘。
solution_outline: 預處理 0 到 50 的組合數，逐位計算可重集合排列的零基字典序排名。
proof_or_invariant: 在第一個不同位置放較小數位的排列一定小於原數，且不同第一差異位置互斥。固定該位置與數位後，剩餘可重集合的每個排列恰對應一個不同後綴，數量由多項式係數給出。逐位累加所有較小選擇，再消耗原位數字，故不重不漏地得到原排列之前的全部排列數。
common_errors: [禁止首位選零而漏掉較短結果, 把重複數位視為不同, 把原數本身也加進答案]
complexity:
  time: O(10n)
  space: O(n^2)
cpp_skeleton: |
  #include <iostream>
  #include <string>
  using namespace std;
  int main() { string number; cin >> number; /* TODO：計算可重集合排列排名。 */ cout << 0 << '\n'; }
cpp_solution: |
  #include <array>
  #include <iostream>
  #include <string>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      string number; cin >> number;
      const int n = static_cast<int>(number.size());
      array<array<unsigned long long, 51>, 51> choose{};
      for (int i = 0; i <= 50; ++i) {
          choose[static_cast<size_t>(i)][0] = 1;
          choose[static_cast<size_t>(i)][static_cast<size_t>(i)] = 1;
          for (int j = 1; j < i; ++j)
              choose[static_cast<size_t>(i)][static_cast<size_t>(j)] =
                  choose[static_cast<size_t>(i - 1)][static_cast<size_t>(j - 1)] +
                  choose[static_cast<size_t>(i - 1)][static_cast<size_t>(j)];
      }
      array<int, 10> count{};
      for (char digit : number) ++count[static_cast<size_t>(digit - '0')];
      const auto permutations = [&choose](const array<int, 10>& amount, int remaining) {
          unsigned long long ways = 1;
          int slots = remaining;
          for (int digit = 0; digit < 10; ++digit) {
              ways *= choose[static_cast<size_t>(slots)]
                            [static_cast<size_t>(amount[static_cast<size_t>(digit)])];
              slots -= amount[static_cast<size_t>(digit)];
          }
          return ways;
      };
      unsigned long long answer = 0;
      for (int position = 0; position < n; ++position) {
          const int current = number[static_cast<size_t>(position)] - '0';
          for (int digit = 0; digit < current; ++digit)
              if (count[static_cast<size_t>(digit)] > 0) {
                  --count[static_cast<size_t>(digit)];
                  answer += permutations(count, n - position - 1);
                  ++count[static_cast<size_t>(digit)];
              }
          --count[static_cast<size_t>(current)];
      }
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2518
external_platform: 洛谷
external_problem_id: P2518
external_title: 计数
external_relation: original
source_book_pages: [332]
source_pdf_pages: [350]
review_status: verified
---

允許前導零後，題目就是原數位可重集合排列的字典序排名。
