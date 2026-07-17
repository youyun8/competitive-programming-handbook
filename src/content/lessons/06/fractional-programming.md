---
id: fractional-programming
volume: lower
source_file: lower-volume
chapter: 6
section: '6.6'
title: 0/1 分數規劃
summary: 二分答案或 Dinkelbach 迭代，將最大化比率的組合選擇轉為可判定問題。
prerequisites: [binary-search, graphs]
learning_goals:
  - 掌握二分法與 Dinkelbach 迭代兩種架構
  - 選擇適合的內層判定問題
  - 應用於最短路、最大權生成樹等場景
concepts: [fractional-programming, dinkelbach, parametric-search]
complexity:
  time: depends on inner solver
  space: depends on inner solver
related_exercises: []
source_book_pages: [406, 410]
source_pdf_pages: [36, 40]
review_status: verified
---

## 這個技術解決什麼問題

選一組物品或路徑，最大化 `Σprofit / Σcost`。直接搜尋組合太龐大，轉為對答案 `r` 做二分，檢查是否存在組合使 `Σprofit - r*Σcost >= 0`。

## 辨識題型的訊號

最大化平均權重、效益成本比、最小化平均路徑長度、帶比率的組合優化。

## 核心想法與直覺

固定比率 `r`，新權重定義為 `profit - r*cost`。若存在合法組合使總新權重非負，則真實最優比率不小於 `r`。利用單調性二分或迭代更新 `r`。

## 狀態／資料結構定義

二元變數 `x_i` 表示第 i 項是否選中。對給定 `r`，內層問題為 `max Σ(p_i - r*c_i) * x_i`。

## 不變量或正確性證明

函數 `f(r) = max(Σp - r*Σc)` 對 `r` 嚴格遞減。`f(r) >= 0` 時最優值 `>= r`；`f(r) < 0` 時最優值 `< r`。二分搜尋的單調性保證正確收斂。

## 逐步演算法

1. 確定答案上下界 `low`、`high`。
2. 二分取 `mid = (low+high)/2`。
3. 以內層演算法求 `max Σ(p_i - mid*c_i)`。
4. 若結果 `>= 0`，則 `low = mid`；否則 `high = mid`。
5. Dinkelbach 變體直接以當前最佳組合更新 `r = Σp/Σc`，迭代至收斂。

## C++17 模板

```cpp
#include <vector>
#include <functional>

bool check(
    double ratio,
    const std::vector<double>& profit,
    const std::vector<double>& cost
) {
    double total = 0;
    for (std::size_t i = 0; i < profit.size(); ++i) {
        total += profit[i] - ratio * cost[i];
    }
    return total >= 0;
}

double fractional_programming(
    const std::vector<double>& profit,
    const std::vector<double>& cost,
    double low,
    double high
) {
    for (int iter = 0; iter < 60; ++iter) {
        double mid = (low + high) / 2.0;
        if (check(mid, profit, cost)) {
            low = mid;
        }
        else
            high = mid;
    }
    return low;
}
```

## 時間與空間複雜度

取決於內層判定問題。二分次數為 $O(\log (high-low) / \epsilon)$，Dinkelbach 迭代次數多為常數級。

## 常見錯誤與邊界條件

`cost` 為零需特判；浮點精度不足改用二分子次數；內層問題非凸時二分仍成立但 Dinkelbach 可能不收斂。

## 與相似技巧的比較

二分搜尋適合任何單調判定；Dinkelbach 收斂快但要求內層問題能求到最大解；與拉格朗日鬆弛同一精神但不用推導對偶。

## 例題與分級練習

初級：選 k 個物品使平均值最大；中級：分數規劃最短路；高級：參數搜尋結合最大流或最小割。

## 本節重點速查

比率問題轉加權和；單調性做二分；Dinkelbach 快但需最佳解；內層問題決定整體複雜度。
