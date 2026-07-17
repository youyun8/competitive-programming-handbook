---
id: congruence
volume: lower
source_file: lower-volume
chapter: 6
section: '6.9'
title: 同餘
summary: 解一元線性同餘方程、求模反元素、以中國剩餘定理合併多個同餘式。
prerequisites: [gcd, modular-arithmetic]
learning_goals:
  - 解 ax ≡ b (mod m)
  - 求模反元素與判斷條件
  - 使用中國剩餘定理合併同餘式
concepts: [congruence, modular-inverse, crt]
complexity:
  time: O(log mod) for inverse
  space: O(1)
related_exercises: ['modular-inverse']
source_book_pages: [418, 424]
source_pdf_pages: [48, 54]
review_status: verified
---


## 這個技術解決什麼問題

同餘方程把等價類的操作形式化，能統一處理模下的加法、乘法逆元、多條件合併等問題。

## 辨識題型的訊號

「對某數取模相等」、需要模除法、多個週期條件合併、密碼學中的模運算。

## 核心想法與直覺

`ax ≡ b (mod m)` 轉為 `ax + my = b` 的丟番圖方程。逆元存在的條件是互質；中國剩餘定理把多個兩兩互質的模條件合併為單一解。

## 狀態／資料結構定義

等價類的代表 `[0, m-1]`；逆元 `a^{-1}` 滿足 `a * a^{-1} ≡ 1 (mod m)`。中國剩餘定理維護當前解 `x` 與累積模數 `M`。

## 不變量或正確性證明

裴蜀定理保證 `ax ≡ b (mod m)` 有解若且唯若 `gcd(a,m) | b`。中國剩餘定理保證兩兩互質模數下，模乘積的每個同餘類對應唯一組合。

## 逐步演算法

1. 求 `g = gcd(a, m)`，若 `g ∤ b` 則無解。
2. 同除 `g`，得到 `(a/g)x ≡ (b/g) (mod m/g)`，此時 `a/g` 與 `m/g` 互質。
3. 用擴展gcd求 `a/g` 在模 `m/g` 下的逆元，乘上 `b/g` 得唯一解。
4. 中國剩餘定理逐次合併兩個同餘式，遞迴或迭代皆可。

## C++17 模板

```cpp
#include <cstdint>

long long ex_gcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) { x = 1; y = 0; return a; }
    long long x1 = 0, y1 = 0;
    long long g = ex_gcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

long long mod_inverse(long long a, long long mod) {
    long long x = 0, y = 0;
    long long g = ex_gcd(a, mod, x, y);
    if (g != 1) return -1; // no inverse
    x %= mod;
    if (x < 0) x += mod;
    return x;
}
```

## 時間與空間複雜度

擴展gcd時間 $O(\log \min(a,m))$，空間 $O(1)$（迭代版）。中國剩餘定理合併 k 個模數為 $O(k \log M)$。

## 常見錯誤與邊界條件

未驗證 `gcd==1` 就求逆元；合併非互質模數時需先檢查相容性；`long long` 乘積可能溢位，需 `__int128` 或分拆計算。

## 與相似技巧的比較

費馬小定理求逆元僅適用於質數模；擴展gcd通用但稍慢。CRT 可以擴展到非互質模數，只需逐次檢查相容性。

## 例題與分級練習

初級：求模反元素；中級：解線性同餘、中國剩餘定理；高級：離散對數、模多項式方程。

## 本節重點速查

同餘轉丟番圖；逆元需互質；CRT 合併互不質模數；非互質需檢查相容性。
