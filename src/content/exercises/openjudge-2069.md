---
id: openjudge-2069
volume: lower
source_file: lower-volume
title: OpenJudge 2069 Super Star：三維最小包覆球
chapter: 8
section: '8.0'
kind: external-oj
difficulty: 5
topics: ['最小包覆球', '隨機增量', '三維向量']
prerequisites: ['點積', '叉積', '線性方程']
statement: 給定三維歐幾里得空間中的若干星點，求包含所有點（允許落在球面上）的最小球半徑。
constraints:
  - '4 <= n <= 30'
  - '0.0 <= x_i, y_i, z_i <= 100.0'
  - 任兩點距離至少 0.01
  - n=0 結束
input_format: 多組資料。每組先給點數 n，再給 n 行三維實數座標；單獨一行 0 結束。
output_format: 每組輸出最小包覆球半徑，固定小數點後五位，誤差不得超過 0.00001。
samples:
  - input: |
      4
      10.00000 10.00000 10.00000
      20.00000 10.00000 10.00000
      20.00000 20.00000 10.00000
      10.00000 20.00000 10.00000
      4
      10.00000 10.00000 10.00000
      10.00000 50.00000 50.00000
      50.00000 10.00000 50.00000
      50.00000 50.00000 10.00000
      0
    output: |
      7.07107
      34.64102
    explanation: 官方第一組四點共面並形成邊長 10 的正方形，最小球半徑為半條對角線；第二組四點形成正四面體，其外接球半徑為 20sqrt(3)。
core_knowledge:
  - 三維最小包覆球由至多四個邊界點決定
  - 隨機增量與逐層固定邊界
  - 退化邊界集合需枚舉較小子集
judgment: n 僅 30，但要求 1e-5 精度。使用隨機增量：遇到球外點時把它固定為邊界，逐層重建到最多四點；對共線、共面退化情形，枚舉邊界子集找最小可行球。
hints:
  - 三維最小包覆球的球面支撐點最多四個；其餘點只用來檢查是否在球內。
  - 隨機打亂後掃描；若點 i 在目前球外，任何包含已掃點的新最小球必把 i 放在邊界，依序再固定 j、k、l。
  - 建立最多四點的球時，枚舉所有非空子集：一點、兩點、三點外接圓球、四點外接球，選能包住整個邊界集合的最小者，可自然處理共線或共面。
solution_outline: 固定亂數種子打亂點。以四層增量迴圈維護目前球；每次外點出現便用已固定的 1 到 4 個邊界點重新求最小球。小邊界求球函式枚舉所有子集、略過奇異外接球並驗證包含性。
proof_or_invariant: 掃描每層前綴後，sphere 是包含該前綴且符合外層固定邊界的最小球。若新點已在球內，不變量不變；若在球外，分離性與最小球支撐性質保證新最優球必以該點為邊界，因此進入下一層固定它不會漏解。三維球至多四個仿射獨立支撐點，四層足夠；退化時最小球由更小子集決定，子集枚舉精確涵蓋。
complexity:
  time: 隨機期望 O(n)，此直接四層實作最壞 O(n⁴)
  space: O(n)
common_errors:
  - 用模擬退火近似而無法保證 1e-5
  - 四點共面時直接解奇異三元方程
  - 球內判定沒有相對誤差容忍而反覆重建
  - 三點外接圓心公式漏掉其所在平面條件
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Vec3 { long double x; long double y; long double z; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：隨機增量，遇到球外點時逐層固定至多四個支撐點。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Vec3 { long double x; long double y; long double z; };
  struct Sphere { Vec3 center; long double radius; bool valid; };

  static Vec3 operator+(const Vec3& a, const Vec3& b) {
      return {a.x + b.x, a.y + b.y, a.z + b.z};
  }
  static Vec3 operator-(const Vec3& a, const Vec3& b) {
      return {a.x - b.x, a.y - b.y, a.z - b.z};
  }
  static Vec3 operator*(const Vec3& a, long double scale) {
      return {a.x * scale, a.y * scale, a.z * scale};
  }
  static long double dot(const Vec3& a, const Vec3& b) {
      return a.x * b.x + a.y * b.y + a.z * b.z;
  }
  static Vec3 cross(const Vec3& a, const Vec3& b) {
      return {a.y * b.z - a.z * b.y,
              a.z * b.x - a.x * b.z,
              a.x * b.y - a.y * b.x};
  }
  static long double norm(const Vec3& a) { return sqrtl(dot(a, a)); }

  static bool contains(const Sphere& sphere, const Vec3& point) {
      return sphere.valid &&
             norm(point - sphere.center) <=
                 sphere.radius + 1e-11L * max(1.0L, sphere.radius);
  }

  static Sphere sphere_from_subset(const vector<Vec3>& points) {
      if (points.size() == 1) { return {points[0], 0.0L, true}; }
      if (points.size() == 2) {
          const Vec3 center = (points[0] + points[1]) * 0.5L;
          return {center, norm(points[0] - center), true};
      }
      if (points.size() == 3) {
          const Vec3 u = points[1] - points[0];
          const Vec3 v = points[2] - points[0];
          const Vec3 normal = cross(u, v);
          const long double denominator = 2.0L * dot(normal, normal);
          if (fabsl(denominator) < 1e-24L) {
              return {{0.0L, 0.0L, 0.0L}, 0.0L, false};
          }
          const Vec3 offset =
              (cross(v, normal) * dot(u, u) +
               cross(normal, u) * dot(v, v)) *
              (1.0L / denominator);
          const Vec3 center = points[0] + offset;
          return {center, norm(points[0] - center), true};
      }
      const Vec3 u = points[1] - points[0];
      const Vec3 v = points[2] - points[0];
      const Vec3 w = points[3] - points[0];
      const long double determinant = dot(u, cross(v, w));
      if (fabsl(determinant) < 1e-18L) {
          return {{0.0L, 0.0L, 0.0L}, 0.0L, false};
      }
      const long double first = dot(points[1], points[1]) -
                                dot(points[0], points[0]);
      const long double second = dot(points[2], points[2]) -
                                 dot(points[0], points[0]);
      const long double third = dot(points[3], points[3]) -
                                dot(points[0], points[0]);
      const Vec3 center =
          (cross(v, w) * first + cross(w, u) * second +
           cross(u, v) * third) *
          (0.5L / determinant);
      return {center, norm(points[0] - center), true};
  }

  static Sphere minimum_boundary_sphere(const vector<Vec3>& boundary) {
      Sphere best{{0.0L, 0.0L, 0.0L},
                  numeric_limits<long double>::infinity(), false};
      const unsigned int count = static_cast<unsigned int>(boundary.size());
      for (unsigned int mask = 1U; mask < (1U << count); ++mask) {
          vector<Vec3> subset;
          for (unsigned int i = 0; i < count; ++i) {
              if ((mask & (1U << i)) != 0U) {
                  subset.push_back(boundary[static_cast<size_t>(i)]);
              }
          }
          Sphere candidate = sphere_from_subset(subset);
          if (!candidate.valid) { continue; }
          bool covers = true;
          for (const Vec3& point : boundary) {
              if (!contains(candidate, point)) { covers = false; }
          }
          if (covers && (!best.valid || candidate.radius < best.radius)) {
              best = candidate;
          }
      }
      return best;
  }

  static Sphere minimum_enclosing_sphere(vector<Vec3> points) {
      mt19937 generator(20240726U);
      shuffle(points.begin(), points.end(), generator);
      Sphere sphere = minimum_boundary_sphere({points[0]});
      for (size_t i = 0; i < points.size(); ++i) {
          if (contains(sphere, points[i])) { continue; }
          sphere = minimum_boundary_sphere({points[i]});
          for (size_t j = 0; j < i; ++j) {
              if (contains(sphere, points[j])) { continue; }
              sphere = minimum_boundary_sphere({points[i], points[j]});
              for (size_t k = 0; k < j; ++k) {
                  if (contains(sphere, points[k])) { continue; }
                  sphere =
                      minimum_boundary_sphere({points[i], points[j], points[k]});
                  for (size_t l = 0; l < k; ++l) {
                      if (contains(sphere, points[l])) { continue; }
                      sphere = minimum_boundary_sphere(
                          {points[i], points[j], points[k], points[l]});
                  }
              }
          }
      }
      return sphere;
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cout << fixed << setprecision(5);
      while (cin >> n && n != 0) {
          vector<Vec3> points(static_cast<size_t>(n));
          for (Vec3& point : points) { cin >> point.x >> point.y >> point.z; }
          cout << minimum_enclosing_sphere(points).radius << '\n';
      }
  }
external_url: http://bailian.openjudge.cn/practice/2069/
external_platform: OpenJudge 百練
external_problem_id: '2069'
external_title: Super Star
external_relation: original
source_book_pages: [541]
source_pdf_pages: [171]
review_status: verified
---

題面資訊依外部 OJ 頁面核實；敘述、證明與程式為本站獨立撰寫。
