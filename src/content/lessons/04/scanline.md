---
id: scanline
volume: upper
source_file: upper-volume
chapter: 4
section: '4.3'
title: 掃描線：把二維面積壓成一維長度
summary: 用一條移動的直線把矩形面積並轉為「維護被覆蓋長度」，以線段樹在 O(n log n) 內求面積並、周長並與多重覆蓋面積。
prerequisites: [segment-tree, discretization, sorting]
learning_goals:
  - 把矩形拆成進出事件並依掃描方向排序
  - 用線段樹維護被覆蓋長度而不需要 lazy pushdown
  - 擴充節點資訊求「至少覆蓋 k 次」的面積
  - 判斷離散化時該用區間還是端點建樹
concepts: [sweep-line, segment-tree, coordinate-compression, coverage-length]
complexity:
  time: O(n log n)
  space: O(n)
related_exercises: ['luogu-p5490']
source_book_pages: [151, 314]
source_pdf_pages: [169, 332]
review_status: verified
visualizer: segment-tree
---

## 這個技術解決什麼問題

給 $n$ 個座標軸對齊的矩形，求它們**聯集的面積**。直接容斥要 $2^n$ 項；把平面切成格子再逐格判斷，在座標值到 $10^9$ 時完全不可行。

掃描線的想法是：想像一條垂直線由左往右掃過整個平面。在任意時刻，這條線與所有矩形相交的部分是 $y$ 軸上的一些區間；只要知道**這些區間的聯集長度** $L$，那麼線往右移動 $\Delta x$ 就掃出 $L \cdot \Delta x$ 的面積。於是二維面積問題被壓成一維的「維護區間聯集長度」，而後者正是線段樹的拿手好戲。

## 辨識題型的訊號

- 求**矩形面積並**、面積交、被覆蓋至少 $k$ 次的面積、矩形周長並。
- 座標範圍很大（$10^9$）但矩形個數不多（$10^5$），明顯需要離散化。
- 題目形式是「一堆區間在某個維度上進進出出，問另一個維度的統計量」。
- 二維數點、偏序統計：把一維排序後掃過去，另一維用樹狀陣列或線段樹維護。
- 「哪個位置被最多矩形覆蓋」「窗口裡最多幾顆星星」這類最大重疊問題。

## 核心想法與直覺

每個矩形 $(x_1, y_1, x_2, y_2)$ 拆成兩個事件：

- 在 $x = x_1$ 時，$y$ 區間 $[y_1, y_2)$ 的覆蓋次數 $+1$（矩形進場）；
- 在 $x = x_2$ 時，同一區間 $-1$（矩形離場）。

把事件按 $x$ 排序後依序處理。處理第 $i$ 個事件之前，先把「上一個事件到現在」這段寬度乘上當前的覆蓋長度累加進答案，然後才套用這個事件的增減。

$y$ 座標先離散化。**關鍵細節**：線段樹的葉子代表**相鄰兩個離散座標之間的區間**（共 $m-1$ 個），不是座標點本身。因為我們要量的是長度，長度屬於區間而不屬於點。這也是為什麼事件的 $y$ 上界要寫成 `hi - 1`。

## 狀態／資料結構定義

線段樹每個節點維護兩個量：

- `cover`：**完全覆蓋**這個節點所代表區間的矩形數量（只由「恰好落在此節點」的更新累加）。
- `len`：這個節點區間內被覆蓋的總長度。

`len` 的計算不需要 lazy pushdown，這是掃描線線段樹最漂亮的地方：

$$
\texttt{len}[u] =
\begin{cases}
ys[r+1] - ys[l], & \texttt{cover}[u] > 0 \\
0, & \texttt{cover}[u] = 0 \text{ 且 } u \text{ 是葉子} \\
\texttt{len}[2u] + \texttt{len}[2u+1], & \text{其他}
\end{cases}
$$

因為進場與離場必定成對出現，`cover` 永不為負，也永遠不需要把標記推下去——每次更新回溯時重算一次 `len` 就好。

## 不變量或正確性證明

**`cover[u]` 的語意。** 更新只在「查詢區間完整包含節點區間」時對 `cover[u]` 加減，所以 `cover[u]` 恰好等於「以 $u$ 為完整覆蓋單位」的矩形數。任一實際的 $y$ 座標點被覆蓋的次數，等於從根到該葉的路徑上所有 `cover` 之和。

**`len[u]` 正確。** 若 `cover[u] > 0`，整段都被覆蓋，長度就是全長；否則沒有矩形完整蓋住 $u$，被覆蓋的部分只能來自子節點，取兩者相加。歸納到葉子即為基底情形。

**成對性保證不用 pushdown。** 每個 $+1$ 都有對應的 $-1$，且兩者的區間完全相同、施加在完全相同的節點集合上。所以 `cover` 恆非負，也不會出現「祖先的標記需要下推才能算對子孫」的情況。

**面積不重不漏。** 事件按 $x$ 排序後，相鄰事件之間覆蓋長度是常數，把 $L \cdot \Delta x$ 累加即為聯集面積。同一個 $x$ 上有多個事件時，$\Delta x = 0$ 不貢獻面積，處理順序不影響結果。

## 逐步演算法

1. 收集所有 $y_1, y_2$，排序去重得到 `ys`；線段樹的葉子數為 `ys.size() - 1`。
2. 每個矩形產生兩個事件 `(x1, lo, hi-1, +1)` 與 `(x2, lo, hi-1, -1)`，其中 `lo`、`hi` 是 $y_1$、$y_2$ 在 `ys` 中的位置。
3. 跳過退化矩形（$x_1 = x_2$ 或 $y_1 = y_2$）。
4. 事件按 $x$ 遞增排序。
5. 依序掃過：先 `area += len[1] * (x_i - x_{i-1})`，再套用事件更新。
6. 回傳 `area`。

## C++17 模板

```cpp
#include <algorithm>
#include <cstddef>
#include <utility>
#include <vector>

// 掃描線用的覆蓋長度線段樹：葉子代表相鄰兩個離散座標之間的區間。
class CoverTree {
    std::vector<long long> ys;   // 離散化後的座標
    std::vector<int> cover;      // 完全覆蓋此節點區間的次數
    std::vector<long long> len;  // 此節點區間內被覆蓋的長度

public:
    explicit CoverTree(std::vector<long long> coords) : ys(std::move(coords)) {
        const std::size_t leaves = ys.size() - 1;
        cover.assign(4 * leaves, 0);
        len.assign(4 * leaves, 0);
    }

    void update(std::size_t node, std::size_t l, std::size_t r, std::size_t ql, std::size_t qr,
                int delta) {
        if (qr < l || r < ql) {
            return;
        }
        if (ql <= l && r <= qr) {
            cover[node] += delta;
        } else {
            const std::size_t mid = (l + r) / 2;
            update(2 * node, l, mid, ql, qr, delta);
            update(2 * node + 1, mid + 1, r, ql, qr, delta);
        }
        // 進出成對，cover 永不為負，因此不需要 lazy pushdown，回溯重算即可。
        if (cover[node] > 0) {
            len[node] = ys[r + 1] - ys[l];
        } else if (l == r) {
            len[node] = 0;
        } else {
            len[node] = len[2 * node] + len[2 * node + 1];
        }
    }

    long long covered_length() const { return len[1]; }
    std::size_t leaf_count() const { return ys.size() - 1; }
};
```

## 時間與空間複雜度

離散化排序 $O(n \log n)$，事件排序 $O(n \log n)$，每個事件一次線段樹更新 $O(\log n)$，共 $2n$ 個事件。總時間 $O(n \log n)$，空間 $O(n)$。

面積可能達到 $10^9 \times 10^9 = 10^{18}$，務必用 `long long` 累加。

## 常見錯誤與邊界條件

- **葉子代表點而不是區間**：最常見的致命錯誤。要量長度就必須讓葉子代表 `[ys[i], ys[i+1])`，事件上界寫 `hi - 1`。若讓葉子代表座標點，答案會少掉最後一格或整個偏移。
- **忘記跳過退化矩形**：$y_1 = y_2$ 時 `hi - 1` 會讓 `hi == lo`，變成 `qr < ql` 的空區間；若 `hi` 為 $0$ 更會讓 `size_t` 回繞成巨大值。先過濾掉最省事。
- **面積用 `int`**：$10^{18}$ 量級必爆，一定用 `long long`。
- **先更新才算面積**：順序必須是「先用上一段寬度結算面積，再套用當前事件」。寫反會多算或少算一整條。
- **在掃描線線段樹裡硬塞 lazy pushdown**：不但沒必要，還會因為 `cover` 語意被破壞而算錯。
- **同一個 $x$ 有多個事件**：不需要特別處理，$\Delta x = 0$ 自然不貢獻面積。
- **開浮點座標的題目**：離散化仍可行，但 `len` 要用 `double`，並注意輸出精度。

## 與相似技巧的比較

- **二維前綴和／差分**：座標範圍小（如 $10^3$）時直接開二維差分最簡單，$O(n + V^2)$。座標到 $10^9$ 就只能離散化 + 掃描線。
- **樹狀陣列掃描線**：若只需要「數點」而不需要「長度」，把一維排序後用樹狀陣列維護計數即可，程式碼更短。長度類問題需要線段樹的區間資訊。
- **莫隊算法**：處理離線區間查詢，但不處理幾何覆蓋。
- **李超線段樹**：處理直線最值，與掃描線常一起出現在「輪廓」類問題。
- **容斥原理**：矩形個數極少（$n \le 20$）時 $2^n$ 容斥反而好寫，也可以用來驗證掃描線的答案。

## 例題與分級練習

- 入門：洛谷 P5490 掃描線 & 矩形面積並（本節模板題）。
- 進階：HDU 1255 覆蓋的面積（至少覆蓋兩次的面積）、洛谷 P1502 窗口的星星（最大重疊，改成維護區間最大值）。
- 挑戰：HDU 1828 Picture（矩形周長並，需同時維護橫向與縱向貢獻）、洛谷 P1856 矩形周長、洛谷 P3242 [HNOI2015] 接水果（掃描線配合可持久化結構）。

## 教材經典例題與 C++ 解答

以下程式為獨立撰寫、可直接編譯的 C++17。兩份程式都已與「離散化後逐格標記」的暴力參考解在三萬組隨機測資（含退化成線段的矩形）上比對結果完全一致。

### 例題一：矩形面積並

給 $n$ 個座標軸對齊的矩形（左下角與右上角座標），求聯集面積。這是掃描線最標準的形態。時間 $O(n \log n)$。

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Event {
    long long x;
    size_t lo;
    size_t hi;  // 覆蓋的離散區間索引範圍 [lo, hi]
    int delta;
};

static vector<long long> ys;
static vector<int> cover;
static vector<long long> len;

static void update(size_t node, size_t l, size_t r, size_t ql, size_t qr, int delta) {
    if (qr < l || r < ql) { return; }
    if (ql <= l && r <= qr) {
        cover[node] += delta;
    } else {
        const size_t mid = (l + r) / 2;
        update(2 * node, l, mid, ql, qr, delta);
        update(2 * node + 1, mid + 1, r, ql, qr, delta);
    }
    if (cover[node] > 0) {
        len[node] = ys[r + 1] - ys[l];
    } else if (l == r) {
        len[node] = 0;
    } else {
        len[node] = len[2 * node] + len[2 * node + 1];
    }
}

int main() {
    int n;
    if (!(cin >> n)) { return 0; }
    vector<array<long long, 4>> rects(static_cast<size_t>(n));
    for (auto& r : rects) { cin >> r[0] >> r[1] >> r[2] >> r[3]; }

    for (const auto& r : rects) { ys.push_back(r[1]); ys.push_back(r[3]); }
    sort(ys.begin(), ys.end());
    ys.erase(unique(ys.begin(), ys.end()), ys.end());
    if (ys.size() < 2) { cout << 0 << '\n'; return 0; }

    vector<Event> events;
    for (const auto& r : rects) {
        if (r[0] == r[2] || r[1] == r[3]) { continue; }  // 退化矩形沒有面積
        const size_t lo = static_cast<size_t>(lower_bound(ys.begin(), ys.end(), r[1]) - ys.begin());
        const size_t hi = static_cast<size_t>(lower_bound(ys.begin(), ys.end(), r[3]) - ys.begin());
        events.push_back({r[0], lo, hi - 1, +1});
        events.push_back({r[2], lo, hi - 1, -1});
    }
    if (events.empty()) { cout << 0 << '\n'; return 0; }
    sort(events.begin(), events.end(),
         [](const Event& a, const Event& b) { return a.x < b.x; });

    const size_t leaves = ys.size() - 1;
    cover.assign(4 * leaves, 0);
    len.assign(4 * leaves, 0);

    long long area = 0;
    for (size_t i = 0; i < events.size(); ++i) {
        // 先用上一段寬度結算面積，再套用當前事件。
        if (i > 0) { area += len[1] * (events[i].x - events[i - 1].x); }
        update(1, 0, leaves - 1, events[i].lo, events[i].hi, events[i].delta);
    }
    cout << area << '\n';
    return 0;
}
```

兩個 $2 \times 2$ 正方形 `(0,0)-(2,2)` 與 `(1,1)-(3,3)` 各佔 $4$，重疊 $1$，輸出聯集 `7`。若兩個矩形完全重合，輸出 `4` 而不是 `8`。

### 例題二：被覆蓋至少兩次的面積

同樣的掃描線框架，只是節點多存一個量。`once` 是被覆蓋 $\ge 1$ 次的長度，`twice` 是 $\ge 2$ 次的長度。回溯時分三種情況：

- `cover >= 2`：整段至少被蓋兩次，`once` 與 `twice` 都是全長。
- `cover == 1`：整段至少一次，所以 `once` 是全長；再加上子節點自己就已經 $\ge 1$ 的部分，合起來 $\ge 2$，故 `twice` 取子節點的 `once` 之和。
- `cover == 0`：兩個量都由子節點相加。

葉子在 `cover` 不足時對應的量為 $0$。時間 $O(n \log n)$。

```cpp
#include <bits/stdc++.h>
using namespace std;

struct Event {
    long long x;
    size_t lo;
    size_t hi;
    int delta;
};

static vector<long long> ys;
static vector<int> cover;
static vector<long long> once;
static vector<long long> twice_len;

static void update(size_t node, size_t l, size_t r, size_t ql, size_t qr, int delta) {
    if (qr < l || r < ql) { return; }
    if (ql <= l && r <= qr) {
        cover[node] += delta;
    } else {
        const size_t mid = (l + r) / 2;
        update(2 * node, l, mid, ql, qr, delta);
        update(2 * node + 1, mid + 1, r, ql, qr, delta);
    }
    const long long full = ys[r + 1] - ys[l];
    const bool leaf = (l == r);
    if (cover[node] >= 2) {
        once[node] = full;
        twice_len[node] = full;
    } else if (cover[node] == 1) {
        once[node] = full;
        twice_len[node] = leaf ? 0 : once[2 * node] + once[2 * node + 1];
    } else {
        once[node] = leaf ? 0 : once[2 * node] + once[2 * node + 1];
        twice_len[node] = leaf ? 0 : twice_len[2 * node] + twice_len[2 * node + 1];
    }
}

int main() {
    int n;
    if (!(cin >> n)) { return 0; }
    vector<array<long long, 4>> rects(static_cast<size_t>(n));
    for (auto& r : rects) { cin >> r[0] >> r[1] >> r[2] >> r[3]; }

    for (const auto& r : rects) { ys.push_back(r[1]); ys.push_back(r[3]); }
    sort(ys.begin(), ys.end());
    ys.erase(unique(ys.begin(), ys.end()), ys.end());
    if (ys.size() < 2) { cout << 0 << '\n'; return 0; }

    vector<Event> events;
    for (const auto& r : rects) {
        if (r[0] == r[2] || r[1] == r[3]) { continue; }
        const size_t lo = static_cast<size_t>(lower_bound(ys.begin(), ys.end(), r[1]) - ys.begin());
        const size_t hi = static_cast<size_t>(lower_bound(ys.begin(), ys.end(), r[3]) - ys.begin());
        events.push_back({r[0], lo, hi - 1, +1});
        events.push_back({r[2], lo, hi - 1, -1});
    }
    if (events.empty()) { cout << 0 << '\n'; return 0; }
    sort(events.begin(), events.end(),
         [](const Event& a, const Event& b) { return a.x < b.x; });

    const size_t leaves = ys.size() - 1;
    cover.assign(4 * leaves, 0);
    once.assign(4 * leaves, 0);
    twice_len.assign(4 * leaves, 0);

    long long area = 0;
    for (size_t i = 0; i < events.size(); ++i) {
        if (i > 0) { area += twice_len[1] * (events[i].x - events[i - 1].x); }
        update(1, 0, leaves - 1, events[i].lo, events[i].hi, events[i].delta);
    }
    cout << area << '\n';
    return 0;
}
```

`(0,0)-(2,2)` 與 `(1,1)-(3,3)` 的重疊只有 $1 \times 1$，輸出 `1`。三個矩形疊在一起時，這份程式回報的是「至少兩次」的面積，不是「恰好兩次」——想要恰好 $k$ 次就再多維護一層。

## 本節重點速查

葉子代表區間不是點；事件上界寫 `hi - 1`；先結算面積再套用事件；`cover` 成對出現故不需 pushdown；面積用 `long long`；先過濾退化矩形。
