---
id: luogu-p1216
volume: upper
source_file: upper-volume
title: 洛谷 P1216 數字三角形
chapter: 5
section: '5.2'
kind: external-oj
difficulty: 2
topics: [dynamic-programming, triangle-dp]
prerequisites: [dynamic-programming]
statement: 在 n 列數字三角形中從頂點出發，每步走到下一列左下或右下相鄰格，求抵達底列的最大路徑和。
constraints:
  - 1 <= n <= 1000
  - 0 <= value <= 99
input_format: 第一行為列數 n，接著第 i 列有 i 個整數。
output_format: 輸出最大路徑和。
samples:
  - input: |-
      5
      7
      3 8
      8 1 0
      2 7 4 4
      4 5 2 6 5
    output: '30'
    explanation: 路徑 7→3→8→7→5 的總和是 30，為所有頂端到底列路徑中的最大值。
core_knowledge: [數字三角形 DP, 自底向上]
judgment: 每一步只能選正下方相鄰的兩個子格之一，且必須走到最後一列。
hints:
  - 從倒數第二列往上看，每格只需知道兩個子格未來能取得的最大和。
  - 用一維陣列保存下一列答案，更新為 value+max(dp[j],dp[j+1])。
  - 自底向上處理後，dp[0] 就代表從頂點出發的全局最佳值。
solution_outline: 先存三角形，再從底列向上將每格加上兩個子格最佳值的較大者。
proof_or_invariant: >-
  處理到第 i 列時，每格保存從該格走到底列的最大總和。任何合法路徑第一步只能走向兩個子格之一，
  所以本格最佳值是本格數字加兩個子問題最大值；任一選擇也都可形成合法路徑。底列基底顯然正確，
  向上歸納後頂點值即答案。
common_errors: [漏算頂點或底列數字, 子格索引越界, 把最大值誤寫成最小值]
complexity:
  time: O(n^2)
  space: O(n^2)
cpp_skeleton: |
  #include <iostream>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      // TODO：自底向上合併兩個子格的最佳答案。
      cout << n - n << '\n';
  }
cpp_solution: |
  #include <algorithm>
  #include <iostream>
  #include <vector>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n = 0; cin >> n;
      vector<vector<int>> triangle(static_cast<size_t>(n));
      for (int row = 0; row < n; ++row) {
          triangle[static_cast<size_t>(row)].resize(static_cast<size_t>(row + 1));
          for (int& value : triangle[static_cast<size_t>(row)]) cin >> value;
      }
      for (int row = n - 2; row >= 0; --row)
          for (int column = 0; column <= row; ++column)
              triangle[static_cast<size_t>(row)][static_cast<size_t>(column)] +=
                  max(triangle[static_cast<size_t>(row + 1)][static_cast<size_t>(column)],
                      triangle[static_cast<size_t>(row + 1)][static_cast<size_t>(column + 1)]);
      cout << triangle[0][0] << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P1216
external_platform: 洛谷
external_problem_id: P1216
external_title: 数字三角形 Number Triangles
external_relation: original
source_book_pages: [332]
source_pdf_pages: [350]
review_status: verified
---

自底向上時，每格只需保留「從這裡出發的最佳後綴」，不必記錄完整路徑。
