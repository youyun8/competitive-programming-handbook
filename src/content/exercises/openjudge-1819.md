---
id: openjudge-1819
volume: lower
source_file: lower-volume
title: OpenJudge 1819 Disks：圓盤支撐依賴
chapter: 8
section: '8.7'
kind: external-oj
difficulty: 5
topics: ['相切圓', '最長路徑 DAG', '支配點']
prerequisites: ['圓的相切', 'DAG 動態規劃', '位元集合']
statement: 依序放置 N 個半徑已知的圓盤。每個圓盤先在 x 軸上方且與 x 軸相切，再水平向左推，直到碰到 y 軸或先前某圓盤。若刪除某圓盤後配置總寬不變，該圓盤可省略。輸出所有可省略圓盤的原順序編號。
constraints:
  - 'N <= 1000'
  - 半徑為浮點數
  - 圓盤依輸入順序固定
input_format: 第一行為圓盤數 N，接著 N 行各有一個圓盤半徑。
output_format: 第一行輸出可省略圓盤數 K；接著 K 行依遞增順序輸出其 1-based 編號。
samples:
  - input: |
      7
      4
      0.1
      0.5
      3
      0.5
      4
      1
    output: |
      3
      2
      3
      5
    explanation: 官方範例的最右邊界可由圓盤 1→4→6→7 的相切支撐鏈達成；2、3、5 不位於所有最大寬度支撐路徑上，刪除任一都不改變總寬。
core_knowledge:
  - 兩個同時與 x 軸相切的圓之水平圓心距
  - 配置位置是 DAG 最長路徑值
  - 必不可少圓盤是所有最長路徑的共同頂點
judgment: 令圓盤 i 圓心為 (x_i,r_i)。它碰到先前 j 時需 x_i=x_j+2sqrt(r_i r_j)，碰 y 軸時 x_i=r_i；因此 x_i 是所有候選最大值。總寬是再加 r_i 的最大值，而不可省略者正是源到最大寬終點所有緊邊路徑的共同點。
hints:
  - 兩相切圓的圓心距為 r_i+r_j，垂直差為 |r_i-r_j|；用畢氏定理化簡水平差。
  - 把 y 軸當共同源點。對每個 i，所有達到 x_i 最大值的先前圓都是「緊前驅」，形成按編號向前的 DAG。
  - 對每個節點維護所有源到該點緊路徑都經過的圓盤集合：它等於全部前驅集合的交集再加入自己；最後再對所有達到最大右邊界的圓取交集。
solution_outline: O(N²) 計算每個圓心 x 及全部緊前驅。以 64 位元區塊表示支配集合，按編號取前驅支配集合交集並加入自身；對所有最大 x_i+r_i 的終點再取交集。不在最終交集中的圓即依序輸出。
proof_or_invariant: 每個圓盤位置等於從 y 軸源點到 i 的最大權路徑值，因最後一步不是直接碰牆，就是由某先前圓的相切距離延伸；緊前驅恰保留所有能實現此最大值的最後一步。歸納地，支配集合的前驅交集加自身正是每條最大路徑都經過的頂點。刪除圓 k 後總寬不變當且僅當至少一條原最大寬路徑避開 k；故最終所有最大終點支配集合的交集恰為不可省略圓盤。
complexity:
  time: O(N² + N³/64)
  space: O(N²)
common_errors:
  - 相切水平距離誤寫成 r_i+r_j
  - 只記一個支撐圓，遇到並列最優時誤判不可省略
  - 只找最右圓盤而未比較 x_i+r_i
  - 用刪除每一圓後重新模擬的 O(N³) 作法
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：建立所有緊支撐邊，求最大寬路徑的共同圓盤。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static bool equal_value(long double a, long double b) {
      const long double scale = max(1.0L, max(fabsl(a), fabsl(b)));
      return fabsl(a - b) <= 1e-12L * scale;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<long double> radius(static_cast<size_t>(n + 1));
      vector<long double> center_x(static_cast<size_t>(n + 1));
      vector<vector<int>> predecessors(static_cast<size_t>(n + 1));
      for (int i = 1; i <= n; ++i) {
          cin >> radius[static_cast<size_t>(i)];
          long double best = radius[static_cast<size_t>(i)];
          for (int j = 1; j < i; ++j) {
              best = max(best,
                         center_x[static_cast<size_t>(j)] +
                             2.0L * sqrtl(radius[static_cast<size_t>(i)] *
                                          radius[static_cast<size_t>(j)]));
          }
          center_x[static_cast<size_t>(i)] = best;
          if (equal_value(best, radius[static_cast<size_t>(i)])) {
              predecessors[static_cast<size_t>(i)].push_back(0);
          }
          for (int j = 1; j < i; ++j) {
              const long double candidate =
                  center_x[static_cast<size_t>(j)] +
                  2.0L * sqrtl(radius[static_cast<size_t>(i)] *
                               radius[static_cast<size_t>(j)]);
              if (equal_value(best, candidate)) {
                  predecessors[static_cast<size_t>(i)].push_back(j);
              }
          }
      }

      const size_t block_count = static_cast<size_t>(n + 64) / 64U;
      vector<vector<unsigned long long>> dominators(
          static_cast<size_t>(n + 1),
          vector<unsigned long long>(block_count, 0ULL));
      dominators[0][0] = 1ULL;
      for (int i = 1; i <= n; ++i) {
          vector<unsigned long long> common(block_count, ~0ULL);
          for (const int predecessor : predecessors[static_cast<size_t>(i)]) {
              for (size_t block = 0; block < block_count; ++block) {
                  common[block] &=
                      dominators[static_cast<size_t>(predecessor)][block];
              }
          }
          common[static_cast<size_t>(i) / 64U] |=
              1ULL << (static_cast<unsigned int>(i) % 64U);
          dominators[static_cast<size_t>(i)] = move(common);
      }

      long double maximum_width = 0.0L;
      for (int i = 1; i <= n; ++i) {
          maximum_width =
              max(maximum_width, center_x[static_cast<size_t>(i)] +
                                     radius[static_cast<size_t>(i)]);
      }
      vector<unsigned long long> indispensable(block_count, ~0ULL);
      for (int i = 1; i <= n; ++i) {
          if (equal_value(center_x[static_cast<size_t>(i)] +
                              radius[static_cast<size_t>(i)],
                          maximum_width)) {
              for (size_t block = 0; block < block_count; ++block) {
                  indispensable[block] &=
                      dominators[static_cast<size_t>(i)][block];
              }
          }
      }
      vector<int> dispensable;
      for (int i = 1; i <= n; ++i) {
          const bool required =
              ((indispensable[static_cast<size_t>(i) / 64U] >>
                (static_cast<unsigned int>(i) % 64U)) &
               1ULL) != 0ULL;
          if (!required) { dispensable.push_back(i); }
      }
      cout << dispensable.size() << '\n';
      for (const int index : dispensable) { cout << index << '\n'; }
  }
external_url: http://bailian.openjudge.cn/practice/1819/
external_platform: OpenJudge 百練
external_problem_id: '1819'
external_title: Disks
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面資訊依外部 OJ 頁面核實；敘述、證明與程式為本站獨立撰寫。
