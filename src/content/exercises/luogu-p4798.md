---
id: luogu-p4798
volume: upper
source_file: upper-volume
title: 洛谷 P4798 卡爾文球錦標賽
chapter: 5
section: '5.3'
kind: external-oj
difficulty: 4
topics: [dynamic-programming, lexicographic-ranking, set-partition]
prerequisites: [counting-dp]
statement: n 位依序編號的選手被分成若干非空隊伍；隊伍依其最小編號成員排序並從 1 編號，因此記錄序列滿足 a_1=1 且 a_i 不超過此前最大值加一。所有合法記錄按字典序使用，求給定記錄是第幾天，模 1,000,007。
constraints:
  - 1 <= n <= 10000
  - 輸入保證記錄合法
input_format: 第一行 n；第二行 n 個隊伍編號。
output_format: 輸出一基字典序排名模 1,000,007。
samples:
  - input: |-
      3
      1 2 1
    output: '3'
    explanation: 前三個合法記錄依序為 1 1 1、1 1 2、1 2 1。
core_knowledge: [限制增長字串, 後綴方案計數, 字典序排名]
judgment: 新隊只能使用「此前最大隊號加一」；排名從一開始。
hints:
  - 若前綴已有 k 隊，下一人可加入 k 個舊隊之一，或建立唯一的新隊。
  - F[r][k] 表示已有 k 隊、尚有 r 人時的方案數，滿足 F[r][k]=kF[r-1][k]+F[r-1][k+1]。
  - 在位置 i 選任何小於 a_i 的合法值都不增加目前最大隊號，且每種選擇有相同後綴方案數。
solution_outline: 以滾動陣列依後綴長度計算 F，從右向左累加每個首個較小位置的方案數。
proof_or_invariant: F 的兩項分別對應下一人加入既有隊與建立新隊，完整且互斥。比給定記錄小的合法序列有唯一首個不同位置；該處可選 a_i-1 個較小正整數，之後任意合法完成，其數量為 F。逐位置累加後再加原記錄本身，即為一基排名。
common_errors: [把模數寫成十億零七, 忘記排名加一, 新建隊時仍用原k計算後綴]
complexity:
  time: O(n^2)
  space: O(n)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() { int n = 0; cin >> n; /* TODO：滾動計算後綴完成數。 */ cout << 1 << '\n'; }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      constexpr int mod = 1000007;
      int n = 0; cin >> n;
      vector<int> team(static_cast<size_t>(n + 1));
      vector<int> maximum(static_cast<size_t>(n + 1), 0);
      for (int i = 1; i <= n; ++i) {
          cin >> team[static_cast<size_t>(i)];
          maximum[static_cast<size_t>(i)] =
              max(maximum[static_cast<size_t>(i - 1)], team[static_cast<size_t>(i)]);
      }
      vector<int> ways(static_cast<size_t>(n + 2), 1);
      vector<int> next(static_cast<size_t>(n + 2), 0);
      long long rank = 1;
      for (int position = n; position >= 2; --position) {
          rank = (rank + static_cast<long long>(team[static_cast<size_t>(position)] - 1) *
                         ways[static_cast<size_t>(maximum[static_cast<size_t>(position - 1)])]) % mod;
          for (int groups = 1; groups <= n; ++groups)
              next[static_cast<size_t>(groups)] =
                  static_cast<int>((static_cast<long long>(groups) *
                                    ways[static_cast<size_t>(groups)] +
                                    ways[static_cast<size_t>(groups + 1)]) % mod);
          ways.swap(next);
      }
      cout << rank << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P4798
external_platform: 洛谷
external_problem_id: P4798
external_title: 卡尔文球锦标赛
external_relation: original
source_book_pages: [334]
source_pdf_pages: [352]
review_status: verified
---

合法隊伍記錄就是限制增長字串；排名可按首個較小位置拆解。
