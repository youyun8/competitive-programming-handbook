---
id: wilson-theorem
volume: lower
source_file: lower-volume
chapter: 6
section: '6.11'
title: 威爾遜定理
summary: 以 (p-1)! ≡ -1 (mod p) 為質數判別工具，並探討階乘模質數的性質。
prerequisites: [prime-numbers, modular-arithmetic]
learning_goals:
  - 理解與證明威爾遜定理
  - 應用於模質數的階乘性質
  - 判斷質數的充要條件
concepts: [wilson-theorem, factorial-modulo]
complexity:
  time: O(p) for factorial mod p
  space: O(1)
related_exercises: []
source_book_pages: [430, 433]
source_pdf_pages: [60, 63]
review_status: verified
---

## 這個技術解決什麼問題

威爾遜定理提供一個判斷質數的充要條件，也揭示了模質數下階乘的對稱結構。

## 辨識題型的訊號

模質數的階乘性質、判斷質數的理論題、與模逆元配對相關的組合問題。

## 核心想法與直覺

對質數 p，1 到 p-1 的每個數都有唯一模 p 逆元，除了 1 和 p-1 自逆。因此所有數兩兩配對乘積為 1，只剩下 1 與 p-1，總乘積為 p-1 ≡ -1。

## 狀態／資料結構定義

無特殊結構，計算 `(p-1)! mod p` 即可。

## 不變量或正確性證明

在模 p 乘法群（p 質數）中，每個元素都有唯一逆元。`x^2 ≡ 1 (mod p)` 的解僅有 `x ≡ ±1`，其餘元素可兩兩配對使乘積為 1。移除配對後只剩 1 與 p-1，故 `(p-1)! ≡ -1 (mod p)`。

## 逐步演算法

1. 計算 `fact = 1`。
2. 對 `i` 從 2 到 `p-1`，`fact = (fact * i) % p`。
3. 若 `fact == p-1`（即 `-1 mod p`），則 p 為質數。

## C++17 模板

```cpp
bool wilson_test(long long p) {
    if (p <= 1) return false;
    long long fact = 1;
    for (long long i = 2; i < p; ++i) {
        fact = (fact * i) % p;
    }
    return fact == p - 1;
}
```

## 時間與空間複雜度

計算階乘需 $O(p)$ 時間，$O(1)$ 額外空間。對大質數不實用，主要為理論價值。

## 常見錯誤與邊界條件

定理僅對質數成立，反向也成立但計算昂貴；p=2 時 (2-1)! = 1 ≡ -1 (mod 2) 成立；注意溢位需隨時取模。

## 與相似技巧的比較

威爾遜是充要條件但計算慢；費馬小定理是必要條件但偽質數會騙過；Miller-Rabin 是高效機率性測試。

## 例題與分級練習

初級：驗證小質數的威爾遜定理；中級：利用配對性質求模質數的階乘中間值；高級：與組合數模質數結合（Lucas 定理）。

## 本節重點速查

(p-1)! ≡ -1 (mod p) 是質數的充要條件；證明關鍵在於自逆元僅有 ±1；實務中多用於理論推導。
