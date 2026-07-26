---
id: openj-bailian-1905
volume: upper
source_file: upper-volume
title: OpenJudge 1905 Expanding Rods
chapter: 2
section: '2.3'
kind: external-oj
difficulty: 3
topics: ['實數二分', '圓弧幾何']
prerequisites: ['弦長', '反三角函數']
statement: 長 L 的細桿夾在兩牆間，加熱 n 度、膨脹係數 C，弧長變成 (1+nC)L，並彎成以原桿為弦的圓弧。求桿中心偏離原弦的距離。
constraints: ['輸入多組非負 L、n、C，以三個負數結束', '膨脹量不超過原長一半']
input_format: 每行 L、n、C；三者皆負的行不處理。
output_format: 每組輸出中心位移，保留三位小數。
samples:
  - input: |
      1000 100 0.0001
      15000 10 0.00006
      10 0 0.001
      -1 -1 -1
    output: |
      61.329
      225.020
      0.000
    explanation: 第一組弧長為 1010；求得對應圓半徑後，弓高約 61.329。
core_knowledge: ['以圓心半角參數化弦與弧', '單調實數二分']
judgment: 令半圓心角 θ，弦長 L=2R sinθ、弧長 L′=2Rθ，因此 sinθ/θ=L/L′，在 (0,π/2] 單調下降。
hints:
  - '膨脹為零時答案直接是 0。'
  - '消去半徑 R，得到 sinθ/θ=L/L′。'
  - '二分 θ，再由 R=L/(2sinθ)、位移 h=R(1-cosθ) 計算。'
solution_outline: 無膨脹輸出 0；否則在 [0,π/2] 二分 θ，使 sinθ/θ 接近 L/L′。由弦公式求 R，再算弓高。
proof_or_invariant: 指定 θ 後弦弧比唯一，且 sinθ/θ 嚴格下降，所以二分得到唯一幾何形狀。R 與弓高公式直接來自等腰三角形，故位移正確。
common_errors: ['把 θ 當完整圓心角', '膨脹為零時除以 sin0', '使用角度而非弧度', '二分方向反轉']
complexity: { time: '每組 O(100)', space: 'O(1)' }
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() { double length, degree, coefficient; while (cin >> length >> degree >> coefficient && length >= 0) { cout << fixed << setprecision(3) << 0.0 << '\n'; } }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;
  int main() {
      ios::sync_with_stdio(false); cin.tie(nullptr);
      double length, degree, coefficient;
      while (cin >> length >> degree >> coefficient) {
          if (length < 0 && degree < 0 && coefficient < 0) break;
          const double arc = length * (1.0 + degree * coefficient);
          if (arc == length || length == 0) { cout << fixed << setprecision(3) << 0.0 << '\n'; continue; }
          double low = 0, high = acos(-1.0) / 2;
          const double ratio = length / arc;
          for (int iteration = 0; iteration < 100; ++iteration) {
              const double mid = (low + high) / 2;
              if (sin(mid) / mid > ratio) low = mid; else high = mid;
          }
          const double theta = (low + high) / 2;
          const double radius = length / (2.0 * sin(theta));
          const double height = radius * (1.0 - cos(theta));
          cout << fixed << setprecision(3) << height << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/1905/
external_platform: OpenJ_Bailian
external_problem_id: '1905'
external_title: Expanding Rods
external_relation: original
source_book_pages: [52]
source_pdf_pages: [70]
review_status: verified
---

以半圓心角消去半徑後，只剩一個單調方程可二分。
