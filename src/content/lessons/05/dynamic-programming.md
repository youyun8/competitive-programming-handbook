---
id: dynamic-programming
volume: upper
source_file: upper-volume
chapter: 5
section: '5.1'
title: 動態規劃：明確定義狀態再寫轉移
summary: 以狀態、轉移、初始化、計算順序與答案五件事建立可驗證的 DP。
prerequisites: [recursion, complexity]
learning_goals: [設計無歧義狀態, 推導轉移, 選擇拓撲順序與滾動陣列]
concepts: [state, transition, optimal-substructure, overlapping-subproblems]
complexity:
  time: states × transitions
  space: number of stored states
related_exercises: []
source_book_pages: [316, 385]
source_pdf_pages: [334, 403]
review_status: verified
visualizer: dynamic-programming
---

## 這個技術解決什麼問題

當大問題能由較小、重複出現的子問題組成，而且最佳解可由子問題最佳解推得，DP 會把每個狀態只算一次。

## 辨識題型的訊號

計數、最值、可行性；決策具有階段；暴力遞迴會重複相同參數組合。

## 核心想法與直覺

DP 不是「開陣列套公式」，而是把未來真正需要的歷史資訊壓成狀態。狀態越少越快，但必須足以決定後續。

## 狀態／資料結構定義

以爬樓梯為例，`dp[i]` 表示恰好到達第 `i` 階的方法數。最後一步只能從 `i-1` 或 `i-2` 來。

## 不變量或正確性證明

到達 `i` 的所有方案依最後一步分成兩個互斥且完整的集合，因此 `dp[i]=dp[i-1]+dp[i-2]`，沒有重複也沒有遺漏。

## 逐步演算法

寫狀態語意、列最後一步或最後決策、設定基底、按依賴順序計算、指定答案位置。

## C++17 模板

```cpp
long long count_ways(int steps) {
    if (steps <= 1) {
        return 1;
    }

    long long previous_two = 1;
    long long previous_one = 1;

    for (int current_step = 2; current_step <= steps; ++current_step) {
        const long long current = previous_one + previous_two;
        previous_two = previous_one;
        previous_one = current;
    }

    return previous_one;
}
```

## 時間與空間複雜度

狀態數乘上每個狀態的轉移數。此例時間 $O(n)$，滾動後空間 $O(1)$。

## 常見錯誤與邊界條件

狀態語意混淆「至多」與「恰好」、初始化與一般轉移衝突、計算順序尚未滿足依賴、原地更新方向錯誤。

## 與相似技巧的比較

貪心只保留局部選擇，需額外證明；搜尋枚舉狀態，記憶化搜尋是自頂向下 DP；最短路也可視為特定狀態圖上的 DP／鬆弛。

## 例題與分級練習

從 Fibonacci、最小路徑和、0/1 背包開始，逐步練習增加維度與壓縮狀態。

## 本節重點速查

狀態一句話說清楚；轉移覆蓋且互斥；初始化、順序、答案位置缺一不可。
