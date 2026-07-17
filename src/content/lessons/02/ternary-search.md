---
id: ternary-search
volume: upper
source_file: upper-volume
chapter: 2
section: '2.4'
title: 三分法：單峰函數的極值搜尋
summary: 利用單峰函數的幾何性質，每次排除三分之一區間，快速逼近最大值或最小值所在位置。
prerequisites: [binary-search, complexity]
learning_goals:
  - 判斷函數是否具備單峰性並選擇三分或二分
  - 正確處理整數三分的邊界與相鄰區間
  - 避免浮點三分中無限迴圈與精度問題
concepts: [unimodal-function, ternary-search, convexity]
complexity:
  time: O(log n)
  space: O(1)
related_exercises: []
source_book_pages: [33, 95]
source_pdf_pages: [51, 113]
review_status: verified
---

## 這個技術解決什麼問題

當目標函數具有單峰性（先嚴格遞增再嚴格遞減，或相反），三分法能透過比較兩個內分點，確定極值不在哪一側，從而每次排除約三分之一區間。

## 辨識題型的訊號

- 函數明顯只有一個峰值或谷底，如拋物線、距離函數、凸優化問題。
- 需要最大化或最小化一個連續變數的單變量函數。
- 整數定義域上求最優配置，且調整變數具有單調影響。

## 核心想法與直覺

取兩個三等分點 m1 與 m2。若 f(m1) < f(m2)，則極值不可能在 m1 左側（因為兩點都在峰值的同一邊或橫跨峰值，左側只會更低）；反之則排除 m2 右側。每次保留含有極值的區間。

## 狀態／資料結構定義

維護區間 [left, right]，與兩個內分點 m1 = left + (right - left) / 3，m2 = right - (right - left) / 3。

## 不變量或正確性證明

假設函數在 [left, right] 內先增後後減（單峰）。若 f(m1) < f(m2)，則對所有 x <= m1，由單峰性質 f(x) <= f(m1) < f(m2)，這些 x 不可能是最大值，因此可以安全排除 [left, m1]。另一情況對稱成立。對於先減後增（谷形）亦同。

## 逐步演算法

1. 初始化搜尋邊界 [left, right]。
2. 當 right - left 足夠小（浮點）或 <= 2（整數）：
   - 計算 m1, m2。
   - 比較 f(m1) 與 f(m2)。
   - 若 f(m1) < f(m2)，left = m1 + 1（整數）或 left = m1（浮點）。
   - 否則 right = m2 - 1（整數）或 right = m2（浮點）。
3. 對整數版本，最後在縮小的區間內枚舉幾個候選點取最大值。

## C++17 模板

```cpp
#include <functional>

// 整數三分求單峰函數最大值的位置
int ternary_search_int(int left, int right, std::function<int(int)> evaluate) {
    while (right - left > 2) {
        const int m1 = left + (right - left) / 3;
        const int m2 = right - (right - left) / 3;
        if (evaluate(m1) < evaluate(m2)) {
            left = m1 + 1;
        } else {
            right = m2 - 1;
        }
    }
    int best = left;
    for (int i = left + 1; i <= right; ++i) {
        if (evaluate(i) > evaluate(best)) {
            best = i;
        }
    }
    return best;
}
```

## 時間與空間複雜度

每次區間縮小為約三分之二，時間 O(log n)。空間 O(1)。

## 常見錯誤與邊界條件

- 整數三分中 m1 與 m2 可能相等，導致死迴圈；可加上 right - left > 2 的終止條件。
- 浮點三分若以 `fabs(right - left) < eps` 終止，eps 選太小可能會多繞很多圈；通常固定迭代 80~100 次更安全。
- 函數並非嚴格單峰（有平台區），三分法仍可能正確，但需在最後小區間完整檢查。

## 與相似技巧的比較

二分法處理真假單調分界；三分法處理大小單峰極值。若可以先對答案二分並驗證可行性，二分法通常更穩定。三分法只在直接評估函數值比較便宜時適用。

## 例題與分級練習

先以拋物線函數熟悉浮點三分，再以整數定義域上的「最小化最大區間和」練習整數三分。進階可研究三分法在多維凸函數上的推廣（如對一維三分、另一維二分）。

## 本節重點速查

確認單峰性才能用三分；整數收斂後要枚舉殘餘區間；浮點建議固定迭代次數而非依賴 eps。
