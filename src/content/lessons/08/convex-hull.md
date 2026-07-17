---
id: convex-hull
volume: lower
source_file: lower-volume
chapter: 8
section: '8.1'
title: 凸包：用叉積保留外層轉向
summary: 以 Andrew 單調鏈建立二維凸包，處理共線點、精度與幾何型別。
prerequisites: [sorting, vectors, cross-product]
learning_goals: [解釋叉積方向, 實作單調鏈, 決定共線點保留策略]
concepts: [cross-product, orientation, monotone-chain]
complexity:
  time: O(n log n)
  space: O(n)
related_exercises: []
source_book_pages: [510, 548]
source_pdf_pages: [140, 178]
review_status: verified
visualizer: convex-hull
---

## 這個技術解決什麼問題

凸包是包含所有點的最小凸多邊形，可作為旋轉卡尺、直徑、最小寬度等幾何演算法的外層骨架。

## 辨識題型的訊號

只關心最外圍點、支撐線、所有點的凸組合、最遠點對。

## 核心想法與直覺

先按座標排序。掃描建立下凸包時，只要最後三點不是所需方向的轉彎，就彈出中間點。

## 狀態／資料結構定義

用整數點與 `cross(origin,a,b)` 判斷從 `origin→a` 到 `origin→b` 的方向。

## 不變量或正確性證明

堆疊始終維持單調鏈與一致轉向；造成右轉的中間點位於新線段內側，不可能是凸包頂點。

## 逐步演算法

排序去重；正向建下凸包；反向建上凸包；去掉兩端重複點後串接。

## C++17 模板

```cpp
#include <algorithm>
#include <vector>

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

long long cross(const Point& origin, const Point& left, const Point& right) {
    return (left.x - origin.x) * (right.y - origin.y) -
           (left.y - origin.y) * (right.x - origin.x);
}

std::vector<Point> convex_hull(std::vector<Point> points) {
    std::sort(points.begin(), points.end());
    points.erase(std::unique(points.begin(), points.end()), points.end());
    if (points.size() <= 1) {
        return points;
    }

    std::vector<Point> hull;

    for (int pass = 0; pass < 2; ++pass) {
        const std::size_t start = hull.size();
        for (const Point& point : points) {
            while (hull.size() >= start + 2 &&
                   cross(hull[hull.size() - 2], hull.back(), point) <= 0) {
                hull.pop_back();
            }
            hull.push_back(point);
        }
        hull.pop_back();
        std::reverse(points.begin(), points.end());
    }

    return hull;
}
```

## 時間與空間複雜度

排序主導時間 $O(n\log n)$，掃描 $O(n)$，空間 $O(n)$。

## 常見錯誤與邊界條件

叉積溢位、全部共線、重複點，以及 `<=0` 或 `<0` 決定是否保留邊界共線點。

## 與相似技巧的比較

Graham scan 依極角排序；Andrew 直接依座標排序，通常更容易處理。浮點幾何另需 epsilon 策略。

## 例題與分級練習

先輸出凸包頂點，再求周長、面積與旋轉卡尺直徑。

## 本節重點速查

型別先決定；排序去重；明確選擇共線點策略；叉積符號就是轉向。
