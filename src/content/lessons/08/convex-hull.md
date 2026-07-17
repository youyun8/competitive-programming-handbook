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
related_exercises: ['convex-hull-points']
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

## 教材經典例題與 C++ 解答

以下例題對應本章教材的凸包與多邊形面積主題。題意皆為本站重新敘述，程式為獨立撰寫、可直接編譯的 C++17，讀完即得完整解法。

### 例題一：凸包頂點與周長（Andrew monotone chain）

給定平面上一組點，求其凸包的頂點數與周長。先按座標排序去重，再分別建下凸包與上凸包：加入新點時，只要最後三點不維持逆時針轉向（叉積 `≤ 0`）就彈出中間點，如此共線的多餘點也會被剔除。排序主導，時間 O(n log n)。

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Point {
    long long x;
    long long y;
};

static long long cross(const Point& o, const Point& a, const Point& b) {
    return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

// Andrew monotone chain：回傳逆時針凸包頂點（不含共線多餘點）。
static vector<Point> convex_hull(vector<Point> points) {
    sort(points.begin(), points.end(),
         [](const Point& a, const Point& b) { return a.x != b.x ? a.x < b.x : a.y < b.y; });
    points.erase(unique(points.begin(), points.end(),
                        [](const Point& a, const Point& b) { return a.x == b.x && a.y == b.y; }),
                 points.end());
    const int n = static_cast<int>(points.size());
    if (n < 3) { return points; }
    vector<Point> hull(2 * static_cast<size_t>(n));
    int k = 0;
    for (int i = 0; i < n; ++i) {
        while (k >= 2 && cross(hull[k - 2], hull[k - 1], points[i]) <= 0) { --k; }
        hull[k++] = points[i];
    }
    int lower = k + 1;
    for (int i = n - 2; i >= 0; --i) {
        while (k >= lower && cross(hull[k - 2], hull[k - 1], points[i]) <= 0) { --k; }
        hull[k++] = points[i];
    }
    hull.resize(static_cast<size_t>(k - 1));
    return hull;
}

int main() {
    int n;
    if (!(cin >> n)) { return 0; }
    vector<Point> points(n);
    for (Point& p : points) { cin >> p.x >> p.y; }
    vector<Point> hull = convex_hull(points);
    double perimeter = 0.0;
    for (size_t i = 0; i < hull.size(); ++i) {
        const Point& a = hull[i];
        const Point& b = hull[(i + 1) % hull.size()];
        perimeter += hypot(static_cast<double>(a.x - b.x), static_cast<double>(a.y - b.y));
    }
    cout << hull.size() << '\n';
    cout << fixed << setprecision(4) << perimeter << '\n';
    return 0;
}
```

輸入單位正方形的四個角點，輸出頂點數 `4` 與周長 `16.0000`。若把邊上的共線點也加入，叉積 `≤ 0` 的判定會自動略過它們。

### 例題二：多邊形面積（shoelace）

用有向面積公式（shoelace）計算簡單多邊形面積：沿邊界累加 `x[i]·y[i+1] - x[i+1]·y[i]`，取絕對值再除以二。每條有向邊與原點形成的帶符號三角形相加，內部重疊互相抵消，只留下多邊形面積。為避免浮點誤差，這裡保留兩倍面積為整數，最後才處理 `.5`。時間 O(n)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 有向面積（shoelace）：回傳簡單多邊形面積，與頂點給定順序無關。
int main() {
    int n;
    if (!(cin >> n)) { return 0; }
    vector<long long> x(n), y(n);
    for (int i = 0; i < n; ++i) { cin >> x[i] >> y[i]; }
    long long twice = 0;
    for (int i = 0; i < n; ++i) {
        int j = (i + 1) % n;
        twice += x[i] * y[j] - x[j] * y[i];
    }
    twice = llabs(twice);
    cout << twice / 2;
    if (twice % 2 != 0) { cout << ".5"; }
    cout << '\n';
    return 0;
}
```

對同一個 4×4 正方形，輸出面積 `16`。因為用整數保留兩倍面積，像三角形這種面積帶半數的情形也能精確輸出 `.5`。

## 本節重點速查

型別先決定；排序去重；明確選擇共線點策略；叉積符號就是轉向。
