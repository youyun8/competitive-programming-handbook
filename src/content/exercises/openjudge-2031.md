---
id: openjudge-2031
volume: lower
source_file: lower-volume
title: OpenJudge 2031 Building a Space Station：球體最小生成樹
chapter: 8
section: '8.1'
kind: external-oj
difficulty: 3
topics:
  - 最小生成樹
  - 三維距離
  - 球面距離
prerequisites:
  - Prim 演算法
  - 歐幾里得距離
statement: 太空站由若干球形艙室組成。相交或相切的艙室已可互通；否則可在兩球表面之間建造直線走廊。求讓所有艙室連通所需走廊的最小總長。
constraints:
  - 1 <= n <= 100
  - 0 < x_i,y_i,z_i,r_i < 100
  - 每個數恰有三位小數
  - 以單獨一行 0 結束
input_format: 多組資料。每組先給 n，接著 n 行為球心 x,y,z 與半徑 r；n=0 結束。
output_format: 每組輸出最短總長，固定三位小數。
samples:
  - input: |
      3
      10.000 10.000 50.000 10.000
      40.000 10.000 50.000 10.000
      40.000 40.000 50.000 10.000
      2
      30.000 30.000 30.000 20.000
      40.000 40.000 40.000 20.000
      0
    output: |
      20.000
      0.000
    explanation: 第一組兩條最近表面距離各 10；第二組兩球相交，無須走廊。
core_knowledge:
  - 球面間最短距離
  - 完全圖最小生成樹
  - 稠密圖 Prim
judgment: 每對艙室都有一個非負連接代價，問題正是完全圖 MST；n 僅 100，O(n^2) Prim 最直接。
hints:
  - 兩球心距離扣掉兩半徑後若為負，代表它們已經相交。
  - 把每個球視為頂點、最短表面距離視為邊權，所求是讓所有頂點連通的最小邊權和。
  - 無須存 O(n²) 邊；每次加入一球後，用它即時計算並鬆弛其他球到目前樹的最短距離。
solution_outline: 使用稠密版 Prim；每輪選尚未加入且連接代價最小的球，加上該代價，再以 max(0,中心距離-r_i-r_j) 更新所有未選球。
proof_or_invariant: 任兩連通分量間最短可建走廊就是對應球面距離，故任何走廊配置對應圖上的連通子圖，反之亦然。MST 切割性質保證 Prim 每次選跨越已選集合與未選集合的最小邊安全；重疊球的零權邊也符合此性質，最終和即最小總長。
complexity:
  time: 每組 O(n^2)
  space: O(n)
common_errors:
  - 忘記把相交球距離截成 0
  - 使用球心距離當走廊長
  - 平方距離未開根號
  - 輸出位數不符
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

  struct Sphere { double x; double y; double z; double r; };

  static double gap(const Sphere& a, const Sphere& b) {
      const double dx = a.x - b.x;
      const double dy = a.y - b.y;
      const double dz = a.z - b.z;
      return max(0.0, sqrt(dx * dx + dy * dy + dz * dz) - a.r - b.r);
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cout << fixed << setprecision(3);
      while (cin >> n && n != 0) {
          vector<Sphere> spheres(static_cast<size_t>(n));
          for (Sphere& sphere : spheres) { cin >> sphere.x >> sphere.y >> sphere.z >> sphere.r; }
          vector<double> best(static_cast<size_t>(n), numeric_limits<double>::infinity());
          vector<bool> used(static_cast<size_t>(n), false);
          best[0] = 0.0;
          double answer = 0.0;
          for (int step = 0; step < n; ++step) {
              int chosen = -1;
              for (int i = 0; i < n; ++i) {
                  if (!used[static_cast<size_t>(i)] &&
                      (chosen == -1 || best[static_cast<size_t>(i)] < best[static_cast<size_t>(chosen)])) {
                      chosen = i;
                  }
              }
              used[static_cast<size_t>(chosen)] = true;
              answer += best[static_cast<size_t>(chosen)];
              for (int i = 0; i < n; ++i) {
                  if (!used[static_cast<size_t>(i)]) {
                      best[static_cast<size_t>(i)] =
                          min(best[static_cast<size_t>(i)],
                              gap(spheres[static_cast<size_t>(chosen)], spheres[static_cast<size_t>(i)]));
                  }
              }
          }
          cout << answer << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/2031/
external_platform: OpenJudge 百練
external_problem_id: '2031'
external_title: Building a Space Station
external_relation: original
source_book_pages:
  - 548
source_pdf_pages:
  - 178
review_status: verified
---

題面資訊以外部 OJ 頁面逐項核實；解說為本站獨立撰寫。
