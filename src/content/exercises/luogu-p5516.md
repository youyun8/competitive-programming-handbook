---
id: luogu-p5516
volume: lower
source_file: lower-volume
source_book_pages: [422]
source_pdf_pages: [52]
title: 'Luogu P5516 [MtOI2019] 小鈴的煩惱'
chapter: 6
section: '6.4'
kind: external-oj
difficulty: 4
topics: [期望, 三對角方程]
prerequisites: [全期望公式, 高斯消去]
statement: 給一列帶大寫字母屬性的書。每次等機率選有序且相異的兩本 a、b，再以 p[a][b] 的機率把 b 的屬性改成 a；求所有屬性相同前的期望操作次數。
constraints:
  - '1 <= n <= 2000'
  - '0 < p[a][b] <= 1'
  - '所有 p[a][b] 的總和為 n^2'
input_format: 第一行為屬性字串；接著 n 行各 n 個實數。
output_format: 輸出期望，四捨五入至小數點後一位。
samples:
  - input: |
      A
      1
    output: |
      0.0
    explanation: 開始時所有書的屬性已相同，不需操作。
core_knowledge:
  - 吸收馬可夫鏈
  - 三對角線性方程
judgment: 由 p 不大於 1 且 n² 項總和為 n²，推出所有 p 都是 1。追蹤任一最終屬性的本數，建立只在 i-1、i、i+1 間轉移的期望方程，線性消去後回代。
hints:
  - 先利用機率總和條件，判斷輸入矩陣實際上有多少自由度。
  - 固定一種屬性，令 f[i] 為目前有 i 本該屬性時到吸收的期望。
  - 方程只有相鄰三項；前向消去與反向回代即可，不必做 O(n³) 高斯消去。
solution_outline: 對 i=1..n-1 建立三對角方程；維護消去後 f[i] 對 f[i+1] 的係數與常數。由 f[n]=0 回代。答案是各初始屬性成為最終屬性的機率 cnt/n，乘 f[cnt] 的總和。
proof_or_invariant: 每次有效有序選擇使指定屬性的數目增一或減一，兩者機率皆為 i(n-i)/(n(n-1))，其餘為自環。全期望公式即得到所列三對角方程。消去保持方程組等價；吸收狀態 f[n]=0 唯一決定全部 f。對最終屬性依互斥事件作全期望，得到加權總和。
complexity:
  time: O(n²)
  space: O(n)
common_errors:
  - 未由總和條件推出所有 p 均為 1
  - n=1 時除以 n-1
  - 忘記按照 cnt/n 對各初始屬性加權
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
    // TODO：讀入矩陣，推導三對角方程並回代。
    return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    string s;
    cin >> s;
    const int n = static_cast<int>(s.size());
    double ignored = 0.0;
    for (int i = 0; i < n; ++i) {
      for (int j = 0; j < n; ++j) cin >> ignored;
    }
    if (n == 1) {
      cout << "0.0\n";
      return 0;
    }
    array<int, 26> count{};
    for (char c : s) ++count[static_cast<size_t>(c - 'A')];
    vector<double> coefficient(static_cast<size_t>(n), 0.0);
    vector<double> constant(static_cast<size_t>(n), 0.0);
    vector<double> expected(static_cast<size_t>(n + 1), 0.0);
    coefficient[1] = 1.0;
    for (int i = 1; i < n; ++i) {
      constant[static_cast<size_t>(i)] =
          -static_cast<double>(n) * (n - 1) /
          (2.0 * i * (n - i));
    }
    for (int i = 2; i < n; ++i) {
      const double left = static_cast<double>(i - 1) / (2.0 * i);
      constant[static_cast<size_t>(i)] +=
          left * constant[static_cast<size_t>(i - 1)];
      const double divisor =
          1.0 - left * coefficient[static_cast<size_t>(i - 1)];
      coefficient[static_cast<size_t>(i)] =
          (static_cast<double>(i + 1) / (2.0 * i)) / divisor;
      constant[static_cast<size_t>(i)] /= divisor;
    }
    for (int i = n - 1; i >= 1; --i) {
      expected[static_cast<size_t>(i)] =
          coefficient[static_cast<size_t>(i)] *
              expected[static_cast<size_t>(i + 1)] -
          constant[static_cast<size_t>(i)];
    }
    double answer = 0.0;
    for (int value : count) {
      answer += static_cast<double>(value) / n *
                expected[static_cast<size_t>(value)];
    }
    cout << fixed << setprecision(1) << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P5516
external_platform: Luogu
external_problem_id: P5516
external_title: '[MtOI2019] 小鈴的煩惱'
external_relation: original
review_status: verified
---

題目的機率矩陣條件會把一般模型化簡成均勻 voter model；真正的計算核心是一維吸收鏈。
