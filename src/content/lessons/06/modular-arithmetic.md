---
id: modular-arithmetic
volume: lower
source_file: lower-volume
chapter: 6
section: '6.1'
title: 模運算
summary: 在有限環上進行加減乘，學會負數正規化與溢位防護。
prerequisites: [integers]
learning_goals:
  - 掌握模運算的基本性質
  - 正確處理負數取模
  - 避免中間乘積溢位
concepts: [modulo, overflow, normalization]
complexity:
  time: O(1) per op
  space: O(1)
related_exercises: []
source_book_pages: [387, 389]
source_pdf_pages: [17, 19]
review_status: verified
---

## 這個技術解決什麼問題

整數範圍有限，直接計算大數會溢位。模運算把結果限制在 `[0, mod-1]`，確保每一步中間值都安全。

## 辨識題型的訊號

題目要求「答案對 10^9+7 取模」、負數結果、大階乘、冪次動輒上億。

## 核心想法與直覺

模是「同餘類」的代表。加減乘都可在每一步取模，保持等價性；除法需要逆元，不可直接做。

## 狀態／資料結構定義

所有變數都維持正規化：整數 `x` 存成 `((x % mod) + mod) % mod`，落在 `[0, mod-1]`。

## 不變量或正確性證明

若 `a ≡ b (mod m)` 且 `c ≡ d (mod m)`，則 `a+c ≡ b+d`、`a-c ≡ b-d`、`ac ≡ bd (mod m)`。逐步取模不影響最終同餘類。

## 逐步演算法

1. 讀入運算元與模數 `mod`。
2. 把每個運算元正規化到 `[0, mod-1]`。
3. 進行加法或減法後，若超出範圍則加減一次 `mod`。
4. 乘法若可能溢位，改用 `__int128` 或倍增取模。

## C++17 模板

```cpp
#include <cstdint>

long long normalize(long long x, long long mod) {
    x %= mod;
    if (x < 0) x += mod;
    return x;
}

long long add_mod(long long a, long long b, long long mod) {
    a = normalize(a, mod);
    b = normalize(b, mod);
    long long sum = a + b;
    if (sum >= mod) sum -= mod;
    return sum;
}

long long sub_mod(long long a, long long b, long long mod) {
    a = normalize(a, mod);
    b = normalize(b, mod);
    long long diff = a - b;
    if (diff < 0) diff += mod;
    return diff;
}

long long mul_mod(long long a, long long b, long long mod) {
    a = normalize(a, mod);
    b = normalize(b, mod);
    return static_cast<long long>(
        (static_cast<__int128>(a) * b) % mod
    );
}
```

## 時間與空間複雜度

每次基本運算時間 $O(1)$，空間 $O(1)$。

## 常見錯誤與邊界條件

在 C++ 中 `%` 對負數可能產生負餘數；`long long` 兩數相乘先溢位再取模會錯；把模運算當成「變小一點」而非同餘類會導致除法誤用。

## 與相似技巧的比較

模運算是快速冪與線性代數的共同基礎；與浮點數取整不同，模運算保持整數的精確同餘關係。

## 例題與分級練習

初級：兩數相加取模；中級：大數階乘連乘取模；高級：模矩陣乘法。

## 本節重點速查

同餘類不變；負數要先正規化；乘法用 `__int128` 防溢位；模下沒有普通除法。
