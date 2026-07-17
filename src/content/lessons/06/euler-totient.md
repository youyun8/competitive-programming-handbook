---
id: euler-totient
volume: lower
source_file: lower-volume
chapter: 6
section: '6.13'
title: 歐拉函數
summary: 計算與 n 互質且不大於 n 的正整數個數，以積性公式與線性篩高效求解。
prerequisites: [prime-numbers, multiplicative-function]
learning_goals:
  - 理解歐拉函數的定義與積性
  - 掌握通解公式與線性篩實作
  - 應用於模運算與計數問題
concepts: [euler-totient, totient, linear-sieve]
complexity:
  time: O(n log log n) or O(n) with linear sieve
  space: O(n)
related_exercises: []
source_book_pages: [437, 442]
source_pdf_pages: [67, 72]
review_status: verified
---

## 這個技術解決什麼問題

`φ(n)` 與模 n 乘法群的階數相關，是 Euler 定理與密碼學（如 RSA）的核心數論量。

## 辨識題型的訊號

「與 n 互質的數有幾個」、Euler 定理求冪次、需要縮小指數、循環群的生成元個數。

## 核心想法與直覺

質數 p 的倍數都不與 p 互質，去掉它們後剩 `1 - 1/p` 的比例。由積性，各質因數的比例相乘即得 φ(n)。

## 狀態／資料結構定義

利用質因數分解：若 `n = Π p_i^k_i`，則 `φ(n) = n * Π (1 - 1/p_i)`。線性篩維護 `phi[i]`。

## 不變量或正確性證明

對質冪 `p^k`，不互質的有 `p^(k-1)` 個倍數，故 `φ(p^k) = p^k - p^(k-1) = p^k(1-1/p)`。由積性推廣到一般 n。線性篩的轉移正確維護此性質。

## 逐步演算法

單次：質因數分解後乘公式。批量：線性篩，`phi[i*p] = phi[i] * (p-1)` 若 `p ∤ i`，否則 `phi[i*p] = phi[i] * p`。

## C++17 模板

```cpp
#include <vector>

long long euler_totient(long long n) {
    long long result = n;
    for (long long p = 2; p * p <= n; ++p) {
        if (n % p == 0) {
            while (n % p == 0) { n /= p; }
            result -= result / p;
        }
    }
    if (n > 1) { result -= result / n; }
    return result;
}

std::vector<int> totient_sieve(int n) {
    std::vector<int> phi(n + 1);
    for (int i = 0; i <= n; ++i) { phi[i] = i; }
    for (int i = 2; i <= n; ++i) {
        if (phi[i] == i) {
            for (int j = i; j <= n; j += i) {
                phi[j] -= phi[j] / i;
            }
        }
    }
    return phi;
}
```

## 時間與空間複雜度

單次分解 $O(\sqrt n)$；埃氏篩 $O(n \log \log n)$；線性篩 $O(n)$ 時間與 $O(n)$ 空間。

## 常見錯誤與邊界條件

`φ(1) = 1`；質因數分解後若 n>1 還要再除一次；線性篩的整除分支公式與不整除分支不同。

## 與相似技巧的比較

因數個數同樣積性但公式不同；Möbius 函數是更精細的容斥工具；Euler 定理是費馬小定理在非質數模的推廣。

## 例題與分級練習

初級：求 φ(n)；中級：線性篩批量求 φ；高級：GCD 求和、利用 φ 優化數論分塊。

## 本節重點速查

φ(p^k)=p^k-p^(k-1)；積性可篩；φ(1)=1；Euler 定理降冪次。
