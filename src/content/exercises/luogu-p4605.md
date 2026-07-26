---
id: luogu-p4605
volume: lower
source_file: lower-volume
title: 洛谷 P4605 物理實驗：可見線段滑動視窗
chapter: 8
section: '8.6'
kind: external-oj
difficulty: 5
topics: ['座標旋轉', '掃描線', '滑動視窗', '可見性']
prerequisites: ['向量投影', '線段上下順序']
statement: 無限直線導軌上放置長度 L 的雷射發射器，向導軌兩側垂直發出同寬平行光束。平面上有 n 條互不接觸、也不接觸導軌的擋板；光會被首先碰到的擋板吸收且不反射。可沿導軌任意平移發射器，求同時被照到的擋板總長最大值。
constraints:
  - 'T <= 100'
  - '1 <= n <= 10000'
  - '1 <= L <= 2*10^9'
  - 所有輸入座標絕對值不超過 10^9
  - 擋板與導軌夾角不超過 85 度，擋板彼此及與導軌均不接觸
input_format: 第一行 T。每組先給 n，再給 n 行擋板端點 x1 y1 x2 y2，最後一行給導軌上的兩點 x1 y1 x2 y2 與 L。
output_format: 每組輸出最大受光擋板長度；原題接受相對誤差範圍內的實數。
samples:
  - input: |
      3
      4
      -3 2 -1 2
      -1 -1 1 -1
      0 1 2 1
      2 -2 4 -2
      0 0 1 0 2
      4
      1 1 3 3
      2 1 4 2
      3 1 5 1
      3 -1 4 -1
      0 0 -1 0 2
      4
      -2 0 1 2
      1 3 -3 2
      1 -3 5 -1
      2 -1 4 3
      0 0 1 1 2
    output: |
      3.000000000000000
      3.118033988749895
      4.251303782246768
    explanation: 將導軌旋轉成 x 軸後，各側只會照到同一 x 上距導軌最近的擋板；選擇長度 L 的 x 區間，使其可見長度密度積分最大。
core_knowledge:
  - 旋轉後每條擋板在 x 投影區間上提供固定的「原長/投影長」密度
  - 同側不相交擋板在重疊投影上的上下順序不會改變
  - 上、下兩側各取距 x 軸最近的活動擋板，總密度為分段常數
judgment: 以導軌方向單位向量作 x 軸、法向量作 y 軸。按擋板投影端點掃描，上側活動集合取最小 y、下側取最大 y，得到每個相鄰事件 x 區間的可見長度密度。建立積分前綴，枚舉所有斷點 x 與 x-L 作視窗左端，計算 F(s+L)-F(s)。
hints:
  - 擋板在投影寬度 dx 上的每一小段 du 對應實際長度 du*segment_length/dx。
  - 擋板互不相交，所以同側兩條活動擋板不會交換遠近；平衡樹比較器可在當前掃描 x 比較插值 y。
  - 分段常數函數的長度 L 視窗積分只可能在某個斷點進入或離開視窗時改變增減趨勢。
solution_outline: 對每組資料先旋轉平移全部端點並統一 x1<x2，記錄密度。端點掃描維護兩側活動 set，產生每段可見密度與積分前綴。積分函式以 upper_bound 找所在區間並補上局部矩形面積；對每個事件座標測試 s=x 及 s=x-L，取最大。
proof_or_invariant: 在任一不含端點的 x 區間，活動擋板固定；同側擋板若交換高低必相交，與題意矛盾，故最近擋板固定且受光密度為常數。積分前綴因此精確給出任一發射器區間的受光總長。視窗積分對左端 s 的導數為 f(s+L)-f(s)，只在 s 或 s+L 經過斷點時改變；區間內為常數，最大值必可取於候選斷點，枚舉完整。
complexity:
  time: 每組 O(n log n)
  space: O(n)
common_errors:
  - 把所有投影相交的擋板長度相加，忽略近處擋板遮蔽
  - 密度用投影長除以原長而非原長除以投影長
  - 只處理導軌單側
  - 只枚舉視窗左端為斷點，漏掉右端對齊斷點的 x-L
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：旋轉座標，掃描最近擋板密度，再最大化固定長度視窗積分。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Point { long double x; long double y; };
  struct Barrier {
      Point first;
      Point second;
      long double density;
  };
  struct Event { long double x; int id; bool entering; };

  struct HeightOrder {
      const vector<Barrier>* barriers;
      const long double* current_x;
      bool operator()(int first, int second) const {
          if (first == second) { return false; }
          const Barrier& a = (*barriers)[static_cast<size_t>(first)];
          const Barrier& b = (*barriers)[static_cast<size_t>(second)];
          const long double ratio_a =
              (*current_x - a.first.x) / (a.second.x - a.first.x);
          const long double ratio_b =
              (*current_x - b.first.x) / (b.second.x - b.first.x);
          const long double height_a =
              a.first.y + (a.second.y - a.first.y) * ratio_a;
          const long double height_b =
              b.first.y + (b.second.y - b.first.y) * ratio_b;
          if (height_a != height_b) { return height_a < height_b; }
          return first < second;
      }
  };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int test_count;
      cin >> test_count;
      cout << fixed << setprecision(15);
      while (test_count-- > 0) {
          int n;
          cin >> n;
          vector<array<long double, 4>> input(
              static_cast<size_t>(n));
          for (auto& values : input) {
              long long x1;
              long long y1;
              long long x2;
              long long y2;
              cin >> x1 >> y1 >> x2 >> y2;
              values = {static_cast<long double>(x1),
                        static_cast<long double>(y1),
                        static_cast<long double>(x2),
                        static_cast<long double>(y2)};
          }
          long long rail_x1;
          long long rail_y1;
          long long rail_x2;
          long long rail_y2;
          long long laser_length_input;
          cin >> rail_x1 >> rail_y1 >> rail_x2 >> rail_y2 >>
              laser_length_input;
          const long double dx =
              static_cast<long double>(rail_x2 - rail_x1);
          const long double dy =
              static_cast<long double>(rail_y2 - rail_y1);
          const long double rail_length = hypotl(dx, dy);
          const long double ux = dx / rail_length;
          const long double uy = dy / rail_length;
          const long double nx = -uy;
          const long double ny = ux;

          vector<Barrier> barriers;
          barriers.reserve(static_cast<size_t>(n));
          vector<Event> events;
          events.reserve(static_cast<size_t>(2 * n));
          for (int id = 0; id < n; ++id) {
              const auto& values = input[static_cast<size_t>(id)];
              const long double ax =
                  values[0] - static_cast<long double>(rail_x1);
              const long double ay =
                  values[1] - static_cast<long double>(rail_y1);
              const long double bx =
                  values[2] - static_cast<long double>(rail_x1);
              const long double by =
                  values[3] - static_cast<long double>(rail_y1);
              Point first{ax * ux + ay * uy, ax * nx + ay * ny};
              Point second{bx * ux + by * uy, bx * nx + by * ny};
              if (second.x < first.x) { swap(first, second); }
              const long double original_length =
                  hypotl(values[2] - values[0],
                         values[3] - values[1]);
              const long double density =
                  original_length / (second.x - first.x);
              barriers.push_back({first, second, density});
              events.push_back({first.x, id, true});
              events.push_back({second.x, id, false});
          }
          sort(events.begin(), events.end(),
               [](const Event& a, const Event& b) {
                   if (a.x != b.x) { return a.x < b.x; }
                   return a.entering < b.entering;
               });

          vector<long double> breakpoints;
          for (const Event& event : events) {
              if (breakpoints.empty() ||
                  breakpoints.back() != event.x) {
                  breakpoints.push_back(event.x);
              }
          }
          vector<long double> density;
          density.reserve(
              breakpoints.empty() ? 0U : breakpoints.size() - 1U);
          long double current_x = breakpoints.front();
          HeightOrder order{&barriers, &current_x};
          set<int, HeightOrder> above(order);
          set<int, HeightOrder> below(order);
          size_t event_index = 0;
          for (size_t i = 0; i < breakpoints.size(); ++i) {
              current_x = breakpoints[i];
              while (event_index < events.size() &&
                     events[event_index].x == current_x &&
                     !events[event_index].entering) {
                  const int id = events[event_index].id;
                  if (barriers[static_cast<size_t>(id)].first.y > 0) {
                      above.erase(id);
                  } else {
                      below.erase(id);
                  }
                  ++event_index;
              }
              while (event_index < events.size() &&
                     events[event_index].x == current_x) {
                  const int id = events[event_index].id;
                  if (barriers[static_cast<size_t>(id)].first.y > 0) {
                      above.insert(id);
                  } else {
                      below.insert(id);
                  }
                  ++event_index;
              }
              if (i + 1U < breakpoints.size()) {
                  long double value = 0;
                  if (!above.empty()) {
                      value += barriers[static_cast<size_t>(*above.begin())]
                                   .density;
                  }
                  if (!below.empty()) {
                      value += barriers[static_cast<size_t>(*below.rbegin())]
                                   .density;
                  }
                  density.push_back(value);
              }
          }

          vector<long double> prefix(breakpoints.size(), 0);
          for (size_t i = 0; i < density.size(); ++i) {
              prefix[i + 1U] =
                  prefix[i] + density[i] *
                                  (breakpoints[i + 1U] - breakpoints[i]);
          }
          const auto integral_to = [&](long double position) {
              if (position <= breakpoints.front()) {
                  return static_cast<long double>(0);
              }
              if (position >= breakpoints.back()) {
                  return prefix.back();
              }
              const auto iterator =
                  upper_bound(breakpoints.begin(), breakpoints.end(),
                              position);
              const size_t index = static_cast<size_t>(
                  distance(breakpoints.begin(), iterator) - 1);
              return prefix[index] +
                     density[index] * (position - breakpoints[index]);
          };
          const long double laser_length =
              static_cast<long double>(laser_length_input);
          long double answer = 0;
          for (long double point : breakpoints) {
              answer = max(answer, integral_to(point + laser_length) -
                                       integral_to(point));
              const long double shifted = point - laser_length;
              answer = max(answer,
                           integral_to(shifted + laser_length) -
                               integral_to(shifted));
          }
          cout << answer << '\n';
      }
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4605
external_platform: 洛谷
external_problem_id: P4605
external_title: '[SDOI2018] 物理實驗'
external_relation: original
source_book_pages: [555]
source_pdf_pages: [185]
review_status: verified
---

題面、限制與官方範例已依洛谷、SDOI 2018 Round 2 題目備份及多份通過題解交叉核實；繁中敘述、證明與程式為本站獨立撰寫。
