---
id: openjudge-1385
volume: lower
source_file: lower-volume
title: OpenJudge 1385 Lifting the Stone：多邊形重心
chapter: 8
section: '8.0'
kind: external-oj
difficulty: 3
topics:
  - 多邊形重心
  - 鞋帶公式
  - 叉積
prerequisites:
  - 點與向量
  - 叉積
statement: 一塊厚度與密度均勻的石板，其平面形狀由不自交的多邊形表示。求石板的質心座標；多邊形可以是凹的，質心也可能落在多邊形外。
constraints:
  - 1 <= T
  - 3 <= N <= 1000000
  - '|X_i|, |Y_i| <= 20000'
  - 邊只在相鄰端點相接且不相交，面積不為 0
input_format: 第一行為測試組數 T。每組先給頂點數 N，再依多邊形邊界順序給 N 組整數座標。
output_format: 每組輸出質心的 x、y 座標，四捨五入至小數點後兩位。
samples:
  - input: |
      2
      4
      5 0
      0 5
      -5 0
      0 -5
      4
      1 1
      11 1
      11 11
      1 11
    output: |
      0.00 0.00
      6.00 6.00
    explanation: 兩個圖形都有中心對稱；其均勻面積的質心分別是原點與正方形中心 (6,6)。
core_knowledge:
  - 有向三角形面積
  - 面積加權質心
  - 凹多邊形的帶符號分解
judgment: N 可達一百萬，必須一趟累加；以原點和每條邊組成帶符號三角形，可同時處理順、逆時針及凹多邊形。
hints:
  - 把每條有向邊與原點組成三角形，先想如何用叉積表示其兩倍有向面積。
  - 單一三角形的質心是三頂點座標平均；用有向面積作權重後加總，凹入部分會自動扣除。
  - 若 S 是所有叉積之和，則 x 分子累加 (x_i+x_{i+1})*cross，最後除以 3S；y 同理。
solution_outline: 依序讀取頂點並保留首點，對每條邊累加叉積 S、(x_i+x_j)cross 與 (y_i+y_j)cross，補上末點到首點後分別除以 3S。
proof_or_invariant: 每條邊與原點形成的有向三角形，其兩倍面積為 cross，質心為
  ((x_i+x_j)/3,(y_i+y_j)/3)。簡單多邊形可由這些帶符號三角形作代數分解，因此面積一階矩相加後除以總面積，正是整個均勻多邊形的質心；方向反轉時分子分母同時變號，結果不變。
complexity:
  time: 每組 O(N)
  space: O(N)，為保存輸入頂點；可改成串流 O(1)
common_errors:
  - 把凹多邊形拆成無符號三角形
  - 質心公式漏除以 3
  - 只用整數累加而在乘積總和溢位
  - 輸出負零 -0.00
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：依提示實作核心演算法。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int test_count;
      cin >> test_count;
      cout << fixed << setprecision(2);
      while (test_count-- > 0) {
          int n;
          cin >> n;
          vector<Point> points(static_cast<size_t>(n));
          for (Point& p : points) { cin >> p.x >> p.y; }
          long double area2 = 0.0L;
          long double moment_x = 0.0L;
          long double moment_y = 0.0L;
          for (int i = 0; i < n; ++i) {
              const Point& a = points[static_cast<size_t>(i)];
              const Point& b = points[static_cast<size_t>((i + 1) % n)];
              const long double cross = a.x * b.y - a.y * b.x;
              area2 += cross;
              moment_x += (a.x + b.x) * cross;
              moment_y += (a.y + b.y) * cross;
          }
          long double center_x = moment_x / (3.0L * area2);
          long double center_y = moment_y / (3.0L * area2);
          if (fabsl(center_x) < 0.0005L) { center_x = 0.0L; }
          if (fabsl(center_y) < 0.0005L) { center_y = 0.0L; }
          cout << center_x << ' ' << center_y << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/1385/
external_platform: OpenJudge 百練
external_problem_id: '1385'
external_title: Lifting the Stone
external_relation: original
source_book_pages:
  - 522
source_pdf_pages:
  - 152
review_status: verified
---

題面資訊以外部 OJ 頁面逐項核實；解說為本站獨立撰寫。
