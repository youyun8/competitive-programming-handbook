---
id: geometry-basics
volume: lower
source_file: lower-volume
chapter: 8
section: '8.1'
title: 二維計算幾何：點、向量與凸包骨架
summary: 以向量代數處理點積、叉積、線段關係、多邊形面積，並建立凸包、最近點對與旋轉卡尺的基礎。
prerequisites: [vectors, sorting]
learning_goals:
  - 以叉積判斷點相對線段的方向與面積
  - 實作凸包與多邊形面積模板
  - 理解旋轉卡尺與幾何掃描的應用
concepts: [vector, cross-product, dot-product, polygon, convex-hull]
complexity:
  time: varies by sub-problem
  space: O(n)
related_exercises: ['convex-hull-points']
source_book_pages: [510, 525]
source_pdf_pages: [140, 151]
review_status: verified
---

## 這個技術解決什麼問題

在平面上給定點、線、多邊形，需要回答位置關係、距離、面積、包絡、直徑等問題。向量運算是所有二維幾何的計算基礎。

## 辨識題型的訊號

輸入為座標點；涉及「在左側／右側」「順時針或逆時針」「多邊形面積」「最外圍點」「最遠點對」。

## 核心想法與直覺

- 叉積 $\vec{a} \times \vec{b}$：正為逆時針時針轉、負為順時針、絕對值為平行四邊形面積。
- 點積 $\vec{a} \cdot \vec{b}$：正為夾角小於 $90^\circ$，零為垂直，負為鈍角。
- 凸包保留最外層轉向一致的點；旋轉卡尺在凸包上同步移動兩條平行支撐線求直徑或寬度。

## 狀態／資料結構定義

點或向量結構含 $x$、$y$；運算子多載加減、與常數乘法；叉積與點積為獨立函式。

## 不變量或正確性證明

叉積的符號對應三點定向：$\text{cross}(o,a,b) > 0$ 當且僅當 $o \to a \to b$ 為左旋。凸包單調鏈中，堆疊保留一致轉向；彈出右轉點後，新鏈仍為凸。

## 逐步演算法

1. 定義點／向量結構與基本運算。
2. 以叉積判斷點是否在線段同側、是否共線。
3. 以單調鏈建立凸包：排序去重；正反向各建一次單調鏈。
4. 凸包上應用旋轉卡尺：對邊依面積最大化移動對向點。

## C++17 模板

```cpp
#include <cmath>
#include <vector>
#include <algorithm>

struct Point {
    long long x = 0;
    long long y = 0;

    bool operator<(const Point& other) const {
        return x != other.x ? x < other.x : y < other.y;
    }
    bool operator==(const Point& other) const {
        return x == other.x && y == other.y;
    }
};

Point operator-(const Point& a, const Point& b) {
    return {a.x - b.x, a.y - b.y};
}

long long cross(const Point& a, const Point& b) {
    return a.x * b.y - a.y * b.x;
}

long long cross(const Point& origin, const Point& left, const Point& right) {
    return cross(left - origin, right - origin);
}

long long dot(const Point& a, const Point& b) {
    return a.x * b.x + a.y * b.y;
}

long long dist2(const Point& a, const Point& b) {
    long long dx = a.x - b.x;
    long long dy = a.y - b.y;
    return dx * dx + dy * dy;
}

std::vector<Point> convex_hull(std::vector<Point> points) {
    std::sort(points.begin(), points.end());
    points.erase(std::unique(points.begin(), points.end()), points.end());
    if (points.size() <= 1) { return points; }

    std::vector<Point> hull;
    for (int pass = 0; pass < 2; ++pass) {
        const std::size_t start = hull.size();
        for (const Point& p : points) {
            while (hull.size() >= start + 2 &&
                   cross(hull[hull.size() - 2], hull.back(), p) <= 0) {
                hull.pop_back();
            }
            hull.push_back(p);
        }
        hull.pop_back();
        std::reverse(points.begin(), points.end());
    }
    return hull;
}
```

## 時間與空間複雜度

點積、叉積 $O(1)$；凸包排序主導 $O(n \log n)$；多邊形面積 $O(n)$；旋轉卡尺 $O(n)$。

## 常見錯誤與邊界條件

叉積溢位：座標範圍超過 $10^9$ 時需用 `long double` 或 `__int128`；共線點策略（$\le 0$ 或 $< 0$）要明確；凸包只有一個點時面積為 0。

## 與相似技巧的比較

浮點幾何用 `double` 與 epsilon，適合角度計算；整數幾何無精度問題但可能溢位。半平面交是凸包的對偶問題。

## 例題與分級練習

點在多邊形內、線段相交、凸包面積、最遠點對、最小覆蓋矩形、半平面交。

## 本節重點速查

叉積是方向與面積；點積是投影與夾角；凸包排序後掃描；共線策略要統一。
