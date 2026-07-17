---
id: fast-power
volume: lower
source_file: lower-volume
chapter: 6
section: '6.2'
title: 模運算與快速冪
summary: 用二進位拆解指數，在避免溢位與負餘數陷阱下計算模冪。
prerequisites: [binary-representation, modular-arithmetic]
learning_goals: [推導快速冪, 正規化負餘數, 避免乘法溢位]
concepts: [modulo, exponentiation-by-squaring]
complexity:
  time: O(log exponent)
  space: O(1)
related_exercises: []
source_book_pages: [387, 461]
source_pdf_pages: [17, 91]
review_status: verified
visualizer: fast-power
---

## 這個技術解決什麼問題

直接乘 `exponent` 次太慢。快速冪用指數的二進位表示，只需做對數次平方與乘法。

## 辨識題型的訊號

極大指數、模質數運算、矩陣冪、快速套用可結合的轉移。

## 核心想法與直覺

若指數最低位是 1，就把目前底數乘進答案；每輪把底數平方、指數右移。

## 狀態／資料結構定義

維持 `result * base^exponent` 在模意義下等於原始目標。

## 不變量或正確性證明

奇數指數先取出一個 `base`；不論奇偶，剩餘指數除以 2，同時把底數平方，乘積不變。

## 逐步演算法

答案從乘法單位元 1 開始；檢查最低位；平方；右移；直到指數為零。

## C++17 模板

```cpp
#include <cstdint>

std::uint64_t add_mod(
    std::uint64_t left,
    std::uint64_t right,
    std::uint64_t modulus
) {
    return left >= modulus - right ? left - (modulus - right) : left + right;
}

long long multiply_mod(long long left, long long right, long long modulus) {
    std::uint64_t multiplicand = static_cast<std::uint64_t>(left);
    std::uint64_t multiplier = static_cast<std::uint64_t>(right);
    const std::uint64_t unsigned_modulus = static_cast<std::uint64_t>(modulus);
    std::uint64_t result = 0;

    while (multiplier > 0) {
        if ((multiplier & 1U) != 0U) {
            result = add_mod(result, multiplicand, unsigned_modulus);
        }
        multiplier >>= 1U;
        if (multiplier > 0) {
            multiplicand = add_mod(multiplicand, multiplicand, unsigned_modulus);
        }
    }
    return static_cast<long long>(result);
}

long long modular_power(long long base, long long exponent, long long modulus) {
    base %= modulus;
    if (base < 0) {
        base += modulus;
    }
    long long result = 1 % modulus;
    while (exponent > 0) {
        if ((exponent & 1LL) != 0) {
            result = multiply_mod(result, base, modulus);
        }
        base = multiply_mod(base, base, modulus);
        exponent >>= 1;
    }
    return result;
}
```

## 時間與空間複雜度

時間 $O(\log exponent)$，空間 $O(1)$。

## 常見錯誤與邊界條件

模數為 1、底數為負、`long long` 乘法先溢位再取模、把模除法誤當一般除法。

## 與相似技巧的比較

倍增法是同一思想：預處理或逐步建立 $2^k$ 單位的效果。矩陣快速冪只是把乘法換成矩陣乘法。

## 例題與分級練習

先算模冪，再做矩陣 Fibonacci，最後做快速套用置換或線性轉移。

## 本節重點速查

不變量是 `result × base^exponent`；注意乘法中間值；模除法需要逆元。
