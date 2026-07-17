---
id: gcd-lcm
volume: lower
source_file: lower-volume
chapter: 6
section: '6.7'
title: GCD 與 LCM
summary: 歐幾里得演算法求最大公因數，推導最小公倍數與裴蜀定理，掌握互質相關性質。
prerequisites: [integers]
learning_goals:
  - 熟練歐幾里得演算法
  - 理解 LCM 與 GCD 的關係
  - 應用裴蜀定理判斷整數解存在性
concepts: [gcd, lcm, euclidean-algorithm]
complexity:
  time: O(log min(a,b))
  space: O(1)
related_exercises: []
source_book_pages: [410, 414]
source_pdf_pages: [40, 44]
review_status: verified
---

## 這個技術解決什麼問題

兩個整數的最大公因數（GCD）是許多數論問題的入口。歐幾里得演算法以取餘數的方式快速縮小問題規模，遠快於質因數分解。

## 辨識題型的訊號

求最大公因數、最小公倍數、化簡分數、判斷兩數是否互質、線性丟番圖方程有無整數解。

## 核心想法與直覺

`gcd(a,b) = gcd(b, a mod b)`。餘數一定比除數小，所以數值會指數級下降，類似 Fibonacci 的最壞情況也僅需 $O(\log \min(a,b))$ 步。

## 狀態／資料結構定義

兩個變數 `a, b`，每次迭代更新為 `(b, a % b)`，直到 `b=0`。LCM 由 `a / gcd * b` 計算，先做除法防溢位。

## 不變量或正確性證明

`d|a` 且 `d|b` 若且唯若 `d|b` 且 `d|(a mod b)`，因此 `gcd(a,b)` 與 `gcd(b, a mod b)` 擁有完全相同的公因數集合，最大公因數相等。

## 逐步演算法

1. 若 `b == 0`，回傳 `a`。
2. 遞迴或迴圈計算 `gcd(b, a % b)`。
3. LCM 計算為 `std::abs(a / gcd * b)` 避免中間溢位。

## C++17 模板

```cpp
#include <cstdlib>

long long gcd(long long a, long long b) {
    while (b != 0) {
        long long temp = a % b;
        a = b;
        b = temp;
    }
    return std::abs(a);
}

long long lcm(long long a, long long b) {
    if (a == 0 || b == 0) { return 0; }
    return std::abs(a / gcd(a, b) * b);
}
```

## 時間與空間複雜度

時間 $O(\log \min(a,b))$，迭代版本空間 $O(1)$。最壞情況對應連續 Fibonacci 數。

## 常見錯誤與邊界條件

LCM 先除再乘防溢位；負數需取絕對值；`a % b` 在 `b` 為負時需小心。裴蜀定理說 `ax+by=c` 有整數解若且唯若 `gcd(a,b)|c`。

## 與相似技巧的比較

輾轉相除法比質因數分解快得多；擴展gcd多出係數資訊；LCM 與 GCD 的關係由包含排除原理保證：`gcd(a,b) * lcm(a,b) = |a*b|`。

## 例題與分級練習

初級：求多數 gcd 與 lcm；中級：線性丟番圖最小正整數解；高級：g = 1 時的性質、互質集合計數。

## 本節重點速查

輾轉相除縮規模；LCM 先除再乘；裴蜀定理判可解性；互質是數論的黃金條件。
