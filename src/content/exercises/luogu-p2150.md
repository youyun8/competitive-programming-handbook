---
id: luogu-p2150
volume: upper
source_file: upper-volume
title: 洛谷 P2150 壽司晚宴
chapter: 5
section: '5.4'
kind: external-oj
difficulty: 5
topics: [state-compression-dp, number-theory, square-root-decomposition]
prerequisites: [prime-factorization, bitmask-dp]
statement: >-
  有美味度 2..n 的各一種壽司。小 G、小 W 可各選任意互不重複種類，也可不選；要求任取
  G 的一個數與 W 的一個數都互質。求有序選擇方案數模 p。
constraints:
  - 2 <= n <= 500
  - 1 <= p <= 1000000000
input_format: 一行 n、p。
output_format: 輸出和諧方案數模 p。
samples:
  - input: '4 10000'
    output: '21'
    explanation: 將 2、3、4 各自分給 G、W 或不選，排除兩人分別持有有共同質因數種類的方案後共 21 種。
core_knowledge: [質因數集合互斥, 小質數遮罩, 大質因數分組]
judgment: 同一壽司種類不可兩人同時選；集合內部不要求兩兩互質，只要求兩人集合之間互質。
hints:
  - 只要兩人的所有質因數集合不相交，任意跨集合兩數就互質。
  - 壓縮 2..19 八個小質數；不超過 500 的整數至多含一個大於 19 的質因數。
  - 含同一大質因數的一整組數只能由同一人取得；分別計算「只准 G 取」與「只准 W 取」再容斥合併。
solution_outline: 分解 2..n 並按大質因數分組，以兩個 8 位遮罩記雙方小質因數；每組做單側 0/1 轉移後合併。
proof_or_invariant: 狀態兩遮罩互斥等價於兩人不共享任何小質因數。同一大質因數組若兩邊都選便衝突，合法方案必屬於「此組只由 G 選」或「只由 W 選」，兩類交集正是整組不選，故 fG+fW-f 完整且不重。每個數只有一個大質因數，分組彼此獨立；歸納處理全部組後加總所有互斥狀態即答案。
common_errors: [要求每人集合內也互質, 同一大質因數組允許兩人各取, 合併兩側DP時未減整組不選]
complexity:
  time: O(n * 2^16)
  space: O(2^16)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n = 0, mod = 0; cin >> n >> mod; /* TODO：質因數分組狀壓 DP。 */ cout << 0 << '\n'; }
cpp_solution: |
  #include <algorithm>
  #include <array>
  #include <iostream>
  #include <vector>
  using namespace std;
  struct Number { int small_mask; int large_prime; };
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0, mod = 0; cin >> n >> mod;
      constexpr array<int, 8> small_prime{2, 3, 5, 7, 11, 13, 17, 19};
      vector<Number> number;
      for (int value = 2; value <= n; ++value) {
          int remaining = value, mask = 0;
          for (int i = 0; i < 8; ++i)
              if (remaining % small_prime[static_cast<size_t>(i)] == 0) {
                  mask |= 1 << i;
                  while (remaining % small_prime[static_cast<size_t>(i)] == 0)
                      remaining /= small_prime[static_cast<size_t>(i)];
              }
          number.push_back({mask, remaining});
      }
      sort(number.begin(), number.end(), [](const Number& left, const Number& right) {
          return left.large_prime < right.large_prime;
      });
      constexpr int masks = 1 << 8;
      vector<int> dp(static_cast<size_t>(masks * masks), 0);
      const auto index = [](int first, int second) { return first * masks + second; };
      dp[0] = 1 % mod;
      size_t begin = 0;
      while (begin < number.size()) {
          size_t end = begin + 1;
          if (number[begin].large_prime != 1)
              while (end < number.size() &&
                     number[end].large_prime == number[begin].large_prime) ++end;
          vector<int> first = dp, second = dp;
          for (size_t item = begin; item < end; ++item) {
              const int add_mask = number[item].small_mask;
              for (int left = masks - 1; left >= 0; --left)
                  for (int right = masks - 1; right >= 0; --right) {
                      if ((left & right) != 0) continue;
                      if ((add_mask & right) == 0) {
                          int& target = first[static_cast<size_t>(index(left | add_mask, right))];
                          target = static_cast<int>((static_cast<long long>(target) +
                                                     first[static_cast<size_t>(index(left, right))]) % mod);
                      }
                      if ((add_mask & left) == 0) {
                          int& target = second[static_cast<size_t>(index(left, right | add_mask))];
                          target = static_cast<int>((static_cast<long long>(target) +
                                                     second[static_cast<size_t>(index(left, right))]) % mod);
                      }
                  }
          }
          for (int left = 0; left < masks; ++left)
              for (int right = 0; right < masks; ++right) {
                  const int position = index(left, right);
                  dp[static_cast<size_t>(position)] =
                      static_cast<int>((static_cast<long long>(first[static_cast<size_t>(position)]) +
                                        second[static_cast<size_t>(position)] -
                                        dp[static_cast<size_t>(position)] + mod) % mod);
              }
          begin = end;
      }
      int answer = 0;
      for (int left = 0; left < masks; ++left)
          for (int right = 0; right < masks; ++right)
              if ((left & right) == 0)
                  answer = static_cast<int>((static_cast<long long>(answer) +
                                             dp[static_cast<size_t>(index(left, right))]) % mod);
      cout << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2150
external_platform: 洛谷
external_problem_id: P2150
external_title: 寿司晚宴
external_relation: original
source_book_pages: [360]
source_pdf_pages: [378]
review_status: verified
---

小質數用雙遮罩，大質數按組限制只能交給同一人，兩層結構恰好覆蓋全部質因數。
