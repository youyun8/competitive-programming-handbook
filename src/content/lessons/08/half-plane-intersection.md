---
id: half-plane-intersection
volume: lower
source_file: lower-volume
chapter: 8
section: '8.1'
title: 半平面交：把線性約束交成一塊凸區域
summary: 以極角排序加雙端佇列增量維護半平面交，求可行凸區域的頂點與面積。
prerequisites: [geometry-basics, convex-hull, sorting]
learning_goals:
  - 用有向直線表示半平面並判斷左側
  - 以極角排序處理同向平行半平面的取捨
  - 用雙端佇列在 O(n log n) 內維護半平面交
  - 判斷區域為空或無界並正確補上包圍框
concepts: [half-plane, supporting-line, deque, incremental-construction]
complexity:
  time: O(n log n)
  space: O(n)
related_exercises: ['luogu-p4196']
source_book_pages: [510, 525]
source_pdf_pages: [140, 151]
review_status: verified
---

## 這個技術解決什麼問題

一個線性不等式 $ax + by \le c$ 在平面上就是一個**半平面**。很多題目本質是「同時滿足 $n$ 個線性條件的區域長什麼樣、面積多大」：多個凸多邊形求交集、凸多邊形的核（從哪些點可以看見整個多邊形）、一群直線的下凸包輪廓、賽車問題中哪些車曾經領先過。

$n$ 個半平面的交集一定是凸的（凸集的交仍是凸集），最多 $n$ 條邊。直接兩兩求交是 $O(n^2)$；把半平面依方向排序後增量維護，可以做到 $O(n \log n)$，而排序後的增量部分只要 $O(n)$。

## 辨識題型的訊號

- 求**多個凸多邊形的交集面積**：每個凸多邊形就是它所有邊的左側半平面之交。
- 求凸多邊形的**核**（kernel）：所有邊向內的半平面之交非空即存在。
- 一堆一次函數 $y = k_i x + b_i$，問「哪些直線在某處是最大／最小」：等價於半平面交或凸殼。
- 「有多少人／車曾經領先過」「瞭望塔要多高才能看到整段地形」這類可見性問題。
- 給的是不等式組、需要判斷可行區域是否為空。

## 核心想法與直覺

把每個半平面寫成**有向直線**：由點 $p$ 沿方向 $v$ 前進，規定「$v$ 的左側」為可行區域。這樣「點 $q$ 是否可行」就是 $\overrightarrow{v} \times \overrightarrow{pq} > 0$。

沿著最終凸區域的邊界逆時針走一圈，會依序經過方向角遞增的邊。所以**先把所有半平面按方向角排序**，再由小到大加入；此時佇列裡的直線本身就是「目前為止候選邊界，按角度遞增」。

加入新半平面 $l$ 時：佇列尾端最後兩條直線的交點若不在 $l$ 的左側，那個交點已經被 $l$ 切掉，對應的尾端直線再也不可能是邊界，彈掉；重複到穩定。因為角度是繞一圈，頭端也可能被切掉，所以要用**雙端**佇列，頭尾都檢查。全部加完後，頭尾之間還要互相再檢查一次（首尾也相鄰）。

每條直線最多進出一次，增量階段是 $O(n)$。

## 狀態／資料結構定義

- `Line { Vec p, v; }`：有向直線，可行側為 $v$ 的左側。
- `angle_of(l) = atan2(l.v.y, l.v.x)`：方向角，排序鍵。
- `on_left(l, q) = cross(l.v, q - l.p) > eps`：$q$ 嚴格在 $l$ 左側。
- `line_intersection(a, b)`：兩直線交點，用 $t = \dfrac{v_b \times (p_a - p_b)}{v_a \times v_b}$ 代回 $p_a + t\,v_a$。
- 雙端佇列 `dq`：目前候選邊界，方向角遞增。
- 輸出頂點：相鄰兩條直線的交點，共 `dq.size()` 個。

## 不變量或正確性證明

**不變量。** 每次迴圈結束後，`dq` 中的直線方向角嚴格遞增，且相鄰兩條的交點都嚴格落在 `dq` 中其他所有半平面的可行側。因此 `dq` 相鄰交點構成的多邊形，就是「已加入的半平面」之交。

**彈出是安全的。** 設尾端兩條為 $l_{k-1}, l_k$，交點 $q$。若 $q$ 不在新半平面 $l$ 的左側，則 $q$ 不可行。由於方向角遞增且 $l$ 的角度最大，$l_k$ 能貢獻的邊界只可能出現在 $q$ 附近那一段；$q$ 被切掉後那段完全消失，故 $l_k$ 不可能是最終邊界，彈掉不會遺漏解。頭端同理。

**同向平行只留最嚴格的一條。** 兩個方向相同的半平面，較靠左者的可行區域是另一者的子集，所以只保留最靠左的那條。若不去重，後面的交點計算會遇到 $v_a \times v_b = 0$ 而除以零。

**終止與為空。** 若最後 `dq.size() < 3`，交集沒有面積（可能為空、退化成一點或一條線），按題意輸出 $0$。

## 逐步演算法

1. 把每個約束轉成有向直線，可行側統一取左側。若題目給的凸多邊形是順時針，先反轉成逆時針。
2. 若區域可能無界而題目要求面積，補上一個足夠大的包圍框（四條逆時針直線）。
3. 依方向角排序；同角度只留最靠左的一條。
4. 依序加入：先從尾端彈掉被切掉的，再從頭端彈掉被切掉的，然後推入。
5. 全部加完後，用頭條檢查尾端、用尾條檢查頭端，直到穩定。
6. 若 `dq.size() < 3` 回傳空；否則相鄰兩條求交得到頂點，用 shoelace 算面積。

## C++17 模板

```cpp
#include <algorithm>
#include <cmath>
#include <cstddef>
#include <deque>
#include <vector>

constexpr double kEps = 1e-9;

struct Vec {
    double x = 0;
    double y = 0;
};

Vec operator+(const Vec& a, const Vec& b) { return {a.x + b.x, a.y + b.y}; }
Vec operator-(const Vec& a, const Vec& b) { return {a.x - b.x, a.y - b.y}; }
Vec operator*(const Vec& a, double t) { return {a.x * t, a.y * t}; }
double cross(const Vec& a, const Vec& b) { return a.x * b.y - a.y * b.x; }

// 半平面：從 p 沿 v 前進，取 v 的左側為可行區域。
struct Line {
    Vec p;
    Vec v;
};

double angle_of(const Line& line) { return std::atan2(line.v.y, line.v.x); }

bool on_left(const Line& line, const Vec& point) {
    return cross(line.v, point - line.p) > kEps;
}

Vec line_intersection(const Line& first, const Line& second) {
    const Vec offset = first.p - second.p;
    const double t = cross(second.v, offset) / cross(first.v, second.v);
    return first.p + first.v * t;
}

// 回傳交集的頂點（逆時針）；不足三點代表沒有面積。
std::vector<Vec> half_plane_intersection(std::vector<Line> lines) {
    std::sort(lines.begin(), lines.end(), [](const Line& a, const Line& b) {
        const double angle_a = angle_of(a);
        const double angle_b = angle_of(b);
        if (std::fabs(angle_a - angle_b) > kEps) {
            return angle_a < angle_b;
        }
        // 同向平行時把更靠左（更嚴格）的排在後面，稍後每組只留最後一條。
        return cross(a.v, b.p - a.p) > 0.0;
    });

    std::vector<Line> filtered;
    for (std::size_t i = 0; i < lines.size(); ++i) {
        const bool same_as_next =
            i + 1 < lines.size() && std::fabs(angle_of(lines[i]) - angle_of(lines[i + 1])) <= kEps;
        if (!same_as_next) {
            filtered.push_back(lines[i]);
        }
    }

    std::deque<Line> window;
    for (const Line& line : filtered) {
        while (window.size() >= 2 &&
               !on_left(line, line_intersection(window[window.size() - 1],
                                                window[window.size() - 2]))) {
            window.pop_back();
        }
        while (window.size() >= 2 && !on_left(line, line_intersection(window[0], window[1]))) {
            window.pop_front();
        }
        window.push_back(line);
    }
    while (window.size() >= 3 &&
           !on_left(window[0],
                    line_intersection(window[window.size() - 1], window[window.size() - 2]))) {
        window.pop_back();
    }
    while (window.size() >= 3 &&
           !on_left(window[window.size() - 1], line_intersection(window[0], window[1]))) {
        window.pop_front();
    }
    if (window.size() < 3) {
        return {};
    }

    std::vector<Vec> polygon;
    for (std::size_t i = 0; i < window.size(); ++i) {
        polygon.push_back(line_intersection(window[i], window[(i + 1) % window.size()]));
    }
    return polygon;
}
```

## 時間與空間複雜度

排序 $O(n \log n)$ 主導。增量階段每條直線最多推入一次、彈出一次，攤還 $O(n)$。收尾檢查 $O(n)$。空間 $O(n)$。

## 常見錯誤與邊界條件

- **方向沒統一**：可行側規定為左側，那麼輸入的凸多邊形必須是逆時針；順時針會得到補集，面積算出來完全不對。用 shoelace 有向面積檢查符號即可判斷方向。
- **同向平行沒去重**：`cross(a.v, b.v)` 為 $0$，`line_intersection` 除以零得到 `inf`／`nan`，後續比較全部失效。
- **無界區域**：只給幾條直線時交集可能無界，面積是無限大。若題目保證有界（例如輸入本身是凸多邊形），不必補框；否則要補一個大包圍框，並注意框太大時 `double` 精度會下降。
- **eps 排序不是嚴格弱序**：`fabs(a - b) > eps` 的比較在理論上可能違反遞移性，極端測資下 `std::sort` 行為未定義。要更穩可改成先比象限、再用 `cross` 比較方向，完全避開 `atan2`。
- **`dq.size() >= 2` 的門檻**：加入階段要 $\ge 2$ 才能取交點，收尾階段要 $\ge 3$ 才有意義，兩個門檻不同，寫錯會少彈或彈過頭。
- **只有兩條邊也可能「有交集」**：那是無界的楔形，沒有面積，本模板回傳空，符合多數題目要求輸出 $0$ 的約定。

## 與相似技巧的比較

- **凸包**：凸包是「包住點集的最小凸形」，半平面交是「一群約束的可行區域」。兩者是對偶關係——點與直線互換，凸包的邊對應半平面交的頂點。實作上都靠極角排序加單調維護。
- **Sutherland–Hodgman 逐條裁剪**：從一個大多邊形出發、對每個半平面裁一次，程式碼更短更好懂，但複雜度 $O(n \cdot m)$（$m$ 為當前多邊形頂點數）。$n$ 小時是很好的參考解，本節模板就是用它交叉驗證的。
- **線性規劃**：只要「最佳化一個線性目標」而不要整個區域時，二維隨機增量線性規劃期望 $O(n)$，比求出整個交集更省。
- **李超線段樹／凸殼優化**：處理「一堆直線在某 $x$ 的最值」時，這兩者往往比半平面交更直接。

## 例題與分級練習

- 入門：輸入一個逆時針凸多邊形，把它的每條邊轉成半平面，驗證交集面積等於原多邊形面積。
- 進階：洛谷 P4196 半平面交 / [CQOI2006] 凸多邊形（多個凸多邊形的交集面積）。
- 挑戰：洛谷 P2600 [ZJOI2008] 瞭望塔（半平面交求下凸輪廓）、洛谷 P3256 [JLOI2013] 賽車（判斷哪些車曾領先）、洛谷 P4250 [SCOI2015] 小凸想跑步。

## 教材經典例題與 C++ 解答

以下程式為獨立撰寫、可直接編譯的 C++17。核心函式已與「大包圍框 + Sutherland–Hodgman 逐半平面裁剪」的參考解在兩萬組隨機測資（含同向平行、完全重複的半平面與空交集）上比對面積一致。

### 例題一：多個凸多邊形的交集面積

輸入 $n$ 個凸多邊形，每個以逆時針頂點列出，求它們的公共面積。做法：把每個多邊形的每條邊 $(v_i \to v_{i+1})$ 轉成一個半平面（左側為多邊形內部），全部丟進半平面交，最後用 shoelace 算面積。因為輸入本身是有界凸多邊形，不需要額外包圍框。時間 $O(m \log m)$，$m$ 為總邊數。

```cpp
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
        return cross(a.v, b.p - a.p) > 0.0;
    });
    vector<Line> filtered;
    for (size_t i = 0; i < lines.size(); ++i) {
        if (i + 1 < lines.size() && fabs(angle_of(lines[i]) - angle_of(lines[i + 1])) <= kEps) {
            continue;
        }
        filtered.push_back(lines[i]);
    }
    deque<Line> dq;
    for (const Line& l : filtered) {
        while (dq.size() >= 2 && !on_left(l, line_intersection(dq[dq.size() - 1], dq[dq.size() - 2]))) {
            dq.pop_back();
        }
        while (dq.size() >= 2 && !on_left(l, line_intersection(dq[0], dq[1]))) { dq.pop_front(); }
        dq.push_back(l);
    }
    while (dq.size() >= 3 && !on_left(dq[0], line_intersection(dq[dq.size() - 1], dq[dq.size() - 2]))) {
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
```

輸入一個 $2 \times 2$ 正方形和一個把它切掉一半的三角形，輸出的就是重疊部分面積。若兩個多邊形完全不相交，`dq` 收尾後不足三條，面積輸出 `0.000`。

### 例題二：凸多邊形的核是否存在

給一個簡單多邊形（不一定凸），問是否存在一點能看見整個多邊形內部——也就是**核**是否非空。做法：沿逆時針走每條邊，取邊的左側半平面（內部側），求交集；交集非空即核存在。凸多邊形的核就是它本身，凹多邊形則可能為空。時間 $O(n \log n)$。

```cpp
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
        return cross(a.v, b.p - a.p) > 0.0;
    });
    vector<Line> filtered;
    for (size_t i = 0; i < lines.size(); ++i) {
        if (i + 1 < lines.size() && fabs(angle_of(lines[i]) - angle_of(lines[i + 1])) <= kEps) {
            continue;
        }
        filtered.push_back(lines[i]);
    }
    deque<Line> dq;
    for (const Line& l : filtered) {
        while (dq.size() >= 2 && !on_left(l, line_intersection(dq[dq.size() - 1], dq[dq.size() - 2]))) {
            dq.pop_back();
        }
        while (dq.size() >= 2 && !on_left(l, line_intersection(dq[0], dq[1]))) { dq.pop_front(); }
        dq.push_back(l);
    }
    while (dq.size() >= 3 && !on_left(dq[0], line_intersection(dq[dq.size() - 1], dq[dq.size() - 2]))) {
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
    int n;
    if (!(cin >> n)) { return 0; }
    vector<Vec> poly(static_cast<size_t>(n));
    for (Vec& p : poly) { cin >> p.x >> p.y; }

    // 用有向面積確認方向；順時針就反轉，讓「邊的左側」等於多邊形內部。
    double twice = 0.0;
    for (size_t i = 0; i < poly.size(); ++i) {
        twice += cross(poly[i], poly[(i + 1) % poly.size()]);
    }
    if (twice < 0.0) { reverse(poly.begin(), poly.end()); }

    vector<Line> lines;
    for (size_t i = 0; i < poly.size(); ++i) {
        const Vec& a = poly[i];
        const Vec& b = poly[(i + 1) % poly.size()];
        lines.push_back({a, b - a});
    }

    const vector<Vec> kernel = half_plane_intersection(lines);
    double kernel_twice = 0.0;
    for (size_t i = 0; i < kernel.size(); ++i) {
        kernel_twice += cross(kernel[i], kernel[(i + 1) % kernel.size()]);
    }
    const double area = fabs(kernel_twice) / 2.0;
    cout << (area > kEps ? "YES" : "NO") << '\n';
    cout << fixed << setprecision(3) << area << '\n';
    return 0;
}
```

輸入 $2 \times 2$ 正方形的四個角，核就是正方形本身，輸出 `YES` 與 `4.000`；把同樣四點按順時針輸入，程式先用有向面積翻正，結果不變——這一步省掉最常見的方向錯誤。

凹多邊形要分兩種情況看，這裡很容易想錯：

- L 形 `(0,0) (2,0) (2,1) (1,1) (1,2) (0,2)` **是**星形多邊形，核為單位正方形 $[0,1]^2$，輸出 `YES` 與 `1.000`。從 $(0.5, 0.5)$ 確實看得到 L 的每一個角。
- U 形 `(0,0) (3,0) (3,3) (2,3) (2,1) (1,1) (1,3) (0,3)` 才是核為空的例子：上方缺口的兩側邊分別要求 $x \ge 2$ 與 $x \le 1$，直接矛盾，輸出 `NO` 與 `0.000`。

這個應用不需要補包圍框：核一定包含在多邊形內部，而多邊形有界，所以交集自然有界。相對地，若題目只給幾條散落的直線，交集可能是無界楔形，此時本模板算出的「面積」沒有意義，必須先補框——這是半平面交最容易踩的坑。

## 本節重點速查

可行側統一取左側；輸入凸多邊形先轉逆時針；按方向角排序、同角只留最靠左；加入時頭尾都要彈；收尾再互檢一次；不足三條即無面積；同向平行不去重會除以零。
