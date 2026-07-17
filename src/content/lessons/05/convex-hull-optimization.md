---
id: convex-hull-optimization
volume: upper
source_file: upper-volume
chapter: 5
section: '5.9'
title: 斜率優化／凸殼優化
summary: 把 DP 轉移式看成直線求值，用凸包或李超線段樹把 O(n²) 轉移降到 O(n log n) 或 O(n)。
prerequisites: [dynamic-programming, monotone-queue]
learning_goals: [將轉移式化為直線形式, 用凸包維護下包絡線, 在線與離線查詢的選擇]
concepts: [convex-hull-trick, slope-optimization, li-chao]
complexity:
  time: O(n log n) 或 O(n)
  space: O(n)
related_exercises: []
source_book_pages: [371, 378]
source_pdf_pages: [389, 396]
review_status: verified
---

## 這個技術解決什麼問題

當 DP 轉移式形如 `dp[i] = min(dp[j] + (x_i - x_j)² + ...)` 或更一般的 `dp[i] = min(dp[j] + m_j * x_i + b_j)`，其中決策變數 j 的係數只與 j 有關、而 x_i 只與 i 有關，就可以將每個 j 視為一條直線 `y = m_j * x + b_j`，查詢 `x = x_i` 時的最小 y 值。這就是把 O(n²) 轉移降到 O(n log n) 的斜率優化。

## 辨識題型的訊號

轉移式可化為 dp[j] + a[j] \* b[i] + c[j] + d[i]；查詢點 x_i 若單調，可用雙端佇列維護凸包做到 O(n)；若不單調則用李超線段樹 O(n log n)。

## 核心想法與直覺

每個決策 j 對應一條直線。很多直線會被其他直線完全壓在下面，永遠不會成為最小值。凸包只保留「有機會成為最小值」的直線，查詢時二分或移動指標。

## 狀態／資料結構定義

用 vector 或 deque 儲存凸包上的直線（每條直線用斜率 m 與截距 b 表示）。若查詢 x 單調單調遞增，則凸包也單調，可用隊首指標；否則用李超線段樹動態插入與查詢。

## 不變量或正確性證明

對於最小值問題，若兩條直線 L1、L2 的交點 x 座標小於 L2、L3 的交點，則 L2 永遠不會是最小值，可以移除。因此凸包上的直線按斜率排序後，交點 x 座標嚴格遞增。查詢時只要二分找到包含 x_i 的區間即可。

## 逐步演算法

1. 把轉移式重排成 `dp[i] = min_j (m_j * x_i + b_j) + const_i`。
2. 對每個 i：
   a. 若 x_i 單調：從凸包前端彈出過期的直線，隊首即答案。
   b. 若不單調：在凸包上二分搜尋最小值。
   c. 把 i 對應的新直線加入凸包，並從後端彈出被覆蓋的直線。

## C++17 模板

```cpp
#include <bits/stdc++.h>
using namespace std;

class ConvexHullOptimizationTemplate {
    struct Line {
        long long m, b;
        long long eval(long long x) const { return m * x + b; }
    };

    static double intersect_x(const Line& a, const Line& b) {
        return (static_cast<double>(b.b) - static_cast<double>(a.b)) /
               (static_cast<double>(a.m) - static_cast<double>(b.m));
    }

public:
    static long long offline_monotone_cht(const vector<long long>& x,
                                          const vector<long long>& dp_base,
                                          const vector<long long>& m) {
        const int n = static_cast<int>(x.size());
        vector<long long> dp(n);
        deque<Line> hull;
        for (int i = 0; i < n; ++i) {
            // 若 x 單調單調遞增，彈出隊首不再最優的直線
            while (hull.size() >= 2 &&
                   hull[0].eval(x[i]) >= hull[1].eval(x[i])) {
                hull.pop_front();
            }
            if (!hull.empty()) {
                dp[i] = hull.front().eval(x[i]) + dp_base[i];
            } else {
                dp[i] = dp_base[i]; // 根據題目調整
            }
            Line nl{m[i], dp[i]};
            // 維護下凸包，斜率遞增時交點遞增
            while (hull.size() >= 2 &&
                   intersect_x(hull[hull.size() - 2], hull.back()) >=
                   intersect_x(hull.back(), nl)) {
                hull.pop_back();
            }
            hull.push_back(nl);
        }
        return dp[n - 1];
    }
};
```

## 時間與空間複雜度

單調查詢 + 單調插入：O(n)。任意查詢：二分 O(log n) 每次或李超線段樹 O(log C)。空間均為 O(n)。

## 常見錯誤與邊界條件

- 斜率相等時截距處理錯誤（留大的或小的取決於求 max/min）。
- 單調性方向寫反導致凸包不是下凸包。
- 浮點數精度問題：可用交叉相乘避免。
- 忘記加上只與 i 有關的常數項。

## 與相似技巧的比較

單調佇列是斜率優化的特例（斜率固定或視窗固定）；四邊形不等式用於區間 DP；李超線段樹則是不需單調性的通用直線插入與查詢結構。

## 例題與分級練習

- 入門：DP 式明顯為直線型（如 dp[i] = min_j(dp[j] + (i-j)²))。
- 中級：斜率單調時用 deque 維護凸包。
- 進階：查詢不單調時用李超線段樹；分治 DP 優化（Aliens）。

## 本節重點速查

寫成 y = mx + b；維護凸包交點交點遞增；單調查詢用 deque，任意查詢用二分或李超樹。
