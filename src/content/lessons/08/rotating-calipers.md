---
id: rotating-calipers
volume: lower
source_file: lower-volume
chapter: 8
section: '8.1'
title: 旋轉卡尺：在凸包上繞一圈求極值
summary: 以對踵點對讓兩條平行支撐線沿凸包同步旋轉，線性時間求直徑、寬度與最小面積外接矩形。
prerequisites: [convex-hull, cross-product, two-pointers]
learning_goals:
  - 說明支撐線與對踵點對的關係
  - 用單調指標在凸包上線性求直徑
  - 以三個卡尺指標求最小面積外接矩形
  - 判斷何時可用嚴格遞增爬升、何時會卡在平台
concepts: [rotating-calipers, antipodal-pair, supporting-line, monotone-pointer]
complexity:
  time: O(n log n) 建凸包，卡尺本身 O(n)
  space: O(n)
related_exercises: ['luogu-p1452']
source_book_pages: [510, 525]
source_pdf_pages: [140, 151]
review_status: verified
---

## 這個技術解決什麼問題

「平面上最遠的兩個點相距多少」若直接兩兩枚舉是 $O(n^2)$，$n = 5 \times 10^4$ 就跑不動。但最遠點對一定都在凸包上，而且凸包的凸性讓「對每條邊找最遠頂點」這件事具有單調性：邊順著逆時針轉，最遠頂點也只會往同方向走，永不回頭。於是兩個指標各繞凸包一圈就結束，卡尺部分是 $O(n)$，總複雜度由建凸包的排序主導。

同一套框架換一個「要最大化的量」，就能求最小寬度、最小面積外接矩形、兩凸包間最近距離。

## 辨識題型的訊號

- 求平面點集的**最遠點對**（直徑），或最遠距離的平方。
- 求能包住所有點的**最小面積／最小周長矩形**（矩形不限定與座標軸平行）。
- 求凸多邊形的**寬度**（兩條平行支撐線的最小間距）。
- 兩個凸多邊形之間的最近或最遠距離。
- 題目給的點數到 $10^4$ 以上，$O(n^2)$ 明顯超時，但答案只跟最外圍有關。

## 核心想法與直覺

想像用一把游標卡尺夾住凸包：兩片鉗口是兩條**平行支撐線**，各自貼在凸包上。把卡尺繞著凸包慢慢轉一圈，每個角度都記錄一次兩鉗口的距離，取極值就是答案。

離散化之後，「角度」由凸包的邊決定：讓一片鉗口貼合邊 $(a, b)$，另一片鉗口貼到的那個頂點，就是離直線 $ab$ 最遠的頂點，稱為這條邊的**對踵點**。而「離直線 $ab$ 最遠」等價於「三角形 $a b p$ 面積最大」，也就是 $\operatorname{cross}(a, b, p)$ 最大——分母 $|ab|$ 對固定的邊是常數，所以比大小時根本不用開根號，整數運算即可。

關鍵是單調性：邊逆時針轉動時，對踵點也單調逆時針移動。所以對踵點指標整趟只前進 $n$ 步，不需要對每條邊重新搜尋。

## 狀態／資料結構定義

- `hull`：逆時針、**已去除共線多餘點**的凸包頂點陣列，長度 $n$。
- `cross(a, b, p)`：$\overrightarrow{ab} \times \overrightarrow{ap}$，正值代表 $p$ 在 $ab$ 左側；數值等於三角形 $abp$ 的兩倍面積，可直接當「到直線 $ab$ 的距離 × $|ab|$」使用。
- `proj(dx, dy, p)` $= dx \cdot p_x + dy \cdot p_y$：$p$ 在方向 $(dx, dy)$ 上的投影（未除以長度），用來找某方向上最前／最後的頂點。
- 卡尺指標：求直徑只需一個 `opposite`；求最小外接矩形需要三個——`top`（離底邊最遠）、`right`（沿底邊方向最前）、`left`（沿底邊反方向最前）。

所有指標都統一寫成「最大化某個仿射函數」的形式，這一點在正確性上很重要，見下一節。

## 不變量或正確性證明

**最遠點對必在凸包上。** 若 $p$ 不是凸包頂點，$p$ 落在某條邊 $uv$ 的內側或線段上，那麼對任意 $q$，$|pq| \le \max(|uq|, |vq|)$：把 $p$ 沿 $uv$ 往兩端走，離 $q$ 的距離是凸函數，極大值在端點取得。所以把 $p$ 換成 $u$ 或 $v$ 不會變差。

**對踵點的單調性。** 固定 $p$，函數 $i \mapsto \operatorname{cross}(hull_i, hull_{i+1}, p)$ 隨邊旋轉連續變化；固定邊，函數 $k \mapsto \operatorname{cross}(a, b, hull_k)$ 在環上是**循環單峰**的（凸多邊形對一個仿射函數，沿邊界走的值先升後降）。兩者相配，最佳 $k$ 隨 $i$ 單調不減，因此指標只需前進、不需回退，總移動量 $O(n)$。

**為什麼嚴格 `>` 的爬升是安全的。** 仿射函數在凸多邊形上出現「平手」的唯一情形，是有一整條邊垂直於該方向；而那條邊本身就落在最大值上。所以用嚴格大於爬升，停下來的位置一定已經取到最大值，不會停在半山腰。

**但起點不能挑在平台上。** 若把 `top` 初始化在 $a$（也就是索引 $i$），那麼 $\operatorname{cross}(a,b,a) = 0$，而下一個點正是 $b$，$\operatorname{cross}(a,b,b)$ 同樣是 $0$：嚴格 `>` 不成立，指標當場卡死，高度算出 $0$。因此本節的作法是**先用一次 $O(n)$ 掃描定出三個指標的初始位置**，之後才進入單調爬升。這一步不影響總複雜度，卻省掉一整類難查的錯誤。

## 逐步演算法

1. 建凸包（Andrew 單調鏈），輸出逆時針且不含共線多餘點的 `hull`。
2. 特判 $n \le 2$：直接回傳兩點距離或 $0$。
3. 用一次線性掃描，對第 $0$ 條邊求出各卡尺指標的初始位置。
4. 對每條邊 $(hull_i, hull_{i+1})$：
   - 把 `top` 往前推到 $\operatorname{cross}$ 不再嚴格變大；
   - 需要時把 `right` / `left` 往前推到投影不再嚴格變大；
   - 用當前指標算出這個角度下的候選答案，更新極值。
5. 繞完一圈即得答案。

## C++17 模板

```cpp
#include <algorithm>
#include <cstddef>
#include <vector>

struct Point {
    long long x = 0;
    long long y = 0;
};

long long cross(const Point& origin, const Point& first, const Point& second) {
    return (first.x - origin.x) * (second.y - origin.y) -
           (first.y - origin.y) * (second.x - origin.x);
}

long long squared_distance(const Point& first, const Point& second) {
    const long long dx = first.x - second.x;
    const long long dy = first.y - second.y;
    return dx * dx + dy * dy;
}

// 只在卡尺起步時呼叫一次，避免指標從 cross 為 0 的平台起步而卡死。
template <typename Value>
std::size_t argmax_vertex(std::size_t count, Value value) {
    std::size_t best = 0;
    for (std::size_t k = 1; k < count; ++k) {
        if (value(k) > value(best)) {
            best = k;
        }
    }
    return best;
}

// hull 需為逆時針、已去除共線多餘點的凸包；回傳直徑的平方（整數，不必開根號）。
long long convex_hull_diameter(const std::vector<Point>& hull) {
    const std::size_t n = hull.size();
    if (n < 2) {
        return 0;
    }
    if (n == 2) {
        return squared_distance(hull[0], hull[1]);
    }

    std::size_t opposite =
        argmax_vertex(n, [&](std::size_t k) { return cross(hull[0], hull[1], hull[k]); });

    long long best = 0;
    for (std::size_t i = 0; i < n; ++i) {
        const Point& base_from = hull[i];
        const Point& base_to = hull[(i + 1) % n];
        // 對踵點：讓三角形 base_from-base_to-opposite 的面積最大。
        while (cross(base_from, base_to, hull[(opposite + 1) % n]) >
               cross(base_from, base_to, hull[opposite])) {
            opposite = (opposite + 1) % n;
        }
        best = std::max(best, std::max(squared_distance(base_from, hull[opposite]),
                                       squared_distance(base_to, hull[opposite])));
    }
    return best;
}
```

## 時間與空間複雜度

建凸包 $O(n \log n)$（排序主導）。卡尺階段每個指標最多前進 $n$ 步，加上外層一圈，共 $O(n)$。初始掃描 $O(n)$。總時間 $O(n \log n)$，空間 $O(n)$。

若題目已經給定凸多邊形而不必自行建凸包，整體就是 $O(n)$。

## 常見錯誤與邊界條件

- **凸包含共線點**：單調鏈用 `<= 0` 彈出才會去掉共線點；若保留共線點，卡尺的單峰性會出現長平台，嚴格 `>` 可能提早停下。
- **指標起點落在平台**：如上所述，`top` 從索引 $i$ 起步會立刻卡死，務必先掃描定位。
- **退化輸入**：所有點重合（凸包只剩 1 點）、全部共線（凸包退化成 2 點）都要特判，否則 `% n` 與對踵點邏輯會失去意義。
- **整數溢位**：座標到 $10^9$ 時 `cross` 與 `proj` 的乘積達 $10^{18}$ 量級，逼近 `long long` 上限；`squared_distance` 同理。座標大時要估算範圍或改用 `__int128`。
- **距離開根號**：比大小時不要開根號，保留平方值既快又精確；只在輸出要求實數時才轉 `double`。
- **求最小面積矩形時把 `left` 寫成「往下走找最小」**：在平手處會停不下來或提早停。統一改成「最大化反方向投影」才穩。

## 與相似技巧的比較

- **暴力兩兩枚舉**：$O(n^2)$，$n \le 2000$ 可用，寫起來最短，適合驗證卡尺實作是否正確。
- **K-D 樹**：能處理最近點對、$k$ 遠點對等更一般的查詢，常數較大；旋轉卡尺只處理凸包上的極值，但在該範圍內幾乎最快。
- **分治法求最近點對**：最近點對不能用旋轉卡尺（最近的兩點可能都在凸包內部），要用 $O(n \log n)$ 分治或掃描線。**最遠**用卡尺，**最近**用分治，這組對照很容易記錯。
- **半平面交**：同樣建立在凸性上，但求的是可行區域而非極值。

## 例題與分級練習

- 入門：先求凸包頂點與周長，再改成求直徑的平方，用暴力 $O(n^2)$ 對照答案。
- 進階：洛谷 P1452 Beauty Contest（凸包直徑）、洛谷 P3187 最小矩形覆蓋（三指標卡尺，另需依題目要求輸出四個角點）。
- 挑戰：OpenJ_Bailian 3851 Bridge Across Islands（兩凸包間最近距離），把「最大化」改成「最小化」時要重新確認單峰方向。

## 教材經典例題與 C++ 解答

以下程式為獨立撰寫、可直接編譯的 C++17，兩個核心函式都已與暴力解在數萬組隨機測資（含大量共線與重複點）上比對一致。

### 例題一：凸包直徑（最遠點對距離的平方）

給定 $n$ 個整數座標點，求最遠兩點距離的平方。先建凸包，再用單一對踵點指標繞一圈。因為只需要比較大小，全程保持整數，沒有任何精度問題。時間 $O(n \log n)$。

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

static long long squared_distance(const Point& a, const Point& b) {
    const long long dx = a.x - b.x;
    const long long dy = a.y - b.y;
    return dx * dx + dy * dy;
}

// Andrew 單調鏈：逆時針凸包，`<= 0` 會順手去掉共線多餘點。
static vector<Point> convex_hull(vector<Point> points) {
    sort(points.begin(), points.end(),
         [](const Point& a, const Point& b) { return a.x != b.x ? a.x < b.x : a.y < b.y; });
    points.erase(unique(points.begin(), points.end(),
                        [](const Point& a, const Point& b) { return a.x == b.x && a.y == b.y; }),
                 points.end());
    const size_t n = points.size();
    if (n < 3) { return points; }
    vector<Point> hull(2 * n);
    size_t k = 0;
    for (size_t i = 0; i < n; ++i) {
        while (k >= 2 && cross(hull[k - 2], hull[k - 1], points[i]) <= 0) { --k; }
        hull[k++] = points[i];
    }
    const size_t lower = k + 1;
    for (size_t i = n - 1; i-- > 0;) {
        while (k >= lower && cross(hull[k - 2], hull[k - 1], points[i]) <= 0) { --k; }
        hull[k++] = points[i];
    }
    hull.resize(k - 1);
    return hull;
}

int main() {
    int n;
    if (!(cin >> n)) { return 0; }
    vector<Point> points(static_cast<size_t>(n));
    for (Point& p : points) { cin >> p.x >> p.y; }

    const vector<Point> hull = convex_hull(points);
    const size_t m = hull.size();
    if (m < 2) { cout << 0 << '\n'; return 0; }
    if (m == 2) { cout << squared_distance(hull[0], hull[1]) << '\n'; return 0; }

    // 先掃描定出對踵點起始位置，避免從 cross 為 0 的平台起步。
    size_t opposite = 0;
    for (size_t k = 1; k < m; ++k) {
        if (cross(hull[0], hull[1], hull[k]) > cross(hull[0], hull[1], hull[opposite])) {
            opposite = k;
        }
    }

    long long best = 0;
    for (size_t i = 0; i < m; ++i) {
        const Point& a = hull[i];
        const Point& b = hull[(i + 1) % m];
        while (cross(a, b, hull[(opposite + 1) % m]) > cross(a, b, hull[opposite])) {
            opposite = (opposite + 1) % m;
        }
        best = max(best, max(squared_distance(a, hull[opposite]), squared_distance(b, hull[opposite])));
    }
    cout << best << '\n';
    return 0;
}
```

輸入單位正方形的四個角 `(0,0) (1,0) (1,1) (0,1)`，凸包就是這四點，直徑是對角線，輸出 `2`。

### 例題二：最小面積外接矩形

求能包住所有點、邊不必平行座標軸的最小面積矩形。關鍵事實：**最小面積矩形必有一邊與凸包的某條邊重合**。於是枚舉凸包的每一條邊當底，用三個卡尺指標同時維持「最高點」「沿底邊方向最前點」「反方向最前點」，即可算出該角度下矩形的高與寬。

高 $= \operatorname{cross}(a,b,\text{top}) / |ab|$，寬 $= (\operatorname{proj}(\text{right}) - \operatorname{proj}(\text{left})) / |ab|$，兩者相乘時 $|ab|$ 剛好合成 $|ab|^2$，所以只需要一次除法，中間量全是整數。時間 $O(n \log n)$。

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

static long long squared_distance(const Point& a, const Point& b) {
    const long long dx = a.x - b.x;
    const long long dy = a.y - b.y;
    return dx * dx + dy * dy;
}

// 方向 (dx, dy) 上的投影，未除以長度；只用來比大小。
static long long proj(long long dx, long long dy, const Point& p) {
    return dx * p.x + dy * p.y;
}

static vector<Point> convex_hull(vector<Point> points) {
    sort(points.begin(), points.end(),
         [](const Point& a, const Point& b) { return a.x != b.x ? a.x < b.x : a.y < b.y; });
    points.erase(unique(points.begin(), points.end(),
                        [](const Point& a, const Point& b) { return a.x == b.x && a.y == b.y; }),
                 points.end());
    const size_t n = points.size();
    if (n < 3) { return points; }
    vector<Point> hull(2 * n);
    size_t k = 0;
    for (size_t i = 0; i < n; ++i) {
        while (k >= 2 && cross(hull[k - 2], hull[k - 1], points[i]) <= 0) { --k; }
        hull[k++] = points[i];
    }
    const size_t lower = k + 1;
    for (size_t i = n - 1; i-- > 0;) {
        while (k >= lower && cross(hull[k - 2], hull[k - 1], points[i]) <= 0) { --k; }
        hull[k++] = points[i];
    }
    hull.resize(k - 1);
    return hull;
}

int main() {
    int n;
    if (!(cin >> n)) { return 0; }
    vector<Point> points(static_cast<size_t>(n));
    for (Point& p : points) { cin >> p.x >> p.y; }

    const vector<Point> hull = convex_hull(points);
    const size_t m = hull.size();
    if (m < 3) { cout << fixed << setprecision(4) << 0.0 << '\n'; return 0; }

    // 三個指標都用「最大化仿射函數」的形式，先掃描定出初始位置。
    const long long dx0 = hull[1].x - hull[0].x;
    const long long dy0 = hull[1].y - hull[0].y;
    size_t top = 0, right = 0, left = 0;
    for (size_t k = 1; k < m; ++k) {
        if (cross(hull[0], hull[1], hull[k]) > cross(hull[0], hull[1], hull[top])) { top = k; }
        if (proj(dx0, dy0, hull[k]) > proj(dx0, dy0, hull[right])) { right = k; }
        if (proj(-dx0, -dy0, hull[k]) > proj(-dx0, -dy0, hull[left])) { left = k; }
    }

    double best = numeric_limits<double>::max();
    for (size_t i = 0; i < m; ++i) {
        const Point& a = hull[i];
        const Point& b = hull[(i + 1) % m];
        const long long dx = b.x - a.x;
        const long long dy = b.y - a.y;
        while (cross(a, b, hull[(top + 1) % m]) > cross(a, b, hull[top])) { top = (top + 1) % m; }
        while (proj(dx, dy, hull[(right + 1) % m]) > proj(dx, dy, hull[right])) { right = (right + 1) % m; }
        while (proj(-dx, -dy, hull[(left + 1) % m]) > proj(-dx, -dy, hull[left])) { left = (left + 1) % m; }

        const long long height = cross(a, b, hull[top]);
        const long long span = proj(dx, dy, hull[right]) - proj(dx, dy, hull[left]);
        const double area = static_cast<double>(height) * static_cast<double>(span) /
                            static_cast<double>(squared_distance(a, b));
        best = min(best, area);
    }
    cout << fixed << setprecision(4) << best << '\n';
    return 0;
}
```

對單位正方形的四個角，最小外接矩形就是它自己，輸出 `1.0000`。再試傾斜的正方形 `(0,1) (1,0) (2,1) (1,2)`：它的邊長是 $\sqrt{2}$、面積 $2$，程式輸出 `2.0000`；而與座標軸平行的最小外框是 $2 \times 2 = 4$。這個落差正是「矩形不必平行座標軸」的意義。

## 本節重點速查

先建乾淨凸包（去共線）；把每個卡尺指標寫成「最大化仿射函數」；起始位置先掃一次再爬升；比距離保持平方、保持整數；最遠用卡尺、最近用分治。
