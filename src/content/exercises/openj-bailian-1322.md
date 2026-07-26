---
id: openj-bailian-1322
volume: lower
source_file: lower-volume
title: OpenJudge 1322 巧克力配對消除機率
chapter: 7
section: '7.8'
kind: external-oj
difficulty: 4
topics: [probability-dp, markov-chain]
prerequisites: [generating-functions]
statement: 有 C 種等機率顏色，每次獨立抽一顆放上桌；若桌上已有同色一顆，兩顆立即吃掉。求抽 N 次後桌上恰有 M 顆的機率。
constraints: [0 <= C <= 100, 0 <= N <= 1000000, 0 <= M <= 1000000]
input_format: 每行 C、N、M；單獨一個 0 結束。
output_format: 每筆機率四捨五入到小數點後三位。
samples:
  - input: |-
      5 100 2
      0
    output: '0.625'
    explanation: 對五種顏色的奇偶出現狀態做 100 次轉移，桌上兩顆的總機率四捨五入為 0.625。
core_knowledge: [以目前奇數次顏色數壓縮狀態, 生滅鏈機率轉移]
judgment: 每種顏色桌上至多留一顆，因此桌上顆數不超過 C，且與 N 同奇偶。
hints:
  - 桌上有 j 顆等價於恰有 j 種顏色被抽過奇數次。
  - 下一顆命中既有顏色的機率為 j/C，狀態降到 j-1；否則升到 j+1。
  - 只保留兩層 DP；N 很大時鏈已在三位小數精度內收斂，可保留 N 奇偶並截至 1000/1001。
solution_outline: 先排除 M>C、M>N 或奇偶不符。令 steps=min(N,1000+N%2)，從 dp[0]=1 逐步做出生/死亡轉移，輸出 dp[M]。
proof_or_invariant: 每色出現偶數次時桌上無該色，奇數次時有一顆，所以 j 足以描述狀態。從 j 出發，C-j 種未留在桌上的顏色令 j+1，j 種已存在顏色令 j-1，轉移機率總和為一。此有限不可約二週期鏈在各自奇偶類快速收斂；1000 步後誤差遠低於題目三位小數門檻。
common_errors: [忽略 N 與 M 奇偶必須相同, 轉移時原地覆寫同一層, 輸出精度不是三位]
complexity: { time: 'O(C min(N,1001)) per case', space: 'O(C)' }
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int colors; while (cin >> colors && colors != 0) { /* TODO: 機率 DP。 */ } }
cpp_solution: |
  #include <algorithm>
  #include <iomanip>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int colors;
      while (cin >> colors && colors != 0) {
          int draws, remaining;
          cin >> draws >> remaining;
          if (remaining > colors || remaining > draws || ((remaining ^ draws) & 1) != 0) {
              cout << "0.000\n";
              continue;
          }
          const int steps = draws > 1000 ? 1000 + draws % 2 : draws;
          vector<double> current(static_cast<size_t>(colors) + 2U);
          vector<double> next(static_cast<size_t>(colors) + 2U);
          current[0] = 1.0;
          for (int step = 0; step < steps; ++step) {
              fill(next.begin(), next.end(), 0.0);
              for (int count = 0; count <= colors; ++count) {
                  if (count < colors)
                      next[static_cast<size_t>(count + 1)] +=
                          current[static_cast<size_t>(count)] *
                          static_cast<double>(colors - count) / static_cast<double>(colors);
                  if (count > 0)
                      next[static_cast<size_t>(count - 1)] +=
                          current[static_cast<size_t>(count)] *
                          static_cast<double>(count) / static_cast<double>(colors);
              }
              current.swap(next);
          }
          cout << fixed << setprecision(3) << current[static_cast<size_t>(remaining)] + 1e-12 << '\n';
      }
      return 0;
  }
external_url: http://bailian.openjudge.cn/practice/1322/
external_platform: OpenJudge 百練
external_problem_id: '1322'
external_title: Chocolate
external_relation: original
source_book_pages: [500]
source_pdf_pages: [130]
review_status: verified
---

顏色集合有 2^C 個狀態，但對稱性使轉移只依賴奇數次顏色的數量。
