---
id: luogu-p2600
volume: lower
source_file: lower-volume
title: 洛谷 P2600 瞭望塔：折線上方半平面
chapter: 8
section: '8.5'
kind: external-oj
difficulty: 4
topics: ['半平面', '上包絡', '三分搜尋']
prerequisites: ['直線方程', '凸函數', '三分搜尋']
statement: 一個村莊的上方輪廓是 x 座標嚴格遞增的折線。瞭望塔可建在 x_1 到 x_n 間的輪廓上，塔頂必須能看見輪廓的任意位置。求所有建造位置中所需塔身的最小高度。
constraints:
  - 'n <= 300'
  - '|x_i|, |y_i| <= 1000000'
  - 'x_1 < x_2 < ... < x_n'
input_format: 第一行為折線節點數 n；第二行有 n 個 x 座標；第三行有 n 個 y 座標。
output_format: 輸出最小塔高，保留小數點後三位。
samples:
  - input: |
      6
      1 2 4 5 6 7
      1 2 2 4 2 1
    output: |
      1.000
    explanation: 官方範例中可在適當輪廓位置建塔，使塔頂高於所有輪廓邊延長線所需的垂直差最小為 1。
core_knowledge:
  - 能看見整條 x 單調地形等價於塔頂在每條邊上方
  - 所有邊直線的上包絡是凸函數
  - 在單一地形線段上，所需高度是凸函數
judgment: n 僅 300。對每個可能承載塔基的折線段，地面高度是線性函數；塔頂最低可行高度是所有邊直線值的最大值。兩者之差為凸的分段線性函數，可在該段三分搜尋。
hints:
  - 若塔頂低於某條輪廓邊所在直線，視線無法越過該邊；所以在固定 x，最低塔頂 y 是全部邊直線值的最大值。
  - 塔基落在第 i 段時，地面 y 是該段直線值；所需高度為 max_j line_j(x)-line_i(x)。
  - 最大值包絡是凸函數，減去固定線性函數仍凸；在每個 [x_i,x_{i+1}] 三分後取全域最小。
solution_outline: 建立 n-1 條地形邊的斜率與截距。枚舉塔基所在邊，在其 x 區間做固定次數三分；每次 O(n) 計算所有邊直線的最大值減去當前地面線，更新全域答案。
proof_or_invariant: 對 x 單調折線，塔頂能看見每條邊的充要條件是位於該有向地形邊的上側，因此固定 x 的最低可行頂端是各邊支撐直線的上包絡 F(x)。當塔基位於第 i 段，塔高為 F(x)-L_i(x)。F 是線性函數最大值，故凸；減去線性 L_i 仍凸，三分可找到每段最小值。所有建造位置被各段聯集覆蓋，段最小再取最小即全域答案。
complexity:
  time: O(n²·I)，I 為固定三分迭代次數
  space: O(n)
common_errors:
  - 只要求塔頂高於折線頂點，未考慮整條邊的支撐直線
  - 塔高直接使用塔頂 y，忘記減去塔基處地面高度
  - 把上包絡誤認為凹函數而反向三分
  - 只在節點位置枚舉塔基，漏掉線段內最佳點
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：枚舉塔基所在折線段，三分最小化直線上包絡與地面的差。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Line {
      long double slope;
      long double intercept;
  };

  static long double value_at(const Line& line, long double x) {
      return line.slope * x + line.intercept;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<long double> x(static_cast<size_t>(n));
      vector<long double> y(static_cast<size_t>(n));
      for (long double& coordinate : x) { cin >> coordinate; }
      for (long double& coordinate : y) { cin >> coordinate; }
      vector<Line> lines;
      lines.reserve(static_cast<size_t>(n - 1));
      for (int i = 0; i + 1 < n; ++i) {
          const long double slope =
              (y[static_cast<size_t>(i + 1)] -
               y[static_cast<size_t>(i)]) /
              (x[static_cast<size_t>(i + 1)] -
               x[static_cast<size_t>(i)]);
          lines.push_back(
              {slope, y[static_cast<size_t>(i)] -
                          slope * x[static_cast<size_t>(i)]});
      }
      const auto required_height =
          [&lines](long double position, const Line& ground) {
              long double top = -numeric_limits<long double>::infinity();
              for (const Line& line : lines) {
                  top = max(top, value_at(line, position));
              }
              return top - value_at(ground, position);
          };
      long double answer = numeric_limits<long double>::infinity();
      for (int i = 0; i + 1 < n; ++i) {
          long double left = x[static_cast<size_t>(i)];
          long double right = x[static_cast<size_t>(i + 1)];
          const Line ground = lines[static_cast<size_t>(i)];
          for (int iteration = 0; iteration < 160; ++iteration) {
              const long double first = (2.0L * left + right) / 3.0L;
              const long double second = (left + 2.0L * right) / 3.0L;
              if (required_height(first, ground) <
                  required_height(second, ground)) {
                  right = second;
              } else {
                  left = first;
              }
          }
          answer =
              min(answer, required_height((left + right) / 2.0L, ground));
      }
      cout << fixed << setprecision(3) << answer << '\n';
  }
external_url: https://www.luogu.com.cn/problem/P2600
external_platform: 洛谷
external_problem_id: P2600
external_title: '[ZJOI2008] 瞭望塔'
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面、限制、範例與 URL 已依洛谷官方題面核實；敘述、證明與程式為本站獨立撰寫。
