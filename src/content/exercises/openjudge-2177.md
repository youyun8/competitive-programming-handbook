---
id: openjudge-2177
volume: lower
source_file: lower-volume
title: OpenJudge 2177 Ghost Busters：單一射線命中最多球
chapter: 8
section: '8.0'
kind: external-oj
difficulty: 5
topics: ['球面圓盤', '圓錐', '排列幾何']
prerequisites: ['三維向量', '點積', '叉積']
statement: 質子槍位於原點，只能向 x、y、z 非負的第一卦限射出一條射線。每個鬼魂是一個給定球心與半徑的球；射線只要碰到球面或穿過球體就能消滅它。求單發射線最多能命中的鬼魂數，並輸出任一組可同時命中的編號。
constraints:
  - '0 <= N <= 100'
  - '1 <= X_i, Y_i, Z_i <= 10000'
  - '1 <= R_i <= min(X_i,Y_i,Z_i)'
  - 鬼魂可重疊、互相包含或完全重合
input_format: 第一行為鬼魂數 N；接著 N 行各有球心 X、Y、Z 與半徑 R，編號依輸入順序從 1 開始。
output_format: 第一行輸出單發最多消滅數；第二行輸出任一組達成最大值的鬼魂編號，以空白分隔。
samples:
  - input: |
      3
      10 10 10 1
      20 20 20 2
      30 30 30 3
    output: |
      3
      1 2 3
    explanation: 本站自製共線範例。沿方向 (1,1,1) 的射線穿過三個球心，因此三個鬼魂都會被命中。
core_knowledge:
  - 一個球在方向單位球面上對應圓形球面帽
  - 最大覆蓋深度可在帽中心或兩條邊界交點取得
  - 兩平面與單位球的交點
judgment: 射線只由單位方向 d 決定。球心 c、半徑 r 對應條件 c/|c|·d >= sqrt(|c|²-r²)/|c|，即球面帽。枚舉每個帽中心及每對帽邊界最多兩個交點，再計數即可 O(N³)。
hints:
  - 單位射線 d 到球心 c 的垂直距離平方是 |c|²-(c·d)²；整理命中條件可得到球面帽的不等式。
  - 球面帽排列中，最大深度區域若沒有邊界頂點，就可取某個包含關係最內層帽的中心；否則可取兩個帽邊界交點。
  - 對單位中心 u、v 與常數 h_u、h_v，先在線性張成平面內解 u·d=h_u、v·d=h_v，再沿 u×v 的正負方向補足 |d|=1。
solution_outline: 將每個球轉成單位中心 u 與球面帽門檻 h。候選包含全部 u，以及每對邊界平面與單位球的兩個交點；保留第一卦限方向，逐候選掃描所有帽並保存命中數最大的編號集合。
proof_or_invariant: 射線命中球的充要條件是方向 d 位於其閉球面帽。所有帽邊界把第一卦限球面分成有限區域，各開區域內覆蓋集合固定。最大區域若有頂點，該頂點是兩帽邊界交點；若無頂點，其邊界至多由一個帽控制或整個區域無邊界，此時某個最內層帽中心（或任一帽中心）也在同一最大覆蓋集合中。候選枚舉因此包含一個最優方向，逐帽計數得到全域最大值。
complexity:
  time: O(N³)
  space: O(N)
common_errors:
  - 只枚舉指向球心的射線，漏掉帽邊界交會形成的最佳重疊
  - 使用到無限直線的距離而未確認射線投影方向為正
  - 兩帽中心近平行時除以接近零的 Gram 行列式
  - 忘記相切也算命中或輸出 1-based 編號
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Vec3 { long double x; long double y; long double z; };

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      // TODO：把球轉成方向球面帽，枚舉帽中心與兩帽邊界交點。
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  struct Vec3 { long double x; long double y; long double z; };
  struct Cap { Vec3 center; long double threshold; };

  static Vec3 operator+(const Vec3& a, const Vec3& b) {
      return {a.x + b.x, a.y + b.y, a.z + b.z};
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

  static void consider(const Vec3& direction, const vector<Cap>& caps,
                       vector<int>& best_indices) {
      constexpr long double eps = 1e-11L;
      if (direction.x < -eps || direction.y < -eps || direction.z < -eps) {
          return;
      }
      vector<int> hit;
      for (size_t i = 0; i < caps.size(); ++i) {
          if (dot(caps[i].center, direction) + eps >= caps[i].threshold) {
              hit.push_back(static_cast<int>(i) + 1);
          }
      }
      if (hit.size() > best_indices.size()) { best_indices = move(hit); }
  }

  int main() {
      ios::sync_with_stdio(false);
      cin.tie(nullptr);
      int n;
      cin >> n;
      vector<Cap> caps;
      caps.reserve(static_cast<size_t>(n));
      for (int i = 0; i < n; ++i) {
          Vec3 center{};
          long double radius;
          cin >> center.x >> center.y >> center.z >> radius;
          const long double length = norm(center);
          caps.push_back(
              {center * (1.0L / length),
               sqrtl(max(0.0L, length * length - radius * radius)) / length});
      }
      vector<int> best_indices;
      for (const Cap& cap : caps) { consider(cap.center, caps, best_indices); }
      for (size_t i = 0; i < caps.size(); ++i) {
          for (size_t j = i + 1; j < caps.size(); ++j) {
              const Vec3 first = caps[i].center;
              const Vec3 second = caps[j].center;
              const long double cosine = dot(first, second);
              const long double determinant = 1.0L - cosine * cosine;
              if (determinant < 1e-18L) { continue; }
              const long double coefficient_first =
                  (caps[i].threshold - cosine * caps[j].threshold) /
                  determinant;
              const long double coefficient_second =
                  (caps[j].threshold - cosine * caps[i].threshold) /
                  determinant;
              const Vec3 base =
                  first * coefficient_first + second * coefficient_second;
              const long double remaining = 1.0L - dot(base, base);
              if (remaining < -1e-12L) { continue; }
              const Vec3 normal = cross(first, second);
              const long double scale =
                  sqrtl(max(0.0L, remaining)) / norm(normal);
              consider(base + normal * scale, caps, best_indices);
              consider(base + normal * (-scale), caps, best_indices);
          }
      }
      cout << best_indices.size() << '\n';
      for (size_t i = 0; i < best_indices.size(); ++i) {
          if (i != 0) { cout << ' '; }
          cout << best_indices[i];
      }
      cout << '\n';
  }
external_url: http://bailian.openjudge.cn/practice/2177/
external_platform: OpenJudge 百練
external_problem_id: '2177'
external_title: Ghost Busters
external_relation: original
source_book_pages: [543]
source_pdf_pages: [173]
review_status: verified
---

題面資訊依外部 OJ 頁面核實；敘述、證明與程式為本站獨立撰寫。
