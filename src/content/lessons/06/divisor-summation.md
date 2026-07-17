---
id: divisor-summation
volume: lower
source_file: lower-volume
chapter: 6
section: '6.14'
title: 整除分塊
summary: 利用 floor(n/i) 在連續區間內恆定的性質，以 O(√n) 時間加速數論求和。
prerequisites: [number-theory]
learning_goals:
  - 掌握 floor(n/i) 的分段性質
  - 應用於因數和、GCD 求和等問題
  - 推廣到多變數情形
concepts: [divisor-block, floor-summation]
complexity:
  time: O(√n)
  space: O(1)
related_exercises: []
source_book_pages: [442, 446]
source_pdf_pages: [72, 76]
review_status: verified
---

## 這個技術解決什麼問題

直接枚舉 1~n 太慢。`⌊n/i⌋` 的值只變動 O(√n) 次，相同值的 i 形成連續區間，可整塊處理。

## 辨識題型的訊號

求 `Σ floor(n/i)`、`Σ d(i)`（因數個數和）、需要對除法結果進行區間批量操作的數論求和。

## 核心想法與直覺

對於固定的 `n`，`floor(n/i)` 從 1 開始逐漸遞減。當 `i <= √n` 時，值大但變化快；當 `i > √n` 時，`floor(n/i)` 只取 `O(√n)` 個不同的小值。兩側對稱，整塊跳過相同值的區間。

## 狀態／資料結構定義

區間 `[l, r]` 滿足 `floor(n/l) = floor(n/r) = v`，則 `r = floor(n/v)`。每次從 `l` 跳到 `r+1`。

## 不變量或正確性證明

對任意 `i`，設 `v = floor(n/i)`，則所有滿足 `floor(n/j) = v` 的 `j` 落在 `⌊n/(v+1)⌋+1` 到 `⌊n/v⌋`。區間長度為 `r-l+1`，每塊貢獻 `v * (r-l+1)`。

## 逐步演算法

1. `l = 1`。
2. 當 `l <= n`，計算 `v = n / l`，`r = n / v`。
3. 該塊貢獻為 `v * (r - l + 1)`。
4. 令 `l = r + 1`，重複。

## C++17 模板

```cpp
#include <cstdint>

long long divisor_block_sum(long long n) {
    long long result = 0;
    long long l = 1;
    while (l <= n) {
        long long v = n / l;
        long long r = n / v;
        result += v * (r - l + 1);
        l = r + 1;
    }
    return result;
}
```

## 時間與空間複雜度

區間數量為 $O(\sqrt n)$，時間 $O(\sqrt n)$，空間 $O(1)$。

## 常見錯誤與邊界條件

`l` 與 `r` 的計算整數除法方向；`n=0` 需特判；多維情形下的推廣要小心複合同步。

## 與相似技巧的比較

與杜教篩結合可處理前綴和預處理；與線性篩的關係是「單點快」vs「批量預處理」。整除分塊在精確計算單次求和時非常高效。

## 例題與分級練習

初級：求 `Σ floor(n/i)`；中級：因數個數和、因數和；高級：二元 GCD 求和、多維整除分塊。

## 本節重點速查

floor(n/i) 只變 O(√n) 次；r = n / v 找右端點；整塊處理加速枚舉；常數空間優雅簡潔。
