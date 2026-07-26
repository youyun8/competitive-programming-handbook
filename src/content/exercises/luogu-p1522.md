---
id: luogu-p1522
volume: lower
source_file: lower-volume
original_label: 洛谷 P1522
title: 洛谷 P1522 Cow Tours：連接兩分量後的最小直徑
chapter: 10
section: '10.8'
kind: external-oj
difficulty: 3
topics: [Floyd-Warshall, 圖直徑, 幾何距離]
prerequisites: [dijkstra]
core_knowledge: [全源最短路, 點離心率, 分量直徑]
judgment: 新邊跨越兩個不同連通分量；候選直徑由兩端離心率與新邊長組成。
statement: 給定牧場座標及既有無向道路，新增一條連接不同牧區的道路，使合併後牧區直徑最小。
constraints: ['點以座標給定', '鄰接矩陣描述道路']
input_format: 第一行 n，接著 n 個座標與 n 行 0/1 鄰接字串。
output_format: 輸出最小可能直徑，保留六位小數。
samples:
  - input: |-
      4
      0 0
      0 1
      3 0
      3 1
      0100
      1000
      0001
      0010
    output: '5.000000'
    explanation: 兩個分量各是一條長 1 的線段；連接同側端點距離 3，合併後最遠兩點距離為 1+3+1=5。
hints:
  - Floyd 求出同一分量內任兩點最短距離。
  - eccentricity[i] 是 i 到同分量最遠點的距離。
  - 枚舉不可達點對 i、j，候選為 max(原分量直徑, ecc[i]+歐氏距離+ecc[j])。
solution_outline: 建立歐氏邊權並 Floyd；求各點離心率和原圖各分量最大直徑，枚舉跨分量新邊取最小候選。
proof_or_invariant: 加邊後，未跨新邊的路徑受原直徑界定；跨新邊的最長最短路恰為兩端各自最遠距離加新邊。兩類取最大即該方案直徑，枚舉全部跨分量點對得最優。
complexity: { time: 'O(n^3)', space: 'O(n^2)' }
common_errors: [只考慮跨新邊路徑而忽略原直徑, 枚舉同分量點對, 以直接距離代替分量內最短距離]
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { int n; cin >> n; /* TODO：Floyd、離心率與跨分量枚舉。 */ }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      int n; if (!(cin >> n)) return 0;
      vector<double> x(static_cast<size_t>(n)), y(static_cast<size_t>(n));
      for (int i = 0; i < n; ++i) cin >> x[static_cast<size_t>(i)] >> y[static_cast<size_t>(i)];
      const double inf = 1e100;
      vector<vector<double>> d(static_cast<size_t>(n), vector<double>(static_cast<size_t>(n), inf));
      for (int i = 0; i < n; ++i) {
          string row; cin >> row; d[static_cast<size_t>(i)][static_cast<size_t>(i)] = 0;
          for (int j = 0; j < n; ++j) if (row[static_cast<size_t>(j)] == '1')
              d[static_cast<size_t>(i)][static_cast<size_t>(j)] =
                  hypot(x[static_cast<size_t>(i)]-x[static_cast<size_t>(j)],
                        y[static_cast<size_t>(i)]-y[static_cast<size_t>(j)]);
      }
      for (int k=0;k<n;++k) for(int i=0;i<n;++i) for(int j=0;j<n;++j)
          d[static_cast<size_t>(i)][static_cast<size_t>(j)] =
              min(d[static_cast<size_t>(i)][static_cast<size_t>(j)],
                  d[static_cast<size_t>(i)][static_cast<size_t>(k)] + d[static_cast<size_t>(k)][static_cast<size_t>(j)]);
      vector<double> eccentricity(static_cast<size_t>(n),0); double old_diameter=0;
      for(int i=0;i<n;++i) for(int j=0;j<n;++j) if(d[static_cast<size_t>(i)][static_cast<size_t>(j)]<inf/2)
          eccentricity[static_cast<size_t>(i)] = max(eccentricity[static_cast<size_t>(i)],d[static_cast<size_t>(i)][static_cast<size_t>(j)]);
      for(double value:eccentricity) old_diameter=max(old_diameter,value);
      double answer=inf;
      for(int i=0;i<n;++i) for(int j=0;j<n;++j) if(d[static_cast<size_t>(i)][static_cast<size_t>(j)]>=inf/2)
          answer=min(answer,max(old_diameter,eccentricity[static_cast<size_t>(i)]+
              hypot(x[static_cast<size_t>(i)]-x[static_cast<size_t>(j)],y[static_cast<size_t>(i)]-y[static_cast<size_t>(j)])+
              eccentricity[static_cast<size_t>(j)]));
      cout<<fixed<<setprecision(6)<<(answer==inf?old_diameter:answer)<<'\n';
  }
external_url: https://www.luogu.com.cn/problem/P1522
external_platform: 洛谷
external_problem_id: P1522
external_title: '[USACO2.4] 牛的旅行 Cow Tours'
external_relation: original
source_book_pages: [600, 683]
source_pdf_pages: [230, 313]
review_status: verified
---

新增一條邊後的直徑，可以拆成「不經新邊」與「經新邊」兩類。
