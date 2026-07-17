---
id: 3d-geometry
volume: lower
source_file: lower-volume
chapter: 8
section: '8.3'
title: 三維計算幾何：點、面與凸包
summary: 以向量推廣到三維空間，處理點線面關係、叉積與混合積，並建立三維凸包與最小覆蓋球的概念。
prerequisites: [geometry-basics]
learning_goals:
  - 在三維空間操作點積、叉積與混合積
  - 判斷點是否在三角形或四面體內
  - 理解三維凸包的建構思路與複雜度
concepts: [3d-point, cross-product-3d, convex-hull-3d]
complexity:
  time: O(n²) for naive 3D hull
  space: O(n)
related_exercises: []
source_book_pages: [536, 548]
source_pdf_pages: [162, 178]
review_status: verified
---

## 這個技術解決什麼問題

當問題延伸到空間（如建築模型、分子結構、衛星覆蓋），二維運算不再適用，需要三維的點、向量、面與體積計算。

## 辨識題型的訊號

輸入為 $(x,y,z)$ 座標；涉及「空間直線夾角」「四面體體積」「點到平面距離」「空間點集的凸包」。

## 核心想法與直覺

- 三維叉積：兩向量決定的法向量，模長為平行四邊形面積。
- 混合積 $(\vec{a} \times \vec{b}) \cdot \vec{c}$：平行六面體有向體積；正負判斷點在平面哪一側。
- 三維凸包：包含所有點的最小凸多面體；可用增量法或分治策略建構。

## 狀態／資料結構定義

點或向量結構含 $x,y,z$。面以三個頂點索引與外法向量表示；需維護面的鄰接關係以便增量更新。

## 不變量或正確性證明

混合積的絕對值 $|(a \times b) \cdot c|$ 是以 $a,b,c$ 為鄰邊的平行六面體體積。若四點共面則混合積為 0；正負由右手定則決定相對方向。凸包不變性：每個面的所有點均在該面之同一側或面上。

## 逐步演算法

1. 定義點／向量結構與點積、叉積、混合積運算。
2. 判斷點相對有向平面的位置（混合積正負）。
3. 以增量法建三維凸包：對每個新點，刪除可見面，加入新形成的錐面。

## C++17 模板

```cpp
#include <cmath>
#include <vector>

struct Point3 {
    double x = 0, y = 0, z = 0;

    Point3 operator-(const Point3& other) const {
        return {x - other.x, y - other.y, z - other.z};
    }
};

Point3 cross(const Point3& a, const Point3& b) {
    return {
        a.y * b.z - a.z * b.y,
        a.z * b.x - a.x * b.z,
        a.x * b.y - a.y * b.x
    };
}

double dot(const Point3& a, const Point3& b) {
    return a.x * b.x + a.y * b.y + a.z * b.z;
}

double mixed(const Point3& a, const Point3& b, const Point3& c) {
    return dot(cross(a, b), c);
}

double dist2(const Point3& a, const Point3& b) {
    double dx = a.x - b.x;
    double dy = a.y - b.y;
    double dz = a.z - b.z;
    return dx * dx + dy * dy + dz * dz;
}

// 四面體有向體積
double tetrahedron_volume(const Point3& a, const Point3& b,
                          const Point3& c, const Point3& d) {
    return std::abs(mixed(b - a, c - a, d - a)) / 6.0;
}

// 判斷點 p 是否在三角形 abc 所在平面的「正側」（法向量方向）
bool above_plane(const Point3& a, const Point3& b, const Point3& c,
                 const Point3& p) {
    return mixed(b - a, c - a, p - a) > 1e-12;
}
```

## 時間與空間複雜度

點積、叉積、混合積均 $O(1)$；增量法三維凸包期望 $O(n^2)$；分治法可達 $O(n \log n)$。空間 $O(n)$。

## 常見錯誤與邊界條件

浮點精度問題比二維更嚴重：共面、共線判斷需較寬的 epsilon；所有點共面時三維凸包退化為二維；叉積方向搞反會導致可見面判斷錯誤。

## 與相似技巧的比較

二維凸包用角度或排序掃描；三維凸包的面鄰接關係更複雜，需額外維護半邊資料結構。最小覆蓋球在三維的 Welzl 演算法與二維同結構，但邊界點可能多達四個。

## 例題與分級練習

點到直線與平面距離、兩直線最短距離、四面體體積、三維凸包表面積與體積、最小覆蓋球。

## 本節重點速查

叉積得法向量；混合積得體積與側別；浮點精度更嚴苛；增量法刪除可見面建凸包。
