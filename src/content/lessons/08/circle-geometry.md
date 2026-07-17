---
id: circle-geometry
volume: lower
source_file: lower-volume
chapter: 8
section: '8.2'
title: 圓的計算幾何：定義、相交與最小覆蓋
summary: 以圓的基本運算為基礎，實作最小圓覆蓋以包絡平面點集。
prerequisites: [geometry-basics]
learning_goals:
  - 判斷點與圓的位置關係
  - 計算兩圓相交與公切線
  - 實作 Welzl 演算法求最小覆蓋圓
concepts: [circle, tangent, minimum-enclosing-circle]
complexity:
  time: O(n) expected for Welzl
  space: O(n)
related_exercises: []
source_book_pages: [526, 535]
source_pdf_pages: [152, 161]
review_status: verified
---

## 這個技術解決什麼問題

當問題涉及圓形範圍、距離半徑約束，或需要找覆蓋所有點的最小圓時，必須建立圓的代數表示與幾何操作。

## 辨識題型的訊號

「覆蓋所有點的最小圓」「點是否在圓內」「兩圓交點」「與圓相切的直線」等。

## 核心想法與直覺

- 點在圓內：到圓心距離 $<$ 半徑。
- 兩圓相交：圓心距 $d$ 滿足 $|r_1-r_2| \le d \le r_1+r_2$。
- 最小覆蓋圓由兩點決定（直徑）或三點決定（外接圓）；Welzl 以隨機順序增量構造，期望線性。

## 狀態／資料結構定義

圓以圓心 $(x,y)$ 與半徑 $r$ 表示。為避免根號與浮點比較，常用距離平方判斷點是否在圓內。

## 不變量或正確性證明

Welzl 增量法依賴「最小覆蓋圓唯一」且「新點在圓外時必在新圓邊界上」。對部分點集 $R$（強制在邊界上），最小圓可在 $O(|R|^3)$ 內確定；因 $|R| \le 3$，期望總時間為線性。

## 逐步演算法

1. 隨機打亂點集。
2. 維護目前圓 $C$；對每個點 $p_i$，若 $p_i$ 在 $C$ 外，則以 $p_i$ 為強制邊界點重新計算最小圓。
3. 強制邊界遞迴至多三層，每層枚舉候選圓。

## C++17 模板

```cpp
#include <vector>
#include <cmath>
#include <random>
#include <algorithm>

struct Point {
    double x = 0, y = 0;
};

struct Circle {
    Point c;
    double r = 0;
};

static double dist2(const Point& a, const Point& b) {
    double dx = a.x - b.x;
    double dy = a.y - b.y;
    return dx * dx + dy * dy;
}

static bool inside(const Circle& circle, const Point& p) {
    return dist2(circle.c, p) <= circle.r * circle.r + 1e-12;
}

static Circle circle_from(const Point& a, const Point& b) {
    Point m{(a.x + b.x) * 0.5, (a.y + b.y) * 0.5};
    double r = std::sqrt(dist2(a, b)) * 0.5;
    return {m, r};
}

static Circle circle_from(const Point& a, const Point& b, const Point& cc) {
    double d = 2.0 * (a.x * (b.y - cc.y) + b.x * (cc.y - a.y) + cc.x * (a.y - b.y));
    if (std::abs(d) < 1e-12) return circle_from(a, b);
    double ux = ((a.x * a.x + a.y * a.y) * (b.y - cc.y)
               + (b.x * b.x + b.y * b.y) * (cc.y - a.y)
               + (cc.x * cc.x + cc.y * cc.y) * (a.y - b.y)) / d;
    double uy = ((a.x * a.x + a.y * a.y) * (cc.x - b.x)
               + (b.x * b.x + b.y * b.y) * (a.x - cc.x)
               + (cc.x * cc.x + cc.y * cc.y) * (b.x - a.x)) / d;
    Point cen{ux, uy};
    double r = std::sqrt(dist2(cen, a));
    return {cen, r};
}

static Circle welzl_helper(std::vector<Point>& pts, std::vector<Point> boundary, int n) {
    if (n == 0 || boundary.size() == 3) {
        if (boundary.size() == 0) return {{0, 0}, 0};
        if (boundary.size() == 1) return {boundary[0], 0};
        if (boundary.size() == 2) return circle_from(boundary[0], boundary[1]);
        return circle_from(boundary[0], boundary[1], boundary[2]);
    }
    int idx = n - 1;
    Circle c = welzl_helper(pts, boundary, n - 1);
    if (inside(c, pts[idx])) return c;
    boundary.push_back(pts[idx]);
    return welzl_helper(pts, boundary, n - 1);
}

Circle minimum_enclosing_circle(std::vector<Point> pts) {
    std::shuffle(pts.begin(), pts.end(), std::mt19937(std::random_device{}()));
    return welzl_helper(pts, {}, static_cast<int>(pts.size()));
}
```

## 時間與空間複雜度

Welzl 期望 $O(n)$；最壞 $O(n^4)$ 但隨機打亂後幾乎不發生。空間 $O(n)$。

## 常見錯誤與邊界條件

所有點共線時圓由最遠兩點決定；僅一點時半徑為 0；浮點比較需 epsilon；隨機種子要穩定或固定以保證可重現性。

## 與相似技巧的比較

凸包是外接多邊形骨架；最小覆蓋圓是外接圓最小化。最小覆蓋矩形可用旋轉卡尺，最小覆蓋球是三維推廣。

## 例題與分級練習

兩圓相交面積、點集最小覆蓋圓、圓與多邊形相交、圓的切線構造。

## 本節重點速查

點在圓內用距離平方；Welzl 隨機增量；邊界點至多三個；浮點注意 epsilon。
