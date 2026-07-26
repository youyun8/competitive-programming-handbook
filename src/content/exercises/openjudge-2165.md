---
id: openjudge-2165
volume: lower
source_file: lower-volume
title: OpenJudge 2165 Gunman：穿越所有矩形窗
chapter: 8
section: '8.7'
kind: external-oj
difficulty: 4
topics: ['三維直線', '線性不等式', '區間交']
prerequisites: ['參數式直線', '不等式變形']
statement: 槍手可在 x 軸上的任意點 (s,0,0) 開槍。不同深度 z_i 上各有一個邊平行座標軸的矩形窗，子彈沿三維直線前進，碰到窗框邊也算穿過。判斷能否一槍穿過全部窗；若可行，輸出一組開槍位置及各窗上的通過點。
constraints:
  - '2 <= n <= 100'
  - '0 < x1_i < x2_i < 1000'
  - '0 < y1_i < y2_i < 1000'
  - '0 < z_i < 1000'
  - 視窗依深度嚴格遞增排列
input_format: 第一行為窗數 n。接著 n 行各為左下角 x1、y1、右上角 x2、y2 與深度 z。
output_format: 無解輸出 `UNSOLVABLE`。有解先輸出 `SOLUTION`，下一行輸出射擊點 x，接著 n 行輸出依序穿窗的 x、y、z；座標固定六位小數。
samples:
  - input: |
      3
      1 3 5 5 3
      1 2 5 7 5
      5 2 7 6 6
    output: |
      SOLUTION
      -1.000000
      2.000000 3.000000 3.000000
      4.000000 5.000000 5.000000
      5.000000 6.000000 6.000000
    explanation: 官方範例可從 (-1,0,0) 沿方向 (1,1,1) 射擊，在三個深度分別通過 (2,3)、(4,5)、(5,6)，皆位於對應閉矩形內。
core_knowledge:
  - 子彈軌跡可寫成 x=s+pz、y=qz
  - y 條件直接形成 q 的區間交
  - 消去 s 後以成對不等式求 p 區間
judgment: x、y 可分離。y_i 範圍除以 z_i 就限制 q；對固定 p，每扇窗允許的 s 是區間 [x1_i-pz_i,x2_i-pz_i]。所有 s 區間有交集的條件可由任意下界不超過任意上界轉成 p 的一維區間。
hints:
  - 令子彈在深度 z 的座標為 (s+pz,qz,z)，其中 s 是開槍位置，p、q 是方向參數。
  - y1_i/z_i <= q <= y2_i/z_i，直接取所有區間交；x 則要求所有 [x1_i-pz_i,x2_i-pz_i] 有共同 s。
  - 區間有交集等價於對所有 i,j 皆有 x1_i-pz_i <= x2_j-pz_j；依 z_j-z_i 正負把每式轉為 p 的上界或下界。
solution_outline: 先求 q 的共同區間。再枚舉窗對，把所有下界不超過所有上界的不等式轉成 p 範圍；取其中點後求 s 區間交。任一範圍空則無解，否則輸出選定參數在各 z_i 的座標。
proof_or_invariant: 任意非平行於 z=0 平面的有效子彈可唯一寫為 x=s+pz、y=qz。y 約束逐窗等價於 q 區間交。對 x，給定 p 時存在共同 s 當且僅當 max_i(x1_i-pz_i) <= min_j(x2_j-pz_j)，又等價於每一對 i,j 的下界不超過上界；逐對整理出的 p 上下界因此是充要條件。選定可行 p、q、s 後，每個輸出點直接滿足所有窗的閉區間限制。
complexity:
  time: O(n²)
  space: O(n)
common_errors:
  - 誤設射擊點固定在原點，漏掉自由參數 s
  - 將碰到窗框邊視為不可行而使用嚴格不等式
  - 除以 z_j-z_i 時未依正負翻轉不等號
  - 輸出通過點時漏加 s 或使用窗的輸入順序以外排序
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：以 x=s+pz、y=qz 將所有視窗轉成參數區間。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Window {
      long double x1;
      long double y1;
      long double x2;
      long double y2;
      long double z;
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      constexpr long double eps = 1e-12L;
      int n;
      cin >> n;
      vector<Window> windows(static_cast<size_t>(n));
      for (Window& window : windows) {
          cin >> window.x1 >> window.y1 >> window.x2 >> window.y2 >> window.z;
      }
      long double q_lower = -numeric_limits<long double>::infinity();
      long double q_upper = numeric_limits<long double>::infinity();
      for (const Window& window : windows) {
          q_lower = max(q_lower, window.y1 / window.z);
          q_upper = min(q_upper, window.y2 / window.z);
      }
      long double p_lower = -numeric_limits<long double>::infinity();
      long double p_upper = numeric_limits<long double>::infinity();
      for (const Window& lower_window : windows) {
          for (const Window& upper_window : windows) {
              const long double delta_z = upper_window.z - lower_window.z;
              if (fabsl(delta_z) <= eps) { continue; }
              const long double bound =
                  (upper_window.x2 - lower_window.x1) / delta_z;
              if (delta_z > 0.0L) {
                  p_upper = min(p_upper, bound);
              } else {
                  p_lower = max(p_lower, bound);
              }
          }
      }
      if (q_lower > q_upper + eps || p_lower > p_upper + eps) {
          cout << "UNSOLVABLE\n";
          return 0;
      }
      const long double p = (p_lower + p_upper) / 2.0L;
      const long double q = q_lower;
      long double s_lower = -numeric_limits<long double>::infinity();
      long double s_upper = numeric_limits<long double>::infinity();
      for (const Window& window : windows) {
          s_lower = max(s_lower, window.x1 - p * window.z);
          s_upper = min(s_upper, window.x2 - p * window.z);
      }
      if (s_lower > s_upper + eps) {
          cout << "UNSOLVABLE\n";
          return 0;
      }
      const long double s = s_lower;
      cout << fixed << setprecision(6);
      cout << "SOLUTION\n" << s << '\n';
      for (const Window& window : windows) {
          cout << s + p * window.z << ' ' << q * window.z << ' '
               << window.z << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/2165/
external_platform: OpenJudge 百練
external_problem_id: '2165'
external_title: Gunman
external_relation: original
source_book_pages: [548]
source_pdf_pages: [178]
review_status: verified
---

題面資訊依外部 OJ 頁面核實；敘述、證明與程式為本站獨立撰寫。
