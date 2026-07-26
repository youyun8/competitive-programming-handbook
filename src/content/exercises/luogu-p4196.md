---
id: luogu-p4196
volume: lower
source_file: lower-volume
title: 洛谷 P4196 半平面交：凸多邊形交集面積
chapter: 8
section: '8.5'
kind: external-oj
difficulty: 4
topics: ['半平面交', '極角排序', '雙端佇列', '凸多邊形']
prerequisites: ['geometry-basics', 'half-plane-intersection']
statement: 給定 n 個凸多邊形，每個多邊形的頂點皆依逆時針順序列出，求所有多邊形公共部分的面積。
constraints:
  - '2 <= n <= 10'
  - '3 <= m_i <= 50'
  - '-1000 <= x, y <= 1000'
  - 座標為整數，所有凸多邊形頂點依逆時針順序給出
input_format: 第一行一個整數 n 表示多邊形個數；接下來每個多邊形先一行一個整數 m，再 m 行每行兩個座標，逆時針給出。
output_format: 一行一個實數，交集面積（依原題要求保留小數位數）。
samples:
  - input: |
      2
      4
      0 0
      2 0
      2 2
      0 2
      3
      0 0
      2 0
      0 2
    output: |
      2.000
    explanation: >-
      本站自製基本範例。2×2 正方形與其左下半的直角三角形之交就是該三角形，面積為 2。
core_knowledge:
  - 凸多邊形是各邊內側半平面的交
  - 半平面依方向角排序
  - 雙端佇列維護可行邊界
judgment: 總邊數至多 500。把所有逆時針邊統一視為左側半平面後，問題就是半平面交；排序加雙端佇列可穩定處理平行邊與空交集。
hints:
  - 每個逆時針凸多邊形等於所有有向邊左側半平面的交；把全部邊放在同一組即可表示公共部分。
  - 依方向角排序，同方向只保留可行區域較小的那條；增量加入時，若頭端或尾端相鄰線交點被新半平面切掉，就彈出對應邊界。
  - 全部加入後還要讓隊首與隊尾互相收尾；不足三條有效邊界代表交集沒有面積，否則求相鄰交點並用鞋帶公式算面積。
solution_outline: >-
  把每個逆時針凸多邊形的每條有向邊 (v[k] → v[k+1]) 轉成一個半平面（左側為多邊形內部），全部收集起來。
  依方向角 atan2 排序，同角度只保留最靠左（最嚴格）的一條。用雙端佇列增量加入：先從尾端彈掉交點已被切掉的直線，
  再從頭端彈掉，然後推入當前直線。全部加完後用頭尾互相檢查到穩定。若佇列不足三條回傳空區域，
  否則相鄰兩條求交得到頂點，用 shoelace 算面積。因為輸入本身是有界凸多邊形，不需要額外補包圍框。
proof_or_invariant: >-
  不變量：每次迴圈結束後佇列中的直線方向角嚴格遞增，且相鄰兩條的交點都嚴格落在佇列中其他所有半平面的可行側，
  因此相鄰交點構成的多邊形就是「已加入半平面」之交。彈出安全性：設尾端兩條交於 q，若 q 不在新半平面左側則 q 不可行；
  由於方向角遞增且新直線角度最大，尾端直線能貢獻的邊界只在 q 附近那一段，q 被切掉後該段完全消失，故彈掉不會遺漏解。
complexity:
  time: O(m log m)，m 為所有多邊形的總邊數；排序主導，增量階段攤還 O(m)
  space: O(m)
common_errors:
  - 把逆時針邊的右側當成多邊形內部
  - 同方向半平面未去重，求交時除以零
  - 只從雙端佇列尾端彈出，漏處理隊首失效邊界
  - 忘記首尾收尾或空交集判定
  - 直接輸出帶符號鞋帶和而得到負面積
cpp_skeleton: |
  #include <bits/stdc++.h>
  using namespace std;

  static const double kEps = 1e-9;

  struct Vec {
      double x = 0;
      double y = 0;
  };

  static Vec operator+(const Vec& a, const Vec& b) { return {a.x + b.x, a.y + b.y}; }
  static Vec operator-(const Vec& a, const Vec& b) { return {a.x - b.x, a.y - b.y}; }
  static Vec operator*(const Vec& a, double t) { return {a.x * t, a.y * t}; }
  static double cross(const Vec& a, const Vec& b) { return a.x * b.y - a.y * b.x; }

  // 半平面：從 p 沿 v 前進，取 v 的左側為可行區域。
  struct Line {
      Vec p;
      Vec v;
  };

  static double angle_of(const Line& l) { return atan2(l.v.y, l.v.x); }
  static bool on_left(const Line& l, const Vec& q) { return cross(l.v, q - l.p) > kEps; }

  static Vec line_intersection(const Line& a, const Line& b) {
      const Vec u = a.p - b.p;
      return a.p + a.v * (cross(b.v, u) / cross(a.v, b.v));
  }

  static vector<Vec> half_plane_intersection(vector<Line> lines) {
      // 已備好：依方向角排序，同角度時把更靠左（更嚴格）的排在後面。
      sort(lines.begin(), lines.end(), [](const Line& a, const Line& b) {
          const double da = angle_of(a);
          const double db = angle_of(b);
          if (fabs(da - db) > kEps) { return da < db; }
          return cross(a.v, b.p - a.p) > 0.0;
      });

      // 已備好：每組同方向角只留最後一條，否則 cross(a.v, b.v) 為 0 會除以零。
      vector<Line> filtered;
      for (size_t i = 0; i < lines.size(); ++i) {
          if (i + 1 < lines.size() && fabs(angle_of(lines[i]) - angle_of(lines[i + 1])) <= kEps) {
              continue;
          }
          filtered.push_back(lines[i]);
      }

      deque<Line> dq;
      for (const Line& l : filtered) {
          while (dq.size() >= 2 &&
                 !on_left(l, line_intersection(dq[dq.size() - 1], dq[dq.size() - 2]))) {
              dq.pop_back();
          }
          // TODO 1：角度繞一圈，頭端也會被切掉。補上對稱的 pop_front：
          //         條件同樣是「頭兩條的交點不在新半平面左側」。
          dq.push_back(l);
      }

      // TODO 2：收尾。全部加完後首尾也相鄰，要用頭條檢查尾端、
      //         用尾條檢查頭端，各自迴圈到穩定（門檻是 size() >= 3）。

      if (dq.size() < 3) { return {}; }

      vector<Vec> poly;
      for (size_t i = 0; i < dq.size(); ++i) {
          poly.push_back(line_intersection(dq[i], dq[(i + 1) % dq.size()]));
      }
      return poly;
  }

  int main() {
      int polygon_count;
      if (!(cin >> polygon_count)) { return 0; }
      vector<Line> lines;
      for (int i = 0; i < polygon_count; ++i) {
          int m;
          cin >> m;
          vector<Vec> poly(static_cast<size_t>(m));
          for (Vec& p : poly) { cin >> p.x >> p.y; }
          for (size_t k = 0; k < poly.size(); ++k) {
              const Vec& a = poly[k];
              const Vec& b = poly[(k + 1) % poly.size()];
              lines.push_back({a, b - a});
          }
      }

      const vector<Vec> region = half_plane_intersection(lines);
      double twice = 0.0;
      for (size_t i = 0; i < region.size(); ++i) {
          twice += cross(region[i], region[(i + 1) % region.size()]);
      }
      cout << fixed << setprecision(3) << fabs(twice) / 2.0 << '\n';
      return 0;
  }
cpp_solution: |
  #include <bits/stdc++.h>
  using namespace std;

  static const double kEps = 1e-9;

  struct Vec {
      double x = 0;
      double y = 0;
  };

  static Vec operator+(const Vec& a, const Vec& b) { return {a.x + b.x, a.y + b.y}; }
  static Vec operator-(const Vec& a, const Vec& b) { return {a.x - b.x, a.y - b.y}; }
  static Vec operator*(const Vec& a, double t) { return {a.x * t, a.y * t}; }
  static double cross(const Vec& a, const Vec& b) { return a.x * b.y - a.y * b.x; }

  // 半平面：從 p 沿 v 前進，取 v 的左側為可行區域。
  struct Line {
      Vec p;
      Vec v;
  };

  static double angle_of(const Line& l) { return atan2(l.v.y, l.v.x); }
  static bool on_left(const Line& l, const Vec& q) { return cross(l.v, q - l.p) > kEps; }

  static Vec line_intersection(const Line& a, const Line& b) {
      const Vec u = a.p - b.p;
      return a.p + a.v * (cross(b.v, u) / cross(a.v, b.v));
  }

  static vector<Vec> half_plane_intersection(vector<Line> lines) {
      sort(lines.begin(), lines.end(), [](const Line& a, const Line& b) {
          const double da = angle_of(a);
          const double db = angle_of(b);
          if (fabs(da - db) > kEps) { return da < db; }
          // 同向平行時把更靠左（更嚴格）的排在後面。
          return cross(a.v, b.p - a.p) > 0.0;
      });

      // 每組同方向角只留最後一條，否則 cross(a.v, b.v) 為 0 會除以零。
      vector<Line> filtered;
      for (size_t i = 0; i < lines.size(); ++i) {
          if (i + 1 < lines.size() && fabs(angle_of(lines[i]) - angle_of(lines[i + 1])) <= kEps) {
              continue;
          }
          filtered.push_back(lines[i]);
      }

      deque<Line> dq;
      for (const Line& l : filtered) {
          while (dq.size() >= 2 &&
                 !on_left(l, line_intersection(dq[dq.size() - 1], dq[dq.size() - 2]))) {
              dq.pop_back();
          }
          while (dq.size() >= 2 && !on_left(l, line_intersection(dq[0], dq[1]))) { dq.pop_front(); }
          dq.push_back(l);
      }
      while (dq.size() >= 3 &&
             !on_left(dq[0], line_intersection(dq[dq.size() - 1], dq[dq.size() - 2]))) {
          dq.pop_back();
      }
      while (dq.size() >= 3 && !on_left(dq[dq.size() - 1], line_intersection(dq[0], dq[1]))) {
          dq.pop_front();
      }
      if (dq.size() < 3) { return {}; }

      vector<Vec> poly;
      for (size_t i = 0; i < dq.size(); ++i) {
          poly.push_back(line_intersection(dq[i], dq[(i + 1) % dq.size()]));
      }
      return poly;
  }

  int main() {
      int polygon_count;
      if (!(cin >> polygon_count)) { return 0; }
      vector<Line> lines;
      for (int i = 0; i < polygon_count; ++i) {
          int m;
          cin >> m;
          vector<Vec> poly(static_cast<size_t>(m));
          for (Vec& p : poly) { cin >> p.x >> p.y; }
          // 逆時針的每條邊，左側就是多邊形內部。
          for (size_t k = 0; k < poly.size(); ++k) {
              const Vec& a = poly[k];
              const Vec& b = poly[(k + 1) % poly.size()];
              lines.push_back({a, b - a});
          }
      }

      const vector<Vec> region = half_plane_intersection(lines);
      double twice = 0.0;
      for (size_t i = 0; i < region.size(); ++i) {
          twice += cross(region[i], region[(i + 1) % region.size()]);
      }
      cout << fixed << setprecision(3) << fabs(twice) / 2.0 << '\n';
      return 0;
  }
external_url: https://www.luogu.com.cn/problem/P4196
external_platform: 洛谷
external_problem_id: P4196
external_title: 【模板】半平面交 / [CQOI2006] 凸多邊形
external_relation: original
source_book_pages: [510, 525]
source_pdf_pages: [140, 151]
review_status: verified
---

半平面交的模板題。重點不在公式而在三個細節：方向統一取左側、同角度去重、頭尾都要彈。
