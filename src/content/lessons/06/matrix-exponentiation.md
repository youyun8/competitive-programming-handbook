---
id: matrix-exponentiation
volume: lower
source_file: lower-volume
chapter: 6
section: '6.3'
title: 矩陣的應用
summary: 以矩陣快速冣加速線性遞推，並轉換圖論中的路徑計數。
prerequisites: [fast-power, linear-algebra]
learning_goals:
  - 建立矩陣乘法與狀態轉移的對應
  - 實作矩陣快速冪
  - 解線性遞推與路徑長度問題
concepts: [matrix, matrix-power, linear-recurrence]
complexity:
  time: O(n^3 log k) for power; O(n^3) for multiply
  space: O(n^2)
related_exercises: []
source_book_pages: [390, 396]
source_pdf_pages: [20, 26]
review_status: verified
---

## 這個技術解決什麼問題

線性遞推項數增長指數級。把遞推轉成矩陣乘法後，用快速冪在對數次矩陣乘法內求出第 k 項。

## 辨識題型的訊號

線性遞推關係固定、圖中固定長度路徑數、齊次線性轉移方程。

## 核心想法與直覺

把狀態向量看成點，轉移矩陣看成線性變換。重複套用變換等同矩陣冪；快速冪的思想直接移植。

## 狀態／資料結構定義

`n×n` 轉移矩陣 `T`，初始狀態向量 `v`。k 步後狀態為 `T^k * v`。矩陣元素一般取模。

## 不變量或正確性證明

矩陣乘法結合律保證 `T^a * T^b = T^(a+b)`；快速冪分拆指數後乘積不變，與純量快速冪同理。

## 逐步演算法

1. 根據遞推式構造轉移矩陣 `T`。
2. 用快速冪計算 `T^k`（矩陣乘法取代純量乘法）。
3. 將 `T^k` 與初始向量相乘得到結果。

## C++17 模板

```cpp
#include <vector>

using Matrix = std::vector<std::vector<long long>>;

Matrix multiply(const Matrix& a, const Matrix& b, long long mod) {
    const std::size_t n = a.size();
    Matrix result(n, std::vector<long long>(n, 0));
    for (std::size_t i = 0; i < n; ++i) {
        for (std::size_t k = 0; k < n; ++k) {
            if (a[i][k] == 0) { continue; }
            for (std::size_t j = 0; j < n; ++j) {
                result[i][j] = (result[i][j] + a[i][k] * b[k][j]) % mod;
            }
        }
    }
    return result;
}

Matrix matrix_power(Matrix base, long long exponent, long long mod) {
    const std::size_t n = base.size();
    Matrix result(n, std::vector<long long>(n, 0));
    for (std::size_t i = 0; i < n; ++i) { result[i][i] = 1; }

    while (exponent > 0) {
        if (exponent & 1LL) { result = multiply(result, base, mod); }
        base = multiply(base, base, mod);
        exponent >>= 1;
    }
    return result;
}
```

## 時間與空間複雜度

矩陣乘法是 $O(n^3)$；快速冪進行 $O(\log k)$ 次，總時間 $O(n^3 \log k)$，空間 $O(n^2)$。

## 常見錯誤與邊界條件

矩陣維度配錯、單位矩陣不是全 1、遞推式非齊次忘記補常數項、n 過大時 $n^3$ 無法承受。

## 與相似技巧的比較

純量快速冪是特例（1×1 矩陣）；線性遞推也可用特徵方程或生成函數，但矩陣法最通用且易取模。

## 例題與分級練習

初級：Fibonacci 第 n 項；中級：線性汲推係數含多項修正；高級：固定步數圖路徑數、最小環。

## 本節重點速查

遞推轉矩陣；快速冣照搬；複雜度瓶頸在 $n^3$；適合模數環上運算。
