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
related_exercises: ['modular-power']
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

## 教材經典例題與 C++ 解答

以下例題對應本章教材的快速冪與擴展歐幾里得主題。題意皆為本站重新敘述，程式為獨立撰寫、可直接編譯的 C++17，讀完即得完整解法。

### 例題一：模快速冪

計算 `base^exponent mod modulus`，並容許負底數。快速冪維持不變量「已累積答案 × 剩餘基底效果」：指數為奇數時把當前基底乘入答案，之後基底平方、指數右移。中間乘積可能溢位，這裡用逐位相加的 `multiply_mod` 取代 `__int128`，時間 O(log exponent)。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 位元加法版的模乘，避免中間值溢位（不依賴 __int128）。
static long long multiply_mod(long long left, long long right, long long modulus) {
    unsigned long long a = static_cast<unsigned long long>(left % modulus);
    unsigned long long b = static_cast<unsigned long long>(right % modulus);
    unsigned long long m = static_cast<unsigned long long>(modulus);
    unsigned long long result = 0;
    while (b > 0) {
        if ((b & 1ULL) != 0ULL) result = (result + a) % m;
        a = (a + a) % m;
        b >>= 1ULL;
    }
    return static_cast<long long>(result);
}

// 模快速冪：計算 base^exponent mod modulus，支援負底數。
static long long modular_power(long long base, long long exponent, long long modulus) {
    long long result = 1 % modulus;
    base %= modulus;
    if (base < 0) base += modulus;
    while (exponent > 0) {
        if ((exponent & 1LL) != 0) result = multiply_mod(result, base, modulus);
        base = multiply_mod(base, base, modulus);
        exponent >>= 1;
    }
    return result;
}

int main() {
    long long base, exponent, modulus;
    if (!(cin >> base >> exponent >> modulus)) return 0;
    cout << modular_power(base, exponent, modulus) << '\n';
    return 0;
}
```

輸入 `2 10 1000000007` 得 `1024`；輸入 `-2 3 1000` 得 `992`（即 -8 對 1000 取模後的非負值）。

### 例題二：擴展歐幾里得與線性同餘

解一次同餘方程 `a·x ≡ b (mod m)`。把它改寫成 `a·x + m·y = b`，用擴展歐幾里得求 `g = gcd(a, m)` 與一組係數：若 `g` 不整除 `b` 則無解，否則縮放係數並對 `m/g` 正規化，得到最小非負解。時間 O(log min(a, m))。

```cpp
#include <bits/stdc++.h>
using namespace std;

// 擴展歐幾里得：回傳 gcd(a,b) 並求出 a*x + b*y = gcd 的一組係數。
static long long extended_gcd(long long a, long long b, long long& x, long long& y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    long long x1, y1;
    long long g = extended_gcd(b, a % b, x1, y1);
    x = y1;
    y = x1 - (a / b) * y1;
    return g;
}

// 解 a*x ≡ b (mod m)，回傳最小非負解或回報無解。
int main() {
    long long a, b, m;
    if (!(cin >> a >> b >> m)) return 0;
    long long x, y;
    long long g = extended_gcd(a, m, x, y);
    if (b % g != 0) {
        cout << "no solution\n";
        return 0;
    }
    long long modulus = m / g;
    long long solution = ((x * (b / g)) % modulus + modulus) % modulus;
    cout << solution << '\n';
    return 0;
}
```

`14·x ≡ 30 (mod 100)`：`gcd(14,100)=2` 整除 30，最小非負解為 `45`。而 `2·x ≡ 3 (mod 4)` 因 `gcd(2,4)=2` 不整除 3，輸出 `no solution`。

## 本節重點速查

不變量是 `result × base^exponent`；注意乘法中間值；模除法需要逆元。
